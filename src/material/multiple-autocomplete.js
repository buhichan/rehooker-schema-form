"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
/**
 * Created by buhi on 2017/7/18.
 */
var muiThemeable_1 = require("material-ui/styles/muiThemeable");
var React = require("react");
var _1 = require("../../");
var ChipInput = require("material-ui-chip-input").default;
var redux_form_1 = require("redux-form");
var dataSourceConfig = { text: "name", value: "value" };
var AutoCompleteChipInput = /** @class */ (function (_super) {
    tslib_1.__extends(AutoCompleteChipInput, _super);
    function AutoCompleteChipInput() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.state = {
            dataSource: null,
            async: typeof _this.props.fieldSchema.options === 'function' && _this.props.fieldSchema.options.length >= 1
        };
        _this.onRequestDelete = function (value) {
            var clone = _this.props.input.value.slice();
            var i = clone.indexOf(value);
            if (i >= 0) {
                clone.splice(i, 1);
                _this.props.input.onChange(clone);
            }
        };
        _this.onRequestDatasource = function (search) {
            _this.props.fieldSchema.options(search, _this.props).then(function (dataSource) {
                _this.setState({ dataSource: dataSource });
            });
        };
        _this.onRequestAdd = function (_a) {
            var name = _a.name, value = _a.value;
            var previousValue = _this.props.input.value instanceof Array ? _this.props.input.value : [];
            _this.props.input.onChange(previousValue.concat(value));
        };
        return _this;
    }
    AutoCompleteChipInput.prototype.render = function () {
        var _a = this.props, input = _a.input, fieldSchema = _a.fieldSchema, meta = _a.meta;
        var async = this.state.async;
        var dataSource = async ? this.state.dataSource : fieldSchema.options;
        var rawValue = input.value instanceof Array ? input.value : [];
        var value = rawValue.map(function (value) {
            var entry = dataSource && dataSource.find(function (x) { return x.value == value; });
            return {
                name: entry ? entry.name : value,
                value: value
            };
        });
        var openOnFocus = fieldSchema.openOnFocus, fullResult = fieldSchema.fullResult, label = fieldSchema.label, placeholder = fieldSchema.placeholder, showValueWhenNoEntryIsFound = fieldSchema.showValueWhenNoEntryIsFound;
        return React.createElement(ChipInput, { openOnFocus: true, style: { bottom: 9 }, value: value, maxSearchResults: fullResult ? undefined : 5, menuStyle: fullResult ? { maxHeight: "300px", overflowY: 'auto' } : undefined, floatingLabelStyle: { top: 33 }, floatingLabelFocusStyle: { top: 28 }, fullWidth: true, onRequestDelete: this.onRequestDelete, onRequestAdd: this.onRequestAdd, dataSourceConfig: dataSourceConfig, dataSource: dataSource, errorText: meta.error, floatingLabelText: label, hintText: placeholder, onUpdateInput: async ? this.onRequestDatasource : undefined });
    };
    AutoCompleteChipInput = tslib_1.__decorate([
        _1.addType("multi-autocomplete"),
        muiThemeable_1.default()
    ], AutoCompleteChipInput);
    return AutoCompleteChipInput;
}(React.PureComponent));
exports.AutoCompleteChipInput = AutoCompleteChipInput;
var AnyField = redux_form_1.Field;
//# sourceMappingURL=multiple-autocomplete.js.map