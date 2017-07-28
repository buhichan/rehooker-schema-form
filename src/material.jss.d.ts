export declare const stylesheet: {
    [x: string]: {
        [x: string]: string | {
            content: string;
            display: string;
            clear: string;
        } | {
            boxSizing: string;
        } | {
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
        } | {
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
        } | {
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
        } | {
            textAlign: string;
            float: string;
            paddingRight: string;
            paddingLeft: string;
            height: string;
            width: string;
            margin: string;
            minHeight: string;
        } | {
            float: string;
            width: string;
            padding: string;
        } | {
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
        position: string;
        "&:after": {
            content: string;
            display: string;
            clear: string;
        };
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
    } | {
        "form": {
            "& .field, & .array-field-container .array-field-child": {
                width: string;
            };
        };
    };
    form: {
        [x: string]: string | {
            content: string;
            display: string;
            clear: string;
        } | {
            boxSizing: string;
        } | {
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
        } | {
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
        } | {
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
        } | {
            textAlign: string;
            float: string;
            paddingRight: string;
            paddingLeft: string;
            height: string;
            width: string;
            margin: string;
            minHeight: string;
        } | {
            float: string;
            width: string;
            padding: string;
        } | {
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
        position: string;
        "&:after": {
            content: string;
            display: string;
            clear: string;
        };
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
    };
};
