class Point {
    private constructor (public x: number, public y: number) {}

    // Instead of creating the same object manually over and over
    // we can create a named constructor, which is just a static method
    // returning the constructed instance
    // This pattern is also called Static factory
    static origin() {
        return new Point(0, 0);
    }

    static fromTuple(tuple: [number, number]) {
        return new Point(tuple[0], tuple[1]);
    }
}

const point1 = Point.origin();
const point2 = Point.fromTuple([1, 2]);