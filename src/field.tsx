/**
 * Created by buhi on 2017/7/26.
 */
import * as React from "react"
import {Options, ParsedFormFieldSchema} from "./form";
import {Field, FieldArray, initialize, WrappedFieldArrayProps} from "redux-form"
import {SchemaNode} from "./schema-node";

export type CustomWidgetProps = {
    fieldSchema?:ParsedFormFieldSchema,
    renderField?:typeof renderField
    keyPath:string
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
    onSchemaChange:(changes:Partial<ParsedFormFieldSchema>[]|Promise<Partial<ParsedFormFieldSchema>[]>)=>void
}

export function addType(name,widget: React.ComponentClass<CustomWidgetProps>|React.StatelessComponent<CustomWidgetProps>) {
    customTypes.set(name,widget);
}

let customTypes = new Map();

export function renderField(field:ParsedFormFieldSchema,form:string,keyPath:string,initialValues:any,onSchemaChange,refChildNode){ //keyPath is the old keyPath
    let {
        hide,
        type,
        key,
        label,
        options,
        children,
        getChildren,
        ...rest
    } = field;
    if(customTypes.has(type)){
        let CustomWidget:React.ComponentClass<CustomWidgetProps> = customTypes.get(type) as any;
        return <CustomWidget keyPath={keyPath} fieldSchema={field} onSchemaChange={onSchemaChange} {...rest} renderField={renderField}/>
    }
    //noinspection FallThroughInSwitchStatementJS
    switch(type){
        /**
         * @deprecated 不再维护bootstrap版本
         */
        case "number":
        case "text":
        case "color":
        case "password":
        case "date":
        case "datetime-local":
        case "file":
            return <div className="form-group">
                <label className="control-label col-md-2" htmlFor={form+'-'+keyPath}>{label}</label>
                <div className="col-md-10">
                    <Field className="form-control" name={keyPath} {...rest as any} component="input"/>
                </div>
            </div>;
        case "textarea":
            return <div className="form-group">
                <label className="control-label col-md-2" htmlFor={form+'-'+keyPath}>{label}</label>
                <div className="col-md-10">
                    <Field className="form-control" name={keyPath} {...rest as any} component="textarea"/>
                </div>
            </div>;
        case "checkbox":
            return <div className="form-group">
                <label className="control-label col-md-2" htmlFor={form+'-'+keyPath}>{label}</label>
                <div className="col-md-10">
                    <Field className=" checkbox" name={keyPath} {...rest as any} component="input"/>
                </div>
            </div>;
        case "select":
            return <div className="form-group">
                <label className="control-label col-md-2" htmlFor={form+'-'+keyPath}>{label}</label>
                <div className="col-md-10">
                    <Field className="form-control" name={keyPath} {...rest as any} component="select">
                        <option />
                        {
                            (options as Options).map((option,i)=><option key={i} value={option.value as string}>{option.name}</option>)
                        }
                    </Field>
                </div>
            </div>;
        case "array":
            return <div className="form-group">
                <label className="control-label col-md-2" htmlFor={form+'-'+keyPath}>{label}</label>
                <div className="col-md-10">
                    <FieldArray name={keyPath} {...rest as any} fieldSchema={field} keyPath={keyPath} renderField={renderField} component={DefaultArrayFieldRenderer}/>
                </div>
            </div>;
        case "group":
            //这里不可能存在getChildren还没有被执行的情况
            return <fieldset>
                <legend>{label}</legend>
                <SchemaNode ref={(ref)=>{
                    refChildNode(ref,key)
                }} keyPath={keyPath+"."+field.key} initialValues={initialValues} form={form} schema={field.children} />
            </fieldset>;
        default:
            return <span>不可识别的字段:{JSON.stringify(field)}</span>
    }
}


function DefaultArrayFieldRenderer(props:WrappedFieldArrayProps<any>&CustomWidgetProps){
    const fields = props.fields;
    return <div>
        {
            props.fields.map((name,i)=>{
                return <div key={i}>
                    <SchemaNode onSchemaChange={props.onSchemaChange} keyPath={props.keyPath+"."+i} initialValues={fields.get(i)} form={props.meta.form} schema={props.fieldSchema.children} />
                    <button onClick={()=>fields.remove(i)}><i className="fa fa-minus"/></button>
                </div>
            })
        }
        <button  onClick={()=>fields.push({})}><i className="fa fa-plus" /></button>
    </div>
}