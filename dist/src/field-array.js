"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var mutations_1 = require("./mutations");
var field_1 = require("./field");
function FieldArray(props) {
    var add = React.useMemo(function () { return function () {
        props.form.next(mutations_1.addArrayItem(props.schema, props.keyPath, props.value));
    }; }, [props.schema, props.value]);
    var remove = React.useMemo(function () { return function (id) {
        props.form.next(mutations_1.removeArrayItem(props.schema, props.keyPath, props.value, id));
    }; }, [props.schema, props.value]);
    return React.createElement(React.Fragment, null, props.children(props.value || [], add, remove, function (id) {
        var children = props.schema.children;
        return field_1.renderFields(props.form, children, props.keyPath + "." + props.schema.key + "." + id);
    }));
}
exports.FieldArray = FieldArray;
//# sourceMappingURL=field-array.js.map