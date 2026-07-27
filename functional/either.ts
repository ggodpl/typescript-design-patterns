// The Either monad will let us return either the Left or the Right value,
// with the Left value conventionally being a failure and the Right value being a success
// You can use Either to represent any two-branch decision
// Either is a generalization of the Result monad
// This implementation uses an abstract class, but it is not the only way to achieve this result
// For demonstration purposes the Result monad uses a discriminated union
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
        // Since the map function only applies to the Right value,
        // we just return a Left with the new Right type
        return new Left(this.value);
    }

    override mapLeft<U>(fn: (value: L) => U): Either<U, R> {
        // We return a new Left with the transformed value
        return new Left(fn(this.value));
    }

    override flatMap<U>(_: (value: R) => Either<L, U>): Either<L, U> {
        // Same thing as above, flatMap only applies to the Right value
        return new Left(this.value);
    }

    override flatMapLeft<U>(fn: (value: L) => Either<U, R>): Either<U, R> {
        // We return the transformed Either
        return fn(this.value);
    }

    override fold<U>(left: (value: L) => U, _: (value: R) => U): U {
        // Fold applies to both, we call the left function with our value
        return left(this.value);
    }
}

class Right<L, R> extends Either<L, R> {
    constructor (private readonly value: R) {
        super();
    }
    
    // The exact opposite of Left
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

// Helper functions, completely optional
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