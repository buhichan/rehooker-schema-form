import * as React from "react";
export function useEnumOptions(maybeOptions, search) {
    var _a = React.useState(null), options = _a[0], setOptions = _a[1];
    React.useEffect(function () {
        if (Array.isArray(maybeOptions)) {
            setOptions(maybeOptions);
        }
    }, [maybeOptions]);
    React.useEffect(function () {
        if (maybeOptions instanceof Function) {
            var canceled_1 = false;
            maybeOptions(search).then(function (options) {
                if (!canceled_1) {
                    setOptions(options);
                }
            });
        }
    }, [maybeOptions instanceof Function && maybeOptions.length > 0 ? search : ""]);
    return options;
}
//# sourceMappingURL=use-enum-options.js.map