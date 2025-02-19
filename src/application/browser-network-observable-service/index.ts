import BrowserNetworkObservable, {
  WithFilters
} from '../../domain/entities/browser-network-observable'
import InputSetter, { InputSetOptions } from '../utils/input-setter'

export type ServiceOptions = {
  /** Service will be executed after fill inputs */
  withFillInputs?: Array<InputSetOptions>
  withFilters?: WithFilters
  /**
   * Unique identifier for the service.
   * We will use this id to only show the network requests for this service.
   */
  id?: string
}

export class BrowserNetworkObservableService {
  readonly #service = new BrowserNetworkObservable()

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
  }

  destroy() {
    this.#service.destroy()

    const values = Array.from(this.#service.cache.values())

    console.log('Browser Network Observable: --> ', values)

    return values
  }
}
