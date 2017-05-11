import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { Provider,connect } from 'react-redux'
import {createStore, combineReducers, applyMiddleware, compose} from 'redux'
import { reducer as reduxFormReducer } from 'redux-form'
import "../src/material"
import {FormFieldSchema, ReduxSchemaForm} from "../src/form"
import {MuiThemeProvider} from "material-ui/styles";
import getMuiTheme from "material-ui/styles/getMuiTheme";

require('react-tap-event-plugin')();

let schema:FormFieldSchema[] = [
    {
        key:"text",
        type:"text",
        placeholder:"input something",
        label:"文本属性"
    },
    {
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
        onChange:(value,prevValue,formData)=>{
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
        key:"file",
        type:"file",
        label:"文件"
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
                key:"width",
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
            },
            {
                type:"datetime-local",
                key:"nested[1]",
                label:"日期时间"
            }
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
        onChange:(value):any=>{
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
        onChange:(value):any=>{
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
    }
];

const reducer = combineReducers({
    data:(state,action)=>{
        if(!state) return {
            text:2
        };
        else return state
    },
    formSchema: function(state,action){
        if(!state) return schema;
        else return state
    },
    form: function(...args){
        return reduxFormReducer.apply(null,args);
    }
});

const composeEnhancers = window['__REDUX_DEVTOOLS_EXTENSION_COMPOSE__'] || compose;
const middleware = composeEnhancers(applyMiddleware());
const store = createStore(reducer,{},middleware);

@connect(
    store=>store
)
class App extends React.Component<any,any>{
    render(){
        return <ReduxSchemaForm form="random" initialValues={this.props.data} schema={this.props['formSchema']} onSubmit={(values)=>{
            if(values.text){
                return new Promise(resolve=>{
                    setTimeout(resolve,3000)
                })
            }else return true;
        }}>
            <p>诸如数据schema发生变化的需求，不应该由表单这一层来实现！应该是逻辑层实现的功能，这里的表单只要笨笨的就行了</p>
            <pre>
                <code>
                data:{
                    this.props['form'].random && JSON.stringify(this.props['form'].random.values,null,"\t")
                }
                </code>
            </pre>
        </ReduxSchemaForm>
    }
}

const muiTheme = getMuiTheme({});

ReactDOM.render(
    <MuiThemeProvider muiTheme={muiTheme}>
        <Provider store={store}>
                <App />
        </Provider>
    </MuiThemeProvider>,
    document.getElementById('root')
);