import React from "react";
import ListGroupItem from "react-bootstrap/ListGroupItem";
import {get, humanReadable} from "./utils";
import ComponentSlot from "mozel-component/dist/Component/ComponentSlot";
import Component, {ReactView} from "mozel-component";
import Button from "react-bootstrap/Button";
import Mozel, {schema} from "mozel";

type Props = {
	slot:ComponentSlot<ReactView>
};
type State = {};
export default class ComponentSlotForm extends React.Component<Props, State> {
	readonly slot:ComponentSlot<ReactView>;
	readonly isRequired:boolean;

	constructor(props:Props) {
		super(props);
		this.state = {};

		this.slot = this.props.slot;
		this.isRequired = get(this.slot.model.static.$schema(), this.slot.path + '.$required', false);
	}

	remove() {
		this.props.slot.set(undefined);
	}

	add() {
		this.props.slot.set({} as Mozel); // {} will be accepted because of init (TODO in component-mozel)
	}

	renderForm(component:ReactView) {
		return <div className="ms-4 d-flex justify-content-between align-items-start">
			<div className="flex-grow-1">{component.render()}</div>
			{
				!this.isRequired
					? <Button variant="danger" onClick={event => this.remove()}><i className="fas fa-times"/></Button>
					: undefined
			}
		</div>
	}

	renderEmpty() {
		return <div><Button variant="primary" onClick={event => this.add()}><i className="fas fa-plus"/></Button></div>
	}

	render() {
		const component = this.props.slot.current;

		return <ListGroupItem>
			<label>{humanReadable(this.props.slot.path)}</label>
			{component ? this.renderForm(component) : this.renderEmpty()}
		</ListGroupItem>;
	}
}
