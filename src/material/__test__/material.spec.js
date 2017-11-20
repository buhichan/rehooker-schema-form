"use strict";
//https://github.com/facebook/jest/issues/4545
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var getMuiTheme_1 = require("material-ui/styles/getMuiTheme");
var React = require("react");
var theme_test_1 = require("../../__test__/theme-test");
var PropTypes = require("prop-types");
var Container = (function (_super) {
    tslib_1.__extends(Container, _super);
    function Container() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Container.prototype.getChildContext = function () {
        return {
            muiTheme: getMuiTheme_1.default()
        };
    };
    Container.prototype.render = function () {
        return React.createElement("div", null, this.props.children);
    };
    Container.childContextTypes = {
        muiTheme: PropTypes.object
    };
    return Container;
}(React.PureComponent));
var emptyFunc = function () { };
var randomStr = "feaf";
var muiTheme = getMuiTheme_1.default();
theme_test_1.testTheme("material-ui-theme", function () {
    require("../index");
}, Container);
//# sourceMappingURL=material.spec.js.map