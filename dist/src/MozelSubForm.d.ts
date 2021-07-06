import React from "react";
import ComponentSlot from "mozel-component/dist/Component/ComponentSlot";
import { ReactView } from "mozel-component";
declare type Props = {
    slot: ComponentSlot<ReactView>;
};
declare type State = {};
export default class MozelSubForm extends React.Component<Props, State> {
    constructor(props: Props);
    render(): JSX.Element;
}
export {};
