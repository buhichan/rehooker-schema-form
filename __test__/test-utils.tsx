window['requestAnimationFrame'] = function(callback:any) {
    setTimeout(callback, 0);
} as any
require('matchmedia-polyfill');
require('matchmedia-polyfill/matchMedia.addListener');

import "jest";

import * as React from 'react';
import { act, Simulate } from "react-dom/test-utils";
import * as ReactDOM from "react-dom"
import { FormFieldSchema, FormState } from '../src/types';
import { createForm, SchemaForm } from '../src/form';
import { Store } from "rehooker";
import { SchemaFormConfig, SchemaFormConfigProvider } from "../src/config";

const rootEl = document.createElement("div")
document.body.appendChild(rootEl)

export const testConfig = (themeName:string,config:SchemaFormConfig)=>{
    
    let form:Store<FormState>

    beforeEach(()=>{


        form = createForm()
        const initialValues = {text1:"a"}      
    
        const schema:FormFieldSchema[] = [
            {
                key:"text1",
                label:"Text",
                type:"text"
            },{
                key:"text2",
                label:"Text2",
                type:"text",
                hide:true,
                listens:[{
                    to:["text1"],
                    then:([v])=>({
                        hide:v!=='b'
                    })
                }]
            }
        ]
        class Form extends React.PureComponent<any,any>{
            render(){
                return <SchemaForm
                    form={form}
                    schema={schema}
                    initialValues={initialValues}
                />
            }
        }

        act(()=>{

            ReactDOM.render(<SchemaFormConfigProvider value={config}>
                <Form/>
            </SchemaFormConfigProvider>, rootEl)
        })

    })

    afterEach(()=>{
        ReactDOM.unmountComponentAtNode(rootEl)
    })

    describe(`Theme: ${themeName}`,()=>{

        // const TextInput = getType("text")

        test(`Expect 1 and only 1 'text' type Component to be shown`,async ()=>{
            await wait(1)
            console.log("🌟",document.body.innerHTML)
            const elements = document.querySelectorAll("input")
            expect(elements.length).toBe(1)
        })

        test(`Expect 'text' type Component to be initialized`,async ()=>{
            await wait(1)
            const elements = document.querySelectorAll("input")
            expect(elements.length).toBe(1)
            const text1 = elements.item(0)
            expect(text1.value).toBe('a')
        })
        test(`Expect form state to be initialized`,async ()=>{
            await wait(1)
            expect(form.stream.value.values.text1).toBe('a')
        })
        test(`Expect form state to updated`,async ()=>{
            await wait(1)
            const elements = document.querySelectorAll("input")
            expect(elements.length).toBe(1)
            const text1 = elements.item(0)
            text1.value = "b"
            Simulate.change(text1,{})
            expect(form.stream.value.values.text1).toBe('b')
        })
        test(`Expect listening field to be updated by listened field`,async ()=>{
            await wait(1)
            let elements = document.querySelectorAll("input")
            expect(elements.length).toBe(1)
            const text1 = elements.item(0)
            text1.value = "b"
            Simulate.change(text1,{})
            expect(form.stream.value.values.text1).toBe('b')
            await wait(1)
            elements = document.querySelectorAll("input")
            expect(elements.length).toBe(2)
        })
    })
}

function wait(ms:number){
    return new Promise(resolve=>setTimeout(resolve,ms))
}