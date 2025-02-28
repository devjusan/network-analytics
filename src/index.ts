import { ServiceOptions } from './application/browser-network-observable-service'
import { CustomProps } from './domain/models/response'

import { BNOUserCasesService } from './infra/use-cases'

const service = new BNOUserCasesService()

type IMethods = {
  /**
   * Start to observe the network with the given options.
   *
   * @param options
   * @returns
   */
  start: (options?: ServiceOptions, customProps?: CustomProps) => Promise<void>
  /**
   * Stops the service.
   *
   * When you call this method, we send all user network information to `NetHound`.
   *
   * Call this method when you unmount the component or when you don't need to observe the network anymore.
   *
   * @param id
   * Unique identifier for the service. Consult in [NetHound](https://nethound.vercel.app/dashboard) to get the id.
   * @returns
   */
  end: (id: string) => Promise<void>
}

export default {
  start: (options?: ServiceOptions, customProps?: CustomProps) =>
    service.execute(options, customProps),
  end: async (id: string) => {
    try {
      await service.destroy(id)
    } catch (error) {
      console.error(error.message)
    }
  }
} as IMethods
