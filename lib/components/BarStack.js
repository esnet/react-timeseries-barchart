"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _underscore = require("underscore");

var _underscore2 = _interopRequireDefault(_underscore);

var _d3Scale = require("d3-scale");

var _pondjs = require("pondjs");

var _Marker = require("./Marker");

var _Marker2 = _interopRequireDefault(_Marker);

var _RangeBar = require("./RangeBar");

var _RangeBar2 = _interopRequireDefault(_RangeBar);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Render a stack of boxplot style bars to represent multiple
 * columns of a single TimeSeries within the a TimeSeries list.
 *
 * Each bar is a self containerd svg element containing the bar
 * rendering. Each bar also has a marker use to display a particular
 * point on the bar (such as the current value).
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

    displayName: "BarStack",

    shouldComponentUpdate: function shouldComponentUpdate(nextProps) {
        var seriesChanged = !_pondjs.TimeSeries.is(this.props.series, nextProps.series);
        var timestampChanged = this.props.timestamp !== nextProps.timestamp;
        return seriesChanged || timestampChanged;
    },
    render: function render() {
        var _props = this.props,
            display = _props.display,
            series = _props.series,
            max = _props.max,
            columns = _props.columns,
            spacing = _props.spacing,
            padding = _props.padding,
            size = _props.size,
            width = _props.width,
            style = _props.style,
            format = _props.format,
            timestamp = _props.timestamp;

        // Highlighted value

        var currentIndex = timestamp ? series.bisect(timestamp) : null;

        // Render the RangeBars, one for each column
        var columnElements = columns.map(function (column, i) {

            // Vertical position of the bar
            var yPosition = padding + i * (size + spacing);
            var transform = "translate(0," + yPosition + ")";

            // Scale
            var scale = (0, _d3Scale.scaleLinear)().domain([0, max]).range([0, width - 100]);

            var value = currentIndex ? series.at(currentIndex).get(column) : null;

            var rectStyleValue = _underscore2.default.isArray(style) && style.length > i ? _underscore2.default.clone(style[i]) : { fill: "#DDD" };

            var rectStyleBackground = _underscore2.default.isArray(style) && style.length > i ? _underscore2.default.clone(style[i]) : { fill: "#DDD" };
            rectStyleBackground.opacity = 0.2;

            var rectStyleCenter = _underscore2.default.isArray(style) && style.length > i ? _underscore2.default.clone(style[i]) : { fill: "#DDD" };
            rectStyleCenter.opacity = 0.2;

            //
            // Visual display of the bar, depending on the display prop
            //

            switch (display) {
                /*
                case "avg":
                case "max":
                     // Style of the bar
                    const rectStyle = _.isArray(style) && style.length > i ?
                        _.clone(style[i]) : {fill: "#DDD"};
                     value = display === "avg" ? series.avg(column) : series.max(column);
                     start = scale(0);
                    end = scale(value);
                    let w = end - start;
                    if (w <= 1) {
                        w = 1;
                    }
                    const barElement = (
                        <rect style={rectStyle} x={start} y={y} width={w} height={size} />
                    );
                     // Text
                    let text;
                    if (format && _.isString(format)) {
                        const formatter = format(format);
                        text = formatter(value);
                    } else if (_.isFunction(format)) {
                        text = format(value);
                    }
                    
                    if (text) {
                        textElement =(
                            <text style={{fill: "#666", fontSize: 12}} x={end + 2} y={y + size - 1}>{text}</text>
                        );
                    }
                     return (
                        <g key={i}>{barElement}{textElement}</g>
                    );
                */
                case "range":
                    return _react2.default.createElement(
                        "g",
                        { transform: transform, key: i },
                        _react2.default.createElement(_RangeBar2.default, {
                            series: series,
                            column: column,
                            bgstyle: rectStyleBackground,
                            fgstyle: rectStyleCenter,
                            style: style,
                            scale: scale,
                            size: size }),
                        _react2.default.createElement(_Marker2.default, {
                            value: value,
                            scale: scale,
                            format: format,
                            size: size,
                            style: rectStyleValue })
                    );
                default:
                    return _react2.default.createElement("g", null);
            }
        });

        //
        //       | <-- bar --> |       | <-- bar --> |
        // | pad |    size     | space |    size     | pad |
        //

        var height = columns.length * size + (columns.length - 1) * spacing + padding * 2;

        return _react2.default.createElement(
            "svg",
            { width: "100%", height: height },
            columnElements
        );
    }
});