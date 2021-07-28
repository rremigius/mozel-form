import React from "react";
import {uniqueId} from "./utils";
import {primitive} from "validation-kit";
import Form from "react-bootstrap/Form";
import {PropertyType} from "mozel/dist/Property";
import Alert from "react-bootstrap/Alert";

type Props = {
	type?:PropertyType|string;
	onChange?:(newValue:primitive)=>void;
	label?:string;
	value?:primitive;
	error?:string;
	disabled?:boolean;
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
		value = value !== undefined ? value : false;

		return <div className="form-check form-switch">
			<input
				aria-label={label}
				type="checkbox"
				id={uniqueId("switch-")}
				className="form-check-input"
				checked={value as boolean || false}
				onChange={event => this.change(event.currentTarget.checked)}
				disabled={this.props.disabled}
			/>
		</div>
	}

	renderString(value?:primitive, label?:string) {
		value = value !== undefined ? value : "";

		return <Form.Control
			type="text"
			aria-label={label}
			value={value as string}
			onChange={event => this.change(event.currentTarget.value)}
			disabled={this.props.disabled}
		/>
	}

	renderNumber(value?:primitive, label?:string) {
		value = value !== undefined ? value : "";

		return <Form.Control
			type="number"
			aria-label={label}
			value={value as number}
			onChange={event => this.change(event.currentTarget.value)}
			disabled={this.props.disabled}
		/>
	}

	renderTextArea(value?:primitive, label?:string) {
		value = value !== undefined ? value : "";
		return <Form.Control
			as="textarea"
			aria-label={label}
			value={value as string}
			onChange={event => this.change(event.currentTarget.value)}
			disabled={this.props.disabled}
		/>
	}

	render() {
		const label = this.props.label;
		let field:JSX.Element;

		switch(this.props.type) {
			case Boolean:
			case 'boolean': field = this.renderBoolean(this.props.value, label); break;
			case Number:
			case 'number': field = this.renderNumber(this.props.value, label); break;
			case 'textarea': field = this.renderTextArea(this.props.value, label); break;
			case String:
			case 'string':
			default: field = this.renderString(this.props.value, label); break;
		}

		return <div className="mozel-form-field">
			{ label ? <Form.Label>{label}</Form.Label> : undefined }
			{ field }
			{ this.props.error ? <Alert variant="danger">{this.props.error}</Alert> : undefined }
		</div>
	}
}
