interface Spec<T> {
    isSatisfiedBy(candidate: T): boolean;
    and(spec: Spec<T>): Spec<T>;
    or(spec: Spec<T>): Spec<T>;
    not(): Spec<T>;
}

abstract class BaseSpec<T> implements Spec<T> {
    abstract isSatisfiedBy(candidate: T): boolean;
    
    and(spec: Spec<T>): Spec<T> {
        return new AndSpec(this, spec);
    }

    or(spec: Spec<T>): Spec<T> {
        return new OrSpec(this, spec);
    }

    not(): Spec<T> {
        return new NotSpec(this);
    }
}

abstract class BinarySpec<T> extends BaseSpec<T> {
    constructor (public readonly left: Spec<T>, public readonly right: Spec<T>) {
        super();
    }
}

class AndSpec<T> extends BinarySpec<T> {
    override isSatisfiedBy(candidate: T): boolean {
        return this.left.isSatisfiedBy(candidate) && this.right.isSatisfiedBy(candidate);
    }
}

class OrSpec<T> extends BinarySpec<T> {
    override isSatisfiedBy(candidate: T): boolean {
        return this.left.isSatisfiedBy(candidate) || this.right.isSatisfiedBy(candidate);
    }
}

class NotSpec<T> extends BaseSpec<T> {
    constructor (public readonly wrapper: Spec<T>) {
        super();
    }

    override isSatisfiedBy(candidate: T): boolean {
        return !this.wrapper.isSatisfiedBy(candidate);
    }
}

class Invoice {
    constructor (public overdue: boolean, public sent: boolean, public id: string) {}
}

class OverdueSpec extends BaseSpec<Invoice> {
    override isSatisfiedBy(candidate: Invoice): boolean {
        return candidate.overdue;
    }
}

class SentSpec extends BaseSpec<Invoice> {
    override isSatisfiedBy(candidate: Invoice): boolean {
        return candidate.sent;
    }
}

const canSendInvoice = new OverdueSpec().and(new SentSpec().not());

const invoices = [
    new Invoice(true, true, 'ID-123'),
    new Invoice(false, false, 'ID-456'),
    new Invoice(true, false, 'ID-789'),
];

for (const invoice of invoices) {
    if (canSendInvoice.isSatisfiedBy(invoice)) {
        console.log(invoice.id);
    }
}