"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _underscore = require("underscore");

var _underscore2 = _interopRequireDefault(_underscore);

var _flexboxReact = require("flexbox-react");

var _flexboxReact2 = _interopRequireDefault(_flexboxReact);

var _Resizable = require("./Resizable");

var _Resizable2 = _interopRequireDefault(_Resizable);

var _BarStack = require("./BarStack");

var _BarStack2 = _interopRequireDefault(_BarStack);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Each series in the series list has a list of columns to display. So here
 * we render the series label, the bars (one for each column) and the child
 * if there is one for expanded info about the series.
 */
exports.default = _react2.default.createClass({

    displayName: "Row",

    getInitialState: function getInitialState() {
        return {
            hover: false
        };
    },
    handleClick: function handleClick() {
        if (this.props.onSelectionChanged) {
            this.props.onSelectionChanged(this.props.series.name());
        }
    },
    handleNavigate: function handleNavigate() {
        if (this.props.onNavigate) {
            this.props.onNavigate(this.props.series.name());
        }
    },
    renderLabel: function renderLabel() {
        var style = {
            marginTop: 5,
            cursor: this.props.onNavigate ? "pointer" : "default"
        };

        if (this.props.onNavigate) {
            style.color = this.props.navigateColor;
            return _react2.default.createElement(
                "span",
                { style: style, onClick: this.handleNavigate },
                this.props.series.name().toUpperCase()
            );
        } else {
            return _react2.default.createElement(
                "span",
                { style: style },
                this.props.series.name().toUpperCase()
            );
        }
    },
    renderBars: function renderBars() {
        var _this = this;

        var _props = this.props,
            display = _props.display,
            series = _props.series,
            max = _props.max,
            columns = _props.columns,
            spacing = _props.spacing,
            padding = _props.padding,
            size = _props.size,
            style = _props.style,
            format = _props.format,
            timestamp = _props.timestamp;


        var rowStyle = {
            width: "100%"
        };

        var resizableStyle = {};

        console.log("Barstack", series);

        return _react2.default.createElement(
            "div",
            {
                style: rowStyle,
                onMouseEnter: function onMouseEnter() {
                    return _this.setState({ hover: true });
                },
                onMouseLeave: function onMouseLeave() {
                    return _this.setState({ hover: false });
                } },
            _react2.default.createElement(
                _Resizable2.default,
                { style: resizableStyle },
                _react2.default.createElement(_BarStack2.default, {
                    display: display,
                    series: series,
                    max: max,
                    columns: columns,
                    spacing: spacing,
                    padding: padding,
                    size: size,
                    style: style,
                    format: format,
                    timestamp: timestamp })
            )
        );
    },
    renderChild: function renderChild() {
        var rowStyle = {
            width: "100%",
            boxShadow: "inset 11px 0px 7px -9px rgba(0,0,0,0.28)"
        };

        var resizableStyle = {
            marginLeft: 5,
            background: "#F8F8F8"
        };

        if (this.props.child && this.props.selected) {
            var props = {
                series: this.props.series,
                timestamp: this.props.timestamp
            };
            var child = _react2.default.cloneElement(this.props.child, props);
            return _react2.default.createElement(
                "div",
                { style: rowStyle },
                _react2.default.createElement(
                    _Resizable2.default,
                    { style: resizableStyle },
                    child
                )
            );
        }
    },
    render: function render() {
        var _this2 = this;

        var series = this.props.series;

        var rowStyle = {
            borderTopStyle: "solid",
            borderTopWidth: 1,
            borderTopColor: "#DFDFDF"
        };

        var labelStyle = void 0;
        if (this.props.selected) {
            labelStyle = {
                paddingLeft: 2,
                borderLeftStyle: "solid",
                borderLeftWidth: 5,
                borderLeftColor: this.props.selectionColor
            };
        } else {
            labelStyle = {
                background: "#FAFAFA",
                paddingLeft: 7
            };
        }

        if (this.state.hover && (_underscore2.default.isUndefined(this.props.selected) || !this.props.selected)) {
            labelStyle.background = "#EDEDED";
        }

        return _react2.default.createElement(
            _flexboxReact2.default,
            {
                key: this.props.rowNumber,
                style: rowStyle,
                flexDirection: "row",
                onMouseEnter: function onMouseEnter() {
                    return _this2.setState({ hover: true });
                },
                onMouseLeave: function onMouseLeave() {
                    return _this2.setState({ hover: false });
                },
                onClick: this.handleClick },
            _react2.default.createElement(
                _flexboxReact2.default,
                { minWidth: "220px", style: labelStyle },
                this.renderLabel(series)
            ),
            _react2.default.createElement(
                _flexboxReact2.default,
                { flexGrow: 1 },
                this.renderBars()
            )
        );
    }
}); /**
     *  Copyright (c) 2016, The Regents of the University of California,
     *  through Lawrence Berkeley National Laboratory (subject to receipt
     *  of any required approvals from the U.S. Dept. of Energy).
     *  All rights reserved.
     *
     *  This source code is licensed under the BSD-style license found in the
     *  LICENSE file in the root directory of this source tree.
     */