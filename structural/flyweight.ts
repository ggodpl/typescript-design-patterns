// If we have many objects that are similar, we can create a flyweight...
class TreeTypeFlyweight {
    // ...which holds their shared (intrinsic) state...
    constructor (public name: string, public texture: string) {}

    // ...and allows them to perform an operation with their unique (extrinsic) state
    draw(x: number, y: number) {
        console.log(`Drawing tree ${this.name} with texture ${this.texture} at x ${x}, y ${y}`);
    }
}

class TreeFactory {
    // We can create a factory which will hold all existing flyweights...
    private static flyweights: Map<string, TreeTypeFlyweight> = new Map();

    // ...and either return them, or create them if they don't exist yet
    static getTree(name: string, texture: string) {
        const key = `${name}_${texture}`;

        if (!this.flyweights.has(key)) {
            this.flyweights.set(key, new TreeTypeFlyweight(name, texture));
        }

        return this.flyweights.get(key)!;
    }

    static countTrees() {
        return this.flyweights.size;
    }
}

class TreeContext {
    // Then, if we create a context, which holds their unique state...
    constructor (public x: number, public y: number, public type: TreeTypeFlyweight) {}

    draw() {
        this.type.draw(this.x, this.y);
    }
}

const oak = TreeFactory.getTree('Oak', 'oak_texture');
const pine = TreeFactory.getTree('Pine', 'pine_texture');

const trees: TreeContext[] = [];
// ...we can use the flyweights as many times as we want...
trees.push(new TreeContext(10, 10, oak));
trees.push(new TreeContext(10, 20, oak));
trees.push(new TreeContext(10, 30, oak));
trees.push(new TreeContext(20, 10, pine));
trees.push(new TreeContext(30, 20, pine));
trees.push(new TreeContext(40, 30, pine));
trees.push(new TreeContext(20, 20, TreeFactory.getTree('Birch', 'birch_texture')));
trees.push(new TreeContext(30, 30, TreeFactory.getTree('Birch', 'birch_texture')));
trees.push(new TreeContext(40, 40, TreeFactory.getTree('Birch', 'birch_texture')));

for (const tree of trees) {
    tree.draw();
}

// ...and we will still only get the minimum amount of objects needed
console.log(TreeFactory.countTrees());