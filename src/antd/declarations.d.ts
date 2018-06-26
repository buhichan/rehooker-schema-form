import {FormFieldSchema} from "../form"

declare module "../form"{
    interface WidgetInjectedProps{
        /**
         * type: "file"
         * return a promise which resolves to url of the uploaded file
         * onFileChange is optional, when not provided, file should be handled elsewhere.
         * In antd component, the value of a file field will be Array<{originFileObj:File, url:string, [otherProps:string]:any}>
         * @theme mui/antd
         * @param file The file to upload
         */
        onFileChange?:(file:File)=>Promise<string>,

        downloadPathPrefix?:string,
        /**
         * type: "array"
         * @theme mui
         */
        itemsPerRow?:number
        /**
         * type: "autocomplete-text/async/-"
         * @theme mui
         */
        fullResult?:boolean
        /**
         * type: "autocomplete-async"
         * @theme mui
         */
        throttle?:number
        showValueWhenNoEntryIsFound?:boolean
        /**
         * type: "select"
         * @theme mui/antd
         */
        loadingText?:string,
        /**
         * type: "table-array/array"
         * @theme mui
         */
        hideColumns?:string[]
        disableDelete?:boolean,
        disableCreate?:boolean,
        disableSort?:boolean,
        disableImport?:boolean
        /**
         * type: "table-array"
         * @theme mui
         */
        disableFixSeparatorForExcel?:boolean //we must add sep=, as the first row to prevent excel to change the separator
        csvColumnSeparator?:string
        /**
         * type: "date/datetime"
         * @theme mui
         */
        okLabel?:string
        cancelLabel?:string
        locale?:any

        data?:any,  
    }
}