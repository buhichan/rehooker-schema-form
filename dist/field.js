"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
/**
 * Created by buhi on 2017/7/26.
 */
var React = require("react");
var rehooker_1 = require("rehooker");
var operators_1 = require("rxjs/operators");
var rxjs_1 = require("rxjs");
var mutations_1 = require("./mutations");
var constants_1 = require("./constants");
/**
 * Created by buhi on 2017/7/26.
 */
function renderFields(form, schema, keyPath) {
    if (!schema)
        return null;
    return schema.map(function (field) {
        var key = field.key;
        if (!key) {
            console.error("You must provide key of a field");
            return null;
        }
        if (field.listens && (typeof field.listens === 'function' || Object.keys(field.listens).length))
            return React.createElement(StatefulField, { form: form, key: key, schema: field, keyPath: keyPath });
        else
            return React.createElement(StatelessField, { form: form, key: key, schema: field, keyPath: keyPath });
    });
}
exports.renderFields = renderFields;
function addType(name, widget) {
    widgetRegistration.set(name, widget);
}
exports.addType = addType;
var widgetRegistration = new Map();
function clearTypes() {
    widgetRegistration.clear();
}
exports.clearTypes = clearTypes;
function getType(name) {
    return widgetRegistration.get(name);
}
exports.getType = getType;
function getComponentProps(field) {
    var hide = field.hide, type = field.type, key = field.key, label = field.label, options = field.options, fullWidth = field.fullWidth, component = field.component, normalize = field.normalize, props = field.props, warn = field.warn, withRef = field.withRef, style = field.style, children = field.children, onChange = field.onChange, listens = field.listens, onFileChange = field.onFileChange, validate = field.validate, format = field.format, parse = field.parse, multiple = field.multiple, value = field.value, maxOptionCount = field.maxOptionCount, rest = tslib_1.__rest(field, ["hide", "type", "key", "label", "options", "fullWidth", "component", "normalize", "props", "warn", "withRef", "style", "children", "onChange", "listens", "onFileChange", "validate", "format", "parse", "multiple", "value", "maxOptionCount"]);
    return rest;
}
exports.getComponentProps = getComponentProps;
function useFieldState(form, fieldKey, keyPath, format) {
    return rehooker_1.useSource(form.stream, function (ob) { return ob.pipe(operators_1.skipWhile(function (x) { return x.values === undefined; }), operators_1.map(function (s) {
        var key = (keyPath + "." + fieldKey).slice(1);
        var value = s.values && s.values[key];
        return {
            value: format ? format(value) : value,
            error: s.errors[key],
            meta: s.meta[key]
        };
    }, operators_1.debounceTime(24))); }, [form, fieldKey, keyPath, format]);
}
exports.useFieldState = useFieldState;
var StatelessField = React.memo(function StatelessField(props) {
    var schema = props.schema, form = props.form, keyPath = props.keyPath;
    var componentProps = getComponentProps(schema);
    var fieldState = useFieldState(form, schema.key, keyPath, schema.format);
    var onChange = React.useMemo(function () { return function (valueOrEvent) {
        form.next(mutations_1.changeValue(keyPath + "." + schema.key, valueOrEvent, schema.validate, schema.parse));
    }; }, [form, schema.validate, schema.parse]);
    React.useEffect(function () {
        props.form.next(mutations_1.registerField(schema, keyPath));
        return function () { return props.form.next(mutations_1.unregisterField(schema, keyPath)); };
    }, []);
    if (!fieldState)
        return null;
    if (schema.hide)
        return null;
    var typeName = schema.type;
    if (typeof schema.type !== 'string')
        typeName = "";
    var className = "field " + typeName
        + (constants_1.isFullWidth(schema) ? " full-width" : "")
        + (componentProps.required ? " required" : "")
        + (componentProps.disabled ? " disabled" : "");
    if (typeof schema.type === 'string' && widgetRegistration.has(schema.type)) {
        var StoredWidget = widgetRegistration.get(schema.type);
        if (StoredWidget) {
            return React.createElement("div", { className: className, style: schema.style },
                React.createElement(StoredWidget, tslib_1.__assign({ form: form, keyPath: keyPath, schema: schema, componentProps: componentProps }, fieldState, { onChange: onChange })));
        }
    }
    else if (typeof schema.type === 'function') {
        var Comp = schema.type;
        return React.createElement("div", { className: className, style: schema.style },
            React.createElement(Comp, tslib_1.__assign({ form: form, keyPath: keyPath, schema: schema, componentProps: componentProps }, fieldState, { onChange: onChange })));
    }
    switch (schema.type) {
        //这里不可能存在getChildren还没有被执行的情况
        case "virtual-group": {
            var children = schema.children;
            return React.createElement(React.Fragment, null, renderFields(form, children, keyPath));
        }
        case "group": {
            var children = schema.children;
            return React.createElement("div", { className: className, style: schema.style },
                React.createElement("fieldset", null,
                    React.createElement("legend", null, schema.label),
                    React.createElement("div", { className: "schema-node" }, renderFields(form, children, keyPath + "." + schema.key))));
        }
        default:
            return React.createElement("div", { className: "field" },
                React.createElement("span", null,
                    "not supported widget type: ",
                    JSON.stringify(schema)));
    }
});
var StatefulField = React.memo(function StatefulField(props) {
    var _a = React.useState(props.schema), schema = _a[0], setSchema = _a[1];
    var listens = schema.listens;
    React.useEffect(function () {
        var $value = props.form.stream.pipe(operators_1.skipWhile(function (x) { return x.values === undefined; }), operators_1.map(function (x) { return x.values; }), operators_1.distinct());
        var $change = rxjs_1.merge.apply(void 0, listens.map(function (x) {
            var listenTo = typeof x.to === 'function' ? x.to(props.keyPath.slice(1)) : x.to;
            return rxjs_1.combineLatest(listenTo.map(function (x) {
                return $value.pipe(operators_1.map(function (v) {
                    return v && v[x];
                }), operators_1.distinctUntilChanged());
            })).pipe(operators_1.map(x.then));
        }));
        var sub = $change.subscribe(function (change) {
            if (change instanceof Promise) {
                change.then(function (change) { return setSchema(tslib_1.__assign({}, props.schema, change)); });
            }
            else if (change) {
                setSchema(tslib_1.__assign({}, props.schema, change));
            }
        });
        return sub.unsubscribe.bind(sub);
    }, [props.form, schema.listeners]);
    return React.createElement(StatelessField, { schema: schema, form: props.form, keyPath: props.keyPath });
});
//# sourceMappingURL=field.js.map