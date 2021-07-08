import React from "react";
import { ReactView } from "mozel-component";
import 'bootstrap/dist/css/bootstrap.min.css';
export default class MozelForm extends ReactView {
    static fields?: string[];
    get static(): typeof MozelForm;
    getReactComponent(): typeof React.Component;
    onInit(): void;
}
