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
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import Collapse from "react-bootstrap/Collapse";

type Props = {
	collection:Collection<primitive>
};
type State = {
	expanded:boolean
};

export default class CollectionForm extends React.Component<Props, State> {
	constructor(props:Props) {
		super(props);
		this.state = {
			expanded: false
		};
	}

	add() {
		this.props.collection.addDefault();
	}

	remove(index:number) {
		this.props.collection.removeIndex(index);
	}

	toggle() {
		this.setState({expanded: !this.state.expanded});
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
			const error = this.props.collection.errors[index];
			return <ListGroupItem className="d-flex justify-content-between align-items-start" key={this.getKey(item, index)}>
				<div className="flex-grow-1">
					<Field
						type={this.props.collection.getType()}
						value={this.valueToString(item)}
						onChange={newValue => this.change(index, newValue)}
						error={error ? error.message : undefined}
					/>
				</div>
				<Button variant="danger" onClick={() => this.remove(index)}><i className="fas fa-times"/></Button>
			</ListGroupItem>
		});

		return <div className="collection-form">
			<Button variant="light" onClick={() => this.toggle()} className="text-start d-block w-100">
				<FontAwesomeIcon icon={this.state.expanded ? 'caret-down' : 'caret-right'} className="me-2"/>
				{humanReadable(this.props.collection.relation)}
			</Button>
			<Collapse in={this.state.expanded}>
				<div>
					{elements}
					<ListGroupItem className="d-flex justify-content-between align-items-start">
						<Button variant="primary" onClick={event => this.add()}><i className="fas fa-plus"/></Button>
					</ListGroupItem>
				</div>
			</Collapse>
		</div>;
	}

	componentDidMount() {
		const debouncedUpdate = debounce(this.forceUpdate.bind(this));
		this.props.collection.on(CollectionChangedEvent, ()=>debouncedUpdate());
	}
}
