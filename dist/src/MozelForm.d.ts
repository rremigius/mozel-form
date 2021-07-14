import React from "react";
import ReactView from "mozel-component/dist/View/ReactView";
import 'bootstrap/dist/css/bootstrap.min.css';
import { ViewEvents } from "mozel-component/dist/View";
export declare class MozelFormStateChangedEvent {
    state: Record<string, any>;
    constructor(state: Record<string, any>);
}
export declare class MozelFormEvents extends ViewEvents {
    stateChange: import("event-interface-mixin").EventEmitter<MozelFormStateChangedEvent>;
}
/**
 * MozelForm can display any Mozel as a form, rendering inputs that will change the Mozel directly.
 */
export default class MozelForm extends ReactView {
    static fields?: string[];
    static Events: typeof MozelFormEvents;
    events: MozelFormEvents;
    get static(): typeof MozelForm;
    getReactComponent(): typeof React.Component;
    setState(state: Record<string, any>): void;
    setExpanded(expanded?: boolean): void;
    onInit(): void;
}
