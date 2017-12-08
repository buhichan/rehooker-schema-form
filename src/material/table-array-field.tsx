import Dialog from 'material-ui/Dialog';
import * as React from 'react';
import { WrappedFieldArrayProps, FieldArray, reduxForm, change } from 'redux-form';
import { WidgetProps, addTypeWithWrapper } from '../field';
import { createSelector } from "reselect";
const dataSourceConfig = {text:"name",value:"value"};
import { renderFields } from '../render-fields';
import { ReduxSchemaForm } from '../form';
import { connect } from 'react-redux';
const {Grid} = require("ag-grid-presets")
const XLSX = require("xlsx")

type TableArrayFieldProps = WrappedFieldArrayProps<any>&WidgetProps;

function readWorkBook():Promise<any[]>{
    try{
        return new Promise((resolve,reject)=>{
            const id = "fjorandomstring";
            let input = document.querySelector("input#"+id) as HTMLInputElement;
            if(!input){
                input = document.createElement("input")
                input.id = id
                input.type='file'
                input.style.display="none"
                document.body.appendChild(input)
            }
            input.onchange=(e)=>{
                var reader = new FileReader();
                const file = (e.target as any).files[0]
                reader.onload = ()=> {
                    const data = XLSX.read(reader.result, {type:'binary'});
                    document.body.removeChild(input)
                    if(data.SheetNames.length)
                    resolve(XLSX.utils.sheet_to_json(data.Sheets[data.SheetNames[0]]))
                };
                reader.readAsBinaryString(file);
            }
            input.click()
        })
    }catch(e){
        console.error(e)
    }
}

function downloadWorkSheet(worksheet,fileName){
    function s2ab(s) {
        var buf = new ArrayBuffer(s.length);
        var view = new Uint8Array(buf);
        for (var i=0; i!=s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
        return buf;
    }
    try{
        const workbook = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(workbook,worksheet,fileName)
        /* bookType can be any supported output type */
        var wopts = { bookType:'xlsx', bookSST:false, type:'binary' };

        var wbout = XLSX.write(workbook,wopts);

        /* the saveAs call downloads a file on the local machine */
        const blob = new Blob([s2ab(wbout)],{type:"application/octet-stream"});
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url;
        a.download=fileName+".xlsx";
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
    }catch(e){
        console.error(e)
    }
}

@(connect() as any)
class TableArrayField extends React.PureComponent<TableArrayFieldProps,any>{
    actions=[
        {
            name:"编辑",
            call:(t,e)=>{
                const index = this.findIndex(t)
                this.api.forEachNode(x=>x.data === t && this.setState({
                    editedIndex:index
                },()=>{
                    window.dispatchEvent(new Event("resize"))
                }))
            },
            enabled:()=>!this.props.fieldSchema.disabled
        },
        {
            name:"删除",
            call:(t,e)=>{
                const index = this.findIndex(t)
                this.api.forEachNode(x=>x.data === t && this.props.fields.remove(index))
            },
            enabled:()=>!this.props.fieldSchema.disableDelete
        },
        {
            name:"添加",
            call:()=>{
                this.setState({
                    editedIndex:this.props.fields.length
                })
                this.props.fields.push(this.props.fieldSchema.defaultValue || {})
            },
            isStatic:true,
            enabled:()=>!this.props.fieldSchema.disableCreate
        },
        {
            name:"前移",
            call:(t,e,x)=>{
                const index = this.findIndex(t)
                if(index>=0)
                    this.props.fields.swap(index,index-1)
            },
            enabled:(t,x)=>{
                if(this.props.fieldSchema.disableSort)
                    return false
                const index = this.findIndex(t)
                return index>0
            }
        },
        {
            name:"后移",
            call:(t,e,x)=>{
                const index = this.findIndex(t)
                if(index>=0)
                    this.props.fields.swap(index,index+1)
            },
            enabled:(t,x)=>{
                if(this.props.fieldSchema.disableSort)
                    return false
                const index = this.findIndex(t)
                return index<this.props.fields.length-1
            }
        },
        {
            name:"导出",
            call:()=>{
                const schema = this.props.fieldSchema.children
                let rawData = this.props.fields.getAll()
                if(!rawData || !(rawData instanceof Array) || !rawData.length)
                rawData = [schema.reduce(function (res, y) {
                    res[y.label] = "";
                    return res;
                }, {})]
                const sheet = XLSX.utils.json_to_sheet(rawData.map(x=>{
                    return schema.reduce((res,y)=>{
                        res[y.label] = x[y.key]
                        return res
                    },{})
                }))
                downloadWorkSheet(sheet, this.props.fieldSchema.label)
            },
            isStatic:true
        },{
            name:"导入",
            call:(data)=>{
                readWorkBook().then(data=>{
                    const schema = this.props.fieldSchema.children
                    const newValues = data.map(item=>{
                        return schema.reduce((res,field)=>{
                            res[field.key] = item[field.label]
                            return res
                        },item)
                    })
                    if(confirm("是否替换原有数据? "))
                        this.changeArrayValues(newValues)
                    else 
                        this.changeArrayValues(this.props.input.value.concat(newValues))
                })
            },
            isStatic:true,
            enabled:()=>!this.props.fieldSchema.disableImport
        },{
            name:"批量编辑",
            call:(data,e,nodes)=>{
                if(!data || data.length<2)
                    return
                this.setState({
                    editedIndex:this.props.fields.length,
                    batchEditedData:data
                })
                this.props.fields.push({}) // insert a new child to provide a blank form.
            },
            isStatic:true,
            enabled:data=>!this.props.fieldSchema.disabled && data && data.length>=2
        }
    ]
    findIndex=(data)=>{
        for(let i =0;i<this.props.fields.length;i++){
            if(this.props.fields.get(i) === data)
                return i
        }
        return -1
    }
    changeArrayValues=newValues=>this.props.dispatch(change(this.props.meta.form,this.props.keyPath,newValues))
    onBatchEdit=()=>{
        //remove the added child
        const values = this.props.fields.getAll().slice()
        const batchEditValues = values.pop()
        const filledBatchEditValues = Object.keys(batchEditValues).reduce((values,key)=>{
            if(batchEditValues[key] !== null && batchEditValues[key] !== undefined)
                values[key] = batchEditValues[key]
            return values;
        },{})
        this.changeArrayValues(values.map((value)=>{
            if(this.state.batchEditedData.includes(value))
                return {
                    ...value,
                    ...batchEditValues
                }
            else 
                return value
        }))
    }
    state={
        editedIndex:-1,
        batchEditedData:null
    }
    api
    bindGridApi=api=>this.api=api;
    closeDialog=()=>{
        if(this.state.batchEditedData)
            this.onBatchEdit()
        this.setState({
            editedIndex:-1,
            batchEditedData:null
        })
    }
    stripLastItem = createSelector<any[],any[],any[]>(
        s=>s,
        s=>s.slice(0,-1)
    )
    getGridSchema = createSelector<any[],any[],any[]>(
        s=>s,
        s=>s.map(x=>{
            if(x.hasOwnProperty("showInTable"))
                return {
                    ...x,
                    hide:!x.showInTable
                }
            else return x
        })
    )
    render(){
        const value=this.props.fields.getAll()||empty
        const {
            key,
            type,
            label,
            hide,
            fullWidth, //todo: should I put this presentation logic here?
            required,
            disabled,
            children,
            ...gridOptions
        } = this.props.fieldSchema
        const gridSchema=this.getGridSchema(this.props.fieldSchema.children)
        return <div>
            <label className="control-label">{this.props.fieldSchema.label}{this.props.fields.length?`(${this.props.fields.length})`:""}</label>
            <Grid 
                data={this.state.batchEditedData?this.stripLastItem(value):value}
                schema={gridSchema}
                gridName={this.props.meta.form+"-"+this.props.keyPath}
                suppressAutoSizeToFit
                overlayNoRowsTemplate={`<div style="font-size:30px">${""}</div>`}
                height={300}
                selectionStyle="checkbox"
                actions={this.actions}
                gridApi={this.bindGridApi}
                {...gridOptions}
            />
            <Dialog autoScrollBodyContent autoDetectWindowHeight open={this.state.editedIndex >= 0 } onRequestClose={this.closeDialog}>
                {
                    this.state.editedIndex<0?null:renderFields(this.props.meta.form,this.props.fieldSchema.children,this.props.keyPath+"["+this.state.editedIndex+"]")
                }
            </Dialog>
        </div>
    }
}

const empty = [];

addTypeWithWrapper("table-array",(props)=>{
    return <div style={{paddingTop:25}}>
        <FieldArray name={props.keyPath} rerenderOnEveryChange component={TableArrayField} props={props}/>
    </div>
});