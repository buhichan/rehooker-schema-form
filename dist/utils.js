"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestFileUpload = function (multiple) {
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
exports.requestDownload = function (options) {
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
function deepSet(target, keys, value) {
    var parent;
    var p = target;
    for (var i = 0; i < keys.length; i++) {
        var key = keys[i];
        if (typeof p === 'object' && p[key] === undefined) {
            if (i < keys.length && typeof keys[i + 1] === 'number') {
                p[key] = [];
            }
            else
                p[key] = {};
        }
        parent = p;
        p = p[key];
    }
    if (typeof parent === 'object')
        parent[keys[keys.length - 1]] = value;
}
exports.deepSet = deepSet;
function randomID() {
    return String(Math.floor(Math.random() * 1000000000));
}
exports.randomID = randomID;
//# sourceMappingURL=utils.js.map