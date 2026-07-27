enum CommandType {
    DepositMoney,
    WithdrawMoney
}

enum QueryType {
    GetFunds,
    GetAccountName
}

type Command = 
    | { type: CommandType.DepositMoney; accountId: string; amount: number }
    | { type: CommandType.WithdrawMoney; accountId: string; amount: number };

type Query =
    | { type: QueryType.GetFunds; accountId: string }
    | { type: QueryType.GetAccountName; accountId: string };

type QueryReturnType = {
    [QueryType.GetFunds]: number;
    [QueryType.GetAccountName]: string;
}

class Account {
    constructor (public accountId: string, public name: string, public funds: number) {}

    // Since the database is in-memory, we add a cloning method to prevent state mutation
    clone() {
        return new Account(this.accountId, this.name, this.funds);
    }
}

// A simplified database
// In actual CQRS implementations the write and read databases are separate,
// allowing you to scale one if it becomes a bottleneck (for example in a read-heavy
// applicaton the read database could be scaled earlier than the write one)
class Database {
    private accounts: Map<string, Account> = new Map();

    createAccount(account: Account) {
        if (this.accounts.has(account.accountId)) return;
        this.accounts.set(account.accountId, account.clone());
    }

    getAccount(id: string) {
        return this.accounts.get(id)?.clone();
    }

    update(account: Account) {
        this.accounts.set(account.accountId, account.clone());
    }
}

// All commands (writes) are handled by command handlers
class CommandHandler {
    constructor (private database: Database) {}

    handleDeposit(accountId: string, amount: number) {
        const account = this.database.getAccount(accountId);
        if (!account) throw new Error('No account with this ID');

        account.funds += amount;
        this.database.update(account);
    }

    handleWithdrawal(accountId: string, amount: number) {
        const account = this.database.getAccount(accountId);
        if (!account) throw new Error('No account with this ID');
        
        account.funds -= amount;
        this.database.update(account);
    }
}

// All queries (reads) are handled by query handlers
class QueryHandler {
    constructor (private database: Database) {}

    getFunds(accountId: string) {
        const account = this.database.getAccount(accountId);
        if (!account) throw new Error('No account with this ID');

        return account.funds;
    }

    getAccountName(accountId: string) {
        const account = this.database.getAccount(accountId);
        if (!account) throw new Error('No account with this ID');

        return account.name;
    }
}

class Dispatcher {
    private commandHandler: CommandHandler;
    private queryHandler: QueryHandler;

    constructor (private database: Database) {
        this.commandHandler = new CommandHandler(this.database);
        this.queryHandler = new QueryHandler(this.database);
    }

    // Dispatcher dispatches the commands to appropriate command handlers...
    command(command: Command) {
        switch (command.type) {
            case CommandType.DepositMoney:
                this.commandHandler.handleDeposit(command.accountId, command.amount);
                return;
            case CommandType.WithdrawMoney:
                this.commandHandler.handleWithdrawal(command.accountId, command.amount);
                return;
        }
    }

    // ...and queries to appropriate query handlers
    query<T extends Query>(query: T): QueryReturnType[T['type']] {
        switch (query.type) {
            case QueryType.GetFunds:
                return this.queryHandler.getFunds(query.accountId) as QueryReturnType[T['type']];
            case QueryType.GetAccountName:
                return this.queryHandler.getAccountName(query.accountId) as QueryReturnType[T['type']];
        }
    }
}

const database = new Database();
database.createAccount(new Account('ID-1', 'Alice', 123));
database.createAccount(new Account('ID-2', 'Bob', 234));

const dispatcher = new Dispatcher(database);
dispatcher.command({
    type: CommandType.DepositMoney,
    accountId: 'ID-1',
    amount: 100
});

dispatcher.command({
    type: CommandType.WithdrawMoney,
    accountId: 'ID-2',
    amount: 10
});

console.log(dispatcher.query({
    type: QueryType.GetFunds,
    accountId: 'ID-1'
}));

console.log(dispatcher.query({
    type: QueryType.GetAccountName,
    accountId: 'ID-2'
}));