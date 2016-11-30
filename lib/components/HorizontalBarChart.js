"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _underscore = require("underscore");

var _underscore2 = _interopRequireDefault(_underscore);

var _pondjs = require("pondjs");

var _TimeSeriesRow = require("./TimeSeriesRow");

var _TimeSeriesRow2 = _interopRequireDefault(_TimeSeriesRow);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
The HorizontalBarChart takes a list of `TimeSeries` objects and displays a bar chart
visualization summarizing those. As an example, let's say we have a set of interfaces, which
together carry the entire network traffic to a particular location. We want to see which
interfaces contribute the most to the total traffic.

To display this we render the HorizontalBarChart in our page:
 
    <HorizontalBarChart
        display="range"
        seriesList={interfaces}
        columns={["out", "in"]}
        top={5} sortBy="max"
        timestamp={this.state.tracker}
        format={formatter}
        selected={this.state.selected}
        onSelectionChanged={this.handleSelectionChange}
        selectionColor="#37B6D3"
        style={[{fill: "#1F78B4"}, {fill: "#FF7F00"}]} />

Our first prop `display` tells the component how to draw the bars. In this case we use the
"range", which will draw from min to max (with additional drawing to show 1 stdev away from
the center).

Next we specify the `seriesList` itself. This should be an array of Pond TimeSeries objects.

The `columns` prop tells us which columns within the TimeSeries should be displayed as a bar.
In this case we have `in` and `out` traffic columns, so we'll get two bars for each series.

`top` and `sortBy` are used to order and trim the list of TimeSeries. Here we order by the max
values in the specified columns, then just display the top 5.

The `timestamp` lets the component know the current value. You could display the last timestamp
in the series, or perhaps a time being interacted with in the UI.

The `format` can either be a d3 format string of a function. In this case we have our own
formatter function to display values:

    function formatter(value) {
        const prefix = d3.formatPrefix(value);
        return `${prefix.scale(value).toFixed()} ${prefix.symbol}bps`;
    }

Selection is handled with `selected`, which gives the name of the TimeSeries currently selected.
If the user selects a different row the callback passed to `onSelectionChanged` will be called
with the name of the TimeSeries represented in the newly selected row. We also specify a color
to mark the selected item with the `selectionColor` prop.

Next we specify the `style`. This is the css style of each column's bars. Typically you would
just want to specify the fill color. Each bar is a svg rect.

*/
/**
 *  Copyright (c) 2016, The Regents of the University of California,
 *  through Lawrence Berkeley National Laboratory (subject to receipt
 *  of any required approvals from the U.S. Dept. of Energy).
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree.
 */

exports.default = _react2.default.createClass({

    displayName: "HorizontalBarChart",

    propTypes: {

        /**
         * Sort by either "max", "avg" or "name"
         */
        display: _react2.default.PropTypes.oneOf(["avg", "max", "range"]),

        /**
         * A list of [TimeSeries](http://software.es.net/pond#timeseries) objects to visualize
         */
        seriesList: _react2.default.PropTypes.arrayOf(_react2.default.PropTypes.instanceOf(_pondjs.TimeSeries)).isRequired,

        /**
         * Columns in each timeseries to display
         */
        columns: _react2.default.PropTypes.arrayOf(_react2.default.PropTypes.string),

        /**
         * Sort by either "name", "max", or "avg"
         */
        sortBy: _react2.default.PropTypes.oneOf(["name", "max", "avg"]),

        /**
         * Display only the top n
         */
        top: _react2.default.PropTypes.number,

        /**
         * The height or thickness of each bar
         */
        size: _react2.default.PropTypes.number,

        /**
         * The spacing between each bar (column) of the series
         */
        spacing: _react2.default.PropTypes.number,

        /**
         * The spacing above and below each series
         */
        padding: _react2.default.PropTypes.number,

        /**
         * The width of the label area
         */
        labelWidth: _react2.default.PropTypes.number,

        /**
         * Callback for when the selection changes. The callback function will be called
         * with the name of the TimeSeries selected.
         */
        onSelectionChanged: _react2.default.PropTypes.func,

        /**
         * Specify which TimeSeries is selected by providing the name of the selected
         * series.
         */
        selected: _react2.default.PropTypes.string,

        /**
         * Color to mark the selected row with.
         */
        selectionColor: _react2.default.PropTypes.string,

        /**
         * Renders the series name as a link and calls this callback function when it is clicked.
         */
        onNavigate: _react2.default.PropTypes.func,

        /**
         * Color to render the series name if navigate is enabled
         */
        navigateColor: _react2.default.PropTypes.string,

        /**
         * The format is used to format the display text for the bar. It can be specified as a d3
         * format string (such as ".2f") or a function. The function will be called with the value
         * and should return a string.
         */
        format: _react2.default.PropTypes.oneOfType([_react2.default.PropTypes.func, _react2.default.PropTypes.string]),

        /**
         * A single child which will be rendered when the item is selected. The child will have
         * a couple of additional props injected onto it when rendered:
         *  * `series` - the TimeSeries of the row being rendered
         *  * `timestamp` - the current timestamp being shown
         */
        children: _react2.default.PropTypes.element
    },

    getDefaultProps: function getDefaultProps() {
        return {
            display: "avg",
            size: 14,
            spacing: 2,
            padding: 5,
            labelWidth: 240,
            style: [{ fill: "steelblue" }],
            seriesList: [],
            columns: ["value"],
            sortBy: "max",
            selectionColor: "steelblue",
            navigateColor: "steelblue"
        };
    },
    renderRows: function renderRows(seriesList) {
        var _this = this;

        var max = 0;

        var _props = this.props,
            columns = _props.columns,
            spacing = _props.spacing,
            padding = _props.padding,
            size = _props.size,
            style = _props.style,
            format = _props.format,
            display = _props.display,
            timestamp = _props.timestamp,
            onSelectionChanged = _props.onSelectionChanged,
            selectionColor = _props.selectionColor,
            onNavigate = _props.onNavigate,
            navigateColor = _props.navigateColor;

        //
        // Get the max value in the series list, for overall scale
        //

        seriesList.forEach(function (series) {
            _this.props.columns.forEach(function (column) {
                var smax = series.max(column);
                if (smax > max) max = smax;
            });
        });

        //
        // Get the 0 or 1 children for the expanded area
        //

        var child = void 0;
        if (_react2.default.Children.count(this.props.children) === 1) {
            child = _react2.default.Children.only(this.props.children);
        }

        //
        // Render a <RowStack> for each series in the seriesList
        //

        return seriesList.map(function (series, i) {
            return _react2.default.createElement(_TimeSeriesRow2.default, {
                key: i,
                rowNumber: i,
                series: series,
                display: display,
                max: max,
                selected: _this.props.selected === series.name(),
                onSelectionChanged: onSelectionChanged,
                selectionColor: selectionColor,
                onNavigate: onNavigate,
                navigateColor: navigateColor,
                columns: columns,
                spacing: spacing,
                padding: padding,
                size: size,
                style: style,
                format: format,
                timestamp: timestamp,
                child: child });
        });
    },
    render: function render() {
        var _this2 = this;

        //
        // Sort the list by the criteria specified in the "sortBy" prop:
        // name, avg or max.
        //

        var sortedList = _underscore2.default.sortBy(this.props.seriesList, function (series) {
            switch (_this2.props.sortBy) {
                case "name":
                    return series.name;
                case "avg":
                    return -_underscore2.default.reduce(_this2.props.columns.map(function (column) {
                        return series.avg(column);
                    }), function (memo, num) {
                        return memo + num;
                    }, 0);
                case "max":
                    return -_underscore2.default.max(_this2.props.columns.map(function (column) {
                        return series.max(column);
                    }));
                default:
                    throw new Error("unknown sort prop", _this2.props.sortBy);
            }
        });

        //
        // Keep just the top n, where n is specified by the "top" prop.
        //

        var list = this.props.top ? sortedList.slice(0, this.props.top) : sortedList;

        var containerStyle = {
            borderBottomStyle: "solid",
            borderBottomWidth: 1,
            borderBottomColor: "#DFDFDF"
        };

        return _react2.default.createElement(
            "div",
            { style: containerStyle },
            this.renderRows(list)
        );
    }
});