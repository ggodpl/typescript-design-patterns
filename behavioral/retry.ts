interface Service {
    request(): boolean;
}

class FailingService implements Service {
    request(): boolean {
        return false;
    }
}

class RetryClient {
    private readonly RETRY_LIMIT = 5;
    private failedRequests: number = 0;

    constructor (private service: Service) {}

    private jitter() {
        return Math.floor(Math.random() * 100);
    }

    private backoff() {
        return 100 * (2 ** (this.failedRequests - 1));
    }

    tryRequest() {
        if (this.service.request()) {
            console.log('Request succeeded');
            this.failedRequests = 0;
        } else {
            console.log('Request failed');
            this.failedRequests++;
            if (this.failedRequests >= this.RETRY_LIMIT) {
                console.log('All retry attempts failed, aborting');
                this.failedRequests = 0;
                return;
            }
            const backoff = this.backoff();
            const jitter = this.jitter();
            const delay = backoff + jitter;
            console.log(`Retrying in ${delay}ms with backoff ${backoff}ms and jitter ${jitter}ms`);
            setTimeout(this.tryRequest.bind(this), delay);
        }
    }
}

const service = new FailingService();
const client = new RetryClient(service);

client.tryRequest();