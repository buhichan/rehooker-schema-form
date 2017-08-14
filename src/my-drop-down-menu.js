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
var ReactDOM = require("react-dom");
var PropTypes = require("prop-types");
var transitions_1 = require("material-ui/styles/transitions");
var arrow_drop_down_1 = require("material-ui/svg-icons/navigation/arrow-drop-down");
var Menu_1 = require("material-ui/Menu");
var ClearFix_1 = require("material-ui/internal/ClearFix");
var Popover_1 = require("material-ui/Popover");
var PopoverAnimationVertical_1 = require("material-ui/Popover/PopoverAnimationVertical");
var events_1 = require("material-ui/utils/events");
var IconButton = require('material-ui/IconButton').default;
var keycode = require("keycode");
var DropDownMenu_1 = require("material-ui/DropDownMenu");
function getStyles(props, context) {
    var disabled = props.disabled;
    var spacing = context.muiTheme.baseTheme.spacing;
    var palette = context.muiTheme.baseTheme.palette;
    var accentColor = context.muiTheme.dropDownMenu.accentColor;
    return {
        control: {
            cursor: disabled ? 'not-allowed' : 'pointer',
            height: '100%',
            position: 'relative',
            width: '100%',
        },
        icon: {
            fill: accentColor,
            position: 'absolute',
            right: spacing.desktopGutterLess,
            top: (spacing.iconSize - 24) / 2 + spacing.desktopGutterMini / 2,
        },
        iconChildren: {
            fill: 'inherit',
        },
        label: {
            color: disabled ? palette.disabledColor : palette.textColor,
            height: spacing.desktopToolbarHeight + "px",
            lineHeight: spacing.desktopToolbarHeight + "px",
            overflow: 'hidden',
            opacity: 1,
            position: 'relative',
            paddingLeft: spacing.desktopGutter,
            paddingRight: spacing.iconSize * 2 + spacing.desktopGutterMini,
            textOverflow: 'ellipsis',
            top: 0,
            whiteSpace: 'nowrap',
        },
        labelWhenOpen: {
            opacity: 0,
            top: (spacing.desktopToolbarHeight / 8),
        },
        root: {
            display: 'inline-block',
            fontSize: spacing.desktopDropDownMenuFontSize,
            height: spacing.desktopSubheaderHeight,
            fontFamily: context.muiTheme.baseTheme.fontFamily,
            outline: 'none',
            position: 'relative',
            transition: transitions_1.default.easeOut(),
        },
        rootWhenOpen: {
            opacity: 1,
        },
        underline: {
            borderTop: "solid 1px " + accentColor,
            bottom: 1,
            left: 0,
            margin: "-1px " + spacing.desktopGutter + "px",
            right: 0,
            position: 'absolute',
        },
    };
}
var DropDownMenu = (function (_super) {
    __extends(DropDownMenu, _super);
    function DropDownMenu() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.state = {
            open: false,
        };
        _this.rootNode = undefined;
        _this.arrowNode = undefined;
        _this.handleTouchTapControl = function (event) {
            event.preventDefault();
            if (!_this.props.disabled) {
                _this.setState({
                    open: !_this.state.open,
                    anchorEl: _this.rootNode,
                });
            }
        };
        _this.handleRequestCloseMenu = function () {
            _this.close(false);
        };
        _this.handleEscKeyDownMenu = function () {
            _this.close(true);
        };
        _this.handleKeyDown = function (event) {
            switch (keycode(event)) {
                case 'up':
                case 'down':
                case 'space':
                case 'enter':
                    event.preventDefault();
                    _this.setState({
                        open: true,
                        anchorEl: _this.rootNode,
                    });
                    break;
            }
        };
        _this.handleItemTouchTap = function (event, child, index) {
            if (_this.props.multiple) {
                if (!_this.state.open) {
                    _this.setState({ open: true });
                }
            }
            else {
                event.persist();
                _this.setState({
                    open: false,
                }, function () {
                    if (_this.props.onChange) {
                        _this.props.onChange(event, index, child.props.value);
                    }
                    _this.close(events_1.default.isKeyboard(event));
                });
            }
        };
        _this.handleChange = function (event, value) {
            if (_this.props.multiple && _this.props.onChange) {
                _this.props.onChange(event, undefined, value);
            }
        };
        _this.close = function (isKeyboard) {
            _this.setState({
                open: false,
            }, function () {
                if (_this.props.onClose) {
                    _this.props.onClose();
                }
                if (isKeyboard) {
                    var dropArrow_1 = _this.arrowNode;
                    var dropNode_1 = ReactDOM.findDOMNode(dropArrow_1);
                    setTimeout(function () {
                        dropNode_1.focus();
                        dropArrow_1.setKeyboardFocus(true);
                    }, 500);
                    //fixme: todo: https://github.com/callemall/material-ui/issues/6080
                }
            });
        };
        return _this;
    }
    DropDownMenu.prototype.componentDidMount = function () {
        var _this = this;
        if (this.props.autoWidth) {
            this.setWidth();
        }
        if (this.props.openImmediately) {
            // TODO: Temporary fix to make openImmediately work with popover.
            /* eslint-disable react/no-did-mount-set-state */
            setTimeout(function () { return _this.setState({
                open: true,
                anchorEl: _this.rootNode,
            }); }, 0);
            /* eslint-enable react/no-did-mount-set-state */
        }
    };
    DropDownMenu.prototype.componentWillReceiveProps = function () {
        if (this.props.autoWidth) {
            this.setWidth();
        }
    };
    /**
     * This method is deprecated but still here because the TextField
     * need it in order to work. TODO: That will be addressed later.
     */
    DropDownMenu.prototype.getInputNode = function () {
        var _this = this;
        var rootNode = this.rootNode;
        rootNode.focus = function () {
            if (!_this.props.disabled) {
                _this.setState({
                    open: !_this.state.open,
                    anchorEl: _this.rootNode,
                });
            }
        };
        return rootNode;
    };
    DropDownMenu.prototype.setWidth = function () {
        var el = this.rootNode;
        if (!this.props.style || !this.props.style.hasOwnProperty('width')) {
            el.style.width = 'auto';
        }
    };
    DropDownMenu.prototype.render = function () {
        var _this = this;
        var _a = this.props, animated = _a.animated, animation = _a.animation, autoWidth = _a.autoWidth, multiple = _a.multiple, children = _a.children, className = _a.className, disabled = _a.disabled, iconStyle = _a.iconStyle, labelStyle = _a.labelStyle, listStyle = _a.listStyle, maxHeight = _a.maxHeight, menuStyleProp = _a.menuStyle, selectionRenderer = _a.selectionRenderer, onClose = _a.onClose, // eslint-disable-line no-unused-vars
        openImmediately = _a.openImmediately, // eslint-disable-line no-unused-vars
        menuItemStyle = _a.menuItemStyle, selectedMenuItemStyle = _a.selectedMenuItemStyle, style = _a.style, underlineStyle = _a.underlineStyle, value = _a.value, iconButton = _a.iconButton, anchorOrigin = _a.anchorOrigin, targetOrigin = _a.targetOrigin, other = __rest(_a, ["animated", "animation", "autoWidth", "multiple", "children", "className", "disabled", "iconStyle", "labelStyle", "listStyle", "maxHeight", "menuStyle", "selectionRenderer", "onClose", "openImmediately", "menuItemStyle", "selectedMenuItemStyle", "style", "underlineStyle", "value", "iconButton", "anchorOrigin", "targetOrigin"]);
        var _b = this.state, anchorEl = _b.anchorEl, open = _b.open;
        var prepareStyles = this.context.muiTheme.prepareStyles;
        var styles = getStyles(this.props, this.context);
        var displayValue = '';
        if (!multiple) {
            React.Children.forEach(children, function (_child) {
                var child = _child;
                if (child && value === child.props.value) {
                    if (selectionRenderer) {
                        displayValue = selectionRenderer(value, child);
                    }
                    else {
                        // This will need to be improved (in case primaryText is a node)
                        displayValue = child.props.label || child.props.primaryText;
                    }
                }
            });
        }
        else {
            var values_1 = [];
            var selectionRendererChildren_1 = [];
            React.Children.forEach(children, function (_child) {
                var child = _child;
                if (child && value && value.indexOf(child.props.value) > -1) {
                    if (selectionRenderer) {
                        values_1.push(child.props.value);
                        selectionRendererChildren_1.push(child);
                    }
                    else {
                        values_1.push(child.props.label || child.props.primaryText);
                    }
                }
            });
            displayValue = [];
            if (selectionRenderer) {
                displayValue = selectionRenderer(values_1, selectionRendererChildren_1);
            }
            else {
                displayValue = values_1.join(', ');
            }
        }
        var menuStyle;
        if (anchorEl && !autoWidth) {
            menuStyle = Object.assign({
                width: anchorEl.clientWidth,
            }, menuStyleProp);
        }
        else {
            menuStyle = menuStyleProp;
        }
        return (React.createElement("div", __assign({}, other, { ref: function (node) {
                _this.rootNode = node;
            }, className: className, style: prepareStyles(Object.assign({}, styles.root, open && styles.rootWhenOpen, style)) }),
            React.createElement(ClearFix_1.default, __assign({ style: styles.control }, { onTouchTap: this.handleTouchTapControl }),
                React.createElement("div", { style: prepareStyles(Object.assign({}, styles.label, open && styles.labelWhenOpen, labelStyle)) }, displayValue),
                React.createElement(IconButton, { disabled: disabled, onKeyDown: this.handleKeyDown, ref: function (node) {
                        _this.arrowNode = node;
                    }, style: Object.assign({}, styles.icon, iconStyle), iconStyle: styles.iconChildren }, iconButton),
                React.createElement("div", { style: prepareStyles(Object.assign({}, styles.underline, underlineStyle)) })),
            React.createElement(Popover_1.default, { anchorOrigin: anchorOrigin, targetOrigin: targetOrigin, anchorEl: anchorEl, animation: animation || PopoverAnimationVertical_1.default, open: open, animated: animated, onRequestClose: this.handleRequestCloseMenu },
                React.createElement(Menu_1.default, { multiple: multiple, maxHeight: maxHeight, desktop: true, value: value, onEscKeyDown: this.handleEscKeyDownMenu, style: menuStyle, listStyle: listStyle, onItemTouchTap: this.handleItemTouchTap, onChange: this.handleChange, selectedMenuItemStyle: selectedMenuItemStyle, autoWidth: autoWidth, width: !autoWidth && menuStyle ? menuStyle.width : null }, children))));
    };
    return DropDownMenu;
}(React.Component));
DropDownMenu.muiName = 'DropDownMenu';
// The nested styles for drop-down-menu are modified by toolbar and possibly
// other user components, so it will give full access to its js styles rather
// than just the parent.
DropDownMenu.propTypes = DropDownMenu_1.default['propTypes'];
DropDownMenu.defaultProps = {
    animated: true,
    autoWidth: true,
    disabled: false,
    iconButton: React.createElement(arrow_drop_down_1.default, null),
    openImmediately: false,
    maxHeight: 500,
    multiple: false,
    anchorOrigin: {
        vertical: 'top',
        horizontal: 'left',
    },
};
DropDownMenu.contextTypes = {
    muiTheme: PropTypes.object.isRequired,
};
exports.DropDownMenu = DropDownMenu;
//# sourceMappingURL=my-drop-down-menu.js.map