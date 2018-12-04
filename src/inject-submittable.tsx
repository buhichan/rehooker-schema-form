import * as React from 'react';
import { FormState } from './form';
import { useSource, Store } from 'rehooker';
import { map } from 'rxjs/operators';
import { submit, reset } from './mutations';

type FormButtonsProps = {
    disabled:boolean,submitSucceeded:boolean,submitting:boolean,onSubmit:()=>void,onReset:()=>void
}

let FormButtonsImpl = (props:FormButtonsProps)=>{
    return <div className="button">
        <div className="btn-group">
            <button type="submit" className={"btn btn-primary"+(props.disabled?" disabled":"")} disabled={props.disabled} onClick={props.onSubmit}>
                submit
            </button>
            <button type="submit" className={"btn btn-primary"+(props.disabled?" disabled":"")} disabled={props.disabled} onClick={props.onSubmit}>
                reset
            </button>
        </div>
    </div>
}

export type ButtonProps = {
    disabled:boolean,
    submitSucceeded:boolean,
    submitting:boolean,
    type:"submit"|"button",
    onClick?:any,
    children:any
}

export function setButton(buttons:InjectFormSubmittableProps['children']){
    if(buttons){
        FormButtonsImpl = buttons
    }
}

type InjectFormSubmittableProps = {  
    form:Store<FormState>,
    /**
     *  @deprecated disableResubmit, use submittable instead
     */
    disableResubmit?:boolean
    children?:typeof FormButtonsImpl
}

export function FormButtons(props:InjectFormSubmittableProps){
    const res = useSource(props.form.stream,map(s=>{
        const values = s.values
        const pristine = s.initialValues &&
            values && 
            Object.keys(values).length === Object.keys(s.initialValues).length && 
            Object.keys(values).every(k=>{
                const v1 = values[k]
                const v2 = s.initialValues[k]
                return v1 === v2 || !v1 && !v2
            })
        const hasError = Object.keys(s.errors).length !== 0 
        return {
            submittable:!hasError&&
            !pristine &&
            !s.submitting &&
            !(props.disableResubmit && s.submitSucceeded),
            submitting: s.submitting,
            submitSucceeded: s.submitSucceeded
        }
    }),[props.form])
    if(!res)
        return null
    const childProps = {
        disabled:!res.submittable,
        submitting:res.submitting,
        submitSucceeded: res.submitSucceeded,
        onSubmit:()=>{
            submit(props.form.next)
        },
        onReset:()=>{
            props.form.next(reset)
        }
    }
    if(!props.children)
        return <FormButtonsImpl {...childProps}/>
    return <>
        {props.children(childProps)}
    </>
}