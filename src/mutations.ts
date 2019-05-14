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
            f.values = deleteKey(f.values,key)
        }
        if(f.errors){
            f.errors = deleteKey(f.errors,key)
        }
        if(f.meta){
            f.meta = deleteKey(f.meta,key)
        }
        return {
            ...f,
        }
    }
}

export function submit(dispatch:(m:(s:FormState)=>FormState)=>void){
    return dispatch(function submit(f:FormState){
        const values = f.values
        if(!values)
            return f
        const errors = Object.keys(f.meta).reduce((errors,key)=>{
            const value = f.values && f.values[key]
            const validate = f.meta[key].schema && f.meta[key].schema.validate
            if(typeof validate === 'function'){
                const error = validate(value,f.values)
                if(typeof error === 'string'){
                    errors[key] = error
                }
            }
            return errors
        },{} as Record<string,string>)
        if(Object.keys(errors).length > 0){
            return {
                ...f,
                errors,
            }
        }
        const mapItemIDToIndex = f.arrayKeys.reduce((map,key)=>{
            const value = values[key]
            value instanceof Array && value.forEach((x,i)=>{
                map[x] = i
            })
            return map
        },{} as {[name:string]:number})
        const finalValue = Object.keys(values).filter(x=>!f.arrayKeys.includes(x)).reduce((res,key)=>{
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

export function startValidation(key:string,validate?:FormFieldSchema['validate']){
    return function startValidation(s:FormState){
        if(s.values){
            const finalKey = key.slice(1)
            const value = s.values[finalKey]
            const newError = validate && validate(value,s.values) || undefined
            return {
                ...s,
                errors: newError ? {
                    ...s.errors,
                    [finalKey]:newError
                }: deleteKey(s.errors,finalKey)
            }
        }else{
            return s
        }
    }
}

export function changeValue(key:string,valueOrEvent:any,validate?:FormFieldSchema['validate'],parse?:FormFieldSchema['parse']){
    return function changeValue(s:FormState){
        const newValue = valueOrEvent && typeof valueOrEvent === 'object' && 'target' in valueOrEvent?valueOrEvent.target.value :valueOrEvent
        const newError = validate && validate(newValue,s.values) || undefined
        return {
            ...s,
            errors: newError ? {
                ...s.errors,
                [key]:newError
            } : deleteKey(s.errors,key),
            values:{
                ...s.values,
                [key]:parse?parse(newValue):newValue,
            }
        }
    }
}

export function initialize(initialValues:any, onSubmit:Function){
    return function initialize(f:FormState){
        const initialValuesMap:Record<string,any> = {}
        const arrayKeys:string[] = []
        function traverseValues(value:any,keyPath:string[],){
            if(Array.isArray(value) && value.length > 0 && typeof value[0] === 'object'){
                const itemIDs = new Array(value.length).fill(null).map(()=>randomID())
                value.forEach((v,i)=>traverseValues(v,keyPath.concat(itemIDs[i])))
                arrayKeys.push(keyPath.join("."))
                initialValuesMap[keyPath.join(".")] = itemIDs
            }else if(value != undefined && typeof value === "object" && !Array.isArray(value)){
                Object.keys(value).forEach(k=>{
                    traverseValues(value[k],keyPath.concat(k))
                })
            }else{
                initialValuesMap[keyPath.join(".")] = value
            }
        }
        initialValues && traverseValues(initialValues, [])
        return {
            ...f,
            arrayKeys,
            onSubmit:onSubmit,
            values:initialValuesMap,
            initialValues:initialValuesMap,
        }
    }
}

export function addArrayItem(key:string, oldKeys:string[]){
    return function addArrayItem(f:FormState){
        return changeValue(key.slice(1) /** it begins with dot */, (oldKeys || []).concat(randomID()))(f)
    }
}

export function removeArrayItem(key:string, oldKeys:string[], removedKey:string){
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
        const s1 = changeValue(key,copy)(f)
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

function deleteKey<T>(obj:T,key:keyof T){
    if(obj == undefined || typeof obj !== 'object' || !(key in obj)){
        return obj
    }
    const clone = {...obj}
    delete clone[key]
    return clone as T
}