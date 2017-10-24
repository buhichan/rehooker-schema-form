/**
 * Created by buhi on 2017/4/28.
 */
import * as React from "react"
import {RuntimeAsyncOptions, AsyncOptions, Options, setButton} from "./form"
import {
    TextField, TimePicker, MenuItem, Checkbox, DatePicker, RaisedButton, FlatButton, Paper, AutoComplete,
    IconButton, Subheader
} from "material-ui"
import muiThemeable from "material-ui/styles/muiThemeable";
import Add from "material-ui/svg-icons/content/add";
import Remove from "material-ui/svg-icons/content/remove";
import {MuiTheme} from "material-ui/styles";
import {stylesheet} from "./material.jss";
import {WrappedFieldArrayProps} from "redux-form/lib/FieldArray";
import {ContentClear} from "material-ui/svg-icons";
import {SyntheticEvent} from "react";
import {addType, addTypeWithWrapper, preRenderField, WidgetProps} from "./field";
import injectCSS from 'react-jss';
import {Field as RFField,FieldArray as RFFieldArray} from "redux-form";
import SelectField from "material-ui/SelectField"
import {renderFields} from "./render-fields";
import {default as RadioButton, RadioButtonGroup} from "material-ui/RadioButton";
import CircularProgress from "material-ui/CircularProgress";

function NumberInput(props:WidgetProps){
    return <TextField
        {...props.input as any}
        type="number"
        errorText={props.meta.error}
        id={props.input.name}
        className="full-width"
        disabled={props.disabled}
        style={{width:"100%"}}
        floatingLabelText={props.fieldSchema.label}
        value={Number(props.input.value)}
        hintText={props.fieldSchema.placeholder}
        onChange={(e)=>props.input.onChange(Number(e.target['value']))}
    />;
}

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

function formatDateTime(date:Date){
    return date.toLocaleString([navigator&&navigator.language||"zh-CN"],defaultDateTimeInputFormat).replace(/\//g,'-')
}

function formatDate(date:Date){
    return date.toLocaleString([navigator&&navigator.language||"zh-CN"],defaultDateInputFormat).replace(/\//g,'-')
}
function DateTimeInput(props:WidgetProps){
    const {meta,input,fieldSchema} = props;
    let value = input.value?
            new Date(input.value):
            undefined;
    if(value && !isFinite(value.getTime()))
        value = undefined;
    return <div>
        <div style={{width:"50%",display:"inline-block"}}>
            <DatePicker
                id={fieldSchema.key+"date"}
                DateTimeFormat={Intl.DateTimeFormat as any}
                value={value}
                fullWidth
                onChange={(e,date)=>{
                    if(value) {
                        date.setHours(value.getHours());
                        date.setMinutes(value.getMinutes());
                        date.setSeconds(value.getSeconds());
                    }
                    input.onChange(formatDateTime(date))
                }}
                floatingLabelText={fieldSchema.label}
                errorText={meta.error}
                hintText={fieldSchema.placeholder}
                cancelLabel="取消"
                locale="zh-Hans"
                autoOk
            />
        </div>
        <div style={{width:"50%",display:"inline-block"}}>
            <TimePicker
                id={fieldSchema.key+"time"}
                value={value}
                fullWidth
                autoOk
                cancelLabel="取消"
                underlineStyle={{bottom:10}}
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
}

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
        const parsedDate = Date.parse(props.input.value);

        if (isNaN(props.input.value) && !isNaN(parsedDate)) {
            DatePickerProps['value'] = new Date(props.input.value);
        }

        return <DatePicker
            DateTimeFormat={Intl.DateTimeFormat as any}
            locale="zh-CN"
            errorText={props.meta.error}
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
    rest['label']=props.fieldSchema.label;
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
export class SelectInput extends React.PureComponent<WidgetProps,any>{
    state={
        options:null
    };
    reload(props:WidgetProps){
        const rawOptions =  props.fieldSchema.options;
        if(typeof rawOptions=== 'function'){
            if(!rawOptions.length)
                (rawOptions as AsyncOptions)().then(options=>this.setState({
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
    componentWillMount(){
        this.reload(this.props);
    }
    render() {
        const props = this.props;
        return <SelectField
                {...props.input as any}
                onBlur={()=>props.input.onBlur(props.input.value)}
                id={props.input.name}
                disabled={props.disabled}
                floatingLabelText={props.fieldSchema.label}
                fullWidth={true}
                errorText={props.meta.error}
                hintText={props.fieldSchema.placeholder}
                multiple={props.fieldSchema.multiple}
                onChange={(e, i, v) => {
                    e.target['value'] = v;
                    props.input.onChange(e);
                }}
            >
            {
                this.state.options?this.state.options.map((option) => (
                    <MenuItem className="option" key={option.value} value={option.value} primaryText={option.name}/>
                )):<MenuItem className="option" value={null} primaryText={this.props.fieldSchema.loadingText||"载入中"}/>
            }
        </SelectField>
    }
}

const dataSourceConfig = {text:"name",value:"value"};

@injectCSS({
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
})
class BaseAutoComplete extends React.PureComponent<{fieldSchema,filter?,loading?, fullResult?,input,meta,openOnFocus?,searchText,dataSource,onNewRequest?,onUpdateInput?,classes?},any>{
    render() {
        const {fieldSchema, input, meta, fullResult, filter,openOnFocus,loading, searchText, dataSource, onNewRequest, onUpdateInput,classes} = this.props;
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
                searchText={String(searchText)}
                onNewRequest={onNewRequest}
                onUpdateInput={onUpdateInput}
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
                    onClick={() => input.onChange(fieldSchema.defaultValue || null)}
                >
                    <ContentClear />
                </IconButton> : null
            }
        </div>
    }
}

class AutoCompleteSelect extends SelectInput{
    onNewRequest=(value)=>{
        return this.props.input.onChange(value['value']);
    };
    render() {
        const {meta,input,fieldSchema} = this.props;
        const options = (this.state.options || []) as Options;
        const value = options.find(x=>x.value === input.value);
        return <BaseAutoComplete
            fieldSchema={fieldSchema}
            input={input}
            meta={meta}
            openOnFocus
            fullResult={fieldSchema.fullResult}
            searchText={value?value.name:""}
            dataSource={options}
            onNewRequest={this.onNewRequest}
        />
    }
}

class AutoCompleteText extends SelectInput{
    onUpdateInput=name=>{
        const options = (this.state.options || []) as Options;
        const entry = options.find(x=>x.name===name);
        return this.props.input.onChange(entry?entry.value:name);
    };
    render() {
        const {meta,input,fieldSchema} = this.props;
        const options = (this.state.options || []) as Options;
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
    componentWillReceiveProps(nextProps){
        if(nextProps.input.value!==this.props.input.value)
            this.setState({
                searchText:this.findName(nextProps.input.value)
            })
    }
    findName(value){
        if(value === "" || value === undefined)
            return this.state.searchText;
        const entry = (this.state.dataSource as Options).find(x=>x.value === value);
        return entry?entry.name:value;
    }
    onUpdateInput=(name,dataSource,params?)=>{
        if(!params||params.source !== 'change')
            return;
        const throttle = this.props.fieldSchema['throttle']||400;
        this.setState({
            searchText:name,
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
        searchText:"",
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
            searchText={this.findName(input.value)}
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
        return <div className="clearfix array-field-container">
            {
                props.fields.map((name, i) => {
                    const childValue = props.fields.get(i);
                    let children = props.fieldSchema.children;
                    if(props.fieldSchema.getChildren)
                        children = props.fieldSchema.getChildren(childValue).filter(x=>x);
                    return <div key={i} className="array-field-child">
                        <div className="delete-button">
                            <IconButton
                                style={{minWidth: '30px', height: "30px", color: props.muiTheme.palette.accent1Color}}
                                onClick={() => props.fields.remove(i)}
                                tooltip="删除"
                            >
                                <Remove hoverColor={muiTheme.palette.accent1Color}/>
                            </IconButton>
                        </div>
                        {
                            renderFields(props.meta.form,children,props.keyPath+"["+i+"]")
                        }
                    </div>
                })
            }
            <div className="add-button">
                <IconButton
                    tooltip="添加" onClick={() => props.fields.push(props.fieldSchema.defaultValue?props.fieldSchema.defaultValue:{})}
                >
                    <Add hoverColor={muiTheme.palette.primary1Color}/>
                </IconButton>
            </div>
        </div>
    }
}

function TextAreaInput(props:WidgetProps){
    return <TextField
        {...props.input as any}
        errorText={props.meta.error}
        required={props.required}
        type={props.type}
        id={props.input.name}
        className="full-width"
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
        filename:this.props.fieldSchema.label,
        uploading:false
    };
    onChange=(e:SyntheticEvent<HTMLInputElement>)=>{
        const file = (e.target as HTMLInputElement).files[0];
        if(!this.props.fieldSchema.onFileChange){
            this.setState({
                filename:file.name.length>15?("..."+file.name.slice(-12)):file.name
            });
            this.props.input.onChange(file);
        }else{
            this.setState({
                filename:"上传中",
                uploading:true
            });
            this.props.fieldSchema.onFileChange(file).then((url)=>{
                this.props.input.onChange(url);
                this.setState({
                    filename:file.name.length>15?("..."+file.name.slice(-12)):file.name,
                    uploading:false
                });
            }).catch((e)=>{
                this.setState({
                    filename:"上传出错",
                    uploading:false
                })
            });
        }
    };
    render(){
        const {meta,muiTheme} = this.props;
        const hasError = Boolean(meta.error);
        return <RaisedButton
            backgroundColor={hasError?muiTheme.textField.errorColor:muiTheme.palette.primary1Color}
            style={{marginTop:28}}
            disabled={this.state.uploading}
            label={meta.error||this.state.filename}
            labelColor={"#FFFFFF"}
            containerElement="label"
            labelStyle={{
                whiteSpace:"nowrap",
                textOverflow:"ellipsis",
                overflow:"hidden"
            }}
        >
            <input type="file" style={{display:"none"}} onChange={this.onChange} />
        </RaisedButton>
    }
}

@addType("radio")
class SelectRadio extends SelectInput{
    render(){
        const props = this.props;
        return <div>
            <Subheader style={{paddingLeft:0}}>
                {props.fieldSchema.label}
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
                    this.state.options?this.state.options.map((option) => (
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

const formModule = require('../index');
const JSSForm = formModule.ReduxSchemaForm;
formModule.ReduxSchemaForm =muiThemeable()
(injectCSS(stylesheet)(
    ({classes,sheet,...props})=>{
        return <div className={classes.form}>
            <JSSForm {...props} />
        </div>;
    }));