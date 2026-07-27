// The Option monad is an alternative to the null value
// It can be either Some<T> when value of type T is present,
// and None<T> otherwise
abstract class Option<T> {
    static of<T>(value: T): Option<T> {
        if (value === null || value === undefined) return new None();
        return new Some(value);
    }

    abstract map<U>(fn: (value: T) => U): Option<U>;
    abstract flatMap<U>(fn: (value: T) => Option<U>): Option<U>;
    abstract getOr(value: T): T;
    // Proper Option implementations may also include functions like unwrap, unwrapOr, filter, fold, and a bunch of others
}

class Some<T> extends Option<T> {
    constructor (private readonly value: T) {
        super()
    }

    override map<U>(fn: (value: T) => U): Option<U> {
        // We return a new Some with the transformed value
        return new Some(fn(this.value));
    }

    override flatMap<U>(fn: (value: T) => Option<U>): Option<U> {
        // We return the transformed Option
        return fn(this.value);
    }
    
    override getOr(_: T): T {
        // We return the value
        return this.value;
    }
}

class None<T> extends Option<T> {
    override map<U>(_: (value: T) => U): Option<U> {
        // None doesn't hold any value, we just return a new None
        return new None<U>();
    }

    override flatMap<U>(_: (value: T) => Option<U>): Option<U> {
        // Same thing as above
        return new None<U>();
    }

    override getOr(value: T): T {
        // We return the default value
        return value;
    }
}

// Helper functions, completely optional
const some = <T>(val: T) => new Some(val);
const none = <T>() => new None<T>();

const res = Option.of(5)
    .map(n => n * 2)
    .flatMap(n => n >= 10 ? some(n * 3) : none<number>())
    .map(v => v * 2);

console.log(res.getOr(10));

const res2 = none<number>();

console.log(res2.getOr(111));