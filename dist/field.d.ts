/**
 * Created by buhi on 2017/7/26.
 */
import * as React from "react";
import { Store } from 'rehooker';
import { FormFieldSchema, FieldPath, FormState, WidgetInjectedProps } from './types';
import { ComponentMap } from './config';
/**
 * Created by buhi on 2017/7/26.
 */
export declare function renderFields(form: Store<FormState>, schema: FormFieldSchema[], keyPath: FieldPath, componentMap: ComponentMap): (JSX.Element | null)[] | null;
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
    unixtime?: boolean | undefined;
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
    componentMap: ComponentMap;
} & WidgetInjectedProps;
export declare function FormField(props: FormFieldProps): JSX.Element;
