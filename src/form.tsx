/**
 * Created by YS on 2016/10/31.
 */
import * as React from 'react';
import { createStore, Mutation, Store } from "rehooker";
import { OperatorFunction } from 'rxjs';
import { debounceTime, distinctUntilKeyChanged, scan } from 'rxjs/operators';
import { renderFields } from "./field";
import { initialize, submit } from './mutations';
import { FormState, FormFieldSchema } from './types';
import { SchemaFormConfigConsumer } from './config';
import { FormButtons } from '.';


const emptyMap = {}

export {FormFieldSchema, WidgetProps} from "./types"

const defaultFormState = {
    submitting:false,
    submitSucceeded:false,
    initialValues:emptyMap,
    errors:emptyMap,
    values:emptyMap,
    valid:true,
    hasValidator: false,
    validating: false,
}

type CreateFormOptions = {
    validator?:(v:any)=>Promise<ErrorMap>,
    validationDelay?:number,
    middleware?:OperatorFunction<Mutation<FormState>,Mutation<FormState>>
}

type ErrorMap = Record<string,any>

export function createForm(options?:CreateFormOptions){

    const validator = options?.validator

    const store = createStore({
        ...defaultFormState,
        hasValidator: !!validator,
    },options?options.middleware:undefined)

    const hasValidatorError = (errorInfo:any):boolean => {
        return Object.keys(errorInfo).some(y=>{
            const errorItem = errorInfo[y]
            if(Array.isArray(errorItem)){
                return errorItem.some(hasValidatorError)
            }
            if(errorItem !== null && typeof errorItem === 'object'){
                return hasValidatorError(errorItem)
            }else{
                return !!errorItem
            }
        })
    }

    store.stream.pipe(
        distinctUntilKeyChanged("values"),
        debounceTime(options && options.validationDelay || 50),
        scan<FormState, [FormState?, FormState?]>((acc,v)=>{
            acc[0] = acc[1]
            acc[1] = v
            return acc
        }, [undefined,undefined])
    ).subscribe(async ([prevFs, curFs])=>{
        if(curFs && prevFs?.values !== curFs?.values){
            if(validator){
                store.next(f=>({
                    ...f,
                    validating: true,
                }))
                const errors = await validator(curFs.values)
                store.next(f=>({
                    ...f,
                    validating: false,
                    valid:!hasValidatorError(errors),
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
    allowPristine?:boolean,
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
                (!props.noButton)? <FormButtons allowPristine={props.allowPristine} onSubmit={props.onSubmit || noopSubmit} form={props.form} /> : null
            }
        </form>}
    </SchemaFormConfigConsumer>
}

const noopSubmit = ()=>{
    return Promise.resolve()
}