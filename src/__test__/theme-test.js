"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
window['requestAnimationFrame'] = function (callback) {
    setTimeout(callback, 0);
};
var __1 = require("../..");
require("jest");
var redux_1 = require("redux");
var redux_form_1 = require("redux-form");
var test_utils_1 = require("react-dom/test-utils");
var React = require("react");
var field_1 = require("../field");
var PropTypes = require("prop-types");
function describeTestWithStore(Container, schema, initialValues, expectation) {
    var reducer = redux_1.combineReducers({
        form: redux_form_1.reducer
    });
    var store = redux_1.createStore(reducer, {
        form: {}
    });
    var Form = (function (_super) {
        tslib_1.__extends(Form, _super);
        function Form() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Form.prototype.getChildContext = function () {
            return {
                store: store
            };
        };
        Form.prototype.render = function () {
            var ReduxSchemaFormWithStore = __1.ReduxSchemaForm;
            return React.createElement(ReduxSchemaFormWithStore, { form: "default", schema: schema, initialValues: initialValues });
        };
        Form.childContextTypes = {
            store: PropTypes.object
        };
        return Form;
    }(React.PureComponent));
    var wrapper = test_utils_1.renderIntoDocument(React.createElement(Container, null,
        React.createElement(Form, null)));
    expectation(wrapper, function () { return redux_form_1.getFormValues("default")(store.getState()); }, store);
}
exports.testTheme = function (themeName, loadTheme, container) {
    describe("Theme: " + themeName, function () {
        field_1.clearTypes();
        loadTheme();
        test("Expect 'text' type to be defined", function () {
            //findRenderedComponentWithType does not work with Stateless Component
            var TextInput = field_1.getType("text");
            expect(!!TextInput).toBeTruthy();
        });
        describeTestWithStore(container, [
            {
                key: "text1",
                label: "Text",
                type: "text"
            }, {
                key: "text2",
                label: "Text2",
                type: "text",
                hide: true,
                listens: {
                    text1: function (v) { return ({
                        hide: v !== 'b'
                    }); }
                }
            }
        ], {
            text1: "a"
        }, function (wrapper, getFormValues) {
            var TextInput = field_1.getType("text");
            var elements = test_utils_1.scryRenderedDOMComponentsWithTag(wrapper, "input");
            test("Expect 1 and only 1 'text' type Component to be shown", function () {
                expect(elements.length).toBe(1);
            });
            var text1 = elements[0], text2 = elements[1];
            test("Expect 'text' type Component to be initialized", function () {
                expect(text1.value).toBe('a');
            });
            test("Expect form state to be initialized", function () {
                expect(getFormValues().text1).toBe('a');
            });
            test("Expect form state to updated", function () {
                text1.value = "b";
                test_utils_1.Simulate.change(text1, {});
                expect(getFormValues().text1).toBe('b');
            });
            test("Expect listening field to be updated by listened field", function () {
                text1.value = "b";
                test_utils_1.Simulate.change(text1, {});
                expect(getFormValues().text1).toBe('b');
            });
            test("Expect the second 'text' type Component to be rendered now", function () {
                var elements = test_utils_1.scryRenderedDOMComponentsWithTag(wrapper, "input");
                expect(elements.length).toBe(2);
            });
        });
    });
};
//# sourceMappingURL=theme-test.js.map