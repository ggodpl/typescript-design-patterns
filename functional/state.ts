// The State monad represents a computation that reads a state,
// produces a result of type A, and returns a new state of type S
class State<S, A> {
    // The run method executes the state computation
    // It receives a state and returns a result along with the updated state
    constructor (readonly run: (s: S) => [A, S]) {}

    static of<S, A>(a: A): State<S, A> {
        // Creates a computation that returns "a" without changing the state
        // It lifts a normal value into the State context
        return new State((s: S) => [a, s]);
    }

    static get<S>(): State<S, S> {
        // Gets the current state by putting it in the result
        return new State((s: S) => [s, s]);
    }

    static put<S>(s: S): State<S, void> {
        // Replaces the current state with a new state without producing a meaningful result
        return new State((_: S) => [undefined, s]);
    }

    static modify<S>(f: (s: S) => S): State<S, void> {
        // Applies a function to the current state to produce a new state
        return new State((s: S) => [undefined, f(s)]);
    }

    map<B>(f: (a: A) => B): State<S, B> {
        // Transforms the result of the computation while leaving the state unchanged
        return new State((s: S) => {
            const [a, s2] = this.run(s);
            return [f(a), s2];
        });
    }

    flatMap<B>(f: (a: A) => State<S, B>) {
        // Chains state computations together
        // The result of this computation determines the next computation to run
        return new State((s: S) => {
            const [a, s2] = this.run(s);
            return f(a).run(s2);
        });
    }
}

// The state shape can be arbitrary
// In this specific case it holds variables needed for the Gauss-Legendre algorithm
type GLState = {
    a: number;
    b: number;
    t: number;
    p: number;
}

// The State monad can describe complex behavior...
const step = State.get<GLState>().flatMap(s => {
    const a = (s.a + s.b) / 2;
    const b = Math.sqrt(s.a * s.b);
    const t = s.t - s.p * (s.a - a) ** 2;
    const p = s.p * 2;

    return State.put<GLState>({ a, b, t, p });
});

const repeat = <S>(n: number, a: State<S, void>) =>
    Array.from({ length: n }).reduce((acc: State<S, void>) => acc.flatMap(() => a), State.of<S, void>(undefined));

// ...such as computing Pi using the Gauss-Legendre algorithm for Pi
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