# React Timeseries Barchart

A horizontal barchart that summarizes a list of TimeSeries objects. It was formally part of react-timeseries-charts. For charts visualizing a single TimeSeries in many different ways, see that library.

The goal of this visualization is provide a high level summary of a collection of TimeSeries objects. Specifically, this is useful when a list of TimeSeries is a breakdown of another series and you would like to communicate what the relative contributions of each are.

Each bar is a horizontal [boxplot](https://en.wikipedia.org/wiki/Box_plot) that shows:
 - The max and min of the data (in the lighter shaded outer box)
 - The [Interquartile range](https://en.wikipedia.org/wiki/Interquartile_range)(in the darker shaded inner box)

In addition each box can show a marker.

Getting started
---------------

This component is intended to be installed with [npm](https://www.npmjs.com/) and the built into your project with a tool like [Webpack](https://webpack.github.io/).

To install:

    npm install react-timeseries-barchart --save

Developing
----------

The repo contains the examples website. This is very helpful in developing new functionality. Within a cloned repo, you first need to run:

    npm install

This will install the development dependencies into your node_modules directory.

You can then start up the test server, as well as automatic source building, by doing:

    npm run start-website

License
-------

This code is distributed under a BSD style license, see the LICENSE file for complete information.

Copyright
---------

React Axis, Copyright (c) 2016, The Regents of the University of California, through Lawrence Berkeley National Laboratory (subject to receipt of any required approvals from the U.S. Dept. of Energy). All rights reserved.

If you have questions about your rights to use or distribute this software, please contact Berkeley Lab's Technology Transfer Department at TTD@lbl.gov.

NOTICE. This software is owned by the U.S. Department of Energy. As such, the U.S. Government has been granted for itself and others acting on its behalf a paid-up, nonexclusive, irrevocable, worldwide license in the Software to reproduce, prepare derivative works, and perform publicly and display publicly. Beginning five (5) years after the date permission to assert copyright is obtained from the U.S. Department of Energy, and subject to any subsequent five (5) year renewals, the U.S. Government is granted for itself and others acting on its behalf a paid-up, nonexclusive, irrevocable, worldwide license in the Software to reproduce, prepare derivative works, distribute copies to the public, perform publicly and display publicly, and to permit others to do so.
