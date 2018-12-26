import * as React from 'react';
import { addArrayItem, removeArrayItem } from './mutations';
import { FormState } from './form';
import { Store } from 'rehooker';

type FieldArrayProps = {
    form:Store<FormState>
    name:string,
    value:string[],
    children:(childKeys:string[], add:()=>void, remove:(key:string)=>void)=>React.ReactNode
}

export function FieldArray(props:FieldArrayProps){
    const add = React.useMemo(()=>()=>{
        props.form.next(addArrayItem(props.name,props.value))
    },[props.name,props.value])

    const remove = React.useMemo(()=>(id:string)=>{
        props.form.next(removeArrayItem(props.name,props.value,id))
    },[props.name, props.value])

    return <>
        {props.children( (props.value || []).map(id=>props.name+"."+id),add,remove ) }
    </>
}