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
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Created by YS on 2016/10/31.
 */
var React = require("react");
var redux_form_1 = require("redux-form");
var _a = require("redux-form"), Field = _a.Field, FieldArray = _a.FieldArray;
var DefaultButton = function (props) {
    return React.createElement("button", { type: props.type, className: "btn btn-primary" + (props.disabled ? " disabled" : ""), disabled: props.disabled, onClick: props.onClick }, props.children);
};
function changeField(parsedSchema, value) {
    var index = -1;
    parsedSchema.every(function (prev, i) {
        if (prev.key == value.key) {
            index = i;
            return false;
        }
        if (prev.children) {
            var nextChildren = changeField(prev.children, value);
            if (nextChildren !== prev.children) {
                prev.children = nextChildren;
                return false;
            }
        }
        return true;
    });
    if (index >= 0) {
        parsedSchema[index] = __assign({}, parsedSchema[index], value);
        return parsedSchema;
    }
    else {
        return parsedSchema;
    }
}
var customTypes = new Map();
function addType(name, widget) {
    customTypes.set(name, widget);
}
exports.addType = addType;
function setButton(button) {
    DefaultButton = button;
}
exports.setButton = setButton;
function DefaultArrayFieldRenderer(props) {
    var _this = this;
    return React.createElement("div", null,
        props.map(function (name, i) {
            return React.createElement("div", { key: i },
                _this.renderField(props.fieldSchema.children[i]),
                React.createElement("button", { onClick: props.remove(i) },
                    React.createElement("i", { className: "fa fa-minus" })));
        }),
        React.createElement("button", { onClick: props.push() },
            React.createElement("i", { className: "fa fa-plus" })));
}
var ReduxSchemaForm = (function (_super) {
    __extends(ReduxSchemaForm, _super);
    function ReduxSchemaForm() {
        var _this = _super.call(this) || this;
        _this.pendingSchemaChanges = [];
        _this.state = {
            parsedSchema: []
        };
        return _this;
    }
    ReduxSchemaForm.prototype.pendSchemaChange = function (newFields) {
        if (!(newFields instanceof Promise))
            newFields = Promise.resolve(newFields);
        this.pendingSchemaChanges.push(newFields);
    };
    ReduxSchemaForm.prototype.getChangedSchema = function (oldSchema) {
        var res = Promise.all(this.pendingSchemaChanges).then(function (changes) {
            return changes.reduce(function (oldSchema, newFields) {
                return newFields.reduce(function (prev, curr) {
                    return changeField(prev, curr);
                }, oldSchema);
            }, oldSchema.slice(0));
        });
        this.pendingSchemaChanges = [];
        return res;
    };
    ReduxSchemaForm.prototype.parseField = function (field, prefix) {
        var _this = this;
        var promises = [];
        var parsedField = __assign({}, field);
        parsedField.parsedKey = (prefix ? (prefix + ".") : "") + parsedField.key;
        if (field.onValueChange) {
            parsedField.normalize = function (value, previousValue, formValue) {
                var newFields = field.onValueChange(value, previousValue, formValue);
                if (newFields) {
                    _this.pendSchemaChange(newFields);
                    _this.getChangedSchema(_this.state.parsedSchema).then(function (newSchema) {
                        _this.setState({
                            parsedSchema: newSchema
                        });
                    });
                }
                return field.normalize ? field.normalize(value, previousValue, formValue) : value;
            };
            var newFields = field.onValueChange(this.props.initialValues[field.key], undefined, this.props.initialValues);
            if (newFields)
                this.pendSchemaChange(newFields);
        }
        if (field.children instanceof Array) {
            promises.push(this.parseSchema(field.children, parsedField.key).then(function (children) {
                parsedField.children = children;
            }));
        }
        if (field.options && typeof field.options === 'function' && !field.options.length) {
            var asyncOptions = field.options;
            promises.push(asyncOptions().then(function (options) {
                parsedField['options'] = options;
                return parsedField;
            }));
        }
        else {
            promises.push(Promise.resolve(field));
        }
        return Promise.all(promises).then(function () {
            return parsedField;
        });
    };
    ReduxSchemaForm.prototype.parseSchema = function (newSchema, prefix) {
        var _this = this;
        if (prefix === void 0) { prefix = ""; }
        var promises = newSchema.map(function (field) { return _this.parseField(field, prefix); });
        return Promise.all(promises);
    };
    ReduxSchemaForm.prototype.componentWillReceiveProps = function (newProps) {
        if (newProps.schema !== this.props.schema) {
            this.parseSchema(newProps.schema).then(this.onReady.bind(this));
        }
    };
    ReduxSchemaForm.prototype.onReady = function (schema) {
        var _this = this;
        this.getChangedSchema(schema).then(function (schema) {
            _this.setState({
                parsedSchema: schema
            });
        });
    };
    ReduxSchemaForm.prototype.componentWillMount = function () {
        this.parseSchema(this.props.schema).then(this.onReady.bind(this));
    };
    ReduxSchemaForm.prototype.renderField = function (fieldSchema) {
        var hide = fieldSchema.hide, type = fieldSchema.type, parsedKey = fieldSchema.parsedKey, label = fieldSchema.label, options = fieldSchema.options, children = fieldSchema.children, getChildren = fieldSchema.getChildren, rest = __rest(fieldSchema, ["hide", "type", "parsedKey", "label", "options", "children", "getChildren"]);
        if (customTypes.has(type)) {
            var CustomWidget = customTypes.get(type);
            return React.createElement(CustomWidget, __assign({ fieldSchema: fieldSchema }, rest, { renderField: this.renderField.bind(this) }));
        }
        //noinspection FallThroughInSwitchStatementJS
        switch (type) {
            case "number":
            case "text":
            case "color":
            case "password":
            case "date":
            case "datetime-local":
            case "file":
                return React.createElement("div", { className: "form-group" },
                    React.createElement("label", { className: "control-label col-md-2", htmlFor: this.props.form + '-' + parsedKey }, label),
                    React.createElement("div", { className: "col-md-10" },
                        React.createElement(Field, __assign({ className: "form-control", name: parsedKey }, rest, { component: "input" }))));
            case "textarea":
                return React.createElement("div", { className: "form-group" },
                    React.createElement("label", { className: "control-label col-md-2", htmlFor: this.props.form + '-' + parsedKey }, label),
                    React.createElement("div", { className: "col-md-10" },
                        React.createElement(Field, __assign({ className: "form-control", name: parsedKey }, rest, { component: "textarea" }))));
            case "checkbox":
                return React.createElement("div", { className: "form-group" },
                    React.createElement("label", { className: "control-label col-md-2", htmlFor: this.props.form + '-' + parsedKey }, label),
                    React.createElement("div", { className: "col-md-10" },
                        React.createElement(Field, __assign({ className: " checkbox", name: parsedKey }, rest, { component: "input" }))));
            case "select":
                return React.createElement("div", { className: "form-group" },
                    React.createElement("label", { className: "control-label col-md-2", htmlFor: this.props.form + '-' + parsedKey }, label),
                    React.createElement("div", { className: "col-md-10" },
                        React.createElement(Field, __assign({ className: "form-control", name: parsedKey }, rest, { component: "select" }),
                            React.createElement("option", null),
                            options.map(function (option, i) { return React.createElement("option", { key: i, value: option.value }, option.name); }))));
            case "array":
                return React.createElement("div", { className: "form-group" },
                    React.createElement("label", { className: "control-label col-md-2", htmlFor: this.props.form + '-' + parsedKey }, label),
                    React.createElement("div", { className: "col-md-10" },
                        React.createElement(FieldArray, __assign({ name: parsedKey }, rest, { fieldSchema: fieldSchema, component: DefaultArrayFieldRenderer }))));
            case "group":
                return React.createElement("fieldset", null,
                    React.createElement("legend", null, label),
                    this.renderSchema(children));
            default:
                return React.createElement("span", null,
                    "\u4E0D\u53EF\u8BC6\u522B\u7684\u5B57\u6BB5:",
                    JSON.stringify(fieldSchema));
        }
    };
    ReduxSchemaForm.prototype.submitable = function () {
        return this.props['valid'] && !this.props['pristine'] && !this.props['submitting'];
    };
    ReduxSchemaForm.prototype.renderSchema = function (schema) {
        var _this = this;
        return schema.map(function (field) {
            if (field.hide)
                return null;
            return React.createElement("div", { key: field.key || field.label, className: field.type }, _this.renderField(field));
        });
    };
    ReduxSchemaForm.prototype.render = function () {
        return React.createElement("form", { className: "redux-schema-form form-horizontal", onSubmit: this.props['handleSubmit'] },
            this.renderSchema(this.state.parsedSchema),
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
    }),
    __metadata("design:paramtypes", [])
], ReduxSchemaForm);
exports.ReduxSchemaForm = ReduxSchemaForm;
//# sourceMappingURL=form.js.map