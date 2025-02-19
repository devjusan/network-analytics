import { NetworkObservableService, ServiceOptions } from './application/network-observable-service'

const service = new NetworkObservableService()

export default {
  start: (options?: ServiceOptions) => service.execute(options),
  end: () => service.destroy()
}
