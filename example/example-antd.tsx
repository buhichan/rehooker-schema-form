import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { Provider,connect } from 'react-redux'
if(typeof fetch === 'undefined')
    require('isomorphic-fetch')
import {createStore, combineReducers, applyMiddleware, compose} from 'redux'
import { reducer as reduxFormReducer } from 'redux-form'
import "../src/antd"
require("antd/dist/antd.css");
import {FormFieldSchema, ReduxSchemaForm} from "../"
import {schema} from "./schema-example"

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
        "select": "pear",
        select1:0
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
            {/*{# redux-form #}*/}
            <ReduxSchemaForm form="random" initialValues={this.data} schema={schema} onSubmit={this.onSubmit} />
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