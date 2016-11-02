import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { Provider,connect } from 'react-redux'
import { createStore, combineReducers } from 'redux'
import { reducer as reduxFormReducer } from 'redux-form'

import {ReduxSchemaForm} from "../src/form"

let schema = [
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
        ]
    },{
        key:"checkbox",
        type:"checkbox",
        label:"勾选",
        required:true
        // },{
        //     key:"mulSel",
        //     type:"multiSelect",
        //     label:"多选",
        //     options:[
        //         {
        //             name:"苹果",
        //             value:"apple"
        //         },
        //         {
        //             name:"梨子",
        //             value:"pear"
        //         }
        //     ]
    },{
        key:"file",
        type:"file",
        label:"文件"
    },{
        key:"ajax_select",
        type:"select",
        label:"单选(async)",
        options:"/example/options.json"
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
        label:"当单选框为梨子的时候，隐藏",
        relation:(formData,schema)=>{
            schema.hide = formData.select === 'pear';
            return schema;
        }
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
                type:"datetime",
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
    },{
        key:"dependant_lv2",
        type:"select",
        label:"有依赖的单选lv2",
        relation:(formValue,schema)=>{
            if(formValue['depandant_lv1']=="animal"){
                schema.hide = false;
                schema.options = [
                    {
                        name: "狗",
                        value: "dog"
                    }, {
                        name: "猫",
                        value: "cat"
                    }
                ]
            }else if(formValue['depandant_lv1']=="plant") {
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
            else{
                schema.options = [];
                schema.hide = true;
            }
            return schema;
        },
        options:[],
        hide:true
    },{
        key:"dependant_lv3",
        type:"select",
        label:"有依赖的单选lv3",
        options:[],
        hide:true,
        relation:(formValue,schema)=>{
            if(formValue['depandant_lv1']=="animal"){
                if(formValue['dependant_lv2']=="dog"){
                    schema.hide = false;
                    schema.options = [{name:'dogg1',value:"doggy"}, {name:'doggy',value:'doggy'}, {name:'puppy',value:'puppy'}]
                }else if(formValue['dependant_lv2']=='cat'){
                    schema.hide = false;
                    schema.options = [{name:'kitten',value:'kitten'}, {name:'cat',value:'cat'}, {name:'kitty',value:'kitty'}]
                }else{
                    schema.options = [];
                    schema.hide = true;
                }
            }else {
                schema.options = [];
                schema.hide = true;
            }
            return schema;
        }
    }
];

const reducer = combineReducers({
    data:(state,action)=>{
        if(!state) return {};
        else return state
    },
    formSchema: function(state,action){
        if(!state) return schema;
        else return state
    },
    form: function(...args){
        return reduxFormReducer.apply(null,args);
    } // mounted under "form"
});
const store = createStore(reducer);

@connect(
    store=>store
)
class App extends React.Component<any,any>{
    render(){
        return <ReduxSchemaForm form="random" schema={this.props.formSchema} data={this.props.data} onSubmit={console.log}>
            <pre>data:{
                this.props.form.random && JSON.stringify(this.props.form.random.values,null,"\t")
            }</pre>
        </ReduxSchemaForm>
    }
}

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('root')
);