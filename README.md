# IoC Container

Basic library to create an IoC (Inversion of Control) container with service providers. Supports Transient and Singleton services and dependencies.

## Example

Services are registered with the ServiceProvider, which is used to generate the IoC Container. The `registerXXX` method takes as arguments

**key {string}**
: Identifier for service.

**serviceClass {class}**
: Implementation class for service, `serviceClass` should have a constructor that matches the dependency list.

**dependencies {Optional[Array\<string\>]}**
: List of service keys that will be used to initialize `serviceClass`. Dependencies should be passed in the order of constructor arguments.

```javascript
let serviceProvider = new ServiceProvider();

serviceProvider.registerSingleton("ConsoleWriter", CustomConsoleWriter);
serviceProvider.registerTransient("Printer", PrettyPrinter, ["ConsoleWriter"]);

let container : IoCContainer = serviceProvider.generateContainer();

let prettyPrint = container.getService("Printer");
prettyPrint.out("Hello World!")
```

## Requirements

- @babel/core
- @babel/preset-env
- @babel/preset-typescript
- @types/jest
- jest
- ts-jest
- ts-node
- typescript


## Scripts
```
npm install    # install dependencies
npm start      # run example app
npm t          # run tests
```