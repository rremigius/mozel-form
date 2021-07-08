import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from "react";
import ListGroupItem from "react-bootstrap/ListGroupItem";
import { get, humanReadable } from "./utils";
import Button from "react-bootstrap/Button";
export default class ComponentSlotForm extends React.Component {
    slot;
    isRequired;
    constructor(props) {
        super(props);
        this.state = {};
        this.slot = this.props.slot;
        this.isRequired = get(this.slot.model.static.$schema(), this.slot.path + '.$required', false);
    }
    remove() {
        this.props.slot.set(undefined);
    }
    add() {
        this.props.slot.set({}); // {} will be accepted because of init (TODO in component-mozel)
    }
    renderForm(component) {
        return _jsxs("div", Object.assign({ className: "ms-4 d-flex justify-content-between align-items-start" }, { children: [_jsx("div", Object.assign({ className: "flex-grow-1" }, { children: component.render() }), void 0), !this.isRequired
                    ? _jsx(Button, Object.assign({ variant: "danger", onClick: event => this.remove() }, { children: _jsx("i", { className: "fas fa-times" }, void 0) }), void 0)
                    : undefined] }), void 0);
    }
    renderEmpty() {
        return _jsx("div", { children: _jsx(Button, Object.assign({ variant: "primary", onClick: event => this.add() }, { children: _jsx("i", { className: "fas fa-plus" }, void 0) }), void 0) }, void 0);
    }
    render() {
        const component = this.props.slot.current;
        return _jsxs(ListGroupItem, { children: [_jsx("label", { children: humanReadable(this.props.slot.path) }, void 0), component ? this.renderForm(component) : this.renderEmpty()] }, void 0);
    }
}
//# sourceMappingURL=ComponentSlotForm.js.map