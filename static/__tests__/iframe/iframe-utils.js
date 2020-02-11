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

import { ReactColumnMenu as ColumnMenu } from "../../dtale/iframe/ColumnMenu";

function findColMenuButton(result, name, btnTag = "button") {
  return result
    .find(ColumnMenu)
    .find(`ul li ${btnTag}`)
    .findWhere(b => _.includes(b.text(), name));
}

function clickColMenuButton(result, name, btnTag = "button") {
  findColMenuButton(result, name, btnTag)
    .first()
    .simulate("click");
}

function clickColMenuSortButton(result, dir) {
  result
    .find(ColumnMenu)
    .find("ul li div.column-sorting")
    .first()
    .find("button")
    .findWhere(b => _.includes(b.text(), dir))
    .first()
    .simulate("click");
}

export { findColMenuButton, clickColMenuButton, clickColMenuSortButton };
