type Token = string | symbol;

class Container {
    // Holds all dependendy registrations, including their factories and instances for singletons
    // The factory is a function that takes a container so we can easily resolve any needed dependencies
    private registrations: Map<Token, {
        singleton: boolean;
        factory: (c: Container) => any;
        instance?: any;
    }> = new Map();

    // Creates a new singleton registration
    singleton<T>(
        token: Token,
        factory: (c: Container) => T
    ) {
        this.registrations.set(token, {
            singleton: true,
            factory
        });
    }

    // Creates a new transient (created every time) registration
    transient<T>(
        token: Token,
        factory: (c: Container) => T
    ) {
        this.registrations.set(token, {
            singleton: false,
            factory
        });
    }

    // Finds a registration based on the token
    resolve<T>(token: Token): T {
        const registration = this.registrations.get(token);

        if (registration === undefined) throw new Error('Registration not found');

        // If the registration is a singleton...
        if (registration.singleton) {
            // ...and it doesn't have an instance yet...
            if (registration.instance === undefined) {
                // ...we create a new instance (lazy initialization)
                registration.instance = registration.factory(this);
            }

            return registration.instance;
        }

        // Otherwise we create a new instance (the transient case)
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
// We register the ConsoleLogger class under the TOKENS.Logger token
container.singleton(TOKENS.Logger, () => new ConsoleLogger());
// And now we can use it when creating a new user service
// The service does not know or care how the Logger is supplied
container.transient(TOKENS.UserService, (c: Container) => new UserService(c.resolve<Logger>(TOKENS.Logger)));

const userService = container.resolve<UserService>(TOKENS.UserService);
userService.createUser('john123');