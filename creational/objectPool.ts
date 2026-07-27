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

// This implementation of the Object Pool is entirely static, but it doesn't have to be
class ObjectPool {
    private static EXPIRY_TIME = 10000;
    private static locked: Map<PooledObject, number> = new Map();
    private static unlocked: Map<PooledObject, number> = new Map();

    // Gets an object from the pool
    static getObject(): PooledObject {
        const now = Date.now();
        // If there are any pooled objects that are available for use...
        if (this.unlocked.size > 0) {
            // ...iterate through them
            for (const [object, time] of this.unlocked.entries()) {
                // If the object is expired...
                if (now - time > this.EXPIRY_TIME) {
                    // ...delete it from the pool
                    this.unlocked.delete(object);
                } else {
                    // Otherwise, lock the object...
                    this.unlocked.delete(object);
                    this.locked.set(object, now);
                    // ...and return it
                    return object;
                }
            }
        }

        // Otherwise, return a newly created object
        return this.create(now);
    }

    static create(now: number): PooledObject {
        const object = new PooledObject();
        // Since the object can only be created if it's currently needed, we lock it automatically
        this.locked.set(object, now);
        return object;
    }

    static release(object: PooledObject) {
        // If the object was not checked out (locked), it doesn't originate from the pool
        // and we cannot accept it
        if (!this.locked.has(object)) throw new Error('Object not checked out');

        // Otherwise, we reset the object to a neutral state...
        this.cleanup(object);
        // ...and unlock it
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