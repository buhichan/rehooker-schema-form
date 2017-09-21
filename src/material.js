"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
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
var svg_icons_1 = require("material-ui/svg-icons");
var field_1 = require("./field");
var schema_node_1 = require("./schema-node");
var react_jss_1 = require("react-jss");
var redux_form_1 = require("redux-form");
var my_select_field_1 = require("./my-select-field");
function NumberInput(props) {
    return React.createElement(material_ui_1.TextField, tslib_1.__assign({}, props.input, { type: "number", errorText: props.meta.error, id: props.input.name, className: "full-width", disabled: props.disabled, style: { width: "100%" }, floatingLabelText: props.fieldSchema.label, value: Number(props.input.value), hintText: props.fieldSchema.placeholder, onChange: function (e) { return props.input.onChange(Number(e.target['value'])); } }));
}
var defaultDateTimeInputFormat = {
    year: "numeric",
    day: "2-digit",
    month: "2-digit",
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
};
function DateTimeInput(props) {
    var meta = props.meta, input = props.input, fieldSchema = props.fieldSchema;
    var value = input.value ?
        new Date(input.value) :
        undefined;
    return React.createElement("div", null,
        React.createElement("div", { style: { width: "50%", display: "inline-block" } },
            React.createElement(material_ui_1.DatePicker, { id: fieldSchema.key + "date", DateTimeFormat: Intl.DateTimeFormat, value: value, fullWidth: true, onChange: function (e, date) {
                    if (value) {
                        date.setHours(value.getHours());
                        date.setMinutes(value.getMinutes());
                        date.setSeconds(value.getSeconds());
                    }
                    input.onChange(date.toLocaleString([navigator.language], defaultDateTimeInputFormat));
                }, floatingLabelText: fieldSchema.label, errorText: meta.error, hintText: fieldSchema.placeholder, cancelLabel: "取消", locale: "zh-Hans", autoOk: true })),
        React.createElement("div", { style: { width: "50%", display: "inline-block" } },
            React.createElement(material_ui_1.TimePicker, { id: fieldSchema.key + "time", value: value, fullWidth: true, autoOk: true, cancelLabel: "取消", underlineStyle: { bottom: 10 }, format: "24hr", onChange: function (_, time) {
                    var newValue = value ? new Date(value) : new Date();
                    newValue.setHours(time.getHours());
                    newValue.setMinutes(time.getMinutes());
                    newValue.setSeconds(time.getSeconds());
                    input.onChange(newValue.toLocaleString([navigator.language], defaultDateTimeInputFormat));
                } })));
}
var DateInput = (function (_super) {
    tslib_1.__extends(DateInput, _super);
    function DateInput() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.onFocus = function (e) {
            if (e.target !== null) {
                _this.datepicker.openDialog();
            }
        };
        return _this;
    }
    DateInput.prototype.render = function () {
        var _this = this;
        var props = this.props;
        var DatePickerProps = {
            onChange: function (e, value) {
                return props.input.onChange(value.toLocaleDateString().replace(/\//g, '-'));
            }
        };
        var parsedDate = Date.parse(props.input.value);
        if (isNaN(props.input.value) && !isNaN(parsedDate)) {
            DatePickerProps['value'] = new Date(props.input.value);
        }
        return React.createElement(material_ui_1.DatePicker, tslib_1.__assign({ DateTimeFormat: Intl.DateTimeFormat, locale: "zh-CN", errorText: props.meta.error, floatingLabelText: props.fieldSchema.label, autoOk: true, id: props.input.name, container: "inline", mode: "portrait", cancelLabel: "取消", fullWidth: true, onFocus: this.onFocus, okLabel: "确认", ref: function (ref) { return _this.datepicker = ref; } }, DatePickerProps, { hintText: props.fieldSchema.placeholder, disabled: props.disabled }));
    };
    return DateInput;
}(React.PureComponent));
function TextInput(props) {
    return React.createElement(material_ui_1.TextField, tslib_1.__assign({}, props.input, { errorText: props.meta.error, required: props.required, type: props.type, id: props.input.name, className: "full-width", style: { width: "100%" }, disabled: props.disabled, hintText: props.fieldSchema.placeholder, multiLine: props.fieldSchema.multiLine, floatingLabelText: props.fieldSchema.label }));
}
function CheckboxInput(props) {
    var _a = props.input, onChange = _a.onChange, onBlur = _a.onBlur, value = _a.value, rest = tslib_1.__rest(_a, ["onChange", "onBlur", "value"]);
    rest['label'] = props.fieldSchema.label;
    return React.createElement(material_ui_1.Checkbox, tslib_1.__assign({}, rest, { onBlur: function (e) { return onBlur(value); }, style: { width: "100%", margin: "32px 0 16px" }, disabled: props.disabled, onChange: undefined, onCheck: function (e, v) { return onChange(v); }, checked: Boolean(value) }));
}
//fixme: todo: https://github.com/callemall/material-ui/issues/6080
var SelectInput = (function (_super) {
    tslib_1.__extends(SelectInput, _super);
    function SelectInput() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SelectInput.prototype.render = function () {
        var props = this.props;
        return React.createElement(my_select_field_1.SelectField, tslib_1.__assign({}, props.input, { onBlur: function () { return props.input.onBlur(props.input.value); }, id: props.input.name, disabled: props.disabled, floatingLabelText: props.fieldSchema.label, fullWidth: true, errorText: props.meta.error, hintText: props.fieldSchema.placeholder, multiple: props.fieldSchema.multiple, onChange: function (e, i, v) {
                e.target['value'] = v;
                props.input.onChange(e);
            } }), props.fieldSchema.options.map(function (option) { return (React.createElement(material_ui_1.MenuItem, { className: "option", key: option.value, value: option.value, primaryText: option.name })); }));
    };
    return SelectInput;
}(React.PureComponent));
var dataSourceConfig = { text: "name", value: "value" };
var BaseAutoComplete = (function (_super) {
    tslib_1.__extends(BaseAutoComplete, _super);
    function BaseAutoComplete() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    BaseAutoComplete.prototype.render = function () {
        var _a = this.props, fieldSchema = _a.fieldSchema, input = _a.input, meta = _a.meta, fullResult = _a.fullResult, filter = _a.filter, openOnFocus = _a.openOnFocus, searchText = _a.searchText, dataSource = _a.dataSource, onNewRequest = _a.onNewRequest, onUpdateInput = _a.onUpdateInput, classes = _a.classes;
        return React.createElement("div", { className: classes.autocomplete },
            React.createElement(material_ui_1.AutoComplete, { id: fieldSchema.name, maxSearchResults: fullResult ? undefined : 5, menuStyle: fullResult ? { maxHeight: "300px", overflowY: 'auto' } : undefined, fullWidth: true, openOnFocus: openOnFocus, hintText: fieldSchema.placeholder, errorText: meta.error, filter: filter || material_ui_1.AutoComplete.fuzzyFilter, dataSource: dataSource, dataSourceConfig: dataSourceConfig, floatingLabelText: fieldSchema.label, searchText: searchText, onNewRequest: onNewRequest, onUpdateInput: onUpdateInput }),
            input.value !== null && input.value !== undefined && input.value !== "" ? React.createElement(material_ui_1.IconButton, { style: { position: "absolute" }, className: "autocomplete-clear-button", onTouchTap: function () { return input.onChange(fieldSchema.defaultValue || null); } },
                React.createElement(svg_icons_1.ContentClear, null)) : null);
    };
    BaseAutoComplete = tslib_1.__decorate([
        react_jss_1.default({
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
    return BaseAutoComplete;
}(React.PureComponent));
var AutoCompleteSelect = (function (_super) {
    tslib_1.__extends(AutoCompleteSelect, _super);
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
        var _a = this.props, meta = _a.meta, input = _a.input, fieldSchema = _a.fieldSchema;
        return React.createElement(BaseAutoComplete, { input: input, meta: meta, fieldSchema: fieldSchema, dataSource: fieldSchema.options, searchText: input.value, onUpdateInput: this.onUpdateInput });
    };
    return AutoCompleteText;
}(React.Component));
var AutoCompleteAsync = (function (_super) {
    tslib_1.__extends(AutoCompleteAsync, _super);
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
                var result = _this.props.fieldSchema.options(name, _this.props);
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
        return entry ? entry.name : value;
    };
    AutoCompleteAsync.prototype.render = function () {
        var _a = this.props, meta = _a.meta, input = _a.input, fieldSchema = _a.fieldSchema;
        return React.createElement(BaseAutoComplete, { input: input, meta: meta, fullResult: true, filter: material_ui_1.AutoComplete.noFilter, fieldSchema: fieldSchema, dataSource: this.state.dataSource, searchText: this.findName(input.value), onUpdateInput: this.onUpdateInput, onNewRequest: this.onSelected });
    };
    return AutoCompleteAsync;
}(React.PureComponent));
/**
 * 这个组件比较复杂,必须考虑
 * getChildren存在的情况
 */
var ArrayFieldRenderer = (function (_super) {
    tslib_1.__extends(ArrayFieldRenderer, _super);
    function ArrayFieldRenderer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ArrayFieldRenderer.prototype.render = function () {
        var props = this.props;
        var muiTheme = props.muiTheme;
        return React.createElement("div", { className: "clearfix array-field-container" },
            props.fields.map(function (name, i) {
                var childValue = props.fields.get(i);
                var children = props.fieldSchema.children;
                if (props.fieldSchema.getChildren)
                    children = props.fieldSchema.getChildren(childValue).filter(function (x) { return x; });
                return React.createElement("div", { key: i, className: "array-field-child" },
                    React.createElement("div", { className: "delete-button" },
                        React.createElement(material_ui_1.IconButton, { style: { minWidth: '30px', height: "30px", color: props.muiTheme.palette.accent1Color }, onTouchTap: function () { return props.fields.remove(i); }, tooltip: "删除" },
                            React.createElement(remove_1.default, { hoverColor: muiTheme.palette.accent1Color }))),
                    React.createElement(schema_node_1.SchemaNode, { form: props.meta.form, keyPath: props.keyPath + "[" + i + "]", schema: children, initialValues: childValue }));
            }),
            React.createElement("div", { className: "add-button" },
                React.createElement(material_ui_1.IconButton, { tooltip: "添加", onTouchTap: function () { return props.fields.push(props.fieldSchema.defaultValue || {}); } },
                    React.createElement(add_1.default, { hoverColor: muiTheme.palette.primary1Color }))));
    };
    ArrayFieldRenderer = tslib_1.__decorate([
        muiThemeable_1.default()
    ], ArrayFieldRenderer);
    return ArrayFieldRenderer;
}(React.Component));
function TextAreaInput(props) {
    return React.createElement(material_ui_1.TextField, tslib_1.__assign({}, props.input, { errorText: props.meta.error, required: props.required, type: props.type, id: props.input.name, className: "full-width", style: { width: "100%" }, disabled: props.disabled, multiLine: true, floatingLabelText: props.fieldSchema.label }));
}
var FileInput = (function (_super) {
    tslib_1.__extends(FileInput, _super);
    function FileInput() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.state = {
            filename: _this.props.fieldSchema.label,
            uploading: false
        };
        _this.onChange = function (e) {
            var file = e.target.files[0];
            if (!_this.props.fieldSchema.onFileChange) {
                _this.setState({
                    filename: file.name.length > 15 ? ("..." + file.name.slice(-12)) : file.name
                });
                _this.props.input.onChange(file);
            }
            else {
                _this.setState({
                    filename: "上传中",
                    uploading: true
                });
                _this.props.fieldSchema.onFileChange(file).then(function (url) {
                    _this.props.input.onChange(url);
                    _this.setState({
                        filename: file.name.length > 15 ? ("..." + file.name.slice(-12)) : file.name,
                        uploading: false
                    });
                }).catch(function (e) {
                    _this.setState({
                        filename: "上传出错",
                        uploading: false
                    });
                });
            }
        };
        return _this;
    }
    FileInput.prototype.render = function () {
        var _a = this.props, meta = _a.meta, muiTheme = _a.muiTheme;
        var hasError = Boolean(meta.error);
        return React.createElement(material_ui_1.RaisedButton, { backgroundColor: hasError ? muiTheme.textField.errorColor : muiTheme.palette.primary1Color, style: { marginTop: 28 }, disabled: this.state.uploading, label: meta.error || this.state.filename, labelColor: "#FFFFFF", containerElement: "label", labelStyle: {
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
                overflow: "hidden"
            } },
            React.createElement("input", { type: "file", style: { display: "none" }, onChange: this.onChange }));
    };
    FileInput = tslib_1.__decorate([
        muiThemeable_1.default()
    ], FileInput);
    return FileInput;
}(React.PureComponent));
var DefaultInput = function (props) {
    return React.createElement("div", null,
        React.createElement(Field, tslib_1.__assign({ name: props.keyPath }, props, { component: TextInput })));
};
field_1.addType("password", DefaultInput);
field_1.addType("email", DefaultInput);
field_1.addType('text', DefaultInput);
field_1.addType('textarea', function (props) {
    return React.createElement("div", null,
        React.createElement(Field, tslib_1.__assign({ name: props.keyPath }, props, { component: TextAreaInput })));
});
field_1.addType("file", function (props) {
    return React.createElement("div", null,
        React.createElement(Field, tslib_1.__assign({ name: props.keyPath }, props, { component: FileInput })));
});
field_1.addType('number', function (props) {
    return React.createElement("div", null,
        React.createElement(Field, tslib_1.__assign({ name: props.keyPath }, props, { component: NumberInput })));
});
field_1.addType('checkbox', function (props) {
    return React.createElement("div", null,
        React.createElement(Field, tslib_1.__assign({ name: props.keyPath }, props, { component: CheckboxInput })));
});
field_1.addType('select', function (props) {
    return React.createElement("div", null,
        React.createElement(Field, tslib_1.__assign({ name: props.keyPath }, props, { component: SelectInput })));
});
field_1.addType('autocomplete', function (props) {
    return React.createElement("div", null,
        React.createElement(Field, tslib_1.__assign({ name: props.keyPath }, props, { component: AutoCompleteSelect })));
});
field_1.addType('autocomplete-text', function (props) {
    return React.createElement("div", null,
        React.createElement(Field, tslib_1.__assign({ name: props.keyPath }, props, { component: AutoCompleteText })));
});
field_1.addType("autocomplete-async", function (props) {
    return React.createElement("div", null,
        React.createElement(Field, tslib_1.__assign({ name: props.keyPath }, props, { component: AutoCompleteAsync })));
});
field_1.addType('date', function (props) {
    return React.createElement("div", null,
        React.createElement(Field, tslib_1.__assign({ name: props.keyPath }, props, { component: DateInput })));
});
field_1.addType('datetime', function (props) {
    return React.createElement("div", null,
        React.createElement(Field, tslib_1.__assign({ name: props.keyPath }, props, { component: DateTimeInput })));
});
field_1.addType("array", function (props) {
    return React.createElement("div", null,
        React.createElement("label", { className: "control-label" }, props.fieldSchema.label),
        React.createElement(FieldArray, { name: props.keyPath, rerenderOnEveryChange: Boolean(props.fieldSchema.getChildren), component: ArrayFieldRenderer, props: props }));
});
field_1.addType('hidden', function (props) {
    return React.createElement("div", null);
});
var Field = redux_form_1.Field;
var FieldArray = redux_form_1.FieldArray;
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
formModule.ReduxSchemaForm = muiThemeable_1.default()(react_jss_1.default(material_jss_1.stylesheet)(function (_a) {
    var classes = _a.classes, sheet = _a.sheet, props = tslib_1.__rest(_a, ["classes", "sheet"]);
    return React.createElement("div", { className: classes.form },
        React.createElement(JSSForm, tslib_1.__assign({}, props)));
}));
//# sourceMappingURL=material.js.map