/**
 * Created by buhi on 2017/4/28.
 */
import NavigationArrowDownward from 'material-ui/svg-icons/navigation/arrow-downward';
import NavigationArrowUpward from 'material-ui/svg-icons/navigation/arrow-upward';
import FileFileUpload from 'material-ui/svg-icons/file/file-upload';
import FileFileDownload from 'material-ui/svg-icons/file/file-download';
import ContentClear from 'material-ui/svg-icons/content/clear';
import * as React from 'react';
import {RuntimeAsyncOptions, AsyncOptions, Options} from "../form"
import {
    TextField, TimePicker, MenuItem, Checkbox, DatePicker, RaisedButton, FlatButton, Paper, AutoComplete,
    IconButton, Subheader, Chip
} from "material-ui"
import muiThemeable from "material-ui/styles/muiThemeable";
import Add from "material-ui/svg-icons/content/add";
import Remove from "material-ui/svg-icons/content/remove";
import {MuiTheme} from "material-ui/styles";
import {WrappedFieldArrayProps} from "redux-form/lib/FieldArray";
import {SyntheticEvent} from "react";
import {addType, addTypeWithWrapper, preRenderField, WidgetProps} from "../field";
import injectCSS from 'react-jss';
import {Field as RFField,FieldArray as RFFieldArray} from "redux-form";
import SelectField from "material-ui/SelectField"
import {renderFields} from "../render-fields";
import {default as RadioButton, RadioButtonGroup} from "material-ui/RadioButton";
import CircularProgress from "material-ui/CircularProgress";
import { setButton } from "../buttons";
import { requestFileUpload, requestDownload } from '../utils';
const moment = require("moment")

const errorTextAsHintTextStyle = (muiTheme:MuiTheme)=>({
    color:muiTheme.textField.hintColor
})

const NumberInput = muiThemeable()(function NumberInput(props:WidgetProps&{muiTheme:MuiTheme}){
    return <TextField
        {...props.input as any}
        type="number"
        id={props.input.name}
        className="full-width"
        disabled={props.disabled}
        style={{width:"100%"}}
        floatingLabelText={props.fieldSchema.label}
        floatingLabelStyle={props.meta.error?undefined:errorTextAsHintTextStyle(props.muiTheme)}
        value={Number(props.input.value)}
        errorText={props.meta.error||props.fieldSchema.placeholder}
        errorStyle={props.meta.error?undefined:errorTextAsHintTextStyle(props.muiTheme)}
        onChange={(e)=>props.input.onChange(Number(e.target['value']))}
    />
})

const defaultDateInputFormat = {year:"numeric",month:"2-digit",day:"2-digit"}

const defaultDateTimeInputFormat = {
    year:"numeric",
    day:"2-digit",
    month:"2-digit",
    hour12:false,
    hour:"2-digit",
    minute:"2-digit",
    second:"2-digit"
};

const GenericPlaceHolder = ({placeholder})=><small style={{marginLeft:5,opacity:0.5}}>{placeholder}</small>

function formatDateTime(date:Date){
    //return date.toLocaleString([navigator&&navigator.language||"zh-CN"],defaultDateTimeInputFormat).replace(/\//g,'-')
    return moment(date).format("YYYY-MM-DD HH:mm:ss")
}

function formatDate(date:Date){
    //return date.toLocaleString([navigator&&navigator.language||"zh-CN"],defaultDateInputFormat).replace(/\//g,'-')
    return moment(date).format("YYYY-MM-DD")
}

const timePickerStyle:React.CSSProperties = {top:24,position:"absolute"}
const timePickerInputStyle:React.CSSProperties = {top:2}

const DateTimeInput = muiThemeable()(function DateTimeInput(props:WidgetProps&{muiTheme:MuiTheme}){
    const {meta,input,fieldSchema} = props;
    let value = input.value?
            moment(input.value):
            undefined;
    if(!value || !value.isValid())
        value = undefined;
    else 
        value = value.toDate()
    return <div style={{position:"relative"}}>
        <div style={{width:"50%",display:"inline-block"}}>
            <DatePicker
                id={fieldSchema.key+"-date"}
                DateTimeFormat={Intl.DateTimeFormat as any}
                value={value}
                fullWidth
                errorText={meta.error||fieldSchema.placeholder}
                errorStyle={meta.error?undefined:errorTextAsHintTextStyle(props.muiTheme)}
                onChange={(e,date)=>{
                    if(value) {
                        date.setHours(value.getHours());
                        date.setMinutes(value.getMinutes());
                        date.setSeconds(value.getSeconds());
                    }
                    input.onChange(formatDateTime(date))
                }}
                floatingLabelText={fieldSchema.label}
                cancelLabel="取消"
                locale="zh-Hans"
                autoOk
            />
        </div>
        <div style={{width:"50%",display:"inline-block"}}>
            <TimePicker
                id={fieldSchema.key+"-time"}
                value={value}
                fullWidth
                autoOk
                style={timePickerStyle}
                inputStyle={timePickerInputStyle}
                errorText={fieldSchema.placeholder?" ":undefined}
                errorStyle={meta.error?undefined:errorTextAsHintTextStyle(props.muiTheme)}
                cancelLabel="取消"
                format="24hr"
                onChange={(_,time:Date)=>{
                    const newValue = value?new Date(value):new Date();
                    newValue.setHours(time.getHours());
                    newValue.setMinutes(time.getMinutes());
                    newValue.setSeconds(time.getSeconds());
                    input.onChange(formatDateTime(newValue))
                }}
            />
        </div>
    </div>
})

@muiThemeable()
class DateInput extends React.PureComponent<WidgetProps>{
    datepicker;
    onFocus=(e:React.SyntheticEvent<any>)=>{
        if (e.target !== null) {
            this.datepicker.openDialog();
        }
    };
    render() {
        const props = this.props;
        const DatePickerProps = {
            onChange: (e, value) => {
                return props.input.onChange(formatDate(value));
            }
        };
        const parsedDate = moment(props.input.value);

        if (parsedDate.isValid()) {
            DatePickerProps['value'] = parsedDate.toDate()
        }

        return <DatePicker
            DateTimeFormat={Intl.DateTimeFormat as any}
            locale="zh-CN"
            errorText={props.meta.error||props.fieldSchema.placeholder}
            errorStyle={props.meta.error?undefined:errorTextAsHintTextStyle(props.muiTheme)}
            floatingLabelText={props.fieldSchema.label}
            autoOk={true}
            id={props.input.name}
            container="inline"
            mode="portrait"
            cancelLabel="取消"
            fullWidth={true}
            onFocus={this.onFocus}
            okLabel="确认"
            ref={ref=>this.datepicker=ref}
            {...DatePickerProps}
            hintText={props.fieldSchema.placeholder}
            disabled={props.disabled}/>
    }
}

function TextInput(props:WidgetProps){
    return <TextField
        {...props.input as any}
        value={props.input.value||""}
        errorText={props.meta.error}
        required={props.required}
        type={props.fieldSchema.type}
        id={props.input.name}
        className="full-width"
        style={{width:"100%"}}
        disabled={props.disabled}
        hintText={props.fieldSchema.placeholder}
        multiLine={props.fieldSchema.multiLine}
        floatingLabelText={props.fieldSchema.label}/>;
}
function CheckboxInput (props:WidgetProps){
    const {onChange,onBlur,value,...rest} = props.input;
    rest['label']=<span>
        {props.fieldSchema.label}
        <GenericPlaceHolder placeholder={props.fieldSchema.placeholder} />
    </span>;
    return <Checkbox
        {...rest as any}
        onBlur={e=>onBlur(value)}
        style={{width:"100%",margin:"32px 0 16px"}}
        disabled={props.disabled}
        onChange={undefined}
        onCheck={(e,v)=>onChange(v)}
        checked={Boolean(value)}
    />
}

//fixme: todo: https://github.com/callemall/material-ui/issues/6080
export function resolvefieldSchemaOptions(Component){
    return class OptionsResolver extends React.PureComponent<WidgetProps,any>{
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
        render() {
            return <Component
                {...this.props}
                options={this.state.options}
            />
        }
    } as any
}

const SelectInput = muiThemeable()(resolvefieldSchemaOptions((props:WidgetProps&{options:Options,muiTheme:MuiTheme})=>{
    const {input,fieldSchema,meta,options,muiTheme} = props;
    return <SelectField
        {...input as any}
        onBlur={()=>input.onBlur(input.value)}
        id={input.name}
        disabled={fieldSchema.disabled}
        floatingLabelText={fieldSchema.label}
        fullWidth={true}
        errorText={meta.error}
        floatingLabelFixed={!!fieldSchema.placeholder}
        hintText={fieldSchema.placeholder}
        multiple={fieldSchema.multiple}
        onChange={(e, i, v) => {
            e.target['value'] = v;
            input.onChange(e);
        }}
    >
    {
        options?options.map((option) => (
            <MenuItem className="option" key={option.value} value={option.value} primaryText={option.name}/>
        )):<MenuItem className="option" value={null} primaryText={fieldSchema.loadingText||"载入中"}/>
    }
    </SelectField>
}))

const dataSourceConfig = {text:"name",value:"value"};

const BaseAutoComplete = injectCSS({
    autocomplete:{
        position:"relative",
        "&:hover": {
            "&>$clearButton": {
                opacity: 1
            }
        }
    },
    "clearButton":{
        position:"absolute",
        top:20,
        right:0,
        opacity:0,
    }
})(
    class BaseAutoComplete extends React.PureComponent<{fieldSchema, onClear, input, meta, fullResult, filter,openOnFocus,loading, searchText, dataSource, onNewRequest, onUpdateInput,classes},any>{
        state={
            searchText:this.props.searchText
        }
        componentWillReceiveProps(nextProps){
            /**
             * 这里不能直接接受searchText,因为searchText是由我来保存的,我这里只需要reinitialize
             */
            if(nextProps.searchText!==this.props.searchText)
                this.setState({
                    searchText:nextProps.searchText
                })
        }
        onUpdateInput=((name,datasource,params)=>{
            this.setState({
                searchText:name
            })
            this.props.onUpdateInput && this.props.onUpdateInput(name,datasource,params)
        }) as any
        render(){
            const {classes,fieldSchema,fullResult,openOnFocus,meta,filter,dataSource,onNewRequest,onUpdateInput,input,loading,} = this.props;
            return <div className={classes.autocomplete}>
                <AutoComplete
                    id={fieldSchema.name}
                    maxSearchResults={fullResult ? undefined : 5}
                    menuStyle={fullResult ? {maxHeight: "300px", overflowY: 'auto'} : undefined}
                    fullWidth={true}
                    openOnFocus={openOnFocus}
                    hintText={fieldSchema.placeholder}
                    errorText={meta.error}
                    filter={filter||AutoComplete.fuzzyFilter}
                    dataSource={dataSource}
                    dataSourceConfig={dataSourceConfig}
                    floatingLabelText={fieldSchema.label}
                    searchText={this.state.searchText}
                    onNewRequest={onNewRequest}
                    onUpdateInput={this.onUpdateInput}
                />
                {
                    loading?<CircularProgress size={30} style={{
                        position:"absolute",
                        top:22,
                        right:18
                    }} />
                    :input.value!==null&&input.value!==undefined&&input.value!=="" ? <IconButton
                        style={{position:"absolute"}}
                        className={classes.clearButton}
                        onClick={() => {
                            input.onChange(fieldSchema.defaultValue || null);
                            this.setState({
                                searchText:""
                            })
                        }}                
                    >
                        <ContentClear />
                    </IconButton> : null
                }
            </div>
        }
    }

)

@resolvefieldSchemaOptions
class AutoCompleteSelect extends React.PureComponent<WidgetProps,any>{
    onNewRequest=(value)=>{
        return this.props.input.onChange(value['value']);
    };
    render() {
        const {meta,input,fieldSchema} = this.props;
        const options = (this.props.options || []) as Options;
        const value = options.find(x=>x.value === input.value);
        return <BaseAutoComplete
            fieldSchema={fieldSchema}
            input={input}
            meta={meta}
            openOnFocus
            fullResult={fieldSchema.fullResult}
            searchText={value?value.name:input.value||""}
            dataSource={options}
            onNewRequest={this.onNewRequest}
        />
    }
}

@resolvefieldSchemaOptions
class AutoCompleteText extends React.PureComponent<WidgetProps,any>{
    onUpdateInput=name=>{
        const options = (this.props.options || []) as Options;
        const entry = options.find(x=>x.name===name);
        return this.props.input.onChange(entry?entry.value:name);
    };
    render() {
        const {meta,input,fieldSchema} = this.props;
        const options = (this.props.options || []) as Options;
        return <BaseAutoComplete
            input={input}
            meta={meta}
            fieldSchema={fieldSchema}
            fullResult={fieldSchema.fullResult}
            dataSource={options}
            searchText={input.value}
            onUpdateInput={this.onUpdateInput}
        />;
    }
}

class AutoCompleteAsync extends React.PureComponent<WidgetProps,any>{
    pendingUpdate;
    fetchingQuery;
    $isMounted;
    componentWillMount(){
        this.$isMounted=true;
    }
    componentWillUnmount(){
        this.$isMounted=false;
    }
    findInitialSearchText(value,showValueWhenNoEntryIsFound){
        if(value === "" || value === undefined || value === null)
            return "";
        const entry = (this.state.dataSource as Options).find(x=>x.value === value);
        return entry?entry.name:showValueWhenNoEntryIsFound?value:"";
    }
    onUpdateInput=(name,dataSource,params?)=>{
        if(!params||params.source !== 'change')
            return;
        const throttle = this.props.fieldSchema.throttle||400;
        this.setState({
            loading:true,
            dataSource:[]
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
                            dataSource:options,
                            loading:false
                        })
                },(e)=>{
                    this.setState({
                        loading: false
                    });
                    throw e;
                });
            else this.setState({
                dataSource:result,
                loading:false
            })
        },throttle);
    };
    onSelected=({value})=>{
        this.props.input.onChange(value)
    };
    state={
        loading:false,
        dataSource:[]
    };
    render() {
        const {meta,input,fieldSchema} = this.props;
        return <BaseAutoComplete
            input={input}
            meta={meta}
            fullResult
            loading={this.state.loading}
            filter={AutoComplete.noFilter}
            fieldSchema={fieldSchema}
            dataSource={this.state.dataSource}
            searchText={this.findInitialSearchText(input.value,fieldSchema.showValueWhenNoEntryIsFound)}
            onUpdateInput={this.onUpdateInput}
            onNewRequest={this.onSelected}
        />;
    }
}


/**
 * 这个组件比较复杂,必须考虑
 * getChildren存在的情况
 * update: 不必了,以后就没有getChildren了,统一用listens
 */
@muiThemeable()
class ArrayFieldRenderer extends React.Component<WrappedFieldArrayProps<any>&WidgetProps,any>{
    render() {
        const props = this.props;
        const muiTheme: MuiTheme = props.muiTheme;
        const fields = props.fields
        let {
            children,
            getChildren,
            itemsPerRow = 2,
            disableCreate,
            disableDelete,
            disableSort
        } = props.fieldSchema
        return <div className="clearfix array-field-container">
            {
                fields.map((name, i) => {
                    const childValue = props.fields.get(i);
                    const meta = props.meta
                    const keyPath = props.keyPath
                    if(getChildren)
                        children = getChildren(childValue).filter(x=>x);
                    return <div key={i} className="array-field-child" style={{width:`calc(${100/itemsPerRow}% - 20px)`}}>
                        <div className="item-buttons">
                            {i===0||disableSort?null:<IconButton
                                style={{minWidth: '30px', height: "30px", color: muiTheme.palette.accent1Color}}
                                onClick={() => fields.swap(i,i-1)}
                                tooltip="前移"
                            >
                                <NavigationArrowUpward hoverColor={muiTheme.palette.accent1Color}/>
                            </IconButton>}
                            {i>=fields.length-1||disableSort?null:<IconButton
                                style={{minWidth: '30px', height: "30px", color: muiTheme.palette.accent1Color}}
                                onClick={() => fields.swap(i,i+1)}
                                tooltip="后移"
                            >
                                <NavigationArrowDownward hoverColor={muiTheme.palette.accent1Color}/>
                            </IconButton>}
                            {disableDelete?null:<IconButton
                                style={{minWidth: '30px', height: "30px", color: muiTheme.palette.accent1Color}}
                                onClick={() => fields.remove(i)}
                                tooltip="删除"
                            >
                                <Remove hoverColor={muiTheme.palette.accent1Color}/>
                            </IconButton>}
                        </div>
                        {
                            renderFields(meta.form,children,keyPath+"["+i+"]")
                        }
                    </div>
                })
            }
            {disableCreate?null:<div className="add-button">
                <IconButton
                    tooltip="添加" onClick={() => props.fields.push(props.fieldSchema.defaultValue?props.fieldSchema.defaultValue:{})}
                >
                    <Add hoverColor={muiTheme.palette.primary1Color}/>
                </IconButton>
            </div>}
        </div>
    }
}

function TextAreaInput(props:WidgetProps){
    return <TextField
        {...props.input as any}
        value={props.input.value||""}
        errorText={props.meta.error}
        required={props.required}
        type={props.type}
        id={props.input.name}
        className="full-width"
        hintText={props.fieldSchema.placeholder}
        style={{width:"100%"}}
        disabled={props.disabled}
        multiLine
        floatingLabelText={props.fieldSchema.label}/>;
}

@muiThemeable()
class FileInput extends React.PureComponent<WidgetProps&{
    muiTheme:MuiTheme
},any>{
    state={
        files:[] as File[],
        uploading:false
    };
    onRequest=()=>{
        requestFileUpload(this.props.fieldSchema as any).then(({files,clear})=>{
            this.setState({
                files,
            });
            if(!this.props.fieldSchema.onFileChange){
                this.props.input.onChange(files);
            }else{
                this.setState({
                    uploading:true
                });
                this.props.input.onChange(new Array().fill(files.length));
                return Promise.all(files.map(this.props.fieldSchema.onFileChange)).then((res)=>{
                    let url
                    if(!this.props.fieldSchema.multiple)
                        url = res[0]
                    else
                        url = res
                    this.props.input.onChange(url);
                    this.setState({
                        uploading:false
                    });
                })
            }
        }).catch(e=>{
            this.setState({
                uploading:false
            })
            throw e
        })
    };
    render(){
        const {input,meta,muiTheme,fieldSchema} = this.props;
        const {files} = this.state
        const hasError = Boolean(meta.error);
        const filePaths = input.value instanceof Array? input.value : input.value? [input.value] : []
        return <div className="file-input">
            <div className="label">
                <RaisedButton
                    primary
                    style={{marginRight:10}}
                    disabled={this.state.uploading}
                    onClick={this.onRequest}
                    icon={<FileFileUpload />}
                    label={fieldSchema.label}
                />
                <label style={{transform:'scale(0.6)',color:"#cc3333",marginRight:10}}>{meta.error}</label>
            </div>
            <div style={{position:'relative',verticalAlign:"middle",display:"inline-block"}} >
                {
                    filePaths.map((path,i)=>{
                        const file = files[i]
                        let filename = file?file.name:null
                        if(!filename && path){
                            const chunks = path.split('/')
                            filename = chunks[chunks.length-1]
                        }
                        return <FlatButton
                            style={{margin:"5px"}} 
                            key={i} 
                            onClick={()=>{
                                if(!path)
                                    return
                                requestDownload({
                                    href:fieldSchema.downloadPathPrefix||""+path,
                                    download:filename
                                })
                            }} 
                            icon={path?<FileFileDownload />:null}
                            label={filename}
                        />
                    })
                }
            </div>
        </div>
    }
}

@addType("radio")
@resolvefieldSchemaOptions
class SelectRadio extends React.PureComponent<WidgetProps,any>{
    render(){
        const props = this.props;
        return <div>
            <Subheader style={{paddingLeft:0}}>
                {props.fieldSchema.label}
                <GenericPlaceHolder placeholder={props.fieldSchema.placeholder} />
            </Subheader>
            <RadioButtonGroup
                {...props.input as any}
                valueSelected={props.input.value}
                onBlur={()=>props.input.onBlur(props.input.value)}
                id={props.input.name}
                name={props.input.name}
                disabled={props.disabled}
                floatingLabelText={props.fieldSchema.label}
                fullWidth={true}
                errorText={props.meta.error}
                hintText={props.fieldSchema.placeholder}
                multiple={props.fieldSchema.multiple}
                style={{
                    display:'flex',
                    flexWrap:"wrap"
                }}
                onChange={(e,v)=>props.input.onChange(v)}
            >
                {
                    this.props.options?this.props.options.map((option) => (
                        <RadioButton style={{
                            width:"auto",
                            flex:1,
                            whiteSpace:"nowrap",
                            margin:"0 15px 0 0"
                        }} key={option.value} value={option.value} label={option.name}/>
                    )):<RadioButton key={"...loading"} value={""} disabled label={"载入中"}/>
                }
            </RadioButtonGroup>
        </div>
    }
}

addType("password",TextInput);
addType("email",TextInput);
addType('text',TextInput);
addType('textarea',TextAreaInput);
addType("file",FileInput);
addType('number',NumberInput);
addType('checkbox',CheckboxInput);
addType('select',SelectInput);
addType('autocomplete',AutoCompleteSelect);
addType('autocomplete-text',AutoCompleteText);
addType("autocomplete-async",AutoCompleteAsync);
addType('date',DateInput);
addType('datetime',DateTimeInput);
addTypeWithWrapper("array",(props)=>{
    return <div>
        <label className="control-label">{props.fieldSchema.label}</label>
        <FieldArray name={props.keyPath} rerenderOnEveryChange={Boolean(props.fieldSchema.getChildren)} component={ArrayFieldRenderer} props={props}/>
    </div>
});

const Field = RFField as new()=>RFField<any>;
const FieldArray = RFFieldArray as new()=>RFFieldArray<any>;

setButton(muiThemeable()(function(props:any){
    switch (props.type) {
        case 'submit':
            return <RaisedButton
                className="raised-button"
                primary
                label={props.children}
                labelStyle={{padding: "0"}}
                style={{margin: "15px"}}
                onClick={props.onClick}
                disabled={props.disabled}
                type={props.type}
            />;
        default:
            return <RaisedButton
                backgroundColor="transparent"
                style={{
                    backgroundColor: "transparent",
                    margin: "15px"
                }}
                buttonStyle={{
                    border: props.disabled ? "none" : "1px solid " + props.muiTheme.palette.primary1Color
                }}
                labelColor={props.muiTheme.palette.primary1Color}
                label={props.children}
                labelStyle={{padding: "0"}}
                onClick={props.onClick}
                disabled={props.disabled}
                type={props.type}
            />
    }
}) as any);