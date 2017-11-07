"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
/**
 * Created by YS on 2016/10/31.
 */
var buttons_1 = require("./buttons");
var React = require("react");
var redux_form_1 = require("redux-form");
var render_fields_1 = require("./render-fields");
var ReduxSchemaForm = (function (_super) {
    tslib_1.__extends(ReduxSchemaForm, _super);
    function ReduxSchemaForm() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ReduxSchemaForm.prototype.render = function () {
        return React.createElement("form", { className: "redux-schema-form form-horizontal", onSubmit: this.props.handleSubmit },
            render_fields_1.renderFields(this.props.form, this.props.schema),
            this.props.children ? React.createElement("div", { className: "children" }, this.props.children) : null,
            (!this.props.noButton) ? React.createElement("div", { className: "button" },
                React.createElement("div", { className: "btn-group" },
                    React.createElement(buttons_1.FormButton, { type: "submit", disabled: !buttons_1.submittable(this.props.disableResubmit)(this.props) }, "\u63D0\u4EA4"),
                    React.createElement(buttons_1.FormButton, { type: "button", disabled: !buttons_1.submittable(this.props.disableResubmit)(this.props) }, "\u91CD\u7F6E"))) : React.createElement("div", null));
    };
    ReduxSchemaForm = tslib_1.__decorate([
        redux_form_1.reduxForm({
            form: "default"
        })
    ], ReduxSchemaForm);
    return ReduxSchemaForm;
}(React.PureComponent));
exports.ReduxSchemaForm = ReduxSchemaForm;
//# sourceMappingURL=form.js.map