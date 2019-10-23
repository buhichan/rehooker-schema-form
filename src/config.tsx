import { WidgetProps } from './types';
import * as React from "react"

export type FormButtonsProps = {
    disabled:boolean,
    pristine?:boolean,
    submitSucceeded:boolean,
    submitting:boolean,
    onSubmit:(e?:any)=>void,
    onReset:(e?:any)=>void
}

type Widget = React.StatelessComponent<WidgetProps> | React.ComponentClass<WidgetProps>

const defaultFormButtonsImpl = (props:FormButtonsProps)=>{
    return <div className="button">
        <div className="btn-group">
            <button type="submit" className={"btn btn-primary"+(props.disabled?" disabled":"")} disabled={props.disabled} onClick={props.onSubmit}>
                submit
            </button>
            <button type="submit" className={"btn btn-primary"+(props.disabled?" disabled":"")} disabled={props.disabled} onClick={props.onSubmit}>
                reset
            </button>
        </div>
    </div>
}

export type ComponentMap = Map<string, Widget>;

export type SchemaFormConfig = {
    componentMap:ComponentMap,
    buttonRenderer: (props:FormButtonsProps)=>JSX.Element,
}

export const defaultSchemaFormConfig:SchemaFormConfig = {
    componentMap: new Map<string, Widget>(),
    buttonRenderer: defaultFormButtonsImpl,
}

const {Provider,Consumer} = React.createContext(defaultSchemaFormConfig)

export const SchemaFormConfigProvider = Provider

export const SchemaFormConfigConsumer = Consumer

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