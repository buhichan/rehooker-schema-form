"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var React = require("react");
var ResolveMaybePromise = /** @class */ (function (_super) {
    tslib_1.__extends(ResolveMaybePromise, _super);
    function ResolveMaybePromise() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.state = {
            maybePromise: null
        };
        _this.unmounted = false;
        return _this;
    }
    ResolveMaybePromise.prototype.loadOptions = function (rawOptions) {
        var _this = this;
        if (typeof rawOptions === 'function') {
            if (!rawOptions.length)
                rawOptions().then(function (maybePromise) { return !_this.unmounted && _this.setState({
                    maybePromise: maybePromise
                }); });
        }
        else if (rawOptions instanceof Array)
            this.setState({
                maybePromise: rawOptions
            });
    };
    ResolveMaybePromise.prototype.componentDidUpdate = function (prevProps) {
        if (prevProps.maybePromise !== this.props.maybePromise && this.props.maybePromise instanceof Function)
            this.loadOptions(this.props.maybePromise);
    };
    ResolveMaybePromise.prototype.componentWillUnmount = function () {
        this.unmounted = true;
    };
    ResolveMaybePromise.prototype.componentDidMount = function () {
        this.loadOptions(this.props.maybePromise);
    };
    ResolveMaybePromise.prototype.render = function () {
        return this.props.children(this.state.maybePromise);
    };
    return ResolveMaybePromise;
}(React.PureComponent));
exports.ResolveMaybePromise = ResolveMaybePromise;
//# sourceMappingURL=resolve-maybe-promise.js.map