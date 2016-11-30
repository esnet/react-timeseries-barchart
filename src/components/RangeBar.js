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

function scaleAsString(scale) {
    return `${scale.domain()}-${scale.range()}`;
}

export default class RangeBar extends React.Component {

    shouldComponentUpdate({ series, scale }) {
        const seriesChanged = !TimeSeries.is(this.props.series, series);
        const scaleChanged = scaleAsString(this.props.scale) !== scaleAsString(scale);
        return seriesChanged || scaleChanged;
    }

    render() {

        const {
            series,
            column,
            bgstyle,
            fgstyle,
            scale,
            size
        } = this.props;

        //
        // Statistics-based range bar
        //

        const perc25 = series.percentile(25, column);
        const perc75 = series.percentile(75, column);

        let seriesMin = series.min(column);
        if (_.isUndefined(seriesMin)) seriesMin = 0;

        let seriesMax = series.max(column);
        if (_.isUndefined(seriesMax)) seriesMax = 0;

        const start = scale(seriesMin);
        const end = scale(seriesMax);
        const centerStart = scale(perc25);
        const centerEnd = scale(perc75);

        let backgroundWidth = end - start;
        if (backgroundWidth < 1) backgroundWidth = 1;

        let centerWidth = centerEnd - centerStart;
        if (centerWidth <= 1) centerWidth = 1;

        const barElementBackground = (
            <rect
                style={bgstyle}
                rx={2} ry={2}
                x={start} y={1}
                width={backgroundWidth}
                height={size-2} />
        );
        const barElementCenter = (
            <rect
                style={fgstyle}
                x={centerStart}
                y={0}
                width={centerWidth}
                height={size} />
        );

        return (
            <g>
                {barElementBackground}
                {barElementCenter}
            </g>
        );
    }
}
