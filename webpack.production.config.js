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

const assign = require("lodash/assign");
const webpack = require("webpack");
const TerserPlugin = require("terser-webpack-plugin");
const _ = require("lodash");
const baseConfig = require("./webpack.config.js");

function createConfig(subConfig) {
  return assign({}, subConfig, {
    mode: "production",
    devtool: "source-map",
    optimization: {
      minimizer: [
        new TerserPlugin({
          parallel: false,
          terserOptions: {
            warnings: false,
          },
        }),
      ],
    },
    plugins: [
      new webpack.DefinePlugin({
        "process.env": {
          NODE_ENV: '"production"',
        },
      }),
    ],
  });
}

module.exports = _.map(baseConfig, createConfig);
