import * as React from 'react';
import { FormState } from './form';
import { Store } from 'rehooker';
declare type FieldArrayProps = {
    form: Store<FormState>;
    name: string; /** begins with a dot */
    value: string[];
    children: (childKeys: {
        key: string;
        remove: () => void;
    }[], add: () => void) => React.ReactNode;
};
export declare function FieldArray(props: FieldArrayProps): JSX.Element;
export {};
