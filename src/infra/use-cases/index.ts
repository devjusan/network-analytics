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

      await this.#sendVerify(userId)

      this.#service.execute(filters || {}, customProps)
    } catch (error) {
      console.error('[ERROR] - [NETHOUND] - ', error)
    }
  }

  async destroy() {
    try {
      const list = this.#service.destroy()

      await this.#sendToNetHound(this.#userId, list)

      return list
    } catch (error) {
      console.error('[ERROR] - [NETHOUND] - ', error)
    }
  }

  async #getFilters() {
    try {
      const response = await fetch(
        `https://nethound.vercel.app/api/filters?id=${this.#userId}`
      ).then((res) => res.json())

      if (!response.ok) {
        console.error('[ERROR] - [NETHOUND] - ', response.message)
      }

      return response.data
    } catch (error) {
      console.error('[ERROR] - [NETHOUND] - ', error)
    }
  }

  async #sendToNetHound(id: string, list: BrowserNetworkObservableResponse[]) {
    try {
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
        console.error('[ERROR] - [NETHOUND] - ', response.message)
      }
    } catch (error) {
      console.error('[ERROR] - [NETHOUND] - ', error)
    }
  }

  async #sendVerify(id: string) {
    try {
      const response = await fetch('https://nethound.vercel.app/api/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id,
          verify: true
        })
      }).then((res) => res.json())

      if (!response.ok) {
        console.error('[ERROR] - [NETHOUND] - ', response.message)
      }
    } catch (error) {
      console.error('[ERROR] - [NETHOUND] - ', error)
    }
  }
}
