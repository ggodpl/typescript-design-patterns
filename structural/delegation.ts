interface Printer {
    print(document: string): void;
}

class ConsolePrinter implements Printer {
    print(document: string) {
        console.log('Printing a document: ' + document);
    }
}

class Report {
    constructor (private reportName: string, private printer: Printer) {}

    generate() {
        // The print function is delegated to the printer
        this.printer.print(this.reportName);
    }
}

const printer = new ConsolePrinter();
const report = new Report('Monthly report', printer);

report.generate();