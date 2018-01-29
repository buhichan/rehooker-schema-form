"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestFileUpload = function (_a) {
    var multiple = _a.multiple;
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
    var promise = new Promise(function (resolve, reject) {
        input.onchange = function (e) {
            var files = e.target.files;
            resolve({
                files: Array.from(files),
                clear: function () { return document.body.removeChild(input); }
            });
        };
        input.click();
    });
    return promise;
};
exports.requestDownload = function (_a) {
    var href = _a.href, download = _a.download;
    var input = document.getElementById('hidden-anchor');
    if (!input) {
        input = document.createElement('a');
        input.id = 'hidden-anchor';
        document.body.appendChild(input);
    }
    input.href = href;
    input.download = download;
    input.click();
};
//# sourceMappingURL=utils.js.map