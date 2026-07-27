interface EmailService {
    sendConfirmation(recipient: string): string;
}

class OrderService {
    constructor (private emailService: EmailService) {}

    orderComplete(userEmail: string) {
        const response = this.emailService.sendConfirmation(userEmail);
        console.log(response);
    }
}

// Instead of creating a full service, we can just create a small stub,
// which contains the bare minimum functionality to work...
const emailServiceStub: EmailService = {
    sendConfirmation(recipient: string) {
        console.log('New mail: ' + recipient);
        // ...and returns a predefined response
        return 'Confirmation e-mail sent!';
    }
}

const orderService = new OrderService(emailServiceStub);

orderService.orderComplete('abc@test.com');