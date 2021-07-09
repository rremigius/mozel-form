import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from "react";
import { debounce, humanReadable } from "./utils";
import '@fortawesome/fontawesome-free/js/fontawesome';
import '@fortawesome/fontawesome-free/js/solid';
import '@fortawesome/fontawesome-free/js/regular';
import ListGroupItem from "react-bootstrap/ListGroupItem";
import Button from "react-bootstrap/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Collapse from "react-bootstrap/Collapse";
export default class ComponentListForm extends React.Component {
    debouncedUpdate = debounce(() => {
        // Because of the debounce, it is possible that the component gets unmounted before next tick.
        if (this.unmount)
            this.stopListening();
        else
            this.forceUpdate();
    });
    list;
    unmount = false;
    constructor(props) {
        super(props);
        this.state = {
            expanded: false
        };
        this.list = this.props.list;
        // TODO: implement componentDidUpdate
    }
    get collection() {
        const collection = this.props.list.currentCollection;
        if (!collection)
            throw new Error(`Collection should not be undefined.`);
        return collection;
    }
    add() {
        this.collection.addDefault();
    }
    remove(index) {
        this.collection.removeIndex(index);
    }
    toggle() {
        this.setState({ expanded: !this.state.expanded });
    }
    getKey(view) {
        return view.model.gid;
    }
    render() {
        const elements = this.props.list.map((view, index) => {
            return _jsxs(ListGroupItem, Object.assign({ className: "d-flex justify-content-between align-items-start" }, { children: [_jsx("div", Object.assign({ className: "flex-grow-1" }, { children: view.render() }), void 0), _jsx(Button, Object.assign({ variant: "danger", onClick: event => this.remove(index) }, { children: _jsx("i", { className: "fas fa-times" }, void 0) }), void 0)] }), this.getKey(view));
        });
        return _jsxs(ListGroupItem, { children: [_jsxs(Button, Object.assign({ variant: "light", onClick: () => this.toggle(), className: "text-start d-block w-100" }, { children: [_jsx(FontAwesomeIcon, { icon: this.state.expanded ? 'caret-down' : 'caret-right', className: "me-2" }, void 0), humanReadable(this.props.list.path)] }), void 0), _jsx(Collapse, Object.assign({ in: this.state.expanded }, { children: _jsxs("div", { children: [elements, _jsx(ListGroupItem, Object.assign({ className: "d-flex justify-content-between align-items-start" }, { children: _jsx(Button, Object.assign({ variant: "primary", onClick: event => this.add() }, { children: _jsx("i", { className: "fas fa-plus" }, void 0) }), void 0) }), void 0)] }, void 0) }), void 0)] }, void 0);
    }
    componentDidMount() {
        // TS: update function does not use any callback so will be compatible anyway
        this.list.events.change.on(this.debouncedUpdate);
        this.list.events.add.on(this.debouncedUpdate);
        this.list.events.remove.on(this.debouncedUpdate);
    }
    componentWillUnmount() {
        this.stopListening();
        this.unmount = true;
    }
    stopListening() {
        this.list.events.change.off(this.debouncedUpdate);
        this.list.events.add.off(this.debouncedUpdate);
        this.list.events.remove.off(this.debouncedUpdate);
    }
}
//# sourceMappingURL=ComponentListForm.js.map