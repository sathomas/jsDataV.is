/*
 * Scripts for the site landing page.
 */

// Third party libraries

//@codekit-prepend "../../bower_components/d3/d3.js"

// Component scripts

//@codekit-prepend "analytics.js"

// Main script for page

;(function(){

    // The main page nagivation is implemented as a network graph.
    // The vertices of the graph include a central node and references
    // to the site sections. To start, we define the data structure
    // containing the vertices.

    var vertices = [
        {
            id: "center",
            fixed: true,
            href: "",
            r: 57,
            x: 335,
            y: 187,
            label: "",
            labelXOffset: 0,
            labelYOffset: 0,
            charge: -30,
            linkStrength: 1,
            linkDistance: 20,
            path: ""
        },
        {
            id: "book",
            fixed: false,
            href: "intro.html",
            r: 30,
            x: 388,
            y: 70,
            label: "Book",
            labelXOffset: 34,
            labelYOffset: 5,
            charge: -30,
            linkStrength: 1,
            linkDistance: 20,
            path: "m 13.94 -18 l -20.61 0 c -0.819977 0 -2.15997 0 -2.97998 0 l -2.30002 0 c -0.819977 0 -1.98999 0.380001 -2.59998 0.849998 l -0.330017 0.25 c -0.619995 0.470001 -1.12 1.43 -1.12 2.14 l 0 0.98 l 0 0.209999 l 0 30.28 c 0 0.709999 0.670013 1.29 1.48999 1.29 l 25.89 0 c 0.820007 0 1.48999 -0.580002 1.48999 -1.29 l 0 -30.49 c 0 -0.710003 -0.669983 -1.29 -1.48999 -1.29 l -17.31 0 c 0 -0.459999 -0.440002 -0.84 -0.980011 -0.84 c -0.540009 0 -0.980011 0.380001 -0.980011 0.84 l 0 0.34 l 0 8.49 l -2.45999 -2.08 l -2.13998 2.08 l 0 -8.83 l -2.02002 0 c -0.00997925 0 -0.019989 0.00999832 -0.0299988 0.00999832 l 1.60001 -1.59 l 4.78 0 l 22.08 0 l 0 32.14 l 0.019989 0 c 0.820007 0 1.48999 -0.57 1.48999 -1.28 l 0 -30.92 c 0 -0.709999 -0.669983 -1.29 -1.48999 -1.29 Z m 0 0"
        },
        {
            id: "visuals",
            fixed: false,
            href: "http://jsDataV.is/visuals/",
            r: 30,
            x: 458,
            y: 290,
            label: "Visualizations",
            labelXOffset: -62.88,
            labelYOffset: 50,
            charge: -30,
            linkStrength: 1,
            linkDistance: 20,
            path: "m -12 0 l 4 0 l 0 10 l -4 0 l 0 -10 l 0 0 Z m 0 0 m 7 -10 l 5 0 l 0 20 l -5 0 l 0 -20 l 0 0 Z m 0 0 m -13 22 l 38 0 l 0 3 l -40 0 l 0 -30 l 2 0 l 0 27 l 0 0 Z m 0 0 m 20 -17 l 6 0 l 0 15 l -6 0 l 0 -15 l 0 0 Z m 0 0 m 8 -7 l 5 0 l 0 22 l -5 0 l 0 -22 l 0 0 Z m 0 0"
        },
        {
            id: "twitter",
            fixed: false,
            href: "http://twitter.com/jsdatavis",
            r: 30,
            x: 258,
            y: 329,
            label: "Twitter",
            labelXOffset: -61,
            labelYOffset: 50,
            charge: -30,
            linkStrength: 1,
            linkDistance: 20,
            path: "m 21.45 -9.44 c -1.07001 1.53 -2.35001 2.84 -3.85001 3.92001 c 0.0299988 0.209991 0.0299988 0.539978 0.0299988 0.97998 c 0 4.06 -1.19 8.18002 -3.64001 11.91 c -2.47 3.72 -5.75 6.64999 -10.53 8.34 c -2.39999 0.869995 -4.94 1.29001 -7.67 1.29001 c -4.29999 0 -8.23 -1.12 -11.79 -3.39999 c 0.550003 0.0700073 1.16 0.100006 1.85001 0.100006 c 3.56999 0 6.75 -1.08002 9.53 -3.24002 c -3.32001 -0.0699768 -6.20001 -2.22998 -7.17 -5.25 c 0.519989 0.0700073 0.98999 0.119995 1.45 0.119995 c 0.679993 0 1.34999 -0.0999756 2.01999 -0.259979 c -3.54999 -0.730011 -6.15999 -3.77002 -6.15999 -7.42999 l 0 -0.0900269 c 1.06999 0.580017 2.23 0.910004 3.47 0.960022 c -2.09001 -1.39001 -3.42 -3.71002 -3.42 -6.31 c 0 -1.38 0.349991 -2.65002 1.03999 -3.82001 c 3.83 4.66998 9.56 7.62 15.83 7.91998 c -0.119995 -0.579987 -0.190002 -1.16998 -0.190002 -1.72998 c 0 -4.19 3.42001 -7.57001 7.67999 -7.57001 c 2.21002 0 4.08002 0.799988 5.60001 2.39001 c 1.73999 -0.330017 3.36002 -0.940002 4.88 -1.83002 c -0.600006 1.81 -1.70999 3.19 -3.38 4.17001 c 1.48001 -0.160004 2.95001 -0.529999 4.42001 -1.17001 l 0 0 Z m 0 0"
        },
        {
            id: "talks",
            fixed: false,
            href: "http://speakerdeck.com/sathomas",
            r: 30,
            x: 199,
            y: 219,
            label: "Talks",
            labelXOffset: -24.74,
            labelYOffset: 50,
            charge: -30,
            linkStrength: 1,
            linkDistance: 20,
            path: "m 20.54 -14.78 l -41.08 0 c -0.900009 0 -1.44 0.539993 -1.44 1.42999 l 0 26.1 c 0 0.889999 0.899994 1.42999 1.8 1.42999 l 2.50999 0 l 0 -1.92999 l 0 -0.220001 l -1.43001 0 c -0.449997 0 -0.720001 -0.270004 -0.720001 -0.709991 l 0 -23.24 c 0 -0.440002 0.270004 -0.710007 0.720001 -0.710007 l 38.2 0 c 0.449997 0 0.720001 0.270004 0.720001 0.710007 l 0 23.24 c 0 0.439987 -0.270004 0.709991 -0.720001 0.709991 l -18.47 0 l 0 0.220001 l 0 1.92999 l 19.91 0 c 0.900009 0 1.44 -0.539993 1.44 -1.42999 l 0 -26.1 c 0 -0.889999 -0.539993 -1.42999 -1.44 -1.42999 l 0 0 Z m 0 0 m -29.06 8.24001 c 2.3 0 4.16 1.84999 4.16 4.14 c 0 2.28 -1.86 4.12999 -4.16 4.12999 c -2.3 0 -4.15999 -1.84999 -4.15999 -4.12999 c 0 -2.29001 1.85999 -4.14 4.15999 -4.14 l 0 0 Z m 0 0 m 4.22 9.40999 l -8.44 0 c -1.79999 0 -3.25 1.44 -3.25 3.22 l 0 2.42 l 0 3.56001 l 0 5.73999 c 0 0.550003 0.480011 1.01001 1.07001 1.01001 l 12.8 0 c 0.589996 0 1.06999 -0.460007 1.06999 -1.01001 l 0 -5.73999 l 0 -3.56001 l 0 -2.42 c 0 -1.78 -1.45 -3.22 -3.25 -3.22 l 0 0 Z m 0 0 m 6.85001 -10.34 c 0 -0.429993 0.410004 -0.789993 0.919998 -0.789993 l 11.96 0 c 0.51001 0 0.930008 0.360001 0.930008 0.789993 c 0 0.440002 -0.419998 0.800003 -0.930008 0.800003 l -11.96 0 c -0.509995 0 -0.919998 -0.360001 -0.919998 -0.800003 l 0 0 Z m 0 0 m 0 8.10001 c 0 -0.440002 0.410004 -0.790009 0.919998 -0.790009 l 11.96 0 c 0.51001 0 0.930008 0.350006 0.930008 0.790009 c 0 0.429993 -0.419998 0.789993 -0.930008 0.789993 l -11.96 0 c -0.509995 0 -0.919998 -0.360001 -0.919998 -0.789993 l 0 0 Z m 0 0 m 0 -4.05 c 0 -0.430008 0.410004 -0.790009 0.919998 -0.790009 l 11.96 0 c 0.51001 0 0.930008 0.360001 0.930008 0.790009 c 0 0.440002 -0.419998 0.789993 -0.930008 0.789993 l -11.96 0 c -0.509995 0 -0.919998 -0.349991 -0.919998 -0.789993 l 0 0 Z m 0 0 m 0 8.09999 c 0 -0.439987 0.410004 -0.789993 0.919998 -0.789993 l 7.38 0 c 0.509995 0 0.919998 0.350006 0.919998 0.789993 c 0 0.430008 -0.410004 0.790009 -0.919998 0.790009 l -7.38 0 c -0.509995 0 -0.919998 -0.360001 -0.919998 -0.790009 l 0 0 Z m 0 0"
        }
    ];

    // We can create the edges betweeen the vertices programmatically,
    // since every vertex simply links to the central node.

    var edges = [];

    vertices.forEach(function buildLink(vertex, idx){
        if (idx !== 0) {
            edges.push({
                source: 0,
                target: idx,
                linkStrength: vertex.linkStrength,
                linkDistance: vertex.linkDistance
            })
        }
    });

    // That's it for our data, time to start drawing. We add the
    // edges first so they'll appear "under" the vertices. (There's
    // no real `z-index` in SVG.)

    var navigation = d3.select('#navigation');

    var links = navigation.selectAll('.link')
        .data(edges)
        .enter().append('line')
        .classed('link',true)
        .attr('x1', function(d) { return vertices[d.source].x; })
        .attr('y1', function(d) { return vertices[d.source].y; })
        .attr('x2', function(d) { return vertices[d.target].x; })
        .attr('y2', function(d) { return vertices[d.target].y; });

    // Now it's the nodes' turn. The parent element for each is
    // either a generic `<g>` group or, if the vertex has an `href`
    // property, an `<a>` tag with a link to that href.

    var nodes = navigation.selectAll('.node')
        .data(vertices)
        .enter()
        .append(function(d) {
            var elem
            if (d.href) {
                elem = d3.select(document.createElementNS('http://www.w3.org/2000/svg','a'))
                    .attr('xlink:href', d.href)
            } else {
                elem = d3.select(document.createElementNS('http://www.w3.org/2000/svg','g'))
            }
            return elem.node();
        })
        .classed('node', true)
        .attr('transform', function(d) { return 'translate(' + d.x + ',' + d.y + ')'; });

    // Within the parent element is a background circle that obscures any part
    // af a link that would normally be "underneath" a node. The background
    // circles let us change the opacity of the actual circles without
    // inadvertently revealing those parts of the links.

    nodes.append('circle')
        .classed('background', true)
        .attr('r', function(d) { return d.r; })
        .attr('cx', 0)
        .attr('cy', 0);

    // Add the real icon circles. The only difference is the class.

    nodes.append('circle')
        .classed('icon', true)
        .attr('r', function(d) { return d.r; })
        .attr('cx', 0)
        .attr('cy', 0);

    // Embellish the nodes by adding any icon paths and/or text labels.

    nodes.filter(function(d) { return d.path; }).append('path')
        .classed('icon', true)
        .attr('d', function(d) { return d.path; });

    nodes.filter(function(d) { return d.label; }).each(function(d){
        navigation.append('text')
            .classed('label', true)
            .attr('x', function() { return d.x + d.labelXOffset; })
            .attr('y', function() { return d.y + d.labelYOffset; })
            .text(function() { return d.label; });
    });

    // Transition the elements into view

    links.transition().duration(1000).style("opacity", 1);
    nodes.selectAll('circle.icon').transition().duration(1000).style('opacity', 1);
    nodes.selectAll('path.icon').transition().delay(750).duration(250).style('opacity', 1);
    navigation.selectAll('text.label').transition().delay(750).duration(250).style('opacity', 1);

    // Take over handling click events on the `<a>` tags to
    // add a nice transition.

    navigation.selectAll('a').on('click', function(d){
        d3.event.preventDefault();
        var node = d3.select(this);
        var href = node.attr('href');
        var clicked = d;

        // Reverse any CSS fade ins
        d3.selectAll('.fadeIn')
            .classed('fadeIn', false)
            .classed('fadeOut', true);

        links.transition().style('opacity',0);
        navigation.selectAll('text.label').transition().style('opacity', 0);
        nodes.filter(function(d) { return d != clicked; }).selectAll('circle.icon')
            .transition().style('opacity', 0);
        nodes.filter(function(d) { return d != clicked; }).selectAll('path.icon')
            .transition().style('opacity', 0).each('end', function(){
                window.location.assign(href);
            });
    });

    // Restore the page to it's initial state when the user returns
    // via the back button. That action doesn't trigger a reload
    // on all browsers because of the back/forward cache.

    window.onpageshow = function(ev) {
        if (ev.persisted) {
            document.body.style.display = "none";
            window.location.reload();
        }
    };

})();


