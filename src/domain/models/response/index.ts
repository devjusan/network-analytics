export type CustomProps = {
  /** Usefull when using Micro Frontends. You can set the origin of the request. */
  locale?: string
}

export type BrowserNetworkObservableResponse = {
  /** Time in milliseconds */
  time: number
  status: number
  url: string
  date: string
} & CustomProps
