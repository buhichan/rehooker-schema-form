/**
 * Created by Administrator on 2017/8/8.
 */
///<reference path="./declarations.d.ts" />
import * as tslib_1 from "tslib";
import * as React from "react";
import { addType, addTypeWithWrapper, getComponentProps } from "../field";
import { FieldArray } from "redux-form";
import { AutoComplete, Radio, Checkbox, InputNumber, Tooltip, Upload, Button, Icon, Input, Select, DatePicker } from 'antd';
import { renderFields } from "../render-fields";
import { setButton } from "../buttons";
import * as moment from "moment";
import { ResolveMaybePromise } from '../resolve-maybe-promise';
import { isArray } from 'util';
var RadioGroup = Radio.Group;
var TextArea = Input.TextArea;
var RangePicker = DatePicker.RangePicker;
var Option = Select.Option;
var PropTypes = require('prop-types');
var RCSelect = require("rc-select").default;
RCSelect.propTypes['value'] = PropTypes.any;
Option.propTypes['value'] = PropTypes.any;
Select.propTypes['value'] = PropTypes.any;
var noop = function () { };
var emptyArray = [];
// const convertValueToString = Comp=>(props)=>{
//     let onChange=!props.onChange?undefined:(value)=>{
//         props.onChange()
//     }
//     return <Comp {...props} value={String(props.value)} />
// }
var errorStyle = { color: "red" };
function TextInput(props) {
    var componentProps = getComponentProps(props.fieldSchema);
    return React.createElement("div", null,
        React.createElement("div", null, props.fieldSchema.label),
        React.createElement(Input, tslib_1.__assign({ type: props.type, id: props.input.name, className: "full-width", style: { width: "100%" }, name: props.input.name, onBlur: props.input.onBlur, value: props.input.value, onChange: props.input.onChange }, componentProps)),
        React.createElement("div", { style: errorStyle }, props.meta.error));
}
var SelectInput = /** @class */ (function (_super) {
    tslib_1.__extends(SelectInput, _super);
    function SelectInput() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.state = {
            search: ""
        };
        _this.onChange = function (v) {
            _this.setState({
                search: ""
            });
            _this.props.input.onChange(v);
        };
        _this.onSearchChange = function (v) { return _this.setState({ search: v }); };
        return _this;
    }
    SelectInput.prototype.render = function () {
        var _this = this;
        var _a = this.props, fieldSchema = _a.fieldSchema, input = _a.input, meta = _a.meta;
        var componentProps = getComponentProps(this.props.fieldSchema);
        return React.createElement("div", null,
            React.createElement("label", null, fieldSchema.label),
            React.createElement(ResolveMaybePromise, { maybePromise: fieldSchema.options }, function (options) {
                if (options == undefined)
                    options = emptyArray;
                console.log("rerender");
                var value = fieldSchema.multiple || componentProps.mode === "multiple" ? (isArray(input.value) ? input.value : []) : input.value;
                return React.createElement(Select, tslib_1.__assign({ showSearch: true, style: { width: "100%" }, onSearch: _this.onSearchChange, mode: fieldSchema.multiple ? "multiple" : "default", value: value, onChange: _this.onChange, filterOption: false }, componentProps), options.filter(function (option) {
                    return !_this.state.search || option.name.toLowerCase().indexOf(_this.state.search.toLowerCase()) >= 0;
                }).slice(0, fieldSchema.maxOptionCount || Infinity).map(function (option) {
                    var name = option.name, value = option.value, rest = tslib_1.__rest(option, ["name", "value"]);
                    return React.createElement(Option, tslib_1.__assign({ key: name, value: value }, rest), name);
                }));
            }),
            React.createElement("div", { style: errorStyle }, meta.error));
    };
    return SelectInput;
}(React.PureComponent));
function CheckboxInput(props) {
    var componentProps = getComponentProps(props.fieldSchema);
    return React.createElement("div", { style: { width: "100%" } },
        React.createElement("label", null, props.fieldSchema.label),
        React.createElement(Checkbox, tslib_1.__assign({ onChange: function (e) { return props.input.onChange(e.target.checked); }, checked: Boolean(props.input.value) }, componentProps)));
}
function DateTimeInput(props) {
    var value = props.input.value ? moment(props.input.value) : undefined;
    var componentProps = getComponentProps(props.fieldSchema);
    return React.createElement("div", null,
        React.createElement("label", null, props.fieldSchema.label),
        React.createElement(DatePicker, tslib_1.__assign({ showTime: true, format: componentProps.dateFormat || "YYYY-MM-DD HH:mm:ss", value: value, style: { width: "100%" }, onChange: function (_, dateString) { return props.input.onChange(dateString); } }, componentProps)),
        React.createElement("div", { style: errorStyle }, props.meta.error));
}
function DateInput(props) {
    var value = null;
    if (props.input.value) {
        if (!(props.input.value instanceof moment))
            value = moment(props.input.value);
    }
    var componentProps = getComponentProps(props.fieldSchema);
    return React.createElement("div", null,
        React.createElement("label", null, props.fieldSchema.label),
        React.createElement(DatePicker, tslib_1.__assign({ key: props.fieldSchema.name, value: value, disabled: props.disabled, style: { width: "100%" }, onChange: function (_, dateString) { props.input.onChange(dateString); } }, componentProps)),
        React.createElement("div", { style: errorStyle }, props.meta.error));
}
function DateTimeRangeInput(props) {
    var value = props.input.value;
    var componentProps = getComponentProps(props.fieldSchema);
    return React.createElement("div", null,
        React.createElement("label", null, props.fieldSchema.label),
        React.createElement(RangePicker, tslib_1.__assign({ showTime: { format: 'HH:mm:ss' }, style: { width: "100%" }, format: componentProps.dateFormat || "YYYY-MM-DD HH:mm:ss", placeholder: ['开始时间', '结束时间'], value: [(value && value[0] && moment(value[0])) || moment(), (value && value[1] && moment(value[1])) || moment()], onChange: function (_, dataStrings) {
                props.input.onChange(dataStrings);
            } }, componentProps)),
        React.createElement("div", { style: errorStyle }, props.meta.error));
}
function NumberInput(props) {
    var required = {
        required: props.required
    };
    var componentProps = getComponentProps(props.fieldSchema);
    return React.createElement("div", { style: { width: "100%" } },
        React.createElement("label", null, props.fieldSchema.label),
        React.createElement(InputNumber, tslib_1.__assign({ onBlur: props.input.onBlur }, required, { style: { width: "100%" }, id: props.input.name, min: 0, disabled: props.disabled, value: isNaN(parseFloat(props.input.value)) ? 0 : parseFloat(props.input.value), onChange: function (value) {
                if (isNaN(parseFloat(value))) {
                    props.input.onChange(0);
                }
                else {
                    props.input.onChange(parseFloat(value));
                }
            } }, componentProps)),
        React.createElement("div", { style: errorStyle }, props.meta.error));
}
var defaultAutoCompleteFilter = function (input, element) {
    return typeof element.props.children === 'string' && element.props.children.includes(input);
};
var AutoCompleteDefault = function (props) {
    var meta = props.meta, input = props.input, fieldSchema = props.fieldSchema;
    var componentProps = getComponentProps(props.fieldSchema);
    return React.createElement("div", { style: { width: "100%" } },
        React.createElement("label", null, fieldSchema.label),
        React.createElement(ResolveMaybePromise, { maybePromise: fieldSchema.options }, function (options) {
            return React.createElement(AutoComplete, tslib_1.__assign({ dataSource: options ? options.map(function (itm) { return ({ value: itm.value, text: itm.name }); }) : emptyArray, style: { width: "100%" }, value: input.value, filterOption: defaultAutoCompleteFilter, onSelect: function (value) { return input.onChange(value); } }, componentProps, { onBlur: noop, onFocus: noop }));
        }),
        React.createElement("div", { style: errorStyle }, meta.error));
};
var FileInput = /** @class */ (function (_super) {
    tslib_1.__extends(FileInput, _super);
    function FileInput() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.onChange = function (info) {
            _this.props.input.onChange(info.fileList.map(function (file) {
                if (file.response && file.response.url) {
                    file.url = file.response.url;
                }
                return tslib_1.__assign({}, file);
            }).filter(function (file) {
                if (file.response && file.response.url) {
                    return file.status === "done";
                }
                return true;
            }));
        };
        _this.customRequest = function (customRequestParams) {
            var onSuccess = customRequestParams.onSuccess, onError = customRequestParams.onError, onProgress = customRequestParams.onProgress, file = customRequestParams.file, filename = customRequestParams.filename;
            if (!_this.props.fieldSchema.onFileChange) {
                setTimeout(function () {
                    onProgress({ percent: 100 });
                    onSuccess(filename, null);
                }, 1);
            }
            else {
                _this.props.fieldSchema.onFileChange(file).then(function (previewUrl) {
                    onProgress({ percent: 100 });
                    onSuccess(previewUrl, null);
                }, function (err) { return onError(err); });
            }
        };
        return _this;
    }
    FileInput.prototype.render = function () {
        var componentProps = getComponentProps(this.props.fieldSchema);
        return React.createElement("div", { style: { width: "100%" } },
            React.createElement(Upload, tslib_1.__assign({ fileList: this.props.input.value || emptyArray, multiple: true, onChange: this.onChange, customRequest: this.customRequest }, componentProps),
                React.createElement(Button, null,
                    React.createElement(Icon, { type: "upload" }),
                    " ",
                    this.props.fieldSchema.label)));
    };
    return FileInput;
}(React.Component));
function SelectRadio(props) {
    var componentProps = getComponentProps(props.fieldSchema);
    return React.createElement("div", null,
        React.createElement("label", { style: { paddingLeft: 0 } }, props.fieldSchema.label),
        React.createElement(ResolveMaybePromise, { maybePromise: props.fieldSchema.options }, function (options) { return React.createElement(RadioGroup, tslib_1.__assign({ disabled: props.disabled, value: props.input.value || false, onChange: function (v) { return props.input.onChange(v); } }, componentProps), options ? options.map(function (option) { return (React.createElement(Radio, { style: {
                width: "auto",
                flex: 1,
                whiteSpace: "nowrap",
                margin: "0 15px 0 0"
            }, key: option.value, value: option.value }, option.name)); }) : null); }),
        React.createElement("p", { style: errorStyle }, props.meta.error));
}
function DateRangeInput(props) {
    var dateFormat = props.fieldSchema.dateFormat || 'YYYY-MM-DD';
    var value = props.input.value;
    var from = value ? value[0] : undefined;
    var to = value ? value[1] : undefined;
    var componentProps = getComponentProps(props.fieldSchema);
    return React.createElement("div", null,
        React.createElement(RangePicker, tslib_1.__assign({ defaultValue: [from ? moment(from, dateFormat) : undefined, to ? moment(to, dateFormat) : undefined], disabled: props.disabled, format: dateFormat, onChange: function (_, dateStrings) { props.input.onChange(dateStrings); } }, componentProps)));
}
function TextareaInput(props) {
    var componentProps = getComponentProps(props.fieldSchema);
    return React.createElement("div", null,
        React.createElement("label", null, props.fieldSchema.label),
        React.createElement(TextArea, tslib_1.__assign({ value: props.input.value, onChange: function (value) { return props.input.onChange(value); }, autosize: { minRows: 4, maxRows: 8 } }, componentProps)),
        React.createElement("div", { style: errorStyle }, props.meta.error));
}
var AutoCompleteAsync = /** @class */ (function (_super) {
    tslib_1.__extends(AutoCompleteAsync, _super);
    function AutoCompleteAsync() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.onUpdateInput = function (name) {
            var throttle = _this.props.fieldSchema.throttle || 400;
            _this.setState({
                searchText: name
            });
            if (_this.pendingUpdate)
                clearTimeout(_this.pendingUpdate);
            _this.pendingUpdate = setTimeout(function () {
                _this.fetchingQuery = name;
                var result = _this.props.fieldSchema.options(name, _this.props);
                if (result instanceof Promise)
                    result.then(function (options) {
                        if (_this.fetchingQuery === name && _this.$isMounted)
                            _this.setState({
                                dataSource: options.map(function (itm) { return ({ text: itm.name, value: itm.value }); })
                            });
                    });
                else
                    _this.setState({
                        dataSource: result.map(function (itm) { return ({ text: itm.name, value: itm.value }); })
                    });
            }, throttle);
        };
        _this.onSelected = function (params) {
            _this.props.input.onChange(params.value);
        };
        _this.state = {
            searchText: "",
            dataSource: emptyArray
        };
        return _this;
    }
    AutoCompleteAsync.prototype.componentDidMount = function () {
        this.$isMounted = true;
    };
    AutoCompleteAsync.prototype.componentWillUnmount = function () {
        this.$isMounted = false;
    };
    AutoCompleteAsync.prototype.componentWillReceiveProps = function (nextProps) {
        if (nextProps.input.value !== this.props.input.value)
            this.setState({
                searchText: this.findName(nextProps.input.value)
            });
    };
    AutoCompleteAsync.prototype.findName = function (value) {
        var entry = this.state.dataSource.find(function (x) { return x.value === value; });
        return entry ? entry.name : value;
    };
    AutoCompleteAsync.prototype.render = function () {
        var _a = this.props, meta = _a.meta, input = _a.input, fieldSchema = _a.fieldSchema;
        return React.createElement("div", null,
            React.createElement("label", null, fieldSchema.label),
            React.createElement(AutoComplete, { dataSource: this.state.dataSource, style: { width: "100%" }, onSelect: function (value) { return input.onChange(value); }, disabled: this.props.disabled, onSearch: this.onUpdateInput, filterOption: false }),
            React.createElement("div", { style: errorStyle }, meta.error));
    };
    return AutoCompleteAsync;
}(React.Component));
var AutoCompleteText = /** @class */ (function (_super) {
    tslib_1.__extends(AutoCompleteText, _super);
    function AutoCompleteText() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.onUpdateInput = function (name) {
            var entry = _this.props.fieldSchema.options.find(function (x) { return x.name === name; });
            return _this.props.input.onChange(entry ? entry.value : name);
        };
        return _this;
    }
    AutoCompleteText.prototype.render = function () {
        var _a = this.props, input = _a.input, meta = _a.meta, fieldSchema = _a.fieldSchema;
        return React.createElement("div", null,
            React.createElement("label", null, fieldSchema.label),
            React.createElement(AutoComplete, { dataSource: fieldSchema.options.map(function (itm) { return ({ text: itm.name, value: itm.value }); }), onSearch: this.onUpdateInput, onSelect: function (value) { return input.onChange(value); }, filterOption: defaultAutoCompleteFilter }),
            React.createElement("div", { style: errorStyle }, meta.error));
    };
    return AutoCompleteText;
}(React.Component));
var ArrayFieldRenderer = /** @class */ (function (_super) {
    tslib_1.__extends(ArrayFieldRenderer, _super);
    function ArrayFieldRenderer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ArrayFieldRenderer.prototype.render = function () {
        var props = this.props;
        return React.createElement("div", { className: "clearfix array-field-container" },
            props.fields.map(function (_, i) {
                var children = props.fieldSchema.children;
                return React.createElement("div", { key: i, className: "array-field-child" },
                    React.createElement("div", { className: "delete-button" },
                        React.createElement(Tooltip, { placement: "topLeft", title: "\u5220\u9664", arrowPointAtCenter: true },
                            React.createElement(Icon, { type: "minus", className: "icon-minus", style: { cursor: "pointer" }, onClick: function () { return props.fields.remove(i); } }))),
                    renderFields(props.meta.form, children, props.keyPath + "[" + i + "]"));
            }),
            React.createElement("div", { className: "add-button" },
                React.createElement(Tooltip, { placement: "topLeft", title: "\u6DFB\u52A0", arrowPointAtCenter: true },
                    React.createElement(Icon, { type: "plus", className: "icon-plus", style: { cursor: "pointer" }, onClick: function () { return props.fields.push(props.fieldSchema.defaultValue || {}); } }))));
    };
    return ArrayFieldRenderer;
}(React.Component));
addType('text', TextInput);
addType('select', SelectInput);
addType('radio', SelectRadio);
addType('checkbox', CheckboxInput);
addType('date', DateInput);
addType('autocomplete-text', AutoCompleteText);
addType('datetime', DateTimeInput);
addType('datetimeRange', DateTimeRangeInput);
addType('number', NumberInput);
addType('autocomplete', AutoCompleteDefault);
addType("file", FileInput);
addType("dateRange", DateRangeInput);
addType("textarea", TextareaInput);
addType("password", TextInput);
addType("email", TextInput);
addType('text', TextInput);
addTypeWithWrapper("array", function (props) {
    return React.createElement("div", null,
        React.createElement("label", { className: "control-label" }, props.fieldSchema.label),
        React.createElement(FieldArray, { props: props, keyPath: props.keyPath, name: props.keyPath, rerenderOnEveryChange: Boolean(props.fieldSchema.listens), component: ArrayFieldRenderer }));
});
addType("autocomplete-async", AutoCompleteAsync);
setButton(function (props) {
    switch (props.type) {
        case 'submit':
            return React.createElement(Button, { className: "raised-button", style: { margin: "15px" }, onClick: props.onClick, disabled: props.disabled, type: props.type, htmlType: props.type }, props.children);
        case "button":
            return React.createElement(Button, { style: {
                    backgroundColor: "transparent",
                    margin: "15px"
                }, onClick: props.onClick, disabled: props.disabled, type: props.type, htmlType: props.type }, props.children);
        default:
            return null;
    }
});
//# sourceMappingURL=antd.js.map