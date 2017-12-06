import { reduxForm } from 'redux-form';

let decorators = [
    reduxForm({
        form:"default"
    })
]

export const getDecorator = ()=>{
    return x=>decorators.reduce((current,func)=>{
        return func(current)
    },x)
}

export const pushDecorator = decorator=>decorators.push(decorator)