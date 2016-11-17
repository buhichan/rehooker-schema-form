/// <reference path="../src/declares.d.ts" />
/**
 * Created by YS on 2016/10/31.
 */
import * as React from 'react';
import "./main.css";
import "whatwg-fetch";
import { MyReduxFormConfig } from "./redux-form-config";
export declare type SupportedFieldType = "text" | "password" | "file" | "select" | "date" | 'datetime-local' | "checkbox" | "textarea" | "group" | "color" | "number";
export declare type Options = {
    name: string;
    value: string;
}[];
export declare type AsyncOptions = {
    url: string;
    mapResToOptions?: (res: any) => Options;
};
export interface FormFieldSchema {
    key: string;
    type: SupportedFieldType;
    label: string;
    hide?: boolean;
    placeholder?: string;
    value?: any;
    required?: boolean;
    disabled?: boolean;
    normalize?: (value, previousValue, allValues) => any;
    options?: Options | AsyncOptions;
    children?: FormFieldSchema[];
}
export interface ParsedFormFieldSchema {
    key: string;
    parsedKey: string;
    type: SupportedFieldType;
    label: string;
    hide?: boolean;
    placeholder?: string;
    required?: boolean;
    disabled?: boolean;
    options?: Options;
    normalize: (value, previousValue, allValues) => any;
    children?: ParsedFormFieldSchema[];
}
export declare type customWidgetProps = {
    form: string;
    fieldSchema: ParsedFormFieldSchema;
    knownProps: any;
};
export declare function addType(name: any, widget: React.ComponentClass<customWidgetProps> | React.StatelessComponent<customWidgetProps>): void;
export declare class ReduxSchemaForm extends React.Component<MyReduxFormConfig & {
    fields?: string[];
    schema: FormFieldSchema[];
    onSubmit: (...args: any[]) => void;
    dispatch?: (...args: any[]) => any;
    initialize?: (data: any, keepDirty: boolean) => any;
}, {
    parsedSchema?: ParsedFormFieldSchema[];
}> {
    constructor();
    isUnmounting: boolean;
    parseField(field: FormFieldSchema, prefix: any): Promise<ParsedFormFieldSchema>;
    parseSchema(newSchema: FormFieldSchema[], prefix?: string): Promise<ParsedFormFieldSchema[]>;
    componentWillReceiveProps(newProps: any): void;
    componentDidMount(): void;
    componentWillUnmount(): void;
    renderField(fieldSchema: ParsedFormFieldSchema): any;
    submitable(): boolean;
    render(): JSX.Element;
}
