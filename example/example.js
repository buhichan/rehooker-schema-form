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
var form_1 = require("../src/form");
var styles_1 = require("material-ui/styles");
var getMuiTheme_1 = require("material-ui/styles/getMuiTheme");
require('react-tap-event-plugin')();
var schema = [
    {
        key: "text",
        type: "text",
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
        onChange: function (value, prevValue, formData) {
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
        key: "file",
        type: "file",
        label: "文件"
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
                key: "width",
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
            },
            {
                type: "datetime-local",
                key: "nested[1]",
                label: "日期时间"
            }
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
        onChange: function (value) {
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
        onChange: function (value) {
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
    }
];
var reducer = redux_1.combineReducers({
    data: function (state, action) {
        if (!state)
            return {
                text: 2
            };
        else
            return state;
    },
    formSchema: function (state, action) {
        if (!state)
            return schema;
        else
            return state;
    },
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
        return _super !== null && _super.apply(this, arguments) || this;
    }
    App.prototype.render = function () {
        return React.createElement(form_1.ReduxSchemaForm, { form: "random", initialValues: this.props.data, schema: this.props['formSchema'], onSubmit: function (values) {
                if (values.text) {
                    return new Promise(function (resolve) {
                        setTimeout(resolve, 3000);
                    });
                }
                else
                    return true;
            } },
            React.createElement("p", null, "\u8BF8\u5982\u6570\u636Eschema\u53D1\u751F\u53D8\u5316\u7684\u9700\u6C42\uFF0C\u4E0D\u5E94\u8BE5\u7531\u8868\u5355\u8FD9\u4E00\u5C42\u6765\u5B9E\u73B0\uFF01\u5E94\u8BE5\u662F\u903B\u8F91\u5C42\u5B9E\u73B0\u7684\u529F\u80FD\uFF0C\u8FD9\u91CC\u7684\u8868\u5355\u53EA\u8981\u7B28\u7B28\u7684\u5C31\u884C\u4E86"),
            React.createElement("pre", null,
                React.createElement("code", null,
                    "data:",
                    this.props['form'].random && JSON.stringify(this.props['form'].random.values, null, "\t"))));
    };
    return App;
}(React.Component));
App = __decorate([
    react_redux_1.connect(function (store) { return store; })
], App);
var muiTheme = getMuiTheme_1.default({});
ReactDOM.render(React.createElement(styles_1.MuiThemeProvider, { muiTheme: muiTheme },
    React.createElement(react_redux_1.Provider, { store: store },
        React.createElement(App, null))), document.getElementById('root'));
//# sourceMappingURL=example.js.map