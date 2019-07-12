import { FormState, FormFieldSchema } from './form';
import { FieldPath } from './field';
export declare class SubmissionError {
    error: any;
    constructor(error: any);
}
export declare function submit(dispatch: (m: (s: FormState) => FormState) => void, submitFunc: (formValue: any) => Promise<void>): void;
export declare function reset(f: FormState): {
    values: any;
    submitting: boolean;
    submitSucceeded: boolean;
    errors: any;
    initialValues: any;
    valid: boolean;
    hasValidator: boolean;
};
export declare function changeValue(key: FieldPath, valueOrEvent: any, parse?: FormFieldSchema['parse']): (s: FormState) => {
    values: any;
    valid: boolean;
    submitting: boolean;
    submitSucceeded: boolean;
    errors: any;
    initialValues: any;
    hasValidator: boolean;
};
export declare function initialize(initialValues: any): (f: FormState) => {
    values: any;
    initialValues: any;
    initialized: boolean;
    submitting: boolean;
    submitSucceeded: boolean;
    errors: any;
    valid: boolean;
    hasValidator: boolean;
};
