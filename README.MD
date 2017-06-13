# Why

So I don't have to write a component for every single form, instead just change the 'schema' prop of this component. And it can automatically rerender if you change 'schema' prop.

The primary purpose of wrapping redux-form in this component, is to mimic the behaviour of [angular-formly](https://github.com/formly-js/angular-formly) which is so easy to use.

# Demo

[Demo](http://demo.buhichan.xyz)

# A json configured component on top of redux-form

- accept a json as schema to generate fields for redux-form.
- predefined material-ui widget components so you don't have to write in every form.
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
        
- you can add more widgets using `addType` api
    
# How to use

```
//remember this component is just a wrapper around [redux-form](), so you have to add redux-form's reducer to make it work!

import {ReduxSchemaForm} from "redux-schema-form"
import "redux-schema-form/src/material"

const schema=[
    {
        key:"name",
        label:"Company Name",
        type:"text",
        ...others// other props are passed to underlying component, such as required and multiLine
    },{
        key:"password",
        label:"Password"
        type:"password"
    }
]

function Form(){
    return <ReduxSchemaForm
        form="my-form" 
        schema={schema}
        {...others}
    />
}

```
    
# API(props)

## schema

Accepts an array of type:
```typescript
export type Options = {name:string,value:string|number}[]
export type AsyncOptions = ()=>Promise<Options>
export type AsyncOption = (value:any)=>(Promise<Options>|Options)
export type ChangeOfSchema = (Partial<FormFieldSchema>&{key:string})[];
export interface FormFieldSchema {
    key:string,
    type: string,
    label:string,
    hide?:boolean,
    placeholder?:string,
    required?:boolean,
    disabled?:boolean,
    multiple?:boolean,
    children?:FormFieldSchema[]
    options?:Options | AsyncOptions | AsyncOption,
    onValueChange?:(newValue:any,previousValue?:any,formValue?:any)=>ChangeOfSchema|Promise<ChangeOfSchema>,
    getChildren?:((childValue:any)=>FormFieldSchema[])
    [reduxFormFieldProps:string]:any 
    [materialUIComponentProps:string]:any 
    /** 
    * other props are passes to the underlying Field component, which can be any valid redux-form Field props, e.g. validate, normalize, ...;
    * if it is not a valid redux-form prop, it will passed to the underlying widget component, for example, you can add multiLine:true if the type of this field is 'text', which is a prop of material-ui's TextField component.
    */
}
```

### key
the key of the field in the date, e.g. 'email'

### label
the display name of this field. e.g. 'Your Email:'

### type
the type of this field. e.g. 'select' or "text" or "email"

### options
only meaningful if the type is "select" or "autocomplete-xxx", it must be an array of the type {name:string,value:any}, it defines the options of the selection component.

### placeholder
the hint text.

### children
only meaningful if the type is "group" or "array". The resulted date will have an object as a property value. e.g.
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

### onValueChange

called when the value of this field is changed or initialized. if it returns anything, it should be an array of type `{key:"name",[changedFieldSchema:string]:any}`, and the schema will be merged by this value, henced a reformat of the form.

### getChildren

only meaningful if the type is "array", to provide a way to have dynamic children form per child specific. It will be called with the value of a child of the array field, and should return a `FormFieldSchema[]` as the child form of this child. Sorry for my English if you can't understand this :3. e.g.
```typescript
const schema = [
    {
        key:"g",
        type:"array",
        label:"array",
        getChildren:value=>[
            {
                key:"name",
                type:"text",
                label:value
            }
        ]
    }
]
//The label of the array child will be the same as its value.
```

## onSubmit
this is actually a redux-form's prop, in this method, the value of the form will be passed as the first argument. e.g. {name:"john",password:"mybirthday"}

## others
All other props are passed to the underlying redux-form instance
