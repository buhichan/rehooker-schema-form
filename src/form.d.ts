/// <reference types="react" />
/**
 * Created by YS on 2016/10/31.
 */
import * as React from 'react';
import { Config as ReduxFormConfig } from 'redux-form';
export declare type SupportedFieldType = "text" | "password" | "file" | "select" | "date" | 'datetime-local' | "checkbox" | "textarea" | "group" | "color" | "number" | "array" | string;
export declare type Options = {
    name: string;
    value: string | number;
}[];
export declare type AsyncOptions = () => Promise<Options | any>;
export interface BaseSchema extends ReduxFormConfig<any, any, any> {
    key: string;
    type: SupportedFieldType;
    label: string;
    hide?: boolean;
    placeholder?: string;
    value?: any;
    required?: boolean;
    disabled?: boolean;
    defaultValue?: any;
    multiple?: boolean;
    children?: BaseSchema[];
    options?: Options | AsyncOptions;
    normalize?: (value, previousValue, allValues) => any;
    data?: any;
    [rest: string]: any;
}
export interface FormFieldSchema extends BaseSchema {
    onChange?: (value, previousValue, allValues) => Partial<ParsedFormFieldSchema>[] | Promise<Partial<ParsedFormFieldSchema>[]>;
    options?: Options | AsyncOptions;
    children?: FormFieldSchema[];
}
export interface ParsedFormFieldSchema extends BaseSchema {
    options?: Options;
    parsedKey: string;
    children?: ParsedFormFieldSchema[];
}
export declare type CustomWidgetProps = {
    fieldSchema?: ParsedFormFieldSchema;
    renderField?: (fieldSchema: ParsedFormFieldSchema) => JSX.Element;
    meta?: {
        active: boolean;
        asyncValidating: boolean;
        autofilled: boolean;
        dirty: boolean;
        dispatch: (a: any) => void;
        error: any;
        form: string;
        invalid: boolean;
        pristine: boolean;
        submitFailed: boolean;
        submitting: boolean;
        touched: boolean;
        valid: boolean;
        visited: boolean;
        warning: any;
    };
    input?: {
        name: string;
        onBlur: (...args: any[]) => void;
        onChange: (...args: any[]) => void;
        onDragStart: (...args: any[]) => void;
        onDrop: (...args: any[]) => void;
        onFocus: (...args: any[]) => void;
        value: any;
    };
    [rest: string]: any;
};
export declare function addType(name: any, widget: React.ComponentClass<CustomWidgetProps> | React.StatelessComponent<CustomWidgetProps>): void;
export declare function setButton(button: React.StatelessComponent<ButtonProps>): void;
export declare type ButtonProps = {
    disabled: boolean;
    type: "submit" | "button";
    onClick?: any;
    children: any;
};
export declare class ReduxSchemaForm extends React.PureComponent<{
    [P in keyof ReduxFormConfig<any, any, any>]?: ReduxFormConfig<any, any, any>[P];
} & {
    'enableReinitialize'?: boolean;
    reset?(): void;
    fields?: string[];
    schema: FormFieldSchema[];
    onSubmit?: (...args: any[]) => void;
    dispatch?: (...args: any[]) => any;
    readonly?: boolean;
    initialize?: (data: any, keepDirty: boolean) => any;
    noButton?: boolean;
}, {
    parsedSchema?: ParsedFormFieldSchema[];
}> {
    constructor();
    isUnmounting: boolean;
    changeSchema(newFields: any): any;
    parseField(field: FormFieldSchema, prefix: any): Promise<ParsedFormFieldSchema>;
    parseSchema(newSchema: FormFieldSchema[], prefix?: string): Promise<ParsedFormFieldSchema[]>;
    DefaultArrayFieldRenderer(props: any): JSX.Element;
    componentWillReceiveProps(newProps: any): void;
    onReady(schema: ParsedFormFieldSchema[]): void;
    componentWillMount(): void;
    renderField(fieldSchema: ParsedFormFieldSchema): any;
    submitable(): boolean;
    render(): JSX.Element;
}
