"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
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
    ReduxSchemaForm.defaultButton = button;
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
        return <div>
            {props.map(function (name, i) {
            return <div key={i}>
                        {_this.renderField(props.fieldSchema.children[i])}
                        <button onClick={props.remove(i)}><i className="fa fa-minus"/></button>
                    </div>;
        })}
            <button onClick={props.push()}><i className="fa fa-plus"/></button>
        </div>;
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
            return <div></div>;
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
            return <CustomWidget fieldSchema={fieldSchema} knownProps={knownProps} renderField={this.renderField.bind(this)}/>;
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
                return <div className="form-group">
                    <label className="control-label col-md-2" htmlFor={this.props.form + '-' + fieldSchema.parsedKey}>{fieldSchema.label}</label>
                    <div className="col-md-10">
                        <Field className="form-control" name={fieldSchema.parsedKey} {...knownProps} component="input"/>
                    </div>
                </div>;
            case "textarea":
                return <div className="form-group">
                    <label className="control-label col-md-2" htmlFor={this.props.form + '-' + fieldSchema.parsedKey}>{fieldSchema.label}</label>
                    <div className="col-md-10">
                        <Field className="form-control" name={fieldSchema.parsedKey} {...knownProps} component="textarea"/>
                    </div>
                </div>;
            case "checkbox":
                return <div className="form-group">
                    <label className="control-label col-md-2" htmlFor={this.props.form + '-' + fieldSchema.parsedKey}>{fieldSchema.label}</label>
                    <div className="col-md-10">
                        <Field className=" checkbox" name={fieldSchema.parsedKey} {...knownProps} component="input"/>
                    </div>
                </div>;
            case "select":
                return <div className="form-group">
                    <label className="control-label col-md-2" htmlFor={this.props.form + '-' + fieldSchema.parsedKey}>{fieldSchema.label}</label>
                    <div className="col-md-10">
                        <Field className="form-control" name={fieldSchema.parsedKey} {...knownProps} component="select">
                            <option />
                            {fieldSchema.options.map(function (option, i) { return <option key={i} value={option.value}>{option.name}</option>; })}
                        </Field>
                    </div>
                </div>;
            case "array":
                return <div className="form-group">
                    <label className="control-label col-md-2" htmlFor={this.props.form + '-' + fieldSchema.parsedKey}>{fieldSchema.label}</label>
                    <div className="col-md-10">
                        <FieldArray name={fieldSchema.parsedKey} {...knownProps} fieldSchema={fieldSchema} component={this.DefaultArrayFieldRenderer.bind(this)}/>
                    </div>
                </div>;
            case "group":
                return <fieldset>
                    <legend>{fieldSchema.label}</legend>
                    {fieldSchema.children.map(function (childField) {
                    return <div key={childField.key}>
                                {_this.renderField(childField)}
                            </div>;
                })}
                </fieldset>;
            default:
                return <span>不可识别的字段:{JSON.stringify(fieldSchema)}</span>;
        }
    };
    ReduxSchemaForm.prototype.submitable = function () {
        return !this.props['pristine'] && !this.props['submitting'];
    };
    ReduxSchemaForm.defaultButton = function (props) {
        return <button type={props.type} className={"btn btn-primary" + (props.disabled ? " disabled" : "")} disabled={props.disabled} onClick={props.onClick}>
            {props.children}
        </button>;
    };
    ReduxSchemaForm.prototype.render = function () {
        var _this = this;
        return <form className="redux-schema-form form-horizontal" onSubmit={this.props['handleSubmit']}>
            {this.state.parsedSchema.map(function (field) {
            return <div key={field.key} className={field.type}>
                        {_this.renderField(field)}
                    </div>;
        })}
            {!this.props.readonly ? <div className="text-center button">
                    <div className="btn-group">
                        <ReduxSchemaForm.defaultButton type="submit" disabled={!this.submitable.apply(this)}>提交</ReduxSchemaForm.defaultButton>
                        <ReduxSchemaForm.defaultButton type="button" disabled={!this.submitable.apply(this)} onClick={this.props.reset}>重置</ReduxSchemaForm.defaultButton>
                    </div>
                </div> : <div></div>}
            {this.props.children}
        </form>;
    };
    ReduxSchemaForm = __decorate([
        redux_form_1.reduxForm({
            fields: [],
            form: "default"
        })
    ], ReduxSchemaForm);
    return ReduxSchemaForm;
}(React.PureComponent));
exports.ReduxSchemaForm = ReduxSchemaForm;
