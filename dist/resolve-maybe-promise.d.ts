import * as React from "react";
import { Option } from './form';
import { FormFieldSchema } from './index';
declare type PossibleOptions = FormFieldSchema['options'];
export declare class ResolveMaybePromise extends React.PureComponent<{
    maybePromise: PossibleOptions;
    children: (maybepromise: Option[] | null) => React.ReactElement<any>;
}> {
    state: {
        maybePromise: Option[] | null;
    };
    loadOptions(rawOptions: PossibleOptions): void;
    componentDidUpdate(this: ResolveMaybePromise, prevProps: typeof this['props']): void;
    unmounted: boolean;
    componentWillUnmount(): void;
    componentDidMount(): void;
    render(): React.ReactElement<any>;
}
export {};
