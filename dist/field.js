import { __assign, __rest, __spreadArrays } from "tslib";
/**
 * Created by buhi on 2017/7/26.
 */
import * as React from "react";
import { useSource } from 'rehooker';
import { combineLatest, merge } from 'rxjs';
import { distinct, distinctUntilChanged, map } from 'rxjs/operators';
import { isFullWidth } from './constants';
import { changeValue } from './mutations';
import { deepGet } from './utils';
/**
 * Created by buhi on 2017/7/26.
 */
export function renderFields(form, schema, keyPath, componentMap) {
    if (!schema)
        return null;
    return schema.map(function (field) {
        var key = field.key;
        if (!key) {
            console.error("You must provide key of a field");
            return null;
        }
        if (field.listens && (typeof field.listens === 'function' || Object.keys(field.listens).length))
            return React.createElement(StatefulField, { componentMap: componentMap, form: form, key: key, schema: field, keyPath: keyPath });
        else
            return React.createElement(StatelessField, { componentMap: componentMap, form: form, key: key, schema: field, keyPath: keyPath });
    });
}
export function getComponentProps(field) {
    var hide = field.hide, type = field.type, key = field.key, label = field.label, options = field.options, fullWidth = field.fullWidth, component = field.component, normalize = field.normalize, props = field.props, warn = field.warn, withRef = field.withRef, style = field.style, children = field.children, onChange = field.onChange, listens = field.listens, onFileChange = field.onFileChange, validate = field.validate, format = field.format, parse = field.parse, multiple = field.multiple, value = field.value, maxOptionCount = field.maxOptionCount, componentMap = field.componentMap, rest = __rest(field, ["hide", "type", "key", "label", "options", "fullWidth", "component", "normalize", "props", "warn", "withRef", "style", "children", "onChange", "listens", "onFileChange", "validate", "format", "parse", "multiple", "value", "maxOptionCount", "componentMap"]);
    return rest;
}
export function useField(form, key, format) {
    return useSource(form.stream, function (ob) { return ob.pipe(distinctUntilChanged(function (a, b) { return a.values === b.values && a.errors === b.errors; }), map(function (s) {
        var value = deepGet(s.values, key);
        return {
            value: format ? format(value) : value,
            error: deepGet(s.errors, key)
        };
    })); }, [form, name, format]);
}
var StatelessField = React.memo(function StatelessField(props) {
    var schema = props.schema, form = props.form, keyPath = props.keyPath, componentMap = props.componentMap;
    var componentProps = getComponentProps(schema);
    /** assume finalKey will not change */
    var finalKey = __spreadArrays(keyPath, schema.key.split(".")); /** it begins with dot */
    var fieldValue = useField(form, finalKey, schema.format);
    var onChange = React.useMemo(function () { return function (valueOrEvent) {
        form.next(changeValue(finalKey, valueOrEvent, schema.parse));
    }; }, [form, schema.parse]);
    if (!fieldValue)
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
        + (fieldValue.error ? " invalid" : " valid");
    var fieldNode = null;
    if (typeof schema.type === 'string' && componentMap.has(schema.type)) {
        var StoredWidget = componentMap.get(schema.type);
        if (StoredWidget) {
            fieldNode = React.createElement(StoredWidget, __assign({ componentMap: componentMap, form: form, keyPath: keyPath, schema: schema, componentProps: componentProps }, fieldValue, { onChange: onChange }));
        }
    }
    else if (typeof schema.type === 'function') {
        var Comp = schema.type;
        fieldNode = React.createElement(Comp, __assign({ componentMap: componentMap, form: form, keyPath: keyPath, schema: schema, componentProps: componentProps }, fieldValue, { onChange: onChange }));
    }
    if (fieldNode !== null) {
        return props.noWrapper ? React.createElement(React.Fragment, null, fieldNode) : React.createElement("div", { className: className, style: schema.style }, fieldNode);
    }
    switch (schema.type) {
        //这里不可能存在getChildren还没有被执行的情况
        case "virtual-group": {
            var children = schema.children;
            return React.createElement(React.Fragment, null, renderFields(form, children, keyPath, componentMap));
        }
        case "group": {
            var children = schema.children;
            return React.createElement("div", { className: className, style: schema.style },
                React.createElement("fieldset", null,
                    React.createElement("legend", null, schema.label),
                    React.createElement("div", { className: "schema-node" }, renderFields(form, children, keyPath.concat(schema.key), componentMap))));
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
        var $value = props.form.stream.pipe(map(function (x) { return x.values; }), distinct());
        var $change = merge.apply(void 0, listens.map(function (x) {
            var listenTo = typeof x.to === 'function' ? x.to(props.keyPath.join(".")) : x.to;
            return combineLatest(listenTo.map(function (x) {
                return $value.pipe(map(function (v) {
                    return deepGet(v, x.split("."));
                }), distinctUntilChanged());
            })).pipe(map(x.then));
        }));
        var processChange = function (change) {
            if (!!change) {
                var value = change.value, rest = __rest(change, ["value"]);
                var newSchema = __assign(__assign({}, props.schema), rest);
                if ('value' in change) {
                    var finalKey = props.keyPath.concat(props.schema.key);
                    props.form.next(changeValue(finalKey, value, newSchema.parse));
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
    return React.createElement(StatelessField, { componentMap: props.componentMap, schema: schema, form: props.form, keyPath: props.keyPath, noWrapper: props.noWrapper });
});
export function FormField(props) {
    var form = props.form, _a = props.keyPath, keyPath = _a === void 0 ? [] : _a, noWrapper = props.noWrapper, name = props.name, componentMap = props.componentMap, restField = __rest(props, ["form", "keyPath", "noWrapper", "name", "componentMap"]);
    var field = __assign(__assign({}, restField), { key: name });
    if (field.listens && (typeof field.listens === 'function' || Object.keys(field.listens).length))
        return React.createElement(StatefulField, { componentMap: componentMap, noWrapper: noWrapper, form: form, schema: field, keyPath: keyPath });
    else
        return React.createElement(StatelessField, { componentMap: componentMap, noWrapper: noWrapper, form: form, schema: field, keyPath: keyPath });
}
//# sourceMappingURL=field.js.map