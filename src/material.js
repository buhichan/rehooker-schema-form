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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
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
var material_ui_1 = require("material-ui");
var muiThemeable_1 = require("material-ui/styles/muiThemeable");
var add_1 = require("material-ui/svg-icons/content/add");
var remove_1 = require("material-ui/svg-icons/content/remove");
var material_jss_1 = require("./material.jss");
var react_redux_1 = require("react-redux");
var svg_icons_1 = require("material-ui/svg-icons");
var injectCSS = require('react-jss').default;
var _a = require("redux-form"), Field = _a.Field, FieldArray = _a.FieldArray;
function NumberInput(props) {
    return React.createElement(material_ui_1.TextField, __assign({}, props.input, { type: "number", errorText: props.meta.error, id: props.input.name, className: "full-width", disabled: props.disabled, style: { width: "100%" }, floatingLabelText: props.fieldSchema.label, value: Number(props.input.value), hintText: props.fieldSchema.placeholder, onChange: function (e) { return props.input.onChange(Number(e.target['value'])); } }));
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
    return React.createElement(material_ui_1.DatePicker, __assign({ DateTimeFormat: Intl.DateTimeFormat, locale: "zh-CN", errorText: props.meta.error, floatingLabelText: props.fieldSchema.label, autoOk: true, id: props.input.name, container: "inline", mode: "portrait", cancelLabel: "取消", fullWidth: true, okLabel: "确认" }, DatePickerProps, { hintText: props.fieldSchema.placeholder, disabled: props.disabled }));
}
function TextInput(props) {
    return React.createElement(material_ui_1.TextField, __assign({}, props.input, { errorText: props.meta.error, required: props.required, type: props.type, id: props.input.name, className: "full-width", style: { width: "100%" }, disabled: props.disabled, hintText: props.fieldSchema.placeholder, multiLine: props.fieldSchema.multiLine, floatingLabelText: props.fieldSchema.label }));
}
function CheckboxInput(props) {
    var _a = props.input, onChange = _a.onChange, onBlur = _a.onBlur, value = _a.value, rest = __rest(_a, ["onChange", "onBlur", "value"]);
    return React.createElement(material_ui_1.Checkbox, { onBlur: function (e) { return onBlur(value); }, style: { width: "100%", margin: "32px 0 16px" }, disabled: props.disabled, onChange: undefined, onCheck: function (e, v) { return onChange(v); }, label: props.fieldSchema.label, checked: Boolean(value) });
}
function SelectInput(props) {
    return React.createElement(material_ui_1.SelectField, __assign({}, props.input, { id: props.input.name, disabled: props.disabled, floatingLabelText: props.fieldSchema.label, fullWidth: true, errorText: props.meta.error, hintText: props.fieldSchema.placeholder, multiple: props.fieldSchema.multiple, onChange: function (e, i, v) {
            e.target['value'] = v;
            props.input.onChange(e);
        } }), props.fieldSchema.options.map(function (option) { return React.createElement(material_ui_1.MenuItem, { className: "option", key: option.value, value: option.value, primaryText: option.name }); }));
}
var dataSourceConfig = { text: "name", value: "value" };
var BaseAutoComplete = (function (_super) {
    __extends(BaseAutoComplete, _super);
    function BaseAutoComplete() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    BaseAutoComplete.prototype.render = function () {
        var _a = this.props, fieldSchema = _a.fieldSchema, input = _a.input, meta = _a.meta, fullResult = _a.fullResult, openOnFocus = _a.openOnFocus, searchText = _a.searchText, dataSource = _a.dataSource, onNewRequest = _a.onNewRequest, onUpdateInput = _a.onUpdateInput, classes = _a.classes;
        return React.createElement("div", { className: classes.autocomplete },
            React.createElement(material_ui_1.AutoComplete, { id: fieldSchema.name, maxSearchResults: fullResult ? undefined : 5, menuStyle: fullResult ? { maxHeight: "300px", overflowY: 'auto' } : undefined, fullWidth: true, openOnFocus: openOnFocus, hintText: fieldSchema.placeholder, errorText: meta.error, filter: material_ui_1.AutoComplete.fuzzyFilter, dataSource: dataSource, dataSourceConfig: dataSourceConfig, floatingLabelText: fieldSchema.label, searchText: searchText, onNewRequest: onNewRequest, onUpdateInput: onUpdateInput }),
            input.value !== null && input.value !== undefined && input.value !== "" ? React.createElement(material_ui_1.IconButton, { style: { position: "absolute" }, className: "autocomplete-clear-button", onTouchTap: function () { return input.onChange(fieldSchema.defaultValue || null); } },
                React.createElement(svg_icons_1.ContentClear, null)) : null);
    };
    return BaseAutoComplete;
}(React.PureComponent));
BaseAutoComplete = __decorate([
    injectCSS({
        autocomplete: {
            position: "relative",
            "&>.autocomplete-clear-button": {
                position: "absolute",
                top: "15px",
                right: 0,
                opacity: 0,
            },
            "&:hover>.autocomplete-clear-button": {
                opacity: 1
            }
        }
    })
], BaseAutoComplete);
var AutoCompleteSelect = (function (_super) {
    __extends(AutoCompleteSelect, _super);
    function AutoCompleteSelect() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.onNewRequest = function (value) {
            return _this.props.input.onChange(value['value']);
        };
        return _this;
    }
    AutoCompleteSelect.prototype.render = function () {
        var _a = this.props, meta = _a.meta, input = _a.input, fieldSchema = _a.fieldSchema;
        var value = fieldSchema.options.find(function (x) { return x.value === input.value; });
        return React.createElement(BaseAutoComplete, { fieldSchema: fieldSchema, input: input, meta: meta, openOnFocus: true, searchText: value ? value.name : "", dataSource: fieldSchema.options, onNewRequest: this.onNewRequest });
    };
    return AutoCompleteSelect;
}(React.Component));
var AutoCompleteText = (function (_super) {
    __extends(AutoCompleteText, _super);
    function AutoCompleteText() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.onUpdateInput = function (name) {
            var entry = _this.props.fieldSchema.options.find(function (x) { return x.name === name; });
            return _this.props.input.onChange(entry ? entry.value : name);
        };
        return _this;
    }
    AutoCompleteText.prototype.render = function () {
        var _a = this.props, meta = _a.meta, input = _a.input, fieldSchema = _a.fieldSchema;
        return React.createElement(BaseAutoComplete, { input: input, meta: meta, fieldSchema: fieldSchema, dataSource: fieldSchema.options, searchText: input.value, onUpdateInput: this.onUpdateInput });
    };
    return AutoCompleteText;
}(React.Component));
var AutoCompleteAsync = (function (_super) {
    __extends(AutoCompleteAsync, _super);
    function AutoCompleteAsync() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.onUpdateInput = function (name, dataSource, params) {
            if (!params || params.source !== 'change')
                return;
            var throttle = _this.props.fieldSchema['throttle'] || 400;
            _this.setState({
                searchText: name
            });
            if (_this.pendingUpdate)
                clearTimeout(_this.pendingUpdate);
            _this.pendingUpdate = setTimeout(function () {
                _this.fetchingQuery = name;
                var result = _this.props.fieldSchema.options(name);
                if (result instanceof Promise)
                    result.then(function (options) {
                        if (_this.fetchingQuery === name && _this.$isMounted)
                            _this.setState({
                                dataSource: options
                            });
                    });
                else
                    _this.setState({
                        dataSource: result
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
        return entry ? entry.name : "";
    };
    AutoCompleteAsync.prototype.render = function () {
        var _a = this.props, meta = _a.meta, input = _a.input, fieldSchema = _a.fieldSchema;
        return React.createElement(BaseAutoComplete, { input: input, meta: meta, fullResult: true, fieldSchema: fieldSchema, dataSource: this.state.dataSource, searchText: this.findName(input.value), onUpdateInput: this.onUpdateInput, onNewRequest: this.onSelected });
    };
    return AutoCompleteAsync;
}(React.PureComponent));
var ArrayFieldRenderer = (function (_super) {
    __extends(ArrayFieldRenderer, _super);
    function ArrayFieldRenderer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ArrayFieldRenderer.prototype.render = function () {
        var props = this.props;
        var muiTheme = props.muiTheme;
        return React.createElement("div", { className: "clearfix" },
            props.fields.map(function (name, i) {
                var children = props.fieldSchema.children;
                if (props.fieldSchema.getChildren)
                    children = props.fieldSchema.getChildren(props.fields.get(i)).filter(function (x) { return x; });
                return React.createElement(material_ui_1.Paper, { key: i, zDepth: 0, style: {
                        padding: '15px',
                        margin: '15px 0',
                        borderTop: "2px solid " + props.muiTheme.palette.primary1Color,
                    } },
                    React.createElement("div", { className: "pull-right" },
                        React.createElement(material_ui_1.IconButton, { style: { minWidth: '30px', height: "30px", color: props.muiTheme.palette.accent1Color }, onTouchTap: function () { return props.fields.remove(i); }, tooltip: "删除" },
                            React.createElement(remove_1.default, { hoverColor: muiTheme.palette.accent1Color }))),
                    React.createElement("div", null, children && children.map(function (field) {
                        var parsedKey = name + '.' + field.key;
                        return React.createElement("div", { key: parsedKey }, props.renderField(__assign({}, field, { parsedKey: parsedKey })));
                    })));
            }),
            React.createElement("div", { style: { textAlign: "center" } },
                React.createElement(material_ui_1.IconButton, { style: { marginBottom: '15px' }, tooltip: "添加", onTouchTap: function () { return props.fields.push({}); } },
                    React.createElement(add_1.default, { hoverColor: muiTheme.palette.primary1Color }))));
    };
    return ArrayFieldRenderer;
}(React.Component));
ArrayFieldRenderer = __decorate([
    muiThemeable_1.default()
], ArrayFieldRenderer);
function TextAreaInput(props) {
    return React.createElement(material_ui_1.TextField, __assign({}, props.input, { errorText: props.meta.error, required: props.required, type: props.type, id: props.input.name, className: "full-width", style: { width: "100%" }, disabled: props.disabled, multiLine: true, floatingLabelText: props.fieldSchema.label }));
}
form_1.addType('textarea', function (_a) {
    var fieldSchema = _a.fieldSchema, rest = __rest(_a, ["fieldSchema"]);
    return React.createElement("div", null,
        React.createElement(Field, __assign({ name: fieldSchema.parsedKey }, rest, { fieldSchema: fieldSchema, component: TextAreaInput })));
});
form_1.addType("file", function (_a) {
    var fieldSchema = _a.fieldSchema, rest = __rest(_a, ["fieldSchema"]);
    return React.createElement("div", null,
        React.createElement(Field, __assign({ name: fieldSchema.parsedKey }, rest, { fieldSchema: fieldSchema, component: FileInput })));
});
var FileInput = (function (_super) {
    __extends(FileInput, _super);
    function FileInput() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.state = {
            filename: _this.props.fieldSchema.label
        };
        _this.onChange = function (e) {
            var file = e.target.files[0];
            _this.setState({
                filename: file.name
            });
            _this.props.input.onChange(file);
        };
        return _this;
    }
    FileInput.prototype.render = function () {
        var _a = this.props, meta = _a.meta, muiTheme = _a.muiTheme;
        var hasError = Boolean(meta.error);
        return React.createElement(material_ui_1.RaisedButton, { backgroundColor: hasError ? muiTheme.textField.errorColor : muiTheme.palette.primary1Color, style: { marginTop: 28 }, label: meta.error || this.state.filename, labelColor: "#FFFFFF", containerElement: "label", labelStyle: {
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
                overflow: "hidden"
            } },
            React.createElement("input", { type: "file", style: { display: "none" }, onChange: this.onChange }));
    };
    return FileInput;
}(React.PureComponent));
FileInput = __decorate([
    muiThemeable_1.default()
], FileInput);
var ConnectedArrayFieldRenderer = react_redux_1.connect(function (s, p) {
    return __assign({ form: s.form[p.meta.form] }, p);
})(ArrayFieldRenderer);
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
form_1.addType("autocomplete-async", function (_a) {
    var fieldSchema = _a.fieldSchema, rest = __rest(_a, ["fieldSchema"]);
    return React.createElement("div", null,
        React.createElement(Field, __assign({ name: fieldSchema.parsedKey }, rest, { fieldSchema: fieldSchema, component: AutoCompleteAsync })));
});
form_1.addType('date', function (_a) {
    var fieldSchema = _a.fieldSchema, rest = __rest(_a, ["fieldSchema"]);
    return React.createElement("div", null,
        React.createElement(Field, __assign({ name: fieldSchema.parsedKey }, rest, { fieldSchema: fieldSchema, component: DateInput })));
});
form_1.addType("array", function (props) {
    return React.createElement("div", null,
        React.createElement("label", { className: "control-label" }, props.fieldSchema.label),
        React.createElement(FieldArray, { name: props.fieldSchema.parsedKey, component: props.fieldSchema.getChildren ? ConnectedArrayFieldRenderer : ArrayFieldRenderer, props: props }));
});
form_1.addType('hidden', function (_a) {
    var fieldSchema = _a.fieldSchema, renderField = _a.renderField, rest = __rest(_a, ["fieldSchema", "renderField"]);
    return React.createElement("div", null,
        React.createElement(Field, __assign({ id: 'rich-editor' + fieldSchema.label, name: fieldSchema.parsedKey }, rest, { component: 'input' })));
});
form_1.setButton(muiThemeable_1.default()(function (props) {
    switch (props.type) {
        case 'submit':
            return React.createElement(material_ui_1.RaisedButton, { className: "raised-button", primary: true, label: props.children, labelStyle: { padding: "0" }, style: { margin: "15px" }, onClick: props.onClick, disabled: props.disabled, type: props.type });
        default:
            return React.createElement(material_ui_1.RaisedButton, { backgroundColor: "transparent", style: {
                    backgroundColor: "transparent",
                    margin: "15px"
                }, buttonStyle: {
                    border: props.disabled ? "none" : "1px solid " + props.muiTheme.palette.primary1Color
                }, labelColor: props.muiTheme.palette.primary1Color, label: props.children, labelStyle: { padding: "0" }, onClick: props.onClick, disabled: props.disabled, type: props.type });
    }
}));
var formModule = require('../index');
var JSSForm = formModule.ReduxSchemaForm;
formModule.ReduxSchemaForm = muiThemeable_1.default()(injectCSS(material_jss_1.stylesheet)(function (_a) {
    var classes = _a.classes, sheet = _a.sheet, rest = __rest(_a, ["classes", "sheet"]);
    return React.createElement("div", { className: classes.form },
        React.createElement(JSSForm, __assign({}, rest)));
}));
//# sourceMappingURL=material.js.map