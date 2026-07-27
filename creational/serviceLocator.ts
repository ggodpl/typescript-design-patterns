interface Service {}

class LoggerService implements Service {
    log(message: string) {
        console.log('Logger services logs: ' + message);
    }
}

class ServiceLocator {
    private services: Map<Function, Service> = new Map();

    register(service: Service) {
        this.services.set(service.constructor, service);
    }

    get<T extends Service>(service: new (...args: unknown[]) => T): T {
        const locatedService = this.services.get(service);
        if (!locatedService) throw new Error(`${service.name} not registered`);
        return locatedService as T;
    }
}

const locator = new ServiceLocator();
const loggerService = new LoggerService();
locator.register(loggerService);

locator.get(LoggerService).log('Test message');