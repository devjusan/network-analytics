import { ServiceOptions } from './application/browser-network-observable-service'
import { CustomProps } from './domain/models/response'

import { BNOUserCasesService } from './infra/use-cases'

const service = new BNOUserCasesService()

type IMethods = {
  /**
   * @param userId
   * User account identifier. Consult in [NetHound](https://nethound.vercel.app/dashboard) to get the id.
   *
   * @param options
   * Start to observe the network with the given options.
   *
   * @param customProps
   * Custom properties to send to `NetHound`.
   *
   * @returns
   */
  start: (userId: string, options?: ServiceOptions, customProps?: CustomProps) => void
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

export default {
  start: (userId: string, options?: ServiceOptions, customProps?: CustomProps) =>
    service.execute(userId, options, customProps),
  end: async () => {
    try {
      await service.destroy()
    } catch (error) {
      console.error(error.message)
    }
  }
} as IMethods
