import React from "react";
import ListGroupItem from "react-bootstrap/ListGroupItem";
import {get, humanReadable} from "./utils";
import ComponentSlot from "mozel-component/dist/Component/ComponentSlot";
import {ReactView} from "mozel-component";
import Button from "react-bootstrap/Button";
import Mozel from "mozel";
import Collapse from "react-bootstrap/Collapse";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

type Props = {
	slot:ComponentSlot<ReactView>
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
			expanded: false
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
		return <div className="ms-4 d-flex justify-content-between align-items-start">
			<div className="flex-grow-1">{component.render({startExpanded: true})}</div>
			{
				!this.isRequired
					? <Button variant="danger" onClick={() => this.remove()}><FontAwesomeIcon icon="times"/></Button>
					: undefined
			}
		</div>
	}

	renderEmpty() {
		return <div><Button variant="primary" onClick={() => this.add()}>
			<FontAwesomeIcon icon="plus"/>
		</Button></div>
	}

	render() {
		const component = this.props.slot.current;

		return <ListGroupItem>
			<Button variant="light" onClick={() => this.toggle()} className="text-start d-block w-100">
				<FontAwesomeIcon icon={this.state.expanded ? 'caret-down' : 'caret-right'} className="me-2"/>
				{humanReadable(this.props.slot.path)}
			</Button>
			<Collapse in={this.state.expanded}>
				<div> {/* Extra div required to prevent mixing of collapse classes and child element classes */}
					{component ? this.renderForm(component) : this.renderEmpty()}
				</div>
			</Collapse>
		</ListGroupItem>;
	}
}
