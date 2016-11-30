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
import Flexbox from "flexbox-react";
import Resizable from "./Resizable";
import BarStack from "./BarStack";

/**
 * Each series in the series list has a list of columns to display. So here
 * we render the series label, the bars (one for each column) and the child
 * if there is one for expanded info about the series.
 */
export default React.createClass({

    displayName: "Row",

    getInitialState() {
        return {
            hover: false
        };
    },

    handleClick() {
        if (this.props.onSelectionChanged) {
            this.props.onSelectionChanged(this.props.series.name());
        }
    },

    handleNavigate() {
        if (this.props.onNavigate) {
            this.props.onNavigate(this.props.series.name());
        }
    },

    renderLabel() {
        const style = {
            marginTop: 5,
            cursor: this.props.onNavigate ? "pointer" : "default"
        };

        if (this.props.onNavigate) {
            style.color = this.props.navigateColor;
            return (
                <span style={style} onClick={this.handleNavigate}>
                    {this.props.series.name().toUpperCase()}
                </span>
            );
        } else {
            return (
                <span style={style}>
                    {this.props.series.name().toUpperCase()}
                </span>
            );
        }
    },

    renderBars() {
        const {
            display,
            series,
            max,
            columns,
            spacing,
            padding,
            size,
            style,
            format,
            timestamp
        } = this.props;

        const rowStyle = {
            width: "100%"
        };

        const resizableStyle = {
        };

        return (
            <div
                style={rowStyle}
                onMouseEnter={() => this.setState({hover: true})}
                onMouseLeave={() => this.setState({hover: false})} >

                <Resizable style={resizableStyle}>
                    <BarStack
                        display={display}
                        series={series}
                        max={max}
                        columns={columns}
                        spacing={spacing}
                        padding={padding}
                        size={size}
                        style={style}
                        format={format}
                        timestamp={timestamp} />
                </Resizable>
            </div>
        );
    },

    renderChild() {
        const rowStyle = {
            width: "100%",
            boxShadow: "inset 11px 0px 7px -9px rgba(0,0,0,0.28)"
        };

        const resizableStyle = {
            marginLeft: 5,
            background: "#F8F8F8"
        };

        if (this.props.child && this.props.selected) {
            const props = {
                series: this.props.series,
                timestamp: this.props.timestamp
            };
            const child =  React.cloneElement(this.props.child, props);
            return (
                <div style={rowStyle}>
                    <Resizable style={resizableStyle}>
                        {child}
                    </Resizable>
                </div>
            );
        }
    },

    render() {
        const { series } = this.props;
        const rowStyle = {
            borderTopStyle: "solid",
            borderTopWidth: 1,
            borderTopColor: "#DFDFDF"
        };

        let labelStyle;
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

        if (this.state.hover && (_.isUndefined(this.props.selected) || !this.props.selected)) {
            labelStyle.background = "#EDEDED";
        }

        return (
            <Flexbox
                key={this.props.rowNumber}
                style={rowStyle}
                flexDirection="row"
                onMouseEnter={() => this.setState({hover: true})}
                onMouseLeave={() => this.setState({hover: false})}
                onClick={this.handleClick} >

                    <Flexbox minWidth="220px" style={labelStyle} >
                        {this.renderLabel(series)}
                    </Flexbox>
                    <Flexbox flexGrow={1}>
                        {this.renderBars()}
                        {/*this.renderChild()*/}
                    </Flexbox>
            </Flexbox>
        );
    }
});