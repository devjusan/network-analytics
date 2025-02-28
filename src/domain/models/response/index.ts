export type BrowserNetworkObservableResponse = {
  /** Time in milliseconds */
  time: number
  status: number
  url: string
  date: string
  /** Usefull when using Micro Frontends. You can set the origin of the request. */
  locale?: string
}
