import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as PropTypes from "prop-types";
import transitions from 'material-ui/styles/transitions';
import DropDownArrow from 'material-ui/svg-icons/navigation/arrow-drop-down';
import Menu from 'material-ui/Menu';
import ClearFix from 'material-ui/internal/ClearFix';
import Popover from 'material-ui/Popover';
import PopoverAnimationVertical from 'material-ui/Popover/PopoverAnimationVertical';
import Events from 'material-ui/utils/events';
const IconButton = require('material-ui/IconButton').default;
import propTypes from 'material-ui/utils/propTypes';
import * as keycode from "keycode";
import MenuItem from "material-ui/MenuItem"
import MuiDropDownMenu from "material-ui/DropDownMenu"

function getStyles(props, context) {
    const {disabled} = props;
    const spacing = context.muiTheme.baseTheme.spacing;
    const palette = context.muiTheme.baseTheme.palette;
    const accentColor = context.muiTheme.dropDownMenu.accentColor;
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
            height: `${spacing.desktopToolbarHeight}px`,
            lineHeight: `${spacing.desktopToolbarHeight}px`,
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
            transition: transitions.easeOut(),
        },
        rootWhenOpen: {
            opacity: 1,
        },
        underline: {
            borderTop: `solid 1px ${accentColor}`,
            bottom: 1,
            left: 0,
            margin: `-1px ${spacing.desktopGutter}px`,
            right: 0,
            position: 'absolute',
        },
    };
}

export class DropDownMenu extends React.Component<{
    [some:string]:any
},any> {
    static muiName = 'DropDownMenu';

    // The nested styles for drop-down-menu are modified by toolbar and possibly
    // other user components, so it will give full access to its js styles rather
    // than just the parent.
    static propTypes = MuiDropDownMenu['propTypes'];

    static defaultProps = {
        animated: true,
        autoWidth: true,
        disabled: false,
        iconButton: <DropDownArrow />,
        openImmediately: false,
        maxHeight: 500,
        multiple: false,
        anchorOrigin: {
            vertical: 'top',
            horizontal: 'left',
        },
    };

    static contextTypes = {
        muiTheme: PropTypes.object.isRequired,
    };

    state = {
        open: false,
    } as any;

    componentDidMount() {
        if (this.props.autoWidth) {
            this.setWidth();
        }
        if (this.props.openImmediately) {
            // TODO: Temporary fix to make openImmediately work with popover.
            /* eslint-disable react/no-did-mount-set-state */
            setTimeout(() => this.setState({
                open: true,
                anchorEl: this.rootNode,
            }), 0);
            /* eslint-enable react/no-did-mount-set-state */
        }
    }

    componentWillReceiveProps() {
        if (this.props.autoWidth) {
            this.setWidth();
        }
    }

    rootNode = undefined;
    arrowNode = undefined;

    /**
     * This method is deprecated but still here because the TextField
     * need it in order to work. TODO: That will be addressed later.
     */
    getInputNode() {
        const rootNode = this.rootNode;

        rootNode.focus = () => {
            if (!this.props.disabled) {
                this.setState({
                    open: !this.state.open,
                    anchorEl: this.rootNode,
                });
            }
        };

        return rootNode;
    }

    setWidth() {
        const el = this.rootNode;
        if (!this.props.style || !this.props.style.hasOwnProperty('width')) {
            el.style.width = 'auto';
        }
    }

    handleTouchTapControl = (event) => {
        event.preventDefault();
        if (!this.props.disabled) {
            this.setState({
                open: !this.state.open,
                anchorEl: this.rootNode,
            });
        }
    };

    handleRequestCloseMenu = () => {
        this.close(false);
    };

    handleEscKeyDownMenu = () => {
        this.close(true);
    };

    handleKeyDown = (event) => {
        switch (keycode(event)) {
            case 'up':
            case 'down':
            case 'space':
            case 'enter':
                event.preventDefault();
                this.setState({
                    open: true,
                    anchorEl: this.rootNode,
                });
                break;
        }
    };

    handleItemTouchTap = (event, child, index) => {
        if (this.props.multiple) {
            if (!this.state.open) {
                this.setState({open: true});
            }
        } else {
            event.persist();
            this.setState({
                open: false,
            }, () => {
                if (this.props.onChange) {
                    this.props.onChange(event, index, child.props.value);
                }

                this.close(Events.isKeyboard(event));
            });
        }
    };

    handleChange = (event, value) => {
        if (this.props.multiple && this.props.onChange) {
            this.props.onChange(event, undefined, value);
        }
    };

    close = (isKeyboard) => {
        this.setState({
            open: false,
        }, () => {
            if (this.props.onClose) {
                this.props.onClose();
            }

            if (isKeyboard) {
                const dropArrow = this.arrowNode;
                const dropNode = ReactDOM.findDOMNode(dropArrow) as HTMLElement;
                setTimeout(()=>{
                    dropNode.focus();
                    dropArrow.setKeyboardFocus(true);
                },500);
                //fixme: todo: https://github.com/callemall/material-ui/issues/6080
            }
        });
    }

    render() {
        const {
            animated,
            animation,
            autoWidth,
            multiple,
            children,
            className,
            disabled,
            iconStyle,
            labelStyle,
            listStyle,
            maxHeight,
            menuStyle: menuStyleProp,
            selectionRenderer,
            onClose, // eslint-disable-line no-unused-vars
            openImmediately, // eslint-disable-line no-unused-vars
            menuItemStyle,
            selectedMenuItemStyle,
            style,
            underlineStyle,
            value,
            iconButton,
            anchorOrigin,
            targetOrigin,
            ...other
        } = this.props;
        const {
            anchorEl,
            open,
        } = this.state;

        const {prepareStyles} = this.context.muiTheme;
        const styles = getStyles(this.props, this.context);

        let displayValue:any = '';
        if (!multiple) {
            React.Children.forEach(children, (_child:any) => {
                const child = _child as MenuItem;
                if (child && value === child.props.value) {
                    if (selectionRenderer) {
                        displayValue = selectionRenderer(value, child);
                    } else {
                        // This will need to be improved (in case primaryText is a node)
                        displayValue = child.props.label || child.props.primaryText;
                    }
                }
            });
        } else {
            const values = [];
            const selectionRendererChildren = [];
            React.Children.forEach(children, (_child:any) => {
                const child = _child as MenuItem;
                if (child && value && value.indexOf(child.props.value) > -1) {
                    if (selectionRenderer) {
                        values.push(child.props.value);
                        selectionRendererChildren.push(child);
                    } else {
                        values.push(child.props.label || child.props.primaryText);
                    }
                }
            });

            displayValue = [];
            if (selectionRenderer) {
                displayValue = selectionRenderer(values, selectionRendererChildren);
            } else {
                displayValue = values.join(', ');
            }
        }

        let menuStyle;
        if (anchorEl && !autoWidth) {
            menuStyle = Object.assign({
                width: anchorEl.clientWidth,
            }, menuStyleProp);
        } else {
            menuStyle = menuStyleProp;
        }

        return (
            <div
                {...other}
                ref={(node) => {
                    this.rootNode = node;
                }}
                className={className}
                style={prepareStyles(Object.assign({}, styles.root, open && styles.rootWhenOpen, style))}
            >
                <ClearFix style={styles.control} {...{onTouchTap:this.handleTouchTapControl} as any}>
                    <div style={prepareStyles(Object.assign({}, styles.label, open && styles.labelWhenOpen, labelStyle))}>
                        {displayValue}
                    </div>
                    <IconButton
                        disabled={disabled}
                        onKeyDown={this.handleKeyDown}
                        ref={(node) => {
                            this.arrowNode = node;
                        }}
                        style={Object.assign({}, styles.icon, iconStyle)}
                        iconStyle={styles.iconChildren}
                    >
                        {iconButton}
                    </IconButton>
                    <div style={prepareStyles(Object.assign({}, styles.underline, underlineStyle))} />
                </ClearFix>
                <Popover
                    anchorOrigin={anchorOrigin}
                    targetOrigin={targetOrigin}
                    anchorEl={anchorEl}
                    animation={animation || PopoverAnimationVertical}
                    open={open}
                    animated={animated}
                    onRequestClose={this.handleRequestCloseMenu}
                >
                    <Menu
                        multiple={multiple}
                        maxHeight={maxHeight}
                        desktop={true}
                        value={value}
                        onEscKeyDown={this.handleEscKeyDownMenu}
                        style={menuStyle}
                        listStyle={listStyle}
                        onItemTouchTap={this.handleItemTouchTap as any}
                        onChange={this.handleChange }
                        selectedMenuItemStyle={selectedMenuItemStyle}
                        autoWidth={autoWidth}
                        width={!autoWidth && menuStyle ? menuStyle.width : null}
                    >
                        {children}
                    </Menu>
                </Popover>
            </div>
        );
    }
}