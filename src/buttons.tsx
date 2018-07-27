import { createSelector } from 'reselect';
import {connect, StatelessComponent} from "react-redux"
import * as React from 'react';
import {isValid,isPristine,isSubmitting,hasSubmitSucceeded, submit, reset} from "redux-form"

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

export const submittable = (formState:{valid?:boolean,pristine?:boolean,submitting?:boolean,submitSucceeded?:boolean,disableResubmit?:boolean})=>{
    const {valid,pristine,submitting,submitSucceeded, disableResubmit} = formState
    return valid && !pristine && !submitting && !(disableResubmit && submitSucceeded);
}


export function setButton(button: React.StatelessComponent<ButtonProps>){
    FormButton = button;
}

interface InjectSubmittableOptions {  
    formName?:string,
    type?:"submit"|"reset",
    /**
     *  @deprecated disableResubmit, use submittable instead
     */
    disableResubmit?:boolean
    submittable?:typeof submittable
}

type InjectFormSubmittableProps = {  
    formName?:string,
    type?:"submit"|"reset",
    /**
     *  @deprecated disableResubmit, use submittable instead
     */
    disableResubmit?:boolean
    submittable?:typeof submittable
    children?:(args:{disabled:boolean,onSubmit:any,onReset:any})=>React.ReactNode
}

const createFormSubmittableSelector = (formName:string, disableResubmit:boolean, criteria=submittable)=>createSelector<any,any,any,any,any,any>(
    [
        s=>isValid(formName)(s),
        s=>isPristine(formName)(s),
        s=>isSubmitting(formName)(s),
        s=>hasSubmitSucceeded(formName)(s)
    ],
    (valid:boolean,pristine:boolean,submitting:boolean,submitSucceeded:boolean)=>{
        return {
            formName,
            disabled:criteria({disableResubmit,valid,pristine,submitting,submitSucceeded})
        }
    }
)

export const InjectFormSubmittable:StatelessComponent<InjectFormSubmittableProps> = (connect as any)(
    (_:any,props:any)=>createFormSubmittableSelector(props.formName,props.disableResubmit,props.submittable)
)(
    function InjectFormSubmittable(props:InjectFormSubmittableProps&{dispatch?:any,disabled:boolean}){
        return props.children({
            disabled:props.disabled,
            onSubmit:()=>{
                props.dispatch(submit(props.formName))
            },
            onReset:()=>{
                props.dispatch(reset(props.formName))
            }
        })
    }
)

/**
 * 
 * @deprecated
 */
export const injectSubmittable = (options:InjectSubmittableOptions)=>{
    return (Button:React.StatelessComponent<any>|React.ComponentClass<any>)=>(connect as any)(
        (_:any,p:any)=>{
            return createFormSubmittableSelector(p.formName || options.formName, options.disableResubmit, options.submittable)
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