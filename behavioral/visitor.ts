interface FileSystemElement {
    accept(visitor: FileSystemVisitor): void;
}

interface FileSystemVisitor {
    visitFile(file: File): void;
    visitDirectory(directory: Directory): void;
}

class File implements FileSystemElement {
    constructor (public name: string) {}

    accept(visitor: FileSystemVisitor) {
        visitor.visitFile(this);
    }
}

class Directory implements FileSystemElement {
    elements: FileSystemElement[] = [];

    constructor (public name: string) {}

    addElement(element: FileSystemElement) {
        this.elements.push(element);
    }

    accept(visitor: FileSystemVisitor) {
        visitor.visitDirectory(this);
    }
}

class ViewVisitor implements FileSystemVisitor {
    visitFile(file: File) {
        console.log('Viewing file: ' + file.name);
    }

    visitDirectory(directory: Directory) {
        console.log('Viewing directory: ' + directory.name);
        
        for (const element of directory.elements) {
            element.accept(this);
        }
    }
}

class DeleteVisitor implements FileSystemVisitor {
    visitFile(file: File) {
        console.log('Deleting file: ' + file.name);
    }

    visitDirectory(directory: Directory) {
        for (const element of directory.elements) {
            element.accept(this);
        }

        console.log('Deleting directory: ' + directory.name);
    }
}

const directory = new Directory('My Files');
const directory2 = new Directory('Code');
directory2.addElement(new File('visitor.ts'));
directory2.addElement(new File('helloWorld.ts'));
directory.addElement(directory2);
directory.addElement(new File('picture.jpg'));

const viewVisitor = new ViewVisitor();
const deleteVisitor = new DeleteVisitor();

directory.accept(viewVisitor);
directory.accept(deleteVisitor);