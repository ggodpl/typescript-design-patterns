interface Color {
    name(): string;
}

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

abstract class Shape {
    constructor (public color: Color) {}
    abstract draw(): void;
}

class Circle extends Shape {
    draw() {
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