import * as tslib_1 from "tslib";
import { randomID, deepSet } from './utils';
var SubmissionError = /** @class */ (function () {
    function SubmissionError(error) {
        this.error = error;
    }
    return SubmissionError;
}());
export { SubmissionError };
export function registerField(schema, keyPath) {
    return function registerField(f) {
        var _a;
        var key = (keyPath + "." + schema.key).slice(1);
        return tslib_1.__assign({}, f, { meta: tslib_1.__assign({}, f.meta, (_a = {}, _a[key] = {
                schema: schema
            }, _a)) });
    };
}
export function unregisterField(schema, keyPath) {
    return function unregisterField(f) {
        var key = (keyPath + "." + schema.key).slice(1);
        if (!(f.values && key in f.values) &&
            !(f.errors && key in f.errors) &&
            !(f.meta && key in f.meta)) {
            //no change to make
            return f;
        }
        if (f.values) {
            delete f.values[key];
        }
        if (f.errors) {
            delete f.errors[key];
        }
        if (f.meta) {
            delete f.meta[key];
        }
        return tslib_1.__assign({}, f);
    };
}
export function submit(dispatch) {
    return dispatch(function submit(f) {
        var values = f.values;
        if (!values)
            return f;
        var errors = Object.keys(f.meta).reduce(function (errors, key) {
            var value = f.values && f.values[key];
            var validate = f.meta[key].schema && f.meta[key].schema.validate;
            if (typeof validate === 'function') {
                var error = validate(value, f.values);
                if (typeof error === 'string') {
                    errors[key] = error;
                }
            }
            return errors;
        }, {});
        if (Object.keys(errors).length > 0) {
            return tslib_1.__assign({}, f, { errors: errors });
        }
        var mapItemIDToIndex = f.arrayKeys.reduce(function (map, key) {
            var value = values[key];
            value instanceof Array && value.forEach(function (x, i) {
                map[x] = i;
            });
            return map;
        }, {});
        var finalValue = Object.keys(values).filter(function (x) { return !f.arrayKeys.includes(x); }).reduce(function (res, key) {
            deepSet(res, key.split(".").map(function (x) { return x in mapItemIDToIndex ? mapItemIDToIndex[x] : x; }), values[key]);
            return res;
        }, {});
        var maybePromise = f.onSubmit && f.onSubmit(finalValue);
        if (maybePromise instanceof Promise) {
            maybePromise.then(function () {
                dispatch(function submitSucceed(f) {
                    return tslib_1.__assign({}, f, { submitting: false, submitSucceed: true });
                });
            }).catch(function (error) {
                dispatch(function submitFailed(f) {
                    return tslib_1.__assign({}, f, { errors: error instanceof SubmissionError ? tslib_1.__assign({}, f.errors, error.error) : f.errors, submitting: false, submitSucceed: false });
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
export function changeValue(key, valueOrEvent, validate, parse) {
    return function changeValue(s) {
        var _a, _b;
        var newValue = valueOrEvent && typeof valueOrEvent === 'object' && 'target' in valueOrEvent ? valueOrEvent.target.value : valueOrEvent;
        var finalKey = key.slice(1);
        var error = validate && validate(newValue, s.values) || undefined;
        if (error) {
            s.errors = tslib_1.__assign({}, s.errors, (_a = {}, _a[finalKey] = error, _a));
        }
        else {
            delete s.errors[finalKey];
        }
        return tslib_1.__assign({}, s, { errors: tslib_1.__assign({}, s.errors), values: tslib_1.__assign({}, s.values, (_b = {}, _b[finalKey] = parse ? parse(newValue) : newValue, _b)) });
    };
}
export function initialize(initialValues, onSubmit) {
    return function initialize(f) {
        var initialValuesMap = {};
        var arrayKeys = [];
        function traverseValues(value, keyPath) {
            if (Array.isArray(value) && value.length > 0 && typeof value[0] === 'object') {
                var itemIDs_1 = new Array(value.length).fill(null).map(function () { return randomID(); });
                value.forEach(function (v, i) { return traverseValues(v, keyPath.concat(itemIDs_1[i])); });
                arrayKeys.push(keyPath.join("."));
                initialValuesMap[keyPath.join(".")] = itemIDs_1;
            }
            else if (value != undefined && typeof value === "object" && !Array.isArray(value)) {
                Object.keys(value).forEach(function (k) {
                    traverseValues(value[k], keyPath.concat(k));
                });
            }
            else {
                initialValuesMap[keyPath.join(".")] = value;
            }
        }
        initialValues && traverseValues(initialValues, []);
        return tslib_1.__assign({}, f, { arrayKeys: arrayKeys, onSubmit: onSubmit, values: initialValuesMap, initialValues: initialValuesMap });
    };
}
export function addArrayItem(key, oldKeys) {
    return function addArrayItem(f) {
        return changeValue(key, (oldKeys || []).concat(randomID()))(f);
    };
}
export function removeArrayItem(key, oldKeys, removedKey) {
    return function removeArrayItem(f) {
        var i = oldKeys.indexOf(removedKey);
        var copy = oldKeys.slice();
        copy.splice(i, 1);
        function filterKey(oldMap) {
            return Object.keys(oldMap).reduce(function (newV, k) {
                if (!(k.includes(removedKey))) {
                    newV[k] = oldMap[k];
                    return newV;
                }
            }, {});
        }
        var s1 = changeValue(key, copy)(f);
        return tslib_1.__assign({}, s1, { errors: filterKey(tslib_1.__assign({}, f.errors, s1.errors)), values: filterKey(tslib_1.__assign({}, f.errors, s1.errors)), meta: filterKey(tslib_1.__assign({}, f.meta, s1.meta)) });
    };
}
//# sourceMappingURL=mutations.js.map