interface Mediator {
    join(user: User): void;
    send(message: string, sender: User): void;
}

class ChatMediator implements Mediator {
    private users: User[] = [];

    join(user: User) {
        this.users.push(user);
    }

    send(message: string, sender: User) {
        for (const user of this.users) {
            if (user !== sender) {
                user.receive(message);
            }
        }
    }
}

class User {
    constructor (private name: string, private mediator: Mediator) {
        mediator.join(this);
    }

    send(message: string) {
        this.mediator.send(`${this.name}: ${message}`, this);
    }

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