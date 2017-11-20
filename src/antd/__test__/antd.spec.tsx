import { removeListener } from 'cluster';
import { testTheme } from "../../__test__/theme-test";
import * as React from 'react';

testTheme("ant.design theme",()=>{
    window['matchMedia'] = ()=>({
        matches:true
    }) as any
    require("../index")
},class Root extends React.PureComponent<any,any>{
    render(){
        return <div>
            {this.props.children}
        </div>
    }
})