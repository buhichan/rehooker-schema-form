/**
 * Created by YS on 2016/10/31.
 */
import { FormButton, submittable } from './buttons';
import * as React from 'react';
import {ConfigProps, InjectedFormProps,BaseFieldProps, reset} from 'redux-form'
import {WidgetProps} from "./field";
import {renderFields} from "./render-fields";
import { pushDecorator, getDecorator } from './decorate';

export type Options = {name:string,value:any}[]
export type AsyncOptions = ()=>Promise<Options>
export type RuntimeAsyncOptions = (value:any, props?:WidgetProps)=>(Promise<Options>|Options)
export type FieldSchamaChangeListeners={
    /**
     * q:what is valuePath here?
     * a:
     * If your formValue is {"foo":{"haha":[{"bar":10032}]}}, then the callback here will receive these arguments:
     * 10032, {bar:10032}, [{bar:10032}], {haha:[{bar:10032}]}, {foo:...}
     */
    [fieldKey:string]: (value:any,formValue:any)=>Partial<FormFieldSchema>|Promise<Partial<FormFieldSchema>>|void;
};

export interface FormFieldSchema extends Partial<BaseFieldProps>{
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
     * type: "file"
     * 返回url
     * @theme mui/antd
     * @param file 要上传的文件
     */
    onFileChange?:(file:File|FileList)=>Promise<string>,
    /**
     * type: "array"
     * @theme mui
     */
    itemsPerRow?:number
    /**
     * type: "autocomplete-text/async/-"
     * @theme mui
     */
    fullResult?:boolean
    /**
     * type: "autocomplete-async"
     * @theme mui
     */
    throttle?:number
    showValueWhenNoEntryIsFound?:boolean
    /**
     * type: "select"
     * @theme mui/antd
     */
    loadingText?:string,
    /**
     * type: "table-array/array"
     * @theme mui
     */
    disableDelete?:boolean,
    disableCreate?:boolean,
    disableSort?:boolean,
    /**
     * type: "table-array"
     * @theme mui
     */
    disableFixSeparatorForExcel?:boolean //we must add sep=, as the first row to prevent excel to change the separator
    csvColumnSeparator?:string

    data?:any,
    style?:React.CSSProperties,
    /**
     * keyPath will be the array of keys from the root of the form to your deeply nested field.
     */
    listens?:FieldSchamaChangeListeners| ((keyPath:string[])=>FieldSchamaChangeListeners),
    [rest:string]:any
}

@getDecorator()
export class ReduxSchemaForm extends React.PureComponent<ReduxSchemaFormProps,{}>{
    reset=()=>this.props.dispatch(reset(this.props.form))
    render(){
        return <form id={this.props.form} className={"redux-schema-form form-horizontal "+this.props.classes.form} onSubmit={this.props.handleSubmit}>
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
                        <FormButton type="submit" disabled={!submittable(this.props.disableResubmit)(this.props as any)}>提交</FormButton>
                        <FormButton type="button" onClick={this.reset} disabled={!submittable(this.props.disableResubmit)(this.props as any)}>重置</FormButton>
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
