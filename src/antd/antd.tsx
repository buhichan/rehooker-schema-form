/**
 * Created by Administrator on 2017/8/8.
 */

import * as React from "react"
import {addType, addTypeWithWrapper} from "../field";
const {Field,FieldArray} =require("redux-form");
const {Radio} = require("antd/lib");
const RadioGroup = Radio.Group;
import { AutoComplete } from 'antd';
import {Input} from "antd";
const {TextArea} =Input;
import { DatePicker } from 'antd';
const {RangePicker} = DatePicker;
import {Select} from "antd"
import {isArray} from "util";
const Option = Select.Option;
import {Checkbox} from "antd";
import {WidgetProps} from "../field";
import {InputNumber} from "antd";
import {Tooltip} from "antd";
const moment = require("moment");
import {AsyncOptions, Options} from "../form";
import { Upload, Button, Icon } from 'antd';
import {RuntimeAsyncOptions} from "../form";
import {renderFields} from "../render-fields";
import { setButton } from "../buttons";

const errorStyle={color:"red"};
function TextInput(props){
    let required={
        required:props.required
    };
    return <div style={props.fieldSchema.hide?{}:{height:"50px"}}>
        <div>{props.fieldSchema.label}</div>
        <Input type={props.type}
               id={props.input.name}
               className="full-width"
               style={{width:"100%"}}
               name={props.input.name}
               {...required as any}
               onBlur={props.input.onBlur}
               disabled={props.disabled}
               value={props.input.value}
               onChange={props.input.onChange}

        />
        <div style={errorStyle}>{props.meta.error}</div>
    </div>
}


class SelectInput extends React.Component<WidgetProps,any>{
    state={
        options:null
    };
    reload(props:WidgetProps){
        const rawOptions =  props.fieldSchema.options;
        if(typeof rawOptions=== 'function'){
            if(!rawOptions.length)
                (rawOptions as AsyncOptions)().then(options=>!this.unmounted && this.setState({
                    options
                }))

        }else if (rawOptions instanceof Array)
            this.setState({
                options:props.fieldSchema.options
            })
    }
    componentWillReceiveProps(nextProps:WidgetProps){
        if(nextProps.fieldSchema.options!==this.props.fieldSchema.options)
            this.reload(nextProps);
    }
    unmounted=false;
    componentWillUnmount(){
        this.unmounted=true
    }
    componentWillMount(){
        this.reload(this.props);
    }
    render(){
        return <div
            style={this.props.fieldSchema.hide?{}:{height:"50px"}}
        >
            <div>{this.props.fieldSchema.label}</div>
            <Select
                showSearch
                style={{ width: "100%" }}
                disabled={this.props.disabled}
                mode={this.props.fieldSchema.multiple?"multiple":"default"}
                optionFilterProp="children"
                value={this.props.fieldSchema.multiple?(isArray(this.props.input.value)?this.props.input.value:[]):this.props.input.value}
                onChange={(value)=>this.props.input.onChange(value)}
                filterOption={(input, option) => {
                    return (option["props"].children as any).toLowerCase().indexOf(input.toLowerCase()) >= 0}}

            >

                {this.state.options?this.state.options.map(option=>(
                    <Option key={option.name} value={option.value}>{option.name}</Option>
                )):null}
            </Select>
            <div style={errorStyle}>
                {this.props.meta.error}
            </div>
        </div>
    }

}

class CheckboxInput extends React.Component<WidgetProps,any>{

    render(){
        return <Checkbox
            style={Object.assign({width:"100%"},this.props.fieldSchema.hide?null:{lineHeight:"50px",height:"50px"})}
            disabled={this.props.disabled}
            onChange={(e)=>this.props.input.onChange(e.target["checked"])}
            checked={Boolean(this.props.input.value)}
        >{this.props.fieldSchema.label}</Checkbox>;
    }
}




function DateTimeInput(props){
    const value=props.input.value?new moment(props.input.value):undefined;
    return <div style={props.fieldSchema.hide?{}:{height:"50px"}}>
        <div>{props.fieldSchema.label}</div>
        <DatePicker
            showTime
            format="YYYY-MM-DD HH:mm:ss"
            placeholder="Select Time"
            defaultValue={value}
            style={{width:"100%"}}
            onChange={(value,dateString)=>props.input.onChange(dateString)}
        />
        <div style={errorStyle}>{props.meta.error}</div>
    </div>
}

function DateInput(props){
    let required={
        required:props.required
    };
    let value= null;
    if(props.input.value){
        if(!(props.input.value instanceof moment))
            value=new moment(props.input.value);
    }

    return<div
        style={props.fieldSchema.hide?{}:{height:"50px"}}
    >
        <div>{props.fieldSchema.label}</div>
        <DatePicker
            {...required as any}
            key={props.fieldSchema.name}
            value={value}
            disabled={props.disabled}
            style={{width:"100%"}}
            onChange={(date,dateString)=>{props.input.onChange(dateString)}}
        />
        <div style={errorStyle}>
            {props.meta.error}
        </div>
    </div>
}

class DateTimeRangeInput extends React.Component<WidgetProps,any>{

    render(){
        const value = this.props.input.value&&JSON.parse(this.props.input.value);
        //console.log(value);
        return <div  style={this.props.fieldSchema.hide?{}:{height:"50px"}}>
            <div>{this.props.fieldSchema.label}</div>
            <RangePicker
                showTime={{ format: 'HH:mm' }}
                format="YYYY/MM/DD HH:mm"
                placeholder={['开始时间', '结束时间']}
                defaultValue={[(value&&new moment(value[0],"YYYY/MM/DD HH:mm:ss"))||new moment(),(value&&new moment(value[1],"YYYY/MM/DD HH:mm:ss"))||new moment()]}
                onOk={(value)=>{
                    //console.log(value);
                    //this.props.input.onChange(JSON.stringify(value.map(itm=>itm.format("YYYY/MM/DD hh:mm:ss"))));
                }
                }
            />
            <div style={errorStyle}>{this.props.meta.error}</div>
        </div>
    }
}


function NumberInput(props){
    let required={
        required:props.required
    };
    return <div
        style={Object.assign({width:"100%"},props.fieldSchema.hide?null:{height:"50px"})}
    >
        <div>{props.fieldSchema.label}</div>

        <InputNumber
            onBlur={props.input.onBlur}
            {...required as any}
            style={{width:"100%"}}
            id={props.input.name}
            min={0}
            disabled={props.disabled}
            value={isNaN(parseFloat(props.input.value))?0:parseFloat(props.input.value)}
            onChange={(value)=>{if(isNaN(parseFloat(value as any))){
                props.input.onChange(0)
            }else{
                props.input.onChange(parseFloat(value as any) )
            }
            }} />
        <div style={errorStyle}>{props.meta.error}</div>

    </div>
}


class AutoCompleteSelect extends SelectInput{
    render() {
        const {meta,input,fieldSchema} = this.props;
        const value = (fieldSchema.options as Options).find(x=>x.value === input.value);
        return <div style={{ width:"100%" }}>
            <AutoComplete
                dataSource={(this.state.options as any || []).map(itm=>({value:itm.value,text:itm.name}))}
                style={{ width:"100%" }}
                onSelect={(value)=>input.onChange(value)}
            />
            <div style={errorStyle}>{this.props.meta.error}</div>
        </div>
    }
}


class FileInput extends React.Component<WidgetProps,any>{
    onChange=(info)=>{
        let fileList = info.fileList;
        fileList = fileList.map(file=>{
            if(file.response){
                file.url = file.response.url;
            }
            return file
        });

        fileList=fileList.filter(file=>{
            if(file.response){
                return file.status==="done";
            }
            return true;
        });
        this.props.input.onChange(fileList)
    };
    customRequest=({onSuccess,onError,onProgress,data,file,filename})=>{
        this.props.fieldSchema.onFileChange(this.props.input.value).then(previewUrl=>{
            onProgress({percent:100});
            onSuccess(previewUrl,null);
        },(err)=>onError(err))
    };
    render(){
        return <div style={{width:"100%"}}>
            <Upload
                multiple={true}
                onChange={this.onChange}
                action={this.props.fieldSchema.action}
                customRequest={this.props.fieldSchema.onFileChange?this.customRequest:undefined}
            >
                <Button>
                    <Icon type="upload" /> {this.props.fieldSchema.label}
                </Button>
            </Upload>
        </div>
    }
}

@(addType("radio") as any)
class SelectRadio extends (SelectInput as any){

    render(){
        const props = this.props;
        return <div>
            <div style={{paddingLeft:0}}>
                {props.fieldSchema.label}
            </div>
            <RadioGroup
                id={props.input.name}
                disabled={props.disabled}
                value={this.props.input.value || false}
                onChange={(v)=>props.input.onChange(v)}
            >
                {
                    this.state.options?this.state.options.map((option) => (
                        <Radio style={{
                            width:"auto",
                            flex:1,
                            whiteSpace:"nowrap",
                            margin:"0 15px 0 0"
                        }} key={option.value} value={option.value} >{option.name}</Radio>
                    )):<Radio key={"...loading"} value={""} disabled label={"载入中"}/>
                }
            </RadioGroup>
            <p style={errorStyle}>{props.meta.error}</p>
        </div>
    }
}

class DateRangeInput extends React.Component<WidgetProps,any>{
    render(){
        const dateFormat = 'YYYY-MM-DD';
        const {value}=this.props.input;
        const from =value?value[0]:undefined;
        const to =value?value[1]:undefined;
        return <div >
            <RangePicker
                defaultValue={[from?moment(from,dateFormat):undefined, to?moment(to,dateFormat):undefined]}
                disabled={this.props.disabled}
                format={dateFormat}
                onChange={(date,dateStrings)=>{this.props.input.onChange(dateStrings)}}
            />
        </div>
    }
}


class TextareaInput extends React.Component<WidgetProps,any>{
    render(){
        return <div>
            <div>{this.props.fieldSchema.label}</div>
            <TextArea disabled={this.props.disabled}
                      value={this.props.input.value}
                      onChange={(value)=>this.props.input.onChange(value)}
                      autosize={{minRows:4,maxRows:8}} />
            <div style={errorStyle}>{this.props.meta.error}</div>
        </div>

    }
}


class AutoCompleteAsync extends React.Component<WidgetProps,any>{
    pendingUpdate;
    fetchingQuery;
    $isMounted;
    componentWillMount(){
        this.$isMounted=true;
    }
    componentWillUnmount(){
        this.$isMounted=false;
    }
    componentWillReceiveProps(nextProps){
        if(nextProps.input.value!==this.props.input.value)
            this.setState({
                searchText:this.findName(nextProps.input.value)
            })
    }
    findName(value){
        const entry = (this.state.dataSource as Options).find(x=>x.value === value);
        return entry?entry.name:value;
    }
    onUpdateInput=(name)=>{
        const throttle = this.props.fieldSchema['throttle']||400;
        this.setState({
            searchText:name
        });
        if(this.pendingUpdate)
            clearTimeout(this.pendingUpdate);
        this.pendingUpdate = setTimeout(()=>{
            this.fetchingQuery = name;
            const result = (this.props.fieldSchema.options as RuntimeAsyncOptions)(name,this.props);
            if(result instanceof Promise)
                result.then(options=>{
                    if(this.fetchingQuery === name && this.$isMounted)
                        this.setState({
                            dataSource:options.map(itm=>({text:itm.name,value:itm.value}))
                        })
                });
            else this.setState({
                dataSource:result.map(itm=>({text:itm.name,value:itm.value}))
            })
        },throttle);
    };
    onSelected=({value})=>{
        this.props.input.onChange(value)
    };
    state={
        searchText:"",
        dataSource:[]
    };
    render(){
        const {meta,input,fieldSchema} = this.props;
        return <div>
            <div>{fieldSchema.label}</div>
            <AutoComplete
                dataSource={this.state.dataSource}
                style={{width:"100%"}}
                onSelect={(value)=>input.onChange(value)}
                disabled={this.props.disabled}
                onSearch={this.onUpdateInput}
                filterOption
            />
            <div style={errorStyle}>
                {meta.error}
            </div>
        </div>
    }
}


class AutoCompleteText extends React.Component<WidgetProps,any>{
    onUpdateInput=name=>{
        const entry = (this.props.fieldSchema.options as Options).find(x=>x.name===name);
        return this.props.input.onChange(entry?entry.value:name);
    };
    render(){
        const {input,meta,fieldSchema} = this.props;
        return <div>
            <div>{fieldSchema.label}</div>
            <AutoComplete
                dataSource={(fieldSchema.options as Options).map(itm=>({text:itm.name,value:itm.value}))}
                onSearch={this.onUpdateInput}
                onSelect={(value)=>input.onChange(value)}
                filterOption
            />
            <div style={errorStyle}>{meta.error}</div>
        </div>
    }
}



class ArrayFieldRenderer extends React.Component<WidgetProps,any>{
    render(){
        const props = this.props;

        return <div className="clearfix array-field-container">
            {
                props.fields.map((name, i) => {
                    let children = props.fieldSchema.children;
                    if(props.fieldSchema.getChildren)
                        children = props.fieldSchema.getChildren(props.fields.get(i)).filter(x=>x);
                    return <div key={i} className="array-field-child">
                        <div className="delete-button">
                            <Tooltip placement="topLeft" title="删除" arrowPointAtCenter>
                                <Icon type="minus" className="icon-minus" style={{cursor:"pointer"}} onClick={() => props.fields.remove(i)}/>
                            </Tooltip>

                        </div>
                        {
                            renderFields(props.meta.form,children,props.keyPath+"["+i+"]")
                        }
                    </div>
                })
            }
            <div className="add-button">
                <Tooltip placement="topLeft" title="添加" arrowPointAtCenter>
                    <Icon type="plus"  className="icon-plus" style={{cursor:"pointer"}} onClick={() => props.fields.push()}/>
                </Tooltip>
            </div>
        </div>
    }
}


addType('text',TextInput);
addType('select',SelectInput);


addType('checkbox',CheckboxInput);

addType('date',DateInput);

addType('autocomplete-text',AutoCompleteText);

addType('datetime',DateTimeInput);

addType('datetimeRange',DateTimeRangeInput);

addType('number',NumberInput);

addType('autocomplete',AutoCompleteSelect);

addType("file",FileInput);

addType("dateRange",DateRangeInput);

addType("textarea",TextareaInput);


addType("password",TextInput);
addType("email",TextInput);
addType('text',TextInput);
addTypeWithWrapper("array",(props)=>{
    return <div>
        <label className="control-label">{props.fieldSchema.label}</label>
        <FieldArray name={props.keyPath} rerenderOnEveryChange={Boolean(props.fieldSchema.getChildren)} component={ArrayFieldRenderer} props={props}/>
    </div>
});

addType("autocomplete-async",AutoCompleteAsync);

setButton(function(props:any){
    switch (props.type) {
        case 'submit':
            return <Button
                className="raised-button"
                style={{margin: "15px"}}
                onClick={props.onClick}
                disabled={props.disabled}
                type={props.type}
                htmlType={props.type}
            >
                {props.children}
            </Button>;
        case "button":
            return <Button
                style={{
                    backgroundColor: "transparent",
                    margin: "15px"
                }}
                onClick={props.onClick}
                disabled={props.disabled}
                type={props.type}
                htmlType={props.type}
            >
                {props.children}
            </Button>
        default:
            return null;
    }
});