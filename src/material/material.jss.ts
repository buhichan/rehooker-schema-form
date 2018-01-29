import { clearfix, widgetHeight, fullWidthInputs, mobileMedia } from '../constants';
import injectJSS from "react-jss"
import muiThemeable from 'material-ui/styles/muiThemeable';
import { pushDecorator } from '../decorate';

/**-----------------------------------Form-----------------------------------**/

const stylesheet = {
  form: {
    position:"relative",
    ...clearfix,
    "& *":{
      boxSizing:"border-box",
    },
    "& .btn-group": {
      "&>button": {
        border: 0,
        borderRadius: 0,
        backgroundColor: ({muiTheme})=>muiTheme.palette.primary1Color,
        color: "white",
        "&:not(:first-child)": {
          marginLeft: 2
        }
      }
    },
    "& .array-field-container":{
      display:"flex",
      flexWrap:"wrap",
      alignItems:"flex-start",
      "& .array-field-child": {
        padding: '10px 0',
        margin: '10px',
        borderTop: ({muiTheme}) => "2px solid " + muiTheme.palette.primary1Color,
        "& .field":{
          width:"100%"
        }
      },
      "& .add-button":{
        textAlign:"center",
        marginBottom:10,
        width:"100%"
      },
      "& .item-buttons":{
        float:"right"
      }
    },
    "&>div:after": {
      display: "table",
      content: "",
      clear: "both"
    },
    "& .field": {
      float: "left",
      paddingRight: "10%",
      paddingLeft: "10%",
      width: "50%",
      height: widgetHeight,
      "&.hidden": {
        display: "none"
      },
    },
    [fullWidthInputs]: {
      width: "100%",
      height:"auto",
      minHeight:widgetHeight
    },
    "& div.children, & div.button": {
      textAlign:"center",
      float: "left",
      paddingRight:"initial",
      paddingLeft:"initial",
      height:"auto",
      width: "100%",
      margin: "20px 0 0",
      minHeight: "initial"
    },
    "& fieldset .field:nth-child(2n)": {
      padding: " 0 5% 0 calc(10% + 15px)",
    },
    "& fieldset .field:nth-child(2n+1)": {
      padding: " 0 calc(10% + 15px) 0 5%",
    },
    "& .file-input":{
      background: "#f9f9fa",
      padding:"5px 0 5px 5%",
      marginBottom:5,
      "& .label":{
        marginBottom:5
      }
    },
    "& .schema-node":clearfix,
    "&>.schema-node>.field>fieldset": {
      "&>legend": {
        position: "relative",
        top: "11px",
        marginLeft: " 5%",
        borderBottom: "none",
        display: "inline-block",
        width: "auto",
        borderTop: ({muiTheme})=>`3px solid ${muiTheme.palette.primary1Color}`
      },
      margin: "40px 0",
      padding: " 0 7.5px",
      background: "#f9f9fa",
      border: "none",
      [fullWidthInputs]: {
        padding: " 0 5%",
      }
    }
  },
  [mobileMedia]: { //fixme: todo: jss but! https://github.com/cssinjs/jss/issues/446
    "form": {
      "& .field, & .array-field-container .array-field-child": {
        width: "100%"
      }
    }
  },
};

pushDecorator(injectJSS(stylesheet))
pushDecorator(muiThemeable())