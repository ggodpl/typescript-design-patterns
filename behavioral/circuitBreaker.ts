enum CircuitBreakerState {
    Open,
    HalfOpen,
    Closed
}

interface Service {
    handle(request: string): boolean;
}

class CircuitBreaker {
    private state: CircuitBreakerState = CircuitBreakerState.Closed;
    private failures: number = 0;
    private lastFailure: number = -1;
    
    constructor (
        private readonly service: Service,
        private readonly failureThreshold: number = 2,
        private readonly recoveryTimeout: number = 100
    ) {}

    handle(request: string): boolean {
        // If the circuit breaker is currently open...
        if (this.state === CircuitBreakerState.Open) {
            // ...and last failure happened a while ago...
            if (Date.now() - this.lastFailure >= this.recoveryTimeout) {
                // ...we half-open it to check if the service is still broken
                console.log('Half-opening');
                this.state = CircuitBreakerState.HalfOpen;
            } else {
                // Otherwise, we simply fail-fast to avoid unnecessary service calls
                return false;
            }
        }

        // We try to make a request
        // Normally this should be done in a try-catch,
        // but this example uses a boolean to indicate whether 
        // the request failed for simplicity
        const requestSuccessful = this.service.handle(request);
        if (requestSuccessful) {
            // If the request was successful, we just close the circuit breaker
            // and reset the failures
            this.failures = 0;
            this.state = CircuitBreakerState.Closed;
        
            return true;
        }
        
        // Otherwise, the request was not successful
        // We increase the amount of failures and set the last failure to now
        this.failures++;
        this.lastFailure = Date.now();

        // If the amount of failures surpasses the failure threshold
        // Or the failure happened during our half-open state 
        // (which is supposed to check whether the service is STILL broken) 
        if (this.failures >= this.failureThreshold || this.state === CircuitBreakerState.HalfOpen) {
            // We open the circuit breaker, because the service is clearly still not operational
            console.log('Opening');
            this.state = CircuitBreakerState.Open;
        }

        // Otherwise, we just fail and leave the state as it is
        return false;
    }

    logState() {
        console.log(`Current circuit breaker state: ${CircuitBreakerState[this.state]}`);
    }
}

// This fake service will record the amount of calls
// And will allow us to tell it when to fail 
class ExampleService implements Service {
    public calls: number = 0;
    public shouldFail: boolean = false;

    constructor () {}
    
    handle(_: string): boolean {
        this.calls++;

        return !this.shouldFail;
    }
}

const service = new ExampleService();
const circuitBreaker = new CircuitBreaker(service);

circuitBreaker.handle('test');
circuitBreaker.handle('test');
console.log(service.calls); // Both calls go through
// Service will now start failing
service.shouldFail = true;
circuitBreaker.handle('test'); // Failure
circuitBreaker.logState(); // Still closed
circuitBreaker.handle('test'); // Failure, threshold met
circuitBreaker.logState(); // Open
console.log(service.calls); // All 4 calls went through so far
circuitBreaker.handle('test');
console.log(service.calls); // The last call did not go through
await new Promise((resolve) => setTimeout(resolve, 200));
circuitBreaker.handle('test');
console.log(service.calls); // The call went through after the timeout
// And the service is back online
service.shouldFail = false;
await new Promise((resolve) => setTimeout(resolve, 200));
circuitBreaker.handle('test');
circuitBreaker.logState(); // Closed