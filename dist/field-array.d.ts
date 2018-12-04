import * as React from 'react';
import { WidgetProps } from './form';
declare type FieldArrayProps = WidgetProps & {
    value: string[];
    children: (keys: string[], add: () => void, remove: (key: string) => void, renderChild: (key: string) => React.ReactNode) => React.ReactNode;
};
export declare function FieldArray(props: FieldArrayProps): JSX.Element;
export {};
