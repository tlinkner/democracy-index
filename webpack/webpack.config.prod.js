const path = require('path');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const webpack = require('webpack');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = merge(common, {
	plugins:[
		new webpack.DefinePlugin({
			'process.env': {'NODE_ENV':JSON.stringify('production')}
		}),
    new CopyPlugin([
      { from: 'dist', to: "/Users/todd/Projects/democracy-index/docs" }
    ])
	],
	optimization: {
		minimizer: [new UglifyJSPlugin()]
	}
});