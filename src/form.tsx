/**
 * Created by YS on 2016/10/31.
 */
import * as React from 'react'
import "./main.css"
import {reduxForm} from 'redux-form'
import "whatwg-fetch"
let Field = require("redux-form").Field;
import * as DeepGet from "lodash/get"

interface FormFieldSchema{
    key:string,
    type: string,//"text"|"select"|"date"|'datetime-local'|"checkbox"|"textarea"|"group"|"color",
    label:string,
    hide?:boolean,
    placeholder?:string,
    value?:any,
    required?:boolean,
    disabled?:boolean,
    relation?:(any,oldField:ParsedFormFieldSchema)=>ParsedFormFieldSchema
    options?:{
        name:string,
        value:any
    }[] | string,
    children?:FormFieldSchema[]
}

interface ParsedFormFieldSchema{
    key:string,
    type: string,//"text"|"select"|"date"|'datetime-local'|"checkbox"|"textarea"|"group"|"color",
    label:string,
    hide?:boolean,
    placeholder?:string,
    value?:any,
    required?:boolean,
    disabled?:boolean,
    options?:{
        name:string,
        value:any
    }[],
    children?:ParsedFormFieldSchema[]
}

@reduxForm({
    fields:[],
    form:"default"
})
export class ReduxSchemaForm extends React.Component<{
    form:string,
    data:any,
    schema:FormFieldSchema[],
    onSubmit:(...args:any[])=>void,
    dispatch?:(...args:any[])=>any,
    initialize?:(form:string,data:any,keepDirty:boolean)=>any
}&{[id:string]:any},{
    relations?:{
        key:string,
        relation:(any,oldField:ParsedFormFieldSchema)=>ParsedFormFieldSchema
    }[]
    parsedSchema?:ParsedFormFieldSchema[]
}>{
    constructor(){
        super();
        this.state = {
            relations:[],
            parsedSchema: []
        }
    }
    parseField(field:FormFieldSchema,prefix):Promise<ParsedFormFieldSchema>{
        let promises = [];
        let parsedField = (Object.assign({},field)) as ParsedFormFieldSchema;
        parsedField.key = (prefix?(prefix + "."):"") + parsedField.key;
        if(field.relation)
            this.state.relations.push({
                key:parsedField.key,
                relation:field.relation
            });
        if(field.children instanceof Array){
            promises.push(this.parseSchema(field.children,parsedField.key).then((children)=>{
                parsedField['children'] = children as ParsedFormFieldSchema[];
            }))
        }
        if(typeof field.options === 'string') {
            let src = field.options as string;
            promises.push(fetch(src).then(res=>res.json()).then(data=>{
                parsedField['options'] = data;
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
            this.state.relations = [];
            this.parseSchema(newProps.schema).then(schema=>{
                this.setState({
                    parsedSchema:schema
                })
            });
        }
        if(newProps.data!==this.props.data){
            this.state.relations.forEach(relation=>{
                let newFieldValue = DeepGet(newProps.data,relation.key);
                if(newFieldValue!==DeepGet(this.props.data,relation.key)){
                    for(let i =0;i<this.state.parsedSchema.length;i++){
                        if(this.state.parsedSchema[i].key === relation.key)
                            this.state.parsedSchema[i] = relation.relation(newProps.data,this.state.parsedSchema[i]);
                    }
                }
            });
            this.setState({
                parsedSchema:this.state.parsedSchema
            })
        }
    }
    componentDidMount(){
        this.parseSchema(this.props.schema).then(schema=>{
            this.setState({
                parsedSchema:schema
            });
            this.props.initialize(this.props.form,this.props.data,true)
        })
    }
    renderField(fieldSchema:ParsedFormFieldSchema){
        if(fieldSchema.hide) return <div></div>;
        let knownProps = {
            type:fieldSchema.type,
            value:fieldSchema.value,
            required:fieldSchema.required,
            disabled:fieldSchema.disabled,
            placeholder:fieldSchema.placeholder
        };
        switch(fieldSchema.type){
            case "text":
            case "textarea":
            case "color":
            case "date":
            case "datetime":
            case "datetime-local":
            case "number":
            case "file":
                return <div className="form-group">
                    <label className="control-label col-md-2" htmlFor={this.props.form+'-'+fieldSchema.key}>{fieldSchema.label}</label>
                    <div className="col-md-10">
                        <Field className="form-control" name={fieldSchema.key} {...knownProps} component="input"/>
                    </div>
                </div>;
            case "checkbox":
                return <div className="form-group">
                    <label className="control-label col-md-2" htmlFor={this.props.form+'-'+fieldSchema.key}>{fieldSchema.label}</label>
                    <div className="col-md-10">
                        <Field className=" checkbox" name={fieldSchema.key} {...knownProps} component="input"/>
                    </div>
                </div>;
            case "select":
                return <div className="form-group">
                    <label className="control-label col-md-2" htmlFor={this.props.form+'-'+fieldSchema.key}>{fieldSchema.label}</label>
                    <div className="col-md-10">
                        <Field className="form-control" name={fieldSchema.key} {...knownProps} component="select">
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
        return this.props['valid']&&this.props['dirty'];
    }
    render(){
        return <form className="form-horizontal">
            {
                this.state.parsedSchema.map(field=>{
                    return <div key={field.key}>
                        {this.renderField(field)}
                    </div>
                })
            }
            <div className="text-center">
                <div className="btn-group">
                    <button type="button" className={"btn btn-primary"+(this.submitable()?" disabled":"")} disabled={this.submitable.apply(this)} onClick={this.props.onSubmit.bind(this.props.data)}>提交</button>
                    <button type="button" className="btn btn-default" onClick={this.props['reset']}>重置</button>
                </div>
                {this.props.children}
            </div>
        </form>
    }
}