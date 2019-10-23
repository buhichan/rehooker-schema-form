import { FormState, FormFieldSchema } from './types';
import { deepSet } from './utils';
import { FieldPath } from './types';

export class SubmissionError{
    constructor(public error:any){}
}

export function submit(
    dispatch:(m:(s:FormState)=>FormState)=>void,
    submitFunc:(formValue:any)=>Promise<void>,
){
    return dispatch(function submit(f:FormState){
        const values = f.values
        if(!values)
            return f
        const maybePromise = submitFunc(values)
        if(maybePromise instanceof Promise){
            //setTimeout 是为了避免立刻提交产生的执行顺序的问题
            maybePromise.then(()=>{
                setTimeout(()=>{
                    dispatch(function submitSucceed(f){
                        return {
                            ...f,
                            initialValues:f.values,
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

export function reset(f:FormState){
    return {
        ...f,
        values:f.initialValues,
    }
}

export function changeValue(key:FieldPath,valueOrEvent:any,parse?:FormFieldSchema['parse']){
    return function changeValue(s:FormState){
        const newValue = valueOrEvent && typeof valueOrEvent === 'object' && 'target' in valueOrEvent?valueOrEvent.target.value :valueOrEvent
        return {
            ...s,
            values:deepSet(s.values,key,parse?parse(newValue):newValue),
            valid: s.hasValidator ? false : true,
        }
    }
}

export function initialize(initialValues:any){
    return function initialize(f:FormState){
        return {
            ...f,
            values:initialValues,
            initialValues:initialValues,
            initialized:true
        }
    }
}