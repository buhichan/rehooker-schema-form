"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
const React = require('react');
const ReactDOM = require('react-dom');
const react_redux_1 = require('react-redux');
const redux_1 = require('redux');
const redux_form_1 = require('redux-form');
const form_1 = require("../src/form");
let schema = [
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
        ]
    }, {
        key: "checkbox",
        type: "checkbox",
        label: "勾选",
        required: true
    }, {
        key: "file",
        type: "file",
        label: "文件"
    }, {
        key: "ajax_select",
        type: "select",
        label: "单选(async)",
        options: "/example/options.json"
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
        label: "当单选框为梨子的时候，隐藏",
        relation: (formData, schema) => {
            schema.hide = formData.select === 'pear';
            return schema;
        }
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
                type: "datetime",
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
    }, {
        key: "dependant_lv2",
        type: "select",
        label: "有依赖的单选lv2",
        relation: (formValue, schema) => {
            if (formValue['depandant_lv1'] == "animal") {
                schema.hide = false;
                schema.options = [
                    {
                        name: "狗",
                        value: "dog"
                    }, {
                        name: "猫",
                        value: "cat"
                    }
                ];
            }
            else if (formValue['depandant_lv1'] == "plant") {
                schema.hide = false;
                schema.options = [
                    {
                        name: "苹果",
                        value: "apple"
                    },
                    {
                        name: "梨子",
                        value: "pear"
                    }
                ];
            }
            else {
                schema.options = [];
                schema.hide = true;
            }
            return schema;
        },
        options: [],
        hide: true
    }, {
        key: "dependant_lv3",
        type: "select",
        label: "有依赖的单选lv3",
        options: [],
        hide: true,
        relation: (formValue, schema) => {
            if (formValue['depandant_lv1'] == "animal") {
                if (formValue['dependant_lv2'] == "dog") {
                    schema.hide = false;
                    schema.options = [{ name: 'dogg1', value: "doggy" }, { name: 'doggy', value: 'doggy' }, { name: 'puppy', value: 'puppy' }];
                }
                else if (formValue['dependant_lv2'] == 'cat') {
                    schema.hide = false;
                    schema.options = [{ name: 'kitten', value: 'kitten' }, { name: 'cat', value: 'cat' }, { name: 'kitty', value: 'kitty' }];
                }
                else {
                    schema.options = [];
                    schema.hide = true;
                }
            }
            else {
                schema.options = [];
                schema.hide = true;
            }
            return schema;
        }
    }
];
const reducer = redux_1.combineReducers({
    data: (state, action) => {
        if (!state)
            return {};
        else
            return state;
    },
    formSchema: function (state, action) {
        if (!state)
            return schema;
        else
            return state;
    },
    form: function (...args) {
        return redux_form_1.reducer.apply(null, args);
    } // mounted under "form"
});
const store = redux_1.createStore(reducer);
let App = class App extends React.Component {
    render() {
        return React.createElement(form_1.ReduxSchemaForm, {form: "random", schema: this.props.formSchema, data: this.props.data, onSubmit: console.log}, React.createElement("pre", null, "data:", this.props.form.random && JSON.stringify(this.props.form.random.values, null, "\t")));
    }
};
App = __decorate([
    react_redux_1.connect(store => store), 
    __metadata('design:paramtypes', [])
], App);
ReactDOM.render(React.createElement(react_redux_1.Provider, {store: store}, React.createElement(App, null)), document.getElementById('root'));
//# sourceMappingURL=example.js.map