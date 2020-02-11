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
import * as popsicle from "popsicle";

function logException(e, callStack) {
  console.error(`${e.name}: ${e.message} (${e.fileName}:${e.lineNumber})`);
  console.error(e.stack);
  console.error(callStack);
}

// Useful for libraries that want a Promise.
function fetchJsonPromise(url) {
  return popsicle.fetch(url).then(response => response.json());
}

// Load JSON from `url`, then call `callback` with the JSON-decoded
// result. Most of the time, this is the function you'll want.
function fetchJson(url, callback) {
  const callStack = new Error().stack;
  fetchJsonPromise(url)
    .then(result => {
      callback(result);
    })
    .catch(e => logException(e, callStack));
}

export { logException, fetchJsonPromise, fetchJson };
