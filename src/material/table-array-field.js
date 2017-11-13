"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var Dialog_1 = require("material-ui/Dialog");
var React = require("react");
var redux_form_1 = require("redux-form");
var field_1 = require("../field");
var reselect_1 = require("reselect");
var dataSourceConfig = { text: "name", value: "value" };
var ag_grid_material_preset_1 = require("ag-grid-material-preset");
var render_fields_1 = require("../render-fields");
var readCSV = function (e, columns) {
    var files = e.target.files;
    return new Promise(function (resolve, reject) {
        Array.from(files).forEach(function (file) {
            if (file.type !== 'text/csv')
                return alert("必须导入csv文件");
            var fileReader = new FileReader();
            fileReader.onload = function () {
                var str = fileReader.result;
                require("csv-parse")(str, {
                    auto_parse: true,
                    auto_parse_date: false,
                    columns: columns,
                    skip_empty_lines: true,
                    trim: true
                }, function (err, chunks) {
                    err ? alert(err) : resolve(chunks);
                });
            };
            fileReader.onerror = reject;
            fileReader.readAsText(file);
        });
    });
};
var TableArrayField = (function (_super) {
    tslib_1.__extends(TableArrayField, _super);
    function TableArrayField() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.selector = reselect_1.createSelector(function (s) { return s.fieldSchema.children; }, function (oldSchema) {
            return oldSchema.map(function (x) { return (tslib_1.__assign({}, x, { hide: false })); });
        });
        _this.actions = [
            {
                name: "添加",
                call: function () {
                    _this.setState({
                        editedIndex: _this.props.fields.length
                    });
                    _this.props.fields.push(_this.props.fieldSchema.defaultValue || {});
                },
                isStatic: true
            },
            {
                name: "编辑",
                call: function (t, e) {
                    e.preventDefault();
                    e.stopPropagation();
                    _this.api.forEachNode(function (x) { return x.data === t && _this.setState({
                        editedIndex: x.rowIndex
                    }); });
                }
            },
            {
                name: "删除",
                call: function (t, e) {
                    e.preventDefault();
                    e.stopPropagation();
                    _this.api.forEachNode(function (x) { return x.data === t && _this.props.fields.remove(x.rowIndex); });
                }
            },
            {
                name: "导出",
                call: function () {
                    _this.api.exportDataAsCsv({
                        fileName: _this.props.fieldSchema.label
                    });
                },
                isStatic: true
            }, {
                name: "导入",
                call: function (data) {
                    var id = _this.props.meta.form + "fjorandomstring";
                    var input = document.querySelector("input#" + id);
                    if (!input) {
                        input = document.createElement("input");
                        input.id = id;
                        input.type = 'file';
                        input.style.display = "none";
                        document.body.appendChild(input);
                    }
                    input.onchange = function (e) {
                        readCSV(e, function (labels) {
                            return labels.map(function (label) {
                                var item = _this.props.fieldSchema.children.find(function (x) { return x.label === String(label).trim(); });
                                return item ? item.key : null;
                            });
                        }).then(function (data) {
                            data.forEach(_this.props.fields.push);
                            document.body.removeChild(input);
                        });
                    };
                    input.click();
                },
                isStatic: true
            }
        ];
        _this.state = {
            editedIndex: -1
        };
        _this.bindGridApi = function (api) { return _this.api = api; };
        _this.closeDialog = function () { return _this.setState({ editedIndex: -1 }); };
        return _this;
    }
    TableArrayField.prototype.render = function () {
        var value = this.props.fields.getAll() || empty;
        var schema = this.selector(this.props);
        return React.createElement("div", null,
            React.createElement(ag_grid_material_preset_1.Grid, { data: value, schema: schema, overlayNoRowsTemplate: "<div style=\"font-size:30px\">" + "" + "</div>", height: 300, actions: this.actions, gridApi: this.bindGridApi }),
            React.createElement(Dialog_1.default, { open: this.state.editedIndex >= 0, onRequestClose: this.closeDialog }, this.state.editedIndex < 0 ? null : render_fields_1.renderFields(this.props.meta.form, this.props.fieldSchema.children, this.props.keyPath + "[" + this.state.editedIndex + "]")));
    };
    return TableArrayField;
}(React.PureComponent));
var empty = [];
field_1.addTypeWithWrapper("table-array", function (props) {
    return React.createElement("div", null,
        React.createElement("label", { className: "control-label" }, props.fieldSchema.label),
        React.createElement(redux_form_1.FieldArray, { name: props.keyPath, rerenderOnEveryChange: true, component: TableArrayField, props: props }));
});
//# sourceMappingURL=table-array-field.js.map