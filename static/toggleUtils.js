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
import $ from "jquery";

function buildButton(active, activate, disabled = false) {
  return { className: `btn btn-primary ${active ? "active" : ""}`, onClick: active ? _.noop : activate, disabled };
}

function toggleBouncer(ids) {
  _.forEach(ids, id => $("#" + id).toggle());
}

export { buildButton, toggleBouncer };
