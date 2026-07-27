// Unfortunately, this file would make absolutely no sense without comments so I have to leave them here

// Since TypeScript interfaces are only structural (and do not exist at runtime),
// the inheritance-based marker interface pattern (or anti-pattern, dependending who you ask)
// can only be approximated, for example using classes instead
class Serializable {}

// We can mark the User class as serializable...
class User extends Serializable {}

const user = new User();
// ...and later if it's marked
if (user instanceof Serializable) {
    console.log('User is serializable!');
}

// This pattern is not that useful and should generally be avoided in favor of other metadata storage methods,
// but it can be useful when using the Servant pattern...
class SerializerServant {
    // ...which can now accept families of otherwise unrelated objects...
    serialize(serializable: Serializable) {
        console.log('Serialized');
    }
}

// ...or when you eventually decide to add actual shape to your marker,
// turning it into an actual abstraction...
abstract class LaterVersionOfSerializable {
    abstract serialize(): string;
}

// ...or an interface contract
interface ADifferentLaterVersionOfSerializable {
    serialize(): string;
}

// In modern TypeScript, instead of marker interfaces we can use other types of markers,
// such as Symbols...
const Serializable2 = Symbol('Serializable');

class User2 {
    [Serializable2] = true;
}

const user2 = new User2();
if (Serializable2 in user2) {
    console.log('User2 is serializable!');
}

// ...or decorators that attach marker metadata
function Serializable3<T extends { new (...args: any[]): {} }>(constructor: T) {
    return class extends constructor {
        // We can use the symbols we already discussed to hold the metadata
        [Serializable2] = true;
    }
}

function isSerializable(obj: any) {
    return Serializable2 in obj;
}

@Serializable3
class User3 {}

const user3 = new User3();
if (isSerializable(user3)) {
    console.log('User3 is serializable!')
}