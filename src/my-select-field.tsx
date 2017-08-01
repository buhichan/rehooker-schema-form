import * as React from 'react';
import * as PropTypes from "prop-types";
import TextField from 'material-ui/TextField';
import {DropDownMenu} from './my-drop-down-menu';
import MuiSelectField from "material-ui/SelectField"

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

export class SelectField extends React.Component<{
    [prop:string]:any
},any> {
    static propTypes = MuiSelectField['propTypes'];

    static defaultProps = {
        autoWidth: false,
        disabled: false,
        fullWidth: false,
        multiple: false,
    };

    static contextTypes = {
        muiTheme: PropTypes.object.isRequired,
    };

    render() {
        const {
            autoWidth,
            multiple,
            children,
            style,
            labelStyle,
            iconStyle,
            id,
            underlineDisabledStyle,
            underlineFocusStyle,
            menuItemStyle,
            selectedMenuItemStyle,
            underlineStyle,
            dropDownMenuProps,
            errorStyle,
            disabled,
            floatingLabelFixed,
            floatingLabelText,
            floatingLabelStyle,
            hintStyle,
            hintText,
            fullWidth,
            errorText,
            listStyle,
            maxHeight,
            menuStyle,
            onFocus,
            onBlur,
            onChange,
            selectionRenderer,
            value,
            ...other
        } = this.props;

        const styles = getStyles(this.props);

        return (
            <TextField
                {...other}
                style={style}
                disabled={disabled}
                floatingLabelFixed={floatingLabelFixed}
                floatingLabelText={floatingLabelText}
                floatingLabelStyle={floatingLabelStyle}
                hintStyle={hintStyle}
                hintText={(!hintText && !floatingLabelText) ? ' ' : hintText}
                fullWidth={fullWidth}
                errorText={errorText}
                underlineStyle={underlineStyle}
                errorStyle={errorStyle}
                onFocus={onFocus}
                onBlur={onBlur}
                id={id}
                underlineDisabledStyle={underlineDisabledStyle}
                underlineFocusStyle={underlineFocusStyle}
            >
                <DropDownMenu
                    disabled={disabled}
                    style={Object.assign(styles.dropDownMenu, menuStyle)}
                    labelStyle={Object.assign(styles.label, labelStyle)}
                    iconStyle={Object.assign(styles.icon, iconStyle)}
                    menuItemStyle={menuItemStyle}
                    selectedMenuItemStyle={selectedMenuItemStyle}
                    underlineStyle={styles.hideDropDownUnderline}
                    listStyle={listStyle}
                    autoWidth={autoWidth}
                    value={value}
                    onChange={onChange}
                    maxHeight={maxHeight}
                    multiple={multiple}
                    selectionRenderer={selectionRenderer}
                    {...dropDownMenuProps}
                >
                    {children}
                </DropDownMenu>
            </TextField>
        );
    }
}