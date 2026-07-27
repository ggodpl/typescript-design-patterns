type Lens<S, A> = {
    get: (s: S) => A;
    set: (a: A, s: S) => S;
}

const lens = <S, K extends keyof S>(key: K): Lens<S, S[K]> => ({
    get: (s) => s[key],
    set: (a, s) => ({ ...s, [key]: a })
});

const user = { name: 'Bob', age: 25 };

const nameLens = lens<typeof user, 'name'>('name');

const userName = nameLens.get(user);
console.log(userName);

const user2 = nameLens.set('John', user);
console.log(user2);

const composeLens = <S, A, B>(outer: Lens<S, A>, inner: Lens<A, B>): Lens<S, B> => ({
    get: (s) => inner.get(outer.get(s)),
    set: (b, s) => outer.set(inner.set(b, outer.get(s)), s)
});

type AdvancedUser = {
    name: string;
    address: {
        street: string;
        city: string;
    }
}

const advancedUser: AdvancedUser = {
    name: 'John',
    address: {
        street: 'Main St',
        city: 'London'
    }
}

const addressLens = lens<AdvancedUser, 'address'>('address');
const addressStreetLens = lens<AdvancedUser['address'], 'street'>('street');

const streetLens = composeLens(addressLens, addressStreetLens);

console.log(streetLens.get(advancedUser));
console.log(streetLens.set('Side St', advancedUser));