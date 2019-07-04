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
export function useFieldState(form, key, format) {
    return useSource(form.stream, function (ob) { return ob.pipe(skipWhile(function (x) { return x.values === undefined; }), map(function (s) {
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
    var finalKey = (keyPath + "." + schema.key).slice(1); /** it begins with dot */
    var fieldState = useFieldState(form, finalKey, schema.format);
    var onChange = React.useMemo(function () { return function (valueOrEvent) {
        form.next(changeValue(finalKey, valueOrEvent, schema.validate, schema.parse));
    }; }, [form, schema.validate, schema.parse]);
    var onBlur = React.useMemo(function () { return function () {
        form.next(startValidation(finalKey, schema.validate));
    }; }, [form, schema.validate, schema.parse]);
    React.useEffect(function () {
        props.form.next(registerField(finalKey, schema));
        return function () { return props.form.next(unregisterField(finalKey)); };
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
    var fieldNode = null;
    if (typeof schema.type === 'string' && widgetRegistration.has(schema.type)) {
        var StoredWidget = widgetRegistration.get(schema.type);
        if (StoredWidget) {
            fieldNode = React.createElement(StoredWidget, tslib_1.__assign({ form: form, keyPath: keyPath, schema: schema, componentProps: componentProps }, fieldState, { onChange: onChange, onBlur: onBlur }));
        }
    }
    else if (typeof schema.type === 'function') {
        var Comp = schema.type;
        fieldNode = React.createElement(Comp, tslib_1.__assign({ form: form, keyPath: keyPath, schema: schema, componentProps: componentProps }, fieldState, { onChange: onChange, onBlur: onBlur }));
    }
    if (fieldNode !== null) {
        return props.noWrapper ? React.createElement(React.Fragment, null, fieldNode) : React.createElement("div", { className: className, style: schema.style }, fieldNode);
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
            var listenTo = typeof x.to === 'function' ? x.to(props.keyPath.slice(1)) : x.to;
            return combineLatest(listenTo.map(function (x) {
                return $value.pipe(map(function (v) {
                    return v && v[x];
                }), distinctUntilChanged());
            })).pipe(map(x.then));
        }));
        var processChange = function (change) {
            if (!!change) {
                var value = change.value, rest = tslib_1.__rest(change, ["value"]);
                var newSchema = tslib_1.__assign({}, props.schema, rest);
                if ('value' in change) {
                    var finalKey = (props.keyPath + "." + props.schema.key).slice(1); /** it begins with dot */
                    props.form.next(changeValue(finalKey, value, newSchema.validate, newSchema.parse));
                }
                setSchema(newSchema);
            }
        };
        var subscription = $change.subscribe(function (change) {
            if (change instanceof Promise) {
                change.then(function (change) {
                    !subscription.closed && processChange(change);
                });
            }
            else {
                processChange(change);
            }
        });
        return function () { return subscription.unsubscribe(); };
    }, [props.form, schema.listeners]);
    return React.createElement(StatelessField, { schema: schema, form: props.form, keyPath: props.keyPath, noWrapper: props.noWrapper });
});
export function FormField(props) {
    var form = props.form, _a = props.keyPath, keyPath = _a === void 0 ? "" : _a, noWrapper = props.noWrapper, name = props.name, restField = tslib_1.__rest(props, ["form", "keyPath", "noWrapper", "name"]);
    var field = tslib_1.__assign({}, restField, { key: name });
    if (field.listens && (typeof field.listens === 'function' || Object.keys(field.listens).length))
        return React.createElement(StatefulField, { noWrapper: noWrapper, form: form, schema: field, keyPath: keyPath });
    else
        return React.createElement(StatelessField, { noWrapper: noWrapper, form: form, schema: field, keyPath: keyPath });
}
//# sourceMappingURL=field.js.map