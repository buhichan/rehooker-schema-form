"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var mutations_1 = require("./mutations");
function FieldArray(props) {
    var add = React.useMemo(function () { return function () {
        props.form.next(mutations_1.addArrayItem(props.name, props.value));
    }; }, [props.name, props.value]);
    var remove = React.useMemo(function () { return function (id) {
        props.form.next(mutations_1.removeArrayItem(props.name, props.value, id));
    }; }, [props.name, props.value]);
    return React.createElement(React.Fragment, null, props.children((props.value || []).map(function (id) { return props.name + "." + id; }), add, remove));
}
exports.FieldArray = FieldArray;
//# sourceMappingURL=field-array.js.map