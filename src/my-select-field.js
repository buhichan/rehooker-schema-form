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
var React = require("react");
var PropTypes = require("prop-types");
var TextField_1 = require("material-ui/TextField");
var my_drop_down_menu_1 = require("./my-drop-down-menu");
var SelectField_1 = require("material-ui/SelectField");
function getStyles(props) {
    return {
        label: {
            paddingLeft: 0,
            top: props.floatingLabelText ? 6 : -4,
        },
        icon: {
            right: 0,
            top: props.floatingLabelText ? 8 : 0,
        },
        hideDropDownUnderline: {
            borderTop: 'none',
        },
        dropDownMenu: {
            display: 'block',
        },
    };
}
var SelectField = (function (_super) {
    __extends(SelectField, _super);
    function SelectField() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SelectField.prototype.render = function () {
        var _a = this.props, autoWidth = _a.autoWidth, multiple = _a.multiple, children = _a.children, style = _a.style, labelStyle = _a.labelStyle, iconStyle = _a.iconStyle, id = _a.id, underlineDisabledStyle = _a.underlineDisabledStyle, underlineFocusStyle = _a.underlineFocusStyle, menuItemStyle = _a.menuItemStyle, selectedMenuItemStyle = _a.selectedMenuItemStyle, underlineStyle = _a.underlineStyle, dropDownMenuProps = _a.dropDownMenuProps, errorStyle = _a.errorStyle, disabled = _a.disabled, floatingLabelFixed = _a.floatingLabelFixed, floatingLabelText = _a.floatingLabelText, floatingLabelStyle = _a.floatingLabelStyle, hintStyle = _a.hintStyle, hintText = _a.hintText, fullWidth = _a.fullWidth, errorText = _a.errorText, listStyle = _a.listStyle, maxHeight = _a.maxHeight, menuStyle = _a.menuStyle, onFocus = _a.onFocus, onBlur = _a.onBlur, onChange = _a.onChange, selectionRenderer = _a.selectionRenderer, value = _a.value, other = __rest(_a, ["autoWidth", "multiple", "children", "style", "labelStyle", "iconStyle", "id", "underlineDisabledStyle", "underlineFocusStyle", "menuItemStyle", "selectedMenuItemStyle", "underlineStyle", "dropDownMenuProps", "errorStyle", "disabled", "floatingLabelFixed", "floatingLabelText", "floatingLabelStyle", "hintStyle", "hintText", "fullWidth", "errorText", "listStyle", "maxHeight", "menuStyle", "onFocus", "onBlur", "onChange", "selectionRenderer", "value"]);
        var styles = getStyles(this.props);
        return (React.createElement(TextField_1.default, __assign({}, other, { style: style, disabled: disabled, floatingLabelFixed: floatingLabelFixed, floatingLabelText: floatingLabelText, floatingLabelStyle: floatingLabelStyle, hintStyle: hintStyle, hintText: (!hintText && !floatingLabelText) ? ' ' : hintText, fullWidth: fullWidth, errorText: errorText, underlineStyle: underlineStyle, errorStyle: errorStyle, onFocus: onFocus, onBlur: onBlur, id: id, underlineDisabledStyle: underlineDisabledStyle, underlineFocusStyle: underlineFocusStyle }),
            React.createElement(my_drop_down_menu_1.DropDownMenu, __assign({ disabled: disabled, style: Object.assign(styles.dropDownMenu, menuStyle), labelStyle: Object.assign(styles.label, labelStyle), iconStyle: Object.assign(styles.icon, iconStyle), menuItemStyle: menuItemStyle, selectedMenuItemStyle: selectedMenuItemStyle, underlineStyle: styles.hideDropDownUnderline, listStyle: listStyle, autoWidth: autoWidth, value: value, onChange: onChange, maxHeight: maxHeight, multiple: multiple, selectionRenderer: selectionRenderer }, dropDownMenuProps), children)));
    };
    return SelectField;
}(React.Component));
SelectField.propTypes = SelectField_1.default['propTypes'];
SelectField.defaultProps = {
    autoWidth: false,
    disabled: false,
    fullWidth: false,
    multiple: false,
};
SelectField.contextTypes = {
    muiTheme: PropTypes.object.isRequired,
};
exports.SelectField = SelectField;
//# sourceMappingURL=my-select-field.js.map