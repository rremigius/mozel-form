// Utils file makes it easier to import (lodash is not autocompleted)
export {
	isString,
	get,
	isArray,
	isNumber,
	isNil,
	isEmpty,
	isPlainObject,
	isBoolean,
	uniqueId,
	capitalize,
	forEach,
	isFunction,
	has,
	debounce
} from "lodash";

export function humanReadable(name:string) {
	return name.replace(/[A-Z]/, match => ' ' + match)
		.replace(/^[a-z]/, match => match.toUpperCase())
}
