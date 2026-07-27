interface ChainedHandler {
    handle(request: Request): void;
    setNextHandler(handler: ChainedHandler): ChainedHandler;
    next(request: Request): void;
}

enum RequestLevel {
    Basic,
    Intermediate,
    Critical
}

class Request {
    constructor (public level: RequestLevel) {}
}

abstract class Handler implements ChainedHandler {
    protected nextHandler?: ChainedHandler;

    setNextHandler(handler: ChainedHandler) {
        this.nextHandler = handler;
        return handler;
    }

    abstract handle(request: Request): void;

    next(request: Request) {
        if (this.nextHandler) {
            this.nextHandler.handle(request);
        } else {
            console.log('Request cannot be handled');
        }
    }
}

class Tier1Handler extends Handler {
    handle(request: Request) {
        if (request.level === RequestLevel.Basic) {
            console.log('Request handled by tier 1 handler');
            return;
        }

        this.next(request);
    }
}

class Tier2Handler extends Handler {
    handle(request: Request) {
        if (request.level === RequestLevel.Intermediate) {
            console.log('Request handled by tier 2 handler');
            return;
        }
        
        this.next(request);
    }
}

class Tier3Handler extends Handler {
    handle(request: Request) {
        if (request.level === RequestLevel.Critical) {
            console.log('Request handled by tier 3 handler');
            return;
        }

        this.next(request);
    }
}

const tier1 = new Tier1Handler();
const tier2 = new Tier2Handler();
const tier3 = new Tier3Handler();

tier1
    .setNextHandler(tier2)
    .setNextHandler(tier3);

tier1.handle(new Request(RequestLevel.Basic));
tier1.handle(new Request(RequestLevel.Intermediate));
tier1.handle(new Request(RequestLevel.Critical));