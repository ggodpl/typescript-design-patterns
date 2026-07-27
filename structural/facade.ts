interface ProgramNode {}

// If we have a complex subsystem (like this fake interpreter)...
class Lexer {
    tokenize(source: string): string[] {
        console.log(`Tokenizing... (source length: ${source.length})`);
        return [];
    }
}

class Parser {
    parse(tokens: string[]): ProgramNode[] {
        console.log(`Parsing... (tokens: ${tokens.length})`);
        return [];
    }
}

class Interpreter {
    interpret(ast: ProgramNode[]) {
        console.log(`Interpreting... (nodes: ${ast.length})`);
    }
}

// ...we can create a facade...
class InterpreterFacade {
    private lexer: Lexer = new Lexer();
    private parser: Parser = new Parser();
    private interpreter: Interpreter = new Interpreter();

    // ...that provides a simplified interface for the entire process
    run(source: string) {
        const tokens = this.lexer.tokenize(source);
        const programNodes = this.parser.parse(tokens);
        this.interpreter.interpret(programNodes);    
    }
}

const facade = new InterpreterFacade();
facade.run('let a = 1');