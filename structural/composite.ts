interface FileSystemComponent {
    display(): void;
    delete(): void;
}

class File implements FileSystemComponent {
    constructor (private name: string, private size: number) {}

    display() {
        console.log(`File "${this.name}" (${this.size} B)`);
    }

    delete() {
        console.log('Deleting file ' + this.name);
    }
}

// The directory is a file system components...
class Directory implements FileSystemComponent {
    // ...and holds other file system components
    // This means that it's both a component and a composition of components...
    private components: FileSystemComponent[] = [];

    constructor (private name: string) {}

    // ...and is treated as both at the same time
    display() {
        console.log('Directory: ' + this.name);
        for (const component of this.components) {
            component.display();
        }
    }

    delete() {
        console.log('Deleting directory ' + this.name);
        for (const component of this.components) {
            component.delete();
        }
    }

    addComponent(component: FileSystemComponent) {
        this.components.push(component);
    }
}

const file1 = new File('image.jpg', 24700);
const file2 = new File('composite.ts', 1239); 

const directory = new Directory('My Files');
directory.addComponent(file1);
directory.addComponent(file2);

directory.display();
directory.delete();