interface BankAccount {
    deposit(amount: number): void;
    withdraw(amount: number): void;
}

// If we have an object...
class SimpleBankAccount implements BankAccount {
    constructor (public funds: number) {}

    deposit(amount: number) {
        console.log(`Depositing ${amount} USD`);
        this.funds += amount;
    }

    withdraw(amount: number) {
        if (this.funds < amount) {
            console.log('Insufficient funds');
            return;
        }
        console.log(`Withdrawing ${amount} USD`);
        this.funds -= amount;
    }
}

// ...we can create a proxy to it...
class SecureBankAccountProxy implements BankAccount {
    constructor (private bankAccount: BankAccount, private authenticated: boolean) {}

    deposit(amount: number) {
        // ...which can control access to it
        // It can be any kind of control, from authentication (like this example), through quotas, policies, to rate limiting
        if (!this.authenticated) {
            console.log('You cannot access this bank account!');
            return;
        }

        this.bankAccount.deposit(amount);
    }

    withdraw(amount: number) {
        if (!this.authenticated) {
            console.log('You cannot access this bank account!');
            return;
        }

        this.bankAccount.withdraw(amount);
    }
}

const bankAccount = new SimpleBankAccount(100);
const authenticatedAccount = new SecureBankAccountProxy(bankAccount, true);
authenticatedAccount.deposit(10);
authenticatedAccount.withdraw(10);

const unauthenticatedAccount = new SecureBankAccountProxy(bankAccount, false);
unauthenticatedAccount.deposit(10);