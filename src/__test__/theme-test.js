import * as tslib_1 from "tslib";
window['requestAnimationFrame'] = function (callback) {
    setTimeout(callback, 0);
};
import "jest";
import { createStore, combineReducers } from 'redux';
import { reducer as reduxFormReducer, getFormValues } from "redux-form";
import { renderIntoDocument, scryRenderedDOMComponentsWithTag, Simulate } from "react-dom/test-utils";
import * as React from 'react';
import { getType, clearTypes } from '../field';
var PropTypes = require("prop-types");
function describeTestWithStore(Container, schema, initialValues, expectation) {
    var reducer = combineReducers({
        form: reduxFormReducer
    });
    var store = createStore(reducer, {
        form: {}
    });
    var Form = /** @class */ (function (_super) {
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
            var ReduxSchemaForm = require('../../index').ReduxSchemaForm;
            var ReduxSchemaFormWithStore = ReduxSchemaForm;
            return React.createElement(ReduxSchemaFormWithStore, { form: "default", schema: schema, initialValues: initialValues });
        };
        Form.childContextTypes = {
            store: PropTypes.object
        };
        return Form;
    }(React.PureComponent));
    var wrapper = renderIntoDocument(React.createElement(Container, null,
        React.createElement(Form, null)));
    expectation(wrapper, function () { return getFormValues("default")(store.getState()); }, store);
}
export var testTheme = function (themeName, loadTheme, container) {
    describe("Theme: " + themeName, function () {
        clearTypes();
        loadTheme();
        test("Expect 'text' type to be defined", function () {
            //findRenderedComponentWithType does not work with Stateless Component
            var TextInput = getType("text");
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
                        to: "text1",
                        then: function (_a) {
                            var v = _a.value;
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
            var elements = scryRenderedDOMComponentsWithTag(wrapper, "input");
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
                Simulate.change(text1, {});
                expect(getFormValues().text1).toBe('b');
            });
            test("Expect listening field to be updated by listened field", function () {
                text1.value = "b";
                Simulate.change(text1, {});
                expect(getFormValues().text1).toBe('b');
            });
            test("Expect the second 'text' type Component to be rendered now", function () {
                var elements = scryRenderedDOMComponentsWithTag(wrapper, "input");
                expect(elements.length).toBe(2);
            });
        });
    });
};
//# sourceMappingURL=theme-test.js.map