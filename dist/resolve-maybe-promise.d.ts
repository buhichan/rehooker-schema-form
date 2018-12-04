import * as React from "react";
import { Options } from './form';
import { FormFieldSchema } from './index';
declare type PossibleOptions = FormFieldSchema['options'];
export declare class ResolveMaybePromise extends React.PureComponent<{
    maybePromise: PossibleOptions;
    children: (maybepromise: Options | null) => React.ReactElement<any>;
}> {
    state: {
        maybePromise: {
            name: string;
            value: any;
        }[] | null;
    };
    loadOptions(rawOptions: PossibleOptions): void;
    componentDidUpdate(this: ResolveMaybePromise, prevProps: typeof this['props']): void;
    unmounted: boolean;
    componentWillUnmount(): void;
    componentDidMount(): void;
    render(): React.ReactElement<any>;
}
export {};
