class EagerSingleton {
    // An eager singleton immediately creates the static instance it holds...
    private static instance: EagerSingleton = new EagerSingleton();

    private constructor () {}

    static getInstance() {
        // ...so it can be easily returned later
        return this.instance;
    }
}

const eagerSingleton = EagerSingleton.getInstance();

class LazySingleton {
    // A lazy singleton does not instantiate the instance...
    private static instance?: LazySingleton;

    private constructor () {}

    static getInstance() {
        if (!this.instance) {
            // ...until it's actually needed
            this.instance = new LazySingleton();
        }

        return this.instance!;
    }
}

const lazySingleton = LazySingleton.getInstance();