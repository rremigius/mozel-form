import React from "react";
import ComponentSlot from "mozel-component/dist/Component/ComponentSlot";
import { ReactView } from "mozel-component";
declare type Props = {
    slot: ComponentSlot<ReactView>;
};
declare type State = {
    expanded: boolean;
};
export default class ComponentSlotForm extends React.Component<Props, State> {
    readonly slot: ComponentSlot<ReactView>;
    readonly isRequired: boolean;
    constructor(props: Props);
    remove(): void;
    add(): void;
    toggle(): void;
    renderForm(component: ReactView): JSX.Element;
    renderEmpty(): JSX.Element;
    render(): JSX.Element;
}
export {};
