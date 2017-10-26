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
var PropTypes = require("prop-types");
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
function preRenderField(field, form, keyPath) {
    if (field.listens && (typeof field.listens === 'function' || Object.keys(field.listens).length))
        return React.createElement(StatefulField, { key: field.key || field.label, fieldSchema: field, keyPath: keyPath, form: form });
    else
        return React.createElement(StatelessField, { key: field.key || field.label, field: field, form: form, keyPath: keyPath });
}
exports.preRenderField = preRenderField;
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
        if (customTypes.has(type)) {
            var CustomWidget = customTypes.get(type);
            return React.createElement("div", { className: "field " + typeName + (fullWidth ? " full-width" : ""), style: field.style },
                React.createElement(CustomWidget, tslib_1.__assign({ keyPath: keyPath, fieldSchema: field }, rest, { renderField: preRenderField })));
        }
        else if (typeof type === 'function')
            return React.createElement("div", { className: "field " + typeName + (fullWidth ? " full-width" : ""), style: field.style },
                React.createElement(redux_form_1.Field, tslib_1.__assign({ name: keyPath, keyPath: keyPath, fieldSchema: field, renderField: preRenderField }, rest, { component: type })));
        //noinspection FallThroughInSwitchStatementJS
        switch (type) {
            case "group":
                //这里不可能存在getChildren还没有被执行的情况
                return React.createElement("div", { className: "field " + typeName, style: field.style },
                    React.createElement("fieldset", { key: field.key || field.label },
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
        return _this;
    }
    StatefulField.prototype.componentWillMount = function () {
        this.reload(this.props);
    };
    StatefulField.prototype.reload = function (props) {
        var _this = this;
        var state = this.context.store.getState();
        Promise.all(Object.keys(props.listeners).map(function (fieldKey, i) {
            var formValue = redux_form_1.getFormValues(props.form)(state);
            var res = props.listeners[fieldKey](props.values[i], formValue);
            if (!(res instanceof Promise))
                return Promise.resolve(res || {});
            else
                return res;
        })).then(function (newSchemas) {
            var newSchema = newSchemas.reduce(function (old, newSchema) { return (tslib_1.__assign({}, old, newSchema)); }, props.fieldSchema);
            if (newSchema.hasOwnProperty("value"))
                props.dispatch(redux_form_1.change(props.form, props.keyPath, newSchema.value));
            _this.setState(newSchema);
        });
    };
    StatefulField.prototype.componentWillReceiveProps = function (nextProps) {
        if (nextProps.values === this.props.values &&
            nextProps.form === this.props.form &&
            nextProps.fieldSchema === this.props.fieldSchema)
            return;
        this.reload(nextProps);
    };
    StatefulField.prototype.render = function () {
        var _a = this.props, form = _a.form, keyPath = _a.keyPath;
        return React.createElement(StatelessField, { field: this.state, form: form, keyPath: keyPath });
    };
    StatefulField.contextTypes = {
        store: PropTypes.object
    };
    StatefulField = tslib_1.__decorate([
        react_redux_1.connect(function (_, p) {
            var listeners = p.fieldSchema.listens;
            if (typeof listeners === 'function')
                listeners = listeners(p.keyPath.split(".").slice(0, -1).join("."));
            var formSelector = redux_form_1.formValueSelector(p.form);
            return reselect_1.createSelector(Object.keys(listeners).map(function (x) { return function (s) { return formSelector(s, x); }; }), function () {
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
//# sourceMappingURL=field.js.map