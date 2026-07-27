interface Event {}

type EventConstructor<E extends Event> = new (...args: any[]) => E;

interface Subscriber<E extends Event> {
    handle(e: E): void;
}

class EventBus {
    private subscribers: Map<EventConstructor<any>, Set<Subscriber<any>>> = new Map();

    subscribe<E extends Event>(eventType: EventConstructor<E>, subscriber: Subscriber<E>) {
        if (!this.subscribers.has(eventType)) {
            this.subscribers.set(eventType, new Set());
        }
        const subscribers = this.subscribers.get(eventType)!;
        subscribers.add(subscriber);
    }

    unsubscribe<E extends Event>(eventType: EventConstructor<E>, subscriber: Subscriber<E>) {
        if (!this.subscribers.has(eventType)) return;
        const subscribers = this.subscribers.get(eventType)!;
        subscribers.delete(subscriber);
    }

    publish<E extends Event>(event: E) {
        const subscribers = this.subscribers.get(event.constructor as EventConstructor<E>) ?? [];
        for (const subscriber of subscribers) {
            subscriber.handle(event);
        }
    }
}

class DocumentUpdated implements Event {
    constructor (public documentName: string) {}
}

class DocumentDeleted implements Event {
    constructor (public documentName: string) {}
}

class DocumentUpdateSubscriber implements Subscriber<DocumentUpdated> {
    handle(e: DocumentUpdated) {
        console.log('DocumentUpdateSubscriber | Document updated: ' + e.documentName)
    }
}

class DocumentSubscriber implements Subscriber<DocumentUpdated | DocumentDeleted> {
    handle(e: DocumentUpdated | DocumentDeleted) {
        if (e instanceof DocumentUpdated) {
            console.log('DocumentSubscriber | Document updated: ' + e.documentName);
        } else if (e instanceof DocumentDeleted) {
            console.log('DocumentSubscriber | Document deleted: ' + e.documentName);
        }
    }
}

const eventBus = new EventBus();
const documentSubscriber = new DocumentSubscriber();
const documentUpdateSubscriber = new DocumentUpdateSubscriber();
eventBus.subscribe(DocumentUpdated, documentSubscriber);
eventBus.subscribe(DocumentDeleted, documentSubscriber);
eventBus.subscribe(DocumentUpdated, documentUpdateSubscriber);

const documentUpdated = new DocumentUpdated('test.docx');
const documentDeleted = new DocumentDeleted('test2.pdf');

eventBus.publish(documentUpdated);
eventBus.publish(documentDeleted);

eventBus.unsubscribe(DocumentUpdated, documentSubscriber);

eventBus.publish(new DocumentUpdated('test3.md'));