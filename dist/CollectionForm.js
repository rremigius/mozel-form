import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from "react";
import { debounce, humanReadable, isBoolean } from "./utils";
import '@fortawesome/fontawesome-free/js/fontawesome';
import '@fortawesome/fontawesome-free/js/solid';
import '@fortawesome/fontawesome-free/js/regular';
import ListGroupItem from "react-bootstrap/ListGroupItem";
import Button from "react-bootstrap/Button";
import Mozel from "mozel";
import Field from "./Field";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Collapse from "react-bootstrap/Collapse";
export default class CollectionForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            expanded: false
        };
    }
    add() {
        this.props.collection.addDefault();
    }
    remove(index) {
        this.props.collection.removeIndex(index);
    }
    toggle() {
        this.setState({ expanded: !this.state.expanded });
    }
    getKey(item, index) {
        if (item instanceof Mozel) {
            return item.gid;
        }
        return index + item.toString();
    }
    change(index, newValue) {
        this.props.collection.set(index, newValue, true);
    }
    valueToString(value) {
        if (isBoolean(value))
            return value ? "true" : "false";
        return value.toString();
    }
    render() {
        const elements = this.props.collection.map((item, index) => {
            const error = this.props.collection.errors[index];
            return _jsxs(ListGroupItem, Object.assign({ className: "d-flex justify-content-between align-items-start" }, { children: [_jsx("div", Object.assign({ className: "flex-grow-1" }, { children: _jsx(Field, { type: this.props.collection.getType(), value: this.valueToString(item), onChange: newValue => this.change(index, newValue), error: error ? error.message : undefined }, void 0) }), void 0), _jsx(Button, Object.assign({ variant: "danger", onClick: () => this.remove(index) }, { children: _jsx("i", { className: "fas fa-times" }, void 0) }), void 0)] }), this.getKey(item, index));
        });
        return _jsxs("div", Object.assign({ className: "collection-form" }, { children: [_jsxs(Button, Object.assign({ variant: "light", onClick: () => this.toggle(), className: "text-start d-block w-100" }, { children: [_jsx(FontAwesomeIcon, { icon: this.state.expanded ? 'caret-down' : 'caret-right', className: "me-2" }, void 0), humanReadable(this.props.collection.relation)] }), void 0), _jsx(Collapse, Object.assign({ in: this.state.expanded }, { children: _jsxs("div", { children: [elements, _jsx(ListGroupItem, Object.assign({ className: "d-flex justify-content-between align-items-start" }, { children: _jsx(Button, Object.assign({ variant: "primary", onClick: event => this.add() }, { children: _jsx("i", { className: "fas fa-plus" }, void 0) }), void 0) }), void 0)] }, void 0) }), void 0)] }), void 0);
    }
    componentDidMount() {
        const debouncedUpdate = debounce(this.forceUpdate.bind(this));
        this.props.collection.events.changed.on(() => debouncedUpdate());
    }
}
//# sourceMappingURL=CollectionForm.js.map