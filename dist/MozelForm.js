import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { ReactViewComponent } from "mozel-component/dist/View/ReactView";
import { ReactView } from "mozel-component";
import { isPrimitive, isSubClass } from "validation-kit";
import Mozel, { immediate } from "mozel";
import log from "./log";
import 'bootstrap/dist/css/bootstrap.min.css';
import ListGroup from "react-bootstrap/ListGroup";
import "./mozel-form.css";
import ComponentSlotForm from "./ComponentSlotForm";
import ComponentListForm from "./ComponentListForm";
import Field from "./Field";
import CollectionForm from "./CollectionForm";
import { humanReadable } from "./utils";
import ListGroupItem from "react-bootstrap/ListGroupItem";
class MozelFormReactComponent extends ReactViewComponent {
    constructor(props) {
        super(props);
        this.state = {};
    }
    renderSubForms() {
        let subForms = [];
        this.view.eachComponentSlot(slot => {
            if (!isSubClass(slot.SyncType, ReactView))
                return;
            if (slot.isReference)
                return;
            subForms.push(_jsx(ComponentSlotForm, { slot: slot }, slot.path));
        });
        this.view.eachComponentList(list => {
            if (!isSubClass(list.SyncType, ReactView))
                return;
            if (list.isReference)
                return;
            subForms.push(_jsx(ComponentListForm, { list: list }, list.path));
        });
        return subForms;
    }
    onChange(property, newValue) {
        log.log(`Changing property '${property}'.`);
        this.model.$set(property, newValue, true);
    }
    renderFields() {
        const primitives = this.model.$getPrimitiveProperties();
        const fields = [];
        for (let key in primitives) {
            if (key === 'gid')
                continue; // Skip GID
            const property = this.model.$property(key);
            fields.push(_jsx(ListGroupItem, { children: _jsx(Field, { type: property.type, label: humanReadable(property.name), value: property.value, onChange: newValue => this.onChange(key, newValue), error: property.error && property.error.message }, void 0) }, key));
        }
        return fields;
    }
    renderPrimitiveCollections() {
        const collectionFields = [];
        this.model.$eachProperty(property => {
            // Non-Mozel Collections
            if (property.isCollectionType() && !isSubClass(property.value.getType(), Mozel)) {
                collectionFields.push(_jsx(CollectionForm, { collection: property.value }, property.name));
            }
        });
        return collectionFields;
    }
    render() {
        return _jsxs(ListGroup, Object.assign({ className: "mozel-form" }, { children: [this.renderFields(), this.renderPrimitiveCollections(), this.renderSubForms()] }), void 0);
    }
    componentDidMount() {
        super.componentDidMount();
        this.model.$watch('*', change => {
            const property = this.model.$property(change.valuePath);
            if (!property)
                throw new Error(`Unknown property ${change.valuePath}`);
            const value = change.newValue;
            if (!isPrimitive(value))
                return;
            this.setState({ [property.name]: value });
        }, { immediate });
    }
}
export default class MozelForm extends ReactView {
    getReactComponent() {
        return MozelFormReactComponent;
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