import { BrowserNetworkObservableResponse, CustomProps, Filters } from 'src/domain/models/response'
import BrowserNetworkObservable from '../../domain/entities/browser-network-observable'

export class BNOUserCasesService {
  readonly #service = new BrowserNetworkObservable()
  #userId: string

  /**
   * `execute` method starts to observe the network with the given options.
   *
   * to stop the service, you can call `destroy` method from the service instance.
   */
  async execute(userId: string, customProps?: CustomProps) {
    try {
      this.#userId = userId
      const filters = (await this.#getFilters()) as Filters

      this.#service.execute(filters, customProps)
    } catch (error) {
      console.error('[ERROR] - [NETHOUND] - ', error)
    }
  }

  async destroy() {
    try {
      const destroied = this.#service.destroy()

      await this.#sendToNetHound(this.#userId, destroied)

      return destroied
    } catch (error) {
      console.error('[ERROR] - [NETHOUND] - ', error)
    }
  }

  async #getFilters() {
    const response = await fetch(
      `https://nethound.vercel.app/api/filters?userId=${this.#userId}`
    ).then((res) => res.json())

    if (!response.ok) {
      throw new Error(response.message)
    }

    return response
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
