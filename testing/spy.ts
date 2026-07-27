interface EmailService {
    sendConfirmation(recipient: string): void;
}

class OrderService {
    constructor (private emailService: EmailService) {}

    orderComplete(userEmail: string) {
        this.emailService.sendConfirmation(userEmail);
    }
}

// If we want to check what parameters are passed into a tested service, we can use a spy
class SpyEmailService implements EmailService {
    public recipients: string[] = [];

    sendConfirmation(recipient: string) {
        this.recipients.push(recipient);
    }
}

// A simple helper function to assert, completely optional
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