/// <reference types="react" />
/**
 * Created by YS on 2016/10/31.
 */
import * as React from 'react';
import { ConfigProps, InjectedFormProps } from 'redux-form';
import { WidgetProps } from "./field";
export declare type Options = {
    name: string;
    value: string | number;
}[];
export declare type AsyncOptions = () => Promise<Options>;
export declare type RuntimeAsyncOptions = (value: any, props?: WidgetProps) => (Promise<Options> | Options);
export declare type FieldSchamaChangeListeners = {
    /**
     * q:what is valuePath here?
     * a:
     * If your formValue is {"foo":{"haha":[{"bar":10032}]}}, then the callback here will receive these arguments:
     * 10032, {bar:10032}, [{bar:10032}], {haha:[{bar:10032}]}, {foo:...}
     */
    [fieldKey: string]: (value: any, formValue: any) => Partial<FormFieldSchema> | Promise<Partial<FormFieldSchema>>;
};
export interface FormFieldSchema extends Partial<ConfigProps<any, any>> {
    key: string;
    type: string | React.ComponentClass<WidgetProps> | React.StatelessComponent<WidgetProps>;
    label: string;
    hide?: boolean;
    placeholder?: string;
    required?: boolean;
    disabled?: boolean;
    multiple?: boolean;
    children?: FormFieldSchema[];
    options?: Options | AsyncOptions | RuntimeAsyncOptions;
    /**
     * 返回url
     * @param file 要上传的文件
     */
    onFileChange?: (file: File) => Promise<string>;
    data?: any;
    style?: React.CSSProperties;
    /**
     * keyPath will be the array of keys from the root of the form to your deeply nested field.
     */
    listens?: FieldSchamaChangeListeners | ((keyPath: string[]) => FieldSchamaChangeListeners);
    loadingText?: string;
    [rest: string]: any;
}
export declare function setButton(button: React.StatelessComponent<ButtonProps>): void;
export declare type ButtonProps = {
    disabled: boolean;
    type: "submit" | "button";
    onClick?: any;
    children: any;
};
export declare class ReduxSchemaForm extends React.PureComponent<Partial<ConfigProps & InjectedFormProps<any, any>> & {
    schema: FormFieldSchema[];
    dispatch?: (...args: any[]) => any;
    noButton?: boolean;
    disableResubmit?: boolean;
}, {}> {
    submitable(): boolean;
    render(): JSX.Element;
}
