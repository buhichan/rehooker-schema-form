import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { Provider,connect } from 'react-redux'
import {createStore, combineReducers, applyMiddleware, compose} from 'redux'
import { reducer as reduxFormReducer } from 'redux-form'
import "../src/antd"
require("antd/dist/antd.css");
import {FormFieldSchema, ReduxSchemaForm} from "../"

let schema:FormFieldSchema[] = [
    {
        key:"text",
        type:"text",
        placeholder:"input something",
        label:"文本属性",
        validate:v=>{
            if(v!=="a")
                return "必须是a"
        }
    },{
        key:'select',
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
        ],
        onValueChange:(value)=>{
            if(value==='pear')
                return [
                    {
                        key:"conditional1",
                        hide:true
                    }
                ];
            else return Promise.resolve([
                {
                    key:"conditional1",
                    hide:false
                }
            ])
        }
    },{
        key:"checkbox",
        type:"checkbox",
        label:"勾选",
        required:true,
        onValueChange(v){
            return [
                {key:"phone",hide:Boolean(v)}
            ]
        }
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
        action:"//jsonplaceholder.typicode.com/posts/"
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
                label:"手机号"
            }
        ]
    },{
        key:"conditional1",
        type:"text",
        label:"当单选框为梨子的时候，隐藏"
    },{
        key:"nest.1",
        type:"text",
        label:"nest"
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
        ],
        onValueChange:(value)=>{
            if(value ==='animal'){
                return [
                    {
                        key:"dependant_lv2",
                        hide:false,
                        value:null,
                        options:[
                            {
                                name: "狗",
                                value: "dog"
                            }, {
                                name: "猫",
                                value: "cat"
                            }
                        ]
                    },{
                        key:"dependant_lv3",
                        hide:true,
                        value:null
                    }
                ]
            }else if(value ==='plant'){
                return [
                    {
                        key:"dependant_lv2",
                        hide:false,
                        value:null,
                        options:[
                            {
                                name: "苹果",
                                value: "apple"
                            },
                            {
                                name: "梨子",
                                value: "pear"
                            }
                        ]
                    },{
                        key:"dependant_lv3",
                        hide:true,
                        value:null
                    }
                ]
            }else{
                return [
                    {
                        key:"dependant_lv2",
                        hide:true,
                        value:null
                    },{
                        key:"dependant_lv3",
                        hide:true,
                        value:null
                    }
                ]
            }
        }
    },{
        key:"dependant_lv2",
        type:"select",
        label:"有依赖的单选lv2",
        onValueChange:(value):any=>{
            if(value ==='dog'){
                return [
                    {
                        key:"dependant_lv3",
                        hide:false,
                        value:null,
                        options:[{name:'dogg1',value:"dogg1"}, {name:'doggy',value:'doggy'}, {name:'puppy',value:'puppy'}]
                    }
                ]
            }else if(value ==='cat'){
                return [
                    {
                        key:"dependant_lv3",
                        hide:false,
                        value:null,
                        options:[{name:'kitten',value:'kitten'}, {name:'cat',value:'cat'}, {name:'kitty',value:'kitty'}]
                    }
                ]
            }else{
                return [
                    {
                        key:"dependant_lv3",
                        hide:true,
                        value:null
                    }
                ]
            }
        },
        options:[],
        hide:true
    },{
        key:"dependant_lv3",
        type:"select",
        label:"有依赖的单选lv3",
        options:[],
        hide:true
    },{
        key:"array",
        type:"array",
        label:"Array",
        children:[
            {
                key:"array-child",
                label:"array-child",
                type:"text"
            }
        ]
    },{
        key:"dynamic-array-alter",
        type:"array",
        label:"dynamic-array(使用onValueChange)",
        children:[
            {
                key:"array-child",
                label:"array-child",
                type:"text",
                onValueChange(v){
                    console.log(arguments);
                    return v&&isFinite(v)?[
                        {
                            key:"currency",
                            hide:false
                        }
                    ]:[
                        {
                            key:"currency",
                            hide:true
                        }
                    ]
                }
            },
            {
                key:"currency",
                label:"currency",
                type:"text",
                hide:true
            }
        ]
    },{
        key:"dynamic-array",
        type:"array",
        label:"dynamic-array（使用getChildren）",
        getChildren:v=>{
            return [
                {
                    key:"array-child",
                    label:"array-child",
                    type:"text"
                },
                v&&isFinite(v['array-child'])?{
                    key:"currency",
                    label:"currency",
                    type:"text"
                }:null
            ]
        }
    },{
        key:"autocomplete",
        type:"autocomplete-async",
        label:"自动完成",
        options:t=>{
            if(/^\d+$/.test(t))
                return Promise.resolve(new Array(100).fill(0).map((_,i)=>({name:String(i),value:"value-"+i})));
            else return [{name:"0",value:0}];
        }
    },{
        key:"dateRange",
        type:"dateRange",
        label:"时间段",
    },{
        key:"texteara",
        type:"textarea",
        label:"文本域"
    },{
        key:"autocompleteText",
        type:"autocomplete-text",
        label:"AutoComplete-Text",
        options:new Array(100).fill(0).map((_,i)=>({name:String(i),value:"value-"+i}))
    }

];

const reducer = combineReducers({
    form:reduxFormReducer

});

const composeEnhancers = window['__REDUX_DEVTOOLS_EXTENSION_COMPOSE__'] || compose;
const middleware = composeEnhancers(applyMiddleware());
const store = createStore(reducer,{},middleware);


@(connect as any)(
    store=>({
        values:store.form.random?store.form.random.values:{}
    })
)
class App extends React.PureComponent<any,any>{
    data={
        state:2,
        "dependant_lv1": "animal",
        "dependant_lv2": "dog",
        "select": "pear"
    };
    onSubmit=(values)=>{
        if(values.text){
            return new Promise(resolve=>{
                setTimeout(resolve,3000)
            })
        }else return true;
    };
    render(){
        return <div>
            <ReduxSchemaForm form="random" initialValues={this.data} schema={schema} onSubmit={this.onSubmit}>
            </ReduxSchemaForm>
            <p>诸如数据schema发生变化的需求，不应该由表单这一层来实现！应该是逻辑层实现的功能，这里的表单只要笨笨的就行了</p>
            <pre>
                <code>
                data:{
                    JSON.stringify(this.props.values,null,"\t")
                }
                </code>
            </pre>

        </div>
    }
}

ReactDOM.render(
        <Provider store={store}>
            <App />
        </Provider>,
    document.getElementById('root')
);