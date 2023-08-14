import IoCContainer from "./iocContainer";
import ServiceDescriptor from "./utils/serviceDescriptor";
import { Lifecycle } from "./utils/lifecycle";

class ServiceProvider {
  private registeredServices: Map<string, ServiceDescriptor<any>>;

  public constructor() {
    this.registeredServices = new Map<string, ServiceDescriptor<any>>();
  }

  public generateContainer(): IoCContainer {
    return new IoCContainer(this.registeredServices);
  }

  public registerSingleton(
    key: string,
    serviceClass: any,
    dependencies?: Array<string>
  ) {
    this.registeredServices.set(
      key,
      new ServiceDescriptor(
        key,
        serviceClass,
        Lifecycle.Singleton,
        dependencies
      )
    );
  }

  public registerTransient(
    key: string,
    serviceClass: any,
    dependencies?: Array<string>
  ) {
    this.registeredServices.set(
      key,
      new ServiceDescriptor(
        key,
        serviceClass,
        Lifecycle.Transient,
        dependencies
      )
    );
  }
}

export default ServiceProvider;
