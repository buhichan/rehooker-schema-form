"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var React = require("react");
var ReactDOM = require("react-dom");
var react_redux_1 = require("react-redux");
var redux_1 = require("redux");
var redux_form_1 = require("redux-form");
require("../src/material");
var _1 = require("../");
var styles_1 = require("material-ui/styles");
var getMuiTheme_1 = require("material-ui/styles/getMuiTheme");
require('react-tap-event-plugin')();
var schema = [
    {
        key: "text",
        type: "text",
        placeholder: "input something",
        label: "文本属性",
        validate: function (v) {
            if (v !== "a")
                return "必须是a";
        }
    }, {
        key: 'select',
        type: "select",
        label: "单选",
        options: [
            {
                name: "苹果",
                value: "apple"
            },
            {
                name: "梨子",
                value: "pear"
            }
        ]
    }, {
        key: "checkbox",
        type: "checkbox",
        label: "勾选",
        required: true
    }, {
        key: "mulSel",
        type: "select",
        multiple: true,
        label: "多选",
        options: [
            {
                name: "苹果",
                value: "apple"
            },
            {
                name: "梨子",
                value: "pear"
            }
        ]
    }, {
        key: "date",
        type: "date",
        label: "date",
    }, {
        key: "datetime",
        type: "datetime",
        label: "datetime"
    }, {
        key: "file",
        type: "file",
        label: "文件",
        validate: function (v) {
            if (v instanceof File && !v.type.startsWith('image/'))
                return "只能上传图片";
        },
        onFileChange: function (file) {
            return new Promise(function (r) {
                setTimeout(function () {
                    r("/fake/url");
                }, 3000);
            });
        }
    }, {
        key: "ajax_select",
        type: "select",
        label: "单选(async)",
        options: function () {
            return fetch("/example/options.json").then(function (res) { return res.json(); });
        }
    }, {
        key: "group1",
        type: "group",
        label: "组",
        children: [
            {
                type: "number",
                key: "phone",
                validators: {
                    minLength: 11,
                    maxLength: 14,
                    pattern: /[0-9]+/
                },
                label: "手机号",
                listens: {
                    checkbox: function (v) { return ({ hide: v }); }
                }
            }
        ]
    }, {
        key: "conditional1",
        type: "text",
        label: "当单选框为梨子的时候，隐藏",
        listens: {
            select: function (v) { return ({ hide: v === 'pear' }); }
        }
    }, {
        key: "nest.1",
        type: "text",
        label: "nest",
        style: {
            border: "1px dotted #23f0ff"
        }
    }, {
        key: "nest.2",
        type: "group",
        label: "组2",
        children: [
            {
                type: 'date',
                key: "nested[0]",
                label: "日期"
            }, {
                key: "email",
                type: "email",
                label: "email with validation",
                validate: function (v) {
                    if (!/.*@.*\..*/.test(v))
                        return "not a valid email";
                }
            },
        ]
    }, {
        key: "dependant_lv1",
        type: "select",
        label: "有依赖的单选lv1",
        options: [
            {
                name: "植物",
                value: "plant"
            },
            {
                name: "动物",
                value: "animal"
            }
        ]
    }, {
        key: "dependant_lv2",
        type: "select",
        label: "有依赖的单选lv2",
        listens: {
            dependant_lv1: function (v) {
                return {
                    hide: !v,
                    options: v === 'animal' ? [
                        {
                            name: "狗",
                            value: "dog"
                        }, {
                            name: "猫",
                            value: "cat"
                        }
                    ] : v === 'plant' ? [
                        {
                            name: "苹果",
                            value: "apple"
                        },
                        {
                            name: "梨子",
                            value: "pear"
                        }
                    ] : []
                };
            }
        },
        options: [],
        hide: true
    }, {
        key: "dependant_lv3",
        type: "select",
        label: "有依赖的单选lv3",
        options: [],
        hide: true,
        listens: {
            dependant_lv2: function (v) { return ({
                options: v === 'cat' ? [
                    { name: 'kitten', value: 'kitten' }, { name: 'cat', value: 'cat' }, { name: 'kitty', value: 'kitty' }
                ] :
                    v === 'dog' ?
                        [{ name: 'dogg1', value: "dogg1" }, { name: 'doggy', value: 'doggy' }, { name: 'puppy', value: 'puppy' }] :
                        [],
                value: null,
                hide: !(v === 'cat' || v === 'dog')
            }); }
        }
    }, {
        key: "array",
        type: "array",
        label: "Array(当select是梨子的时候会少一个child)",
        listens: {
            select: function (v) {
                return {
                    children: v === 'pear' ? [
                        {
                            key: "array-child",
                            label: "array-child",
                            type: "text"
                        }
                    ] : [
                        {
                            key: "array-child",
                            label: "array-child",
                            type: "text"
                        }, {
                            key: "haha",
                            label: "dynamic-child",
                            type: "text"
                        }
                    ]
                };
            }
        },
        children: []
    }, {
        key: "dynamic-array-alter",
        type: "array",
        label: "dynamic-array(使用listens)",
        children: [
            {
                key: "array-child",
                label: "array-child",
                type: "text"
            },
            {
                key: "currency",
                label: "currency",
                type: "text",
                hide: true,
                listens: function (keyPath) {
                    return _a = {},
                        _a[keyPath + ".array-child"] = function (v, child) {
                            console.log(arguments);
                            return {
                                hide: !v
                            };
                        },
                        _a;
                    var _a;
                }
            }
        ]
    }, {
        key: "test-component",
        type: function (props) {
            var input = props.input, fieldSchema = props.fieldSchema, renderField = props.renderField, meta = props.meta;
            return React.createElement("div", null,
                React.createElement("label", { htmlFor: input.name },
                    fieldSchema.label,
                    React.createElement("input", tslib_1.__assign({ type: "color" }, input))));
        },
        label: "type也可以是组件"
    },
    {
        key: "autocomplete",
        type: "autocomplete-async",
        label: "自动完成",
        options: function (t) {
            if (/^\d+$/.test(t))
                return Promise.resolve(new Array(100).fill(0).map(function (_, i) { return ({ name: String(i), value: "value-" + i }); }));
            else
                return [{ name: "0", value: 0 }];
        }
    }
];
var reducer = redux_1.combineReducers({
    form: function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return redux_form_1.reducer.apply(null, args);
    }
});
var composeEnhancers = window['__REDUX_DEVTOOLS_EXTENSION_COMPOSE__'] || redux_1.compose;
var middleware = composeEnhancers(redux_1.applyMiddleware());
var store = redux_1.createStore(reducer, {}, middleware);
var App = (function (_super) {
    tslib_1.__extends(App, _super);
    function App() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.data = {
            state: 2,
            "dependant_lv1": "animal",
            "dependant_lv2": "dog",
            "select": "pear",
            "dynamic-array-alter": [
                {
                    "array-child": 1
                }, {
                    "array-child": ""
                }
            ]
        };
        _this.onSubmit = function (values) {
            if (values.text) {
                return new Promise(function (resolve) {
                    setTimeout(resolve, 3000);
                });
            }
            else
                return true;
        };
        return _this;
    }
    App.prototype.render = function () {
        return React.createElement("div", null,
            React.createElement(_1.ReduxSchemaForm, { form: "random", initialValues: this.data, schema: schema, onSubmit: this.onSubmit }),
            React.createElement("p", null, "\u8BF8\u5982\u6570\u636Eschema\u53D1\u751F\u53D8\u5316\u7684\u9700\u6C42\uFF0C\u6700\u597D\u4E0D\u7531\u8868\u5355\u8FD9\u4E00\u5C42\u6765\u5B9E\u73B0.\u5E94\u8BE5\u662F\u903B\u8F91\u5C42\u5B9E\u73B0\u7684\u529F\u80FD\uFF0C\u8FD9\u91CC\u7684\u8868\u5355\u53EA\u8981\u7B28\u7B28\u7684\u5C31\u884C\u4E86.\u4F46\u662F\u4E3A\u4E86\u65B9\u4FBF,\u8FD8\u662F\u52A0\u4E86listens\u8FD9\u4E2AAPI."),
            React.createElement("pre", null,
                React.createElement("code", null,
                    "data:",
                    JSON.stringify(this.props.values, null, "\t"))));
    };
    App = tslib_1.__decorate([
        react_redux_1.connect(function (store) { return ({
            values: store.form.random ? store.form.random.values : {}
        }); })
    ], App);
    return App;
}(React.PureComponent));
var muiTheme = getMuiTheme_1.default({
    palette: {
        primary1Color: "#885543"
    }
});
ReactDOM.render(React.createElement(styles_1.MuiThemeProvider, { muiTheme: muiTheme },
    React.createElement(react_redux_1.Provider, { store: store },
        React.createElement(App, null))), document.getElementById('root'));
//# sourceMappingURL=example.js.map