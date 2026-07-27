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

const emailServiceStub: EmailService = {
    sendConfirmation(recipient: string) {
        console.log('New mail: ' + recipient);
        return 'Confirmation e-mail sent!';
    }
}

const orderService = new OrderService(emailServiceStub);

orderService.orderComplete('abc@test.com');