/**
 * Created by YS on 2016/10/31.
 */
import * as React from 'react';
import { createStore, Mutation, Store } from "rehooker";
import { OperatorFunction } from 'rxjs';
import { debounceTime, distinctUntilKeyChanged } from 'rxjs/operators';
import { renderFields } from "./field";
import { initialize, submit } from './mutations';
import { FormState, FormFieldSchema } from './types';
import { SchemaFormConfigConsumer } from './config';
import { FormButtons } from '.';


const emptyMap = {}


const defaultFormState = {
    submitting:false,
    submitSucceeded:false,
    initialValues:emptyMap,
    errors:emptyMap,
    values:emptyMap,
    valid:true,
}

type CreateFormOptions = {
    validator?:(v:any)=>Promise<ErrorMap>,
    validationDelay?:number,
    middleware?:OperatorFunction<Mutation<FormState>,Mutation<FormState>>
}

type ErrorMap = Record<string,any>

export function createForm(options?:CreateFormOptions){
    const store = createStore({
        ...defaultFormState,
        hasValidator: options && !!options.validator || false,
    },options?options.middleware:undefined)

    const validator = options && options.validator

    store.stream.pipe(
        distinctUntilKeyChanged("values"),
        debounceTime(options && options.validationDelay || 50)
    ).subscribe(async fs=>{
        if(fs.values !== fs.initialValues){
            if(validator){
                const errors = await validator(fs.values)
                store.next(f=>({
                    ...f,
                    valid:!Object.keys(errors).some(y=>!!errors[y]),
                    errors
                }))
            }else{
                store.next(f=>({
                    ...f,
                    valid:true,
                    errors:{}
                }))
            }
        }
    })
    return store
}

// const store = createStore({})

export type SchemaFormProps = {
    schema:FormFieldSchema[],
    noButton?:boolean,
    form:Store<FormState>,
    initialValues?:any
    onSubmit?:(values:any)=>Promise<void>,
    disableInitialize?:boolean
    disableDestruction?:boolean
}

export function SchemaForm(props:SchemaFormProps){
    const handleSubmit = React.useMemo(()=>(e:React.FormEvent)=>{
        e.preventDefault()
        submit(props.form.next,props.onSubmit || noopSubmit)
        return false
    },[props.form])

    React.useEffect(()=>{
        if(!props.disableInitialize){
            props.form.next(s=>{
                return initialize(props.initialValues) (s)
            })
        }
    },[props.initialValues])

    React.useEffect(()=>()=>{
        if(!props.disableDestruction){
            props.form.next(function destroyOnUnmounnt(s){
                return {
                    ...s,
                    ...defaultFormState,
                } 
            })
        }
    },[props.form])

    return <SchemaFormConfigConsumer>
        {({componentMap})=><form className="schema-form" onSubmit={handleSubmit}>
            { renderFields(props.form,props.schema,[],componentMap)}
            {
                (!props.noButton)? <FormButtons onSubmit={props.onSubmit || noopSubmit} form={props.form} /> : null
            }
        </form>}
    </SchemaFormConfigConsumer>
}

const noopSubmit = ()=>{
    return Promise.resolve()
}