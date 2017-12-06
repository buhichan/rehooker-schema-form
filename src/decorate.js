"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var redux_form_1 = require("redux-form");
var decorators = [
    redux_form_1.reduxForm({
        form: "default"
    })
];
exports.getDecorator = function () {
    return function (x) { return decorators.reduce(function (current, func) {
        return func(current);
    }, x); };
};
exports.pushDecorator = function (decorator) { return decorators.push(decorator); };
//# sourceMappingURL=decorate.js.map