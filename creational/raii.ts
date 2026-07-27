class DatabaseConnection implements Disposable {
    constructor () {
        console.log('Connecting to the database!');
    }

    query(query: string) {
        console.log(query);
    }

    [Symbol.dispose]() {
        console.log('Disconnected');
    }
}

function executeQuery() {
    using connection = new DatabaseConnection();
    connection.query('SELECT * FROM users');
}

executeQuery();

class AsyncDatabaseConnection implements AsyncDisposable {
    constructor () {
        console.log('Connecting to the database!');
    }

    async query(query: string) {
        console.log(query);
    }

    async [Symbol.asyncDispose]() {
        console.log('Disconnecting from the database');
    }
}

async function asyncExecuteQuery() {
    await using connection = new AsyncDatabaseConnection();
    await connection.query('SELECT * FROM users');
}

asyncExecuteQuery();