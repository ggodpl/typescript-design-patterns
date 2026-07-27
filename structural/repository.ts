class Product {
    constructor (public id: number, public name: string, public price: number) {}

    clone() {
        return new Product(this.id, this.name, this.price);
    }
}

interface ProductRepository {
    save(product: Product): void;
    findById(id: number): Product | undefined;
    delete(id: number): void;
}

class InMemoryProductRepository implements ProductRepository {
    private products: Map<number, Product> = new Map();

    save(product: Product) {
        this.products.set(product.id, product.clone());
    }

    findById(id: number): Product | undefined {
        const product = this.products.get(id);
        return product?.clone();
    }

    delete(id: number) {
        this.products.delete(id);
    }
}

const storage = new InMemoryProductRepository();

const apple = new Product(1, 'Apple', 1.99);
const banana = new Product(2, 'Banana', 2.29);

storage.save(apple);
storage.save(banana);

console.log(storage.findById(banana.id));

storage.delete(banana.id);
console.log(storage.findById(banana.id));

apple.price = 2.99;
storage.save(apple);
console.log(storage.findById(apple.id));