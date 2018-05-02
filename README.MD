![travis ci](https://travis-ci.org/buhichan/redux-schema-form.svg?branch=master)

# Why

1. So that I don't have to write a component for every single `redux-form`.
2. Provide a per-field state that can be changed by form values at runtime, for example, hide or show a field based on another field's value.

# Demo

[Demo](https://stackblitz.com/edit/react-pnrkgw?file=index.js)

# Intro

- Accept a `schema` prop to generate form. *Not* json schema but a self-invented one. :P
- The state of the form is maintained by `redux-form` in `redux` state.
- Predefined material-ui widget components so you don't have to write in every form.
    - number
    - text
    - password
    - email
    - date
    - file
    - checkbox
    - select
    - autocomplete 
    - autocomplete-async 
    - autocomplete-text
    - array
    - group
- Also has a set of ant-design theme widgets.
        
- You can add more widgets using `addType`.

- You can use custom buttons by using `setButtons` and `injectSubmittable`
    
# How to use

```
//remember this component is just a wrapper around [redux-form](), so you have to add redux-form's reducer to make it work!

import {ReduxSchemaForm,injectSubmittable} from "redux-schema-form"
import "redux-schema-form/src/material"

const schema=[
    {
        key:"name",
        label:"Name",
        type:"text",
        ...others// other props are passed to underlying component, such as required and multiLine
    },{
        key:"password",
        label:"Password"
        type:"password"
    },{
        key:"fieldWithState",
        label:"this field changed when Name changed",
        type:"text",
        listens:{
            "Company Name":(value)=>{
                if(value === 'Some Company')
                    return {
                        label:"Name Illegal"
                    }
                else
                    return {
                        label:"this field changed when Name changed"
                    }
            }
        }
    }
]

function FormWithDefaultButtons(){ //Default buttons are chinese
    return <ReduxSchemaForm
        form="my-form" 
        schema={schema}
        {...others}
    />
}

const CustomSubmitButton = injectSubmittable({formName:"foo1",type:"submit"})(({props,children})=>{
    return <button {...props}>
        {children}
    </button>
})

const CustomResetForm = injectSubmittable({formName:"foo1",type:"reset"})(({props,children})=>{
    return <button {...props}>
        {children}
    </button>
})

function FormWithCustomButtons(){
    return <div>
        <ReduxSchemaForm
            form="foo1" 
            schema={schema}
            noButton
            {...others}
        />
        <CustomSubmitButton>Submit Form</CustomSubmitButton>
        <CustomResetButton>Reset Fields</CustomResetButton>
    </div>
}

```

# Limitation
Material-ui's keyboard navigation is badly written, so it may not be suitable for forms with lots of fields.
    
# API(props)

All props are passed to the underlying `redux-form` instance, except these props:

## disableResubmit
Form become not submittable if submit succeeded.

## noButton
Hide submit and cancel buttons.

## children
Children will be placed between form fields and buttons.

## schema
Accepts an array of type `FormFieldSchema[]`:
```typescript
import {BaseFieldProps} from "redux-form"
export type Options = {name:string,value:string|number}[]
export type AsyncOptions = ()=>Promise<Options>
export type RuntimeAsyncOptions = (value:any)=>(Promise<Options>|Options)
export type FieldSchamaChangeListeners={
    /**
     * q:what is valuePath here?
     * a:
     * If your formValue is {"foo":{"haha":[{"bar":10032}]}}, then the callback here will receive these arguments:
     * 10032, {bar:10032}, [{bar:10032}], {haha:[{bar:10032}]}, {foo:...}
     */
    [fieldKey:string]: (value?:any,formValue?:any,dispatch?:any)=>Partial<FormFieldSchema>|Promise<Partial<FormFieldSchema>>|void;
};
export interface FormFieldSchema extends Partial<BaseFieldProps> {
    key:string,
    type: string | React.ComponentClass<WidgetProps> | React.StatelessComponent<WidgetProps>,
    label:string,
    hide?:boolean,
    placeholder?:string,
    fullWidth?:boolean, //todo: should I put this presentation logic here?
    required?:boolean,
    disabled?:boolean,
    multiple?:boolean,
    children?:FormFieldSchema[]
    options?:Options | AsyncOptions | RuntimeAsyncOptions,
    defaultValue?:any
    style?:React.CSSProperties,
    /**
     * keyPath will keyPath from the root of the form to your deeply nested field. e.g. foo.bar[1].far
     */
    listens?:FieldSchamaChangeListeners| ((keyPath:string)=>FieldSchamaChangeListeners),
    valueCanChangeOnInitialze?:boolean
    /**
     * type: "file" only used in 'file' field 
     * @returns string url
     * @theme mui/antd
     * @param file file to upload
     */
    onFileChange?:(file:File|FileList)=>Promise<string>,
    downloadPathPrefix?:string,
    /**
     * type: "array"
     * @theme mui
     */
    itemsPerRow?:number
    /**
     * type: "autocomplete-text/async/-"
     * @theme mui
     */
    fullResult?:boolean
    /**
     * type: "autocomplete-async"
     * @theme mui
     */
    throttle?:number
    showValueWhenNoEntryIsFound?:boolean
    /**
     * type: "select"
     * @theme mui/antd
     */
    loadingText?:string,
    /**
     * type: "table-array/array"
     * @theme mui
     */
    hideColumns?:string[]
    disableDelete?:boolean,
    disableCreate?:boolean,
    disableSort?:boolean,
    disableImport?:boolean
    /**
     * type: "table-array"
     * @theme mui
     */
    disableFixSeparatorForExcel?:boolean //we must add sep=, as the first row to prevent excel to change the separator
    csvColumnSeparator?:string
    /**
     * type: "date/datetime"
     * @theme mui
     */
    okLabel?:string
    cancelLabel?:string
    locale?:string

    data?:any,
    [rest:string]:any //the rest are passed to underlying widget component.
}
```

- key
The key of the field in the data, e.g. 'email'

- label
The displayed name of this field. e.g. 'Your Email:'

- type
The type of this field. e.g. 'select' or "text" or "email"

- options
Only meaningful if the type is "select" or "autocomplete-xxx", it must be an array of the type {name:string,value:any}, it defines the options of the selection component.

- placeholder
The hint text.

- required
As the name suggest.

- disabled
As the name suggest.

- children
Only meaningful if the type is "group" or "array". The resulted date will have an object as a property value. e.g.
```typescript
const schema = [
    {
        key:"g",
        type:"group",
        label:"group",
        children:[
            {
                key:"name",
                type:"text",
                label:"Name"
            }
        ]
    }
]
//The value passed to onSubmit will be like: {g:{name:"john"}}
```

- listens 

Object, the key is the keyPath of the field that is listened, when that field changed, the value which is a callback will be called by (current value,form value, redux dispatch), and the returned is a description of the change, which would be undefined or a partial FormFieldSchema, or a Promise of a partial FormFieldSchema.


```
- others
All other fields in `FormFieldSchema` are passed to the underlying `redux-form`'s `Field` component. See their [docs](http://redux-form.com/).
