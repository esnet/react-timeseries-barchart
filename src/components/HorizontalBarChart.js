/**
 *  Copyright (c) 2016, The Regents of the University of California,
 *  through Lawrence Berkeley National Laboratory (subject to receipt
 *  of any required approvals from the U.S. Dept. of Energy).
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree.
 */

import React from "react";
import _ from "underscore";
import { TimeSeries } from "pondjs";
import TimeSeriesRow from "./TimeSeriesRow";

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
export default React.createClass({

    displayName: "HorizontalBarChart",

    propTypes: {

        /**
         * Sort by either "max", "avg" or "name"
         */
        display: React.PropTypes.oneOf(["avg", "max", "range"]),

        /**
         * A list of [TimeSeries](http://software.es.net/pond#timeseries) objects to visualize
         */
        seriesList: React.PropTypes.arrayOf(React.PropTypes.instanceOf(TimeSeries)).isRequired,

        /**
         * Columns in each timeseries to display
         */
        columns: React.PropTypes.arrayOf(React.PropTypes.string),

        /**
         * Sort by either "name", "max", or "avg"
         */
        sortBy: React.PropTypes.oneOf(["name", "max", "avg"]),

        /**
         * Display only the top n
         */
        top: React.PropTypes.number,

        /**
         * The height or thickness of each bar
         */
        size: React.PropTypes.number,

        /**
         * The spacing between each bar (column) of the series
         */
        spacing: React.PropTypes.number,

        /**
         * The spacing above and below each series
         */
        padding: React.PropTypes.number,

        /**
         * The width of the label area
         */
        labelWidth: React.PropTypes.number,

        /**
         * Callback for when the selection changes. The callback function will be called
         * with the name of the TimeSeries selected.
         */
        onSelectionChanged: React.PropTypes.func,

        /**
         * Specify which TimeSeries is selected by providing the name of the selected
         * series.
         */
        selected: React.PropTypes.string,

        /**
         * Color to mark the selected row with.
         */
        selectionColor: React.PropTypes.string,

        /**
         * Renders the series name as a link and calls this callback function when it is clicked.
         */
        onNavigate: React.PropTypes.func,

        /**
         * Color to render the series name if navigate is enabled
         */
        navigateColor: React.PropTypes.string,

        /**
         * The format is used to format the display text for the bar. It can be specified as a d3
         * format string (such as ".2f") or a function. The function will be called with the value
         * and should return a string.
         */
        format: React.PropTypes.oneOfType([
            React.PropTypes.func,
            React.PropTypes.string
        ]),

        /**
         * A single child which will be rendered when the item is selected. The child will have
         * a couple of additional props injected onto it when rendered:
         *  * `series` - the TimeSeries of the row being rendered
         *  * `timestamp` - the current timestamp being shown
         */
        children: React.PropTypes.element
    },

    getDefaultProps() {
        return {
            display: "avg",
            size: 14,
            spacing: 2,
            padding: 5,
            labelWidth: 240,
            style: [{fill: "steelblue"}],
            seriesList: [],
            columns: ["value"],
            sortBy: "max",
            selectionColor: "steelblue",
            navigateColor: "steelblue"
        };
    },


    renderRows(seriesList) {
        let max = 0;

        const {
            columns,
            spacing,
            padding,
            size,
            style,
            format,
            display,
            timestamp,
            onSelectionChanged,
            selectionColor,
            onNavigate,
            navigateColor
        } = this.props;

        //
        // Get the max value in the series list, for overall scale
        //

        seriesList.forEach(series => {
            this.props.columns.forEach(column => {
                const smax = series.max(column);
                if (smax > max) max = smax;
            });
        });

        //
        // Get the 0 or 1 children for the expanded area
        //

        let child;
        if (React.Children.count(this.props.children) === 1) {
            child = React.Children.only(this.props.children);
        }

        //
        // Render a <RowStack> for each series in the seriesList
        //

        return seriesList.map((series, i) => (
            <TimeSeriesRow
                key={i}
                rowNumber={i}
                series={series}
                display={display}
                max={max}
                selected={this.props.selected === series.name()}
                onSelectionChanged={onSelectionChanged}
                selectionColor={selectionColor}
                onNavigate={onNavigate}
                navigateColor={navigateColor}
                columns={columns}
                spacing={spacing}
                padding={padding}
                size={size}
                style={style}
                format={format}
                timestamp={timestamp}
                child={child} />
        ));
    },

    render() {

        //
        // Sort the list by the criteria specified in the "sortBy" prop:
        // name, avg or max.
        //

        const sortedList = _.sortBy(this.props.seriesList, series => {
            switch (this.props.sortBy) {
                case "name":
                    return series.name;
                case "avg":
                    return -_.reduce(this.props.columns.map(column => series.avg(column)),
                                     (memo, num) => memo + num,
                                     0);
                case "max":
                    return -_.max(this.props.columns.map(column => series.max(column)));
                default:
                    throw new Error("unknown sort prop", this.props.sortBy);
            }
        });

        //
        // Keep just the top n, where n is specified by the "top" prop.
        //

        const list = this.props.top ? sortedList.slice(0, this.props.top) : sortedList;

        const containerStyle = {
            borderBottomStyle: "solid",
            borderBottomWidth: 1,
            borderBottomColor: "#DFDFDF"
        };

        return (
            <div style={containerStyle}>
                {this.renderRows(list)}
            </div>
        );
    }
});