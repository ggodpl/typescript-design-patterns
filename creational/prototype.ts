interface Shape {
    getArea(): number;
    clone(): Shape;
}

class Circle implements Shape {
    constructor (private radius: number) {}

    getArea(): number {
        return this.radius * this.radius * Math.PI;
    }

    clone(): Circle {
        return new Circle(this.radius);
    }
}

class Rectangle implements Shape {
    constructor (private w: number, private h: number) {}

    getArea(): number {
        return this.w * this.h;
    }

    clone(): Rectangle {
        return new Rectangle(this.w, this.h);
    }
}

class Client {
    constructor (private prototype: Shape) {}

    createShape(): Shape {
        return this.prototype.clone();
    }
}

const circlePrototype = new Circle(10);
const circleClient = new Client(circlePrototype);
const circle = circleClient.createShape();
console.log(circle.getArea());

const rectanglePrototype = new Rectangle(10, 20);
const rectangleClient = new Client(rectanglePrototype);
const rectangle = rectangleClient.createShape();
console.log(rectangle.getArea());