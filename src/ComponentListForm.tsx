import React from "react";
import {debounce, humanReadable} from "./utils";
import ComponentList from "mozel-component/dist/Component/ComponentList";
import {ReactView} from "mozel-component";

import '@fortawesome/fontawesome-free/js/fontawesome'
import '@fortawesome/fontawesome-free/js/solid'
import '@fortawesome/fontawesome-free/js/regular'

import ListGroup from "react-bootstrap/ListGroup";
import ListGroupItem from "react-bootstrap/ListGroupItem";
import Button from "react-bootstrap/Button";

type Props = {
	list:ComponentList<ReactView>
};
type State = {};

export default class ComponentListForm extends React.Component<Props, State> {
	debouncedUpdate = debounce(()=>this.forceUpdate());
	list:ComponentList<ReactView>

	constructor(props:Props) {
		super(props);
		this.state = {};
		this.list = this.props.list;
	}

	get collection() {
		const collection = this.props.list.currentCollection;
		if(!collection) throw new Error(`Collection should not be undefined.`);
		return collection;
	}

	add() {
		this.collection.addDefault();
	}

	remove(index:number) {
		this.collection.removeIndex(index);
	}

	getKey(view:ReactView) {
		return view.model.gid;
	}

	render() {
		const elements = this.props.list.map((view, index) => {
			return <ListGroupItem className="d-flex justify-content-between align-items-start" key={this.getKey(view)}>
				<div className="flex-grow-1">{view.render()}</div>
				<Button variant="danger" onClick={event => this.remove(index)}><i className="fas fa-times"/></Button>
			</ListGroupItem>
		});

		return <ListGroupItem>
			<label>{humanReadable(this.props.list.path)}</label>
			<ListGroup className="ms-4">
				{elements}
				<ListGroupItem className="d-flex justify-content-between align-items-start">
					<Button variant="primary" onClick={event => this.add()}><i className="fas fa-plus"/></Button>
				</ListGroupItem>
			</ListGroup>
		</ListGroupItem>;
	}

	componentDidMount() {
		// TS: update function does not use any callback so will be compatible anyway
		this.list.events.change.on(this.debouncedUpdate as any);
		this.list.events.add.on(this.debouncedUpdate as any);
		this.list.events.remove.on(this.debouncedUpdate as any);
	}

	componentWillUnmount() {
		this.list.events.change.off(this.debouncedUpdate as any);
		this.list.events.add.off(this.debouncedUpdate as any);
		this.list.events.remove.off(this.debouncedUpdate as any);
	}
}
