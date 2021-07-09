import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { ReactViewComponent } from "mozel-component/dist/View/ReactView";
import { ReactView } from "mozel-component";
import { isPrimitive, isSubClass } from "validation-kit";
import Mozel, { immediate } from "mozel";
import 'bootstrap/dist/css/bootstrap.min.css';
import ListGroup from "react-bootstrap/ListGroup";
import ComponentSlotForm from "./ComponentSlotForm";
import ComponentListForm from "./ComponentListForm";
import Field from "./Field";
import CollectionForm from "./CollectionForm";
import { humanReadable } from "./utils";
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
    renderProperty(property) {
        const name = property.name;
        const slot = this.view.getComponentSlot(name);
        if (slot) {
            if (!isSubClass(slot.SyncType, ReactView))
                return;
            return this.renderComponentSlot(slot);
        }
        const list = this.view.getComponentList(name);
        if (list) {
            if (!isSubClass(list.SyncType, ReactView))
                return;
            if (list.isReference)
                return;
            return this.renderComponentList(list);
        }
        return this.renderField(property);
    }
    renderComponentSlot(slot) {
        return _jsx(ComponentSlotForm, { slot: slot }, void 0);
    }
    renderComponentList(list) {
        return _jsx(ComponentListForm, { list: list }, void 0);
    }
    renderField(property) {
        if (property.isMozelType())
            return;
        if (property.isCollectionType(Mozel))
            return;
        if (property.isCollectionType()) {
            return this.renderPrimitiveCollection(property.value);
        }
        return _jsx(Field, { type: property.type, label: humanReadable(property.name), value: property.value, onChange: newValue => property.set(newValue, true), error: property.error && property.error.message }, void 0);
    }
    renderPrimitiveCollection(collection) {
        return _jsx(CollectionForm, { collection: collection }, void 0);
    }
    render() {
        const fields = [];
        if (this.view.static.fields) {
            // Only render specified properties
            this.view.static.fields.forEach(field => {
                const property = this.model.$property(field);
                if (!property)
                    return;
                const render = this.renderProperty(property);
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
    static fields;
    static Events = MozelFormEvents;
    get static() {
        return this.constructor;
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
        this.model.$eachProperty(property => {
            if (property.isMozelType()) {
                return this.setupSubComponent(property, MozelForm);
            }
            // Mozel Collection
            if (property.isCollectionType() && isSubClass(property.value.getType(), Mozel)) {
                return this.setupSubComponents(property, MozelForm);
            }
        });
    }
}
//# sourceMappingURL=MozelForm.js.map