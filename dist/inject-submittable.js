import * as tslib_1 from "tslib";
import * as React from 'react';
import { useSource } from 'rehooker';
import { map } from 'rxjs/operators';
import { submit, reset } from '.';
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
        var pristine = s.initialValues === s.values;
        var hasError = !s.valid;
        var submittable = !hasError &&
            !pristine &&
            !s.submitting &&
            !(props.disableResubmit && s.submitSucceeded);
        return {
            pristine: pristine,
            submittable: submittable,
            submitting: s.submitting,
            submitSucceeded: s.submitSucceeded
        };
    }), [props.form]);
    if (!res)
        return null;
    var childProps = {
        pristine: res.pristine,
        disabled: !res.submittable,
        submitting: res.submitting,
        submitSucceeded: res.submitSucceeded,
        onSubmit: function (e) {
            if (e && e.preventDefault) {
                e.preventDefault();
            }
            submit(props.form.next, props.onSubmit);
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