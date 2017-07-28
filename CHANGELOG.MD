# 1.5.1-beta.1
- fix style issue of field array child"

# 1.5.0
- 修复小屏幕下某些样式不生效问题
- `onValueChange` now works for array type
    - Now use a different mechanism in `onValueChange`, the returned changes will be broadcast to parent and children, but if the source is in a child of array type field, the sibling will not receive these changes. In before, children of array share the same fields, and cannot be changed unless getChildren is used.
    
- Add `datetime` type mui widgets, enhance `file` type.
    - now `file` type has an `onFileChange` optional option, in which you can return a `Promise<string>` to return the result of uploading, and the value of this `file` field will be that `string`. If you don't use `onFileChange`, the value of that field will just be a `File` Object.
    
# before

Don't have time to write.