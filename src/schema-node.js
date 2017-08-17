"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
/**
 * Created by buhi on 2017/7/26.
 */
var React = require("react");
var field_1 = require("./field");
function applyChangesToFields(parsedSchema, changes) {
    parsedSchema = parsedSchema.slice(0);
    changes = changes.filter(function (change) {
        var target = parsedSchema.findIndex(function (x) { return x.key === change.key; });
        if (target >= 0) {
            if (change.children) {
                console.error("不能在onValueChange中改变children！请使用getChildren属性。");
                delete change.children;
            }
            parsedSchema[target] = tslib_1.__assign({}, parsedSchema[target], change);
            return false;
        }
        return true;
    });
    return [parsedSchema, changes];
}
var SchemaNode = (function (_super) {
    tslib_1.__extends(SchemaNode, _super);
    function SchemaNode() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.state = {
            parsedSchema: null
        };
        _this.pendingSchemaChanges = [];
        _this.onSchemaChange = function (newFields) {
            if (!(newFields instanceof Promise))
                newFields = Promise.resolve(newFields);
            _this.pendingSchemaChanges.push(newFields);
            if (_this.state.parsedSchema instanceof Array)
                _this.applySchema(_this.state.parsedSchema);
        };
        _this.childrenNodes = {};
        _this.refChildrenNodes = function (ref, key) {
            _this.childrenNodes[key] = ref;
        };
        return _this;
    }
    SchemaNode.prototype.applySchema = function (schema) {
        var _this = this;
        Promise.all(this.pendingSchemaChanges).then(function (changes) {
            var flattenedChanges = changes.reduce(function (prev, x) { return prev.concat(x); }, []);
            var _a = applyChangesToFields(schema, flattenedChanges), newSchema = _a[0], otherChanges = _a[1];
            if (otherChanges.length > 0) {
                Object.keys(_this.childrenNodes).forEach(function (key) {
                    _this.childrenNodes[key].onSchemaChange(otherChanges);
                });
                if (_this.props.onSchemaChange)
                    setImmediate(function () { return _this.props.onSchemaChange(otherChanges); });
            }
            return newSchema;
        }).then(function (newSchema) {
            _this.pendingSchemaChanges = [];
            _this.setState({
                parsedSchema: newSchema
            });
        });
    };
    SchemaNode.prototype.componentWillReceiveProps = function (newProps) {
        if (newProps.schema !== this.props.schema) {
            this.parseSchema(newProps.schema).then(this.onReady.bind(this));
        }
    };
    SchemaNode.prototype.onReady = function (schema) {
        this.applySchema(schema);
    };
    SchemaNode.prototype.componentWillMount = function () {
        this.parseSchema(this.props.schema).then(this.onReady.bind(this));
    };
    SchemaNode.prototype.parseField = function (field) {
        var _this = this;
        var promises = [];
        var parsedField = tslib_1.__assign({}, field);
        if (field.onValueChange) {
            parsedField.normalize = function (value, previousValue, allValues) {
                var valuesPath = [allValues];
                if (_this.props.keyPath && _this.props.keyPath.length > 0) {
                    //is nested property, should pass nested value, since onValueChange does not know its index and key
                    _this.props.keyPath.split(".").forEach(function (k) {
                        var pointer = valuesPath[valuesPath.length - 1];
                        if (pointer && pointer.hasOwnProperty(k)) {
                            valuesPath.push(valuesPath[valuesPath.length - 1][k]);
                        }
                    });
                }
                var newFields = field.onValueChange.apply(field, [value, previousValue].concat(valuesPath));
                if (newFields) {
                    _this.onSchemaChange(newFields);
                }
                return field.normalize ? field.normalize(value, previousValue, allValues) : value;
            };
            if (this.props.initialValues) {
                var newFields = field.onValueChange(this.props.initialValues[field.key], undefined, this.props.initialValues);
                if (newFields)
                    this.onSchemaChange(newFields);
            }
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
    SchemaNode.prototype.parseSchema = function (newSchema) {
        var _this = this;
        var promises = newSchema.map(function (field) { return _this.parseField(field); });
        return Promise.all(promises);
    };
    SchemaNode.prototype.render = function () {
        var _this = this;
        if (!this.state.parsedSchema)
            return null;
        return React.createElement("div", { className: "schema-node" }, this.state.parsedSchema.map(function (field) {
            if (field.hide)
                return null;
            return React.createElement("div", { key: field.key || field.label, className: "field " + field.type }, field_1.renderField(field, _this.props.form, (_this.props.keyPath ? (_this.props.keyPath + ".") : "") + field.key, _this.props.initialValues ? _this.props.initialValues[field.key] : {}, _this.onSchemaChange, _this.refChildrenNodes));
        }));
    };
    return SchemaNode;
}(React.PureComponent));
exports.SchemaNode = SchemaNode;
//# sourceMappingURL=schema-node.js.map