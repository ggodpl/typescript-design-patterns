type Middleware<Req, Res> = (request: Req, response: Res, next: () => void) => void;

class Client<Req, Res> {
    constructor (private middlewares: Middleware<Req, Res>[]) {}

    handle(request: Req, response: Res) {
        let index = -1;

        const dispatch = (i: number) => {
            if (i <= index) throw new Error('next() called multiple times');

            index = i;

            const middleware = this.middlewares[i];

            if (!middleware) return;

            middleware(request, response, () => dispatch(i + 1));
        }

        dispatch(0);
    }
}

interface Request {
    user?: string;
    url?: string;
    authenticated?: boolean;
}

interface Response {
    status?: number;
}

const authMiddleware: Middleware<Request, Response> = (request, response, next) => {
    console.log('Authenticating user');
    if (request.user) {
        console.log('User authenticated successfully');
        request.authenticated = true;
        return next();
    }

    console.log('User is not authenticated');

    request.authenticated = false;
    response.status = 401;
}

const loggingMiddleware: Middleware<Request, Response> = (request, response, next) => {
    console.log('Before response. URL: ' + request.url);

    next();

    console.log('After response. Status: ' + response.status);
}

const terminalMiddleware: Middleware<Request, Response> = (request, response, next) => {
    console.log('Hello, world!');
    if (request.url === '/home') {
        response.status = 200;
    } else {
        response.status = 404;
    }
}

const client = new Client<Request, Response>([
    authMiddleware,
    loggingMiddleware,
    terminalMiddleware
]);

client.handle({
    url: '/admin',
}, {});

client.handle({
    user: 'test',
    url: '/admin'
}, {});

client.handle({
    user: 'test',
    url: '/home'
}, {});