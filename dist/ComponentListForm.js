import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from "react";
import { debounce, humanReadable } from "./utils";
import '@fortawesome/fontawesome-free/js/fontawesome';
import '@fortawesome/fontawesome-free/js/solid';
import '@fortawesome/fontawesome-free/js/regular';
import ListGroup from "react-bootstrap/ListGroup";
import ListGroupItem from "react-bootstrap/ListGroupItem";
import Button from "react-bootstrap/Button";
export default class ComponentListForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
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
    getKey(view) {
        return view.model.gid;
    }
    render() {
        const elements = this.props.list.map((view, index) => {
            return _jsxs(ListGroupItem, Object.assign({ className: "d-flex justify-content-between align-items-start" }, { children: [_jsx("div", Object.assign({ className: "flex-grow-1" }, { children: view.render() }), void 0), _jsx(Button, Object.assign({ variant: "danger", onClick: event => this.remove(index) }, { children: _jsx("i", { className: "fas fa-times" }, void 0) }), void 0)] }), this.getKey(view));
        });
        return _jsxs(ListGroupItem, { children: [_jsx("label", { children: humanReadable(this.props.list.path) }, void 0), _jsxs(ListGroup, Object.assign({ className: "ms-4" }, { children: [elements, _jsx(ListGroupItem, Object.assign({ className: "d-flex justify-content-between align-items-start" }, { children: _jsx(Button, Object.assign({ variant: "primary", onClick: event => this.add() }, { children: _jsx("i", { className: "fas fa-plus" }, void 0) }), void 0) }), void 0)] }), void 0)] }, void 0);
    }
    componentDidMount() {
        const debouncedUpdate = debounce(this.forceUpdate.bind(this));
        this.props.list.events.change.on(event => debouncedUpdate());
        this.props.list.events.add.on(event => debouncedUpdate());
        this.props.list.events.remove.on(event => debouncedUpdate());
    }
}
//# sourceMappingURL=ComponentListForm.js.map