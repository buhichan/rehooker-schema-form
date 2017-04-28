"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Created by buhi on 2017/4/28.
 */
var React = require("react");
var form_1 = require("./form");
var TextField_1 = require("material-ui/TextField");
var SelectField_1 = require("material-ui/SelectField");
var MenuItem_1 = require("material-ui/MenuItem");
var Checkbox_1 = require("material-ui/Checkbox");
var DatePicker_1 = require("material-ui/DatePicker");
var RaisedButton_1 = require("material-ui/RaisedButton");
var FlatButton_1 = require("material-ui/FlatButton");
var Paper_1 = require("material-ui/Paper");
var AutoComplete_1 = require("material-ui/AutoComplete");
var muiThemeable_1 = require("material-ui/styles/muiThemeable");
var _a = require("redux-form"), Field = _a.Field, FieldArray = _a.FieldArray;
function NumberInput(props) {
    return React.createElement(TextField_1.default, { type: "number", id: props.input.name, className: "full-width", disabled: props.disabled, style: { width: "100%" }, name: props.input.name, floatingLabelText: props.fieldSchema.label, value: Number(props.input.value), onChange: function (e) { return props.input.onChange(Number(e.target['value'])); } });
}
function DateInput(props) {
    var DatePickerProps = {
        onChange: function (e, value) {
            return props.input.onChange(value.toLocaleDateString().replace(/\//g, '-'));
        }
    };
    var parsedDate = Date.parse(props.input.value);
    if (isNaN(props.input.value) && !isNaN(parsedDate)) {
        DatePickerProps['value'] = new Date(props.input.value);
    }
    return React.createElement(DatePicker_1.default, __assign({ DateTimeFormat: Intl.DateTimeFormat, locale: "zh-CN", floatingLabelText: props.fieldSchema.label, autoOk: true, id: props.input.name, container: "inline", mode: "portrait", cancelLabel: "取消", fullWidth: true, okLabel: "确认" }, DatePickerProps, { disabled: props.disabled }));
}
var TextFieldWithRequired = TextField_1.default;
function TextInput(props) {
    return React.createElement(TextFieldWithRequired, { required: props.required, type: props.type, id: props.input.name, className: "full-width", style: { width: "100%" }, name: props.input.name, disabled: props.disabled, multiLine: props.fieldSchema.multiLine, floatingLabelText: props.fieldSchema.label, value: props.input.value, onChange: props.input.onChange });
}
var CheckboxInput = (function (_super) {
    __extends(CheckboxInput, _super);
    function CheckboxInput() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CheckboxInput.prototype.componentWillMount = function () {
        this.props.input.onChange(this.props.input.checked);
    };
    CheckboxInput.prototype.render = function () {
        return React.createElement(Checkbox_1.default, { id: this.props.input.name, style: { width: "100%", margin: "32px 0 16px" }, disabled: this.props.disabled, onCheck: this.props.input.onChange, label: this.props.fieldSchema.label, value: this.props.input.value });
    };
    return CheckboxInput;
}(React.Component));
function SelectInput(props) {
    return React.createElement(SelectField_1.default, { id: props.input.name, disabled: props.disabled, floatingLabelText: props.fieldSchema.label, fullWidth: true, value: props.input.value, onChange: function (event, index, value) { return props.input.onChange(value); } }, props.fieldSchema.options.map(function (option) { return React.createElement(MenuItem_1.default, { className: "option", key: option.value, value: option.value, primaryText: option.name }); }));
}
var AutoCompleteSelect = (function (_super) {
    __extends(AutoCompleteSelect, _super);
    function AutoCompleteSelect() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    AutoCompleteSelect.prototype.componentDidUpdate = function () {
        this.ac.focus();
    };
    AutoCompleteSelect.prototype.render = function () {
        var _this = this;
        var value = this.props.fieldSchema.options.find(function (x) { return x.value === _this.props.input.value; });
        return React.createElement(AutoComplete_1.default, __assign({}, { id: this.props.input.name }, { maxSearchResults: 5, fullWidth: true, ref: function (ref) { return _this.ac = ref; }, filter: AutoComplete_1.default.fuzzyFilter, dataSource: this.props.fieldSchema.options, dataSourceConfig: AutoCompleteSelect.datasourceConfig, floatingLabelText: this.props.fieldSchema.label, searchText: value ? value.name : "", onNewRequest: function (value) {
                return _this.props.input.onChange(value['value']);
            } }));
    };
    return AutoCompleteSelect;
}(React.Component));
AutoCompleteSelect.datasourceConfig = { text: "name", value: "value" };
var AutoCompleteText = (function (_super) {
    __extends(AutoCompleteText, _super);
    function AutoCompleteText() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    AutoCompleteText.prototype.componentDidUpdate = function () {
        this.ac.focus();
    };
    AutoCompleteText.prototype.render = function () {
        var _this = this;
        return React.createElement(AutoComplete_1.default, __assign({}, { id: this.props.input.name }, { maxSearchResults: 5, fullWidth: true, ref: function (ref) { return _this.ac = ref; }, filter: AutoComplete_1.default.fuzzyFilter, dataSource: this.props.fieldSchema.options, dataSourceConfig: AutoCompleteText.datasourceConfig, floatingLabelText: this.props.fieldSchema.label, searchText: this.props.input.value, onUpdateInput: function (name) {
                var entry = _this.props.fieldSchema.options.find(function (x) { return x.name === name; });
                return _this.props.input.onChange(entry ? entry.value : name);
            } }));
    };
    return AutoCompleteText;
}(React.Component));
AutoCompleteText.datasourceConfig = { text: "name", value: "value" };
var ArrayFieldRenderer = muiThemeable_1.default()(function (props) {
    return React.createElement("div", { className: "clearfix" },
        props.fields.map(function (name, i) {
            return React.createElement(Paper_1.default, { key: i, zDepth: 0, style: {
                    padding: '15px',
                    margin: '15px 0',
                    borderTop: "2px solid " + props.muiTheme.palette.primary1Color,
                } },
                React.createElement("div", { className: "pull-right" },
                    React.createElement(FlatButton_1.default, { style: { minWidth: '30px', height: "30px", color: props.muiTheme.palette.accent1Color }, onClick: function () { return props.fields.remove(i); } },
                        React.createElement("i", { className: "fa fa-minus" }))),
                React.createElement("div", null, props.fieldSchema.children.map(function (field) {
                    var parsedKey = name + '.' + field.key;
                    return React.createElement("div", { key: parsedKey }, props.renderField(Object.assign({}, field, {
                        parsedKey: parsedKey
                    })));
                })));
        }),
        React.createElement(FlatButton_1.default, { style: { marginBottom: '15px', width: '100%' }, onClick: function () { return props.fields.push(); }, primary: true },
            React.createElement("i", { className: "fa fa-plus" })));
});
form_1.addType('number', function (_a) {
    var fieldSchema = _a.fieldSchema, rest = __rest(_a, ["fieldSchema"]);
    return React.createElement("div", null,
        React.createElement(Field, __assign({ name: fieldSchema.parsedKey }, rest, { fieldSchema: fieldSchema, component: NumberInput })));
});
var DefaultInput = function (_a) {
    var fieldSchema = _a.fieldSchema, rest = __rest(_a, ["fieldSchema"]);
    return React.createElement("div", null,
        React.createElement(Field, __assign({ name: fieldSchema.parsedKey }, rest, { fieldSchema: fieldSchema, component: TextInput })));
};
form_1.addType("password", DefaultInput);
form_1.addType("email", DefaultInput);
form_1.addType('text', DefaultInput);
form_1.addType('checkbox', function (_a) {
    var fieldSchema = _a.fieldSchema, rest = __rest(_a, ["fieldSchema"]);
    return React.createElement("div", null,
        React.createElement(Field, __assign({ name: fieldSchema.parsedKey }, rest, { fieldSchema: fieldSchema, component: CheckboxInput })));
});
form_1.addType('select', function (_a) {
    var fieldSchema = _a.fieldSchema, rest = __rest(_a, ["fieldSchema"]);
    return React.createElement("div", null,
        React.createElement(Field, __assign({ name: fieldSchema.parsedKey }, rest, { fieldSchema: fieldSchema, component: SelectInput })));
});
form_1.addType('autocomplete', function (_a) {
    var fieldSchema = _a.fieldSchema, rest = __rest(_a, ["fieldSchema"]);
    return React.createElement("div", null,
        React.createElement(Field, __assign({ name: fieldSchema.parsedKey }, rest, { fieldSchema: fieldSchema, component: AutoCompleteSelect })));
});
form_1.addType('autocomplete-text', function (_a) {
    var fieldSchema = _a.fieldSchema, rest = __rest(_a, ["fieldSchema"]);
    return React.createElement("div", null,
        React.createElement(Field, __assign({ name: fieldSchema.parsedKey }, rest, { fieldSchema: fieldSchema, component: AutoCompleteText })));
});
form_1.addType('date', function (_a) {
    var fieldSchema = _a.fieldSchema, rest = __rest(_a, ["fieldSchema"]);
    return React.createElement("div", null,
        React.createElement(Field, __assign({ name: fieldSchema.parsedKey }, rest, { fieldSchema: fieldSchema, component: DateInput })));
});
form_1.addType("array", function (props) {
    return React.createElement("div", null,
        React.createElement("label", { className: "control-label" }, props.fieldSchema.label),
        React.createElement(FieldArray, { name: props.fieldSchema.parsedKey, component: ArrayFieldRenderer, props: props }));
});
form_1.addType('hidden', function (_a) {
    var fieldSchema = _a.fieldSchema, rest = __rest(_a, ["fieldSchema"]);
    return React.createElement("div", null,
        React.createElement(Field, __assign({ id: 'rich-editor' + fieldSchema.label, name: fieldSchema.parsedKey }, rest, { component: 'input' })));
});
form_1.setButton(muiThemeable_1.default()(function (props) {
    switch (props.type) {
        case 'submit':
            return React.createElement(RaisedButton_1.default, { className: "raised-button", primary: true, label: props.children, labelStyle: { padding: "0" }, style: { margin: "15px" }, onClick: props.onClick, disabled: props.disabled, type: props.type });
        default:
            return React.createElement(RaisedButton_1.default, { backgroundColor: "transparent", style: {
                    backgroundColor: "transparent",
                    margin: "15px"
                }, buttonStyle: {
                    border: props.disabled ? "none" : "1px solid " + props.muiTheme.palette.primary1Color
                }, labelColor: props.muiTheme.palette.primary1Color, label: props.children, labelStyle: { padding: "0" }, onClick: props.onClick, disabled: props.disabled, type: props.type });
    }
}));
//# sourceMappingURL=material.js.map