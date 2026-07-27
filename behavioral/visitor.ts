interface FileSystemElement {
    // Every file system element knows how to accept a visitor
    accept(visitor: FileSystemVisitor): void;
}

interface FileSystemVisitor {
    // And the visitor knows how to visit file system elements
    // It may or may not know how to visit every single type of an element,
    // and may choose to skip elements
    visitFile(file: File): void;
    visitDirectory(directory: Directory): void;
}

class File implements FileSystemElement {
    constructor (public name: string) {}

    accept(visitor: FileSystemVisitor) {
        visitor.visitFile(this);
    }
}

// Since the directory contains FileSystemElements and is itself a FileSystemElement,
// this is also an example of the Composite pattern
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

    // Pre-order traversal, print parent before children
    visitDirectory(directory: Directory) {
        console.log('Viewing directory: ' + directory.name);
        
        // The visitor makes the decision whether or not to visit children of a directory
        // Some implementations move the control to the element itself 
        // (so a directory would accept all files it contains)
        // This approach works too, but I chose this one because it allows more control
        // such as choosing whether the visitor will visit each child (like a filter)
        // or if we want pre-order or post-order traversal...
        for (const element of directory.elements) {
            element.accept(this);
        }
    }
}

class DeleteVisitor implements FileSystemVisitor {
    visitFile(file: File) {
        console.log('Deleting file: ' + file.name);
    }

    // ...which is very useful for some visitors, like this one
    // Post-order traversal, delete children before the parent
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