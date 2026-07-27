class DatabaseConnection implements Disposable {
    // The moment our database connection is instantiated
    // We "create" an actual connection to the database (in this case 
    // the database doesn't exist, so we can only log)
    constructor () {
        console.log('Connecting to the database!');
    }

    query(query: string) {
        console.log(query);
    }

    // The moment the connection is disposed, we disconnect from the database
    // Since JavaScript has a Garbage Collector, we can only approximate this behavior
    // using experimental explicit resource management
    // In languages that support real RAII, this will be done using constructors and destructors
    [Symbol.dispose]() {
        console.log('Disconnected');
    }
}

function executeQuery() {
    using connection = new DatabaseConnection();
    connection.query('SELECT * FROM users');
}

executeQuery();

// The same thing can be achieved asynchronously
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