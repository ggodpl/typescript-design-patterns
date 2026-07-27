interface DocumentExtension {
    execute(): void;
}

type ExtensionClass<T extends DocumentExtension> = new (document: Document) => T;

class Document {
    private extensions: Map<Function, DocumentExtension> = new Map();

    constructor (public name: string) {}

    addExtension(extension: DocumentExtension) {
        this.extensions.set(extension.constructor, extension);
    }

    getExtension<T extends DocumentExtension>(extension: ExtensionClass<T>) {
        return this.extensions.get(extension) as T | undefined;
    }
}

class PrintExtension implements DocumentExtension {
    constructor (private document: Document) {}

    execute() {
        console.log('Printing document ' + this.document.name);
    }

    print() {
        this.execute();
    }
}

class SpellCheckingExtension implements DocumentExtension {
    constructor (private document: Document) {}

    execute() {
        console.log('Spell-checking document ' + this.document.name);
    }

    check() {
        this.execute();
    }
}

const document = new Document('Financial report');
document.addExtension(new PrintExtension(document));
document.addExtension(new SpellCheckingExtension(document));

const printer = document.getExtension(PrintExtension);
printer?.print();

const spellChecker = document.getExtension(SpellCheckingExtension);
spellChecker?.check();