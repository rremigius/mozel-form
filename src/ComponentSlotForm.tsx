import React from "react";
import ListGroupItem from "react-bootstrap/ListGroupItem";
import {get, humanReadable, isPlainObject} from "./utils";
import ComponentSlot from "mozel-component/dist/Component/ComponentSlot";
import Button from "react-bootstrap/Button";
import Mozel from "mozel";
import Collapse from "react-bootstrap/Collapse";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import ReactView from "mozel-component/dist/View/ReactView";
import {FormDefinition} from "./MozelForm";

type Props = {
	slot:ComponentSlot<ReactView>
	field?:FormDefinition
};
type State = {
	expanded:boolean;
};
export default class ComponentSlotForm extends React.Component<Props, State> {
	readonly slot:ComponentSlot<ReactView>;
	readonly isRequired:boolean;

	constructor(props:Props) {
		super(props);
		this.state = {
			expanded: get(props.field, 'startExpanded', false)
		};

		this.slot = this.props.slot;
		this.isRequired = get(this.slot.model.static.$schema(), this.slot.path + '.$required', false);
	}

	remove() {
		this.props.slot.set(undefined);
	}

	add() {
		this.props.slot.set({} as Mozel); // {} will be accepted because of init (TODO in component-mozel)
	}

	toggle() {
		this.setState({expanded: !this.state.expanded});
	}

	renderForm(component:ReactView) {
		const field = isPlainObject(this.props.field) ? this.props.field : {};
		const render = this.props.slot.isReference
			? <span className="fst-italic">{component.model.$name}</span>
			: component.render(field)

		return <ListGroupItem className="d-flex justify-content-between align-items-start">
			<div className="flex-grow-1 pt-2">{ render }</div>
			{
				!this.isRequired
					? <Button variant="danger" onClick={() => this.remove()}><FontAwesomeIcon icon="times"/></Button>
					: undefined
			}
		</ListGroupItem>
	}

	renderEmpty() {
		return <div><Button variant="primary" onClick={() => this.add()}>
			<FontAwesomeIcon icon="plus"/>
		</Button></div>
	}

	render() {
		const component = this.props.slot.current;

		return <div className="component-slot-form">
			<Button variant="light" onClick={() => this.toggle()} className="text-start d-block w-100">
				<FontAwesomeIcon icon={this.state.expanded ? 'caret-down' : 'caret-right'} className="me-2"/>
				{humanReadable(this.props.slot.path)}
			</Button>
			<Collapse in={this.state.expanded}>
				<div>
					{ component ? this.renderForm(component) : this.renderEmpty() }
				</div>
			</Collapse>
		</div>;
	}
}
