import Dialog from 'material-ui/Dialog';
import * as React from 'react';
import { GridApi } from 'ag-grid';
import { WrappedFieldArrayProps, FieldArray } from 'redux-form';
import { WidgetProps, addTypeWithWrapper } from '../field';
import { createSelector } from "reselect";
const dataSourceConfig = {text:"name",value:"value"};
import {Grid} from "ag-grid-material-preset"
import { renderFields } from '../render-fields';

type TableArrayFieldProps = WrappedFieldArrayProps<any>&WidgetProps;

const readCSV=(e:Event,columns):Promise<any[]>=>{
    const files = (e.target as HTMLInputElement).files;
    return new Promise((resolve,reject)=>{
        Array.from(files).forEach(file => {
            if(file.type!=='text/csv')
                return alert("必须导入csv文件")
            const fileReader = new FileReader();
            fileReader.onload = ()=>{
                const str = fileReader.result
                require("csv-parse")(str,{
                    auto_parse:true,
                    auto_parse_date:false,
                    columns,
                    skip_empty_lines:true,
                    trim:true
                },(err,chunks)=>{
                    err?alert(err):resolve(chunks)
                })
            }
            fileReader.onerror = reject
            fileReader.readAsText(file)
        });
    })
}
class TableArrayField extends React.PureComponent<TableArrayFieldProps,any>{
    selector=createSelector<TableArrayFieldProps,any,any>(
        s=>s.fieldSchema.children,
        oldSchema=>{
            return oldSchema.map(x=>({
                ...x,
                hide:false 
            }))
        }
    )
    actions=[
        {
            name:"添加",
            call:()=>{
                this.setState({
                    editedIndex:this.props.fields.length
                })
                this.props.fields.push(this.props.fieldSchema.defaultValue || {})
            },
            isStatic:true
        },
        {
            name:"编辑",
            call:(t,e)=>{
                e.preventDefault()
                e.stopPropagation()
                this.api.forEachNode(x=>x.data === t && this.setState({
                    editedIndex:x.rowIndex
                }))
            }
        },
        {
            name:"删除",
            call:(t,e)=>{
                e.preventDefault()
                e.stopPropagation()
                this.api.forEachNode(x=>x.data === t && this.props.fields.remove(x.rowIndex))
            }
        },
        {
            name:"导出",
            call:()=>{
                this.api.exportDataAsCsv({
                    fileName:this.props.fieldSchema.label
                })
            },
            isStatic:true
        },{
            name:"导入",
            call:(data)=>{
                const id = this.props.meta.form+"fjorandomstring";
                let input = document.querySelector("input#"+id) as HTMLInputElement;
                if(!input){
                    input = document.createElement("input")
                    input.id = id
                    input.type='file'
                    input.style.display="none"
                    document.body.appendChild(input)
                }
                input.onchange=(e)=>{
                    readCSV(e,labels=>{
                        return labels.map(label=>{
                            const item = this.props.fieldSchema.children.find(x=>x.label === String(label).trim())
                            return item?item.key:null
                        })
                    }).then((data)=>{
                        data.forEach(this.props.fields.push)
                        document.body.removeChild(input)
                    })
                }
                input.click()
            },
            isStatic:true
        }
    ]
    state={
        editedIndex:-1
    }
    api:GridApi
    bindGridApi=api=>this.api=api;
    closeDialog=()=>this.setState({editedIndex:-1})
    render(){
        const value=this.props.fields.getAll()||empty
        const schema=this.selector(this.props);
        return <div>
            <Grid 
                data={value}
                schema={schema}
                overlayNoRowsTemplate={`<div style="font-size:30px">${""}</div>`}
                height={300}
                actions={this.actions}
                gridApi={this.bindGridApi}
            />
            <Dialog autoScrollBodyContent open={this.state.editedIndex >= 0 } onRequestClose={this.closeDialog}>
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
        <label className="control-label">{props.fieldSchema.label}</label>
        <FieldArray name={props.keyPath} rerenderOnEveryChange component={TableArrayField} props={props}/>
    </div>
});