import * as React from 'react';
import { WidgetProps } from './form';
import { addArrayItem, removeArrayItem } from './mutations';
import { renderFields } from './field';

type FieldArrayProps = WidgetProps & {
    value:string[]
    children:(keys:string[], add:()=>void, remove:(key:string)=>void, renderChild:(key:string)=>React.ReactNode)=>React.ReactNode
}

export function FieldArray(props:FieldArrayProps){
    const add = React.useMemo(()=>()=>{
        props.form.next(addArrayItem(props.schema,props.keyPath,props.value))
    },[props.schema,props.value])

    const remove = React.useMemo(()=>(id:string)=>{
        props.form.next(removeArrayItem(props.schema,props.keyPath,props.value,id))
    },[props.schema, props.value])

    return <>
        {props.children(props.value || [],add,remove, (id)=>{
            return renderFields(props.form,props.schema.children,props.keyPath+"."+props.schema.key+"."+id)
        })}
    </>
}