"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
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
        key: "hidden",
        type: "hidden",
        placeholder: "input something",
        label: "文本属性"
    },
    {
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
        ],
        onValueChange: function (value) {
            if (value === 'pear')
                return [
                    {
                        key: "conditional1",
                        hide: true
                    }
                ];
            else
                return Promise.resolve([
                    {
                        key: "conditional1",
                        hide: false
                    }
                ]);
        }
    }, {
        key: "checkbox",
        type: "checkbox",
        label: "勾选",
        required: true,
        onValueChange: function (v) {
            return [
                { key: "phone", hide: Boolean(v) }
            ];
        }
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
                label: "手机号"
            }
        ]
    }, {
        key: "conditional1",
        type: "text",
        label: "当单选框为梨子的时候，隐藏"
    }, {
        key: "nest.1",
        type: "text",
        label: "nest"
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
        ],
        onValueChange: function (value) {
            if (value === 'animal') {
                return [
                    {
                        key: "dependant_lv2",
                        hide: false,
                        value: null,
                        options: [
                            {
                                name: "狗",
                                value: "dog"
                            }, {
                                name: "猫",
                                value: "cat"
                            }
                        ]
                    }, {
                        key: "dependant_lv3",
                        hide: true,
                        value: null
                    }
                ];
            }
            else if (value === 'plant') {
                return [
                    {
                        key: "dependant_lv2",
                        hide: false,
                        value: null,
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
                        key: "dependant_lv3",
                        hide: true,
                        value: null
                    }
                ];
            }
            else {
                return [
                    {
                        key: "dependant_lv2",
                        hide: true,
                        value: null
                    }, {
                        key: "dependant_lv3",
                        hide: true,
                        value: null
                    }
                ];
            }
        }
    }, {
        key: "dependant_lv2",
        type: "select",
        label: "有依赖的单选lv2",
        onValueChange: function (value) {
            if (value === 'dog') {
                return [
                    {
                        key: "dependant_lv3",
                        hide: false,
                        value: null,
                        options: [{ name: 'dogg1', value: "dogg1" }, { name: 'doggy', value: 'doggy' }, { name: 'puppy', value: 'puppy' }]
                    }
                ];
            }
            else if (value === 'cat') {
                return [
                    {
                        key: "dependant_lv3",
                        hide: false,
                        value: null,
                        options: [{ name: 'kitten', value: 'kitten' }, { name: 'cat', value: 'cat' }, { name: 'kitty', value: 'kitty' }]
                    }
                ];
            }
            else {
                return [
                    {
                        key: "dependant_lv3",
                        hide: true,
                        value: null
                    }
                ];
            }
        },
        options: [],
        hide: true
    }, {
        key: "dependant_lv3",
        type: "select",
        label: "有依赖的单选lv3",
        options: [],
        hide: true
    }, {
        key: "array",
        type: "array",
        label: "Array",
        children: [
            {
                key: "array-child",
                label: "array-child",
                type: "text"
            }
        ]
    }, {
        key: "dynamic-array-alter",
        type: "array",
        label: "dynamic-array(使用onValueChange)",
        children: [
            {
                key: "array-child",
                label: "array-child",
                type: "text",
                onValueChange: function (v) {
                    console.log(arguments);
                    return v && isFinite(v) ? [
                        {
                            key: "currency",
                            hide: false
                        }
                    ] : [
                        {
                            key: "currency",
                            hide: true
                        }
                    ];
                }
            },
            {
                key: "currency",
                label: "currency",
                type: "text",
                hide: true
            }
        ]
    }, {
        key: "dynamic-array",
        type: "array",
        label: "dynamic-array（使用getChildren）",
        getChildren: function (v) {
            return [
                {
                    key: "array-child",
                    label: "array-child",
                    type: "text"
                },
                v && isFinite(v['array-child']) ? {
                    key: "currency",
                    label: "currency",
                    type: "text"
                } : null
            ];
        }
    }, {
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
    __extends(App, _super);
    function App() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.data = {
            state: 2,
            "dependant_lv1": "animal",
            "dependant_lv2": "dog",
            "select": "pear"
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
            React.createElement("p", null, "\u8BF8\u5982\u6570\u636Eschema\u53D1\u751F\u53D8\u5316\u7684\u9700\u6C42\uFF0C\u4E0D\u5E94\u8BE5\u7531\u8868\u5355\u8FD9\u4E00\u5C42\u6765\u5B9E\u73B0\uFF01\u5E94\u8BE5\u662F\u903B\u8F91\u5C42\u5B9E\u73B0\u7684\u529F\u80FD\uFF0C\u8FD9\u91CC\u7684\u8868\u5355\u53EA\u8981\u7B28\u7B28\u7684\u5C31\u884C\u4E86"),
            React.createElement("pre", null,
                React.createElement("code", null,
                    "data:",
                    JSON.stringify(this.props.values, null, "\t"))));
    };
    return App;
}(React.PureComponent));
App = __decorate([
    react_redux_1.connect(function (store) { return ({
        values: store.form.random ? store.form.random.values : {}
    }); })
], App);
var muiTheme = getMuiTheme_1.default({
    palette: {
        primary1Color: "#885543"
    }
});
ReactDOM.render(React.createElement(styles_1.MuiThemeProvider, { muiTheme: muiTheme },
    React.createElement(react_redux_1.Provider, { store: store },
        React.createElement(App, null))), document.getElementById('root'));
//# sourceMappingURL=example.js.map