"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
window['requestAnimationFrame'] = function (callback) {
    setTimeout(callback, 0);
};
require("jest");
var test_utils_1 = require("react-dom/test-utils");
var React = require("react");
var field_1 = require("../field");
var form_1 = require("../form");
function describeTestWithStore(Container, schema, initialValues, expectation) {
    var form = form_1.createForm();
    var Form = /** @class */ (function (_super) {
        tslib_1.__extends(Form, _super);
        function Form() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Form.prototype.render = function () {
            return React.createElement(form_1.SchemaForm, { form: form, schema: schema, initialValues: initialValues });
        };
        return Form;
    }(React.PureComponent));
    var wrapper = test_utils_1.renderIntoDocument(React.createElement(Container, null,
        React.createElement(Form, null)));
    var formValues;
    form.stream.subscribe(function (v) {
        formValues = v;
    });
    expectation(wrapper, function () { return formValues; });
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
                listens: [{
                        to: ["text1"],
                        then: function (_a) {
                            var v = _a[0];
                            return ({
                                hide: v !== 'b'
                            });
                        }
                    }]
            }
        ], {
            text1: "a"
        }, function (wrapper, getFormValues) {
            // const TextInput = getType("text")
            var elements = test_utils_1.scryRenderedDOMComponentsWithTag(wrapper, "input");
            test("Expect 1 and only 1 'text' type Component to be shown", function () {
                expect(elements.length).toBe(1);
            });
            var text1 = elements[0];
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