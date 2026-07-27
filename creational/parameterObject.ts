interface UserCreationRequest {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    role: string;
}

class UserService {
    // Instead of having methods with a large number of parameters
    // we can create a Parameter Object
    createUser(request: UserCreationRequest) {
        console.log('Creating a new user');
        console.log('First and last name: ' + request.firstName + ' ' + request.lastName);
        console.log('E-mail: ' + request.email);
        console.log('Phone number: ' + request.phoneNumber);
        console.log('Role: ' + request.role);
    }
}

const userService = new UserService();
const request: UserCreationRequest = {
    firstName: 'Bob',
    lastName: 'Smith',
    email: 'bob-smith@example.mail',
    phoneNumber: '123-456-789',
    role: 'Administrator'
};

userService.createUser(request);