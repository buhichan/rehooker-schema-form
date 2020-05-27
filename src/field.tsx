/**
 * Created by buhi on 2017/7/26.
 */
import * as React from "react";
import { Store, useSource } from 'rehooker';
import { combineLatest, merge } from 'rxjs';
import { distinct, distinctUntilChanged, map, switchMap, debounceTime } from 'rxjs/operators';
import { isFullWidth } from './constants';
import { changeValue } from './mutations';
import { deepGet } from './utils';
import { FormFieldSchema, FieldPath, FieldProps, FormState, WidgetInjectedProps } from './types';
import { ComponentMap } from './config';
/**
 * Created by buhi on 2017/7/26.
 */

export function renderFields(form: Store<FormState>, schema: FormFieldSchema[], keyPath: FieldPath, componentMap:ComponentMap) {
    if (!schema)
        return null;
    return schema.map(field => {
        const key = field.key
        if (!key) {
            console.error("You must provide key of a field")
            return null
        }
        if (field.listens && (typeof field.listens === 'function' || Object.keys(field.listens).length))
            return <StatefulField componentMap={componentMap} form={form} key={key} schema={field} keyPath={keyPath} />;
        else
            return <StatelessField componentMap={componentMap} form={form} key={key} schema={field} keyPath={keyPath} />;
    })
}

export function getComponentProps(field: FormFieldSchema) {
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
        componentMap,
        ...rest
    } = field;
    return rest
}

export function useField(form: Store<FormState>, key: FieldPath, format?: (v: any) => any) {
    return useSource(form.stream, ob => ob.pipe(
        distinctUntilChanged((a,b)=>a.values === b.values && a.errors === b.errors),
        map(s => {
            const value = deepGet(s.values,key)
            return {
                value: format ? format(value) : value,
                error: deepGet(s.errors,key)
            }
        }),
    ), [form, name, format])
}

const StatelessField = React.memo(function StatelessField(props: FieldProps) {
    const { schema, form, keyPath, componentMap } = props;
    const componentProps = getComponentProps(schema)

    /** assume finalKey will not change */
    const finalKey:FieldPath = [...keyPath,...schema.key.split(".")] /** it begins with dot */

    const fieldValue = useField(form, finalKey, schema.format)

    const onChange = React.useMemo(() => (valueOrEvent: any) => {
        form.next(changeValue(finalKey, valueOrEvent, schema.parse))
    }, [form, schema.parse])
    
    if (!fieldValue)
        return null
    if (schema.hide)
        return null;
    let typeName = schema.type;
    if (typeof schema.type !== 'string')
        typeName = "";
    const className = "field " + typeName
        + (isFullWidth(schema) ? " full-width" : "")
        + (componentProps.required ? " required" : "")
        + (componentProps.disabled ? " disabled" : "")
        + (fieldValue.error ? " invalid" : " valid")
    let fieldNode = null as React.ReactNode | null
    if (typeof schema.type === 'string' && componentMap.has(schema.type)) {
        const StoredWidget = componentMap.get(schema.type);
        if (StoredWidget) {
            fieldNode = <StoredWidget componentMap={componentMap} form={form} keyPath={keyPath} schema={schema} componentProps={componentProps} {...fieldValue} onChange={onChange} />
        }
    } else if (typeof schema.type === 'function') {
        const Comp = schema.type
        fieldNode = <Comp componentMap={componentMap} form={form} keyPath={keyPath} schema={schema} componentProps={componentProps} {...fieldValue} onChange={onChange} />
    }
    if(fieldNode !== null){
        return props.noWrapper ? <>{fieldNode}</> : <div className={className} style={schema.style}>
            {fieldNode}
        </div>
    }
    switch (schema.type) {
        //这里不可能存在getChildren还没有被执行的情况
        case "virtual-group": {
            const children = schema.children as Exclude<typeof schema.children, undefined>;
            return <>
                {renderFields(form, children, keyPath,componentMap)}
            </>
        }
        case "group": {
            const children = schema.children as Exclude<typeof schema.children, undefined>;
            return <div className={className} style={schema.style}>
                <fieldset>
                    <legend>{schema.label}</legend>
                    <div className="schema-node">
                        {
                            renderFields(form, children, keyPath.concat(schema.key),componentMap)
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

const StatefulField = React.memo(function StatefulField(props: FieldProps) {
    const [schema, setSchema] = React.useState(props.schema)
    const listens = schema.listens as Exclude<typeof schema.listens, undefined>
    React.useEffect(() => {
        const $value = props.form.stream.pipe(
            map(x => x.values),
            distinct(),
            debounceTime(0),
        )
        const $change = merge(...listens.map((x) => {
            let listenTo = typeof x.to === 'function' ? x.to(props.keyPath.join(".")) : x.to
            return combineLatest(
                listenTo.map(x => {
                    return $value.pipe(
                        map(v => {
                            return deepGet(v, x.split("."))
                        }),
                        distinctUntilChanged()
                    )
                })
            ).pipe(
                map(x.then),
            )
        }))
        const processChange = (change:undefined | Partial<FormFieldSchema> & {value?:any})=>{
            if(!!change){
                const {
                    value,
                    ...rest
                } = change
                const newSchema = {
                    ...props.schema,
                    ...rest,
                }
                if('value' in change){
                    const finalKey = props.keyPath.concat(props.schema.key)
                    props.form.next(changeValue(finalKey, value,newSchema.parse))
                }
                setSchema(newSchema)
            }
        }
        const subscription = $change.pipe(
            switchMap(async change=>{
                return change
            })
        ).subscribe(processChange as any)
        return () => subscription.unsubscribe()
    }, [props.form, schema.listeners])
    return <StatelessField componentMap={props.componentMap} schema={schema} form={props.form} keyPath={props.keyPath} noWrapper={props.noWrapper} />
})

export type FormFieldProps = {
    form: Store<FormState>,
    name: string,
    keyPath?: string[],
    label?: React.ReactNode,
    noWrapper?: boolean
    //hardcode these from FormFieldSchema because Omit<xxx,'key'> reports error
    type: FormFieldSchema['type'], 
    listens?: FormFieldSchema['listens']
    validate?:FormFieldSchema['validate'],
    parse?:FormFieldSchema['parse'],
    format?:FormFieldSchema['format'],
    style?:FormFieldSchema['style'],
    defaultValue?:FormFieldSchema['defaultValue'] // set when mount
    options?:FormFieldSchema['options']
    wrapperProps?:any // used as antd's Form.Item props
    componentMap:ComponentMap
} & WidgetInjectedProps

export function FormField(props: FormFieldProps) { //component flavored form field
    const { form, keyPath = [] as string[], noWrapper,name,componentMap, ...restField } = props
    const field = {
        ...restField,
        key: name
    } as FormFieldSchema
    if (field.listens && (typeof field.listens === 'function' || Object.keys(field.listens).length))
        return <StatefulField componentMap={componentMap} noWrapper={noWrapper} form={form} schema={field} keyPath={keyPath} />;
    else
        return <StatelessField componentMap={componentMap} noWrapper={noWrapper} form={form} schema={field} keyPath={keyPath} />;
}