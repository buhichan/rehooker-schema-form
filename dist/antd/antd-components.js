/**
 * Created by Administrator on 2017/8/8.
 */
///<reference path="./declarations.d.ts" />
import * as tslib_1 from "tslib";
import { AutoComplete, Button, Checkbox, Collapse, DatePicker, Form, Icon, Input, InputNumber, Radio, Select, Tooltip, Upload } from 'antd';
import * as moment from "moment";
import * as React from "react";
import { renderFields } from "../field";
import { useEnumOptions } from '../use-enum-options';
var RadioGroup = Radio.Group;
var TextArea = Input.TextArea;
var RangePicker = DatePicker.RangePicker;
// const Option = ;
var PropTypes = require('prop-types');
var RCSelect = require("rc-select").default;
RCSelect.propTypes['value'] = PropTypes.any;
Select.Option.propTypes && (Select.Option.propTypes['value'] = PropTypes.any);
Select.propTypes['value'] = PropTypes.any;
var emptyArray = [];
var DEFAULT_DATETIME_FORMAT = "YYYY/MM/DD HH:mm:ss";
function ErrorText(_a) {
    var children = _a.children;
    return children ? React.createElement("div", { className: "error-text" }, children) : null;
}
function InputWraper(props) {
    return React.createElement(Form.Item, tslib_1.__assign({ help: props.error, required: props.schema.required, validateStatus: props.error ? "error" : undefined, label: props.schema.label, hasFeedback: !!props.error }, props.schema.wrapperProps), props.children);
}
function TextInput(props) {
    return React.createElement(InputWraper, tslib_1.__assign({}, props),
        React.createElement(Input, tslib_1.__assign({ type: props.schema.type, id: props.schema.key, className: "full-width", style: { width: "100%" }, name: props.schema.name, value: props.value, onChange: props.onChange }, props.componentProps)));
}
function SelectInput(props) {
    var _a = React.useState(""), search = _a[0], setSearch = _a[1];
    var onBlur = function () { return setSearch(""); };
    var fieldSchema = props.schema, value = props.value, componentProps = props.componentProps;
    var options = useEnumOptions(props.schema.options, search);
    var optionValueMap = React.useMemo(function () {
        if (!options || !options.length) {
            return null;
        }
        else {
            return new Map(options.map(function (x) { return [x.value, x.name]; }));
        }
    }, [options]);
    var onChange = function (newValue) {
        setSearch("");
        if (optionValueMap) {
            if (newValue instanceof Array) {
                newValue = newValue.filter(function (y) {
                    return optionValueMap.has(y);
                });
            }
        }
        props.onChange(newValue);
    };
    var _b = React.useState(""), innerError = _b[0], setInnerError = _b[1];
    var finalValue = React.useMemo(function () {
        var finalValue = value;
        if (fieldSchema.multiple || componentProps.mode === "multiple") {
            if (Array.isArray(value)) {
                // finalValue = value.filter(x=>!validValues || validValues.has(x))
            }
            else {
                finalValue = [];
            }
        }
        else {
            if (value === '' || value === null) {
                finalValue = undefined;
            }
            // else if(value != undefined && !!validValues && !validValues.has(value)){
            //     finalValue = undefined
            // }
        }
        return finalValue;
    }, [value]);
    React.useEffect(function () {
        if (componentProps.allowInvalidOption) {
            return;
        }
        else if (optionValueMap) {
            if (finalValue instanceof Array) {
                var invalidValues = finalValue.filter(function (y) { return !optionValueMap.has(y); });
                if (invalidValues.length > 0) {
                    setInnerError(componentProps.invalidOptionAlert && componentProps.invalidOptionAlert(invalidValues) || "\u9009\u9879\u65E0\u6548, \u8BF7\u91CD\u65B0\u9009\u62E9.");
                }
                else {
                    setInnerError("");
                }
            }
            else if (finalValue != undefined) {
                if (!optionValueMap.has(finalValue)) {
                    setInnerError(componentProps.invalidOptionAlert && componentProps.invalidOptionAlert(finalValue) || "\u9009\u9879\u65E0\u6548, \u8BF7\u91CD\u65B0\u9009\u62E9.");
                }
                else {
                    setInnerError("");
                }
            }
            else {
                setInnerError("");
            }
        }
    }, [finalValue, optionValueMap]);
    var filteredOptions = React.useMemo(function () {
        var searchLowercase = search.toLowerCase();
        return options ? !search ? options : options.filter(function (option) {
            return option.name.toLowerCase().includes(searchLowercase) || option.group && option.group.toLowerCase().includes(searchLowercase);
        }) : null;
    }, [options, search]);
    var optionNumMaximum = fieldSchema.maxOptionCount || Infinity;
    var slicedOptions = React.useMemo(function () {
        if (!filteredOptions || filteredOptions.length < optionNumMaximum) {
            return filteredOptions;
        }
        return filteredOptions.filter(function (x, i) {
            return i < optionNumMaximum ||
                props.value === x.value ||
                props.value instanceof Array && props.value.includes(x.value);
        });
    }, [filteredOptions, optionNumMaximum, props.value]);
    var optionGroups = React.useMemo(function () {
        return slicedOptions && slicedOptions.reduce(function (map, option) {
            map[option.group || ""] = map[option.group || ""] || [];
            map[option.group || ""].push(option);
            return map;
        }, {});
    }, [slicedOptions]);
    return React.createElement(InputWraper, tslib_1.__assign({}, props, { error: props.error || innerError }),
        React.createElement(Select, tslib_1.__assign({ allowClear: !fieldSchema.required, showSearch: true, style: { width: "100%" }, onSearch: setSearch, mode: fieldSchema.multiple ? "multiple" : "default", value: finalValue, onChange: onChange, filterOption: false }, componentProps, { onBlur: onBlur }),
            optionGroups && optionGroups[''] && optionGroups[''].map(function (option) {
                var name = option.name, value = option.value, rest = tslib_1.__rest(option, ["name", "value"]);
                return React.createElement(Select.Option, tslib_1.__assign({ key: name, value: value }, rest), name);
            }),
            optionGroups && Object.keys(optionGroups).filter(function (x) { return !!x; }).map(function (group) {
                var options = optionGroups[group];
                var rendered = options.map(function (option) {
                    var name = option.name, value = option.value, rest = tslib_1.__rest(option, ["name", "value"]);
                    return React.createElement(Select.Option, tslib_1.__assign({ key: name, value: value }, rest), name);
                });
                return React.createElement(Select.OptGroup, { key: group, label: group }, rendered);
            }),
            slicedOptions && filteredOptions && filteredOptions.length > slicedOptions.length &&
                React.createElement(Select.Option, { disabled: true, key: "_____more", value: "_____more", style: { opacity: .5 } }, fieldSchema.maxOptionCountTips || "\u5DF2\u9690\u85CF\u5269\u4F59\u7684" + (filteredOptions.length - slicedOptions.length) + "\u4E2A\u9009\u9879, \u8BF7\u4F7F\u7528\u641C\u7D22")));
}
function CheckboxInput(props) {
    return React.createElement(InputWraper, tslib_1.__assign({}, props),
        React.createElement(Checkbox, tslib_1.__assign({ onChange: function (e) { return props.onChange(e.target.checked); }, checked: Boolean(props.value) }, props.componentProps)));
}
function CheckboxGroupInput(props) {
    var options = useEnumOptions(props.schema.options);
    return React.createElement(InputWraper, tslib_1.__assign({}, props),
        React.createElement(Checkbox.Group, tslib_1.__assign({ value: props.value, onChange: props.onChange }, props.componentProps), options && options.map(function (x) {
            return React.createElement(Checkbox, { value: x.value, key: x.value, "data-option": x }, x.name);
        })));
}
function DateTimeInput(props) {
    var value = props.value ? props.componentProps.unixtime ? moment.unix(props.value) : moment(props.value) : undefined;
    return React.createElement(InputWraper, tslib_1.__assign({}, props),
        React.createElement(DatePicker, tslib_1.__assign({ showTime: true, format: props.componentProps.dateFormat || DEFAULT_DATETIME_FORMAT, value: value, style: { width: "100%" }, onChange: function (m, dateString) {
                props.componentProps.unixtime ?
                    props.onChange(m && m.unix() || m) :
                    props.onChange(dateString);
            } }, props.componentProps)));
}
function DateTimeRangeInput(props) {
    var value = props.value;
    var range = [
        (value && value[0] && props.componentProps.unixtime ? moment.unix(value[0]) : moment(value[0])) || moment(),
        (value && value[1] && props.componentProps.unixtime ? moment.unix(value[1]) : moment(value[1])) || moment()
    ];
    return React.createElement(InputWraper, tslib_1.__assign({}, props),
        React.createElement(RangePicker, tslib_1.__assign({ showTime: { format: 'HH:mm:ss' }, style: { width: "100%" }, format: props.componentProps.dateFormat || DEFAULT_DATETIME_FORMAT, placeholder: ['开始时间', '结束时间'], value: range, onChange: function (m, dataStrings) {
                props.componentProps.unixtime ?
                    props.onChange([m[0] && m[0].unix() || m[0], m[1] && m[1].unix() || m[1]]) :
                    props.onChange(dataStrings);
            } }, props.componentProps)));
}
function NumberInput(props) {
    return React.createElement(InputWraper, tslib_1.__assign({}, props),
        React.createElement(InputNumber, tslib_1.__assign({ style: { width: "100%" }, id: props.schema.key, min: 0, value: isNaN(parseFloat(props.value)) ? 0 : parseFloat(props.value), onChange: function (value) {
                if (isNaN(parseFloat(value))) {
                    props.onChange(0);
                }
                else {
                    props.onChange(parseFloat(value));
                }
            } }, props.componentProps)));
}
var defaultAutoCompleteFilter = function (input, element) {
    return typeof element.props.children === 'string' && element.props.children.includes(input);
};
var AutoCompleteDefault = function (props) {
    var value = props.value, onChange = props.onChange, schema = props.schema;
    var options = useEnumOptions(schema.options);
    return React.createElement(InputWraper, tslib_1.__assign({}, props),
        React.createElement(AutoComplete, tslib_1.__assign({ dataSource: options ? options.map(function (itm) { return ({ value: itm.value, text: itm.name }); }) : emptyArray, style: { width: "100%" }, value: value, filterOption: defaultAutoCompleteFilter, onSelect: onChange }, props.componentProps)));
};
var FileInput = /** @class */ (function (_super) {
    tslib_1.__extends(FileInput, _super);
    function FileInput() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.onChange = function (info) {
            _this.props.onChange(info.fileList.map(function (file) {
                if (file.response && file.response.url) {
                    file.url = file.response.url;
                }
                return tslib_1.__assign({}, file);
            }).filter(function (file) {
                if (file.response && file.response.url) {
                    return file.status === "done";
                }
                return true;
            }));
        };
        _this.customRequest = function (customRequestParams) {
            var onSuccess = customRequestParams.onSuccess, onError = customRequestParams.onError, onProgress = customRequestParams.onProgress, file = customRequestParams.file, filename = customRequestParams.filename;
            if (!_this.props.schema.onFileChange) {
                setTimeout(function () {
                    onProgress({ percent: 100 });
                    onSuccess(filename, null);
                }, 1);
            }
            else {
                _this.props.schema.onFileChange(file).then(function (previewUrl) {
                    onProgress({ percent: 100 });
                    onSuccess(previewUrl, null);
                }, function (err) { return onError(err); });
            }
        };
        return _this;
    }
    FileInput.prototype.render = function () {
        return React.createElement("div", { style: { paddingLeft: "var(--schema-form-label-width)" } },
            React.createElement("div", null,
                React.createElement(Upload, tslib_1.__assign({ fileList: this.props.value || emptyArray, multiple: true, onChange: this.onChange, customRequest: this.customRequest }, this.props.componentProps),
                    React.createElement(Button, null,
                        React.createElement(Icon, { type: "upload" }),
                        React.createElement("span", null, this.props.schema.label)))),
            React.createElement(ErrorText, null, this.props.error));
    };
    return FileInput;
}(React.Component));
function SelectRadio(props) {
    var options = useEnumOptions(props.schema.options);
    return React.createElement(InputWraper, tslib_1.__assign({}, props),
        React.createElement(RadioGroup, tslib_1.__assign({ value: props.value, onChange: function (v) { return props.onChange(v); } }, props.componentProps), options ? options.map(function (option) { return (React.createElement(Radio, { style: {
                width: "auto",
                flex: 1,
                whiteSpace: "nowrap",
                margin: "0 15px 0 0"
            }, key: option.value, value: option.value, "data-option": option }, option.name)); }) : null));
}
function DateRangeInput(props) {
    var dateFormat = props.schema.dateFormat || 'YYYY/MM/DD';
    var value = props.value;
    var from = value ? value[0] : undefined;
    var to = value ? value[1] : undefined;
    return React.createElement(InputWraper, tslib_1.__assign({}, props),
        React.createElement(RangePicker, tslib_1.__assign({ defaultValue: [from ? moment(from, dateFormat) : undefined, to ? moment(to, dateFormat) : undefined], format: dateFormat, onChange: function (_, dateStrings) { props.onChange(dateStrings); } }, props.componentProps)));
}
function TextareaInput(props) {
    return React.createElement(InputWraper, tslib_1.__assign({}, props),
        React.createElement(TextArea, tslib_1.__assign({ value: props.value, onChange: function (value) { return props.onChange(value); }, autosize: { minRows: 4, maxRows: 8 } }, props.componentProps)));
}
var AutoCompleteAsync = /** @class */ (function (_super) {
    tslib_1.__extends(AutoCompleteAsync, _super);
    function AutoCompleteAsync() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.$isMounted = false;
        _this.onUpdateInput = function (name) {
            var throttle = _this.props.schema.throttle || 400;
            _this.setState({
                searchText: name
            });
            if (_this.pendingUpdate)
                clearTimeout(_this.pendingUpdate);
            _this.pendingUpdate = setTimeout(function () {
                _this.fetchingQuery = name;
                var result = _this.props.schema.options(name);
                // if(result instanceof Promise)
                result.then(function (options) {
                    if (_this.fetchingQuery === name && _this.$isMounted)
                        _this.setState({
                            dataSource: options.map(function (itm) { return ({ text: itm.name, value: itm.value }); })
                        });
                });
                // else this.setState({
                //     dataSource:result.map(itm=>({text:itm.name,value:itm.value}))
                // })
            }, throttle);
        };
        _this.onSelected = function (params) {
            _this.props.onChange(params.value);
        };
        _this.state = {
            searchText: "",
            dataSource: emptyArray
        };
        return _this;
    }
    AutoCompleteAsync.prototype.componentDidMount = function () {
        this.$isMounted = true;
    };
    AutoCompleteAsync.prototype.componentWillUnmount = function () {
        this.$isMounted = false;
    };
    AutoCompleteAsync.prototype.componentWillReceiveProps = function (nextProps) {
        if (nextProps.value !== this.props.value)
            this.setState({
                searchText: this.findName(nextProps.value)
            });
    };
    AutoCompleteAsync.prototype.findName = function (value) {
        var entry = this.state.dataSource.find(function (x) { return x.value === value; });
        return entry ? entry.name : value;
    };
    AutoCompleteAsync.prototype.render = function () {
        var _a = this.props, onChange = _a.onChange, componentProps = _a.componentProps;
        return React.createElement(InputWraper, tslib_1.__assign({}, this.props),
            React.createElement(AutoComplete, tslib_1.__assign({ dataSource: this.state.dataSource, style: { width: "100%" }, onSelect: onChange, onSearch: this.onUpdateInput, filterOption: false }, componentProps)));
    };
    return AutoCompleteAsync;
}(React.Component));
var AutoCompleteText = /** @class */ (function (_super) {
    tslib_1.__extends(AutoCompleteText, _super);
    function AutoCompleteText() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.onUpdateInput = function (name) {
            var entry = _this.props.schema.options.find(function (x) { return x.name === name; });
            return _this.props.onChange(entry ? entry.value : name);
        };
        return _this;
    }
    AutoCompleteText.prototype.render = function () {
        var _a = this.props, componentProps = _a.componentProps, onChange = _a.onChange, schema = _a.schema;
        return React.createElement(InputWraper, tslib_1.__assign({}, this.props),
            React.createElement(AutoComplete, tslib_1.__assign({ dataSource: schema.options.map(function (itm) { return ({ text: itm.name, value: itm.value }); }), onSearch: this.onUpdateInput, onSelect: onChange, filterOption: defaultAutoCompleteFilter }, componentProps)));
    };
    return AutoCompleteText;
}(React.Component));
function GroupRenderer(_a) {
    var form = _a.form, schema = _a.schema, keyPath = _a.keyPath, componentMap = _a.componentMap, componentProps = _a.componentProps;
    return React.createElement(Collapse, tslib_1.__assign({ defaultActiveKey: ["0"], style: { marginBottom: 15 } }, componentProps),
        React.createElement(Collapse.Panel, { key: "0", header: schema.label }, renderFields(form, schema.children || [], keyPath.concat(schema.key), componentMap)));
}
function ArrayFieldRenderer(props) {
    var list = Array.isArray(props.value) ? props.value : [];
    return React.createElement(React.Fragment, null,
        React.createElement("label", null, props.schema.label),
        React.createElement(Collapse, { activeKey: list.map(function (_, i) { return String(i); }), style: { marginBottom: 16, marginTop: 16 } }, list.map(function (_, index) {
            return React.createElement(Collapse.Panel, { forceRender: true, showArrow: false, key: String(index), header: React.createElement("div", null,
                    props.schema.label + " #" + (index + 1),
                    React.createElement("div", { className: "delete-button", onClick: function (e) { return e.stopPropagation(); } },
                        React.createElement(Tooltip, { placement: "topLeft", title: "\u5220\u9664", arrowPointAtCenter: true },
                            React.createElement(Icon, { type: "close", style: { cursor: "pointer", marginRight: 8 }, onClick: function () {
                                    var clone = list.slice();
                                    clone.splice(index, 1);
                                    props.onChange(clone);
                                } })))) },
                React.createElement("div", { className: "array-field-child" }, props.schema.children && renderFields(props.form, props.schema.children, props.keyPath.concat(props.schema.key, index), props.componentMap)));
        })),
        React.createElement("div", { className: "add-button" },
            React.createElement(Tooltip, { placement: "topLeft", title: "\u6DFB\u52A0", arrowPointAtCenter: true },
                React.createElement(Button, { icon: "plus", onClick: function () {
                        props.onChange(list.concat(props.schema.defaultValue || {}));
                    } }))));
}
export var componentMap = new Map();
componentMap.set("group", GroupRenderer);
componentMap.set("select", SelectInput);
componentMap.set("radio", SelectRadio);
componentMap.set("checkbox", CheckboxInput);
componentMap.set("checkbox-group", CheckboxGroupInput);
componentMap.set("autocomplete-text", AutoCompleteText);
componentMap.set("datetime", DateTimeInput);
componentMap.set("datetimeRange", DateTimeRangeInput);
componentMap.set("number", NumberInput);
componentMap.set("autocomplete", AutoCompleteDefault);
componentMap.set("file", FileInput);
componentMap.set("date-range", DateRangeInput);
componentMap.set("textarea", TextareaInput);
componentMap.set("password", TextInput);
componentMap.set("email", TextInput);
componentMap.set("text", TextInput);
componentMap.set("input", TextInput);
componentMap.set("array", ArrayFieldRenderer);
componentMap.set("autocomplete-async", AutoCompleteAsync);
export var buttonRenderer = function (props) {
    return React.createElement("div", { style: { textAlign: "center", float: "left", margin: 15, width: "100%" } },
        React.createElement(Button.Group, null,
            React.createElement(Button, { style: {
                    backgroundColor: "transparent",
                }, onClick: props.onReset, disabled: props.disabled, htmlType: 'reset' }, "\u91CD\u7F6E"),
            React.createElement(Button, { className: "raised-button", onClick: props.onSubmit, icon: props.submitSucceeded ? "check" : undefined, disabled: props.disabled, type: 'primary', loading: props.submitting, htmlType: 'submit' }, "\u63D0\u4EA4")));
};
//# sourceMappingURL=antd-components.js.map