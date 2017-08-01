/// <reference types="react" />
import * as React from 'react';
export declare class SelectField extends React.Component<{
    [prop: string]: any;
}, any> {
    static propTypes: any;
    static defaultProps: {
        autoWidth: boolean;
        disabled: boolean;
        fullWidth: boolean;
        multiple: boolean;
    };
    static contextTypes: {
        muiTheme: any;
    };
    render(): JSX.Element;
}
