/**
 * Created by buhi on 2017/7/26.
 */
import * as React from "react"
import { FormFieldSchema, FieldListens, FormState, WidgetProps} from "./form";
import { useSource, Store } from 'rehooker';
import { map, distinct, debounceTime, skipWhile, distinctUntilChanged } from 'rxjs/operators';
import { combineLatest,merge } from 'rxjs';
import { registerField, unregisterField, changeValue, startValidation } from './mutations';
import { isFullWidth } from './constants';
/**
 * Created by buhi on 2017/7/26.
 */

export function renderFields(form:Store<FormState>,schema:FormFieldSchema[],keyPath:string){
    if(!schema)
        return null;
    return schema.map(field => {
        const key = field.key
        if(!key){
            console.error("You must provide key of a field")
            return null
        }
        if(field.listens && ( typeof field.listens === 'function' || Object.keys(field.listens).length))
            return <StatefulField form={form} key={key} schema={field} keyPath={keyPath} />;
        else
            return <StatelessField form={form} key={key} schema={field} keyPath={keyPath} />;
    })
}

type Widget = React.StatelessComponent<WidgetProps> | React.ComponentClass<WidgetProps>

export function addType(name:string,widget:Widget) {
    widgetRegistration.set(name, widget);
}

let widgetRegistration = new Map<string,Widget>();

export function clearTypes(){
    widgetRegistration.clear()
}

export function getType(name:string):Widget|undefined{
    return widgetRegistration.get(name)
}

export interface FieldProps{
    form:Store<FormState>,
    schema:FormFieldSchema,
    keyPath:string,
    listeners?:FieldListens,
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

export function useFieldState(form:Store<FormState>,key:string,format?:(v:any)=>any){
    return useSource(form.stream,ob=>ob.pipe(
        skipWhile(x=>x.values === undefined),
        map(s=>{
            const value = s.values && s.values[key]
            return {
                value:format?format(value):value,
                error:s.errors[key],
                meta:s.meta[key]
            }
        },
        debounceTime(24)
    )),[form,name,format])
}

export const StatelessField = React.memo( function StatelessField(props:FieldProps){
    const {schema, form, keyPath} = props;
    const componentProps = getComponentProps(schema)

    const finalKey = (keyPath+"."+schema.key).slice(1) /** it begins with dot */

    const fieldState = useFieldState(form,finalKey,schema.format)


    const onChange = React.useMemo(()=>(valueOrEvent:any)=>{
        form.next(changeValue(  finalKey,valueOrEvent,schema.validate,schema.parse))
    },[form,schema.validate,schema.parse])

    const onBlur = React.useMemo(()=>()=>{
        form.next(startValidation(finalKey,schema.validate))
    },[form,schema.validate,schema.parse])

    React.useEffect(()=>{
        props.form.next(registerField(finalKey,schema))
        return ()=>props.form.next(unregisterField(finalKey))
    },[])
    if(!fieldState)
        return null
    if (schema.hide)
        return null;
    let typeName = schema.type;
    if (typeof schema.type !== 'string')
        typeName = "";
    const className = "field " + typeName 
        + (isFullWidth(schema)?" full-width":"")
        + (componentProps.required?" required":"")
        + (componentProps.disabled?" disabled":"")
        + (fieldState.error ? " invalid":" valid")
    if(typeof schema.type === 'string' && widgetRegistration.has(schema.type)){
        const StoredWidget = widgetRegistration.get(schema.type);
        if (StoredWidget) {
            return <div className={className} style={schema.style}>
                <StoredWidget form={form} keyPath={keyPath} schema={schema} componentProps={componentProps} {...fieldState} onChange={onChange} onBlur={onBlur}/>
            </div>
        }
    } else if (typeof schema.type === 'function'){
        const Comp = schema.type
        return <div className={className} style={schema.style}>
            <Comp form={form} keyPath={keyPath} schema={schema} componentProps={componentProps} {...fieldState} onChange={onChange} onBlur={onBlur} />
        </div>
    }
    switch (schema.type) {
        //这里不可能存在getChildren还没有被执行的情况
        case "virtual-group":{
            const children = schema.children as Exclude<typeof schema.children, undefined>;
            return <>
                {renderFields(form, children, keyPath)}
            </>
        }
        case "group":{
            const children = schema.children as Exclude<typeof schema.children, undefined>;
            return <div className={className} style={schema.style}>
                <fieldset>
                    <legend>{schema.label}</legend>
                    <div className="schema-node">
                    {
                        renderFields(form, children, keyPath +"." + schema.key)
                    }
                    </div>
                </fieldset>
            </div>
        }
        default:
            return <div className="field">
                <span>not supported widget type: {JSON.stringify(schema)}</span>
            </div>
    }
})


export const StatefulField = React.memo(function StatefulField(props:FieldProps){
    const [schema,setSchema] = React.useState(props.schema)
    const listens = schema.listens as Exclude<typeof schema.listens, undefined>
    React.useEffect(()=>{
        const $value = props.form.stream.pipe(
            skipWhile(x=>x.values === undefined),
            map(x=>x.values),
            distinct(),
        )
        const $change = merge(...listens.map((x)=>{
            let listenTo = typeof x.to === 'function' ? x.to(props.keyPath) : x.to
            return combineLatest(
                listenTo.map(x=>{
                    return $value.pipe(
                        map(v=>{
                            return v && v[x]
                        }),
                        distinctUntilChanged()
                    )
                })
            ).pipe(
                map(x.then),
            )
        }))
        const subscription = $change.subscribe(change=>{
            if(change instanceof Promise){
                change.then(change=> !subscription.closed && setSchema({
                    ...props.schema,
                    ...change
                }))
            }else if(change){
                setSchema({
                    ...props.schema,
                    ...change
                })
            }
        })
        return ()=>subscription.unsubscribe()
    },[props.form, schema.listeners])
    return <StatelessField schema={schema} form={props.form} keyPath={props.keyPath} />
})