"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
/**
 * Created by buhi on 2017/7/26.
 */
var React = require("react");
var redux_form_1 = require("redux-form");
var schema_node_1 = require("./schema-node");
function addType(name, widget) {
    customTypes.set(name, widget);
}
exports.addType = addType;
var customTypes = new Map();
function renderField(field, form, keyPath, initialValues, onSchemaChange, refChildNode) {
    var hide = field.hide, type = field.type, key = field.key, label = field.label, options = field.options, children = field.children, getChildren = field.getChildren, rest = tslib_1.__rest(field, ["hide", "type", "key", "label", "options", "children", "getChildren"]);
    if (customTypes.has(type)) {
        var CustomWidget = customTypes.get(type);
        return React.createElement(CustomWidget, tslib_1.__assign({ keyPath: keyPath, fieldSchema: field, onSchemaChange: onSchemaChange }, rest, { renderField: renderField }));
    }
    //noinspection FallThroughInSwitchStatementJS
    switch (type) {
        /**
         * @deprecated 不再维护bootstrap版本
         */
        case "number":
        case "text":
        case "color":
        case "password":
        case "date":
        case "datetime-local":
        case "file":
            return React.createElement("div", { className: "form-group" },
                React.createElement("label", { className: "control-label col-md-2", htmlFor: form + '-' + keyPath }, label),
                React.createElement("div", { className: "col-md-10" },
                    React.createElement(redux_form_1.Field, tslib_1.__assign({ className: "form-control", name: keyPath }, rest, { component: "input" }))));
        case "textarea":
            return React.createElement("div", { className: "form-group" },
                React.createElement("label", { className: "control-label col-md-2", htmlFor: form + '-' + keyPath }, label),
                React.createElement("div", { className: "col-md-10" },
                    React.createElement(redux_form_1.Field, tslib_1.__assign({ className: "form-control", name: keyPath }, rest, { component: "textarea" }))));
        case "checkbox":
            return React.createElement("div", { className: "form-group" },
                React.createElement("label", { className: "control-label col-md-2", htmlFor: form + '-' + keyPath }, label),
                React.createElement("div", { className: "col-md-10" },
                    React.createElement(redux_form_1.Field, tslib_1.__assign({ className: " checkbox", name: keyPath }, rest, { component: "input" }))));
        case "select":
            return React.createElement("div", { className: "form-group" },
                React.createElement("label", { className: "control-label col-md-2", htmlFor: form + '-' + keyPath }, label),
                React.createElement("div", { className: "col-md-10" },
                    React.createElement(redux_form_1.Field, tslib_1.__assign({ className: "form-control", name: keyPath }, rest, { component: "select" }),
                        React.createElement("option", null),
                        options.map(function (option, i) { return React.createElement("option", { key: i, value: option.value }, option.name); }))));
        case "array":
            return React.createElement("div", { className: "form-group" },
                React.createElement("label", { className: "control-label col-md-2", htmlFor: form + '-' + keyPath }, label),
                React.createElement("div", { className: "col-md-10" },
                    React.createElement(redux_form_1.FieldArray, tslib_1.__assign({ name: keyPath }, rest, { fieldSchema: field, keyPath: keyPath, renderField: renderField, component: DefaultArrayFieldRenderer }))));
        case "group":
            //这里不可能存在getChildren还没有被执行的情况
            return React.createElement("fieldset", null,
                React.createElement("legend", null, label),
                React.createElement(schema_node_1.SchemaNode, { ref: function (ref) {
                        refChildNode(ref, key);
                    }, keyPath: (keyPath ? (keyPath + ".") : "") + field.key, initialValues: initialValues, form: form, schema: field.children }));
        default:
            return React.createElement("span", null,
                "\u4E0D\u53EF\u8BC6\u522B\u7684\u5B57\u6BB5:",
                JSON.stringify(field));
    }
}
exports.renderField = renderField;
function DefaultArrayFieldRenderer(props) {
    var fields = props.fields;
    return React.createElement("div", null,
        props.fields.map(function (name, i) {
            return React.createElement("div", { key: i },
                React.createElement(schema_node_1.SchemaNode, { onSchemaChange: props.onSchemaChange, keyPath: props.keyPath + "." + i, initialValues: fields.get(i), form: props.meta.form, schema: props.fieldSchema.children }),
                React.createElement("button", { onClick: function () { return fields.remove(i); } },
                    React.createElement("i", { className: "fa fa-minus" })));
        }),
        React.createElement("button", { onClick: function () { return fields.push({}); } },
            React.createElement("i", { className: "fa fa-plus" })));
}
//# sourceMappingURL=field.js.map