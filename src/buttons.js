"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var reselect_1 = require("reselect");
var react_redux_1 = require("react-redux");
var React = require("react");
var redux_form_1 = require("redux-form");
exports.buttons = function (Buttons) {
};
exports.FormButton = function (props) {
    return React.createElement("button", { type: props.type, className: "btn btn-primary" + (props.disabled ? " disabled" : ""), disabled: props.disabled, onClick: props.onClick }, props.children);
};
exports.submittable = function (disableResubmit) { return function (_a) {
    var valid = _a.valid, pristine = _a.pristine, submitting = _a.submitting, submitSucceeded = _a.submitSucceeded;
    return valid && !pristine && !submitting && !(disableResubmit && submitSucceeded);
}; };
function setButton(button) {
    exports.FormButton = button;
}
exports.setButton = setButton;
exports.injectSubmittable = function (options) {
    return function (Button) { return react_redux_1.connect(function (s, p) {
        return reselect_1.createSelector([
            redux_form_1.isValid(p.formName || options.formName),
            redux_form_1.isPristine(p.formName || options.formName),
            redux_form_1.isSubmitting(p.formName || options.formName),
            redux_form_1.hasSubmitSucceeded(p.formName || options.formName)
        ], function (valid, pristine, submitting, submitSucceeded) {
            var disabled = options.submittable ?
                !options.submittable(valid, pristine, submitting, submitSucceeded) :
                !exports.submittable(options.disableResubmit)({ valid: valid, pristine: pristine, submitting: submitting, submitSucceeded: submitSucceeded });
            return {
                disabled: disabled
            };
        });
    })(/** @class */ (function (_super) {
        tslib_1.__extends(ConnectedButton, _super);
        function ConnectedButton() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.onClick = function () {
                _this.props.dispatch(options.type === 'submit' ? redux_form_1.submit(options.formName) : redux_form_1.reset(options.formName));
            };
            return _this;
        }
        ConnectedButton.prototype.render = function () {
            var _a = this.props, dispatch = _a.dispatch, rest = tslib_1.__rest(_a, ["dispatch"]);
            return React.createElement(Button, tslib_1.__assign({}, rest, { type: options.type, onClick: this.onClick }));
        };
        return ConnectedButton;
    }(React.PureComponent))); };
};
//# sourceMappingURL=buttons.js.map