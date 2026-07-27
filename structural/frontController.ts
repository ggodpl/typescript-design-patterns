interface Handler {
    handle(): void;
}

class HandlerA implements Handler {
    handle() {
        console.log('Handler A executed');
    }
}

class HandlerB implements Handler {
    handle() {
        console.log('Handler B executed');
    }
}

class Dispatcher {
    private handlerA: Handler = new HandlerA();
    private handlerB: Handler = new HandlerB();

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

class FrontController {
    constructor (private dispatcher: Dispatcher) {}
    
    private isAuthenticated(): boolean {
        console.log('Authenticating user')
        return true;
    }

    private trackRequest(request: string) {
        console.log('Requested resource: ' + request);
    }

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