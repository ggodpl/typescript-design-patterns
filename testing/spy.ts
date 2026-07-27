interface EmailService {
    sendConfirmation(recipient: string): void;
}

class OrderService {
    constructor (private emailService: EmailService) {}

    orderComplete(userEmail: string) {
        this.emailService.sendConfirmation(userEmail);
    }
}

class SpyEmailService implements EmailService {
    public recipients: string[] = [];

    sendConfirmation(recipient: string) {
        this.recipients.push(recipient);
    }
}

function assertEquals(expected: any, value: any) {
    if (expected !== value) {
        throw new Error('Expected ' + expected + ', found ' + value);
    } else {
        console.log('True assertion');
    }
}

const spyService = new SpyEmailService();
const orderService = new OrderService(spyService);

orderService.orderComplete('abc@test.com');

assertEquals(1, spyService.recipients.length);
assertEquals('abc@test.com', spyService.recipients[0]);