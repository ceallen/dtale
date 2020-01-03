import qs from "querystring";

import { mount } from "enzyme";
import _ from "lodash";
import React from "react";
import Select from "react-select";

import AxisEditor from "../../../popups/charts/AxisEditor";
import mockPopsicle from "../../MockPopsicle";
import * as t from "../../jest-assertions";
import { buildInnerHTML, withGlobalJquery } from "../../test-utils";

const originalOffsetHeight = Object.getOwnPropertyDescriptor(HTMLElement.prototype, "offsetHeight");
const originalOffsetWidth = Object.getOwnPropertyDescriptor(HTMLElement.prototype, "offsetWidth");

function updateChartType(result, cmp, chartType) {
  result
    .find(cmp)
    .find(Select)
    .first()
    .instance()
    .onChange({ value: chartType });
  result.update();
}

describe("Charts bar tests", () => {
  beforeAll(() => {
    Object.defineProperty(HTMLElement.prototype, "offsetHeight", {
      configurable: true,
      value: 500,
    });
    Object.defineProperty(HTMLElement.prototype, "offsetWidth", {
      configurable: true,
      value: 500,
    });

    const mockBuildLibs = withGlobalJquery(() =>
      mockPopsicle.mock(url => {
        const urlParams = qs.parse(url.split("?")[1]);
        if (urlParams.x === "error" && _.includes(JSON.parse(urlParams.y), "error2")) {
          return { data: {} };
        }
        const { urlFetcher } = require("../../redux-test-utils").default;
        return urlFetcher(url);
      })
    );

    const mockChartUtils = withGlobalJquery(() => (ctx, cfg) => {
      const chartCfg = { ctx, cfg, data: cfg.data, destroyed: false };
      chartCfg.destroy = () => (chartCfg.destroyed = true);
      chartCfg.getElementAtEvent = _evt => [{ _index: 0 }];
      chartCfg.update = _.noop;
      chartCfg.options = { scales: { xAxes: [{}] } };
      return chartCfg;
    });

    const mockD3Cloud = withGlobalJquery(() => () => {
      const cloudCfg = {};
      const propUpdate = prop => val => {
        cloudCfg[prop] = val;
        return cloudCfg;
      };
      cloudCfg.size = propUpdate("size");
      cloudCfg.padding = propUpdate("padding");
      cloudCfg.words = propUpdate("words");
      cloudCfg.rotate = propUpdate("rotate");
      cloudCfg.spiral = propUpdate("spiral");
      cloudCfg.random = propUpdate("random");
      cloudCfg.text = propUpdate("text");
      cloudCfg.font = propUpdate("font");
      cloudCfg.fontStyle = propUpdate("fontStyle");
      cloudCfg.fontWeight = propUpdate("fontWeight");
      cloudCfg.fontSize = () => ({
        on: () => ({ start: _.noop }),
      });
      return cloudCfg;
    });

    jest.mock("popsicle", () => mockBuildLibs);
    jest.mock("d3-cloud", () => mockD3Cloud);
    jest.mock("chart.js", () => mockChartUtils);
    jest.mock("chartjs-plugin-zoom", () => ({}));
    jest.mock("chartjs-chart-box-and-violin-plot/build/Chart.BoxPlot.js", () => ({}));
  });

  afterAll(() => {
    Object.defineProperty(HTMLElement.prototype, "offsetHeight", originalOffsetHeight);
    Object.defineProperty(HTMLElement.prototype, "offsetWidth", originalOffsetWidth);
  });

  test("Charts: rendering", done => {
    const Charts = require("../../../popups/charts/Charts").ReactCharts;
    const ChartsBody = require("../../../popups/charts/ChartsBody").default;
    buildInnerHTML({ settings: "" });
    const result = mount(<Charts chartData={{ visible: true }} dataId="1" />, {
      attachTo: document.getElementById("content"),
    });

    setTimeout(() => {
      result.update();
      const filters = result.find(Charts).find(Select);
      filters
        .first()
        .instance()
        .onChange({ value: "col4" });
      filters
        .at(1)
        .instance()
        .onChange([{ value: "col1" }]);
      updateChartType(result, ChartsBody, "bar");
      result
        .find(Charts)
        .find("button")
        .first()
        .simulate("click");
      setTimeout(() => {
        result.update();
        t.ok(result.find(ChartsBody).instance().state.charts.length == 1, "should render charts");
        const sortBtn = result
          .find(ChartsBody)
          .find("button")
          .findWhere(b => b.text() === "Sort Bars")
          .first();
        sortBtn.simulate("click");
        let axisEditor = result.find(AxisEditor).first();
        axisEditor.find("span.axis-select").simulate("click");
        axisEditor
          .find("input")
          .first()
          .simulate("change", { target: { value: "40" } });
        axisEditor
          .find("input")
          .last()
          .simulate("change", { target: { value: "42" } });
        axisEditor.instance().closeMenu();
        const chartObj = result.find(ChartsBody).instance().state.charts[0];
        t.deepEqual(chartObj.cfg.options.scales.yAxes[0].ticks, {
          min: 40,
          max: 42,
        });
        axisEditor = result.find(AxisEditor).first();
        axisEditor.find("span.axis-select").simulate("click");
        axisEditor
          .find("input")
          .first()
          .simulate("change", { target: { value: "40" } });
        axisEditor
          .find("input")
          .last()
          .simulate("change", { target: { value: "a" } });
        axisEditor.instance().closeMenu();
        axisEditor = result.find(AxisEditor).first();
        t.equal(axisEditor.instance().state.errors[0], "col1 has invalid max!");
        axisEditor
          .find("input")
          .last()
          .simulate("change", { target: { value: "39" } });
        axisEditor.instance().closeMenu();
        axisEditor = result.find(AxisEditor).first();
        t.equal(axisEditor.instance().state.errors[0], "col1 must have a min < max!");
        done();
      }, 400);
    }, 600);
  });
});
