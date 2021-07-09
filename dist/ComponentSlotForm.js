import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from "react";
import ListGroupItem from "react-bootstrap/ListGroupItem";
import { get, humanReadable } from "./utils";
import Button from "react-bootstrap/Button";
import Collapse from "react-bootstrap/Collapse";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
export default class ComponentSlotForm extends React.Component {
    slot;
    isRequired;
    constructor(props) {
        super(props);
        this.state = {
            expanded: false
        };
        this.slot = this.props.slot;
        this.isRequired = get(this.slot.model.static.$schema(), this.slot.path + '.$required', false);
    }
    remove() {
        this.props.slot.set(undefined);
    }
    add() {
        this.props.slot.set({}); // {} will be accepted because of init (TODO in component-mozel)
    }
    toggle() {
        this.setState({ expanded: !this.state.expanded });
    }
    renderForm(component) {
        const render = this.props.slot.isReference
            ? _jsx("span", Object.assign({ className: "fst-italic" }, { children: component.model.$name }), void 0)
            : component.render({ startExpanded: true });
        return _jsxs(ListGroupItem, Object.assign({ className: "d-flex justify-content-between align-items-start" }, { children: [_jsx("div", Object.assign({ className: "flex-grow-1 pt-2" }, { children: render }), void 0), !this.isRequired
                    ? _jsx(Button, Object.assign({ variant: "danger", onClick: () => this.remove() }, { children: _jsx(FontAwesomeIcon, { icon: "times" }, void 0) }), void 0)
                    : undefined] }), void 0);
    }
    renderEmpty() {
        return _jsx("div", { children: _jsx(Button, Object.assign({ variant: "primary", onClick: () => this.add() }, { children: _jsx(FontAwesomeIcon, { icon: "plus" }, void 0) }), void 0) }, void 0);
    }
    render() {
        const component = this.props.slot.current;
        return _jsxs("div", Object.assign({ className: "component-slot-form" }, { children: [_jsxs(Button, Object.assign({ variant: "light", onClick: () => this.toggle(), className: "text-start d-block w-100" }, { children: [_jsx(FontAwesomeIcon, { icon: this.state.expanded ? 'caret-down' : 'caret-right', className: "me-2" }, void 0), humanReadable(this.props.slot.path)] }), void 0), _jsx(Collapse, Object.assign({ in: this.state.expanded }, { children: _jsx("div", { children: component ? this.renderForm(component) : this.renderEmpty() }, void 0) }), void 0)] }), void 0);
    }
}
//# sourceMappingURL=ComponentSlotForm.js.map