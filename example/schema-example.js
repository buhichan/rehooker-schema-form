"use strict";
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var React = require("react");
var arrayFieldChildren = [
    {
        key: "array-child",
        label: "嵌套字段#1",
        type: "text"
    },
    {
        key: "currency",
        label: "货币",
        type: "text",
        hide: true,
        listens: function (keyPath) {
            return _a = {},
                //keyPath = 'dynamic-array-alter[0,1,2,....]'
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
];
exports.schema = [
    {
        key: "text",
        type: "text",
        placeholder: "一般的文本,带验证",
        label: "文本属性",
        validate: function (v) {
            if (v !== "a")
                return "必须是a";
        }
    }, {
        key: 'select1',
        type: "select",
        label: "单选",
        placeholder: "一般的单选",
        options: [
            {
                name: "苹果",
                value: "apple"
            },
            {
                name: "梨子",
                value: "pear"
            }, {
                name: "哈哈",
                value: 0
            }
        ]
    }, {
        key: "checkbox",
        type: "checkbox",
        label: "勾选",
        placeholder: "一般的checkbox",
        required: true,
        disabled: true
    }, {
        key: "mulSel",
        type: "select",
        multiple: true,
        placeholder: "一般的多选",
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
        placeholder: "placeholder",
        listens: {
            text: function (v) { return ({
                placeholder: v
            }); }
        }
    }, {
        key: "datetime",
        type: "datetime",
        label: "datetime",
        listens: {
            text: function (v) { return ({
                placeholder: v
            }); }
        }
    }, {
        key: "fileIsMultiple",
        type: "checkbox",
        label: "file input is multiple"
    }, {
        key: "file",
        type: "file",
        label: "文件",
        multiple: true,
        placeholder: "placeholder",
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
        },
        listens: {
            fileIsMultiple: function (multiple) { return ({ multiple: multiple }); }
        }
    }, {
        key: "file-file",
        type: "file",
        label: "文件(不上传) (single)",
        multiple: false,
        parse: function (fileList) {
            if (fileList && fileList.length > 1)
                return [fileList[1]];
            return fileList;
        },
        placeholder: "placeholder"
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
                placeholder: "placeholder",
                validate: function (v) {
                    if (v > 900)
                        return "最大900";
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
        placeholder: "placeholder",
        listens: {
            select1: function (v, formValue) { return ({ hide: v === 'pear', value: null }); }
        }
    }, {
        key: "nest.1",
        type: "text",
        label: "nest",
        placeholder: "placeholder",
        style: {
            border: "1px dotted #23f0ff"
        }
    }, {
        key: "nest.2",
        type: "group",
        label: "组2",
        placeholder: "placeholder",
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
        placeholder: "placeholder",
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
        placeholder: "placeholder",
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
        placeholder: "placeholder",
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
        itemsPerRow: 6,
        placeholder: "placeholder",
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
        children: arrayFieldChildren
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
        key: "autocomplete1",
        type: "autocomplete",
        label: "自动完成(select)",
        placeholder: "placeholder",
        options: [
            { name: "11", value: "11" },
            { name: "22", value: "22" },
            { name: "33", value: "33" },
            { name: '44', value: "44" },
            { name: "55", value: "55" },
            { name: "76", value: "66" },
            { name: "77", value: "77" },
            { name: "88", value: "88" },
        ]
    },
    {
        key: "autocomplete2",
        type: "autocomplete-async",
        label: "自动完成",
        placeholder: "placeholder",
        options: function (t) {
            if (/^\d+$/.test(t))
                return new Promise(function (resolve) {
                    setTimeout(function () { return resolve(new Array(100).fill(0).map(function (_, i) { return ({ name: String(i), value: "value-" + i }); })); }, 1000);
                });
            else
                return [{ name: "0", value: 0 }];
        }
    }, {
        key: "textarea",
        type: "textarea",
        label: "textarea",
        placeholder: "placeholder"
    }, {
        key: "radio",
        type: "radio",
        label: "radio",
        placeholder: "placeholder",
        options: function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, [
                        { name: "yes", value: true },
                        { name: "no", value: false },
                    ]];
            });
        }); }
    }, {
        key: "multiple-listen",
        label: "多重监听",
        placeholder: "placeholder",
        type: "text",
        listens: {
            'radio,text': function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                console.log(args);
            }
        }
    }, {
        key: "",
        label: "some text",
        type: "virtual-group",
        children: [],
        listens: {
            text: function (v) {
                return {
                    children: [
                        {
                            key: "text",
                            label: v,
                            type: 'text'
                        }
                    ]
                };
            }
        }
    }
    //要用这个必须使用table-array-field, 那个又依赖ag-grid-material-preset,因此去掉
    // {
    //     key:"tableArray",
    //     type:"table-array",
    //     label:"array fiel as table",
    //     children:arrayFieldChildren
    // },
    // {
    //     key:"multi-autocomplete",
    //     type:"multi-autocomplete",
    //     label:"multi-autocomplete",
    //     options:t=>{
    //         if(/^\d+$/.test(t))
    //             return new Promise(resolve=>{
    //                 setTimeout(()=> resolve(new Array(100).fill(0).map((_,i)=>({name:String(i),value:"value-"+i}))), 1000)
    //             });
    //         else return [{name:"0",value:0}];
    //     }
    // }
];
//# sourceMappingURL=schema-example.js.map