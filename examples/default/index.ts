import Mozel, {Collection, collection, property, required} from "mozel";
import MozelForm from "../../src/MozelForm";

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
}

const model = FooModel.create<FooModel>({
	name: 'foo',
	active: true,
	bar: {
		number: 123
	},
	bars: [{number: 1}, {number: 12}],
	numbers: [1]
});
model.$strict = false;

const form = MozelForm.create<MozelForm>(model);
form.mount(document.getElementById('form')!);

console.log(model);
console.log(form);
