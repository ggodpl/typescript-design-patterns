interface Mediator {
    join(user: User): void;
    // Centralizes communication between all users
    // This way users don't have to call each other directly
    send(message: string, sender: User): void;
}

class ChatMediator implements Mediator {
    private users: User[] = [];

    join(user: User) {
        this.users.push(user);
    }

    send(message: string, sender: User) {
        // We relay the message to every user except for the sender (broadcast)
        for (const user of this.users) {
            if (user !== sender) {
                user.receive(message);
            }
        }
    }
}

class User {
    constructor (private name: string, private mediator: Mediator) {
        // The user automatically joins the provided mediator
        mediator.join(this);
    }

    // Sends a message to the mediator
    send(message: string) {
        this.mediator.send(`${this.name}: ${message}`, this);
    }

    // Receives a message from the mediator
    receive(message: string) {
        console.log(`${this.name} received: ${message}`);
    }
}

const chatRoom = new ChatMediator();
const user1 = new User('John', chatRoom);
const user2 = new User('Bob', chatRoom);
const user3 = new User('Alice', chatRoom);

user1.send('Hi!');
user2.send('Hello!');
user3.send('Hi!');