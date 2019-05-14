"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var React = require("react");
var rehooker_1 = require("rehooker");
var operators_1 = require("rxjs/operators");
var _1 = require(".");
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
            values &&
            Object.keys(values).length === Object.keys(s.initialValues).length &&
            Object.keys(values).every(function (k) {
                var v1 = values[k];
                var v2 = s.initialValues[k];
                return v1 === v2 || v1 == undefined && v2 == undefined;
            });
        var hasError = Object.keys(s.errors).length !== 0;
        var submittable = !hasError &&
            !pristine &&
            !s.submitting &&
            !(props.disableResubmit && s.submitSucceeded);
        return {
            submittable: submittable,
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
        onSubmit: function (e) {
            if (e && e.preventDefault) {
                e.preventDefault();
            }
            _1.submit(props.form.next, props.onSubmit);
        },
        onReset: function (e) {
            if (e && e.preventDefault) {
                e.preventDefault();
            }
            props.form.next(_1.reset);
        }
    };
    if (!props.children)
        return React.createElement(FormButtonsImpl, tslib_1.__assign({}, childProps));
    return React.createElement(React.Fragment, null, props.children(childProps));
}
exports.FormButtons = FormButtons;
//# sourceMappingURL=inject-submittable.js.map