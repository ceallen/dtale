import _ from "lodash";
import React from "react";
import ReactDOM from "react-dom";

import actions from "../../actions/dtale";
import "../../adapter-for-react-16";
import app from "../../reducers/dtale";
import { ReactCorrelations as Correlations } from "../Correlations";

require("../../dtale/DataViewer.css");

const settingsElem = document.getElementById("settings");
const settings = settingsElem ? JSON.parse(settingsElem.value) : {};
const chartData = _.assignIn(actions.getParams(), { visible: true }, settings.query ? { query: settings.query } : {});
const dataId = app.getHiddenValue("data_id");

ReactDOM.render(<Correlations {...{ dataId, chartData }} />, document.getElementById("popup-content"));
