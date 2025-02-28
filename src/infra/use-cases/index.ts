import { BrowserNetworkObservableResponse, CustomProps } from 'src/domain/models/response'
import InputSetter, { InputSetOptions } from '../../application/utils/input-setter'
import BrowserNetworkObservable, {
  WithFilters
} from '../../domain/entities/browser-network-observable'

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

export class BNOUserCasesService {
  readonly #service = new BrowserNetworkObservable()

  /** `execute` method starts to observe the network with the given options.
   *
   * to stop the service, you can call `destroy` method from the service instance.
   */
  async execute(options?: ServiceOptions, customProps?: CustomProps) {
    try {
      if (options?.withFillInputs) {
        const inputSetter = new InputSetter()

        await inputSetter.setAll(options.withFillInputs)
      }

      this.#service.execute(options?.withFilters, customProps)
    } catch (error) {
      console.error('[ERROR] - [NETHOUND] - ', error)
    }
  }

  async destroy(id: string) {
    try {
      const destroied = this.#service.destroy()

      await this.#sendToNetHound(id, destroied)

      return destroied
    } catch (error) {
      console.error('[ERROR] - [NETHOUND] - ', error)
    }
  }

  async #sendToNetHound(id: string, list: BrowserNetworkObservableResponse[]) {
    if (!list.length) {
      return
    }

    const response = await fetch('https://nethound.vercel.app/api/collect', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id,
        list
      })
    }).then((res) => res.json())

    if (!response.ok) {
      throw new Error(response.message)
    }
  }
}
