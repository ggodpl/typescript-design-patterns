class EagerSingleton {
    private static instance: EagerSingleton = new EagerSingleton();

    private constructor () {}

    static getInstance() {
        return this.instance;
    }
}

const eagerSingleton = EagerSingleton.getInstance();

class LazySingleton {
    private static instance?: LazySingleton;

    private constructor () {}

    static getInstance() {
        if (!this.instance) {
            this.instance = new LazySingleton();
        }

        return this.instance!;
    }
}

const lazySingleton = LazySingleton.getInstance();