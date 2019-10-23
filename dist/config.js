import * as React from "react";
var defaultFormButtonsImpl = function (props) {
    return React.createElement("div", { className: "button" },
        React.createElement("div", { className: "btn-group" },
            React.createElement("button", { type: "submit", className: "btn btn-primary" + (props.disabled ? " disabled" : ""), disabled: props.disabled, onClick: props.onSubmit }, "submit"),
            React.createElement("button", { type: "submit", className: "btn btn-primary" + (props.disabled ? " disabled" : ""), disabled: props.disabled, onClick: props.onSubmit }, "reset")));
};
export var defaultSchemaFormConfig = {
    componentMap: new Map(),
    buttonRenderer: defaultFormButtonsImpl,
};
var _a = React.createContext(defaultSchemaFormConfig), Provider = _a.Provider, Consumer = _a.Consumer;
export var SchemaFormConfigProvider = Provider;
export var SchemaFormConfigConsumer = Consumer;
// export function addType(name: string, widget: Widget) {
//     widgetRegistration.set(name, widget);
// }
// let widgetRegistration: Promise<Map<string, Widget>>;
// export function clearTypes() {
//     widgetRegistration.clear()
// }
// export function hasType(name:string){
//     return widgetRegistration.has(name)
// }
// export function getType(name: string): Widget | undefined {
//     return widgetRegistration.get(name)
// }
//# sourceMappingURL=config.js.map