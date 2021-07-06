const path = require('path');

const demo = process.env.DEMO || 'default';
console.log(`Building ${demo}...`);

module.exports = {
	entry: `./examples/${demo}/index.ts`,
	mode: "development",
	devtool: "eval-source-map",
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				use: 'ts-loader',
				exclude: /node_modules/,
			},
			{
				test: /\.css$/i,
				use: ["style-loader", "css-loader"],
			}
		],
	},
	resolve: {
		extensions: ['.tsx', '.ts', '.js'],
	},
	output: {
		filename: 'bundle.js',
		path: path.resolve(__dirname, `./examples/${demo}`),
	},
};
