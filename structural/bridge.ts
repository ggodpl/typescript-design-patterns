interface Color {
    name(): string;
}

// If we have one class hierarchy (in literature called an "implementor",
// because it contains some implementation that Shape will use)...
class Blue implements Color {
    name(): string {
        return 'blue';
    }
}

class Red implements Color {
    name(): string {
        return 'red';
    }
}

// ...and another one (in literature called an "abstraction")...
abstract class Shape {
    // ...we can create a bridge between them...
    constructor (public color: Color) {}
    abstract draw(): void;
}

class Circle extends Shape {
    // ...allowing concrete implementations (in literature called "refined abstractions") to use them in "refined functions"...
    draw() {
        // ...without knowing or caring how they are implemented
        console.log(`Drawing a ${this.color.name()} circle`);
    }
}

class Triangle extends Shape {
    draw() {
        console.log(`Drawing a ${this.color.name()} triangle`);
    }
}

const redCircle = new Circle(new Red());
const blueTriangle = new Triangle(new Blue());

redCircle.draw();
blueTriangle.draw();