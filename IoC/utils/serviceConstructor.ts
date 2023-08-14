/**
 * ServiceConstructor contains all information required to initialize an instance of the service `clazz`.
 * @param {any} clazz - Class to be used to construct service.
 * @param {Array<string> | undefined} dependencies - List of keys for registered services to be provided to the clazz constructor.
 */
class ServiceConstructor {
  public clazz: any;
  public dependencies: Array<string> | undefined;

  public constructor(clazz: any, dependencies: Array<string> | undefined) {
    this.clazz = clazz;
    this.dependencies = dependencies;
  }
}

export default ServiceConstructor;
