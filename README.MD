# a component on top of redux-form

- accept a json as schema to generate fields for redux-form.
- predefined material-ui and bootstrap components
    - Bootstrap widgets(default):
        - number
        - text
        - password
        - email
        - checkbox
        - select
    - Material UI widgets(need to import material-ui): 
        - autocomplete 
        - autocomplete-async 
        - autocomplete-text
        - array
        - group
        - all other types which bootstrap theme supported
- you can add more using `addType` api
    
# How to use

```
import {ReduxSchemaForm} from "redux-schema-form"

// use Material widgets
// import "redux-schema-form/src/material"

const schema=[
    {
        key:"name",
        label:"Company Name",
        type:"text"
    }
]

function Form(){
    return <ReduxSchemaForm
        schema={schema}
        {...other props are passes to underlying redux-form instance}
    />
}

```


    
# API
    
```TypeScript
import {List} from "immutable"
import {Config} from "redux-form"

interface ReduxSchemaFormProps extends Config{
    schema:FormFieldSchema[]
} // this is the props of this component

export type SupportedFieldType = "text"|"password"|"file"|"select"|"date"|'datetime-local'|"checkbox"|"textarea"|"group"|"color"|"number"|"array"|string;

export type Options = {name:string,value:string|number}[]
export type AsyncOptions = ()=>Promise<Options>

export interface BaseSchema {
    key:string,
    type: SupportedFieldType,
    label:string,
    hide?:boolean,
    placeholder?:string,
    value?:any,
    required?:boolean,
    disabled?:boolean,
    defaultValue?:any,
    children?:BaseSchema[] | List<BaseSchema>
    options?:Options | AsyncOptions,
    normalize?:(value,previousValue, allValues)=>any,
    data?:any
}

export interface FormFieldSchema extends BaseSchema{
    onChange?:(value, previousValue, allValues)=>ParsedFormFieldSchema[]|Promise<ParsedFormFieldSchema[]>
    options?:Options | AsyncOptions,
    children?:FormFieldSchema[]
}

export interface ParsedFormFieldSchema extends BaseSchema{
    options?:Options,
    parsedKey:string,
    children?:List<ParsedFormFieldSchema>
}

//Add a 'type' component into registration;
export function addType(typeName:string,component:React.ComponentClass<CustomWidgetProps>|React.StatelessComponent<CustomWidgetProps>){}

export type CustomWidgetProps = {
    fieldSchema?:ParsedFormFieldSchema,
    renderField?:(fieldSchema:ParsedFormFieldSchema)=>JSX.Element,
    meta?:{
        active:boolean
        asyncValidating:boolean
        autofilled:boolean
        dirty:boolean
        dispatch:(a:any)=>void
        error:any
        form:string
        invalid:boolean
        pristine:boolean
        submitFailed:boolean
        submitting:boolean
        touched:boolean
        valid:boolean
        visited:boolean
        warning:any
    },
    input?:{
        name:string
        onBlur:(...args:any[])=>void
        onChange:(...args:any[])=>void
        onDragStart:(...args:any[])=>void
        onDrop:(...args:any[])=>void
        onFocus:(...args:any[])=>void
        value:any
    }
    hide?:boolean
    [rest:string]:any
}
```

The primary purpose of wrapping redux-form in this component, is:
 1. to unify the shape of schema definition between the form component(built on top of redux-form) and [grid component](https://github.com/buhichan/redux-ag-grid)(built on top of ag-grid).
 2. to mimic the behaviour of [angular-formly](https://github.com/formly-js/angular-formly) which I was familiar with.
