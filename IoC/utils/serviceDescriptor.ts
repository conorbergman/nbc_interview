import { Lifecycle } from "./lifecycle";
import ServiceConstructor from "./serviceConstructor";

/**
 * Metadata used to create instances for a registered service, as well as their lifecycle.
 * @param {string} typeKey - Unique key identifying registered service.
 * @param {TImplementation | undefined} implementation - For singletons, provides the singleton instance.
 * @param {Lifecycle} lifecycle - Transient | Singleton.
 * @param {ServiceConstructor} serviceConstructor - Class used to construct service as well as list of dependencies to be provided to the service constructor.
 */
class ServiceDescriptor<TImplementation> {
  public typeKey: string;
  public implementation: TImplementation | undefined;
  public lifecycle: Lifecycle;
  public serviceConstructor: ServiceConstructor;

  public constructor(
    typeKey: string,
    serviceClass: TImplementation,
    lifecycle: Lifecycle,
    dependencies?: Array<string>
  ) {
    this.typeKey = typeKey;
    this.implementation = undefined;
    this.lifecycle = lifecycle;
    this.serviceConstructor = new ServiceConstructor(
      serviceClass,
      dependencies
    );
  }
}

export default ServiceDescriptor;
