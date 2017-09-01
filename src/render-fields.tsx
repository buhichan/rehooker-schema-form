/**
 * Created by buhi on 2017/7/26.
 */
import * as React from "react"
import {AsyncOptions, FormFieldSchema} from "./form";
import {preRenderField} from "./field";

export function renderFields(form,schema:FormFieldSchema[],keyPath:string=""){
    if(!schema)
        return null;
    return <div className="schema-node">
        {
            schema.map(field => {
                return preRenderField(field, form, (keyPath?(keyPath+"."):"")+field.key)
            })
        }
    </div>
}