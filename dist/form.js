import { __assign, __awaiter, __generator } from "tslib";
/**
 * Created by YS on 2016/10/31.
 */
import * as React from 'react';
import { createStore } from "rehooker";
import { debounceTime, distinctUntilKeyChanged, scan } from 'rxjs/operators';
import { renderFields } from "./field";
import { initialize, submit } from './mutations';
import { SchemaFormConfigConsumer } from './config';
import { FormButtons } from '.';
var emptyMap = {};
var defaultFormState = {
    submitting: false,
    submitSucceeded: false,
    initialValues: emptyMap,
    errors: emptyMap,
    values: emptyMap,
    valid: true,
    hasValidator: false,
    validating: false,
};
export function createForm(options) {
    var _this = this;
    var validator = options === null || options === void 0 ? void 0 : options.validator;
    var store = createStore(__assign(__assign({}, defaultFormState), { hasValidator: !!validator }), options ? options.middleware : undefined);
    var hasValidatorError = function (errorInfo) {
        return Object.keys(errorInfo).some(function (y) {
            var errorItem = errorInfo[y];
            if (Array.isArray(errorItem)) {
                return errorItem.some(hasValidatorError);
            }
            if (errorItem !== null && typeof errorItem === 'object') {
                return hasValidatorError(errorItem);
            }
            else {
                return !!errorItem;
            }
        });
    };
    store.stream.pipe(distinctUntilKeyChanged("values"), debounceTime(options && options.validationDelay || 50), scan(function (acc, v) {
        acc[0] = acc[1];
        acc[1] = v;
        return acc;
    }, [undefined, undefined])).subscribe(function (_a) {
        var prevFs = _a[0], curFs = _a[1];
        return __awaiter(_this, void 0, void 0, function () {
            var errors_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!(curFs && (prevFs === null || prevFs === void 0 ? void 0 : prevFs.values) !== (curFs === null || curFs === void 0 ? void 0 : curFs.values))) return [3 /*break*/, 3];
                        if (!validator) return [3 /*break*/, 2];
                        store.next(function (f) { return (__assign(__assign({}, f), { validating: true })); });
                        return [4 /*yield*/, validator(curFs.values)];
                    case 1:
                        errors_1 = _b.sent();
                        store.next(function (f) { return (__assign(__assign({}, f), { validating: false, valid: !hasValidatorError(errors_1), errors: errors_1 })); });
                        return [3 /*break*/, 3];
                    case 2:
                        store.next(function (f) { return (__assign(__assign({}, f), { valid: true, errors: {} })); });
                        _b.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        });
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
            props.form.next(function destroyOnUnmounnt(s) {
                return __assign(__assign({}, s), defaultFormState);
            });
        }
    }; }, [props.form]);
    return React.createElement(SchemaFormConfigConsumer, null, function (_a) {
        var componentMap = _a.componentMap;
        return React.createElement("form", { className: "schema-form", onSubmit: handleSubmit },
            renderFields(props.form, props.schema, [], componentMap),
            (!props.noButton) ? React.createElement(FormButtons, { allowPristine: props.allowPristine, onSubmit: props.onSubmit || noopSubmit, form: props.form }) : null);
    });
}
var noopSubmit = function () {
    return Promise.resolve();
};
//# sourceMappingURL=form.js.map