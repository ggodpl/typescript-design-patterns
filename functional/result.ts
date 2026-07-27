type Result<T, E> = Ok<T, E> | Err<T, E>

class Ok<T, E> {
    readonly tag = 'ok';

    constructor (public value: T) {}

    map<U>(fn: (value: T) => U): Result<U, E> {
        return new Ok(fn(this.value));
    }

    flatMap<U>(fn: (value: T) => Result<U, E>): Result<U, E> {
        return fn(this.value);
    }

    mapError<F>(_: (err: E) => F): Result<T, F> {
        return new Ok(this.value);
    }
}

class Err<T, E> {
    readonly tag = 'err';

    constructor (public err: E) {}

    map<U>(_: (value: T) => U): Result<U, E> {
        return new Err(this.err);
    }

    flatMap<U>(_: (value: T) => Result<U, E>): Result<U, E> {
        return new Err(this.err);
    }

    mapError<F>(fn: (err: E) => F): Result<T, F> {
        return new Err(fn(this.err));
    }
}

const ok = <T, E>(val: T) => new Ok<T, E>(val);
const err = <T, E>(err: E) => new Err<T, E>(err);

const parseNumber = (s: string): Result<number, string> => {
    const number = Number(s);

    if (Number.isNaN(number)) {
        return err('not a number')
    } else {
        return ok(number);
    }
}

const reciprocal = (n: number): Result<number, string> => {
    if (n === 0) {
        return err('division by zero');
    }
    
    return ok(1 / n);
}

const format = (n: number): Result<string, string> => {
    return ok(n.toString(10));
}

const result1 = parseNumber('6')
    .flatMap(reciprocal)
    .flatMap(format);

console.log(result1);

const result2 = parseNumber('test')
    .flatMap(reciprocal)
    .flatMap(format);

console.log(result2);

const result3 = parseNumber('0')
    .flatMap(reciprocal)
    .flatMap(format);

console.log(result3);