type Token = string | symbol;

class Container {
    private registrations: Map<Token, {
        singleton: boolean;
        factory: (c: Container) => any;
        instance?: any;
    }> = new Map();

    singleton<T>(
        token: Token,
        factory: (c: Container) => T
    ) {
        this.registrations.set(token, {
            singleton: true,
            factory
        });
    }

    transient<T>(
        token: Token,
        factory: (c: Container) => T
    ) {
        this.registrations.set(token, {
            singleton: false,
            factory
        });
    }

    resolve<T>(token: Token): T {
        const registration = this.registrations.get(token);

        if (registration === undefined) throw new Error('Registration not found');

        if (registration.singleton) {
            if (registration.instance === undefined) {
                registration.instance = registration.factory(this);
            }

            return registration.instance;
        }

        return registration.factory(this);
    }
}

interface Logger {
    log(message: string): void;
}

class ConsoleLogger implements Logger {
    log(message: string) {
        console.log(message);
    }
}

class UserService {
    constructor (private logger: Logger) {}

    createUser(username: string) {
        this.logger.log(`Creating a user with username ${username}`);
    }
}

const TOKENS = {
    Logger: Symbol('Logger'),
    UserService: Symbol('UserService')
};

const container = new Container();
container.singleton(TOKENS.Logger, () => new ConsoleLogger());
container.transient(TOKENS.UserService, (c: Container) => new UserService(c.resolve<Logger>(TOKENS.Logger)));

const userService = container.resolve<UserService>(TOKENS.UserService);
userService.createUser('john123');