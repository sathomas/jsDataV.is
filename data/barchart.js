/*
 * This module implements a simple bar chart. Its architecture is based on
 * Mike Bostock’s [reusable chart](http://bost.ocks.org/mike/chart/) approach.
 *
 * Usage:
 *     // create a chart module, optionally specifying its size
 *     var chart = d3.custom.barChart().width(640).height(480);
 *     // ...
 *     // select a DOM element, bind a data set to it, and draw the chart
 *     d3.select("#chart").datum(data).call(chart);
 *     // ...
 *     // update chart with new data
 *     d3.select("#chart").datum(newdata).call(chart);
 *     // ...
 *     // update chart without using transitions
 *     d3.select("#chart").datum(newdata).call(chart, false);
 *     // ...
 *     // remove the chart from the page
 *     chart.remove();
 *
 * Data input is an array of objects:
 *     data = [
 *         { label: "string", value: number },
 *         { label: "string", value: number },
 *         { label: "string", value: number },
 *         // ...
 *     ];
 */

/*
 * To avoid global namespace pollution, we “borrow” the `d3` namespace to host
 * our chart module. Since this chart depends on D3, we just assume that the
 * D3 library is present without bothering to make sure (e.g. with require.js)
 * This also helps to keep the example simple so we can focus on the relevant
 * parts of the code.
 */

d3.custom = d3.custom || {};

/*
 * With a stunning lack of originality, we name our module `barChart`.
 */

d3.custom.barChart = function module() {
    
    // Chart options with default values
    // ---------------------------------

    var margin = { top: 50, right: 50, bottom: 50, left: 50 },
        height = 476,
        width  = 636
    
    // Private variables
    // -----------------

    var svg = null,        // SVG container for the chart
        sel = null;        // D3 selection for chart
    
    // Private functions
    // -----------------
    
    // Define a standard debounce utility function. If a regular
    // library (e.g. Underscore, jQuery is available), use that
    // instead. We keep this here to minimize dependencies in the
    // example.
    function debounce(fn, delay) {
        var timeout, args, context, timestamp, result;
        var now = Date.now || function() {
            return new Date().getTime();
        };
        var later = function() {
            var last = now() - timestamp;
            if (last < delay && last >= 0) {
                timeout = setTimeout(later, delay - last);
            } else {
                timeout = null;
                result = fn.apply(context, args);
                if (!timeout) context = args = null;
            }
        };
        return function() {
            context = this;
            args = arguments;
            timestamp = now();
            if (!timeout) {
                timeout = setTimeout(later, delay);
            }
            return result;
        };
    };
    
    // Handle window resize events.
    var onResize = debounce(function() { draw(sel, false); }, 33);

    // Code that actually draws the chart(s) in the selection(s).
    // The second parameter indicates whether or not to use
    // transitions in updating the chart.
    function draw(selection, useTransitions) {

        selection.each(function(data) {

            // Calculate display dimensions to ensure that the entire
            // chart fits within the browser window. We include a 20px
            // buffer to accomodate scroll bars.
            var displayW = Math.min(width, window.innerWidth-20),
                displayH = Math.min(height, window.innerHeight-20);

            // Calculate the dimensions of the chart itself by factoring
            // out the margins.
            var chartW = displayW - margin.left - margin.right,
                chartH = displayH - margin.top  - margin.bottom;
            
            // Create a scale for the x-axis. Since this is a bar chart,
            // we use an ordinal scale. The data set is assumed to have
            // a `.label` property for each data value.
            var xScale = d3.scale.ordinal()
                    .domain(data.map(function(d) { return d.label; }))
                    .rangeRoundBands([0, chartW], 0.1);
                    
            // Create a scale for the y-axis. A simple linear scale is
            // all we support, and we expect the values to be stored in
            // the `.value` propery of each data value. Note that we start
            // the axis at zero, regardless of the minimum value within
            // the data set.
            var yScale = d3.scale.linear()
                    .domain([0, d3.max(data, function(d) { return d.value; })])
                    .range([chartH, 0]);

            // Let D3 construct both of the axes for the chart.
            var xAxis = d3.svg.axis()
                    .scale(xScale)
                    .orient("bottom");

            var yAxis = d3.svg.axis()
                    .scale(yScale)
                    .orient("left");

            // If we haven’t yet created the SVG container for the chart,
            // now is a good time. (The container will already exist if we’re
            // merely updating a chart, in which case we don’t need to create
            // it again.)
            if (!svg) {

                svg = d3.select(this)
                    .append("svg");
                
                // Since we had to create the SVG element, we also need
                // to create the child containers for the chart. We
                // use a main `<g>` group within the main SVG element to
                // easily accomodate the margins. That group is the primary
                // chart container. Within the chart container are three
                // subgroups: the chart itself, and the x- and y-axes.
                var container = svg.append("g").classed("container", true);
                container.append("g").classed("chart", true),
                container.append("g").classed("axis xaxis", true),
                container.append("g").classed("axis yaxis", true);

            }

            // Now that we have an SVG element on the page, make it visible.
            svg[useTransitions ? "transition" : "interrupt"]()
                .attr({width: displayW, height: displayH});

            // Include the margins.
            d3.select(".container")
                .attr({transform: "translate(" + margin.left + "," + margin.top + ")"});
            
            // Show the axes
            d3.select(".xaxis")[useTransitions ? "transition" : "interrupt"]()
                .attr({transform: "translate(0," + (chartH) + ")"})
                .call(xAxis);

            d3.select(".yaxis")[useTransitions ? "transition" : "interrupt"]()
                .call(yAxis);

            // Add or update the data
            var bars = d3.select(".chart")
                .selectAll(".bar")
                .data(data);

            // New data is initially added to the far right of the
            // chart (i.e. stage-rigth). We transition it to the
            // appropriate x-position as part of the update selection
            // below.
            bars.enter()
                .append("rect")
                    .classed("bar", true)
                    .attr({
                        x:      chartW,   // off stage to the right
                        width:  xScale.rangeBand(),
                        y:      function(d) { return yScale(d.value); },
                        height: function(d) { return chartH - yScale(d.value); }
                    });

            // Now handle data whose value has changed as well as the
            // newly added values. We use a transition to move the
            // bars into their new position and adjust their heights
            // and widths.
            bars[useTransitions ? "transition" : "interrupt"]()
                .attr({
                    width:  xScale.rangeBand(),
                    x:      function(d) { return xScale(d.label); },
                    y:      function(d) { return yScale(d.value); },
                    height: function(d) { return chartH - yScale(d.value); }
                });

            // Finally, deal with values that are no longer present in
            // the data. We use a transition to fade these bars out and
            // then remove them from the DOM.
            bars.exit()[useTransitions ? "transition" : "interrupt"]()
                .style({
                    opacity: 0
                })
                .remove();

        });
        
    };

    // Public implementation
    // --------------------    

    function exports(selection, useTransitions) {
        sel = selection;
        draw(selection, (typeof useTransitions === "undefined") || useTransitions);
    };
    
    // Public methods
    // --------------

    exports.width = function(x) {
        if (!arguments.length) return width;
        width = parseInt(x);
        return this;
    };
    exports.height = function(x) {
        if (!arguments.length) return height;
        height = parseInt(x);
        return this;
    };
    exports.remove = function() {
        if (svg) { svg.remove(); }
        window.removeEventListener("resize", onResize);
    }
    
    // Initialization
    // --------------
    
    // List for window resize events to adjust the chart
    // size if it won't fit.
    window.addEventListener("resize", onResize);

    // Return the object with public methods exposed
    return exports;

};