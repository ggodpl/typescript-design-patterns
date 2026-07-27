interface Service {}

class LoggerService implements Service {
    log(message: string) {
        console.log('Logger services logs: ' + message);
    }
}

class ServiceLocator {
    private services: Map<Function, Service> = new Map();

    register(service: Service) {
        // We store any services registered using the constructor as a key...
        this.services.set(service.constructor, service);
    }

    get<T extends Service>(service: new (...args: unknown[]) => T): T {
        // ...and locate them in a similar way
        const locatedService = this.services.get(service);
        if (!locatedService) throw new Error(`${service.name} not registered`);
        return locatedService as T;
    }
}

const locator = new ServiceLocator();
const loggerService = new LoggerService();
locator.register(loggerService);

// We have to explicitly ask the service locator for any service we may need
// This is almost an exact opposite of the Dependency Injection pattern,
// which injects services with everything they need
locator.get(LoggerService).log('Test message');