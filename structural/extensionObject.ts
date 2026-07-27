// If we want to add behavioral extensions to our object without modifying it, 
// we can define a general shape for all extensions...
interface DocumentExtension {
    execute(): void;
}

type ExtensionClass<T extends DocumentExtension> = new (document: Document) => T;

class Document {
    // ...and create a map of extensions that the object will hold...
    private extensions: Map<Function, DocumentExtension> = new Map();

    constructor (public name: string) {}

    // ...allowing us to add...
    addExtension(extension: DocumentExtension) {
        this.extensions.set(extension.constructor, extension);
    }

    // ...and query extensions dynamically
    // This specific implementation uses the constructor as the key,
    // but you can use names, enums, tags, or whatever you want
    getExtension<T extends DocumentExtension>(extension: ExtensionClass<T>) {
        return this.extensions.get(extension) as T | undefined;
    }
}

// Then, if we want to add a new extension, we simply create a new extension class...
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
// ...and register it with our document...
document.addExtension(new PrintExtension(document));
document.addExtension(new SpellCheckingExtension(document));

// ...which lets us query...
const printer = document.getExtension(PrintExtension);
// ...and use it later
printer?.print();

const spellChecker = document.getExtension(SpellCheckingExtension);
spellChecker?.check();