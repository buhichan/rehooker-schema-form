import { FormState, FormFieldSchema } from './form';
export declare class SubmissionError {
    error: any;
    constructor(error: any);
}
export declare function registerField(schema: FormFieldSchema, keyPath: string): (f: FormState) => {
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
    onSubmit: Function;
    initialValues: any;
    arrayKeys: string[];
};
export declare function unregisterField(schema: FormFieldSchema, keyPath: string): (f: FormState) => FormState;
export declare function submit(dispatch: (m: (s: FormState) => FormState) => void): void;
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
    onSubmit: Function;
    initialValues: any;
    arrayKeys: string[];
};
export declare function changeValue(key: string, valueOrEvent: any, validate?: FormFieldSchema['validate'], parse?: FormFieldSchema['parse']): (s: FormState) => {
    errors: {
        [x: string]: string;
    };
    values: {};
    submitting: boolean;
    submitSucceeded: boolean;
    meta: {
        [key: string]: {
            schema: FormFieldSchema;
        };
    };
    onSubmit: Function;
    initialValues: any;
    arrayKeys: string[];
};
export declare function initialize(initialValues: any, onSubmit: Function): (f: FormState) => {
    arrayKeys: string[];
    onSubmit: Function;
    values: {
        [key: string]: any;
    };
    initialValues: Record<string, any>;
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
        [x: string]: string;
    };
    values: {};
    submitting: boolean;
    submitSucceeded: boolean;
    meta: {
        [key: string]: {
            schema: FormFieldSchema;
        };
    };
    onSubmit: Function;
    initialValues: any;
    arrayKeys: string[];
};
export declare function removeArrayItem(key: string, oldKeys: string[], removedKey: string): (f: FormState) => {
    errors: any;
    values: any;
    meta: any;
    submitting: boolean;
    submitSucceeded: boolean;
    onSubmit: Function;
    initialValues: any;
    arrayKeys: string[];
};
