class Position {
    constructor (public x: number, public y: number) {}
}

interface Movable {
    setPosition(pos: Position): void;
    getPosition(): Position;
}

class Entity implements Movable {
    constructor (private position: Position) {}

    setPosition(pos: Position) {
        this.position = pos;
    }

    getPosition(): Position {
        return this.position;
    }
}

class GameObject implements Movable {
    constructor (private position: Position) {}

    setPosition(pos: Position) {
        console.log('Position moved');
        this.position = pos;
    }

    getPosition(): Position {
        return this.position;
    }
}

class MoveServant {
    moveBy(movable: Movable, dx: number, dy: number) {
        const { x, y } = movable.getPosition();
        movable.setPosition(new Position(x + dx, y + dy));
    }

    moveTo(movable: Movable, pos: Position) {
        movable.setPosition(pos);
    }
}

const entity = new Entity(new Position(10, 10));
const gameObject = new GameObject(new Position(0, 0));
const servant = new MoveServant();

servant.moveBy(entity, 5, 10);
servant.moveTo(gameObject, new Position(10, 10));

console.log(entity.getPosition());
console.log(gameObject.getPosition());