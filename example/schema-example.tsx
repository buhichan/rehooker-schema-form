import {FormFieldSchema} from "../src/form";
import {WidgetProps} from "../src/field";
import * as React from "react"
export let schema:FormFieldSchema[] = [
    {
        key:"text",
        type:"text",
        placeholder:"input something",
        parse:v=>(v||"")+"0",
        format:(v="")=>v.substr(0,v.length-1),
        label:"文本属性",
        validate:v=>{
            if(v!=="a")
                return "必须是a"
        }
    },{
        key:'select1',
        type:"select",
        label:"单选",
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
        key:"checkbox",
        type:"checkbox",
        label:"勾选",
        required:true
    },{
        key:"mulSel",
        type:"select",
        multiple:true,
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
    },{
        key:"datetime",
        type:"datetime",
        label:"datetime"
    },{
        key:"file",
        type:"file",
        label:"文件",
        validate:(v:File|string)=>{
            if(v instanceof File && !v.type.startsWith('image/'))
                return "只能上传图片"
        },
        onFileChange(file:File|FileList){
            return new Promise(r=>{
                setTimeout(()=>{
                    r("/fake/url")
                },3000)
            });
        }
    },{
        key:"ajax_select",
        type:"select",
        label:"单选(async)",
        options:()=>{
            return fetch("/example/options.json").then(res=>res.json())
        }
    },{
        key:"group1",
        type:"group",
        label:"组",
        children:[
            {
                type:"number",
                key:"phone",
                validators:{
                    minLength:11,
                    maxLength:14,
                    pattern:/[0-9]+/
                },
                label:"手机号",
                listens:{
                    checkbox:v=>({hide:v})
                }
            }
        ]
    },{
        key:"conditional1",
        type:"text",
        label:"当单选框为梨子的时候，隐藏",
        listens:{
            select1:(v,formValue)=>({hide:v==='pear',value:null})
        }
    },{
        key:"nest.1",
        type:"text",
        label:"nest",
        style:{
            border:"1px dotted #23f0ff"
        }
    },{
        key:"nest.2",
        type:"group",
        label:"组2",
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
                }
            },
        ]
    },{
        key:"dependant_lv1",
        type:"select",
        label:"有依赖的单选lv1",
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
        listens:{
            dependant_lv1:v=>{
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
        },
        options:[],
        hide:true
    },{
        key:"dependant_lv3",
        type:"select",
        label:"有依赖的单选lv3",
        options:[],
        hide:true,
        listens:{
            dependant_lv2:(v)=>({
                options:v==='cat'?[
                        {name:'kitten',value:'kitten'}, {name:'cat',value:'cat'}, {name:'kitty',value:'kitty'}]:
                    v==='dog'?
                        [{name:'dogg1',value:"dogg1"}, {name:'doggy',value:'doggy'}, {name:'puppy',value:'puppy'}]:
                        [],
                value:null,
                hide:!(v==='cat'||v==='dog')
            })
        }
    },{
        key:"array",
        type:"array",
        label:"Array(当select是梨子的时候会少一个child)",
        listens:{
            select1:v=>{
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
        children:[]
    },{
        key:"dynamic-array-alter",
        type:"array",
        label:"dynamic-array(使用listens)",
        children:[
            {
                key:"array-child",
                label:"array-child",
                type:"text"
            },
            {
                key:"currency",
                label:"currency",
                type:"text",
                hide:true,
                listens:(keyPath)=>{
                    return {
                        //keyPaht = 'dynamic-array-alter[0,1,2,....]'
                        [keyPath+".array-child"]: function (v, child) {
                            console.log(arguments);
                            return {
                                hide:!v
                            }
                        }
                    }
                }
            }
        ]
    },{
        key:"test-component",
        type:function(props:WidgetProps){
            const {input,fieldSchema,renderField,meta} = props;
            return <div>
                <label htmlFor={input.name} >
            {fieldSchema.label}
            <input type="color" {...input} />
            </label>
            </div>
        },
        label:"type也可以是组件"
    },
    {
        key:"autocomplete",
        type:"autocomplete-async",
        label:"自动完成",
        options:t=>{
            if(/^\d+$/.test(t))
                return new Promise(resolve=>{
                    setTimeout(()=> resolve(new Array(100).fill(0).map((_,i)=>({name:String(i),value:"value-"+i}))), 5000)
                });
            else return [{name:"0",value:0}];
        }
    },{
        key:"radio",
        type:"radio",
        label:"radio",
        options:async ()=>[
            {name:"yes",value:true},
            {name:"no",value:false},
        ]
    }
];