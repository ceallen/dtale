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
import querystring from "querystring";

function init() {
  return dispatch => dispatch({ type: "init-params" });
}

function toggleColumnMenu(colName, toggleId) {
  return dispatch => dispatch({ type: "toggle-column-menu", colName, toggleId });
}

function hideColumnMenu(colName) {
  return (dispatch, getState) => {
    const { selectedCol } = getState();
    // when clicking another header cell it calls this after the fact and thus causes the user to click again to show it
    if (selectedCol == colName) {
      dispatch({ type: "hide-column-menu", colName });
    }
  };
}

function closeColumnMenu() {
  return (dispatch, getState) => dispatch({ type: "hide-column-menu", colName: getState().selectedCol });
}

function isPopup() {
  return _.startsWith(window.location.pathname, "/dtale/popup");
}

function isJSON(str) {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
}

function getParams() {
  const params = {};
  const queryParams = querystring.parse(window.location.search.replace(/^.*\?/, ""));
  _.forEach(queryParams, (value, key) => {
    if (value) {
      if (_.includes(value, ",") && !isJSON(value)) {
        value = value.split(",");
      }
      params[key] = value;
    }
  });
  return params;
}

export default { init, toggleColumnMenu, hideColumnMenu, closeColumnMenu, isPopup, getParams };
