interface Service {
    request(): boolean;
}

// This service always fails (returns false on request) to demonstrate an unreachable API
class FailingService implements Service {
    request(): boolean {
        return false;
    }
}

class RetryClient {
    private readonly RETRY_LIMIT = 5;
    private failedRequests: number = 0;

    constructor (private service: Service) {}

    // Jitter prevents the service from being called at equal intervals,
    // preventing request spikes (for furthering reading, this is known as the "thundering herd" problem)
    private jitter() {
        return Math.floor(Math.random() * 100);
    }

    // Exponential back-off means that the service will be called 
    // less and less frequently as it keeps failing
    // Production codebases may also use linear back-off or more complicated strategies
    private backoff() {
        return 100 * (2 ** (this.failedRequests - 1));
    }

    tryRequest() {
        if (this.service.request()) {
            console.log('Request succeeded');
            // If the call went through successfully, we reset the attempts counter
            this.failedRequests = 0;
        } else {
            console.log('Request failed');
            // Otherwise, we increase the failed request...
            this.failedRequests++;
            if (this.failedRequests >= this.RETRY_LIMIT) {
                // ...and if they surpass the retry limit...
                console.log('All retry attempts failed, aborting');
                // ...we reset the counter...
                this.failedRequests = 0;
                // ...and abort the request
                return;
            }
            const backoff = this.backoff(); // Exponential back-off
            const jitter = this.jitter(); // Random jitter
            const delay = backoff + jitter; // Actual delay
            console.log(`Retrying in ${delay}ms with backoff ${backoff}ms and jitter ${jitter}ms`);
            // The request is retried after the delay
            setTimeout(this.tryRequest.bind(this), delay);
        }
    }
}

const service = new FailingService();
const client = new RetryClient(service);

client.tryRequest();