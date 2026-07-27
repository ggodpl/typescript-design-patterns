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

const ADMIN_USER = new User('admin@example.mail', UserRole.Admin);
const GUEST_USER = new User('guest@example.mail', UserRole.Guest);

ADMIN_USER.print();
GUEST_USER.print();