import { BrowserNetworkObservableResponse, CustomProps } from 'src/domain/models/response'
import BrowserNetworkObservable, {
  WithFilters
} from '../../domain/entities/browser-network-observable'

export type ServiceOptions = {
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
      }),
      keepalive: true
    }).then((res) => res.json())

    if (!response.ok) {
      throw new Error(response.message)
    }
  }
}
