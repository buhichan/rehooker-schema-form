"use strict";
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
const React = require('react');
require("./main.css");
const redux_form_1 = require('redux-form');
require("whatwg-fetch");
let Field = require("redux-form").Field;
let DeepGet = require("redux-form/lib/structure/plain/getIn").default;
let ReduxSchemaForm = class ReduxSchemaForm extends React.Component {
    constructor() {
        super();
        this.state = {
            relations: [],
            parsedSchema: []
        };
    }
    parseField(field, prefix) {
        let promises = [];
        let parsedField = (Object.assign({}, field));
        parsedField.key = (prefix ? (prefix + ".") : "") + parsedField.key;
        if (field.relation)
            this.state.relations.push({
                key: parsedField.key,
                relation: field.relation
            });
        if (field.children instanceof Array) {
            promises.push(this.parseSchema(field.children, parsedField.key).then((children) => {
                parsedField['children'] = children;
            }));
        }
        if (typeof field.options === 'string') {
            let src = field.options;
            promises.push(fetch(src).then(res => res.json()).then(data => {
                parsedField['options'] = data;
                return parsedField;
            }));
        }
        else {
            promises.push(Promise.resolve(field));
        }
        return Promise.all(promises).then(() => {
            return parsedField;
        });
    }
    parseSchema(newSchema, prefix = "") {
        let promises = newSchema.map(field => this.parseField(field, prefix));
        return new Promise(resolve => {
            Promise.all(promises).then(resolve);
        });
    }
    componentWillReceiveProps(newProps) {
        if (newProps.schema !== this.props.schema) {
            this.state.relations = [];
            this.parseSchema(newProps.schema).then(schema => {
                this.setState({
                    parsedSchema: schema
                });
            });
        }
        if (newProps.data !== this.props.data) {
            this.state.relations.forEach(relation => {
                let newFieldValue = DeepGet(newProps.data, relation.key);
                if (newFieldValue !== DeepGet(this.props.data, relation.key)) {
                    for (let i = 0; i < this.state.parsedSchema.length; i++) {
                        if (this.state.parsedSchema[i].key === relation.key)
                            this.state.parsedSchema[i] = relation.relation(newProps.data, this.state.parsedSchema[i]);
                    }
                }
            });
            this.setState({
                parsedSchema: this.state.parsedSchema
            });
        }
    }
    componentDidMount() {
        this.parseSchema(this.props.schema).then(schema => {
            this.setState({
                parsedSchema: schema
            });
            this.props.initialize(this.props.form, this.props.data, true);
        });
    }
    renderField(fieldSchema) {
        if (fieldSchema.hide)
            return React.createElement("div", null);
        let knownProps = {
            type: fieldSchema.type,
            value: fieldSchema.value,
            required: fieldSchema.required,
            disabled: fieldSchema.disabled,
            placeholder: fieldSchema.placeholder
        };
        switch (fieldSchema.type) {
            case "text":
            case "textarea":
            case "color":
            case "date":
            case "datetime":
            case "datetime-local":
            case "number":
            case "file":
                return React.createElement("div", {className: "form-group"}, React.createElement("label", {className: "control-label col-md-2", htmlFor: this.props.form + '-' + fieldSchema.key}, fieldSchema.label), React.createElement("div", {className: "col-md-10"}, React.createElement(Field, __assign({className: "form-control", name: fieldSchema.key}, knownProps, {component: "input"}))));
            case "checkbox":
                return React.createElement("div", {className: "form-group"}, React.createElement("label", {className: "control-label col-md-2", htmlFor: this.props.form + '-' + fieldSchema.key}, fieldSchema.label), React.createElement("div", {className: "col-md-10"}, React.createElement(Field, __assign({className: " checkbox", name: fieldSchema.key}, knownProps, {component: "input"}))));
            case "select":
                return React.createElement("div", {className: "form-group"}, React.createElement("label", {className: "control-label col-md-2", htmlFor: this.props.form + '-' + fieldSchema.key}, fieldSchema.label), React.createElement("div", {className: "col-md-10"}, React.createElement(Field, __assign({className: "form-control", name: fieldSchema.key}, knownProps, {component: "select"}), React.createElement("option", null), fieldSchema.options.map((option, i) => React.createElement("option", {key: i, value: option.value}, option.name)))));
            case "group":
                return React.createElement("fieldset", null, React.createElement("legend", null, fieldSchema.label), fieldSchema.children.map(childField => {
                    return React.createElement("div", {key: childField.key}, this.renderField(childField));
                }));
            default:
                return React.createElement("span", null, "不可识别的字段:", JSON.stringify(fieldSchema));
        }
    }
    submitable() {
        return this.props['valid'] && this.props['dirty'];
    }
    render() {
        return React.createElement("form", {className: "form-horizontal"}, this.state.parsedSchema.map(field => {
            return React.createElement("div", {key: field.key}, this.renderField(field));
        }), React.createElement("div", {className: "text-center"}, React.createElement("div", {className: "btn-group"}, React.createElement("button", {type: "button", className: "btn btn-primary" + (this.submitable() ? " disabled" : ""), disabled: this.submitable.apply(this), onClick: this.props.onSubmit.bind(this.props.data)}, "提交"), React.createElement("button", {type: "button", className: "btn btn-default", onClick: this.props['reset']}, "重置")), this.props.children));
    }
};
ReduxSchemaForm = __decorate([
    redux_form_1.reduxForm({
        fields: [],
        form: "default"
    }), 
    __metadata('design:paramtypes', [])
], ReduxSchemaForm);
exports.ReduxSchemaForm = ReduxSchemaForm;
//# sourceMappingURL=form.js.map