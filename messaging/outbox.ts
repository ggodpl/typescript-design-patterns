enum MessageType {
    OrderCreated,
    OrderCancelled
}

type Message = 
    | { type: MessageType.OrderCreated; orderId: string }
    | { type: MessageType.OrderCancelled; orderId: string };

interface Outbox {
    getMessages(): Set<Message>;
    pushMessage(message: Message): void;
    popMessage(message: Message): void;
}

interface MessageBroker {
    publish(message: Message): boolean;
}

class Order {
    constructor (public id: string, public total: number) {}    
}

// A simplified database containing both orders and an outbox
class OrdersDatabase implements Outbox {
    private orders: Map<string, Order> = new Map();
    private outbox: Set<Message> = new Set();

    getOrder(orderId: string) {
        return this.orders.get(orderId);
    }

    deleteOrder(orderId: string) {
        this.orders.delete(orderId);
    }

    addOrder(order: Order) {
        this.orders.set(order.id, order);
    }

    getMessages() {
        return this.outbox;
    }

    // Messages can be pushed...
    pushMessage(message: Message) {
        this.outbox.add(message);
    }

    // ...or popped from the outbox 
    popMessage(message: Message) {
        this.outbox.delete(message);
    }
}

class OrdersService {
    private orderId: number = 1;
    
    constructor (private database: OrdersDatabase) {}

    private getOrderId() {
        return `ID-${this.orderId++}`;
    }

    createOrder(total: number) {
        const id = this.getOrderId();
        const order = new Order(id, total);

        console.log('Creating a new order with ID: ' + id);

        // Production-ready examples would use a single transaction to enter the order and the message,
        // this way the database cannot fail after adding the order and before adding the message
        this.database.addOrder(order);
        this.database.pushMessage({
            type: MessageType.OrderCreated,
            orderId: id
        });

        return id;
    }

    cancelOrder(id: string) {
        console.log('Cancelling an order with ID: ' + id);

        this.database.deleteOrder(id);
        this.database.pushMessage({
            type: MessageType.OrderCancelled,
            orderId: id
        });
    }
}

class SimpleBroker implements MessageBroker {
    publish(message: Message): boolean {
        console.log('Simple broker publishes a new message:', message);
        return true;
    }
}

class FailingBroker implements MessageBroker {
    private count: number = 0;
    
    publish(message: Message): boolean {
        // For demonstration purposes this broker fails every other time
        if (this.count++ % 2 !== 0) {
            console.log('Message failure.');
            return false;
        }

        console.log('Failing broker publishes a new message:', message);
        return true;
    }
}

class OutboxPublisher {
    constructor (private outbox: Outbox, private broker: MessageBroker) {}

    publishPending() {
        if (this.outbox.getMessages().size === 0) {
            console.log('No messages left to publish');
            return;
        }

        for (const message of this.outbox.getMessages()) {
            // If the broker successfully publishes the message...
            if (this.broker.publish(message)) {
                // ...we delete it from the outbox
                // This guarantees at-least-once delivery
                this.outbox.popMessage(message);
            }
        }
    }

    setBroker(broker: MessageBroker) {
        this.broker = broker;
    }
}

const database = new OrdersDatabase();
const orders = new OrdersService(database);

const simpleBroker = new SimpleBroker();
const publisher = new OutboxPublisher(database, simpleBroker);

const order1 = orders.createOrder(100);
orders.cancelOrder(order1);

publisher.publishPending(); // OutboxPublisher publishes periodically

orders.createOrder(100);

publisher.publishPending(); // OutboxPublisher publishes periodically

const failingBroker = new FailingBroker();
publisher.setBroker(failingBroker);

const order3 = orders.createOrder(100);

publisher.publishPending();
publisher.publishPending(); // No messages left to publish

orders.cancelOrder(order3);

publisher.publishPending(); // Publishing failure, message still in the outbox
publisher.publishPending();