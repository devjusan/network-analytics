import { BrowserNetworkObservableResponse } from '../../models/response'

export type WithFilters = {
  /** Time in milliseconds */
  timeShouldBeHigherThan?: number
  /** Time in milliseconds */
  timeShouldBeLowerThan?: number
  statusShouldBe?: number
  urlShouldBe?: string
}

export type CustomProps = {
  /** Usefull when using Micro Frontends. You can set the origin of the request. */
  locale?: string
}

class BrowserNetworkObservable {
  readonly cache: Map<string, BrowserNetworkObservableResponse> = new Map()
  #initialFetch = window.fetch
  #initialXMLHttpRequest = window.XMLHttpRequest

  constructor() {}

  execute(filters?: WithFilters, customProps?: CustomProps) {
    this.#bindExecute(filters, customProps)
  }

  destroy() {
    return this.#onDestroy()
  }

  #onComplete = (filters?: WithFilters, customProps?: CustomProps) => {
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
            if (filters) {
              if (filters.timeShouldBeHigherThan) {
                if (time < filters.timeShouldBeHigherThan) {
                  return
                }
              }

              if (filters.timeShouldBeLowerThan) {
                if (time > filters.timeShouldBeLowerThan) {
                  return
                }
              }

              if (filters.statusShouldBe) {
                if (xhr.status !== filters.statusShouldBe) {
                  return
                }
              }

              if (filters.urlShouldBe) {
                if (xhr.responseURL !== filters.urlShouldBe) {
                  return
                }
              }
            }

            this.cache.set(xhr.responseURL, {
              url: xhr.responseURL,
              status: xhr.status,
              time,
              date: new Date().toISOString(),
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
    filters?: WithFilters,
    customProps?: CustomProps
  ) {
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
      url,
      status: response.status,
      time: time2 - time1,
      date: new Date().toISOString(),
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

  #bindExecute = (filters?: WithFilters, customProps?: CustomProps) => {
    this.#onComplete(filters, customProps)
  }
}

export default BrowserNetworkObservable
