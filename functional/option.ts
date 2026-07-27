abstract class Option<T> {
    static of<T>(value: T): Option<T> {
        if (value === null || value === undefined) return new None();
        return new Some(value);
    }

    abstract map<U>(fn: (value: T) => U): Option<U>;
    abstract flatMap<U>(fn: (value: T) => Option<U>): Option<U>;
    abstract getOr(value: T): T;
}

class Some<T> extends Option<T> {
    constructor (private readonly value: T) {
        super()
    }

    override map<U>(fn: (value: T) => U): Option<U> {
        return new Some(fn(this.value));
    }

    override flatMap<U>(fn: (value: T) => Option<U>): Option<U> {
        return fn(this.value);
    }
    
    override getOr(_: T): T {
        return this.value;
    }
}

class None<T> extends Option<T> {
    override map<U>(_: (value: T) => U): Option<U> {
        return new None<U>();
    }

    override flatMap<U>(_: (value: T) => Option<U>): Option<U> {
        return new None<U>();
    }

    override getOr(value: T): T {
        return value;
    }
}

const some = <T>(val: T) => new Some(val);
const none = <T>() => new None<T>();

const res = Option.of(5)
    .map(n => n * 2)
    .flatMap(n => n >= 10 ? some(n * 3) : none<number>())
    .map(v => v * 2);

console.log(res.getOr(10));

const res2 = none<number>();

console.log(res2.getOr(111));