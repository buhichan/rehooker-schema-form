"use strict";
/**-----------------------------------Form-----------------------------------**/
Object.defineProperty(exports, "__esModule", { value: true });
var FullWidthInputs = "& .field.group,& .field.array,& .field.rich-editor, & .field.textarea";
var widgetHeight = 85;
var mobileMedia = "@media(max-width:768px)";
exports.stylesheet = {
    form: {
        position: "relative",
        "&:after": {
            content: "\" \"",
            display: "table",
            clear: "both"
        },
        "& *": {
            boxSizing: "border-box",
        },
        "&>.redux-schema-form": {
            "& .btn-group": {
                "&>button": {
                    border: 0,
                    borderRadius: 0,
                    backgroundColor: function (_a) {
                        var muiTheme = _a.muiTheme;
                        return muiTheme.palette.primary1Color;
                    },
                    color: "white",
                    "&:not(:first-child)": {
                        marginLeft: 2
                    }
                }
            },
            "& .array-field-container": {
                display: "flex",
                flexWrap: "wrap",
                alignItems: "flex-start",
                "& .array-field-child": (_a = {
                        padding: '10px 0',
                        margin: '10px',
                        borderTop: function (_a) {
                            var muiTheme = _a.muiTheme;
                            return "2px solid " + muiTheme.palette.primary1Color;
                        },
                        width: "calc(50% - 20px)"
                    },
                    _a[mobileMedia] = {
                        width: "100%",
                        margin: 0
                    },
                    _a),
                "& .add-button": {
                    textAlign: "center",
                    marginBottom: 10,
                    width: "100%"
                },
                "& .delete-button": {
                    float: "right"
                }
            },
            "&:after": {
                display: "table",
                content: "",
                clear: "both"
            },
            "&>.schema-node": (_b = {
                    "&>.field": (_c = {
                            float: "left",
                            paddingRight: "10%",
                            paddingLeft: "10%",
                            width: "50%",
                            height: widgetHeight,
                            "&.hidden": {
                                display: "none"
                            }
                        },
                        _c[mobileMedia] = {
                            width: "100%"
                        },
                        _c)
                },
                _b[FullWidthInputs] = {
                    width: "100%",
                    height: "auto",
                    minHeight: widgetHeight
                },
                _b),
            "&>.children, &>div.button": {
                textAlign: "center",
                float: "left",
                paddingRight: "initial",
                paddingLeft: "initial",
                height: "auto",
                width: "100%",
                margin: "20px 0 0",
                minHeight: "initial"
            },
            "& fieldset>.schema-node>div:nth-child(2n)": {
                float: "right",
                width: "50%",
                padding: " 0 5% 0 calc(10% + 15px)",
            },
            "& fieldset>.schema-node>div:nth-child(2n+1)": {
                float: "left",
                width: "50%",
                padding: " 0 calc(10% + 15px) 0 5%",
            },
            "&>.schema-node>.field>fieldset": (_d = {
                    "&>legend": {
                        position: "relative",
                        top: "11px",
                        marginLeft: " 5%",
                        borderBottom: "none",
                        display: "inline-block",
                        width: "auto",
                        borderTop: function (_a) {
                            var muiTheme = _a.muiTheme;
                            return "3px solid " + muiTheme.palette.primary1Color;
                        }
                    },
                    margin: " 40px calc(5% - 7.5px)",
                    padding: " 0 7.5px",
                    background: "#f9f9fa",
                    border: "none"
                },
                _d[FullWidthInputs] = {
                    padding: " 0 5%",
                },
                _d),
        }
    }
};
var _a, _b, _c, _d;
//# sourceMappingURL=material.jss.js.map