"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var theme_test_1 = require("../../__test__/theme-test");
var React = require("react");
theme_test_1.testTheme("ant.design theme", function () {
    window['matchMedia'] = function () { return ({
        matches: true
    }); };
    require("../index");
}, (function (_super) {
    tslib_1.__extends(Root, _super);
    function Root() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Root.prototype.render = function () {
        return React.createElement("div", null, this.props.children);
    };
    return Root;
}(React.PureComponent)));
//# sourceMappingURL=antd.spec.js.map