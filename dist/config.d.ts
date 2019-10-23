import { WidgetProps } from './types';
import * as React from "react";
export declare type FormButtonsProps = {
    disabled: boolean;
    pristine?: boolean;
    submitSucceeded: boolean;
    submitting: boolean;
    onSubmit: (e?: any) => void;
    onReset: (e?: any) => void;
};
declare type Widget = React.StatelessComponent<WidgetProps> | React.ComponentClass<WidgetProps>;
export declare type ComponentMap = Map<string, Widget>;
export declare type SchemaFormConfig = {
    componentMap: ComponentMap;
    buttonRenderer: (props: FormButtonsProps) => JSX.Element;
};
export declare const defaultSchemaFormConfig: SchemaFormConfig;
export declare const SchemaFormConfigProvider: React.ProviderExoticComponent<React.ProviderProps<SchemaFormConfig>>;
export declare const SchemaFormConfigConsumer: React.ExoticComponent<React.ConsumerProps<SchemaFormConfig>>;
export {};
