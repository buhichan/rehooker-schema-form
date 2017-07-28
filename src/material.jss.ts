/**-----------------------------------Form-----------------------------------**/

const FullWidthInputs = "& .field.group,& .field.array,& .field.rich-editor, & .field.textarea";
const widgetHeight = 85;
const mobileMedia = "@media(max-width:768px)";
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
        width:"calc(50% - 20px)"
      },
      "& .add-button":{
        textAlign:"center",
        marginBottom:10,
        width:"100%"
      },
      "& .delete-button":{
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
    [FullWidthInputs]: {
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
    "& fieldset>.schema-node>div:nth-child(2n)": {
      float: "right",
      width: "50%",
      padding: " 0 5% 0 calc(10% + 15px)",
    },
    "& fieldset>.schema-node>div:nth-child(2n+1)": {
      float: "left",
      width: "50%",
      padding: " 0 calc(10% + 15px) 0 5%",
    },
    "&>form>.schema-node>.field>fieldset": {
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
      [FullWidthInputs]: {
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