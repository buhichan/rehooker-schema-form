/// <reference types="react" />
import { Store } from 'rehooker';
import { FormState } from './form';
declare type FormButtonsProps = {
    disabled: boolean;
    pristine?: boolean;
    submitSucceeded: boolean;
    submitting: boolean;
    onSubmit: (e?: any) => void;
    onReset: (e?: any) => void;
};
declare let FormButtonsImpl: (props: FormButtonsProps) => JSX.Element;
export declare type ButtonProps = {
    disabled: boolean;
    submitSucceeded: boolean;
    submitting: boolean;
    type: "submit" | "button";
    onClick?: any;
    children: any;
};
export declare function setButton(buttons: InjectFormSubmittableProps['children']): void;
declare type InjectFormSubmittableProps = {
    form: Store<FormState>;
    /**
     *  @deprecated disableResubmit, use submittable instead
     */
    disableResubmit?: boolean;
    children?: typeof FormButtonsImpl;
    onSubmit: (formValues: any) => Promise<void>;
};
export declare function FormButtons(props: InjectFormSubmittableProps): JSX.Element | null;
export {};
