"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var React = require("react");
var ReactDOM = require("react-dom");
require("../src/antd");
require("antd/dist/antd.css");
require("../src/antd/antd-components.css");
var schema_example_1 = require("./schema-example");
var form_1 = require("../src/form");
var form = form_1.createForm();
form.stream.subscribe(console.log);
var App = /** @class */ (function (_super) {
    tslib_1.__extends(App, _super);
    function App() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.data = {
            state: 2,
            "dependant_lv1": "animal",
            "dependant_lv2": "dog",
            "select": "pear",
            select1: 0
        };
        _this.onSubmit = function (values) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log(values);
                        return [4 /*yield*/, new Promise(function (resolve) {
                                setTimeout(resolve, 3000);
                            })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); };
        return _this;
    }
    App.prototype.render = function () {
        return React.createElement("div", { style: { padding: 15 } },
            React.createElement(form_1.SchemaForm, { form: form, initialValues: this.data, schema: schema_example_1.schema, onSubmit: this.onSubmit }),
            React.createElement("p", null, "\u8BF8\u5982\u6570\u636Eschema\u53D1\u751F\u53D8\u5316\u7684\u9700\u6C42\uFF0C\u4E0D\u5E94\u8BE5\u7531\u8868\u5355\u8FD9\u4E00\u5C42\u6765\u5B9E\u73B0\uFF01\u5E94\u8BE5\u662F\u903B\u8F91\u5C42\u5B9E\u73B0\u7684\u529F\u80FD\uFF0C\u8FD9\u91CC\u7684\u8868\u5355\u53EA\u8981\u7B28\u7B28\u7684\u5C31\u884C\u4E86"),
            React.createElement("pre", null,
                React.createElement("code", null,
                    "data:",
                    JSON.stringify(this.props.values, null, "\t"))));
    };
    return App;
}(React.PureComponent));
ReactDOM.render(React.createElement(App, null), document.getElementById('root'));
//# sourceMappingURL=example-antd.js.map