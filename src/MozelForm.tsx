import React from "react";
import {ReactViewComponent, ReactViewComponentProps} from "mozel-component/dist/View/ReactView";
import {ReactView} from "mozel-component";
import {isPrimitive, isSubClass, primitive} from "validation-kit";
import View from "mozel-component/dist/View";
import ComponentSlot from "mozel-component/dist/Component/ComponentSlot";
import ComponentList from "mozel-component/dist/Component/ComponentList";
import {immediate} from "mozel";
import log from "./log";

import 'bootstrap/dist/css/bootstrap.min.css';
import ListGroup from "react-bootstrap/ListGroup";
import ListGroupItem from "react-bootstrap/ListGroupItem";
import InputGroup from "react-bootstrap/InputGroup";
import FormControl from "react-bootstrap/FormControl";
import "./mozel-form.css";
import {humanReadable} from "./utils";
import MozelSubForm from "./MozelSubForm";
import MozelCollectionForm from "./MozelCollectionForm";

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
				<MozelSubForm slot={slot as unknown as ComponentSlot<ReactView>} key={slot.path}/>
			);
		});

		this.view.eachComponentList(list => {
			if(!isSubClass(list.SyncType, ReactView)) return;
			if(list.isReference) return;

			subForms.push(
				<MozelCollectionForm list={list as unknown as ComponentList<ReactView>} key={list.path}/>
			)
		})

		return subForms;
	}

	onChange(property:string, newValue:primitive) {
		log.log(`Changing property ${property}.`);
		this.model.$set(property, newValue, true);
	}

	renderFields() {
		const primitives = this.model.$getPrimitiveProperties();
		const fields = [];
		for(let key in primitives) {
			const value = (this.state[key] || "").toString();
			if(key === 'gid') continue; // Skip GID

			const label = humanReadable(key);
			fields.push(
				<ListGroupItem key={key}>
					<InputGroup>
						<label>{label}</label>
						<FormControl
							aria-label={label}
							value={value}
							onChange={event => this.onChange(key, event.currentTarget.value)}
						/>
					</InputGroup>
				</ListGroupItem>
			);
		}
		return fields;
	}

	render() {
		return <ListGroup className="mozel-form">
			{ this.renderFields() }
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
			if(property.isCollectionType()) {
				return this.setupSubComponents(property, MozelForm);
			}
		});
	}
}
