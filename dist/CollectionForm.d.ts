import React from "react";
import '@fortawesome/fontawesome-free/js/fontawesome';
import '@fortawesome/fontawesome-free/js/solid';
import '@fortawesome/fontawesome-free/js/regular';
import Mozel, { Collection } from "mozel";
import { primitive } from "validation-kit";
declare type Props = {
    collection: Collection<primitive>;
};
declare type State = {};
export default class CollectionForm extends React.Component<Props, State> {
    constructor(props: Props);
    add(): void;
    remove(index: number): void;
    getKey(item: Mozel | primitive, index: number): import("mozel").alphanumeric;
    change(index: number, newValue: primitive): void;
    valueToString(value: primitive): string;
    render(): JSX.Element;
    componentDidMount(): void;
}
export {};
