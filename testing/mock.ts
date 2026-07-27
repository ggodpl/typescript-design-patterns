interface EmailService {
    sendConfirmation(recipient: string): void;
}

class OrderService {
    constructor (private emailService: EmailService) {}

    orderComplete(userEmail: string) {
        this.emailService.sendConfirmation(userEmail);
    }
}

class BrokenOrderService {
    constructor (private emailService: EmailService) {}

    orderComplete(userEmail: string) {
        this.emailService.sendConfirmation(userEmail + ' BROKEN EMAIL');
    }
}

// If we want to verify if the service is properly called...
class MockEmailService implements EmailService {
    public emailSent: boolean = false;
    // ...and if with the correct parameters...
    public lastRecipient?: string;

    // ...we can create a mock version...
    sendConfirmation(recipient: string) {
        this.emailSent = true;
        this.lastRecipient = recipient;
    }

    // ...that can verify if everything works as expected
    verify(expectedRecipient: string) {
        if (!this.emailSent) throw new Error('Expected sendConfirmation() to be called at least once');
        if (this.lastRecipient !== expectedRecipient) throw new Error('Expected ' + expectedRecipient + ' as the recipient, found ' + this.lastRecipient);
    }
}

const mockService = new MockEmailService();
const orderService = new OrderService(mockService);

orderService.orderComplete('abc@test.com');
mockService.verify('abc@test.com');

const mockService2 = new MockEmailService();
const orderService2 = new BrokenOrderService(mockService2);

orderService2.orderComplete('abc@test.com');
mockService2.verify('abc@test.com');