import { reduxForm } from 'redux-form';
var decorators = [
    reduxForm({
        form: "default"
    })
];
export var getDecorator = function () {
    return function (x) { return decorators.reduce(function (current, func) {
        return func(current);
    }, x); };
};
export var pushDecorator = function (decorator) { return decorators.push(decorator); };
//# sourceMappingURL=decorate.js.map