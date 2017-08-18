/// <reference types="react" />
/**
 * Created by buhi on 2017/7/26.
 */
import * as React from "react";
import { FormFieldSchema } from "./form";
export declare type WidgetProps = {
    fieldSchema?: FormFieldSchema;
    renderField?: typeof StatelessField;
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
    onSchemaChange: (changes: Partial<FormFieldSchema>[] | Promise<Partial<FormFieldSchema>[]>) => void;
};
export declare function addType(name: any, widget?: React.ComponentClass<WidgetProps> | React.StatelessComponent<WidgetProps>): any;
export declare function addTypeWithWrapper(name: any, widget: any): void;
export declare function preRenderField(field: FormFieldSchema, form: string, keyPath: string): any;
export declare class StatelessField extends React.PureComponent<{
    field: FormFieldSchema;
    form: string;
    keyPath: string;
}> {
    render(): any;
}
