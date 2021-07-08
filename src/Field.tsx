import React from "react";
import {uniqueId} from "./utils";
import ListGroupItem from "react-bootstrap/ListGroupItem";
import InputGroup from "react-bootstrap/InputGroup";
import {primitive} from "validation-kit";
import Form from "react-bootstrap/Form";
import Property, {PropertyType} from "mozel/dist/Property";

type Props = {
	type?:PropertyType;
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

	renderBoolean(value?:primitive, label?:string) {
		value = Property.parseValue(value, Boolean) as primitive;

		return <div className="form-check form-switch">
			<input
				aria-label={label}
				type="checkbox"
				id={uniqueId("switch-")}
				className="form-check-input"
				checked={value === true}
				onChange={event => this.change(event.currentTarget.checked)}
			/>
		</div>
	}

	renderString(value?:primitive, label?:string) {
		value = Property.parseValue(value, String) as string;

		return <Form.Control
			type="text"
			aria-label={label}
			value={value || ""}
			onChange={event => this.change(event.currentTarget.value)}
		/>
	}

	renderNumber(value?:primitive, label?:string) {
		value = Property.parseValue(value, Number) as number;

		return <Form.Control
			type="number"
			aria-label={label}
			value={value || ""}
			onChange={event => this.change(event.currentTarget.value)}
		/>
	}

	render() {
		const label = this.props.label;
		let field:JSX.Element;

		if(this.props.type === Boolean) {
			field = this.renderBoolean(this.props.value, label);
		} else if(this.props.type === Number) {
			field = this.renderNumber(this.props.value, label);
		} else {
			field = this.renderString(this.props.value, label);
		}

		return <ListGroupItem>
			<InputGroup>
				{ label ? <Form.Label>{label}</Form.Label> : undefined }
				{ field }
			</InputGroup>
		</ListGroupItem>
	}
}
