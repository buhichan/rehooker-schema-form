import { __assign, __spreadArrays } from "tslib";
export var requestFileUpload = function (multiple) {
    var input;
    input = document.getElementById('hidden-file-input');
    if (!input) {
        input = document.createElement('input');
        input.type = "file";
        input.id = 'hidden-file-input';
        input.style.display = 'hidden';
        document.body.appendChild(input);
    }
    input.multiple = multiple;
    var promise = new Promise(function (resolve, _) {
        input.onchange = function (e) {
            var files = e.target.files;
            resolve({
                files: Array.from(files || []),
                clear: function () { return document.body.removeChild(input); }
            });
        };
        input.click();
    });
    return promise;
};
export var requestDownload = function (options) {
    var input = document.getElementById('hidden-anchor');
    if (!input) {
        input = document.createElement('a');
        input.id = 'hidden-anchor';
        document.body.appendChild(input);
    }
    input.href = options.href;
    input.download = options.download;
    input.click();
};
export function deepGet(target, keys, i) {
    if (i === void 0) { i = 0; }
    if (i >= keys.length || target == undefined) {
        return target;
    }
    else {
        return deepGet(target[keys[i]], keys, i + 1);
    }
}
export function deepSet(target, keys, newValue, i, parentCursor) {
    if (i === void 0) { i = 0; }
    if (!parentCursor) {
        target = Array.isArray(target) ? __spreadArrays(target) : __assign({}, target);
        parentCursor = target;
    }
    if (i === keys.length - 1) {
        parentCursor[keys[i]] = newValue;
        return target;
    }
    else {
        var key = keys[i];
        var oldValue = parentCursor[keys[i]];
        if (Array.isArray(oldValue)) {
            parentCursor[keys[i]] = __spreadArrays(oldValue);
        }
        else if (typeof oldValue === 'object') {
            parentCursor[keys[i]] = __assign({}, oldValue);
        }
        else {
            parentCursor[keys[i]] = typeof key === 'number' ? [] : {};
        }
        return deepSet(target, keys, newValue, i + 1, parentCursor[keys[i]]);
    }
}
export function randomID() {
    return String(Math.floor(Math.random() * 1000000000));
}
//# sourceMappingURL=utils.js.map