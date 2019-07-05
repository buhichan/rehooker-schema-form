import { FormState, FormFieldSchema } from './form';
import { randomID, deepSet } from './utils';

export class SubmissionError{
    constructor(public error:any){}
}

export function registerField(key:string,schema:FormFieldSchema){
    return function registerField(f:FormState){
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

export function unregisterField(key:string){
    return function unregisterField(f:FormState){
        if( 
            !(f.values && key in f.values) && 
            !(f.errors && key in f.errors) && 
            !(f.meta && key in f.meta)
        ){
            //no change to make
            return f
        }
        return {
            ...f,
            ...f.values ? {
                values: deleteKey(f.values,key)
            } : {},
            ...f.errors ? {
                errors: deleteKey(f.errors,key)
            } : {},
            ...f.meta ? {
                meta: deleteKey(f.meta,key)
            } : {},
        }
    }
}

export function submit(dispatch:(m:(s:FormState)=>FormState)=>void,submitFunc:(formValue:any)=>Promise<void>){
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
        const maybePromise = submitFunc(finalValue)
        if(maybePromise instanceof Promise){
            //setTimeout 是为了避免立刻提交产生的执行顺序的问题
            maybePromise.then(()=>{
                setTimeout(()=>{
                    dispatch(function submitSucceed(f){
                        return {
                            ...f,
                            submitting:false,
                            submitSucceeded:true
                        }
                    })
                })
            }).catch((error:Error|SubmissionError)=>{
                setTimeout(()=>{
                    dispatch(function submitFailed(f){
                        return {
                            ...f,
                            errors:error instanceof SubmissionError ? {
                                ...f.errors,
                                ...error.error,
                            } : f.errors,
                            submitting:false,
                            submitSucceeded:false
                        }
                    })
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

export function setFieldError(key:string,error:string){
    return (s:FormState)=>{
        if(s.values){
            return {
                ...s,
                errors: error ? {
                    ...s.errors,
                    [key]:error
                }: deleteKey(s.errors,key)
            }
        }else{
            return s
        }
    }
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
            const value = s.values[key]
            const newError = validate && validate(value,s.values) || undefined
            return {
                ...s,
                errors: newError ? {
                    ...s.errors,
                    [key]:newError
                }: deleteKey(s.errors,key)
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

export function initialize(initialValues:any, schema:FormFieldSchema[]){
    return function initialize(f:FormState){
        const initialValuesMap:Record<string,any> = {}
        const arrayKeys:string[] = []
        function traverseValues(value:any,keyPath:string[]){
            const keyPathStr = keyPath.join(".")
            if(arrayKeys.includes(keyPathStr)){
                const itemIDs = f.values && keyPathStr in f.values ? f.values[keyPathStr] : new Array(value.length).fill(null).map(()=>randomID())
                if(value instanceof Array){
                    value.forEach((v,i)=>traverseValues(v,keyPath.concat(itemIDs[i])))
                }
                initialValuesMap[keyPathStr] = itemIDs
            }else if(value != undefined && typeof value === "object" && !Array.isArray(value)){
                Object.keys(value).forEach(k=>{
                    traverseValues(value[k],keyPath.concat(k))
                })
            }else{
                initialValuesMap[keyPathStr] = value
            }
        }
        function traverseSchema(schema:FormFieldSchema[],keyPath:string[]){
            schema.forEach(x=>{
                if(x.type === 'array'){
                    arrayKeys.push(keyPath.concat(x.key).join("."))
                    x.children && traverseSchema(x.children,keyPath.concat(x.key))
                }
            })
        }
        traverseSchema(schema,[])
        initialValues && traverseValues(initialValues, [])
        return {
            ...f,
            arrayKeys,
            schema,
            values:initialValuesMap,
            initialValues:initialValuesMap,
            initialized:true
        }
    }
}

export function addArrayItem(key:string, oldKeys:string[]){
    return function addArrayItem(f:FormState){
        return changeValue(key, (oldKeys || []).concat(randomID()))(f)
    }
}

export function removeArrayItem(key:string, oldKeys:string[], removedId:string){
    return function removeArrayItem(f:FormState){
        const i = oldKeys.indexOf(removedId)
        const copy = oldKeys.slice()
        copy.splice(i,1)
        const removedKeyPath = key + "." + removedId
        function filterKey(oldMap:any){
            return Object.keys(oldMap).reduce((newV,k)=>{
                if(!(k.includes(removedKeyPath))){
                    newV[k] = oldMap[k]
                }
                return newV
            },{} as any)
        }
        const s1 = changeValue(key,copy)(f)
        return {
            ...s1,
            errors:filterKey({
                ...s1.errors
            },),
            values:filterKey({
                ...s1.values
            }),
            meta:filterKey({
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