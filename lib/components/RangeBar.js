"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _underscore = require("underscore");

var _underscore2 = _interopRequireDefault(_underscore);

var _pondjs = require("pondjs");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *  Copyright (c) 2016, The Regents of the University of California,
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *  through Lawrence Berkeley National Laboratory (subject to receipt
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *  of any required approvals from the U.S. Dept. of Energy).
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *  All rights reserved.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *  This source code is licensed under the BSD-style license found in the
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *  LICENSE file in the root directory of this source tree.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

function scaleAsString(scale) {
    return scale.domain() + "-" + scale.range();
}

var RangeBar = function (_React$Component) {
    _inherits(RangeBar, _React$Component);

    function RangeBar() {
        _classCallCheck(this, RangeBar);

        return _possibleConstructorReturn(this, (RangeBar.__proto__ || Object.getPrototypeOf(RangeBar)).apply(this, arguments));
    }

    _createClass(RangeBar, [{
        key: "shouldComponentUpdate",
        value: function shouldComponentUpdate(_ref) {
            var series = _ref.series,
                scale = _ref.scale;

            var seriesChanged = !_pondjs.TimeSeries.is(this.props.series, series);
            var scaleChanged = scaleAsString(this.props.scale) !== scaleAsString(scale);
            return seriesChanged || scaleChanged;
        }
    }, {
        key: "render",
        value: function render() {
            var _props = this.props,
                series = _props.series,
                column = _props.column,
                bgstyle = _props.bgstyle,
                fgstyle = _props.fgstyle,
                scale = _props.scale,
                size = _props.size;

            //
            // Statistics-based range bar
            //

            var perc25 = series.percentile(25, column);
            var perc75 = series.percentile(75, column);

            var seriesMin = series.min(column);
            if (_underscore2.default.isUndefined(seriesMin)) seriesMin = 0;

            var seriesMax = series.max(column);
            if (_underscore2.default.isUndefined(seriesMax)) seriesMax = 0;

            var start = scale(seriesMin);
            var end = scale(seriesMax);
            var centerStart = scale(perc25);
            var centerEnd = scale(perc75);

            var backgroundWidth = end - start;
            if (backgroundWidth < 1) backgroundWidth = 1;

            var centerWidth = centerEnd - centerStart;
            if (centerWidth <= 1) centerWidth = 1;

            var barElementBackground = _react2.default.createElement("rect", {
                style: bgstyle,
                rx: 2, ry: 2,
                x: start, y: 1,
                width: backgroundWidth,
                height: size - 2 });
            var barElementCenter = _react2.default.createElement("rect", {
                style: fgstyle,
                x: centerStart,
                y: 0,
                width: centerWidth,
                height: size });

            return _react2.default.createElement(
                "g",
                null,
                barElementBackground,
                barElementCenter
            );
        }
    }]);

    return RangeBar;
}(_react2.default.Component);

exports.default = RangeBar;