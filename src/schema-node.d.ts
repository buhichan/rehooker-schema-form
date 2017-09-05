/// <reference types="react" />
/**
 * Created by buhi on 2017/7/26.
 */
import * as React from "react";
import { FormFieldSchema, ParsedFormFieldSchema } from "./form";
export interface SchemaNodeProps {
    form: string;
    schema: FormFieldSchema[];
    initialValues?: any;
    keyPath?: string;
    onSchemaChange?(changedSchema: Partial<ParsedFormFieldSchema>[]): void;
}
export declare class SchemaNode extends React.PureComponent<SchemaNodeProps, any> {
    state: {
        parsedSchema: any[];
    };
    pendingSchemaChanges: any[];
    onSchemaChange: (newFields: any) => void;
    applySchema(schema: ParsedFormFieldSchema[]): void;
    componentWillReceiveProps(newProps: any): void;
    onReady(schema: ParsedFormFieldSchema[]): void;
    componentWillMount(): void;
    parseField(field: FormFieldSchema): Promise<ParsedFormFieldSchema>;
    childrenNodes: {
        [key: string]: SchemaNode;
    };
    refChildrenNodes: (ref: any, key: any) => void;
    parseSchema(newSchema: FormFieldSchema[]): Promise<ParsedFormFieldSchema[]>;
    render(): JSX.Element;
}
