export var isFullWidth = function (field) {
    return field.fullWidth || typeof field.type === 'string' && ['textarea', 'group', 'array', 'file', 'table-array', 'virtual-group', 'full-width'].includes(field.type);
};
//# sourceMappingURL=constants.js.map