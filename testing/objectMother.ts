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

class UserMother {
    // We can use static factories to create example objects...
    static admin() {
        return new User('admin@example.mail', UserRole.Admin);
    }

    static guest() {
        return new User('guest@example.mail', UserRole.Guest);
    }
}

// ...which we can easily use during testing
const adminUser = UserMother.admin();
adminUser.print();

const guestUser = UserMother.guest();
guestUser.print();