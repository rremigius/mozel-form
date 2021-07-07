import React from "react";
import {debounce, humanReadable, isBoolean, isString} from "./utils";

import '@fortawesome/fontawesome-free/js/fontawesome'
import '@fortawesome/fontawesome-free/js/solid'
import '@fortawesome/fontawesome-free/js/regular'

import ListGroup from "react-bootstrap/ListGroup";
import ListGroupItem from "react-bootstrap/ListGroupItem";
import Button from "react-bootstrap/Button";
import Mozel, {Collection} from "mozel";
import {primitive} from "validation-kit";
import {CollectionChangedEvent} from "mozel/dist/Collection";
import Field from "./Field";

type Props = {
	collection:Collection<primitive>
};
type State = {};

export default class CollectionForm extends React.Component<Props, State> {
	constructor(props:Props) {
		super(props);
		this.state = {};
	}

	add() {
		this.props.collection.addDefault();
	}

	remove(index:number) {
		this.props.collection.removeIndex(index);
	}

	getKey(item:Mozel|primitive, index:number) {
		if(item instanceof Mozel) {
			return item.gid;
		}
		return index + item.toString();
	}

	change(index:number, newValue:primitive) {
		this.props.collection.set(index, newValue, true);
	}

	valueToString(value:primitive) {
		if(isBoolean(value)) return value ? "true" : "false";
		return value.toString();
	}

	render() {
		const elements = this.props.collection.map((item, index) => {
			return <ListGroupItem className="d-flex justify-content-between align-items-start" key={this.getKey(item, index)}>
				<div className="flex-grow-1">
					<Field value={this.valueToString(item)} onChange={newValue => this.change(index, newValue)}/>
				</div>
				<Button variant="danger" onClick={event => this.remove(index)}><i className="fas fa-times"/></Button>
			</ListGroupItem>
		});

		return <ListGroupItem>
			<label>{humanReadable(this.props.collection.relation)}</label>
			<ListGroup className="ms-2">
				{elements}
				<ListGroupItem className="d-flex justify-content-between align-items-start">
					<Button variant="primary" onClick={event => this.add()}><i className="fas fa-plus"/></Button>
				</ListGroupItem>
			</ListGroup>
		</ListGroupItem>;
	}

	componentDidMount() {
		const debouncedUpdate = debounce(this.forceUpdate.bind(this));
		this.props.collection.on(CollectionChangedEvent, ()=>debouncedUpdate());
	}
}
