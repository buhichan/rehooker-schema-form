import * as React from 'react';
import { Store, useSource } from 'rehooker';
import { map } from 'rxjs/operators';
import { submit, reset } from './mutations';
import { FormState } from "./types"
import { FormButtonsProps, SchemaFormConfigConsumer } from "./config"


export type ButtonProps = {
    disabled:boolean,
    submitSucceeded:boolean,
    submitting:boolean,
    type:"submit"|"button",
    onClick?:any,
    children:any
}

type InjectFormSubmittableProps = {  
    form:Store<FormState>,
    /**
     *  @deprecated disableResubmit, use submittable instead
     */
    allowPristine?:boolean
    disableResubmit?:boolean
    children?:(props:FormButtonsProps)=>React.ReactNode,
    onSubmit:(formValues:any)=>Promise<void>
}

export function FormButtons(props:InjectFormSubmittableProps){
    const res = useSource(props.form.stream,map(s=>{
        const pristine = s.initialValues === s.values
        const hasError = !s.valid
        const submittable = !hasError&&
            (props.allowPristine || !pristine) &&
            !s.submitting &&
            !(props.disableResubmit && s.submitSucceeded)
        return {
            pristine,
            submittable,
            submitting: s.submitting,
            submitSucceeded: s.submitSucceeded
        }
    }),[props.form,props.allowPristine,props.disableResubmit])
    if(!res)
        return null
    const childProps = {
        pristine:res.pristine,
        disabled:!res.submittable,
        submitting:res.submitting,
        submitSucceeded: res.submitSucceeded,
        onSubmit:(e:any)=>{
            if(e && e.preventDefault){
                e.preventDefault()
            }
            submit(props.form.next,props.onSubmit)
        },
        onReset:(e:any)=>{
            if(e && e.preventDefault){
                e.preventDefault()
            }
            props.form.next(reset)
        }
    }
    if(!props.children)
        return <SchemaFormConfigConsumer>
            {({buttonRenderer: FormButtonsImpl})=>{
                return <FormButtonsImpl {...childProps}/>
            }}
        </SchemaFormConfigConsumer>
    return <>
        {props.children(childProps)}
    </>
}