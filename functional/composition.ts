interface BasicInfo {
    firstName: string;
    lastName: string;
}

interface ContactInfo {
    phoneNumber: string;
    email: string;
}

type User = BasicInfo & ContactInfo;

const user: User = {
    firstName: 'William',
    lastName: 'Williams',
    phoneNumber: '987-654-321',
    email: 'william.williams@example.mail'
};

const updateBasicInfo = (update: Partial<BasicInfo>) => (user: User) => ({
    ...user,
    ...update
});

const updateContactInfo = (update: Partial<ContactInfo>) => (user: User) => ({
    ...user,
    ...update
});

const compose = <T>(...functions: ((v: T) => T)[]) => (value: T) => functions.reduceRight((result, fn) => fn(result), value);

const composedUpdate = compose(updateBasicInfo({ lastName: 'Johns' }), updateContactInfo({ phoneNumber: '123-456-789' }));
const newUser = composedUpdate(user);
console.log(newUser);

type Fn = (arg: any) => any;

type Compose<Fns extends readonly Fn[]> = Fns extends readonly [infer F extends Fn]
    ? F
    : Fns extends readonly [infer F extends Fn, ...infer Rest extends Fn[]]
        ? Compose<Rest> extends (arg: infer RestArg) => infer RestReturn
            ? F extends (arg: RestReturn) => infer FReturn
                ? (arg: RestArg) => FReturn
                : never
            : never
        : never;

type LastArg<Fns extends readonly Fn[]> = Fns extends readonly [...infer _Rest, infer F extends Fn]
    ? F extends (arg: infer T) => any
        ? T
        : never
    : never;

const betterCompose = <Fns extends readonly Fn[]>(...functions: Fns): Compose<Fns> => ((value: LastArg<Fns>) => functions.reduceRight((result, fn) => fn(result), value)) as Compose<Fns>;