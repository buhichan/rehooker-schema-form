import * as tslib_1 from "tslib";
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider, connect } from 'react-redux';
if (typeof fetch === 'undefined')
    require('isomorphic-fetch');
import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import { reducer as reduxFormReducer } from 'redux-form';
import "../src/antd";
require("antd/dist/antd.css");
import { ReduxSchemaForm, injectSubmittable } from "../";
import { schema } from "./schema-example";
var reducer = combineReducers({
    form: reduxFormReducer
});
var composeEnhancers = window['__REDUX_DEVTOOLS_EXTENSION_COMPOSE__'] || compose;
var middleware = composeEnhancers(applyMiddleware());
var store = createStore(reducer, {}, middleware);
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
        _this.onSubmit = function (values) {
            if (values.text) {
                return new Promise(function (resolve) {
                    setTimeout(resolve, 3000);
                });
            }
            else
                return true;
        };
        return _this;
    }
    App.prototype.render = function () {
        return React.createElement("div", null,
            React.createElement(ReduxSchemaForm, { form: "random", initialValues: this.data, schema: schema, onSubmit: this.onSubmit }),
            React.createElement(Button, { formName: "random" }, "CustomSubmitButton"),
            React.createElement("p", null, "\u8BF8\u5982\u6570\u636Eschema\u53D1\u751F\u53D8\u5316\u7684\u9700\u6C42\uFF0C\u4E0D\u5E94\u8BE5\u7531\u8868\u5355\u8FD9\u4E00\u5C42\u6765\u5B9E\u73B0\uFF01\u5E94\u8BE5\u662F\u903B\u8F91\u5C42\u5B9E\u73B0\u7684\u529F\u80FD\uFF0C\u8FD9\u91CC\u7684\u8868\u5355\u53EA\u8981\u7B28\u7B28\u7684\u5C31\u884C\u4E86"),
            React.createElement("pre", null,
                React.createElement("code", null,
                    "data:",
                    JSON.stringify(this.props.values, null, "\t"))));
    };
    App = tslib_1.__decorate([
        connect(function (store) { return ({
            values: store.form.random ? store.form.random.values : {}
        }); })
    ], App);
    return App;
}(React.PureComponent));
var Button = injectSubmittable({ formName: "1", type: "submit" })(function (_a) {
    var props = _a.props, children = _a.children;
    return React.createElement("button", tslib_1.__assign({}, props), children);
});
ReactDOM.render(React.createElement(Provider, { store: store },
    React.createElement(App, null)), document.getElementById('root'));
//# sourceMappingURL=example-antd.js.map