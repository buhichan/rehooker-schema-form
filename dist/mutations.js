import * as tslib_1 from "tslib";
import { deepSet } from './utils';
var SubmissionError = /** @class */ (function () {
    function SubmissionError(error) {
        this.error = error;
    }
    return SubmissionError;
}());
export { SubmissionError };
export function submit(dispatch, submitFunc) {
    return dispatch(function submit(f) {
        var values = f.values;
        if (!values)
            return f;
        var errors = f.validator ? f.validator(values) : {};
        if (Object.keys(errors).length > 0) {
            return tslib_1.__assign({}, f, { errors: errors });
        }
        var maybePromise = submitFunc(values);
        if (maybePromise instanceof Promise) {
            //setTimeout 是为了避免立刻提交产生的执行顺序的问题
            maybePromise.then(function () {
                setTimeout(function () {
                    dispatch(function submitSucceed(f) {
                        return tslib_1.__assign({}, f, { initialValues: f.values, submitting: false, submitSucceeded: true });
                    });
                });
            }).catch(function (error) {
                setTimeout(function () {
                    dispatch(function submitFailed(f) {
                        return tslib_1.__assign({}, f, { errors: error instanceof SubmissionError ? tslib_1.__assign({}, f.errors, error.error) : f.errors, submitting: false, submitSucceeded: false });
                    });
                });
                throw error;
            });
        }
        return tslib_1.__assign({}, f, { submitting: true });
    });
}
export function reset(f) {
    return tslib_1.__assign({}, f, { values: f.initialValues });
}
export function changeValue(key, valueOrEvent, parse) {
    return function changeValue(s) {
        var newValue = valueOrEvent && typeof valueOrEvent === 'object' && 'target' in valueOrEvent ? valueOrEvent.target.value : valueOrEvent;
        return tslib_1.__assign({}, s, { values: deepSet(s.values, key, parse ? parse(newValue) : newValue) });
    };
}
export function initialize(initialValues) {
    return function initialize(f) {
        return tslib_1.__assign({}, f, { values: initialValues, initialValues: initialValues, initialized: true });
    };
}
//# sourceMappingURL=mutations.js.map