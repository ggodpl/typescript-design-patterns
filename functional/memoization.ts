// If we know a specific function always returns the same value for the same set of arguments
// We can memoize it by storing the return value for each call
const memoize = <Args extends unknown[], R>(fn: (...args: Args) => R) => {
    const results = new Map<string, R>();

    return (...args: Args) => {
        // This solution will fail for any non-serializable types, but it's good enough for a simple example
        // Production memoizers use a combination of Maps and WeakMaps to properly store results,
        // even if arguments are complex
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

// This allows us to cut down the total amount of function calls
// Which may be more expensive than a lookup
const memoizedFibonacci: (n: number) => number = memoize((n: number) => {
    console.log('Getting the ' + n + ' fibonacci number')
    if (n < 2) return n;
    return memoizedFibonacci(n - 1) + memoizedFibonacci(n - 2);
});

memoizedFibonacci(3);