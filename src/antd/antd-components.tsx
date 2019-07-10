/**
 * Created by Administrator on 2017/8/8.
 */
///<reference path="./declarations.d.ts" />

import * as React from "react"
import {addType, renderFields} from "../field";
import { AutoComplete, Radio ,Checkbox, InputNumber, Tooltip, Upload, Button, Icon, Input,Select,DatePicker, Collapse, Form} from 'antd';
import {Options, WidgetProps} from "../form";
import {RuntimeAsyncOptions} from "../form";
import { setButton } from "../inject-submittable";
import * as moment from "moment"
import { ResolveMaybePromise } from '../resolve-maybe-promise';
import { FieldArray } from '../field-array';

const RadioGroup = Radio.Group;
const {TextArea} =Input;
const {RangePicker} = DatePicker;
const Option = Select.Option;
const PropTypes = require('prop-types')
const RCSelect = require("rc-select").default

RCSelect.propTypes['value'] = PropTypes.any;
Option.propTypes && ( Option.propTypes['value'] = PropTypes.any );
(Select as any).propTypes['value'] = PropTypes.any as any

const emptyArray:any[] = []

function ErrorText({children}:{children:React.ReactText}){
    return children ? <div className="error-text" >{children}</div> : null
}

function InputWraper(props:WidgetProps & {children:React.ReactNode}){
    return <Form.Item help={props.error} required={props.schema.required} validateStatus={props.error ? "error" : undefined} label={props.schema.label} hasFeedback={!!props.error} {...props.schema.wrapperProps}>
        {props.children}
    </Form.Item>
}

function TextInput(props:WidgetProps){
    return <InputWraper {...props}>
        <Input 
            type={props.schema.type}
            id={props.schema.key}
            className="full-width"
            style={{width:"100%"}}
            name={props.schema.name}
            value={props.value}
            onChange={props.onChange}
            onBlur={props.onBlur}
            {...props.componentProps}
        />
    </InputWraper>
}


function SelectInput(props:WidgetProps){
    const [search,setSearch] = React.useState("")

    const onBlur = ()=>setSearch("")

    const {schema:fieldSchema,value,componentProps} = props

    const [options,setOptions] = React.useState(null as null | Options)
    
    React.useEffect(()=>{
        if(Array.isArray(fieldSchema.options)){
            setOptions(fieldSchema.options)
        }
    },[fieldSchema.options])

    React.useEffect(()=>{
        if(fieldSchema.options instanceof Function){
            let canceled = false
            fieldSchema.options(search,props).then((options)=>{
                if(!canceled){
                    setOptions(options)
                }
            })
        }
    },[fieldSchema.options instanceof Function && fieldSchema.options.length > 0 ? search : ""])

    const optionValueMap = React.useMemo(()=>{
        if(!options || !options.length){
            return null
        }else{
            return new Map(options.map(x=>[x.value,x.name]))
        }
    },[options])

    const onChange= (newValue:any)=>{
        setSearch("")
        if(optionValueMap){
            if(newValue instanceof Array){
                newValue = newValue.filter(y=>{
                    return optionValueMap.has(y)
                })
            }
        }
        props.onChange(newValue)
    }

    const [innerError,setInnerError] = React.useState("")

    let finalValue = React.useMemo(()=>{
        let finalValue = value
        if(fieldSchema.multiple|| componentProps.mode==="multiple"){
            if(Array.isArray(value)){
                // finalValue = value.filter(x=>!validValues || validValues.has(x))
            }else{
                finalValue = []
            }
        }else{
            if(value === '' || value === null){
                finalValue = undefined
            }
            // else if(value != undefined && !!validValues && !validValues.has(value)){
            //     finalValue = undefined
            // }
        }
        return finalValue
    },[value]) 

    React.useEffect(()=>{
        if(componentProps.allowInvalidOption){
            return
        }else if(optionValueMap){
            if( finalValue instanceof Array ){
                const invalidValues = finalValue.filter(y=>!optionValueMap.has(y))
                if(invalidValues.length > 0){
                    setInnerError(componentProps.invalidOptionAlert && componentProps.invalidOptionAlert(invalidValues) || `选项无效, 请重新选择.`)
                }else{
                    setInnerError("")
                }
            }else if(finalValue != undefined){
                if(!optionValueMap.has(finalValue)){
                    setInnerError(componentProps.invalidOptionAlert && componentProps.invalidOptionAlert(finalValue) || `选项无效, 请重新选择.`)
                }else{
                    setInnerError("")
                }
            }else{
                setInnerError("")
            }
        }
    },[finalValue,optionValueMap])

    return <InputWraper {...props} error={props.error || innerError}>
        <Select
            allowClear={!fieldSchema.required}
            showSearch
            style={{ width: "100%" }}
            onSearch={setSearch}
            mode={fieldSchema.multiple?"multiple":"default"}
            value={finalValue}
            onChange={onChange}
            filterOption={false}
            {...componentProps}
            onBlur={onBlur}
        >
            {options ? options.filter((option)=>{
                return !search || option.name.toLowerCase().indexOf(search.toLowerCase()) >= 0
            }).slice(0,fieldSchema.maxOptionCount || Infinity).map(option=>{
                const {name,value,...rest} = option
                return <Select.Option key={name} value={value} {...rest}>{name}</Select.Option>
            }) : null}
        </Select>
    </InputWraper>
}

function CheckboxInput (props:WidgetProps){
    return <InputWraper {...props}>
        <Checkbox
            onChange={(e)=>props.onChange((e.target as HTMLInputElement).checked)}
            onBlur={props.onBlur}
            checked={Boolean(props.value)}
            {...props.componentProps}
        />
    </InputWraper>
}




function DateTimeInput(props:WidgetProps){
    const value=props.value?moment(props.value):undefined;
    return <InputWraper {...props}>
        <DatePicker
            showTime
            format={props.componentProps.dateFormat||"YYYY/MM/DD HH:mm:ss"}
            value={value}
            style={{width:"100%"}}
            onChange={(_,dateString)=>props.onChange(dateString)}
            onBlur={props.onBlur}
            {...props.componentProps}
        />
    </InputWraper>
}

function DateInput(props:WidgetProps){
    let value= null;
    if(props.value){
        if(!(props.value instanceof moment))
            value= moment(props.value);
    }
    return<InputWraper {...props}>
        <DatePicker
            key={props.schema.name}
            value={value}
            style={{width:"100%"}}
            onChange={(_,dateString)=>{props.onChange(dateString)}}
            onBlur={props.onBlur}
            {...props.componentProps}
        />
    </InputWraper>
}

function DateTimeRangeInput (props:WidgetProps){
    let value =props.value
    return <InputWraper {...props}>
        <RangePicker
            showTime={{ format: 'HH:mm:ss' }}
            style={{width:"100%"}}
            format={props.componentProps.dateFormat||"YYYY/MM/DD HH:mm:ss"}
            placeholder={['开始时间', '结束时间']}
            value={[(value&&value[0]&&moment(value[0]))||moment(),(value&&value[1]&&moment(value[1]))||moment()]}
            onChange={(_,dataStrings)=>{
                props.onChange(dataStrings);
            }}
            onBlur={props.onBlur}
            {...props.componentProps}
        />
    </InputWraper>
}


function NumberInput(props:WidgetProps){
    return <InputWraper {...props} >
        <InputNumber
            style={{width:"100%"}}
            id={props.schema.key}
            min={0}
            value={isNaN(parseFloat(props.value))?0:parseFloat(props.value)}
            onChange={(value)=>{
                if(isNaN(parseFloat(value as any))){
                    props.onChange(0)
                }else{
                    props.onChange(parseFloat(value as any) )
                }
            }} 
            onBlur={props.onBlur}
            {...props.componentProps}
        />
    </InputWraper>
}

const defaultAutoCompleteFilter = (input:string,element:any)=>{
    return typeof element.props.children === 'string' && element.props.children.includes(input)
}

const AutoCompleteDefault = function(props:WidgetProps){
    const {value,onChange,schema} = props;
    return <InputWraper {...props}>
        <ResolveMaybePromise maybePromise={schema.options}>
            {options=>{
                return <AutoComplete
                    dataSource={options?options.map(itm=>({value:itm.value,text:itm.name})):emptyArray}
                    style={{ width:"100%" }}
                    value={value}
                    filterOption={defaultAutoCompleteFilter}
                    onSelect={onChange}
                    onBlur={props.onBlur}
                    {...props.componentProps}
                />
            }}
        </ResolveMaybePromise>
    </InputWraper>
}


class FileInput extends React.Component<WidgetProps,any>{
    onChange=(info:any)=>{
        this.props.onChange((info.fileList as any[]).map(file=>{
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
        if(!this.props.schema.onFileChange){
            setTimeout(()=>{
                onProgress({percent:100});
                onSuccess(filename,null);
            },1)
        }else{
            this.props.schema.onFileChange(file).then(previewUrl=>{
                onProgress({percent:100});
                onSuccess(previewUrl,null);
            },(err)=>onError(err))
        }
    };
    render(){
        return <div style={{paddingLeft:"var(--schema-form-label-width)"}}>
            <div>
                <Upload
                    fileList={this.props.value||emptyArray}
                    multiple={true}
                    onChange={this.onChange}
                    customRequest={this.customRequest}
                    onBlur={this.props.onBlur}
                    {...this.props.componentProps}
                >
                    <Button>
                        <Icon type="upload" />
                        <span>{this.props.schema.label}</span>
                    </Button>
                </Upload>
            </div>
            <ErrorText>{this.props.meta.error}</ErrorText>
        </div>
    }
}

function SelectRadio (props:WidgetProps){
    return <InputWraper {...props}>
        <ResolveMaybePromise maybePromise={props.schema.options}>
            {options=><RadioGroup
                value={props.value}
                onChange={(v)=>props.onChange(v)}
                onBlur={props.onBlur}
                {...props.componentProps}
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
    </InputWraper>
}

function DateRangeInput (props:WidgetProps){
    const dateFormat = props.schema.dateFormat || 'YYYY/MM/DD';
    const value=props.value
    const from =value?value[0]:undefined;
    const to =value?value[1]:undefined;
    return <InputWraper {...props}>
        <RangePicker
            defaultValue={[from?moment(from,dateFormat):undefined, to?moment(to,dateFormat):undefined]}
            format={dateFormat}
            onChange={(_,dateStrings)=>{props.onChange(dateStrings)}}
            onBlur={props.onBlur}
            {...props.componentProps}
        />
    </InputWraper>
}


function TextareaInput (props:WidgetProps){
    return <InputWraper {...props}>
        <TextArea 
            value={props.value}
            onChange={(value)=>props.onChange(value)}
            onBlur={props.onBlur}
            autosize={{minRows:4,maxRows:8}} 
            {...props.componentProps}
        />
    </InputWraper>
}


class AutoCompleteAsync extends React.Component<WidgetProps,any>{
    pendingUpdate:any;
    fetchingQuery:any;
    $isMounted=false;
    componentDidMount(){
        this.$isMounted=true;
    }
    componentWillUnmount(){
        this.$isMounted=false;
    }
    componentWillReceiveProps(this:AutoCompleteAsync,nextProps:typeof this['props']){
        if(nextProps.value!==this.props.value)
            this.setState({
                searchText:this.findName(nextProps.value)
            })
    }
    findName(value:any){
        const entry = (this.state.dataSource as Options).find(x=>x.value === value);
        return entry?entry.name:value;
    }
    onUpdateInput=(name:string)=>{
        const throttle = this.props.schema.throttle || 400
        this.setState({
            searchText:name
        });
        if(this.pendingUpdate)
            clearTimeout(this.pendingUpdate);
        this.pendingUpdate = setTimeout(()=>{
            this.fetchingQuery = name;
            const result = (this.props.schema.options as RuntimeAsyncOptions)(name,this.props);
            // if(result instanceof Promise)
            result.then(options=>{
                if(this.fetchingQuery === name && this.$isMounted)
                    this.setState({
                        dataSource:options.map(itm=>({text:itm.name,value:itm.value}))
                    })
            });
            // else this.setState({
            //     dataSource:result.map(itm=>({text:itm.name,value:itm.value}))
            // })
        },throttle);
    };
    onSelected=(params:any)=>{
        this.props.onChange(params.value)
    };
    state={
        searchText:"",
        dataSource:emptyArray
    };
    render(){
        const {onChange,onBlur,componentProps} = this.props;
        return <InputWraper {...this.props}>
            <AutoComplete
                dataSource={this.state.dataSource}
                style={{width:"100%"}}
                onSelect={onChange}
                onSearch={this.onUpdateInput}
                onBlur={onBlur}
                filterOption={false}
                {...componentProps}
            />
        </InputWraper>
    }
}


class AutoCompleteText extends React.Component<WidgetProps,any>{
    onUpdateInput=(name:string)=>{
        const entry = (this.props.schema.options as Options).find(x=>x.name===name);
        return this.props.onChange(entry?entry.value:name);
    };
    render(){
        const {componentProps,onChange,onBlur,schema} = this.props;
        return <InputWraper {...this.props}>
            <AutoComplete
                dataSource={(schema.options as Options).map(itm=>({text:itm.name,value:itm.value}))}
                onSearch={this.onUpdateInput}
                onSelect={onChange}
                onBlur={onBlur}
                filterOption={defaultAutoCompleteFilter}
                {...componentProps}
            />
        </InputWraper>
    }
}

function GroupRenderer({form,schema,keyPath,componentProps}:WidgetProps){
    return <Collapse defaultActiveKey={["0"]} style={{marginBottom:15}} {...componentProps}>
        <Collapse.Panel key={"0"} header={schema.label}>
            {
                renderFields(form, schema.children || [], keyPath +"." + schema.key)
            }
        </Collapse.Panel>
    </Collapse>
}

function ArrayFieldRenderer(props:WidgetProps){
    return <FieldArray name={props.keyPath+"."+props.schema.key} form={props.form} value={props.value}>
        {(keys,add)=><>
            <label>{props.schema.label}</label>
            <Collapse activeKey={keys.map(x=>x.key)} style={{marginBottom:16,marginTop:16}}>
            {
                keys.map(({key,remove},index) => {
                    return <Collapse.Panel forceRender showArrow={false} key={key} header={<div>
                            {props.schema.label+" #"+(index+1)}
                            <div className="delete-button" onClick={e=>e.stopPropagation()}>
                                <Tooltip placement="topLeft" title="删除" arrowPointAtCenter>
                                    <Icon type="close" style={{cursor:"pointer",marginRight:8}} onClick={remove}/>
                                </Tooltip>
                            </div>
                        </div>}>
                        <div  className="array-field-child">
                            {
                                props.schema.children && renderFields(props.form,props.schema.children,key)
                            }
                        </div>
                    </Collapse.Panel>
                })
            }
            </Collapse>
            <div className="add-button">
                <Tooltip placement="topLeft" title="添加" arrowPointAtCenter>
                    <Button icon="plus" onClick={add}/>
                </Tooltip>
            </div>
        </>}
    </FieldArray>
}

addType("group",GroupRenderer)

addType('text',TextInput);
addType('select',SelectInput);

addType('radio',SelectRadio)

addType('checkbox',CheckboxInput);

addType('date',DateInput);

addType('autocomplete-text',AutoCompleteText);

addType('datetime',DateTimeInput);

addType('datetimeRange',DateTimeRangeInput);

addType('number',NumberInput);

addType('autocomplete',AutoCompleteDefault);

addType("file",FileInput);

addType("dateRange",DateRangeInput);

addType("textarea",TextareaInput);


addType("password",TextInput);
addType("email",TextInput);
addType('text',TextInput);

addType("array",ArrayFieldRenderer);

addType("autocomplete-async",AutoCompleteAsync);

setButton(props=>{
    return <div style={{textAlign:"center",float:"left",margin:15,width:"100%"}}>
        <Button.Group>
            <Button
                style={{
                    backgroundColor: "transparent",
                }}
                onClick={props.onReset}
                disabled={props.disabled}
                type={"default"}
                htmlType={'reset'}
            >
                重置
            </Button>
            <Button
                className="raised-button"
                onClick={props.onSubmit}
                icon={props.submitSucceeded?"check":undefined}
                disabled={props.disabled}
                type={'primary'}
                loading={props.submitting}
                htmlType={'submit'}
            >
                提交
            </Button>
        </Button.Group>
    </div>
})