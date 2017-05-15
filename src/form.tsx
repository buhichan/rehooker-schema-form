/**
 * Created by YS on 2016/10/31.
 */
import * as React from 'react'
import {reduxForm, Config as ReduxFormConfig} from 'redux-form'
import {SyntheticEvent} from "react";
let {Field,FieldArray} = require("redux-form");

export type SupportedFieldType = "text"|"password"|"file"|"select"|"date"|'datetime-local'|"checkbox"|"textarea"|"group"|"color"|"number"|"array"|string;

export type Options = {name:string,value:string|number}[]
export type AsyncOptions = ()=>Promise<Options|any>

export interface BaseSchema extends ReduxFormConfig<any,any,any>{
    key:string,
    type: SupportedFieldType,
    label:string,
    hide?:boolean,
    placeholder?:string,
    value?:any,
    required?:boolean,
    disabled?:boolean,
    defaultValue?:any,
    multiple?:boolean,
    children?:BaseSchema[]
    options?:Options | AsyncOptions,
    normalize?:(value,previousValue, allValues)=>any,
    data?:any,
    [rest:string]:any
}

export type ChangeOfSchema = (Partial<ParsedFormFieldSchema>&{key:string})[];

export interface FormFieldSchema extends BaseSchema{
    onChange?:
        (newValue?:any,e?:SyntheticEvent<any>)=>ChangeOfSchema|Promise<ChangeOfSchema>|((oldSchema:ParsedFormFieldSchema[])=>ParsedFormFieldSchema[])
    options?:Options | AsyncOptions,
    children?:FormFieldSchema[],
    getChildren?:((childValue:any)=>FormFieldSchema[])
}

export interface ParsedFormFieldSchema extends BaseSchema{
    options?:Options,
    parsedKey:string,
    children?:ParsedFormFieldSchema[],
    getChildren?:((childValue:any)=>ParsedFormFieldSchema[])
}

let DefaultButton = (props)=>{
    return <button type={props.type} className={"btn btn-primary"+(props.disabled?" disabled":"")} disabled={props.disabled} onClick={props.onClick}>
        {props.children}
    </button>
};

function changeField(parsedSchema:ParsedFormFieldSchema[],value:ParsedFormFieldSchema){
    let index = -1;
    parsedSchema.every((prev,i)=>{
        if(prev.key == value.key){
            index = i;
            return false
        }
        if(prev.children){
            const nextChildren = changeField(prev.children,value);
            if(nextChildren!==prev.children) {
                prev.children = nextChildren;
                return false;
            }
        }
        return true;
    });
    if(index>=0) {
        parsedSchema[index] = {...parsedSchema[index], ...value};
        return [...parsedSchema];
    }else{
        return parsedSchema;
    }
}

let customTypes = new Map();
export type CustomWidgetProps = {
    fieldSchema?:ParsedFormFieldSchema,
    renderField?:(fieldSchema:ParsedFormFieldSchema)=>JSX.Element,
    meta?:{
        active:boolean
        asyncValidating:boolean
        autofilled:boolean
        dirty:boolean
        dispatch:(a:any)=>void
        error:any
        form:string
        invalid:boolean
        pristine:boolean
        submitFailed:boolean
        submitting:boolean
        touched:boolean
        valid:boolean
        visited:boolean
        warning:any
    },
    input?:{
        name:string
        onBlur:(...args:any[])=>void
        onChange:(...args:any[])=>void
        onDragStart:(...args:any[])=>void
        onDrop:(...args:any[])=>void
        onFocus:(...args:any[])=>void
        value:any
    }
    hide?:boolean
    [rest:string]:any
}
export function addType(name,widget: React.ComponentClass<CustomWidgetProps>|React.StatelessComponent<CustomWidgetProps>) {
    customTypes.set(name,widget);
}

export function setButton(button: React.StatelessComponent<ButtonProps>){
    DefaultButton = button;
}

const listeners = {} as {[key:string]:((...args:any[])=>void)[]};

function registerListener(key,cb){
    listeners[key] = listeners[key]||[];
    listeners[key].push(cb);
    return ()=>{
        const i = listeners[key].indexOf(cb);
        listeners[key].splice(i,1);
    }
}

export function SchemaFormReducer(prev,action){
    if(action.type==='@@redux-form/change'){

    }
}

function DefaultArrayFieldRenderer(props){
    return <div>
        {
            props.map((name,i)=>{
                return <div key={i}>
                    {this.renderField(props.fieldSchema.children[i])}
                    <button onClick={props.remove(i)}><i className="fa fa-minus"/></button>
                </div>
            })
        }
        <button  onClick={props.push()}><i className="fa fa-plus" /></button>
    </div>
}

function decorate(obj,prop,cb){
    let fn = obj[prop];
    obj[prop] = cb(fn);
}

export type ButtonProps = {
    disabled:boolean,
    type:"submit"|"button",
    onClick?:any,
    children:any
}

@reduxForm({
    form:"default"
})
export class ReduxSchemaForm extends React.PureComponent<{
    [P in keyof ReduxFormConfig<any,any,any>]?: ReduxFormConfig<any,any,any>[P]
}&{
    'enableReinitialize'?:boolean,
    reset?():void
    fields?:string[]
    schema:FormFieldSchema[],
    onSubmit?:(...args:any[])=>void,
    dispatch?:(...args:any[])=>any,
    readonly?:boolean,
    initialize?:(data:any,keepDirty:boolean)=>any,
    noButton?:boolean
},{
    parsedSchema?:ParsedFormFieldSchema[]
}>{
    constructor(){
        super();
        this.state = {
            parsedSchema: []
        }
    }
    applySchemaChange(newFields){
        if(newFields.then){
            return newFields.then(this.applySchemaChange.bind(this));
        }else if (typeof newFields === 'function') {
            const newSchema = newFields(this.state.parsedSchema);
            if(newSchema)
                this.setState({parsedSchema:newSchema})
        }else {
            const result = newFields.reduce((prev, curr) => {
                return changeField(prev, curr)
            }, this.state.parsedSchema).slice();
            this.setState({
                parsedSchema:result
            });
        }
    }
    parseField(field:FormFieldSchema,prefix):Promise<ParsedFormFieldSchema>{
        let promises = [];
        let parsedField:ParsedFormFieldSchema = {...field} as any;
        parsedField.parsedKey = (prefix?(prefix + "."):"") + parsedField.key;
        if(field.onChange) {
            parsedField.onChange = e => {
                const newFields = field.onChange(e.target['value'],e);
                if (newFields)
                    this.applySchemaChange(newFields);
            };
        }
        if(field.children instanceof Array){
            promises.push(this.parseSchema(field.children,parsedField.key).then((children)=>{
                parsedField.children = children;
            }))
        }
        if(field.options && typeof field.options ==='function') {
            const asyncOptions = field.options as AsyncOptions;
            promises.push(asyncOptions().then(options=>{
                parsedField['options'] = options;
                return parsedField;
            }));
        }else{
            promises.push(Promise.resolve(field))
        }
        return Promise.all(promises).then(()=>{
            return parsedField
        })
    }
    parseSchema(newSchema:FormFieldSchema[],prefix=""):Promise<ParsedFormFieldSchema[]>{
        let promises = newSchema.map(field=>this.parseField(field,prefix));
        return Promise.all(promises);
    }
    componentWillReceiveProps(newProps){
        if(newProps.schema!==this.props.schema){
            this.parseSchema(newProps.schema).then(this.onReady.bind(this));
        }
    }
    onReady(schema:ParsedFormFieldSchema[]){
        this.setState({
            parsedSchema: schema
        })
    }
    componentWillMount(){
        this.parseSchema(this.props.schema).then(this.onReady.bind(this))
    }
    renderField(fieldSchema:ParsedFormFieldSchema){
        if(fieldSchema.hide)
            return <div />;
        let {
            hide,
            type,
            parsedKey,
            label,
            options,
            children,
            getChildren,
            ...rest
        } = fieldSchema;
        if(customTypes.has(type)){
            let CustomWidget:React.ComponentClass<CustomWidgetProps> = customTypes.get(type) as any;
            return <CustomWidget fieldSchema={fieldSchema} {...rest} renderField={this.renderField.bind(this)}/>
        }
        //noinspection FallThroughInSwitchStatementJS
        switch(type){
            case "number":
                decorate(rest,"onChange",(normalize)=>{
                    return (...args)=>{
                        args[0] = Number(args[0]);
                        return normalize?normalize(...args):args[0];
                    }
                });
            case "text":
            case "color":
            case "password":
            case "date":
            case "datetime-local":
            case "file":
                return <div className="form-group">
                    <label className="control-label col-md-2" htmlFor={this.props.form+'-'+parsedKey}>{label}</label>
                    <div className="col-md-10">
                        <Field className="form-control" name={parsedKey} {...rest} component="input"/>
                    </div>
                </div>;
            case "textarea":
                return <div className="form-group">
                    <label className="control-label col-md-2" htmlFor={this.props.form+'-'+parsedKey}>{label}</label>
                    <div className="col-md-10">
                        <Field className="form-control" name={parsedKey} {...rest} component="textarea"/>
                    </div>
                </div>;
            case "checkbox":
                return <div className="form-group">
                    <label className="control-label col-md-2" htmlFor={this.props.form+'-'+parsedKey}>{label}</label>
                    <div className="col-md-10">
                        <Field className=" checkbox" name={parsedKey} {...rest} component="input"/>
                    </div>
                </div>;
            case "select":
                return <div className="form-group">
                    <label className="control-label col-md-2" htmlFor={this.props.form+'-'+parsedKey}>{label}</label>
                    <div className="col-md-10">
                        <Field className="form-control" name={parsedKey} {...rest} component="select">
                            <option />
                            {
                                options.map((option,i)=><option key={i} value={option.value as string}>{option.name}</option>)
                            }
                        </Field>
                    </div>
                </div>;
            case "array":
                return <div className="form-group">
                    <label className="control-label col-md-2" htmlFor={this.props.form+'-'+parsedKey}>{label}</label>
                    <div className="col-md-10">
                        <FieldArray name={parsedKey} {...rest} fieldSchema={fieldSchema} component={DefaultArrayFieldRenderer}/>
                    </div>
                </div>;
            case "group":
                return <fieldset>
                    <legend>{label}</legend>
                    {
                        children.map(childField=>{
                            return <div key={childField.key} className={childField.type}>
                                {this.renderField(childField)}
                            </div>
                        })
                    }
                </fieldset>;
            default:
                return <span>不可识别的字段:{JSON.stringify(fieldSchema)}</span>
        }
    }
    submitable(){
        return !this.props['pristine'] && !this.props['submitting'];
    }
    render(){
        return <form className="redux-schema-form form-horizontal" onSubmit={this.props['handleSubmit']}>
            {
                this.state.parsedSchema.map(field=>{
                    return <div key={field.key||field.label} className={field.type}>
                        {this.renderField(field)}
                    </div>
                })
            }
            {
                (!this.props.noButton && !this.props.readonly )? <div className="button">
                    <div className="btn-group">
                        <DefaultButton type="submit" disabled={!this.submitable.apply(this)}>提交</DefaultButton>
                        <DefaultButton type="button" disabled={!this.submitable.apply(this)} onClick={this.props.reset}>重置</DefaultButton>
                    </div>
                </div> : <div />
            }
            {this.props.children}
        </form>
    }
}