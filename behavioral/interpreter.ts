interface Expression {
    // Each expression has to be interpretable
    interpret(): number;
}

class NumberExpression implements Expression {
    constructor (private value: number) {}

    // Some expressions are very simple and return the value they hold
    interpret(): number {
        return this.value;
    }
}

abstract class BinaryExpression implements Expression {
    // Some expressions are composed from other expressions
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

// Since every node is an expression, we can very easily create more complex structures out of them
// This example represents expressions as Abstract Syntax Tree nodes (AST nodes)
// More complex examples could include lexers and parsers, which let you write your grammar as actual code
// Such as "(10 + 20) * 3"
const result = new MultiplicationExpression(
    new AdditionExpression(new NumberExpression(10), new NumberExpression(20)),
    new NumberExpression(3)
);

console.log(result.interpret());