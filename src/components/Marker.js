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

/**
 * Draws a marker and it's value as a label. The currentIndex is passed in
 * as a prop, along with the series.
 */
export default React.createClass({

    displayName: "Marker",

    render() {
        let marker, markerLabel;

        const {
            value,
            scale,
            style,
            size,
            format
        } = this.props;

        if (value) {

            // Marker position
            const valueStart = scale(value);

            // Marker
            marker = (
                <rect style={style} x={valueStart-2} y={-2} width={4} height={size+4} />
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
                markerLabel =(
                    <text style={{fill: "#666", fontSize: 12}} x={valueStart+4} y={size - 2}>{text}</text>
                );
            }

            return (
                <g>
                    {marker}
                    {markerLabel}
                </g>
            );
        } else {
            return (
                <g />
            );
        }
    }
});
