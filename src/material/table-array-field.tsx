import Dialog from 'material-ui/Dialog';
import * as React from 'react';
import { WrappedFieldArrayProps, FieldArray } from 'redux-form';
import { WidgetProps, addTypeWithWrapper } from '../field';
import { createSelector } from "reselect";
const dataSourceConfig = {text:"name",value:"value"};
const {Grid} = require("ag-grid-material-preset")
import { renderFields } from '../render-fields';
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
            name:"前移",
            call:(t,e,x)=>{
                this.props.fields.swap(x.rowIndex,x.rowIndex-1)
            },
            enabled:(t,x)=>{
                return x.rowIndex>0
            }
        },
        {
            name:"后移",
            call:(t,e,x)=>{
                 this.props.fields.swap(x.rowIndex,x.rowIndex+1)
            },
            enabled:(t,x)=>{
                return x.rowIndex<this.props.fields.length-1
            }
        },
        {
            name:"编辑",
            call:(t,e)=>{
                e.preventDefault()
                e.stopPropagation()
                this.api.forEachNode(x=>x.data === t && this.setState({
                    editedIndex:x.rowIndex
                },()=>{
                    window.dispatchEvent(new Event("resize"))
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
                const schema = this.selector(this.props)
                const rawData = this.props.fields.getAll()
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
                    const schema = this.selector(this.props)
                    data.forEach(item=>{
                        this.props.fields.push(schema.reduce((res,field)=>{
                            res[field.key] = item[field.label]
                            return res
                        },item))
                    })
                })
            },
            isStatic:true
        }
    ]
    state={
        editedIndex:-1
    }
    api
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