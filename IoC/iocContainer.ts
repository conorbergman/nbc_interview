import ServiceDescriptor from "./utils/serviceDescriptor";
import { Lifecycle } from "./utils/lifecycle";

/**
 * Inversion of Control Container provides instances of registered services.
 *
 * Instances are created using their associated `ServiceDescriptor` and `ServiceConstructor`.
 *
 * @param {Map<string, ServiceDescriptor<any>>} registeredServices - Map of service key to instance creation metadata.
 */
class IoCContainer {
  private services: Map<string, ServiceDescriptor<any>>;

  public constructor(registeredServices: Map<string, ServiceDescriptor<any>>) {
    this.services = registeredServices;
  }

  private createInstance(serviceDescriptor: ServiceDescriptor<any>) {
    if (serviceDescriptor.serviceConstructor.dependencies === undefined) {
      return new serviceDescriptor.serviceConstructor.clazz();
    }
    // TODO: Expand type support for dependencies
    let dependencies = new Array();
    serviceDescriptor.serviceConstructor.dependencies.forEach(
      (dependencyKey: string) => {
        // TODO: Handle circular dependencies
        dependencies.push(this.getService(dependencyKey));
      }
    );
    return new serviceDescriptor.serviceConstructor.clazz(...dependencies);
  }

  public getService(serviceKey: string) {
    let service = this.services.get(serviceKey);

    if (service === undefined) {
      return undefined;
    }

    switch (service.lifecycle) {
      case Lifecycle.Singleton:
        if (service.implementation !== undefined) {
          return service.implementation;
        }
        service.implementation = this.createInstance(service);
        return service.implementation;
      case Lifecycle.Transient:
        return this.createInstance(service);
      default:
        return undefined;
    }
  }
}

export default IoCContainer;
