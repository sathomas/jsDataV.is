## Creating a Scaleable Map

The first two examples touched on some of the capabilities of <span class="smcp">D3</span>.js, but the library includes many others. From the examples of chapter 6, we know some of the best visualizations rely on maps, and <span class="smcp">D3</span>.js—as a general-purpose visualization library—has extensive support for mapping. To illustrate that support, we’ll create a map that shows tornado sightings in the continental United States.

### Step 1: Prepare the Data

The [<span class="smcp">US</span> National Oceanic and Atmospheric Administration](http://www.noaa.gov) publishes an extensive set of weather and climate data on its [Climate Data Online](http://www.ncdc.noaa.gov/cdo-web/) site. That data includes all storm events reported in the [<span class="smcp">US</span> and its territories. We can download the dataset for the year 2013 as a comma-separated-value (<span class="smcp">CSV</span>) file. Because the file is extremely large and contains many events that aren’t tornadoes, we can edit it to remove the extraneous information using a spreadsheet application such as Microsoft Excel or Numbers for Mac. For this visualization, we only need records that have an `event_type` equal to `”Tornado”`, and we only want the columns for the tornado’s latitude, longitude, and Enhanced Fujita Scale classification (a measure of tornado strength). Once we’ve pruned the (<span class="smcp">CSV</span>) file appropriately, it will look something like the data below.

```
f_scale,latitude,longitude
EF1,33.87,-88.23
EF1,33.73,-87.9
EF0,33.93,-87.5
EF1,34.06,-87.37
EF1,34.21,-87.18
EF1,34.23,-87.11
EF1,31.54,-88.16
EF1,31.59,-88.06
EF1,31.62,-87.85
...
```

Since we’re going to access this data using JavaScript, you might be tempted to convert the file from <span class="smcp">CSV</span> to <span class="smcp">JSON</span> format. It’s better, however, to keep the data in a <span class="smcp">CSV</span> file. <span class="lgcp">D3</span>.js has full support for <span class="smcp">CSV</span>, so we don’t really gain anything by converting to <span class="smcp">JSON</span>. More importantly, the <span class="smcp">JSON</span> file would be more than four times larger than the <span class="smcp">CSV</span> version, and that extra size would slow down the loading of our web page.

### Step 2: Set Up the Page

Our skeletal web page is no different from the other <span class="smcp">D3</span>.js examples. We set aside a container for the map (line 8) and include the <span class="smcp">D3</span>.js library (line 9).

``` {.html .numberLines .line-8 .line-9}
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title></title>
  </head>
  <body>
    <div id="map"></div>
    <script 
      src="//cdnjs.cloudflare.com/ajax/libs/d3/3.4.6/d3.min.js">
    </script>
  </body>
</html>
```

### Step 3: Create a Map Projection

If you can't quite recall your geography lessons about map projections, don't worry. <span class="lgcp">D3</span>.js can handle all of the heavy lifting. Not only does it have extensive support for common projections, but it also supports extensions for custom projections tailored specifically for visualizations. For example, there’s a modified Albers projection that's optimized for choropleth maps of the United States. It repositions (and resizes) Alaska and Hawaii to provide a convenient map of all 50 states. In our case, since there were no tornado sightings in Alaska or Hawaii in 2013, we can use a standard Albers protection.

We set up the projection in the code below. First, in lines 1 and 2, we define the size our map in pixels. Then, in line 4, we create the  Albers projection. <span class="lgcp">D3</span>.js supports many adjustments to the projection to position it appropriately on the page, but the default values are generally fine in our case. We only need to scale the map (line 5) and center it (line 6) on the page.

To draw the map on the page we're going to use <span class="smcp">SVG</span> `<path>` elements, but our map data takes the form of latitude and longitude values. <span class="lgcp">D3</span>.js has a `path` object to translate to <span class="smcp">SVG</span> paths based on a particular map projection. In lines 8 and 9 we create our path object.

``` {.javascript .numberLines}
var width = 640,
    height = 400;

var projection = d3.geo.albers()
    .scale(888)
    .translate([width / 2, height / 2]);

var path = d3.geo.path()
    .projection(projection);
```

### Step 4: Initialize the SVG container

Just as we've done in the previous <span class="smcp">D3</span>.js example, we can create an <span class="smcp">SVG</span> container to hold the map.

``` {.javascript .numberLines}
var svg = d3.select("#map").append("svg")
    .attr("width", width)
    .attr("height", height);

var g = svg.append(“g”);
```

As we’ll see in the later steps, it will be helpful have an inner group in which to place the map. This inner group (defined by a `<g>` element) acts much like an arbitrary `<div>` element in <span class="smcp">HTML</span>. We create that inner group in line 5.

### Step 5: Retrieve the Map Data

For our visualization, the map data is nothing but a map of the <span class="smcp">US</span> with individual states. <span class="lgcp">D3</span>.js uses [<span class="smcp">G</span>eo<span class="smcp">JSON</span>](http://geojson.org) for its map data. Unlike most image tiles that we used in chapter 6, <span class="smcp">G</span>eo<span class="smcp">JSON</span> data is vector-based, so it can be used at any scale. <span class="lgcp">G</span>eo<span class="smcp">JSON</span> data is also in <span class="smcp">JSON</span> format, which makes it especially compatible with JavaScript.

Since our data is in a <span class="smcp">JSON</span> format, we can use the `d3.json()` function to retrieve it. If you're more familiar with jQuery, that function is almost identical to the jQuery `$.getJSON()` function.

``` {.javascript .numberLines}
d3.json("data/us-states.json", function(map) {
    // Process the JSON map data
});
```

### Step 6: Draw the Map

Once we have our data, we can draw the map on the page. The code in this step is very similar to that in the previous example. Each state will be a `<path>` element within the `<g>` container. Using the conventions of <span class="smcp">D3</span>.js, we create a selection of `<path>` elements (line 1) and bind those elements to our data (line 2). When there is no element we create one (line 3), and we set its `d` attribute to be the path associated with the data, given our projection. Note that `path` in line 4 is the object we created in step 4. It is a function that translates the latitude and longitude information into appropriate <span class="smcp">SVG</span> coordinates.

``` {.javascript .numberLines}
g.selectAll("path")
    .data(map.features)
  .enter().append("path")
    .attr("d", path);
```

As we can see from figure NEXTFIGURENUMBER, <span class="smcp">D3</span>.js gives us the paths required to create a nice <span class="smcp">SVG</span> map.

<figure>
<div id='map1'></div>
<figcaption><span class="lgcp">D3</span>.js helps create vector maps from geographic <span class="smcp">JSON</span> data.</figcaption>
</figure>

### Step 8: Retrieve the Data

Now our map is ready for some data. We can retrieve the <span class="smcp">CSV</span> file using another <span class="smcp">D3</span>.js utility. Note, though, that all of the properties of a <span class="smcp">CSV</span> file are considered text strings. We’ll want to convert those strings to numbers. We also want to filter out the few tornado sightings that don’t include latitude and longitude information.

``` {.javascript .numberLines}
d3.csv("tornadoes.csv", function(data) {
    data = data.filter(function(d, i) {
        if (d.latitude && d.longitude) {
            d.latitude = +d.latitude;
            d.longitude = +d.longitude;
            d.f_scale = +d.f_scale[2];
            d.position = projection([
                d.longitude, d.latitude
            ]);
            return true;
        }
    });
    // Continue creating the visualization...
});
```

Once the browser has retrieved the <span class="smcp">CSV</span> file from the server, we can begin processing it in line 2. Here we’re using the `.filter()` method of arrays to iterate through the data values. The `.filter()` method eliminates the data points without latitude and longitude values. It only returns `true` (line 10) if both values are present (line 3). While we’re checking the data points for latitude and longitude, we convert the string values into numbers (lines 4 and 5), extract the number from the Enhanced Fujita Scale classification (line 6), and calculate the position of the sighting in <span class="smcp">SVG</span> coordinates using the projection function we created in step 3 (lines 7-9).

### Step 9: Plot the Data

With the data retrieved, cleaned, and converted, it’s a simple matter to plot the points on the map. Once again we’ll use the traditional <span class="smcp">D3</span>.js approach. Each data point is an <span class="smcp">SVG</span> `<circle>` element, so we select those elements, bind the data to the selection, and use the `.enter()` function to create new `<circle>` elements to match the data.

``` {.javascript .numberLines}
g.selectAll("circle")
    .data(data)
  .enter().append("circle")
    .attr("cx", function(d) { return d.position[0]; })
    .attr("cy", function(d) { return d.position[1]; })
    .attr("r", function(d)  { return 4 + 2*d.f_scale; });
```

As you can see, we set the position of the circles using the `position` property we created in the previous step. Also, to indicate the relative strength of each tornado, we make the size of the circle proportional to the Enhanced Fujita Scale classification (line 6). The result in figure NEXTFIGURENUMBER is a nice map of 2013 tornado sightings in the continental <span class="smcp">U.S.</span>

<figure>
<div id='map2'></div>
<figcaption>Adding points to a map is easy with <span class="smcp">D3</span>.js projections.</figcaption>
</figure>

### Step 10: Add Interactivty

Maps naturally invite users to zoom in and pan around, and <span class="smcp">D3</span>.js makes it easy to support those standard map interactions. Because, <span class="smcp">D3</span>.js gives us complete control, however, we’re not limited to conventions. Let’s do something a little different with our map. We can make each state clickable, so that clicking on any state zooms in on that state. Clicking on a state that’s already zoomed can then zoom the map back out to it’s default. As you’ll see, this behavior is easy to implement with <span class="smcp">D3</span>.js.

The first bit of code we’ll add is a variable that keeps track of the particular state into which the map is zoomed. Initially, the user won’t have zoomed anywhere, so that variable is empty.

``` {.javascript .numberLines}
var active = d3.select(null)
```

Next we add an event handler to all of the state `<path>` elements. We can do that when we create the elements (which we did above in step 6).
    
``` {.javascript .numberLines .line-5}
g.selectAll("path")
    .data(map.features)
  .enter().append("path")
    .attr("d", path)
    .on("click", clicked);
```

The extra statement is line 5. Like jQuery, <span class="smcp">D3</span>.js gives us an easy way to add event handlers to <span class="smcp">HTML</span> and <span class="smcp">SVG</span> elements. Now we have to write that event handler. The handler needs to identify the state on which the user clicked, calculate the position of that state (in <span class="smcp">SVG</span> coordinates), and transition the map to zoom to those coordinates. Before we look at the implementation in detail, it’s worth noting that <span class="smcp">D3</span>.js event handlers are optimized to work with data visualizations (which shouldn’t be surprising). In particular, the parameter passed to the handler is the data item associated with the target element (conventionally named `d`). The JavaScript context (`this`) is set to the specific element that received the event. If the handler needs access to the other properties of the JavaScript event, they’re available in the `d3.event` global variable. Here’s how those conventions work in a real event handler.

``` {.javascript .numberLines}
var clicked = function(d) {
    active.attr("fill", "#cccccc");
    active = d3.select(this)
        .attr("fill", "#F77B15");

    var bounds = path.bounds(d),
        dx = bounds[1][0] - bounds[0][0],
        dy = bounds[1][1] - bounds[0][1],
        x = (bounds[0][0] + bounds[1][0]) / 2,
        y = (bounds[0][1] + bounds[1][1]) / 2,
        scale = .9 / Math.max(dx / width, dy / height),
        translate = [
            width / 2 - scale * x, 
            height / 2 - scale * y];

    g.transition()
        .duration(750)
        .attr("transform", "translate(" + 
            translate + ")scale(" + 
            scale + ")");
};
```

In lines 2-4 we manipulate the map colors. The previously zoomed state is reset to a muted gray, and the clicked state is filled with a vibrant orange. Notice that this same code resets the `active` variable so that it accurately tracks the zoomed state. Next, in lines 6-14, we calculate the bounds of the zoomed state. Well, actually, we let <span class="smcp">D3</span>.js do the calculation. All the work happens in the `bounds()` function we call in line 6. The other lines are mostly just extracting the individual parts of that calculation. In line 11 we calculate how to scale the map so that the zoomed state fills 90% of the map. Then, in lines 12-14, we calculate how to shift the map to center that state. The final block of code (lines 16-20) adjusts the map by scaling and translating the <span class="smcp">SVG</span>. As you can see from line 16, we’re using a <span class="smcp">D3</span>.js transition to animate the change in view.

The code we’ve seen so far still needs a few minor additions to deal with some loose ends, but I’ll leave those to the book’s [source code](http://jsDataV.is/source/). The result in figure NEXTFIGURENUMBER is a nice, interactive map of our data.

<style>
#map3 path {
    cursor: pointer;
}
</style>

<figure>
<div id='map3'></div>
<figcaption><span class="lgcp">D3</span>.js makes it easy to add custom interactions to maps.</figcaption>
</figure>

<script>
;(function(){

    draw = function() {

		var width = 630,
		    height = 394;

		var projection = d3.geo.albers()
		    .scale(888)
		    .translate([width / 2, height / 2]);

		var path = d3.geo.path()
		    .projection(projection);

		var svg = d3.select("#map1").append("svg")
		    .attr("width", width)
		    .attr("height", height);

        var svg2 = d3.select("#map2").append("svg")
		    .attr("width", width)
		    .attr("height", height);

        var g = d3.select("#map3").append("svg")
		    .attr("width", width)
		    .attr("height", height)
            .append("g");

        var active = d3.select(null);

		d3.json("data/us-states.json", function(us) {
		    svg.selectAll("path")
                 .data(us.features)
               .enter().append("path")
                 .attr("d", path)
                 .attr("fill", "#cccccc")
                 .attr("stroke", "#ffffff");

		    svg2.selectAll("path")
                 .data(us.features)
               .enter().append("path")
                 .attr("d", path)
                 .attr("fill", "#cccccc")
                 .attr("stroke", "#ffffff");

		    g.selectAll("path")
                 .data(us.features)
               .enter().append("path")
                 .attr("d", path)
                 .attr("fill", "#cccccc")
                 .attr("stroke", "#ffffff")
                 .on("click", clicked);

         	d3.csv("data/tornadoes2013.csv", function(data) {

                data = data.filter(function(d, i) {
                    if (d.latitude && d.longitude) {
                        d.latitude = +d.latitude;
                        d.longitude = +d.longitude;
                        d.f_scale = +d.f_scale[2];
                        d.position = projection([
                            d.longitude, d.latitude
                        ]);
                        return true;
                    }
                });

                svg2.selectAll("circle")
                    .data(data)
                  .enter().append("circle")
                    .attr("cx", function(d) { return d.position[0]; })
                    .attr("cy", function(d) { return d.position[1]; })
                    .attr("r", function(d)  { return 4 + 2*d.f_scale; })
                    .attr("stroke", "#dddddd")
                    .attr("fill", "#ca0000")
                    .attr("fill-opacity", "0.8");

                g.selectAll("circle")
                    .data(data)
                  .enter().append("circle")
                    .attr("cx", function(d) { return d.position[0]; })
                    .attr("cy", function(d) { return d.position[1]; })
                    .attr("r", function(d)  { return 4 + 2*d.f_scale; })
                    .attr("stroke", "#dddddd")
                    .attr("fill", "#ca0000")
                    .attr("fill-opacity", "0.8");
            });
		});

        var clicked = function(d) {
            if (active.node() === this) return reset();
            active.attr("fill", "#cccccc");
            active = d3.select(this)
                .attr("fill", "#F77B15");

            var bounds = path.bounds(d),
                dx = bounds[1][0] - bounds[0][0],
                dy = bounds[1][1] - bounds[0][1],
                x = (bounds[0][0] + bounds[1][0]) / 2,
                y = (bounds[0][1] + bounds[1][1]) / 2,
                scale = .9 / Math.max(dx / width, dy / height),
                translate = [width / 2 - scale * x, height / 2 - scale * y];

            g.transition()
                .duration(750)
                .style("stroke-width", 1.5 / scale + "px")
                .attr("transform", "translate(" + translate + ")scale(" + scale + ")");

            g.selectAll("circle")
                .transition()
                .duration(750)
                .attr("r", function(d)  { return (4 + 2*d.f_scale)/scale; });
        };

        var reset = function() {
            active.attr("fill", "#cccccc");
            active = d3.select(null);
            g.transition()
                .duration(750)
                .style("stroke-width", "1px")
                .attr("transform", "");
            g.selectAll("circle")
                .transition()
                .duration(750)
                .attr("r", function(d)  { return (4 + 2*d.f_scale); });
        };

    };

    if (typeof contentLoaded != "undefined") {
        contentLoaded.done(draw);
    } else {
        window.addEventListener('load', draw);
    }

}());
</script>

