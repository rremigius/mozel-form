import Mozel, {Collection, collection, property} from "mozel";
import MozelForm from "../../src/MozelForm";

class BarModel extends Mozel {
	@property(Number)
	number?:number;
}

class FooModel extends Mozel {
	@property(String)
	name?:string;

	@property(BarModel)
	bar?:BarModel;

	@collection(BarModel)
	bars!:Collection<BarModel>;
}

const model = FooModel.create<FooModel>({
	name: 'foo',
	bar: {
		number: 123
	},
	bars: [{number: 1}, {number: 12}]
});
const form = MozelForm.create<MozelForm>(model);
form.mount(document.getElementById('form')!);

console.log(model);
console.log(form);
