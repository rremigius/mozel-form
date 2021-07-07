import React from "react";
import ListGroupItem from "react-bootstrap/ListGroupItem";
import {humanReadable} from "./utils";
import ComponentSlot from "mozel-component/dist/Component/ComponentSlot";
import {ReactView} from "mozel-component";

type Props = {
	slot:ComponentSlot<ReactView>
};
type State = {};
export default class ComponentSlotForm extends React.Component<Props, State> {
	constructor(props:Props) {
		super(props);
		this.state = {};
	}

	render() {
		const component = this.props.slot.current;

		return <ListGroupItem>
			<label>{humanReadable(this.props.slot.path)}</label>
			<div className="ms-2">
				{
					component
						? component.render()
						: <div>...</div>
				}
			</div>
		</ListGroupItem>;
	}
}
