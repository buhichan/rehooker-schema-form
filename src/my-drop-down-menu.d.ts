/// <reference types="react" />
import * as React from 'react';
export declare class DropDownMenu extends React.Component<{
    [some: string]: any;
}, any> {
    static muiName: string;
    static propTypes: any;
    static defaultProps: {
        animated: boolean;
        autoWidth: boolean;
        disabled: boolean;
        iconButton: JSX.Element;
        openImmediately: boolean;
        maxHeight: number;
        multiple: boolean;
        anchorOrigin: {
            vertical: string;
            horizontal: string;
        };
    };
    static contextTypes: {
        muiTheme: any;
    };
    state: any;
    componentDidMount(): void;
    componentWillReceiveProps(): void;
    rootNode: any;
    arrowNode: any;
    /**
     * This method is deprecated but still here because the TextField
     * need it in order to work. TODO: That will be addressed later.
     */
    getInputNode(): any;
    setWidth(): void;
    handleTouchTapControl: (event: any) => void;
    handleRequestCloseMenu: () => void;
    handleEscKeyDownMenu: () => void;
    handleKeyDown: (event: any) => void;
    handleItemTouchTap: (event: any, child: any, index: any) => void;
    handleChange: (event: any, value: any) => void;
    close: (isKeyboard: any) => void;
    render(): JSX.Element;
}
