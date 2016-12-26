"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
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
/**
 * Created by YS on 2016/10/31.
 */
///<reference path="./declares.d.ts" />
var React = require('react');
var redux_form_1 = require('redux-form');
require("whatwg-fetch");
var _a = require("redux-form"), Field = _a.Field, FieldArray = _a.FieldArray;
var immutable_1 = require("immutable");
var DefaultButton = function (props) {
    return React.createElement("button", {type: props.type, className: "btn btn-primary" + (props.disabled ? " disabled" : ""), disabled: props.disabled, onClick: props.onClick}, props.children);
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
            if (nextChildren !== prev.children)
                return false;
        }
        return true;
    });
    if (index >= 0)
        return parsedSchema.update(index, function (prev) {
            return Object.assign({}, prev, value);
        });
    return parsedSchema;
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
function decorate(obj, prop, cb) {
    var fn = obj[prop];
    obj[prop] = cb(fn);
}
var ReduxSchemaForm = (function (_super) {
    __extends(ReduxSchemaForm, _super);
    function ReduxSchemaForm() {
        _super.call(this);
        this.state = {
            parsedSchema: immutable_1.List([])
        };
    }
    ReduxSchemaForm.prototype.changeSchema = function (newFields) {
        if (newFields.then)
            return newFields.then(this.changeSchema.bind(this));
        var result = newFields.reduce(function (prev, curr) {
            return changeField(prev, curr);
        }, this.state.parsedSchema);
        if (result !== this.state.parsedSchema)
            this.setState({
                parsedSchema: result
            });
    };
    ReduxSchemaForm.prototype.parseField = function (field, prefix) {
        var _this = this;
        var promises = [];
        var parsedField = (Object.assign({}, field));
        parsedField.parsedKey = (prefix ? (prefix + ".") : "") + parsedField.key;
        if (field.onChange) {
            parsedField.normalize = function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i - 0] = arguments[_i];
                }
                var newFields = field.onChange.apply(null, args);
                if (newFields) {
                    _this.changeSchema(newFields);
                }
                return field.normalize ? field.normalize.apply(null, args) : args[0];
            };
        }
        if (field.children instanceof Array) {
            promises.push(this.parseSchema(field.children, parsedField.key).then(function (children) {
                parsedField['children'] = children;
            }));
        }
        if (field.options && typeof field.options === 'function') {
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
        return Promise.all(promises).then(function (parsed) { return immutable_1.List(parsed); });
    };
    ReduxSchemaForm.prototype.DefaultArrayFieldRenderer = function (props) {
        var _this = this;
        return React.createElement("div", null, 
            props.map(function (name, i) {
                return React.createElement("div", {key: i}, 
                    _this.renderField(props.fieldSchema.children[i]), 
                    React.createElement("button", {onClick: props.remove(i)}, 
                        React.createElement("i", {className: "fa fa-minus"})
                    ));
            }), 
            React.createElement("button", {onClick: props.push()}, 
                React.createElement("i", {className: "fa fa-plus"})
            ));
    };
    ReduxSchemaForm.prototype.componentWillReceiveProps = function (newProps) {
        if (newProps.schema !== this.props.schema) {
            this.parseSchema(newProps.schema).then(this.onReady.bind(this));
        }
    };
    ReduxSchemaForm.prototype.onReady = function (schema) {
        if (!this.isUnmounting) {
            this.setState({
                parsedSchema: schema
            });
        }
    };
    ReduxSchemaForm.prototype.componentWillMount = function () {
        this.parseSchema(this.props.schema).then(this.onReady.bind(this));
    };
    ReduxSchemaForm.prototype.componentWillUnmount = function () {
        this.isUnmounting = true;
    };
    ReduxSchemaForm.prototype.renderField = function (fieldSchema) {
        var _this = this;
        if (fieldSchema.hide)
            return React.createElement("div", null);
        var knownProps = {
            type: fieldSchema.type,
            required: fieldSchema.required,
            disabled: this.props.readonly || fieldSchema.disabled,
            placeholder: fieldSchema.placeholder,
            normalize: fieldSchema.normalize,
            defaultValue: fieldSchema.defaultValue
        };
        if (customTypes.has(fieldSchema.type)) {
            var CustomWidget = customTypes.get(fieldSchema.type);
            return React.createElement(CustomWidget, {fieldSchema: fieldSchema, knownProps: knownProps, renderField: this.renderField.bind(this)});
        }
        //noinspection FallThroughInSwitchStatementJS
        switch (fieldSchema.type) {
            case "number":
                decorate(knownProps, "onChange", function (normalize) {
                    return function () {
                        var args = [];
                        for (var _i = 0; _i < arguments.length; _i++) {
                            args[_i - 0] = arguments[_i];
                        }
                        args[0] = Number(args[0]);
                        return normalize ? normalize.apply(void 0, args) : args[0];
                    };
                });
            case "text":
            case "color":
            case "password":
            case "date":
            case "datetime-local":
            case "file":
                return React.createElement("div", {className: "form-group"}, 
                    React.createElement("label", {className: "control-label col-md-2", htmlFor: this.props.form + '-' + fieldSchema.parsedKey}, fieldSchema.label), 
                    React.createElement("div", {className: "col-md-10"}, 
                        React.createElement(Field, __assign({className: "form-control", name: fieldSchema.parsedKey}, knownProps, {component: "input"}))
                    ));
            case "textarea":
                return React.createElement("div", {className: "form-group"}, 
                    React.createElement("label", {className: "control-label col-md-2", htmlFor: this.props.form + '-' + fieldSchema.parsedKey}, fieldSchema.label), 
                    React.createElement("div", {className: "col-md-10"}, 
                        React.createElement(Field, __assign({className: "form-control", name: fieldSchema.parsedKey}, knownProps, {component: "textarea"}))
                    ));
            case "checkbox":
                return React.createElement("div", {className: "form-group"}, 
                    React.createElement("label", {className: "control-label col-md-2", htmlFor: this.props.form + '-' + fieldSchema.parsedKey}, fieldSchema.label), 
                    React.createElement("div", {className: "col-md-10"}, 
                        React.createElement(Field, __assign({className: " checkbox", name: fieldSchema.parsedKey}, knownProps, {component: "input"}))
                    ));
            case "select":
                return React.createElement("div", {className: "form-group"}, 
                    React.createElement("label", {className: "control-label col-md-2", htmlFor: this.props.form + '-' + fieldSchema.parsedKey}, fieldSchema.label), 
                    React.createElement("div", {className: "col-md-10"}, 
                        React.createElement(Field, __assign({className: "form-control", name: fieldSchema.parsedKey}, knownProps, {component: "select"}), 
                            React.createElement("option", null), 
                            fieldSchema.options.map(function (option, i) { return React.createElement("option", {key: i, value: option.value}, option.name); }))
                    ));
            case "array":
                return React.createElement("div", {className: "form-group"}, 
                    React.createElement("label", {className: "control-label col-md-2", htmlFor: this.props.form + '-' + fieldSchema.parsedKey}, fieldSchema.label), 
                    React.createElement("div", {className: "col-md-10"}, 
                        React.createElement(FieldArray, __assign({name: fieldSchema.parsedKey}, knownProps, {fieldSchema: fieldSchema, component: this.DefaultArrayFieldRenderer.bind(this)}))
                    ));
            case "group":
                return React.createElement("fieldset", null, 
                    React.createElement("legend", null, fieldSchema.label), 
                    fieldSchema.children.map(function (childField) {
                        return React.createElement("div", {key: childField.key}, _this.renderField(childField));
                    }));
            default:
                return React.createElement("span", null, 
                    "不可识别的字段:", 
                    JSON.stringify(fieldSchema));
        }
    };
    ReduxSchemaForm.prototype.submitable = function () {
        return !this.props['pristine'] && !this.props['submitting'];
    };
    ReduxSchemaForm.prototype.render = function () {
        var _this = this;
        return React.createElement("form", {className: "redux-schema-form form-horizontal", onSubmit: this.props['handleSubmit']}, 
            this.state.parsedSchema.map(function (field) {
                return React.createElement("div", {key: field.key, className: field.type}, _this.renderField(field));
            }), 
            (!this.props.noButton && !this.props.readonly) ? React.createElement("div", {className: "text-center button"}, 
                React.createElement("div", {className: "btn-group"}, 
                    React.createElement(DefaultButton, {type: "submit", disabled: !this.submitable.apply(this)}, "提交"), 
                    React.createElement(DefaultButton, {type: "button", disabled: !this.submitable.apply(this), onClick: this.props.reset}, "重置"))
            ) : React.createElement("div", null), 
            this.props.children);
    };
    ReduxSchemaForm = __decorate([
        redux_form_1.reduxForm({
            fields: [],
            form: "default"
        }), 
        __metadata('design:paramtypes', [])
    ], ReduxSchemaForm);
    return ReduxSchemaForm;
}(React.PureComponent));
exports.ReduxSchemaForm = ReduxSchemaForm;
//# sourceMappingURL=form.js.map