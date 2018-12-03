"use strict";
/**
 * Created by Administrator on 2017/8/8.
 */
///<reference path="./declarations.d.ts" />
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var React = require("react");
var field_1 = require("../field");
var antd_1 = require("antd");
var inject_submittable_1 = require("../inject-submittable");
var moment = require("moment");
var resolve_maybe_promise_1 = require("../resolve-maybe-promise");
var field_array_1 = require("../field-array");
var RadioGroup = antd_1.Radio.Group;
var TextArea = antd_1.Input.TextArea;
var RangePicker = antd_1.DatePicker.RangePicker;
var Option = antd_1.Select.Option;
var PropTypes = require('prop-types');
var RCSelect = require("rc-select").default;
RCSelect.propTypes['value'] = PropTypes.any;
Option.propTypes['value'] = PropTypes.any;
antd_1.Select.propTypes['value'] = PropTypes.any;
var emptyArray = [];
var errorStyle = { color: "red" };
function TextInput(props) {
    return React.createElement("div", null,
        React.createElement("div", null, props.schema.label),
        React.createElement(antd_1.Input, tslib_1.__assign({ type: props.schema.type, id: props.schema.key, className: "full-width", style: { width: "100%" }, name: props.schema.name, value: props.value, onChange: props.onChange }, props.componentProps)),
        React.createElement("div", { style: errorStyle }, props.error));
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
            _this.props.onChange(v);
        };
        _this.onSearchChange = function (v) { return _this.setState({ search: v }); };
        return _this;
    }
    SelectInput.prototype.render = function () {
        var _this = this;
        var _a = this.props, schema = _a.schema, componentProps = _a.componentProps, value = _a.value, error = _a.error;
        return React.createElement("div", null,
            React.createElement("label", null, schema.label),
            React.createElement(resolve_maybe_promise_1.ResolveMaybePromise, { maybePromise: schema.options }, function (options) {
                if (options == undefined)
                    options = emptyArray;
                console.log("rerender");
                var finalValue = schema.multiple || componentProps.mode === "multiple" ? (Array.isArray(value) ? value : []) : value;
                return React.createElement(antd_1.Select, tslib_1.__assign({ showSearch: true, style: { width: "100%" }, onSearch: _this.onSearchChange, mode: schema.multiple ? "multiple" : "default", value: finalValue, onChange: _this.onChange, filterOption: false }, componentProps), options.filter(function (option) {
                    return !_this.state.search || option.name.toLowerCase().indexOf(_this.state.search.toLowerCase()) >= 0;
                }).slice(0, schema.maxOptionCount || Infinity).map(function (option) {
                    var name = option.name, value = option.value, rest = tslib_1.__rest(option, ["name", "value"]);
                    return React.createElement(Option, tslib_1.__assign({ key: name, value: value }, rest), name);
                }));
            }),
            React.createElement("div", { style: errorStyle }, error));
    };
    return SelectInput;
}(React.PureComponent));
function CheckboxInput(props) {
    return React.createElement("div", { style: { width: "100%", paddingTop: 20 } },
        React.createElement("label", { style: { marginRight: 15 } }, props.schema.label),
        React.createElement(antd_1.Checkbox, tslib_1.__assign({ onChange: function (e) { return props.onChange(e.target.checked); }, checked: Boolean(props.value) }, props.componentProps)));
}
function DateTimeInput(props) {
    var value = props.value ? moment(props.value) : undefined;
    return React.createElement("div", null,
        React.createElement("label", null, props.schema.label),
        React.createElement(antd_1.DatePicker, tslib_1.__assign({ showTime: true, format: props.componentProps.dateFormat || "YYYY/MM/DD HH:mm:ss", value: value, style: { width: "100%" }, onChange: function (_, dateString) { return props.onChange(dateString); } }, props.componentProps)),
        React.createElement("div", { style: errorStyle }, props.error));
}
function DateInput(props) {
    var value = null;
    if (props.value) {
        if (!(props.value instanceof moment))
            value = moment(props.value);
    }
    return React.createElement("div", null,
        React.createElement("label", null, props.schema.label),
        React.createElement(antd_1.DatePicker, tslib_1.__assign({ key: props.schema.name, value: value, style: { width: "100%" }, onChange: function (_, dateString) { props.onChange(dateString); } }, props.componentProps)),
        React.createElement("div", { style: errorStyle }, props.error));
}
function DateTimeRangeInput(props) {
    var value = props.value;
    return React.createElement("div", null,
        React.createElement("label", null, props.schema.label),
        React.createElement(RangePicker, tslib_1.__assign({ showTime: { format: 'HH:mm:ss' }, style: { width: "100%" }, format: props.componentProps.dateFormat || "YYYY/MM/DD HH:mm:ss", placeholder: ['开始时间', '结束时间'], value: [(value && value[0] && moment(value[0])) || moment(), (value && value[1] && moment(value[1])) || moment()], onChange: function (_, dataStrings) {
                props.onChange(dataStrings);
            } }, props.componentProps)),
        React.createElement("div", { style: errorStyle }, props.error));
}
function NumberInput(props) {
    return React.createElement("div", { style: { width: "100%" } },
        React.createElement("label", null, props.schema.label),
        React.createElement(antd_1.InputNumber, tslib_1.__assign({ style: { width: "100%" }, id: props.schema.key, min: 0, value: isNaN(parseFloat(props.value)) ? 0 : parseFloat(props.value), onChange: function (value) {
                if (isNaN(parseFloat(value))) {
                    props.onChange(0);
                }
                else {
                    props.onChange(parseFloat(value));
                }
            } }, props.componentProps)),
        React.createElement("div", { style: errorStyle }, props.error));
}
var defaultAutoCompleteFilter = function (input, element) {
    return typeof element.props.children === 'string' && element.props.children.includes(input);
};
var AutoCompleteDefault = function (props) {
    var error = props.error, value = props.value, onChange = props.onChange, schema = props.schema;
    return React.createElement("div", { style: { width: "100%" } },
        React.createElement("label", null, schema.label),
        React.createElement(resolve_maybe_promise_1.ResolveMaybePromise, { maybePromise: schema.options }, function (options) {
            return React.createElement(antd_1.AutoComplete, tslib_1.__assign({ dataSource: options ? options.map(function (itm) { return ({ value: itm.value, text: itm.name }); }) : emptyArray, style: { width: "100%" }, value: value, filterOption: defaultAutoCompleteFilter, onSelect: onChange }, props.componentProps));
        }),
        React.createElement("div", { style: errorStyle }, error));
};
var FileInput = /** @class */ (function (_super) {
    tslib_1.__extends(FileInput, _super);
    function FileInput() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.onChange = function (info) {
            _this.props.onChange(info.fileList.map(function (file) {
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
            if (!_this.props.schema.onFileChange) {
                setTimeout(function () {
                    onProgress({ percent: 100 });
                    onSuccess(filename, null);
                }, 1);
            }
            else {
                _this.props.schema.onFileChange(file).then(function (previewUrl) {
                    onProgress({ percent: 100 });
                    onSuccess(previewUrl, null);
                }, function (err) { return onError(err); });
            }
        };
        return _this;
    }
    FileInput.prototype.render = function () {
        return React.createElement("div", { style: { width: "100%" } },
            React.createElement(antd_1.Upload, tslib_1.__assign({ fileList: this.props.value || emptyArray, multiple: true, onChange: this.onChange, customRequest: this.customRequest }, this.props.componentProps),
                React.createElement(antd_1.Button, null,
                    React.createElement(antd_1.Icon, { type: "upload" }),
                    " ",
                    this.props.schema.label)));
    };
    return FileInput;
}(React.Component));
function SelectRadio(props) {
    return React.createElement("div", null,
        React.createElement("label", { style: { paddingLeft: 0 } }, props.schema.label),
        React.createElement(resolve_maybe_promise_1.ResolveMaybePromise, { maybePromise: props.schema.options }, function (options) { return React.createElement(RadioGroup, tslib_1.__assign({ value: props.value || false, onChange: function (v) { return props.onChange(v); } }, props.componentProps), options ? options.map(function (option) { return (React.createElement(antd_1.Radio, { style: {
                width: "auto",
                flex: 1,
                whiteSpace: "nowrap",
                margin: "0 15px 0 0"
            }, key: option.value, value: option.value }, option.name)); }) : null); }),
        React.createElement("p", { style: errorStyle }, props.error));
}
function DateRangeInput(props) {
    var dateFormat = props.schema.dateFormat || 'YYYY/MM/DD';
    var value = props.value;
    var from = value ? value[0] : undefined;
    var to = value ? value[1] : undefined;
    return React.createElement("div", null,
        React.createElement(RangePicker, tslib_1.__assign({ defaultValue: [from ? moment(from, dateFormat) : undefined, to ? moment(to, dateFormat) : undefined], format: dateFormat, onChange: function (_, dateStrings) { props.onChange(dateStrings); } }, props.componentProps)));
}
function TextareaInput(props) {
    return React.createElement("div", { style: { marginBottom: 16 } },
        React.createElement("label", null, props.schema.label),
        React.createElement(TextArea, tslib_1.__assign({ value: props.value, onChange: function (value) { return props.onChange(value); }, autosize: { minRows: 4, maxRows: 8 } }, props.componentProps)),
        React.createElement("div", { style: errorStyle }, props.error));
}
var AutoCompleteAsync = /** @class */ (function (_super) {
    tslib_1.__extends(AutoCompleteAsync, _super);
    function AutoCompleteAsync() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.onUpdateInput = function (name) {
            var throttle = _this.props.schema.throttle || 400;
            _this.setState({
                searchText: name
            });
            if (_this.pendingUpdate)
                clearTimeout(_this.pendingUpdate);
            _this.pendingUpdate = setTimeout(function () {
                _this.fetchingQuery = name;
                var result = _this.props.schema.options(name, _this.props);
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
            _this.props.onChange(params.value);
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
        if (nextProps.value !== this.props.value)
            this.setState({
                searchText: this.findName(nextProps.value)
            });
    };
    AutoCompleteAsync.prototype.findName = function (value) {
        var entry = this.state.dataSource.find(function (x) { return x.value === value; });
        return entry ? entry.name : value;
    };
    AutoCompleteAsync.prototype.render = function () {
        var _a = this.props, error = _a.error, onChange = _a.onChange, schema = _a.schema, componentProps = _a.componentProps;
        return React.createElement("div", null,
            React.createElement("label", null, schema.label),
            React.createElement(antd_1.AutoComplete, tslib_1.__assign({ dataSource: this.state.dataSource, style: { width: "100%" }, onSelect: onChange, onSearch: this.onUpdateInput, filterOption: false }, componentProps)),
            React.createElement("div", { style: errorStyle }, error));
    };
    return AutoCompleteAsync;
}(React.Component));
var AutoCompleteText = /** @class */ (function (_super) {
    tslib_1.__extends(AutoCompleteText, _super);
    function AutoCompleteText() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.onUpdateInput = function (name) {
            var entry = _this.props.schema.options.find(function (x) { return x.name === name; });
            return _this.props.onChange(entry ? entry.value : name);
        };
        return _this;
    }
    AutoCompleteText.prototype.render = function () {
        var _a = this.props, componentProps = _a.componentProps, onChange = _a.onChange, error = _a.error, schema = _a.schema;
        return React.createElement("div", null,
            React.createElement("label", null, schema.label),
            React.createElement(antd_1.AutoComplete, tslib_1.__assign({ dataSource: schema.options.map(function (itm) { return ({ text: itm.name, value: itm.value }); }), onSearch: this.onUpdateInput, onSelect: onChange, filterOption: defaultAutoCompleteFilter }, componentProps)),
            React.createElement("div", { style: errorStyle }, error));
    };
    return AutoCompleteText;
}(React.Component));
function GroupRenderer(_a) {
    var form = _a.form, schema = _a.schema, keyPath = _a.keyPath, componentProps = _a.componentProps;
    return React.createElement(antd_1.Collapse, tslib_1.__assign({ defaultActiveKey: ["0"], style: { marginBottom: 15 } }, componentProps),
        React.createElement(antd_1.Collapse.Panel, { key: "0", header: schema.label }, field_1.renderFields(form, schema.children, keyPath + "." + schema.key)));
}
function ArrayFieldRenderer(props) {
    return React.createElement(field_array_1.FieldArray, tslib_1.__assign({}, props), function (keys, add, remove, renderChild) { return React.createElement(React.Fragment, null,
        React.createElement("label", null, props.schema.label),
        React.createElement("div", { className: "add-button" },
            React.createElement(antd_1.Tooltip, { placement: "topLeft", title: "\u6DFB\u52A0", arrowPointAtCenter: true },
                React.createElement(antd_1.Button, { icon: "plus", onClick: add }))),
        React.createElement(antd_1.Collapse, { style: { marginBottom: 16, marginTop: 16 } }, keys.map(function (id, index) {
            return React.createElement(antd_1.Collapse.Panel, { forceRender: true, showArrow: false, key: id, header: React.createElement("div", null,
                    props.schema.label + " #" + index,
                    React.createElement("div", { className: "delete-button", onClick: function (e) { return e.stopPropagation(); } },
                        React.createElement(antd_1.Tooltip, { placement: "topLeft", title: "\u5220\u9664", arrowPointAtCenter: true },
                            React.createElement(antd_1.Icon, { type: "close", style: { cursor: "pointer", marginRight: 8 }, onClick: function () { return remove(id); } })))) },
                React.createElement("div", { key: id, className: "array-field-child" }, renderChild(id)));
        }))); });
}
field_1.addType("group", GroupRenderer);
field_1.addType('text', TextInput);
field_1.addType('select', SelectInput);
field_1.addType('radio', SelectRadio);
field_1.addType('checkbox', CheckboxInput);
field_1.addType('date', DateInput);
field_1.addType('autocomplete-text', AutoCompleteText);
field_1.addType('datetime', DateTimeInput);
field_1.addType('datetimeRange', DateTimeRangeInput);
field_1.addType('number', NumberInput);
field_1.addType('autocomplete', AutoCompleteDefault);
field_1.addType("file", FileInput);
field_1.addType("dateRange", DateRangeInput);
field_1.addType("textarea", TextareaInput);
field_1.addType("password", TextInput);
field_1.addType("email", TextInput);
field_1.addType('text', TextInput);
field_1.addType("array", ArrayFieldRenderer);
field_1.addType("autocomplete-async", AutoCompleteAsync);
inject_submittable_1.setButton(function (props) {
    return React.createElement("div", { style: { textAlign: "center", float: "left", margin: 15, width: "100%" } },
        React.createElement(antd_1.Button.Group, null,
            React.createElement(antd_1.Button, { style: {
                    backgroundColor: "transparent",
                }, onClick: props.onReset, disabled: props.disabled, type: "default", htmlType: 'reset' }, "\u91CD\u7F6E"),
            React.createElement(antd_1.Button, { className: "raised-button", onClick: props.onSubmit, icon: props.submitSucceeded ? "check" : undefined, disabled: props.disabled, type: 'primary', loading: props.submitting, htmlType: 'submit' }, "\u63D0\u4EA4")));
});
//# sourceMappingURL=antd-components.js.map