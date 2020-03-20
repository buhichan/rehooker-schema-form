import { __assign } from "tslib";
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
        var maybePromise = submitFunc(values);
        if (maybePromise instanceof Promise) {
            //setTimeout 是为了避免立刻提交产生的执行顺序的问题
            maybePromise.then(function () {
                setTimeout(function () {
                    dispatch(function submitSucceed(f) {
                        return __assign(__assign({}, f), { initialValues: f.values, submitting: false, submitSucceeded: true });
                    });
                });
            }).catch(function (error) {
                setTimeout(function () {
                    dispatch(function submitFailed(f) {
                        return __assign(__assign({}, f), { errors: error instanceof SubmissionError ? __assign(__assign({}, f.errors), error.error) : f.errors, submitting: false, submitSucceeded: false });
                    });
                });
                throw error;
            });
        }
        return __assign(__assign({}, f), { submitting: true });
    });
}
export function reset(f) {
    return __assign(__assign({}, f), { values: f.initialValues });
}
export function changeValue(key, valueOrEvent, parse) {
    return function changeValue(s) {
        var newValue = valueOrEvent && typeof valueOrEvent === 'object' && 'target' in valueOrEvent ? valueOrEvent.target.value : valueOrEvent;
        return __assign(__assign({}, s), { values: deepSet(s.values, key, parse ? parse(newValue) : newValue), valid: s.hasValidator ? false : true });
    };
}
export function initialize(initialValues) {
    return function initialize(f) {
        return __assign(__assign({}, f), { values: initialValues, initialValues: initialValues, initialized: true });
    };
}
//# sourceMappingURL=mutations.js.map