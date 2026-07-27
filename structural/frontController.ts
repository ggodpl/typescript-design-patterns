interface Handler {
    handle(): void;
}

// If we have a system...
class HandlerA implements Handler {
    handle() {
        console.log('Handler A executed');
    }
}

// ...that has multiple different handlers...
class HandlerB implements Handler {
    handle() {
        console.log('Handler B executed');
    }
}

class Dispatcher {
    private handlerA: Handler = new HandlerA();
    private handlerB: Handler = new HandlerB();

    // ...we can create a dispatcher, which chooses the path...
    dispatch(request: string) {
        if (request === 'a') {
            this.handlerA.handle();
        } else if (request === 'b') {
            this.handlerB.handle();
        } else {
            console.log('Invalid request');
        }
    }
}

// ...and a front controller, which centralizes requests...
class FrontController {
    constructor (private dispatcher: Dispatcher) {}
    
    private isAuthenticated(): boolean {
        console.log('Authenticating user')
        return true;
    }

    private trackRequest(request: string) {
        console.log('Requested resource: ' + request);
    }

    // ...and can perform additional actions on every request
    dispatchRequest(request: string) {
        this.trackRequest(request);

        if (this.isAuthenticated()) {
            this.dispatcher.dispatch(request);
        }
    }
}

const dispatcher = new Dispatcher();
const controller = new FrontController(dispatcher);
controller.dispatchRequest('a');
controller.dispatchRequest('b');
controller.dispatchRequest('c');