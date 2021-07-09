import Mozel, {Collection, collection, property, required, reference} from "mozel";
import MozelForm from "../../src/MozelForm";
import Component from "mozel-component";

class BarModel extends Mozel {
	@property(Number)
	number?:number;
}

class FooModel extends Mozel {
	@property(String)
	name?:string;

	@property(Boolean)
	active?:boolean;

	@collection(Number)
	numbers!:Collection<number>;

	@property(BarModel, {required})
	bar!:BarModel;

	@collection(BarModel)
	bars!:Collection<BarModel>;

	@property(FooModel)
	recursion?:FooModel;

	@collection(FooModel, {reference})
	references!:Collection<FooModel>

	@property(FooModel, {reference})
	reference?:FooModel
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

const factory = MozelForm.createFactory();
factory.register(MozelForm);

const form = factory.createAndResolveReferences<MozelForm>(model);
form.mount(document.getElementById('form')!);
form.setExpanded(true);

console.log(model);
console.log(form);
