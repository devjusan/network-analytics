import { NetworkObservableResponse } from 'src/domain/models/response';
export declare type WithFilters = {
    timeShouldBeHigherThan?: number;
    timeShouldBeLowerThan?: number;
    statusShouldBe?: number;
    urlShouldBe?: string;
};
declare class NetworkObservable {
    #private;
    readonly cache: Map<string, NetworkObservableResponse>;
    constructor();
    execute(filters?: WithFilters): void;
    destroy(): void;
}
export default NetworkObservable;
