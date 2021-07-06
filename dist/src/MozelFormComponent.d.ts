import React from "react";
import Property from "mozel/dist/Property";
import { ReactView } from "mozel-component";
export default class MozelFormComponent extends ReactView {
    getReactComponent(): typeof React.Component;
    onInit(): void;
    setupField(property: Property): void;
}
