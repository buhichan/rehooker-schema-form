import * as React from 'react';
import * as ReactDOM from 'react-dom';
import "../dist/antd";
const { createForm, SchemaForm,SubmissionError } = require('../dist/index')
import { schema,schema2 } from "./schema-example";
require("antd/dist/antd.css");
require("../styles/antd-components.css");

const form = createForm({
    validator:(v:any)=>{
        return {
            '1':! v[1] ? "必填" : ""
        }
    },
    validationDelay:1000
})

class App extends React.PureComponent<any,any>{
    state={
        data:{
            "1": "宕机",
            "2": "误告1",
        }
    }
    onSubmit=async (values:any)=>{
        console.log(values)
        this.setState({
            data:values
        })
        throw new SubmissionError({
            1:values[1] !== "宕机" ? "必须是宕机" : "",
            2:values[2] !== "宕机2" ? "必须是宕机2" : "",
        })
    };
    render(){
        return <div style={{padding:15}}>
            <SchemaForm form={form} initialValues={this.state.data} schema={schema2} onSubmit={this.onSubmit} />
            <p>诸如数据schema发生变化的需求，不应该由表单这一层来实现！应该是逻辑层实现的功能，这里的表单只要笨笨的就行了</p>
            <pre>
                <code>
                data:{
                    JSON.stringify(this.state.data,null,"\t")
                }
                </code>
            </pre>

        </div>
    }
}

ReactDOM.render(
    <App />,
    document.getElementById('root')
);