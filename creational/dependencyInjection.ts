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

const logger = new ConsoleLogger();
const userService = new UserService(logger);
userService.createUser('john123');