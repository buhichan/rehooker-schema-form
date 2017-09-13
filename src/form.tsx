/**
 * Created by YS on 2016/10/31.
 */
import * as React from 'react'
import {reduxForm, ConfigProps, InjectedFormProps} from 'redux-form'
import {WidgetProps} from "./field";
import {renderFields} from "./render-fields";

export type Options = {name:string,value:string|number}[]
export type AsyncOptions = ()=>Promise<Options>
export type RuntimeAsyncOptions = (value:any, props?:WidgetProps)=>(Promise<Options>|Options)
export type FieldSchamaChangeListeners={
    /**
     * q:what is valuePath here?
     * a:
     * If your formValue is {"foo":{"haha":[{"bar":10032}]}}, then the callback here will receive these arguments:
     * 10032, {bar:10032}, [{bar:10032}], {haha:[{bar:10032}]}, {foo:...}
     */
    [fieldKey:string]: (value:any,formValue:any)=>Partial<FormFieldSchema>|Promise<Partial<FormFieldSchema>>;
};

export interface FormFieldSchema extends Partial<ConfigProps<any,any>>{
    key:string,
    type: string | React.ComponentClass<WidgetProps> | React.StatelessComponent<WidgetProps>,
    label:string,
    hide?:boolean,
    placeholder?:string,
    fullWidth?:boolean, //todo: should I put this presentation logic here?
    required?:boolean,
    disabled?:boolean,
    multiple?:boolean,
    children?:FormFieldSchema[]
    options?:Options | AsyncOptions | RuntimeAsyncOptions,
    defaultValue?:any
    /**
     * 返回url
     * @param file 要上传的文件
     */
    onFileChange?:(file:File|FileList)=>Promise<string>,
    data?:any,
    style?:React.CSSProperties,
    /**
     * keyPath will be the array of keys from the root of the form to your deeply nested field.
     */
    listens?:FieldSchamaChangeListeners| ((keyPath:string[])=>FieldSchamaChangeListeners),
    loadingText?:string
    [rest:string]:any
}

let DefaultButton = (props)=>{
    return <button type={props.type} className={"btn btn-primary"+(props.disabled?" disabled":"")} disabled={props.disabled} onClick={props.onClick}>
        {props.children}
    </button>
};

export function setButton(button: React.StatelessComponent<ButtonProps>){
    DefaultButton = button;
}

export type ButtonProps = {
    disabled:boolean,
    type:"submit"|"button",
    onClick?:any,
    children:any
}

@(reduxForm({
    form:"default"
}) as any)
export class ReduxSchemaForm extends React.PureComponent<Partial<ConfigProps&InjectedFormProps<any,any>>&{
    schema:FormFieldSchema[],
    noButton?:boolean,

    dispatch?:(...args:any[])=>any,
    disableResubmit?:boolean
},{}>{
    submitable(){
        return this.props.valid && !this.props.pristine && !this.props.submitting && !(this.props.disableResubmit && this.props.submitSucceeded);
    }
    render(){
        return <form className="redux-schema-form form-horizontal" onSubmit={this.props.handleSubmit}>
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
                        <DefaultButton type="submit" disabled={!this.submitable.apply(this)}>提交</DefaultButton>
                        <DefaultButton type="button" disabled={!this.submitable.apply(this)} onClick={this.props.reset}>重置</DefaultButton>
                    </div>
                </div> : <div />
            }
        </form>
    }
}