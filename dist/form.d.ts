/// <reference types="react" />
import { Mutation, Store } from "rehooker";
import { OperatorFunction } from 'rxjs';
import { FormState, FormFieldSchema } from './types';
declare type CreateFormOptions = {
    validator?: (v: any) => Promise<ErrorMap>;
    validationDelay?: number;
    middleware?: OperatorFunction<Mutation<FormState>, Mutation<FormState>>;
};
declare type ErrorMap = Record<string, any>;
export declare function createForm(options?: CreateFormOptions): Store<FormState>;
export declare type SchemaFormProps = {
    schema: FormFieldSchema[];
    noButton?: boolean;
    form: Store<FormState>;
    initialValues?: any;
    onSubmit?: (values: any) => Promise<void>;
    disableInitialize?: boolean;
    disableDestruction?: boolean;
};
export declare function SchemaForm(props: SchemaFormProps): JSX.Element;
export {};
