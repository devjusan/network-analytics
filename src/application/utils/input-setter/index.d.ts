export declare type InputSetOptions = {
    /** Selector to find the input element */
    selector: string;
    /**
     * We support the following input types:
     * - text
     * - checkbox
     * - radio
     * - number
     * - date
     */
    value: unknown;
};
declare class InputSetter {
    constructor();
    setAll(options: Array<InputSetOptions>): Promise<void>;
    set(options: InputSetOptions): Promise<void>;
}
export default InputSetter;
