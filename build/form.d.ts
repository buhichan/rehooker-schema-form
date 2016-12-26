/// <reference path="../src/declares.d.ts" />
/**
 * Created by YS on 2016/10/31.
 */
import * as React from 'react';
import "whatwg-fetch";
import { MyReduxFormConfig } from "./redux-form-config";
import { List } from "immutable";
export declare type SupportedFieldType = "text" | "password" | "file" | "select" | "date" | 'datetime-local' | "checkbox" | "textarea" | "group" | "color" | "number" | "array" | string;
export declare type Options = {
    name: string;
    value: string | number;
}[];
export declare type AsyncOptions = () => Promise<Options>;
export interface BaseSchema {
    key: string;
    type: SupportedFieldType;
    label: string;
    hide?: boolean;
    placeholder?: string;
    value?: any;
    required?: boolean;
    disabled?: boolean;
    defaultValue?: any;
    children?: BaseSchema[] | List<BaseSchema>;
    options?: Options | AsyncOptions;
    normalize?: (value, previousValue, allValues) => any;
    data?: any;
}
export interface FormFieldSchema extends BaseSchema {
    onChange?: (value, previousValue, allValues) => ParsedFormFieldSchema[] | Promise<ParsedFormFieldSchema[]>;
    options?: Options | AsyncOptions;
    children?: FormFieldSchema[];
}
export interface ParsedFormFieldSchema extends BaseSchema {
    options?: Options;
    parsedKey: string;
    children?: List<ParsedFormFieldSchema>;
}
export declare type customWidgetProps = {
    fieldSchema: ParsedFormFieldSchema;
    knownProps: any;
    renderField: (fieldSchema: ParsedFormFieldSchema) => JSX.Element;
};
export declare function addType(name: any, widget: React.ComponentClass<customWidgetProps> | React.StatelessComponent<customWidgetProps>): void;
export declare function setButton(button: React.StatelessComponent<ButtonProps>): void;
export declare type ButtonProps = {
    disabled: boolean;
    type: "submit" | "button";
    onClick?: any;
    children: any;
};
export declare class ReduxSchemaForm extends React.PureComponent<MyReduxFormConfig & {
    fields?: string[];
    schema: FormFieldSchema[];
    onSubmit?: (...args: any[]) => void;
    dispatch?: (...args: any[]) => any;
    readonly?: boolean;
    initialize?: (data: any, keepDirty: boolean) => any;
    noButton?: boolean;
}, {
    parsedSchema?: List<ParsedFormFieldSchema>;
}> {
    constructor();
    isUnmounting: boolean;
    changeSchema(newFields: any): any;
    parseField(field: FormFieldSchema, prefix: any): Promise<ParsedFormFieldSchema>;
    parseSchema(newSchema: FormFieldSchema[], prefix?: string): Promise<List<ParsedFormFieldSchema>>;
    DefaultArrayFieldRenderer(props: any): JSX.Element;
    componentWillReceiveProps(newProps: any): void;
    onReady(schema: List<ParsedFormFieldSchema>): void;
    componentWillMount(): void;
    componentWillUnmount(): void;
    renderField(fieldSchema: ParsedFormFieldSchema): any;
    submitable(): boolean;
    render(): JSX.Element;
}
