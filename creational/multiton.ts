enum MultitonInstance {
    One,
    Two,
    Three
}

class EagerMultiton {
    private static instances: Map<MultitonInstance, EagerMultiton> = new Map();

    private static initialize() {
        this.instances.set(MultitonInstance.One, new EagerMultiton('one'));
        this.instances.set(MultitonInstance.Two, new EagerMultiton('two'));
        this.instances.set(MultitonInstance.Three, new EagerMultiton('three'));
    }

    static {
        this.initialize();
    }

    private constructor (private name: string) {}

    static getInstance(instance: MultitonInstance) {
        if (!this.instances.has(instance)) throw new Error('No instance found');

        return this.instances.get(instance)!;
    }

    printName() {
        console.log(this.name);
    }
}

const eagerMultiton1 = EagerMultiton.getInstance(MultitonInstance.One);
eagerMultiton1.printName();
const eagerMultiton2 = EagerMultiton.getInstance(MultitonInstance.Two);
eagerMultiton2.printName();
const eagerMultiton3 = EagerMultiton.getInstance(MultitonInstance.Three);
eagerMultiton3.printName();

class LazyMultiton {
    private static instances: Map<MultitonInstance, LazyMultiton> = new Map();

    private constructor (private instance: MultitonInstance) {}
    
    static getInstance(instance: MultitonInstance) {
        if (!this.instances.has(instance)) {
            this.instances.set(instance, new LazyMultiton(instance));
        }

        return this.instances.get(instance)!;
    }

    printInstance() {
        console.log(this.instance);
    }

    static countInstances() {
        console.log(this.instances.size);
    }
}

const lazyMultiton1 = LazyMultiton.getInstance(MultitonInstance.One);
lazyMultiton1.printInstance();
LazyMultiton.countInstances();
const lazyMultiton2 = LazyMultiton.getInstance(MultitonInstance.Two);
lazyMultiton2.printInstance();
LazyMultiton.countInstances();
const lazyMultiton3 = LazyMultiton.getInstance(MultitonInstance.Three);
lazyMultiton3.printInstance();
LazyMultiton.countInstances();