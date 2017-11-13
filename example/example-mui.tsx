import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { Provider,connect } from 'react-redux'
import {createStore, combineReducers, applyMiddleware, compose} from 'redux'
import { reducer as reduxFormReducer } from 'redux-form'
import "../src/material"
import "../src/material/table-array-field"
import "ag-grid-material-preset/style.css"
import {FormFieldSchema, ReduxSchemaForm} from "../"
import {MuiThemeProvider} from "material-ui/styles";
import getMuiTheme from "material-ui/styles/getMuiTheme";
import {WidgetProps} from "../src/field";
import {schema} from "./schema-example"
import { injectSubmittable } from '../src/buttons';

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
            <InjectedButton />
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

const InjectedButton = injectSubmittable({
    disableResubmit:false,
    type:"submit",
    formName:"random"
})((props)=>{
    return <button {...props} >哈哈</button>
})

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