"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var React = require("react");
var ReactDOM = require("react-dom");
var antd_1 = require("../dist/antd");
var _a = require('../dist/index'), createForm = _a.createForm, SchemaForm = _a.SchemaForm, SubmissionError = _a.SubmissionError;
var schema_example_1 = require("./schema-example");
var config_1 = require("../dist/config");
require("antd/dist/antd.css");
require("../styles/antd-components.css");
var form = createForm({
// validator:(v:any)=>{
//     return {
//         '1':! v[1] ? "必填" : ""
//     }
// },
// validationDelay:1000
});
form.stream.subscribe(function (v) {
    console.log(v);
    if (!v.valid) {
        console.log("???");
    }
});
var App = /** @class */ (function (_super) {
    tslib_1.__extends(App, _super);
    function App() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.state = {
            data: {
                "1": "宕机",
                "2": "误告1",
            }
        };
        _this.onSubmit = function (values) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                console.log(values);
                this.setState({
                    data: values
                });
                throw new SubmissionError({
                    1: values[1] !== "宕机" ? "必须是宕机" : "",
                    2: values[2] !== "宕机2" ? "必须是宕机2" : "",
                });
            });
        }); };
        return _this;
    }
    App.prototype.render = function () {
        return React.createElement(config_1.SchemaFormConfigProvider, { value: antd_1.schemaFormAntdConfig },
            React.createElement("div", { style: { padding: 15 } },
                React.createElement(SchemaForm, { form: form, initialValues: this.state.data, schema: schema_example_1.schema, onSubmit: this.onSubmit }),
                React.createElement("p", null, "\u8BF8\u5982\u6570\u636Eschema\u53D1\u751F\u53D8\u5316\u7684\u9700\u6C42\uFF0C\u4E0D\u5E94\u8BE5\u7531\u8868\u5355\u8FD9\u4E00\u5C42\u6765\u5B9E\u73B0\uFF01\u5E94\u8BE5\u662F\u903B\u8F91\u5C42\u5B9E\u73B0\u7684\u529F\u80FD\uFF0C\u8FD9\u91CC\u7684\u8868\u5355\u53EA\u8981\u7B28\u7B28\u7684\u5C31\u884C\u4E86"),
                React.createElement("pre", null,
                    React.createElement("code", null,
                        "data:",
                        JSON.stringify(this.state.data, null, "\t")))));
    };
    return App;
}(React.PureComponent));
ReactDOM.render(React.createElement(App, null), document.getElementById('root'));
//# sourceMappingURL=example-antd.js.map