const memoize = <Args extends unknown[], R>(fn: (...args: Args) => R) => {
    const results = new Map<string, R>();

    return (...args: Args) => {
        const key = JSON.stringify(args);
        
        if (results.has(key)) return results.get(key)!;

        const result = fn(...args);
        results.set(key, result);
        return result;
    }
}

const fibonacci = (n: number): number => {
    console.log('Getting the ' + n + ' fibonacci number')
    if (n < 2) return n;
    return fibonacci(n - 1) + fibonacci(n - 2);
}

fibonacci(3);

const memoizedFibonacci: (n: number) => number = memoize((n: number) => {
    console.log('Getting the ' + n + ' fibonacci number')
    if (n < 2) return n;
    return memoizedFibonacci(n - 1) + memoizedFibonacci(n - 2);
});

memoizedFibonacci(3);