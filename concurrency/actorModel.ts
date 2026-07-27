import { Worker } from 'node:worker_threads';
import { join } from 'node:path';

type AccountMessage =
    | { type: 'deposit'; amount: number }
    | { type: 'withdraw'; amount: number }
    | { type: 'balance' }
    | { type: 'close' };

type ReplyMessage =
    | { type: 'balance'; balance: number }
    | { type: 'acknowledgeClose' };

const accountActorWorker = new Worker(join(import.meta.dirname, 'actorModel.worker'));

accountActorWorker.on('message', async (message: ReplyMessage) => {
    switch (message.type) {
        case 'balance':
            // We cannot read the balance directly, we can only ask for a report and await it
            console.log('Balance report: ' + message.balance);
            return;
        case 'acknowledgeClose':
            console.log('Closing the actor...');
            await accountActorWorker.terminate();
    }
});

// Instead of invoking methods or calling them directly, we send messages to the actor
const balanceMessage: AccountMessage = {
    type: 'balance'
}

accountActorWorker.postMessage(balanceMessage);

const depositMessage: AccountMessage = {
    type: 'deposit',
    amount: 100
}

accountActorWorker.postMessage(depositMessage);

const withdrawMessage: AccountMessage = {
    type: 'withdraw',
    amount: 10
}

accountActorWorker.postMessage(withdrawMessage);
accountActorWorker.postMessage(balanceMessage);

const closeMessage: AccountMessage = {
    type: 'close'
}

accountActorWorker.postMessage(closeMessage);