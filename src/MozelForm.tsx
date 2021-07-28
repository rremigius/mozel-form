import React from "react";
import ReactView, {ReactViewComponent, ReactViewComponentProps} from "mozel-component/dist/View/ReactView";
import {isPrimitive, isSubClass, primitive} from "validation-kit";
import ComponentSlot from "mozel-component/dist/Component/ComponentSlot";
import ComponentList from "mozel-component/dist/Component/ComponentList";
import Mozel, {Collection, immediate, PropertySchema} from "mozel";

import 'bootstrap/dist/css/bootstrap.min.css';

import ListGroup from "react-bootstrap/ListGroup";
import ComponentSlotForm from "./ComponentSlotForm";
import ComponentListForm from "./ComponentListForm";
import Field from "./Field";
import CollectionForm from "./CollectionForm";
import {humanReadable, isFunction, isString, isPlainObject} from "./utils";
import ListGroupItem from "react-bootstrap/ListGroupItem";
import Property, {PropertyType} from "mozel/dist/Property";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import Button from "react-bootstrap/Button";
import Collapse from "react-bootstrap/Collapse";
import {ViewEvents} from "mozel-component/dist/View";

type Props = ReactViewComponentProps<MozelForm> & FormDefinition;
type State = Record<string, primitive> & {
	expanded:boolean;
};
class MozelFormReactComponent extends ReactViewComponent<Props, State> {
	constructor(props:Props) {
		super(props);
		this.state = {
			expanded: this.props.startExpanded === true
		};
	}

	toggle() {
		this.setState({expanded: !this.state.expanded});
	}

	renderProperty(property:Property, field?:FormDefinition) {
		const name = property.name;

		if(this.props.disabled) {
			// Override disabled property of sub forms and fields
			field = {...field, disabled: true};
		}

		const slot = this.view.getComponentSlot(name);
		if(slot) {
			if(!isSubClass(slot.SyncType, ReactView)) return;
			return this.renderComponentSlot(slot as unknown as ComponentSlot<ReactView>, field);
		}
		const list = this.view.getComponentList(name);
		if(list) {
			if(!isSubClass(list.SyncType, ReactView)) return;

			return this.renderComponentList(list as unknown as ComponentList<ReactView>, field);
		}

		return this.renderField(property, field);
	}

	renderComponentSlot(slot:ComponentSlot<ReactView>, field?:FormDefinition) {
		return <ComponentSlotForm slot={slot} field={field}/>
	}

	renderComponentList(list:ComponentList<ReactView>, field?:FormDefinition) {
		return <ComponentListForm list={list} field={field}/>
	}

	renderField(property:Property, field?:FormDefinition) {
		if(property.isMozelType()) return;
		if(property.isCollectionType(Mozel)) return;

		if(property.isCollectionType()) {
			return this.renderPrimitiveCollection(property.value as Collection<primitive>);
		}

		let type;
		let disabled = false;
		if(field && !isString(field)) {
			if(isFunction(field.input)) {
				return field.input(property, field);
			}
			type = field.input;
			disabled = field.disabled === true;
		} else {
			type = property.type;
		}

		return <Field
			type={type}
			label={humanReadable(property.name)}
			value={property.value as primitive}
			onChange={newValue => property.set(newValue, true)}
			error={property.error && property.error.message}
			disabled={disabled}
		/>
	}

	renderPrimitiveCollection(collection:Collection<primitive>, field?:FormDefinition) {
		return <CollectionForm collection={collection} field={field}/>
	}

	render() {
		const fields:JSX.Element[] = [];
		if(this.view.static.definition.fields) {
			// Only render specified properties
			this.view.static.definition.fields.forEach(field => {
				const property = this.view.getProperty(field);
				const render = this.renderProperty(property, isPlainObject(field) ? field as object : undefined);
				if(render) fields.push(
					<ListGroupItem key={property.name}>{render}</ListGroupItem>
				);
			});
		} else {
			// Render all properties
			this.model.$eachProperty(property => {
				const render = this.renderProperty(property);
				fields.push(
					<ListGroupItem key={property.name}>{render}</ListGroupItem>
				);
			});
		}

		return <ListGroup className="mozel-form">
			<Button variant="light" onClick={() => this.toggle()} className="text-start d-block w-100">
				<FontAwesomeIcon icon={this.state.expanded ? 'caret-down' : 'caret-right'} className="me-2"/>
				<span className="fst-italic">{this.model.$name}</span>
			</Button>
			<Collapse in={this.state.expanded}>
				<div>
					{ fields }
				</div>
			</Collapse>
		</ListGroup>
	}

	componentDidMount() {
		super.componentDidMount();

		this.watch('*', change => {
			const property = this.model.$property(change.valuePath as any);
			if(!property) throw new Error(`Unknown property ${change.valuePath}`);
			const value = change.newValue;
			if(!isPrimitive(value)) return;

			this.setState({[property.name] : value});
		}, {immediate});

		this.watchEvent(this.view.events.stateChange, event => {
			this.setState(event.state);
		})
	}
}

export class MozelFormStateChangedEvent {
	constructor(public state:Record<string, any>) {}
}
export class MozelFormEvents extends ViewEvents {
	stateChange = this.$event(MozelFormStateChangedEvent);
}
export type FormDefinition = {
	property?: string|PropertySchema<any>,
	disabled?: boolean,
	input?:string|typeof MozelForm|((property:Property, field:FormDefinition)=>JSX.Element),
	startExpanded?:boolean,
	fields?:(string|FormDefinition)[]
};
/**
 * MozelForm can display any Mozel as a form, rendering inputs that will change the Mozel directly.
 */
export default class MozelForm extends ReactView {
	static definition:FormDefinition = {};

	static Events = MozelFormEvents;
	declare events:MozelFormEvents;

	get static() {
		return this.constructor as typeof MozelForm;
	}

	getProperty(field:string|FormDefinition) {
		if(isString(field)) {
			return this.model.$property(field as any);
		} else {
			if(!field.property) throw new Error(`No property defined on field definition.`);
			let propertyName = isString(field.property) ? field.property : field.property.$path;
			return this.model.$property(propertyName as any);
		}
	}

	getReactComponent(): typeof React.Component {
		return MozelFormReactComponent;
	}

	setState(state:Record<string, any>) {
		this.events.stateChange.fire(new MozelFormStateChangedEvent(state));
	}

	setExpanded(expanded:boolean = true) {
		this.setState({expanded});
	}

	onInit() {
		super.onInit();

		if(this.static.definition.fields) {
			this.static.definition.fields.forEach(field => {
				const property = this.getProperty(field);

				if(!(property.isMozelType() || property.isCollectionType(Mozel))) {
					return; // Not setting up components for primitive types
				}
				const Form = isString(field) ? MozelForm : field.input || MozelForm;
				if(!(isSubClass(Form, MozelForm))) {
					throw new Error(`Can only use MozelForm for non-primitive values.`);
				}
				if(property.isCollectionType()) {
					return this.setupSubComponents(property, Form as typeof MozelForm);
				}
				this.setupSubComponent(property, Form as typeof MozelForm);
			});
		} else {
			this.model.$eachProperty(property => {
				if(property.isMozelType()) {
					return this.setupSubComponent(property, MozelForm);
				}
				// Mozel Collection
				if(property.isCollectionType(Mozel)) {
					return this.setupSubComponents(property, MozelForm);
				}
			});
		}
	}

	render(props?: Record<string, any>): JSX.Element {
		return super.render({...this.static.definition, ...props});
	}
}
