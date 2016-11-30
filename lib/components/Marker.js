"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _underscore = require("underscore");

var _underscore2 = _interopRequireDefault(_underscore);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Draws a marker and it's value as a label. The currentIndex is passed in
 * as a prop, along with the series.
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

    displayName: "Marker",

    render: function render() {
        var marker = void 0,
            markerLabel = void 0;

        var _props = this.props,
            value = _props.value,
            scale = _props.scale,
            style = _props.style,
            size = _props.size,
            format = _props.format;


        if (value) {

            // Marker position
            var valueStart = scale(value);

            // Marker
            marker = _react2.default.createElement("rect", { style: style, x: valueStart - 2, y: -2, width: 4, height: size + 4 });

            // Text
            var text = void 0;
            if (format && _underscore2.default.isString(format)) {
                var formatter = format(format);
                text = formatter(value);
            } else if (_underscore2.default.isFunction(format)) {
                text = format(value);
            }
            if (text) {
                markerLabel = _react2.default.createElement(
                    "text",
                    { style: { fill: "#666", fontSize: 12 }, x: valueStart + 4, y: size - 2 },
                    text
                );
            }

            return _react2.default.createElement(
                "g",
                null,
                marker,
                markerLabel
            );
        } else {
            return _react2.default.createElement("g", null);
        }
    }
});