/**
 * Created by buhi on 2017/4/28.
 */
import * as React from "react"
import {addType, CustomWidgetProps, setButton} from "./form"
import {TextField,SelectField,MenuItem,Checkbox,DatePicker,RaisedButton,FlatButton,Paper,AutoComplete,IconButton} from "material-ui"
import muiThemeable from "material-ui/styles/muiThemeable";

import Add from "material-ui/svg-icons/content/add";
import Remove from "material-ui/svg-icons/content/remove";
import {MuiTheme} from "material-ui/styles";
import {stylesheet} from "./material.jss";
import {BaseFieldArrayProps} from "redux-form";
import {WrappedFieldArrayProps} from "@types/redux-form/lib/FieldArray";

let {Field,FieldArray} =require("redux-form");

function NumberInput(props:CustomWidgetProps){
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
        onChange={(e)=>props.input.onChange(Number(e.target['value']))}
    />;
}

function DateInput(props:CustomWidgetProps){
    const DatePickerProps = {
        onChange:(e,value)=>{
            return props.input.onChange(value.toLocaleDateString().replace(/\//g,'-'));
        }
    };
    const parsedDate = Date.parse(props.input.value);

    if (isNaN(props.input.value) && !isNaN(parsedDate)) {
        DatePickerProps['value']=new Date(props.input.value);
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
        okLabel="确认"
        {...DatePickerProps}
        disabled={props.disabled}/>
}

function TextInput(props:CustomWidgetProps){
    return <TextField
        {...props.input as any}
        errorText={props.meta.error}
        required={props.required}
        type={props.type}
        id={props.input.name}
        className="full-width"
        style={{width:"100%"}}
        disabled={props.disabled}
        multiLine={props.fieldSchema.multiLine}
        floatingLabelText={props.fieldSchema.label}/>;
}
class CheckboxInput extends React.Component<CustomWidgetProps,any>{
    componentWillMount(){
        this.props.input.onChange(this.props.input.value);
    }
    render() {
        return <Checkbox
            {...this.props.input}
            id={this.props.input.name}
            style={{width:"100%",margin:"32px 0 16px"}}
            disabled={this.props.disabled}
            onChange={undefined}
            onCheck={this.props.input.onChange}
            label={this.props.fieldSchema.label}
            value={this.props.input.value}
        />
    }
}

function SelectInput(props:CustomWidgetProps){
    return <SelectField
        {...props.input as any}
        id={props.input.name}
        disabled={props.disabled}
        floatingLabelText={props.fieldSchema.label}
        fullWidth={true}
        errorText={props.meta.error}
        multiple={props.fieldSchema.multiple}
        onChange={(e,i,v)=>{
            e.target.value = v;
            props.input.onChange(e)
        }}
    >
        {
            props.fieldSchema.options.map((option)=><MenuItem className="option" key={option.value} value={option.value} primaryText={option.name} />)
        }
    </SelectField>;
}

class AutoCompleteSelect extends React.Component<CustomWidgetProps,any>{
    componentDidUpdate() {
        this.ac.focus()
    }
    static datasourceConfig = {text:"name",value:"value"};
    ac;
    render() {
        const value = this.props.fieldSchema.options.find(x=>x.value === this.props.input.value);
        return <AutoComplete
            {...{id:this.props.input.name}}
            maxSearchResults={5}
            fullWidth={true}
            ref={ref=>this.ac=ref}
            errorText={this.props.meta.error}
            filter={AutoComplete.fuzzyFilter}
            dataSource={this.props.fieldSchema.options}
            dataSourceConfig={AutoCompleteSelect.datasourceConfig}
            floatingLabelText={this.props.fieldSchema.label}
            searchText={value?value.name:""}
            onNewRequest={(value)=>{
                return this.props.input.onChange(value['value']);
            }}
        />
    }
}

class AutoCompleteText extends React.Component<CustomWidgetProps,any>{
    componentDidUpdate() {
        this.ac.focus()
    }
    static datasourceConfig = {text:"name",value:"value"};
    ac;
    render() {
        return <AutoComplete
            {...{id:this.props.input.name}}
            maxSearchResults={5}
            fullWidth={true}
            ref={ref=>this.ac=ref}
            filter={AutoComplete.fuzzyFilter}
            errorText={this.props.meta.error}
            dataSource={this.props.fieldSchema.options}
            dataSourceConfig={AutoCompleteText.datasourceConfig}
            floatingLabelText={this.props.fieldSchema.label}
            searchText={this.props.input.value}
            onUpdateInput={name=>{
                const entry = this.props.fieldSchema.options.find(x=>x.name===name);
                return this.props.input.onChange(entry?entry.value:name);
            }}
        />
    }
}

const ArrayFieldRenderer = muiThemeable()(
    function (props:WrappedFieldArrayProps<any>&CustomWidgetProps){
        const muiTheme:MuiTheme = props.muiTheme;
        return <div className="clearfix">
            {
                props.fields.map((name, i) => {
                    let children = props.fieldSchema.children;
                    if(typeof props.fieldSchema.getChildren === 'function')
                        children = props.fieldSchema.getChildren(props.fields.get(i)).filter(x=>x);
                    return <Paper key={i} zDepth={0} style={{
                        padding: '15px',
                        margin: '15px 0',
                        borderTop: "2px solid " + props.muiTheme.palette.primary1Color,
                    }}>
                        <div className="pull-right">
                            <IconButton
                                style={{minWidth: '30px', height: "30px", color: props.muiTheme.palette.accent1Color}}
                                onTouchTap={() => props.fields.remove(i)}
                                tooltip="删除"
                            >
                                <Remove hoverColor={muiTheme.palette.accent1Color} />
                            </IconButton>
                        </div>
                        <div>
                            {
                                children&&children.map((field) => {
                                    const parsedKey = name + '.' + field.key;
                                    return <div key={parsedKey}>
                                        {props.renderField(Object.assign({}, field, {
                                            parsedKey
                                        }))}
                                    </div>;
                                })
                            }
                        </div>
                    </Paper>
                })
            }
            <div style={{textAlign:"center"}}>
                <IconButton
                    style={{marginBottom: '15px'}}
                    tooltip="添加" onTouchTap={() => props.fields.push({})}
                >
                    <Add hoverColor={muiTheme.palette.primary1Color}/>
                </IconButton>
            </div>
        </div>
    });

addType('number',function ({fieldSchema,...rest}){
    return <div>
        <Field name={fieldSchema.parsedKey} {...rest} fieldSchema={fieldSchema}  component={NumberInput} />
    </div>
});

const DefaultInput = function ({fieldSchema,...rest}){
    return <div>
        <Field name={fieldSchema.parsedKey} {...rest} fieldSchema={fieldSchema}  component={TextInput}/>
    </div>
};

addType("password",DefaultInput);
addType("email",DefaultInput);
addType('text',DefaultInput);

addType('checkbox',function ({fieldSchema,...rest}){
    return <div>
        <Field name={fieldSchema.parsedKey} {...rest} fieldSchema={fieldSchema}  component={CheckboxInput} />
    </div>
});

addType('select',function ({fieldSchema,...rest}){
    return <div>
        <Field name={fieldSchema.parsedKey} {...rest} fieldSchema={fieldSchema}  component={SelectInput} />
    </div>
});
addType('autocomplete',function({fieldSchema,...rest}){
    return <div>
        <Field name={fieldSchema.parsedKey} {...rest} fieldSchema={fieldSchema}  component={AutoCompleteSelect} />
    </div>
});
addType('autocomplete-text',function({fieldSchema,...rest}){
    return <div>
        <Field name={fieldSchema.parsedKey} {...rest} fieldSchema={fieldSchema}  component={AutoCompleteText} />
    </div>
});

addType('date',function({fieldSchema,...rest}){
    return <div>
        <Field name={fieldSchema.parsedKey} {...rest} fieldSchema={fieldSchema}  component={DateInput} />
    </div>
});

addType("array",(props)=>{
    return <div>
        <label className="control-label">{props.fieldSchema.label}</label>
        <FieldArray name={props.fieldSchema.parsedKey}  component={ArrayFieldRenderer} props={props}/>
    </div>
});

addType('hidden',({fieldSchema,...rest})=>{
    return <div>
        <Field id={'rich-editor'+fieldSchema.label} name={fieldSchema.parsedKey} {...rest}  component={'input'} />
    </div>
});

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

const formModule = require('./form');
const injectCSS = require('react-jss').default;
const JSSForm = formModule.ReduxSchemaForm;
formModule.ReduxSchemaForm =muiThemeable()
(injectCSS(stylesheet)(
    ({classes,sheet,...rest})=>{
        return <div className={classes.form}>
            <JSSForm {...rest} />
        </div>;
    }));