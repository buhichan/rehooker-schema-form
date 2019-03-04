/**
 * Created by buhi on 2017/7/26.
 */
import * as React from "react";
import { preRenderField } from "./field";
export function renderFields(form, schema, keyPath, noSchemaNodeWrapper) {
    if (keyPath === void 0) { keyPath = ""; }
    if (noSchemaNodeWrapper === void 0) { noSchemaNodeWrapper = false; }
    if (!schema)
        return null;
    var children = schema.map(function (field) {
        var childKeyPath = (keyPath ? (keyPath + ".") : "") + field.key;
        return preRenderField(field, form, childKeyPath);
    });
    if (noSchemaNodeWrapper)
        return children;
    else
        return React.createElement("div", { className: "schema-node" }, children);
}
//# sourceMappingURL=render-fields.js.map