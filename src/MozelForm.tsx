import React from "react";
import {ReactViewComponent, ReactViewComponentProps} from "mozel-component/dist/View/ReactView";
import {ReactView} from "mozel-component";
import {isPrimitive, isSubClass, primitive} from "validation-kit";
import ComponentSlot from "mozel-component/dist/Component/ComponentSlot";
import ComponentList from "mozel-component/dist/Component/ComponentList";
import Mozel, {Collection, immediate} from "mozel";
import log from "./log";

import 'bootstrap/dist/css/bootstrap.min.css';
import ListGroup from "react-bootstrap/ListGroup";
import "./mozel-form.css";
import ComponentSlotForm from "./ComponentSlotForm";
import ComponentListForm from "./ComponentListForm";
import Field from "./Field";
import CollectionForm from "./CollectionForm";
import {humanReadable} from "./utils";

type Props = ReactViewComponentProps<MozelForm>;
type State = Record<string, primitive>;
class MozelFormReactComponent extends ReactViewComponent<Props, State> {
	constructor(props:Props) {
		super(props);
		this.state = {};
	}
	renderSubForms() {
		let subForms:JSX.Element[] = [];

		this.view.eachComponentSlot(slot => {
			if(!isSubClass(slot.SyncType, ReactView)) return;
			if(slot.isReference) return;

			subForms.push(
				<ComponentSlotForm slot={slot as unknown as ComponentSlot<ReactView>} key={slot.path}/>
			);
		});

		this.view.eachComponentList(list => {
			if(!isSubClass(list.SyncType, ReactView)) return;
			if(list.isReference) return;

			subForms.push(
				<ComponentListForm list={list as unknown as ComponentList<ReactView>} key={list.path}/>
			)
		})

		return subForms;
	}

	onChange(property:string, newValue:primitive) {
		log.log(`Changing property '${property}'.`);
		this.model.$set(property, newValue, true);
	}

	renderFields() {
		const primitives = this.model.$getPrimitiveProperties();
		const fields = [];
		for(let key in primitives) {
			if(key === 'gid') continue; // Skip GID
			const property = this.model.$property(key as any);
			fields.push(
				<Field key={key}
					   type={property.type}
					   label={humanReadable(property.name)}
					   value={property.value as primitive}
					   onChange={newValue => this.onChange(key, newValue)}
				/>
			);
		}
		return fields;
	}

	renderPrimitiveCollections() {
		const collectionFields:JSX.Element[] = [];
		this.model.$eachProperty(property => {
			// Non-Mozel Collections
			if(property.isCollectionType() && !isSubClass((property.value as Collection<any>).getType(), Mozel)) {
				collectionFields.push(<CollectionForm key={property.name} collection={property.value as Collection<any>}/>);
			}
		})
		return collectionFields;
	}

	render() {
		return <ListGroup className="mozel-form">
			{ this.renderFields() }
			{ this.renderPrimitiveCollections() }
			{ this.renderSubForms() }
		</ListGroup>
	}

	componentDidMount() {
		super.componentDidMount();

		this.model.$watch('*', change => {
			const property = this.model.$property(change.valuePath as any);
			if(!property) throw new Error(`Unknown property ${change.valuePath}`);
			const value = change.newValue;
			if(!isPrimitive(value)) return;

			this.setState({[property.name] : value});
		}, {immediate});
	}
}

export default class MozelForm extends ReactView {
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
