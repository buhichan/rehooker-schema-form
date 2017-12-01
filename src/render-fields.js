"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Created by buhi on 2017/7/26.
 */
var React = require("react");
var field_1 = require("./field");
function renderFields(form, schema, keyPath, noSchemaNodeWrapper) {
    if (keyPath === void 0) { keyPath = ""; }
    if (noSchemaNodeWrapper === void 0) { noSchemaNodeWrapper = false; }
    if (!schema)
        return null;
    var children = schema.map(function (field) {
        var childKeyPath = (keyPath ? (keyPath + ".") : "") + field.key;
        return field_1.preRenderField(field, form, childKeyPath);
    });
    if (noSchemaNodeWrapper)
        return children;
    else
        return React.createElement("div", { className: "schema-node" }, children);
}
exports.renderFields = renderFields;
//# sourceMappingURL=render-fields.js.map