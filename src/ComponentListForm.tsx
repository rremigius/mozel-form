import React from "react";
import {debounce, humanReadable} from "./utils";
import ComponentList from "mozel-component/dist/Component/ComponentList";

import '@fortawesome/fontawesome-free/js/fontawesome'
import '@fortawesome/fontawesome-free/js/solid'
import '@fortawesome/fontawesome-free/js/regular'
import ListGroupItem from "react-bootstrap/ListGroupItem";
import Button from "react-bootstrap/Button";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import Collapse from "react-bootstrap/Collapse";
import ReactView from "mozel-component/dist/View/ReactView";

type Props = {
	list:ComponentList<ReactView>
};
type State = {
	expanded:boolean
};

export default class ComponentListForm extends React.Component<Props, State> {
	debouncedUpdate = debounce(()=>{
		// Because of the debounce, it is possible that the component gets unmounted before next tick.
		if(this.unmount) this.stopListening();
		else this.forceUpdate();
	});
	list:ComponentList<ReactView>;
	unmount = false;

	constructor(props:Props) {
		super(props);
		this.state = {
			expanded: false
		};
		this.list = this.props.list;

		// TODO: implement componentDidUpdate
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

	toggle() {
		this.setState({expanded: !this.state.expanded});
	}

	getKey(view:ReactView) {
		return view.model.gid;
	}

	render() {
		const elements = this.props.list.map((view, index) => {
			const render = this.props.list.isReference
				? <div className="fst-italic pt-2">{view.model.$name}</div>
				: view.render();

			return <ListGroupItem className="d-flex justify-content-between align-items-start" key={this.getKey(view)}>
				<div className="flex-grow-1">{render}</div>
				<Button variant="danger" onClick={event => this.remove(index)}><i className="fas fa-times"/></Button>
			</ListGroupItem>
		});

		return <div className="component-list-form">
			<Button variant="light" onClick={() => this.toggle()} className="text-start d-block w-100">
				<FontAwesomeIcon icon={this.state.expanded ? 'caret-down' : 'caret-right'} className="me-2"/>
				{humanReadable(this.props.list.path)}
			</Button>
			<Collapse in={this.state.expanded}>
				<div>
					{elements}
					<ListGroupItem className="d-flex justify-content-between align-items-start">
						<Button variant="primary" onClick={() => this.add()}><i className="fas fa-plus"/></Button>
					</ListGroupItem>
				</div>
			</Collapse>
		</div>;
	}

	componentDidMount() {
		// TS: update function does not use any callback so will be compatible anyway
		this.list.events.change.on(this.debouncedUpdate as any);
		this.list.events.add.on(this.debouncedUpdate as any);
		this.list.events.remove.on(this.debouncedUpdate as any);
	}

	componentWillUnmount() {
		this.stopListening();
		this.unmount = true;
	}

	stopListening() {
		this.list.events.change.off(this.debouncedUpdate as any);
		this.list.events.add.off(this.debouncedUpdate as any);
		this.list.events.remove.off(this.debouncedUpdate as any);
	}
}
