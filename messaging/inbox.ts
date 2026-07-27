interface Message {
    messageId: number;
    stockNeeded: number;
}

type Subscriber = (message: Message) => void;

class SimpleMessageBroker {
    private subscribers: Set<Subscriber> = new Set();
    
    subscribe(subscriber: Subscriber) {
        this.subscribers.add(subscriber);
    }

    unsubscribe(subscriber: Subscriber) {
        this.subscribers.delete(subscriber);
    }

    publish(message: Message) {
        for (const subscriber of this.subscribers) {
            subscriber(message);
        }
    }
}

class InventoryService {
    private stock: number = 10;
    private inbox: number[] = [];

    constructor (private broker: SimpleMessageBroker) {
        this.broker.subscribe(this.handle.bind(this));
    }

    handle(message: Message) {
        if (this.inbox.includes(message.messageId)) {
            console.log('Message ' + message.messageId + ' already processed!');
            return;
        }

        this.inbox.push(message.messageId);

        console.log('Processing a new message: ' + message.messageId);
        this.stock -= message.stockNeeded;
    }
}

const broker = new SimpleMessageBroker();
const inventoryService = new InventoryService(broker);

const message1: Message = {
    messageId: 1,
    stockNeeded: 3
};

const message2: Message = {
    messageId: 2,
    stockNeeded: 5
};

broker.publish(message1);
broker.publish(message1);
broker.publish(message2);