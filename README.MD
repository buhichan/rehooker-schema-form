# a component on top of redux-form
- accept a json as schema to generate forms.

    this is the definition of "schema":
    
```typescript jsx
import {List} from "immutable"

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

//the component itself accepts all props of redux-form, plus this "schema" prop described above
```

The primary purpose of wrapping redux-form in this component, is:
 1. to unify the shape of schema definition between the form component(built on top of redux-form) and [grid component](https://github.com/buhichan/redux-ag-grid)(built on top of ag-grid).
 2. to mimic the behaviour of [angular-formly](https://github.com/formly-js/angular-formly) which I was familiar with.