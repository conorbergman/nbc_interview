import IoCContainer from "../IoC/iocContainer";
import ServiceProvider from "../IoC/serviceProvider";

function* idGenerator() {
  yield 1;
  yield 2;
  yield 3;
}

describe("IoC Container Tests", () => {
  test("Creating singleton provides same instance", () => {
    const ids = idGenerator();

    class SingletonClass {
      id;
      constructor() {
        this.id = ids.next().value;
      }
    }

    let serviceProvider = new ServiceProvider();
    serviceProvider.registerSingleton("Service1", SingletonClass);
    let container: IoCContainer = serviceProvider.generateContainer();
    let service1 = container.getService("Service1");
    let service2 = container.getService("Service1");
    expect(service1.id).toBe(1);
    expect(service2.id).toBe(1);
  }),
    test("Creating transient creates new instance", () => {
      const ids = idGenerator();

      class TransientClass {
        id;
        constructor() {
          this.id = ids.next().value;
        }
      }

      let serviceProvider = new ServiceProvider();
      serviceProvider.registerTransient("Service1", TransientClass);
      let container: IoCContainer = serviceProvider.generateContainer();
      let service1 = container.getService("Service1");
      let service2 = container.getService("Service1");
      expect(service1.id).toBe(1);
      expect(service2.id).toBe(2);
    }),
    test("Create Singleton with Singleton dependency", () => {
      const ids = idGenerator();

      class DependencyClass {
        id;
        name;
        constructor() {
          this.id = ids.next().value;
          this.name = "Dependency";
        }
      }

      class SingletonClass {
        id;
        name;
        dependency;
        constructor(dependency: DependencyClass) {
          this.id = ids.next().value;
          this.name = "Singleton";
          this.dependency = dependency;
        }
      }

      let serviceProvider = new ServiceProvider();
      serviceProvider.registerSingleton("Service1", SingletonClass, [
        "Service2",
      ]);
      serviceProvider.registerSingleton("Service2", DependencyClass);
      let container: IoCContainer = serviceProvider.generateContainer();
      let service1 = container.getService("Service1");
      let dependency = container.getService("Service2");
      expect(service1.name).toBe("Singleton");
      expect(dependency.name).toBe("Dependency");

      let d_id = dependency.id;
      expect(service1.dependency.id).toBe(d_id);
      expect(service1.dependency.name).toBe("Dependency");
    }),
    test("Create Transient with nested Singleton and Transient dependency", () => {
      const ids = idGenerator();

      class NestedDependencyClass {
        id;
        name;
        constructor() {
          this.id = ids.next().value;
          this.name = "Nested Dependency";
        }
      }

      class SingletonDependencyClass {
        id;
        name;
        dependency;
        constructor(dependency: NestedDependencyClass) {
          this.id = ids.next().value;
          this.name = "Singleton Dependency";
          this.dependency = dependency;
        }
      }

      class TransientClass {
        id;
        dependency;
        constructor(dependency: SingletonDependencyClass) {
          this.id = ids.next().value;
          this.dependency = dependency;
        }
      }

      let serviceProvider = new ServiceProvider();
      serviceProvider.registerTransient("OuterService", TransientClass, [
        "InnerService",
      ]);
      serviceProvider.registerSingleton(
        "InnerService",
        SingletonDependencyClass,
        ["NestedDependency"]
      );
      serviceProvider.registerTransient(
        "NestedDependency",
        NestedDependencyClass
      );
      let container: IoCContainer = serviceProvider.generateContainer();
      let service1 = container.getService("OuterService");
      expect(service1.dependency.name).toBe("Singleton Dependency");
      expect(service1.dependency.dependency.name).toBe("Nested Dependency");
    });
});
