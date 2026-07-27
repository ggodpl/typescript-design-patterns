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
    // This method has to be implemented by every single child of LoggerFactory
    // This allows the LoggerFactory to create multiple different loggers via inheritance
    abstract createLogger(): Logger;

    write(message: string) {
        // We don't know what kind of logger will get created here...
        const logger = this.createLogger();

        // ...just that it can log a string
        logger.log(message);
    }
}

class DebugLoggerFactory extends LoggerFactory {
    // Specific implementations can change what kind of logger is created...
    createLogger(): Logger {
        return new DebugLogger();
    }
}

class ErrorLoggerFactory extends LoggerFactory {
    // ...depending on the needs of the client
    createLogger(): Logger {
        return new ErrorLogger();
    }
}

const debugLoggerFactory = new DebugLoggerFactory();
debugLoggerFactory.write('test');

const errorLoggerFactory = new ErrorLoggerFactory();
errorLoggerFactory.write('test');