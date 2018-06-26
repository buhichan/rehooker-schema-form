import { createSelector } from 'reselect';
import {connect} from "react-redux"
import * as React from 'react';
import {isValid,isPristine,isSubmitting,hasSubmitSucceeded,InjectedFormProps, submit, reset} from "redux-form"

export let FormButton = (props:any)=>{
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

export const submittable = (disableResubmit:boolean)=>(formState:Partial<InjectedFormProps>)=>{
    const {valid,pristine,submitting,submitSucceeded} = formState
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
    return (Button:React.StatelessComponent<any>|React.ComponentClass<any>)=>(connect as any)(
        (_:any,p:any)=>{
            return (createSelector as any)(
                [
                    isValid(p.formName || options.formName),
                    isPristine(p.formName || options.formName),
                    isSubmitting(p.formName || options.formName),
                    hasSubmitSucceeded(p.formName || options.formName)
                ],
                (valid:boolean,pristine:boolean,submitting:boolean,submitSucceeded:boolean)=>{
                    const disabled = options.submittable ? 
                        !options.submittable(valid,pristine,submitting,submitSucceeded) :
                        !submittable(options.disableResubmit)({valid,pristine,submitting,submitSucceeded})
                    return {
                        formName:options.formName||p.formName,
                        disabled
                    }
                }
            )
        }
    )(class ConnectedButton extends React.PureComponent<any,any>{
        onClick=()=>{
            this.props.dispatch(options.type==='submit'?submit(this.props.formName):reset(this.props.formName))
        }
        render(){
            const {dispatch,formName,...rest} = this.props;
            return <Button {...rest} type={options.type} onClick={this.onClick} />
        }
    })
}