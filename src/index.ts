import { NetworkObservableService, ServiceOptions } from './application/network-observable-service'

const service = new NetworkObservableService()

const networkObservableService = {
  execute: (options: ServiceOptions) => service.execute(options),
  destroy: () => service.destroy()
}

export default networkObservableService
