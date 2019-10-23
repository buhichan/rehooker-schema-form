/// <reference types="react" />
import { Store } from 'rehooker';
import { ComponentMap } from './config';
export declare type Option = {
    name: string;
    value: any;
    group?: string;
};
export declare type AsyncOptions = () => Promise<Option[]>;
export declare type RuntimeAsyncOptions = (search: any) => Promise<Option[]>;
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
    componentMap: ComponentMap;
    onChange: (e: any) => void;
    value: any;
    componentProps: any;
    keyPath: FieldPath;
    error: any;
};
export declare type FormFieldSchema = WidgetInjectedProps & {
    key: string;
    label: React.ReactNode;
    type: string | React.ComponentClass<WidgetProps> | React.StatelessComponent<WidgetProps>;
    children?: FormFieldSchema[];
    /**
     * keyPath will keyPath from the root of the form to your deeply nested field. e.g. foo.bar[1].far
     */
    listens?: FieldListens;
    parse?: (v: any) => any;
    format?: (v: any) => any;
    style?: React.CSSProperties;
    defaultValue?: any;
    /** antd component specific props */
    options?: Option[] | AsyncOptions | RuntimeAsyncOptions;
    unixtime?: boolean;
    dateFormat?: string;
    wrapperProps?: any;
};
/**
 * type ErrorMap = Record<string,string|null|undefined|Array<ErrorMap>|ErrorMap>
 */
export declare type FormState = {
    submitting: boolean;
    submitSucceeded: boolean;
    errors: any;
    values: any;
    initialValues: any;
    valid: boolean;
    hasValidator: boolean;
};
export declare type FieldPath = (string | number)[];
export interface FieldProps {
    form: Store<FormState>;
    schema: FormFieldSchema;
    keyPath: FieldPath;
    listeners?: FieldListens;
    noWrapper?: boolean;
    componentMap: ComponentMap;
}
