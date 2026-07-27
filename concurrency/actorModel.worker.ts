import { parentPort, MessagePort } from 'node:worker_threads';

if (parentPort === null) throw new Error('This file can only run as a worker');

type AccountMessage =
    | { type: 'deposit'; amount: number }
    | { type: 'withdraw'; amount: number }
    | { type: 'balance' }
    | { type: 'close' };

type ClientMessage =
    | { type: 'balance'; balance: number }
    | { type: 'acknowledgeClose' };

class AccountActor {
    // An actor contains its own state it can modify...
    private balance: number = 100;
    private closed: boolean = false;

    constructor (private port: MessagePort) {}

    // ...it can react to messages...
    onMessage(message: AccountMessage) {
        if (this.closed) return;

        switch (message.type) {
            case 'deposit':
                this.balance += message.amount;
                return;
            case 'withdraw':
                this.balance -= message.amount;
                return;
            case 'balance':
                // ...or send them
                // Actors can also generally create other actors and communicate with them
                // The state is never visible or modifiable from the ouside without asking the actor directly
                this.sendMessage({
                    type: 'balance',
                    balance: this.balance
                });
                return;
            case 'close':
                this.closed = true;
                this.sendMessage({
                    type: 'acknowledgeClose'
                })
                return;
        }
    }

    sendMessage(message: ClientMessage) {
        this.port.postMessage(message);
    }
}

const accountActor = new AccountActor(parentPort);
parentPort.on('message', (message) => {
    accountActor.onMessage(message);
});