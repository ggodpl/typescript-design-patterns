enum AccountEventType {
    AccountOpened,
    MoneyWithdrawn,
    MoneyDeposited
}

type AccountEvent =
    | { type: AccountEventType.AccountOpened; initialBalance: number; accountId: number }
    | { type: AccountEventType.MoneyDeposited; amount: number }
    | { type: AccountEventType.MoneyWithdrawn; amount: number };

class Account {
    private id: number = 0;
    private balance: number = 0;
    private opened: boolean = false;

    private reset() {
        this.id = 0;
        this.balance = 0;
        this.opened = false;
    }
    
    private apply(event: AccountEvent) {
        switch (event.type) {
            case AccountEventType.AccountOpened:
                this.id = event.accountId;
                this.balance = event.initialBalance;
                this.opened = true;
                return;
            case AccountEventType.MoneyWithdrawn:
                this.balance -= event.amount;
                return;
            case AccountEventType.MoneyDeposited:
                this.balance += event.amount;
                return;
        }
    }

    applyEvents(events: AccountEvent[]) {
        this.reset();
        for (const event of events) {
            this.apply(event);
        }
    }

    deposit(amount: number): AccountEvent[] {
        if (!this.opened) throw new Error('Account not opened');
        if (amount <= 0) throw new Error('Invalid amount');

        return [
            {
                type: AccountEventType.MoneyDeposited,
                amount
            }
        ]
    }

    withdraw(amount: number): AccountEvent[] {
        if (!this.opened) throw new Error('Account not opened');
        if (amount <= 0) throw new Error('Invalid amount');
        if (this.balance < amount) throw new Error('Insufficient funds');

        return [
            {
                type: AccountEventType.MoneyWithdrawn,
                amount
            }
        ]
    }

    open(accountId: number, balance: number): AccountEvent[] {
        if (this.opened) throw new Error('Account already opened');
        if (balance < 0) throw new Error('Invalid balance');

        return [
            {
                type: AccountEventType.AccountOpened,
                accountId,
                initialBalance: balance
            }
        ]
    }

    getState() {
        return {
            balance: this.balance,
            id: this.id,
            opened: this.opened
        }
    }
}

const account = new Account();
const history = [];

history.push(...account.open(1, 100));

account.applyEvents(history);

history.push(...account.withdraw(10));

account.applyEvents(history);

history.push(...account.deposit(100));

account.applyEvents(history);

console.log(account.getState());