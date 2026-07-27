enum MessageType {
    OrderCreated,
    StockReserved,
    OutOfStock,
    PaymentSucceeded,
    PaymentFailed,
    OrderCompleted
}

enum CommandType {
    ReserveStock,
    ReleaseStock,
    ProcessPayment,
    AddFunds,
    CompleteOrder,
    CancelOrder,
    SendEmail
}

type Message = 
    | { type: MessageType.OrderCreated; orderId: string }
    | { type: MessageType.StockReserved; orderId: string }
    | { type: MessageType.OutOfStock; orderId: string }
    | { type: MessageType.PaymentFailed; orderId: string; reason: 'Insufficient funds' | 'Invalid account details' }
    | { type: MessageType.PaymentSucceeded; orderId: string }
    | { type: MessageType.OrderCompleted; orderId: string };

type Command =
    | { type: CommandType.ReserveStock; orderId: string }
    | { type: CommandType.ReleaseStock; orderId: string }
    | { type: CommandType.ProcessPayment; orderId: string }
    | { type: CommandType.AddFunds; funds: number }
    | { type: CommandType.CompleteOrder; orderId: string }
    | { type: CommandType.CancelOrder; orderId: string; reason: string }
    | { type: CommandType.SendEmail; orderId: string };

interface CommandHandler {
    handle(command: Command): void;
}

class Orchestrator {
    private order: OrderService = new OrderService(this);
    private stock: StockService = new StockService(this);
    private payment: PaymentService = new PaymentService(this);
    private email: EmailService = new EmailService();

    private orderId: number = 1;

    private getOrderId() {
        return `ID-${this.orderId++}`;
    }

    createOrder() {
        console.log('Creating a new order');
        // Start the saga by sending the first message
        this.handle({
            type: MessageType.OrderCreated,
            orderId: this.getOrderId()
        });
    }

    addFunds(funds: number) {
        // Since services are private, we need to send a command to add funds
        this.payment.handle({
            type: CommandType.AddFunds,
            funds
        });
    }

    // The orchestrator accepts messages from services...
    handle(message: Message) {
        switch (message.type) {
            case MessageType.OrderCreated:
                // ...and sends commands to them
                // The orchestrator owns the command flow and knows how to respond to every message it receives...
                this.stock.handle({
                    type: CommandType.ReserveStock,
                    orderId: message.orderId
                });
                return;
            case MessageType.StockReserved:
                this.payment.handle({
                    type: CommandType.ProcessPayment,
                    orderId: message.orderId
                });
                return;
            case MessageType.OutOfStock:
                this.order.handle({
                    type: CommandType.CancelOrder,
                    orderId: message.orderId,
                    reason: 'Out of stock'
                });
                return;
            case MessageType.PaymentSucceeded:
                this.order.handle({
                    type: CommandType.CompleteOrder,
                    orderId: message.orderId
                });
                return;
            case MessageType.PaymentFailed:
                this.order.handle({
                    type: CommandType.CancelOrder,
                    orderId: message.orderId,
                    reason: message.reason
                });

                this.stock.handle({
                    type: CommandType.ReleaseStock,
                    orderId: message.orderId
                });
                return;
            case MessageType.OrderCompleted:
                this.email.handle({
                    type: CommandType.SendEmail,
                    orderId: message.orderId
                });
                return;
        }
    }
}

class OrderService implements CommandHandler {
    constructor (private orchestrator: Orchestrator) {}
    
    // ...which makes services pretty tiny as they only have to worry about their own state...
    handle(command: Command) {
        switch (command.type) {
            case CommandType.CancelOrder:
                console.log(`Order ${command.orderId} cancelled, ${command.reason}`);
                return;
            case CommandType.CompleteOrder:
                console.log(`Order ${command.orderId} succeeded`);
                // ...and sending follow-up messages in responses to commands
                this.orchestrator.handle({
                    type: MessageType.OrderCompleted,
                    orderId: command.orderId
                });
                return;
        }
    }
}

class StockService implements CommandHandler {
    private stock: number = 2;

    constructor (private orchestrator: Orchestrator) {}
    
    handle(command: Command) {
        switch (command.type) {
            case CommandType.ReleaseStock:
                console.log('Releasing stock...');
                this.stock++;

                return;
            case CommandType.ReserveStock:
                console.log('Checking stock...');

                if (this.stock > 0) {
                    console.log('Reserving stock');
                    this.stock--;

                    this.orchestrator.handle({
                        type: MessageType.StockReserved,
                        orderId: command.orderId
                    });
                } else {
                    console.log('Out of stock');

                    this.orchestrator.handle({
                        type: MessageType.OutOfStock,
                        orderId: command.orderId
                    });
                }
                return;
        }
    }
}

class PaymentService implements CommandHandler {
    private funds: number = 100;
    
    constructor (private orchestrator: Orchestrator) {}

    checkAccountDetails(): boolean {
        return true;
    }

    checkFunds(): boolean {
        return this.funds >= 70;
    }

    handle(command: Command) {
        switch (command.type) {
            case CommandType.AddFunds:
                this.funds += command.funds;
                return;
            case CommandType.ProcessPayment:
                if (!this.checkAccountDetails()) {
                    return this.orchestrator.handle({
                        type: MessageType.PaymentFailed,
                        orderId: command.orderId,
                        reason: 'Invalid account details'
                    });
                }

                if (!this.checkFunds()) {
                    return this.orchestrator.handle({
                        type: MessageType.PaymentFailed,
                        orderId: command.orderId,
                        reason: 'Insufficient funds'
                    });
                }

                this.funds -= 70;

                this.orchestrator.handle({
                    type: MessageType.PaymentSucceeded,
                    orderId: command.orderId
                });
        }
    }
}

class EmailService implements CommandHandler {
    handle(command: Command) {
        if (command.type === CommandType.SendEmail) {
            console.log('Sending an e-mail to the user');
        }
    }
}

const orchestrator = new Orchestrator();
orchestrator.createOrder(); // Order ID-1 successful
orchestrator.createOrder(); // Order ID-2 unsuccessful, insufficient funds
orchestrator.addFunds(300);
orchestrator.createOrder(); // Order ID-3 successful
orchestrator.createOrder(); // Order ID-4 unsuccessful, out of stock