/**
 * Created by buhi on 2017/7/26.
 */
import * as React from "react"
import {Options, FormFieldSchema, FieldSchamaChangeListeners} from "./form";
import {
    change, Field, FieldArray, formValueSelector, getFormValues, initialize
} from "redux-form"
import {renderFields} from "./render-fields";
import {connect} from "react-redux";
import {createSelector} from "reselect";
import * as PropTypes from "prop-types";

export type WidgetProps = {
    fieldSchema?:FormFieldSchema,
    renderField?:typeof StatelessField
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
    onSchemaChange:(changes:Partial<FormFieldSchema>[]|Promise<Partial<FormFieldSchema>[]>)=>void
}

export function addType(name,widget: React.ComponentClass<WidgetProps>|React.StatelessComponent<WidgetProps>) {
    customTypes.set(name,props=><div>
        <Field name={props.keyPath} {...props} component={widget} />
    </div>);
    return widget;
}

export function addTypeWithWrapper(name,widget){
    customTypes.set(name,widget);
}

let customTypes = new Map();

export function preRenderField(field:FormFieldSchema, form:string, keyPath:string){ //keyPath is the old keyPath
    if(field.listens && ( typeof field.listens === 'function' || Object.keys(field.listens).length))
        return <StatefulField key={field.key} fieldSchema={field} keyPath={keyPath} form={form}/>;
    else
        return <StatelessField key={field.key}  field={field} form={form} keyPath={keyPath} />;
}

export class StatelessField extends React.PureComponent<{field:FormFieldSchema, form:string, keyPath:string}>{
    render() {
        const {field, form, keyPath} = this.props;
        let {
            hide,
            type,
            key,
            label,
            options,
            style,
            children,
            ...rest
        } = field;
        if (field.hide)
            return null;
        let typeName = field.type;
        if (typeof field.type !== 'string')
            typeName = "";
        if (customTypes.has(type)) {
            const CustomWidget = customTypes.get(type);
            return <div className={"field " + typeName} style={field.style}>
                <CustomWidget keyPath={keyPath} fieldSchema={field} {...rest} renderField={preRenderField}/>
            </div>
        } else if (typeof type === 'function')
            return <div className={"field " + typeName} style={field.style}>
                <Field name={keyPath} keyPath={keyPath} fieldSchema={field}
                       renderField={preRenderField} {...rest as any} component={type}/>
            </div>;
        //noinspection FallThroughInSwitchStatementJS
        switch (type) {
            case "group":
                //这里不可能存在getChildren还没有被执行的情况
                return <div className={"field " + typeName} style={field.style}>
                    <fieldset key={field.key}>
                        <legend>{label}</legend>
                        {
                            renderFields(form, children, keyPath)
                        }
                    </fieldset>
                </div>;
            default:
                return <div className="field">
                    <span>不支持的字段类型:{JSON.stringify(field)}</span>
                </div>
        }
    }
}

interface FieldNodeProps{
    form:string,
    fieldSchema:FormFieldSchema,
    keyPath,

    listeners?:FieldSchamaChangeListeners,
    values?:any[],
    dispatch?
}

@((connect as any)(
    (_,p)=>{
        let listeners = p.fieldSchema.listens;
        if(typeof listeners === 'function')
            listeners = listeners(p.keyPath.split(".").slice(0,-1).join("."));
        const formSelector = formValueSelector(p.form);
        return createSelector(
             Object.keys(listeners).map(x=>s=>formSelector(s,x)) as any,
            (...values)=>{
                return {
                    values,
                    listeners
                };
            }
        ) as any
    },
    dispatch=>({dispatch})
) as any)
class StatefulField extends React.PureComponent<FieldNodeProps>{
    static contextTypes={
        store:PropTypes.object
    };
    state=this.props.fieldSchema;
    componentWillMount(){
        this.reload(this.props)
    }
    reload(props:FieldNodeProps){
        const state = this.context.store.getState();
        Promise.all(Object.keys(props.listeners).map((fieldKey,i)=>{
            const formValue = getFormValues(props.form)(state);
            const res = props.listeners[fieldKey](props.values[i],formValue);
            if(!(res instanceof Promise))
                return Promise.resolve(res||{});
        })).then(newSchemas=> {
            const newSchema = newSchemas.reduce((old,newSchema)=>({...old,...newSchema}),props.fieldSchema);
            if(newSchema.value)
                props.dispatch(change(props.form,props.keyPath,newSchema.value));
            this.setState(newSchema);
        })
    }
    componentWillReceiveProps(nextProps:FieldNodeProps){
        if(nextProps.values === this.props.values &&
            nextProps.form===this.props.form &&
            nextProps.fieldSchema === this.props.fieldSchema)
            return;
        this.reload(nextProps);
    }
    render(){
        const {form,keyPath} = this.props;
        return <StatelessField field={this.state} form={form} keyPath={keyPath} />
    }
}