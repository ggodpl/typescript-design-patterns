enum MessageType {
    OrderCreated,
    StockReserved,
    OutOfStock,
    PaymentSucceeded,
    PaymentFailed,
    OrderCompleted
}

type Message = 
    | { type: MessageType.OrderCreated; orderId: string }
    | { type: MessageType.StockReserved; orderId: string }
    | { type: MessageType.OutOfStock; orderId: string }
    | { type: MessageType.PaymentFailed; orderId: string; reason: 'Insufficient funds' | 'Invalid account details' }
    | { type: MessageType.PaymentSucceeded; orderId: string }
    | { type: MessageType.OrderCompleted; orderId: string };

interface Subscriber {
    handle(message: Message): void;
}

// A simplified message broker
class MessageBroker {
    private subscribers: Set<Subscriber> = new Set();
    
    // It can accept subscribers...
    subscribe(subscriber: Subscriber) {
        this.subscribers.add(subscriber);
    }

    // ...and send messages to them
    publish(message: Message) {
        for (const subscriber of this.subscribers) {
            subscriber.handle(message);
        }
    }
}

class OrderService implements Subscriber {
    private orderId: number = 1;

    // Each service gets the message broker...
    constructor (private broker: MessageBroker) {
        // ...registers itself...
        this.broker.subscribe(this);
    }

    // ...and handles its own messages and state
    handle(message: Message) {
        switch (message.type) {
            case MessageType.PaymentFailed:
                console.log(`Order ${message.orderId} cancelled, ${message.reason}`);
                return;
            case MessageType.PaymentSucceeded:
                console.log(`Order ${message.orderId} succeeded`);

                // Some messages can publish other messages, thus creating a saga
                this.broker.publish({
                    type: MessageType.OrderCompleted,
                    orderId: message.orderId
                });
                
                return;
            case MessageType.OutOfStock:
                console.log(`Order ${message.orderId} cancelled, Out of stock`);
                return;
        }
    }

    private getOrderId(): string {
        return `ID-${this.orderId++}`;
    }

    createOrder() {
        console.log('Creating a new order');
        // Start the saga by sending the first message
        this.broker.publish({
            type: MessageType.OrderCreated,
            orderId: this.getOrderId()
        });
    }
}

class StockService implements Subscriber {
    private stock: number = 2;

    constructor (private broker: MessageBroker) {
        this.broker.subscribe(this);
    }

    handle(message: Message) {
        switch (message.type) {
            case MessageType.OrderCreated:
                console.log('Checking stock...');

                if (this.stock > 0) {
                    console.log('Reserving stock');
                    
                    this.stock--;
                    
                    this.broker.publish({
                        type: MessageType.StockReserved,
                        orderId: message.orderId
                    })
                } else {
                    console.log('Out of stock');

                    this.broker.publish({
                        type: MessageType.OutOfStock,
                        orderId: message.orderId
                    });
                }
                return;
            // Since all communication is done exclusively via messages,
            // all steps also listen for failures of their successors to return state
            case MessageType.PaymentFailed:
                console.log('Releasing stock...');
                
                this.stock++;
                return;
        }
    }
}

class PaymentService implements Subscriber {
    private funds: number = 100;

    constructor (private broker: MessageBroker) {
        this.broker.subscribe(this);
    }

    checkAccountDetails(): boolean {
        return true;
    }

    checkFunds(): boolean {
        return this.funds >= 70;
    }

    handle(message: Message) {
        if (message.type !== MessageType.StockReserved) return;
        
        if (!this.checkAccountDetails()) {
            return this.broker.publish({
                type: MessageType.PaymentFailed,
                orderId: message.orderId,
                reason: 'Invalid account details'
            });
        }

        if (!this.checkFunds()) {
            return this.broker.publish({
                type: MessageType.PaymentFailed,
                orderId: message.orderId,
                reason: 'Insufficient funds'
            });
        }

        this.funds -= 70;

        this.broker.publish({
            type: MessageType.PaymentSucceeded,
            orderId: message.orderId
        });
    }

    addFunds(funds: number) {
        this.funds += funds;
    }
}

class EmailService implements Subscriber {
    constructor (private broker: MessageBroker) {
        this.broker.subscribe(this);
    }

    handle(message: Message) {
        if (message.type === MessageType.OrderCompleted) {
            console.log('Sending an e-mail to the user');
        }
    }
}

const broker = new MessageBroker();
const orderService = new OrderService(broker);
const stockService = new StockService(broker);
const paymentService = new PaymentService(broker);
const emailService = new EmailService(broker);

orderService.createOrder(); // Order ID-1 successful
orderService.createOrder(); // Order ID-2 unsuccessful, insufficient funds
paymentService.addFunds(300);
orderService.createOrder(); // Order ID-3 successful
orderService.createOrder(); // Order ID-4 unsuccessful, out of stock