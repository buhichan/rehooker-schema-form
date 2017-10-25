"use strict";
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var React = require("react");
exports.schema = [
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
        key: 'select1',
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
            select1: function (v, formValue) { return ({ hide: v === 'pear', value: null }); }
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
                fullWidth: true,
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
            select1: function (v) {
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
                        //keyPaht = 'dynamic-array-alter[0,1,2,....]'
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
                return new Promise(function (resolve) {
                    setTimeout(function () { return resolve(new Array(100).fill(0).map(function (_, i) { return ({ name: String(i), value: "value-" + i }); })); }, 1000);
                });
            else
                return [{ name: "0", value: 0 }];
        }
    }, {
        key: "radioGroup",
        type: "radioGroup",
        label: "radioGroup",
        options: function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, [
                        { name: "yes", value: true },
                        { name: "no", value: false },
                    ]];
            });
        }); }
    }, {
        key: "radio",
        type: "radio",
        label: "radio",
        options: function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, [
                        { name: "single option", value: true }
                    ]];
            });
        }); }
    }
];
//# sourceMappingURL=schema-example.js.map