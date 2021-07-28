import React from "react";
import ReactView from "mozel-component/dist/View/ReactView";
import { PropertySchema } from "mozel";
import 'bootstrap/dist/css/bootstrap.min.css';
import Property from "mozel/dist/Property";
import { ViewEvents } from "mozel-component/dist/View";
export declare class MozelFormStateChangedEvent {
    state: Record<string, any>;
    constructor(state: Record<string, any>);
}
export declare class MozelFormEvents extends ViewEvents {
    stateChange: import("event-interface-mixin").EventEmitter<MozelFormStateChangedEvent>;
}
export declare type FormDefinition = {
    property?: string | PropertySchema<any>;
    disabled?: boolean;
    input?: string | typeof MozelForm | ((property: Property, field: FormDefinition) => JSX.Element);
    startExpanded?: boolean;
    fields?: (string | FormDefinition)[];
};
/**
 * MozelForm can display any Mozel as a form, rendering inputs that will change the Mozel directly.
 */
export default class MozelForm extends ReactView {
    static definition: FormDefinition;
    static Events: typeof MozelFormEvents;
    events: MozelFormEvents;
    get static(): typeof MozelForm;
    getProperty(field: string | FormDefinition): Property;
    getReactComponent(): typeof React.Component;
    setState(state: Record<string, any>): void;
    setExpanded(expanded?: boolean): void;
    onInit(): void;
    render(props?: Record<string, any>): JSX.Element;
}
