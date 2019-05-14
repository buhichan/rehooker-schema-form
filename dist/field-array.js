import * as React from 'react';
import { addArrayItem, removeArrayItem } from './mutations';
export function FieldArray(props) {
    var add = React.useMemo(function () { return function () {
        props.form.next(addArrayItem(props.name.slice(1), props.value));
    }; }, [props.name, props.value]);
    var childKeyList = React.useMemo(function () {
        return (props.value || []).map(function (id) {
            var key = props.name + "." + id;
            var remove = function () { return props.form.next(removeArrayItem(props.name.slice(1), props.value, id)); };
            return {
                key: key,
                remove: remove
            };
        });
    }, [props.name, props.value]);
    return React.createElement(React.Fragment, null, props.children(childKeyList, add));
}
//# sourceMappingURL=field-array.js.map