"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var reselect_1 = require("reselect");
var react_redux_1 = require("react-redux");
var React = require("react");
var redux_form_1 = require("redux-form");
exports.FormButton = function (props) {
    return React.createElement("button", { type: props.type, className: "btn btn-primary" + (props.disabled ? " disabled" : ""), disabled: props.disabled, onClick: props.onClick }, props.children);
};
exports.submittable = function (formState) {
    var valid = formState.valid, pristine = formState.pristine, submitting = formState.submitting, submitSucceeded = formState.submitSucceeded, disableResubmit = formState.disableResubmit;
    return valid && !pristine && !submitting && !(disableResubmit && submitSucceeded);
};
function setButton(button) {
    exports.FormButton = button;
}
exports.setButton = setButton;
var createFormSubmittableSelector = function (formName, disableResubmit, isSubmittable) {
    if (isSubmittable === void 0) { isSubmittable = exports.submittable; }
    return reselect_1.createSelector([
        function (s) { return redux_form_1.isValid(formName)(s); },
        function (s) { return redux_form_1.isPristine(formName)(s); },
        function (s) { return redux_form_1.isSubmitting(formName)(s); },
        function (s) { return redux_form_1.hasSubmitSucceeded(formName)(s); }
    ], function (valid, pristine, submitting, submitSucceeded) {
        return {
            formName: formName,
            disabled: !isSubmittable({ disableResubmit: disableResubmit, valid: valid, pristine: pristine, submitting: submitting, submitSucceeded: submitSucceeded })
        };
    });
};
exports.InjectFormSubmittable = react_redux_1.connect(function (_, props) { return createFormSubmittableSelector(props.formName, props.disableResubmit, props.submittable); })(function InjectFormSubmittable(props) {
    return props.children({
        disabled: props.disabled,
        onSubmit: function () {
            props.dispatch(redux_form_1.submit(props.formName));
        },
        onReset: function () {
            props.dispatch(redux_form_1.reset(props.formName));
        }
    });
});
/**
 *
 * @deprecated
 */
exports.injectSubmittable = function (options) {
    return function (Button) { return react_redux_1.connect(function (_, p) {
        return createFormSubmittableSelector(p.formName || options.formName, options.disableResubmit, options.submittable);
    })(/** @class */ (function (_super) {
        tslib_1.__extends(ConnectedButton, _super);
        function ConnectedButton() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.onClick = function () {
                _this.props.dispatch(options.type === 'submit' ? redux_form_1.submit(_this.props.formName) : redux_form_1.reset(_this.props.formName));
            };
            return _this;
        }
        ConnectedButton.prototype.render = function () {
            var _a = this.props, dispatch = _a.dispatch, formName = _a.formName, rest = tslib_1.__rest(_a, ["dispatch", "formName"]);
            return React.createElement(Button, tslib_1.__assign({}, rest, { type: options.type, onClick: this.onClick }));
        };
        return ConnectedButton;
    }(React.PureComponent))); };
};
//# sourceMappingURL=buttons.js.map