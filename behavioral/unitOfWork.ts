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

    commit() {
        console.log(`Commiting ${this.entities.size} entities to the database`);
    }

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

    commit() {
        this.context.commit();
    }

    rollback() {
        this.context.dispose();
    }
}

function fail() {
    throw new Error('Unexpected error!');
}

const unit = new UnitOfWork();

try {
    unit.orders.save(new Order(1, new Date()));
    unit.orders.save(new Order(2, new Date()));
    unit.products.save(new Product(3, 'Laptop'));

    fail();

    unit.products.save(new Product(4, 'Phone'));
    
    unit.commit();
} catch {
    console.log('Error caught!');
    unit.rollback();
}

const unit2 = new UnitOfWork();

try {
    unit2.orders.save(new Order(4, new Date()));
    unit2.products.save(new Product(5, 'GPU'));
    unit2.products.save(new Product(6, 'Monitor'));

    unit2.commit();
} catch {
    unit2.rollback();
}