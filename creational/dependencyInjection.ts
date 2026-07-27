interface Logger {
    log(message: string): void;
}

class ConsoleLogger implements Logger {
    log(message: string) {
        console.log(message);
    }
}

class UserService {
    // Services declare the dependencies they need as parameters in their constructor
    // Using abstract interfaces of those dependencies
    // This way the user service does not know or care what logger is provided...
    constructor (private logger: Logger) {}

    createUser(username: string) {
        // ...as long as it can log
        this.logger.log(`Creating a user with username ${username}`);
    }
}

// This is helpful, because it allows us to inject any logger into it,
// regardless of the implementation
const logger = new ConsoleLogger();
const userService = new UserService(logger);
userService.createUser('john123');