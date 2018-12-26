"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Created by YS on 2016/10/31.
 */
var inject_submittable_1 = require("./inject-submittable");
var React = require("react");
var field_1 = require("./field");
var rehooker_1 = require("rehooker");
var mutations_1 = require("./mutations");
var operators_1 = require("rxjs/operators");
var defaultFormState = {
    submitting: false,
    submitSucceeded: false,
    initialValues: undefined,
    onSubmit: function () { },
    meta: {},
    errors: {},
    values: undefined,
    arrayKeys: [],
};
function createForm(middleware) {
    return rehooker_1.createStore(defaultFormState, middleware);
}
exports.createForm = createForm;
function SchemaForm(props) {
    var handleSubmit = React.useMemo(function () { return function (e) {
        e.preventDefault();
        mutations_1.submit(props.form.next);
        return false;
    }; }, [props.form]);
    React.useEffect(function () {
        props.form.next(function (s) {
            return mutations_1.initialize(props.initialValues, props.onSubmit || (function () { }))(s);
        });
    }, [props.initialValues, props.onSubmit]);
    React.useEffect(function () { return function () {
        props.form.next(function () { return defaultFormState; });
    }; }, [props.form]);
    var initialized = rehooker_1.useSource(props.form.stream, operators_1.map(function (x) { return x.values; }));
    return React.createElement("form", { className: "schema-form", onSubmit: handleSubmit },
        !initialized ? null : field_1.renderFields(props.form, props.schema, ""),
        (!props.noButton) ? React.createElement(inject_submittable_1.FormButtons, { form: props.form }) : null);
}
exports.SchemaForm = SchemaForm;
//# sourceMappingURL=form.js.map