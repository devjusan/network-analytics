import { NetworkObservableResponse } from 'src/domain/models/response'

export type WithFilters = {
  timeShouldBeHigherThan?: number
  timeShouldBeLowerThan?: number
  statusShouldBe?: number
  urlShouldBe?: string
}

class NetworkObservable {
  readonly cache: Map<string, NetworkObservableResponse> = new Map()
  #initialFetch = window.fetch

  constructor() {}

  execute(filters?: WithFilters) {
    window.document.addEventListener(
      'readystatechange',
      this.#onReadyStateChange.bind(this, filters)
    )
  }

  destroy() {
    this.#onDestroy()
  }

  #onComplete = (filters?: WithFilters) => {
    window.fetch = new Proxy(window.fetch, {
      apply: async (target, _, args) => {
        const [url, config] = args
        let time2 = 0
        const time1 = performance.now()
        const response = await target(url, config).finally(() => {
          time2 = performance.now()
        })

        if (filters) {
          if (filters.timeShouldBeHigherThan) {
            if (time2 - time1 < filters.timeShouldBeHigherThan) {
              return response
            }
          }

          if (filters.timeShouldBeLowerThan) {
            if (time2 - time1 > filters.timeShouldBeLowerThan) {
              return response
            }
          }

          if (filters.statusShouldBe) {
            if (response.status !== filters.statusShouldBe) {
              return response
            }
          }

          if (filters.urlShouldBe) {
            if (url !== filters.urlShouldBe) {
              return response
            }
          }
        }

        this.cache.set(url, {
          time: time2 - time1,
          ...response.clone()
        })

        const event = new CustomEvent('network-observable-response', {
          bubbles: true,
          cancelable: true,
          detail: {
            cache: Array.from(this.cache.values())
          }
        })

        window.dispatchEvent(event)

        return response
      }
    })
  }

  #onDestroy() {
    window.document.removeEventListener('readystatechange', this.#onReadyStateChange.bind(this))
    window.fetch = this.#initialFetch
  }

  #onReadyStateChange = (filters?: WithFilters) => {
    if (document.readyState === 'complete') {
      this.#onComplete(filters)
    }
  }
}

export default NetworkObservable
