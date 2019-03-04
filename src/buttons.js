import * as tslib_1 from "tslib";
import { createSelector } from 'reselect';
import { connect } from "react-redux";
import * as React from 'react';
import { isValid, isPristine, isSubmitting, hasSubmitSucceeded, submit, reset } from "redux-form";
export var FormButton = function (props) {
    return React.createElement("button", { type: props.type, className: "btn btn-primary" + (props.disabled ? " disabled" : ""), disabled: props.disabled, onClick: props.onClick }, props.children);
};
export var submittable = function (formState) {
    var valid = formState.valid, pristine = formState.pristine, submitting = formState.submitting, submitSucceeded = formState.submitSucceeded, disableResubmit = formState.disableResubmit;
    return valid && !pristine && !submitting && !(disableResubmit && submitSucceeded);
};
export function setButton(button) {
    FormButton = button;
}
var createFormSubmittableSelector = function (formName, disableResubmit, isSubmittable) {
    if (isSubmittable === void 0) { isSubmittable = submittable; }
    return createSelector([
        function (s) { return isValid(formName)(s); },
        function (s) { return isPristine(formName)(s); },
        function (s) { return isSubmitting(formName)(s); },
        function (s) { return hasSubmitSucceeded(formName)(s); }
    ], function (valid, pristine, submitting, submitSucceeded) {
        return {
            formName: formName,
            disabled: !isSubmittable({ disableResubmit: disableResubmit, valid: valid, pristine: pristine, submitting: submitting, submitSucceeded: submitSucceeded })
        };
    });
};
export var InjectFormSubmittable = connect(function (_, props) { return createFormSubmittableSelector(props.formName, props.disableResubmit, props.submittable); })(function InjectFormSubmittable(props) {
    return props.children({
        disabled: props.disabled,
        onSubmit: function () {
            props.dispatch(submit(props.formName));
        },
        onReset: function () {
            props.dispatch(reset(props.formName));
        }
    });
});
/**
 *
 * @deprecated
 */
export var injectSubmittable = function (options) {
    return function (Button) { return connect(function (_, p) {
        return createFormSubmittableSelector(p.formName || options.formName, options.disableResubmit, options.submittable);
    })(/** @class */ (function (_super) {
        tslib_1.__extends(ConnectedButton, _super);
        function ConnectedButton() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.onClick = function () {
                _this.props.dispatch(options.type === 'submit' ? submit(_this.props.formName) : reset(_this.props.formName));
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