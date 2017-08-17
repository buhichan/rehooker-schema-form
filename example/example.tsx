import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { Provider,connect } from 'react-redux'
import {createStore, combineReducers, applyMiddleware, compose} from 'redux'
import { reducer as reduxFormReducer } from 'redux-form'
import "../src/material"
import {FormFieldSchema, ReduxSchemaForm} from "../"
import {MuiThemeProvider} from "material-ui/styles";
import getMuiTheme from "material-ui/styles/getMuiTheme";
import {WidgetProps} from "../src/field";
require('react-tap-event-plugin')();

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
        onFileChange(file){
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
            select:(v)=>({hide:v==='pear'})
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
            select:v=>{
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
                return Promise.resolve(new Array(100).fill(0).map((_,i)=>({name:String(i),value:"value-"+i})));
            else return [{name:"0",value:0}];
        }
    }
];

const reducer = combineReducers({
    form: function(...args){
        return reduxFormReducer.apply(null,args);
    }
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
        "select": "pear",
        "dynamic-array-alter":[
            {
                "array-child":1
            },{
                "array-child":""
            }
        ]
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
            <ReduxSchemaForm form="random" initialValues={this.data} schema={schema} onSubmit={this.onSubmit} />
            <p>诸如数据schema发生变化的需求，最好不由表单这一层来实现.应该是逻辑层实现的功能，这里的表单只要笨笨的就行了.但是为了方便,还是加了listens这个API.</p>
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

const muiTheme = getMuiTheme({
    palette:{
        primary1Color:"#885543"
    }
});

ReactDOM.render(
    <MuiThemeProvider muiTheme={muiTheme}>
        <Provider store={store}>
                <App />
        </Provider>
    </MuiThemeProvider>,
    document.getElementById('root')
);