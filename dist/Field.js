import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from "react";
import { uniqueId } from "./utils";
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
        value = value !== undefined ? value : false;
        return _jsx("div", Object.assign({ className: "form-check form-switch" }, { children: _jsx("input", { "aria-label": label, type: "checkbox", id: uniqueId("switch-"), className: "form-check-input", checked: value || false, onChange: event => this.change(event.currentTarget.checked), disabled: this.props.disabled }, void 0) }), void 0);
    }
    renderString(value, label) {
        value = value !== undefined ? value : "";
        return _jsx(Form.Control, { type: "text", "aria-label": label, value: value, onChange: event => this.change(event.currentTarget.value), disabled: this.props.disabled }, void 0);
    }
    renderNumber(value, label) {
        value = value !== undefined ? value : "";
        return _jsx(Form.Control, { type: "number", "aria-label": label, value: value, onChange: event => this.change(event.currentTarget.value), disabled: this.props.disabled }, void 0);
    }
    renderTextArea(value, label) {
        value = value !== undefined ? value : "";
        return _jsx(Form.Control, { as: "textarea", "aria-label": label, value: value, onChange: event => this.change(event.currentTarget.value), disabled: this.props.disabled }, void 0);
    }
    render() {
        const label = this.props.label;
        let field;
        switch (this.props.type) {
            case Boolean:
            case 'boolean':
                field = this.renderBoolean(this.props.value, label);
                break;
            case Number:
            case 'number':
                field = this.renderNumber(this.props.value, label);
                break;
            case 'textarea':
                field = this.renderTextArea(this.props.value, label);
                break;
            case String:
            case 'string':
            default:
                field = this.renderString(this.props.value, label);
                break;
        }
        return _jsxs("div", Object.assign({ className: "mozel-form-field" }, { children: [label ? _jsx(Form.Label, { children: label }, void 0) : undefined, field, this.props.error ? _jsx(Alert, Object.assign({ variant: "danger" }, { children: this.props.error }), void 0) : undefined] }), void 0);
    }
}
//# sourceMappingURL=Field.js.map