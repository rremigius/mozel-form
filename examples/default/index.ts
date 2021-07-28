import Mozel, {Collection, collection, property, required, reference} from "mozel";
import MozelForm from "../../src/MozelForm";
import Component from "mozel-component";

class BarModel extends Mozel {
	@property(Number)
	number?:number;
}

class FooModel extends Mozel {
	@property(String)
	declare name?:string;

	@property(Boolean)
	declare active?:boolean;

	@collection(Number)
	declare numbers:Collection<number>;

	@property(BarModel, {required})
	declare bar:BarModel;

	@collection(BarModel)
	declare bars:Collection<BarModel>;

	@property(FooModel)
	declare recursion?:FooModel;

	@collection(FooModel, {reference})
	declare references:Collection<FooModel>

	@property(FooModel, {reference})
	declare reference?:FooModel
}

const model = FooModel.create<FooModel>({
	gid: 'root',
	name: 'foo',
	active: true,
	bar: {
		number: 123
	},
	bars: [{number: 1}, {number: 12}],
	numbers: [1],
	references: [{gid: 'root'}],
	reference: {gid: 'root'}
});

class FooForm extends MozelForm {
	static Model = FooModel;
	static definition = {
		fields: [
			{property: 'name', input: 'textarea'},
			{property: 'bar', startExpanded: true, disabled: true},
			'bars', 'numbers', 'references', 'reference'
		]
	}
}
const factory = FooForm.createFactory();
factory.register(FooForm);

const form = factory.create<FooForm>(model);
form.mount(document.getElementById('form')!);
form.setExpanded(true);

console.log(model);
console.log(form);
