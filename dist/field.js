import * as tslib_1 from "tslib";
/**
 * Created by buhi on 2017/7/26.
 */
import * as React from "react";
import { useSource } from 'rehooker';
import { map, distinct, debounceTime, skipWhile, distinctUntilChanged } from 'rxjs/operators';
import { combineLatest, merge } from 'rxjs';
import { registerField, unregisterField, changeValue, startValidation } from './mutations';
import { isFullWidth } from './constants';
/**
 * Created by buhi on 2017/7/26.
 */
export function renderFields(form, schema, keyPath) {
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
export function addType(name, widget) {
    widgetRegistration.set(name, widget);
}
var widgetRegistration = new Map();
export function clearTypes() {
    widgetRegistration.clear();
}
export function getType(name) {
    return widgetRegistration.get(name);
}
export function getComponentProps(field) {
    var hide = field.hide, type = field.type, key = field.key, label = field.label, options = field.options, fullWidth = field.fullWidth, component = field.component, normalize = field.normalize, props = field.props, warn = field.warn, withRef = field.withRef, style = field.style, children = field.children, onChange = field.onChange, listens = field.listens, onFileChange = field.onFileChange, validate = field.validate, format = field.format, parse = field.parse, multiple = field.multiple, value = field.value, maxOptionCount = field.maxOptionCount, rest = tslib_1.__rest(field, ["hide", "type", "key", "label", "options", "fullWidth", "component", "normalize", "props", "warn", "withRef", "style", "children", "onChange", "listens", "onFileChange", "validate", "format", "parse", "multiple", "value", "maxOptionCount"]);
    return rest;
}
export function useFieldState(form, name, format) {
    return useSource(form.stream, function (ob) { return ob.pipe(skipWhile(function (x) { return x.values === undefined; }), map(function (s) {
        var key = name.slice(1); //name always begin with dot
        var value = s.values && s.values[key];
        return {
            value: format ? format(value) : value,
            error: s.errors[key],
            meta: s.meta[key]
        };
    }, debounceTime(24))); }, [form, name, format]);
}
var StatelessField = React.memo(function StatelessField(props) {
    var schema = props.schema, form = props.form, keyPath = props.keyPath;
    var componentProps = getComponentProps(schema);
    var fieldState = useFieldState(form, keyPath + "." + schema.key, schema.format);
    var onChange = React.useMemo(function () { return function (valueOrEvent) {
        form.next(changeValue(keyPath + "." + schema.key, valueOrEvent, schema.validate, schema.parse));
    }; }, [form, schema.validate, schema.parse]);
    var onBlur = React.useMemo(function () { return function () {
        form.next(startValidation(keyPath + "." + schema.key, schema.validate));
    }; }, [form, schema.validate, schema.parse]);
    React.useEffect(function () {
        props.form.next(registerField(schema, keyPath));
        return function () { return props.form.next(unregisterField(schema, keyPath)); };
    }, []);
    if (!fieldState)
        return null;
    if (schema.hide)
        return null;
    var typeName = schema.type;
    if (typeof schema.type !== 'string')
        typeName = "";
    var className = "field " + typeName
        + (isFullWidth(schema) ? " full-width" : "")
        + (componentProps.required ? " required" : "")
        + (componentProps.disabled ? " disabled" : "")
        + (fieldState.error ? " invalid" : " valid");
    if (typeof schema.type === 'string' && widgetRegistration.has(schema.type)) {
        var StoredWidget = widgetRegistration.get(schema.type);
        if (StoredWidget) {
            return React.createElement("div", { className: className, style: schema.style },
                React.createElement(StoredWidget, tslib_1.__assign({ form: form, keyPath: keyPath, schema: schema, componentProps: componentProps }, fieldState, { onChange: onChange, onBlur: onBlur })));
        }
    }
    else if (typeof schema.type === 'function') {
        var Comp = schema.type;
        return React.createElement("div", { className: className, style: schema.style },
            React.createElement(Comp, tslib_1.__assign({ form: form, keyPath: keyPath, schema: schema, componentProps: componentProps }, fieldState, { onChange: onChange, onBlur: onBlur })));
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
        var $value = props.form.stream.pipe(skipWhile(function (x) { return x.values === undefined; }), map(function (x) { return x.values; }), distinct());
        var $change = merge.apply(void 0, listens.map(function (x) {
            var listenTo = typeof x.to === 'function' ? x.to(props.keyPath) : x.to;
            return combineLatest(listenTo.map(function (x) {
                return $value.pipe(map(function (v) {
                    return v && v[x];
                }), distinctUntilChanged());
            })).pipe(map(x.then));
        }));
        var subscription = $change.subscribe(function (change) {
            if (change instanceof Promise) {
                change.then(function (change) { return !subscription.closed && setSchema(tslib_1.__assign({}, props.schema, change)); });
            }
            else if (change) {
                setSchema(tslib_1.__assign({}, props.schema, change));
            }
        });
        return function () { return subscription.unsubscribe(); };
    }, [props.form, schema.listeners]);
    return React.createElement(StatelessField, { schema: schema, form: props.form, keyPath: props.keyPath });
});
//# sourceMappingURL=field.js.map