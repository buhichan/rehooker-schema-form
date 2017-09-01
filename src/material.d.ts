/// <reference types="react" />
/**
 * Created by buhi on 2017/4/28.
 */
import * as React from "react";
import { WidgetProps } from "./field";
export declare class SelectInput extends React.PureComponent<WidgetProps, any> {
    state: {
        options: any;
    };
    reload(props: WidgetProps): void;
    componentWillReceiveProps(nextProps: WidgetProps): void;
    componentWillMount(): void;
    render(): JSX.Element;
}
