/**
 * Created by YS on 2016/10/31.
 */
import { FormButton, submittable } from './buttons';
import * as React from 'react';
import {ConfigProps, InjectedFormProps,BaseFieldProps, reset} from 'redux-form'
import {WidgetProps} from "./field";
import {renderFields} from "./render-fields";
import { getDecorator } from './decorate';

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
    to:string|string[]|((keyPath:string)=>string),
    then:(change:{
        value:any|any[],
        formValues:any,
        dispatch:any,
        keyPath:string
    })=>Partial<FormFieldSchema&{value:any}>|Promise<Partial<FormFieldSchema>&{value:any}>|void;
}[]

export interface WidgetInjectedProps{
    hide?:boolean,
    multiple?:boolean,
    placeholder?:any,
    fullWidth?:boolean, //todo: should I put this presentation logic here?
    required?:boolean,
    disabled?:boolean,
    defaultValue?:any
    style?:React.CSSProperties,
    [propName:string]:any
}

export interface FormFieldSchema extends Partial<BaseFieldProps>,Partial<WidgetInjectedProps>{
    key:string,
    label:string,
    type: string | React.ComponentClass<WidgetProps> | React.StatelessComponent<WidgetProps>,
    children?:FormFieldSchema[]
    options?:Options | AsyncOptions | RuntimeAsyncOptions,
    /**
     * keyPath will keyPath from the root of the form to your deeply nested field. e.g. foo.bar[1].far
     */
    listens?:FieldListens,
}

@getDecorator()
export class ReduxSchemaForm extends React.PureComponent<ReduxSchemaFormProps,{}>{
    reset=()=>this.props.dispatch(reset(this.props.form))
    render(){
        const formClass = this.props.classes&&this.props.classes.form?this.props.classes.form:""
        return <form id={this.props.form} className={"redux-schema-form form-horizontal "+formClass} onSubmit={this.props.handleSubmit as any}>
            {renderFields(
                this.props.form,
                this.props.schema
            )}
            {this.props.children?<div className="children">
                {this.props.children}
            </div>:null}
            {
                (!this.props.noButton)? <div className="button">
                    <div className="btn-group">
                        <FormButton type="submit" disabled={!submittable(this.props)}>提交</FormButton>
                        <FormButton type="button" onClick={this.reset} disabled={!submittable(this.props)}>重置</FormButton>
                    </div>
                </div> : <div />
            }
        </form>
    }
}

type ReduxSchemaFormOwnProps = {
    schema:FormFieldSchema[],
    noButton?:boolean,
    classes?:any,
    dispatch?:(...args:any[])=>any,
    disableResubmit?:boolean
}

type ReduxSchemaFormProps = Partial<ConfigProps&InjectedFormProps<any,any>>&ReduxSchemaFormOwnProps
