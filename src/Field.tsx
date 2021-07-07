import React from "react";
import {humanReadable, isBoolean} from "./utils";
import ListGroupItem from "react-bootstrap/ListGroupItem";
import InputGroup from "react-bootstrap/InputGroup";
import FormControl from "react-bootstrap/FormControl";
import {primitive} from "validation-kit";

type Props = {
	onChange?:(newValue:primitive)=>void;
	label?:string;
	value?:primitive
};
type State = {};
export default class Field extends React.Component<Props, State> {
	constructor(props:Props) {
		super(props);
		this.state = {};
	}

	change(newValue:primitive) {
		if(this.props.onChange) this.props.onChange(newValue);
	}

	render() {
		const label = this.props.label ? humanReadable(this.props.label) : undefined;
		const value = isBoolean(this.props.value)
			? this.props.value ? "true" : "false"
			: (this.props.value || "").toString();

		return <ListGroupItem>
			<InputGroup>
				{ label ? <label>{label}</label> : undefined }
				<FormControl
					aria-label={label}
					value={value}
					onChange={event => this.change(event.currentTarget.value)}
				/>
			</InputGroup>
		</ListGroupItem>
	}
}
