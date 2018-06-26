import { reduxForm } from 'redux-form';

let decorators:Function[] = [
    reduxForm({
        form:"default"
    })
]

export const getDecorator = ()=>{
    return (x:any)=>decorators.reduce((current,func)=>{
        return func(current)
    },x)
}

export const pushDecorator = (decorator:Function)=>decorators.push(decorator)