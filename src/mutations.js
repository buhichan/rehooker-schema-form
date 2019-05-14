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
function registerField(key, schema) {
    return function registerField(f) {
        var _a;
        return tslib_1.__assign({}, f, { meta: tslib_1.__assign({}, f.meta, (_a = {}, _a[key] = {
                schema: schema
            }, _a)) });
    };
}
exports.registerField = registerField;
function unregisterField(key) {
    return function unregisterField(f) {
        if (!(f.values && key in f.values) &&
            !(f.errors && key in f.errors) &&
            !(f.meta && key in f.meta)) {
            //no change to make
            return f;
        }
        return tslib_1.__assign({}, f, f.values ? {
            values: deleteKey(f.values, key)
        } : {}, f.errors ? {
            errors: deleteKey(f.errors, key)
        } : {}, f.meta ? {
            meta: deleteKey(f.meta, key)
        } : {});
    };
}
exports.unregisterField = unregisterField;
function submit(dispatch, submitFunc) {
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
            utils_1.deepSet(res, key.split(".").map(function (x) { return x in mapItemIDToIndex ? mapItemIDToIndex[x] : x; }), values[key]);
            return res;
        }, {});
        var maybePromise = submitFunc(finalValue);
        if (maybePromise instanceof Promise) {
            //setTimeout 是为了避免立刻提交产生的执行顺序的问题
            maybePromise.then(function () {
                setTimeout(function () {
                    dispatch(function submitSucceed(f) {
                        return tslib_1.__assign({}, f, { submitting: false, submitSucceeded: true });
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
exports.submit = submit;
function reset(f) {
    return tslib_1.__assign({}, f, { values: f.initialValues });
}
exports.reset = reset;
function startValidation(key, validate) {
    return function startValidation(s) {
        var _a;
        if (s.values) {
            var value = s.values[key];
            var newError = validate && validate(value, s.values) || undefined;
            return tslib_1.__assign({}, s, { errors: newError ? tslib_1.__assign({}, s.errors, (_a = {}, _a[key] = newError, _a)) : deleteKey(s.errors, key) });
        }
        else {
            return s;
        }
    };
}
exports.startValidation = startValidation;
function changeValue(key, valueOrEvent, validate, parse) {
    return function changeValue(s) {
        var _a, _b;
        var newValue = valueOrEvent && typeof valueOrEvent === 'object' && 'target' in valueOrEvent ? valueOrEvent.target.value : valueOrEvent;
        var newError = validate && validate(newValue, s.values) || undefined;
        return tslib_1.__assign({}, s, { errors: newError ? tslib_1.__assign({}, s.errors, (_a = {}, _a[key] = newError, _a)) : deleteKey(s.errors, key), values: tslib_1.__assign({}, s.values, (_b = {}, _b[key] = parse ? parse(newValue) : newValue, _b)) });
    };
}
exports.changeValue = changeValue;
function initialize(initialValues, schema) {
    return function initialize(f) {
        var initialValuesMap = {};
        var arrayKeys = [];
        function traverseValues(value, keyPath) {
            var keyPathStr = keyPath.join(".");
            if (arrayKeys.includes(keyPathStr)) {
                var itemIDs_1 = f.values && keyPathStr in f.values ? f.values[keyPathStr] : new Array(value.length).fill(null).map(function () { return utils_1.randomID(); });
                if (value instanceof Array) {
                    value.forEach(function (v, i) { return traverseValues(v, keyPath.concat(itemIDs_1[i])); });
                }
                initialValuesMap[keyPathStr] = itemIDs_1;
            }
            else if (value != undefined && typeof value === "object" && !Array.isArray(value)) {
                Object.keys(value).forEach(function (k) {
                    traverseValues(value[k], keyPath.concat(k));
                });
            }
            else {
                initialValuesMap[keyPathStr] = value;
            }
        }
        function traverseSchema(schema, keyPath) {
            schema.forEach(function (x) {
                if (x.type === 'array') {
                    arrayKeys.push(keyPath.concat(x.key).join("."));
                    x.children && traverseSchema(x.children, keyPath.concat(x.key));
                }
            });
        }
        traverseSchema(schema, []);
        initialValues && traverseValues(initialValues, []);
        return tslib_1.__assign({}, f, { arrayKeys: arrayKeys,
            schema: schema, values: initialValuesMap, initialValues: initialValuesMap, initialized: true });
    };
}
exports.initialize = initialize;
function addArrayItem(key, oldKeys) {
    return function addArrayItem(f) {
        return changeValue(key, (oldKeys || []).concat(utils_1.randomID()))(f);
    };
}
exports.addArrayItem = addArrayItem;
function removeArrayItem(key, oldKeys, removedId) {
    return function removeArrayItem(f) {
        var i = oldKeys.indexOf(removedId);
        var copy = oldKeys.slice();
        copy.splice(i, 1);
        var removedKeyPath = key + "." + removedId;
        function filterKey(oldMap) {
            return Object.keys(oldMap).reduce(function (newV, k) {
                if (!(k.includes(removedKeyPath))) {
                    newV[k] = oldMap[k];
                }
                return newV;
            }, {});
        }
        var s1 = changeValue(key, copy)(f);
        return tslib_1.__assign({}, s1, { errors: filterKey(tslib_1.__assign({}, s1.errors)), values: filterKey(tslib_1.__assign({}, s1.values)), meta: filterKey(tslib_1.__assign({}, s1.meta)) });
    };
}
exports.removeArrayItem = removeArrayItem;
function deleteKey(obj, key) {
    if (obj == undefined || typeof obj !== 'object' || !(key in obj)) {
        return obj;
    }
    var clone = tslib_1.__assign({}, obj);
    delete clone[key];
    return clone;
}
//# sourceMappingURL=mutations.js.map