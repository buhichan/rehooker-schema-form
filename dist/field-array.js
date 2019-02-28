import * as React from 'react';
import { addArrayItem, removeArrayItem } from './mutations';
export function FieldArray(props) {
    var add = React.useMemo(function () { return function () {
        props.form.next(addArrayItem(props.name, props.value));
    }; }, [props.name, props.value]);
    var remove = React.useMemo(function () { return function (id) {
        props.form.next(removeArrayItem(props.name, props.value, id));
    }; }, [props.name, props.value]);
    return React.createElement(React.Fragment, null, props.children((props.value || []).map(function (id) { return props.name + "." + id; }), add, remove));
}
//# sourceMappingURL=field-array.js.map