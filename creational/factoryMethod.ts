interface Logger {
    log(message: string): void;
}

class DebugLogger implements Logger {
    log(message: string) {
        console.debug('Debug: ' + message);
    }
}

class ErrorLogger implements Logger {
    log(message: string) {
        console.error('Error: ' + message);
    }
}

abstract class LoggerFactory {
    abstract createLogger(): Logger;

    write(message: string) {
        const logger = this.createLogger();

        logger.log(message);
    }
}

class DebugLoggerFactory extends LoggerFactory {
    createLogger(): Logger {
        return new DebugLogger();
    }
}

class ErrorLoggerFactory extends LoggerFactory {
    createLogger(): Logger {
        return new ErrorLogger();
    }
}

const debugLoggerFactory = new DebugLoggerFactory();
debugLoggerFactory.write('test');

const errorLoggerFactory = new ErrorLoggerFactory();
errorLoggerFactory.write('test');