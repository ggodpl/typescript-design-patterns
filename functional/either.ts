abstract class Either<L, R> {
    abstract map<U>(fn: (value: R) => U): Either<L, U>;
    abstract mapLeft<U>(fn: (value: L) => U): Either<U, R>;
    abstract flatMap<U>(fn: (value: R) => Either<L, U>): Either<L, U>;
    abstract flatMapLeft<U>(fn: (value: L) => Either<U, R>): Either<U, R>;
    abstract fold<U>(left: (value: L) => U, right: (value: R) => U): U;
}

class Left<L, R> extends Either<L, R> {
    constructor (private readonly value: L) {
        super();
    }

    override map<U>(_: (value: R) => U): Either<L, U> {
        return new Left(this.value);
    }

    override mapLeft<U>(fn: (value: L) => U): Either<U, R> {
        return new Left(fn(this.value));
    }

    override flatMap<U>(_: (value: R) => Either<L, U>): Either<L, U> {
        return new Left(this.value);
    }

    override flatMapLeft<U>(fn: (value: L) => Either<U, R>): Either<U, R> {
        return fn(this.value);
    }

    override fold<U>(left: (value: L) => U, _: (value: R) => U): U {
        return left(this.value);
    }
}

class Right<L, R> extends Either<L, R> {
    constructor (private readonly value: R) {
        super();
    }
    
    override map<U>(fn: (value: R) => U): Either<L, U> {
        return new Right(fn(this.value));
    }

    override mapLeft<U>(_: (value: L) => U): Either<U, R> {
        return new Right(this.value)
    }

    override flatMap<U>(fn: (value: R) => Either<L, U>): Either<L, U> {
        return fn(this.value);
    }

    override flatMapLeft<U>(_: (value: L) => Either<U, R>): Either<U, R> {
        return new Right(this.value);
    }

    override fold<U>(_: (value: L) => U, right: (value: R) => U): U {
        return right(this.value);
    }
}

const left = <L, R>(val: L) => new Left<L, R>(val);
const right = <L, R>(val: R) => new Right<L, R>(val);

const reciprocal = (n: number): Either<string, number> => {
    if (n === 0) {
        return left('Division by zero');
    }

    return right(1 / n);
}

reciprocal(4)
    .fold(
        (left) => console.log('Left: ' + left),
        (right) => console.log('Right: ' + right)
    );

reciprocal(0)
    .fold(
        (left) => console.log('Left: ' + left),
        (right) => console.log('Right: ' + right)
    );