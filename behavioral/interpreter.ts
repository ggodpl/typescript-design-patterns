interface Expression {
    interpret(): number;
}

class NumberExpression implements Expression {
    constructor (private value: number) {}

    interpret(): number {
        return this.value;
    }
}

abstract class BinaryExpression implements Expression {
    constructor (protected left: Expression, protected right: Expression) {}

    abstract interpret(): number;
}

class AdditionExpression extends BinaryExpression {
    override interpret(): number {
        return this.left.interpret() + this.right.interpret();
    }
}

class MultiplicationExpression extends BinaryExpression {
    override interpret(): number {
        return this.left.interpret() * this.right.interpret();
    }
}

const result = new MultiplicationExpression(
    new AdditionExpression(new NumberExpression(10), new NumberExpression(20)),
    new NumberExpression(3)
);

console.log(result.interpret());