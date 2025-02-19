import { NetworkObservableService, ServiceOptions } from './application/network-observable-service'

const service = new NetworkObservableService()

export default {
  execute: (options?: ServiceOptions) => service.execute(options),
  destroy: () => service.destroy()
}
