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
    static admin() {
        return new User('admin@example.mail', UserRole.Admin);
    }

    static guest() {
        return new User('guest@example.mail', UserRole.Guest);
    }
}

const adminUser = UserMother.admin();
adminUser.print();

const guestUser = UserMother.guest();
guestUser.print();