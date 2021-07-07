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
export default class MozelCollectionForm extends React.Component<Props, State> {
    constructor(props: Props);
    get collection(): import("mozel/dist/Collection").default<import("mozel").default>;
    add(): void;
    remove(index: number): void;
    getKey(view: ReactView): import("mozel").alphanumeric;
    render(): JSX.Element;
    componentDidMount(): void;
}
export {};
