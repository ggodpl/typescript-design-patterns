class Database {
    query() {
        return new Query(this);
    }

    execute(query: Query): any {
        console.log('Executing query ' + query.getQuery());
        return 'some_result';
    }
}

class Query {
    private query: string[] = [];

    constructor (private database: Database) {}

    select(...fields: string[]): this {
        this.query.push(`SELECT ${fields.join(', ')}`);
        return this;
    }

    from(collection: string): this {
        this.query.push(`FROM ${collection}`);
        return this;
    }

    where(condition: string): this {
        this.query.push(`WHERE ${condition}`);
        return this;
    }

    groupBy(...columns: string[]): this {
        this.query.push(`GROUP BY ${columns.join(', ')}`);
        return this;
    }

    limit(limit: number): this {
        this.query.push(`LIMIT ${limit}`);
        return this;
    }

    execute() {
        return this.database.execute(this);
    }

    getQuery() {
        return this.query.join(' ');
    }
}

const database = new Database();
const result = database.query()
    .select('id', 'name')
    .from('users')
    .where("name LIKE 'A%'")
    .limit(10)
    .execute();