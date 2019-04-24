/**
 * Created by YS on 2016/10/31.
 */
import { FormButtons } from './inject-submittable';
import * as React from 'react';
import {renderFields} from "./field";
import {Store, createStore, useSource, Mutation} from "rehooker"
import { initialize, submit } from './mutations';
import { map } from 'rxjs/operators';
import { OperatorFunction } from 'rxjs';

export type Options = {name:string,value:any}[]
export type AsyncOptions = ()=>Promise<Options>
export type RuntimeAsyncOptions = (value:any, props?:WidgetProps)=>(Promise<Options>|Options)
export type FieldListens={
    /**
     * q:what is valuePath here?
     * a:
     * If your formValue is {"foo":{"haha":[{"bar":10032}]}}, then the callback here will receive these arguments:
     * 10032, {bar:10032}, [{bar:10032}], {haha:[{bar:10032}]}, {foo:...}
     */
    to:string[]|((keyPath:string)=>string[]),
    then:(values:any[])=>Partial<FormFieldSchema&{value:any}>|Promise<Partial<FormFieldSchema>&{value:any}>|void;
}[]

export interface WidgetInjectedProps{
    hide?:boolean,
    multiple?:boolean,
    placeholder?:any,
    fullWidth?:boolean, //todo: should I put this presentation logic here?
    required?:boolean,
    disabled?:boolean,
    [propName:string]:any
}

export type WidgetProps = {
    schema:FormFieldSchema,
    form:Store<FormState>,
    onChange:(e:any)=>void,
    onBlur:(e:any)=>void,
    value:any
    componentProps:any,
    keyPath:string,
    error:any
    meta:any
}

export type FormFieldSchema = WidgetInjectedProps & {
    key:string,
    label:string,
    type: string | React.ComponentClass<WidgetProps> | React.StatelessComponent<WidgetProps>,
    children?:FormFieldSchema[]
    /**
     * keyPath will keyPath from the root of the form to your deeply nested field. e.g. foo.bar[1].far
     */
    listens?:FieldListens,
    validate?:(value:any,formValue:any)=>string|undefined|null,
    parse?:(v:any)=>any,
    format?:(v:any)=>any,
    style?:React.CSSProperties,
    defaultValue?:any // set when mount
    options?:Options | AsyncOptions | RuntimeAsyncOptions,

    wrapperProps?:any // used as antd's Form.Item props
}

export type FormState = {
    submitting:boolean,
    submitSucceeded:boolean,
    errors:{
        [key:string]:string
    }
    values:{
        [key:string]:any
    } | undefined
    meta:{
        [key:string]:{
            schema:FormFieldSchema
        }
    }
    onSubmit:Function,
    initialValues:any,
    arrayKeys:string[]
    initialized:boolean
}

// const store = createStore({})

export type SchemaFormProps = {
    schema:FormFieldSchema[],
    noButton?:boolean,
    form:Store<FormState>,
    initialValues?:any
    onSubmit?:(values:any)=>void | Promise<void>,
    disableInitialize?:boolean
    disableDestruction?:boolean
}

const defaultFormState:FormState = {
    submitting:false,
    submitSucceeded:false,
    initialValues:undefined,
    onSubmit:()=>{},
    meta:{},
    errors:{},
    values:undefined,
    arrayKeys:[],
    initialized:false,
}

export function createForm(middleware?:OperatorFunction<Mutation<FormState>,Mutation<FormState>>){
    return createStore(defaultFormState,middleware)
}

export function SchemaForm(props:SchemaFormProps){
    const handleSubmit = React.useMemo(()=>(e:React.FormEvent)=>{
        e.preventDefault()
        submit(props.form.next)
        return false
    },[props.form])
    React.useEffect(()=>{
        if(!props.disableInitialize){
            props.form.next(s=>{
                return initialize(props.initialValues,props.onSubmit || noopSubmit) (s)
            })
        }
    },[props.initialValues,props.onSubmit])
    React.useEffect(()=>()=>{
        if(!props.disableDestruction){
            props.form.next(function destroyOnUnmounnt(){
                return defaultFormState 
            })
        }
    },[props.form])
    const initialized = useSource(props.form.stream,map(x=>x.values))
    return <form className="schema-form" onSubmit={handleSubmit}>
        {!initialized ? null : renderFields(props.form,props.schema,"")}
        {
            (!props.noButton)? <FormButtons form={props.form} /> : null
        }
    </form>
}

const noopSubmit = ()=>{
    console.warn("You see this because you pass no submit function!")
}