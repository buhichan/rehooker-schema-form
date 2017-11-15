/**
 * Created by buhi on 2017/7/18.
 */
import muiThemeable from 'material-ui/styles/muiThemeable';
import Chip from 'material-ui/Chip';
import Dialog from 'material-ui/Dialog';
import * as React from 'react';
import {addType,WidgetProps, addTypeWithWrapper, ReduxSchemaForm} from "../../"
import ChipInput from "material-ui-chip-input";
import {Field, FieldArray, WrappedFieldArrayProps} from "redux-form";
import TextField from "material-ui/TextField";
import { createSelector } from "reselect";
import { GridApi } from 'ag-grid';
const dataSourceConfig = {text:"name",value:"value"};

@addType("multi-autocomplete")
@muiThemeable()
export class AutoCompleteChipInput extends React.PureComponent<WidgetProps,any>{
    state={
        dataSource:null,
        async: typeof this.props.fieldSchema.options ==='function' && this.props.fieldSchema.options.length>=1
    };
    onRequestDelete=(value)=>{
        const clone = this.props.input.value.slice();
        const i = clone.indexOf(value);
        if(i>=0){
            clone.splice(i,1);
            this.props.input.onChange(clone)
        }
    };
    onRequestDatasource=(search)=>{
        (this.props.fieldSchema.options as any)(search,this.props).then((dataSource)=>{
            this.setState({dataSource})
        })
    };
    onRequestAdd=({name,value})=>{
        const previousValue = this.props.input.value instanceof Array?this.props.input.value:[];
        this.props.input.onChange(previousValue.concat(value));
    };
    render(){
        const {input,fieldSchema,meta} = this.props;
        const {async} = this.state;
        const dataSource = async?this.state.dataSource:fieldSchema.options
        const rawValue = input.value instanceof Array?input.value:[];
        const value = rawValue.map(value=>{
            const entry = dataSource && dataSource.find(x=>x.value==value);
            return {
                name:entry?entry.name:value,
                value
            }
        });
        return <ChipInput
            style={{bottom:9}}
            value={value}
            maxSearchResults={fieldSchema.fullResult ? undefined : 5}
            menuStyle={fieldSchema.fullResult ? {maxHeight: "300px", overflowY: 'auto'} : undefined}
            floatingLabelStyle={{top:33}}
            floatingLabelFocusStyle={{top:28}}
            fullWidth
            onRequestDelete={this.onRequestDelete}
            onRequestAdd={this.onRequestAdd}
            dataSourceConfig={dataSourceConfig}
            dataSource={dataSource}
            errorText={meta.error}
            floatingLabelText={fieldSchema.label}
            hintText={fieldSchema.placeholder}
            onUpdateInput={async?this.onRequestDatasource:undefined}
        />
    }
}

const AnyField = Field as new()=>Field<any>;