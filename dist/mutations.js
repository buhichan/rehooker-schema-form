"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var utils_1 = require("./utils");
var SubmissionError = /** @class */ (function () {
    function SubmissionError(error) {
        this.error = error;
    }
    return SubmissionError;
}());
exports.SubmissionError = SubmissionError;
function registerField(schema, keyPath) {
    return function registerField(f) {
        var _a;
        var key = (keyPath + "." + schema.key).slice(1);
        return tslib_1.__assign({}, f, { meta: tslib_1.__assign({}, f.meta, (_a = {}, _a[key] = {
                schema: schema
            }, _a)) });
    };
}
exports.registerField = registerField;
function unregisterField(schema, keyPath) {
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
exports.unregisterField = unregisterField;
function submit(dispatch) {
    return dispatch(function submit(f) {
        var values = f.values;
        if (!values)
            return f;
        var arrayKeys = Object.keys(f.meta).filter(function (x) { return f.meta[x].schema.type === 'array'; });
        var mapItemIDToIndex = arrayKeys.reduce(function (map, key) {
            var value = values[key];
            value instanceof Array && value.forEach(function (x, i) {
                map[x] = i;
            });
            return map;
        }, {});
        var finalValue = Object.keys(values).filter(function (x) { return !arrayKeys.includes(x); }).reduce(function (res, key) {
            utils_1.deepSet(res, key.split(".").map(function (x) { return x in mapItemIDToIndex ? mapItemIDToIndex[x] : x; }), values[key]);
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
exports.submit = submit;
function reset(f) {
    return tslib_1.__assign({}, f, { values: f.initialValues });
}
exports.reset = reset;
function changeValue(schema, keyPath, valueOrEvent) {
    return function changeValue(s) {
        var _a, _b;
        var newValue = valueOrEvent && typeof valueOrEvent === 'object' && 'target' in valueOrEvent ? valueOrEvent.target.value : valueOrEvent;
        var key = (keyPath + "." + schema.key).slice(1);
        var error = schema.validate && schema.validate(newValue, s.values) || undefined;
        if (error) {
            s.errors = tslib_1.__assign({}, s.errors, (_a = {}, _a[key] = error, _a));
        }
        else {
            delete s.errors[key];
        }
        return tslib_1.__assign({}, s, { errors: tslib_1.__assign({}, s.errors), values: tslib_1.__assign({}, s.values, (_b = {}, _b[key] = schema.parse ? schema.parse(newValue) : newValue, _b)) });
    };
}
exports.changeValue = changeValue;
function initialize(initialValues, onSubmit) {
    function traverseValues(map, value, keyPath) {
        if (Array.isArray(value) && value.length > 0 && typeof value[0] === 'object') {
            var itemIDs_1 = new Array(value.length).fill(null).map(function () { return utils_1.randomID(); });
            map[keyPath.join(".")] = itemIDs_1;
            value.forEach(function (v, i) { return traverseValues(map, v, keyPath.concat(itemIDs_1[i])); });
        }
        else if (value != undefined && typeof value === "object" && !Array.isArray(value)) {
            Object.keys(value).forEach(function (k) {
                traverseValues(map, value[k], keyPath.concat(k));
            });
        }
        else {
            map[keyPath.join(".")] = value;
        }
    }
    return function initialize(f) {
        var initialValuesMap = {};
        initialValues && traverseValues(initialValuesMap, initialValues, []);
        return tslib_1.__assign({}, f, { onSubmit: onSubmit, values: f.values === undefined ? initialValuesMap : f.values, initialValues: initialValuesMap });
    };
}
exports.initialize = initialize;
function addArrayItem(schema, keyPath, oldKeys) {
    return function addArrayItem(f) {
        return changeValue(schema, keyPath, (oldKeys || []).concat(utils_1.randomID()))(f);
    };
}
exports.addArrayItem = addArrayItem;
function removeArrayItem(schema, keyPath, oldKeys, removedKey) {
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
        var s1 = changeValue(schema, keyPath, copy)(f);
        return tslib_1.__assign({}, s1, { errors: filterKey(tslib_1.__assign({}, f.errors, s1.errors)), values: filterKey(tslib_1.__assign({}, f.errors, s1.errors)), meta: filterKey(tslib_1.__assign({}, f.meta, s1.meta)) });
    };
}
exports.removeArrayItem = removeArrayItem;
//# sourceMappingURL=mutations.js.map