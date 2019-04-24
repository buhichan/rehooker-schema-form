import {FormFieldSchema, WidgetProps} from "../src/form";
import * as React from "react"

const arrayFieldChildren:FormFieldSchema[] = [
    {
        key:"array-child",
        label:"嵌套字段#1",
        type:"text"
    },
    {
        key:"currency",
        label:"货币",
        type:"text",
        hide:true,
        listens:[
            {
                to:keyPath=>{
                    return [keyPath+".array-child"]
                },
                then: function ([p]) {
                    console.log(arguments);
                    return {
                        hide:!p
                    }
                }
            }
        ]
    }
]

export let schema:FormFieldSchema[] = [
    {
        key:"text",
        type:"text",
        placeholder:"一般的文本,带验证",
        label:"文本属性",
        validate:v=>{
            if(v!=="a")
                return "必须是a"
            return undefined
        }
    },{
        key:'select1',
        type:"select",
        label:"单选",
        placeholder:"一般的单选",
        required:true,
        options:[
            {
                name:"苹果",
                value:"apple"
            },
            {
                name:"梨子",
                value:"pear"
            },{
                name:"哈哈",
                value:0
            }
        ],
        validate:v=>{
            if(v === 0){
                return "不能是0"
            }
            return null
        }
    },{
        key:'select-long-list',
        type:"select",
        label:"单选",
        mode:"multiple",
        placeholder:"long list single selection",
        maxOptionCount:10,
        options:new Array(2000).fill(0).map((_,i)=>({name:`选项${i}`,value:`option-${i}`}))
    },{
        key:"checkbox",
        type:"checkbox",
        label:"勾选",
        placeholder:"一般的checkbox",
        required:true,
        disabled:true
    },{
        key:"mulSel",
        type:"select",
        multiple:true,
        placeholder:"一般的多选",
        label:"多选",
        options:[
            {
                name:"苹果",
                value:"apple"
            },
            {
                name:"梨子",
                value:"pear"
            }
        ]
    },{
        key:"date",
        type:"date",
        label:"date",
        placeholder:"placeholder",
        listens:[
            {
                to:["text"],
                then:(v)=>({
                    placeholder:v
                })
            }
        ]
    },{
        key:"datetime",
        type:"datetime",
        label:"datetime",
        listens:[
            {
                to:["text"],
                then:(v)=>({
                    placeholder:v
                })
            }
        ]
    },{
        key:"fileIsMultiple",
        type:"checkbox",
        label:"file input is multiple"
    },{
        key:"file",
        type:"file",
        label:"文件",
        multiple:true,
        placeholder:"placeholder",
        validate:(v:File|string)=>{
            if(v instanceof File && !v.type.startsWith('image/'))
                return "只能上传图片"
            return undefined
        },
        onFileChange(_:File){
            return new Promise(r=>{
                setTimeout(()=>{
                    r("/fake/url")
                },3000)
            });
        },
        listens:[{
            to:['fileIsMultiple'],
            then:([multiple])=>({multiple:multiple})
        }]
    },{
        key:"file-file",
        type:"file",
        label:"文件(不上传) (single)",
        multiple:false,
        parse:(fileList)=>{
            if(fileList && fileList.length > 1)
                return [fileList[1]]
            return fileList
        },
        placeholder:"placeholder"
    },{
        key:"ajax_select",
        type:"select",
        label:"单选(async)",
        options:()=>{
            return fetch("options.json").then(res=>res.json())
        }
    },{
        key:"group1",
        type:"group",
        label:"组",
        children:[
            {
                type:"number",
                key:"phone",
                placeholder:"placeholder",
                validate:v=>{
                    if(v>900)
                        return "最大900"
                    return undefined
                },
                label:"手机号",
                listens:[
                    {
                        to:["checkbox"],
                        then:([v])=>({hide:v})
                    }
                ]
            }
        ]
    },{
        key:"conditional1",
        type:"text",
        label:"当单选框为梨子的时候，隐藏",
        placeholder:"placeholder",
        listens:[
            {
                to:["select1"],
                then:([v])=>({hide:v==='pear',value:null})
            }
        ]
    },{
        key:"nest.1",
        type:"text",
        label:"nest",
        placeholder:"placeholder",
        style:{
            border:"1px dotted #23f0ff"
        }
    },{
        key:"nest.2",
        type:"group",
        label:"组2",
        placeholder:"placeholder",
        children:[
            {
                type:'date',
                key:"nested[0]",
                label:"日期"
            },{
                key:"email",
                type:"email",
                fullWidth:true,
                label:"email with validation",
                validate(v){
                    if(!/.*@.*\..*/.test(v))
                        return "not a valid email"
                    return undefined
                }
            },
        ]
    },{
        key:"dependant_lv1",
        type:"select",
        label:"有依赖的单选lv1",
        placeholder:"placeholder",
        options:[
            {
                name:"植物",
                value:"plant"
            },
            {
                name:"动物",
                value:"animal"
            }
        ]
    },{
        key:"dependant_lv2",
        type:"select",
        label:"有依赖的单选lv2",
        placeholder:"placeholder",
        listens:[
            {
                to:["dependant_lv1"],
                then:([v])=>{
                    return{
                        hide:!v,
                        options: v==='animal'?[
                            {
                                name: "狗",
                                value: "dog"
                            }, {
                                name: "猫",
                                value: "cat"
                            }
                        ]:v==='plant'?[
                            {
                                name: "苹果",
                                value: "apple"
                            },
                            {
                                name: "梨子",
                                value: "pear"
                            }
                        ]:[]
                    }
                }
            }
        ],
        options:[],
        hide:true
    },{
        key:"dependant_lv3",
        type:"select",
        label:"有依赖的单选lv3",
        placeholder:"placeholder",
        options:[],
        hide:true,
        listens:[{
            to:["dependant_lv2"],
            then:([v])=>({
                options:v==='cat'?[
                        {name:'kitten',value:'kitten'}, {name:'cat',value:'cat'}, {name:'kitty',value:'kitty'}]:
                    v==='dog'?
                        [{name:'dogg1',value:"dogg1"}, {name:'doggy',value:'doggy'}, {name:'puppy',value:'puppy'}]:
                        [],
                value:null,
                hide:!(v==='cat'||v==='dog')
            })
        }]
    },{
        key:"array",
        type:"array",
        placeholder:"placeholder",
        label:"Array(当select是梨子的时候会少一个child)",
        listens:[
            {
                to:["select1"],
                then:([v])=>{
                    return {
                        children:v==='pear'?[
                            {
                                key:"array-child",
                                label:"array-child",
                                type:"text"
                            }
                        ]:[
                            {
                                key:"array-child",
                                label:"array-child",
                                type:"text"
                            },{
                                key:"haha",
                                label:"dynamic-child",
                                type:"text"
                            }
                        ]
                    }
                }
            },
        ],
        children:[]
    },{
        key:"dynamic-array-alter",
        type:"array",
        label:"dynamic-array(使用listens)",
        children:arrayFieldChildren
    },{
        key:"test-component",
        type:function(props:WidgetProps){
            const {value,onChange,schema} = props;
            return <div>
                <label htmlFor={schema.key} >
                {schema.label}
            <input type="color" value={value} onChange={onChange} />
            </label>
            </div>
        },
        label:"type也可以是组件"
    },
    {
        key:"autocomplete1",
        type:"autocomplete",
        label:"自动完成(select)",
        placeholder:"placeholder",
        maxOptionCount:5,
        options:new Array(100).fill(0).map((_,i)=>({name:String(i),value:String(i)}))
    },
    {
        key:"autocomplete2",
        type:"autocomplete-async",
        label:"自动完成(async options)",
        placeholder:"placeholder",
        options:t=>{
            if(/^\d+$/.test(t))
                return new Promise(resolve=>{
                    setTimeout(()=> resolve(new Array(100).fill(0).map((_,i)=>({name:String(i),value:"value-"+i}))), 1000)
                });
            else return [{name:"0",value:0}];
        }
    },{
        key:"textarea",
        type:"textarea",
        label:"textarea",
        placeholder:"placeholder"
    },{
        key:"radio",
        type:"radio",
        label:"radio",
        placeholder:"placeholder",
        options:async ()=>[
            {name:"yes",value:true},
            {name:"no",value:false},
        ]
    },{
        key:"multiple-listen",
        label:"多重监听",
        placeholder:"placeholder",
        type:"text",
        listens:[{
            to:["radio",'text'],
            then:(props)=>{
                console.log(props)
            }
        }]
    },{
        key:"virtual group, key does not count as key path",
        label:"some text",
        type:"virtual-group",
        children:[],
        listens:[{
            to:["text"],
            then:([v])=>{
                return {
                    children:[
                        {
                            key:"text",
                            label:v,
                            type:'text'
                        }
                    ]
                }
            }
        }]
    }
];