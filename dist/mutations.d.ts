import { FormState, FormFieldSchema } from './form';
export declare class SubmissionError {
    error: any;
    constructor(error: any);
}
export declare function registerField(key: string, schema: FormFieldSchema): (f: FormState) => {
    meta: {
        [x: string]: {
            schema: FormFieldSchema;
        } | {
            schema: FormFieldSchema;
        };
    };
    submitting: boolean;
    submitSucceeded: boolean;
    errors: {
        [key: string]: string;
    };
    values: {
        [key: string]: any;
    } | undefined;
    initialValues: any;
    arrayKeys: string[];
    initialized: boolean;
};
export declare function unregisterField(key: string): (f: FormState) => FormState;
export declare function submit(dispatch: (m: (s: FormState) => FormState) => void, submitFunc: (formValue: any) => Promise<void>): void;
export declare function setFieldError(key: string, error: string): (s: FormState) => FormState;
export declare function reset(f: FormState): {
    values: any;
    submitting: boolean;
    submitSucceeded: boolean;
    errors: {
        [key: string]: string;
    };
    meta: {
        [key: string]: {
            schema: FormFieldSchema;
        };
    };
    initialValues: any;
    arrayKeys: string[];
    initialized: boolean;
};
export declare function startValidation(key: string, validate?: FormFieldSchema['validate']): (s: FormState) => FormState;
export declare function changeValue(key: string, valueOrEvent: any, validate?: FormFieldSchema['validate'], parse?: FormFieldSchema['parse']): (s: FormState) => {
    errors: {
        [key: string]: string;
    };
    values: {};
    submitting: boolean;
    submitSucceeded: boolean;
    meta: {
        [key: string]: {
            schema: FormFieldSchema;
        };
    };
    initialValues: any;
    arrayKeys: string[];
    initialized: boolean;
};
export declare function initialize(initialValues: any, schema: FormFieldSchema[]): (f: FormState) => {
    arrayKeys: string[];
    schema: FormFieldSchema[];
    values: Record<string, any>;
    initialValues: Record<string, any>;
    initialized: boolean;
    submitting: boolean;
    submitSucceeded: boolean;
    errors: {
        [key: string]: string;
    };
    meta: {
        [key: string]: {
            schema: FormFieldSchema;
        };
    };
};
export declare function addArrayItem(key: string, oldKeys: string[]): (f: FormState) => {
    errors: {
        [key: string]: string;
    };
    values: {};
    submitting: boolean;
    submitSucceeded: boolean;
    meta: {
        [key: string]: {
            schema: FormFieldSchema;
        };
    };
    initialValues: any;
    arrayKeys: string[];
    initialized: boolean;
};
export declare function removeArrayItem(key: string, oldKeys: string[], removedId: string): (f: FormState) => {
    errors: any;
    values: any;
    meta: any;
    submitting: boolean;
    submitSucceeded: boolean;
    initialValues: any;
    arrayKeys: string[];
    initialized: boolean;
};
