//https://github.com/facebook/jest/issues/4545

import getMuiTheme from "material-ui/styles/getMuiTheme"
import * as React from "react"
import { getType } from "../../field";
import { testTheme } from "../../__test__/theme-test";
import * as PropTypes from "prop-types"

class Container extends React.PureComponent<any,any>{
    getChildContext(){
        return {
            muiTheme:getMuiTheme()
        }
    }
    static childContextTypes = {
        muiTheme: PropTypes.object
    }
    render(){
        return <div>
            {this.props.children}
        </div>
    }
}

const emptyFunc = ()=>{}
const randomStr = "feaf"
const muiTheme = getMuiTheme()

testTheme("material-ui-theme",()=>{
    require("../index")
},Container)