# Design and Software Architecture Patterns in TypeScript
A collection of 88 software design, architecture, concurrency, functional, and distributed systems patterns implemented in TypeScript.

The goal I have with this repository is to provide simple and (hopefully) readable examples of different design patterns and their implementations. Each is implemented as a standalone TypeScript file with no dependencies (except for concurrency patterns, which use `node:worker_threads` to achieve parallelism and `node:path` for spawning the worker). The worker files in the concurrency folder are not runnable directly, they have to be started by their respective main file (i.e. they have to *be a worker*).

This repository is meant for *educational purposes* and the provided examples are **NOT** production-ready code. In some of the files I included information on what a production-ready implementation would include, but it does not mean that patterns that don't have these disclaimers can be copy and pasted into your production codebases. They are intended to be read and understood so you can apply them intentionally in your next project. All examples simplify the infrastructure as much as possible, focusing only on the actual pattern.

All of the files contain lots of comment which can hopefully help you understand why these patterns are designed that way. If you want to let the code speak for itself without me talking over it, you can view the no-comments branch.

Also, *ALL* of the code and comments are human-written. Since a lot of AI-generated code is heavily commented and very verbose, some people may flag it as vibecoded examples, but every single example was written and commented by me. The reason it looks like this is because it's meant to be educational and easily readable, so it doesn't use any clever shorthands, short variable names or a lot of syntactic sugar, which makes it look a little unnatural.

## Feedback
I am always open to all forms of feedback! If you spot a mistake or a bug in any of the examples or want to contribute, feel free to open Issues or Pull Requests.

## Running examples
Since every file is self-contained, you can simply run it directly using tools like ts-node:
```
npx ts-node behavioral/visitor.ts
```
or compile the project and run the generated JavaScript files:
```
tsc
node dist/concurrency/mutext.js
```

Note: The RAII example requires explicit resource management, which is currently a [Stage 3 proposal](https://github.com/tc39/proposal-explicit-resource-management). Make sure that your Node version supports it and you're on TypeScript 5.2+.

## Patterns covered
Here is a list of all covered patterns. It also has more formal descriptions of each of the patterns, similar to what you may find in literature (some are shamelessly ripped from the Wikipedia article about Software design patterns).
### Creational patterns
| Name | Description | File |
|------|-------------|------|
| Abstract Factory | Creates families of related objects without specifying concrete classes | [`abstractFactory.ts`](creational/abstractFactory.ts) |
| Builder | Separates the construction of objects from their representation | [`builder.ts`](creational/builder.ts) |
| Dependency Injection | Provides dependencies from outside instead of creating them internally | [`dependencyInjection.ts`](creational/dependencyInjection.ts) |
| Dependency Injection Container | Manages object creation and automatically resolves dependencies using a centralized container | [`dependencyInjectionContainer.ts`](creational/dependencyInjectionContainer.ts) |
| Faceted Builder | Splits a builder into multiple smaller builders | [`facetedBuilder.ts`](creational/facetedBuilder.ts) |
| Factory | Encapsulates object creation in a function or a class | [`factory.ts`](creational/factory.ts) |
| Factory Method | Defines an interface for creating objects while allowing subclasses to decide the type | [`factoryMethod.ts`](creational/factoryMethod.ts) |
| Lazy Initialization | Delays object creation until it's actually needed | [`lazyInitialization.ts`](creational/lazyInitialization.ts) |
| Multiton | Maintains multiple selectable instances of a class | [`multiton.ts`](creational/multiton.ts) |
| Object Pool | Reuses expensive objects instead of recreating them | [`objectPool.ts`](creational/objectPool.ts) |
| Parameter Object | Bundles parameters into a single object to simplify method signatures | [`parameterObject.ts`](creational/parameterObject.ts) |
| Prototype | Creates objects by cloning existing instances | [`prototype.ts`](creational/prototype.ts) |
| RAII (Resource Acquisition is Initialization) | Ties resource management to object lifecycle. Since JavaScript uses a Garbage Collector, this is not true RAII and instead uses the `using` keyword | [`raii.ts`](creational/raii.ts) |
| Service Locator | Provides a central registry for retrieving services | [`serviceLocator.ts`](creational/serviceLocator.ts) |
| Singleton | Ensures a class has only one instance | [`singleton.ts`](creational/singleton.ts) |

### Structural patterns
| Name | Description | File |
|------|-------------|------|
| Adapter | Allows incompatible interfaces to work together | [`adapter.ts`](structural/adapter.ts) |
| Bridge | Separates abstraction from implementation | [`bridge.ts`](structural/bridge.ts) |
| Composite | Treats individual objects and compositions of objects uniformly | [`composite.ts`](structural/composite.ts) |
| Decorator | Dynamically adds behavior to objects | [`decorator.ts`](structural/decorator.ts) |
| Delegation | Passes responsibility to a different object | [`delegation.ts`](structural/delegation.ts) |
| Extension Object | Adds new functionality without modifying existing objects | [`extensionObject.ts`](structural/extensionObject.ts) |
| Facade | Provides a simplified interface to a complex system | [`facade.ts`](structural/facade.ts) |
| Flyweight | Reduces memory usage by sharing common state | [`flyweight.ts`](structural/flyweight.ts) |
| Front Controller | Centralizes request handling | [`frontController.ts`](structural/frontController.ts) |
| Marker | Uses empty interfaces (or, in this case, classes) to attach metadata | [`marker.ts`](structural/marker.ts) |
| Module | Groups several related elements into a single entity. This specific implementation is a revealing module, which exposes some of these elements publicly | [`module.ts`](structural/module.ts) |
| Proxy | Controls access to another object | [`proxy.ts`](structural/proxy.ts) |
| Registry | Provides centralized object lookup | [`registry.ts`](structural/registry.ts) |
| Repository | Mediates between domain and data layers by exposing a collection-like interface | [`repository.ts`](structural/repository.ts) |
| Twin | Uses paired objects to extend functionality. This pattern also allows multiple inheritance in languages that do not support it | [`twin.ts`](structural/twin.ts) |

### Behavioral patterns
| Name | Description | File |
|------|-------------|------|
| Blackboard | Allows multiple agents to collaborate through shared knowledge | [`blackboard.ts`](behavioral/blackboard.ts) |
| Chain-of-responsibility | Passes requests through a chain of handlers | [`chainOfResponsibility.ts`](behavioral/chainOfResponsibility.ts) |
| Circuit Breaker | Temporarily blocks requests to failing services to prevent cascading failures | [`circuitBreaker.ts`](behavioral/circuitBreaker.ts) |
| Command | Encapsulates requests as objects | [`command.ts`](behavioral/command.ts) |
| Fluent Interface | Provides method chaining APIs | [`fluentInterface.ts`](behavioral/fluentInterface.ts) |
| Interpreter | Defines a representation for language grammar. In this case implemented as an expression tree, skipping tokenizing and parsing | [`interpreter.ts`](behavioral/interpreter.ts) |
| Iterator | Provides a way to access elements of an aggregate without exposing the internal representation. In this case implemented using JavaScript iterators | [`iterator.ts`](behavioral/iterator.ts) |
| Mediator | Centralizes communication between objects | [`mediator.ts`](behavioral/mediator.ts) |
| Memento | Captures and restores object state | [`memento.ts`](behavioral/memento.ts) |
| Middleware | Passes requests through a chain of composable handlers | [`middleware.ts`](behavioral/middleware.ts) |
| Null Object | Provides a default object instead of relying on `null` checks | [`nullObject.ts`](behavioral/nullObject.ts) |
| Observer | Defines a one-to-many dependency with objects which are notified on state changes | [`observer.ts`](behavioral/observer.ts) |
| Pipeline | Passes values through multiple stages, each transforming the output of the previous one | [`pipeline.ts`](behavioral/pipeline.ts) |
| Retry | Automatically re-attempts failed requests based on a specified policy | [`retry.ts`](behavioral/retry.ts) |
| Scheduler | Controls the execution of tasks over time | [`scheduler.ts`](behavioral/scheduler.ts) |
| Servant | Provides a common functionality for a group of objects | [`servant.ts`](behavioral/servant.ts) |
| Specification | Encapsulates business rules as reusable specifications with Boolean algebra | [`specification.ts`](behavioral/specification.ts) |
| State | Changes behavior when internal state changes | [`state.ts`](behavioral/state.ts) |
| Strategy | Defines interchangeable algorithms | [`strategy.ts`](behavioral/strategy.ts) |
| Template Method | Defines an algorithm skeleton while allowing steps to vary | [`templateMethod.ts`](behavioral/templateMethod.ts) |
| Unit of Work | Groups operations into a single unit that can be rolled back and committed | [`unitOfWork.ts`](behavioral/unitOfWork.ts) |
| Visitor | Separates operations from object structures | [`visitor.ts`](behavioral/visitor.ts) |

### Functional programming techniques 
| Name | Description | File |
|------|-------------|------|
| Composition | Combines multiple functions into a single function | [`composition.ts`](functional/composition.ts) |
| Currying | Transforms a multiparametric function into a sequence of single-parameter functions | [`currying.ts`](functional/currying.ts) |
| Either | Represents a value that is one of two types | [`either.ts`](functional/either.ts) |
| Lens | Allows getting and setting values within immutable nested data structures in a composable way | [`lens.ts`](functional/lens.ts) |
| Memoization | Caches results of expensive functions to prevent redundant recalculation | [`memoization.ts`](functional/memoization.ts) |
| Option | Represents a value that may or may not be present | [`option.ts`](functional/option.ts) |
| Partial Apply (papply) | Applies some arguments ahead of time, producing a function with fewer parameters | [`partialApply.ts`](functional/partialApply.ts) |
| Result | Represents a value as either a success or a failure, special case of Either | [`result.ts`](functional/result.ts) |
| State monad | Passes state through a series of computations in a purely functional way. Not to be confused with the behavioral State: this is an implementation of the State monad, wheras the behavioral State refers to a system where the behavior is changed along with the state | [`state.ts`](functional/state.ts) |

### Messaging patterns
| Name | Description | File |
|------|-------------|------|
| Choreography Saga | Coordinates a transaction through events passed between services with no central coordinator. Choreography and Orchestration Sagas are often regarded as the same pattern, just 2 different implementations, but I chose to include them as seperate patterns to show the differences between them | [`choreographySaga.ts`](messaging/choreographySaga.ts) |
| CQRS (Command-Query Responsibility Segregation) | Separates read and write into separate models | [`cqrs.ts`](messaging/cqrs.ts) |
| Dead Letter Queue | Stores undeliverable messages so they can be inspected later | [`deadLetterQueue.ts`](messaging/deadLetterQueue.ts) |
| Event Bus (Pub/Sub) | Lets decoupled services publish and subscribe to events | [`eventBus.ts`](messaging/eventBus.ts) |
| Event Sourcing | Stores state changes as a sequence of events | [`eventSourcing.ts`](messaging/eventSourcing.ts) |
| Event Store | Provides bitemporal storage for events | [`eventStore.ts`](messaging/eventStore.ts) |
| Inbox | Stores processed messages to achieve idempotency | [`inbox.ts`](messaging/inbox.ts) |
| Orchestration Saga | Coordinates a transaction through events and commands dispatched by a central coordinator | [`orchestrationSaga.ts`](messaging/orchestrationSaga.ts) |
| Outbox | Ensures reliable delivery by storing messages in the same transaction as the data change | [`outbox.ts`](messaging/outbox.ts) |

### Concurrency patterns
| Name | Description | File |
|------|-------------|------|
| Active Object | Decouples method execution from method invocation | [`activeObject.ts`](concurrency/activeObject.ts) |
| Actor Model | Encapsulates state and behavior in isolated actors communicating only through messages | [`actorModel.ts`](concurrency/actorModel.ts) |
| Balking | Ignores actions if the object is in a state that does not allow it to perform them | [`balking.ts`](concurrency/balking.ts) |
| Guarded Suspension | Delays actions until the object is able to perform them | [`guardedSuspension.ts`](concurrency/guardedSuspension.ts) |
| Mutex | Ensures only one thread can access a shared resource at a time. This implementation does not guarantee fairness | [`mutex.ts`](concurrency/mutex.ts) |
| Read-Write Lock (RwLock) | Allows concurrent reads but requires exclusive access for writes. This implementation does not prevent writer starvation. | [`readWriteLock.ts`](concurrency/readWriteLock.ts) |
| Semaphore | Limits the number of concurrent accesses to a resource. This implementation does not guarantee fairness | [`semaphore.ts`](concurrency/semaphore.ts) |
| Thread pool | Reuses a fixed set of threads to perform tasks | [`threadPool.ts`](concurrency/threadPool.ts) |

### Testing patterns
| Name | Description | File |
|------|-------------|------|
| Fake | Provides a working but simplified implementation for testing | [`fake.ts`](testing/fake.ts) |
| Mock | Verifies the expected interactions occurred during a test | [`mock.ts`](testing/mock.ts) |
| Object Mother | Provides reusable test object creation methods | [`objectMother.ts`](testing/objectMother.ts) |
| Spy | Records information about calls for later verification | [`spy.ts`](testing/spy.ts) |
| Stub | Returns predefined responses to calls | [`stub.ts`](testing/stub.ts) |
| Test Data Builder | Constructs complex data structures incrementally | [`testDataBuilder.ts`](testing/testDataBuilder.ts) |
| Test Object | Supplies a preconfigured object for reuse across tests | [`testObject.ts`](testing/testObject.ts) |