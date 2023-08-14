import IoCContainer from "../IoC/iocContainer";
import ServiceProvider from "../IoC/serviceProvider";

interface IDGenerator {
  newId: () => number;
}

class RandomIDGenerator implements IDGenerator {
  public newId() {
    return Math.floor(Math.random() * 10000);
  }
}

interface Logger {
  write: (str: string) => void;
}

class ConsoleLogger implements Logger {
  public id;

  public constructor(idGenerator: IDGenerator) {
    this.id = idGenerator.newId();
  }

  public write(str: string) {
    console.log(`[${this.id}]: ${str}`);
  }
}

class MyService {
  public id;
  private logger;

  public constructor(idGenerator: IDGenerator, logger: Logger) {
    this.id = idGenerator.newId();
    this.logger = logger;
  }

  public run() {
    this.logger.write(`Hello world, it's me ${this.id}`);
  }
}

/**
 * Example app using IoC container. Services are registered in `setup` and container is created after setup in the constructor.
 * `MyService` uses IDGenerator and Logger to print to console it's randomly generated ID. Because MyService is registered as
 * Transient, each instance has a different ID. 
 * `ConsoleLogger` is registered as a Singleton, and so we expect an output such as:
 * 
 * ```
 * [6178]: Hello world, it's me 4673
 * [6178]: Hello world, it's me 908
 * [6178]: Hello world, it's me 4814
 * [6178]: Hello world, it's me 3340
 * [6178]: Hello world, it's me 3456
 * ```
 * 
 * Where the same ConsoleLogger instance is used by each `MyService`.
 */
class App {
  private serviceProvider: ServiceProvider;
  private container: IoCContainer;

  public setup(): ServiceProvider {
    let serviceProvider = new ServiceProvider();

    serviceProvider.registerSingleton("IDGenerator", RandomIDGenerator);
    serviceProvider.registerSingleton("Logger", ConsoleLogger, ["IDGenerator"]);
    serviceProvider.registerTransient("APIService", MyService, [
      "IDGenerator",
      "Logger",
    ]);

    return serviceProvider;
  }

  public constructor() {
    this.serviceProvider = this.setup();
    this.container = this.serviceProvider.generateContainer();
  }

  public run() {
    for (let i = 0; i < 5; i++) {
      let api = this.container.getService("APIService");
      api.run();
    }
  }
}

let app = new App();
app.run();
