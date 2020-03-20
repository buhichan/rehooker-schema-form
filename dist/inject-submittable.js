import { __assign } from "tslib";
import * as React from 'react';
import { useSource } from 'rehooker';
import { map } from 'rxjs/operators';
import { submit, reset } from './mutations';
import { SchemaFormConfigConsumer } from "./config";
export function FormButtons(props) {
    var res = useSource(props.form.stream, map(function (s) {
        var pristine = s.initialValues === s.values;
        var hasError = !s.valid;
        var submittable = !hasError &&
            (props.allowPristine || !pristine) &&
            !s.submitting &&
            !(props.disableResubmit && s.submitSucceeded);
        return {
            pristine: pristine,
            submittable: submittable,
            submitting: s.submitting,
            submitSucceeded: s.submitSucceeded
        };
    }), [props.form, props.allowPristine, props.disableResubmit]);
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
        return React.createElement(SchemaFormConfigConsumer, null, function (_a) {
            var FormButtonsImpl = _a.buttonRenderer;
            return React.createElement(FormButtonsImpl, __assign({}, childProps));
        });
    return React.createElement(React.Fragment, null, props.children(childProps));
}
//# sourceMappingURL=inject-submittable.js.map