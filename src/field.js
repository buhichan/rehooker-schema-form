"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
/**
 * Created by buhi on 2017/7/26.
 */
var React = require("react");
var redux_form_1 = require("redux-form");
var render_fields_1 = require("./render-fields");
var react_redux_1 = require("react-redux");
var reselect_1 = require("reselect");
function addType(name, widget) {
    function addWidgetTypeToRegistration(widget) {
        customTypes.set(name, function (props) { return React.createElement("div", null,
            React.createElement(redux_form_1.Field, tslib_1.__assign({ name: props.keyPath }, props, { component: widget }))); });
        return widget;
    }
    return widget ? addWidgetTypeToRegistration(widget) : addWidgetTypeToRegistration;
}
exports.addType = addType;
function addTypeWithWrapper(name, widget) {
    customTypes.set(name, widget);
}
exports.addTypeWithWrapper = addTypeWithWrapper;
var customTypes = new Map();
function clearTypes() {
    customTypes.clear();
}
exports.clearTypes = clearTypes;
function getType(name) {
    return customTypes.get(name);
}
exports.getType = getType;
function preRenderField(field, form, keyPath) {
    var key = field.key || field.label;
    if (!key)
        console.warn("必须为此schema设置一个key或者label, 以作为React的key:", field);
    if (field.listens && (typeof field.listens === 'function' || Object.keys(field.listens).length))
        return React.createElement(StatefulField, { key: key, fieldSchema: field, keyPath: keyPath, form: form });
    else
        return React.createElement(StatelessField, { key: key, field: field, form: form, keyPath: keyPath });
}
exports.preRenderField = preRenderField;
function getComponentProps(field) {
    var hide = field.hide, type = field.type, key = field.key, label = field.label, options = field.options, fullWidth = field.fullWidth, component = field.component, normalize = field.normalize, props = field.props, warn = field.warn, withRef = field.withRef, style = field.style, children = field.children, onChange = field.onChange, listens = field.listens, onFileChange = field.onFileChange, validate = field.validate, format = field.format, parse = field.parse, multiple = field.multiple, value = field.value, rest = tslib_1.__rest(field, ["hide", "type", "key", "label", "options", "fullWidth", "component", "normalize", "props", "warn", "withRef", "style", "children", "onChange", "listens", "onFileChange", "validate", "format", "parse", "multiple", "value"]);
    return rest;
}
exports.getComponentProps = getComponentProps;
var StatelessField = /** @class */ (function (_super) {
    tslib_1.__extends(StatelessField, _super);
    function StatelessField() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    StatelessField.prototype.render = function () {
        var _a = this.props, field = _a.field, form = _a.form, keyPath = _a.keyPath;
        var hide = field.hide, type = field.type, key = field.key, label = field.label, options = field.options, fullWidth = field.fullWidth, style = field.style, children = field.children, rest = tslib_1.__rest(field, ["hide", "type", "key", "label", "options", "fullWidth", "style", "children"]);
        if (field.hide)
            return null;
        var typeName = field.type;
        if (typeof field.type !== 'string')
            typeName = "";
        var CustomWidget = customTypes.get(type);
        var className = "field " + typeName
            + (fullWidth ? " full-width" : "")
            + (rest.required ? " required" : "")
            + (rest.disabled ? " disabled" : "");
        if (CustomWidget) {
            return React.createElement("div", { className: className, style: field.style },
                React.createElement(CustomWidget, tslib_1.__assign({ keyPath: keyPath, fieldSchema: field }, rest, { renderField: preRenderField })));
        }
        else if (typeof type === 'function')
            return React.createElement("div", { className: className, style: field.style },
                React.createElement(redux_form_1.Field, tslib_1.__assign({ name: keyPath, keyPath: keyPath, fieldSchema: field, renderField: preRenderField }, rest, { component: type })));
        switch (type) {
            //这里不可能存在getChildren还没有被执行的情况
            case "virtual-group":
                return render_fields_1.renderFields(form, children, keyPath, true);
            case "group":
                return React.createElement("div", { className: "field " + typeName, style: field.style },
                    React.createElement("fieldset", null,
                        React.createElement("legend", null, label),
                        render_fields_1.renderFields(form, children, keyPath)));
            default:
                return React.createElement("div", { className: "field" },
                    React.createElement("span", null,
                        "\u4E0D\u652F\u6301\u7684\u5B57\u6BB5\u7C7B\u578B:",
                        JSON.stringify(field)));
        }
    };
    return StatelessField;
}(React.PureComponent));
exports.StatelessField = StatelessField;
var StatefulField = /** @class */ (function (_super) {
    tslib_1.__extends(StatefulField, _super);
    function StatefulField() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.state = _this.props.fieldSchema;
        _this.unmounted = false;
        return _this;
    }
    StatefulField.prototype.componentDidMount = function () {
        this.reload(this.props, true);
    };
    StatefulField.prototype.componentWillUnmount = function () {
        this.unmounted = true;
    };
    StatefulField.prototype.reload = function (props, isInitializing) {
        var _this = this;
        var state = this.context.store.getState();
        Promise.all(Object.keys(props.listeners).map(function (_, i) {
            var formValue = redux_form_1.getFormValues(props.form)(state);
            var res = props.listeners[i].then(props.values[i], formValue, props.dispatch);
            if (!(res instanceof Promise))
                return Promise.resolve(res || {});
            else
                return res;
        })).then(function (newSchemas) {
            if (_this.unmounted)
                return;
            var newSchema = newSchemas.reduce(function (old, newSchema) { return (tslib_1.__assign({}, old, newSchema || emptyObject)); }, props.fieldSchema);
            if (newSchema.hasOwnProperty("value") && (!isInitializing)) {
                newSchema = Object.assign({}, newSchema);
                props.dispatch(redux_form_1.change(props.form, props.keyPath, newSchema.value));
                delete newSchema['value'];
            }
            _this.setState(newSchema);
        });
    };
    StatefulField.prototype.componentDidUpdate = function (prevProps) {
        if (prevProps.values === this.props.values &&
            prevProps.form === this.props.form &&
            prevProps.fieldSchema === this.props.fieldSchema)
            return;
        this.reload(this.props);
    };
    StatefulField.prototype.render = function () {
        var _a = this.props, form = _a.form, keyPath = _a.keyPath;
        return React.createElement(StatelessField, { field: this.state, form: form, keyPath: keyPath });
    };
    StatefulField.contextTypes = {
        store: require("prop-types").object
    };
    StatefulField = tslib_1.__decorate([
        react_redux_1.connect(function (_, p) {
            var listeners = p.fieldSchema.listens;
            var formSelector = redux_form_1.formValueSelector(p.form);
            return reselect_1.createSelector(listeners.map(function (_a) {
                var to = _a.to;
                if (to instanceof Function)
                    to = to(p.keyPath.split(".").slice(0, -1).join("."));
                if (to instanceof Array) {
                    return reselect_1.createSelector(to.map(function (key) {
                        return function (s) { return formSelector(s, key); };
                    }), function () {
                        var values = [];
                        for (var _i = 0; _i < arguments.length; _i++) {
                            values[_i] = arguments[_i];
                        }
                        return values;
                    });
                }
                else
                    return function (s) { return formSelector(s, to); };
            }), function () {
                var values = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    values[_i] = arguments[_i];
                }
                return {
                    values: values,
                    listeners: listeners
                };
            });
        }, function (dispatch) { return ({ dispatch: dispatch }); })
    ], StatefulField);
    return StatefulField;
}(React.PureComponent));
var emptyObject = {};
//# sourceMappingURL=field.js.map