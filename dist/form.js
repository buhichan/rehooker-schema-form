/**
 * Created by YS on 2016/10/31.
 */
import { FormButtons } from './inject-submittable';
import * as React from 'react';
import { renderFields } from "./field";
import { createStore, useSource } from "rehooker";
import { initialize, submit } from './mutations';
import { map } from 'rxjs/operators';
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
export function createForm(middleware) {
    return createStore(defaultFormState, middleware);
}
export function SchemaForm(props) {
    var handleSubmit = React.useMemo(function () { return function (e) {
        e.preventDefault();
        submit(props.form.next);
        return false;
    }; }, [props.form]);
    React.useEffect(function () {
        props.form.next(function (s) {
            return initialize(props.initialValues, props.onSubmit || (function () { }))(s);
        });
    }, [props.initialValues, props.onSubmit]);
    React.useEffect(function () { return function () {
        props.form.next(function () { return defaultFormState; });
    }; }, [props.form]);
    var initialized = useSource(props.form.stream, map(function (x) { return x.values; }));
    return React.createElement("form", { className: "schema-form", onSubmit: handleSubmit },
        !initialized ? null : renderFields(props.form, props.schema, ""),
        (!props.noButton) ? React.createElement(FormButtons, { form: props.form }) : null);
}
//# sourceMappingURL=form.js.map