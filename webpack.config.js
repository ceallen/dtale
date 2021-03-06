/*
Copyright (C) 2020 

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 2.0 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.

Please see the README.md in the project root directory for a list
of all authors for this project.
*/
/* eslint-disable no-restricted-globals */
const webpack = require("webpack");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const autoprefixer = require("autoprefixer");
const postcssNested = require("postcss-nested");
const _ = require("lodash");
const path = require("path");

const entries = [
  ["base_styles", "./static/base_styles.js"],
  ["polyfills", "./static/polyfills.js"],
  ["dtale", "./static/dtale/dtale_main.jsx"],
  ["charts_popup", "./static/popups/window/charts_popup_main.jsx"],
  ["correlations_popup", "./static/popups/window/correlations_popup_main.jsx"],
  ["describe_popup", "./static/popups/window/describe_popup_main.jsx"],
  ["histogram_popup", "./static/popups/window/histogram_popup_main.jsx"],
  ["instances_popup", "./static/popups/window/instances_popup_main.jsx"],
];

function createConfig(entry) {
  const entryName = entry[0];
  const entryPath = entry[1];
  return {
    devtool: "inline-source-map",
    mode: "development",
    entry: path.resolve(__dirname, entryPath),
    output: {
      path: path.resolve(__dirname, "./dtale/static/dist"),
      filename: entryName + "_bundle.js",
      publicPath: "/dist/",
    },
    resolve: {
      extensions: [".js", ".jsx", ".css", ".scss"],
    },
    module: {
      rules: [
        {
          test: /.jsx?$/,
          loader: "babel-loader",
          exclude(file) {
            // popsicle's code is not IE compliant so we need to run it through the babel plugins
            if (file.startsWith(__dirname + "/node_modules/@servie")) {
              return false;
            }
            if (file.startsWith(__dirname + "/node_modules/servie")) {
              return false;
            }
            if (file.startsWith(__dirname + "/node_modules/popsicle")) {
              return false;
            }
            return file.startsWith(__dirname + "/node_modules");
          },
          query: {
            cacheDirectory: true,
            presets: ["@babel/env", "@babel/react", "@babel/flow"],
            plugins: ["@babel/plugin-proposal-class-properties", "@babel/plugin-transform-classes"],
          },
        },
        {
          test: require.resolve("jquery"),
          use: [
            { loader: "expose-loader", options: "jQuery" },
            { loader: "expose-loader", options: "$" },
          ],
        },
        {
          test: /\.css$/,
          use: [
            "style-loader",
            { loader: "css-loader", options: { importLoaders: 1 } },
            {
              loader: "postcss-loader",
              options: {
                plugins() {
                  return [postcssNested, autoprefixer];
                },
              },
            },
          ],
        },
        {
          test: /\.scss$/,
          use: ["style-loader", "css-loader", "sass-loader"],
        },
        {
          test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
          loader: "url-loader",
          options: { limit: 10000, mimetype: "image/svg+xml" },
        },
        {
          test: /\.(woff|woff2)(\?v=\d+\.\d+\.\d+)?$/,
          loader: "url-loader",
          options: { limit: 10000, mimetype: "application/font-woff" },
        },
        {
          test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
          loader: "url-loader",
          options: { limit: 10000, mimetype: "application/octet-stream" },
        },
        {
          test: /\.png(\?v=\d+\.\d+\.\d+)?$/,
          loader: "url-loader",
          options: { limit: 10000, mimetype: "image/png" },
        },
        {
          test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
          loader: "file-loader",
        },
      ],
    },
    plugins: [
      new webpack.DefinePlugin({
        "process.env": {
          NODE_ENV: '"dev"',
        },
      }),
      new CleanWebpackPlugin({
        cleanOnceBeforeBuildPatterns: [entryName + "_bundle.js"],
        cleanAfterEveryBuildPatterns: [entryName + "_bundle.js"],
        verbose: true,
        exclude: [".git_keep"],
      }),
      new webpack.HotModuleReplacementPlugin(),
    ],
    externals: {
      window: "window",
      HTMLElement: "HTMLElement",
    },
    watchOptions: {
      poll: true,
    },
  };
}

module.exports = _.map(entries, createConfig);
