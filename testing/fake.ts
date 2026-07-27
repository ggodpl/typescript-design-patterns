interface EmailService {
    sendConfirmation(recipient: string): void;
}

class OrderService {
    constructor (private emailService: EmailService) {}

    orderComplete(userEmail: string) {
        this.emailService.sendConfirmation(userEmail);
    }
}

class FakeEmailService implements EmailService {
    constructor (private recipients: Map<string, {
        send: (mail: string) => void
    }>) {}

    sendConfirmation(recipient: string) {
        if (this.recipients.has(recipient)) return;

        const confirmationMail = 'Order has been confirmed';
        this.recipients.get(recipient)!.send(confirmationMail);
    }
}

const recipients = new Map();
recipients.set('abc@test.com', {
    send: (mail: string) => {
        console.log('Mail recieved: ' + mail);
    }
});
const emailService = new FakeEmailService(recipients);
const orderService = new OrderService(emailService);

orderService.orderComplete('abc@test.com');