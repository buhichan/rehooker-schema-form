"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Created by YS on 2016/10/31.
 */
var React = require("react");
var redux_form_1 = require("redux-form");
var schema_node_1 = require("./schema-node");
var _a = require("redux-form"), Field = _a.Field, FieldArray = _a.FieldArray;
var DefaultButton = function (props) {
    return React.createElement("button", { type: props.type, className: "btn btn-primary" + (props.disabled ? " disabled" : ""), disabled: props.disabled, onClick: props.onClick }, props.children);
};
function setButton(button) {
    DefaultButton = button;
}
exports.setButton = setButton;
var ReduxSchemaForm = (function (_super) {
    __extends(ReduxSchemaForm, _super);
    function ReduxSchemaForm() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ReduxSchemaForm.prototype.submitable = function () {
        return this.props['valid'] && !this.props['pristine'] && !this.props['submitting'];
    };
    ReduxSchemaForm.prototype.render = function () {
        return React.createElement("form", { className: "redux-schema-form form-horizontal", onSubmit: this.props['handleSubmit'] },
            React.createElement(schema_node_1.SchemaNode, { schema: this.props.schema, form: this.props.form, initialValues: this.props.initialValues }),
            this.props.children ? React.createElement("div", { className: "children" }, this.props.children) : null,
            (!this.props.noButton && !this.props.readonly) ? React.createElement("div", { className: "button" },
                React.createElement("div", { className: "btn-group" },
                    React.createElement(DefaultButton, { type: "submit", disabled: !this.submitable.apply(this) }, "\u63D0\u4EA4"),
                    React.createElement(DefaultButton, { type: "button", disabled: !this.submitable.apply(this), onClick: this.props.reset }, "\u91CD\u7F6E"))) : React.createElement("div", null));
    };
    return ReduxSchemaForm;
}(React.PureComponent));
ReduxSchemaForm = __decorate([
    redux_form_1.reduxForm({
        form: "default"
    })
], ReduxSchemaForm);
exports.ReduxSchemaForm = ReduxSchemaForm;
//# sourceMappingURL=form.js.map