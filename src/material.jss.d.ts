export declare const stylesheet: {
    form: {
        position: string;
        "&:after": {
            content: string;
            display: string;
            clear: string;
        };
        "& *": {
            boxSizing: string;
        };
        "&>.redux-schema-form": {
            "& .btn-group": {
                "&>button": {
                    border: number;
                    borderRadius: number;
                    backgroundColor: ({muiTheme}: {
                        muiTheme: any;
                    }) => any;
                    color: string;
                    "&:not(:first-child)": {
                        marginLeft: number;
                    };
                };
            };
            "& .array-field-container": {
                display: string;
                flexWrap: string;
                alignItems: string;
                "& .array-field-child": {
                    [x: string]: string | (({muiTheme}: {
                        muiTheme: any;
                    }) => string) | {
                        width: string;
                        margin: number;
                    };
                    padding: string;
                    margin: string;
                    borderTop: ({muiTheme}: {
                        muiTheme: any;
                    }) => string;
                    width: string;
                };
                "& .add-button": {
                    textAlign: string;
                    marginBottom: number;
                    width: string;
                };
                "& .delete-button": {
                    float: string;
                };
            };
            "&:after": {
                display: string;
                content: string;
                clear: string;
            };
            "&>.schema-node": {
                [x: string]: {
                    [x: string]: string | number | {
                        display: string;
                    } | {
                        width: string;
                    };
                    float: string;
                    paddingRight: string;
                    paddingLeft: string;
                    width: string;
                    height: number;
                    "&.hidden": {
                        display: string;
                    };
                } | {
                    width: string;
                    height: string;
                    minHeight: number;
                };
                "&>.field": {
                    [x: string]: string | number | {
                        display: string;
                    } | {
                        width: string;
                    };
                    float: string;
                    paddingRight: string;
                    paddingLeft: string;
                    width: string;
                    height: number;
                    "&.hidden": {
                        display: string;
                    };
                };
            };
            "&>.children, &>div.button": {
                textAlign: string;
                float: string;
                paddingRight: string;
                paddingLeft: string;
                height: string;
                width: string;
                margin: string;
                minHeight: string;
            };
            "& fieldset>.schema-node>div:nth-child(2n)": {
                float: string;
                width: string;
                padding: string;
            };
            "& fieldset>.schema-node>div:nth-child(2n+1)": {
                float: string;
                width: string;
                padding: string;
            };
            "&>.schema-node>.field>fieldset": {
                [x: string]: string | {
                    position: string;
                    top: string;
                    marginLeft: string;
                    borderBottom: string;
                    display: string;
                    width: string;
                    borderTop: ({muiTheme}: {
                        muiTheme: any;
                    }) => string;
                } | {
                    padding: string;
                };
                "&>legend": {
                    position: string;
                    top: string;
                    marginLeft: string;
                    borderBottom: string;
                    display: string;
                    width: string;
                    borderTop: ({muiTheme}: {
                        muiTheme: any;
                    }) => string;
                };
                margin: string;
                padding: string;
                background: string;
                border: string;
            };
        };
    };
};
