"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var React = require("react");
var rehooker_1 = require("rehooker");
var operators_1 = require("rxjs/operators");
var mutations_1 = require("./mutations");
var FormButtonsImpl = function (props) {
    return React.createElement("div", { className: "button" },
        React.createElement("div", { className: "btn-group" },
            React.createElement("button", { type: "submit", className: "btn btn-primary" + (props.disabled ? " disabled" : ""), disabled: props.disabled, onClick: props.onSubmit }, "submit"),
            React.createElement("button", { type: "submit", className: "btn btn-primary" + (props.disabled ? " disabled" : ""), disabled: props.disabled, onClick: props.onSubmit }, "reset")));
};
function setButton(buttons) {
    if (buttons) {
        FormButtonsImpl = buttons;
    }
}
exports.setButton = setButton;
function FormButtons(props) {
    var res = rehooker_1.useSource(props.form.stream, operators_1.map(function (s) {
        var values = s.values;
        var pristine = s.initialValues &&
            values && Object.keys(values).every(function (k) {
            var v1 = values[k];
            var v2 = s.initialValues[k];
            return v1 === v2 || !v1 && !v2;
        });
        var hasError = Object.keys(s.errors).length !== 0;
        return {
            submittable: !hasError &&
                !pristine &&
                !s.submitting &&
                !(props.disableResubmit && s.submitSucceeded),
            submitting: s.submitting,
            submitSucceeded: s.submitSucceeded
        };
    }), [props.form]);
    if (!res)
        return null;
    var childProps = {
        disabled: !res.submittable,
        submitting: res.submitting,
        submitSucceeded: res.submitSucceeded,
        onSubmit: function () {
            mutations_1.submit(props.form.next);
        },
        onReset: function () {
            props.form.next(mutations_1.reset);
        }
    };
    if (!props.children)
        return React.createElement(FormButtonsImpl, tslib_1.__assign({}, childProps));
    return React.createElement(React.Fragment, null, props.children(childProps));
}
exports.FormButtons = FormButtons;
//# sourceMappingURL=inject-submittable.js.map