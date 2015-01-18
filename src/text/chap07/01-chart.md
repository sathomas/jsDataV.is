## Adapting a Traditional Chart Type

The most significant difference between <span class="smcp">D3</span>.js and other JavaScript libraries is its philosophy. <span class="lgcp">D3</span>.js is not a tool for creating predefined types of charts and visualizations. Instead, it’s a library to help your create any visualization, including custom and unique presentations. It takes more effort to create a standard chart with <span class="smcp">D3</span>.js, but by using it we're not limited to standard charts. To get a sense of how <span class="smcp">D3</span>.js works, we can create a custom chart that wouldn't be possible with a typical charting library.

For this example, we'll visualize one of the most important findings in modern physics—Hubble's Law. According to that law, the universe is expanding, and as a result, the speed at which we perceive distant galaxies to be moving varies according to their distance from us. More precisely, Hubble's Law proposes that the variation, or shift, in this speed is a linear function of distance. To visualize the law, we can chart the speed variation (known as _red shift velocity_) versus distance for several galaxies. If Hubble is right the chart should look like a line. For our data, we'll use galaxies and clusters from Hubble's original [1929 paper](http://www.pnas.org/content/15/3/168.full) but updated with current values for distance and red shift velocities.

So far this task seems like a good match for a scatter plot. Distance could serve as the x-axis and velocity the y-axis. There's a twist, though: physicists don't actually know the distances or velocities that we want to chart, at least not exactly. The best they can do is estimate those values, and there is potential for error in both. But that's no reason to abandon the effort. In fact, potential errors in the values might be an important aspect for us to highlight in our visualization. To do that, we won't draw each value as a point. Rather, we'll show it as a box, and the box dimensions will correspond to the potential errors in the value. This approach isn’t common for scatter plots, but <span class="smcp">D3</span>.js can accommodate it with ease.

### Step 1: Prepare the Data

Here is the data for our chart according to recent estimates.

| Nebulae/Cluster | Distance         | Red Shift Velocity |
|-----------------|------------------|--------------------|
| NGC 6822        |  0.500±0.010 Mpc |   57±2 km/s        |
| NGC  221        |  0.763±0.024 Mpc |  200±6 km/s        |
| NGC  598        |  0.835±0.105 Mpc |  179±3 km/s        |
| NGC 4736        |  4.900±0.400 Mpc |  308±1 km/s        |
| NGC 5457        |  6.400±0.500 Mpc |  241±2 km/s        |
| NGC 4258        |  7.000±0.500 Mpc |  448±3 km/s        |
| NGC 5194        |  7.100±1.200 Mpc |  463±3 km/s        |
| NGC 4826        |  7.400±0.610 Mpc |  408±4 km/s        |
| NGC 3627        | 11.000±1.500 Mpc |  727±3 km/s        |
| NGC 7331        | 12.200±1.000 Mpc |  816±1 km/s        |
| NGC 4486        | 16.400±0.500 Mpc | 1307±7 km/s        |
| NGC 4649        | 16.800±1.200 Mpc | 1117±6 km/s        |
| NGC 4472        | 17.100±1.200 Mpc |  729±2 km/s        |

We can represent that in JavaScript using the following array.

``` {.javascript .numberLines}
hubble_data = [
    { nebulae: "NGC 6822", distance:  0.500, distance_error: 0.010,
      velocity:   57, velocity_error: 2, },
    { nebulae: "NGC  221", distance:  0.763, distance_error: 0.024,
      velocity:  200, velocity_error: 6, },
    { nebulae: "NGC  598", distance:  0.835, distance_error: 0.105,
      velocity:  179, velocity_error: 3, },
    // Data set continues...
```

### Step 2: Set Up the Web Page

<span class="lgcp">D3</span>.js doesn't depend on any other libraries, and it's available on most content distribution networks. All we need to do is include it in the page (line 10). We'll also want to set up a container for the visualization, so our markup includes a `<div>` with the id `"container"` on line 8.

``` {.html .numberLines .line-8 .line-10}
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title></title>
  </head>
  <body>
    <div id="container"></div>
    <script 
      src="//cdnjs.cloudflare.com/ajax/libs/d3/3.4.6/d3.min.js">
    </script>
  </body>
</html>
```

### Step 3: Create a Stage for the Visualization

Unlike higher-level libraries, <span class="smcp">D3</span>.js doesn't draw the visualization on the page. We'll have to do that ourselves. In exchange for the additional effort, though, we get the freedom to pick our own drawing technology. We could follow the same approach as most libraries in this book and use <span class="smcp">HTML5</span>'s `<canvas>` element, or we could simply use native <span class="smcp">HTML</span>. Now that we’ve seen it in action in chapter 6, however, it seems Scalable Vector Graphics (<span class="smcp">SVG</span>) is the best approach for our chart. The root of our graph, therefore, will be an `<svg>` element, and we need to add that to the page. We can define its dimensions at the same time using attributes.

If we were using jQuery, we might do something like the following:

``` {.javascript .numberLines}
var svg = $("<svg>").attr("height", height).attr("width", width);
$("#container").append(svg);
```

With <span class="smcp">D3</span>.js our code is very similar:

``` {.javascript .numberLines}
var svg = d3.select("#container").append("svg")
    .attr("height", height)
    .attr("width", width);
```

With this statement we're selecting the container, appending an `<svg>` element to it, and setting the attributes of that `<svg>` element. This statement highlights one important difference between <span class="smcp">D3</span>.js and jQuery that often trips up developers starting out with <span class="smcp">D3</span>.js. In jQuery the `append()` method returns the original selection so that you can continue operating on that selection. More specifically, `$("#container").append(svg)` returns `$("#container")`.

With <span class="smcp">D3</span>.js, on the other hand, `append()` returns a different selection, the newly appended element(s). So `d3.select("#container").append("svg")` doesn't return the container selection but rather a selection of the new `<svg>` element. The `attr()` calls that follow, therefore, apply to the `<svg>` element and not the `"#container"`.

### Step 4: Control the Chart's Dimensions

So far we haven't specified the actual values for the chart's height and width; we've only used `height` and `width` variables. Having the dimensions in variables will come in handy, and it will make it easy to incorporate margins in the visualization. The code below sets up those dimensions; its form is a common convention in <span class="smcp">D3</span>.js visualizations.

``` {.javascript .numberLines}
var margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = 640 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;
```

We'll have to adjust the code that creates the main `<svg>` container to account for these margins.

``` {.javascript .numberLines}
var svg = d3.select("#chart1").append("svg")
    .attr("height", height + margin.left + margin.right)
    .attr("width", width + margin.top + margin.bottom);
```

To make sure our chart honors the defined margins, we'll construct it entirely within a child <span class="smcp">SVG</span> group (`<g>`) element. The `<g>` element is just an arbitrary containing element in <span class="smcp">SVG</span>, much like the `<div>` element for <span class="smcp">HTML</span>. We can use <span class="smcp">D3</span>.js to create the element and position it appropriately within the main `<svg>` element.

``` {.javascript .numberLines}
var chart = svg.append("g")
    .attr("transform", 
        "translate(" + margin.left + "," + margin.top + ")"
    );
```

Visualizations must often rescale the source data. In our case, we'll need to rescale the data to fit within the chart dimensions. Instead of ranging from 0.5 to 17 Mpc, for example, galactic distance should be scaled between 0 and 920 pixels. Since this type of requirement is common for visualizations, <span class="smcp">D3</span>.js has tools to help. Not surprisingly, they're `scale` objects. We'll create scales for both the x- and the y-dimensions.

As the code below indicates, both of our scales are linear. Linear transformations are pretty simple (and we really don't need <span class="smcp">D3</span>.js to manage them); however, <span class="smcp">D3</span>.js supports other types of scales that can be quite complex. With <span class="smcp">D3</span>.js using more sophisticated scaling is just as easy as using linear scales.

``` {.javascript .numberLines}
var xScale = d3.scale.linear()
    .range([0,width]);
var yScale = d3.scale.linear()
    .range([height,0]);
```

We define both ranges as the desired limits for each scale. The x-scale ranges from 0 to the chart's width, and the y-scale ranges from 0 to the chart's height. Note, though, that we've reversed the normal order for the y-scale. That's because <span class="smcp">SVG</span> dimensions (just like <span class="smcp">HTML</span> dimensions) place 0 at the top of the area. That convention is the opposite of the normal chart convention which places 0 at the bottom. To account for the reversal, we swap the values when defining the range.

At this point we've set the ranges for each scale, and those ranges define the desired output. We also have to specify the possible inputs to each scale, which <span class="smcp">D3</span>.js calls the _domain._ Those inputs are the minimum and maximum values for the distance and velocity. We can use <span class="smcp">D3</span>.js to extract the values directly from the data. Here's how to get the minimum distance:

``` {.javascript .numberLines}
var minDist = d3.min(hubble_data, function(nebulae) { 
    return nebulae.distance - nebulae.distance_error;
});
```

We can't simply find the minimum value in the data because we have to account for the distance error. As we can see above, <span class="smcp">D3</span>.js accepts a function as a parameter to `d3.min()`, and that function can make the necessary adjustment. We can use the same approach for maximum values as well. Here's the complete code for defining the domains of both scales:


``` {.javascript .numberLines}
xScale.domain([
        d3.min(hubble_data, function(nebulae) { 
            return nebulae.distance - nebulae.distance_error; 
        }),
        d3.max(hubble_data, function(nebulae) { 
            return nebulae.distance + nebulae.distance_error; 
        })
    ])
    .nice();
yScale.domain([
        d3.min(hubble_data, function(nebulae) { 
            return nebulae.velocity - nebulae.velocity_error; 
        }),
        d3.max(hubble_data, function(nebulae) { 
            return nebulae.velocity + nebulae.velocity_error; 
        })
    ])
    .nice();
```

### Step 5: Draw the Chart Framework

Axes are another common feature in visualizations, and <span class="smcp">D3</span>.js has tools for those as well. To create the axes for our chart, we specify the appropriate scales and an orientation. As you can see from the code below, <span class="smcp">D3</span>.js supports axes as part of its <span class="smcp">SVG</span> utilities.

``` {.javascript .numberLines}
var xAxis = d3.svg.axis()
    .scale(xScale)
    .orient("bottom");
var yAxis = d3.svg.axis()
    .scale(yScale)
    .orient("left");
```

After defining the axes, we can use <span class="smcp">D3</span>.js to add the appropriate <span class="smcp">SVG</span> elements to the page. We'll contain each axis within its own `<g>` group. For the x-axis, we need to shift that group to the bottom of the chart.

``` {.javascript .numberLines}
var xAxisGroup = chart.append("g")
    .attr("transform", "translate(0," + height + ")");
```

To create the <span class="smcp">SVG</span> elements that make up the axis, we could call the `xAxis` object and pass it the containing group as a parameter.

``` {.javascript .numberLines}
xAxis(xAxisGroup);
```

With <span class="smcp">D3</span>.js, though, there's a more concise expression that avoids creating unnecessary local variables and preserves method chaining.

``` {.javascript .numberLines}
chart.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);
```

And as long as we're preserving method chaining, we can take advantage of it to add yet another element to our chart: this time, it's the label for the axis.

``` {.javascript .numberLines}
chart.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis)
  .append("text")
    .attr("x", width)
    .attr("y", -6)
    .style("text-anchor", "end")
    .text("Distance (Mpc)");
```

If you look under the hood, you'll find that <span class="smcp">D3</span>.js has done quite a bit of work for us in creating the axis, its tick marks, and its labels. Here's a taste of the <span class="smcp">SVG</span> it builds.

``` {.html .numberLines}
<g class="x axis" transform="translate(0,450)">
    <g class="tick" transform="translate(0,0)" style="opacity: 1;">
        <line y2="6" x2="0"></line>
        <text y="9" x="0" dy=".71em" style="text-anchor: middle;">0</text>
    </g>
    <g class="tick" transform="translate(77.77,0)" style="opacity: 1;">
        <line y2="6" x2="0"></line>
        <text y="9" x="0" dy=".71em" style="text-anchor: middle;">2</text>
    </g>
    <!-- Additional Tick Marks... -->
    <path class="domain" d="M0,6V0H700V6"></path>
    <text x="700" y="-6" style="text-anchor: end;">Distance (Mpc)</text>
</g>
```

When we add the code for the y-axis, we've completed the framework for the chart.

``` {.javascript .numberLines}
chart.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis)
  .append("text")
    .attr("x", width)
    .attr("y", -6)
    .style("text-anchor", "end")
    .text("Distance (Mpc)");

chart.append("g")
    .call(yAxis)
  .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 6)
    .attr("dy", ".71em")
    .style("text-anchor", "end")
    .text("Red Shift Velocity (km/s)")
```

The result of figure NEXTFIGURENUMBER isn't very exciting without any data, but it does give us a framework for the chart.

<style>
svg { font: 16px; }

.axis path, .axis line {
  fill: none;
  stroke: #888;
  shape-rendering: crispEdges;
}
</style>

<figure>
<div id='chart1'></div>
<figcaption><span class="lgcp">D3</span>.js provides tools to create the framework for a chart.</figcaption>
</figure>

As you can tell, we've had to write quite a bit of code just to get a couple of axes on the page. That's the nature of <span class="smcp">D3</span>.js. It's not a library to which you can simply pass a data set and get a chart as an output. Instead, think of it as a collection of very useful utilities that you can use to help create your own charts.

### Step 6: Add the Data to the Chart

Now that our chart's framework is ready, we can add the actual data. Because we want to show both the distance and velocity errors in the data, we can draw each point as a rectangle. For a simple, static chart, we can add <span class="smcp">SVG</span> `<rect>` elements just as we've created the rest of the chart. We can take advantage of our x- and y-scales to calculate the dimensions of the rectangles.

``` {.javascript .numberLines}
hubble_data.forEach(function(nebulae) {
	chart2.append("rect")
      .attr("x", xScale(nebulae.distance - nebulae.distance_error))
      .attr("width", xScale(2 * nebulae.distance_error))
      .attr("y", yScale(nebulae.velocity - nebulae.velocity_error))
      .attr("height", height - yScale(2 * nebulae.velocity_error));
});
```

The approach above works fine for this example and results in the chart of figure NEXTFIGURENUMBER. Typically, however, <span class="smcp">D3</span>.js visualizations combine their data sets directly with markup elements and rely on <span class="smcp">D3</span>'s `enter`, `update`, and `exit` selections to add the data to the page. We'll defer further discussion of this alternative approach until the next example. 

<figure>
<div id='chart2'></div>
<figcaption><span class="lgcp">D3</span>.js can render the data elements using any valid markup, including <span class="smcp">SVG</span> &lt;rect&gt; elements with defined dimensions.</figcaption>
</figure>

### Step 7: Answer Users' Questions

Whenever you create a visualization, it's a good idea to anticipate questions that users might ask when they view it. In our example so far, we've presented a data set that leads to Hubble's Law. But we haven't (yet) shown how well the data fits that law. Since that is such an obvious question, let's answer it right on the chart itself.

The current estimate for the Hubble Constant (<span class="smcp">H0</span>) is about 70 km/s/Mpc. To show how that matches the data on our chart, we can create a line graph with that slope beginning at the point (0,0). A single <span class="smcp">SVG</span> `<line>` is all that's required. Once again we rely on the <span class="smcp">D3</span>.js scales to define the line's coordinates.

``` {.javascript .numberLines}
chart.append("line")
    .attr("x1",xScale(0))
    .attr("y1",yScale(0))
    .attr("x2",xScale(20))
    .attr("y2",yScale(1400));
```

In figure NEXTFIGURENUMBER we can see that Hubble's Law remains a good approximation.

<figure>
<div id='chart3'></div>
<figcaption>The complete custom chart shows the data set exactly as we wish.</figcaption>
</figure>


<script>
;(function(){

    draw = function() {

		var hubble_data = [
		    { nebulae: "NGC 6822", distance:  0.500, distance_error: 0.010, velocity:   57, velocity_error: 2, },
		    { nebulae: "NGC  221", distance:  0.763, distance_error: 0.024, velocity:  200, velocity_error: 6, },
		    { nebulae: "NGC  598", distance:  0.835, distance_error: 0.105, velocity:  179, velocity_error: 3, },
		    { nebulae: "NGC 4736", distance:  4.900, distance_error: 0.400, velocity:  308, velocity_error: 1, },
		    { nebulae: "NGC 4258", distance:  7.000, distance_error: 0.500, velocity:  448, velocity_error: 3, },
		    { nebulae: "NGC 5194", distance:  7.100, distance_error: 1.200, velocity:  463, velocity_error: 3, },
		    { nebulae: "NGC 4826", distance:  7.400, distance_error: 0.610, velocity:  408, velocity_error: 4, },
		    { nebulae: "NGC 3627", distance: 11.000, distance_error: 1.500, velocity:  727, velocity_error: 3, },
		    { nebulae: "NGC 7331", distance: 12.200, distance_error: 1.000, velocity:  816, velocity_error: 1, },
		    { nebulae: "NGC 4486", distance: 16.400, distance_error: 0.500, velocity: 1307, velocity_error: 7, },
		    { nebulae: "NGC 4649", distance: 16.800, distance_error: 1.200, velocity: 1117, velocity_error: 6, },
		];


		var margin = {top: 20, right: 20, bottom: 30, left: 40},
		    width = 640 - margin.left - margin.right,
		    height = 400 - margin.top - margin.bottom;

		var svg1 = d3.select("#chart1").append("svg")
		    .attr("height", height + margin.left + margin.right)
		    .attr("width", width + margin.top + margin.bottom);

		var chart1 = svg1.append("g")
		    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

		var xScale = d3.scale.linear()
		    .range([0,width]);
		var yScale = d3.scale.linear()
		    .range([height,0]);

		var xAxis = d3.svg.axis()
		    .scale(xScale)
		    .orient("bottom");
		var yAxis = d3.svg.axis()
		    .scale(yScale)
		    .orient("left");
    
		xScale.domain([
		        d3.min(hubble_data, function(nebulae) { return nebulae.distance - nebulae.distance_error; }),
		        d3.max(hubble_data, function(nebulae) { return nebulae.distance + nebulae.distance_error; })
		    ])
		    .nice();

		yScale.domain([
		        d3.min(hubble_data, function(nebulae) { return nebulae.velocity - nebulae.velocity_error; }),
		        d3.max(hubble_data, function(nebulae) { return nebulae.velocity + nebulae.velocity_error; })
		    ])
		    .nice();

		chart1.append("g")
		    .attr("class", "x axis")
		    .attr("transform", "translate(0," + height + ")")
		    .call(xAxis)
		  .append("text")
		    .attr("x", width)
		    .attr("y", -6)
		    .style("text-anchor", "end")
		    .text("Distance (Mpc)");

		chart1.append("g")
		    .attr("class", "y axis")
		    .call(yAxis)
		  .append("text")
		    .attr("transform", "rotate(-90)")
		    .attr("y", 6)
		    .attr("dy", ".71em")
		    .style("text-anchor", "end")
		    .text("Red Shift Velocity (km/s)")

		var svg2 = d3.select("#chart2").append("svg")
		    .attr("height", height + margin.left + margin.right)
		    .attr("width", width + margin.top + margin.bottom);

		var chart2 = svg2.append("g")
		    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

		chart2.append("g")
		    .attr("class", "x axis")
		    .attr("transform", "translate(0," + height + ")")
		    .call(xAxis)
		  .append("text")
		    .attr("x", width)
		    .attr("y", -6)
		    .style("text-anchor", "end")
		    .text("Distance (Mpc)");

		chart2.append("g")
		    .attr("class", "y axis")
		    .call(yAxis)
		  .append("text")
		    .attr("transform", "rotate(-90)")
		    .attr("y", 6)
		    .attr("dy", ".71em")
		    .style("text-anchor", "end")
		    .text("Red Shift Velocity (km/s)")

		hubble_data.forEach(function(nebulae) {
			chart2.append("rect")
		      .attr("x", xScale(nebulae.distance - nebulae.distance_error))
		      .attr("width", xScale(2 * nebulae.distance_error))
		      .attr("y", yScale(nebulae.velocity - nebulae.velocity_error))
		      .attr("height", height - yScale(2 * nebulae.velocity_error))
		      .style("fill", "red");
		});

		var svg3 = d3.select("#chart3").append("svg")
		    .attr("height", height + margin.left + margin.right)
		    .attr("width", width + margin.top + margin.bottom);

		var chart3 = svg3.append("g")
		    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

		chart3.append("g")
		    .attr("class", "x axis")
		    .attr("transform", "translate(0," + height + ")")
		    .call(xAxis)
		  .append("text")
		    .attr("x", width)
		    .attr("y", -6)
		    .style("text-anchor", "end")
		    .text("Distance (Mpc)");

		chart3.append("g")
		    .attr("class", "y axis")
		    .call(yAxis)
		  .append("text")
		    .attr("transform", "rotate(-90)")
		    .attr("y", 6)
		    .attr("dy", ".71em")
		    .style("text-anchor", "end")
		    .text("Red Shift Velocity (km/s)")

		hubble_data.forEach(function(nebulae) {
			chart3.append("rect")
		      .attr("x", xScale(nebulae.distance - nebulae.distance_error))
		      .attr("width", xScale(2 * nebulae.distance_error))
		      .attr("y", yScale(nebulae.velocity - nebulae.velocity_error))
		      .attr("height", height - yScale(2 * nebulae.velocity_error))
		      .style("fill", "red");
		});

		chart3.append("line")
		    .attr("x1",xScale(0))
		    .attr("y1",yScale(0))
		    .attr("x2",xScale(20))
		    .attr("y2",yScale(1400))
		    .style("stroke","#300083");
    };

    if (typeof contentLoaded != "undefined") {
        contentLoaded.done(draw);
    } else {
        window.addEventListener('load', draw);
    }

}());
</script>