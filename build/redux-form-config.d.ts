/**
 * Created by YS on 2016/11/9.
 */
import { FieldProp } from "redux-form";
import { FieldValue } from "redux-form";
export interface MyReduxFormConfig {
    /**
     * a list of all your fields in your form. You may change these dynamically
     * at runtime.
     */
    fields?: string[];
    /**
     * the name of your form and the key to where your form's state will be
     * mounted under the redux-form reducer
     */
    form: string;
    /**
     * By default, async blur validation is only triggered if synchronous
     * validation passes, and the form is dirty or was never initialized (or if
     * submitting). Sometimes it may be desirable to trigger asynchronous
     * validation even in these cases, for example if all validation is performed
     * asynchronously and you want to display validation messages if a user does
     * not change a field, but does touch and blur it. Setting
     * alwaysAsyncValidate to true will always run asynchronous validation on
     * blur, even if the form is pristine or sync validation fails.
     */
    alwaysAsyncValidate?: boolean;
    /**
     * field names for which onBlur should trigger a call to the asyncValidate
     * function. Defaults to [].
     *
     * See Asynchronous Blur Validation Example for more details.
     */
    asyncBlurFields?: string[];
    /**
     * a function that takes all the form values, the dispatch function, and
     * the props given to your component, and returns a Promise that will
     * resolve if the validation is passed, or will reject with an object of
     * validation errors in the form { field1: <String>, field2: <String> }.
     *
     * See Asynchronous Blur Validation Example for more details.
     */
    asyncValidate?(values: FormData, dispatch: any, props: Object): Promise<any>;
    /**
     * Whether or not to automatically destroy your form's state in the Redux
     * store when your component is unmounted. Defaults to true.
     */
    destroyOnUnmount?: boolean;
    /**
     * The key for your sub-form.
     *
     * See Multirecord Example for more details.
     */
    formKey?: string;
    /**
     * A function that takes the entire Redux state and the reduxMountPoint
     * (which defaults to "form"). It defaults to:
     * (state, reduxMountPoint) => state[reduxMountPoint].
     * The only reason you should provide this is if you are keeping your Redux
     * state as something other than plain javascript objects, e.g. an
     * Immutable.Map.
     */
    getFormState?(state: any, reduxMountPoint: string): any;
    /**
     * The values with which to initialize your form in componentWillMount().
     * Particularly useful when Editing Multiple Records, but can also be used
     * with single-record forms. The values should be in the form
     * { field1: 'value1', field2: 'value2' }.
     */
    initialValues?: {
        [field: string]: FieldValue;
    };
    'enableReinitialize': boolean;
    /**
     * The function to call with the form data when the handleSubmit() is fired
     * from within the form component. If you do not specify it as a prop here,
     * you must pass it as a parameter to handleSubmit() inside your form
     * component.
     */
    onSubmit?(values: FormData, dispatch?: any): any;
    /**
     * If true, the form values will be overwritten whenever the initialValues
     * prop changes. If false, the values will not be overwritten if the form has
     * previously been initialized. Defaults to true.
     */
    overwriteOnInitialValuesChange?: boolean;
    /**
     * If specified, all the props normally passed into your decorated
     * component directly will be passed under the key specified. Useful if
     * using other decorator libraries on the same component to avoid prop
     * namespace collisions.
     */
    propNamespace?: string;
    /**
     * if true, the decorated component will not be passed any of the onX
     * functions as props that will allow it to mutate the state. Useful for
     * decorating another component that is not your form, but that needs to
     * know about the state of your form.
     */
    readonly?: boolean;
    /**
     * The use of this property is highly discouraged, but if you absolutely
     * need to mount your redux-form reducer at somewhere other than form in
     * your Redux state, you will need to specify the key you mounted it under
     * with this property. Defaults to 'form'.
     *
     * See Alternate Mount Point Example for more details.
     */
    reduxMountPoint?: string;
    /**
     * If set to true, a failed submit will return a rejected promise. Defaults
     * to false. Only use this if you need to detect submit failures and run
     * some code when a submit fails.
     */
    returnRejectedSubmitPromise?: boolean;
    /**
     * marks fields as touched when the blur action is fired. Defaults to true.
     */
    touchOnBlur?: boolean;
    /**
     * marks fields as touched when the change action is fired. Defaults to
     * false.
     */
    touchOnChange?: boolean;
    /**
     * a synchronous validation function that takes the form values and props
     * passed into your component. If validation passes, it should return {}.
     * If validation fails, it should return the validation errors in the form
     * { field1: <String>, field2: <String> }.
     * Defaults to (values, props) => ({}).
     */
    validate?(values: FormData, props: {
        [fieldName: string]: FieldProp<any>;
    }): Object;
    reset?(): void;
}
