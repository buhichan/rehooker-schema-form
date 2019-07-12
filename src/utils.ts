import { FieldPath } from './field';

export const requestFileUpload = (multiple:boolean)=>{
    let input:HTMLInputElement
    input = document.getElementById('hidden-file-input') as any
    if(!input){
        input = document.createElement('input')
        input.type="file"
        input.id='hidden-file-input'
        input.style.display='hidden'
        document.body.appendChild(input)
    }
    input.multiple = multiple
    const promise = new Promise((resolve,_)=>{
        input.onchange = e=>{
            const files = (e.target as HTMLInputElement).files
            resolve({
                files:Array.from(files || []),
                clear:()=>document.body.removeChild(input)
            })
        }
        input.click()
    })
    return promise
}

export const requestDownload = (options:any)=>{
    let input:HTMLAnchorElement = document.getElementById('hidden-anchor') as any
    if(!input){
        input = document.createElement('a')
        input.id = 'hidden-anchor'
        document.body.appendChild(input)
    }
    input.href=options.href
    input.download=options.download
    input.click()
}

export function deepGet(target:any,keys:FieldPath,i=0):any{
    if(i >= keys.length || target == undefined){
        return target
    }else{
        return deepGet(target[keys[i]],keys,i+1)
    }
}

export function deepSet(target:any,keys:FieldPath,newValue:any,i=0, parentCursor?:any):any{
    if(!parentCursor){
        target = Array.isArray(target) ? [...target] : {...target}
        parentCursor = target
    }
    if(i===keys.length - 1){
        parentCursor[keys[i]] = newValue
        return target
    }else{
        const key = keys[i]
        const oldValue = parentCursor[keys[i]]
        if(Array.isArray(oldValue)){
            parentCursor[keys[i]] = [...oldValue]
        }else if(typeof oldValue === 'object'){
            parentCursor[keys[i]] = {...oldValue}
        }else{
            parentCursor[keys[i]] = typeof key === 'number' ? [] : {}
        }
        return deepSet(target,keys,newValue,i+1,parentCursor[keys[i]])
    }
}

export function randomID(){
    return String(Math.floor(Math.random()*1000000000))
}