interface PrinterStrategy {
    // The PrinterStrategy defines the shape of the printing algorithm...
    print(): void;
}

class LaserPrinting implements PrinterStrategy {
    // ...and individual implementations define the algorithm itself
    print() {
        console.log('Printing with toner');
    }
}

class InkPrinting implements PrinterStrategy {
    print() {
        console.log('Printing with ink');
    }
}

class Office {
    // Office does not know (or care) which printer strategy will be used
    constructor (public printer: PrinterStrategy) {}

    printDocuments() {
        // It just knows that one will be provided...
        this.printer.print();
    }

    setPrinter(printer: PrinterStrategy) {
        // ...and potentially changed
        this.printer = printer;
    }
}

const office1 = new Office(new LaserPrinting());
const office2 = new Office(new InkPrinting());

office1.printDocuments(); // Printing with toner
office2.printDocuments(); // Printing with ink

office2.setPrinter(new LaserPrinting());
office2.printDocuments(); // Printing with toner