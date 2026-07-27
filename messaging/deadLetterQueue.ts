interface Message {
    messageId: number;
    size: number;
    sentAt: number;
    ttl: number;
}

type Subscriber = (message: Message) => void;

class MessageBroker {
    private subscribers: Set<Subscriber> = new Set();
    // Sometimes messages may be undeliverable
    // Keeping them somewhere may be helpful for debugging
    deadLetterQueue: Message[] = [];

    subscribe(subscriber: Subscriber) {
        this.subscribers.add(subscriber);
    }

    unsubscribe(subscriber: Subscriber) {
        this.subscribers.delete(subscriber);
    }

    canDeliver(message: Message) {
        // Common examples of undeliverable messages are messages that are too big...
        return message.size < 1024 
            // ...or expired messages
            && message.sentAt + message.ttl >= Date.now();
    }

    publish(message: Message) {
        // If a message cannot be delivered...
        if (!this.canDeliver(message)) {
            // ...we put it in our Dead Letter Queue
            this.deadLetterQueue.push(message);
            return;
        }

        for (const subscriber of this.subscribers) {
            subscriber(message);
        }
    }
}

const broker = new MessageBroker();

const message: Message = {
    messageId: 1,
    size: 120,
    sentAt: Date.now(),
    ttl: 1000
};

broker.publish(message);

console.log(broker.deadLetterQueue.length);

const bigMessage: Message = {
    messageId: 2,
    size: 2000,
    sentAt: Date.now(),
    ttl: 1000
};

const expiredMessage: Message = {
    messageId: 3,
    size: 200,
    sentAt: Date.now() - 300,
    ttl: 100
};

broker.publish(bigMessage);
broker.publish(expiredMessage);

console.log(broker.deadLetterQueue);