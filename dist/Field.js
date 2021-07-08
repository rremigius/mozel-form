import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from "react";
import { uniqueId } from "./utils";
import InputGroup from "react-bootstrap/InputGroup";
import Form from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert";
export default class Field extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    change(newValue) {
        if (this.props.onChange)
            this.props.onChange(newValue);
    }
    renderBoolean(value, label) {
        return _jsx("div", Object.assign({ className: "form-check form-switch" }, { children: _jsx("input", { "aria-label": label, type: "checkbox", id: uniqueId("switch-"), className: "form-check-input", checked: value, onChange: event => this.change(event.currentTarget.checked) }, void 0) }), void 0);
    }
    renderString(value, label) {
        return _jsx(Form.Control, { type: "text", "aria-label": label, value: value, onChange: event => this.change(event.currentTarget.value) }, void 0);
    }
    renderNumber(value, label) {
        return _jsx(Form.Control, { type: "number", "aria-label": label, value: value, onChange: event => this.change(event.currentTarget.value) }, void 0);
    }
    render() {
        const label = this.props.label;
        let field;
        if (this.props.type === Boolean) {
            field = this.renderBoolean(this.props.value, label);
        }
        else if (this.props.type === Number) {
            field = this.renderNumber(this.props.value, label);
        }
        else {
            field = this.renderString(this.props.value, label);
        }
        return _jsxs("div", Object.assign({ className: "mozel-form-field" }, { children: [_jsxs(InputGroup, { children: [label ? _jsx(Form.Label, { children: label }, void 0) : undefined, field] }, void 0), this.props.error ? _jsx(Alert, Object.assign({ variant: "danger" }, { children: this.props.error }), void 0) : undefined] }), void 0);
    }
}
//# sourceMappingURL=Field.js.map