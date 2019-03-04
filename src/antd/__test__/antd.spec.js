import * as tslib_1 from "tslib";
import { testTheme } from "../../__test__/theme-test";
import * as React from 'react';
testTheme("ant.design theme", function () {
    window['matchMedia'] = function () { return ({
        matches: true
    }); };
    require("../index");
}, /** @class */ (function (_super) {
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