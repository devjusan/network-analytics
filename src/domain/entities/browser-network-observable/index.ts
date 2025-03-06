import { BrowserNetworkObservableResponse, CustomProps, Filters } from '../../models/response'

class BrowserNetworkObservable {
  readonly cache: Map<string, BrowserNetworkObservableResponse> = new Map()
  #initialFetch = window.fetch
  #initialXMLHttpRequest = window.XMLHttpRequest

  constructor() {}

  execute(filters?: Filters, customProps?: CustomProps) {
    this.#bindExecute(filters, customProps)
  }

  destroy() {
    return this.#onDestroy()
  }

  #onComplete = (filters?: Filters, customProps?: CustomProps) => {
    try {
      window.fetch = new Proxy(window.fetch, {
        apply: async (target, _, args) => {
          return this.#requestWrapper(args, target, filters, customProps)
        }
      })

      window.XMLHttpRequest = new Proxy(window.XMLHttpRequest, {
        construct: (target, args) => {
          const xhr = new target()
          let time2 = 0

          const time1 = performance.now()
          xhr.addEventListener('loadend', () => {
            time2 = performance.now()

            const time = time2 - time1

            this.cache.set(xhr.responseURL, {
              url: xhr.responseURL,
              status: xhr.status,
              time,
              date: new Date().toISOString(),
              filters,
              ...(customProps || {})
            })

            const event = new CustomEvent('network-observable-response', {
              bubbles: true,
              cancelable: true,
              detail: {
                cache: Array.from(this.cache.values())
              }
            })

            window.dispatchEvent(event)
          })

          return xhr
        }
      })
    } catch (error) {
      console.log('error', error)

      return this.#initialFetch
    }
  }

  async #requestWrapper(
    args: any,
    target: (url: string, config: any) => Promise<Response>,
    filters?: Filters,
    customProps?: CustomProps
  ) {
    const [url, config] = args as [string, any]
    let time2 = 0
    const time1 = performance.now()
    const response = await target(url, config).finally(() => {
      time2 = performance.now()
    })

    this.cache.set(url, {
      url,
      status: response.status,
      time: time2 - time1,
      date: new Date().toISOString(),
      filters,
      ...(customProps || {})
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

  #onDestroy() {
    window.fetch = this.#initialFetch
    window.XMLHttpRequest = this.#initialXMLHttpRequest
    const values = Array.from(this.cache.values())
    console.log('Browser Network Observable: --> ', values)

    this.cache.clear()

    return values
  }

  #bindExecute = (filters?: Filters, customProps?: CustomProps) => {
    this.#onComplete(filters, customProps)
  }
}

export default BrowserNetworkObservable
