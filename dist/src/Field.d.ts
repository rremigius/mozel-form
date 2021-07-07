import React from "react";
import { primitive } from "validation-kit";
declare type Props = {
    onChange?: (newValue: primitive) => void;
    label?: string;
    value?: primitive;
};
declare type State = {};
export default class Field extends React.Component<Props, State> {
    constructor(props: Props);
    change(newValue: primitive): void;
    render(): JSX.Element;
}
export {};
