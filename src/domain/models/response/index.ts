export type CustomProps = {
  /** Usefull when using Micro Frontends. You can set a custom origin of the request. */
  locale?: string
}

export type BrowserNetworkObservableResponse = {
  /** Time in milliseconds */
  time: number
  status: number
  url: string
  date: string
  filters?: Filters
} & CustomProps

export type Filters = {
  /** Time in milliseconds */
  timeShouldBeHigherThan?: number
  /** Time in milliseconds */
  timeShouldBeLowerThan?: number
  statusShouldBe?: number
  urlShouldBe?: string
}
