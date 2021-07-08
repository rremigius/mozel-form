/// <reference types="lodash" />
import React from "react";
import ComponentList from "mozel-component/dist/Component/ComponentList";
import { ReactView } from "mozel-component";
import '@fortawesome/fontawesome-free/js/fontawesome';
import '@fortawesome/fontawesome-free/js/solid';
import '@fortawesome/fontawesome-free/js/regular';
declare type Props = {
    list: ComponentList<ReactView>;
};
declare type State = {};
export default class ComponentListForm extends React.Component<Props, State> {
    debouncedUpdate: import("lodash").DebouncedFunc<() => void>;
    list: ComponentList<ReactView>;
    unmount: boolean;
    constructor(props: Props);
    get collection(): import("mozel").Collection<import("mozel").default>;
    add(): void;
    remove(index: number): void;
    getKey(view: ReactView): import("mozel").alphanumeric;
    render(): JSX.Element;
    componentDidMount(): void;
    componentWillUnmount(): void;
    stopListening(): void;
}
export {};
