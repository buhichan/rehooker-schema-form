/**
 * Created by YS on 2016/10/31.
 */
///<reference path="./declares.d.ts" />
import * as React from 'react'
import {reduxForm} from 'redux-form'
import "whatwg-fetch"
let {Field,FieldArray} = require("redux-form");
import {MyReduxFormConfig} from "./redux-form-config";

export type SupportedFieldType = "text"|"password"|"file"|"select"|"date"|'datetime-local'|"checkbox"|"textarea"|"group"|"color"|"number"|"array";

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
export type customWidgetProps = {
    fieldSchema:ParsedFormFieldSchema,
    knownProps:any,
    renderField:(fieldSchema:ParsedFormFieldSchema)=>JSX.Element
}
export function addType(name,widget: React.ComponentClass<customWidgetProps>|React.StatelessComponent<customWidgetProps>) {
    customTypes.set(name,widget);
}

function decorate(obj,prop,cb){
    let fn = obj[prop];
    obj[prop] = cb(fn);
}

@reduxForm({
    fields:[],
    form:"default"
})
export class ReduxSchemaForm extends React.Component<MyReduxFormConfig&{
    fields?:string[]
    fetch?:typeof window.fetch,
    schema:FormFieldSchema[],
    onSubmit?:(...args:any[])=>void,
    dispatch?:(...args:any[])=>any,
    noButton?:boolean,
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
            const asyncOptions = field.options as AsyncOptions;
            const fetch = this.props.fetch || window.fetch;
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
    DefaultArrayFieldRenderer(props){
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
            let CustomWidget:React.ComponentClass<customWidgetProps> = customTypes.get(fieldSchema.type) as any;
            return <CustomWidget fieldSchema={fieldSchema} knownProps={knownProps} renderField={this.renderField.bind(this)}/>
        }
        //noinspection FallThroughInSwitchStatementJS
        switch(fieldSchema.type){
            case "number":
                decorate(knownProps,"normalize",(normalize)=>{
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
            case "array":
                return <div className="form-group">
                    <label className="control-label col-md-2" htmlFor={this.props.form+'-'+fieldSchema.parsedKey}>{fieldSchema.label}</label>
                    <div className="col-md-10">
                        <FieldArray name={fieldSchema.parsedKey} {...knownProps} fieldSchema={fieldSchema} component={this.DefaultArrayFieldRenderer.bind(this)}/>
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
            {
                !this.props.noButton && <div className="text-center">
                    <div className="btn-group">
                        <button type="submit" className={"btn btn-primary"+(!this.submitable()?" disabled":"")} disabled={!this.submitable.apply(this)}>提交</button>
                        <button type="button" className={"btn btn-default"+(!this.submitable()?" disabled":"")} disabled={!this.submitable.apply(this)} onClick={this.props['reset']}>重置</button>
                    </div>
                </div>
            }
            {this.props.children}
        </form>
    }
}