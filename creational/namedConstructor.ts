class Point {
    private constructor (public x: number, public y: number) {}

    static origin() {
        return new Point(0, 0);
    }

    static fromTuple(tuple: [number, number]) {
        return new Point(tuple[0], tuple[1]);
    }
}

const point1 = Point.origin();
const point2 = Point.fromTuple([1, 2]);