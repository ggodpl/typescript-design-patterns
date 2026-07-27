enum UserRole {
    Guest,
    User,
    Admin
}

class User {
    constructor (public email: string, public role: UserRole) {}

    print() {
        console.log(`E-mail: ${this.email}, role: ${this.role}`);
    }
}

// We can create multiple test objects...
const ADMIN_USER = new User('admin@example.mail', UserRole.Admin);
const GUEST_USER = new User('guest@example.mail', UserRole.Guest);

// ...and use them throughout our testing
ADMIN_USER.print();
GUEST_USER.print();