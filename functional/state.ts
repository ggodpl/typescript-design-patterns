class State<S, A> {
    constructor (readonly run: (s: S) => [A, S]) {}

    static of<S, A>(a: A): State<S, A> {
        return new State((s: S) => [a, s]);
    }

    static get<S>(): State<S, S> {
        return new State((s: S) => [s, s]);
    }

    static put<S>(s: S): State<S, void> {
        return new State((_: S) => [undefined, s]);
    }

    static modify<S>(f: (s: S) => S): State<S, void> {
        return new State((s: S) => [undefined, f(s)]);
    }

    map<B>(f: (a: A) => B): State<S, B> {
        return new State((s: S) => {
            const [a, s2] = this.run(s);
            return [f(a), s2];
        });
    }

    flatMap<B>(f: (a: A) => State<S, B>) {
        return new State((s: S) => {
            const [a, s2] = this.run(s);
            return f(a).run(s2);
        });
    }
}

type GLState = {
    a: number;
    b: number;
    t: number;
    p: number;
}

const step = State.get<GLState>().flatMap(s => {
    const a = (s.a + s.b) / 2;
    const b = Math.sqrt(s.a * s.b);
    const t = s.t - s.p * (s.a - a) ** 2;
    const p = s.p * 2;

    return State.put<GLState>({ a, b, t, p });
});

const repeat = <S>(n: number, a: State<S, void>) =>
    Array.from({ length: n }).reduce((acc: State<S, void>) => acc.flatMap(() => a), State.of<S, void>(undefined));

const computePi = repeat(10, step)
    .flatMap(() => State.get<GLState>())
    .map(s => ((s.a + s.b) ** 2) / (4 * s.t));

const start: GLState = {
    a: 1,
    b: 1 / Math.sqrt(2),
    t: 0.25,
    p: 1
};

const [pi, _] = computePi.run(start);
console.log(pi);