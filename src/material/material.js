"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
/**
 * Created by buhi on 2017/4/28.
 */
var arrow_downward_1 = require("material-ui/svg-icons/navigation/arrow-downward");
var arrow_upward_1 = require("material-ui/svg-icons/navigation/arrow-upward");
var React = require("react");
var material_ui_1 = require("material-ui");
var muiThemeable_1 = require("material-ui/styles/muiThemeable");
var add_1 = require("material-ui/svg-icons/content/add");
var remove_1 = require("material-ui/svg-icons/content/remove");
require("./material.jss");
var svg_icons_1 = require("material-ui/svg-icons");
var field_1 = require("../field");
var react_jss_1 = require("react-jss");
var redux_form_1 = require("redux-form");
var SelectField_1 = require("material-ui/SelectField");
var render_fields_1 = require("../render-fields");
var RadioButton_1 = require("material-ui/RadioButton");
var CircularProgress_1 = require("material-ui/CircularProgress");
var buttons_1 = require("../buttons");
var moment = require("moment");
var errorTextAsHintTextStyle = function (muiTheme) { return ({
    color: muiTheme.textField.hintColor
}); };
var NumberInput = muiThemeable_1.default()(function NumberInput(props) {
    return React.createElement(material_ui_1.TextField, tslib_1.__assign({}, props.input, { type: "number", id: props.input.name, className: "full-width", disabled: props.disabled, style: { width: "100%" }, floatingLabelText: props.fieldSchema.label, floatingLabelStyle: props.meta.error ? undefined : errorTextAsHintTextStyle(props.muiTheme), value: Number(props.input.value), errorText: props.meta.error || props.fieldSchema.placeholder, errorStyle: props.meta.error ? undefined : errorTextAsHintTextStyle(props.muiTheme), onChange: function (e) { return props.input.onChange(Number(e.target['value'])); } }));
});
var defaultDateInputFormat = { year: "numeric", month: "2-digit", day: "2-digit" };
var defaultDateTimeInputFormat = {
    year: "numeric",
    day: "2-digit",
    month: "2-digit",
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
};
var GenericPlaceHolder = function (_a) {
    var placeholder = _a.placeholder;
    return React.createElement("small", { style: { marginLeft: 5, opacity: 0.5 } }, placeholder);
};
function formatDateTime(date) {
    //return date.toLocaleString([navigator&&navigator.language||"zh-CN"],defaultDateTimeInputFormat).replace(/\//g,'-')
    return moment(date).format("YYYY-MM-DD HH:mm:ss");
}
function formatDate(date) {
    //return date.toLocaleString([navigator&&navigator.language||"zh-CN"],defaultDateInputFormat).replace(/\//g,'-')
    return moment(date).format("YYYY-MM-DD");
}
var timePickerStyle = { bottom: 40, position: "relative" };
var DateTimeInput = muiThemeable_1.default()(function DateTimeInput(props) {
    var meta = props.meta, input = props.input, fieldSchema = props.fieldSchema;
    var value = input.value ?
        moment(input.value) :
        undefined;
    if (!value || !value.isValid())
        value = undefined;
    else
        value = value.toDate();
    return React.createElement("div", null,
        React.createElement("div", { style: { width: "50%", display: "inline-block" } },
            React.createElement(material_ui_1.DatePicker, { id: fieldSchema.key + "date", DateTimeFormat: Intl.DateTimeFormat, value: value, fullWidth: true, errorText: meta.error || fieldSchema.placeholder, errorStyle: meta.error ? undefined : errorTextAsHintTextStyle(props.muiTheme), onChange: function (e, date) {
                    if (value) {
                        date.setHours(value.getHours());
                        date.setMinutes(value.getMinutes());
                        date.setSeconds(value.getSeconds());
                    }
                    input.onChange(formatDateTime(date));
                }, floatingLabelText: fieldSchema.label, cancelLabel: "取消", locale: "zh-Hans", autoOk: true })),
        React.createElement("div", { style: { width: "50%", display: "inline-block" } },
            React.createElement(material_ui_1.TimePicker, { id: fieldSchema.key + "time", value: value, fullWidth: true, autoOk: true, style: timePickerStyle, errorText: " ", errorStyle: meta.error ? undefined : errorTextAsHintTextStyle(props.muiTheme), cancelLabel: "取消", underlineStyle: { bottom: 10 }, format: "24hr", onChange: function (_, time) {
                    var newValue = value ? new Date(value) : new Date();
                    newValue.setHours(time.getHours());
                    newValue.setMinutes(time.getMinutes());
                    newValue.setSeconds(time.getSeconds());
                    input.onChange(formatDateTime(newValue));
                } })));
});
var DateInput = /** @class */ (function (_super) {
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
                return props.input.onChange(formatDate(value));
            }
        };
        var parsedDate = moment(props.input.value);
        if (parsedDate.isValid()) {
            DatePickerProps['value'] = parsedDate.toDate();
        }
        return React.createElement(material_ui_1.DatePicker, tslib_1.__assign({ DateTimeFormat: Intl.DateTimeFormat, locale: "zh-CN", errorText: props.meta.error || props.fieldSchema.placeholder, errorStyle: props.meta.error ? undefined : errorTextAsHintTextStyle(props.muiTheme), floatingLabelText: props.fieldSchema.label, autoOk: true, id: props.input.name, container: "inline", mode: "portrait", cancelLabel: "取消", fullWidth: true, onFocus: this.onFocus, okLabel: "确认", ref: function (ref) { return _this.datepicker = ref; } }, DatePickerProps, { hintText: props.fieldSchema.placeholder, disabled: props.disabled }));
    };
    DateInput = tslib_1.__decorate([
        muiThemeable_1.default()
    ], DateInput);
    return DateInput;
}(React.PureComponent));
function TextInput(props) {
    return React.createElement(material_ui_1.TextField, tslib_1.__assign({}, props.input, { value: props.input.value || "", errorText: props.meta.error, required: props.required, type: props.fieldSchema.type, id: props.input.name, className: "full-width", style: { width: "100%" }, disabled: props.disabled, hintText: props.fieldSchema.placeholder, multiLine: props.fieldSchema.multiLine, floatingLabelText: props.fieldSchema.label }));
}
function CheckboxInput(props) {
    var _a = props.input, onChange = _a.onChange, onBlur = _a.onBlur, value = _a.value, rest = tslib_1.__rest(_a, ["onChange", "onBlur", "value"]);
    rest['label'] = React.createElement("span", null,
        props.fieldSchema.label,
        React.createElement(GenericPlaceHolder, { placeholder: props.fieldSchema.placeholder }));
    return React.createElement(material_ui_1.Checkbox, tslib_1.__assign({}, rest, { onBlur: function (e) { return onBlur(value); }, style: { width: "100%", margin: "32px 0 16px" }, disabled: props.disabled, onChange: undefined, onCheck: function (e, v) { return onChange(v); }, checked: Boolean(value) }));
}
//fixme: todo: https://github.com/callemall/material-ui/issues/6080
function resolvefieldSchemaOptions(Component) {
    return /** @class */ (function (_super) {
        tslib_1.__extends(OptionsResolver, _super);
        function OptionsResolver() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.state = {
                options: null
            };
            _this.unmounted = false;
            return _this;
        }
        OptionsResolver.prototype.reload = function (props) {
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
        OptionsResolver.prototype.componentWillReceiveProps = function (nextProps) {
            if (nextProps.fieldSchema.options !== this.props.fieldSchema.options)
                this.reload(nextProps);
        };
        OptionsResolver.prototype.componentWillUnmount = function () {
            this.unmounted = true;
        };
        OptionsResolver.prototype.componentWillMount = function () {
            this.reload(this.props);
        };
        OptionsResolver.prototype.render = function () {
            return React.createElement(Component, tslib_1.__assign({}, this.props, { options: this.state.options }));
        };
        return OptionsResolver;
    }(React.PureComponent));
}
exports.resolvefieldSchemaOptions = resolvefieldSchemaOptions;
var SelectInput = muiThemeable_1.default()(resolvefieldSchemaOptions(function (props) {
    var input = props.input, fieldSchema = props.fieldSchema, meta = props.meta, options = props.options, muiTheme = props.muiTheme;
    return React.createElement(SelectField_1.default, tslib_1.__assign({}, input, { onBlur: function () { return input.onBlur(input.value); }, id: input.name, disabled: fieldSchema.disabled, floatingLabelText: fieldSchema.label, fullWidth: true, errorText: meta.error, floatingLabelFixed: !!fieldSchema.placeholder, hintText: fieldSchema.placeholder, multiple: fieldSchema.multiple, onChange: function (e, i, v) {
            e.target['value'] = v;
            input.onChange(e);
        } }), options ? options.map(function (option) { return (React.createElement(material_ui_1.MenuItem, { className: "option", key: option.value, value: option.value, primaryText: option.name })); }) : React.createElement(material_ui_1.MenuItem, { className: "option", value: null, primaryText: fieldSchema.loadingText || "载入中" }));
}));
var dataSourceConfig = { text: "name", value: "value" };
var BaseAutoComplete = react_jss_1.default({
    autocomplete: {
        position: "relative",
        "&:hover": {
            "&>$clearButton": {
                opacity: 1
            }
        }
    },
    "clearButton": {
        position: "absolute",
        top: 20,
        right: 0,
        opacity: 0,
    }
})(/** @class */ (function (_super) {
    tslib_1.__extends(BaseAutoComplete, _super);
    function BaseAutoComplete() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.state = {
            searchText: _this.props.searchText
        };
        _this.onUpdateInput = (function (name, datasource, params) {
            _this.setState({
                searchText: name
            });
            _this.props.onUpdateInput && _this.props.onUpdateInput(name, datasource, params);
        });
        return _this;
    }
    BaseAutoComplete.prototype.componentWillReceiveProps = function (nextProps) {
        /**
         * 这里不能直接接受searchText,因为searchText是由我来保存的,我这里只需要reinitialize
         */
        if (nextProps.searchText !== this.props.searchText)
            this.setState({
                searchText: nextProps.searchText
            });
    };
    BaseAutoComplete.prototype.render = function () {
        var _this = this;
        var _a = this.props, classes = _a.classes, fieldSchema = _a.fieldSchema, fullResult = _a.fullResult, openOnFocus = _a.openOnFocus, meta = _a.meta, filter = _a.filter, dataSource = _a.dataSource, onNewRequest = _a.onNewRequest, onUpdateInput = _a.onUpdateInput, input = _a.input, loading = _a.loading;
        return React.createElement("div", { className: classes.autocomplete },
            React.createElement(material_ui_1.AutoComplete, { id: fieldSchema.name, maxSearchResults: fullResult ? undefined : 5, menuStyle: fullResult ? { maxHeight: "300px", overflowY: 'auto' } : undefined, fullWidth: true, openOnFocus: openOnFocus, hintText: fieldSchema.placeholder, errorText: meta.error, filter: filter || material_ui_1.AutoComplete.fuzzyFilter, dataSource: dataSource, dataSourceConfig: dataSourceConfig, floatingLabelText: fieldSchema.label, searchText: this.state.searchText, onNewRequest: onNewRequest, onUpdateInput: this.onUpdateInput }),
            loading ? React.createElement(CircularProgress_1.default, { size: 30, style: {
                    position: "absolute",
                    top: 22,
                    right: 18
                } })
                : input.value !== null && input.value !== undefined && input.value !== "" ? React.createElement(material_ui_1.IconButton, { style: { position: "absolute" }, className: classes.clearButton, onClick: function () {
                        input.onChange(fieldSchema.defaultValue || null);
                        _this.setState({
                            searchText: ""
                        });
                    } },
                    React.createElement(svg_icons_1.ContentClear, null)) : null);
    };
    return BaseAutoComplete;
}(React.PureComponent)));
var AutoCompleteSelect = /** @class */ (function (_super) {
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
        var options = (this.props.options || []);
        var value = options.find(function (x) { return x.value === input.value; });
        return React.createElement(BaseAutoComplete, { fieldSchema: fieldSchema, input: input, meta: meta, openOnFocus: true, fullResult: fieldSchema.fullResult, searchText: value ? value.name : input.value || "", dataSource: options, onNewRequest: this.onNewRequest });
    };
    AutoCompleteSelect = tslib_1.__decorate([
        resolvefieldSchemaOptions
    ], AutoCompleteSelect);
    return AutoCompleteSelect;
}(React.PureComponent));
var AutoCompleteText = /** @class */ (function (_super) {
    tslib_1.__extends(AutoCompleteText, _super);
    function AutoCompleteText() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.onUpdateInput = function (name) {
            var options = (_this.props.options || []);
            var entry = options.find(function (x) { return x.name === name; });
            return _this.props.input.onChange(entry ? entry.value : name);
        };
        return _this;
    }
    AutoCompleteText.prototype.render = function () {
        var _a = this.props, meta = _a.meta, input = _a.input, fieldSchema = _a.fieldSchema;
        var options = (this.props.options || []);
        return React.createElement(BaseAutoComplete, { input: input, meta: meta, fieldSchema: fieldSchema, fullResult: fieldSchema.fullResult, dataSource: options, searchText: input.value, onUpdateInput: this.onUpdateInput });
    };
    AutoCompleteText = tslib_1.__decorate([
        resolvefieldSchemaOptions
    ], AutoCompleteText);
    return AutoCompleteText;
}(React.PureComponent));
var AutoCompleteAsync = /** @class */ (function (_super) {
    tslib_1.__extends(AutoCompleteAsync, _super);
    function AutoCompleteAsync() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.onUpdateInput = function (name, dataSource, params) {
            if (!params || params.source !== 'change')
                return;
            var throttle = _this.props.fieldSchema.throttle || 400;
            _this.setState({
                loading: true,
                dataSource: []
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
                                dataSource: options,
                                loading: false
                            });
                    }, function (e) {
                        _this.setState({
                            loading: false
                        });
                        throw e;
                    });
                else
                    _this.setState({
                        dataSource: result,
                        loading: false
                    });
            }, throttle);
        };
        _this.onSelected = function (_a) {
            var value = _a.value;
            _this.props.input.onChange(value);
        };
        _this.state = {
            loading: false,
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
    AutoCompleteAsync.prototype.findInitialSearchText = function (value, showValueWhenNoEntryIsFound) {
        if (value === "" || value === undefined || value === null)
            return "";
        var entry = this.state.dataSource.find(function (x) { return x.value === value; });
        return entry ? entry.name : showValueWhenNoEntryIsFound ? value : "";
    };
    AutoCompleteAsync.prototype.render = function () {
        var _a = this.props, meta = _a.meta, input = _a.input, fieldSchema = _a.fieldSchema;
        return React.createElement(BaseAutoComplete, { input: input, meta: meta, fullResult: true, loading: this.state.loading, filter: material_ui_1.AutoComplete.noFilter, fieldSchema: fieldSchema, dataSource: this.state.dataSource, searchText: this.findInitialSearchText(input.value, fieldSchema.showValueWhenNoEntryIsFound), onUpdateInput: this.onUpdateInput, onNewRequest: this.onSelected });
    };
    return AutoCompleteAsync;
}(React.PureComponent));
/**
 * 这个组件比较复杂,必须考虑
 * getChildren存在的情况
 * update: 不必了,以后就没有getChildren了,统一用listens
 */
var ArrayFieldRenderer = /** @class */ (function (_super) {
    tslib_1.__extends(ArrayFieldRenderer, _super);
    function ArrayFieldRenderer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ArrayFieldRenderer.prototype.render = function () {
        var props = this.props;
        var muiTheme = props.muiTheme;
        var fields = props.fields;
        var _a = props.fieldSchema, children = _a.children, getChildren = _a.getChildren, _b = _a.itemsPerRow, itemsPerRow = _b === void 0 ? 2 : _b, disableCreate = _a.disableCreate, disableDelete = _a.disableDelete, disableSort = _a.disableSort;
        return React.createElement("div", { className: "clearfix array-field-container" },
            fields.map(function (name, i) {
                var childValue = props.fields.get(i);
                var meta = props.meta;
                var keyPath = props.keyPath;
                if (getChildren)
                    children = getChildren(childValue).filter(function (x) { return x; });
                return React.createElement("div", { key: i, className: "array-field-child", style: { width: "calc(" + 100 / itemsPerRow + "% - 20px)" } },
                    React.createElement("div", { className: "item-buttons" },
                        i === 0 || disableSort ? null : React.createElement(material_ui_1.IconButton, { style: { minWidth: '30px', height: "30px", color: muiTheme.palette.accent1Color }, onClick: function () { return fields.swap(i, i - 1); }, tooltip: "前移" },
                            React.createElement(arrow_upward_1.default, { hoverColor: muiTheme.palette.accent1Color })),
                        i >= fields.length - 1 || disableSort ? null : React.createElement(material_ui_1.IconButton, { style: { minWidth: '30px', height: "30px", color: muiTheme.palette.accent1Color }, onClick: function () { return fields.swap(i, i + 1); }, tooltip: "后移" },
                            React.createElement(arrow_downward_1.default, { hoverColor: muiTheme.palette.accent1Color })),
                        disableDelete ? null : React.createElement(material_ui_1.IconButton, { style: { minWidth: '30px', height: "30px", color: muiTheme.palette.accent1Color }, onClick: function () { return fields.remove(i); }, tooltip: "删除" },
                            React.createElement(remove_1.default, { hoverColor: muiTheme.palette.accent1Color }))),
                    render_fields_1.renderFields(meta.form, children, keyPath + "[" + i + "]"));
            }),
            disableCreate ? null : React.createElement("div", { className: "add-button" },
                React.createElement(material_ui_1.IconButton, { tooltip: "添加", onClick: function () { return props.fields.push(props.fieldSchema.defaultValue ? props.fieldSchema.defaultValue : {}); } },
                    React.createElement(add_1.default, { hoverColor: muiTheme.palette.primary1Color }))));
    };
    ArrayFieldRenderer = tslib_1.__decorate([
        muiThemeable_1.default()
    ], ArrayFieldRenderer);
    return ArrayFieldRenderer;
}(React.Component));
function TextAreaInput(props) {
    return React.createElement(material_ui_1.TextField, tslib_1.__assign({}, props.input, { value: props.input.value || "", errorText: props.meta.error, required: props.required, type: props.type, id: props.input.name, className: "full-width", hintText: props.fieldSchema.placeholder, style: { width: "100%" }, disabled: props.disabled, multiLine: true, floatingLabelText: props.fieldSchema.label }));
}
var FileInput = /** @class */ (function (_super) {
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
var SelectRadio = /** @class */ (function (_super) {
    tslib_1.__extends(SelectRadio, _super);
    function SelectRadio() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SelectRadio.prototype.render = function () {
        var props = this.props;
        return React.createElement("div", null,
            React.createElement(material_ui_1.Subheader, { style: { paddingLeft: 0 } },
                props.fieldSchema.label,
                React.createElement(GenericPlaceHolder, { placeholder: props.fieldSchema.placeholder })),
            React.createElement(RadioButton_1.RadioButtonGroup, tslib_1.__assign({}, props.input, { valueSelected: props.input.value, onBlur: function () { return props.input.onBlur(props.input.value); }, id: props.input.name, name: props.input.name, disabled: props.disabled, floatingLabelText: props.fieldSchema.label, fullWidth: true, errorText: props.meta.error, hintText: props.fieldSchema.placeholder, multiple: props.fieldSchema.multiple, style: {
                    display: 'flex',
                    flexWrap: "wrap"
                }, onChange: function (e, v) { return props.input.onChange(v); } }), this.props.options ? this.props.options.map(function (option) { return (React.createElement(RadioButton_1.default, { style: {
                    width: "auto",
                    flex: 1,
                    whiteSpace: "nowrap",
                    margin: "0 15px 0 0"
                }, key: option.value, value: option.value, label: option.name })); }) : React.createElement(RadioButton_1.default, { key: "...loading", value: "", disabled: true, label: "载入中" })));
    };
    SelectRadio = tslib_1.__decorate([
        field_1.addType("radio"),
        resolvefieldSchemaOptions
    ], SelectRadio);
    return SelectRadio;
}(React.PureComponent));
field_1.addType("password", TextInput);
field_1.addType("email", TextInput);
field_1.addType('text', TextInput);
field_1.addType('textarea', TextAreaInput);
field_1.addType("file", FileInput);
field_1.addType('number', NumberInput);
field_1.addType('checkbox', CheckboxInput);
field_1.addType('select', SelectInput);
field_1.addType('autocomplete', AutoCompleteSelect);
field_1.addType('autocomplete-text', AutoCompleteText);
field_1.addType("autocomplete-async", AutoCompleteAsync);
field_1.addType('date', DateInput);
field_1.addType('datetime', DateTimeInput);
field_1.addTypeWithWrapper("array", function (props) {
    return React.createElement("div", null,
        React.createElement("label", { className: "control-label" }, props.fieldSchema.label),
        React.createElement(FieldArray, { name: props.keyPath, rerenderOnEveryChange: Boolean(props.fieldSchema.getChildren), component: ArrayFieldRenderer, props: props }));
});
var Field = redux_form_1.Field;
var FieldArray = redux_form_1.FieldArray;
buttons_1.setButton(muiThemeable_1.default()(function (props) {
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
//# sourceMappingURL=material.js.map