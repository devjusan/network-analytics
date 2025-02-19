import NetworkObservable, { WithFilters } from '../../domain/entities/network-observable'
import InputSetter, { InputSetOptions } from '../utils/input-setter'

export type ServiceOptions = {
  /** Service will be executed after fill inputs */
  withFillInputs?: Array<InputSetOptions>
  withFilters?: WithFilters
}

export class NetworkObservableService {
  readonly #service = new NetworkObservable()

  /** `execute` method starts to observe the network with the given options.
   *
   * to stop the service, you can call `destroy` method from the service instance.
   */
  async execute(options?: ServiceOptions) {
    if (options?.withFillInputs) {
      const inputSetter = new InputSetter()

      await inputSetter.setAll(options.withFillInputs)
    }

    this.#service.execute(options?.withFilters)

    return Array.from(this.#service.cache.values())
  }

  destroy() {
    this.#service.destroy()

    return Array.from(this.#service.cache.values())
  }
}
