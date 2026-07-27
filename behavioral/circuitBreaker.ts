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
        if (this.state === CircuitBreakerState.Open) {
            if (Date.now() - this.lastFailure >= this.recoveryTimeout) {
                console.log('Half-opening');
                this.state = CircuitBreakerState.HalfOpen;
            } else {
                return false;
            }
        }

        const requestSuccessful = this.service.handle(request);
        if (requestSuccessful) {
            this.failures = 0;
            this.state = CircuitBreakerState.Closed;
        
            return true;
        }
        
        this.failures++;
        this.lastFailure = Date.now();

        if (this.failures >= this.failureThreshold || this.state === CircuitBreakerState.HalfOpen) {
            console.log('Opening');
            this.state = CircuitBreakerState.Open;
        }

        return false;
    }

    logState() {
        console.log(`Current circuit breaker state: ${CircuitBreakerState[this.state]}`);
    }
}

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
service.shouldFail = false;
await new Promise((resolve) => setTimeout(resolve, 200));
circuitBreaker.handle('test');
circuitBreaker.logState(); // Closed