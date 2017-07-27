/// <reference types="react" />
/**
 * Created by buhi on 2017/7/26.
 */
import * as React from "react";
import { ParsedFormFieldSchema } from "./form";
export declare type CustomWidgetProps = WidgetProps;
export declare type WidgetProps = {
    fieldSchema?: ParsedFormFieldSchema;
    renderField?: typeof renderField;
    keyPath: string;
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
    hide?: boolean;
    [rest: string]: any;
    onSchemaChange: (changes: Partial<ParsedFormFieldSchema>[] | Promise<Partial<ParsedFormFieldSchema>[]>) => void;
};
export declare function addType(name: any, widget: React.ComponentClass<WidgetProps> | React.StatelessComponent<WidgetProps>): void;
export declare function renderField(field: ParsedFormFieldSchema, form: string, keyPath: string, initialValues: any, onSchemaChange: any, refChildNode: any): any;
