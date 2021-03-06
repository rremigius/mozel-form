import React from "react";
import { primitive } from "validation-kit";
import { PropertyType } from "mozel/dist/Property";
declare type Props = {
    type?: PropertyType | string;
    onChange?: (newValue: primitive) => void;
    label?: string;
    value?: primitive;
    error?: string;
    disabled?: boolean;
};
declare type State = {};
export default class Field extends React.Component<Props, State> {
    constructor(props: Props);
    change(newValue: primitive): void;
    renderBoolean(value?: primitive, label?: string): JSX.Element;
    renderString(value?: primitive, label?: string): JSX.Element;
    renderNumber(value?: primitive, label?: string): JSX.Element;
    renderTextArea(value?: primitive, label?: string): JSX.Element;
    render(): JSX.Element;
}
export {};
