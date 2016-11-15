/**
 * Created by YS on 2016/10/31.
 */
///<reference path="./declares.d.ts" />
import * as React from 'react'
import "./main.css"
import {reduxForm} from 'redux-form'
import "whatwg-fetch"
let Field = require("redux-form").Field;
import {MyReduxFormConfig} from "./redux-form-config";

export type SupportedFieldType = "text"|"password"|"file"|"select"|"date"|'datetime-local'|"checkbox"|"textarea"|"group"|"color"|"number";

export type Options = {name:string,value:string}[]
export type AsyncOptions = {
    url:string,
    mapResToOptions?:(res:any)=>Options
};
export interface FormFieldSchema{
    key:string,
    type: SupportedFieldType,
    label:string,
    hide?:boolean,
    placeholder?:string,
    value?:any,
    required?:boolean,
    disabled?:boolean,
    normalize?:(value,previousValue,allValues)=>any
    options?:Options | AsyncOptions,
    children?:FormFieldSchema[]
}

export interface ParsedFormFieldSchema{
    key:string,
    parsedKey:string,
    type: SupportedFieldType,
    label:string,
    hide?:boolean,
    placeholder?:string,
    required?:boolean,
    disabled?:boolean,
    options?:Options,
    normalize:(value,previousValue,allValues)=>any
    children?:ParsedFormFieldSchema[]
}

function changeField(parsedSchema:ParsedFormFieldSchema[],value:ParsedFormFieldSchema){
    for(let i=0;i<parsedSchema.length;i++) {
        if(parsedSchema[i].key === value.key) {
            parsedSchema[i] = Object.assign(parsedSchema[i],value);
            return true;
        }else if(parsedSchema[i].children){
            if(changeField(parsedSchema[i].children,value)) return true;
        }
    }
    return false;
}

let customTypes = new Map();

export function addType(name,component:React.ComponentClass<any>|React.StatelessComponent<any>){
    customTypes.set(name,component);
}

@reduxForm({
    fields:[],
    form:"default"
})
export class ReduxSchemaForm extends React.Component<MyReduxFormConfig&{
    fields?:string[]
    schema:FormFieldSchema[],
    onSubmit:(...args:any[])=>void,
    dispatch?:(...args:any[])=>any,
    initialize?:(data:any,keepDirty:boolean)=>any,
},{
    parsedSchema?:ParsedFormFieldSchema[]
}>{
    constructor(){
        super();
        this.state = {
            parsedSchema: []
        }
    }
    isUnmounting:boolean;
    parseField(field:FormFieldSchema,prefix):Promise<ParsedFormFieldSchema>{
        let promises = [];
        let parsedField = (Object.assign({},field)) as ParsedFormFieldSchema;
        parsedField.parsedKey = (prefix?(prefix + "."):"") + parsedField.key;
        if(field.normalize)
            parsedField.normalize = (...args)=>{
                let newFields = field.normalize.apply(null,args);
                let result = newFields.reduce((prev,curr)=>{
                    return changeField(this.state.parsedSchema,curr) || prev
                },true);
                if(result)
                    this.setState({
                        parsedSchema:this.state.parsedSchema
                    });
                return args[0]
            };
        if(field.children instanceof Array){
            promises.push(this.parseSchema(field.children,parsedField.key).then((children)=>{
                parsedField['children'] = children as ParsedFormFieldSchema[];
            }))
        }
        if(field.options && !(field.options instanceof Array)) {
            let asyncOptions = field.options as AsyncOptions;
            promises.push(fetch(asyncOptions.url).then(res=>res.json()).then(data=>{
                parsedField['options'] = asyncOptions.mapResToOptions?asyncOptions.mapResToOptions(data):data;
                return parsedField;
            }))
        }else{
            promises.push(Promise.resolve(field))
        }
        return Promise.all(promises).then(()=>{
            return parsedField
        })
    }
    parseSchema(newSchema:FormFieldSchema[],prefix=""):Promise<ParsedFormFieldSchema[]>{
        let promises = newSchema.map(field=>this.parseField(field,prefix));
        return new Promise(resolve=>{
            Promise.all(promises).then(resolve)
        });
    }
    componentWillReceiveProps(newProps){
        if(newProps.schema!==this.props.schema){
            this.parseSchema(newProps.schema).then(schema=>{
                !this.isUnmounting && this.setState({
                    parsedSchema:schema
                })
            });
        }
    }
    componentDidMount(){
        this.parseSchema(this.props.schema).then(schema=>{
            !this.isUnmounting && this.setState({
                parsedSchema:schema
            });
        })
    }
    componentWillUnmount(){
        this.isUnmounting = true;
    }
    renderField(fieldSchema:ParsedFormFieldSchema){
        if(fieldSchema.hide) return <div></div>;
        let knownProps = {
            type:fieldSchema.type,
            required:fieldSchema.required,
            disabled:fieldSchema.disabled,
            placeholder:fieldSchema.placeholder,
            normalize:fieldSchema.normalize
        };
        if(customTypes.has(fieldSchema.type)){
            let customWidget = customTypes.get(fieldSchema.type);
            return <div className="form-group">
                <label className="control-label col-md-2" htmlFor={this.props.form+'-'+fieldSchema.parsedKey}>{fieldSchema.label}</label>
                <div className="col-md-10">
                    <Field className="form-control" name={fieldSchema.parsedKey} {...knownProps} component={customWidget}/>
                </div>
            </div>;
        }
        switch(fieldSchema.type){
            case "text":
            case "color":
            case "password":
            case "date":
            case "datetime-local":
            case "number":
            case "file":
                return <div className="form-group">
                    <label className="control-label col-md-2" htmlFor={this.props.form+'-'+fieldSchema.parsedKey}>{fieldSchema.label}</label>
                    <div className="col-md-10">
                        <Field className="form-control" name={fieldSchema.parsedKey} {...knownProps} component="input"/>
                    </div>
                </div>;
            case "textarea":
                return <div className="form-group">
                    <label className="control-label col-md-2" htmlFor={this.props.form+'-'+fieldSchema.parsedKey}>{fieldSchema.label}</label>
                    <div className="col-md-10">
                        <Field className="form-control" name={fieldSchema.parsedKey} {...knownProps} component="textarea"/>
                    </div>
                </div>;
            case "checkbox":
                return <div className="form-group">
                    <label className="control-label col-md-2" htmlFor={this.props.form+'-'+fieldSchema.parsedKey}>{fieldSchema.label}</label>
                    <div className="col-md-10">
                        <Field className=" checkbox" name={fieldSchema.parsedKey} {...knownProps} component="input"/>
                    </div>
                </div>;
            case "select":
                return <div className="form-group">
                    <label className="control-label col-md-2" htmlFor={this.props.form+'-'+fieldSchema.parsedKey}>{fieldSchema.label}</label>
                    <div className="col-md-10">
                        <Field className="form-control" name={fieldSchema.parsedKey} {...knownProps} component="select">
                            <option />
                            {
                                fieldSchema.options.map((option,i)=><option key={i} value={option.value}>{option.name}</option>)
                            }
                        </Field>
                    </div>
                </div>;
            case "group":
                return <fieldset>
                    <legend>{fieldSchema.label}</legend>
                    {
                        fieldSchema.children.map(childField=>{
                            return <div key={childField.key}>
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
        return <form className="form-horizontal" onSubmit={this.props['handleSubmit']}>
            {
                this.state.parsedSchema.map(field=>{
                    return <div key={field.key}>
                        {this.renderField(field)}
                    </div>
                })
            }
            <div className="text-center">
                <div className="btn-group">
                    <button type="submit" className={"btn btn-primary"+(!this.submitable()?" disabled":"")} disabled={!this.submitable.apply(this)}>提交</button>
                    <button type="button" className={"btn btn-default"+(!this.submitable()?" disabled":"")} disabled={!this.submitable.apply(this)} onClick={this.props['reset']}>重置</button>
                </div>
            </div>
            {this.props.children}
        </form>
    }
}