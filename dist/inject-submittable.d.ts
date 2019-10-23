import * as React from 'react';
import { Store } from 'rehooker';
import { FormState } from "./types";
import { FormButtonsProps } from "./config";
export declare type ButtonProps = {
    disabled: boolean;
    submitSucceeded: boolean;
    submitting: boolean;
    type: "submit" | "button";
    onClick?: any;
    children: any;
};
declare type InjectFormSubmittableProps = {
    form: Store<FormState>;
    /**
     *  @deprecated disableResubmit, use submittable instead
     */
    disableResubmit?: boolean;
    children?: (props: FormButtonsProps) => React.ReactNode;
    onSubmit: (formValues: any) => Promise<void>;
};
export declare function FormButtons(props: InjectFormSubmittableProps): JSX.Element | null;
export {};
