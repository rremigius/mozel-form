import React from "react";
import {humanReadable} from "./utils";
import ListGroup from "react-bootstrap/ListGroup";
import ComponentList from "mozel-component/dist/Component/ComponentList";
import ListGroupItem from "react-bootstrap/ListGroupItem";
import {ReactView} from "mozel-component";

type Props = {
	list:ComponentList<ReactView>
};
type State = {};

export default class MozelCollectionForm extends React.Component<Props, State> {
	constructor(props:Props) {
		super(props);
		this.state = {};
	}

	render() {
		const elements = this.props.list.current
			.map((view, key) => {
				return <ListGroupItem key={key}>
					{view.render()}
				</ListGroupItem>
			});

		return <ListGroupItem>
			<label>{humanReadable(this.props.list.path)}</label>
			<ListGroup className="ms-2">
				{elements}
			</ListGroup>
			<ListGroup className="d-flex justify-content-between align-items-start">

			</ListGroup>
		</ListGroupItem>;
	}
}
