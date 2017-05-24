
import {MuiTheme} from "material-ui/styles";

/**-----------------------------------Form-----------------------------------**/
export const stylesheet = {
  form: {
    position:"relative",
    "&:after":{
      content:"\" \"",
      display:"table",
      clear:"both"
    },
    "& *":{
      boxSizing:"border-box",
    },
    "&>.redux-schema-form": {
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
      "&:after": {
        display: "table",
        content: "",
        clear: "both"
      },
      "&>div": {
        float: "left",
        paddingRight: "10%",
        paddingLeft: "10%",
        width: "50%",
        minHeight: 99,
      },
      "@media(max-width:768px)": {
        "&>div":{
          width: "100%"
        },
      },
      "&>div.children, &>div.button": {
        textAlign:"center",
        float: "left",
        paddingRight:"initial",
        paddingLeft:"initial",
        width: "100%",
        margin: "20px 0 0",
        minHeight: "initial"
      },
      "&div.checkbox": {
        height: "78px",
      },
      "& div.group, & div.array, & div.rich-editor": {
        width: "100%",
      },
      "& fieldset>div:nth-child(2n+1)": {
        float: "right",
        width: "50%",
        padding: " 0 5% 0 calc(10% + 15px)",
      },
      "& fieldset>div:nth-child(2n)": {
        float: "left",
        width: "50%",
        padding: " 0 calc(10% + 15px) 0 5%",
      },
      "&>div>fieldset": {
        "&>legend": {
          position: "relative",
          top: "11px",
          marginLeft: " 5%",
          borderBottom: "none",
          display: "inline-block",
          width: "auto",
          borderTop: ({muiTheme})=>`3px solid ${muiTheme.palette.primary1Color}`
        },
        margin: " 40px calc(5% - 7.5px)",
        padding: " 0 7.5px",
        background: "#f9f9fa",
        border: "none",
        "& div.group,& div.array,& div.rich-editor": {
          padding: " 0 5%",
        }
      },
    }
  }
};