import React from "react";
import {ReactViewComponent, ReactViewComponentProps} from "mozel-component/dist/View/ReactView";
import Component, {ReactView} from "mozel-component";
import {isPrimitive, isSubClass, primitive} from "validation-kit";
import ComponentSlot from "mozel-component/dist/Component/ComponentSlot";
import ComponentList from "mozel-component/dist/Component/ComponentList";
import Mozel, {Collection, immediate} from "mozel";

import 'bootstrap/dist/css/bootstrap.min.css';

import ListGroup from "react-bootstrap/ListGroup";
import ComponentSlotForm from "./ComponentSlotForm";
import ComponentListForm from "./ComponentListForm";
import Field from "./Field";
import CollectionForm from "./CollectionForm";
import {humanReadable} from "./utils";
import ListGroupItem from "react-bootstrap/ListGroupItem";
import Property from "mozel/dist/Property";
import View from "mozel-component/dist/View";

type Props = ReactViewComponentProps<MozelForm>;
type State = Record<string, primitive>;
class MozelFormReactComponent extends ReactViewComponent<Props, State> {
	constructor(props:Props) {
		super(props);
		this.state = {};
	}

	renderProperty(property:Property) {
		const name = property.name;

		const slot = this.view.getComponentSlot(name);
		if(slot) {
			if(!isSubClass(slot.SyncType, ReactView)) return;
			if(slot.isReference) return;
			return this.renderComponentSlot(slot as unknown as ComponentSlot<ReactView>);
		}
		const list = this.view.getComponentList(name);
		if(list) {
			if(!isSubClass(list.SyncType, ReactView)) return;
			if(list.isReference) return;

			return this.renderComponentList(list as unknown as ComponentList<ReactView>);
		}

		return this.renderField(property);
	}

	renderComponentSlot(slot:ComponentSlot<ReactView>) {
		return <ComponentSlotForm slot={slot}/>
	}

	renderComponentList(list:ComponentList<ReactView>) {
		return <ComponentListForm list={list}/>
	}

	renderField(property:Property) {
		if(property.isMozelType()) return;
		if(property.isCollectionType(Mozel)) return;

		if(property.isCollectionType()) {
			return this.renderPrimitiveCollection(property.value as Collection<primitive>);
		}

		return <Field
			type={property.type}
			label={humanReadable(property.name)}
			value={property.value as primitive}
			onChange={newValue => property.set(newValue, true)}
			error={property.error && property.error.message}
		/>
	}

	renderPrimitiveCollection(collection:Collection<primitive>) {
		return <CollectionForm collection={collection}/>
	}

	render() {
		const fields:JSX.Element[] = [];
		if(this.view.static.fields) {
			// Only render specified properties
			this.view.static.fields.forEach(field => {
				const property = this.model.$property(field as any);
				if(!property) return;

				const render = this.renderProperty(property);
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
			{ fields }
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
	}
}

export default class MozelForm extends ReactView {
	static fields?:string[];

	get static() {
		return this.constructor as typeof MozelForm;
	}

	getReactComponent(): typeof React.Component {
		return MozelFormReactComponent;
	}

	onInit() {
		super.onInit();

		this.model.$eachProperty(property => {
			if(property.isMozelType()) {
				return this.setupSubComponent(property, MozelForm);
			}
			// Mozel Collection
			if(property.isCollectionType() && isSubClass((property.value as Collection<any>).getType(), Mozel)) {
				return this.setupSubComponents(property, MozelForm);
			}
		});
	}
}
