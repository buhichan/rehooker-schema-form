import { FormState, FormFieldSchema } from './form';
import { randomID, deepSet } from './utils';

export class SubmissionError{
    constructor(public error:any){}
}

export function registerField(schema:FormFieldSchema,keyPath:string){
    return function registerField(f:FormState){
        const key = (keyPath + "." + schema.key).slice(1)
        return {
            ...f,
            meta:{
                ...f.meta,
                [key]:{
                    schema
                }
            }
        }
    }
}

export function unregisterField(schema:FormFieldSchema,keyPath:string){
    return function unregisterField(f:FormState){
        const key = (keyPath +"." + schema.key).slice(1)
        if( 
            !(f.values && key in f.values) && 
            !(f.errors && key in f.errors) && 
            !(f.meta && key in f.meta)
        ){
            //no change to make
            return f
        }
        if(f.values){
            delete f.values[key]
        }
        if(f.errors){
            delete f.errors[key]
        }
        if(f.meta){
            delete f.meta[key]
        }
        return {
            ...f
        }
    }
}

export function submit(dispatch:(m:(s:FormState)=>FormState)=>void){
    return dispatch(function submit(f:FormState){
        const values = f.values
        if(!values)
            return f
        const arrayKeys = Object.keys(f.meta).filter(x=>f.meta[x].schema.type === 'array')
        const mapItemIDToIndex = arrayKeys.reduce((map,key)=>{
            const value = values[key]
            value instanceof Array && value.forEach((x,i)=>{
                map[x] = i
            })
            return map
        },{} as {[name:string]:number})
        const finalValue = Object.keys(values).filter(x=>!arrayKeys.includes(x)).reduce((res,key)=>{
            deepSet(res,key.split(".").map(x=>x in mapItemIDToIndex ? mapItemIDToIndex[x] : x),values[key])
            return res
        },{})
        const maybePromise = f.onSubmit && f.onSubmit(finalValue)
        if(maybePromise instanceof Promise){
            maybePromise.then(()=>{
                dispatch(function submitSucceed(f){
                    return {
                        ...f,
                        submitting:false,
                        submitSucceed:true
                    }
                })
            }).catch((error:Error|SubmissionError)=>{
                dispatch(function submitFailed(f){
                    return {
                        ...f,
                        errors:error instanceof SubmissionError ? {
                            ...f.errors,
                            ...error.error,
                        } : f.errors,
                        submitting:false,
                        submitSucceed:false
                    }
                })
                throw error
            })
        }
        return {
            ...f,
            submitting:true
        }
    })
}

export function reset(f:FormState){
    return {
        ...f,
        values:f.initialValues,
    }
}

export function changeValue(schema:FormFieldSchema,keyPath:string,valueOrEvent:any){
    return function changeValue(s:FormState){
        const newValue = valueOrEvent && typeof valueOrEvent === 'object' && 'target' in valueOrEvent?valueOrEvent.target.value :valueOrEvent
        const key = (keyPath+"."+schema.key).slice(1)
        const error = schema.validate && schema.validate(newValue,s.values) || undefined
        if(error){
            s.errors = {
                ...s.errors,
                [key]:error
            }
        }else{
            delete s.errors[key]
        }
        return {
            ...s,
            errors: {
                ...s.errors
            },
            values:{
                ...s.values,
                [key]:schema.parse?schema.parse(newValue):newValue,
            }
        }
    }
}

export function initialize(initialValues:any, onSubmit:Function){
    function traverseValues(map:any,value:any,keyPath:string[]){
        if(value instanceof Array){
            const itemIDs = new Array(value.length).fill(null).map(()=>randomID())
            map[keyPath.join(".")] = itemIDs
            value.forEach((v,i)=>traverseValues(map,v,keyPath.concat(itemIDs[i])))
        }else if(value != undefined && typeof value === "object"){
            Object.keys(value).forEach(k=>{
                traverseValues(map,value[k],keyPath.concat(k))
            })
        }else{
            map[keyPath.join(".")] = value
        }
    }
    return function initialize(f:FormState){
        const initialValuesMap = {}
        initialValues && traverseValues(initialValuesMap,initialValues, [])
        return {
            ...f,
            onSubmit:onSubmit,
            values: f.values === undefined ? initialValuesMap : f.values,
            initialValues:initialValuesMap,
        }
    }
}

export function addArrayItem(schema:FormFieldSchema, keyPath:string, oldKeys:string[]){
    return function addArrayItem(f:FormState){
        return changeValue(schema, keyPath, (oldKeys || [] ).concat(randomID()))(f)
    }
}

export function removeArrayItem(schema:FormFieldSchema, keyPath:string, oldKeys:string[], removedKey:string){
    return function removeArrayItem(f:FormState){
        const i = oldKeys.indexOf(removedKey)
        const copy = oldKeys.slice()
        copy.splice(i,1)
        function filterKey(oldMap:any){
            return Object.keys(oldMap).reduce((newV,k)=>{
                if(!(k.includes(removedKey))){
                    newV[k] = oldMap[k]
                    return newV
                }
            },{} as any)
        }
        const s1 = changeValue(schema,keyPath,copy)(f)
        return {
            ...s1,
            errors:filterKey({
                ...f.errors,
                ...s1.errors
            }),
            values:filterKey({
                ...f.errors,
                ...s1.errors
            }),
            meta:filterKey({
                ...f.meta,
                ...s1.meta
            }),
        }
    }
}