/**
 * Created by buhi on 2017/7/26.
 */
import * as React from "react"
import {Options, FormFieldSchema, FieldSchamaChangeListeners} from "./form";
import {
    change, Field, FieldArray, formValueSelector, getFormValues, initialize, autofill
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

type Widget = React.StatelessComponent<WidgetProps> | React.ComponentClass<WidgetProps>

export function addType(name):(widget:Widget)=>void
export function addType(name,widget:Widget):void
export function addType(name,widget?) {
    function addWidgetTypeToRegistration(widget) {
        customTypes.set(name, props => <div>
            <Field name={props.keyPath} {...props} component={widget}/>
        </div>);
        return widget;
    }
    return widget?addWidgetTypeToRegistration(widget):addWidgetTypeToRegistration;
}

export function addTypeWithWrapper(name,widget){
    customTypes.set(name,widget);
}
let customTypes = new Map();

export function clearTypes(){
    customTypes.clear()
}

export function getType(name):Widget{
    return customTypes.get(name)
}

export function preRenderField(field:FormFieldSchema, form:string, keyPath:string){ //keyPath is the old keyPath
    const key = field.key||field.label
    if(!key)
        console.warn("必须为此schema设置一个key或者label, 以作为React的key:",field)
    if(field.listens && ( typeof field.listens === 'function' || Object.keys(field.listens).length))
        return <StatefulField key={key} fieldSchema={field} keyPath={keyPath} form={form}/>;
    else
        return <StatelessField key={key} field={field} form={form} keyPath={keyPath} />;
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
            fullWidth,
            style,
            children,
            ...rest
        } = field;
        if (field.hide)
            return null;
        let typeName = field.type;
        if (typeof field.type !== 'string')
            typeName = "";
        const CustomWidget = customTypes.get(type);
        const className = "field " + typeName 
            + (fullWidth?" full-width":"")
            + (rest.required?" required":"")
            + (rest.disabled?" disabled":"")
        if (CustomWidget) {
            return <div className={className} style={field.style}>
                <CustomWidget keyPath={keyPath} fieldSchema={field} {...rest} renderField={preRenderField}/>
            </div>
        } else if (typeof type === 'function')
            return <div className={className} style={field.style}>
                <Field name={keyPath} keyPath={keyPath} fieldSchema={field}
                       renderField={preRenderField} {...rest as any} component={type}/>
            </div>;
        switch (type) {
            //这里不可能存在getChildren还没有被执行的情况
            case "virtual-group":
                return renderFields(form, children, keyPath, true)
            case "group":
                return <div className={"field " + typeName} style={field.style}>
                    <fieldset>
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
            Object.keys(listeners).map(key=>{
                if(key.includes(",")){
                    const multipleKeys = key.split(",").map(s=>s.trim())
                    return createSelector(
                        multipleKeys.map(key=>{
                            return s=>formSelector(s,key) as any
                        }) as any,
                        (...values)=>{
                            return values
                        }
                    )
                }else 
                    return s=>formSelector(s,key) as any
            }) as any,
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
        this.reload(this.props,true)
    }
    unmounted = false;
    componentWillUnmount(){
        this.unmounted = true;
    }
    reload(props:FieldNodeProps,isInitializing?:boolean){
        const state = this.context.store.getState();
        Promise.all(Object.keys(props.listeners).map((fieldKey,i)=>{
            const formValue = getFormValues(props.form)(state);
            const res = props.listeners[fieldKey](props.values[i],formValue,props.dispatch);
            if(!(res instanceof Promise))
                return Promise.resolve(res||{});
            else return res;
        })).then(newSchemas=> {
            if(this.unmounted)
                return;
            let newSchema = newSchemas.reduce((old,newSchema)=>({...old,...newSchema||emptyObject}),props.fieldSchema);
            if(newSchema.hasOwnProperty("value") && (!isInitializing || newSchema.valueCanChangeOnInitialze)){
                newSchema = Object.assign({}, newSchema)
                props.dispatch(change(props.form,props.keyPath,newSchema.value));
                delete newSchema['value']
            }
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

const emptyObject = {}