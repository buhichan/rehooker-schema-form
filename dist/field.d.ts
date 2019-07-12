/**
 * Created by buhi on 2017/7/26.
 */
import * as React from "react";
import { FormFieldSchema, FieldListens, FormState, WidgetProps, WidgetInjectedProps } from "./form";
import { Store } from 'rehooker';
/**
 * Created by buhi on 2017/7/26.
 */
export declare function renderFields(form: Store<FormState>, schema: FormFieldSchema[], keyPath: FieldPath): (JSX.Element | null)[] | null;
declare type Widget = React.StatelessComponent<WidgetProps> | React.ComponentClass<WidgetProps>;
export declare function addType(name: string, widget: Widget): void;
export declare function clearTypes(): void;
export declare function getType(name: string): Widget | undefined;
export declare type FieldPath = (string | number)[];
export interface FieldProps {
    form: Store<FormState>;
    schema: FormFieldSchema;
    keyPath: FieldPath;
    listeners?: FieldListens;
    noWrapper?: boolean;
}
export declare function getComponentProps(field: FormFieldSchema): {
    [propName: string]: any;
    placeholder?: any;
    required?: boolean | undefined;
    disabled?: boolean | undefined;
    downloadPathPrefix?: string | undefined;
    itemsPerRow?: number | undefined;
    fullResult?: boolean | undefined;
    throttle?: number | undefined;
    showValueWhenNoEntryIsFound?: boolean | undefined;
    loadingText?: string | undefined;
    hideColumns?: string[] | undefined;
    disableDelete?: boolean | undefined;
    disableCreate?: boolean | undefined;
    disableSort?: boolean | undefined;
    disableImport?: boolean | undefined;
    disableFixSeparatorForExcel?: boolean | undefined;
    csvColumnSeparator?: string | undefined;
    okLabel?: string | undefined;
    cancelLabel?: string | undefined;
    locale?: any;
    dateFormat?: string | undefined;
    defaultValue?: any;
    wrapperProps?: any;
};
export declare function useField(form: Store<FormState>, key: FieldPath, format?: (v: any) => any): {
    value: any;
    error: any;
} | null;
export declare type FormFieldProps = {
    form: Store<FormState>;
    name: string;
    keyPath?: string[];
    label?: React.ReactNode;
    noWrapper?: boolean;
    type: FormFieldSchema['type'];
    listens?: FormFieldSchema['listens'];
    validate?: FormFieldSchema['validate'];
    parse?: FormFieldSchema['parse'];
    format?: FormFieldSchema['format'];
    style?: FormFieldSchema['style'];
    defaultValue?: FormFieldSchema['defaultValue'];
    options?: FormFieldSchema['options'];
    wrapperProps?: any;
} & WidgetInjectedProps;
export declare function FormField(props: FormFieldProps): JSX.Element;
export {};
