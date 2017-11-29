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
                name: "前移",
                call: function (t, e, x) {
                    _this.props.fields.swap(x.rowIndex, x.rowIndex - 1);
                },
                enabled: function (t, x) {
                    return x.rowIndex > 0;
                }
            },
            {
                name: "后移",
                call: function (t, e, x) {
                    _this.props.fields.swap(x.rowIndex, x.rowIndex + 1);
                },
                enabled: function (t, x) {
                    return x.rowIndex < _this.props.fields.length - 1;
                }
            },
            {
                name: "编辑",
                call: function (t, e) {
                    e.preventDefault();
                    e.stopPropagation();
                    _this.api.forEachNode(function (x) { return x.data === t && _this.setState({
                        editedIndex: x.rowIndex
                    }, function () {
                        window.dispatchEvent(new Event("resize"));
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
                        data.forEach(function (item) {
                            _this.props.fields.push(schema.reduce(function (res, field) {
                                res[field.key] = item[field.label];
                                return res;
                            }, item));
                        });
                    });
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
            React.createElement("label", { className: "control-label" },
                this.props.fieldSchema.label,
                this.props.fields.length ? "(" + this.props.fields.length + ")" : ""),
            React.createElement(Grid, { data: value, schema: schema, overlayNoRowsTemplate: "<div style=\"font-size:30px\">" + "" + "</div>", height: 300, actions: this.actions, gridApi: this.bindGridApi }),
            React.createElement(Dialog_1.default, { autoScrollBodyContent: true, open: this.state.editedIndex >= 0, onRequestClose: this.closeDialog }, this.state.editedIndex < 0 ? null : render_fields_1.renderFields(this.props.meta.form, this.props.fieldSchema.children, this.props.keyPath + "[" + this.state.editedIndex + "]")));
    };
    return TableArrayField;
}(React.PureComponent));
var empty = [];
field_1.addTypeWithWrapper("table-array", function (props) {
    return React.createElement("div", { style: { paddingTop: 25 } },
        React.createElement(redux_form_1.FieldArray, { name: props.keyPath, rerenderOnEveryChange: true, component: TableArrayField, props: props }));
});
//# sourceMappingURL=table-array-field.js.map