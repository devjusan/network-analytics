import { WithFilters } from '../../domain/entities/browser-network-observable'
import { InputSetOptions } from '../utils/input-setter'
export declare type ServiceOptions = {
  /** Service will be executed after fill inputs */
  withFillInputs?: Array<InputSetOptions>
  withFilters?: WithFilters
}
export declare class NetworkObservableService {
  #private
  /** `execute` method starts to observe the network with the given options.
   *
   * to stop the service, you can call `destroy` method from the service instance.
   */
  execute(options?: ServiceOptions): Promise<unknown[]>
  destroy(): unknown[]
}
