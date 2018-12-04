import * as React from 'react';
import { Store } from "rehooker";
export declare type Options = {
    name: string;
    value: any;
}[];
export declare type AsyncOptions = () => Promise<Options>;
export declare type RuntimeAsyncOptions = (value: any, props?: WidgetProps) => (Promise<Options> | Options);
export declare type FieldListens = {
    /**
     * q:what is valuePath here?
     * a:
     * If your formValue is {"foo":{"haha":[{"bar":10032}]}}, then the callback here will receive these arguments:
     * 10032, {bar:10032}, [{bar:10032}], {haha:[{bar:10032}]}, {foo:...}
     */
    to: string[] | ((keyPath: string) => string[]);
    then: (values: any[]) => Partial<FormFieldSchema & {
        value: any;
    }> | Promise<Partial<FormFieldSchema> & {
        value: any;
    }> | void;
}[];
export interface WidgetInjectedProps {
    hide?: boolean;
    multiple?: boolean;
    placeholder?: any;
    fullWidth?: boolean;
    required?: boolean;
    disabled?: boolean;
    [propName: string]: any;
}
export declare type WidgetProps = {
    schema: FormFieldSchema;
    form: Store<FormState>;
    onChange: (e: any) => void;
    value: any;
    componentProps: any;
    keyPath: string;
    error: any;
    meta: any;
};
export declare type FormFieldSchema = WidgetInjectedProps & {
    key: string;
    label: string;
    type: string | React.ComponentClass<WidgetProps> | React.StatelessComponent<WidgetProps>;
    children?: FormFieldSchema[];
    /**
     * keyPath will keyPath from the root of the form to your deeply nested field. e.g. foo.bar[1].far
     */
    listens?: FieldListens;
    validate?: (value: any, formValue: any) => string | undefined | null;
    parse?: (v: any) => any;
    format?: (v: any) => any;
    style?: React.CSSProperties;
    defaultValue?: any;
    options?: Options | AsyncOptions | RuntimeAsyncOptions;
};
export declare type FormState = {
    submitting: boolean;
    submitSucceeded: boolean;
    errors: {
        [key: string]: string;
    };
    values: {
        [key: string]: any;
    } | undefined;
    meta: {
        [key: string]: {
            schema: FormFieldSchema;
        };
    };
    onSubmit: Function;
    initialValues: any;
};
export declare type SchemaFormProps = {
    schema: FormFieldSchema[];
    noButton?: boolean;
    form: Store<FormState>;
    initialValues?: any;
    onSubmit?: (values: any) => void | Promise<void>;
};
export declare function createForm(): Store<FormState>;
export declare function SchemaForm(props: SchemaFormProps): JSX.Element;
