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
import _ from "lodash";

function chartData(state = { visible: false }, action = {}) {
  switch (action.type) {
    case "open-chart":
      return _.assign({ visible: true }, action.chartData);
    case "loaded-report-data":
    case "close-chart":
      return _.assign({ visible: false }, action.chartData);
  }
  return state;
}

export { chartData };
