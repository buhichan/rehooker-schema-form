import * as tslib_1 from "tslib";
import * as React from 'react';
import { useSource } from 'rehooker';
import { map } from 'rxjs/operators';
import { submit, reset } from './mutations';
var FormButtonsImpl = function (props) {
    return React.createElement("div", { className: "button" },
        React.createElement("div", { className: "btn-group" },
            React.createElement("button", { type: "submit", className: "btn btn-primary" + (props.disabled ? " disabled" : ""), disabled: props.disabled, onClick: props.onSubmit }, "submit"),
            React.createElement("button", { type: "submit", className: "btn btn-primary" + (props.disabled ? " disabled" : ""), disabled: props.disabled, onClick: props.onSubmit }, "reset")));
};
export function setButton(buttons) {
    if (buttons) {
        FormButtonsImpl = buttons;
    }
}
export function FormButtons(props) {
    var res = useSource(props.form.stream, map(function (s) {
        var values = s.values;
        var pristine = s.initialValues &&
            values &&
            Object.keys(values).length === Object.keys(s.initialValues).length &&
            Object.keys(values).every(function (k) {
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
        onSubmit: function (e) {
            if (e && e.preventDefault) {
                e.preventDefault();
            }
            submit(props.form.next);
        },
        onReset: function (e) {
            if (e && e.preventDefault) {
                e.preventDefault();
            }
            props.form.next(reset);
        }
    };
    if (!props.children)
        return React.createElement(FormButtonsImpl, tslib_1.__assign({}, childProps));
    return React.createElement(React.Fragment, null, props.children(childProps));
}
//# sourceMappingURL=inject-submittable.js.map