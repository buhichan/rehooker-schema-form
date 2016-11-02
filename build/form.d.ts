/**
 * Created by YS on 2016/10/31.
 */
import * as React from 'react';
import "./main.css";
import "whatwg-fetch";
export interface FormFieldSchema {
    key: string;
    type: string;
    label: string;
    hide?: boolean;
    placeholder?: string;
    value?: any;
    required?: boolean;
    disabled?: boolean;
    normalize: (value, previousValue, allValues) => any;
    options?: {
        name: string;
        value: any;
    }[] | string;
    children?: FormFieldSchema[];
}
export interface ParsedFormFieldSchema {
    key: string;
    parsedKey: string;
    type: string;
    label: string;
    hide?: boolean;
    placeholder?: string;
    value?: any;
    required?: boolean;
    disabled?: boolean;
    options?: {
        name: string;
        value: any;
    }[];
    normalize: (value, previousValue, allValues) => any;
    children?: ParsedFormFieldSchema[];
}
export declare class ReduxSchemaForm extends React.Component<{
    form: string;
    data: any;
    schema: FormFieldSchema[];
    onSubmit: (...args: any[]) => void;
    dispatch?: (...args: any[]) => any;
    initialize?: (data: any, keepDirty: boolean) => any;
} & {
    [id: string]: any;
}, {
    parsedSchema?: ParsedFormFieldSchema[];
}> {
    constructor();
    parseField(field: FormFieldSchema, prefix: any): Promise<ParsedFormFieldSchema>;
    parseSchema(newSchema: FormFieldSchema[], prefix?: string): Promise<ParsedFormFieldSchema[]>;
    componentWillReceiveProps(newProps: any): void;
    componentDidMount(): void;
    renderField(fieldSchema: ParsedFormFieldSchema): any;
    submitable(): boolean;
    render(): JSX.Element;
}
