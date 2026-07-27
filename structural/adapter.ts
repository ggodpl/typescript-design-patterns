interface Request {
    path: string;
    body: string;
}

// If we have multiple APIs...
interface LegacyRequestHandler {
    process(path: string, body: string): void;
}

// ...that are incompatible with each other...
interface RequestHandler {
    handle(request: Request): void;
}

class LegacyAPI implements LegacyRequestHandler {
    process(path: string, body: string) {
        console.log(`Processing a request at path: ${path} with body: ${body}`);
    }
}

class ModernAPI implements RequestHandler {
    handle(request: Request) {
        console.log(`Handling request at path: ${request.path} with body: ${request.body}`);
    }
}

// ...we can create an adapter which translates from one to the other
class LegacyRequestHandlerAdapter implements RequestHandler {
    constructor (private legacyAPI: LegacyRequestHandler) {}
    
    handle(request: Request) {
        this.legacyAPI.process(request.path, request.body);
    }
}

class AdapterClient {
    executeModernRequest(request: Request, requestHandler: RequestHandler) {
        requestHandler.handle(request);
    }

    execute() {
        const request: Request = {
            path: '/',
            body: 'This is a demo request'
        }

        const modernAPI = new ModernAPI();
        // This approach allows us to use both...
        this.executeModernRequest(request, modernAPI);
        
        const legacyAPI = new LegacyAPI();
        const legacyAPIAdapter = new LegacyRequestHandlerAdapter(legacyAPI);
        // ...even if one is incompatible with our client
        this.executeModernRequest(request, legacyAPIAdapter);
    }
}

const client = new AdapterClient();
client.execute();