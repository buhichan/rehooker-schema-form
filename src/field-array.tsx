import * as React from 'react';
import { addArrayItem, removeArrayItem } from './mutations';
import { FormState } from './form';
import { Store } from 'rehooker';

type FieldArrayProps = {
    form:Store<FormState>
    name:string, /** begins with a dot */
    value:string[],
    children:(childKeys:{key:string,remove:()=>void}[], add:()=>void )=>React.ReactNode
}

export function FieldArray(props:FieldArrayProps){
    const add = React.useMemo(()=>()=>{
        props.form.next(addArrayItem(props.name.slice(1),props.value))
    },[props.name,props.value])

    const childKeyList = React.useMemo(()=>{
        return (props.value || []).map(id=>{
            const key = props.name+"."+id
            const remove = ()=>props.form.next(removeArrayItem(props.name.slice(1), props.value, id))
            return {
                key,
                remove
            }
        })
        
    },[props.name, props.value])

    return <>
        {props.children( childKeyList,add ) }
    </>
}