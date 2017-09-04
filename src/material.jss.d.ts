export declare const stylesheet: {
    [x: string]: {
        "& *": {
            boxSizing: string;
        };
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
                padding: string;
                margin: string;
                borderTop: ({muiTheme}: {
                    muiTheme: any;
                }) => string;
                width: string;
                "& .field": {
                    width: string;
                };
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
        "&>div:after": {
            display: string;
            content: string;
            clear: string;
        };
        "& .field": {
            float: string;
            paddingRight: string;
            paddingLeft: string;
            width: string;
            height: number;
            "&.hidden": {
                display: string;
            };
        };
        "& div.children, & div.button": {
            textAlign: string;
            float: string;
            paddingRight: string;
            paddingLeft: string;
            height: string;
            width: string;
            margin: string;
            minHeight: string;
        };
        "& fieldset .field:nth-child(2n)": {
            padding: string;
        };
        "& fieldset .field:nth-child(2n+1)": {
            padding: string;
        };
        "& .schema-node": {
            "&:after": {
                content: string;
                display: string;
                clear: string;
            };
        };
        "&>form>.schema-node>.field>fieldset": {
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
        "&:after": {
            content: string;
            display: string;
            clear: string;
        };
        position: string;
    } | {
        "form": {
            "& .field, & .array-field-container .array-field-child": {
                width: string;
            };
        };
    };
    form: {
        "& *": {
            boxSizing: string;
        };
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
                padding: string;
                margin: string;
                borderTop: ({muiTheme}: {
                    muiTheme: any;
                }) => string;
                width: string;
                "& .field": {
                    width: string;
                };
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
        "&>div:after": {
            display: string;
            content: string;
            clear: string;
        };
        "& .field": {
            float: string;
            paddingRight: string;
            paddingLeft: string;
            width: string;
            height: number;
            "&.hidden": {
                display: string;
            };
        };
        "& div.children, & div.button": {
            textAlign: string;
            float: string;
            paddingRight: string;
            paddingLeft: string;
            height: string;
            width: string;
            margin: string;
            minHeight: string;
        };
        "& fieldset .field:nth-child(2n)": {
            padding: string;
        };
        "& fieldset .field:nth-child(2n+1)": {
            padding: string;
        };
        "& .schema-node": {
            "&:after": {
                content: string;
                display: string;
                clear: string;
            };
        };
        "&>form>.schema-node>.field>fieldset": {
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
        "&:after": {
            content: string;
            display: string;
            clear: string;
        };
        position: string;
    };
};
