interface Entity {
    id: number;
}

class Product implements Entity {
    constructor (public id: number, public name: string) {}
}

class Order implements Entity {
    constructor (public id: number, public createdAt: Date) {}
}

interface EntityRepository<T extends Entity> {
    save(entity: T): void;
    findById(id: number): T | undefined;
    delete(id: number): void;
}

// A change context will temporarily hold all changes made during the unit of work
class ChangeContext {
    private entities: Map<number, Entity> = new Map();

    save(id: number, entity: Entity) {
        this.entities.set(id, entity);
    }

    get(id: number) {
        return this.entities.get(id);
    }

    delete(id: number) {
        this.entities.delete(id);
    }

    // Once the unit of work is finalized, it can either commit these changes to the database...
    commit() {
        console.log(`Commiting ${this.entities.size} entities to the database`);
    }

    // ...or dispose of them if something failed
    dispose() {
        console.log(`Disposing of ${this.entities.size} entities`);
        this.entities.clear();
    }
}

class Repository<T extends Entity> implements EntityRepository<T> {
    constructor (private context: ChangeContext) {}

    save(entity: T) {
        this.context.save(entity.id, entity);
    }

    findById(id: number): T | undefined {
        return this.context.get(id) as T;
    }

    delete(id: number) {
        this.context.delete(id);
    }
}

class UnitOfWork {
    private context = new ChangeContext();

    public orders: EntityRepository<Order> = new Repository(this.context);
    public products: EntityRepository<Product> = new Repository(this.context);

    // The unit of work can either commit changes made
    commit() {
        this.context.commit();
    }

    // Or rollback to the previous state
    rollback() {
        this.context.dispose();
    }
}

function fail() {
    throw new Error('Unexpected error!');
}

const unit = new UnitOfWork();

try {
    // We do some changes that we want in the database
    unit.orders.save(new Order(1, new Date()));
    unit.orders.save(new Order(2, new Date()));
    unit.products.save(new Product(3, 'Laptop'));

    // One of the calls fails
    // We cannot commit this data anymore...
    fail();

    // ...because not everything was finished
    unit.products.save(new Product(4, 'Phone'));
    
    unit.commit();
} catch {
    console.log('Error caught!');
    // So we rollback
    unit.rollback();
}

const unit2 = new UnitOfWork();

try {
    // We do some more changes
    unit2.orders.save(new Order(4, new Date()));
    unit2.products.save(new Product(5, 'GPU'));
    unit2.products.save(new Product(6, 'Monitor'));

    // No failures this time, we can commit these changes
    unit2.commit();
} catch {
    unit2.rollback();
}