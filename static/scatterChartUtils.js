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

const basePointFormatter = (xProp, yProp) => point => _.assignIn(point, { x: point[xProp], y: point[yProp] });

function formatScatterPoints(chartData, formatter = p => p, highlight = () => false, filter = () => false) {
  const data = [],
    pointBackgroundColor = [],
    pointRadius = [],
    pointHoverRadius = [],
    pointHitRadius = [];

  const highlighted = [];
  _.forEach(chartData, p => {
    let bg = "rgb(42, 145, 209)";
    let rad = 3,
      hoverRad = 4,
      hitRad = 1; // Chart.js default values
    const isHighlighted = highlight(p);
    if (isHighlighted) {
      bg = "#b73333";
      rad = 5;
      hoverRad = 6;
      hitRad = 6;
    }

    if (filter(p)) {
      rad = hoverRad = hitRad = 0;
    }
    const d = formatter(p);
    if (isHighlighted) {
      highlighted.push({ bg, rad, hoverRad, hitRad, d });
      return;
    }

    pointBackgroundColor.push(bg);
    pointRadius.push(rad);
    pointHoverRadius.push(hoverRad);
    pointHitRadius.push(hitRad);
    data.push(d);
  });

  // highlighted items in the fore-front
  _.forEach(highlighted, h => {
    const { bg, rad, hoverRad, hitRad, d } = h;
    pointBackgroundColor.push(bg);
    pointRadius.push(rad);
    pointHoverRadius.push(hoverRad);
    pointHitRadius.push(hitRad);
    data.push(d);
  });

  return {
    data,
    pointBackgroundColor,
    pointRadius,
    pointHoverRadius,
    pointHitRadius,
    pointHoverBackgroundColor: pointBackgroundColor,
  };
}

function getScatterMin(data, prop = null) {
  const min = _.min(_.isNull(prop) ? data : _.map(data, prop));
  return _.floor(min + (min % 1 ? 0 : -1)) - 0.5;
}

function getScatterMax(data, prop = null) {
  const max = _.max(_.isNull(prop) ? data : _.map(data, prop));
  return _.ceil(max + (max % 1 ? 0 : 1)) + 0.5;
}

export { basePointFormatter, formatScatterPoints, getScatterMin, getScatterMax };
