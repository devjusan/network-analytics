import {
  BrowserNetworkObservableResponse as _BrowserNetworkObservableResponse,
  CustomProps as _CustomProps,
  Filters as _Filters
} from './domain/models/response'

import { BNOUserCasesService } from './infra/use-cases'

const service = new BNOUserCasesService()

type IMethods = {
  /**
   * @param userId
   * User account identifier. Consult in [NetHound](https://nethound.co/dashboard) to get the id.
   *
   * @param customProps
   * Custom properties to send to `NetHound`.
   *
   * @returns
   */
  start: (userId: string, customProps?: CustomProps) => Promise<void>
  /**
   * Stops the service.
   *
   * When you call this method, we send all user network information to `NetHound`.
   *
   * Call this method when you unmount your app or when you don't need to observe the network anymore.
   *
   * **Note:** `Nethound` automatically will stop the service when the user closes the browser tab or refreshes the page.
   */
  end: () => Promise<void>
}

export type Filters = _Filters
export type BrowserNetworkObservableResponse = _BrowserNetworkObservableResponse
export type CustomProps = _CustomProps

export default {
  start: (userId: string, customProps?: CustomProps) => service.execute(userId, customProps),
  end: async () => {
    try {
      await service.destroy()
    } catch (error) {
      console.error(error.message)
    }
  }
} as IMethods
