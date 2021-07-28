import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import ReactView, { ReactViewComponent } from "mozel-component/dist/View/ReactView";
import { isPrimitive, isSubClass } from "validation-kit";
import Mozel, { immediate } from "mozel";
import 'bootstrap/dist/css/bootstrap.min.css';
import ListGroup from "react-bootstrap/ListGroup";
import ComponentSlotForm from "./ComponentSlotForm";
import ComponentListForm from "./ComponentListForm";
import Field from "./Field";
import CollectionForm from "./CollectionForm";
import { humanReadable, isFunction, isString, isPlainObject } from "./utils";
import ListGroupItem from "react-bootstrap/ListGroupItem";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Button from "react-bootstrap/Button";
import Collapse from "react-bootstrap/Collapse";
import { ViewEvents } from "mozel-component/dist/View";
class MozelFormReactComponent extends ReactViewComponent {
    constructor(props) {
        super(props);
        this.state = {
            expanded: this.props.startExpanded === true
        };
    }
    toggle() {
        this.setState({ expanded: !this.state.expanded });
    }
    renderProperty(property, field) {
        const name = property.name;
        if (this.props.disabled) {
            // Override disabled property of sub forms and fields
            field = { ...field, disabled: true };
        }
        const slot = this.view.getComponentSlot(name);
        if (slot) {
            if (!isSubClass(slot.SyncType, ReactView))
                return;
            return this.renderComponentSlot(slot, field);
        }
        const list = this.view.getComponentList(name);
        if (list) {
            if (!isSubClass(list.SyncType, ReactView))
                return;
            return this.renderComponentList(list, field);
        }
        return this.renderField(property, field);
    }
    renderComponentSlot(slot, field) {
        return _jsx(ComponentSlotForm, { slot: slot, field: field }, void 0);
    }
    renderComponentList(list, field) {
        return _jsx(ComponentListForm, { list: list, field: field }, void 0);
    }
    renderField(property, field) {
        if (property.isMozelType())
            return;
        if (property.isCollectionType(Mozel))
            return;
        if (property.isCollectionType()) {
            return this.renderPrimitiveCollection(property.value);
        }
        let type;
        let disabled = false;
        if (field && !isString(field)) {
            if (isFunction(field.input)) {
                return field.input(property, field);
            }
            type = field.input;
            disabled = field.disabled === true;
        }
        else {
            type = property.type;
        }
        return _jsx(Field, { type: type, label: humanReadable(property.name), value: property.value, onChange: newValue => property.set(newValue, true), error: property.error && property.error.message, disabled: disabled }, void 0);
    }
    renderPrimitiveCollection(collection, field) {
        return _jsx(CollectionForm, { collection: collection, field: field }, void 0);
    }
    render() {
        const fields = [];
        if (this.view.static.definition.fields) {
            // Only render specified properties
            this.view.static.definition.fields.forEach(field => {
                const property = this.view.getProperty(field);
                const render = this.renderProperty(property, isPlainObject(field) ? field : undefined);
                if (render)
                    fields.push(_jsx(ListGroupItem, { children: render }, property.name));
            });
        }
        else {
            // Render all properties
            this.model.$eachProperty(property => {
                const render = this.renderProperty(property);
                fields.push(_jsx(ListGroupItem, { children: render }, property.name));
            });
        }
        return _jsxs(ListGroup, Object.assign({ className: "mozel-form" }, { children: [_jsxs(Button, Object.assign({ variant: "light", onClick: () => this.toggle(), className: "text-start d-block w-100" }, { children: [_jsx(FontAwesomeIcon, { icon: this.state.expanded ? 'caret-down' : 'caret-right', className: "me-2" }, void 0), _jsx("span", Object.assign({ className: "fst-italic" }, { children: this.model.$name }), void 0)] }), void 0), _jsx(Collapse, Object.assign({ in: this.state.expanded }, { children: _jsx("div", { children: fields }, void 0) }), void 0)] }), void 0);
    }
    componentDidMount() {
        super.componentDidMount();
        this.watch('*', change => {
            const property = this.model.$property(change.valuePath);
            if (!property)
                throw new Error(`Unknown property ${change.valuePath}`);
            const value = change.newValue;
            if (!isPrimitive(value))
                return;
            this.setState({ [property.name]: value });
        }, { immediate });
        this.watchEvent(this.view.events.stateChange, event => {
            this.setState(event.state);
        });
    }
}
export class MozelFormStateChangedEvent {
    state;
    constructor(state) {
        this.state = state;
    }
}
export class MozelFormEvents extends ViewEvents {
    stateChange = this.$event(MozelFormStateChangedEvent);
}
/**
 * MozelForm can display any Mozel as a form, rendering inputs that will change the Mozel directly.
 */
export default class MozelForm extends ReactView {
    static definition = {};
    static Events = MozelFormEvents;
    get static() {
        return this.constructor;
    }
    getProperty(field) {
        if (isString(field)) {
            return this.model.$property(field);
        }
        else {
            if (!field.property)
                throw new Error(`No property defined on field definition.`);
            let propertyName = isString(field.property) ? field.property : field.property.$path;
            return this.model.$property(propertyName);
        }
    }
    getReactComponent() {
        return MozelFormReactComponent;
    }
    setState(state) {
        this.events.stateChange.fire(new MozelFormStateChangedEvent(state));
    }
    setExpanded(expanded = true) {
        this.setState({ expanded });
    }
    onInit() {
        super.onInit();
        if (this.static.definition.fields) {
            this.static.definition.fields.forEach(field => {
                const property = this.getProperty(field);
                if (!(property.isMozelType() || property.isCollectionType(Mozel))) {
                    return; // Not setting up components for primitive types
                }
                const Form = isString(field) ? MozelForm : field.input || MozelForm;
                if (!(isSubClass(Form, MozelForm))) {
                    throw new Error(`Can only use MozelForm for non-primitive values.`);
                }
                if (property.isCollectionType()) {
                    return this.setupSubComponents(property, Form);
                }
                this.setupSubComponent(property, Form);
            });
        }
        else {
            this.model.$eachProperty(property => {
                if (property.isMozelType()) {
                    return this.setupSubComponent(property, MozelForm);
                }
                // Mozel Collection
                if (property.isCollectionType(Mozel)) {
                    return this.setupSubComponents(property, MozelForm);
                }
            });
        }
    }
    render(props) {
        return super.render({ ...this.static.definition, ...props });
    }
}
//# sourceMappingURL=MozelForm.js.map