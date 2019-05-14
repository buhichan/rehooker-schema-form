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
    meta: {},
    errors: {},
    values: undefined,
    arrayKeys: [],
    initialized: false,
};
export function createForm(middleware) {
    return createStore(defaultFormState, middleware);
}
export function SchemaForm(props) {
    var handleSubmit = React.useMemo(function () { return function (e) {
        e.preventDefault();
        submit(props.form.next, props.onSubmit || noopSubmit);
        return false;
    }; }, [props.form]);
    React.useEffect(function () {
        if (!props.disableInitialize) {
            props.form.next(function (s) {
                return initialize(props.initialValues, props.schema)(s);
            });
        }
    }, [props.initialValues, props.schema, props.onSubmit]);
    React.useEffect(function () { return function () {
        if (!props.disableDestruction) {
            props.form.next(function destroyOnUnmounnt() {
                return defaultFormState;
            });
        }
    }; }, [props.form]);
    var initialized = useSource(props.form.stream, map(function (x) { return x.values; }));
    return React.createElement("form", { className: "schema-form", onSubmit: handleSubmit },
        !initialized ? null : renderFields(props.form, props.schema, ""),
        (!props.noButton) ? React.createElement(FormButtons, { onSubmit: props.onSubmit || noopSubmit, form: props.form }) : null);
}
var noopSubmit = function () {
    return Promise.resolve();
};
//# sourceMappingURL=form.js.map