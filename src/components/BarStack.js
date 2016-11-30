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
import { scaleLinear } from "d3-scale";
import { TimeSeries } from "pondjs";

import Marker from "./Marker";
import RangeBar from "./RangeBar";

/**
 * Render a stack of boxplot style bars to represent multiple
 * columns of a single TimeSeries within the a TimeSeries list.
 *
 * Each bar is a self containerd svg element containing the bar
 * rendering. Each bar also has a marker use to display a particular
 * point on the bar (such as the current value).
 */
export default React.createClass({

    displayName: "BarStack",

    shouldComponentUpdate(nextProps) {
        const seriesChanged = !TimeSeries.is(this.props.series, nextProps.series);
        const timestampChanged = this.props.timestamp !== nextProps.timestamp;
        return seriesChanged || timestampChanged;
    },

    render() {
        const {
            display,
            series,
            max,
            columns,
            spacing,
            padding,
            size,
            width,
            style,
            format,
            timestamp
        } = this.props;

        // Highlighted value
        const currentIndex = timestamp ? series.bisect(timestamp) : null;
        
        // Render the RangeBars, one for each column
        const columnElements = columns.map((column, i) => {

            // Vertical position of the bar
            const yPosition = padding + i * (size + spacing);
            const transform = `translate(0,${yPosition})`;

            // Scale
            const scale = scaleLinear()
                .domain([0, max])
                .range([0, width - 100]);

            const value = currentIndex ? series.at(currentIndex).get(column) : null;

            const rectStyleValue = _.isArray(style) && style.length > i ?
                _.clone(style[i]) : {fill: "#DDD"};

            const rectStyleBackground = _.isArray(style) && style.length > i ?
                _.clone(style[i]) : {fill: "#DDD"};
            rectStyleBackground.opacity = 0.2;

            const rectStyleCenter = _.isArray(style) && style.length > i ?
                _.clone(style[i]) : {fill: "#DDD"};
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
                    return (
                        <g transform={transform} key={i}>
                            <RangeBar
                                series={series}
                                column={column}
                                bgstyle={rectStyleBackground}
                                fgstyle={rectStyleCenter}
                                style={style}
                                scale={scale}
                                size={size} />
                            <Marker
                                value={value}
                                scale={scale}
                                format={format}
                                size={size}
                                style={rectStyleValue} />
                        </g>
                    );
                default:
                    return (
                        <g />
                    );
            }
        });

        //
        //       | <-- bar --> |       | <-- bar --> |
        // | pad |    size     | space |    size     | pad |
        //

        const height = columns.length * size +
                       (columns.length - 1) * spacing +
                       padding * 2;

        return (
            <svg width="100%" height={height} >
                {columnElements}
            </svg>
        );
    }
});
