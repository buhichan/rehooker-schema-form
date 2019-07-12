import * as tslib_1 from "tslib";
/**
 * Created by YS on 2016/10/31.
 */
import * as React from 'react';
import { createStore } from "rehooker";
import { renderFields } from "./field";
import { FormButtons } from './inject-submittable';
import { initialize, submit } from './mutations';
import { map, debounceTime } from 'rxjs/operators';
var defaultFormState = {
    submitting: false,
    submitSucceeded: false,
    initialValues: {},
    errors: {},
    values: {},
};
export function createForm(options) {
    var validator = options && options.validator;
    var store = createStore(tslib_1.__assign({}, defaultFormState, options ? {
        validator: validator,
    } : {}), options ? options.middleware : undefined);
    store.stream.pipe(map(function (x) { return x.values; }), debounceTime(1000)).subscribe(function (values) {
        if (validator) {
            var errors_1 = validator(values);
            store.next(function (f) { return (tslib_1.__assign({}, f, { errors: errors_1 })); });
        }
        else if (Object.keys(store.stream.value.errors).length > 0) {
            store.next(function (f) { return (tslib_1.__assign({}, f, { errors: {} })); });
        }
    });
    return store;
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
                return initialize(props.initialValues)(s);
            });
        }
    }, [props.initialValues]);
    React.useEffect(function () { return function () {
        if (!props.disableDestruction) {
            props.form.next(function destroyOnUnmounnt() {
                return defaultFormState;
            });
        }
    }; }, [props.form]);
    return React.createElement("form", { className: "schema-form", onSubmit: handleSubmit },
        renderFields(props.form, props.schema, []),
        (!props.noButton) ? React.createElement(FormButtons, { onSubmit: props.onSubmit || noopSubmit, form: props.form }) : null);
}
var noopSubmit = function () {
    return Promise.resolve();
};
//# sourceMappingURL=form.js.map