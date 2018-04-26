import { createSelector } from 'reselect';
import {connect} from "react-redux"
import * as React from 'react';
import {isValid,isPristine,isSubmitting,hasSubmitSucceeded,InjectedFormProps, ConfigProps, submit, reset} from "redux-form"

export const buttons = function(Buttons){

}

export let FormButton = (props)=>{
    return <button type={props.type} className={"btn btn-primary"+(props.disabled?" disabled":"")} disabled={props.disabled} onClick={props.onClick}>
        {props.children}
    </button>
};

export type ButtonProps = {
    disabled:boolean,
    type:"submit"|"button",
    onClick?:any,
    children:any
}

export const submittable = (disableResubmit)=>({valid,pristine,submitting,submitSucceeded})=>{
    return valid && !pristine && !submitting && !(disableResubmit && submitSucceeded);
}


export function setButton(button: React.StatelessComponent<ButtonProps>){
    FormButton = button;
}

interface InjectSubmittableOptions {  
    formName:string,
    type:"submit"|"reset",
    /**
     *  @deprecated disableResubmit, use submittable instead
     */
    disableResubmit?:boolean
    submittable?:(valid:boolean,pristine:boolean,submitting:boolean,submitSucceeded:boolean)=>boolean
}

export const injectSubmittable = (options:InjectSubmittableOptions)=>{
    return Button=>(connect as any)(
        (s,p)=>{
            return (createSelector as any)(
                [
                    isValid(p.formName || options.formName),
                    isPristine(p.formName || options.formName),
                    isSubmitting(p.formName || options.formName),
                    hasSubmitSucceeded(p.formName || options.formName)
                ],
                (valid,pristine,submitting,submitSucceeded)=>{
                    const disabled = options.submittable ? 
                        !options.submittable(valid,pristine,submitting,submitSucceeded) :
                        !submittable(options.disableResubmit)({valid,pristine,submitting,submitSucceeded})
                    return {
                        disabled
                    }
                }
            )
        }
    )(class ConnectedButton extends React.PureComponent<any,any>{
        onClick=()=>{
            this.props.dispatch(options.type==='submit'?submit(options.formName):reset(options.formName))
        }
        render(){
            const {dispatch,...rest} = this.props;
            return <Button {...rest} type={options.type} onClick={this.onClick} />
        }
    })
}