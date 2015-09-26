var path = require('path'),
	webpack = require('webpack');

module.exports = {
	context: path.join(__dirname, "/js"),
	entry: "./main",
	output: {
		path: path.join(__dirname, "dist"),
		filename: "main.js"
	},
	module: {
		loaders: [
			{ test: /\.jsx?$/, exclude: /node_modules/, loader: "babel-loader" },
			{ test: /backbone\.js$/, loader: 'imports?define=>false' }
		]
	},
	plugins: [
		new webpack.IgnorePlugin(/^jquery$/)
	],
	resolve: {
		extensions: ['', '.js', '.jsx']
	}

};
