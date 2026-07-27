class PooledObject {
    private val: number;

    constructor () {
        this.val = 0;
        console.log('New PooledObject constructed');
    }
    
    setValue(val: number) {
        this.val = val;
    }

    getValue() {
        return this.val;
    }

    cleanup() {
        console.log('Resetting the PooledObject');
        this.val = 0;
    }
}

class ObjectPool {
    private static EXPIRY_TIME = 10000;
    private static locked: Map<PooledObject, number> = new Map();
    private static unlocked: Map<PooledObject, number> = new Map();

    static getObject(): PooledObject {
        const now = Date.now();
        if (this.unlocked.size > 0) {
            for (const [object, time] of this.unlocked.entries()) {
                if (now - time > this.EXPIRY_TIME) {
                    this.unlocked.delete(object);
                } else {
                    this.unlocked.delete(object);
                    this.locked.set(object, now);
                    return object;
                }
            }
        }

        return this.create(now);
    }

    static create(now: number): PooledObject {
        const object = new PooledObject();
        this.locked.set(object, now);
        return object;
    }

    static release(object: PooledObject) {
        if (!this.locked.has(object)) throw new Error('Object not checked out');

        this.cleanup(object);
        this.unlocked.set(object, Date.now());
        this.locked.delete(object);
    }

    static cleanup(object: PooledObject) {
        object.cleanup();
    }
}

const object = ObjectPool.getObject();
object.setValue(1000);
console.log(object.getValue());

ObjectPool.release(object);

const object2 = ObjectPool.getObject();
console.log(object2.getValue());
object2.setValue(2000);
console.log(object2.getValue());