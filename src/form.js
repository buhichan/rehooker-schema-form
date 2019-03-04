import * as tslib_1 from "tslib";
/**
 * Created by YS on 2016/10/31.
 */
import { FormButton, submittable } from './buttons';
import * as React from 'react';
import { reset } from 'redux-form';
import { renderFields } from "./render-fields";
import { getDecorator } from './decorate';
var ReduxSchemaForm = /** @class */ (function (_super) {
    tslib_1.__extends(ReduxSchemaForm, _super);
    function ReduxSchemaForm() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.reset = function () { return _this.props.dispatch(reset(_this.props.form)); };
        return _this;
    }
    ReduxSchemaForm.prototype.render = function () {
        var formClass = this.props.classes && this.props.classes.form ? this.props.classes.form : "";
        return React.createElement("form", { id: this.props.form, className: "redux-schema-form form-horizontal " + formClass, onSubmit: this.props.handleSubmit },
            renderFields(this.props.form, this.props.schema),
            this.props.children ? React.createElement("div", { className: "children" }, this.props.children) : null,
            (!this.props.noButton) ? React.createElement("div", { className: "button" },
                React.createElement("div", { className: "btn-group" },
                    React.createElement(FormButton, { type: "submit", disabled: !submittable(this.props) }, "\u63D0\u4EA4"),
                    React.createElement(FormButton, { type: "button", onClick: this.reset, disabled: !submittable(this.props) }, "\u91CD\u7F6E"))) : React.createElement("div", null));
    };
    ReduxSchemaForm = tslib_1.__decorate([
        getDecorator()
    ], ReduxSchemaForm);
    return ReduxSchemaForm;
}(React.PureComponent));
export { ReduxSchemaForm };
//# sourceMappingURL=form.js.map