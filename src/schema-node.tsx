/**
 * Created by buhi on 2017/7/26.
 */
import * as React from "react"
import {AsyncOptions, FormFieldSchema, ParsedFormFieldSchema} from "./form";
import {renderField} from "./field";

function applyChangesToFields(parsedSchema:ParsedFormFieldSchema[],changes:Partial<ParsedFormFieldSchema>[]){
    parsedSchema = parsedSchema.slice(0);
    changes = changes.filter((change)=>{
        const target = parsedSchema.findIndex(x=>x.key === change.key);
        if(target>=0){
            if(change.children){
                console.error("不能在onValueChange中改变children！请使用getChildren属性。");
                delete change.children;
            }
            parsedSchema[target] = {
                ...parsedSchema[target],
                ...change
            };
            return false;
        }
        return true;
    });
    return [parsedSchema,changes];
}

export interface SchemaNodeProps{
    form:string,
    schema:FormFieldSchema[],
    initialValues?:any,
    keyPath?:string
    onSchemaChange?(changedSchema:Partial<ParsedFormFieldSchema>[]):void
}

export class SchemaNode extends React.PureComponent<SchemaNodeProps,any>{
    state={
        parsedSchema:null as ParsedFormFieldSchema[]
    };
    pendingSchemaChanges=[];
    onSchemaChange=(newFields)=>{
        if(!(newFields instanceof Promise))
            newFields = Promise.resolve(newFields);
        this.pendingSchemaChanges.push(newFields);
        if(this.state.parsedSchema instanceof Array) //already initialized, apply imme.
            this.applySchema(this.state.parsedSchema)
    };
    applySchema(schema:ParsedFormFieldSchema[]){
        Promise.all(this.pendingSchemaChanges).then((changes)=>{
            const flattenedChanges = changes.reduce((prev,x)=>prev.concat(x),[]);
            const [newSchema,otherChanges] = applyChangesToFields(schema,flattenedChanges);
            if(otherChanges.length>0) {
                Object.keys(this.childrenNodes).forEach(key=>{ //broadcast to children; todo:use event emitter
                     this.childrenNodes[key].onSchemaChange(otherChanges);
                });
                if(this.props.onSchemaChange)
                    setImmediate(() => this.props.onSchemaChange(otherChanges));
            }
            return newSchema;
        }).then((newSchema)=>{
            this.pendingSchemaChanges = [];
            this.setState({
                parsedSchema:newSchema
            });
        });
    }
    componentWillReceiveProps(newProps){
        if(newProps.schema!==this.props.schema){
            this.parseSchema(newProps.schema).then(this.onReady.bind(this));
        }
    }
    onReady(schema:ParsedFormFieldSchema[]){
        this.applySchema(schema)
    }
    componentWillMount(){
        this.parseSchema(this.props.schema).then(this.onReady.bind(this))
    }
    parseField(field:FormFieldSchema):Promise<ParsedFormFieldSchema>{
        let promises = [];
        let parsedField:ParsedFormFieldSchema = {...field} as any;
        if(field.onValueChange) {
            parsedField.normalize = (value,previousValue,allValues) => {
                let valuesPath = [allValues];
                if(this.props.keyPath && this.props.keyPath.length>0){
                    //is nested property, should pass nested value, since onValueChange does not know its index and key
                    this.props.keyPath.split(".").forEach(k=>{
                        const pointer = valuesPath[valuesPath.length-1];
                        if(pointer && pointer.hasOwnProperty(k)){
                            valuesPath.push(valuesPath[valuesPath.length-1][k]);
                        }
                    })
                }
                const newFields = field.onValueChange(value,previousValue,...valuesPath);
                if (newFields) {
                    this.onSchemaChange(newFields);
                }
                return field.normalize?field.normalize(value,previousValue,allValues):value;
            };
            if(this.props.initialValues) {
                const newFields = field.onValueChange(this.props.initialValues[field.key], undefined, this.props.initialValues);
                if (newFields)
                    this.onSchemaChange(newFields);
            }
        }
        if(field.options && typeof field.options ==='function' && !field.options.length) {
            const asyncOptions = field.options as AsyncOptions;
            promises.push(asyncOptions().then(options=>{
                parsedField['options'] = options;
                return parsedField;
            }));
        }else{
            promises.push(Promise.resolve(field))
        }
        return Promise.all(promises).then(()=>{
            return parsedField
        })
    }
    childrenNodes={} as {[key:string]:SchemaNode};
    refChildrenNodes=(ref,key)=>{
        this.childrenNodes[key]=ref;
    };
    parseSchema(newSchema:FormFieldSchema[]):Promise<ParsedFormFieldSchema[]>{
        let promises = newSchema.map(field=>this.parseField(field));
        return Promise.all(promises);
    }
    render(){
        if(!this.state.parsedSchema)
            return null;
        return <div className="schema-node">
            {
                this.state.parsedSchema.map(field => {
                    if (field.hide)
                        return null;
                    return <div key={field.key || field.label} className={"field "+field.type}>
                        {
                            renderField(
                                field,
                                this.props.form,
                                (this.props.keyPath?(this.props.keyPath+"."):"")+field.key,
                                this.props.initialValues?this.props.initialValues[field.key]:{},
                                this.onSchemaChange,
                                this.refChildrenNodes
                            )
                        }
                    </div>
                })
            }
        </div>
    }
}