/**
 * Created by buhi on 2017/7/26.
 */
import * as React from "react"
import {FormFieldSchema} from "./form";
import {preRenderField} from "./field";

export function renderFields(form:string,schema:FormFieldSchema[],keyPath:string="", noSchemaNodeWrapper=false){
    if(!schema)
        return null;
    const children = schema.map(field => {
        const childKeyPath = (keyPath?(keyPath+"."):"")+field.key
        return preRenderField(field, form, childKeyPath)
    })
    if(noSchemaNodeWrapper)
        return children
    else return <div className="schema-node">
        {children}
    </div>
}