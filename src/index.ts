import {
  BrowserNetworkObservableService,
  ServiceOptions
} from './application/browser-network-observable-service'

export const service = new BrowserNetworkObservableService()

export default {
  start: (options?: ServiceOptions) => service.execute(options),
  end: () => service.destroy()
}
