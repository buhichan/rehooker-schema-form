import * as tslib_1 from "tslib";
/**
 * Created by YS on 2016/10/31.
 */
import * as React from 'react';
import { createStore } from "rehooker";
import { debounceTime, distinctUntilKeyChanged } from 'rxjs/operators';
import { renderFields } from "./field";
import { FormButtons } from './inject-submittable';
import { initialize, submit } from './mutations';
var emptyMap = {};
var defaultFormState = {
    submitting: false,
    submitSucceeded: false,
    initialValues: emptyMap,
    errors: emptyMap,
    values: emptyMap,
    valid: true,
};
export function createForm(options) {
    var _this = this;
    var store = createStore(tslib_1.__assign({}, defaultFormState, { hasValidator: options && !!options.validator || false }), options ? options.middleware : undefined);
    var validator = options && options.validator;
    store.stream.pipe(distinctUntilKeyChanged("values"), debounceTime(options && options.validationDelay || 50)).subscribe(function (fs) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var errors_1;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!(fs.values !== fs.initialValues)) return [3 /*break*/, 3];
                    if (!validator) return [3 /*break*/, 2];
                    return [4 /*yield*/, validator(fs.values)];
                case 1:
                    errors_1 = _a.sent();
                    store.next(function (f) { return (tslib_1.__assign({}, f, { valid: !Object.keys(errors_1).some(function (y) { return !!errors_1[y]; }), errors: errors_1 })); });
                    return [3 /*break*/, 3];
                case 2:
                    store.next(function (f) { return (tslib_1.__assign({}, f, { valid: true, errors: {} })); });
                    _a.label = 3;
                case 3: return [2 /*return*/];
            }
        });
    }); });
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
            props.form.next(function destroyOnUnmounnt(s) {
                return tslib_1.__assign({}, s, defaultFormState);
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