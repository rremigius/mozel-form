/// <reference types="lodash" />
import React from "react";
import ComponentList from "mozel-component/dist/Component/ComponentList";
import '@fortawesome/fontawesome-free/js/fontawesome';
import '@fortawesome/fontawesome-free/js/solid';
import '@fortawesome/fontawesome-free/js/regular';
import ReactView from "mozel-component/dist/View/ReactView";
import { FormDefinition } from "./MozelForm";
declare type Props = {
    list: ComponentList<ReactView>;
    field?: FormDefinition;
};
declare type State = {
    expanded: boolean;
};
export default class ComponentListForm extends React.Component<Props, State> {
    debouncedUpdate: import("lodash").DebouncedFunc<() => void>;
    list: ComponentList<ReactView>;
    unmount: boolean;
    constructor(props: Props);
    get collection(): import("mozel").Collection<import("mozel").default>;
    add(): void;
    remove(index: number): void;
    toggle(): void;
    getKey(view: ReactView, index: number): string;
    render(): JSX.Element;
    componentDidMount(): void;
    componentWillUnmount(): void;
    stopListening(): void;
}
export {};
