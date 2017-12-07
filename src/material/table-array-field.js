"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var Dialog_1 = require("material-ui/Dialog");
var React = require("react");
var redux_form_1 = require("redux-form");
var field_1 = require("../field");
var reselect_1 = require("reselect");
var dataSourceConfig = { text: "name", value: "value" };
var render_fields_1 = require("../render-fields");
var react_redux_1 = require("react-redux");
var Grid = require("ag-grid-presets").Grid;
var XLSX = require("xlsx");
function readWorkBook() {
    try {
        return new Promise(function (resolve, reject) {
            var id = "fjorandomstring";
            var input = document.querySelector("input#" + id);
            if (!input) {
                input = document.createElement("input");
                input.id = id;
                input.type = 'file';
                input.style.display = "none";
                document.body.appendChild(input);
            }
            input.onchange = function (e) {
                var reader = new FileReader();
                var file = e.target.files[0];
                reader.onload = function () {
                    var data = XLSX.read(reader.result, { type: 'binary' });
                    document.body.removeChild(input);
                    if (data.SheetNames.length)
                        resolve(XLSX.utils.sheet_to_json(data.Sheets[data.SheetNames[0]]));
                };
                reader.readAsBinaryString(file);
            };
            input.click();
        });
    }
    catch (e) {
        console.error(e);
    }
}
function downloadWorkSheet(worksheet, fileName) {
    function s2ab(s) {
        var buf = new ArrayBuffer(s.length);
        var view = new Uint8Array(buf);
        for (var i = 0; i != s.length; ++i)
            view[i] = s.charCodeAt(i) & 0xFF;
        return buf;
    }
    try {
        var workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, fileName);
        /* bookType can be any supported output type */
        var wopts = { bookType: 'xlsx', bookSST: false, type: 'binary' };
        var wbout = XLSX.write(workbook, wopts);
        /* the saveAs call downloads a file on the local machine */
        var blob = new Blob([s2ab(wbout)], { type: "application/octet-stream" });
        var url = URL.createObjectURL(blob);
        var a = document.createElement("a");
        a.href = url;
        a.download = fileName + ".xlsx";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }
    catch (e) {
        console.error(e);
    }
}
var TableArrayField = /** @class */ (function (_super) {
    tslib_1.__extends(TableArrayField, _super);
    function TableArrayField() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.selector = reselect_1.createSelector(function (s) { return s.fieldSchema.children; }, function (oldSchema) {
            return oldSchema.map(function (x) { return (tslib_1.__assign({}, x, { hide: false })); });
        });
        _this.actions = [
            {
                name: "编辑",
                call: function (t, e) {
                    var index = _this.findIndex(t);
                    _this.api.forEachNode(function (x) { return x.data === t && _this.setState({
                        editedIndex: index
                    }, function () {
                        window.dispatchEvent(new Event("resize"));
                    }); });
                }
            },
            {
                name: "删除",
                call: function (t, e) {
                    var index = _this.findIndex(t);
                    _this.api.forEachNode(function (x) { return x.data === t && _this.props.fields.remove(index); });
                },
                enabled: function () { return !_this.props.fieldSchema.disableDelete; }
            },
            {
                name: "添加",
                call: function () {
                    _this.setState({
                        editedIndex: _this.props.fields.length
                    });
                    _this.props.fields.push(_this.props.fieldSchema.defaultValue || {});
                },
                isStatic: true,
                enabled: function () { return !_this.props.fieldSchema.disableCreate; }
            },
            {
                name: "前移",
                call: function (t, e, x) {
                    var index = _this.findIndex(t);
                    if (index >= 0)
                        _this.props.fields.swap(index, index - 1);
                },
                enabled: function (t, x) {
                    if (_this.props.fieldSchema.disableSort)
                        return false;
                    var index = _this.findIndex(t);
                    return index > 0;
                }
            },
            {
                name: "后移",
                call: function (t, e, x) {
                    var index = _this.findIndex(t);
                    if (index >= 0)
                        _this.props.fields.swap(index, index + 1);
                },
                enabled: function (t, x) {
                    if (_this.props.fieldSchema.disableSort)
                        return false;
                    var index = _this.findIndex(t);
                    return index < _this.props.fields.length - 1;
                }
            },
            {
                name: "导出",
                call: function () {
                    var schema = _this.selector(_this.props);
                    var rawData = _this.props.fields.getAll();
                    if (!rawData || !(rawData instanceof Array) || !rawData.length)
                        rawData = [schema.reduce(function (res, y) {
                                res[y.label] = "";
                                return res;
                            }, {})];
                    var sheet = XLSX.utils.json_to_sheet(rawData.map(function (x) {
                        return schema.reduce(function (res, y) {
                            res[y.label] = x[y.key];
                            return res;
                        }, {});
                    }));
                    downloadWorkSheet(sheet, _this.props.fieldSchema.label);
                },
                isStatic: true
            }, {
                name: "导入",
                call: function (data) {
                    readWorkBook().then(function (data) {
                        var schema = _this.selector(_this.props);
                        var newValues = data.map(function (item) {
                            return schema.reduce(function (res, field) {
                                res[field.key] = item[field.label];
                                return res;
                            }, item);
                        });
                        if (confirm("是否替换原有数据? "))
                            _this.changeArrayValues(newValues);
                        else
                            _this.changeArrayValues(_this.props.input.value.concat(newValues));
                    });
                },
                isStatic: true,
                enabled: function () { return !_this.props.fieldSchema.disableImport; }
            }, {
                name: "批量编辑",
                call: function (data, e, nodes) {
                    if (!data || data.length < 2)
                        return;
                    _this.setState({
                        editedIndex: _this.props.fields.length,
                        batchEditedData: data
                    });
                    _this.props.fields.push({}); // insert a new child to provide a blank form.
                },
                isStatic: true,
                enabled: function (data) { return !_this.props.fieldSchema.disabled && data && data.length >= 2; }
            }
        ];
        _this.findIndex = function (data) {
            for (var i = 0; i < _this.props.fields.length; i++) {
                if (_this.props.fields.get(i) === data)
                    return i;
            }
            return -1;
        };
        _this.changeArrayValues = function (newValues) { return _this.props.dispatch(redux_form_1.change(_this.props.meta.form, _this.props.keyPath, newValues)); };
        _this.onBatchEdit = function () {
            //remove the added child
            var values = _this.props.fields.getAll().slice();
            var batchEditValues = values.pop();
            var filledBatchEditValues = Object.keys(batchEditValues).reduce(function (values, key) {
                if (batchEditValues[key] !== null && batchEditValues[key] !== undefined)
                    values[key] = batchEditValues[key];
                return values;
            }, {});
            _this.changeArrayValues(values.map(function (value) {
                if (_this.state.batchEditedData.includes(value))
                    return tslib_1.__assign({}, value, batchEditValues);
                else
                    return value;
            }));
        };
        _this.state = {
            editedIndex: -1,
            batchEditedData: null
        };
        _this.bindGridApi = function (api) { return _this.api = api; };
        _this.closeDialog = function () {
            if (_this.state.batchEditedData)
                _this.onBatchEdit();
            _this.setState({
                editedIndex: -1,
                batchEditedData: null
            });
        };
        _this.stripLastItem = reselect_1.createSelector(function (s) { return s; }, function (s) { return s.slice(0, -1); });
        return _this;
    }
    TableArrayField.prototype.render = function () {
        var value = this.props.fields.getAll() || empty;
        var _a = this.props.fieldSchema, key = _a.key, type = _a.type, label = _a.label, hide = _a.hide, fullWidth = _a.fullWidth, //todo: should I put this presentation logic here?
        required = _a.required, disabled = _a.disabled, children = _a.children, gridOptions = tslib_1.__rest(_a, ["key", "type", "label", "hide", "fullWidth", "required", "disabled", "children"]);
        var gridSchema = this.selector(this.props);
        return React.createElement("div", null,
            React.createElement("label", { className: "control-label" },
                this.props.fieldSchema.label,
                this.props.fields.length ? "(" + this.props.fields.length + ")" : ""),
            React.createElement(Grid, tslib_1.__assign({ data: this.state.batchEditedData ? this.stripLastItem(value) : value, schema: gridSchema, gridName: this.props.meta.form + "-" + this.props.keyPath, suppressAutoSizeToFit: true, overlayNoRowsTemplate: "<div style=\"font-size:30px\">" + "" + "</div>", height: 300, selectionStyle: "checkbox", actions: this.actions, gridApi: this.bindGridApi }, gridOptions)),
            React.createElement(Dialog_1.default, { autoScrollBodyContent: true, autoDetectWindowHeight: true, open: this.state.editedIndex >= 0, onRequestClose: this.closeDialog }, this.state.editedIndex < 0 ? null : render_fields_1.renderFields(this.props.meta.form, children.map(function (x) {
                return tslib_1.__assign({}, x, { hide: x.disabled });
            }), this.props.keyPath + "[" + this.state.editedIndex + "]")));
    };
    TableArrayField = tslib_1.__decorate([
        react_redux_1.connect()
    ], TableArrayField);
    return TableArrayField;
}(React.PureComponent));
var empty = [];
field_1.addTypeWithWrapper("table-array", function (props) {
    return React.createElement("div", { style: { paddingTop: 25 } },
        React.createElement(redux_form_1.FieldArray, { name: props.keyPath, rerenderOnEveryChange: true, component: TableArrayField, props: props }));
});
//# sourceMappingURL=table-array-field.js.map