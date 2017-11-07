"use strict";
/**
 * Created by Administrator on 2017/8/8.
 */
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var React = require("react");
var field_1 = require("./field");
var _a = require("redux-form"), Field = _a.Field, FieldArray = _a.FieldArray;
var Radio = require("antd/lib").Radio;
var RadioGroup = Radio.Group;
var antd_1 = require("antd");
var antd_2 = require("antd");
var TextArea = antd_2.Input.TextArea;
var antd_3 = require("antd");
var RangePicker = antd_3.DatePicker.RangePicker;
var antd_4 = require("antd");
var util_1 = require("util");
var Option = antd_4.Select.Option;
var antd_5 = require("antd");
var antd_6 = require("antd");
var antd_7 = require("antd");
var moment = require("moment");
var antd_8 = require("antd");
var react_jss_1 = require("react-jss");
var antd_jss_1 = require("./antd.jss");
var render_fields_1 = require("./render-fields");
var buttons_1 = require("./buttons");
var errorStyle = { color: "red" };
function TextInput(props) {
    var required = {
        required: props.required
    };
    return React.createElement("div", { style: props.fieldSchema.hide ? {} : { height: "50px" } },
        React.createElement("div", null, props.fieldSchema.label),
        React.createElement(antd_2.Input, tslib_1.__assign({ type: props.type, id: props.input.name, className: "full-width", style: { width: "100%" }, name: props.input.name }, required, { onBlur: props.input.onBlur, disabled: props.disabled, value: props.input.value, onChange: props.input.onChange })),
        React.createElement("div", { style: errorStyle }, props.meta.error));
}
var SelectInput = (function (_super) {
    tslib_1.__extends(SelectInput, _super);
    function SelectInput() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.state = {
            options: null
        };
        _this.unmounted = false;
        return _this;
    }
    SelectInput.prototype.reload = function (props) {
        var _this = this;
        var rawOptions = props.fieldSchema.options;
        if (typeof rawOptions === 'function') {
            if (!rawOptions.length)
                rawOptions().then(function (options) { return !_this.unmounted && _this.setState({
                    options: options
                }); });
        }
        else if (rawOptions instanceof Array)
            this.setState({
                options: props.fieldSchema.options
            });
    };
    SelectInput.prototype.componentWillReceiveProps = function (nextProps) {
        if (nextProps.fieldSchema.options !== this.props.fieldSchema.options)
            this.reload(nextProps);
    };
    SelectInput.prototype.componentWillUnmount = function () {
        this.unmounted = true;
    };
    SelectInput.prototype.componentWillMount = function () {
        this.reload(this.props);
    };
    SelectInput.prototype.render = function () {
        var _this = this;
        return React.createElement("div", { style: this.props.fieldSchema.hide ? {} : { height: "50px" } },
            React.createElement("div", null, this.props.fieldSchema.label),
            React.createElement(antd_4.Select, { showSearch: true, style: { width: "100%" }, disabled: this.props.disabled, mode: this.props.fieldSchema.multiple ? "multiple" : "default", optionFilterProp: "children", value: this.props.fieldSchema.multiple ? (util_1.isArray(this.props.input.value) ? this.props.input.value : []) : this.props.input.value, onChange: function (value) { return _this.props.input.onChange(value); }, filterOption: function (input, option) {
                    return option["props"].children.toLowerCase().indexOf(input.toLowerCase()) >= 0;
                } }, this.state.options ? this.state.options.map(function (option) { return (React.createElement(Option, { key: option.name, value: option.value }, option.name)); }) : null),
            React.createElement("div", { style: errorStyle }, this.props.meta.error));
    };
    return SelectInput;
}(React.Component));
var CheckboxInput = (function (_super) {
    tslib_1.__extends(CheckboxInput, _super);
    function CheckboxInput() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CheckboxInput.prototype.render = function () {
        var _this = this;
        return React.createElement(antd_5.Checkbox, { style: Object.assign({ width: "100%" }, this.props.fieldSchema.hide ? null : { lineHeight: "50px", height: "50px" }), disabled: this.props.disabled, onChange: function (e) { return _this.props.input.onChange(e.target["checked"]); }, checked: Boolean(this.props.input.value) }, this.props.fieldSchema.label);
    };
    return CheckboxInput;
}(React.Component));
function DateTimeInput(props) {
    var value = props.input.value ? new moment(props.input.value) : undefined;
    return React.createElement("div", { style: props.fieldSchema.hide ? {} : { height: "50px" } },
        React.createElement("div", null, props.fieldSchema.label),
        React.createElement(antd_3.DatePicker, { showTime: true, format: "YYYY-MM-DD HH:mm:ss", placeholder: "Select Time", defaultValue: value, style: { width: "100%" }, onChange: function (value, dateString) { return props.input.onChange(dateString); } }),
        React.createElement("div", { style: errorStyle }, props.meta.error));
}
function DateInput(props) {
    var required = {
        required: props.required
    };
    var value = null;
    if (props.input.value) {
        if (!(props.input.value instanceof moment))
            value = new moment(props.input.value);
    }
    return React.createElement("div", { style: props.fieldSchema.hide ? {} : { height: "50px" } },
        React.createElement("div", null, props.fieldSchema.label),
        React.createElement(antd_3.DatePicker, tslib_1.__assign({}, required, { key: props.fieldSchema.name, value: value, disabled: props.disabled, style: { width: "100%" }, onChange: function (date, dateString) { props.input.onChange(dateString); } })),
        React.createElement("div", { style: errorStyle }, props.meta.error));
}
var DateTimeRangeInput = (function (_super) {
    tslib_1.__extends(DateTimeRangeInput, _super);
    function DateTimeRangeInput() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    DateTimeRangeInput.prototype.render = function () {
        var value = this.props.input.value && JSON.parse(this.props.input.value);
        //console.log(value);
        return React.createElement("div", { style: this.props.fieldSchema.hide ? {} : { height: "50px" } },
            React.createElement("div", null, this.props.fieldSchema.label),
            React.createElement(RangePicker, { showTime: { format: 'HH:mm' }, format: "YYYY/MM/DD HH:mm", placeholder: ['开始时间', '结束时间'], defaultValue: [(value && new moment(value[0], "YYYY/MM/DD HH:mm:ss")) || new moment(), (value && new moment(value[1], "YYYY/MM/DD HH:mm:ss")) || new moment()], onOk: function (value) {
                    //console.log(value);
                    //this.props.input.onChange(JSON.stringify(value.map(itm=>itm.format("YYYY/MM/DD hh:mm:ss"))));
                } }),
            React.createElement("div", { style: errorStyle }, this.props.meta.error));
    };
    return DateTimeRangeInput;
}(React.Component));
function NumberInput(props) {
    var required = {
        required: props.required
    };
    return React.createElement("div", { style: Object.assign({ width: "100%" }, props.fieldSchema.hide ? null : { height: "50px" }) },
        React.createElement("div", null, props.fieldSchema.label),
        React.createElement(antd_6.InputNumber, tslib_1.__assign({ onBlur: props.input.onBlur }, required, { style: { width: "100%" }, id: props.input.name, min: 0, disabled: props.disabled, value: isNaN(parseFloat(props.input.value)) ? 0 : parseFloat(props.input.value), onChange: function (value) {
                if (isNaN(parseFloat(value))) {
                    props.input.onChange(0);
                }
                else {
                    props.input.onChange(parseFloat(value));
                }
            } })),
        React.createElement("div", { style: errorStyle }, props.meta.error));
}
var AutoCompleteSelect = (function (_super) {
    tslib_1.__extends(AutoCompleteSelect, _super);
    function AutoCompleteSelect() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    AutoCompleteSelect.prototype.render = function () {
        var _a = this.props, meta = _a.meta, input = _a.input, fieldSchema = _a.fieldSchema;
        var value = fieldSchema.options.find(function (x) { return x.value === input.value; });
        return React.createElement("div", { style: { width: "100%" } },
            React.createElement(antd_1.AutoComplete, { dataSource: (this.state.options || []).map(function (itm) { return ({ value: itm.value, text: itm.name }); }), style: { width: "100%" }, onSelect: function (value) { return input.onChange(value); } }),
            React.createElement("div", { style: errorStyle }, this.props.meta.error));
    };
    return AutoCompleteSelect;
}(SelectInput));
var FileInput = (function (_super) {
    tslib_1.__extends(FileInput, _super);
    function FileInput() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.onChange = function (info) {
            var fileList = info.fileList;
            fileList = fileList.map(function (file) {
                if (file.response) {
                    file.url = file.response.url;
                }
                return file;
            });
            fileList = fileList.filter(function (file) {
                if (file.response) {
                    return file.status === "done";
                }
                return true;
            });
            _this.props.input.onChange(fileList);
        };
        _this.customRequest = function (_a) {
            var onSuccess = _a.onSuccess, onError = _a.onError, onProgress = _a.onProgress, data = _a.data, file = _a.file, filename = _a.filename;
            _this.props.fieldSchema.onFileChange(_this.props.input.value).then(function (previewUrl) {
                onProgress({ percent: 100 });
                onSuccess(previewUrl, null);
            }, function (err) { return onError(err); });
        };
        return _this;
    }
    FileInput.prototype.render = function () {
        return React.createElement("div", { style: { width: "100%" } },
            React.createElement(antd_8.Upload, { multiple: true, onChange: this.onChange, action: this.props.fieldSchema.action, customRequest: this.props.fieldSchema.onFileChange ? this.customRequest : undefined },
                React.createElement(antd_8.Button, null,
                    React.createElement(antd_8.Icon, { type: "upload" }),
                    " ",
                    this.props.fieldSchema.label)));
    };
    return FileInput;
}(React.Component));
var SelectRadio = (function (_super) {
    tslib_1.__extends(SelectRadio, _super);
    function SelectRadio() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SelectRadio.prototype.render = function () {
        var props = this.props;
        return React.createElement("div", null,
            React.createElement("div", { style: { paddingLeft: 0 } }, props.fieldSchema.label),
            React.createElement(RadioGroup, { id: props.input.name, disabled: props.disabled, value: this.props.input.value || false, onChange: function (v) { return props.input.onChange(v); } }, this.state.options ? this.state.options.map(function (option) { return (React.createElement(Radio, { style: {
                    width: "auto",
                    flex: 1,
                    whiteSpace: "nowrap",
                    margin: "0 15px 0 0"
                }, key: option.value, value: option.value }, option.name)); }) : React.createElement(Radio, { key: "...loading", value: "", disabled: true, label: "载入中" })),
            React.createElement("p", { style: errorStyle }, props.meta.error));
    };
    SelectRadio = tslib_1.__decorate([
        field_1.addType("radioGroup")
    ], SelectRadio);
    return SelectRadio;
}(SelectInput));
var DateRangeInput = (function (_super) {
    tslib_1.__extends(DateRangeInput, _super);
    function DateRangeInput() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    DateRangeInput.prototype.render = function () {
        var _this = this;
        var dateFormat = 'YYYY-MM-DD';
        var value = this.props.input.value;
        var from = value ? value[0] : undefined;
        var to = value ? value[1] : undefined;
        return React.createElement("div", null,
            React.createElement(RangePicker, { defaultValue: [from ? moment(from, dateFormat) : undefined, to ? moment(to, dateFormat) : undefined], disabled: this.props.disabled, format: dateFormat, onChange: function (date, dateStrings) { _this.props.input.onChange(dateStrings); } }));
    };
    return DateRangeInput;
}(React.Component));
var TextareaInput = (function (_super) {
    tslib_1.__extends(TextareaInput, _super);
    function TextareaInput() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TextareaInput.prototype.render = function () {
        var _this = this;
        return React.createElement("div", null,
            React.createElement("div", null, this.props.fieldSchema.label),
            React.createElement(TextArea, { disabled: this.props.disabled, value: this.props.input.value, onChange: function (value) { return _this.props.input.onChange(value); }, autosize: { minRows: 4, maxRows: 8 } }),
            React.createElement("div", { style: errorStyle }, this.props.meta.error));
    };
    return TextareaInput;
}(React.Component));
var AutoCompleteAsync = (function (_super) {
    tslib_1.__extends(AutoCompleteAsync, _super);
    function AutoCompleteAsync() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.onUpdateInput = function (name) {
            var throttle = _this.props.fieldSchema['throttle'] || 400;
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
        _this.onSelected = function (_a) {
            var value = _a.value;
            _this.props.input.onChange(value);
        };
        _this.state = {
            searchText: "",
            dataSource: []
        };
        return _this;
    }
    AutoCompleteAsync.prototype.componentWillMount = function () {
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
            React.createElement("div", null, fieldSchema.label),
            React.createElement(antd_1.AutoComplete, { dataSource: this.state.dataSource, style: { width: "100%" }, onSelect: function (value) { return input.onChange(value); }, disabled: this.props.disabled, onSearch: this.onUpdateInput, filterOption: true }),
            React.createElement("div", { style: errorStyle }, meta.error));
    };
    return AutoCompleteAsync;
}(React.Component));
var AutoCompleteText = (function (_super) {
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
            React.createElement("div", null, fieldSchema.label),
            React.createElement(antd_1.AutoComplete, { dataSource: fieldSchema.options.map(function (itm) { return ({ text: itm.name, value: itm.value }); }), onSearch: this.onUpdateInput, onSelect: function (value) { return input.onChange(value); }, filterOption: true }),
            React.createElement("div", { style: errorStyle }, meta.error));
    };
    return AutoCompleteText;
}(React.Component));
var ArrayFieldRenderer = (function (_super) {
    tslib_1.__extends(ArrayFieldRenderer, _super);
    function ArrayFieldRenderer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ArrayFieldRenderer.prototype.render = function () {
        var props = this.props;
        return React.createElement("div", { className: "clearfix array-field-container" },
            props.fields.map(function (name, i) {
                var children = props.fieldSchema.children;
                if (props.fieldSchema.getChildren)
                    children = props.fieldSchema.getChildren(props.fields.get(i)).filter(function (x) { return x; });
                return React.createElement("div", { key: i, className: "array-field-child" },
                    React.createElement("div", { className: "delete-button" },
                        React.createElement(antd_7.Tooltip, { placement: "topLeft", title: "删除", arrowPointAtCenter: true },
                            React.createElement(antd_8.Icon, { type: "minus", className: "icon-minus", style: { cursor: "pointer" }, onClick: function () { return props.fields.remove(i); } }))),
                    render_fields_1.renderFields(props.meta.form, children, props.keyPath + "[" + i + "]"));
            }),
            React.createElement("div", { className: "add-button" },
                React.createElement(antd_7.Tooltip, { placement: "topLeft", title: "添加", arrowPointAtCenter: true },
                    React.createElement(antd_8.Icon, { type: "plus", className: "icon-plus", style: { cursor: "pointer" }, onClick: function () { return props.fields.push(); } }))));
    };
    return ArrayFieldRenderer;
}(React.Component));
field_1.addType('text', TextInput);
field_1.addType('select', SelectInput);
field_1.addType('checkbox', CheckboxInput);
field_1.addType('date', DateInput);
field_1.addType('autocomplete-text', AutoCompleteText);
field_1.addType('datetime', DateTimeInput);
field_1.addType('datetimeRange', DateTimeRangeInput);
field_1.addType('number', NumberInput);
field_1.addType('autocomplete', AutoCompleteSelect);
field_1.addType("file", FileInput);
field_1.addType("dateRange", DateRangeInput);
field_1.addType("textarea", TextareaInput);
field_1.addType("password", TextInput);
field_1.addType("email", TextInput);
field_1.addType('text', TextInput);
field_1.addTypeWithWrapper("array", function (props) {
    return React.createElement("div", null,
        React.createElement("label", { className: "control-label" }, props.fieldSchema.label),
        React.createElement(FieldArray, { name: props.keyPath, rerenderOnEveryChange: Boolean(props.fieldSchema.getChildren), component: ArrayFieldRenderer, props: props }));
});
field_1.addType("autocomplete-async", AutoCompleteAsync);
buttons_1.setButton(function (props) {
    switch (props.type) {
        case 'submit':
            return React.createElement(antd_8.Button, { className: "raised-button", style: { margin: "15px" }, onClick: props.onClick, disabled: props.disabled, type: props.type, htmlType: props.type }, props.children);
        default:
            return React.createElement(antd_8.Button, { style: {
                    backgroundColor: "transparent",
                    margin: "15px"
                }, onClick: props.onClick, disabled: props.disabled, type: props.type, htmlType: props.type }, props.children);
    }
});
var formModule = require('../index');
var JSSForm = formModule.ReduxSchemaForm;
formModule.ReduxSchemaForm = react_jss_1.default(antd_jss_1.stylesheet)(function (_a) {
    var classes = _a.classes, sheet = _a.sheet, props = tslib_1.__rest(_a, ["classes", "sheet"]);
    return React.createElement("div", { className: classes.form },
        React.createElement(JSSForm, tslib_1.__assign({}, props)));
});
//# sourceMappingURL=antd.js.map