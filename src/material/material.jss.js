"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var constants_1 = require("../constants");
var react_jss_1 = require("react-jss");
var muiThemeable_1 = require("material-ui/styles/muiThemeable");
var decorate_1 = require("../decorate");
/**-----------------------------------Form-----------------------------------**/
var stylesheet = (_a = {
        form: tslib_1.__assign({ position: "relative" }, constants_1.clearfix, (_b = { "& *": {
                    boxSizing: "border-box",
                }, "& .btn-group": {
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
                }, "& .array-field-container": {
                    display: "flex",
                    flexWrap: "wrap",
                    alignItems: "flex-start",
                    "& .array-field-child": {
                        padding: '10px 0',
                        margin: '10px',
                        borderTop: function (_a) {
                            var muiTheme = _a.muiTheme;
                            return "2px solid " + muiTheme.palette.primary1Color;
                        },
                        "& .field": {
                            width: "100%"
                        }
                    },
                    "& .add-button": {
                        textAlign: "center",
                        marginBottom: 10,
                        width: "100%"
                    },
                    "& .item-buttons": {
                        float: "right"
                    }
                }, "&>div:after": {
                    display: "table",
                    content: "",
                    clear: "both"
                }, "& .field": {
                    float: "left",
                    paddingRight: "10%",
                    paddingLeft: "10%",
                    width: "50%",
                    height: constants_1.widgetHeight,
                    "&.hidden": {
                        display: "none"
                    },
                } }, _b[constants_1.fullWidthInputs] = {
            width: "100%",
            height: "auto",
            minHeight: constants_1.widgetHeight
        }, _b["& div.children, & div.button"] = {
            textAlign: "center",
            float: "left",
            paddingRight: "initial",
            paddingLeft: "initial",
            height: "auto",
            width: "100%",
            margin: "20px 0 0",
            minHeight: "initial"
        }, _b["& fieldset .field:nth-child(2n)"] = {
            padding: " 0 5% 0 calc(10% + 15px)",
        }, _b["& fieldset .field:nth-child(2n+1)"] = {
            padding: " 0 calc(10% + 15px) 0 5%",
        }, _b["& .schema-node"] = constants_1.clearfix, _b["&>.schema-node>.field>fieldset"] = (_c = {
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
            _c[constants_1.fullWidthInputs] = {
                padding: " 0 5%",
            },
            _c), _b))
    },
    _a[constants_1.mobileMedia] = {
        "form": {
            "& .field, & .array-field-container .array-field-child": {
                width: "100%"
            }
        }
    },
    _a);
decorate_1.pushDecorator(react_jss_1.default(stylesheet));
decorate_1.pushDecorator(muiThemeable_1.default());
var _a, _b, _c;
//# sourceMappingURL=material.jss.js.map