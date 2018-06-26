/**
 * Created by Administrator on 2017/8/8.
 */
///<reference path="./declarations.d.ts" />
import * as React from "react"
import {addType, addTypeWithWrapper, getComponentProps} from "../field";
import {FieldArray, WrappedFieldArrayProps} from "redux-form"
import { AutoComplete, Radio ,Checkbox, InputNumber, Tooltip, Upload, Button, Icon} from 'antd';
const RadioGroup = Radio.Group;
import {Input,Select,DatePicker} from "antd";
const {TextArea} =Input;
const {RangePicker} = DatePicker;
import {isArray} from "util";
const Option = Select.Option;
import {WidgetProps} from "../field";
import {Options} from "../form";
import {RuntimeAsyncOptions} from "../form";
import {renderFields} from "../render-fields";
import { setButton } from "../buttons";
const PropTypes = require('prop-types')
const RCSelect = require("rc-select").default
import * as moment from "moment"
import { ResolveMaybePromise } from '../resolve-maybe-promise';

RCSelect.propTypes['value'] = PropTypes.any
Option.propTypes['value'] = PropTypes.any
Select.propTypes['value'] = PropTypes.any

// const convertValueToString = Comp=>(props)=>{
//     let onChange=!props.onChange?undefined:(value)=>{
//         props.onChange()
//     }
//     return <Comp {...props} value={String(props.value)} />
// }

const errorStyle={color:"red"};
function TextInput(props:WidgetProps){
    const componentProps = getComponentProps(props.fieldSchema)
    return <div>
        <div>{props.fieldSchema.label}</div>
        <Input 
            type={props.type}
            id={props.input.name}
            className="full-width"
            style={{width:"100%"}}
            name={props.input.name}
            onBlur={props.input.onBlur}
            value={props.input.value}
            onChange={props.input.onChange}
            {...componentProps}
        />
        <div style={errorStyle}>{props.meta.error}</div>
    </div>
}

function SelectInput (props:WidgetProps){
    const {fieldSchema,input,meta} = props
    const componentProps:any = getComponentProps(props.fieldSchema)
    return <div>
        <label>{fieldSchema.label}</label>
        <ResolveMaybePromise maybePromise={fieldSchema.options} >
            {options=>{
                return <Select
                    showSearch
                    style={{ width: "100%" }}
                    optionFilterProp="children"
                    mode={fieldSchema.multiple?"multiple":"default"}
                    value={fieldSchema.multiple?(isArray(input.value)?input.value:[]):input.value}
                    onChange={(value)=>input.onChange(value)}
                    filterOption={(input, option:React.ReactElement<any>) => {
                        return (option["props"].children as any).toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }}
                    {...componentProps}
                >
                    {options?options.map(option=>{
                        const {name,value,...rest} = option
                        return <Option key={name} value={value} {...rest}>{name}</Option>
                    }):null}
                </Select>
            }}
        </ResolveMaybePromise>
        <div style={errorStyle}>
            {meta.error}
        </div>
    </div>
}

function CheckboxInput (props:WidgetProps){
    const componentProps = getComponentProps(props.fieldSchema)
    return <div style={{width:"100%"}}>
        <label>{props.fieldSchema.label}</label>
        <Checkbox
            onChange={(e)=>props.input.onChange(e.currentTarget.checked)}
            checked={Boolean(props.input.value)}
            {...componentProps}
        />
    </div>
}




function DateTimeInput(props:WidgetProps){
    const value=props.input.value?moment(props.input.value):undefined;
    const componentProps = getComponentProps(props.fieldSchema)
    return <div>
        <label>{props.fieldSchema.label}</label>
        <DatePicker
            showTime
            format="YYYY-MM-DD HH:mm:ss"
            defaultValue={value}
            style={{width:"100%"}}
            onChange={(_,dateString)=>props.input.onChange(dateString)}
            {...componentProps}
        />
        <div style={errorStyle}>{props.meta.error}</div>
    </div>
}

function DateInput(props:WidgetProps){
    let value= null;
    if(props.input.value){
        if(!(props.input.value instanceof moment))
            value= moment(props.input.value);
    }
    const componentProps = getComponentProps(props.fieldSchema)
    return<div >
        <label>{props.fieldSchema.label}</label>
        <DatePicker
            key={props.fieldSchema.name}
            value={value}
            disabled={props.disabled}
            style={{width:"100%"}}
            onChange={(_,dateString)=>{props.input.onChange(dateString)}}
            {...componentProps}
        />
        <div style={errorStyle}>
            {props.meta.error}
        </div>
    </div>
}

function DateTimeRangeInput (props:WidgetProps){
    let value =props.input.value
    const componentProps = getComponentProps(props.fieldSchema)
    return <div>
        <label>{props.fieldSchema.label}</label>
        <RangePicker
            showTime={{ format: 'HH:mm:ss' }}
            format="YYYY-MM-DD HH:mm:ss"
            placeholder={['开始时间', '结束时间']}
            defaultValue={[(value&&value[0]&&moment(value[0]))||moment(),(value&&value[1]&&moment(value[1]))||moment()]}
            onChange={(_,dataStrings)=>{
                props.input.onChange(dataStrings);
            }}
            {...componentProps}
        />
        <div style={errorStyle}>{props.meta.error}</div>
    </div>
}


function NumberInput(props:WidgetProps){
    let required={
        required:props.required
    };
    const componentProps = getComponentProps(props.fieldSchema)
    return <div style={{width:"100%"}}>
        <label>{props.fieldSchema.label}</label>
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
            }} 
            {...componentProps}
        />
        <div style={errorStyle}>{props.meta.error}</div>

    </div>
}


const AutoCompleteSelect = function(props:WidgetProps){
    const {meta,input,fieldSchema} = props;
    const componentProps = getComponentProps(props.fieldSchema)
    return <div style={{ width:"100%" }}>
        <label>{fieldSchema.label}</label>
        <ResolveMaybePromise maybePromise={fieldSchema.options}>
            {options=>{
                return <AutoComplete
                    dataSource={options?options.map(itm=>({value:itm.value,text:itm.name})):[]}
                    style={{ width:"100%" }}
                    value={input.value}
                    onSelect={(value)=>input.onChange(value)}
                    {...componentProps}
                />
            }}
        </ResolveMaybePromise>
        <div style={errorStyle}>{meta.error}</div>
    </div>
}


class FileInput extends React.Component<WidgetProps,any>{
    onChange=(info:any)=>{
        this.props.input.onChange((info.fileList as any[]).map(file=>{
            if(file.response && file.response.url){
                file.url = file.response.url;
            }
            return {
                ...file
            }
        }).filter(file=>{
            if(file.response && file.response.url){
                return file.status==="done";
            }
            return true;
        }))
    };
    customRequest=(customRequestParams:any)=>{
        const {onSuccess,onError,onProgress,file,filename} = customRequestParams
        if(!this.props.fieldSchema.onFileChange){
            setTimeout(()=>{
                onProgress({percent:100});
                onSuccess(filename,null);
            },1)
        }else{
            this.props.fieldSchema.onFileChange(file).then(previewUrl=>{
                onProgress({percent:100});
                onSuccess(previewUrl,null);
            },(err)=>onError(err))
        }
    };
    render(){
        const componentProps = getComponentProps(this.props.fieldSchema)
        return <div style={{width:"100%"}}>
            <Upload
                fileList={this.props.input.value||[]}
                multiple={true}
                onChange={this.onChange}
                customRequest={this.customRequest}
                {...componentProps}
            >
                <Button>
                    <Icon type="upload" /> {this.props.fieldSchema.label}
                </Button>
            </Upload>
        </div>
    }
}

function SelectRadio (props:WidgetProps){
    const componentProps = getComponentProps(props.fieldSchema)
    return <div>
        <label style={{paddingLeft:0}}>
            {props.fieldSchema.label}
        </label>
        <ResolveMaybePromise maybePromise={props.fieldSchema.options}>
            {options=><RadioGroup
                disabled={props.disabled}
                value={props.input.value || false}
                onChange={(v)=>props.input.onChange(v)}
                {...componentProps}
            >
                {
                    options?options.map((option) => (
                        <Radio style={{
                            width:"auto",
                            flex:1,
                            whiteSpace:"nowrap",
                            margin:"0 15px 0 0"
                        }} key={option.value} value={option.value} >{option.name}</Radio>
                    )):null
                }
            </RadioGroup>}
        </ResolveMaybePromise>
        <p style={errorStyle}>{props.meta.error}</p>
    </div>
}

function DateRangeInput (props:WidgetProps){
    const dateFormat = 'YYYY-MM-DD';
    const value=props.input.value
    const from =value?value[0]:undefined;
    const to =value?value[1]:undefined;
    const componentProps = getComponentProps(props.fieldSchema)
    return <div >
        <RangePicker
            defaultValue={[from?moment(from,dateFormat):undefined, to?moment(to,dateFormat):undefined]}
            disabled={props.disabled}
            format={dateFormat}
            onChange={(_,dateStrings)=>{props.input.onChange(dateStrings)}}
            {...componentProps}
        />
    </div>
}


function TextareaInput (props:WidgetProps){
    const componentProps = getComponentProps(props.fieldSchema)
    return <div style={{paddingBottom:15}}>
        <label>{props.fieldSchema.label}</label>
        <TextArea 
            value={props.input.value}
            onChange={(value)=>props.input.onChange(value)}
            autosize={{minRows:4,maxRows:8}} 
            {...componentProps}
        />
        <div style={errorStyle}>{props.meta.error}</div>
    </div>
}


class AutoCompleteAsync extends React.Component<WidgetProps,any>{
    pendingUpdate:any;
    fetchingQuery:any;
    $isMounted:boolean;
    componentDidMount(){
        this.$isMounted=true;
    }
    componentWillUnmount(){
        this.$isMounted=false;
    }
    componentWillReceiveProps(this:AutoCompleteAsync,nextProps:typeof this['props']){
        if(nextProps.input.value!==this.props.input.value)
            this.setState({
                searchText:this.findName(nextProps.input.value)
            })
    }
    findName(value:any){
        const entry = (this.state.dataSource as Options).find(x=>x.value === value);
        return entry?entry.name:value;
    }
    onUpdateInput=(name:string)=>{
        const throttle = this.props.fieldSchema.throttle || 400
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
    onSelected=(params:any)=>{
        this.props.input.onChange(params.value)
    };
    state={
        searchText:"",
        dataSource:[] as any[]
    };
    render(){
        const {meta,input,fieldSchema} = this.props;
        return <div>
            <label>{fieldSchema.label}</label>
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
    onUpdateInput=(name:string)=>{
        const entry = (this.props.fieldSchema.options as Options).find(x=>x.name===name);
        return this.props.input.onChange(entry?entry.value:name);
    };
    render(){
        const {input,meta,fieldSchema} = this.props;
        return <div>
            <label>{fieldSchema.label}</label>
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



class ArrayFieldRenderer extends React.Component<Partial<WidgetProps&WrappedFieldArrayProps<any>>,any>{
    render(){
        const props = this.props;

        return <div className="clearfix array-field-container">
            {
                props.fields.map((_, i) => {
                    let children = props.fieldSchema.children;
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
                    <Icon type="plus"  className="icon-plus" style={{cursor:"pointer"}} onClick={() => props.fields.push(props.fieldSchema.defaultValue||{})}/>
                </Tooltip>
            </div>
        </div>
    }
}


addType('text',TextInput);
addType('select',SelectInput);

addType('radio',SelectRadio)

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
        <FieldArray props={props} keyPath={props.keyPath} name={props.keyPath} rerenderOnEveryChange={Boolean(props.fieldSchema.listens)} component={ArrayFieldRenderer}/>
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