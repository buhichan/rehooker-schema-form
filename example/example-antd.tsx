import * as React from 'react'
import * as ReactDOM from 'react-dom'
import "../src/antd"
require("antd/dist/antd.css");
require("../src/antd/antd-components.css");
import {schema} from "./schema-example"
import { createForm, SchemaForm } from '../src/form';

const form = createForm()

form.stream.subscribe(console.log)

class App extends React.PureComponent<any,any>{
    data={
        state:2,
        "dependant_lv1": "animal",
        "dependant_lv2": "dog",
        "select": "pear",
        select1:0
    };
    onSubmit=async (values:any)=>{
        console.log(values)
        await new Promise(resolve=>{
            setTimeout(resolve,3000)
        })
    };
    render(){
        return <div style={{padding:15}}>
            <SchemaForm form={form} initialValues={this.data} schema={schema} onSubmit={this.onSubmit} />
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
    <App />,
    document.getElementById('root')
);