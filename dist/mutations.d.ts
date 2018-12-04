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
};
export declare function unregisterField(schema: FormFieldSchema, keyPath: string): (f: FormState) => {
    values: {};
    errors: {
        [x: string]: string;
    };
    meta: {
        [x: string]: {
            schema: FormFieldSchema;
        };
    };
    submitting: boolean;
    submitSucceeded: boolean;
    onSubmit: Function;
    initialValues: any;
};
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
};
export declare function changeValue(schema: FormFieldSchema, keyPath: string, valueOrEvent: any): (s: FormState) => {
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
};
export declare function initialize(initialValues: any, onSubmit: Function): (f: FormState) => {
    onSubmit: Function;
    values: {
        [key: string]: any;
    };
    initialValues: {};
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
export declare function addArrayItem(schema: FormFieldSchema, keyPath: string, oldKeys: string[]): (f: FormState) => {
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
};
export declare function removeArrayItem(schema: FormFieldSchema, keyPath: string, oldKeys: string[], removedKey: string): (f: FormState) => {
    errors: any;
    values: any;
    meta: any;
    submitting: boolean;
    submitSucceeded: boolean;
    onSubmit: Function;
    initialValues: any;
};
