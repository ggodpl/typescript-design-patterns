interface Request {
    path: string;
    body: string;
}

interface LegacyRequestHandler {
    process(path: string, body: string): void;
}

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
        this.executeModernRequest(request, modernAPI);
        
        const legacyAPI = new LegacyAPI();
        const legacyAPIAdapter = new LegacyRequestHandlerAdapter(legacyAPI);
        this.executeModernRequest(request, legacyAPIAdapter);
    }
}

const client = new AdapterClient();
client.execute();