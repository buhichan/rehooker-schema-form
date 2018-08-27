/**
 * Created by buhi on 2017/7/26.
 */
import * as React from "react"
import { FormFieldSchema, FieldListens} from "./form";
import {
    change, Field, formValueSelector, getFormValues
} from "redux-form"
import {renderFields} from "./render-fields";
import {connect} from "react-redux";
import {createSelector} from "reselect";

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

export function addType(name:string):(widget:Widget)=>void
export function addType(name:string,widget:Widget):void
export function addType(name:string,widget?:Widget) {
    function addWidgetTypeToRegistration(widget:Widget):any {
        customTypes.set(name, (props:WidgetProps) => <div>
            <Field name={props.keyPath} {...props} component={widget as any}/>
        </div>);
        return widget;
    }
    return widget?addWidgetTypeToRegistration(widget):addWidgetTypeToRegistration;
}

export function addTypeWithWrapper(name:string,widget:Widget){
    customTypes.set(name,widget);
}

let customTypes = new Map();

export function clearTypes(){
    customTypes.clear()
}

export function getType(name:string):Widget{
    return customTypes.get(name)
}

export function preRenderField(field:FormFieldSchema, form:string, keyPath:string):React.ReactNode{ //keyPath is the old keyPath
    const key = field.key||field.label
    if(!key)
        console.warn("必须为此schema设置一个key或者label, 以作为React的key:",field)
    if(field.listens && ( typeof field.listens === 'function' || Object.keys(field.listens).length))
        return <StatefulField key={key} fieldSchema={field} keyPath={keyPath} form={form}/>;
    else
        return <StatelessField key={key} field={field} form={form} keyPath={keyPath} />;
}

export function getComponentProps(field:FormFieldSchema){
    const {
        hide,
        type,
        key,
        label,
        options,
        fullWidth,
        component,
        normalize,
        props,
        warn,
        withRef,
        style,
        children,
        onChange,
        listens,
        onFileChange,
        validate,
        format,
        parse,
        multiple,
        value,
        maxOptionCount,
        ...rest
    } = field;
    return rest
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
    keyPath:string,

    listeners?:FieldListens,
    values?:any[],
    dispatch?:Function
}

@((connect as any)(
    (_:any,p:WidgetProps)=>{
        let listeners = p.fieldSchema.listens;
        const formSelector = formValueSelector(p.form);
        return createSelector(
            listeners.map(({to})=>{
                if(to instanceof Function)
                    to = to(p.keyPath.split(".").slice(0,-1).join("."))
                if(to instanceof Array){
                    return createSelector(
                        to.map(key=>{
                            return (s:any)=>formSelector(s,key) as any
                        }) as any,
                        (...values:any[])=>{
                            return values
                        }
                    )
                }else
                    return (s:any)=>formSelector(s,to as string) as any
            }) as any,
            (...values:any[])=>{
                return {
                    values,
                    listeners
                };
            }
        ) as any
    },
    (dispatch:any)=>({dispatch})
) as any)
class StatefulField extends React.PureComponent<FieldNodeProps>{
    static contextTypes={
        store:require("prop-types").object
    };
    state=this.props.fieldSchema;
    componentDidMount(){
        this.reload(this.props,true)
    }
    unmounted = false;
    componentWillUnmount(){
        this.unmounted = true;
    }
    reload(props:FieldNodeProps,isInitializing?:boolean){
        const state = this.context.store.getState();
        Promise.all(Object.keys(props.listeners).map((_,i)=>{
            const formValues = getFormValues(props.form)(state);
            const res = props.listeners[i].then({
                value:props.values[i],
                formValues:formValues,
                dispatch:props.dispatch,
                keyPath:props.keyPath
            });
            if(!(res instanceof Promise))
                return Promise.resolve(res||{});
            else return res;
        })).then(newSchemas=> {
            if(this.unmounted)
                return;
            let newSchema:FormFieldSchema&{value?:any} = newSchemas.reduce((old,newSchema)=>({...old,...newSchema||emptyObject}),props.fieldSchema);
            if(newSchema.hasOwnProperty("value") && (!isInitializing)){
                newSchema = Object.assign({}, newSchema)
                props.dispatch(change(props.form,props.keyPath,newSchema.value));
                delete newSchema['value']
            }
            this.setState(newSchema);
        })
    }
    componentDidUpdate(prevProps:FieldNodeProps){
        if(prevProps.values === this.props.values &&
            prevProps.form===this.props.form &&
            prevProps.fieldSchema === this.props.fieldSchema)
            return;
        this.reload(this.props);
    }
    render(){
        const {form,keyPath} = this.props;
        return <StatelessField field={this.state} form={form} keyPath={keyPath} />
    }
}

const emptyObject = {}