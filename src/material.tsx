/**
 * Created by buhi on 2017/4/28.
 */
import * as React from "react"
import {addType,setButton} from "./form"
import TextField from "material-ui/TextField"
import SelectField from "material-ui/SelectField"
import MenuItem from 'material-ui/MenuItem'
import Checkbox from 'material-ui/Checkbox'
import DatePicker from "material-ui/DatePicker";
import RaisedButton from "material-ui/RaisedButton"
import FlatButton from "material-ui/FlatButton"
import Paper from "material-ui/Paper"
import AutoComplete from "material-ui/AutoComplete"
import muiThemeable from "material-ui/styles/muiThemeable";
import IconButton from "material-ui/IconButton";

import Add from "material-ui/svg-icons/content/add";
import Remove from "material-ui/svg-icons/content/remove";

let {Field,FieldArray} =require("redux-form");

function NumberInput(props){
    return <TextField type="number"
                      id={props.input.name}
                      className="full-width"
                      disabled={props.disabled}
                      style={{width:"100%"}}
                      name={props.input.name}
                      floatingLabelText={props.fieldSchema.label}
                      value={Number(props.input.value)}
                      onChange={(e)=>props.input.onChange(Number(e.target['value']))}/>;
}

function DateInput(props){
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

const TextFieldWithRequired = TextField as any;

function TextInput(props){
    return <TextFieldWithRequired
        required={props.required}
        type={props.type}
        id={props.input.name}
        className="full-width"
        style={{width:"100%"}}
        name={props.input.name}
        disabled={props.disabled}
        multiLine={props.fieldSchema.multiLine}
        floatingLabelText={props.fieldSchema.label}
        value={props.input.value}
        onChange={props.input.onChange}/>;
}
class CheckboxInput extends React.Component<any,any>{
    componentWillMount(){
        this.props.input.onChange(this.props.input.checked);
    }
    render() {
        return <Checkbox
            id={this.props.input.name}
            style={{width:"100%",margin:"32px 0 16px"}}
            disabled={this.props.disabled}
            onCheck={this.props.input.onChange}
            label={this.props.fieldSchema.label}
            value={this.props.input.value}
        />
    }
}

function SelectInput(props){
    return <SelectField
        id={props.input.name}
        disabled={props.disabled}
        floatingLabelText={props.fieldSchema.label}
        fullWidth={true}
        multiple={props.fieldSchema.multiple}
        value={props.input.value}
        onChange={(event,index,value)=>props.input.onChange(value)}>
        {
            props.fieldSchema.options.map((option)=><MenuItem className="option" key={option.value} value={option.value} primaryText={option.name} />)
        }
    </SelectField>;
}

class AutoCompleteSelect extends React.Component<any,any>{
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

class AutoCompleteText extends React.Component<any,any>{
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
    function (props:any){
        return <div className="clearfix">
            {
                props.fields.map((name, i) => {
                    return <Paper key={i} zDepth={0} style={{
                        padding: '15px',
                        margin: '15px 0',
                        borderTop: "2px solid " + props.muiTheme.palette.primary1Color,
                    }}>
                        <div className="pull-right">
                            <IconButton style={{minWidth: '30px', height: "30px", color: props.muiTheme.palette.accent1Color}}
                                        onTouchTap={() => props.fields.remove(i)}
                                        tooltip="添加"
                            >
                                <Add />
                            </IconButton>
                        </div>
                        <div>
                            {props.fieldSchema.children.map((field) => {
                                const parsedKey = name + '.' + field.key;
                                return <div key={parsedKey}>
                                    {props.renderField(Object.assign({}, field, {
                                        parsedKey
                                    }))}
                                </div>;
                            })}
                        </div>
                    </Paper>
                })
            }
            <IconButton style={{marginBottom: '15px', width: '100%'}} tooltip="删除" onTouchTap={() => props.fields.push()}
                        >
                <Remove />
            </IconButton>
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