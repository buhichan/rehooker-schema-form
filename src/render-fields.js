"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Created by buhi on 2017/7/26.
 */
var React = require("react");
var field_1 = require("./field");
function renderFields(form, schema, keyPath) {
    if (keyPath === void 0) { keyPath = ""; }
    if (!schema)
        return null;
    return React.createElement("div", { className: "schema-node" }, schema.map(function (field) {
        return field_1.preRenderField(field, form, (keyPath ? (keyPath + ".") : "") + field.key);
    }));
}
exports.renderFields = renderFields;
//# sourceMappingURL=render-fields.js.map