interface PrinterStrategy {
    print(): void;
}

class LaserPrinting implements PrinterStrategy {
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
    constructor (public printer: PrinterStrategy) {}

    printDocuments() {
        this.printer.print();
    }

    setPrinter(printer: PrinterStrategy) {
        this.printer = printer;
    }
}

const office1 = new Office(new LaserPrinting());
const office2 = new Office(new InkPrinting());

office1.printDocuments(); // Printing with toner
office2.printDocuments(); // Printing with ink

office2.setPrinter(new LaserPrinting());
office2.printDocuments(); // Printing with toner