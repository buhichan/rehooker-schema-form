import * as React from 'react';
import { FormState } from './form';
import { Store } from 'rehooker';
declare type FieldArrayProps = {
    form: Store<FormState>;
    key: string;
    value: string[];
    children: (childKeys: string[], add: () => void, remove: (key: string) => void) => React.ReactNode;
};
export declare function FieldArray(props: FieldArrayProps): JSX.Element;
export {};
