## Creating a Unique Visualization

If you’ve followed the first three examples in this chapter, you’re probably beginning to appreciate how <span class="smcp">D3</span>.js has a great deal more flexibility than traditional JavaScript libraries. Instead of creating visualizations for you, it provides many tools and utilities that you can use however you wish. We’ve used that flexibility to add unconventional error bars to a chart, to refine the behavior of a network graph, and to customize user interactions with a map. With <span class="smcp">D3</span>.js, however, we aren’t limited to minor adjustments to existing visualization types. Instead, we can use the library to create unique visualizations that are nothing like those in traditional libraries.

In this example we’ll use the same data we used previously—tornado sightings in the <span class="smcp">US</span>.js from 2013. Rather than placing the sightings on a map, however, we’ll create an interactive, hierarchical visualization that lets users understand the number of sightings by region, by state, or even by counties within a state. Considering the subject matter, a circular hierarchy could be especially effective, so we’ll create a sunburst visualization with rotational animations. The code that follows is based on an [example (http://bl.ocks.org/mbostock/4348373)developed by Mike Bostock, the main <span class="smcp">D3</span>.js developer.

> Note: To be fair, it is possible to create sunburst visualizations using some charting libraries, generally by customizing a variation of the pie chart. Those libraries, however, are focused much more on off-the-shelf use. Creating custom visualizations is generally much easier with a library like <span class="smcp">D3</span>.js that is designed especially for customization.

### Step 1: Prepare the Data

For this example we’ll use the same data behind the previous visualization—2013 tornado sightings from the [<span class="smcp">US</span> National Oceanic and Atmospheric Administration’s](http://www.noaa.gov) [Climate Data Online](http://www.ncdc.noaa.gov/cdo-web/) site. As before, we’ll clean and prune the dataset. Instead of longitude, latitude, and Enhanced Fujita Scale classification, however, we’ll keep the state and county. We’ll also add a region name as a way to group subsets of states.The resulting (<span class="smcp">CSV</span>) file begins as below.

```
state,region,county
Connecticut,New England,Fairfield County
Connecticut,New England,Hartford County
Connecticut,New England,Hartford County
Connecticut,New England,Tolland County
Maine,New England,Somerset County
Maine,New England,Washington County
Maine,New England,Piscataquis County
...
```

### Step 2: Set Up the Page

Our skeletal web page is no different from the other <span class="smcp">D3</span>.js examples. We set aside a container for the visualization (line 8) and include the <span class="smcp">D3</span>.js library (line 10).

``` {.html .numberLines .line-8 .line-10}
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title></title>
  </head>
  <body>
    <div id="chart"></div>
    <script 
      src="//cdnjs.cloudflare.com/ajax/libs/d3/3.4.6/d3.min.js">
    </script>
  </body>
</html>
```

### Step 3: Create a Stage for the Visualization

As with our other <span class="smcp">D3</span>.js examples, we start by creating an `<svg>` container for the visualization. Within that container, we’ll also add a group (`<g>`) element.

``` {.javascript .numberLines}
var width = 640,
    height = 400,
    maxRadius = Math.min(width, height) / 2;

var svg = d3.select("#map").append("svg")
    .attr("width", width)
    .attr("height", height);

var g = svg.append(“g”);
    .attr("transform", "translate(" + 
        (width  / 2) + "," + 
        (height / 2) + ")");
```

The code above contains a couple of new wrinkles. First, in line 3, we calculate the maximum radius for the visualization. This value—which is half of the height or the width, whichever is smaller—will come in handy in the code that follows. More interestingly, in lines 10-12 we translate the inner `<g>` container so that its coordinate system places the point (0,0) right in the center of the visualization. This translation makes it easy to center the sunburst and it makes it much simpler to calculate sunburst parameters.

### Step 4: Create Scales

When it’s complete, our visualization will consist of areas corresponding to regions in the <span class="smcp">U.S.</span>; larger areas will represent regions with more tornadoes. Because we’re dealing with areas, we’ll need two dimensions for each region. We are not, however, going to draw our areas as simple rectangles; instead we’re going to use arcs. That will require a bit of trigonometry, but, fortunately, <span class="smcp">D3</span>.js provides a lot of help. We’ll start by defining some `scale` objects. We first saw scales in the step 4 of this chapter’s first example where they translated data values to <span class="smcp">SVG</span> coordinates. The scales in the code below do much the same, except they’re using polar coordinates.

``` {.javascript .numberLines}
var theta = d3.scale.linear()
    .range([0, 2 * Math.PI]);
var radius= d3.scale.sqrt()
    .range([0, maxRadius]);
```

As you can see, the angular scale is a linear scale that ranges from 0 to 2π (or 360°). The radial scale ranges from 0 to the maximum radius, but it’s not linear. Instead, this scale is a square root scale; <span class="smcp">D3</span>.js takes the square root of the input before computing the output. The area of an arc varies as the square of its radius, and the square root scale compensates for this effect.

> Note: In prior examples, we’ve set both ranges (outputs) and domains (inputs) for our scales. In this case, however, we won’t need to set domains explicitly. The default domain of [0,1] is exactly what we need for both scales.

The scales we’ve defined come in handy in the next bit of code. Here we define a function that calculates the <span class="smcp">SVG</span> path for a single arc. Most of the work takes place in the <span class="smcp">D3</span>.js function `d3.svg.arc()` which computes an arc’s path. That function, though, needs four parameters: the starting and ending angles and the starting and ending radii for the arc. The values for those parameters come from our scales.

When we use our `arc()` function later in the code, we’re going to call it with a <span class="smcp">D3</span>.js selection. That selection will have a data value associated with it, and the data value will include four properties:

* `.x`: the starting x–position for the data
* `.dx`: the data’s length along the x–axis (∆x)
* `.y`: the starting y–position for the data
* `.dx`: the data’s length along the y–axis (∆y)

Given those properties, here’s the code that generates the arc path.

``` {.javascript .numberLines}
var arc = d3.svg.arc()
    .startAngle(function(d) { 
        return Math.max(0, Math.min(2 * Math.PI, theta(d.x))); 
    })
    .endAngle(function(d) { 
        return Math.max(0, Math.min(2 * Math.PI, theta(d.x + d.dx)));
    })
    .innerRadius(function(d) { 
        return Math.max(0, radius(d.y));
    })
    .outerRadius(function(d) { 
        return Math.max(0, radius(d.y + d.dy)); 
    });
```

The code itself is pretty straightforward, but a picture helps explain why we’re using the code this way. Assume that the data associated with a selection has a position (x,y) of (12.5, 10), a width of 25, and a height of 30. The data properties would then be:

* `.x = 12.5`
* `.dx = 25`
* `.y = 10`
* `.dy = 30`

In Cartesian coordinates, we could draw the selection as on the left side of figure NEXTFIGURENUMBER. Our scales and arc function will transform it to the right side of the figure.

<figure>
<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="640" height="376"  xml:space="preserve">
<path stroke="rgb(0, 121, 121)" stroke-miterlimit="4" fill="rgb(0, 121, 121)" d="M 516.8,88.2 L 516.8,88.2 C 578.55,149.94 578.55,250.06 516.8,311.8 L 460.9,255.9 460.9,255.9 C 491.78,225.03 491.78,174.97 460.9,144.1 L 516.8,88.2 Z M 516.8,88.2" />
<text font-size="12" x="445" y="203" text-anchor="middle">90&#0176;</text>
<text font-size="12" x="418" y="174" text-anchor="middle">45&#0176;</text>
<text font-size="12" x="501" y="88" text-anchor="middle">158</text>
<text font-size="12" x="450" y="140" text-anchor="middle">79</text>
<path stroke="rgb(68, 68, 68)" stroke-width="0.5" stroke-miterlimit="4" fill="rgb(68, 68, 68)" d="M 442.45,234.5 L 440.68,238.39 444.57,236.62 442.45,234.5 Z M 442.45,234.5" />
<path stroke="rgb(68, 68, 68)" stroke-miterlimit="4" fill="none" d="M 441.44,163.73 C 461.75,184.04 461.75,216.96 441.44,237.27" />
<path stroke="rgb(68, 68, 68)" stroke-width="0.5" stroke-miterlimit="4" fill="rgb(68, 68, 68)" d="M 418,181.5 L 422.03,182.92 419.93,179.2 418,181.5 Z M 418,181.5" />
<path stroke="rgb(68, 68, 68)" stroke-miterlimit="4" fill="none" d="M 403.5,174.5 C 410.77,174.58 416.89,177.29 421.99,182.39" />
<path stroke="rgb(68, 68, 68)" stroke-miterlimit="10" stroke-dasharray="1,1,1,1" fill="none" d="M 403.5,200.5 L 535.5,68.5" />
<path stroke="rgb(68, 68, 68)" stroke-miterlimit="10" stroke-dasharray="1,1,1,1" fill="none" d="M 403.5,200.5 L 535.5,332.5" />
<path stroke="rgb(68, 68, 68)" stroke-miterlimit="10" stroke-dasharray="1,1,1,1" fill="none" d="M 403.5,200.5 L 403.5,13.5" />
<rect stroke="rgb(126, 189, 0)" fill="rgb(126, 189, 0)" x="120" y="64" width="150" height="180" />
<text font-size="12" x="98" y="157" text-anchor="middle">30</text>
<path stroke="rgb(68, 68, 68)" stroke-miterlimit="10" stroke-dasharray="1,1,1,1" fill="none" d="M 110,64 L 110,244" />
<path stroke="rgb(68, 68, 68)" stroke-miterlimit="10" fill="none" d="M 105.5,243.5 L 114.5,243.5" />
<path stroke="rgb(68, 68, 68)" stroke-miterlimit="10" fill="none" d="M 105.5,63.5 L 114.5,63.5" />
<text font-size="12" x="195" y="267" text-anchor="middle">25</text>
<path stroke="rgb(68, 68, 68)" stroke-miterlimit="10" fill="none" d="M 120,249.5 L 120,258.5" />
<path stroke="rgb(68, 68, 68)" stroke-miterlimit="10" stroke-dasharray="1,1,1,1" fill="none" d="M 120,254 L 270,254" />
<path stroke="rgb(68, 68, 68)" stroke-miterlimit="10" fill="none" d="M 270,249.5 L 270,258.5" />
<path stroke="rgb(68, 68, 68)" stroke-miterlimit="10" fill="none" d="M 45,18 L 45,338 295,338" />
<path stroke="rgb(68, 68, 68)" stroke-miterlimit="10" fill="none" d="M 120,338.5 C 120,343.5 120,343.5 120,343.5" />
<text font-size="12" x="120" y="354" text-anchor="middle">12.5</text>
<text font-size="12" x="31" y="248" text-anchor="middle">10</text>
<path stroke="rgb(0, 0, 0)" stroke-miterlimit="10" fill="none" d="M 40,244 C 45,244 45,244 45,244" />
</svg>
<figcaption><span class="lgcp">D3</span>.js helps transform a rectangular area into an arc.</figcaption>
</figure>

We haven’t specified the ranges of the x– and y–scales, but assume for now that each ranges from 0 to 100. The starting x–value of 12.5, therefore, is 12.5% of the full range. When we convert that value to polar coordinates, the result will be 12.5% of the full 360°. That’s 45° or π/4. The x-value extends another 25%, so the final x–value adds another 90° or π/2 to the starting value. For the y–values, our scales take the square root and map the results to the domain from 0 to 250 (`maxRadius`). The initial value of 10, therefore is divided by 100 (for the range) and transformed to √0.1 ∙ 250 or 79. The final value of 10 + 30 results in a radius of √0.4 ∙ 250 or 158. That’s the process that creates an <span class="smcp">SVG</span> for each data value.

### Step 5: Retrieve the Data

With the initial preparation complete, we’re now ready to process the data. As in the previous example, we’ll use `d3.csv()` to retrieve the <span class="smcp">CSV</span> file from the server.

``` {.javascript .numberLines}
d3.csv("tornadoes.csv", function(data) {
    // Continue processing the data...
});
```

When <span class="smcp">D3</span>.js retrieves the file, it creates a data structure that begins like the following fragment.

``` {.javascript}
[ { 
    "state":"Connecticut",
    "region":"New England",
    "county":"Fairfield County"
  },{
    "state":"Connecticut",
    "region":"New England",
    "county":"Hartford County"
  },{
    "state":"Connecticut",
    "region":"New England",
    "county":"Hartford County"
  }, 
...
```

That data structure reflects the data, but it doesn’t include the `.x`, `.dx`, `.y`, and `.dy` properties that we need to draw the arcs. There’s additional work to be done to calculate those values. If you recall the second example in this chapter, we’ve seen this situation before. We have a set of raw data, but we need to augment that raw data with additional properties for the visualization. In the earlier example, we used the <span class="smcp">D3</span>.js force layout to calculate the extra properties. In this case we can use the partition layout.

Before we can use the partition layout, however, we have to restructure our data. The partition layout works with hierarchical data, and so far all we have is a single dimensional array. We must structure the data to reflect the natural hierarchy of region, state, and county. Here again, however, <span class="smcp">D3</span>.js is able to help us. The `d3.nest()` operator analyzes an array of data and extracts hierarchy from it. If you’re familiar with database commands, it’s the <span class="smcp">D3</span>.js equivalent of the `GROUP BY` operation. We can use the operator to create a new version of the data.

``` {.javascript .numberLines}
var hierarchy = {
    key: "United States",
    values: d3.nest()
        .key(function(d) { return d.region; })
        .key(function(d) { return d.state; })
        .key(function(d) { return d.county; })
        .rollup(function(leaves) { 
            return leaves.length;
        })
        .entries(data)
    };
```

In line 1 we define the variable that will hold our restructured data. It’s an object with two properties. The `.key` property is set equal to `"United States"` and the `.values` property is the result of the the `d3.nest()` operation. In lines 4-6 we tell the operator to group the data, first by `.region`, then by `.state`, and finally by `.county`. Then, in lines 7-9 we tell the operator to set the final value to be simply the count of entries for the final grouping. Line 10 is where we pass the original dataset to the operator. When this statement finishes, the `hierarchy` variable contains a structured version of our data that begins like the following fragment.

``` {.javascript}
{
    "key": "United States",
    "values": [
        {
            "key": "New England",
            "values": [
                {
                   "key": "Connecticut",
                   "values": [
                        {
                            "key": "Fairfield County",
                            "values": 1
                        },{
                            "key": "Hartford County",
                            "values": 2
                        },{
...
```

This structure matches what the partition layout needs, but there’s still one more step we need to take. The `d3.nest()` operator places both child arrays and leaf data in the `.values` property. By default, however, the partition layout expects the data to use different property names for each type of property. More specifically, it expects child nodes to be stored in the `.children` property and data values in the `.value` property. Since the  `d3.nest()` operator does’t create exactly that structure, we have to extend the default partition layout. Here’s the code to do that.

``` {.javascript .numberLines}
var partition = d3.layout.partition()
    .children(function(d) {
        return Array.isArray(d.values) ? d.values : null;
    })
    .value(function(d) {
        return d.values;
    });
```

In lines 2-4 we provide a custom function to return a node’s children. If the node’s `.values` property is an array, then that property contains the children. Otherwise the node has no children and we return `null`. In lines 5-7 we provide a custom function to return a node’s value. Since this function is only used when no children exist, the `.values` property has to contain the node value.

### Step 6: Draw the Visualization

It’s taken a bit of work to get to this point, but now we’re ready to draw the visualization. Here’s where we see the payoff for all the work. It only takes a few lines of code to create the visualization.

``` {.javascript .numberLines}
var path = g.selectAll("path")
    .data(partition.nodes(hierarchy))
  .enter().append("path")
    .attr("d", arc);
```

This code follows the same structure we’ve used for all of our <span class="smcp">D3</span>.js examples. In line 1 we create a selection of the <span class="smcp">SVG</span> elements that represent our data; in this case we’re using `<path>` elements. We then bind the selection to the hierarchical data using the custom partition layout. In line 3 we identify the data values that don’t (yet) have an associated <span class="smcp">SVG</span> element, and in line 4 we create new elements for those values. That final step relies on the `.arc()` function that we created in step 4. We haven’t yet added any colors or labels, but we can see from figure NEXTFIGURENUMBER that we’re on the right track.

<figure>
<div id='sunburst1'></div>
<figcaption><span class="lgcp">D3</span>.js includes utilities for creating unique visualizations.</figcaption>
</figure>

### Step 7: Color the Areas

Now we can turn our attention to coloring the visualization. We want to give each region a unique, dominant color and then shade that color for states and counties within the region. A good starting point for us is a different type of <span class="smcp">D3</span>.js scale, a categorical scale for colors. All of the scales we’ve seen so far are cardinal scales. They work with numerical values, and they map those numerical values to properties for the visualization. Categorical scales work with data values that are not numerical; rather, the values simply represent different categories of some quantity. In our case the regions represent categorical data. After all, there isn’t anything intrinsically numerical about New England, or the Southwest.

As you would expect from the name, a categorical _color_ scale maps different category values into different colors. <span class="lgcp">D3</span>.js includes several of these predefined color scales. Since we have less than 10 different regions in our data, the `d3.scale.category10()` scale works fine for this example. Figure NEXTFIGURENUMBER shows the different colors in this scale.

<figure>
<svg width="640px" height="60px" version="1.1" xmlns="http://www.w3.org/2000/svg">
<g stroke="none">
<rect fill="#1f77b4" x="0"   y="0" width="60" height="60"></rect>
<rect fill="#FF7F0E" x="64"  y="0" width="60" height="60"></rect>
<rect fill="#2CA02C" x="128" y="0" width="60" height="60"></rect>
<rect fill="#D62728" x="192" y="0" width="60" height="60"></rect>
<rect fill="#9467BD" x="256" y="0" width="60" height="60"></rect>
<rect fill="#8C564B" x="320" y="0" width="60" height="60"></rect>
<rect fill="#E377C2" x="384" y="0" width="60" height="60"></rect>
<rect fill="#7F7F7F" x="448" y="0" width="60" height="60"></rect>
<rect fill="#BCBD22" x="512" y="0" width="60" height="60"></rect>
<rect fill="#17BECF" x="576" y="0" width="60" height="60"></rect>
</g>
</svg>
<figcaption><span class="lgcp">D3</span>.js includes color scales for categorical data.</figcaption>
</figure>

Our next task is assigning colors from this scale to the arcs in our visualization. To do that we’ll define our own `color()` function. That function will accept, as input, a data node from the partition layout.

``` {.javascript .numberLines}
var color = function(d) {
   	var colors;
   	if (!d.parent) {
   		colors = d3.scale.category10();
   		d.color = "#fff";
   	}
   	
   	// More code needed ...
```

The thing we do in the function (line 2) is create a local variable that we’ll use to store colors. We then check to see if the input node is the root of the hierarchy. If it is, then we create a color scale (line 4) for the node’s children and assign the node its own color (line 5). The root node in our visualization, which represents the entire <span class="smcp">U.S.</span>, will be white. That assigned color will eventually be returned by the function.

After we create a color scale for the child nodes we want to distribute the individual colors to those nodes. There’s a slight catch, though. The nodes in the `d.children` array aren’t necessarily in the clockwise order in which they’ll end up on the visualization. We want to make sure the colors from our scale are distributed in order, so we’ll have to sort the `d.children` array before we distribute colors. Here’s the complete code for this step.

``` {.javascript .numberLines}
if (d.children) {
    d.children.map(function(child, i) {
        return {value: child.value, idx: i};
    }).sort(function(a,b) {
        return b.value - a.value
    }).forEach(function(child, i) {
        d.children[child.idx].color = colors(i);
    });
}
```

In the first line we make sure that there is a children array. If there is, then, in lines 2 and 3 we create a copy of the children array that contains just the node values and their original array index. Then, in lines 4 and 5 we sort that copy based on the node values. Finally, in lines 6 and 7 we iterate through the sorted array and assign colors to the child nodes.

So far we’ve created a categorical color scale and assigned its colors to the first-level children. That takes care of colors for the regions, but there are also states and counties that need colors. To color those, we can create a different scale based on the parent color. Let’s go back to our function definition and add an `else` clause for non-root nodes. In this clause we also create a color scale for the children. These child nodes, however, are not regions; they are states or counties. For states of a region and counties of a state we don’t want unique, distinct colors like those from a categorical scale. Instead, we want colors related to the color of the parent. That calls for a linear gradient.

``` {.javascript .numberLines}
var color = function(d) {
   	var colors;
   	if (!d.parent) {
       	// Handle root node as above ...
	} else if (d.children) {
    
        var startColor = d3.hcl(d.color)
            				.darker(),
            endColor   = d3.hcl(d.color)
            				.brighter();
    
        colors = d3.scale.linear()
            	.interpolate(d3.interpolateHcl)
            	.range([
            		startColor.toString(),
            		endColor.toString()
            	])
            	.domain([0,d.children.length+1]);
    
    }

   	// Code continues ...

```

In lines 7-10 we define the starting and ending colors for our gradient. To create those colors, we start with the parent node’s color (`d.color`) and darken or brighten it. In both cases we use hue, chroma, and luminance (<span class="smcp">HCL</span>) as the basis for the color manipulations. The <span class="smcp">HCL</span> color space is based on human visual perception, unlike the pure mathematical basis for the more familiar <span class="smcp">RGB</span> color space. Using <span class="smcp">HCL</span> general results in a more visually pleasing gradient.

Lines 12-18 contain the code to actually create the gradient. Here we’re using a <span class="smcp">D3</span>.js linear scale (line 12) and a built-in interpolation algorithm for <span class="smcp">HCL</span> colors (line 13). Our gradient ranges between the start and end colors (lines 14-17) and its domain is the indices of the node’s children (line 18).

Now all we need do is assign the appropriate color when we create each data value’s `<path>` element. That requires a one-line addition (line 5) to the code that creates those paths.

``` {.javascript .numberLines .line-5}
var path = g.selectAll("path")
	.data(partition.nodes(hierarchy))
  .enter().append("path")
	.attr("d", arc)
	.attr("fill", color);
```

As figure NEXTFIGURENUMBER shows, our visualization now includes appropriate colors.

<figure>
<div id='sunburst2'></div>
<figcaption><span class="lgcp">D3</span>.js includes extensive utilities for working with colors.</figcaption>
</figure>

### Step 8: Make the Visualization Interactive

To conclude this example we can add some interactivity. When a user clicks on an area in the chart, we can zoom the chart to show more detail for that area. To emphasize the subject matter, we’ll create a custom, rotating animation effect for this zoom. The easiest part of this step is adding the function to handle click events. We can do that when we add the `<path>` elements to the page.

``` {.javascript .numberLines .line-6}
var path = g.selectAll("path")
	.data(partition.nodes(hierarchy))
  .enter().append("path")
	.attr("d", arc)
	.attr("fill", color)
      .on("click", handleClick);
```

The function `handleClick` that line 6 references is, of course, the event handler that we’ll have to write. Conceptually, the function is pretty straightforward. When the user clicks on an area, we want to modify all the paths to make that area the focal point of the visualization. The complete function is as simple as the following code.

``` {.javascript .numberLines}
function handleClick(datum) {
    path.transition().duration(750)
        .attrTween("d", arcTween(datum));
};
```

The function’s single parameter is the data value corresponding to the clicked element. Conventionally, <span class="smcp">D3</span>.js uses `d` for that value; in this case, however, we’re using `datum` to avoid confusion with the <span class="smcp">SVG</span> `"d"` attribute. The first line in the function references all of the paths in the visualization and sets up an animated transition for those paths. The next line tells <span class="smcp">D3</span>.js what values we’re going to transition. In this case we’re changing an attribute of the `<path>` elements (so we use the function `attrTween`) and the specific attribute we’re changing is the `"d"` attribute (the first parameter to that function). The second parameter, `arcTween(datum)` is a function that returns a function. Note that although the path selection contains 702 elements (for each of the regions, states, and counties in the data set), `arcTween()` is only called once for each click. The function that `arcTween()` returns is what <span class="smcp">D3</span>.js calls to establish the custom animation for all of the path element. Since there are 702 path elements in total that function will be called 702 times. Take a breath now, because there’s another level of indirection left. The function that `arcTween()` returns itself returns a function. This final function calculates intermediate values for the path corresponding to the animation.

Okay, that’s getting awfully abstract, so let’s look at some code. Here’s the complete implementation of `arcTween()`.

``` {.javascript .numberLines}
function arcTween(datum) {
    var thetaDomain  = d3.interpolate(theta.domain(),
                          [datum.x, datum.x + datum.dx]),
        radiusDomain = d3.interpolate(radius.domain(),
                          [datum.y, 1]),
        radiusRange  = d3.interpolate(radius.range(),
                          [datum.y ? 20 : 0, maxRadius]);

    return function calculateNewPath(d, i) {
        return i ?
            function interpolatePathForRoot(t) {
                return arc(d);
            } :
            function interpolatePathForNonRoot(t) {
                theta.domain(thetaDomain(t));
                radius.domain(radiusDomain(t)).range(radiusRange(t));
                return arc(d);
            };
    };
};
```

You can see that this code block defines several different functions. First, there’s `arcTween()`. It returns another function `calculateNewPath()`, and _that_ function returns either `interpolatePathForRoot()` or `interpolatePathForNonRoot()`. Before we look at the details of the implementation, we want to be sure and understand the distinction between these functions.

* `arcTween()` is called once (for a single click) in the click event handler. Its input parameter is the data value corresponding to the clicked element.
* `calculateNewPath()` is then called once for every path element, a total of 702 times for each click. Its input parameters are the data value and index of the path element.
* `interpolatePathForRoot()` or `interpolatePathForNonRoot()` are called multiple times for each path element. Every call provides the input parameter `t` (for time) that represents the amount of progress in the current animation transition. The time parameter ranges from 0 when the animation starts to 1 when the animation ends. If, for example, <span class="smcp">D3</span>.js requires 100 individual animation steps for the transition, then these functions will be called 70,200 times for each click.

Now that we know _when_ each of these functions is called, we can start to look at _what_ they actually do. A concrete example definitely helps, so let’s consider what happens when the user clicks on the state of Kentucky. As figure NEXTFIGURENUMBER shows, it’s on the second row in the upper right section of the visualization.

<figure>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" width="640" height="500" xml:space="preserve">
<g><path d="M250 375 A125 125 0 1 1 250 125 A125 125 0 1 1 250 375 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#fff"/><path d="M228.9 74.5 A176.8 176.8 0 0 1 239.4 73.5 L242.5 125.2 A125 125 0 0 0 235.1 125.9 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#e377c2"/><path d="M224.2 35 A216.5 216.5 0 0 1 229.3 34.5 L233.1 74 A176.8 176.8 0 0 0 228.9 74.5 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#af4791"/><path d="M223.2 1.4 A250 250 0 0 1 224.7 1.3 L228.1 34.6 A216.5 216.5 0 0 0 226.8 34.7 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#962e79"/><path d="M220.2 1.8 A250 250 0 0 1 223.2 1.4 L226.8 34.7 A216.5 216.5 0 0 0 224.2 35 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#7d1163"/><path d="M224.7 1.3 A250 250 0 0 1 226.1 1.1 L229.3 34.5 A216.5 216.5 0 0 0 228.1 34.6 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#af4791"/><path d="M229.3 34.5 A216.5 216.5 0 0 1 234.5 34 L237.3 73.7 A176.8 176.8 0 0 0 233.1 74 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#c35fa9"/><path d="M229.1 0.9 A250 250 0 0 1 230.6 0.8 L233.2 34.1 A216.5 216.5 0 0 0 231.9 34.3 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#a94791"/><path d="M230.6 0.8 A250 250 0 0 1 232.1 0.6 L234.5 34 A216.5 216.5 0 0 0 233.2 34.1 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#c35fa9"/><path d="M226.1 1.1 A250 250 0 0 1 229.1 0.9 L231.9 34.3 A216.5 216.5 0 0 0 229.3 34.5 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#902f7a"/><path d="M234.5 34 A216.5 216.5 0 0 1 237.1 33.9 L239.4 73.5 A176.8 176.8 0 0 0 237.3 73.7 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#d777c2"/><path d="M232.1 0.6 A250 250 0 0 1 233.6 0.5 L235.8 34 A216.5 216.5 0 0 0 234.5 34 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#a44891"/><path d="M233.6 0.5 A250 250 0 0 1 235.1 0.4 L237.1 33.9 A216.5 216.5 0 0 0 235.8 34 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#c268b1"/><path d="M197 81.4 A176.8 176.8 0 0 1 228.9 74.5 L235.1 125.9 A125 125 0 0 0 212.5 130.8 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#8c564b"/><path d="M222.9 35.2 A216.5 216.5 0 0 1 224.2 35 L228.9 74.5 A176.8 176.8 0 0 0 227.9 74.6 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#9c6559"/><path d="M218.7 2 A250 250 0 0 1 220.2 1.8 L224.2 35 A216.5 216.5 0 0 0 222.9 35.2 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#6c3a30"/><path d="M185.1 43.5 A216.5 216.5 0 0 1 197.5 40 L207.1 78.5 A176.8 176.8 0 0 0 197 81.4 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#5c2c23"/><path d="M179.3 10.2 A250 250 0 0 1 182.2 9.4 L191.3 41.6 A216.5 216.5 0 0 0 188.8 42.3 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#3f1212"/><path d="M182.2 9.4 A250 250 0 0 1 185.1 8.6 L193.8 40.9 A216.5 216.5 0 0 0 191.3 41.6 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#4d1f1d"/><path d="M175 11.5 A250 250 0 0 1 179.3 10.2 L188.8 42.3 A216.5 216.5 0 0 0 185.1 43.5 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#310400"/><path d="M187.9 7.8 A250 250 0 0 1 189.4 7.5 L197.5 40 A216.5 216.5 0 0 0 196.3 40.3 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#6c3a33"/><path d="M185.1 8.6 A250 250 0 0 1 187.9 7.8 L196.3 40.3 A216.5 216.5 0 0 0 193.8 40.9 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#5d2c28"/><path d="M219.1 35.7 A216.5 216.5 0 0 1 222.9 35.2 L227.9 74.6 A176.8 176.8 0 0 0 224.7 75 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#8c564b"/><path d="M214.3 2.6 A250 250 0 0 1 215.8 2.4 L220.4 35.5 A216.5 216.5 0 0 0 219.1 35.7 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#5c2c23"/><path d="M215.8 2.4 A250 250 0 0 1 217.2 2.2 L221.6 35.4 A216.5 216.5 0 0 0 220.4 35.5 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#744136"/><path d="M217.2 2.2 A250 250 0 0 1 218.7 2 L222.9 35.2 A216.5 216.5 0 0 0 221.6 35.4 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#8c564b"/><path d="M208.9 37.4 A216.5 216.5 0 0 1 219.1 35.7 L224.7 75 A176.8 176.8 0 0 0 216.4 76.4 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#7c483d"/><path d="M202.5 4.6 A250 250 0 0 1 204 4.3 L210.1 37.2 A216.5 216.5 0 0 0 208.9 37.4 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#4d1f17"/><path d="M204 4.3 A250 250 0 0 1 205.4 4 L211.4 37 A216.5 216.5 0 0 0 210.1 37.2 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#57281f"/><path d="M205.4 4 A250 250 0 0 1 206.9 3.7 L212.7 36.7 A216.5 216.5 0 0 0 211.4 37 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#623127"/><path d="M206.9 3.7 A250 250 0 0 1 208.4 3.5 L214 36.5 A216.5 216.5 0 0 0 212.7 36.7 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#6c3a30"/><path d="M208.4 3.5 A250 250 0 0 1 209.9 3.2 L215.2 36.3 A216.5 216.5 0 0 0 214 36.5 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#774339"/><path d="M209.9 3.2 A250 250 0 0 1 211.3 3 L216.5 36.1 A216.5 216.5 0 0 0 215.2 36.3 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#814d42"/><path d="M211.3 3 A250 250 0 0 1 212.8 2.8 L217.8 35.9 A216.5 216.5 0 0 0 216.5 36.1 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#8c564b"/><path d="M212.8 2.8 A250 250 0 0 1 214.3 2.6 L219.1 35.7 A216.5 216.5 0 0 0 217.8 35.9 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#976055"/><path d="M197.5 40 A216.5 216.5 0 0 1 208.9 37.4 L216.4 76.4 A176.8 176.8 0 0 0 207.1 78.5 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#6c3a30"/><path d="M189.4 7.5 A250 250 0 0 1 192.3 6.8 L200 39.3 A216.5 216.5 0 0 0 197.5 40 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#3e1208"/><path d="M192.3 6.8 A250 250 0 0 1 195.2 6.1 L202.5 38.8 A216.5 216.5 0 0 0 200 39.3 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#491c14"/><path d="M195.2 6.1 A250 250 0 0 1 196.7 5.8 L203.8 38.5 A216.5 216.5 0 0 0 202.5 38.8 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#55261d"/><path d="M196.7 5.8 A250 250 0 0 1 198.1 5.4 L205.1 38.2 A216.5 216.5 0 0 0 203.8 38.5 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#603026"/><path d="M198.1 5.4 A250 250 0 0 1 199.6 5.1 L206.3 37.9 A216.5 216.5 0 0 0 205.1 38.2 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#6c3a30"/><path d="M199.6 5.1 A250 250 0 0 1 201 4.8 L207.6 37.7 A216.5 216.5 0 0 0 206.3 37.9 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#78443a"/><path d="M201 4.8 A250 250 0 0 1 202.5 4.6 L208.9 37.4 A216.5 216.5 0 0 0 207.6 37.7 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#844f44"/><path d="M202 420.1 A176.8 176.8 0 0 1 74.4 270 L125.8 264.2 A125 125 0 0 0 216.1 370.3 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#2ca02c"/><path d="M191.3 458.4 A216.5 216.5 0 0 1 110.7 415.8 L136.3 385.3 A176.8 176.8 0 0 0 202 420.1 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#007000"/><path d="M119.4 463.2 A250 250 0 0 1 118.2 462.4 L135.8 434 A216.5 216.5 0 0 0 136.9 434.6 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#1f6917"/><path d="M159.5 483.1 A250 250 0 0 1 156.7 482 L169.2 450.9 A216.5 216.5 0 0 0 171.6 451.8 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#074c05"/><path d="M118.2 462.4 A250 250 0 0 1 116.9 461.6 L134.7 433.3 A216.5 216.5 0 0 0 135.8 434 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#216b18"/><path d="M156.7 482 A250 250 0 0 1 154 480.8 L166.8 449.9 A216.5 216.5 0 0 0 169.2 450.9 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#094e06"/><path d="M154 480.8 A250 250 0 0 1 151.2 479.7 L164.5 448.9 A216.5 216.5 0 0 0 166.8 449.9 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#0a5007"/><path d="M176.4 488.9 A250 250 0 0 1 172.2 487.6 L182.6 455.7 A216.5 216.5 0 0 0 186.3 456.9 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#014501"/><path d="M151.2 479.7 A250 250 0 0 1 148.5 478.5 L162.1 447.9 A216.5 216.5 0 0 0 164.5 448.9 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#0c5208"/><path d="M116.9 461.6 A250 250 0 0 1 115.6 460.8 L133.6 432.6 A216.5 216.5 0 0 0 134.7 433.3 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#226d19"/><path d="M115.6 460.8 A250 250 0 0 1 114.4 460 L132.6 431.9 A216.5 216.5 0 0 0 133.6 432.6 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#246f1a"/><path d="M114.4 460 A250 250 0 0 1 113.1 459.2 L131.5 431.2 A216.5 216.5 0 0 0 132.6 431.9 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#25711c"/><path d="M148.5 478.5 A250 250 0 0 1 145.8 477.2 L159.7 446.8 A216.5 216.5 0 0 0 162.1 447.9 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#0e5409"/><path d="M113.1 459.2 A250 250 0 0 1 111.9 458.4 L130.4 430.5 A216.5 216.5 0 0 0 131.5 431.2 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#27731d"/><path d="M172.2 487.6 A250 250 0 0 1 167.9 486.1 L178.9 454.5 A216.5 216.5 0 0 0 182.6 455.7 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#024702"/><path d="M111.9 458.4 A250 250 0 0 1 110.6 457.6 L129.3 429.7 A216.5 216.5 0 0 0 130.4 430.5 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#28751e"/><path d="M110.6 457.6 A250 250 0 0 1 109.4 456.7 L128.2 429 A216.5 216.5 0 0 0 129.3 429.7 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#2a771f"/><path d="M182.2 490.6 A250 250 0 0 1 176.4 488.9 L186.3 456.9 A216.5 216.5 0 0 0 191.3 458.4 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#004300"/><path d="M109.4 456.7 A250 250 0 0 1 108.2 455.9 L127.2 428.3 A216.5 216.5 0 0 0 128.2 429 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#2b7920"/><path d="M108.2 455.9 A250 250 0 0 1 106.9 455 L126.1 427.6 A216.5 216.5 0 0 0 127.2 428.3 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#2d7b22"/><path d="M106.9 455 A250 250 0 0 1 105.7 454.2 L125.1 426.8 A216.5 216.5 0 0 0 126.1 427.6 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#2e7e23"/><path d="M105.7 454.2 A250 250 0 0 1 104.5 453.3 L124 426.1 A216.5 216.5 0 0 0 125.1 426.8 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#308024"/><path d="M145.8 477.2 A250 250 0 0 1 143.1 476 L157.4 445.7 A216.5 216.5 0 0 0 159.7 446.8 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#10560b"/><path d="M167.9 486.1 A250 250 0 0 1 163.7 484.6 L175.3 453.2 A216.5 216.5 0 0 0 178.9 454.5 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#044903"/><path d="M143.1 476 A250 250 0 0 1 140.4 474.7 L155.1 444.6 A216.5 216.5 0 0 0 157.4 445.7 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#11580c"/><path d="M140.4 474.7 A250 250 0 0 1 137.7 473.4 L152.7 443.4 A216.5 216.5 0 0 0 155.1 444.6 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#135a0d"/><path d="M104.5 453.3 A250 250 0 0 1 103.3 452.4 L123 425.3 A216.5 216.5 0 0 0 124 426.1 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#318225"/><path d="M103.3 452.4 A250 250 0 0 1 102.1 451.5 L121.9 424.5 A216.5 216.5 0 0 0 123 425.3 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#338426"/><path d="M102.1 451.5 A250 250 0 0 1 100.9 450.7 L120.9 423.8 A216.5 216.5 0 0 0 121.9 424.5 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#348628"/><path d="M100.9 450.7 A250 250 0 0 1 99.7 449.8 L119.8 423 A216.5 216.5 0 0 0 120.9 423.8 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#368829"/><path d="M137.7 473.4 A250 250 0 0 1 135 472 L150.4 442.3 A216.5 216.5 0 0 0 152.7 443.4 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#155c0e"/><path d="M99.7 449.8 A250 250 0 0 1 98.5 448.9 L118.8 422.2 A216.5 216.5 0 0 0 119.8 423 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#378a2a"/><path d="M135 472 A250 250 0 0 1 132.4 470.6 L148.2 441.1 A216.5 216.5 0 0 0 150.4 442.3 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#165e10"/><path d="M132.4 470.6 A250 250 0 0 1 129.8 469.2 L145.9 439.8 A216.5 216.5 0 0 0 148.2 441.1 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#186011"/><path d="M129.8 469.2 A250 250 0 0 1 127.2 467.7 L143.6 438.6 A216.5 216.5 0 0 0 145.9 439.8 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#196112"/><path d="M98.5 448.9 A250 250 0 0 1 97.3 448 L117.8 421.4 A216.5 216.5 0 0 0 118.8 422.2 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#398c2b"/><path d="M97.3 448 A250 250 0 0 1 96.1 447 L116.8 420.6 A216.5 216.5 0 0 0 117.8 421.4 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#3a8e2c"/><path d="M96.1 447 A250 250 0 0 1 95 446.1 L115.7 419.8 A216.5 216.5 0 0 0 116.8 420.6 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#3c902e"/><path d="M95 446.1 A250 250 0 0 1 93.8 445.2 L114.7 419 A216.5 216.5 0 0 0 115.7 419.8 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#3d922f"/><path d="M163.7 484.6 A250 250 0 0 1 159.5 483.1 L171.6 451.8 A216.5 216.5 0 0 0 175.3 453.2 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#054a04"/><path d="M127.2 467.7 A250 250 0 0 1 124.6 466.3 L141.4 437.3 A216.5 216.5 0 0 0 143.6 438.6 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#1b6313"/><path d="M93.8 445.2 A250 250 0 0 1 92.6 444.3 L113.7 418.2 A216.5 216.5 0 0 0 114.7 419 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#3f9430"/><path d="M92.6 444.3 A250 250 0 0 1 91.5 443.3 L112.7 417.4 A216.5 216.5 0 0 0 113.7 418.2 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#409731"/><path d="M124.6 466.3 A250 250 0 0 1 122 464.7 L139.1 436 A216.5 216.5 0 0 0 141.4 437.3 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#1c6514"/><path d="M122 464.7 A250 250 0 0 1 119.4 463.2 L136.9 434.6 A216.5 216.5 0 0 0 139.1 436 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#1e6716"/><path d="M91.5 443.3 A250 250 0 0 1 90.3 442.4 L111.7 416.6 A216.5 216.5 0 0 0 112.7 417.4 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#429932"/><path d="M90.3 442.4 A250 250 0 0 1 89.2 441.4 L110.7 415.8 A216.5 216.5 0 0 0 111.7 416.6 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#439b34"/><path d="M110.7 415.8 A216.5 216.5 0 0 1 66.7 365.3 L100.4 344.1 A176.8 176.8 0 0 0 136.3 385.3 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#1a8013"/><path d="M53 403.9 A250 250 0 0 1 52 402.7 L78.6 382.2 A216.5 216.5 0 0 0 79.4 383.2 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#297a1e"/><path d="M52 402.7 A250 250 0 0 1 51.1 401.5 L77.8 381.2 A216.5 216.5 0 0 0 78.6 382.2 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#2b7d20"/><path d="M74.8 428.4 A250 250 0 0 1 72.7 426.2 L96.5 402.6 A216.5 216.5 0 0 0 98.3 404.5 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#0a5a05"/><path d="M51.1 401.5 A250 250 0 0 1 50.2 400.3 L77 380.2 A216.5 216.5 0 0 0 77.8 381.2 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#2e7f22"/><path d="M50.2 400.3 A250 250 0 0 1 49.3 399.1 L76.2 379.1 A216.5 216.5 0 0 0 77 380.2 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#308224"/><path d="M72.7 426.2 A250 250 0 0 1 70.6 424.1 L94.6 400.8 A216.5 216.5 0 0 0 96.5 402.6 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#0e5d08"/><path d="M49.3 399.1 A250 250 0 0 1 48.5 397.9 L75.5 378.1 A216.5 216.5 0 0 0 76.2 379.1 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#338527"/><path d="M48.5 397.9 A250 250 0 0 1 47.6 396.7 L74.7 377 A216.5 216.5 0 0 0 75.5 378.1 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#358829"/><path d="M70.6 424.1 A250 250 0 0 1 68.5 422 L92.8 398.9 A216.5 216.5 0 0 0 94.6 400.8 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#11600a"/><path d="M47.6 396.7 A250 250 0 0 1 46.7 395.5 L73.9 376 A216.5 216.5 0 0 0 74.7 377 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#378b2b"/><path d="M68.5 422 A250 250 0 0 1 66.5 419.8 L91.1 397 A216.5 216.5 0 0 0 92.8 398.9 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#14630c"/><path d="M46.7 395.5 A250 250 0 0 1 45.8 394.3 L73.2 374.9 A216.5 216.5 0 0 0 73.9 376 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#3a8e2d"/><path d="M45.8 394.3 A250 250 0 0 1 45 393.1 L72.4 373.9 A216.5 216.5 0 0 0 73.2 374.9 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#3c912f"/><path d="M45 393.1 A250 250 0 0 1 44.1 391.8 L71.7 372.8 A216.5 216.5 0 0 0 72.4 373.9 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#3f9431"/><path d="M44.1 391.8 A250 250 0 0 1 43.3 390.6 L71 371.8 A216.5 216.5 0 0 0 71.7 372.8 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#419733"/><path d="M66.5 419.8 A250 250 0 0 1 64.5 417.6 L89.3 395.1 A216.5 216.5 0 0 0 91.1 397 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#17650f"/><path d="M82.4 435.5 A250 250 0 0 1 78 431.5 L101.1 407.2 A216.5 216.5 0 0 0 104.9 410.7 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#035502"/><path d="M89.2 441.4 A250 250 0 0 1 82.4 435.5 L104.9 410.7 A216.5 216.5 0 0 0 110.7 415.8 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#005200"/><path d="M43.3 390.6 A250 250 0 0 1 42.4 389.4 L70.3 370.7 A216.5 216.5 0 0 0 71 371.8 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#439a35"/><path d="M64.5 417.6 A250 250 0 0 1 62.5 415.4 L87.6 393.2 A216.5 216.5 0 0 0 89.3 395.1 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#196811"/><path d="M42.4 389.4 A250 250 0 0 1 41.6 388.1 L69.5 369.6 A216.5 216.5 0 0 0 70.3 370.7 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#469d37"/><path d="M62.5 415.4 A250 250 0 0 1 60.5 413.1 L85.9 391.2 A216.5 216.5 0 0 0 87.6 393.2 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#1c6b13"/><path d="M60.5 413.1 A250 250 0 0 1 58.6 410.8 L84.2 389.3 A216.5 216.5 0 0 0 85.9 391.2 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#1f6e16"/><path d="M41.6 388.1 A250 250 0 0 1 40.8 386.9 L68.8 368.5 A216.5 216.5 0 0 0 69.5 369.6 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#48a139"/><path d="M58.6 410.8 A250 250 0 0 1 56.7 408.5 L82.6 387.3 A216.5 216.5 0 0 0 84.2 389.3 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#217118"/><path d="M78 431.5 A250 250 0 0 1 74.8 428.4 L98.3 404.5 A216.5 216.5 0 0 0 101.1 407.2 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#065803"/><path d="M56.7 408.5 A250 250 0 0 1 54.8 406.2 L81 385.3 A216.5 216.5 0 0 0 82.6 387.3 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#24741a"/><path d="M54.8 406.2 A250 250 0 0 1 53 403.9 L79.4 383.2 A216.5 216.5 0 0 0 81 385.3 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#26771c"/><path d="M40.8 386.9 A250 250 0 0 1 40 385.6 L68.1 367.4 A216.5 216.5 0 0 0 68.8 368.5 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#4aa43c"/><path d="M40 385.6 A250 250 0 0 1 39.2 384.4 L67.4 366.4 A216.5 216.5 0 0 0 68.1 367.4 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#4da73e"/><path d="M39.2 384.4 A250 250 0 0 1 38.4 383.1 L66.7 365.3 A216.5 216.5 0 0 0 67.4 366.4 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#4faa40"/><path d="M37.7 292.4 A216.5 216.5 0 0 1 34.9 274.5 L74.4 270 A176.8 176.8 0 0 0 76.6 284.6 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#4ab03f"/><path d="M3.7 293.1 A250 250 0 0 1 3 288.7 L36.1 283.5 A216.5 216.5 0 0 0 36.7 287.3 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#1a8a18"/><path d="M4.8 299 A250 250 0 0 1 3.7 293.1 L36.7 287.3 A216.5 216.5 0 0 0 37.7 292.4 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#007f0a"/><path d="M3 288.7 A250 250 0 0 1 2.6 285.7 L35.7 280.9 A216.5 216.5 0 0 0 36.1 283.5 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#2a9424"/><path d="M2.6 285.7 A250 250 0 0 1 2.4 284.2 L35.5 279.6 A216.5 216.5 0 0 0 35.7 280.9 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#389f2f"/><path d="M2.4 284.2 A250 250 0 0 1 2.2 282.8 L35.4 278.4 A216.5 216.5 0 0 0 35.5 279.6 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#45aa3a"/><path d="M2.2 282.8 A250 250 0 0 1 2 281.3 L35.2 277.1 A216.5 216.5 0 0 0 35.4 278.4 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#51b544"/><path d="M2 281.3 A250 250 0 0 1 1.8 279.8 L35 275.8 A216.5 216.5 0 0 0 35.2 277.1 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#5cc14f"/><path d="M1.8 279.8 A250 250 0 0 1 1.6 278.3 L34.9 274.5 A216.5 216.5 0 0 0 35 275.8 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#68cc59"/><path d="M66.7 365.3 A216.5 216.5 0 0 1 45.9 322.3 L83.4 309 A176.8 176.8 0 0 0 100.4 344.1 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#2c8f23"/><path d="M28.7 366.3 A250 250 0 0 1 27.3 363.6 L57.2 348.4 A216.5 216.5 0 0 0 58.3 350.7 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#126b0b"/><path d="M24.7 358.3 A250 250 0 0 1 24 356.9 L54.3 342.6 A216.5 216.5 0 0 0 54.9 343.8 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#1f7616"/><path d="M38.4 383.1 A250 250 0 0 1 34.5 376.7 L63.4 359.7 A216.5 216.5 0 0 0 66.7 365.3 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#006000"/><path d="M24 356.9 A250 250 0 0 1 23.4 355.6 L53.7 341.4 A216.5 216.5 0 0 0 54.3 342.6 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#237a19"/><path d="M34.5 376.7 A250 250 0 0 1 31.5 371.5 L60.8 355.3 A216.5 216.5 0 0 0 63.4 359.7 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#066403"/><path d="M23.4 355.6 A250 250 0 0 1 22.8 354.2 L53.2 340.3 A216.5 216.5 0 0 0 53.7 341.4 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#277d1d"/><path d="M27.3 363.6 A250 250 0 0 1 26 361 L56 346.1 A216.5 216.5 0 0 0 57.2 348.4 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#176f0f"/><path d="M22.8 354.2 A250 250 0 0 1 22.1 352.9 L52.7 339.1 A216.5 216.5 0 0 0 53.2 340.3 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#2b8120"/><path d="M22.1 352.9 A250 250 0 0 1 21.5 351.5 L52.1 337.9 A216.5 216.5 0 0 0 52.7 339.1 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#2e8523"/><path d="M21.5 351.5 A250 250 0 0 1 20.9 350.1 L51.6 336.7 A216.5 216.5 0 0 0 52.1 337.9 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#328926"/><path d="M20.9 350.1 A250 250 0 0 1 20.3 348.8 L51.1 335.5 A216.5 216.5 0 0 0 51.6 336.7 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#358d29"/><path d="M31.5 371.5 A250 250 0 0 1 28.7 366.3 L58.3 350.7 A216.5 216.5 0 0 0 60.8 355.3 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#0c6707"/><path d="M20.3 348.8 A250 250 0 0 1 19.8 347.4 L50.6 334.3 A216.5 216.5 0 0 0 51.1 335.5 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#39912d"/><path d="M19.8 347.4 A250 250 0 0 1 19.2 346 L50.1 333.2 A216.5 216.5 0 0 0 50.6 334.3 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#3c9430"/><path d="M19.2 346 A250 250 0 0 1 18.6 344.6 L49.6 332 A216.5 216.5 0 0 0 50.1 333.2 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#409833"/><path d="M18.6 344.6 A250 250 0 0 1 18 343.3 L49.1 330.8 A216.5 216.5 0 0 0 49.6 332 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#439c36"/><path d="M18 343.3 A250 250 0 0 1 17.5 341.9 L48.6 329.6 A216.5 216.5 0 0 0 49.1 330.8 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#47a039"/><path d="M17.5 341.9 A250 250 0 0 1 16.9 340.5 L48.2 328.4 A216.5 216.5 0 0 0 48.6 329.6 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#4aa43c"/><path d="M16.9 340.5 A250 250 0 0 1 16.4 339.1 L47.7 327.1 A216.5 216.5 0 0 0 48.2 328.4 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#4ea83f"/><path d="M16.4 339.1 A250 250 0 0 1 15.9 337.7 L47.2 325.9 A216.5 216.5 0 0 0 47.7 327.1 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#51ac42"/><path d="M26 361 A250 250 0 0 1 24.7 358.3 L54.9 343.8 A216.5 216.5 0 0 0 56 346.1 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#1b7213"/><path d="M15.9 337.7 A250 250 0 0 1 15.4 336.3 L46.8 324.7 A216.5 216.5 0 0 0 47.2 325.9 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#54b045"/><path d="M15.4 336.3 A250 250 0 0 1 14.9 334.9 L46.4 323.5 A216.5 216.5 0 0 0 46.8 324.7 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#58b449"/><path d="M14.9 334.9 A250 250 0 0 1 14.3 333.5 L45.9 322.3 A216.5 216.5 0 0 0 46.4 323.5 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#5bb84c"/><path d="M45.9 322.3 A216.5 216.5 0 0 1 37.7 292.4 L76.6 284.6 A176.8 176.8 0 0 0 83.4 309 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#3ba031"/><path d="M9.4 317.8 A250 250 0 0 1 9 316.4 L41.3 307.5 A216.5 216.5 0 0 0 41.6 308.7 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#1e8115"/><path d="M9 316.4 A250 250 0 0 1 8.6 314.9 L40.9 306.2 A216.5 216.5 0 0 0 41.3 307.5 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#25861b"/><path d="M8.6 314.9 A250 250 0 0 1 8.2 313.5 L40.6 305 A216.5 216.5 0 0 0 40.9 306.2 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#2c8c21"/><path d="M8.2 313.5 A250 250 0 0 1 7.8 312.1 L40.3 303.7 A216.5 216.5 0 0 0 40.6 305 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#329127"/><path d="M7.8 312.1 A250 250 0 0 1 7.5 310.6 L40 302.5 A216.5 216.5 0 0 0 40.3 303.7 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#38972c"/><path d="M7.5 310.6 A250 250 0 0 1 7.1 309.2 L39.6 301.2 A216.5 216.5 0 0 0 40 302.5 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#3e9d31"/><path d="M7.1 309.2 A250 250 0 0 1 6.8 307.7 L39.3 300 A216.5 216.5 0 0 0 39.6 301.2 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#44a336"/><path d="M6.8 307.7 A250 250 0 0 1 6.4 306.3 L39 298.7 A216.5 216.5 0 0 0 39.3 300 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#49a83c"/><path d="M10.2 320.7 A250 250 0 0 1 9.4 317.8 L41.6 308.7 A216.5 216.5 0 0 0 42.3 311.2 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#167b0f"/><path d="M14.3 333.5 A250 250 0 0 1 12 326.4 L43.9 316.2 A216.5 216.5 0 0 0 45.9 322.3 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#007000"/><path d="M12 326.4 A250 250 0 0 1 10.2 320.7 L42.3 311.2 A216.5 216.5 0 0 0 43.9 316.2 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#0c7507"/><path d="M6.4 306.3 A250 250 0 0 1 6.1 304.8 L38.8 297.5 A216.5 216.5 0 0 0 39 298.7 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#4fae41"/><path d="M6.1 304.8 A250 250 0 0 1 5.8 303.3 L38.5 296.2 A216.5 216.5 0 0 0 38.8 297.5 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#54b446"/><path d="M5.8 303.3 A250 250 0 0 1 5.4 301.9 L38.2 294.9 A216.5 216.5 0 0 0 38.5 296.2 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#5aba4b"/><path d="M5.4 301.9 A250 250 0 0 1 5.1 300.4 L37.9 293.7 A216.5 216.5 0 0 0 38.2 294.9 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#60c050"/><path d="M5.1 300.4 A250 250 0 0 1 4.8 299 L37.7 292.4 A216.5 216.5 0 0 0 37.9 293.7 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#65c656"/><path d="M412.4 319.8 A176.8 176.8 0 0 1 202 420.1 L216.1 370.3 A125 125 0 0 0 364.8 299.4 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#ff7f0e"/><path d="M292.4 462.3 A216.5 216.5 0 0 1 252.6 466.5 L252.1 426.8 A176.8 176.8 0 0 0 284.6 423.4 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#dc751b"/><path d="M273.9 498.9 A250 250 0 0 1 270.9 499.1 L268.1 465.7 A216.5 216.5 0 0 0 270.7 465.5 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#bd6117"/><path d="M267.9 499.4 A250 250 0 0 1 266.4 499.5 L264.2 466 A216.5 216.5 0 0 0 265.5 466 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#c76b20"/><path d="M266.4 499.5 A250 250 0 0 1 264.9 499.6 L262.9 466.1 A216.5 216.5 0 0 0 264.2 466 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#cc7124"/><path d="M264.9 499.6 A250 250 0 0 1 263.4 499.6 L261.6 466.2 A216.5 216.5 0 0 0 262.9 466.1 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#d17628"/><path d="M263.4 499.6 A250 250 0 0 1 261.9 499.7 L260.3 466.3 A216.5 216.5 0 0 0 261.6 466.2 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#d77b2c"/><path d="M270.9 499.1 A250 250 0 0 1 267.9 499.4 L265.5 466 A216.5 216.5 0 0 0 268.1 465.7 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#c2661c"/><path d="M261.9 499.7 A250 250 0 0 1 260.4 499.8 L259 466.3 A216.5 216.5 0 0 0 260.3 466.3 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#dc8030"/><path d="M260.4 499.8 A250 250 0 0 1 259 499.8 L257.8 466.4 A216.5 216.5 0 0 0 259 466.3 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#e18534"/><path d="M287.2 497.2 A250 250 0 0 1 282.8 497.8 L278.4 464.6 A216.5 216.5 0 0 0 282.2 464.1 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#ae5209"/><path d="M299 495.2 A250 250 0 0 1 293.1 496.3 L287.3 463.3 A216.5 216.5 0 0 0 292.4 462.3 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#a44800"/><path d="M259 499.8 A250 250 0 0 1 257.5 499.9 L256.5 466.4 A216.5 216.5 0 0 0 257.8 466.4 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#e68a38"/><path d="M257.5 499.9 A250 250 0 0 1 256 499.9 L255.2 466.4 A216.5 216.5 0 0 0 256.5 466.4 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#eb903d"/><path d="M282.8 497.8 A250 250 0 0 1 278.3 498.4 L274.5 465.1 A216.5 216.5 0 0 0 278.4 464.6 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#b3570e"/><path d="M278.3 498.4 A250 250 0 0 1 273.9 498.9 L270.7 465.5 A216.5 216.5 0 0 0 274.5 465.1 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#b85c13"/><path d="M293.1 496.3 A250 250 0 0 1 287.2 497.2 L282.2 464.1 A216.5 216.5 0 0 0 287.3 463.3 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#a94d04"/><path d="M256 499.9 A250 250 0 0 1 254.5 500 L253.9 466.5 A216.5 216.5 0 0 0 255.2 466.4 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#f09541"/><path d="M254.5 500 A250 250 0 0 1 253 500 L252.6 466.5 A216.5 216.5 0 0 0 253.9 466.5 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#f59a45"/><path d="M448.9 335.5 A216.5 216.5 0 0 1 408 398 L379 370.8 A176.8 176.8 0 0 0 412.4 319.8 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#c55000"/><path d="M460.8 384.4 A250 250 0 0 1 459.2 386.9 L431.2 368.5 A216.5 216.5 0 0 0 432.6 366.4 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#a9380c"/><path d="M479.7 348.8 A250 250 0 0 1 477.2 354.2 L446.8 340.3 A216.5 216.5 0 0 0 448.9 335.5 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#8e2000"/><path d="M448.9 401.5 A250 250 0 0 1 448 402.7 L421.4 382.2 A216.5 216.5 0 0 0 422.2 381.2 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#c04b19"/><path d="M448 402.7 A250 250 0 0 1 447 403.9 L420.6 383.2 A216.5 216.5 0 0 0 421.4 382.2 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#c44e1a"/><path d="M472 365 A250 250 0 0 1 469.9 368.9 L440.4 353 A216.5 216.5 0 0 0 442.3 349.6 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#982904"/><path d="M447 403.9 A250 250 0 0 1 446.1 405 L419.8 384.3 A216.5 216.5 0 0 0 420.6 383.2 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#c7511c"/><path d="M459.2 386.9 A250 250 0 0 1 457.6 389.4 L429.7 370.7 A216.5 216.5 0 0 0 431.2 368.5 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#ac3a0e"/><path d="M477.2 354.2 A250 250 0 0 1 474.7 359.6 L444.6 344.9 A216.5 216.5 0 0 0 446.8 340.3 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#912302"/><path d="M457.6 389.4 A250 250 0 0 1 455.9 391.8 L428.3 372.8 A216.5 216.5 0 0 0 429.7 370.7 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#af3d10"/><path d="M469.9 368.9 A250 250 0 0 1 467.7 372.8 L438.6 356.4 A216.5 216.5 0 0 0 440.4 353 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#9b2c06"/><path d="M446.1 405 A250 250 0 0 1 445.2 406.2 L419 385.3 A216.5 216.5 0 0 0 419.8 384.3 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#cb541e"/><path d="M445.2 406.2 A250 250 0 0 1 444.3 407.4 L418.2 386.3 A216.5 216.5 0 0 0 419 385.3 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#ce571f"/><path d="M444.3 407.4 A250 250 0 0 1 443.3 408.5 L417.4 387.3 A216.5 216.5 0 0 0 418.2 386.3 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#d15921"/><path d="M455.9 391.8 A250 250 0 0 1 454.2 394.3 L426.8 374.9 A216.5 216.5 0 0 0 428.3 372.8 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#b34012"/><path d="M467.7 372.8 A250 250 0 0 1 465.5 376.7 L436.6 359.7 A216.5 216.5 0 0 0 438.6 356.4 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#9f2f07"/><path d="M465.5 376.7 A250 250 0 0 1 463.2 380.6 L434.6 363.1 A216.5 216.5 0 0 0 436.6 359.7 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#a23209"/><path d="M443.3 408.5 A250 250 0 0 1 442.4 409.7 L416.6 388.3 A216.5 216.5 0 0 0 417.4 387.3 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#d55c23"/><path d="M442.4 409.7 A250 250 0 0 1 441.4 410.8 L415.8 389.3 A216.5 216.5 0 0 0 416.6 388.3 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#d85f24"/><path d="M463.2 380.6 A250 250 0 0 1 460.8 384.4 L432.6 366.4 A216.5 216.5 0 0 0 434.6 363.1 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#a5350b"/><path d="M454.2 394.3 A250 250 0 0 1 452.4 396.7 L425.3 377 A216.5 216.5 0 0 0 426.8 374.9 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#b64313"/><path d="M441.4 410.8 A250 250 0 0 1 440.4 412 L414.9 390.3 A216.5 216.5 0 0 0 415.8 389.3 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#dc6226"/><path d="M440.4 412 A250 250 0 0 1 439.5 413.1 L414.1 391.2 A216.5 216.5 0 0 0 414.9 390.3 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#df6528"/><path d="M439.5 413.1 A250 250 0 0 1 438.5 414.2 L413.2 392.2 A216.5 216.5 0 0 0 414.1 391.2 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#e36829"/><path d="M438.5 414.2 A250 250 0 0 1 437.5 415.4 L412.4 393.2 A216.5 216.5 0 0 0 413.2 392.2 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#e66b2b"/><path d="M474.7 359.6 A250 250 0 0 1 472 365 L442.3 349.6 A216.5 216.5 0 0 0 444.6 344.9 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#952603"/><path d="M437.5 415.4 A250 250 0 0 1 436.5 416.5 L411.5 394.2 A216.5 216.5 0 0 0 412.4 393.2 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#e96e2d"/><path d="M452.4 396.7 A250 250 0 0 1 450.7 399.1 L423.8 379.1 A216.5 216.5 0 0 0 425.3 377 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#ba4615"/><path d="M436.5 416.5 A250 250 0 0 1 435.5 417.6 L410.7 395.1 A216.5 216.5 0 0 0 411.5 394.2 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#ed702e"/><path d="M435.5 417.6 A250 250 0 0 1 434.5 418.7 L409.8 396.1 A216.5 216.5 0 0 0 410.7 395.1 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#f07330"/><path d="M434.5 418.7 A250 250 0 0 1 433.5 419.8 L408.9 397 A216.5 216.5 0 0 0 409.8 396.1 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#f47632"/><path d="M450.7 399.1 A250 250 0 0 1 448.9 401.5 L422.2 381.2 A216.5 216.5 0 0 0 423.8 379.1 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#bd4817"/><path d="M433.5 419.8 A250 250 0 0 1 432.5 420.9 L408 398 A216.5 216.5 0 0 0 408.9 397 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#f77934"/><path d="M252.6 466.5 A216.5 216.5 0 0 1 229.3 465.5 L233.1 426 A176.8 176.8 0 0 0 252.1 426.8 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#e38124"/><path d="M247 500 A250 250 0 0 1 245.5 500 L246.1 466.5 A216.5 216.5 0 0 0 247.4 466.5 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#b55e0c"/><path d="M245.5 500 A250 250 0 0 1 244 499.9 L244.8 466.4 A216.5 216.5 0 0 0 246.1 466.5 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#ba6312"/><path d="M244 499.9 A250 250 0 0 1 242.5 499.9 L243.5 466.4 A216.5 216.5 0 0 0 244.8 466.4 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#bf6917"/><path d="M242.5 499.9 A250 250 0 0 1 241 499.8 L242.2 466.4 A216.5 216.5 0 0 0 243.5 466.4 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#c46e1c"/><path d="M241 499.8 A250 250 0 0 1 239.6 499.8 L241 466.3 A216.5 216.5 0 0 0 242.2 466.4 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#c97421"/><path d="M239.6 499.8 A250 250 0 0 1 238.1 499.7 L239.7 466.3 A216.5 216.5 0 0 0 241 466.3 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#ce7926"/><path d="M238.1 499.7 A250 250 0 0 1 236.6 499.6 L238.4 466.2 A216.5 216.5 0 0 0 239.7 466.3 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#d37e2b"/><path d="M253 500 A250 250 0 0 1 250 500 L250 466.5 A216.5 216.5 0 0 0 252.6 466.5 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#ab5300"/><path d="M236.6 499.6 A250 250 0 0 1 235.1 499.6 L237.1 466.1 A216.5 216.5 0 0 0 238.4 466.2 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#d8842f"/><path d="M250 500 A250 250 0 0 1 247 500 L247.4 466.5 A216.5 216.5 0 0 0 250 466.5 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#b05805"/><path d="M235.1 499.6 A250 250 0 0 1 233.6 499.5 L235.8 466 A216.5 216.5 0 0 0 237.1 466.1 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#dd8a34"/><path d="M233.6 499.5 A250 250 0 0 1 232.1 499.4 L234.5 466 A216.5 216.5 0 0 0 235.8 466 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#e18f39"/><path d="M232.1 499.4 A250 250 0 0 1 230.6 499.2 L233.2 465.9 A216.5 216.5 0 0 0 234.5 466 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#e6953d"/><path d="M230.6 499.2 A250 250 0 0 1 229.1 499.1 L231.9 465.7 A216.5 216.5 0 0 0 233.2 465.9 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#eb9a42"/><path d="M229.1 499.1 A250 250 0 0 1 227.6 499 L230.6 465.6 A216.5 216.5 0 0 0 231.9 465.7 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#f0a047"/><path d="M227.6 499 A250 250 0 0 1 226.1 498.9 L229.3 465.5 A216.5 216.5 0 0 0 230.6 465.6 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#f5a64b"/><path d="M408 398 A216.5 216.5 0 0 1 355.3 439.2 L335.9 404.5 A176.8 176.8 0 0 0 379 370.8 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#cd5d08"/><path d="M407.4 444.3 A250 250 0 0 1 405 446.1 L384.3 419.8 A216.5 216.5 0 0 0 386.3 418.2 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#ab420c"/><path d="M405 446.1 A250 250 0 0 1 402.7 448 L382.2 421.4 A216.5 216.5 0 0 0 384.3 419.8 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#ae450e"/><path d="M397.9 451.5 A250 250 0 0 1 396.7 452.4 L377 425.3 A216.5 216.5 0 0 0 378.1 424.5 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#b84e14"/><path d="M396.7 452.4 A250 250 0 0 1 395.5 453.3 L376 426.1 A216.5 216.5 0 0 0 377 425.3 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#bb5016"/><path d="M395.5 453.3 A250 250 0 0 1 394.3 454.2 L374.9 426.8 A216.5 216.5 0 0 0 376 426.1 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#be5318"/><path d="M402.7 448 A250 250 0 0 1 400.3 449.8 L380.2 423 A216.5 216.5 0 0 0 382.2 421.4 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#b24810"/><path d="M432.5 420.9 A250 250 0 0 1 428.4 425.2 L404.5 401.7 A216.5 216.5 0 0 0 408 398 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#952f00"/><path d="M424.1 429.4 A250 250 0 0 1 420.9 432.5 L398 408 A216.5 216.5 0 0 0 400.8 405.4 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#9b3503"/><path d="M400.3 449.8 A250 250 0 0 1 397.9 451.5 L378.1 424.5 A216.5 216.5 0 0 0 380.2 423 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#b54b12"/><path d="M428.4 425.2 A250 250 0 0 1 424.1 429.4 L400.8 405.4 A216.5 216.5 0 0 0 404.5 401.7 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#983201"/><path d="M420.9 432.5 A250 250 0 0 1 417.6 435.5 L395.1 410.7 A216.5 216.5 0 0 0 398 408 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#9e3704"/><path d="M417.6 435.5 A250 250 0 0 1 414.2 438.5 L392.2 413.2 A216.5 216.5 0 0 0 395.1 410.7 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#a23a06"/><path d="M394.3 454.2 A250 250 0 0 1 393.1 455 L373.9 427.6 A216.5 216.5 0 0 0 374.9 426.8 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#c2561a"/><path d="M393.1 455 A250 250 0 0 1 391.8 455.9 L372.8 428.3 A216.5 216.5 0 0 0 373.9 427.6 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#c5591c"/><path d="M391.8 455.9 A250 250 0 0 1 390.6 456.7 L371.8 429 A216.5 216.5 0 0 0 372.8 428.3 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#c85b1e"/><path d="M390.6 456.7 A250 250 0 0 1 389.4 457.6 L370.7 429.7 A216.5 216.5 0 0 0 371.8 429 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#cb5e20"/><path d="M389.4 457.6 A250 250 0 0 1 388.1 458.4 L369.6 430.5 A216.5 216.5 0 0 0 370.7 429.7 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#ce6122"/><path d="M388.1 458.4 A250 250 0 0 1 386.9 459.2 L368.5 431.2 A216.5 216.5 0 0 0 369.6 430.5 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#d26424"/><path d="M386.9 459.2 A250 250 0 0 1 385.6 460 L367.4 431.9 A216.5 216.5 0 0 0 368.5 431.2 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#d56725"/><path d="M414.2 438.5 A250 250 0 0 1 410.8 441.4 L389.3 415.8 A216.5 216.5 0 0 0 392.2 413.2 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#a53d08"/><path d="M385.6 460 A250 250 0 0 1 384.4 460.8 L366.4 432.6 A216.5 216.5 0 0 0 367.4 431.9 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#d86927"/><path d="M384.4 460.8 A250 250 0 0 1 383.1 461.6 L365.3 433.3 A216.5 216.5 0 0 0 366.4 432.6 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#db6c29"/><path d="M410.8 441.4 A250 250 0 0 1 407.4 444.3 L386.3 418.2 A216.5 216.5 0 0 0 389.3 415.8 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#a8400a"/><path d="M383.1 461.6 A250 250 0 0 1 381.8 462.4 L364.2 434 A216.5 216.5 0 0 0 365.3 433.3 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#df6f2b"/><path d="M381.8 462.4 A250 250 0 0 1 380.6 463.2 L363.1 434.6 A216.5 216.5 0 0 0 364.2 434 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#e2722d"/><path d="M380.6 463.2 A250 250 0 0 1 379.3 464 L362 435.3 A216.5 216.5 0 0 0 363.1 434.6 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#e5752f"/><path d="M379.3 464 A250 250 0 0 1 378 464.7 L360.9 436 A216.5 216.5 0 0 0 362 435.3 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#e87831"/><path d="M378 464.7 A250 250 0 0 1 376.7 465.5 L359.7 436.6 A216.5 216.5 0 0 0 360.9 436 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#ec7b33"/><path d="M376.7 465.5 A250 250 0 0 1 375.4 466.3 L358.6 437.3 A216.5 216.5 0 0 0 359.7 436.6 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#ef7d34"/><path d="M375.4 466.3 A250 250 0 0 1 374.1 467 L357.5 437.9 A216.5 216.5 0 0 0 358.6 437.3 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#f28036"/><path d="M374.1 467 A250 250 0 0 1 372.8 467.7 L356.4 438.6 A216.5 216.5 0 0 0 357.5 437.9 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#f58338"/><path d="M372.8 467.7 A250 250 0 0 1 371.5 468.5 L355.3 439.2 A216.5 216.5 0 0 0 356.4 438.6 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#f8863a"/><path d="M355.3 439.2 A216.5 216.5 0 0 1 292.4 462.3 L284.6 423.4 A176.8 176.8 0 0 0 335.9 404.5 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#d46912"/><path d="M325 488.5 A250 250 0 0 1 323.6 488.9 L313.7 456.9 A216.5 216.5 0 0 0 314.9 456.5 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#c6621e"/><path d="M350.1 479.1 A250 250 0 0 1 347.4 480.2 L334.3 449.4 A216.5 216.5 0 0 0 336.7 448.4 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#ab4a0a"/><path d="M323.6 488.9 A250 250 0 0 1 322.1 489.4 L312.5 457.3 A216.5 216.5 0 0 0 313.7 456.9 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#c96520"/><path d="M366.3 471.3 A250 250 0 0 1 362.3 473.4 L347.3 443.4 A216.5 216.5 0 0 0 350.7 441.7 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#9f3f02"/><path d="M322.1 489.4 A250 250 0 0 1 320.7 489.8 L311.2 457.7 A216.5 216.5 0 0 0 312.5 457.3 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#cc6822"/><path d="M320.7 489.8 A250 250 0 0 1 319.3 490.2 L310 458 A216.5 216.5 0 0 0 311.2 457.7 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#cf6b24"/><path d="M362.3 473.4 A250 250 0 0 1 358.3 475.3 L343.8 445.1 A216.5 216.5 0 0 0 347.3 443.4 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#a24104"/><path d="M347.4 480.2 A250 250 0 0 1 344.6 481.4 L332 450.4 A216.5 216.5 0 0 0 334.3 449.4 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#ae4c0d"/><path d="M344.6 481.4 A250 250 0 0 1 341.9 482.5 L329.6 451.4 A216.5 216.5 0 0 0 332 450.4 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#b14f0f"/><path d="M371.5 468.5 A250 250 0 0 1 366.3 471.3 L350.7 441.7 A216.5 216.5 0 0 0 355.3 439.2 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#9c3c00"/><path d="M341.9 482.5 A250 250 0 0 1 339.1 483.6 L327.1 452.3 A216.5 216.5 0 0 0 329.6 451.4 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#b45211"/><path d="M319.3 490.2 A250 250 0 0 1 317.8 490.6 L308.7 458.4 A216.5 216.5 0 0 0 310 458 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#d26d26"/><path d="M358.3 475.3 A250 250 0 0 1 354.2 477.2 L340.3 446.8 A216.5 216.5 0 0 0 343.8 445.1 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#a54406"/><path d="M354.2 477.2 A250 250 0 0 1 350.1 479.1 L336.7 448.4 A216.5 216.5 0 0 0 340.3 446.8 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#a84708"/><path d="M317.8 490.6 A250 250 0 0 1 316.4 491 L307.5 458.7 A216.5 216.5 0 0 0 308.7 458.4 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#d57028"/><path d="M316.4 491 A250 250 0 0 1 314.9 491.4 L306.2 459.1 A216.5 216.5 0 0 0 307.5 458.7 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#d8732a"/><path d="M314.9 491.4 A250 250 0 0 1 313.5 491.8 L305 459.4 A216.5 216.5 0 0 0 306.2 459.1 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#db762c"/><path d="M313.5 491.8 A250 250 0 0 1 312.1 492.2 L303.7 459.7 A216.5 216.5 0 0 0 305 459.4 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#de792e"/><path d="M339.1 483.6 A250 250 0 0 1 336.3 484.6 L324.7 453.2 A216.5 216.5 0 0 0 327.1 452.3 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#b75414"/><path d="M336.3 484.6 A250 250 0 0 1 333.5 485.7 L322.3 454.1 A216.5 216.5 0 0 0 324.7 453.2 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#ba5716"/><path d="M333.5 485.7 A250 250 0 0 1 330.7 486.6 L319.8 454.9 A216.5 216.5 0 0 0 322.3 454.1 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#bd5a18"/><path d="M312.1 492.2 A250 250 0 0 1 310.6 492.5 L302.5 460 A216.5 216.5 0 0 0 303.7 459.7 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#e17b31"/><path d="M310.6 492.5 A250 250 0 0 1 309.2 492.9 L301.2 460.4 A216.5 216.5 0 0 0 302.5 460 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#e47e33"/><path d="M309.2 492.9 A250 250 0 0 1 307.7 493.2 L300 460.7 A216.5 216.5 0 0 0 301.2 460.4 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#e78135"/><path d="M307.7 493.2 A250 250 0 0 1 306.3 493.6 L298.7 461 A216.5 216.5 0 0 0 300 460.7 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#ea8437"/><path d="M306.3 493.6 A250 250 0 0 1 304.8 493.9 L297.5 461.2 A216.5 216.5 0 0 0 298.7 461 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#ed8739"/><path d="M304.8 493.9 A250 250 0 0 1 303.3 494.2 L296.2 461.5 A216.5 216.5 0 0 0 297.5 461.2 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#f08a3b"/><path d="M303.3 494.2 A250 250 0 0 1 301.9 494.6 L294.9 461.8 A216.5 216.5 0 0 0 296.2 461.5 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#f38c3d"/><path d="M301.9 494.6 A250 250 0 0 1 300.4 494.9 L293.7 462.1 A216.5 216.5 0 0 0 294.9 461.8 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#f68f3f"/><path d="M330.7 486.6 A250 250 0 0 1 327.8 487.6 L317.4 455.7 A216.5 216.5 0 0 0 319.8 454.9 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#c05d1a"/><path d="M300.4 494.9 A250 250 0 0 1 299 495.2 L292.4 462.3 A216.5 216.5 0 0 0 293.7 462.1 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#f99241"/><path d="M327.8 487.6 A250 250 0 0 1 325 488.5 L314.9 456.5 A216.5 216.5 0 0 0 317.4 455.7 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#c35f1c"/><path d="M229.3 465.5 A216.5 216.5 0 0 1 208.9 462.6 L216.4 423.6 A176.8 176.8 0 0 0 233.1 426 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#ea8d2c"/><path d="M221.7 498.4 A250 250 0 0 1 218.7 498 L222.9 464.8 A216.5 216.5 0 0 0 225.5 465.1 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#b8670a"/><path d="M212.8 497.2 A250 250 0 0 1 211.3 497 L216.5 463.9 A216.5 216.5 0 0 0 217.8 464.1 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#cc7e23"/><path d="M211.3 497 A250 250 0 0 1 209.9 496.8 L215.2 463.7 A216.5 216.5 0 0 0 216.5 463.9 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#d2862a"/><path d="M209.9 496.8 A250 250 0 0 1 208.4 496.5 L214 463.5 A216.5 216.5 0 0 0 215.2 463.7 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#d98e31"/><path d="M226.1 498.9 A250 250 0 0 1 221.7 498.4 L225.5 465.1 A216.5 216.5 0 0 0 229.3 465.5 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#b25f00"/><path d="M208.4 496.5 A250 250 0 0 1 206.9 496.3 L212.7 463.3 A216.5 216.5 0 0 0 214 463.5 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#df9638"/><path d="M218.7 498 A250 250 0 0 1 215.8 497.6 L220.4 464.5 A216.5 216.5 0 0 0 222.9 464.8 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#bf6e13"/><path d="M215.8 497.6 A250 250 0 0 1 212.8 497.2 L217.8 464.1 A216.5 216.5 0 0 0 220.4 464.5 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#c5761b"/><path d="M206.9 496.3 A250 250 0 0 1 205.4 496 L211.4 463 A216.5 216.5 0 0 0 212.7 463.3 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#e69e3f"/><path d="M205.4 496 A250 250 0 0 1 204 495.7 L210.1 462.8 A216.5 216.5 0 0 0 211.4 463 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#eca646"/><path d="M204 495.7 A250 250 0 0 1 202.5 495.4 L208.9 462.6 A216.5 216.5 0 0 0 210.1 462.8 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#f2ae4e"/><path d="M208.9 462.6 A216.5 216.5 0 0 1 191.3 458.4 L202 420.1 A176.8 176.8 0 0 0 216.4 423.6 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#f19835"/><path d="M193.7 493.6 A250 250 0 0 1 192.3 493.2 L200 460.7 A216.5 216.5 0 0 0 201.3 461 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#cb811f"/><path d="M192.3 493.2 A250 250 0 0 1 190.8 492.9 L198.8 460.4 A216.5 216.5 0 0 0 200 460.7 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#d18927"/><path d="M190.8 492.9 A250 250 0 0 1 189.4 492.5 L197.5 460 A216.5 216.5 0 0 0 198.8 460.4 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#d6912f"/><path d="M202.5 495.4 A250 250 0 0 1 199.6 494.9 L206.3 462.1 A216.5 216.5 0 0 0 208.9 462.6 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#b96a00"/><path d="M199.6 494.9 A250 250 0 0 1 196.7 494.2 L203.8 461.5 A216.5 216.5 0 0 0 206.3 462.1 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#bf720c"/><path d="M189.4 492.5 A250 250 0 0 1 187.9 492.2 L196.3 459.7 A216.5 216.5 0 0 0 197.5 460 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#dc9937"/><path d="M187.9 492.2 A250 250 0 0 1 186.5 491.8 L195 459.4 A216.5 216.5 0 0 0 196.3 459.7 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#e2a13e"/><path d="M186.5 491.8 A250 250 0 0 1 185.1 491.4 L193.8 459.1 A216.5 216.5 0 0 0 195 459.4 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#e8a946"/><path d="M185.1 491.4 A250 250 0 0 1 183.6 491 L192.5 458.7 A216.5 216.5 0 0 0 193.8 459.1 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#eeb14e"/><path d="M183.6 491 A250 250 0 0 1 182.2 490.6 L191.3 458.4 A216.5 216.5 0 0 0 192.5 458.7 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#f3b955"/><path d="M196.7 494.2 A250 250 0 0 1 193.7 493.6 L201.3 461 A216.5 216.5 0 0 0 203.8 461.5 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#c57a16"/><path d="M250 73.2 A176.8 176.8 0 0 1 412.4 319.8 L364.8 299.4 A125 125 0 0 0 250 125 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#1f77b4"/><path d="M466.1 237.1 A216.5 216.5 0 0 1 465.3 273.2 L425.8 269 A176.8 176.8 0 0 0 426.5 239.4 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#3777b4"/><path d="M499.8 260.4 A250 250 0 0 1 499.7 261.9 L466.3 260.3 A216.5 216.5 0 0 0 466.3 259 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#336ca7"/><path d="M499.7 261.9 A250 250 0 0 1 499.6 263.4 L466.2 261.6 A216.5 216.5 0 0 0 466.3 260.3 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#3870ac"/><path d="M499.9 242.5 A250 250 0 0 1 500 245.5 L466.5 246.1 A216.5 216.5 0 0 0 466.4 243.5 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#0b5089"/><path d="M499.6 235.1 A250 250 0 0 1 499.9 242.5 L466.4 243.5 A216.5 216.5 0 0 0 466.1 237.1 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#004c84"/><path d="M499.6 263.4 A250 250 0 0 1 499.6 264.9 L466.1 262.9 A216.5 216.5 0 0 0 466.2 261.6 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#3d75b1"/><path d="M499.6 264.9 A250 250 0 0 1 499.5 266.4 L466 264.2 A216.5 216.5 0 0 0 466.1 262.9 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#427ab6"/><path d="M500 245.5 A250 250 0 0 1 500 248.5 L466.5 248.7 A216.5 216.5 0 0 0 466.5 246.1 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#14558e"/><path d="M499.5 266.4 A250 250 0 0 1 499.4 267.9 L466 265.5 A216.5 216.5 0 0 0 466 264.2 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#477fbc"/><path d="M500 248.5 A250 250 0 0 1 500 251.5 L466.5 251.3 A216.5 216.5 0 0 0 466.5 248.7 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#1c5993"/><path d="M500 251.5 A250 250 0 0 1 500 254.5 L466.5 253.9 A216.5 216.5 0 0 0 466.5 251.3 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#225e98"/><path d="M499.4 267.9 A250 250 0 0 1 499.2 269.4 L465.9 266.8 A216.5 216.5 0 0 0 466 265.5 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#4c83c1"/><path d="M499.2 269.4 A250 250 0 0 1 499.1 270.9 L465.7 268.1 A216.5 216.5 0 0 0 465.9 266.8 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#5188c6"/><path d="M499.1 270.9 A250 250 0 0 1 499 272.4 L465.6 269.4 A216.5 216.5 0 0 0 465.7 268.1 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#568dcb"/><path d="M500 254.5 A250 250 0 0 1 499.9 257.5 L466.4 256.5 A216.5 216.5 0 0 0 466.5 253.9 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#28629d"/><path d="M499 272.4 A250 250 0 0 1 498.9 273.9 L465.5 270.7 A216.5 216.5 0 0 0 465.6 269.4 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#5b92d1"/><path d="M498.9 273.9 A250 250 0 0 1 498.7 275.3 L465.4 271.9 A216.5 216.5 0 0 0 465.5 270.7 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#6097d6"/><path d="M498.7 275.3 A250 250 0 0 1 498.6 276.8 L465.3 273.2 A216.5 216.5 0 0 0 465.4 271.9 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#649cdb"/><path d="M499.9 257.5 A250 250 0 0 1 499.8 260.4 L466.3 259 A216.5 216.5 0 0 0 466.4 256.5 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#2e67a2"/><path d="M369.6 69.5 A216.5 216.5 0 0 1 409.8 103.9 L380.5 130.7 A176.8 176.8 0 0 0 347.7 102.6 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#185a94"/><path d="M417.6 64.5 A250 250 0 0 1 418.7 65.5 L396.1 90.2 A216.5 216.5 0 0 0 395.1 89.3 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#26518a"/><path d="M399.1 49.3 A250 250 0 0 1 401.5 51.1 L381.2 77.8 A216.5 216.5 0 0 0 379.1 76.2 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#0c3970"/><path d="M401.5 51.1 A250 250 0 0 1 403.9 53 L383.2 79.4 A216.5 216.5 0 0 0 381.2 77.8 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#103c73"/><path d="M403.9 53 A250 250 0 0 1 406.2 54.8 L385.3 81 A216.5 216.5 0 0 0 383.2 79.4 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#143f76"/><path d="M418.7 65.5 A250 250 0 0 1 419.8 66.5 L397 91.1 A216.5 216.5 0 0 0 396.1 90.2 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#29548e"/><path d="M419.8 66.5 A250 250 0 0 1 420.9 67.5 L398 92 A216.5 216.5 0 0 0 397 91.1 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#2c5791"/><path d="M420.9 67.5 A250 250 0 0 1 422 68.5 L398.9 92.8 A216.5 216.5 0 0 0 398 92 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#2f5a94"/><path d="M422 68.5 A250 250 0 0 1 423 69.6 L399.9 93.7 A216.5 216.5 0 0 0 398.9 92.8 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#315d98"/><path d="M423 69.6 A250 250 0 0 1 424.1 70.6 L400.8 94.6 A216.5 216.5 0 0 0 399.9 93.7 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#34609b"/><path d="M424.1 70.6 A250 250 0 0 1 425.2 71.6 L401.7 95.5 A216.5 216.5 0 0 0 400.8 94.6 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#37639f"/><path d="M425.2 71.6 A250 250 0 0 1 426.2 72.7 L402.6 96.5 A216.5 216.5 0 0 0 401.7 95.5 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#3967a2"/><path d="M388.1 41.6 A250 250 0 0 1 391.8 44.1 L372.8 71.7 A216.5 216.5 0 0 0 369.6 69.5 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#003166"/><path d="M406.2 54.8 A250 250 0 0 1 408.5 56.7 L387.3 82.6 A216.5 216.5 0 0 0 385.3 81 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#17427a"/><path d="M391.8 44.1 A250 250 0 0 1 395.5 46.7 L376 73.9 A216.5 216.5 0 0 0 372.8 71.7 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#043469"/><path d="M395.5 46.7 A250 250 0 0 1 399.1 49.3 L379.1 76.2 A216.5 216.5 0 0 0 376 73.9 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#08376c"/><path d="M408.5 56.7 A250 250 0 0 1 410.8 58.6 L389.3 84.2 A216.5 216.5 0 0 0 387.3 82.6 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#1b457d"/><path d="M426.2 72.7 A250 250 0 0 1 427.3 73.8 L403.5 97.4 A216.5 216.5 0 0 0 402.6 96.5 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#3c6aa6"/><path d="M427.3 73.8 A250 250 0 0 1 428.4 74.8 L404.5 98.3 A216.5 216.5 0 0 0 403.5 97.4 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#3f6da9"/><path d="M410.8 58.6 A250 250 0 0 1 413.1 60.5 L391.2 85.9 A216.5 216.5 0 0 0 389.3 84.2 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#1e4880"/><path d="M428.4 74.8 A250 250 0 0 1 429.4 75.9 L405.4 99.2 A216.5 216.5 0 0 0 404.5 98.3 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#4170ac"/><path d="M429.4 75.9 A250 250 0 0 1 430.4 77 L406.3 100.1 A216.5 216.5 0 0 0 405.4 99.2 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#4473b0"/><path d="M413.1 60.5 A250 250 0 0 1 415.4 62.5 L393.2 87.6 A216.5 216.5 0 0 0 391.2 85.9 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#214b84"/><path d="M415.4 62.5 A250 250 0 0 1 417.6 64.5 L395.1 89.3 A216.5 216.5 0 0 0 393.2 87.6 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#234e87"/><path d="M430.4 77 A250 250 0 0 1 431.5 78 L407.2 101.1 A216.5 216.5 0 0 0 406.3 100.1 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#4777b3"/><path d="M431.5 78 A250 250 0 0 1 432.5 79.1 L408 102 A216.5 216.5 0 0 0 407.2 101.1 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#497ab7"/><path d="M432.5 79.1 A250 250 0 0 1 433.5 80.2 L408.9 103 A216.5 216.5 0 0 0 408 102 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#4c7dba"/><path d="M433.5 80.2 A250 250 0 0 1 434.5 81.3 L409.8 103.9 A216.5 216.5 0 0 0 408.9 103 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#4f80be"/><path d="M439.8 145.9 A216.5 216.5 0 0 1 458.4 191.3 L420.1 202 A176.8 176.8 0 0 0 405 165 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#2969a4"/><path d="M469.2 129.8 A250 250 0 0 1 474 139 L444 153.9 A216.5 216.5 0 0 0 439.8 145.9 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#003f75"/><path d="M482 156.7 A250 250 0 0 1 483.1 159.5 L451.8 171.6 A216.5 216.5 0 0 0 450.9 169.2 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#21548c"/><path d="M476.6 144.4 A250 250 0 0 1 478.5 148.5 L447.9 162.1 A216.5 216.5 0 0 0 446.3 158.6 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#10477e"/><path d="M486.1 167.9 A250 250 0 0 1 486.6 169.3 L454.9 180.2 A216.5 216.5 0 0 0 454.5 178.9 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#3365a0"/><path d="M483.1 159.5 A250 250 0 0 1 484.1 162.3 L452.8 174.1 A216.5 216.5 0 0 0 451.8 171.6 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#255891"/><path d="M484.1 162.3 A250 250 0 0 1 485.1 165.1 L453.6 176.5 A216.5 216.5 0 0 0 452.8 174.1 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#2a5c96"/><path d="M478.5 148.5 A250 250 0 0 1 480.2 152.6 L449.4 165.7 A216.5 216.5 0 0 0 447.9 162.1 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#164b83"/><path d="M474 139 A250 250 0 0 1 476.6 144.4 L446.3 158.6 A216.5 216.5 0 0 0 444 153.9 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#08437a"/><path d="M486.6 169.3 A250 250 0 0 1 487.1 170.8 L455.3 181.4 A216.5 216.5 0 0 0 454.9 180.2 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#3769a4"/><path d="M487.1 170.8 A250 250 0 0 1 487.6 172.2 L455.7 182.6 A216.5 216.5 0 0 0 455.3 181.4 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#3c6ea9"/><path d="M480.2 152.6 A250 250 0 0 1 482 156.7 L450.9 169.2 A216.5 216.5 0 0 0 449.4 165.7 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#1b4f88"/><path d="M485.1 165.1 A250 250 0 0 1 486.1 167.9 L454.5 178.9 A216.5 216.5 0 0 0 453.6 176.5 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#2f619b"/><path d="M487.6 172.2 A250 250 0 0 1 488 173.6 L456.1 183.8 A216.5 216.5 0 0 0 455.7 182.6 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#4072ae"/><path d="M488 173.6 A250 250 0 0 1 488.5 175 L456.5 185.1 A216.5 216.5 0 0 0 456.1 183.8 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#4477b3"/><path d="M488.5 175 A250 250 0 0 1 488.9 176.4 L456.9 186.3 A216.5 216.5 0 0 0 456.5 185.1 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#487bb8"/><path d="M488.9 176.4 A250 250 0 0 1 489.4 177.9 L457.3 187.5 A216.5 216.5 0 0 0 456.9 186.3 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#4c80bd"/><path d="M489.4 177.9 A250 250 0 0 1 489.8 179.3 L457.7 188.8 A216.5 216.5 0 0 0 457.3 187.5 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#5084c2"/><path d="M489.8 179.3 A250 250 0 0 1 490.2 180.7 L458 190 A216.5 216.5 0 0 0 457.7 188.8 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#5589c7"/><path d="M490.2 180.7 A250 250 0 0 1 490.6 182.2 L458.4 191.3 A216.5 216.5 0 0 0 458 190 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#598ecc"/><path d="M465.3 273.2 A216.5 216.5 0 0 1 459.4 305 L421 294.9 A176.8 176.8 0 0 0 425.8 269 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#3e7fbc"/><path d="M497.8 282.8 A250 250 0 0 1 497.6 284.2 L464.5 279.6 A216.5 216.5 0 0 0 464.6 278.4 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#135a94"/><path d="M497.6 284.2 A250 250 0 0 1 497.4 285.7 L464.3 280.9 A216.5 216.5 0 0 0 464.5 279.6 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#195e98"/><path d="M497.4 285.7 A250 250 0 0 1 497.2 287.2 L464.1 282.2 A216.5 216.5 0 0 0 464.3 280.9 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#1f619c"/><path d="M497.2 287.2 A250 250 0 0 1 497 288.7 L463.9 283.5 A216.5 216.5 0 0 0 464.1 282.2 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#2565a0"/><path d="M497 288.7 A250 250 0 0 1 496.8 290.1 L463.7 284.8 A216.5 216.5 0 0 0 463.9 283.5 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#2a69a4"/><path d="M496.8 290.1 A250 250 0 0 1 496.5 291.6 L463.5 286 A216.5 216.5 0 0 0 463.7 284.8 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#2e6ca8"/><path d="M496.5 291.6 A250 250 0 0 1 496.3 293.1 L463.3 287.3 A216.5 216.5 0 0 0 463.5 286 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#3370ac"/><path d="M496.3 293.1 A250 250 0 0 1 496 294.6 L463 288.6 A216.5 216.5 0 0 0 463.3 287.3 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#3774b0"/><path d="M496 294.6 A250 250 0 0 1 495.7 296 L462.8 289.9 A216.5 216.5 0 0 0 463 288.6 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#3c77b4"/><path d="M495.7 296 A250 250 0 0 1 495.4 297.5 L462.6 291.1 A216.5 216.5 0 0 0 462.8 289.9 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#407bb8"/><path d="M495.4 297.5 A250 250 0 0 1 495.2 299 L462.3 292.4 A216.5 216.5 0 0 0 462.6 291.1 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#447fbc"/><path d="M495.2 299 A250 250 0 0 1 494.9 300.4 L462.1 293.7 A216.5 216.5 0 0 0 462.3 292.4 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#4883c1"/><path d="M498.6 276.8 A250 250 0 0 1 498.2 279.8 L465 275.8 A216.5 216.5 0 0 0 465.3 273.2 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#00538c"/><path d="M494.9 300.4 A250 250 0 0 1 494.6 301.9 L461.8 294.9 A216.5 216.5 0 0 0 462.1 293.7 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#4c87c5"/><path d="M494.6 301.9 A250 250 0 0 1 494.2 303.3 L461.5 296.2 A216.5 216.5 0 0 0 461.8 294.9 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#508ac9"/><path d="M494.2 303.3 A250 250 0 0 1 493.9 304.8 L461.2 297.5 A216.5 216.5 0 0 0 461.5 296.2 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#548ecd"/><path d="M493.9 304.8 A250 250 0 0 1 493.6 306.3 L461 298.7 A216.5 216.5 0 0 0 461.2 297.5 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#5892d1"/><path d="M493.6 306.3 A250 250 0 0 1 493.2 307.7 L460.7 300 A216.5 216.5 0 0 0 461 298.7 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#5c96d5"/><path d="M493.2 307.7 A250 250 0 0 1 492.9 309.2 L460.4 301.2 A216.5 216.5 0 0 0 460.7 300 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#609ada"/><path d="M498.2 279.8 A250 250 0 0 1 497.8 282.8 L464.6 278.4 A216.5 216.5 0 0 0 465 275.8 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#0a5790"/><path d="M492.9 309.2 A250 250 0 0 1 492.5 310.6 L460 302.5 A216.5 216.5 0 0 0 460.4 301.2 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#649ede"/><path d="M492.5 310.6 A250 250 0 0 1 492.2 312.1 L459.7 303.7 A216.5 216.5 0 0 0 460 302.5 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#68a2e2"/><path d="M492.2 312.1 A250 250 0 0 1 491.8 313.5 L459.4 305 A216.5 216.5 0 0 0 459.7 303.7 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#6ca6e6"/><path id="ky" d="M318.6 44.7 A216.5 216.5 0 0 1 369.6 69.5 L347.7 102.6 A176.8 176.8 0 0 0 306 82.3 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="1" fill="#0d538c"/><path d="M340.5 16.9 A250 250 0 0 1 343.3 18 L330.8 49.1 A216.5 216.5 0 0 0 328.4 48.2 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#063064"/><path d="M343.3 18 A250 250 0 0 1 346 19.2 L333.2 50.1 A216.5 216.5 0 0 0 330.8 49.1 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#093266"/><path d="M346 19.2 A250 250 0 0 1 348.8 20.3 L335.5 51.1 A216.5 216.5 0 0 0 333.2 50.1 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#0d3569"/><path d="M348.8 20.3 A250 250 0 0 1 351.5 21.5 L337.9 52.1 A216.5 216.5 0 0 0 335.5 51.1 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#10376c"/><path d="M359.6 25.3 A250 250 0 0 1 361 26 L346.1 56 A216.5 216.5 0 0 0 344.9 55.4 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#1a4178"/><path d="M361 26 A250 250 0 0 1 362.3 26.6 L347.3 56.6 A216.5 216.5 0 0 0 346.1 56 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#1d447a"/><path d="M362.3 26.6 A250 250 0 0 1 363.6 27.3 L348.4 57.2 A216.5 216.5 0 0 0 347.3 56.6 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#1f467d"/><path d="M363.6 27.3 A250 250 0 0 1 365 28 L349.6 57.7 A216.5 216.5 0 0 0 348.4 57.2 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#224980"/><path d="M365 28 A250 250 0 0 1 366.3 28.7 L350.7 58.3 A216.5 216.5 0 0 0 349.6 57.7 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#244b83"/><path d="M366.3 28.7 A250 250 0 0 1 367.6 29.4 L351.8 58.9 A216.5 216.5 0 0 0 350.7 58.3 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#264e86"/><path d="M351.5 21.5 A250 250 0 0 1 354.2 22.8 L340.3 53.2 A216.5 216.5 0 0 0 337.9 52.1 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#123a6f"/><path d="M336.3 15.4 A250 250 0 0 1 340.5 16.9 L328.4 48.2 A216.5 216.5 0 0 0 324.7 46.8 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#032d61"/><path d="M354.2 22.8 A250 250 0 0 1 356.9 24 L342.6 54.3 A216.5 216.5 0 0 0 340.3 53.2 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#153c72"/><path d="M367.6 29.4 A250 250 0 0 1 368.9 30.1 L353 59.6 A216.5 216.5 0 0 0 351.8 58.9 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#295089"/><path d="M368.9 30.1 A250 250 0 0 1 370.2 30.8 L354.1 60.2 A216.5 216.5 0 0 0 353 59.6 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#2b538c"/><path d="M370.2 30.8 A250 250 0 0 1 371.5 31.5 L355.3 60.8 A216.5 216.5 0 0 0 354.1 60.2 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#2d568f"/><path d="M371.5 31.5 A250 250 0 0 1 372.8 32.3 L356.4 61.4 A216.5 216.5 0 0 0 355.3 60.8 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#2f5892"/><path d="M372.8 32.3 A250 250 0 0 1 374.1 33 L357.5 62.1 A216.5 216.5 0 0 0 356.4 61.4 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#315b95"/><path d="M374.1 33 A250 250 0 0 1 375.4 33.7 L358.6 62.7 A216.5 216.5 0 0 0 357.5 62.1 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#345e98"/><path d="M356.9 24 A250 250 0 0 1 359.6 25.3 L344.9 55.4 A216.5 216.5 0 0 0 342.6 54.3 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#183e75"/><path d="M375.4 33.7 A250 250 0 0 1 376.7 34.5 L359.7 63.4 A216.5 216.5 0 0 0 358.6 62.7 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#36609b"/><path d="M329.2 12.9 A250 250 0 0 1 336.3 15.4 L324.7 46.8 A216.5 216.5 0 0 0 318.6 44.7 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#002b5e"/><path d="M376.7 34.5 A250 250 0 0 1 378 35.3 L360.9 64 A216.5 216.5 0 0 0 359.7 63.4 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#38639e"/><path d="M378 35.3 A250 250 0 0 1 379.3 36 L362 64.7 A216.5 216.5 0 0 0 360.9 64 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#3a66a1"/><path d="M379.3 36 A250 250 0 0 1 380.6 36.8 L363.1 65.4 A216.5 216.5 0 0 0 362 64.7 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#3c69a4"/><path d="M380.6 36.8 A250 250 0 0 1 381.8 37.6 L364.2 66 A216.5 216.5 0 0 0 363.1 65.4 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#3f6ba7"/><path d="M381.8 37.6 A250 250 0 0 1 383.1 38.4 L365.3 66.7 A216.5 216.5 0 0 0 364.2 66 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#416eaa"/><path d="M383.1 38.4 A250 250 0 0 1 384.4 39.2 L366.4 67.4 A216.5 216.5 0 0 0 365.3 66.7 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#4371ad"/><path d="M384.4 39.2 A250 250 0 0 1 385.6 40 L367.4 68.1 A216.5 216.5 0 0 0 366.4 67.4 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#4574b0"/><path d="M385.6 40 A250 250 0 0 1 386.9 40.8 L368.5 68.8 A216.5 216.5 0 0 0 367.4 68.1 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#4777b3"/><path d="M386.9 40.8 A250 250 0 0 1 388.1 41.6 L369.6 69.5 A216.5 216.5 0 0 0 368.5 68.8 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#4a79b6"/><path d="M409.8 103.9 A216.5 216.5 0 0 1 439.8 145.9 L405 165 A176.8 176.8 0 0 0 380.5 130.7 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#21619c"/><path d="M448 97.3 A250 250 0 0 1 449.8 99.7 L423 119.8 A216.5 216.5 0 0 0 421.4 117.8 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#13447b"/><path d="M455 106.9 A250 250 0 0 1 455.9 108.2 L428.3 127.2 A216.5 216.5 0 0 0 427.6 126.1 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#225088"/><path d="M449.8 99.7 A250 250 0 0 1 451.5 102.1 L424.5 121.9 A216.5 216.5 0 0 0 423 119.8 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#17477e"/><path d="M439.5 86.9 A250 250 0 0 1 442.4 90.3 L416.6 111.7 A216.5 216.5 0 0 0 414.1 108.8 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#053b70"/><path d="M451.5 102.1 A250 250 0 0 1 453.3 104.5 L426.1 124 A216.5 216.5 0 0 0 424.5 121.9 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#1b4a82"/><path d="M434.5 81.3 A250 250 0 0 1 439.5 86.9 L414.1 108.8 A216.5 216.5 0 0 0 409.8 103.9 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#00386d"/><path d="M455.9 108.2 A250 250 0 0 1 456.7 109.4 L429 128.2 A216.5 216.5 0 0 0 428.3 127.2 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#25538c"/><path d="M456.7 109.4 A250 250 0 0 1 457.6 110.6 L429.7 129.3 A216.5 216.5 0 0 0 429 128.2 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#29568f"/><path d="M457.6 110.6 A250 250 0 0 1 458.4 111.9 L430.5 130.4 A216.5 216.5 0 0 0 429.7 129.3 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#2c5993"/><path d="M458.4 111.9 A250 250 0 0 1 459.2 113.1 L431.2 131.5 A216.5 216.5 0 0 0 430.5 130.4 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#2f5c97"/><path d="M459.2 113.1 A250 250 0 0 1 460 114.4 L431.9 132.6 A216.5 216.5 0 0 0 431.2 131.5 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#32609a"/><path d="M460 114.4 A250 250 0 0 1 460.8 115.6 L432.6 133.6 A216.5 216.5 0 0 0 431.9 132.6 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#35639e"/><path d="M460.8 115.6 A250 250 0 0 1 461.6 116.9 L433.3 134.7 A216.5 216.5 0 0 0 432.6 133.6 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#3866a1"/><path d="M461.6 116.9 A250 250 0 0 1 462.4 118.2 L434 135.8 A216.5 216.5 0 0 0 433.3 134.7 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#3b69a5"/><path d="M462.4 118.2 A250 250 0 0 1 463.2 119.4 L434.6 136.9 A216.5 216.5 0 0 0 434 135.8 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#3e6da8"/><path d="M463.2 119.4 A250 250 0 0 1 464 120.7 L435.3 138 A216.5 216.5 0 0 0 434.6 136.9 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#4170ac"/><path d="M464 120.7 A250 250 0 0 1 464.7 122 L436 139.1 A216.5 216.5 0 0 0 435.3 138 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#4473b0"/><path d="M442.4 90.3 A250 250 0 0 1 445.2 93.8 L419 114.7 A216.5 216.5 0 0 0 416.6 111.7 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#0a3e74"/><path d="M464.7 122 A250 250 0 0 1 465.5 123.3 L436.6 140.3 A216.5 216.5 0 0 0 436 139.1 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#4776b3"/><path d="M445.2 93.8 A250 250 0 0 1 448 97.3 L421.4 117.8 A216.5 216.5 0 0 0 419 114.7 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#0f4177"/><path d="M465.5 123.3 A250 250 0 0 1 466.3 124.6 L437.3 141.4 A216.5 216.5 0 0 0 436.6 140.3 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#4a7ab7"/><path d="M453.3 104.5 A250 250 0 0 1 455 106.9 L427.6 126.1 A216.5 216.5 0 0 0 426.1 124 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#1f4d85"/><path d="M466.3 124.6 A250 250 0 0 1 467 125.9 L437.9 142.5 A216.5 216.5 0 0 0 437.3 141.4 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#4c7dbb"/><path d="M467 125.9 A250 250 0 0 1 467.7 127.2 L438.6 143.6 A216.5 216.5 0 0 0 437.9 142.5 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#4f80be"/><path d="M467.7 127.2 A250 250 0 0 1 468.5 128.5 L439.2 144.7 A216.5 216.5 0 0 0 438.6 143.6 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#5284c2"/><path d="M468.5 128.5 A250 250 0 0 1 469.2 129.8 L439.8 145.9 A216.5 216.5 0 0 0 439.2 144.7 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#5587c6"/><path d="M458.4 191.3 A216.5 216.5 0 0 1 466.1 237.1 L426.5 239.4 A176.8 176.8 0 0 0 420.1 202 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#3070ac"/><path d="M496 205.4 A250 250 0 0 1 496.3 206.9 L463.3 212.7 A216.5 216.5 0 0 0 463 211.4 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#245a94"/><path d="M490.6 182.2 A250 250 0 0 1 491.8 186.5 L459.4 195 A216.5 216.5 0 0 0 458.4 191.3 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#00457c"/><path d="M491.8 186.5 A250 250 0 0 1 492.9 190.8 L460.4 198.8 A216.5 216.5 0 0 0 459.4 195 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#06487f"/><path d="M496.3 206.9 A250 250 0 0 1 496.5 208.4 L463.5 214 A216.5 216.5 0 0 0 463.3 212.7 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#275d97"/><path d="M496.5 208.4 A250 250 0 0 1 496.8 209.9 L463.7 215.2 A216.5 216.5 0 0 0 463.5 214 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#2b609a"/><path d="M496.8 209.9 A250 250 0 0 1 497 211.3 L463.9 216.5 A216.5 216.5 0 0 0 463.7 215.2 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#2f639e"/><path d="M492.9 190.8 A250 250 0 0 1 493.6 193.7 L461 201.3 A216.5 216.5 0 0 0 460.4 198.8 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#0d4b83"/><path d="M497 211.3 A250 250 0 0 1 497.2 212.8 L464.1 217.8 A216.5 216.5 0 0 0 463.9 216.5 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#3266a1"/><path d="M497.2 212.8 A250 250 0 0 1 497.4 214.3 L464.3 219.1 A216.5 216.5 0 0 0 464.1 217.8 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#3569a5"/><path d="M497.4 214.3 A250 250 0 0 1 497.6 215.8 L464.5 220.4 A216.5 216.5 0 0 0 464.3 219.1 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#396da8"/><path d="M497.6 215.8 A250 250 0 0 1 497.8 217.2 L464.6 221.6 A216.5 216.5 0 0 0 464.5 220.4 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#3c70ac"/><path d="M497.8 217.2 A250 250 0 0 1 498 218.7 L464.8 222.9 A216.5 216.5 0 0 0 464.6 221.6 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#3f73af"/><path d="M498 218.7 A250 250 0 0 1 498.2 220.2 L465 224.2 A216.5 216.5 0 0 0 464.8 222.9 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#4276b3"/><path d="M498.2 220.2 A250 250 0 0 1 498.4 221.7 L465.1 225.5 A216.5 216.5 0 0 0 465 224.2 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#4679b6"/><path d="M498.4 221.7 A250 250 0 0 1 498.6 223.2 L465.3 226.8 A216.5 216.5 0 0 0 465.1 225.5 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#497dba"/><path d="M493.6 193.7 A250 250 0 0 1 494.2 196.7 L461.5 203.8 A216.5 216.5 0 0 0 461 201.3 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#134e86"/><path d="M494.2 196.7 A250 250 0 0 1 494.9 199.6 L462.1 206.3 A216.5 216.5 0 0 0 461.5 203.8 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#175189"/><path d="M498.6 223.2 A250 250 0 0 1 498.7 224.7 L465.4 228.1 A216.5 216.5 0 0 0 465.3 226.8 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#4c80be"/><path d="M498.7 224.7 A250 250 0 0 1 498.9 226.1 L465.5 229.3 A216.5 216.5 0 0 0 465.4 228.1 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#4f83c1"/><path d="M494.9 199.6 A250 250 0 0 1 495.4 202.5 L462.6 208.9 A216.5 216.5 0 0 0 462.1 206.3 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#1c548d"/><path d="M498.9 226.1 A250 250 0 0 1 499 227.6 L465.6 230.6 A216.5 216.5 0 0 0 465.5 229.3 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#5287c5"/><path d="M499 227.6 A250 250 0 0 1 499.1 229.1 L465.7 231.9 A216.5 216.5 0 0 0 465.6 230.6 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#558ac8"/><path d="M499.1 229.1 A250 250 0 0 1 499.2 230.6 L465.9 233.2 A216.5 216.5 0 0 0 465.7 231.9 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#588dcc"/><path d="M499.2 230.6 A250 250 0 0 1 499.4 232.1 L466 234.5 A216.5 216.5 0 0 0 465.9 233.2 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#5c91cf"/><path d="M499.4 232.1 A250 250 0 0 1 499.5 233.6 L466 235.8 A216.5 216.5 0 0 0 466 234.5 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#5f94d3"/><path d="M499.5 233.6 A250 250 0 0 1 499.6 235.1 L466.1 237.1 A216.5 216.5 0 0 0 466 235.8 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#6297d7"/><path d="M495.4 202.5 A250 250 0 0 1 496 205.4 L463 211.4 A216.5 216.5 0 0 0 462.6 208.9 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#205790"/><path d="M459.4 305 A216.5 216.5 0 0 1 455.7 317.4 L418 305 A176.8 176.8 0 0 0 421 294.9 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#4587c4"/><path d="M490.2 319.3 A250 250 0 0 1 489.8 320.7 L457.7 311.2 A216.5 216.5 0 0 0 458 310 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#296ea8"/><path d="M491.8 313.5 A250 250 0 0 1 491 316.4 L458.7 307.5 A216.5 216.5 0 0 0 459.4 305 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#005a93"/><path d="M489.8 320.7 A250 250 0 0 1 489.4 322.1 L457.3 312.5 A216.5 216.5 0 0 0 457.7 311.2 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#3778b3"/><path d="M489.4 322.1 A250 250 0 0 1 488.9 323.6 L456.9 313.7 A216.5 216.5 0 0 0 457.3 312.5 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#4382be"/><path d="M488.9 323.6 A250 250 0 0 1 488.5 325 L456.5 314.9 A216.5 216.5 0 0 0 456.9 313.7 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#4e8cc9"/><path d="M488.5 325 A250 250 0 0 1 488 326.4 L456.1 316.2 A216.5 216.5 0 0 0 456.5 314.9 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#5a97d5"/><path d="M488 326.4 A250 250 0 0 1 487.6 327.8 L455.7 317.4 A216.5 216.5 0 0 0 456.1 316.2 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#65a1e0"/><path d="M491 316.4 A250 250 0 0 1 490.2 319.3 L458 310 A216.5 216.5 0 0 0 458.7 307.5 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#19649e"/><path d="M455.7 317.4 A216.5 216.5 0 0 1 451.4 329.6 L414.4 315 A176.8 176.8 0 0 0 418 305 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#4b8ecd"/><path d="M485.7 333.5 A250 250 0 0 1 485.1 334.9 L453.6 323.5 A216.5 216.5 0 0 0 454.1 322.3 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#2c75b1"/><path d="M485.1 334.9 A250 250 0 0 1 484.6 336.3 L453.2 324.7 A216.5 216.5 0 0 0 453.6 323.5 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#3a7fbc"/><path d="M484.6 336.3 A250 250 0 0 1 484.1 337.7 L452.8 325.9 A216.5 216.5 0 0 0 453.2 324.7 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#4789c7"/><path d="M487.6 327.8 A250 250 0 0 1 486.6 330.7 L454.9 319.8 A216.5 216.5 0 0 0 455.7 317.4 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#00619c"/><path d="M484.1 337.7 A250 250 0 0 1 483.6 339.1 L452.3 327.1 A216.5 216.5 0 0 0 452.8 325.9 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#5393d2"/><path d="M486.6 330.7 A250 250 0 0 1 485.7 333.5 L454.1 322.3 A216.5 216.5 0 0 0 454.9 319.8 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#1c6ba7"/><path d="M483.6 339.1 A250 250 0 0 1 483.1 340.5 L451.8 328.4 A216.5 216.5 0 0 0 452.3 327.1 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#5f9edd"/><path d="M483.1 340.5 A250 250 0 0 1 482.5 341.9 L451.4 329.6 A216.5 216.5 0 0 0 451.8 328.4 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#6aa8e8"/><path d="M250 33.5 A216.5 216.5 0 0 1 318.6 44.7 L306 82.3 A176.8 176.8 0 0 0 250 73.2 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#004c84"/><path d="M264.9 0.4 A250 250 0 0 1 269.4 0.8 L266.8 34.1 A216.5 216.5 0 0 0 262.9 33.9 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#052a5d"/><path d="M291.6 3.5 A250 250 0 0 1 294.6 4 L288.6 37 A216.5 216.5 0 0 0 286 36.5 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#173a70"/><path d="M309.2 7.1 A250 250 0 0 1 310.6 7.5 L302.5 40 A216.5 216.5 0 0 0 301.2 39.6 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#264b83"/><path d="M310.6 7.5 A250 250 0 0 1 312.1 7.8 L303.7 40.3 A216.5 216.5 0 0 0 302.5 40 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#284d86"/><path d="M312.1 7.8 A250 250 0 0 1 313.5 8.2 L305 40.6 A216.5 216.5 0 0 0 303.7 40.3 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#2a5089"/><path d="M294.6 4 A250 250 0 0 1 297.5 4.6 L291.1 37.4 A216.5 216.5 0 0 0 288.6 37 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#1a3d73"/><path d="M297.5 4.6 A250 250 0 0 1 300.4 5.1 L293.7 37.9 A216.5 216.5 0 0 0 291.1 37.4 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#1c3f76"/><path d="M259 0.2 A250 250 0 0 1 264.9 0.4 L262.9 33.9 A216.5 216.5 0 0 0 257.8 33.6 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#03285a"/><path d="M269.4 0.8 A250 250 0 0 1 273.9 1.1 L270.7 34.5 A216.5 216.5 0 0 0 266.8 34.1 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#092d60"/><path d="M273.9 1.1 A250 250 0 0 1 278.3 1.6 L274.5 34.9 A216.5 216.5 0 0 0 270.7 34.5 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#0c2f63"/><path d="M250 0 A250 250 0 0 1 259 0.2 L257.8 33.6 A216.5 216.5 0 0 0 250 33.5 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#002557"/><path d="M278.3 1.6 A250 250 0 0 1 282.8 2.2 L278.4 35.4 A216.5 216.5 0 0 0 274.5 34.9 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#0f3266"/><path d="M282.8 2.2 A250 250 0 0 1 287.2 2.8 L282.2 35.9 A216.5 216.5 0 0 0 278.4 35.4 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#123569"/><path d="M300.4 5.1 A250 250 0 0 1 303.3 5.8 L296.2 38.5 A216.5 216.5 0 0 0 293.7 37.9 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#1f4279"/><path d="M313.5 8.2 A250 250 0 0 1 314.9 8.6 L306.2 40.9 A216.5 216.5 0 0 0 305 40.6 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#2d538c"/><path d="M287.2 2.8 A250 250 0 0 1 291.6 3.5 L286 36.5 A216.5 216.5 0 0 0 282.2 35.9 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#15376d"/><path d="M314.9 8.6 A250 250 0 0 1 316.4 9 L307.5 41.3 A216.5 216.5 0 0 0 306.2 40.9 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#2f5690"/><path d="M316.4 9 A250 250 0 0 1 317.8 9.4 L308.7 41.6 A216.5 216.5 0 0 0 307.5 41.3 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#315993"/><path d="M317.8 9.4 A250 250 0 0 1 319.3 9.8 L310 42 A216.5 216.5 0 0 0 308.7 41.6 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#345c96"/><path d="M319.3 9.8 A250 250 0 0 1 320.7 10.2 L311.2 42.3 A216.5 216.5 0 0 0 310 42 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#365f9a"/><path d="M320.7 10.2 A250 250 0 0 1 322.1 10.6 L312.5 42.7 A216.5 216.5 0 0 0 311.2 42.3 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#38629d"/><path d="M322.1 10.6 A250 250 0 0 1 323.6 11.1 L313.7 43.1 A216.5 216.5 0 0 0 312.5 42.7 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#3a65a0"/><path d="M303.3 5.8 A250 250 0 0 1 306.3 6.4 L298.7 39 A216.5 216.5 0 0 0 296.2 38.5 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#21457c"/><path d="M323.6 11.1 A250 250 0 0 1 325 11.5 L314.9 43.5 A216.5 216.5 0 0 0 313.7 43.1 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#3d68a3"/><path d="M306.3 6.4 A250 250 0 0 1 309.2 7.1 L301.2 39.6 A216.5 216.5 0 0 0 298.7 39 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#234880"/><path d="M325 11.5 A250 250 0 0 1 326.4 12 L316.2 43.9 A216.5 216.5 0 0 0 314.9 43.5 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#3f6ba7"/><path d="M326.4 12 A250 250 0 0 1 327.8 12.4 L317.4 44.3 A216.5 216.5 0 0 0 316.2 43.9 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#416eaa"/><path d="M327.8 12.4 A250 250 0 0 1 329.2 12.9 L318.6 44.7 A216.5 216.5 0 0 0 317.4 44.3 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#4371ad"/><path d="M451.4 329.6 A216.5 216.5 0 0 1 448.9 335.5 L412.4 319.8 A176.8 176.8 0 0 0 414.4 315 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#5296d5"/><path d="M482.5 341.9 A250 250 0 0 1 480.8 346 L449.9 333.2 A216.5 216.5 0 0 0 451.4 329.6 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#0468a3"/><path d="M480.8 346 A250 250 0 0 1 480.2 347.4 L449.4 334.3 A216.5 216.5 0 0 0 449.9 333.2 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#357eb9"/><path d="M480.2 347.4 A250 250 0 0 1 479.7 348.8 L448.9 335.5 A216.5 216.5 0 0 0 449.4 334.3 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#5296d0"/><path d="M74.4 270 A176.8 176.8 0 0 1 151.5 103.2 L180.3 146.2 A125 125 0 0 0 125.8 264.2 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#d62728"/><path d="M128.2 71 A216.5 216.5 0 0 1 129.3 70.3 L151.5 103.2 A176.8 176.8 0 0 0 150.6 103.8 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#d74032"/><path d="M109.4 43.3 A250 250 0 0 1 110.6 42.4 L129.3 70.3 A216.5 216.5 0 0 0 128.2 71 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#9e000a"/><path d="M126.1 72.4 A216.5 216.5 0 0 1 128.2 71 L150.6 103.8 A176.8 176.8 0 0 0 148.8 105 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#c32f22"/><path d="M106.9 45 A250 250 0 0 1 109.4 43.3 L128.2 71 A216.5 216.5 0 0 0 126.1 72.4 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#8b0000"/><path d="M34.9 274.5 A216.5 216.5 0 0 1 56 153.9 L91.6 171.5 A176.8 176.8 0 0 0 74.4 270 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#9c0000"/><path d="M10.2 179.3 A250 250 0 0 1 11.1 176.4 L43.1 186.3 A216.5 216.5 0 0 0 42.3 188.8 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#931e14"/><path d="M11.1 176.4 A250 250 0 0 1 12 173.6 L43.9 183.8 A216.5 216.5 0 0 0 43.1 186.3 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#951f15"/><path d="M16.9 159.5 A250 250 0 0 1 17.5 158.1 L48.6 170.4 A216.5 216.5 0 0 0 48.2 171.6 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#a6291b"/><path d="M3.2 209.9 A250 250 0 0 1 4 205.4 L37 211.4 A216.5 216.5 0 0 0 36.3 215.2 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#7f110d"/><path d="M17.5 158.1 A250 250 0 0 1 18 156.7 L49.1 169.2 A216.5 216.5 0 0 0 48.6 170.4 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#a92b1c"/><path d="M18 156.7 A250 250 0 0 1 18.6 155.4 L49.6 168 A216.5 216.5 0 0 0 49.1 169.2 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#ac2d1d"/><path d="M0.2 239.6 A250 250 0 0 1 0.5 233.6 L34 235.8 A216.5 216.5 0 0 0 33.7 241 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#720706"/><path d="M0.5 266.4 A250 250 0 0 1 0.1 257.5 L33.6 256.5 A216.5 216.5 0 0 0 34 264.2 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#6a0202"/><path d="M0.1 257.5 A250 250 0 0 1 0 248.5 L33.5 248.7 A216.5 216.5 0 0 0 33.6 256.5 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#6c0303"/><path d="M12 173.6 A250 250 0 0 1 12.9 170.8 L44.7 181.4 A216.5 216.5 0 0 0 43.9 183.8 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#982116"/><path d="M18.6 155.4 A250 250 0 0 1 19.2 154 L50.1 166.8 A216.5 216.5 0 0 0 49.6 168 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#af2e1e"/><path d="M12.9 170.8 A250 250 0 0 1 13.9 167.9 L45.5 178.9 A216.5 216.5 0 0 0 44.7 181.4 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#9b2317"/><path d="M19.2 154 A250 250 0 0 1 19.8 152.6 L50.6 165.7 A216.5 216.5 0 0 0 50.1 166.8 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#b2301f"/><path d="M19.8 152.6 A250 250 0 0 1 20.3 151.2 L51.1 164.5 A216.5 216.5 0 0 0 50.6 165.7 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#b53220"/><path d="M20.3 151.2 A250 250 0 0 1 20.9 149.9 L51.6 163.3 A216.5 216.5 0 0 0 51.1 164.5 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#b83321"/><path d="M0 248.5 A250 250 0 0 1 0.2 239.6 L33.7 241 A216.5 216.5 0 0 0 33.5 248.7 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#6f0505"/><path d="M0.5 233.6 A250 250 0 0 1 1 227.6 L34.4 230.6 A216.5 216.5 0 0 0 34 235.8 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#740908"/><path d="M1 227.6 A250 250 0 0 1 1.6 221.7 L34.9 225.5 A216.5 216.5 0 0 0 34.4 230.6 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#770b09"/><path d="M4 205.4 A250 250 0 0 1 4.8 201 L37.7 207.6 A216.5 216.5 0 0 0 37 211.4 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#82130e"/><path d="M4.8 201 A250 250 0 0 1 5.8 196.7 L38.5 203.8 A216.5 216.5 0 0 0 37.7 207.6 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#85150f"/><path d="M20.9 149.9 A250 250 0 0 1 21.5 148.5 L52.1 162.1 A216.5 216.5 0 0 0 51.6 163.3 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#bb3522"/><path d="M21.5 148.5 A250 250 0 0 1 22.1 147.1 L52.7 160.9 A216.5 216.5 0 0 0 52.1 162.1 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#bd3723"/><path d="M13.9 167.9 A250 250 0 0 1 14.9 165.1 L46.4 176.5 A216.5 216.5 0 0 0 45.5 178.9 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#9e2418"/><path d="M5.8 196.7 A250 250 0 0 1 6.8 192.3 L39.3 200 A216.5 216.5 0 0 0 38.5 203.8 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#871710"/><path d="M1.6 221.7 A250 250 0 0 1 2.4 215.8 L35.5 220.4 A216.5 216.5 0 0 0 34.9 225.5 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#7a0d0b"/><path d="M14.9 165.1 A250 250 0 0 1 15.9 162.3 L47.2 174.1 A216.5 216.5 0 0 0 46.4 176.5 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#a12619"/><path d="M6.8 192.3 A250 250 0 0 1 7.8 187.9 L40.3 196.3 A216.5 216.5 0 0 0 39.3 200 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#8a1811"/><path d="M22.1 147.1 A250 250 0 0 1 22.8 145.8 L53.2 159.7 A216.5 216.5 0 0 0 52.7 160.9 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#c03824"/><path d="M15.9 162.3 A250 250 0 0 1 16.9 159.5 L48.2 171.6 A216.5 216.5 0 0 0 47.2 174.1 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#a4281a"/><path d="M7.8 187.9 A250 250 0 0 1 9 183.6 L41.3 192.5 A216.5 216.5 0 0 0 40.3 196.3 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#8d1a12"/><path d="M1.6 278.3 A250 250 0 0 1 0.5 266.4 L34 264.2 A216.5 216.5 0 0 0 34.9 274.5 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#670000"/><path d="M22.8 145.8 A250 250 0 0 1 23.4 144.4 L53.7 158.6 A216.5 216.5 0 0 0 53.2 159.7 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#c33a25"/><path d="M2.4 215.8 A250 250 0 0 1 3.2 209.9 L36.3 215.2 A216.5 216.5 0 0 0 35.5 220.4 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#7c0f0c"/><path d="M23.4 144.4 A250 250 0 0 1 24 143.1 L54.3 157.4 A216.5 216.5 0 0 0 53.7 158.6 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#c63c26"/><path d="M24 143.1 A250 250 0 0 1 24.7 141.7 L54.9 156.2 A216.5 216.5 0 0 0 54.3 157.4 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#c93d27"/><path d="M24.7 141.7 A250 250 0 0 1 25.3 140.4 L55.4 155.1 A216.5 216.5 0 0 0 54.9 156.2 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#cc3f28"/><path d="M9 183.6 A250 250 0 0 1 10.2 179.3 L42.3 188.8 A216.5 216.5 0 0 0 41.3 192.5 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#901c13"/><path d="M25.3 140.4 A250 250 0 0 1 26 139 L56 153.9 A216.5 216.5 0 0 0 55.4 155.1 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#cf4129"/><path d="M56 153.9 A216.5 216.5 0 0 1 126.1 72.4 L148.8 105 A176.8 176.8 0 0 0 91.6 171.5 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#b01c11"/><path d="M78 68.5 A250 250 0 0 1 79.1 67.5 L102 92 A216.5 216.5 0 0 0 101.1 92.8 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#a8291b"/><path d="M79.1 67.5 A250 250 0 0 1 80.2 66.5 L103 91.1 A216.5 216.5 0 0 0 102 92 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#ab2b1c"/><path d="M80.2 66.5 A250 250 0 0 1 81.3 65.5 L103.9 90.2 A216.5 216.5 0 0 0 103 91.1 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#ad2c1d"/><path d="M26 139 A250 250 0 0 1 31.5 128.5 L60.8 144.7 A216.5 216.5 0 0 0 56 153.9 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#790000"/><path d="M35.3 122 A250 250 0 0 1 38.4 116.9 L66.7 134.7 A216.5 216.5 0 0 0 64 139.1 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#7e0403"/><path d="M81.3 65.5 A250 250 0 0 1 82.4 64.5 L104.9 89.3 A216.5 216.5 0 0 0 103.9 90.2 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#b02e1e"/><path d="M82.4 64.5 A250 250 0 0 1 83.5 63.5 L105.8 88.5 A216.5 216.5 0 0 0 104.9 89.3 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#b2301f"/><path d="M53.9 95 A250 250 0 0 1 55.7 92.6 L81.8 113.7 A216.5 216.5 0 0 0 80.2 115.7 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#8c130c"/><path d="M83.5 63.5 A250 250 0 0 1 84.6 62.5 L106.8 87.6 A216.5 216.5 0 0 0 105.8 88.5 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#b53121"/><path d="M55.7 92.6 A250 250 0 0 1 57.6 90.3 L83.4 111.7 A216.5 216.5 0 0 0 81.8 113.7 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#8e150d"/><path d="M57.6 90.3 A250 250 0 0 1 59.6 88 L85.1 109.7 A216.5 216.5 0 0 0 83.4 111.7 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#90170f"/><path d="M84.6 62.5 A250 250 0 0 1 85.8 61.5 L107.8 86.8 A216.5 216.5 0 0 0 106.8 87.6 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#b73322"/><path d="M38.4 116.9 A250 250 0 0 1 41.6 111.9 L69.5 130.4 A216.5 216.5 0 0 0 66.7 134.7 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#800705"/><path d="M85.8 61.5 A250 250 0 0 1 86.9 60.5 L108.8 85.9 A216.5 216.5 0 0 0 107.8 86.8 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#b93523"/><path d="M31.5 128.5 A250 250 0 0 1 35.3 122 L64 139.1 A216.5 216.5 0 0 0 60.8 144.7 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#7b0202"/><path d="M59.6 88 A250 250 0 0 1 61.5 85.8 L86.8 107.8 A216.5 216.5 0 0 0 85.1 109.7 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#931910"/><path d="M86.9 60.5 A250 250 0 0 1 88 59.6 L109.7 85.1 A216.5 216.5 0 0 0 108.8 85.9 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#bc3624"/><path d="M41.6 111.9 A250 250 0 0 1 45 106.9 L72.4 126.1 A216.5 216.5 0 0 0 69.5 130.4 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#820906"/><path d="M88 59.6 A250 250 0 0 1 89.2 58.6 L110.7 84.2 A216.5 216.5 0 0 0 109.7 85.1 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#be3826"/><path d="M61.5 85.8 A250 250 0 0 1 63.5 83.5 L88.5 105.8 A216.5 216.5 0 0 0 86.8 107.8 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#951b11"/><path d="M45 106.9 A250 250 0 0 1 48.5 102.1 L75.5 121.9 A216.5 216.5 0 0 0 72.4 126.1 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#850c08"/><path d="M63.5 83.5 A250 250 0 0 1 65.5 81.3 L90.2 103.9 A216.5 216.5 0 0 0 88.5 105.8 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#971d12"/><path d="M89.2 58.6 A250 250 0 0 1 90.3 57.6 L111.7 83.4 A216.5 216.5 0 0 0 110.7 84.2 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#c13a27"/><path d="M65.5 81.3 A250 250 0 0 1 67.5 79.1 L92 102 A216.5 216.5 0 0 0 90.2 103.9 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#9a1e13"/><path d="M67.5 79.1 A250 250 0 0 1 69.6 77 L93.7 100.1 A216.5 216.5 0 0 0 92 102 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#9c2015"/><path d="M48.5 102.1 A250 250 0 0 1 51.1 98.5 L77.8 118.8 A216.5 216.5 0 0 0 75.5 121.9 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#870e09"/><path d="M51.1 98.5 A250 250 0 0 1 53.9 95 L80.2 115.7 A216.5 216.5 0 0 0 77.8 118.8 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#89110b"/><path d="M90.3 57.6 A250 250 0 0 1 91.5 56.7 L112.7 82.6 A216.5 216.5 0 0 0 111.7 83.4 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#c33b28"/><path d="M91.5 56.7 A250 250 0 0 1 92.6 55.7 L113.7 81.8 A216.5 216.5 0 0 0 112.7 82.6 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#c63d29"/><path d="M92.6 55.7 A250 250 0 0 1 93.8 54.8 L114.7 81 A216.5 216.5 0 0 0 113.7 81.8 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#c83f2a"/><path d="M93.8 54.8 A250 250 0 0 1 95 53.9 L115.7 80.2 A216.5 216.5 0 0 0 114.7 81 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#cb402c"/><path d="M95 53.9 A250 250 0 0 1 96.1 53 L116.8 79.4 A216.5 216.5 0 0 0 115.7 80.2 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#cd422d"/><path d="M69.6 77 A250 250 0 0 1 71.6 74.8 L95.5 98.3 A216.5 216.5 0 0 0 93.7 100.1 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#9f2216"/><path d="M96.1 53 A250 250 0 0 1 97.3 52 L117.8 78.6 A216.5 216.5 0 0 0 116.8 79.4 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#d0442e"/><path d="M97.3 52 A250 250 0 0 1 98.5 51.1 L118.8 77.8 A216.5 216.5 0 0 0 117.8 78.6 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#d2452f"/><path d="M98.5 51.1 A250 250 0 0 1 99.7 50.2 L119.8 77 A216.5 216.5 0 0 0 118.8 77.8 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#d54731"/><path d="M99.7 50.2 A250 250 0 0 1 100.9 49.3 L120.9 76.2 A216.5 216.5 0 0 0 119.8 77 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#d74832"/><path d="M100.9 49.3 A250 250 0 0 1 102.1 48.5 L121.9 75.5 A216.5 216.5 0 0 0 120.9 76.2 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#da4a33"/><path d="M102.1 48.5 A250 250 0 0 1 103.3 47.6 L123 74.7 A216.5 216.5 0 0 0 121.9 75.5 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#dc4c35"/><path d="M103.3 47.6 A250 250 0 0 1 104.5 46.7 L124 73.9 A216.5 216.5 0 0 0 123 74.7 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#df4d36"/><path d="M104.5 46.7 A250 250 0 0 1 105.7 45.8 L125.1 73.2 A216.5 216.5 0 0 0 124 73.9 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#e14f37"/><path d="M71.6 74.8 A250 250 0 0 1 73.8 72.7 L97.4 96.5 A216.5 216.5 0 0 0 95.5 98.3 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#a12417"/><path d="M73.8 72.7 A250 250 0 0 1 75.9 70.6 L99.2 94.6 A216.5 216.5 0 0 0 97.4 96.5 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#a32618"/><path d="M105.7 45.8 A250 250 0 0 1 106.9 45 L126.1 72.4 A216.5 216.5 0 0 0 125.1 73.2 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#e45138"/><path d="M75.9 70.6 A250 250 0 0 1 78 68.5 L101.1 92.8 A216.5 216.5 0 0 0 99.2 94.6 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#a62719"/><path d="M151.5 103.2 A176.8 176.8 0 0 1 197 81.4 L212.5 130.8 A125 125 0 0 0 180.3 146.2 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#9467bd"/><path d="M129.3 70.3 A216.5 216.5 0 0 1 159.7 53.2 L176.3 89.3 A176.8 176.8 0 0 0 151.5 103.2 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#643b8c"/><path d="M128.5 31.5 A250 250 0 0 1 131.1 30.1 L147 59.6 A216.5 216.5 0 0 0 144.7 60.8 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#4b2473"/><path d="M110.6 42.4 A250 250 0 0 1 119.4 36.8 L136.9 65.4 A216.5 216.5 0 0 0 129.3 70.3 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#36115e"/><path d="M131.1 30.1 A250 250 0 0 1 133.7 28.7 L149.3 58.3 A216.5 216.5 0 0 0 147 59.6 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#522b7a"/><path d="M139 26 A250 250 0 0 1 140.4 25.3 L155.1 55.4 A216.5 216.5 0 0 0 153.9 56 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#683e90"/><path d="M124.6 33.7 A250 250 0 0 1 128.5 31.5 L144.7 60.8 A216.5 216.5 0 0 0 141.4 62.7 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#441e6c"/><path d="M140.4 25.3 A250 250 0 0 1 141.7 24.7 L156.2 54.9 A216.5 216.5 0 0 0 155.1 55.4 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#6f4597"/><path d="M133.7 28.7 A250 250 0 0 1 136.4 27.3 L151.6 57.2 A216.5 216.5 0 0 0 149.3 58.3 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#593181"/><path d="M136.4 27.3 A250 250 0 0 1 139 26 L153.9 56 A216.5 216.5 0 0 0 151.6 57.2 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#603889"/><path d="M141.7 24.7 A250 250 0 0 1 143.1 24 L157.4 54.3 A216.5 216.5 0 0 0 156.2 54.9 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#764c9f"/><path d="M143.1 24 A250 250 0 0 1 144.4 23.4 L158.6 53.7 A216.5 216.5 0 0 0 157.4 54.3 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#7e52a6"/><path d="M144.4 23.4 A250 250 0 0 1 145.8 22.8 L159.7 53.2 A216.5 216.5 0 0 0 158.6 53.7 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#8559ae"/><path d="M119.4 36.8 A250 250 0 0 1 124.6 33.7 L141.4 62.7 A216.5 216.5 0 0 0 136.9 65.4 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#3d1865"/><path d="M169.2 49.1 A216.5 216.5 0 0 1 176.5 46.4 L190 83.7 A176.8 176.8 0 0 0 184.1 86 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#8458ac"/><path d="M156.7 18 A250 250 0 0 1 158.1 17.5 L170.4 48.6 A216.5 216.5 0 0 0 169.2 49.1 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#552d7c"/><path d="M158.1 17.5 A250 250 0 0 1 159.5 16.9 L171.6 48.2 A216.5 216.5 0 0 0 170.4 48.6 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#623989"/><path d="M159.5 16.9 A250 250 0 0 1 160.9 16.4 L172.9 47.7 A216.5 216.5 0 0 0 171.6 48.2 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#704597"/><path d="M160.9 16.4 A250 250 0 0 1 162.3 15.9 L174.1 47.2 A216.5 216.5 0 0 0 172.9 47.7 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#7d52a5"/><path d="M162.3 15.9 A250 250 0 0 1 163.7 15.4 L175.3 46.8 A216.5 216.5 0 0 0 174.1 47.2 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#8b5fb3"/><path d="M163.7 15.4 A250 250 0 0 1 165.1 14.9 L176.5 46.4 A216.5 216.5 0 0 0 175.3 46.8 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#996bc1"/><path d="M176.5 46.4 A216.5 216.5 0 0 1 183.8 43.9 L196 81.7 A176.8 176.8 0 0 0 190 83.7 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#9467bd"/><path d="M165.1 14.9 A250 250 0 0 1 166.5 14.3 L177.7 45.9 A216.5 216.5 0 0 0 176.5 46.4 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#643b8c"/><path d="M166.5 14.3 A250 250 0 0 1 167.9 13.9 L178.9 45.5 A216.5 216.5 0 0 0 177.7 45.9 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#71479a"/><path d="M167.9 13.9 A250 250 0 0 1 169.3 13.4 L180.2 45.1 A216.5 216.5 0 0 0 178.9 45.5 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#7f54a8"/><path d="M169.3 13.4 A250 250 0 0 1 170.8 12.9 L181.4 44.7 A216.5 216.5 0 0 0 180.2 45.1 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#8d61b6"/><path d="M170.8 12.9 A250 250 0 0 1 172.2 12.4 L182.6 44.3 A216.5 216.5 0 0 0 181.4 44.7 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#9b6ec4"/><path d="M172.2 12.4 A250 250 0 0 1 173.6 12 L183.8 43.9 A216.5 216.5 0 0 0 182.6 44.3 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#a97bd3"/><path d="M183.8 43.9 A216.5 216.5 0 0 1 185.1 43.5 L197 81.4 A176.8 176.8 0 0 0 196 81.7 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#a476ce"/><path d="M173.6 12 A250 250 0 0 1 175 11.5 L185.1 43.5 A216.5 216.5 0 0 0 183.8 43.9 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#73499d"/><path d="M159.7 53.2 A216.5 216.5 0 0 1 169.2 49.1 L184.1 86 A176.8 176.8 0 0 0 176.3 89.3 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#74499c"/><path d="M151.2 20.3 A250 250 0 0 1 152.6 19.8 L165.7 50.6 A216.5 216.5 0 0 0 164.5 51.1 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#603787"/><path d="M152.6 19.8 A250 250 0 0 1 154 19.2 L166.8 50.1 A216.5 216.5 0 0 0 165.7 50.6 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#6d4395"/><path d="M145.8 22.8 A250 250 0 0 1 148.5 21.5 L162.1 52.1 A216.5 216.5 0 0 0 159.7 53.2 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#451f6d"/><path d="M148.5 21.5 A250 250 0 0 1 151.2 20.3 L164.5 51.1 A216.5 216.5 0 0 0 162.1 52.1 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#522b7a"/><path d="M154 19.2 A250 250 0 0 1 155.4 18.6 L168 49.6 A216.5 216.5 0 0 0 166.8 50.1 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#7b4fa3"/><path d="M155.4 18.6 A250 250 0 0 1 156.7 18 L169.2 49.1 A216.5 216.5 0 0 0 168 49.6 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#895cb1"/><path d="M239.4 73.5 A176.8 176.8 0 0 1 250 73.2 L250 125 A125 125 0 0 0 242.5 125.2 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#7f7f7f"/><path d="M237.1 33.9 A216.5 216.5 0 0 1 243.5 33.6 L244.7 73.3 A176.8 176.8 0 0 0 239.4 73.5 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#535353"/><path d="M235.1 0.4 A250 250 0 0 1 238.1 0.3 L239.7 33.7 A216.5 216.5 0 0 0 237.1 33.9 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#2b2b2b"/><path d="M238.1 0.3 A250 250 0 0 1 239.6 0.2 L241 33.7 A216.5 216.5 0 0 0 239.7 33.7 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#3b3b3b"/><path d="M239.6 0.2 A250 250 0 0 1 241 0.2 L242.2 33.6 A216.5 216.5 0 0 0 241 33.7 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#4b4b4b"/><path d="M241 0.2 A250 250 0 0 1 242.5 0.1 L243.5 33.6 A216.5 216.5 0 0 0 242.2 33.6 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#5c5c5c"/><path d="M243.5 33.6 A216.5 216.5 0 0 1 247.4 33.5 L247.9 73.2 A176.8 176.8 0 0 0 244.7 73.3 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#696969"/><path d="M242.5 0.1 A250 250 0 0 1 244 0.1 L244.8 33.6 A216.5 216.5 0 0 0 243.5 33.6 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#3e3e3e"/><path d="M244 0.1 A250 250 0 0 1 245.5 0 L246.1 33.5 A216.5 216.5 0 0 0 244.8 33.6 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#535353"/><path d="M245.5 0 A250 250 0 0 1 247 0 L247.4 33.5 A216.5 216.5 0 0 0 246.1 33.5 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#696969"/><path d="M247.4 33.5 A216.5 216.5 0 0 1 250 33.5 L250 73.2 A176.8 176.8 0 0 0 247.9 73.2 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#7f7f7f"/><path d="M247 0 A250 250 0 0 1 248.5 0 L248.7 33.5 A216.5 216.5 0 0 0 247.4 33.5 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#535353"/><path d="M248.5 0 A250 250 0 0 1 250 0 L250 33.5 A216.5 216.5 0 0 0 248.7 33.5 Z" stroke="#fff" fill-rule="evenodd" fill-opacity="0.2" fill="#707070"/></g>
</svg>
<figcaption>The state of Kentucky is in the upper right of the visualization.</figcaption>
</figure>

The data value associated with this <span class="smcp">SVG</span> `<path>` will have properties calculated by the partition layout, specifically:

* an `x` value of 0.051330798479087454
* a `y` value of 0.5
* a `dx` value of 0.04182509505703422
* a `dy` value of 0.25

In terms of our visualization, the area begins at an angular position of 18.479° (`x`) and continues for another 15.057° (`dx`). It’s innermost radius begins 177 pixels (`y`) from the center. When the user clicks on Kentucky, we want to zoom the visualization to focus on Kentucky and its counties. That’s the region that figure NEXTFIGURENUMBER highlights. The angle begins at 18.479° and continues for another 15.057°; the radius begins at 177 pixels and continues to the `maxRadius` value, a total length of 73 pixels.

<figure>
<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0" y="0" width="640" height="500" viewBox="0, 0, 640, 500">
<g id="Layer_1">
<g>
<path d="M250,375 C180.964,375 125,319.036 125,250 C125,180.964 180.964,125 250,125 C319.036,125 375,180.964 375,250 C375,319.036 319.036,375 250,375 z" fill="#FFFFFF" fill-opacity="0.2"/>
<path d="M250,375 C180.964,375 125,319.036 125,250 C125,180.964 180.964,125 250,125 C319.036,125 375,180.964 375,250 C375,319.036 319.036,375 250,375 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M228.9,74.5 C232.389,74.062 235.891,73.729 239.4,73.5 L242.5,125.2 C240.027,125.36 237.559,125.593 235.1,125.9 z" fill="#E377C2" fill-opacity="0.2"/>
<path d="M228.9,74.5 C232.389,74.062 235.891,73.729 239.4,73.5 L242.5,125.2 C240.027,125.36 237.559,125.593 235.1,125.9 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M224.2,35 C225.898,34.813 227.598,34.647 229.3,34.5 L233.1,74 C231.698,74.15 230.298,74.317 228.9,74.5 z" fill="#AF4791" fill-opacity="0.2"/>
<path d="M224.2,35 C225.898,34.813 227.598,34.647 229.3,34.5 L233.1,74 C231.698,74.15 230.298,74.317 228.9,74.5 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M223.2,1.4 C223.7,1.365 224.2,1.332 224.7,1.3 L228.1,34.6 C227.667,34.632 227.233,34.665 226.8,34.7 z" fill="#962E79" fill-opacity="0.2"/>
<path d="M223.2,1.4 C223.7,1.365 224.2,1.332 224.7,1.3 L228.1,34.6 C227.667,34.632 227.233,34.665 226.8,34.7 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M220.2,1.8 C221.199,1.661 222.199,1.527 223.2,1.4 L226.8,34.7 C225.933,34.795 225.066,34.895 224.2,35 z" fill="#7D1163" fill-opacity="0.2"/>
<path d="M220.2,1.8 C221.199,1.661 222.199,1.527 223.2,1.4 L226.8,34.7 C225.933,34.795 225.066,34.895 224.2,35 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M224.7,1.3 C225.166,1.232 225.633,1.165 226.1,1.1 L229.3,34.5 C228.9,34.532 228.5,34.566 228.1,34.6 z" fill="#AF4791" fill-opacity="0.2"/>
<path d="M224.7,1.3 C225.166,1.232 225.633,1.165 226.1,1.1 L229.3,34.5 C228.9,34.532 228.5,34.566 228.1,34.6 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M229.3,34.5 C231.031,34.312 232.765,34.146 234.5,34 L237.3,73.7 C235.899,73.783 234.499,73.883 233.1,74 z" fill="#C35FA9" fill-opacity="0.2"/>
<path d="M229.3,34.5 C231.031,34.312 232.765,34.146 234.5,34 L237.3,73.7 C235.899,73.783 234.499,73.883 233.1,74 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M229.1,0.9 C229.6,0.865 230.1,0.832 230.6,0.8 L233.2,34.1 C232.766,34.165 232.333,34.232 231.9,34.3 z" fill="#A94791" fill-opacity="0.2"/>
<path d="M229.1,0.9 C229.6,0.865 230.1,0.832 230.6,0.8 L233.2,34.1 C232.766,34.165 232.333,34.232 231.9,34.3 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M230.6,0.8 C231.1,0.732 231.6,0.665 232.1,0.6 L234.5,34 C234.067,34.032 233.633,34.065 233.2,34.1 z" fill="#C35FA9" fill-opacity="0.2"/>
<path d="M230.6,0.8 C231.1,0.732 231.6,0.665 232.1,0.6 L234.5,34 C234.067,34.032 233.633,34.065 233.2,34.1 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M226.1,1.1 C227.1,1.027 228.1,0.961 229.1,0.9 L231.9,34.3 C231.033,34.361 230.166,34.428 229.3,34.5 z" fill="#902F7A" fill-opacity="0.2"/>
<path d="M226.1,1.1 C227.1,1.027 228.1,0.961 229.1,0.9 L231.9,34.3 C231.033,34.361 230.166,34.428 229.3,34.5 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M234.5,34 C235.366,33.961 236.233,33.928 237.1,33.9 L239.4,73.5 C238.7,73.562 238,73.629 237.3,73.7 z" fill="#D777C2" fill-opacity="0.2"/>
<path d="M234.5,34 C235.366,33.961 236.233,33.928 237.1,33.9 L239.4,73.5 C238.7,73.562 238,73.629 237.3,73.7 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M232.1,0.6 C232.6,0.565 233.1,0.532 233.6,0.5 L235.8,34 C235.367,33.999 234.933,33.999 234.5,34 z" fill="#A44891" fill-opacity="0.2"/>
<path d="M232.1,0.6 C232.6,0.565 233.1,0.532 233.6,0.5 L235.8,34 C235.367,33.999 234.933,33.999 234.5,34 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M233.6,0.5 C234.1,0.465 234.6,0.432 235.1,0.4 L237.1,33.9 C236.667,33.932 236.233,33.965 235.8,34 z" fill="#C268B1" fill-opacity="0.2"/>
<path d="M233.6,0.5 C234.1,0.465 234.6,0.432 235.1,0.4 L237.1,33.9 C236.667,33.932 236.233,33.965 235.8,34 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M197,81.4 C207.398,78.121 218.077,75.812 228.9,74.5 L235.1,125.9 C227.431,126.831 219.866,128.472 212.5,130.8 z" fill="#8C564B" fill-opacity="0.2"/>
<path d="M197,81.4 C207.398,78.121 218.077,75.812 228.9,74.5 L235.1,125.9 C227.431,126.831 219.866,128.472 212.5,130.8 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M222.9,35.2 C223.333,35.132 223.766,35.065 224.2,35 L228.9,74.5 C228.567,74.532 228.233,74.566 227.9,74.6 z" fill="#9C6559" fill-opacity="0.2"/>
<path d="M222.9,35.2 C223.333,35.132 223.766,35.065 224.2,35 L228.9,74.5 C228.567,74.532 228.233,74.566 227.9,74.6 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M218.7,2 C219.2,1.932 219.7,1.865 220.2,1.8 L224.2,35 C223.766,35.065 223.333,35.132 222.9,35.2 z" fill="#6C3A30" fill-opacity="0.2"/>
<path d="M218.7,2 C219.2,1.932 219.7,1.865 220.2,1.8 L224.2,35 C223.766,35.065 223.333,35.132 222.9,35.2 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M185.1,43.5 C189.198,42.211 193.333,41.043 197.5,40 L207.1,78.5 C203.705,79.366 200.337,80.333 197,81.4 z" fill="#5C2C23" fill-opacity="0.2"/>
<path d="M185.1,43.5 C189.198,42.211 193.333,41.043 197.5,40 L207.1,78.5 C203.705,79.366 200.337,80.333 197,81.4 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M179.3,10.2 C180.265,9.928 181.232,9.661 182.2,9.4 L191.3,41.6 C190.465,41.828 189.632,42.062 188.8,42.3 z" fill="#3F1212" fill-opacity="0.2"/>
<path d="M179.3,10.2 C180.265,9.928 181.232,9.661 182.2,9.4 L191.3,41.6 C190.465,41.828 189.632,42.062 188.8,42.3 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M182.2,9.4 C183.165,9.128 184.132,8.861 185.1,8.6 L193.8,40.9 C192.965,41.128 192.132,41.362 191.3,41.6 z" fill="#4D1F1D" fill-opacity="0.2"/>
<path d="M182.2,9.4 C183.165,9.128 184.132,8.861 185.1,8.6 L193.8,40.9 C192.965,41.128 192.132,41.362 191.3,41.6 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M175,11.5 C176.429,11.054 177.863,10.62 179.3,10.2 L188.8,42.3 C187.563,42.689 186.33,43.089 185.1,43.5 z" fill="#310400" fill-opacity="0.2"/>
<path d="M175,11.5 C176.429,11.054 177.863,10.62 179.3,10.2 L188.8,42.3 C187.563,42.689 186.33,43.089 185.1,43.5 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M187.9,7.8 C188.4,7.698 188.9,7.598 189.4,7.5 L197.5,40 C197.1,40.099 196.7,40.199 196.3,40.3 z" fill="#6C3A33" fill-opacity="0.2"/>
<path d="M187.9,7.8 C188.4,7.698 188.9,7.598 189.4,7.5 L197.5,40 C197.1,40.099 196.7,40.199 196.3,40.3 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M185.1,8.6 C186.032,8.328 186.965,8.061 187.9,7.8 L196.3,40.3 C195.465,40.495 194.632,40.695 193.8,40.9 z" fill="#5D2C28" fill-opacity="0.2"/>
<path d="M185.1,8.6 C186.032,8.328 186.965,8.061 187.9,7.8 L196.3,40.3 C195.465,40.495 194.632,40.695 193.8,40.9 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M219.1,35.7 C220.365,35.522 221.632,35.355 222.9,35.2 L227.9,74.6 C226.832,74.724 225.765,74.857 224.7,75 z" fill="#8C564B" fill-opacity="0.2"/>
<path d="M219.1,35.7 C220.365,35.522 221.632,35.355 222.9,35.2 L227.9,74.6 C226.832,74.724 225.765,74.857 224.7,75 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M214.3,2.6 C214.8,2.532 215.3,2.465 215.8,2.4 L220.4,35.5 C219.966,35.565 219.533,35.632 219.1,35.7 z" fill="#5C2C23" fill-opacity="0.2"/>
<path d="M214.3,2.6 C214.8,2.532 215.3,2.465 215.8,2.4 L220.4,35.5 C219.966,35.565 219.533,35.632 219.1,35.7 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M215.8,2.4 C216.266,2.332 216.733,2.265 217.2,2.2 L221.6,35.4 C221.2,35.432 220.8,35.466 220.4,35.5 z" fill="#744136" fill-opacity="0.2"/>
<path d="M215.8,2.4 C216.266,2.332 216.733,2.265 217.2,2.2 L221.6,35.4 C221.2,35.432 220.8,35.466 220.4,35.5 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M217.2,2.2 C217.7,2.132 218.2,2.065 218.7,2 L222.9,35.2 C222.466,35.265 222.033,35.332 221.6,35.4 z" fill="#8C564B" fill-opacity="0.2"/>
<path d="M217.2,2.2 C217.7,2.132 218.2,2.065 218.7,2 L222.9,35.2 C222.466,35.265 222.033,35.332 221.6,35.4 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M208.9,37.4 C212.286,36.752 215.687,36.185 219.1,35.7 L224.7,75 C221.923,75.401 219.155,75.868 216.4,76.4 z" fill="#7C483D" fill-opacity="0.2"/>
<path d="M208.9,37.4 C212.286,36.752 215.687,36.185 219.1,35.7 L224.7,75 C221.923,75.401 219.155,75.868 216.4,76.4 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M202.5,4.6 C203,4.498 203.5,4.398 204,4.3 L210.1,37.2 C209.7,37.266 209.3,37.332 208.9,37.4 z" fill="#4D1F17" fill-opacity="0.2"/>
<path d="M202.5,4.6 C203,4.498 203.5,4.398 204,4.3 L210.1,37.2 C209.7,37.266 209.3,37.332 208.9,37.4 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M204,4.3 C204.466,4.199 204.933,4.099 205.4,4 L211.4,37 C210.966,37.065 210.533,37.132 210.1,37.2 z" fill="#57281F" fill-opacity="0.2"/>
<path d="M204,4.3 C204.466,4.199 204.933,4.099 205.4,4 L211.4,37 C210.966,37.065 210.533,37.132 210.1,37.2 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M205.4,4 C205.9,3.898 206.4,3.798 206.9,3.7 L212.7,36.7 C212.266,36.799 211.833,36.899 211.4,37 z" fill="#623127" fill-opacity="0.2"/>
<path d="M205.4,4 C205.9,3.898 206.4,3.798 206.9,3.7 L212.7,36.7 C212.266,36.799 211.833,36.899 211.4,37 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M206.9,3.7 C207.4,3.632 207.9,3.565 208.4,3.5 L214,36.5 C213.566,36.565 213.133,36.632 212.7,36.7 z" fill="#6C3A30" fill-opacity="0.2"/>
<path d="M206.9,3.7 C207.4,3.632 207.9,3.565 208.4,3.5 L214,36.5 C213.566,36.565 213.133,36.632 212.7,36.7 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M208.4,3.5 C208.9,3.398 209.4,3.298 209.9,3.2 L215.2,36.3 C214.8,36.366 214.4,36.432 214,36.5 z" fill="#774339" fill-opacity="0.2"/>
<path d="M208.4,3.5 C208.9,3.398 209.4,3.298 209.9,3.2 L215.2,36.3 C214.8,36.366 214.4,36.432 214,36.5 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M209.9,3.2 C210.366,3.132 210.833,3.065 211.3,3 L216.5,36.1 C216.066,36.165 215.633,36.232 215.2,36.3 z" fill="#814D42" fill-opacity="0.2"/>
<path d="M209.9,3.2 C210.366,3.132 210.833,3.065 211.3,3 L216.5,36.1 C216.066,36.165 215.633,36.232 215.2,36.3 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M211.3,3 C211.8,2.932 212.3,2.865 212.8,2.8 L217.8,35.9 C217.366,35.965 216.933,36.032 216.5,36.1 z" fill="#8C564B" fill-opacity="0.2"/>
<path d="M211.3,3 C211.8,2.932 212.3,2.865 212.8,2.8 L217.8,35.9 C217.366,35.965 216.933,36.032 216.5,36.1 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M212.8,2.8 C213.3,2.732 213.8,2.665 214.3,2.6 L219.1,35.7 C218.666,35.765 218.233,35.832 217.8,35.9 z" fill="#976055" fill-opacity="0.2"/>
<path d="M212.8,2.8 C213.3,2.732 213.8,2.665 214.3,2.6 L219.1,35.7 C218.666,35.765 218.233,35.832 217.8,35.9 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M197.5,40 C201.276,39.031 205.077,38.164 208.9,37.4 L216.4,76.4 C213.282,77.016 210.181,77.717 207.1,78.5 z" fill="#6C3A30" fill-opacity="0.2"/>
<path d="M197.5,40 C201.276,39.031 205.077,38.164 208.9,37.4 L216.4,76.4 C213.282,77.016 210.181,77.717 207.1,78.5 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M189.4,7.5 C190.365,7.261 191.332,7.028 192.3,6.8 L200,39.3 C199.165,39.528 198.332,39.762 197.5,40 z" fill="#3E1208" fill-opacity="0.2"/>
<path d="M189.4,7.5 C190.365,7.261 191.332,7.028 192.3,6.8 L200,39.3 C199.165,39.528 198.332,39.762 197.5,40 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M192.3,6.8 C193.265,6.561 194.232,6.328 195.2,6.1 L202.5,38.8 C201.666,38.962 200.832,39.128 200,39.3 z" fill="#491C14" fill-opacity="0.2"/>
<path d="M192.3,6.8 C193.265,6.561 194.232,6.328 195.2,6.1 L202.5,38.8 C201.666,38.962 200.832,39.128 200,39.3 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M195.2,6.1 C195.7,5.998 196.2,5.898 196.7,5.8 L203.8,38.5 C203.366,38.599 202.933,38.699 202.5,38.8 z" fill="#55261D" fill-opacity="0.2"/>
<path d="M195.2,6.1 C195.7,5.998 196.2,5.898 196.7,5.8 L203.8,38.5 C203.366,38.599 202.933,38.699 202.5,38.8 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M196.7,5.8 C197.166,5.665 197.633,5.532 198.1,5.4 L205.1,38.2 C204.666,38.299 204.233,38.399 203.8,38.5 z" fill="#603026" fill-opacity="0.2"/>
<path d="M196.7,5.8 C197.166,5.665 197.633,5.532 198.1,5.4 L205.1,38.2 C204.666,38.299 204.233,38.399 203.8,38.5 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M198.1,5.4 C198.6,5.298 199.1,5.198 199.6,5.1 L206.3,37.9 C205.9,37.999 205.5,38.099 205.1,38.2 z" fill="#6C3A30" fill-opacity="0.2"/>
<path d="M198.1,5.4 C198.6,5.298 199.1,5.198 199.6,5.1 L206.3,37.9 C205.9,37.999 205.5,38.099 205.1,38.2 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M199.6,5.1 C200.066,4.999 200.533,4.899 201,4.8 L207.6,37.7 C207.166,37.765 206.733,37.832 206.3,37.9 z" fill="#78443A" fill-opacity="0.2"/>
<path d="M199.6,5.1 C200.066,4.999 200.533,4.899 201,4.8 L207.6,37.7 C207.166,37.765 206.733,37.832 206.3,37.9 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M201,4.8 C201.5,4.732 202,4.665 202.5,4.6 L208.9,37.4 C208.466,37.499 208.033,37.599 207.6,37.7 z" fill="#844F44" fill-opacity="0.2"/>
<path d="M201,4.8 C201.5,4.732 202,4.665 202.5,4.6 L208.9,37.4 C208.466,37.499 208.033,37.599 207.6,37.7 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M202,420.1 C132.949,400.595 82.534,341.291 74.4,270 L125.8,264.2 C131.572,314.618 167.254,356.542 216.1,370.3 z" fill="#2CA02C" fill-opacity="0.2"/>
<path d="M202,420.1 C132.949,400.595 82.534,341.291 74.4,270 L125.8,264.2 C131.572,314.618 167.254,356.542 216.1,370.3 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M191.3,458.4 C161.714,450.082 134.239,435.56 110.7,415.8 L136.3,385.3 C155.486,401.426 177.881,413.288 202,420.1 z" fill="#007000" fill-opacity="0.2"/>
<path d="M191.3,458.4 C161.714,450.082 134.239,435.56 110.7,415.8 L136.3,385.3 C155.486,401.426 177.881,413.288 202,420.1 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M119.4,463.2 C118.999,462.934 118.599,462.668 118.2,462.4 L135.8,434 C136.166,434.201 136.533,434.401 136.9,434.6 z" fill="#1F6917" fill-opacity="0.2"/>
<path d="M119.4,463.2 C118.999,462.934 118.599,462.668 118.2,462.4 L135.8,434 C136.166,434.201 136.533,434.401 136.9,434.6 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M159.5,483.1 C158.564,482.739 157.631,482.372 156.7,482 L169.2,450.9 C169.998,451.205 170.798,451.505 171.6,451.8 z" fill="#074C05" fill-opacity="0.2"/>
<path d="M159.5,483.1 C158.564,482.739 157.631,482.372 156.7,482 L169.2,450.9 C169.998,451.205 170.798,451.505 171.6,451.8 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M118.2,462.4 C117.766,462.135 117.333,461.868 116.9,461.6 L134.7,433.3 C135.066,433.534 135.433,433.768 135.8,434 z" fill="#216B18" fill-opacity="0.2"/>
<path d="M118.2,462.4 C117.766,462.135 117.333,461.868 116.9,461.6 L134.7,433.3 C135.066,433.534 135.433,433.768 135.8,434 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M156.7,482 C155.798,481.605 154.898,481.205 154,480.8 L166.8,449.9 C167.598,450.238 168.398,450.571 169.2,450.9 z" fill="#094E06" fill-opacity="0.2"/>
<path d="M156.7,482 C155.798,481.605 154.898,481.205 154,480.8 L166.8,449.9 C167.598,450.238 168.398,450.571 169.2,450.9 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M154,480.8 C153.064,480.439 152.131,480.072 151.2,479.7 L164.5,448.9 C165.265,449.238 166.031,449.571 166.8,449.9 z" fill="#0A5007" fill-opacity="0.2"/>
<path d="M154,480.8 C153.064,480.439 152.131,480.072 151.2,479.7 L164.5,448.9 C165.265,449.238 166.031,449.571 166.8,449.9 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M176.4,488.9 C174.996,488.479 173.596,488.046 172.2,487.6 L182.6,455.7 C183.83,456.111 185.063,456.511 186.3,456.9 z" fill="#014501" fill-opacity="0.2"/>
<path d="M176.4,488.9 C174.996,488.479 173.596,488.046 172.2,487.6 L182.6,455.7 C183.83,456.111 185.063,456.511 186.3,456.9 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M151.2,479.7 C150.298,479.305 149.398,478.905 148.5,478.5 L162.1,447.9 C162.898,448.238 163.698,448.571 164.5,448.9 z" fill="#0C5208" fill-opacity="0.2"/>
<path d="M151.2,479.7 C150.298,479.305 149.398,478.905 148.5,478.5 L162.1,447.9 C162.898,448.238 163.698,448.571 164.5,448.9 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M116.9,461.6 C116.466,461.335 116.033,461.068 115.6,460.8 L133.6,432.6 C133.966,432.834 134.333,433.068 134.7,433.3 z" fill="#226D19" fill-opacity="0.2"/>
<path d="M116.9,461.6 C116.466,461.335 116.033,461.068 115.6,460.8 L133.6,432.6 C133.966,432.834 134.333,433.068 134.7,433.3 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M115.6,460.8 C115.199,460.534 114.799,460.268 114.4,460 L132.6,431.9 C132.933,432.134 133.266,432.368 133.6,432.6 z" fill="#246F1A" fill-opacity="0.2"/>
<path d="M115.6,460.8 C115.199,460.534 114.799,460.268 114.4,460 L132.6,431.9 C132.933,432.134 133.266,432.368 133.6,432.6 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M114.4,460 C113.966,459.735 113.533,459.468 113.1,459.2 L131.5,431.2 C131.866,431.434 132.233,431.668 132.6,431.9 z" fill="#25711C" fill-opacity="0.2"/>
<path d="M114.4,460 C113.966,459.735 113.533,459.468 113.1,459.2 L131.5,431.2 C131.866,431.434 132.233,431.668 132.6,431.9 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M148.5,478.5 C147.597,478.072 146.697,477.639 145.8,477.2 L159.7,446.8 C160.498,447.172 161.298,447.538 162.1,447.9 z" fill="#0E5409" fill-opacity="0.2"/>
<path d="M148.5,478.5 C147.597,478.072 146.697,477.639 145.8,477.2 L159.7,446.8 C160.498,447.172 161.298,447.538 162.1,447.9 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M113.1,459.2 C112.699,458.934 112.299,458.668 111.9,458.4 L130.4,430.5 C130.766,430.734 131.133,430.968 131.5,431.2 z" fill="#27731D" fill-opacity="0.2"/>
<path d="M113.1,459.2 C112.699,458.934 112.299,458.668 111.9,458.4 L130.4,430.5 C130.766,430.734 131.133,430.968 131.5,431.2 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M172.2,487.6 C170.762,487.113 169.329,486.613 167.9,486.1 L178.9,454.5 C180.13,454.911 181.363,455.311 182.6,455.7 z" fill="#024702" fill-opacity="0.2"/>
<path d="M172.2,487.6 C170.762,487.113 169.329,486.613 167.9,486.1 L178.9,454.5 C180.13,454.911 181.363,455.311 182.6,455.7 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M111.9,458.4 C111.466,458.135 111.033,457.868 110.6,457.6 L129.3,429.7 C129.666,429.968 130.033,430.234 130.4,430.5 z" fill="#28751E" fill-opacity="0.2"/>
<path d="M111.9,458.4 C111.466,458.135 111.033,457.868 110.6,457.6 L129.3,429.7 C129.666,429.968 130.033,430.234 130.4,430.5 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M110.6,457.6 C110.199,457.301 109.799,457.001 109.4,456.7 L128.2,429 C128.566,429.234 128.933,429.468 129.3,429.7 z" fill="#2A771F" fill-opacity="0.2"/>
<path d="M110.6,457.6 C110.199,457.301 109.799,457.001 109.4,456.7 L128.2,429 C128.566,429.234 128.933,429.468 129.3,429.7 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M182.2,490.6 C180.26,490.057 178.326,489.49 176.4,488.9 L186.3,456.9 C187.961,457.42 189.627,457.92 191.3,458.4 z" fill="#004300" fill-opacity="0.2"/>
<path d="M182.2,490.6 C180.26,490.057 178.326,489.49 176.4,488.9 L186.3,456.9 C187.961,457.42 189.627,457.92 191.3,458.4 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M109.4,456.7 C108.999,456.434 108.599,456.168 108.2,455.9 L127.2,428.3 C127.533,428.534 127.866,428.768 128.2,429 z" fill="#2B7920" fill-opacity="0.2"/>
<path d="M109.4,456.7 C108.999,456.434 108.599,456.168 108.2,455.9 L127.2,428.3 C127.533,428.534 127.866,428.768 128.2,429 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M108.2,455.9 C107.766,455.601 107.332,455.301 106.9,455 L126.1,427.6 C126.466,427.834 126.833,428.068 127.2,428.3 z" fill="#2D7B22" fill-opacity="0.2"/>
<path d="M108.2,455.9 C107.766,455.601 107.332,455.301 106.9,455 L126.1,427.6 C126.466,427.834 126.833,428.068 127.2,428.3 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M106.9,455 C106.499,454.734 106.099,454.468 105.7,454.2 L125.1,426.8 C125.433,427.068 125.766,427.334 126.1,427.6 z" fill="#2E7E23" fill-opacity="0.2"/>
<path d="M106.9,455 C106.499,454.734 106.099,454.468 105.7,454.2 L125.1,426.8 C125.433,427.068 125.766,427.334 126.1,427.6 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M105.7,454.2 C105.299,453.901 104.899,453.601 104.5,453.3 L124,426.1 C124.366,426.334 124.733,426.568 125.1,426.8 z" fill="#308024" fill-opacity="0.2"/>
<path d="M105.7,454.2 C105.299,453.901 104.899,453.601 104.5,453.3 L124,426.1 C124.366,426.334 124.733,426.568 125.1,426.8 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M145.8,477.2 C144.898,476.805 143.998,476.405 143.1,476 L157.4,445.7 C158.165,446.071 158.931,446.438 159.7,446.8 z" fill="#10560B" fill-opacity="0.2"/>
<path d="M145.8,477.2 C144.898,476.805 143.998,476.405 143.1,476 L157.4,445.7 C158.165,446.071 158.931,446.438 159.7,446.8 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M167.9,486.1 C166.496,485.613 165.096,485.112 163.7,484.6 L175.3,453.2 C176.496,453.644 177.696,454.077 178.9,454.5 z" fill="#044903" fill-opacity="0.2"/>
<path d="M167.9,486.1 C166.496,485.613 165.096,485.112 163.7,484.6 L175.3,453.2 C176.496,453.644 177.696,454.077 178.9,454.5 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M143.1,476 C142.197,475.572 141.297,475.139 140.4,474.7 L155.1,444.6 C155.865,444.971 156.631,445.338 157.4,445.7 z" fill="#11580C" fill-opacity="0.2"/>
<path d="M143.1,476 C142.197,475.572 141.297,475.139 140.4,474.7 L155.1,444.6 C155.865,444.971 156.631,445.338 157.4,445.7 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M140.4,474.7 C139.497,474.272 138.597,473.839 137.7,473.4 L152.7,443.4 C153.498,443.805 154.298,444.205 155.1,444.6 z" fill="#135A0D" fill-opacity="0.2"/>
<path d="M140.4,474.7 C139.497,474.272 138.597,473.839 137.7,473.4 L152.7,443.4 C153.498,443.805 154.298,444.205 155.1,444.6 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M104.5,453.3 C104.099,453.001 103.699,452.701 103.3,452.4 L123,425.3 C123.333,425.568 123.666,425.834 124,426.1 z" fill="#318225" fill-opacity="0.2"/>
<path d="M104.5,453.3 C104.099,453.001 103.699,452.701 103.3,452.4 L123,425.3 C123.333,425.568 123.666,425.834 124,426.1 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M103.3,452.4 C102.899,452.101 102.499,451.801 102.1,451.5 L121.9,424.5 C122.266,424.768 122.632,425.034 123,425.3 z" fill="#338426" fill-opacity="0.2"/>
<path d="M103.3,452.4 C102.899,452.101 102.499,451.801 102.1,451.5 L121.9,424.5 C122.266,424.768 122.632,425.034 123,425.3 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M102.1,451.5 C101.699,451.234 101.299,450.968 100.9,450.7 L120.9,423.8 C121.233,424.034 121.566,424.268 121.9,424.5 z" fill="#348628" fill-opacity="0.2"/>
<path d="M102.1,451.5 C101.699,451.234 101.299,450.968 100.9,450.7 L120.9,423.8 C121.233,424.034 121.566,424.268 121.9,424.5 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M100.9,450.7 C100.499,450.401 100.099,450.101 99.7,449.8 L119.8,423 C120.166,423.268 120.533,423.534 120.9,423.8 z" fill="#368829" fill-opacity="0.2"/>
<path d="M100.9,450.7 C100.499,450.401 100.099,450.101 99.7,449.8 L119.8,423 C120.166,423.268 120.533,423.534 120.9,423.8 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M137.7,473.4 C136.797,472.939 135.897,472.472 135,472 L150.4,442.3 C151.165,442.671 151.931,443.038 152.7,443.4 z" fill="#155C0E" fill-opacity="0.2"/>
<path d="M137.7,473.4 C136.797,472.939 135.897,472.472 135,472 L150.4,442.3 C151.165,442.671 151.931,443.038 152.7,443.4 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M99.7,449.8 C99.299,449.501 98.899,449.201 98.5,448.9 L118.8,422.2 C119.133,422.468 119.466,422.734 119.8,423 z" fill="#378A2A" fill-opacity="0.2"/>
<path d="M99.7,449.8 C99.299,449.501 98.899,449.201 98.5,448.9 L118.8,422.2 C119.133,422.468 119.466,422.734 119.8,423 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M135,472 C134.131,471.538 133.264,471.072 132.4,470.6 L148.2,441.1 C148.931,441.504 149.664,441.904 150.4,442.3 z" fill="#165E10" fill-opacity="0.2"/>
<path d="M135,472 C134.131,471.538 133.264,471.072 132.4,470.6 L148.2,441.1 C148.931,441.504 149.664,441.904 150.4,442.3 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M132.4,470.6 C131.531,470.138 130.664,469.672 129.8,469.2 L145.9,439.8 C146.664,440.238 147.431,440.671 148.2,441.1 z" fill="#186011" fill-opacity="0.2"/>
<path d="M132.4,470.6 C131.531,470.138 130.664,469.672 129.8,469.2 L145.9,439.8 C146.664,440.238 147.431,440.671 148.2,441.1 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M129.8,469.2 C128.93,468.705 128.064,468.205 127.2,467.7 L143.6,438.6 C144.364,439.005 145.131,439.405 145.9,439.8 z" fill="#196112" fill-opacity="0.2"/>
<path d="M129.8,469.2 C128.93,468.705 128.064,468.205 127.2,467.7 L143.6,438.6 C144.364,439.005 145.131,439.405 145.9,439.8 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M98.5,448.9 C98.099,448.601 97.699,448.301 97.3,448 L117.8,421.4 C118.133,421.668 118.466,421.934 118.8,422.2 z" fill="#398C2B" fill-opacity="0.2"/>
<path d="M98.5,448.9 C98.099,448.601 97.699,448.301 97.3,448 L117.8,421.4 C118.133,421.668 118.466,421.934 118.8,422.2 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M97.3,448 C96.899,447.668 96.499,447.335 96.1,447 L116.8,420.6 C117.133,420.868 117.466,421.134 117.8,421.4 z" fill="#3A8E2C" fill-opacity="0.2"/>
<path d="M97.3,448 C96.899,447.668 96.499,447.335 96.1,447 L116.8,420.6 C117.133,420.868 117.466,421.134 117.8,421.4 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M96.1,447 C95.732,446.701 95.366,446.401 95,446.1 L115.7,419.8 C116.066,420.068 116.432,420.335 116.8,420.6 z" fill="#3C902E" fill-opacity="0.2"/>
<path d="M96.1,447 C95.732,446.701 95.366,446.401 95,446.1 L115.7,419.8 C116.066,420.068 116.432,420.335 116.8,420.6 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M95,446.1 C94.599,445.801 94.199,445.501 93.8,445.2 L114.7,419 C115.033,419.268 115.366,419.534 115.7,419.8 z" fill="#3D922F" fill-opacity="0.2"/>
<path d="M95,446.1 C94.599,445.801 94.199,445.501 93.8,445.2 L114.7,419 C115.033,419.268 115.366,419.534 115.7,419.8 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M163.7,484.6 C162.296,484.112 160.896,483.612 159.5,483.1 L171.6,451.8 C172.829,452.278 174.062,452.745 175.3,453.2 z" fill="#054A04" fill-opacity="0.2"/>
<path d="M163.7,484.6 C162.296,484.112 160.896,483.612 159.5,483.1 L171.6,451.8 C172.829,452.278 174.062,452.745 175.3,453.2 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M127.2,467.7 C126.331,467.238 125.464,466.772 124.6,466.3 L141.4,437.3 C142.131,437.738 142.864,438.171 143.6,438.6 z" fill="#1B6313" fill-opacity="0.2"/>
<path d="M127.2,467.7 C126.331,467.238 125.464,466.772 124.6,466.3 L141.4,437.3 C142.131,437.738 142.864,438.171 143.6,438.6 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M93.8,445.2 C93.399,444.901 92.999,444.601 92.6,444.3 L113.7,418.2 C114.033,418.468 114.366,418.734 114.7,419 z" fill="#3F9430" fill-opacity="0.2"/>
<path d="M93.8,445.2 C93.399,444.901 92.999,444.601 92.6,444.3 L113.7,418.2 C114.033,418.468 114.366,418.734 114.7,419 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M92.6,444.3 C92.232,443.968 91.866,443.634 91.5,443.3 L112.7,417.4 C113.033,417.668 113.366,417.934 113.7,418.2 z" fill="#409731" fill-opacity="0.2"/>
<path d="M92.6,444.3 C92.232,443.968 91.866,443.634 91.5,443.3 L112.7,417.4 C113.033,417.668 113.366,417.934 113.7,418.2 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M124.6,466.3 C123.73,465.772 122.863,465.239 122,464.7 L139.1,436 C139.864,436.438 140.631,436.871 141.4,437.3 z" fill="#1C6514" fill-opacity="0.2"/>
<path d="M124.6,466.3 C123.73,465.772 122.863,465.239 122,464.7 L139.1,436 C139.864,436.438 140.631,436.871 141.4,437.3 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M122,464.7 C121.13,464.205 120.264,463.705 119.4,463.2 L136.9,434.6 C137.631,435.071 138.364,435.538 139.1,436 z" fill="#1E6716" fill-opacity="0.2"/>
<path d="M122,464.7 C121.13,464.205 120.264,463.705 119.4,463.2 L136.9,434.6 C137.631,435.071 138.364,435.538 139.1,436 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M91.5,443.3 C91.099,443.001 90.699,442.701 90.3,442.4 L111.7,416.6 C112.033,416.868 112.366,417.134 112.7,417.4 z" fill="#429932" fill-opacity="0.2"/>
<path d="M91.5,443.3 C91.099,443.001 90.699,442.701 90.3,442.4 L111.7,416.6 C112.033,416.868 112.366,417.134 112.7,417.4 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M90.3,442.4 C89.932,442.068 89.566,441.734 89.2,441.4 L110.7,415.8 C111.033,416.068 111.366,416.334 111.7,416.6 z" fill="#439B34" fill-opacity="0.2"/>
<path d="M90.3,442.4 C89.932,442.068 89.566,441.734 89.2,441.4 L110.7,415.8 C111.033,416.068 111.366,416.334 111.7,416.6 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M110.7,415.8 C93.502,401.351 78.658,384.314 66.7,365.3 L100.4,344.1 C110.159,359.611 122.27,373.51 136.3,385.3 z" fill="#1A8013" fill-opacity="0.2"/>
<path d="M110.7,415.8 C93.502,401.351 78.658,384.314 66.7,365.3 L100.4,344.1 C110.159,359.611 122.27,373.51 136.3,385.3 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M53,403.9 C52.665,403.501 52.332,403.101 52,402.7 L78.6,382.2 C78.866,382.534 79.132,382.867 79.4,383.2 z" fill="#297A1E" fill-opacity="0.2"/>
<path d="M53,403.9 C52.665,403.501 52.332,403.101 52,402.7 L78.6,382.2 C78.866,382.534 79.132,382.867 79.4,383.2 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M52,402.7 C51.699,402.301 51.399,401.901 51.1,401.5 L77.8,381.2 C78.066,381.534 78.332,381.867 78.6,382.2 z" fill="#2B7D20" fill-opacity="0.2"/>
<path d="M52,402.7 C51.699,402.301 51.399,401.901 51.1,401.5 L77.8,381.2 C78.066,381.534 78.332,381.867 78.6,382.2 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M74.8,428.4 C74.096,427.671 73.396,426.938 72.7,426.2 L96.5,402.6 C97.096,403.237 97.696,403.87 98.3,404.5 z" fill="#0A5A05" fill-opacity="0.2"/>
<path d="M74.8,428.4 C74.096,427.671 73.396,426.938 72.7,426.2 L96.5,402.6 C97.096,403.237 97.696,403.87 98.3,404.5 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M51.1,401.5 C50.799,401.101 50.499,400.701 50.2,400.3 L77,380.2 C77.266,380.534 77.532,380.867 77.8,381.2 z" fill="#2E7F22" fill-opacity="0.2"/>
<path d="M51.1,401.5 C50.799,401.101 50.499,400.701 50.2,400.3 L77,380.2 C77.266,380.534 77.532,380.867 77.8,381.2 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M50.2,400.3 C49.899,399.901 49.599,399.501 49.3,399.1 L76.2,379.1 C76.466,379.467 76.732,379.834 77,380.2 z" fill="#308224" fill-opacity="0.2"/>
<path d="M50.2,400.3 C49.899,399.901 49.599,399.501 49.3,399.1 L76.2,379.1 C76.466,379.467 76.732,379.834 77,380.2 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M72.7,426.2 C71.996,425.504 71.296,424.804 70.6,424.1 L94.6,400.8 C95.23,401.404 95.863,402.004 96.5,402.6 z" fill="#0E5D08" fill-opacity="0.2"/>
<path d="M72.7,426.2 C71.996,425.504 71.296,424.804 70.6,424.1 L94.6,400.8 C95.23,401.404 95.863,402.004 96.5,402.6 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M49.3,399.1 C49.032,398.701 48.766,398.301 48.5,397.9 L75.5,378.1 C75.732,378.434 75.966,378.767 76.2,379.1 z" fill="#338527" fill-opacity="0.2"/>
<path d="M49.3,399.1 C49.032,398.701 48.766,398.301 48.5,397.9 L75.5,378.1 C75.732,378.434 75.966,378.767 76.2,379.1 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M48.5,397.9 C48.199,397.501 47.899,397.101 47.6,396.7 L74.7,377 C74.966,377.367 75.232,377.734 75.5,378.1 z" fill="#358829" fill-opacity="0.2"/>
<path d="M48.5,397.9 C48.199,397.501 47.899,397.101 47.6,396.7 L74.7,377 C74.966,377.367 75.232,377.734 75.5,378.1 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M70.6,424.1 C69.896,423.404 69.196,422.704 68.5,422 L92.8,398.9 C93.396,399.537 93.996,400.17 94.6,400.8 z" fill="#11600A" fill-opacity="0.2"/>
<path d="M70.6,424.1 C69.896,423.404 69.196,422.704 68.5,422 L92.8,398.9 C93.396,399.537 93.996,400.17 94.6,400.8 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M47.6,396.7 C47.299,396.301 46.999,395.901 46.7,395.5 L73.9,376 C74.166,376.334 74.432,376.667 74.7,377 z" fill="#378B2B" fill-opacity="0.2"/>
<path d="M47.6,396.7 C47.299,396.301 46.999,395.901 46.7,395.5 L73.9,376 C74.166,376.334 74.432,376.667 74.7,377 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M68.5,422 C67.829,421.271 67.162,420.537 66.5,419.8 L91.1,397 C91.663,397.637 92.23,398.27 92.8,398.9 z" fill="#14630C" fill-opacity="0.2"/>
<path d="M68.5,422 C67.829,421.271 67.162,420.537 66.5,419.8 L91.1,397 C91.663,397.637 92.23,398.27 92.8,398.9 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M46.7,395.5 C46.399,395.101 46.099,394.701 45.8,394.3 L73.2,374.9 C73.432,375.267 73.666,375.634 73.9,376 z" fill="#3A8E2D" fill-opacity="0.2"/>
<path d="M46.7,395.5 C46.399,395.101 46.099,394.701 45.8,394.3 L73.2,374.9 C73.432,375.267 73.666,375.634 73.9,376 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M45.8,394.3 C45.532,393.901 45.266,393.501 45,393.1 L72.4,373.9 C72.666,374.234 72.932,374.567 73.2,374.9 z" fill="#3C912F" fill-opacity="0.2"/>
<path d="M45.8,394.3 C45.532,393.901 45.266,393.501 45,393.1 L72.4,373.9 C72.666,374.234 72.932,374.567 73.2,374.9 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M45,393.1 C44.699,392.668 44.399,392.234 44.1,391.8 L71.7,372.8 C71.932,373.167 72.166,373.534 72.4,373.9 z" fill="#3F9431" fill-opacity="0.2"/>
<path d="M45,393.1 C44.699,392.668 44.399,392.234 44.1,391.8 L71.7,372.8 C71.932,373.167 72.166,373.534 72.4,373.9 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M44.1,391.8 C43.832,391.401 43.566,391.001 43.3,390.6 L71,371.8 C71.232,372.134 71.466,372.467 71.7,372.8 z" fill="#419733" fill-opacity="0.2"/>
<path d="M44.1,391.8 C43.832,391.401 43.566,391.001 43.3,390.6 L71,371.8 C71.232,372.134 71.466,372.467 71.7,372.8 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M66.5,419.8 C65.829,419.071 65.162,418.337 64.5,417.6 L89.3,395.1 C89.896,395.737 90.496,396.37 91.1,397 z" fill="#17650F" fill-opacity="0.2"/>
<path d="M66.5,419.8 C65.829,419.071 65.162,418.337 64.5,417.6 L89.3,395.1 C89.896,395.737 90.496,396.37 91.1,397 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M82.4,435.5 C80.918,434.184 79.451,432.851 78,431.5 L101.1,407.2 C102.353,408.382 103.619,409.548 104.9,410.7 z" fill="#035502" fill-opacity="0.2"/>
<path d="M82.4,435.5 C80.918,434.184 79.451,432.851 78,431.5 L101.1,407.2 C102.353,408.382 103.619,409.548 104.9,410.7 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M89.2,441.4 C86.898,439.474 84.631,437.507 82.4,435.5 L104.9,410.7 C106.803,412.434 108.736,414.135 110.7,415.8 z" fill="#005200" fill-opacity="0.2"/>
<path d="M89.2,441.4 C86.898,439.474 84.631,437.507 82.4,435.5 L104.9,410.7 C106.803,412.434 108.736,414.135 110.7,415.8 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M43.3,390.6 C42.999,390.201 42.699,389.801 42.4,389.4 L70.3,370.7 C70.532,371.067 70.766,371.434 71,371.8 z" fill="#439A35" fill-opacity="0.2"/>
<path d="M43.3,390.6 C42.999,390.201 42.699,389.801 42.4,389.4 L70.3,370.7 C70.532,371.067 70.766,371.434 71,371.8 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M64.5,417.6 C63.829,416.871 63.162,416.137 62.5,415.4 L87.6,393.2 C88.163,393.837 88.73,394.47 89.3,395.1 z" fill="#196811" fill-opacity="0.2"/>
<path d="M64.5,417.6 C63.829,416.871 63.162,416.137 62.5,415.4 L87.6,393.2 C88.163,393.837 88.73,394.47 89.3,395.1 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M42.4,389.4 C42.132,388.967 41.865,388.534 41.6,388.1 L69.5,369.6 C69.766,369.967 70.032,370.334 70.3,370.7 z" fill="#469D37" fill-opacity="0.2"/>
<path d="M42.4,389.4 C42.132,388.967 41.865,388.534 41.6,388.1 L69.5,369.6 C69.766,369.967 70.032,370.334 70.3,370.7 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M62.5,415.4 C61.829,414.637 61.162,413.871 60.5,413.1 L85.9,391.2 C86.463,391.87 87.029,392.537 87.6,393.2 z" fill="#1C6B13" fill-opacity="0.2"/>
<path d="M62.5,415.4 C61.829,414.637 61.162,413.871 60.5,413.1 L85.9,391.2 C86.463,391.87 87.029,392.537 87.6,393.2 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M60.5,413.1 C59.862,412.337 59.229,411.57 58.6,410.8 L84.2,389.3 C84.763,389.937 85.33,390.57 85.9,391.2 z" fill="#1F6E16" fill-opacity="0.2"/>
<path d="M60.5,413.1 C59.862,412.337 59.229,411.57 58.6,410.8 L84.2,389.3 C84.763,389.937 85.33,390.57 85.9,391.2 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M41.6,388.1 C41.332,387.701 41.066,387.301 40.8,386.9 L68.8,368.5 C69.032,368.867 69.266,369.234 69.5,369.6 z" fill="#48A139" fill-opacity="0.2"/>
<path d="M41.6,388.1 C41.332,387.701 41.066,387.301 40.8,386.9 L68.8,368.5 C69.032,368.867 69.266,369.234 69.5,369.6 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M58.6,410.8 C57.962,410.037 57.329,409.27 56.7,408.5 L82.6,387.3 C83.129,387.97 83.663,388.637 84.2,389.3 z" fill="#217118" fill-opacity="0.2"/>
<path d="M58.6,410.8 C57.962,410.037 57.329,409.27 56.7,408.5 L82.6,387.3 C83.129,387.97 83.663,388.637 84.2,389.3 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M78,431.5 C76.924,430.476 75.857,429.443 74.8,428.4 L98.3,404.5 C99.225,405.408 100.159,406.308 101.1,407.2 z" fill="#065803" fill-opacity="0.2"/>
<path d="M78,431.5 C76.924,430.476 75.857,429.443 74.8,428.4 L98.3,404.5 C99.225,405.408 100.159,406.308 101.1,407.2 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M56.7,408.5 C56.062,407.737 55.429,406.97 54.8,406.2 L81,385.3 C81.529,385.97 82.063,386.637 82.6,387.3 z" fill="#24741A" fill-opacity="0.2"/>
<path d="M56.7,408.5 C56.062,407.737 55.429,406.97 54.8,406.2 L81,385.3 C81.529,385.97 82.063,386.637 82.6,387.3 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M54.8,406.2 C54.196,405.437 53.596,404.67 53,403.9 L79.4,383.2 C79.929,383.903 80.462,384.603 81,385.3 z" fill="#26771C" fill-opacity="0.2"/>
<path d="M54.8,406.2 C54.196,405.437 53.596,404.67 53,403.9 L79.4,383.2 C79.929,383.903 80.462,384.603 81,385.3 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M40.8,386.9 C40.532,386.467 40.265,386.034 40,385.6 L68.1,367.4 C68.332,367.767 68.566,368.134 68.8,368.5 z" fill="#4AA43C" fill-opacity="0.2"/>
<path d="M40.8,386.9 C40.532,386.467 40.265,386.034 40,385.6 L68.1,367.4 C68.332,367.767 68.566,368.134 68.8,368.5 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M40,385.6 C39.732,385.201 39.466,384.801 39.2,384.4 L67.4,366.4 C67.632,366.734 67.866,367.067 68.1,367.4 z" fill="#4DA73E" fill-opacity="0.2"/>
<path d="M40,385.6 C39.732,385.201 39.466,384.801 39.2,384.4 L67.4,366.4 C67.632,366.734 67.866,367.067 68.1,367.4 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M39.2,384.4 C38.932,383.967 38.665,383.534 38.4,383.1 L66.7,365.3 C66.932,365.667 67.166,366.034 67.4,366.4 z" fill="#4FAA40" fill-opacity="0.2"/>
<path d="M39.2,384.4 C38.932,383.967 38.665,383.534 38.4,383.1 L66.7,365.3 C66.932,365.667 67.166,366.034 67.4,366.4 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M37.7,292.4 C36.517,286.475 35.583,280.503 34.9,274.5 L74.4,270 C74.93,274.895 75.664,279.766 76.6,284.6 z" fill="#4AB03F" fill-opacity="0.2"/>
<path d="M37.7,292.4 C36.517,286.475 35.583,280.503 34.9,274.5 L74.4,270 C74.93,274.895 75.664,279.766 76.6,284.6 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M3.7,293.1 C3.454,291.635 3.22,290.169 3,288.7 L36.1,283.5 C36.289,284.768 36.489,286.035 36.7,287.3 z" fill="#1A8A18" fill-opacity="0.2"/>
<path d="M3.7,293.1 C3.454,291.635 3.22,290.169 3,288.7 L36.1,283.5 C36.289,284.768 36.489,286.035 36.7,287.3 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M4.8,299 C4.41,297.038 4.043,295.071 3.7,293.1 L36.7,287.3 C37.013,289.004 37.346,290.704 37.7,292.4 z" fill="#007F0A" fill-opacity="0.2"/>
<path d="M4.8,299 C4.41,297.038 4.043,295.071 3.7,293.1 L36.7,287.3 C37.013,289.004 37.346,290.704 37.7,292.4 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M3,288.7 C2.861,287.701 2.727,286.701 2.6,285.7 L35.7,280.9 C35.828,281.767 35.961,282.634 36.1,283.5 z" fill="#2A9424" fill-opacity="0.2"/>
<path d="M3,288.7 C2.861,287.701 2.727,286.701 2.6,285.7 L35.7,280.9 C35.828,281.767 35.961,282.634 36.1,283.5 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M2.6,285.7 C2.532,285.2 2.465,284.7 2.4,284.2 L35.5,279.6 C35.565,280.034 35.632,280.467 35.7,280.9 z" fill="#389F2F" fill-opacity="0.2"/>
<path d="M2.6,285.7 C2.532,285.2 2.465,284.7 2.4,284.2 L35.5,279.6 C35.565,280.034 35.632,280.467 35.7,280.9 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M2.4,284.2 C2.332,283.734 2.265,283.267 2.2,282.8 L35.4,278.4 C35.432,278.8 35.466,279.2 35.5,279.6 z" fill="#45AA3A" fill-opacity="0.2"/>
<path d="M2.4,284.2 C2.332,283.734 2.265,283.267 2.2,282.8 L35.4,278.4 C35.432,278.8 35.466,279.2 35.5,279.6 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M2.2,282.8 C2.132,282.3 2.065,281.8 2,281.3 L35.2,277.1 C35.265,277.534 35.332,277.967 35.4,278.4 z" fill="#51B544" fill-opacity="0.2"/>
<path d="M2.2,282.8 C2.132,282.3 2.065,281.8 2,281.3 L35.2,277.1 C35.265,277.534 35.332,277.967 35.4,278.4 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M2,281.3 C1.932,280.8 1.865,280.3 1.8,279.8 L35,275.8 C35.065,276.234 35.132,276.667 35.2,277.1 z" fill="#5CC14F" fill-opacity="0.2"/>
<path d="M2,281.3 C1.932,280.8 1.865,280.3 1.8,279.8 L35,275.8 C35.065,276.234 35.132,276.667 35.2,277.1 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M1.8,279.8 C1.732,279.3 1.665,278.8 1.6,278.3 L34.9,274.5 C34.932,274.933 34.965,275.367 35,275.8 z" fill="#68CC59" fill-opacity="0.2"/>
<path d="M1.8,279.8 C1.732,279.3 1.665,278.8 1.6,278.3 L34.9,274.5 C34.932,274.933 34.965,275.367 35,275.8 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M66.7,365.3 C58.202,351.778 51.226,337.357 45.9,322.3 L83.4,309 C87.755,321.291 93.456,333.063 100.4,344.1 z" fill="#2C8F23" fill-opacity="0.2"/>
<path d="M66.7,365.3 C58.202,351.778 51.226,337.357 45.9,322.3 L83.4,309 C87.755,321.291 93.456,333.063 100.4,344.1 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M28.7,366.3 C28.228,365.403 27.761,364.503 27.3,363.6 L57.2,348.4 C57.562,349.169 57.929,349.935 58.3,350.7 z" fill="#126B0B" fill-opacity="0.2"/>
<path d="M28.7,366.3 C28.228,365.403 27.761,364.503 27.3,363.6 L57.2,348.4 C57.562,349.169 57.929,349.935 58.3,350.7 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M24.7,358.3 C24.465,357.834 24.232,357.367 24,356.9 L54.3,342.6 C54.499,343.001 54.699,343.401 54.9,343.8 z" fill="#1F7616" fill-opacity="0.2"/>
<path d="M24.7,358.3 C24.465,357.834 24.232,357.367 24,356.9 L54.3,342.6 C54.499,343.001 54.699,343.401 54.9,343.8 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M38.4,383.1 C37.068,380.986 35.768,378.853 34.5,376.7 L63.4,359.7 C64.472,361.583 65.572,363.45 66.7,365.3 z" fill="#006000" fill-opacity="0.2"/>
<path d="M38.4,383.1 C37.068,380.986 35.768,378.853 34.5,376.7 L63.4,359.7 C64.472,361.583 65.572,363.45 66.7,365.3 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M24,356.9 C23.799,356.467 23.599,356.034 23.4,355.6 L53.7,341.4 C53.899,341.801 54.099,342.201 54.3,342.6 z" fill="#237A19" fill-opacity="0.2"/>
<path d="M24,356.9 C23.799,356.467 23.599,356.034 23.4,355.6 L53.7,341.4 C53.899,341.801 54.099,342.201 54.3,342.6 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M34.5,376.7 C33.479,374.979 32.479,373.245 31.5,371.5 L60.8,355.3 C61.649,356.777 62.516,358.244 63.4,359.7 z" fill="#066403" fill-opacity="0.2"/>
<path d="M34.5,376.7 C33.479,374.979 32.479,373.245 31.5,371.5 L60.8,355.3 C61.649,356.777 62.516,358.244 63.4,359.7 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M23.4,355.6 C23.199,355.134 22.999,354.667 22.8,354.2 L53.2,340.3 C53.366,340.667 53.532,341.034 53.7,341.4 z" fill="#277D1D" fill-opacity="0.2"/>
<path d="M23.4,355.6 C23.199,355.134 22.999,354.667 22.8,354.2 L53.2,340.3 C53.366,340.667 53.532,341.034 53.7,341.4 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M27.3,363.6 C26.862,362.736 26.428,361.869 26,361 L56,346.1 C56.395,346.869 56.795,347.636 57.2,348.4 z" fill="#176F0F" fill-opacity="0.2"/>
<path d="M27.3,363.6 C26.862,362.736 26.428,361.869 26,361 L56,346.1 C56.395,346.869 56.795,347.636 57.2,348.4 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M22.8,354.2 C22.565,353.767 22.332,353.334 22.1,352.9 L52.7,339.1 C52.865,339.501 53.032,339.901 53.2,340.3 z" fill="#2B8120" fill-opacity="0.2"/>
<path d="M22.8,354.2 C22.565,353.767 22.332,353.334 22.1,352.9 L52.7,339.1 C52.865,339.501 53.032,339.901 53.2,340.3 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M22.1,352.9 C21.899,352.434 21.699,351.967 21.5,351.5 L52.1,337.9 C52.299,338.301 52.499,338.701 52.7,339.1 z" fill="#2E8523" fill-opacity="0.2"/>
<path d="M22.1,352.9 C21.899,352.434 21.699,351.967 21.5,351.5 L52.1,337.9 C52.299,338.301 52.499,338.701 52.7,339.1 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M21.5,351.5 C21.299,351.034 21.099,350.567 20.9,350.1 L51.6,336.7 C51.765,337.1 51.932,337.5 52.1,337.9 z" fill="#328926" fill-opacity="0.2"/>
<path d="M21.5,351.5 C21.299,351.034 21.099,350.567 20.9,350.1 L51.6,336.7 C51.765,337.1 51.932,337.5 52.1,337.9 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M20.9,350.1 C20.699,349.667 20.499,349.234 20.3,348.8 L51.1,335.5 C51.265,335.901 51.432,336.301 51.6,336.7 z" fill="#358D29" fill-opacity="0.2"/>
<path d="M20.9,350.1 C20.699,349.667 20.499,349.234 20.3,348.8 L51.1,335.5 C51.265,335.901 51.432,336.301 51.6,336.7 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M31.5,371.5 C30.546,369.778 29.613,368.044 28.7,366.3 L58.3,350.7 C59.115,352.243 59.948,353.777 60.8,355.3 z" fill="#0C6707" fill-opacity="0.2"/>
<path d="M31.5,371.5 C30.546,369.778 29.613,368.044 28.7,366.3 L58.3,350.7 C59.115,352.243 59.948,353.777 60.8,355.3 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M20.3,348.8 C20.132,348.334 19.965,347.867 19.8,347.4 L50.6,334.3 C50.765,334.701 50.932,335.101 51.1,335.5 z" fill="#39912D" fill-opacity="0.2"/>
<path d="M20.3,348.8 C20.132,348.334 19.965,347.867 19.8,347.4 L50.6,334.3 C50.765,334.701 50.932,335.101 51.1,335.5 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M19.8,347.4 C19.599,346.934 19.399,346.467 19.2,346 L50.1,333.2 C50.266,333.567 50.432,333.934 50.6,334.3 z" fill="#3C9430" fill-opacity="0.2"/>
<path d="M19.8,347.4 C19.599,346.934 19.399,346.467 19.2,346 L50.1,333.2 C50.266,333.567 50.432,333.934 50.6,334.3 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M19.2,346 C18.999,345.534 18.799,345.067 18.6,344.6 L49.6,332 C49.765,332.401 49.932,332.801 50.1,333.2 z" fill="#409833" fill-opacity="0.2"/>
<path d="M19.2,346 C18.999,345.534 18.799,345.067 18.6,344.6 L49.6,332 C49.765,332.401 49.932,332.801 50.1,333.2 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M18.6,344.6 C18.399,344.167 18.199,343.734 18,343.3 L49.1,330.8 C49.265,331.201 49.432,331.6 49.6,332 z" fill="#439C36" fill-opacity="0.2"/>
<path d="M18.6,344.6 C18.399,344.167 18.199,343.734 18,343.3 L49.1,330.8 C49.265,331.201 49.432,331.6 49.6,332 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M18,343.3 C17.832,342.834 17.665,342.367 17.5,341.9 L48.6,329.6 C48.765,330 48.932,330.4 49.1,330.8 z" fill="#47A039" fill-opacity="0.2"/>
<path d="M18,343.3 C17.832,342.834 17.665,342.367 17.5,341.9 L48.6,329.6 C48.765,330 48.932,330.4 49.1,330.8 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M17.5,341.9 C17.299,341.434 17.099,340.967 16.9,340.5 L48.2,328.4 C48.332,328.8 48.465,329.2 48.6,329.6 z" fill="#4AA43C" fill-opacity="0.2"/>
<path d="M17.5,341.9 C17.299,341.434 17.099,340.967 16.9,340.5 L48.2,328.4 C48.332,328.8 48.465,329.2 48.6,329.6 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M16.9,340.5 C16.732,340.034 16.565,339.567 16.4,339.1 L47.7,327.1 C47.865,327.534 48.032,327.967 48.2,328.4 z" fill="#4EA83F" fill-opacity="0.2"/>
<path d="M16.9,340.5 C16.732,340.034 16.565,339.567 16.4,339.1 L47.7,327.1 C47.865,327.534 48.032,327.967 48.2,328.4 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M16.4,339.1 C16.232,338.634 16.065,338.167 15.9,337.7 L47.2,325.9 C47.365,326.301 47.532,326.701 47.7,327.1 z" fill="#51AC42" fill-opacity="0.2"/>
<path d="M16.4,339.1 C16.232,338.634 16.065,338.167 15.9,337.7 L47.2,325.9 C47.365,326.301 47.532,326.701 47.7,327.1 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M26,361 C25.561,360.103 25.128,359.203 24.7,358.3 L54.9,343.8 C55.262,344.569 55.629,345.336 56,346.1 z" fill="#1B7213" fill-opacity="0.2"/>
<path d="M26,361 C25.561,360.103 25.128,359.203 24.7,358.3 L54.9,343.8 C55.262,344.569 55.629,345.336 56,346.1 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M15.9,337.7 C15.732,337.234 15.565,336.767 15.4,336.3 L46.8,324.7 C46.932,325.1 47.065,325.5 47.2,325.9 z" fill="#54B045" fill-opacity="0.2"/>
<path d="M15.9,337.7 C15.732,337.234 15.565,336.767 15.4,336.3 L46.8,324.7 C46.932,325.1 47.065,325.5 47.2,325.9 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M15.4,336.3 C15.232,335.834 15.065,335.367 14.9,334.9 L46.4,323.5 C46.532,323.9 46.665,324.3 46.8,324.7 z" fill="#58B449" fill-opacity="0.2"/>
<path d="M15.4,336.3 C15.232,335.834 15.065,335.367 14.9,334.9 L46.4,323.5 C46.532,323.9 46.665,324.3 46.8,324.7 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M14.9,334.9 C14.699,334.434 14.499,333.967 14.3,333.5 L45.9,322.3 C46.065,322.701 46.232,323.1 46.4,323.5 z" fill="#5BB84C" fill-opacity="0.2"/>
<path d="M14.9,334.9 C14.699,334.434 14.499,333.967 14.3,333.5 L45.9,322.3 C46.065,322.701 46.232,323.1 46.4,323.5 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M45.9,322.3 C42.456,312.542 39.715,302.55 37.7,292.4 L76.6,284.6 C78.28,292.885 80.553,301.04 83.4,309 z" fill="#3BA031" fill-opacity="0.2"/>
<path d="M45.9,322.3 C42.456,312.542 39.715,302.55 37.7,292.4 L76.6,284.6 C78.28,292.885 80.553,301.04 83.4,309 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M9.4,317.8 C9.265,317.334 9.132,316.867 9,316.4 L41.3,307.5 C41.399,307.9 41.499,308.3 41.6,308.7 z" fill="#1E8115" fill-opacity="0.2"/>
<path d="M9.4,317.8 C9.265,317.334 9.132,316.867 9,316.4 L41.3,307.5 C41.399,307.9 41.499,308.3 41.6,308.7 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M9,316.4 C8.865,315.9 8.732,315.4 8.6,314.9 L40.9,306.2 C41.032,306.634 41.165,307.067 41.3,307.5 z" fill="#25861B" fill-opacity="0.2"/>
<path d="M9,316.4 C8.865,315.9 8.732,315.4 8.6,314.9 L40.9,306.2 C41.032,306.634 41.165,307.067 41.3,307.5 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M8.6,314.9 C8.465,314.434 8.332,313.967 8.2,313.5 L40.6,305 C40.699,305.4 40.799,305.8 40.9,306.2 z" fill="#2C8C21" fill-opacity="0.2"/>
<path d="M8.6,314.9 C8.465,314.434 8.332,313.967 8.2,313.5 L40.6,305 C40.699,305.4 40.799,305.8 40.9,306.2 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M8.2,313.5 C8.065,313.034 7.932,312.567 7.8,312.1 L40.3,303.7 C40.399,304.134 40.499,304.567 40.6,305 z" fill="#329127" fill-opacity="0.2"/>
<path d="M8.2,313.5 C8.065,313.034 7.932,312.567 7.8,312.1 L40.3,303.7 C40.399,304.134 40.499,304.567 40.6,305 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M7.8,312.1 C7.698,311.6 7.598,311.1 7.5,310.6 L40,302.5 C40.099,302.9 40.199,303.3 40.3,303.7 z" fill="#38972C" fill-opacity="0.2"/>
<path d="M7.8,312.1 C7.698,311.6 7.598,311.1 7.5,310.6 L40,302.5 C40.099,302.9 40.199,303.3 40.3,303.7 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M7.5,310.6 C7.365,310.134 7.232,309.667 7.1,309.2 L39.6,301.2 C39.732,301.634 39.865,302.067 40,302.5 z" fill="#3E9D31" fill-opacity="0.2"/>
<path d="M7.5,310.6 C7.365,310.134 7.232,309.667 7.1,309.2 L39.6,301.2 C39.732,301.634 39.865,302.067 40,302.5 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M7.1,309.2 C6.998,308.7 6.898,308.2 6.8,307.7 L39.3,300 C39.399,300.4 39.499,300.8 39.6,301.2 z" fill="#44A336" fill-opacity="0.2"/>
<path d="M7.1,309.2 C6.998,308.7 6.898,308.2 6.8,307.7 L39.3,300 C39.399,300.4 39.499,300.8 39.6,301.2 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M6.8,307.7 C6.665,307.234 6.532,306.767 6.4,306.3 L39,298.7 C39.099,299.134 39.199,299.567 39.3,300 z" fill="#49A83C" fill-opacity="0.2"/>
<path d="M6.8,307.7 C6.665,307.234 6.532,306.767 6.4,306.3 L39,298.7 C39.099,299.134 39.199,299.567 39.3,300 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M10.2,320.7 C9.928,319.735 9.661,318.768 9.4,317.8 L41.6,308.7 C41.828,309.535 42.062,310.368 42.3,311.2 z" fill="#167B0F" fill-opacity="0.2"/>
<path d="M10.2,320.7 C9.928,319.735 9.661,318.768 9.4,317.8 L41.6,308.7 C41.828,309.535 42.062,310.368 42.3,311.2 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M14.3,333.5 C13.498,331.145 12.731,328.778 12,326.4 L43.9,316.2 C44.536,318.243 45.203,320.277 45.9,322.3 z" fill="#007000" fill-opacity="0.2"/>
<path d="M14.3,333.5 C13.498,331.145 12.731,328.778 12,326.4 L43.9,316.2 C44.536,318.243 45.203,320.277 45.9,322.3 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M12,326.4 C11.377,324.507 10.777,322.607 10.2,320.7 L42.3,311.2 C42.813,312.873 43.346,314.54 43.9,316.2 z" fill="#0C7507" fill-opacity="0.2"/>
<path d="M12,326.4 C11.377,324.507 10.777,322.607 10.2,320.7 L42.3,311.2 C42.813,312.873 43.346,314.54 43.9,316.2 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M6.4,306.3 C6.298,305.8 6.198,305.3 6.1,304.8 L38.8,297.5 C38.866,297.9 38.932,298.3 39,298.7 z" fill="#4FAE41" fill-opacity="0.2"/>
<path d="M6.4,306.3 C6.298,305.8 6.198,305.3 6.1,304.8 L38.8,297.5 C38.866,297.9 38.932,298.3 39,298.7 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M6.1,304.8 C5.998,304.3 5.898,303.8 5.8,303.3 L38.5,296.2 C38.599,296.634 38.699,297.067 38.8,297.5 z" fill="#54B446" fill-opacity="0.2"/>
<path d="M6.1,304.8 C5.998,304.3 5.898,303.8 5.8,303.3 L38.5,296.2 C38.599,296.634 38.699,297.067 38.8,297.5 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M5.8,303.3 C5.665,302.834 5.532,302.367 5.4,301.9 L38.2,294.9 C38.299,295.334 38.399,295.767 38.5,296.2 z" fill="#5ABA4B" fill-opacity="0.2"/>
<path d="M5.8,303.3 C5.665,302.834 5.532,302.367 5.4,301.9 L38.2,294.9 C38.299,295.334 38.399,295.767 38.5,296.2 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M5.4,301.9 C5.298,301.4 5.198,300.9 5.1,300.4 L37.9,293.7 C37.999,294.1 38.099,294.5 38.2,294.9 z" fill="#60C050" fill-opacity="0.2"/>
<path d="M5.4,301.9 C5.298,301.4 5.198,300.9 5.1,300.4 L37.9,293.7 C37.999,294.1 38.099,294.5 38.2,294.9 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M5.1,300.4 C4.999,299.934 4.899,299.467 4.8,299 L37.7,292.4 C37.765,292.834 37.832,293.267 37.9,293.7 z" fill="#65C656" fill-opacity="0.2"/>
<path d="M5.1,300.4 C4.999,299.934 4.899,299.467 4.8,299 L37.7,292.4 C37.765,292.834 37.832,293.267 37.9,293.7 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M412.4,319.8 C377.353,401.275 287.363,444.174 202,420.1 L216.1,370.3 C276.432,387.291 340.019,356.972 364.8,299.4 z" fill="#FF7F0E" fill-opacity="0.2"/>
<path d="M412.4,319.8 C377.353,401.275 287.363,444.174 202,420.1 L216.1,370.3 C276.432,387.291 340.019,356.972 364.8,299.4 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M292.4,462.3 C279.291,464.926 265.968,466.332 252.6,466.5 L252.1,426.8 C263.015,426.672 273.895,425.534 284.6,423.4 z" fill="#DC751B" fill-opacity="0.2"/>
<path d="M292.4,462.3 C279.291,464.926 265.968,466.332 252.6,466.5 L252.1,426.8 C263.015,426.672 273.895,425.534 284.6,423.4 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M273.9,498.9 C272.9,498.973 271.9,499.039 270.9,499.1 L268.1,465.7 C268.967,465.639 269.834,465.572 270.7,465.5 z" fill="#BD6117" fill-opacity="0.2"/>
<path d="M273.9,498.9 C272.9,498.973 271.9,499.039 270.9,499.1 L268.1,465.7 C268.967,465.639 269.834,465.572 270.7,465.5 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M267.9,499.4 C267.4,499.435 266.9,499.468 266.4,499.5 L264.2,466 C264.633,466.001 265.067,466.001 265.5,466 z" fill="#C76B20" fill-opacity="0.2"/>
<path d="M267.9,499.4 C267.4,499.435 266.9,499.468 266.4,499.5 L264.2,466 C264.633,466.001 265.067,466.001 265.5,466 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M266.4,499.5 C265.9,499.535 265.4,499.568 264.9,499.6 L262.9,466.1 C263.333,466.068 263.767,466.035 264.2,466 z" fill="#CC7124" fill-opacity="0.2"/>
<path d="M266.4,499.5 C265.9,499.535 265.4,499.568 264.9,499.6 L262.9,466.1 C263.333,466.068 263.767,466.035 264.2,466 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M264.9,499.6 C264.4,499.602 263.9,499.602 263.4,499.6 L261.6,466.2 C262.033,466.168 262.467,466.135 262.9,466.1 z" fill="#D17628" fill-opacity="0.2"/>
<path d="M264.9,499.6 C264.4,499.602 263.9,499.602 263.4,499.6 L261.6,466.2 C262.033,466.168 262.467,466.135 262.9,466.1 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M263.4,499.6 C262.9,499.635 262.4,499.668 261.9,499.7 L260.3,466.3 C260.733,466.268 261.167,466.235 261.6,466.2 z" fill="#D77B2C" fill-opacity="0.2"/>
<path d="M263.4,499.6 C262.9,499.635 262.4,499.668 261.9,499.7 L260.3,466.3 C260.733,466.268 261.167,466.235 261.6,466.2 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M270.9,499.1 C269.901,499.206 268.901,499.306 267.9,499.4 L265.5,466 C266.367,465.905 267.234,465.805 268.1,465.7 z" fill="#C2661C" fill-opacity="0.2"/>
<path d="M270.9,499.1 C269.901,499.206 268.901,499.306 267.9,499.4 L265.5,466 C266.367,465.905 267.234,465.805 268.1,465.7 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M261.9,499.7 C261.4,499.735 260.9,499.768 260.4,499.8 L259,466.3 C259.433,466.301 259.867,466.301 260.3,466.3 z" fill="#DC8030" fill-opacity="0.2"/>
<path d="M261.9,499.7 C261.4,499.735 260.9,499.768 260.4,499.8 L259,466.3 C259.433,466.301 259.867,466.301 260.3,466.3 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M260.4,499.8 C259.933,499.801 259.467,499.801 259,499.8 L257.8,466.4 C258.2,466.368 258.6,466.334 259,466.3 z" fill="#E18534" fill-opacity="0.2"/>
<path d="M260.4,499.8 C259.933,499.801 259.467,499.801 259,499.8 L257.8,466.4 C258.2,466.368 258.6,466.334 259,466.3 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M287.2,497.2 C285.735,497.413 284.268,497.613 282.8,497.8 L278.4,464.6 C279.668,464.445 280.935,464.278 282.2,464.1 z" fill="#AE5209" fill-opacity="0.2"/>
<path d="M287.2,497.2 C285.735,497.413 284.268,497.613 282.8,497.8 L278.4,464.6 C279.668,464.445 280.935,464.278 282.2,464.1 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M299,495.2 C297.038,495.59 295.071,495.957 293.1,496.3 L287.3,463.3 C289.004,462.987 290.704,462.654 292.4,462.3 z" fill="#A44800" fill-opacity="0.2"/>
<path d="M299,495.2 C297.038,495.59 295.071,495.957 293.1,496.3 L287.3,463.3 C289.004,462.987 290.704,462.654 292.4,462.3 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M259,499.8 C258.5,499.835 258,499.868 257.5,499.9 L256.5,466.4 C256.933,466.401 257.367,466.401 257.8,466.4 z" fill="#E68A38" fill-opacity="0.2"/>
<path d="M259,499.8 C258.5,499.835 258,499.868 257.5,499.9 L256.5,466.4 C256.933,466.401 257.367,466.401 257.8,466.4 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M257.5,499.9 C257,499.901 256.5,499.901 256,499.9 L255.2,466.4 C255.633,466.401 256.067,466.401 256.5,466.4 z" fill="#EB903D" fill-opacity="0.2"/>
<path d="M257.5,499.9 C257,499.901 256.5,499.901 256,499.9 L255.2,466.4 C255.633,466.401 256.067,466.401 256.5,466.4 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M282.8,497.8 C281.302,498.014 279.802,498.214 278.3,498.4 L274.5,465.1 C275.801,464.945 277.102,464.778 278.4,464.6 z" fill="#B3570E" fill-opacity="0.2"/>
<path d="M282.8,497.8 C281.302,498.014 279.802,498.214 278.3,498.4 L274.5,465.1 C275.801,464.945 277.102,464.778 278.4,464.6 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M278.3,498.4 C276.835,498.58 275.368,498.746 273.9,498.9 L270.7,465.5 C271.968,465.378 273.235,465.245 274.5,465.1 z" fill="#B85C13" fill-opacity="0.2"/>
<path d="M278.3,498.4 C276.835,498.58 275.368,498.746 273.9,498.9 L270.7,465.5 C271.968,465.378 273.235,465.245 274.5,465.1 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M293.1,496.3 C291.137,496.623 289.17,496.923 287.2,497.2 L282.2,464.1 C283.903,463.854 285.603,463.587 287.3,463.3 z" fill="#A94D04" fill-opacity="0.2"/>
<path d="M293.1,496.3 C291.137,496.623 289.17,496.923 287.2,497.2 L282.2,464.1 C283.903,463.854 285.603,463.587 287.3,463.3 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M256,499.9 C255.5,499.935 255,499.968 254.5,500 L253.9,466.5 C254.333,466.468 254.767,466.435 255.2,466.4 z" fill="#F09541" fill-opacity="0.2"/>
<path d="M256,499.9 C255.5,499.935 255,499.968 254.5,500 L253.9,466.5 C254.333,466.468 254.767,466.435 255.2,466.4 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M254.5,500 C254,500.001 253.5,500.001 253,500 L252.6,466.5 C253.033,466.501 253.467,466.501 253.9,466.5 z" fill="#F59A45" fill-opacity="0.2"/>
<path d="M254.5,500 C254,500.001 253.5,500.001 253,500 L252.6,466.5 C253.033,466.501 253.467,466.501 253.9,466.5 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M448.9,335.5 C438.991,358.546 425.151,379.694 408,398 L379,370.8 C393.002,355.862 404.304,338.606 412.4,319.8 z" fill="#C55000" fill-opacity="0.2"/>
<path d="M448.9,335.5 C438.991,358.546 425.151,379.694 408,398 L379,370.8 C393.002,355.862 404.304,338.606 412.4,319.8 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M460.8,384.4 C460.272,385.237 459.738,386.07 459.2,386.9 L431.2,368.5 C431.671,367.803 432.137,367.103 432.6,366.4 z" fill="#A9380C" fill-opacity="0.2"/>
<path d="M460.8,384.4 C460.272,385.237 459.738,386.07 459.2,386.9 L431.2,368.5 C431.671,367.803 432.137,367.103 432.6,366.4 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M479.7,348.8 C478.888,350.61 478.055,352.41 477.2,354.2 L446.8,340.3 C447.519,338.709 448.219,337.108 448.9,335.5 z" fill="#8E2000" fill-opacity="0.2"/>
<path d="M479.7,348.8 C478.888,350.61 478.055,352.41 477.2,354.2 L446.8,340.3 C447.519,338.709 448.219,337.108 448.9,335.5 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M448.9,401.5 C448.601,401.901 448.301,402.301 448,402.7 L421.4,382.2 C421.668,381.867 421.934,381.534 422.2,381.2 z" fill="#C04B19" fill-opacity="0.2"/>
<path d="M448.9,401.5 C448.601,401.901 448.301,402.301 448,402.7 L421.4,382.2 C421.668,381.867 421.934,381.534 422.2,381.2 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M448,402.7 C447.668,403.101 447.335,403.501 447,403.9 L420.6,383.2 C420.868,382.867 421.134,382.534 421.4,382.2 z" fill="#C44E1A" fill-opacity="0.2"/>
<path d="M448,402.7 C447.668,403.101 447.335,403.501 447,403.9 L420.6,383.2 C420.868,382.867 421.134,382.534 421.4,382.2 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M472,365 C471.312,366.306 470.611,367.606 469.9,368.9 L440.4,353 C441.044,351.872 441.677,350.739 442.3,349.6 z" fill="#982904" fill-opacity="0.2"/>
<path d="M472,365 C471.312,366.306 470.611,367.606 469.9,368.9 L440.4,353 C441.044,351.872 441.677,350.739 442.3,349.6 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M447,403.9 C446.701,404.268 446.401,404.634 446.1,405 L419.8,384.3 C420.068,383.934 420.335,383.568 420.6,383.2 z" fill="#C7511C" fill-opacity="0.2"/>
<path d="M447,403.9 C446.701,404.268 446.401,404.634 446.1,405 L419.8,384.3 C420.068,383.934 420.335,383.568 420.6,383.2 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M459.2,386.9 C458.672,387.737 458.138,388.57 457.6,389.4 L429.7,370.7 C430.204,369.97 430.704,369.236 431.2,368.5 z" fill="#AC3A0E" fill-opacity="0.2"/>
<path d="M459.2,386.9 C458.672,387.737 458.138,388.57 457.6,389.4 L429.7,370.7 C430.204,369.97 430.704,369.236 431.2,368.5 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M477.2,354.2 C476.388,356.01 475.555,357.81 474.7,359.6 L444.6,344.9 C445.351,343.375 446.085,341.842 446.8,340.3 z" fill="#912302" fill-opacity="0.2"/>
<path d="M477.2,354.2 C476.388,356.01 475.555,357.81 474.7,359.6 L444.6,344.9 C445.351,343.375 446.085,341.842 446.8,340.3 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M457.6,389.4 C457.038,390.203 456.471,391.003 455.9,391.8 L428.3,372.8 C428.771,372.103 429.237,371.403 429.7,370.7 z" fill="#AF3D10" fill-opacity="0.2"/>
<path d="M457.6,389.4 C457.038,390.203 456.471,391.003 455.9,391.8 L428.3,372.8 C428.771,372.103 429.237,371.403 429.7,370.7 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M469.9,368.9 C469.178,370.207 468.445,371.507 467.7,372.8 L438.6,356.4 C439.21,355.272 439.81,354.139 440.4,353 z" fill="#9B2C06" fill-opacity="0.2"/>
<path d="M469.9,368.9 C469.178,370.207 468.445,371.507 467.7,372.8 L438.6,356.4 C439.21,355.272 439.81,354.139 440.4,353 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M446.1,405 C445.801,405.401 445.501,405.801 445.2,406.2 L419,385.3 C419.268,384.967 419.534,384.634 419.8,384.3 z" fill="#CB541E" fill-opacity="0.2"/>
<path d="M446.1,405 C445.801,405.401 445.501,405.801 445.2,406.2 L419,385.3 C419.268,384.967 419.534,384.634 419.8,384.3 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M445.2,406.2 C444.901,406.601 444.601,407.001 444.3,407.4 L418.2,386.3 C418.468,385.967 418.734,385.634 419,385.3 z" fill="#CE571F" fill-opacity="0.2"/>
<path d="M445.2,406.2 C444.901,406.601 444.601,407.001 444.3,407.4 L418.2,386.3 C418.468,385.967 418.734,385.634 419,385.3 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M444.3,407.4 C443.968,407.768 443.634,408.134 443.3,408.5 L417.4,387.3 C417.668,386.967 417.934,386.634 418.2,386.3 z" fill="#D15921" fill-opacity="0.2"/>
<path d="M444.3,407.4 C443.968,407.768 443.634,408.134 443.3,408.5 L417.4,387.3 C417.668,386.967 417.934,386.634 418.2,386.3 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M455.9,391.8 C455.338,392.637 454.772,393.47 454.2,394.3 L426.8,374.9 C427.304,374.203 427.804,373.503 428.3,372.8 z" fill="#B34012" fill-opacity="0.2"/>
<path d="M455.9,391.8 C455.338,392.637 454.772,393.47 454.2,394.3 L426.8,374.9 C427.304,374.203 427.804,373.503 428.3,372.8 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M467.7,372.8 C466.978,374.107 466.245,375.407 465.5,376.7 L436.6,359.7 C437.276,358.606 437.943,357.506 438.6,356.4 z" fill="#9F2F07" fill-opacity="0.2"/>
<path d="M467.7,372.8 C466.978,374.107 466.245,375.407 465.5,376.7 L436.6,359.7 C437.276,358.606 437.943,357.506 438.6,356.4 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M465.5,376.7 C464.745,378.007 463.978,379.307 463.2,380.6 L434.6,363.1 C435.277,361.973 435.944,360.839 436.6,359.7 z" fill="#A23209" fill-opacity="0.2"/>
<path d="M465.5,376.7 C464.745,378.007 463.978,379.307 463.2,380.6 L434.6,363.1 C435.277,361.973 435.944,360.839 436.6,359.7 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M443.3,408.5 C443.001,408.901 442.701,409.301 442.4,409.7 L416.6,388.3 C416.868,387.967 417.134,387.634 417.4,387.3 z" fill="#D55C23" fill-opacity="0.2"/>
<path d="M443.3,408.5 C443.001,408.901 442.701,409.301 442.4,409.7 L416.6,388.3 C416.868,387.967 417.134,387.634 417.4,387.3 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M442.4,409.7 C442.068,410.068 441.734,410.434 441.4,410.8 L415.8,389.3 C416.068,388.967 416.334,388.634 416.6,388.3 z" fill="#D85F24" fill-opacity="0.2"/>
<path d="M442.4,409.7 C442.068,410.068 441.734,410.434 441.4,410.8 L415.8,389.3 C416.068,388.967 416.334,388.634 416.6,388.3 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M463.2,380.6 C462.411,381.874 461.611,383.141 460.8,384.4 L432.6,366.4 C433.276,365.306 433.943,364.206 434.6,363.1 z" fill="#A5350B" fill-opacity="0.2"/>
<path d="M463.2,380.6 C462.411,381.874 461.611,383.141 460.8,384.4 L432.6,366.4 C433.276,365.306 433.943,364.206 434.6,363.1 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M454.2,394.3 C453.605,395.104 453.005,395.904 452.4,396.7 L425.3,377 C425.804,376.303 426.304,375.603 426.8,374.9 z" fill="#B64313" fill-opacity="0.2"/>
<path d="M454.2,394.3 C453.605,395.104 453.005,395.904 452.4,396.7 L425.3,377 C425.804,376.303 426.304,375.603 426.8,374.9 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M441.4,410.8 C441.068,411.201 440.735,411.601 440.4,412 L414.9,390.3 C415.201,389.968 415.501,389.634 415.8,389.3 z" fill="#DC6226" fill-opacity="0.2"/>
<path d="M441.4,410.8 C441.068,411.201 440.735,411.601 440.4,412 L414.9,390.3 C415.201,389.968 415.501,389.634 415.8,389.3 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M440.4,412 C440.101,412.368 439.801,412.734 439.5,413.1 L414.1,391.2 C414.367,390.901 414.634,390.601 414.9,390.3 z" fill="#DF6528" fill-opacity="0.2"/>
<path d="M440.4,412 C440.101,412.368 439.801,412.734 439.5,413.1 L414.1,391.2 C414.367,390.901 414.634,390.601 414.9,390.3 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M439.5,413.1 C439.168,413.468 438.834,413.834 438.5,414.2 L413.2,392.2 C413.501,391.868 413.801,391.534 414.1,391.2 z" fill="#E36829" fill-opacity="0.2"/>
<path d="M439.5,413.1 C439.168,413.468 438.834,413.834 438.5,414.2 L413.2,392.2 C413.501,391.868 413.801,391.534 414.1,391.2 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M438.5,414.2 C438.168,414.601 437.835,415.001 437.5,415.4 L412.4,393.2 C412.668,392.867 412.934,392.534 413.2,392.2 z" fill="#E66B2B" fill-opacity="0.2"/>
<path d="M438.5,414.2 C438.168,414.601 437.835,415.001 437.5,415.4 L412.4,393.2 C412.668,392.867 412.934,392.534 413.2,392.2 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M474.7,359.6 C473.822,361.411 472.922,363.211 472,365 L442.3,349.6 C443.086,348.043 443.852,346.476 444.6,344.9 z" fill="#952603" fill-opacity="0.2"/>
<path d="M474.7,359.6 C473.822,361.411 472.922,363.211 472,365 L442.3,349.6 C443.086,348.043 443.852,346.476 444.6,344.9 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M437.5,415.4 C437.168,415.768 436.834,416.134 436.5,416.5 L411.5,394.2 C411.801,393.868 412.101,393.534 412.4,393.2 z" fill="#E96E2D" fill-opacity="0.2"/>
<path d="M437.5,415.4 C437.168,415.768 436.834,416.134 436.5,416.5 L411.5,394.2 C411.801,393.868 412.101,393.534 412.4,393.2 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M452.4,396.7 C451.838,397.503 451.271,398.303 450.7,399.1 L423.8,379.1 C424.304,378.403 424.804,377.703 425.3,377 z" fill="#BA4615" fill-opacity="0.2"/>
<path d="M452.4,396.7 C451.838,397.503 451.271,398.303 450.7,399.1 L423.8,379.1 C424.304,378.403 424.804,377.703 425.3,377 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M436.5,416.5 C436.168,416.868 435.834,417.234 435.5,417.6 L410.7,395.1 C410.967,394.801 411.234,394.501 411.5,394.2 z" fill="#ED702E" fill-opacity="0.2"/>
<path d="M436.5,416.5 C436.168,416.868 435.834,417.234 435.5,417.6 L410.7,395.1 C410.967,394.801 411.234,394.501 411.5,394.2 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M435.5,417.6 C435.168,417.968 434.834,418.334 434.5,418.7 L409.8,396.1 C410.101,395.768 410.401,395.434 410.7,395.1 z" fill="#F07330" fill-opacity="0.2"/>
<path d="M435.5,417.6 C435.168,417.968 434.834,418.334 434.5,418.7 L409.8,396.1 C410.101,395.768 410.401,395.434 410.7,395.1 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M434.5,418.7 C434.168,419.068 433.834,419.434 433.5,419.8 L408.9,397 C409.201,396.701 409.501,396.401 409.8,396.1 z" fill="#F47632" fill-opacity="0.2"/>
<path d="M434.5,418.7 C434.168,419.068 433.834,419.434 433.5,419.8 L408.9,397 C409.201,396.701 409.501,396.401 409.8,396.1 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M450.7,399.1 C450.105,399.904 449.505,400.704 448.9,401.5 L422.2,381.2 C422.738,380.503 423.271,379.803 423.8,379.1 z" fill="#BD4817" fill-opacity="0.2"/>
<path d="M450.7,399.1 C450.105,399.904 449.505,400.704 448.9,401.5 L422.2,381.2 C422.738,380.503 423.271,379.803 423.8,379.1 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M433.5,419.8 C433.168,420.168 432.834,420.534 432.5,420.9 L408,398 C408.301,397.668 408.601,397.334 408.9,397 z" fill="#F77934" fill-opacity="0.2"/>
<path d="M433.5,419.8 C433.168,420.168 432.834,420.534 432.5,420.9 L408,398 C408.301,397.668 408.601,397.334 408.9,397 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M252.6,466.5 C244.821,466.586 237.043,466.252 229.3,465.5 L233.1,426 C239.414,426.607 245.757,426.874 252.1,426.8 z" fill="#E38124" fill-opacity="0.2"/>
<path d="M252.6,466.5 C244.821,466.586 237.043,466.252 229.3,465.5 L233.1,426 C239.414,426.607 245.757,426.874 252.1,426.8 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M247,500 C246.5,500.001 246,500.001 245.5,500 L246.1,466.5 C246.533,466.501 246.967,466.501 247.4,466.5 z" fill="#B55E0C" fill-opacity="0.2"/>
<path d="M247,500 C246.5,500.001 246,500.001 245.5,500 L246.1,466.5 C246.533,466.501 246.967,466.501 247.4,466.5 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M245.5,500 C245,499.968 244.5,499.935 244,499.9 L244.8,466.4 C245.233,466.435 245.667,466.468 246.1,466.5 z" fill="#BA6312" fill-opacity="0.2"/>
<path d="M245.5,500 C245,499.968 244.5,499.935 244,499.9 L244.8,466.4 C245.233,466.435 245.667,466.468 246.1,466.5 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M244,499.9 C243.5,499.901 243,499.901 242.5,499.9 L243.5,466.4 C243.933,466.401 244.367,466.401 244.8,466.4 z" fill="#BF6917" fill-opacity="0.2"/>
<path d="M244,499.9 C243.5,499.901 243,499.901 242.5,499.9 L243.5,466.4 C243.933,466.401 244.367,466.401 244.8,466.4 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M242.5,499.9 C242,499.868 241.5,499.835 241,499.8 L242.2,466.4 C242.633,466.401 243.067,466.401 243.5,466.4 z" fill="#C46E1C" fill-opacity="0.2"/>
<path d="M242.5,499.9 C242,499.868 241.5,499.835 241,499.8 L242.2,466.4 C242.633,466.401 243.067,466.401 243.5,466.4 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M241,499.8 C240.533,499.801 240.067,499.801 239.6,499.8 L241,466.3 C241.4,466.334 241.8,466.368 242.2,466.4 z" fill="#C97421" fill-opacity="0.2"/>
<path d="M241,499.8 C240.533,499.801 240.067,499.801 239.6,499.8 L241,466.3 C241.4,466.334 241.8,466.368 242.2,466.4 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M239.6,499.8 C239.1,499.768 238.6,499.735 238.1,499.7 L239.7,466.3 C240.133,466.301 240.567,466.301 241,466.3 z" fill="#CE7926" fill-opacity="0.2"/>
<path d="M239.6,499.8 C239.1,499.768 238.6,499.735 238.1,499.7 L239.7,466.3 C240.133,466.301 240.567,466.301 241,466.3 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M238.1,499.7 C237.6,499.668 237.1,499.635 236.6,499.6 L238.4,466.2 C238.833,466.235 239.267,466.268 239.7,466.3 z" fill="#D37E2B" fill-opacity="0.2"/>
<path d="M238.1,499.7 C237.6,499.668 237.1,499.635 236.6,499.6 L238.4,466.2 C238.833,466.235 239.267,466.268 239.7,466.3 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M253,500 C252,500.006 251,500.006 250,500 L250,466.5 C250.867,466.505 251.733,466.505 252.6,466.5 z" fill="#AB5300" fill-opacity="0.2"/>
<path d="M253,500 C252,500.006 251,500.006 250,500 L250,466.5 C250.867,466.505 251.733,466.505 252.6,466.5 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M236.6,499.6 C236.1,499.602 235.6,499.602 235.1,499.6 L237.1,466.1 C237.533,466.135 237.967,466.168 238.4,466.2 z" fill="#D8842F" fill-opacity="0.2"/>
<path d="M236.6,499.6 C236.1,499.602 235.6,499.602 235.1,499.6 L237.1,466.1 C237.533,466.135 237.967,466.168 238.4,466.2 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M250,500 C249,500.006 248,500.006 247,500 L247.4,466.5 C248.267,466.505 249.133,466.505 250,466.5 z" fill="#B05805" fill-opacity="0.2"/>
<path d="M250,500 C249,500.006 248,500.006 247,500 L247.4,466.5 C248.267,466.505 249.133,466.505 250,466.5 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M235.1,499.6 C234.6,499.568 234.1,499.535 233.6,499.5 L235.8,466 C236.233,466.035 236.667,466.068 237.1,466.1 z" fill="#DD8A34" fill-opacity="0.2"/>
<path d="M235.1,499.6 C234.6,499.568 234.1,499.535 233.6,499.5 L235.8,466 C236.233,466.035 236.667,466.068 237.1,466.1 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M233.6,499.5 C233.1,499.468 232.6,499.435 232.1,499.4 L234.5,466 C234.933,466.001 235.367,466.001 235.8,466 z" fill="#E18F39" fill-opacity="0.2"/>
<path d="M233.6,499.5 C233.1,499.468 232.6,499.435 232.1,499.4 L234.5,466 C234.933,466.001 235.367,466.001 235.8,466 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M232.1,499.4 C231.6,499.335 231.1,499.268 230.6,499.2 L233.2,465.9 C233.633,465.935 234.067,465.968 234.5,466 z" fill="#E6953D" fill-opacity="0.2"/>
<path d="M232.1,499.4 C231.6,499.335 231.1,499.268 230.6,499.2 L233.2,465.9 C233.633,465.935 234.067,465.968 234.5,466 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M230.6,499.2 C230.1,499.168 229.6,499.135 229.1,499.1 L231.9,465.7 C232.333,465.768 232.766,465.835 233.2,465.9 z" fill="#EB9A42" fill-opacity="0.2"/>
<path d="M230.6,499.2 C230.1,499.168 229.6,499.135 229.1,499.1 L231.9,465.7 C232.333,465.768 232.766,465.835 233.2,465.9 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M229.1,499.1 C228.6,499.068 228.1,499.035 227.6,499 L230.6,465.6 C231.033,465.635 231.467,465.668 231.9,465.7 z" fill="#F0A047" fill-opacity="0.2"/>
<path d="M229.1,499.1 C228.6,499.068 228.1,499.035 227.6,499 L230.6,465.6 C231.033,465.635 231.467,465.668 231.9,465.7 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M227.6,499 C227.1,498.968 226.6,498.935 226.1,498.9 L229.3,465.5 C229.733,465.535 230.167,465.568 230.6,465.6 z" fill="#F5A64B" fill-opacity="0.2"/>
<path d="M227.6,499 C227.1,498.968 226.6,498.935 226.1,498.9 L229.3,465.5 C229.733,465.535 230.167,465.568 230.6,465.6 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M408,398 C392.674,414.381 374.895,428.28 355.3,439.2 L335.9,404.5 C351.928,395.571 366.469,384.202 379,370.8 z" fill="#CD5D08" fill-opacity="0.2"/>
<path d="M408,398 C392.674,414.381 374.895,428.28 355.3,439.2 L335.9,404.5 C351.928,395.571 366.469,384.202 379,370.8 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M407.4,444.3 C406.604,444.905 405.804,445.505 405,446.1 L384.3,419.8 C384.97,419.271 385.636,418.737 386.3,418.2 z" fill="#AB420C" fill-opacity="0.2"/>
<path d="M407.4,444.3 C406.604,444.905 405.804,445.505 405,446.1 L384.3,419.8 C384.97,419.271 385.636,418.737 386.3,418.2 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M405,446.1 C404.237,446.738 403.47,447.371 402.7,448 L382.2,421.4 C382.903,420.871 383.603,420.338 384.3,419.8 z" fill="#AE450E" fill-opacity="0.2"/>
<path d="M405,446.1 C404.237,446.738 403.47,447.371 402.7,448 L382.2,421.4 C382.903,420.871 383.603,420.338 384.3,419.8 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M397.9,451.5 C397.501,451.801 397.101,452.101 396.7,452.4 L377,425.3 C377.367,425.034 377.734,424.768 378.1,424.5 z" fill="#B84E14" fill-opacity="0.2"/>
<path d="M397.9,451.5 C397.501,451.801 397.101,452.101 396.7,452.4 L377,425.3 C377.367,425.034 377.734,424.768 378.1,424.5 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M396.7,452.4 C396.301,452.701 395.901,453.001 395.5,453.3 L376,426.1 C376.334,425.834 376.667,425.568 377,425.3 z" fill="#BB5016" fill-opacity="0.2"/>
<path d="M396.7,452.4 C396.301,452.701 395.901,453.001 395.5,453.3 L376,426.1 C376.334,425.834 376.667,425.568 377,425.3 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M395.5,453.3 C395.101,453.601 394.701,453.901 394.3,454.2 L374.9,426.8 C375.267,426.568 375.634,426.334 376,426.1 z" fill="#BE5318" fill-opacity="0.2"/>
<path d="M395.5,453.3 C395.101,453.601 394.701,453.901 394.3,454.2 L374.9,426.8 C375.267,426.568 375.634,426.334 376,426.1 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M402.7,448 C401.904,448.605 401.104,449.205 400.3,449.8 L380.2,423 C380.87,422.471 381.536,421.937 382.2,421.4 z" fill="#B24810" fill-opacity="0.2"/>
<path d="M402.7,448 C401.904,448.605 401.104,449.205 400.3,449.8 L380.2,423 C380.87,422.471 381.536,421.937 382.2,421.4 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M432.5,420.9 C431.15,422.35 429.784,423.783 428.4,425.2 L404.5,401.7 C405.681,400.48 406.848,399.247 408,398 z" fill="#952F00" fill-opacity="0.2"/>
<path d="M432.5,420.9 C431.15,422.35 429.784,423.783 428.4,425.2 L404.5,401.7 C405.681,400.48 406.848,399.247 408,398 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M424.1,429.4 C423.043,430.443 421.976,431.476 420.9,432.5 L398,408 C398.941,407.142 399.874,406.275 400.8,405.4 z" fill="#9B3503" fill-opacity="0.2"/>
<path d="M424.1,429.4 C423.043,430.443 421.976,431.476 420.9,432.5 L398,408 C398.941,407.142 399.874,406.275 400.8,405.4 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M400.3,449.8 C399.503,450.371 398.703,450.938 397.9,451.5 L378.1,424.5 C378.803,424.004 379.503,423.504 380.2,423 z" fill="#B54B12" fill-opacity="0.2"/>
<path d="M400.3,449.8 C399.503,450.371 398.703,450.938 397.9,451.5 L378.1,424.5 C378.803,424.004 379.503,423.504 380.2,423 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M428.4,425.2 C426.984,426.617 425.55,428.017 424.1,429.4 L400.8,405.4 C402.048,404.182 403.282,402.948 404.5,401.7 z" fill="#983201" fill-opacity="0.2"/>
<path d="M428.4,425.2 C426.984,426.617 425.55,428.017 424.1,429.4 L400.8,405.4 C402.048,404.182 403.282,402.948 404.5,401.7 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M420.9,432.5 C419.809,433.51 418.709,434.51 417.6,435.5 L395.1,410.7 C396.075,409.809 397.042,408.909 398,408 z" fill="#9E3704" fill-opacity="0.2"/>
<path d="M420.9,432.5 C419.809,433.51 418.709,434.51 417.6,435.5 L395.1,410.7 C396.075,409.809 397.042,408.909 398,408 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M417.6,435.5 C416.476,436.51 415.342,437.51 414.2,438.5 L392.2,413.2 C393.174,412.375 394.141,411.542 395.1,410.7 z" fill="#A23A06" fill-opacity="0.2"/>
<path d="M417.6,435.5 C416.476,436.51 415.342,437.51 414.2,438.5 L392.2,413.2 C393.174,412.375 394.141,411.542 395.1,410.7 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M394.3,454.2 C393.901,454.468 393.501,454.734 393.1,455 L373.9,427.6 C374.234,427.334 374.567,427.068 374.9,426.8 z" fill="#C2561A" fill-opacity="0.2"/>
<path d="M394.3,454.2 C393.901,454.468 393.501,454.734 393.1,455 L373.9,427.6 C374.234,427.334 374.567,427.068 374.9,426.8 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M393.1,455 C392.668,455.301 392.234,455.601 391.8,455.9 L372.8,428.3 C373.167,428.068 373.534,427.834 373.9,427.6 z" fill="#C5591C" fill-opacity="0.2"/>
<path d="M393.1,455 C392.668,455.301 392.234,455.601 391.8,455.9 L372.8,428.3 C373.167,428.068 373.534,427.834 373.9,427.6 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M391.8,455.9 C391.401,456.168 391.001,456.434 390.6,456.7 L371.8,429 C372.134,428.768 372.467,428.534 372.8,428.3 z" fill="#C85B1E" fill-opacity="0.2"/>
<path d="M391.8,455.9 C391.401,456.168 391.001,456.434 390.6,456.7 L371.8,429 C372.134,428.768 372.467,428.534 372.8,428.3 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M390.6,456.7 C390.201,457.001 389.801,457.301 389.4,457.6 L370.7,429.7 C371.067,429.468 371.434,429.234 371.8,429 z" fill="#CB5E20" fill-opacity="0.2"/>
<path d="M390.6,456.7 C390.201,457.001 389.801,457.301 389.4,457.6 L370.7,429.7 C371.067,429.468 371.434,429.234 371.8,429 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M389.4,457.6 C388.967,457.868 388.534,458.135 388.1,458.4 L369.6,430.5 C369.967,430.234 370.334,429.968 370.7,429.7 z" fill="#CE6122" fill-opacity="0.2"/>
<path d="M389.4,457.6 C388.967,457.868 388.534,458.135 388.1,458.4 L369.6,430.5 C369.967,430.234 370.334,429.968 370.7,429.7 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M388.1,458.4 C387.701,458.668 387.301,458.934 386.9,459.2 L368.5,431.2 C368.867,430.968 369.234,430.734 369.6,430.5 z" fill="#D26424" fill-opacity="0.2"/>
<path d="M388.1,458.4 C387.701,458.668 387.301,458.934 386.9,459.2 L368.5,431.2 C368.867,430.968 369.234,430.734 369.6,430.5 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M386.9,459.2 C386.467,459.468 386.034,459.735 385.6,460 L367.4,431.9 C367.767,431.668 368.134,431.434 368.5,431.2 z" fill="#D56725" fill-opacity="0.2"/>
<path d="M386.9,459.2 C386.467,459.468 386.034,459.735 385.6,460 L367.4,431.9 C367.767,431.668 368.134,431.434 368.5,431.2 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M414.2,438.5 C413.075,439.477 411.942,440.443 410.8,441.4 L389.3,415.8 C390.274,414.942 391.241,414.075 392.2,413.2 z" fill="#A53D08" fill-opacity="0.2"/>
<path d="M414.2,438.5 C413.075,439.477 411.942,440.443 410.8,441.4 L389.3,415.8 C390.274,414.942 391.241,414.075 392.2,413.2 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M385.6,460 C385.201,460.268 384.801,460.534 384.4,460.8 L366.4,432.6 C366.734,432.368 367.067,432.134 367.4,431.9 z" fill="#D86927" fill-opacity="0.2"/>
<path d="M385.6,460 C385.201,460.268 384.801,460.534 384.4,460.8 L366.4,432.6 C366.734,432.368 367.067,432.134 367.4,431.9 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M384.4,460.8 C383.967,461.068 383.534,461.335 383.1,461.6 L365.3,433.3 C365.667,433.068 366.034,432.834 366.4,432.6 z" fill="#DB6C29" fill-opacity="0.2"/>
<path d="M384.4,460.8 C383.967,461.068 383.534,461.335 383.1,461.6 L365.3,433.3 C365.667,433.068 366.034,432.834 366.4,432.6 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M410.8,441.4 C409.675,442.377 408.542,443.343 407.4,444.3 L386.3,418.2 C387.307,417.409 388.307,416.609 389.3,415.8 z" fill="#A8400A" fill-opacity="0.2"/>
<path d="M410.8,441.4 C409.675,442.377 408.542,443.343 407.4,444.3 L386.3,418.2 C387.307,417.409 388.307,416.609 389.3,415.8 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M383.1,461.6 C382.667,461.868 382.234,462.135 381.8,462.4 L364.2,434 C364.567,433.768 364.934,433.534 365.3,433.3 z" fill="#DF6F2B" fill-opacity="0.2"/>
<path d="M383.1,461.6 C382.667,461.868 382.234,462.135 381.8,462.4 L364.2,434 C364.567,433.768 364.934,433.534 365.3,433.3 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M381.8,462.4 C381.401,462.668 381.001,462.934 380.6,463.2 L363.1,434.6 C363.467,434.401 363.834,434.201 364.2,434 z" fill="#E2722D" fill-opacity="0.2"/>
<path d="M381.8,462.4 C381.401,462.668 381.001,462.934 380.6,463.2 L363.1,434.6 C363.467,434.401 363.834,434.201 364.2,434 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M380.6,463.2 C380.167,463.468 379.734,463.735 379.3,464 L362,435.3 C362.367,435.068 362.734,434.834 363.1,434.6 z" fill="#E5752F" fill-opacity="0.2"/>
<path d="M380.6,463.2 C380.167,463.468 379.734,463.735 379.3,464 L362,435.3 C362.367,435.068 362.734,434.834 363.1,434.6 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M379.3,464 C378.867,464.235 378.434,464.468 378,464.7 L360.9,436 C361.267,435.768 361.634,435.534 362,435.3 z" fill="#E87831" fill-opacity="0.2"/>
<path d="M379.3,464 C378.867,464.235 378.434,464.468 378,464.7 L360.9,436 C361.267,435.768 361.634,435.534 362,435.3 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M378,464.7 C377.567,464.968 377.134,465.235 376.7,465.5 L359.7,436.6 C360.101,436.401 360.501,436.201 360.9,436 z" fill="#EC7B33" fill-opacity="0.2"/>
<path d="M378,464.7 C377.567,464.968 377.134,465.235 376.7,465.5 L359.7,436.6 C360.101,436.401 360.501,436.201 360.9,436 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M376.7,465.5 C376.267,465.768 375.834,466.035 375.4,466.3 L358.6,437.3 C358.967,437.068 359.334,436.834 359.7,436.6 z" fill="#EF7D34" fill-opacity="0.2"/>
<path d="M376.7,465.5 C376.267,465.768 375.834,466.035 375.4,466.3 L358.6,437.3 C358.967,437.068 359.334,436.834 359.7,436.6 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M375.4,466.3 C374.967,466.535 374.534,466.768 374.1,467 L357.5,437.9 C357.867,437.701 358.234,437.501 358.6,437.3 z" fill="#F28036" fill-opacity="0.2"/>
<path d="M375.4,466.3 C374.967,466.535 374.534,466.768 374.1,467 L357.5,437.9 C357.867,437.701 358.234,437.501 358.6,437.3 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M374.1,467 C373.667,467.235 373.234,467.468 372.8,467.7 L356.4,438.6 C356.767,438.368 357.134,438.134 357.5,437.9 z" fill="#F58338" fill-opacity="0.2"/>
<path d="M374.1,467 C373.667,467.235 373.234,467.468 372.8,467.7 L356.4,438.6 C356.767,438.368 357.134,438.134 357.5,437.9 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M372.8,467.7 C372.367,467.968 371.934,468.235 371.5,468.5 L355.3,439.2 C355.667,439.001 356.034,438.801 356.4,438.6 z" fill="#F8863A" fill-opacity="0.2"/>
<path d="M372.8,467.7 C372.367,467.968 371.934,468.235 371.5,468.5 L355.3,439.2 C355.667,439.001 356.034,438.801 356.4,438.6 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M355.3,439.2 C335.659,450.118 314.438,457.911 292.4,462.3 L284.6,423.4 C302.577,419.798 319.883,413.422 335.9,404.5 z" fill="#D46912" fill-opacity="0.2"/>
<path d="M355.3,439.2 C335.659,450.118 314.438,457.911 292.4,462.3 L284.6,423.4 C302.577,419.798 319.883,413.422 335.9,404.5 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M325,488.5 C324.534,488.635 324.067,488.768 323.6,488.9 L313.7,456.9 C314.1,456.768 314.5,456.634 314.9,456.5 z" fill="#C6621E" fill-opacity="0.2"/>
<path d="M325,488.5 C324.534,488.635 324.067,488.768 323.6,488.9 L313.7,456.9 C314.1,456.768 314.5,456.634 314.9,456.5 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M350.1,479.1 C349.202,479.472 348.302,479.839 347.4,480.2 L334.3,449.4 C335.102,449.071 335.902,448.738 336.7,448.4 z" fill="#AB4A0A" fill-opacity="0.2"/>
<path d="M350.1,479.1 C349.202,479.472 348.302,479.839 347.4,480.2 L334.3,449.4 C335.102,449.071 335.902,448.738 336.7,448.4 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M323.6,488.9 C323.101,489.068 322.601,489.235 322.1,489.4 L312.5,457.3 C312.9,457.168 313.3,457.035 313.7,456.9 z" fill="#C96520" fill-opacity="0.2"/>
<path d="M323.6,488.9 C323.101,489.068 322.601,489.235 322.1,489.4 L312.5,457.3 C312.9,457.168 313.3,457.035 313.7,456.9 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M366.3,471.3 C364.973,472.012 363.64,472.712 362.3,473.4 L347.3,443.4 C348.438,442.843 349.572,442.277 350.7,441.7 z" fill="#9F3F02" fill-opacity="0.2"/>
<path d="M366.3,471.3 C364.973,472.012 363.64,472.712 362.3,473.4 L347.3,443.4 C348.438,442.843 349.572,442.277 350.7,441.7 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M322.1,489.4 C321.634,489.535 321.167,489.668 320.7,489.8 L311.2,457.7 C311.634,457.568 312.067,457.435 312.5,457.3 z" fill="#CC6822" fill-opacity="0.2"/>
<path d="M322.1,489.4 C321.634,489.535 321.167,489.668 320.7,489.8 L311.2,457.7 C311.634,457.568 312.067,457.435 312.5,457.3 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M320.7,489.8 C320.234,489.935 319.767,490.068 319.3,490.2 L310,458 C310.4,457.901 310.8,457.801 311.2,457.7 z" fill="#CF6B24" fill-opacity="0.2"/>
<path d="M320.7,489.8 C320.234,489.935 319.767,490.068 319.3,490.2 L310,458 C310.4,457.901 310.8,457.801 311.2,457.7 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M362.3,473.4 C360.972,474.045 359.639,474.678 358.3,475.3 L343.8,445.1 C344.972,444.544 346.138,443.977 347.3,443.4 z" fill="#A24104" fill-opacity="0.2"/>
<path d="M362.3,473.4 C360.972,474.045 359.639,474.678 358.3,475.3 L343.8,445.1 C344.972,444.544 346.138,443.977 347.3,443.4 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M347.4,480.2 C346.469,480.606 345.536,481.006 344.6,481.4 L332,450.4 C332.769,450.071 333.535,449.738 334.3,449.4 z" fill="#AE4C0D" fill-opacity="0.2"/>
<path d="M347.4,480.2 C346.469,480.606 345.536,481.006 344.6,481.4 L332,450.4 C332.769,450.071 333.535,449.738 334.3,449.4 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M344.6,481.4 C343.702,481.772 342.802,482.139 341.9,482.5 L329.6,451.4 C330.402,451.071 331.202,450.738 332,450.4 z" fill="#B14F0F" fill-opacity="0.2"/>
<path d="M344.6,481.4 C343.702,481.772 342.802,482.139 341.9,482.5 L329.6,451.4 C330.402,451.071 331.202,450.738 332,450.4 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M371.5,468.5 C369.778,469.454 368.044,470.387 366.3,471.3 L350.7,441.7 C352.243,440.885 353.777,440.052 355.3,439.2 z" fill="#9C3C00" fill-opacity="0.2"/>
<path d="M371.5,468.5 C369.778,469.454 368.044,470.387 366.3,471.3 L350.7,441.7 C352.243,440.885 353.777,440.052 355.3,439.2 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M341.9,482.5 C340.969,482.872 340.036,483.239 339.1,483.6 L327.1,452.3 C327.935,452.005 328.769,451.705 329.6,451.4 z" fill="#B45211" fill-opacity="0.2"/>
<path d="M341.9,482.5 C340.969,482.872 340.036,483.239 339.1,483.6 L327.1,452.3 C327.935,452.005 328.769,451.705 329.6,451.4 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M319.3,490.2 C318.8,490.335 318.3,490.468 317.8,490.6 L308.7,458.4 C309.134,458.268 309.567,458.135 310,458 z" fill="#D26D26" fill-opacity="0.2"/>
<path d="M319.3,490.2 C318.8,490.335 318.3,490.468 317.8,490.6 L308.7,458.4 C309.134,458.268 309.567,458.135 310,458 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M358.3,475.3 C356.939,475.946 355.572,476.579 354.2,477.2 L340.3,446.8 C341.472,446.244 342.638,445.677 343.8,445.1 z" fill="#A54406" fill-opacity="0.2"/>
<path d="M358.3,475.3 C356.939,475.946 355.572,476.579 354.2,477.2 L340.3,446.8 C341.472,446.244 342.638,445.677 343.8,445.1 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M354.2,477.2 C352.839,477.846 351.472,478.479 350.1,479.1 L336.7,448.4 C337.905,447.878 339.105,447.344 340.3,446.8 z" fill="#A84708" fill-opacity="0.2"/>
<path d="M354.2,477.2 C352.839,477.846 351.472,478.479 350.1,479.1 L336.7,448.4 C337.905,447.878 339.105,447.344 340.3,446.8 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M317.8,490.6 C317.334,490.735 316.867,490.868 316.4,491 L307.5,458.7 C307.9,458.601 308.3,458.501 308.7,458.4 z" fill="#D57028" fill-opacity="0.2"/>
<path d="M317.8,490.6 C317.334,490.735 316.867,490.868 316.4,491 L307.5,458.7 C307.9,458.601 308.3,458.501 308.7,458.4 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M316.4,491 C315.9,491.135 315.4,491.268 314.9,491.4 L306.2,459.1 C306.634,458.968 307.067,458.835 307.5,458.7 z" fill="#D8732A" fill-opacity="0.2"/>
<path d="M316.4,491 C315.9,491.135 315.4,491.268 314.9,491.4 L306.2,459.1 C306.634,458.968 307.067,458.835 307.5,458.7 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M314.9,491.4 C314.434,491.535 313.967,491.668 313.5,491.8 L305,459.4 C305.4,459.301 305.8,459.201 306.2,459.1 z" fill="#DB762C" fill-opacity="0.2"/>
<path d="M314.9,491.4 C314.434,491.535 313.967,491.668 313.5,491.8 L305,459.4 C305.4,459.301 305.8,459.201 306.2,459.1 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M313.5,491.8 C313.034,491.935 312.567,492.068 312.1,492.2 L303.7,459.7 C304.134,459.601 304.567,459.501 305,459.4 z" fill="#DE792E" fill-opacity="0.2"/>
<path d="M313.5,491.8 C313.034,491.935 312.567,492.068 312.1,492.2 L303.7,459.7 C304.134,459.601 304.567,459.501 305,459.4 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M339.1,483.6 C338.169,483.939 337.235,484.272 336.3,484.6 L324.7,453.2 C325.502,452.905 326.302,452.605 327.1,452.3 z" fill="#B75414" fill-opacity="0.2"/>
<path d="M339.1,483.6 C338.169,483.939 337.235,484.272 336.3,484.6 L324.7,453.2 C325.502,452.905 326.302,452.605 327.1,452.3 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M336.3,484.6 C335.369,484.972 334.436,485.339 333.5,485.7 L322.3,454.1 C323.102,453.805 323.902,453.505 324.7,453.2 z" fill="#BA5716" fill-opacity="0.2"/>
<path d="M336.3,484.6 C335.369,484.972 334.436,485.339 333.5,485.7 L322.3,454.1 C323.102,453.805 323.902,453.505 324.7,453.2 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M333.5,485.7 C332.568,486.005 331.635,486.306 330.7,486.6 L319.8,454.9 C320.635,454.638 321.468,454.372 322.3,454.1 z" fill="#BD5A18" fill-opacity="0.2"/>
<path d="M333.5,485.7 C332.568,486.005 331.635,486.306 330.7,486.6 L319.8,454.9 C320.635,454.638 321.468,454.372 322.3,454.1 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M312.1,492.2 C311.6,492.302 311.1,492.402 310.6,492.5 L302.5,460 C302.9,459.901 303.3,459.801 303.7,459.7 z" fill="#E17B31" fill-opacity="0.2"/>
<path d="M312.1,492.2 C311.6,492.302 311.1,492.402 310.6,492.5 L302.5,460 C302.9,459.901 303.3,459.801 303.7,459.7 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M310.6,492.5 C310.134,492.635 309.667,492.768 309.2,492.9 L301.2,460.4 C301.634,460.268 302.067,460.135 302.5,460 z" fill="#E47E33" fill-opacity="0.2"/>
<path d="M310.6,492.5 C310.134,492.635 309.667,492.768 309.2,492.9 L301.2,460.4 C301.634,460.268 302.067,460.135 302.5,460 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M309.2,492.9 C308.7,493.002 308.2,493.102 307.7,493.2 L300,460.7 C300.4,460.601 300.8,460.501 301.2,460.4 z" fill="#E78135" fill-opacity="0.2"/>
<path d="M309.2,492.9 C308.7,493.002 308.2,493.102 307.7,493.2 L300,460.7 C300.4,460.601 300.8,460.501 301.2,460.4 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M307.7,493.2 C307.234,493.335 306.767,493.468 306.3,493.6 L298.7,461 C299.134,460.901 299.567,460.801 300,460.7 z" fill="#EA8437" fill-opacity="0.2"/>
<path d="M307.7,493.2 C307.234,493.335 306.767,493.468 306.3,493.6 L298.7,461 C299.134,460.901 299.567,460.801 300,460.7 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M306.3,493.6 C305.8,493.702 305.3,493.802 304.8,493.9 L297.5,461.2 C297.9,461.134 298.3,461.068 298.7,461 z" fill="#ED8739" fill-opacity="0.2"/>
<path d="M306.3,493.6 C305.8,493.702 305.3,493.802 304.8,493.9 L297.5,461.2 C297.9,461.134 298.3,461.068 298.7,461 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M304.8,493.9 C304.3,494.002 303.8,494.102 303.3,494.2 L296.2,461.5 C296.634,461.401 297.067,461.301 297.5,461.2 z" fill="#F08A3B" fill-opacity="0.2"/>
<path d="M304.8,493.9 C304.3,494.002 303.8,494.102 303.3,494.2 L296.2,461.5 C296.634,461.401 297.067,461.301 297.5,461.2 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M303.3,494.2 C302.834,494.335 302.367,494.468 301.9,494.6 L294.9,461.8 C295.334,461.701 295.767,461.601 296.2,461.5 z" fill="#F38C3D" fill-opacity="0.2"/>
<path d="M303.3,494.2 C302.834,494.335 302.367,494.468 301.9,494.6 L294.9,461.8 C295.334,461.701 295.767,461.601 296.2,461.5 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M301.9,494.6 C301.4,494.702 300.9,494.802 300.4,494.9 L293.7,462.1 C294.1,462.001 294.5,461.901 294.9,461.8 z" fill="#F68F3F" fill-opacity="0.2"/>
<path d="M301.9,494.6 C301.4,494.702 300.9,494.802 300.4,494.9 L293.7,462.1 C294.1,462.001 294.5,461.901 294.9,461.8 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M330.7,486.6 C329.735,486.939 328.769,487.273 327.8,487.6 L317.4,455.7 C318.202,455.438 319.002,455.171 319.8,454.9 z" fill="#C05D1A" fill-opacity="0.2"/>
<path d="M330.7,486.6 C329.735,486.939 328.769,487.273 327.8,487.6 L317.4,455.7 C318.202,455.438 319.002,455.171 319.8,454.9 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M300.4,494.9 C299.934,495.001 299.467,495.101 299,495.2 L292.4,462.3 C292.834,462.235 293.267,462.168 293.7,462.1 z" fill="#F99241" fill-opacity="0.2"/>
<path d="M300.4,494.9 C299.934,495.001 299.467,495.101 299,495.2 L292.4,462.3 C292.834,462.235 293.267,462.168 293.7,462.1 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M327.8,487.6 C326.868,487.905 325.935,488.206 325,488.5 L314.9,456.5 C315.735,456.238 316.568,455.972 317.4,455.7 z" fill="#C35F1C" fill-opacity="0.2"/>
<path d="M327.8,487.6 C326.868,487.905 325.935,488.206 325,488.5 L314.9,456.5 C315.735,456.238 316.568,455.972 317.4,455.7 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M229.3,465.5 C222.458,464.858 215.65,463.89 208.9,462.6 L216.4,423.6 C221.925,424.665 227.498,425.466 233.1,426 z" fill="#EA8D2C" fill-opacity="0.2"/>
<path d="M229.3,465.5 C222.458,464.858 215.65,463.89 208.9,462.6 L216.4,423.6 C221.925,424.665 227.498,425.466 233.1,426 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M221.7,498.4 C220.699,498.273 219.699,498.139 218.7,498 L222.9,464.8 C223.766,464.905 224.633,465.005 225.5,465.1 z" fill="#B8670A" fill-opacity="0.2"/>
<path d="M221.7,498.4 C220.699,498.273 219.699,498.139 218.7,498 L222.9,464.8 C223.766,464.905 224.633,465.005 225.5,465.1 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M212.8,497.2 C212.3,497.135 211.8,497.068 211.3,497 L216.5,463.9 C216.933,463.968 217.366,464.035 217.8,464.1 z" fill="#CC7E23" fill-opacity="0.2"/>
<path d="M212.8,497.2 C212.3,497.135 211.8,497.068 211.3,497 L216.5,463.9 C216.933,463.968 217.366,464.035 217.8,464.1 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M211.3,497 C210.833,496.935 210.366,496.868 209.9,496.8 L215.2,463.7 C215.633,463.768 216.066,463.835 216.5,463.9 z" fill="#D2862A" fill-opacity="0.2"/>
<path d="M211.3,497 C210.833,496.935 210.366,496.868 209.9,496.8 L215.2,463.7 C215.633,463.768 216.066,463.835 216.5,463.9 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M209.9,496.8 C209.4,496.702 208.9,496.602 208.4,496.5 L214,463.5 C214.4,463.568 214.8,463.634 215.2,463.7 z" fill="#D98E31" fill-opacity="0.2"/>
<path d="M209.9,496.8 C209.4,496.702 208.9,496.602 208.4,496.5 L214,463.5 C214.4,463.568 214.8,463.634 215.2,463.7 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M226.1,498.9 C224.632,498.746 223.165,498.58 221.7,498.4 L225.5,465.1 C226.765,465.245 228.032,465.378 229.3,465.5 z" fill="#B25F00" fill-opacity="0.2"/>
<path d="M226.1,498.9 C224.632,498.746 223.165,498.58 221.7,498.4 L225.5,465.1 C226.765,465.245 228.032,465.378 229.3,465.5 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M208.4,496.5 C207.9,496.435 207.4,496.368 206.9,496.3 L212.7,463.3 C213.133,463.368 213.566,463.435 214,463.5 z" fill="#DF9638" fill-opacity="0.2"/>
<path d="M208.4,496.5 C207.9,496.435 207.4,496.368 206.9,496.3 L212.7,463.3 C213.133,463.368 213.566,463.435 214,463.5 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M218.7,498 C217.733,497.872 216.766,497.739 215.8,497.6 L220.4,464.5 C221.233,464.605 222.066,464.705 222.9,464.8 z" fill="#BF6E13" fill-opacity="0.2"/>
<path d="M218.7,498 C217.733,497.872 216.766,497.739 215.8,497.6 L220.4,464.5 C221.233,464.605 222.066,464.705 222.9,464.8 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M215.8,497.6 C214.799,497.473 213.799,497.339 212.8,497.2 L217.8,464.1 C218.666,464.239 219.533,464.372 220.4,464.5 z" fill="#C5761B" fill-opacity="0.2"/>
<path d="M215.8,497.6 C214.799,497.473 213.799,497.339 212.8,497.2 L217.8,464.1 C218.666,464.239 219.533,464.372 220.4,464.5 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M206.9,496.3 C206.4,496.202 205.9,496.102 205.4,496 L211.4,463 C211.833,463.101 212.266,463.201 212.7,463.3 z" fill="#E69E3F" fill-opacity="0.2"/>
<path d="M206.9,496.3 C206.4,496.202 205.9,496.102 205.4,496 L211.4,463 C211.833,463.101 212.266,463.201 212.7,463.3 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M205.4,496 C204.933,495.901 204.466,495.801 204,495.7 L210.1,462.8 C210.533,462.868 210.966,462.935 211.4,463 z" fill="#ECA646" fill-opacity="0.2"/>
<path d="M205.4,496 C204.933,495.901 204.466,495.801 204,495.7 L210.1,462.8 C210.533,462.868 210.966,462.935 211.4,463 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M204,495.7 C203.5,495.602 203,495.502 202.5,495.4 L208.9,462.6 C209.3,462.668 209.7,462.734 210.1,462.8 z" fill="#F2AE4E" fill-opacity="0.2"/>
<path d="M204,495.7 C203.5,495.602 203,495.502 202.5,495.4 L208.9,462.6 C209.3,462.668 209.7,462.734 210.1,462.8 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M208.9,462.6 C202.977,461.446 197.106,460.045 191.3,458.4 L202,420.1 C206.749,421.467 211.553,422.635 216.4,423.6 z" fill="#F19835" fill-opacity="0.2"/>
<path d="M208.9,462.6 C202.977,461.446 197.106,460.045 191.3,458.4 L202,420.1 C206.749,421.467 211.553,422.635 216.4,423.6 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M193.7,493.6 C193.233,493.468 192.766,493.335 192.3,493.2 L200,460.7 C200.433,460.801 200.866,460.901 201.3,461 z" fill="#CB811F" fill-opacity="0.2"/>
<path d="M193.7,493.6 C193.233,493.468 192.766,493.335 192.3,493.2 L200,460.7 C200.433,460.801 200.866,460.901 201.3,461 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M192.3,493.2 C191.8,493.102 191.3,493.002 190.8,492.9 L198.8,460.4 C199.2,460.501 199.6,460.601 200,460.7 z" fill="#D18927" fill-opacity="0.2"/>
<path d="M192.3,493.2 C191.8,493.102 191.3,493.002 190.8,492.9 L198.8,460.4 C199.2,460.501 199.6,460.601 200,460.7 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M190.8,492.9 C190.333,492.768 189.866,492.635 189.4,492.5 L197.5,460 C197.933,460.135 198.366,460.268 198.8,460.4 z" fill="#D6912F" fill-opacity="0.2"/>
<path d="M190.8,492.9 C190.333,492.768 189.866,492.635 189.4,492.5 L197.5,460 C197.933,460.135 198.366,460.268 198.8,460.4 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M202.5,495.4 C201.532,495.239 200.566,495.072 199.6,494.9 L206.3,462.1 C207.166,462.272 208.032,462.439 208.9,462.6 z" fill="#B96A00" fill-opacity="0.2"/>
<path d="M202.5,495.4 C201.532,495.239 200.566,495.072 199.6,494.9 L206.3,462.1 C207.166,462.272 208.032,462.439 208.9,462.6 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M199.6,494.9 C198.632,494.672 197.665,494.439 196.7,494.2 L203.8,461.5 C204.632,461.705 205.465,461.905 206.3,462.1 z" fill="#BF720C" fill-opacity="0.2"/>
<path d="M199.6,494.9 C198.632,494.672 197.665,494.439 196.7,494.2 L203.8,461.5 C204.632,461.705 205.465,461.905 206.3,462.1 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M189.4,492.5 C188.9,492.402 188.4,492.302 187.9,492.2 L196.3,459.7 C196.7,459.801 197.1,459.901 197.5,460 z" fill="#DC9937" fill-opacity="0.2"/>
<path d="M189.4,492.5 C188.9,492.402 188.4,492.302 187.9,492.2 L196.3,459.7 C196.7,459.801 197.1,459.901 197.5,460 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M187.9,492.2 C187.433,492.068 186.966,491.935 186.5,491.8 L195,459.4 C195.433,459.501 195.866,459.601 196.3,459.7 z" fill="#E2A13E" fill-opacity="0.2"/>
<path d="M187.9,492.2 C187.433,492.068 186.966,491.935 186.5,491.8 L195,459.4 C195.433,459.501 195.866,459.601 196.3,459.7 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M186.5,491.8 C186.033,491.668 185.566,491.535 185.1,491.4 L193.8,459.1 C194.2,459.201 194.6,459.301 195,459.4 z" fill="#E8A946" fill-opacity="0.2"/>
<path d="M186.5,491.8 C186.033,491.668 185.566,491.535 185.1,491.4 L193.8,459.1 C194.2,459.201 194.6,459.301 195,459.4 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M185.1,491.4 C184.6,491.268 184.1,491.135 183.6,491 L192.5,458.7 C192.933,458.835 193.366,458.968 193.8,459.1 z" fill="#EEB14E" fill-opacity="0.2"/>
<path d="M185.1,491.4 C184.6,491.268 184.1,491.135 183.6,491 L192.5,458.7 C192.933,458.835 193.366,458.968 193.8,459.1 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M183.6,491 C183.133,490.868 182.666,490.735 182.2,490.6 L191.3,458.4 C191.7,458.501 192.1,458.601 192.5,458.7 z" fill="#F3B955" fill-opacity="0.2"/>
<path d="M183.6,491 C183.133,490.868 182.666,490.735 182.2,490.6 L191.3,458.4 C191.7,458.501 192.1,458.601 192.5,458.7 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M196.7,494.2 C195.699,494.006 194.699,493.806 193.7,493.6 L201.3,461 C202.132,461.172 202.966,461.338 203.8,461.5 z" fill="#C57A16" fill-opacity="0.2"/>
<path d="M196.7,494.2 C195.699,494.006 194.699,493.806 193.7,493.6 L201.3,461 C202.132,461.172 202.966,461.338 203.8,461.5 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M250,73.2 C309.453,73.213 364.919,103.106 397.619,152.76 C430.318,202.413 435.872,265.176 412.4,319.8 L364.8,299.4 C381.416,260.778 377.503,216.39 354.385,181.272 C331.268,146.153 292.044,125.008 250,125 z" fill="#1F77B4" fill-opacity="0.2"/>
<path d="M250,73.2 C309.453,73.213 364.919,103.106 397.619,152.76 C430.318,202.413 435.872,265.176 412.4,319.8 L364.8,299.4 C381.416,260.778 377.503,216.39 354.385,181.272 C331.268,146.153 292.044,125.008 250,125 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M466.1,237.1 C466.839,249.135 466.571,261.21 465.3,273.2 L425.8,269 C426.861,259.17 427.095,249.269 426.5,239.4 z" fill="#3777B4" fill-opacity="0.2"/>
<path d="M466.1,237.1 C466.839,249.135 466.571,261.21 465.3,273.2 L425.8,269 C426.861,259.17 427.095,249.269 426.5,239.4 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M499.8,260.4 C499.768,260.9 499.735,261.4 499.7,261.9 L466.3,260.3 C466.301,259.867 466.301,259.433 466.3,259 z" fill="#336CA7" fill-opacity="0.2"/>
<path d="M499.8,260.4 C499.768,260.9 499.735,261.4 499.7,261.9 L466.3,260.3 C466.301,259.867 466.301,259.433 466.3,259 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M499.7,261.9 C499.668,262.4 499.635,262.9 499.6,263.4 L466.2,261.6 C466.235,261.167 466.268,260.733 466.3,260.3 z" fill="#3870AC" fill-opacity="0.2"/>
<path d="M499.7,261.9 C499.668,262.4 499.635,262.9 499.6,263.4 L466.2,261.6 C466.235,261.167 466.268,260.733 466.3,260.3 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M499.9,242.5 C499.939,243.5 499.973,244.5 500,245.5 L466.5,246.1 C466.472,245.233 466.439,244.366 466.4,243.5 z" fill="#0B5089" fill-opacity="0.2"/>
<path d="M499.9,242.5 C499.939,243.5 499.973,244.5 500,245.5 L466.5,246.1 C466.472,245.233 466.439,244.366 466.4,243.5 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M499.6,235.1 C499.737,237.565 499.837,240.032 499.9,242.5 L466.4,243.5 C466.332,241.365 466.232,239.232 466.1,237.1 z" fill="#004C84" fill-opacity="0.2"/>
<path d="M499.6,235.1 C499.737,237.565 499.837,240.032 499.9,242.5 L466.4,243.5 C466.332,241.365 466.232,239.232 466.1,237.1 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M499.6,263.4 C499.602,263.9 499.602,264.4 499.6,264.9 L466.1,262.9 C466.135,262.467 466.168,262.033 466.2,261.6 z" fill="#3D75B1" fill-opacity="0.2"/>
<path d="M499.6,263.4 C499.602,263.9 499.602,264.4 499.6,264.9 L466.1,262.9 C466.135,262.467 466.168,262.033 466.2,261.6 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M499.6,264.9 C499.568,265.4 499.535,265.9 499.5,266.4 L466,264.2 C466.035,263.767 466.068,263.333 466.1,262.9 z" fill="#427AB6" fill-opacity="0.2"/>
<path d="M499.6,264.9 C499.568,265.4 499.535,265.9 499.5,266.4 L466,264.2 C466.035,263.767 466.068,263.333 466.1,262.9 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M500,245.5 C500.006,246.5 500.006,247.5 500,248.5 L466.5,248.7 C466.505,247.833 466.505,246.967 466.5,246.1 z" fill="#14558E" fill-opacity="0.2"/>
<path d="M500,245.5 C500.006,246.5 500.006,247.5 500,248.5 L466.5,248.7 C466.505,247.833 466.505,246.967 466.5,246.1 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M499.5,266.4 C499.468,266.9 499.435,267.4 499.4,267.9 L466,265.5 C466.001,265.067 466.001,264.633 466,264.2 z" fill="#477FBC" fill-opacity="0.2"/>
<path d="M499.5,266.4 C499.468,266.9 499.435,267.4 499.4,267.9 L466,265.5 C466.001,265.067 466.001,264.633 466,264.2 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M500,248.5 C500.006,249.5 500.006,250.5 500,251.5 L466.5,251.3 C466.505,250.433 466.505,249.567 466.5,248.7 z" fill="#1C5993" fill-opacity="0.2"/>
<path d="M500,248.5 C500.006,249.5 500.006,250.5 500,251.5 L466.5,251.3 C466.505,250.433 466.505,249.567 466.5,248.7 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M500,251.5 C500.006,252.5 500.006,253.5 500,254.5 L466.5,253.9 C466.505,253.033 466.505,252.167 466.5,251.3 z" fill="#225E98" fill-opacity="0.2"/>
<path d="M500,251.5 C500.006,252.5 500.006,253.5 500,254.5 L466.5,253.9 C466.505,253.033 466.505,252.167 466.5,251.3 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M499.4,267.9 C499.335,268.4 499.268,268.9 499.2,269.4 L465.9,266.8 C465.935,266.367 465.968,265.933 466,265.5 z" fill="#4C83C1" fill-opacity="0.2"/>
<path d="M499.4,267.9 C499.335,268.4 499.268,268.9 499.2,269.4 L465.9,266.8 C465.935,266.367 465.968,265.933 466,265.5 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M499.2,269.4 C499.168,269.9 499.135,270.4 499.1,270.9 L465.7,268.1 C465.768,267.667 465.835,267.234 465.9,266.8 z" fill="#5188C6" fill-opacity="0.2"/>
<path d="M499.2,269.4 C499.168,269.9 499.135,270.4 499.1,270.9 L465.7,268.1 C465.768,267.667 465.835,267.234 465.9,266.8 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M499.1,270.9 C499.068,271.4 499.035,271.9 499,272.4 L465.6,269.4 C465.635,268.967 465.668,268.533 465.7,268.1 z" fill="#568DCB" fill-opacity="0.2"/>
<path d="M499.1,270.9 C499.068,271.4 499.035,271.9 499,272.4 L465.6,269.4 C465.635,268.967 465.668,268.533 465.7,268.1 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M500,254.5 C499.973,255.5 499.939,256.5 499.9,257.5 L466.4,256.5 C466.439,255.634 466.472,254.767 466.5,253.9 z" fill="#28629D" fill-opacity="0.2"/>
<path d="M500,254.5 C499.973,255.5 499.939,256.5 499.9,257.5 L466.4,256.5 C466.439,255.634 466.472,254.767 466.5,253.9 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M499,272.4 C498.968,272.9 498.935,273.4 498.9,273.9 L465.5,270.7 C465.535,270.267 465.568,269.833 465.6,269.4 z" fill="#5B92D1" fill-opacity="0.2"/>
<path d="M499,272.4 C498.968,272.9 498.935,273.4 498.9,273.9 L465.5,270.7 C465.535,270.267 465.568,269.833 465.6,269.4 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M498.9,273.9 C498.835,274.367 498.768,274.834 498.7,275.3 L465.4,271.9 C465.434,271.5 465.468,271.1 465.5,270.7 z" fill="#6097D6" fill-opacity="0.2"/>
<path d="M498.9,273.9 C498.835,274.367 498.768,274.834 498.7,275.3 L465.4,271.9 C465.434,271.5 465.468,271.1 465.5,270.7 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M498.7,275.3 C498.668,275.8 498.635,276.3 498.6,276.8 L465.3,273.2 C465.335,272.767 465.368,272.333 465.4,271.9 z" fill="#649CDB" fill-opacity="0.2"/>
<path d="M498.7,275.3 C498.668,275.8 498.635,276.3 498.6,276.8 L465.3,273.2 C465.335,272.767 465.368,272.333 465.4,271.9 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M499.9,257.5 C499.872,258.467 499.839,259.434 499.8,260.4 L466.3,259 C466.338,258.167 466.371,257.334 466.4,256.5 z" fill="#2E67A2" fill-opacity="0.2"/>
<path d="M499.9,257.5 C499.872,258.467 499.839,259.434 499.8,260.4 L466.3,259 C466.338,258.167 466.371,257.334 466.4,256.5 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M369.6,69.5 C384.356,79.28 397.857,90.833 409.8,103.9 L380.5,130.7 C370.756,120.028 359.741,110.591 347.7,102.6 z" fill="#185A94" fill-opacity="0.2"/>
<path d="M369.6,69.5 C384.356,79.28 397.857,90.833 409.8,103.9 L380.5,130.7 C370.756,120.028 359.741,110.591 347.7,102.6 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M417.6,64.5 C417.968,64.832 418.334,65.166 418.7,65.5 L396.1,90.2 C395.768,89.899 395.434,89.599 395.1,89.3 z" fill="#26518A" fill-opacity="0.2"/>
<path d="M417.6,64.5 C417.968,64.832 418.334,65.166 418.7,65.5 L396.1,90.2 C395.768,89.899 395.434,89.599 395.1,89.3 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M399.1,49.3 C399.904,49.895 400.704,50.495 401.5,51.1 L381.2,77.8 C380.503,77.262 379.803,76.729 379.1,76.2 z" fill="#0C3970" fill-opacity="0.2"/>
<path d="M399.1,49.3 C399.904,49.895 400.704,50.495 401.5,51.1 L381.2,77.8 C380.503,77.262 379.803,76.729 379.1,76.2 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M401.5,51.1 C402.304,51.728 403.104,52.362 403.9,53 L383.2,79.4 C382.536,78.863 381.87,78.329 381.2,77.8 z" fill="#103C73" fill-opacity="0.2"/>
<path d="M401.5,51.1 C402.304,51.728 403.104,52.362 403.9,53 L383.2,79.4 C382.536,78.863 381.87,78.329 381.2,77.8 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M403.9,53 C404.67,53.596 405.437,54.196 406.2,54.8 L385.3,81 C384.603,80.462 383.903,79.929 383.2,79.4 z" fill="#143F76" fill-opacity="0.2"/>
<path d="M403.9,53 C404.67,53.596 405.437,54.196 406.2,54.8 L385.3,81 C384.603,80.462 383.903,79.929 383.2,79.4 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M418.7,65.5 C419.068,65.832 419.434,66.166 419.8,66.5 L397,91.1 C396.701,90.799 396.401,90.499 396.1,90.2 z" fill="#29548E" fill-opacity="0.2"/>
<path d="M418.7,65.5 C419.068,65.832 419.434,66.166 419.8,66.5 L397,91.1 C396.701,90.799 396.401,90.499 396.1,90.2 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M419.8,66.5 C420.168,66.832 420.534,67.166 420.9,67.5 L398,92 C397.668,91.699 397.334,91.399 397,91.1 z" fill="#2C5791" fill-opacity="0.2"/>
<path d="M419.8,66.5 C420.168,66.832 420.534,67.166 420.9,67.5 L398,92 C397.668,91.699 397.334,91.399 397,91.1 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M420.9,67.5 C421.268,67.832 421.634,68.166 422,68.5 L398.9,92.8 C398.601,92.533 398.301,92.266 398,92 z" fill="#2F5A94" fill-opacity="0.2"/>
<path d="M420.9,67.5 C421.268,67.832 421.634,68.166 422,68.5 L398.9,92.8 C398.601,92.533 398.301,92.266 398,92 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M422,68.5 C422.334,68.866 422.668,69.232 423,69.6 L399.9,93.7 C399.568,93.399 399.234,93.099 398.9,92.8 z" fill="#315D98" fill-opacity="0.2"/>
<path d="M422,68.5 C422.334,68.866 422.668,69.232 423,69.6 L399.9,93.7 C399.568,93.399 399.234,93.099 398.9,92.8 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M423,69.6 C423.368,69.932 423.734,70.266 424.1,70.6 L400.8,94.6 C400.501,94.299 400.201,93.999 399.9,93.7 z" fill="#34609B" fill-opacity="0.2"/>
<path d="M423,69.6 C423.368,69.932 423.734,70.266 424.1,70.6 L400.8,94.6 C400.501,94.299 400.201,93.999 399.9,93.7 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M424.1,70.6 C424.468,70.932 424.834,71.266 425.2,71.6 L401.7,95.5 C401.401,95.199 401.101,94.899 400.8,94.6 z" fill="#37639F" fill-opacity="0.2"/>
<path d="M424.1,70.6 C424.468,70.932 424.834,71.266 425.2,71.6 L401.7,95.5 C401.401,95.199 401.101,94.899 400.8,94.6 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M425.2,71.6 C425.534,71.966 425.868,72.332 426.2,72.7 L402.6,96.5 C402.301,96.166 402.001,95.832 401.7,95.5 z" fill="#3967A2" fill-opacity="0.2"/>
<path d="M425.2,71.6 C425.534,71.966 425.868,72.332 426.2,72.7 L402.6,96.5 C402.301,96.166 402.001,95.832 401.7,95.5 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M388.1,41.6 C389.341,42.422 390.574,43.256 391.8,44.1 L372.8,71.7 C371.74,70.957 370.673,70.224 369.6,69.5 z" fill="#003166" fill-opacity="0.2"/>
<path d="M388.1,41.6 C389.341,42.422 390.574,43.256 391.8,44.1 L372.8,71.7 C371.74,70.957 370.673,70.224 369.6,69.5 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M406.2,54.8 C406.97,55.429 407.737,56.062 408.5,56.7 L387.3,82.6 C386.637,82.063 385.97,81.529 385.3,81 z" fill="#17427A" fill-opacity="0.2"/>
<path d="M406.2,54.8 C406.97,55.429 407.737,56.062 408.5,56.7 L387.3,82.6 C386.637,82.063 385.97,81.529 385.3,81 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M391.8,44.1 C393.041,44.955 394.275,45.822 395.5,46.7 L376,73.9 C374.94,73.157 373.873,72.424 372.8,71.7 z" fill="#043469" fill-opacity="0.2"/>
<path d="M391.8,44.1 C393.041,44.955 394.275,45.822 395.5,46.7 L376,73.9 C374.94,73.157 373.873,72.424 372.8,71.7 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M395.5,46.7 C396.708,47.556 397.908,48.423 399.1,49.3 L379.1,76.2 C378.074,75.424 377.04,74.657 376,73.9 z" fill="#08376C" fill-opacity="0.2"/>
<path d="M395.5,46.7 C396.708,47.556 397.908,48.423 399.1,49.3 L379.1,76.2 C378.074,75.424 377.04,74.657 376,73.9 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M408.5,56.7 C409.27,57.329 410.037,57.962 410.8,58.6 L389.3,84.2 C388.636,83.663 387.97,83.129 387.3,82.6 z" fill="#1B457D" fill-opacity="0.2"/>
<path d="M408.5,56.7 C409.27,57.329 410.037,57.962 410.8,58.6 L389.3,84.2 C388.636,83.663 387.97,83.129 387.3,82.6 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M426.2,72.7 C426.568,73.066 426.934,73.432 427.3,73.8 L403.5,97.4 C403.201,97.099 402.901,96.799 402.6,96.5 z" fill="#3C6AA6" fill-opacity="0.2"/>
<path d="M426.2,72.7 C426.568,73.066 426.934,73.432 427.3,73.8 L403.5,97.4 C403.201,97.099 402.901,96.799 402.6,96.5 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M427.3,73.8 C427.668,74.132 428.034,74.466 428.4,74.8 L404.5,98.3 C404.168,97.999 403.834,97.699 403.5,97.4 z" fill="#3F6DA9" fill-opacity="0.2"/>
<path d="M427.3,73.8 C427.668,74.132 428.034,74.466 428.4,74.8 L404.5,98.3 C404.168,97.999 403.834,97.699 403.5,97.4 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M410.8,58.6 C411.57,59.229 412.337,59.862 413.1,60.5 L391.2,85.9 C390.57,85.33 389.937,84.763 389.3,84.2 z" fill="#1E4880" fill-opacity="0.2"/>
<path d="M410.8,58.6 C411.57,59.229 412.337,59.862 413.1,60.5 L391.2,85.9 C390.57,85.33 389.937,84.763 389.3,84.2 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M428.4,74.8 C428.734,75.166 429.068,75.532 429.4,75.9 L405.4,99.2 C405.101,98.899 404.801,98.599 404.5,98.3 z" fill="#4170AC" fill-opacity="0.2"/>
<path d="M428.4,74.8 C428.734,75.166 429.068,75.532 429.4,75.9 L405.4,99.2 C405.101,98.899 404.801,98.599 404.5,98.3 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M429.4,75.9 C429.734,76.266 430.068,76.632 430.4,77 L406.3,100.1 C406.001,99.799 405.701,99.499 405.4,99.2 z" fill="#4473B0" fill-opacity="0.2"/>
<path d="M429.4,75.9 C429.734,76.266 430.068,76.632 430.4,77 L406.3,100.1 C406.001,99.799 405.701,99.499 405.4,99.2 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M413.1,60.5 C413.871,61.162 414.637,61.829 415.4,62.5 L393.2,87.6 C392.537,87.029 391.87,86.463 391.2,85.9 z" fill="#214B84" fill-opacity="0.2"/>
<path d="M413.1,60.5 C413.871,61.162 414.637,61.829 415.4,62.5 L393.2,87.6 C392.537,87.029 391.87,86.463 391.2,85.9 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M415.4,62.5 C416.137,63.162 416.871,63.829 417.6,64.5 L395.1,89.3 C394.47,88.73 393.837,88.163 393.2,87.6 z" fill="#234E87" fill-opacity="0.2"/>
<path d="M415.4,62.5 C416.137,63.162 416.871,63.829 417.6,64.5 L395.1,89.3 C394.47,88.73 393.837,88.163 393.2,87.6 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M430.4,77 C430.768,77.332 431.134,77.666 431.5,78 L407.2,101.1 C406.901,100.766 406.601,100.432 406.3,100.1 z" fill="#4777B3" fill-opacity="0.2"/>
<path d="M430.4,77 C430.768,77.332 431.134,77.666 431.5,78 L407.2,101.1 C406.901,100.766 406.601,100.432 406.3,100.1 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M431.5,78 C431.834,78.366 432.168,78.732 432.5,79.1 L408,102 C407.734,101.699 407.467,101.399 407.2,101.1 z" fill="#497AB7" fill-opacity="0.2"/>
<path d="M431.5,78 C431.834,78.366 432.168,78.732 432.5,79.1 L408,102 C407.734,101.699 407.467,101.399 407.2,101.1 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M432.5,79.1 C432.834,79.466 433.168,79.832 433.5,80.2 L408.9,103 C408.601,102.666 408.301,102.332 408,102 z" fill="#4C7DBA" fill-opacity="0.2"/>
<path d="M432.5,79.1 C432.834,79.466 433.168,79.832 433.5,80.2 L408.9,103 C408.601,102.666 408.301,102.332 408,102 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M433.5,80.2 C433.834,80.566 434.168,80.932 434.5,81.3 L409.8,103.9 C409.501,103.599 409.201,103.299 408.9,103 z" fill="#4F80BE" fill-opacity="0.2"/>
<path d="M433.5,80.2 C433.834,80.566 434.168,80.932 434.5,81.3 L409.8,103.9 C409.501,103.599 409.201,103.299 408.9,103 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M439.8,145.9 C447.7,160.28 453.94,175.511 458.4,191.3 L420.1,202 C416.481,189.136 411.416,176.723 405,165 z" fill="#2969A4" fill-opacity="0.2"/>
<path d="M439.8,145.9 C447.7,160.28 453.94,175.511 458.4,191.3 L420.1,202 C416.481,189.136 411.416,176.723 405,165 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M469.2,129.8 C470.863,132.833 472.464,135.9 474,139 L444,153.9 C442.656,151.204 441.256,148.537 439.8,145.9 z" fill="#003F75" fill-opacity="0.2"/>
<path d="M469.2,129.8 C470.863,132.833 472.464,135.9 474,139 L444,153.9 C442.656,151.204 441.256,148.537 439.8,145.9 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M482,156.7 C482.372,157.631 482.739,158.564 483.1,159.5 L451.8,171.6 C451.505,170.798 451.205,169.998 450.9,169.2 z" fill="#21548C" fill-opacity="0.2"/>
<path d="M482,156.7 C482.372,157.631 482.739,158.564 483.1,159.5 L451.8,171.6 C451.505,170.798 451.205,169.998 450.9,169.2 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M476.6,144.4 C477.246,145.761 477.879,147.128 478.5,148.5 L447.9,162.1 C447.377,160.929 446.844,159.762 446.3,158.6 z" fill="#10477E" fill-opacity="0.2"/>
<path d="M476.6,144.4 C477.246,145.761 477.879,147.128 478.5,148.5 L447.9,162.1 C447.377,160.929 446.844,159.762 446.3,158.6 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M486.1,167.9 C486.268,168.366 486.435,168.833 486.6,169.3 L454.9,180.2 C454.768,179.766 454.635,179.333 454.5,178.9 z" fill="#3365A0" fill-opacity="0.2"/>
<path d="M486.1,167.9 C486.268,168.366 486.435,168.833 486.6,169.3 L454.9,180.2 C454.768,179.766 454.635,179.333 454.5,178.9 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M483.1,159.5 C483.439,160.431 483.772,161.365 484.1,162.3 L452.8,174.1 C452.472,173.265 452.139,172.431 451.8,171.6 z" fill="#255891" fill-opacity="0.2"/>
<path d="M483.1,159.5 C483.439,160.431 483.772,161.365 484.1,162.3 L452.8,174.1 C452.472,173.265 452.139,172.431 451.8,171.6 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M484.1,162.3 C484.439,163.231 484.772,164.165 485.1,165.1 L453.6,176.5 C453.338,175.698 453.071,174.898 452.8,174.1 z" fill="#2A5C96" fill-opacity="0.2"/>
<path d="M484.1,162.3 C484.439,163.231 484.772,164.165 485.1,165.1 L453.6,176.5 C453.338,175.698 453.071,174.898 452.8,174.1 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M478.5,148.5 C479.079,149.862 479.645,151.228 480.2,152.6 L449.4,165.7 C448.911,164.496 448.411,163.295 447.9,162.1 z" fill="#164B83" fill-opacity="0.2"/>
<path d="M478.5,148.5 C479.079,149.862 479.645,151.228 480.2,152.6 L449.4,165.7 C448.911,164.496 448.411,163.295 447.9,162.1 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M474,139 C474.888,140.79 475.755,142.59 476.6,144.4 L446.3,158.6 C445.552,157.024 444.786,155.457 444,153.9 z" fill="#08437A" fill-opacity="0.2"/>
<path d="M474,139 C474.888,140.79 475.755,142.59 476.6,144.4 L446.3,158.6 C445.552,157.024 444.786,155.457 444,153.9 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M486.6,169.3 C486.768,169.799 486.935,170.299 487.1,170.8 L455.3,181.4 C455.168,181 455.034,180.6 454.9,180.2 z" fill="#3769A4" fill-opacity="0.2"/>
<path d="M486.6,169.3 C486.768,169.799 486.935,170.299 487.1,170.8 L455.3,181.4 C455.168,181 455.034,180.6 454.9,180.2 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M487.1,170.8 C487.268,171.266 487.435,171.733 487.6,172.2 L455.7,182.6 C455.568,182.2 455.435,181.8 455.3,181.4 z" fill="#3C6EA9" fill-opacity="0.2"/>
<path d="M487.1,170.8 C487.268,171.266 487.435,171.733 487.6,172.2 L455.7,182.6 C455.568,182.2 455.435,181.8 455.3,181.4 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M480.2,152.6 C480.812,153.961 481.412,155.328 482,156.7 L450.9,169.2 C450.41,168.029 449.91,166.862 449.4,165.7 z" fill="#1B4F88" fill-opacity="0.2"/>
<path d="M480.2,152.6 C480.812,153.961 481.412,155.328 482,156.7 L450.9,169.2 C450.41,168.029 449.91,166.862 449.4,165.7 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M485.1,165.1 C485.439,166.031 485.772,166.965 486.1,167.9 L454.5,178.9 C454.205,178.098 453.905,177.298 453.6,176.5 z" fill="#2F619B" fill-opacity="0.2"/>
<path d="M485.1,165.1 C485.439,166.031 485.772,166.965 486.1,167.9 L454.5,178.9 C454.205,178.098 453.905,177.298 453.6,176.5 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M487.6,172.2 C487.735,172.666 487.868,173.133 488,173.6 L456.1,183.8 C455.968,183.4 455.835,183 455.7,182.6 z" fill="#4072AE" fill-opacity="0.2"/>
<path d="M487.6,172.2 C487.735,172.666 487.868,173.133 488,173.6 L456.1,183.8 C455.968,183.4 455.835,183 455.7,182.6 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M488,173.6 C488.168,174.066 488.335,174.533 488.5,175 L456.5,185.1 C456.368,184.666 456.235,184.233 456.1,183.8 z" fill="#4477B3" fill-opacity="0.2"/>
<path d="M488,173.6 C488.168,174.066 488.335,174.533 488.5,175 L456.5,185.1 C456.368,184.666 456.235,184.233 456.1,183.8 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M488.5,175 C488.635,175.466 488.768,175.933 488.9,176.4 L456.9,186.3 C456.768,185.9 456.634,185.5 456.5,185.1 z" fill="#487BB8" fill-opacity="0.2"/>
<path d="M488.5,175 C488.635,175.466 488.768,175.933 488.9,176.4 L456.9,186.3 C456.768,185.9 456.634,185.5 456.5,185.1 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M488.9,176.4 C489.068,176.899 489.235,177.399 489.4,177.9 L457.3,187.5 C457.168,187.1 457.035,186.7 456.9,186.3 z" fill="#4C80BD" fill-opacity="0.2"/>
<path d="M488.9,176.4 C489.068,176.899 489.235,177.399 489.4,177.9 L457.3,187.5 C457.168,187.1 457.035,186.7 456.9,186.3 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M489.4,177.9 C489.535,178.366 489.668,178.833 489.8,179.3 L457.7,188.8 C457.568,188.366 457.435,187.933 457.3,187.5 z" fill="#5084C2" fill-opacity="0.2"/>
<path d="M489.4,177.9 C489.535,178.366 489.668,178.833 489.8,179.3 L457.7,188.8 C457.568,188.366 457.435,187.933 457.3,187.5 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M489.8,179.3 C489.935,179.766 490.068,180.233 490.2,180.7 L458,190 C457.901,189.6 457.801,189.2 457.7,188.8 z" fill="#5589C7" fill-opacity="0.2"/>
<path d="M489.8,179.3 C489.935,179.766 490.068,180.233 490.2,180.7 L458,190 C457.901,189.6 457.801,189.2 457.7,188.8 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M490.2,180.7 C490.335,181.2 490.468,181.7 490.6,182.2 L458.4,191.3 C458.268,190.866 458.135,190.433 458,190 z" fill="#598ECC" fill-opacity="0.2"/>
<path d="M490.2,180.7 C490.335,181.2 490.468,181.7 490.6,182.2 L458.4,191.3 C458.268,190.866 458.135,190.433 458,190 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M465.3,273.2 C464.129,283.932 462.157,294.562 459.4,305 L421,294.9 C423.242,286.398 424.846,277.741 425.8,269 z" fill="#3E7FBC" fill-opacity="0.2"/>
<path d="M465.3,273.2 C464.129,283.932 462.157,294.562 459.4,305 L421,294.9 C423.242,286.398 424.846,277.741 425.8,269 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M497.8,282.8 C497.735,283.267 497.668,283.734 497.6,284.2 L464.5,279.6 C464.534,279.2 464.568,278.8 464.6,278.4 z" fill="#135A94" fill-opacity="0.2"/>
<path d="M497.8,282.8 C497.735,283.267 497.668,283.734 497.6,284.2 L464.5,279.6 C464.534,279.2 464.568,278.8 464.6,278.4 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M497.6,284.2 C497.535,284.7 497.468,285.2 497.4,285.7 L464.3,280.9 C464.368,280.467 464.435,280.034 464.5,279.6 z" fill="#195E98" fill-opacity="0.2"/>
<path d="M497.6,284.2 C497.535,284.7 497.468,285.2 497.4,285.7 L464.3,280.9 C464.368,280.467 464.435,280.034 464.5,279.6 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M497.4,285.7 C497.335,286.2 497.268,286.7 497.2,287.2 L464.1,282.2 C464.168,281.767 464.235,281.334 464.3,280.9 z" fill="#1F619C" fill-opacity="0.2"/>
<path d="M497.4,285.7 C497.335,286.2 497.268,286.7 497.2,287.2 L464.1,282.2 C464.168,281.767 464.235,281.334 464.3,280.9 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M497.2,287.2 C497.135,287.7 497.068,288.2 497,288.7 L463.9,283.5 C463.968,283.067 464.035,282.634 464.1,282.2 z" fill="#2565A0" fill-opacity="0.2"/>
<path d="M497.2,287.2 C497.135,287.7 497.068,288.2 497,288.7 L463.9,283.5 C463.968,283.067 464.035,282.634 464.1,282.2 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M497,288.7 C496.935,289.167 496.868,289.634 496.8,290.1 L463.7,284.8 C463.768,284.367 463.835,283.934 463.9,283.5 z" fill="#2A69A4" fill-opacity="0.2"/>
<path d="M497,288.7 C496.935,289.167 496.868,289.634 496.8,290.1 L463.7,284.8 C463.768,284.367 463.835,283.934 463.9,283.5 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M496.8,290.1 C496.702,290.6 496.602,291.1 496.5,291.6 L463.5,286 C463.568,285.6 463.634,285.2 463.7,284.8 z" fill="#2E6CA8" fill-opacity="0.2"/>
<path d="M496.8,290.1 C496.702,290.6 496.602,291.1 496.5,291.6 L463.5,286 C463.568,285.6 463.634,285.2 463.7,284.8 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M496.5,291.6 C496.435,292.1 496.368,292.6 496.3,293.1 L463.3,287.3 C463.368,286.867 463.435,286.434 463.5,286 z" fill="#3370AC" fill-opacity="0.2"/>
<path d="M496.5,291.6 C496.435,292.1 496.368,292.6 496.3,293.1 L463.3,287.3 C463.368,286.867 463.435,286.434 463.5,286 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M496.3,293.1 C496.202,293.6 496.102,294.1 496,294.6 L463,288.6 C463.101,288.167 463.201,287.734 463.3,287.3 z" fill="#3774B0" fill-opacity="0.2"/>
<path d="M496.3,293.1 C496.202,293.6 496.102,294.1 496,294.6 L463,288.6 C463.101,288.167 463.201,287.734 463.3,287.3 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M496,294.6 C495.901,295.067 495.801,295.534 495.7,296 L462.8,289.9 C462.868,289.467 462.935,289.034 463,288.6 z" fill="#3C77B4" fill-opacity="0.2"/>
<path d="M496,294.6 C495.901,295.067 495.801,295.534 495.7,296 L462.8,289.9 C462.868,289.467 462.935,289.034 463,288.6 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M495.7,296 C495.602,296.5 495.502,297 495.4,297.5 L462.6,291.1 C462.668,290.7 462.734,290.3 462.8,289.9 z" fill="#407BB8" fill-opacity="0.2"/>
<path d="M495.7,296 C495.602,296.5 495.502,297 495.4,297.5 L462.6,291.1 C462.668,290.7 462.734,290.3 462.8,289.9 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M495.4,297.5 C495.335,298 495.268,298.5 495.2,299 L462.3,292.4 C462.401,291.967 462.501,291.534 462.6,291.1 z" fill="#447FBC" fill-opacity="0.2"/>
<path d="M495.4,297.5 C495.335,298 495.268,298.5 495.2,299 L462.3,292.4 C462.401,291.967 462.501,291.534 462.6,291.1 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M495.2,299 C495.101,299.467 495.001,299.934 494.9,300.4 L462.1,293.7 C462.168,293.267 462.235,292.834 462.3,292.4 z" fill="#4883C1" fill-opacity="0.2"/>
<path d="M495.2,299 C495.101,299.467 495.001,299.934 494.9,300.4 L462.1,293.7 C462.168,293.267 462.235,292.834 462.3,292.4 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M498.6,276.8 C498.473,277.801 498.339,278.801 498.2,279.8 L465,275.8 C465.105,274.934 465.205,274.067 465.3,273.2 z" fill="#00538C" fill-opacity="0.2"/>
<path d="M498.6,276.8 C498.473,277.801 498.339,278.801 498.2,279.8 L465,275.8 C465.105,274.934 465.205,274.067 465.3,273.2 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M494.9,300.4 C494.802,300.9 494.702,301.4 494.6,301.9 L461.8,294.9 C461.901,294.5 462.001,294.1 462.1,293.7 z" fill="#4C87C5" fill-opacity="0.2"/>
<path d="M494.9,300.4 C494.802,300.9 494.702,301.4 494.6,301.9 L461.8,294.9 C461.901,294.5 462.001,294.1 462.1,293.7 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M494.6,301.9 C494.468,302.367 494.335,302.834 494.2,303.3 L461.5,296.2 C461.601,295.767 461.701,295.334 461.8,294.9 z" fill="#508AC9" fill-opacity="0.2"/>
<path d="M494.6,301.9 C494.468,302.367 494.335,302.834 494.2,303.3 L461.5,296.2 C461.601,295.767 461.701,295.334 461.8,294.9 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M494.2,303.3 C494.102,303.8 494.002,304.3 493.9,304.8 L461.2,297.5 C461.301,297.067 461.401,296.634 461.5,296.2 z" fill="#548ECD" fill-opacity="0.2"/>
<path d="M494.2,303.3 C494.102,303.8 494.002,304.3 493.9,304.8 L461.2,297.5 C461.301,297.067 461.401,296.634 461.5,296.2 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M493.9,304.8 C493.802,305.3 493.702,305.8 493.6,306.3 L461,298.7 C461.068,298.3 461.134,297.9 461.2,297.5 z" fill="#5892D1" fill-opacity="0.2"/>
<path d="M493.9,304.8 C493.802,305.3 493.702,305.8 493.6,306.3 L461,298.7 C461.068,298.3 461.134,297.9 461.2,297.5 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M493.6,306.3 C493.468,306.767 493.335,307.234 493.2,307.7 L460.7,300 C460.801,299.567 460.901,299.134 461,298.7 z" fill="#5C96D5" fill-opacity="0.2"/>
<path d="M493.6,306.3 C493.468,306.767 493.335,307.234 493.2,307.7 L460.7,300 C460.801,299.567 460.901,299.134 461,298.7 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M493.2,307.7 C493.102,308.2 493.002,308.7 492.9,309.2 L460.4,301.2 C460.501,300.8 460.601,300.4 460.7,300 z" fill="#609ADA" fill-opacity="0.2"/>
<path d="M493.2,307.7 C493.102,308.2 493.002,308.7 492.9,309.2 L460.4,301.2 C460.501,300.8 460.601,300.4 460.7,300 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M498.2,279.8 C498.073,280.801 497.939,281.801 497.8,282.8 L464.6,278.4 C464.739,277.534 464.872,276.667 465,275.8 z" fill="#0A5790" fill-opacity="0.2"/>
<path d="M498.2,279.8 C498.073,280.801 497.939,281.801 497.8,282.8 L464.6,278.4 C464.739,277.534 464.872,276.667 465,275.8 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M492.9,309.2 C492.768,309.667 492.635,310.134 492.5,310.6 L460,302.5 C460.135,302.067 460.268,301.634 460.4,301.2 z" fill="#649EDE" fill-opacity="0.2"/>
<path d="M492.9,309.2 C492.768,309.667 492.635,310.134 492.5,310.6 L460,302.5 C460.135,302.067 460.268,301.634 460.4,301.2 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M492.5,310.6 C492.402,311.1 492.302,311.6 492.2,312.1 L459.7,303.7 C459.801,303.3 459.901,302.9 460,302.5 z" fill="#68A2E2" fill-opacity="0.2"/>
<path d="M492.5,310.6 C492.402,311.1 492.302,311.6 492.2,312.1 L459.7,303.7 C459.801,303.3 459.901,302.9 460,302.5 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M492.2,312.1 C492.068,312.567 491.935,313.034 491.8,313.5 L459.4,305 C459.501,304.567 459.601,304.134 459.7,303.7 z" fill="#6CA6E6" fill-opacity="0.2"/>
<path d="M492.2,312.1 C492.068,312.567 491.935,313.034 491.8,313.5 L459.4,305 C459.501,304.567 459.601,304.134 459.7,303.7 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g id="ky">
<path d="M318.6,44.7 C336.614,50.695 353.761,59.033 369.6,69.5 L347.7,102.6 C334.752,94.032 320.731,87.206 306,82.3 z" fill="#0D538C"/>
<path d="M318.6,44.7 C336.614,50.695 353.761,59.033 369.6,69.5 L347.7,102.6 C334.752,94.032 320.731,87.206 306,82.3 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M340.5,16.9 C341.436,17.261 342.369,17.628 343.3,18 L330.8,49.1 C330.002,48.795 329.202,48.495 328.4,48.2 z" fill="#063064"/>
<path d="M340.5,16.9 C341.436,17.261 342.369,17.628 343.3,18 L330.8,49.1 C330.002,48.795 329.202,48.495 328.4,48.2 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M343.3,18 C344.202,18.395 345.102,18.795 346,19.2 L333.2,50.1 C332.402,49.762 331.602,49.429 330.8,49.1 z" fill="#093266"/>
<path d="M343.3,18 C344.202,18.395 345.102,18.795 346,19.2 L333.2,50.1 C332.402,49.762 331.602,49.429 330.8,49.1 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M346,19.2 C346.936,19.561 347.869,19.928 348.8,20.3 L335.5,51.1 C334.735,50.762 333.969,50.429 333.2,50.1 z" fill="#0D3569"/>
<path d="M346,19.2 C346.936,19.561 347.869,19.928 348.8,20.3 L335.5,51.1 C334.735,50.762 333.969,50.429 333.2,50.1 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M348.8,20.3 C349.702,20.695 350.602,21.095 351.5,21.5 L337.9,52.1 C337.102,51.762 336.302,51.429 335.5,51.1 z" fill="#10376C"/>
<path d="M348.8,20.3 C349.702,20.695 350.602,21.095 351.5,21.5 L337.9,52.1 C337.102,51.762 336.302,51.429 335.5,51.1 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M359.6,25.3 C360.067,25.532 360.534,25.765 361,26 L346.1,56 C345.701,55.799 345.301,55.599 344.9,55.4 z" fill="#1A4178"/>
<path d="M359.6,25.3 C360.067,25.532 360.534,25.765 361,26 L346.1,56 C345.701,55.799 345.301,55.599 344.9,55.4 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M361,26 C361.434,26.199 361.867,26.399 362.3,26.6 L347.3,56.6 C346.901,56.399 346.501,56.199 346.1,56 z" fill="#1D447A"/>
<path d="M361,26 C361.434,26.199 361.867,26.399 362.3,26.6 L347.3,56.6 C346.901,56.399 346.501,56.199 346.1,56 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M362.3,26.6 C362.734,26.832 363.167,27.065 363.6,27.3 L348.4,57.2 C348.034,56.999 347.667,56.799 347.3,56.6 z" fill="#1F467D"/>
<path d="M362.3,26.6 C362.734,26.832 363.167,27.065 363.6,27.3 L348.4,57.2 C348.034,56.999 347.667,56.799 347.3,56.6 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M363.6,27.3 C364.067,27.532 364.534,27.765 365,28 L349.6,57.7 C349.201,57.532 348.8,57.365 348.4,57.2 z" fill="#224980"/>
<path d="M363.6,27.3 C364.067,27.532 364.534,27.765 365,28 L349.6,57.7 C349.201,57.532 348.8,57.365 348.4,57.2 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M365,28 C365.434,28.232 365.867,28.465 366.3,28.7 L350.7,58.3 C350.334,58.099 349.967,57.899 349.6,57.7 z" fill="#244B83"/>
<path d="M365,28 C365.434,28.232 365.867,28.465 366.3,28.7 L350.7,58.3 C350.334,58.099 349.967,57.899 349.6,57.7 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M366.3,28.7 C366.734,28.932 367.167,29.165 367.6,29.4 L351.8,58.9 C351.434,58.699 351.067,58.499 350.7,58.3 z" fill="#264E86"/>
<path d="M366.3,28.7 C366.734,28.932 367.167,29.165 367.6,29.4 L351.8,58.9 C351.434,58.699 351.067,58.499 350.7,58.3 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M351.5,21.5 C352.403,21.928 353.303,22.361 354.2,22.8 L340.3,53.2 C339.502,52.828 338.702,52.462 337.9,52.1 z" fill="#123A6F"/>
<path d="M351.5,21.5 C352.403,21.928 353.303,22.361 354.2,22.8 L340.3,53.2 C339.502,52.828 338.702,52.462 337.9,52.1 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M336.3,15.4 C337.704,15.888 339.104,16.388 340.5,16.9 L328.4,48.2 C327.171,47.722 325.938,47.255 324.7,46.8 z" fill="#032D61"/>
<path d="M336.3,15.4 C337.704,15.888 339.104,16.388 340.5,16.9 L328.4,48.2 C327.171,47.722 325.938,47.255 324.7,46.8 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M354.2,22.8 C355.102,23.195 356.002,23.595 356.9,24 L342.6,54.3 C341.836,53.929 341.069,53.562 340.3,53.2 z" fill="#153C72"/>
<path d="M354.2,22.8 C355.102,23.195 356.002,23.595 356.9,24 L342.6,54.3 C341.836,53.929 341.069,53.562 340.3,53.2 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M367.6,29.4 C368.034,29.632 368.467,29.865 368.9,30.1 L353,59.6 C352.601,59.365 352.201,59.132 351.8,58.9 z" fill="#295089"/>
<path d="M367.6,29.4 C368.034,29.632 368.467,29.865 368.9,30.1 L353,59.6 C352.601,59.365 352.201,59.132 351.8,58.9 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M368.9,30.1 C369.334,30.332 369.767,30.565 370.2,30.8 L354.1,60.2 C353.734,59.999 353.367,59.799 353,59.6 z" fill="#2B538C"/>
<path d="M368.9,30.1 C369.334,30.332 369.767,30.565 370.2,30.8 L354.1,60.2 C353.734,59.999 353.367,59.799 353,59.6 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M370.2,30.8 C370.634,31.032 371.067,31.265 371.5,31.5 L355.3,60.8 C354.901,60.599 354.501,60.399 354.1,60.2 z" fill="#2D568F"/>
<path d="M370.2,30.8 C370.634,31.032 371.067,31.265 371.5,31.5 L355.3,60.8 C354.901,60.599 354.501,60.399 354.1,60.2 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M371.5,31.5 C371.934,31.765 372.367,32.032 372.8,32.3 L356.4,61.4 C356.034,61.199 355.667,60.999 355.3,60.8 z" fill="#2F5892"/>
<path d="M371.5,31.5 C371.934,31.765 372.367,32.032 372.8,32.3 L356.4,61.4 C356.034,61.199 355.667,60.999 355.3,60.8 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M372.8,32.3 C373.234,32.532 373.667,32.765 374.1,33 L357.5,62.1 C357.134,61.866 356.767,61.632 356.4,61.4 z" fill="#315B95"/>
<path d="M372.8,32.3 C373.234,32.532 373.667,32.765 374.1,33 L357.5,62.1 C357.134,61.866 356.767,61.632 356.4,61.4 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M374.1,33 C374.534,33.232 374.967,33.465 375.4,33.7 L358.6,62.7 C358.234,62.499 357.867,62.299 357.5,62.1 z" fill="#345E98"/>
<path d="M374.1,33 C374.534,33.232 374.967,33.465 375.4,33.7 L358.6,62.7 C358.234,62.499 357.867,62.299 357.5,62.1 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M356.9,24 C357.803,24.428 358.703,24.861 359.6,25.3 L344.9,55.4 C344.135,55.029 343.369,54.662 342.6,54.3 z" fill="#183E75"/>
<path d="M356.9,24 C357.803,24.428 358.703,24.861 359.6,25.3 L344.9,55.4 C344.135,55.029 343.369,54.662 342.6,54.3 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M375.4,33.7 C375.834,33.965 376.267,34.232 376.7,34.5 L359.7,63.4 C359.334,63.166 358.967,62.932 358.6,62.7 z" fill="#36609B"/>
<path d="M375.4,33.7 C375.834,33.965 376.267,34.232 376.7,34.5 L359.7,63.4 C359.334,63.166 358.967,62.932 358.6,62.7 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M329.2,12.9 C331.579,13.698 333.946,14.531 336.3,15.4 L324.7,46.8 C322.677,46.07 320.644,45.37 318.6,44.7 z" fill="#002B5E"/>
<path d="M329.2,12.9 C331.579,13.698 333.946,14.531 336.3,15.4 L324.7,46.8 C322.677,46.07 320.644,45.37 318.6,44.7 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M376.7,34.5 C377.134,34.765 377.567,35.032 378,35.3 L360.9,64 C360.501,63.799 360.101,63.599 359.7,63.4 z" fill="#38639E"/>
<path d="M376.7,34.5 C377.134,34.765 377.567,35.032 378,35.3 L360.9,64 C360.501,63.799 360.101,63.599 359.7,63.4 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M378,35.3 C378.434,35.532 378.867,35.765 379.3,36 L362,64.7 C361.634,64.466 361.267,64.232 360.9,64 z" fill="#3A66A1"/>
<path d="M378,35.3 C378.434,35.532 378.867,35.765 379.3,36 L362,64.7 C361.634,64.466 361.267,64.232 360.9,64 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M379.3,36 C379.734,36.265 380.167,36.532 380.6,36.8 L363.1,65.4 C362.734,65.166 362.367,64.932 362,64.7 z" fill="#3C69A4"/>
<path d="M379.3,36 C379.734,36.265 380.167,36.532 380.6,36.8 L363.1,65.4 C362.734,65.166 362.367,64.932 362,64.7 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M380.6,36.8 C381.001,37.066 381.401,37.332 381.8,37.6 L364.2,66 C363.834,65.799 363.467,65.599 363.1,65.4 z" fill="#3F6BA7"/>
<path d="M380.6,36.8 C381.001,37.066 381.401,37.332 381.8,37.6 L364.2,66 C363.834,65.799 363.467,65.599 363.1,65.4 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M381.8,37.6 C382.234,37.865 382.667,38.132 383.1,38.4 L365.3,66.7 C364.934,66.466 364.567,66.232 364.2,66 z" fill="#416EAA"/>
<path d="M381.8,37.6 C382.234,37.865 382.667,38.132 383.1,38.4 L365.3,66.7 C364.934,66.466 364.567,66.232 364.2,66 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M383.1,38.4 C383.534,38.665 383.967,38.932 384.4,39.2 L366.4,67.4 C366.034,67.166 365.667,66.932 365.3,66.7 z" fill="#4371AD"/>
<path d="M383.1,38.4 C383.534,38.665 383.967,38.932 384.4,39.2 L366.4,67.4 C366.034,67.166 365.667,66.932 365.3,66.7 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M384.4,39.2 C384.801,39.466 385.201,39.732 385.6,40 L367.4,68.1 C367.067,67.866 366.734,67.632 366.4,67.4 z" fill="#4574B0"/>
<path d="M384.4,39.2 C384.801,39.466 385.201,39.732 385.6,40 L367.4,68.1 C367.067,67.866 366.734,67.632 366.4,67.4 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M385.6,40 C386.034,40.265 386.467,40.532 386.9,40.8 L368.5,68.8 C368.134,68.566 367.767,68.332 367.4,68.1 z" fill="#4777B3"/>
<path d="M385.6,40 C386.034,40.265 386.467,40.532 386.9,40.8 L368.5,68.8 C368.134,68.566 367.767,68.332 367.4,68.1 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M386.9,40.8 C387.301,41.066 387.701,41.332 388.1,41.6 L369.6,69.5 C369.234,69.266 368.867,69.032 368.5,68.8 z" fill="#4A79B6"/>
<path d="M386.9,40.8 C387.301,41.066 387.701,41.332 388.1,41.6 L369.6,69.5 C369.234,69.266 368.867,69.032 368.5,68.8 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M409.8,103.9 C421.439,116.654 431.511,130.754 439.8,145.9 L405,165 C398.23,152.631 390.005,141.115 380.5,130.7 z" fill="#21619C" fill-opacity="0.2"/>
<path d="M409.8,103.9 C421.439,116.654 431.511,130.754 439.8,145.9 L405,165 C398.23,152.631 390.005,141.115 380.5,130.7 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M448,97.3 C448.605,98.096 449.205,98.896 449.8,99.7 L423,119.8 C422.471,119.13 421.937,118.464 421.4,117.8 z" fill="#13447B" fill-opacity="0.2"/>
<path d="M448,97.3 C448.605,98.096 449.205,98.896 449.8,99.7 L423,119.8 C422.471,119.13 421.937,118.464 421.4,117.8 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M455,106.9 C455.301,107.332 455.601,107.766 455.9,108.2 L428.3,127.2 C428.068,126.833 427.834,126.466 427.6,126.1 z" fill="#225088" fill-opacity="0.2"/>
<path d="M455,106.9 C455.301,107.332 455.601,107.766 455.9,108.2 L428.3,127.2 C428.068,126.833 427.834,126.466 427.6,126.1 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M449.8,99.7 C450.371,100.497 450.938,101.297 451.5,102.1 L424.5,121.9 C424.004,121.197 423.504,120.497 423,119.8 z" fill="#17477E" fill-opacity="0.2"/>
<path d="M449.8,99.7 C450.371,100.497 450.938,101.297 451.5,102.1 L424.5,121.9 C424.004,121.197 423.504,120.497 423,119.8 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M439.5,86.9 C440.477,88.025 441.443,89.158 442.4,90.3 L416.6,111.7 C415.775,110.726 414.942,109.759 414.1,108.8 z" fill="#053B70" fill-opacity="0.2"/>
<path d="M439.5,86.9 C440.477,88.025 441.443,89.158 442.4,90.3 L416.6,111.7 C415.775,110.726 414.942,109.759 414.1,108.8 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M451.5,102.1 C452.105,102.896 452.705,103.696 453.3,104.5 L426.1,124 C425.571,123.297 425.038,122.597 424.5,121.9 z" fill="#1B4A82" fill-opacity="0.2"/>
<path d="M451.5,102.1 C452.105,102.896 452.705,103.696 453.3,104.5 L426.1,124 C425.571,123.297 425.038,122.597 424.5,121.9 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M434.5,81.3 C436.195,83.142 437.861,85.008 439.5,86.9 L414.1,108.8 C412.691,107.145 411.258,105.512 409.8,103.9 z" fill="#00386D" fill-opacity="0.2"/>
<path d="M434.5,81.3 C436.195,83.142 437.861,85.008 439.5,86.9 L414.1,108.8 C412.691,107.145 411.258,105.512 409.8,103.9 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M455.9,108.2 C456.168,108.599 456.434,108.999 456.7,109.4 L429,128.2 C428.768,127.866 428.534,127.533 428.3,127.2 z" fill="#25538C" fill-opacity="0.2"/>
<path d="M455.9,108.2 C456.168,108.599 456.434,108.999 456.7,109.4 L429,128.2 C428.768,127.866 428.534,127.533 428.3,127.2 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M456.7,109.4 C457.001,109.799 457.301,110.199 457.6,110.6 L429.7,129.3 C429.468,128.933 429.234,128.566 429,128.2 z" fill="#29568F" fill-opacity="0.2"/>
<path d="M456.7,109.4 C457.001,109.799 457.301,110.199 457.6,110.6 L429.7,129.3 C429.468,128.933 429.234,128.566 429,128.2 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M457.6,110.6 C457.868,111.033 458.135,111.466 458.4,111.9 L430.5,130.4 C430.234,130.033 429.968,129.666 429.7,129.3 z" fill="#2C5993" fill-opacity="0.2"/>
<path d="M457.6,110.6 C457.868,111.033 458.135,111.466 458.4,111.9 L430.5,130.4 C430.234,130.033 429.968,129.666 429.7,129.3 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M458.4,111.9 C458.668,112.299 458.934,112.699 459.2,113.1 L431.2,131.5 C430.968,131.133 430.734,130.766 430.5,130.4 z" fill="#2F5C97" fill-opacity="0.2"/>
<path d="M458.4,111.9 C458.668,112.299 458.934,112.699 459.2,113.1 L431.2,131.5 C430.968,131.133 430.734,130.766 430.5,130.4 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M459.2,113.1 C459.468,113.533 459.735,113.966 460,114.4 L431.9,132.6 C431.668,132.233 431.434,131.866 431.2,131.5 z" fill="#32609A" fill-opacity="0.2"/>
<path d="M459.2,113.1 C459.468,113.533 459.735,113.966 460,114.4 L431.9,132.6 C431.668,132.233 431.434,131.866 431.2,131.5 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M460,114.4 C460.268,114.799 460.534,115.199 460.8,115.6 L432.6,133.6 C432.368,133.266 432.134,132.933 431.9,132.6 z" fill="#35639E" fill-opacity="0.2"/>
<path d="M460,114.4 C460.268,114.799 460.534,115.199 460.8,115.6 L432.6,133.6 C432.368,133.266 432.134,132.933 431.9,132.6 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M460.8,115.6 C461.068,116.033 461.335,116.466 461.6,116.9 L433.3,134.7 C433.068,134.333 432.834,133.966 432.6,133.6 z" fill="#3866A1" fill-opacity="0.2"/>
<path d="M460.8,115.6 C461.068,116.033 461.335,116.466 461.6,116.9 L433.3,134.7 C433.068,134.333 432.834,133.966 432.6,133.6 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M461.6,116.9 C461.868,117.333 462.135,117.766 462.4,118.2 L434,135.8 C433.768,135.433 433.534,135.066 433.3,134.7 z" fill="#3B69A5" fill-opacity="0.2"/>
<path d="M461.6,116.9 C461.868,117.333 462.135,117.766 462.4,118.2 L434,135.8 C433.768,135.433 433.534,135.066 433.3,134.7 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M462.4,118.2 C462.668,118.599 462.934,118.999 463.2,119.4 L434.6,136.9 C434.401,136.533 434.201,136.166 434,135.8 z" fill="#3E6DA8" fill-opacity="0.2"/>
<path d="M462.4,118.2 C462.668,118.599 462.934,118.999 463.2,119.4 L434.6,136.9 C434.401,136.533 434.201,136.166 434,135.8 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M463.2,119.4 C463.468,119.833 463.735,120.266 464,120.7 L435.3,138 C435.068,137.633 434.834,137.266 434.6,136.9 z" fill="#4170AC" fill-opacity="0.2"/>
<path d="M463.2,119.4 C463.468,119.833 463.735,120.266 464,120.7 L435.3,138 C435.068,137.633 434.834,137.266 434.6,136.9 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M464,120.7 C464.235,121.133 464.468,121.566 464.7,122 L436,139.1 C435.768,138.733 435.534,138.366 435.3,138 z" fill="#4473B0" fill-opacity="0.2"/>
<path d="M464,120.7 C464.235,121.133 464.468,121.566 464.7,122 L436,139.1 C435.768,138.733 435.534,138.366 435.3,138 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M442.4,90.3 C443.344,91.458 444.277,92.625 445.2,93.8 L419,114.7 C418.209,113.693 417.409,112.693 416.6,111.7 z" fill="#0A3E74" fill-opacity="0.2"/>
<path d="M442.4,90.3 C443.344,91.458 444.277,92.625 445.2,93.8 L419,114.7 C418.209,113.693 417.409,112.693 416.6,111.7 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M464.7,122 C464.968,122.433 465.235,122.866 465.5,123.3 L436.6,140.3 C436.401,139.899 436.201,139.499 436,139.1 z" fill="#4776B3" fill-opacity="0.2"/>
<path d="M464.7,122 C464.968,122.433 465.235,122.866 465.5,123.3 L436.6,140.3 C436.401,139.899 436.201,139.499 436,139.1 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M445.2,93.8 C446.144,94.958 447.077,96.125 448,97.3 L421.4,117.8 C420.609,116.759 419.809,115.726 419,114.7 z" fill="#0F4177" fill-opacity="0.2"/>
<path d="M445.2,93.8 C446.144,94.958 447.077,96.125 448,97.3 L421.4,117.8 C420.609,116.759 419.809,115.726 419,114.7 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M465.5,123.3 C465.768,123.733 466.035,124.166 466.3,124.6 L437.3,141.4 C437.068,141.033 436.834,140.666 436.6,140.3 z" fill="#4A7AB7" fill-opacity="0.2"/>
<path d="M465.5,123.3 C465.768,123.733 466.035,124.166 466.3,124.6 L437.3,141.4 C437.068,141.033 436.834,140.666 436.6,140.3 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M453.3,104.5 C453.871,105.297 454.438,106.097 455,106.9 L427.6,126.1 C427.104,125.397 426.604,124.697 426.1,124 z" fill="#1F4D85" fill-opacity="0.2"/>
<path d="M453.3,104.5 C453.871,105.297 454.438,106.097 455,106.9 L427.6,126.1 C427.104,125.397 426.604,124.697 426.1,124 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M466.3,124.6 C466.535,125.033 466.768,125.466 467,125.9 L437.9,142.5 C437.701,142.133 437.501,141.766 437.3,141.4 z" fill="#4C7DBB" fill-opacity="0.2"/>
<path d="M466.3,124.6 C466.535,125.033 466.768,125.466 467,125.9 L437.9,142.5 C437.701,142.133 437.501,141.766 437.3,141.4 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M467,125.9 C467.235,126.333 467.468,126.766 467.7,127.2 L438.6,143.6 C438.368,143.233 438.134,142.866 437.9,142.5 z" fill="#4F80BE" fill-opacity="0.2"/>
<path d="M467,125.9 C467.235,126.333 467.468,126.766 467.7,127.2 L438.6,143.6 C438.368,143.233 438.134,142.866 437.9,142.5 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M467.7,127.2 C467.968,127.633 468.235,128.066 468.5,128.5 L439.2,144.7 C439.001,144.333 438.801,143.966 438.6,143.6 z" fill="#5284C2" fill-opacity="0.2"/>
<path d="M467.7,127.2 C467.968,127.633 468.235,128.066 468.5,128.5 L439.2,144.7 C439.001,144.333 438.801,143.966 438.6,143.6 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M468.5,128.5 C468.735,128.933 468.968,129.366 469.2,129.8 L439.8,145.9 C439.601,145.499 439.401,145.099 439.2,144.7 z" fill="#5587C6" fill-opacity="0.2"/>
<path d="M468.5,128.5 C468.735,128.933 468.968,129.366 469.2,129.8 L439.8,145.9 C439.601,145.499 439.401,145.099 439.2,144.7 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M458.4,191.3 C462.601,206.246 465.183,221.601 466.1,237.1 L426.5,239.4 C425.714,226.74 423.569,214.201 420.1,202 z" fill="#3070AC" fill-opacity="0.2"/>
<path d="M458.4,191.3 C462.601,206.246 465.183,221.601 466.1,237.1 L426.5,239.4 C425.714,226.74 423.569,214.201 420.1,202 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M496,205.4 C496.102,205.9 496.202,206.4 496.3,206.9 L463.3,212.7 C463.201,212.266 463.101,211.833 463,211.4 z" fill="#245A94" fill-opacity="0.2"/>
<path d="M496,205.4 C496.102,205.9 496.202,206.4 496.3,206.9 L463.3,212.7 C463.201,212.266 463.101,211.833 463,211.4 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M490.6,182.2 C491.013,183.63 491.413,185.063 491.8,186.5 L459.4,195 C459.078,193.764 458.744,192.53 458.4,191.3 z" fill="#00457C" fill-opacity="0.2"/>
<path d="M490.6,182.2 C491.013,183.63 491.413,185.063 491.8,186.5 L459.4,195 C459.078,193.764 458.744,192.53 458.4,191.3 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M491.8,186.5 C492.179,187.93 492.546,189.363 492.9,190.8 L460.4,198.8 C460.078,197.53 459.745,196.264 459.4,195 z" fill="#06487F" fill-opacity="0.2"/>
<path d="M491.8,186.5 C492.179,187.93 492.546,189.363 492.9,190.8 L460.4,198.8 C460.078,197.53 459.745,196.264 459.4,195 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M496.3,206.9 C496.368,207.4 496.435,207.9 496.5,208.4 L463.5,214 C463.435,213.566 463.368,213.133 463.3,212.7 z" fill="#275D97" fill-opacity="0.2"/>
<path d="M496.3,206.9 C496.368,207.4 496.435,207.9 496.5,208.4 L463.5,214 C463.435,213.566 463.368,213.133 463.3,212.7 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M496.5,208.4 C496.602,208.9 496.702,209.4 496.8,209.9 L463.7,215.2 C463.634,214.8 463.568,214.4 463.5,214 z" fill="#2B609A" fill-opacity="0.2"/>
<path d="M496.5,208.4 C496.602,208.9 496.702,209.4 496.8,209.9 L463.7,215.2 C463.634,214.8 463.568,214.4 463.5,214 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M496.8,209.9 C496.868,210.366 496.935,210.833 497,211.3 L463.9,216.5 C463.835,216.066 463.768,215.633 463.7,215.2 z" fill="#2F639E" fill-opacity="0.2"/>
<path d="M496.8,209.9 C496.868,210.366 496.935,210.833 497,211.3 L463.9,216.5 C463.835,216.066 463.768,215.633 463.7,215.2 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M492.9,190.8 C493.139,191.765 493.372,192.732 493.6,193.7 L461,201.3 C460.805,200.465 460.605,199.632 460.4,198.8 z" fill="#0D4B83" fill-opacity="0.2"/>
<path d="M492.9,190.8 C493.139,191.765 493.372,192.732 493.6,193.7 L461,201.3 C460.805,200.465 460.605,199.632 460.4,198.8 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M497,211.3 C497.068,211.8 497.135,212.3 497.2,212.8 L464.1,217.8 C464.035,217.366 463.968,216.933 463.9,216.5 z" fill="#3266A1" fill-opacity="0.2"/>
<path d="M497,211.3 C497.068,211.8 497.135,212.3 497.2,212.8 L464.1,217.8 C464.035,217.366 463.968,216.933 463.9,216.5 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M497.2,212.8 C497.268,213.3 497.335,213.8 497.4,214.3 L464.3,219.1 C464.235,218.666 464.168,218.233 464.1,217.8 z" fill="#3569A5" fill-opacity="0.2"/>
<path d="M497.2,212.8 C497.268,213.3 497.335,213.8 497.4,214.3 L464.3,219.1 C464.235,218.666 464.168,218.233 464.1,217.8 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M497.4,214.3 C497.468,214.8 497.535,215.3 497.6,215.8 L464.5,220.4 C464.435,219.966 464.368,219.533 464.3,219.1 z" fill="#396DA8" fill-opacity="0.2"/>
<path d="M497.4,214.3 C497.468,214.8 497.535,215.3 497.6,215.8 L464.5,220.4 C464.435,219.966 464.368,219.533 464.3,219.1 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M497.6,215.8 C497.668,216.266 497.735,216.733 497.8,217.2 L464.6,221.6 C464.568,221.2 464.534,220.8 464.5,220.4 z" fill="#3C70AC" fill-opacity="0.2"/>
<path d="M497.6,215.8 C497.668,216.266 497.735,216.733 497.8,217.2 L464.6,221.6 C464.568,221.2 464.534,220.8 464.5,220.4 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M497.8,217.2 C497.868,217.7 497.935,218.2 498,218.7 L464.8,222.9 C464.735,222.466 464.668,222.033 464.6,221.6 z" fill="#3F73AF" fill-opacity="0.2"/>
<path d="M497.8,217.2 C497.868,217.7 497.935,218.2 498,218.7 L464.8,222.9 C464.735,222.466 464.668,222.033 464.6,221.6 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M498,218.7 C498.068,219.2 498.135,219.7 498.2,220.2 L465,224.2 C464.935,223.766 464.868,223.333 464.8,222.9 z" fill="#4276B3" fill-opacity="0.2"/>
<path d="M498,218.7 C498.068,219.2 498.135,219.7 498.2,220.2 L465,224.2 C464.935,223.766 464.868,223.333 464.8,222.9 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M498.2,220.2 C498.268,220.7 498.335,221.2 498.4,221.7 L465.1,225.5 C465.068,225.067 465.035,224.633 465,224.2 z" fill="#4679B6" fill-opacity="0.2"/>
<path d="M498.2,220.2 C498.268,220.7 498.335,221.2 498.4,221.7 L465.1,225.5 C465.068,225.067 465.035,224.633 465,224.2 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M498.4,221.7 C498.468,222.2 498.535,222.7 498.6,223.2 L465.3,226.8 C465.235,226.366 465.168,225.933 465.1,225.5 z" fill="#497DBA" fill-opacity="0.2"/>
<path d="M498.4,221.7 C498.468,222.2 498.535,222.7 498.6,223.2 L465.3,226.8 C465.235,226.366 465.168,225.933 465.1,225.5 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M493.6,193.7 C493.806,194.699 494.006,195.699 494.2,196.7 L461.5,203.8 C461.338,202.966 461.172,202.132 461,201.3 z" fill="#134E86" fill-opacity="0.2"/>
<path d="M493.6,193.7 C493.806,194.699 494.006,195.699 494.2,196.7 L461.5,203.8 C461.338,202.966 461.172,202.132 461,201.3 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M494.2,196.7 C494.439,197.665 494.672,198.632 494.9,199.6 L462.1,206.3 C461.905,205.465 461.705,204.632 461.5,203.8 z" fill="#175189" fill-opacity="0.2"/>
<path d="M494.2,196.7 C494.439,197.665 494.672,198.632 494.9,199.6 L462.1,206.3 C461.905,205.465 461.705,204.632 461.5,203.8 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M498.6,223.2 C498.635,223.7 498.668,224.2 498.7,224.7 L465.4,228.1 C465.368,227.667 465.335,227.233 465.3,226.8 z" fill="#4C80BE" fill-opacity="0.2"/>
<path d="M498.6,223.2 C498.635,223.7 498.668,224.2 498.7,224.7 L465.4,228.1 C465.368,227.667 465.335,227.233 465.3,226.8 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M498.7,224.7 C498.768,225.166 498.835,225.633 498.9,226.1 L465.5,229.3 C465.468,228.9 465.434,228.5 465.4,228.1 z" fill="#4F83C1" fill-opacity="0.2"/>
<path d="M498.7,224.7 C498.768,225.166 498.835,225.633 498.9,226.1 L465.5,229.3 C465.468,228.9 465.434,228.5 465.4,228.1 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M494.9,199.6 C495.072,200.566 495.239,201.532 495.4,202.5 L462.6,208.9 C462.439,208.032 462.272,207.166 462.1,206.3 z" fill="#1C548D" fill-opacity="0.2"/>
<path d="M494.9,199.6 C495.072,200.566 495.239,201.532 495.4,202.5 L462.6,208.9 C462.439,208.032 462.272,207.166 462.1,206.3 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M498.9,226.1 C498.935,226.6 498.968,227.1 499,227.6 L465.6,230.6 C465.568,230.167 465.535,229.733 465.5,229.3 z" fill="#5287C5" fill-opacity="0.2"/>
<path d="M498.9,226.1 C498.935,226.6 498.968,227.1 499,227.6 L465.6,230.6 C465.568,230.167 465.535,229.733 465.5,229.3 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M499,227.6 C499.035,228.1 499.068,228.6 499.1,229.1 L465.7,231.9 C465.668,231.467 465.635,231.033 465.6,230.6 z" fill="#558AC8" fill-opacity="0.2"/>
<path d="M499,227.6 C499.035,228.1 499.068,228.6 499.1,229.1 L465.7,231.9 C465.668,231.467 465.635,231.033 465.6,230.6 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M499.1,229.1 C499.135,229.6 499.168,230.1 499.2,230.6 L465.9,233.2 C465.835,232.766 465.768,232.333 465.7,231.9 z" fill="#588DCC" fill-opacity="0.2"/>
<path d="M499.1,229.1 C499.135,229.6 499.168,230.1 499.2,230.6 L465.9,233.2 C465.835,232.766 465.768,232.333 465.7,231.9 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M499.2,230.6 C499.268,231.1 499.335,231.6 499.4,232.1 L466,234.5 C465.968,234.067 465.935,233.633 465.9,233.2 z" fill="#5C91CF" fill-opacity="0.2"/>
<path d="M499.2,230.6 C499.268,231.1 499.335,231.6 499.4,232.1 L466,234.5 C465.968,234.067 465.935,233.633 465.9,233.2 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M499.4,232.1 C499.435,232.6 499.468,233.1 499.5,233.6 L466,235.8 C466.001,235.367 466.001,234.933 466,234.5 z" fill="#5F94D3" fill-opacity="0.2"/>
<path d="M499.4,232.1 C499.435,232.6 499.468,233.1 499.5,233.6 L466,235.8 C466.001,235.367 466.001,234.933 466,234.5 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M499.5,233.6 C499.535,234.1 499.568,234.6 499.6,235.1 L466.1,237.1 C466.068,236.667 466.035,236.233 466,235.8 z" fill="#6297D7" fill-opacity="0.2"/>
<path d="M499.5,233.6 C499.535,234.1 499.568,234.6 499.6,235.1 L466.1,237.1 C466.068,236.667 466.035,236.233 466,235.8 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M495.4,202.5 C495.606,203.465 495.806,204.432 496,205.4 L463,211.4 C462.872,210.566 462.738,209.733 462.6,208.9 z" fill="#205790" fill-opacity="0.2"/>
<path d="M495.4,202.5 C495.606,203.465 495.806,204.432 496,205.4 L463,211.4 C462.872,210.566 462.738,209.733 462.6,208.9 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M459.4,305 C458.29,309.169 457.057,313.304 455.7,317.4 L418,305 C419.1,301.664 420.101,298.296 421,294.9 z" fill="#4587C4" fill-opacity="0.2"/>
<path d="M459.4,305 C458.29,309.169 457.057,313.304 455.7,317.4 L418,305 C419.1,301.664 420.101,298.296 421,294.9 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M490.2,319.3 C490.068,319.767 489.935,320.234 489.8,320.7 L457.7,311.2 C457.801,310.8 457.901,310.4 458,310 z" fill="#296EA8" fill-opacity="0.2"/>
<path d="M490.2,319.3 C490.068,319.767 489.935,320.234 489.8,320.7 L457.7,311.2 C457.801,310.8 457.901,310.4 458,310 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M491.8,313.5 C491.539,314.468 491.272,315.435 491,316.4 L458.7,307.5 C458.938,306.668 459.172,305.835 459.4,305 z" fill="#005A93" fill-opacity="0.2"/>
<path d="M491.8,313.5 C491.539,314.468 491.272,315.435 491,316.4 L458.7,307.5 C458.938,306.668 459.172,305.835 459.4,305 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M489.8,320.7 C489.668,321.167 489.535,321.634 489.4,322.1 L457.3,312.5 C457.435,312.067 457.568,311.634 457.7,311.2 z" fill="#3778B3" fill-opacity="0.2"/>
<path d="M489.8,320.7 C489.668,321.167 489.535,321.634 489.4,322.1 L457.3,312.5 C457.435,312.067 457.568,311.634 457.7,311.2 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M489.4,322.1 C489.235,322.601 489.068,323.101 488.9,323.6 L456.9,313.7 C457.035,313.3 457.168,312.9 457.3,312.5 z" fill="#4382BE" fill-opacity="0.2"/>
<path d="M489.4,322.1 C489.235,322.601 489.068,323.101 488.9,323.6 L456.9,313.7 C457.035,313.3 457.168,312.9 457.3,312.5 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M488.9,323.6 C488.768,324.067 488.635,324.534 488.5,325 L456.5,314.9 C456.634,314.5 456.768,314.1 456.9,313.7 z" fill="#4E8CC9" fill-opacity="0.2"/>
<path d="M488.9,323.6 C488.768,324.067 488.635,324.534 488.5,325 L456.5,314.9 C456.634,314.5 456.768,314.1 456.9,313.7 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M488.5,325 C488.335,325.467 488.168,325.934 488,326.4 L456.1,316.2 C456.235,315.767 456.368,315.334 456.5,314.9 z" fill="#5A97D5" fill-opacity="0.2"/>
<path d="M488.5,325 C488.335,325.467 488.168,325.934 488,326.4 L456.1,316.2 C456.235,315.767 456.368,315.334 456.5,314.9 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M488,326.4 C487.868,326.867 487.735,327.334 487.6,327.8 L455.7,317.4 C455.835,317 455.968,316.6 456.1,316.2 z" fill="#65A1E0" fill-opacity="0.2"/>
<path d="M488,326.4 C487.868,326.867 487.735,327.334 487.6,327.8 L455.7,317.4 C455.835,317 455.968,316.6 456.1,316.2 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M491,316.4 C490.739,317.368 490.472,318.335 490.2,319.3 L458,310 C458.238,309.168 458.472,308.335 458.7,307.5 z" fill="#19649E" fill-opacity="0.2"/>
<path d="M491,316.4 C490.739,317.368 490.472,318.335 490.2,319.3 L458,310 C458.238,309.168 458.472,308.335 458.7,307.5 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M455.7,317.4 C454.389,321.509 452.955,325.577 451.4,329.6 L414.4,315 C415.7,311.703 416.9,308.369 418,305 z" fill="#4B8ECD" fill-opacity="0.2"/>
<path d="M455.7,317.4 C454.389,321.509 452.955,325.577 451.4,329.6 L414.4,315 C415.7,311.703 416.9,308.369 418,305 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M485.7,333.5 C485.501,333.967 485.301,334.434 485.1,334.9 L453.6,323.5 C453.768,323.1 453.935,322.701 454.1,322.3 z" fill="#2C75B1" fill-opacity="0.2"/>
<path d="M485.7,333.5 C485.501,333.967 485.301,334.434 485.1,334.9 L453.6,323.5 C453.768,323.1 453.935,322.701 454.1,322.3 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M485.1,334.9 C484.935,335.367 484.768,335.834 484.6,336.3 L453.2,324.7 C453.335,324.3 453.468,323.9 453.6,323.5 z" fill="#3A7FBC" fill-opacity="0.2"/>
<path d="M485.1,334.9 C484.935,335.367 484.768,335.834 484.6,336.3 L453.2,324.7 C453.335,324.3 453.468,323.9 453.6,323.5 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M484.6,336.3 C484.435,336.767 484.268,337.234 484.1,337.7 L452.8,325.9 C452.934,325.5 453.068,325.1 453.2,324.7 z" fill="#4789C7" fill-opacity="0.2"/>
<path d="M484.6,336.3 C484.435,336.767 484.268,337.234 484.1,337.7 L452.8,325.9 C452.934,325.5 453.068,325.1 453.2,324.7 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M487.6,327.8 C487.273,328.769 486.939,329.735 486.6,330.7 L454.9,319.8 C455.171,319.002 455.438,318.202 455.7,317.4 z" fill="#00619C" fill-opacity="0.2"/>
<path d="M487.6,327.8 C487.273,328.769 486.939,329.735 486.6,330.7 L454.9,319.8 C455.171,319.002 455.438,318.202 455.7,317.4 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M484.1,337.7 C483.935,338.167 483.768,338.634 483.6,339.1 L452.3,327.1 C452.468,326.701 452.635,326.301 452.8,325.9 z" fill="#5393D2" fill-opacity="0.2"/>
<path d="M484.1,337.7 C483.935,338.167 483.768,338.634 483.6,339.1 L452.3,327.1 C452.468,326.701 452.635,326.301 452.8,325.9 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M486.6,330.7 C486.305,331.635 486.005,332.568 485.7,333.5 L454.1,322.3 C454.372,321.468 454.638,320.635 454.9,319.8 z" fill="#1C6BA7" fill-opacity="0.2"/>
<path d="M486.6,330.7 C486.305,331.635 486.005,332.568 485.7,333.5 L454.1,322.3 C454.372,321.468 454.638,320.635 454.9,319.8 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M483.6,339.1 C483.435,339.567 483.268,340.034 483.1,340.5 L451.8,328.4 C451.968,327.967 452.135,327.534 452.3,327.1 z" fill="#5F9EDD" fill-opacity="0.2"/>
<path d="M483.6,339.1 C483.435,339.567 483.268,340.034 483.1,340.5 L451.8,328.4 C451.968,327.967 452.135,327.534 452.3,327.1 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M483.1,340.5 C482.901,340.967 482.701,341.434 482.5,341.9 L451.4,329.6 C451.535,329.2 451.668,328.8 451.8,328.4 z" fill="#6AA8E8" fill-opacity="0.2"/>
<path d="M483.1,340.5 C482.901,340.967 482.701,341.434 482.5,341.9 L451.4,329.6 C451.535,329.2 451.668,328.8 451.8,328.4 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M250,33.5 C273.321,33.514 296.486,37.296 318.6,44.7 L306,82.3 C287.945,76.272 269.035,73.199 250,73.2 z" fill="#004C84" fill-opacity="0.2"/>
<path d="M250,33.5 C273.321,33.514 296.486,37.296 318.6,44.7 L306,82.3 C287.945,76.272 269.035,73.199 250,73.2 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M264.9,0.4 C266.401,0.52 267.901,0.653 269.4,0.8 L266.8,34.1 C265.501,34.022 264.201,33.955 262.9,33.9 z" fill="#052A5D" fill-opacity="0.2"/>
<path d="M264.9,0.4 C266.401,0.52 267.901,0.653 269.4,0.8 L266.8,34.1 C265.501,34.022 264.201,33.955 262.9,33.9 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M291.6,3.5 C292.601,3.661 293.601,3.827 294.6,4 L288.6,37 C287.734,36.828 286.868,36.661 286,36.5 z" fill="#173A70" fill-opacity="0.2"/>
<path d="M291.6,3.5 C292.601,3.661 293.601,3.827 294.6,4 L288.6,37 C287.734,36.828 286.868,36.661 286,36.5 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M309.2,7.1 C309.667,7.232 310.134,7.365 310.6,7.5 L302.5,40 C302.067,39.865 301.634,39.732 301.2,39.6 z" fill="#264B83" fill-opacity="0.2"/>
<path d="M309.2,7.1 C309.667,7.232 310.134,7.365 310.6,7.5 L302.5,40 C302.067,39.865 301.634,39.732 301.2,39.6 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M310.6,7.5 C311.1,7.598 311.6,7.698 312.1,7.8 L303.7,40.3 C303.3,40.199 302.9,40.099 302.5,40 z" fill="#284D86" fill-opacity="0.2"/>
<path d="M310.6,7.5 C311.1,7.598 311.6,7.698 312.1,7.8 L303.7,40.3 C303.3,40.199 302.9,40.099 302.5,40 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M312.1,7.8 C312.567,7.932 313.034,8.065 313.5,8.2 L305,40.6 C304.567,40.499 304.134,40.399 303.7,40.3 z" fill="#2A5089" fill-opacity="0.2"/>
<path d="M312.1,7.8 C312.567,7.932 313.034,8.065 313.5,8.2 L305,40.6 C304.567,40.499 304.134,40.399 303.7,40.3 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M294.6,4 C295.568,4.194 296.535,4.394 297.5,4.6 L291.1,37.4 C290.267,37.262 289.434,37.128 288.6,37 z" fill="#1A3D73" fill-opacity="0.2"/>
<path d="M294.6,4 C295.568,4.194 296.535,4.394 297.5,4.6 L291.1,37.4 C290.267,37.262 289.434,37.128 288.6,37 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M297.5,4.6 C298.468,4.761 299.434,4.928 300.4,5.1 L293.7,37.9 C292.834,37.728 291.968,37.561 291.1,37.4 z" fill="#1C3F76" fill-opacity="0.2"/>
<path d="M297.5,4.6 C298.468,4.761 299.434,4.928 300.4,5.1 L293.7,37.9 C292.834,37.728 291.968,37.561 291.1,37.4 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M259,0.2 C260.967,0.243 262.934,0.31 264.9,0.4 L262.9,33.9 C261.201,33.78 259.501,33.68 257.8,33.6 z" fill="#03285A" fill-opacity="0.2"/>
<path d="M259,0.2 C260.967,0.243 262.934,0.31 264.9,0.4 L262.9,33.9 C261.201,33.78 259.501,33.68 257.8,33.6 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M269.4,0.8 C270.901,0.886 272.401,0.986 273.9,1.1 L270.7,34.5 C269.401,34.355 268.101,34.222 266.8,34.1 z" fill="#092D60" fill-opacity="0.2"/>
<path d="M269.4,0.8 C270.901,0.886 272.401,0.986 273.9,1.1 L270.7,34.5 C269.401,34.355 268.101,34.222 266.8,34.1 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M273.9,1.1 C275.368,1.254 276.835,1.42 278.3,1.6 L274.5,34.9 C273.235,34.755 271.968,34.622 270.7,34.5 z" fill="#0C2F63" fill-opacity="0.2"/>
<path d="M273.9,1.1 C275.368,1.254 276.835,1.42 278.3,1.6 L274.5,34.9 C273.235,34.755 271.968,34.622 270.7,34.5 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M250,0 C253.001,0.013 256.001,0.079 259,0.2 L257.8,33.6 C255.201,33.52 252.6,33.486 250,33.5 z" fill="#002557" fill-opacity="0.2"/>
<path d="M250,0 C253.001,0.013 256.001,0.079 259,0.2 L257.8,33.6 C255.201,33.52 252.6,33.486 250,33.5 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M278.3,1.6 C279.802,1.786 281.302,1.986 282.8,2.2 L278.4,35.4 C277.102,35.222 275.801,35.055 274.5,34.9 z" fill="#0F3266" fill-opacity="0.2"/>
<path d="M278.3,1.6 C279.802,1.786 281.302,1.986 282.8,2.2 L278.4,35.4 C277.102,35.222 275.801,35.055 274.5,34.9 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M282.8,2.2 C284.268,2.387 285.735,2.587 287.2,2.8 L282.2,35.9 C280.935,35.722 279.668,35.555 278.4,35.4 z" fill="#123569" fill-opacity="0.2"/>
<path d="M282.8,2.2 C284.268,2.387 285.735,2.587 287.2,2.8 L282.2,35.9 C280.935,35.722 279.668,35.555 278.4,35.4 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M300.4,5.1 C301.368,5.328 302.335,5.561 303.3,5.8 L296.2,38.5 C295.368,38.295 294.535,38.095 293.7,37.9 z" fill="#1F4279" fill-opacity="0.2"/>
<path d="M300.4,5.1 C301.368,5.328 302.335,5.561 303.3,5.8 L296.2,38.5 C295.368,38.295 294.535,38.095 293.7,37.9 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M313.5,8.2 C313.967,8.332 314.434,8.465 314.9,8.6 L306.2,40.9 C305.8,40.799 305.4,40.699 305,40.6 z" fill="#2D538C" fill-opacity="0.2"/>
<path d="M313.5,8.2 C313.967,8.332 314.434,8.465 314.9,8.6 L306.2,40.9 C305.8,40.799 305.4,40.699 305,40.6 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M287.2,2.8 C288.669,3.02 290.135,3.254 291.6,3.5 L286,36.5 C284.735,36.289 283.468,36.089 282.2,35.9 z" fill="#15376D" fill-opacity="0.2"/>
<path d="M287.2,2.8 C288.669,3.02 290.135,3.254 291.6,3.5 L286,36.5 C284.735,36.289 283.468,36.089 282.2,35.9 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M314.9,8.6 C315.4,8.732 315.9,8.865 316.4,9 L307.5,41.3 C307.067,41.165 306.634,41.032 306.2,40.9 z" fill="#2F5690" fill-opacity="0.2"/>
<path d="M314.9,8.6 C315.4,8.732 315.9,8.865 316.4,9 L307.5,41.3 C307.067,41.165 306.634,41.032 306.2,40.9 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M316.4,9 C316.867,9.132 317.334,9.265 317.8,9.4 L308.7,41.6 C308.3,41.499 307.9,41.399 307.5,41.3 z" fill="#315993" fill-opacity="0.2"/>
<path d="M316.4,9 C316.867,9.132 317.334,9.265 317.8,9.4 L308.7,41.6 C308.3,41.499 307.9,41.399 307.5,41.3 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M317.8,9.4 C318.3,9.532 318.8,9.665 319.3,9.8 L310,42 C309.567,41.865 309.134,41.732 308.7,41.6 z" fill="#345C96" fill-opacity="0.2"/>
<path d="M317.8,9.4 C318.3,9.532 318.8,9.665 319.3,9.8 L310,42 C309.567,41.865 309.134,41.732 308.7,41.6 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M319.3,9.8 C319.767,9.932 320.234,10.065 320.7,10.2 L311.2,42.3 C310.8,42.199 310.4,42.099 310,42 z" fill="#365F9A" fill-opacity="0.2"/>
<path d="M319.3,9.8 C319.767,9.932 320.234,10.065 320.7,10.2 L311.2,42.3 C310.8,42.199 310.4,42.099 310,42 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M320.7,10.2 C321.167,10.332 321.634,10.465 322.1,10.6 L312.5,42.7 C312.067,42.565 311.634,42.432 311.2,42.3 z" fill="#38629D" fill-opacity="0.2"/>
<path d="M320.7,10.2 C321.167,10.332 321.634,10.465 322.1,10.6 L312.5,42.7 C312.067,42.565 311.634,42.432 311.2,42.3 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M322.1,10.6 C322.601,10.765 323.101,10.932 323.6,11.1 L313.7,43.1 C313.3,42.965 312.9,42.832 312.5,42.7 z" fill="#3A65A0" fill-opacity="0.2"/>
<path d="M322.1,10.6 C322.601,10.765 323.101,10.932 323.6,11.1 L313.7,43.1 C313.3,42.965 312.9,42.832 312.5,42.7 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M303.3,5.8 C304.301,5.994 305.301,6.194 306.3,6.4 L298.7,39 C297.868,38.828 297.034,38.662 296.2,38.5 z" fill="#21457C" fill-opacity="0.2"/>
<path d="M303.3,5.8 C304.301,5.994 305.301,6.194 306.3,6.4 L298.7,39 C297.868,38.828 297.034,38.662 296.2,38.5 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M323.6,11.1 C324.067,11.232 324.534,11.365 325,11.5 L314.9,43.5 C314.5,43.365 314.1,43.232 313.7,43.1 z" fill="#3D68A3" fill-opacity="0.2"/>
<path d="M323.6,11.1 C324.067,11.232 324.534,11.365 325,11.5 L314.9,43.5 C314.5,43.365 314.1,43.232 313.7,43.1 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M306.3,6.4 C307.268,6.628 308.235,6.861 309.2,7.1 L301.2,39.6 C300.368,39.395 299.535,39.195 298.7,39 z" fill="#234880" fill-opacity="0.2"/>
<path d="M306.3,6.4 C307.268,6.628 308.235,6.861 309.2,7.1 L301.2,39.6 C300.368,39.395 299.535,39.195 298.7,39 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M325,11.5 C325.467,11.665 325.934,11.832 326.4,12 L316.2,43.9 C315.767,43.765 315.334,43.632 314.9,43.5 z" fill="#3F6BA7" fill-opacity="0.2"/>
<path d="M325,11.5 C325.467,11.665 325.934,11.832 326.4,12 L316.2,43.9 C315.767,43.765 315.334,43.632 314.9,43.5 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M326.4,12 C326.867,12.132 327.334,12.265 327.8,12.4 L317.4,44.3 C317,44.166 316.6,44.032 316.2,43.9 z" fill="#416EAA" fill-opacity="0.2"/>
<path d="M326.4,12 C326.867,12.132 327.334,12.265 327.8,12.4 L317.4,44.3 C317,44.166 316.6,44.032 316.2,43.9 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M327.8,12.4 C328.267,12.565 328.734,12.732 329.2,12.9 L318.6,44.7 C318.2,44.565 317.8,44.432 317.4,44.3 z" fill="#4371AD" fill-opacity="0.2"/>
<path d="M327.8,12.4 C328.267,12.565 328.734,12.732 329.2,12.9 L318.6,44.7 C318.2,44.565 317.8,44.432 317.4,44.3 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M451.4,329.6 C450.596,331.579 449.762,333.546 448.9,335.5 L412.4,319.8 C413.09,318.21 413.757,316.61 414.4,315 z" fill="#5296D5" fill-opacity="0.2"/>
<path d="M451.4,329.6 C450.596,331.579 449.762,333.546 448.9,335.5 L412.4,319.8 C413.09,318.21 413.757,316.61 414.4,315 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M482.5,341.9 C481.945,343.272 481.379,344.638 480.8,346 L449.9,333.2 C450.411,332.005 450.911,330.804 451.4,329.6 z" fill="#0468A3" fill-opacity="0.2"/>
<path d="M482.5,341.9 C481.945,343.272 481.379,344.638 480.8,346 L449.9,333.2 C450.411,332.005 450.911,330.804 451.4,329.6 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M480.8,346 C480.601,346.467 480.401,346.934 480.2,347.4 L449.4,334.3 C449.568,333.934 449.734,333.567 449.9,333.2 z" fill="#357EB9" fill-opacity="0.2"/>
<path d="M480.8,346 C480.601,346.467 480.401,346.934 480.2,347.4 L449.4,334.3 C449.568,333.934 449.734,333.567 449.9,333.2 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M480.2,347.4 C480.035,347.867 479.868,348.334 479.7,348.8 L448.9,335.5 C449.068,335.101 449.235,334.701 449.4,334.3 z" fill="#5296D0" fill-opacity="0.2"/>
<path d="M480.2,347.4 C480.035,347.867 479.868,348.334 479.7,348.8 L448.9,335.5 C449.068,335.101 449.235,334.701 449.4,334.3 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M74.4,270 C66.918,204.362 96.655,140.029 151.5,103.2 L180.3,146.2 C141.504,172.253 120.481,217.771 125.8,264.2 z" fill="#D62728" fill-opacity="0.2"/>
<path d="M74.4,270 C66.918,204.362 96.655,140.029 151.5,103.2 L180.3,146.2 C141.504,172.253 120.481,217.771 125.8,264.2 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M128.2,71 C128.566,70.766 128.933,70.532 129.3,70.3 L151.5,103.2 C151.199,103.399 150.899,103.599 150.6,103.8 z" fill="#D74032" fill-opacity="0.2"/>
<path d="M128.2,71 C128.566,70.766 128.933,70.532 129.3,70.3 L151.5,103.2 C151.199,103.399 150.899,103.599 150.6,103.8 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M109.4,43.3 C109.799,42.999 110.199,42.699 110.6,42.4 L129.3,70.3 C128.933,70.532 128.566,70.766 128.2,71 z" fill="#9E000A" fill-opacity="0.2"/>
<path d="M109.4,43.3 C109.799,42.999 110.199,42.699 110.6,42.4 L129.3,70.3 C128.933,70.532 128.566,70.766 128.2,71 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M126.1,72.4 C126.797,71.929 127.497,71.463 128.2,71 L150.6,103.8 C149.998,104.196 149.398,104.596 148.8,105 z" fill="#C32F22" fill-opacity="0.2"/>
<path d="M126.1,72.4 C126.797,71.929 127.497,71.463 128.2,71 L150.6,103.8 C149.998,104.196 149.398,104.596 148.8,105 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M106.9,45 C107.73,44.428 108.563,43.862 109.4,43.3 L128.2,71 C127.497,71.463 126.797,71.929 126.1,72.4 z" fill="#8B0000" fill-opacity="0.2"/>
<path d="M106.9,45 C107.73,44.428 108.563,43.862 109.4,43.3 L128.2,71 C127.497,71.463 126.797,71.929 126.1,72.4 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M34.9,274.5 C30.183,233.107 37.51,191.233 56,153.9 L91.6,171.5 C76.508,201.994 70.536,236.196 74.4,270 z" fill="#9C0000" fill-opacity="0.2"/>
<path d="M34.9,274.5 C30.183,233.107 37.51,191.233 56,153.9 L91.6,171.5 C76.508,201.994 70.536,236.196 74.4,270 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M10.2,179.3 C10.494,178.332 10.794,177.365 11.1,176.4 L43.1,186.3 C42.828,187.132 42.562,187.965 42.3,188.8 z" fill="#931E14" fill-opacity="0.2"/>
<path d="M10.2,179.3 C10.494,178.332 10.794,177.365 11.1,176.4 L43.1,186.3 C42.828,187.132 42.562,187.965 42.3,188.8 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M11.1,176.4 C11.395,175.465 11.695,174.532 12,173.6 L43.9,183.8 C43.628,184.632 43.362,185.465 43.1,186.3 z" fill="#951F15" fill-opacity="0.2"/>
<path d="M11.1,176.4 C11.395,175.465 11.695,174.532 12,173.6 L43.9,183.8 C43.628,184.632 43.362,185.465 43.1,186.3 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M16.9,159.5 C17.099,159.033 17.299,158.566 17.5,158.1 L48.6,170.4 C48.465,170.8 48.332,171.2 48.2,171.6 z" fill="#A6291B" fill-opacity="0.2"/>
<path d="M16.9,159.5 C17.099,159.033 17.299,158.566 17.5,158.1 L48.6,170.4 C48.465,170.8 48.332,171.2 48.2,171.6 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M3.2,209.9 C3.453,208.398 3.72,206.898 4,205.4 L37,211.4 C36.755,212.665 36.522,213.931 36.3,215.2 z" fill="#7F110D" fill-opacity="0.2"/>
<path d="M3.2,209.9 C3.453,208.398 3.72,206.898 4,205.4 L37,211.4 C36.755,212.665 36.522,213.931 36.3,215.2 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M17.5,158.1 C17.665,157.633 17.832,157.166 18,156.7 L49.1,169.2 C48.932,169.599 48.765,169.999 48.6,170.4 z" fill="#A92B1C" fill-opacity="0.2"/>
<path d="M17.5,158.1 C17.665,157.633 17.832,157.166 18,156.7 L49.1,169.2 C48.932,169.599 48.765,169.999 48.6,170.4 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M18,156.7 C18.199,156.266 18.399,155.833 18.6,155.4 L49.6,168 C49.432,168.399 49.265,168.799 49.1,169.2 z" fill="#AC2D1D" fill-opacity="0.2"/>
<path d="M18,156.7 C18.199,156.266 18.399,155.833 18.6,155.4 L49.6,168 C49.432,168.399 49.265,168.799 49.1,169.2 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M0.2,239.6 C0.276,237.599 0.376,235.599 0.5,233.6 L34,235.8 C33.879,237.532 33.779,239.266 33.7,241 z" fill="#720706" fill-opacity="0.2"/>
<path d="M0.2,239.6 C0.276,237.599 0.376,235.599 0.5,233.6 L34,235.8 C33.879,237.532 33.779,239.266 33.7,241 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M0.5,266.4 C0.314,263.436 0.18,260.469 0.1,257.5 L33.6,256.5 C33.688,259.069 33.821,261.636 34,264.2 z" fill="#6A0202" fill-opacity="0.2"/>
<path d="M0.5,266.4 C0.314,263.436 0.18,260.469 0.1,257.5 L33.6,256.5 C33.688,259.069 33.821,261.636 34,264.2 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M0.1,257.5 C0.013,254.501 -0.021,251.5 -0,248.5 L33.5,248.7 C33.486,251.3 33.52,253.901 33.6,256.5 z" fill="#6C0303" fill-opacity="0.2"/>
<path d="M0.1,257.5 C0.013,254.501 -0.021,251.5 -0,248.5 L33.5,248.7 C33.486,251.3 33.52,253.901 33.6,256.5 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M12,173.6 C12.295,172.665 12.595,171.732 12.9,170.8 L44.7,181.4 C44.429,182.198 44.162,182.998 43.9,183.8 z" fill="#982116" fill-opacity="0.2"/>
<path d="M12,173.6 C12.295,172.665 12.595,171.732 12.9,170.8 L44.7,181.4 C44.429,182.198 44.162,182.998 43.9,183.8 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M18.6,155.4 C18.799,154.933 18.999,154.466 19.2,154 L50.1,166.8 C49.932,167.2 49.765,167.6 49.6,168 z" fill="#AF2E1E" fill-opacity="0.2"/>
<path d="M18.6,155.4 C18.799,154.933 18.999,154.466 19.2,154 L50.1,166.8 C49.932,167.2 49.765,167.6 49.6,168 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M12.9,170.8 C13.227,169.831 13.561,168.865 13.9,167.9 L45.5,178.9 C45.228,179.732 44.962,180.565 44.7,181.4 z" fill="#9B2317" fill-opacity="0.2"/>
<path d="M12.9,170.8 C13.227,169.831 13.561,168.865 13.9,167.9 L45.5,178.9 C45.228,179.732 44.962,180.565 44.7,181.4 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M19.2,154 C19.399,153.533 19.599,153.066 19.8,152.6 L50.6,165.7 C50.432,166.066 50.266,166.433 50.1,166.8 z" fill="#B2301F" fill-opacity="0.2"/>
<path d="M19.2,154 C19.399,153.533 19.599,153.066 19.8,152.6 L50.6,165.7 C50.432,166.066 50.266,166.433 50.1,166.8 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M19.8,152.6 C19.965,152.133 20.132,151.666 20.3,151.2 L51.1,164.5 C50.932,164.9 50.765,165.299 50.6,165.7 z" fill="#B53220" fill-opacity="0.2"/>
<path d="M19.8,152.6 C19.965,152.133 20.132,151.666 20.3,151.2 L51.1,164.5 C50.932,164.9 50.765,165.299 50.6,165.7 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M20.3,151.2 C20.499,150.766 20.699,150.333 20.9,149.9 L51.6,163.3 C51.432,163.7 51.265,164.1 51.1,164.5 z" fill="#B83321" fill-opacity="0.2"/>
<path d="M20.3,151.2 C20.499,150.766 20.699,150.333 20.9,149.9 L51.6,163.3 C51.432,163.7 51.265,164.1 51.1,164.5 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M-0,248.5 C0.014,245.532 0.081,242.565 0.2,239.6 L33.7,241 C33.588,243.565 33.521,246.132 33.5,248.7 z" fill="#6F0505" fill-opacity="0.2"/>
<path d="M-0,248.5 C0.014,245.532 0.081,242.565 0.2,239.6 L33.7,241 C33.588,243.565 33.521,246.132 33.5,248.7 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M0.5,233.6 C0.643,231.598 0.809,229.598 1,227.6 L34.4,230.6 C34.246,232.332 34.112,234.065 34,235.8 z" fill="#740908" fill-opacity="0.2"/>
<path d="M0.5,233.6 C0.643,231.598 0.809,229.598 1,227.6 L34.4,230.6 C34.246,232.332 34.112,234.065 34,235.8 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M1,227.6 C1.177,225.631 1.377,223.664 1.6,221.7 L34.9,225.5 C34.713,227.198 34.547,228.898 34.4,230.6 z" fill="#770B09" fill-opacity="0.2"/>
<path d="M1,227.6 C1.177,225.631 1.377,223.664 1.6,221.7 L34.9,225.5 C34.713,227.198 34.547,228.898 34.4,230.6 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M4,205.4 C4.254,203.931 4.52,202.464 4.8,201 L37.7,207.6 C37.455,208.865 37.222,210.131 37,211.4 z" fill="#82130E" fill-opacity="0.2"/>
<path d="M4,205.4 C4.254,203.931 4.52,202.464 4.8,201 L37.7,207.6 C37.455,208.865 37.222,210.131 37,211.4 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M4.8,201 C5.121,199.564 5.454,198.13 5.8,196.7 L38.5,203.8 C38.222,205.064 37.955,206.331 37.7,207.6 z" fill="#85150F" fill-opacity="0.2"/>
<path d="M4.8,201 C5.121,199.564 5.454,198.13 5.8,196.7 L38.5,203.8 C38.222,205.064 37.955,206.331 37.7,207.6 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M20.9,149.9 C21.099,149.433 21.299,148.966 21.5,148.5 L52.1,162.1 C51.932,162.499 51.765,162.899 51.6,163.3 z" fill="#BB3522" fill-opacity="0.2"/>
<path d="M20.9,149.9 C21.099,149.433 21.299,148.966 21.5,148.5 L52.1,162.1 C51.932,162.499 51.765,162.899 51.6,163.3 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M21.5,148.5 C21.699,148.033 21.899,147.566 22.1,147.1 L52.7,160.9 C52.499,161.299 52.299,161.699 52.1,162.1 z" fill="#BD3723" fill-opacity="0.2"/>
<path d="M21.5,148.5 C21.699,148.033 21.899,147.566 22.1,147.1 L52.7,160.9 C52.499,161.299 52.299,161.699 52.1,162.1 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M13.9,167.9 C14.228,166.965 14.561,166.031 14.9,165.1 L46.4,176.5 C46.095,177.298 45.795,178.098 45.5,178.9 z" fill="#9E2418" fill-opacity="0.2"/>
<path d="M13.9,167.9 C14.228,166.965 14.561,166.031 14.9,165.1 L46.4,176.5 C46.095,177.298 45.795,178.098 45.5,178.9 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M5.8,196.7 C6.12,195.23 6.453,193.764 6.8,192.3 L39.3,200 C39.022,201.264 38.755,202.531 38.5,203.8 z" fill="#871710" fill-opacity="0.2"/>
<path d="M5.8,196.7 C6.12,195.23 6.453,193.764 6.8,192.3 L39.3,200 C39.022,201.264 38.755,202.531 38.5,203.8 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M1.6,221.7 C1.843,219.73 2.11,217.763 2.4,215.8 L35.5,220.4 C35.28,222.098 35.08,223.798 34.9,225.5 z" fill="#7A0D0B" fill-opacity="0.2"/>
<path d="M1.6,221.7 C1.843,219.73 2.11,217.763 2.4,215.8 L35.5,220.4 C35.28,222.098 35.08,223.798 34.9,225.5 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M14.9,165.1 C15.228,164.165 15.561,163.231 15.9,162.3 L47.2,174.1 C46.929,174.898 46.662,175.698 46.4,176.5 z" fill="#A12619" fill-opacity="0.2"/>
<path d="M14.9,165.1 C15.228,164.165 15.561,163.231 15.9,162.3 L47.2,174.1 C46.929,174.898 46.662,175.698 46.4,176.5 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M6.8,192.3 C7.12,190.83 7.453,189.364 7.8,187.9 L40.3,196.3 C39.956,197.53 39.622,198.764 39.3,200 z" fill="#8A1811" fill-opacity="0.2"/>
<path d="M6.8,192.3 C7.12,190.83 7.453,189.364 7.8,187.9 L40.3,196.3 C39.956,197.53 39.622,198.764 39.3,200 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M22.1,147.1 C22.332,146.666 22.565,146.233 22.8,145.8 L53.2,159.7 C53.032,160.1 52.865,160.499 52.7,160.9 z" fill="#C03824" fill-opacity="0.2"/>
<path d="M22.1,147.1 C22.332,146.666 22.565,146.233 22.8,145.8 L53.2,159.7 C53.032,160.1 52.865,160.499 52.7,160.9 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M15.9,162.3 C16.228,161.365 16.561,160.431 16.9,159.5 L48.2,171.6 C47.861,172.431 47.528,173.265 47.2,174.1 z" fill="#A4281A" fill-opacity="0.2"/>
<path d="M15.9,162.3 C16.228,161.365 16.561,160.431 16.9,159.5 L48.2,171.6 C47.861,172.431 47.528,173.265 47.2,174.1 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M7.8,187.9 C8.187,186.463 8.587,185.03 9,183.6 L41.3,192.5 C40.955,193.764 40.622,195.03 40.3,196.3 z" fill="#8D1A12" fill-opacity="0.2"/>
<path d="M7.8,187.9 C8.187,186.463 8.587,185.03 9,183.6 L41.3,192.5 C40.955,193.764 40.622,195.03 40.3,196.3 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M1.6,278.3 C1.139,274.343 0.772,270.375 0.5,266.4 L34,264.2 C34.218,267.64 34.518,271.074 34.9,274.5 z" fill="#670000" fill-opacity="0.2"/>
<path d="M1.6,278.3 C1.139,274.343 0.772,270.375 0.5,266.4 L34,264.2 C34.218,267.64 34.518,271.074 34.9,274.5 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M22.8,145.8 C22.999,145.333 23.199,144.866 23.4,144.4 L53.7,158.6 C53.532,158.966 53.366,159.333 53.2,159.7 z" fill="#C33A25" fill-opacity="0.2"/>
<path d="M22.8,145.8 C22.999,145.333 23.199,144.866 23.4,144.4 L53.7,158.6 C53.532,158.966 53.366,159.333 53.2,159.7 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M2.4,215.8 C2.643,213.83 2.91,211.863 3.2,209.9 L36.3,215.2 C36.012,216.93 35.746,218.663 35.5,220.4 z" fill="#7C0F0C" fill-opacity="0.2"/>
<path d="M2.4,215.8 C2.643,213.83 2.91,211.863 3.2,209.9 L36.3,215.2 C36.012,216.93 35.746,218.663 35.5,220.4 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M23.4,144.4 C23.599,143.966 23.799,143.533 24,143.1 L54.3,157.4 C54.099,157.799 53.899,158.199 53.7,158.6 z" fill="#C63C26" fill-opacity="0.2"/>
<path d="M23.4,144.4 C23.599,143.966 23.799,143.533 24,143.1 L54.3,157.4 C54.099,157.799 53.899,158.199 53.7,158.6 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M24,143.1 C24.232,142.633 24.465,142.166 24.7,141.7 L54.9,156.2 C54.699,156.599 54.499,156.999 54.3,157.4 z" fill="#C93D27" fill-opacity="0.2"/>
<path d="M24,143.1 C24.232,142.633 24.465,142.166 24.7,141.7 L54.9,156.2 C54.699,156.599 54.499,156.999 54.3,157.4 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M24.7,141.7 C24.899,141.266 25.099,140.833 25.3,140.4 L55.4,155.1 C55.232,155.466 55.066,155.833 54.9,156.2 z" fill="#CC3F28" fill-opacity="0.2"/>
<path d="M24.7,141.7 C24.899,141.266 25.099,140.833 25.3,140.4 L55.4,155.1 C55.232,155.466 55.066,155.833 54.9,156.2 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M9,183.6 C9.387,182.163 9.787,180.73 10.2,179.3 L42.3,188.8 C41.956,190.03 41.622,191.264 41.3,192.5 z" fill="#901C13" fill-opacity="0.2"/>
<path d="M9,183.6 C9.387,182.163 9.787,180.73 10.2,179.3 L42.3,188.8 C41.956,190.03 41.622,191.264 41.3,192.5 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M25.3,140.4 C25.532,139.933 25.765,139.466 26,139 L56,153.9 C55.799,154.299 55.599,154.699 55.4,155.1 z" fill="#CF4129" fill-opacity="0.2"/>
<path d="M25.3,140.4 C25.532,139.933 25.765,139.466 26,139 L56,153.9 C55.799,154.299 55.599,154.699 55.4,155.1 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M56,153.9 C72.143,121.272 96.253,93.241 126.1,72.4 L148.8,105 C124.45,122.01 104.778,144.88 91.6,171.5 z" fill="#B01C11" fill-opacity="0.2"/>
<path d="M56,153.9 C72.143,121.272 96.253,93.241 126.1,72.4 L148.8,105 C124.45,122.01 104.778,144.88 91.6,171.5 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M78,68.5 C78.366,68.166 78.732,67.832 79.1,67.5 L102,92 C101.699,92.266 101.399,92.533 101.1,92.8 z" fill="#A8291B" fill-opacity="0.2"/>
<path d="M78,68.5 C78.366,68.166 78.732,67.832 79.1,67.5 L102,92 C101.699,92.266 101.399,92.533 101.1,92.8 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M79.1,67.5 C79.466,67.166 79.832,66.832 80.2,66.5 L103,91.1 C102.666,91.399 102.332,91.699 102,92 z" fill="#AB2B1C" fill-opacity="0.2"/>
<path d="M79.1,67.5 C79.466,67.166 79.832,66.832 80.2,66.5 L103,91.1 C102.666,91.399 102.332,91.699 102,92 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M80.2,66.5 C80.566,66.166 80.932,65.832 81.3,65.5 L103.9,90.2 C103.599,90.499 103.299,90.799 103,91.1 z" fill="#AD2C1D" fill-opacity="0.2"/>
<path d="M80.2,66.5 C80.566,66.166 80.932,65.832 81.3,65.5 L103.9,90.2 C103.599,90.499 103.299,90.799 103,91.1 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M26,139 C27.75,135.457 29.584,131.956 31.5,128.5 L60.8,144.7 C59.127,147.728 57.526,150.795 56,153.9 z" fill="#790000" fill-opacity="0.2"/>
<path d="M26,139 C27.75,135.457 29.584,131.956 31.5,128.5 L60.8,144.7 C59.127,147.728 57.526,150.795 56,153.9 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M35.3,122 C36.313,120.288 37.346,118.588 38.4,116.9 L66.7,134.7 C65.783,136.156 64.882,137.623 64,139.1 z" fill="#7E0403" fill-opacity="0.2"/>
<path d="M35.3,122 C36.313,120.288 37.346,118.588 38.4,116.9 L66.7,134.7 C65.783,136.156 64.882,137.623 64,139.1 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M81.3,65.5 C81.666,65.166 82.032,64.832 82.4,64.5 L104.9,89.3 C104.566,89.599 104.232,89.899 103.9,90.2 z" fill="#B02E1E" fill-opacity="0.2"/>
<path d="M81.3,65.5 C81.666,65.166 82.032,64.832 82.4,64.5 L104.9,89.3 C104.566,89.599 104.232,89.899 103.9,90.2 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M82.4,64.5 C82.766,64.166 83.132,63.832 83.5,63.5 L105.8,88.5 C105.499,88.766 105.199,89.033 104.9,89.3 z" fill="#B2301F" fill-opacity="0.2"/>
<path d="M82.4,64.5 C82.766,64.166 83.132,63.832 83.5,63.5 L105.8,88.5 C105.499,88.766 105.199,89.033 104.9,89.3 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M53.9,95 C54.495,94.196 55.095,93.396 55.7,92.6 L81.8,113.7 C81.263,114.364 80.729,115.03 80.2,115.7 z" fill="#8C130C" fill-opacity="0.2"/>
<path d="M53.9,95 C54.495,94.196 55.095,93.396 55.7,92.6 L81.8,113.7 C81.263,114.364 80.729,115.03 80.2,115.7 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M83.5,63.5 C83.866,63.166 84.232,62.832 84.6,62.5 L106.8,87.6 C106.466,87.899 106.132,88.199 105.8,88.5 z" fill="#B53121" fill-opacity="0.2"/>
<path d="M83.5,63.5 C83.866,63.166 84.232,62.832 84.6,62.5 L106.8,87.6 C106.466,87.899 106.132,88.199 105.8,88.5 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M55.7,92.6 C56.329,91.83 56.962,91.063 57.6,90.3 L83.4,111.7 C82.863,112.364 82.329,113.03 81.8,113.7 z" fill="#8E150D" fill-opacity="0.2"/>
<path d="M55.7,92.6 C56.329,91.83 56.962,91.063 57.6,90.3 L83.4,111.7 C82.863,112.364 82.329,113.03 81.8,113.7 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M57.6,90.3 C58.262,89.529 58.929,88.763 59.6,88 L85.1,109.7 C84.529,110.363 83.963,111.03 83.4,111.7 z" fill="#90170F" fill-opacity="0.2"/>
<path d="M57.6,90.3 C58.262,89.529 58.929,88.763 59.6,88 L85.1,109.7 C84.529,110.363 83.963,111.03 83.4,111.7 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M84.6,62.5 C84.999,62.165 85.399,61.832 85.8,61.5 L107.8,86.8 C107.466,87.066 107.133,87.332 106.8,87.6 z" fill="#B73322" fill-opacity="0.2"/>
<path d="M84.6,62.5 C84.999,62.165 85.399,61.832 85.8,61.5 L107.8,86.8 C107.466,87.066 107.133,87.332 106.8,87.6 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M38.4,116.9 C39.447,115.221 40.514,113.554 41.6,111.9 L69.5,130.4 C68.55,131.822 67.616,133.256 66.7,134.7 z" fill="#800705" fill-opacity="0.2"/>
<path d="M38.4,116.9 C39.447,115.221 40.514,113.554 41.6,111.9 L69.5,130.4 C68.55,131.822 67.616,133.256 66.7,134.7 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M85.8,61.5 C86.166,61.166 86.532,60.832 86.9,60.5 L108.8,85.9 C108.466,86.199 108.132,86.499 107.8,86.8 z" fill="#B93523" fill-opacity="0.2"/>
<path d="M85.8,61.5 C86.166,61.166 86.532,60.832 86.9,60.5 L108.8,85.9 C108.466,86.199 108.132,86.499 107.8,86.8 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M31.5,128.5 C32.734,126.314 34.001,124.147 35.3,122 L64,139.1 C62.906,140.951 61.839,142.818 60.8,144.7 z" fill="#7B0202" fill-opacity="0.2"/>
<path d="M31.5,128.5 C32.734,126.314 34.001,124.147 35.3,122 L64,139.1 C62.906,140.951 61.839,142.818 60.8,144.7 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M59.6,88 C60.229,87.263 60.862,86.53 61.5,85.8 L86.8,107.8 C86.23,108.43 85.663,109.063 85.1,109.7 z" fill="#931910" fill-opacity="0.2"/>
<path d="M59.6,88 C60.229,87.263 60.862,86.53 61.5,85.8 L86.8,107.8 C86.23,108.43 85.663,109.063 85.1,109.7 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M86.9,60.5 C87.266,60.199 87.632,59.899 88,59.6 L109.7,85.1 C109.399,85.366 109.099,85.632 108.8,85.9 z" fill="#BC3624" fill-opacity="0.2"/>
<path d="M86.9,60.5 C87.266,60.199 87.632,59.899 88,59.6 L109.7,85.1 C109.399,85.366 109.099,85.632 108.8,85.9 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M41.6,111.9 C42.713,110.22 43.847,108.553 45,106.9 L72.4,126.1 C71.416,127.522 70.449,128.955 69.5,130.4 z" fill="#820906" fill-opacity="0.2"/>
<path d="M41.6,111.9 C42.713,110.22 43.847,108.553 45,106.9 L72.4,126.1 C71.416,127.522 70.449,128.955 69.5,130.4 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M88,59.6 C88.399,59.265 88.799,58.932 89.2,58.6 L110.7,84.2 C110.366,84.499 110.032,84.799 109.7,85.1 z" fill="#BE3826" fill-opacity="0.2"/>
<path d="M88,59.6 C88.399,59.265 88.799,58.932 89.2,58.6 L110.7,84.2 C110.366,84.499 110.032,84.799 109.7,85.1 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M61.5,85.8 C62.162,85.029 62.829,84.263 63.5,83.5 L88.5,105.8 C87.929,106.463 87.363,107.13 86.8,107.8 z" fill="#951B11" fill-opacity="0.2"/>
<path d="M61.5,85.8 C62.162,85.029 62.829,84.263 63.5,83.5 L88.5,105.8 C87.929,106.463 87.363,107.13 86.8,107.8 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M45,106.9 C46.148,105.286 47.314,103.686 48.5,102.1 L75.5,121.9 C74.45,123.287 73.416,124.688 72.4,126.1 z" fill="#850C08" fill-opacity="0.2"/>
<path d="M45,106.9 C46.148,105.286 47.314,103.686 48.5,102.1 L75.5,121.9 C74.45,123.287 73.416,124.688 72.4,126.1 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M63.5,83.5 C64.162,82.763 64.829,82.029 65.5,81.3 L90.2,103.9 C89.63,104.53 89.063,105.163 88.5,105.8 z" fill="#971D12" fill-opacity="0.2"/>
<path d="M63.5,83.5 C64.162,82.763 64.829,82.029 65.5,81.3 L90.2,103.9 C89.63,104.53 89.063,105.163 88.5,105.8 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M89.2,58.6 C89.566,58.266 89.932,57.932 90.3,57.6 L111.7,83.4 C111.366,83.666 111.033,83.932 110.7,84.2 z" fill="#C13A27" fill-opacity="0.2"/>
<path d="M89.2,58.6 C89.566,58.266 89.932,57.932 90.3,57.6 L111.7,83.4 C111.366,83.666 111.033,83.932 110.7,84.2 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M65.5,81.3 C66.162,80.563 66.829,79.829 67.5,79.1 L92,102 C91.396,102.63 90.796,103.263 90.2,103.9 z" fill="#9A1E13" fill-opacity="0.2"/>
<path d="M65.5,81.3 C66.162,80.563 66.829,79.829 67.5,79.1 L92,102 C91.396,102.63 90.796,103.263 90.2,103.9 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M67.5,79.1 C68.196,78.396 68.896,77.696 69.6,77 L93.7,100.1 C93.13,100.73 92.563,101.363 92,102 z" fill="#9C2015" fill-opacity="0.2"/>
<path d="M67.5,79.1 C68.196,78.396 68.896,77.696 69.6,77 L93.7,100.1 C93.13,100.73 92.563,101.363 92,102 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M48.5,102.1 C49.356,100.892 50.223,99.692 51.1,98.5 L77.8,118.8 C77.024,119.826 76.257,120.86 75.5,121.9 z" fill="#870E09" fill-opacity="0.2"/>
<path d="M48.5,102.1 C49.356,100.892 50.223,99.692 51.1,98.5 L77.8,118.8 C77.024,119.826 76.257,120.86 75.5,121.9 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M51.1,98.5 C52.023,97.325 52.956,96.158 53.9,95 L80.2,115.7 C79.391,116.726 78.591,117.759 77.8,118.8 z" fill="#89110B" fill-opacity="0.2"/>
<path d="M51.1,98.5 C52.023,97.325 52.956,96.158 53.9,95 L80.2,115.7 C79.391,116.726 78.591,117.759 77.8,118.8 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M90.3,57.6 C90.699,57.299 91.099,56.999 91.5,56.7 L112.7,82.6 C112.366,82.866 112.033,83.132 111.7,83.4 z" fill="#C33B28" fill-opacity="0.2"/>
<path d="M90.3,57.6 C90.699,57.299 91.099,56.999 91.5,56.7 L112.7,82.6 C112.366,82.866 112.033,83.132 111.7,83.4 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M91.5,56.7 C91.866,56.366 92.232,56.032 92.6,55.7 L113.7,81.8 C113.366,82.066 113.033,82.332 112.7,82.6 z" fill="#C63D29" fill-opacity="0.2"/>
<path d="M91.5,56.7 C91.866,56.366 92.232,56.032 92.6,55.7 L113.7,81.8 C113.366,82.066 113.033,82.332 112.7,82.6 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M92.6,55.7 C92.999,55.399 93.399,55.099 93.8,54.8 L114.7,81 C114.366,81.266 114.033,81.532 113.7,81.8 z" fill="#C83F2A" fill-opacity="0.2"/>
<path d="M92.6,55.7 C92.999,55.399 93.399,55.099 93.8,54.8 L114.7,81 C114.366,81.266 114.033,81.532 113.7,81.8 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M93.8,54.8 C94.199,54.499 94.599,54.199 95,53.9 L115.7,80.2 C115.366,80.466 115.033,80.732 114.7,81 z" fill="#CB402C" fill-opacity="0.2"/>
<path d="M93.8,54.8 C94.199,54.499 94.599,54.199 95,53.9 L115.7,80.2 C115.366,80.466 115.033,80.732 114.7,81 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M95,53.9 C95.366,53.599 95.732,53.299 96.1,53 L116.8,79.4 C116.432,79.666 116.066,79.932 115.7,80.2 z" fill="#CD422D" fill-opacity="0.2"/>
<path d="M95,53.9 C95.366,53.599 95.732,53.299 96.1,53 L116.8,79.4 C116.432,79.666 116.066,79.932 115.7,80.2 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M69.6,77 C70.262,76.263 70.929,75.529 71.6,74.8 L95.5,98.3 C94.896,98.896 94.296,99.496 93.7,100.1 z" fill="#9F2216" fill-opacity="0.2"/>
<path d="M69.6,77 C70.262,76.263 70.929,75.529 71.6,74.8 L95.5,98.3 C94.896,98.896 94.296,99.496 93.7,100.1 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M96.1,53 C96.499,52.665 96.899,52.332 97.3,52 L117.8,78.6 C117.466,78.866 117.133,79.132 116.8,79.4 z" fill="#D0442E" fill-opacity="0.2"/>
<path d="M96.1,53 C96.499,52.665 96.899,52.332 97.3,52 L117.8,78.6 C117.466,78.866 117.133,79.132 116.8,79.4 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M97.3,52 C97.699,51.699 98.099,51.399 98.5,51.1 L118.8,77.8 C118.466,78.066 118.133,78.332 117.8,78.6 z" fill="#D2452F" fill-opacity="0.2"/>
<path d="M97.3,52 C97.699,51.699 98.099,51.399 98.5,51.1 L118.8,77.8 C118.466,78.066 118.133,78.332 117.8,78.6 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M98.5,51.1 C98.899,50.799 99.299,50.499 99.7,50.2 L119.8,77 C119.466,77.266 119.133,77.532 118.8,77.8 z" fill="#D54731" fill-opacity="0.2"/>
<path d="M98.5,51.1 C98.899,50.799 99.299,50.499 99.7,50.2 L119.8,77 C119.466,77.266 119.133,77.532 118.8,77.8 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M99.7,50.2 C100.099,49.899 100.499,49.599 100.9,49.3 L120.9,76.2 C120.532,76.466 120.166,76.732 119.8,77 z" fill="#D74832" fill-opacity="0.2"/>
<path d="M99.7,50.2 C100.099,49.899 100.499,49.599 100.9,49.3 L120.9,76.2 C120.532,76.466 120.166,76.732 119.8,77 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M100.9,49.3 C101.299,49.032 101.699,48.766 102.1,48.5 L121.9,75.5 C121.566,75.732 121.233,75.966 120.9,76.2 z" fill="#DA4A33" fill-opacity="0.2"/>
<path d="M100.9,49.3 C101.299,49.032 101.699,48.766 102.1,48.5 L121.9,75.5 C121.566,75.732 121.233,75.966 120.9,76.2 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M102.1,48.5 C102.499,48.199 102.899,47.899 103.3,47.6 L123,74.7 C122.632,74.966 122.266,75.232 121.9,75.5 z" fill="#DC4C35" fill-opacity="0.2"/>
<path d="M102.1,48.5 C102.499,48.199 102.899,47.899 103.3,47.6 L123,74.7 C122.632,74.966 122.266,75.232 121.9,75.5 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M103.3,47.6 C103.699,47.299 104.099,46.999 104.5,46.7 L124,73.9 C123.666,74.166 123.333,74.432 123,74.7 z" fill="#DF4D36" fill-opacity="0.2"/>
<path d="M103.3,47.6 C103.699,47.299 104.099,46.999 104.5,46.7 L124,73.9 C123.666,74.166 123.333,74.432 123,74.7 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M104.5,46.7 C104.899,46.399 105.299,46.099 105.7,45.8 L125.1,73.2 C124.733,73.432 124.366,73.666 124,73.9 z" fill="#E14F37" fill-opacity="0.2"/>
<path d="M104.5,46.7 C104.899,46.399 105.299,46.099 105.7,45.8 L125.1,73.2 C124.733,73.432 124.366,73.666 124,73.9 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M71.6,74.8 C72.329,74.096 73.062,73.396 73.8,72.7 L97.4,96.5 C96.763,97.096 96.13,97.696 95.5,98.3 z" fill="#A12417" fill-opacity="0.2"/>
<path d="M71.6,74.8 C72.329,74.096 73.062,73.396 73.8,72.7 L97.4,96.5 C96.763,97.096 96.13,97.696 95.5,98.3 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M73.8,72.7 C74.496,71.996 75.196,71.296 75.9,70.6 L99.2,94.6 C98.596,95.23 97.996,95.863 97.4,96.5 z" fill="#A32618" fill-opacity="0.2"/>
<path d="M73.8,72.7 C74.496,71.996 75.196,71.296 75.9,70.6 L99.2,94.6 C98.596,95.23 97.996,95.863 97.4,96.5 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M105.7,45.8 C106.099,45.532 106.499,45.266 106.9,45 L126.1,72.4 C125.766,72.666 125.433,72.932 125.1,73.2 z" fill="#E45138" fill-opacity="0.2"/>
<path d="M105.7,45.8 C106.099,45.532 106.499,45.266 106.9,45 L126.1,72.4 C125.766,72.666 125.433,72.932 125.1,73.2 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M75.9,70.6 C76.596,69.896 77.296,69.196 78,68.5 L101.1,92.8 C100.463,93.396 99.83,93.996 99.2,94.6 z" fill="#A62719" fill-opacity="0.2"/>
<path d="M75.9,70.6 C76.596,69.896 77.296,69.196 78,68.5 L101.1,92.8 C100.463,93.396 99.83,93.996 99.2,94.6 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M151.5,103.2 C165.547,93.796 180.869,86.454 197,81.4 L212.5,130.8 C201.085,134.367 190.241,139.553 180.3,146.2 z" fill="#9467BD" fill-opacity="0.2"/>
<path d="M151.5,103.2 C165.547,93.796 180.869,86.454 197,81.4 L212.5,130.8 C201.085,134.367 190.241,139.553 180.3,146.2 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M129.3,70.3 C138.957,63.792 149.123,58.073 159.7,53.2 L176.3,89.3 C167.674,93.26 159.38,97.908 151.5,103.2 z" fill="#643B8C" fill-opacity="0.2"/>
<path d="M129.3,70.3 C138.957,63.792 149.123,58.073 159.7,53.2 L176.3,89.3 C167.674,93.26 159.38,97.908 151.5,103.2 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M128.5,31.5 C129.364,31.028 130.231,30.562 131.1,30.1 L147,59.6 C146.231,59.995 145.464,60.395 144.7,60.8 z" fill="#4B2473" fill-opacity="0.2"/>
<path d="M128.5,31.5 C129.364,31.028 130.231,30.562 131.1,30.1 L147,59.6 C146.231,59.995 145.464,60.395 144.7,60.8 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M110.6,42.4 C113.494,40.472 116.428,38.605 119.4,36.8 L136.9,65.4 C134.333,66.98 131.799,68.614 129.3,70.3 z" fill="#36115E" fill-opacity="0.2"/>
<path d="M110.6,42.4 C113.494,40.472 116.428,38.605 119.4,36.8 L136.9,65.4 C134.333,66.98 131.799,68.614 129.3,70.3 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M131.1,30.1 C131.964,29.628 132.831,29.162 133.7,28.7 L149.3,58.3 C148.531,58.729 147.764,59.162 147,59.6 z" fill="#522B7A" fill-opacity="0.2"/>
<path d="M131.1,30.1 C131.964,29.628 132.831,29.162 133.7,28.7 L149.3,58.3 C148.531,58.729 147.764,59.162 147,59.6 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M139,26 C139.466,25.765 139.933,25.532 140.4,25.3 L155.1,55.4 C154.699,55.599 154.299,55.799 153.9,56 z" fill="#683E90" fill-opacity="0.2"/>
<path d="M139,26 C139.466,25.765 139.933,25.532 140.4,25.3 L155.1,55.4 C154.699,55.599 154.299,55.799 153.9,56 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M124.6,33.7 C125.893,32.955 127.193,32.222 128.5,31.5 L144.7,60.8 C143.594,61.424 142.494,62.057 141.4,62.7 z" fill="#441E6C" fill-opacity="0.2"/>
<path d="M124.6,33.7 C125.893,32.955 127.193,32.222 128.5,31.5 L144.7,60.8 C143.594,61.424 142.494,62.057 141.4,62.7 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M140.4,25.3 C140.833,25.099 141.266,24.899 141.7,24.7 L156.2,54.9 C155.833,55.066 155.466,55.232 155.1,55.4 z" fill="#6F4597" fill-opacity="0.2"/>
<path d="M140.4,25.3 C140.833,25.099 141.266,24.899 141.7,24.7 L156.2,54.9 C155.833,55.066 155.466,55.232 155.1,55.4 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M133.7,28.7 C134.597,28.228 135.497,27.761 136.4,27.3 L151.6,57.2 C150.831,57.562 150.065,57.929 149.3,58.3 z" fill="#593181" fill-opacity="0.2"/>
<path d="M133.7,28.7 C134.597,28.228 135.497,27.761 136.4,27.3 L151.6,57.2 C150.831,57.562 150.065,57.929 149.3,58.3 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M136.4,27.3 C137.264,26.862 138.131,26.428 139,26 L153.9,56 C153.131,56.395 152.364,56.795 151.6,57.2 z" fill="#603889" fill-opacity="0.2"/>
<path d="M136.4,27.3 C137.264,26.862 138.131,26.428 139,26 L153.9,56 C153.131,56.395 152.364,56.795 151.6,57.2 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M141.7,24.7 C142.166,24.465 142.633,24.232 143.1,24 L157.4,54.3 C156.999,54.499 156.599,54.699 156.2,54.9 z" fill="#764C9F" fill-opacity="0.2"/>
<path d="M141.7,24.7 C142.166,24.465 142.633,24.232 143.1,24 L157.4,54.3 C156.999,54.499 156.599,54.699 156.2,54.9 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M143.1,24 C143.533,23.799 143.966,23.599 144.4,23.4 L158.6,53.7 C158.199,53.899 157.799,54.099 157.4,54.3 z" fill="#7E52A6" fill-opacity="0.2"/>
<path d="M143.1,24 C143.533,23.799 143.966,23.599 144.4,23.4 L158.6,53.7 C158.199,53.899 157.799,54.099 157.4,54.3 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M144.4,23.4 C144.866,23.199 145.333,22.999 145.8,22.8 L159.7,53.2 C159.333,53.366 158.966,53.532 158.6,53.7 z" fill="#8559AE" fill-opacity="0.2"/>
<path d="M144.4,23.4 C144.866,23.199 145.333,22.999 145.8,22.8 L159.7,53.2 C159.333,53.366 158.966,53.532 158.6,53.7 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M119.4,36.8 C121.121,35.746 122.854,34.712 124.6,33.7 L141.4,62.7 C139.889,63.582 138.389,64.482 136.9,65.4 z" fill="#3D1865" fill-opacity="0.2"/>
<path d="M119.4,36.8 C121.121,35.746 122.854,34.712 124.6,33.7 L141.4,62.7 C139.889,63.582 138.389,64.482 136.9,65.4 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M169.2,49.1 C171.617,48.156 174.051,47.256 176.5,46.4 L190,83.7 C188.02,84.431 186.053,85.198 184.1,86 z" fill="#8458AC" fill-opacity="0.2"/>
<path d="M169.2,49.1 C171.617,48.156 174.051,47.256 176.5,46.4 L190,83.7 C188.02,84.431 186.053,85.198 184.1,86 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M156.7,18 C157.166,17.832 157.633,17.665 158.1,17.5 L170.4,48.6 C169.999,48.765 169.6,48.932 169.2,49.1 z" fill="#552D7C" fill-opacity="0.2"/>
<path d="M156.7,18 C157.166,17.832 157.633,17.665 158.1,17.5 L170.4,48.6 C169.999,48.765 169.6,48.932 169.2,49.1 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M158.1,17.5 C158.566,17.299 159.033,17.099 159.5,16.9 L171.6,48.2 C171.2,48.332 170.8,48.465 170.4,48.6 z" fill="#623989" fill-opacity="0.2"/>
<path d="M158.1,17.5 C158.566,17.299 159.033,17.099 159.5,16.9 L171.6,48.2 C171.2,48.332 170.8,48.465 170.4,48.6 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M159.5,16.9 C159.966,16.732 160.433,16.565 160.9,16.4 L172.9,47.7 C172.466,47.865 172.033,48.032 171.6,48.2 z" fill="#704597" fill-opacity="0.2"/>
<path d="M159.5,16.9 C159.966,16.732 160.433,16.565 160.9,16.4 L172.9,47.7 C172.466,47.865 172.033,48.032 171.6,48.2 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M160.9,16.4 C161.366,16.232 161.833,16.065 162.3,15.9 L174.1,47.2 C173.699,47.365 173.299,47.532 172.9,47.7 z" fill="#7D52A5" fill-opacity="0.2"/>
<path d="M160.9,16.4 C161.366,16.232 161.833,16.065 162.3,15.9 L174.1,47.2 C173.699,47.365 173.299,47.532 172.9,47.7 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M162.3,15.9 C162.766,15.732 163.233,15.565 163.7,15.4 L175.3,46.8 C174.9,46.932 174.5,47.065 174.1,47.2 z" fill="#8B5FB3" fill-opacity="0.2"/>
<path d="M162.3,15.9 C162.766,15.732 163.233,15.565 163.7,15.4 L175.3,46.8 C174.9,46.932 174.5,47.065 174.1,47.2 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M163.7,15.4 C164.166,15.232 164.633,15.065 165.1,14.9 L176.5,46.4 C176.1,46.532 175.7,46.665 175.3,46.8 z" fill="#996BC1" fill-opacity="0.2"/>
<path d="M163.7,15.4 C164.166,15.232 164.633,15.065 165.1,14.9 L176.5,46.4 C176.1,46.532 175.7,46.665 175.3,46.8 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M176.5,46.4 C178.918,45.523 181.352,44.69 183.8,43.9 L196,81.7 C193.988,82.331 191.988,82.998 190,83.7 z" fill="#9467BD" fill-opacity="0.2"/>
<path d="M176.5,46.4 C178.918,45.523 181.352,44.69 183.8,43.9 L196,81.7 C193.988,82.331 191.988,82.998 190,83.7 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M165.1,14.9 C165.566,14.699 166.033,14.499 166.5,14.3 L177.7,45.9 C177.299,46.065 176.9,46.232 176.5,46.4 z" fill="#643B8C" fill-opacity="0.2"/>
<path d="M165.1,14.9 C165.566,14.699 166.033,14.499 166.5,14.3 L177.7,45.9 C177.299,46.065 176.9,46.232 176.5,46.4 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M166.5,14.3 C166.966,14.165 167.433,14.032 167.9,13.9 L178.9,45.5 C178.5,45.632 178.1,45.765 177.7,45.9 z" fill="#71479A" fill-opacity="0.2"/>
<path d="M166.5,14.3 C166.966,14.165 167.433,14.032 167.9,13.9 L178.9,45.5 C178.5,45.632 178.1,45.765 177.7,45.9 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M167.9,13.9 C168.366,13.732 168.833,13.565 169.3,13.4 L180.2,45.1 C179.766,45.232 179.333,45.365 178.9,45.5 z" fill="#7F54A8" fill-opacity="0.2"/>
<path d="M167.9,13.9 C168.366,13.732 168.833,13.565 169.3,13.4 L180.2,45.1 C179.766,45.232 179.333,45.365 178.9,45.5 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M169.3,13.4 C169.799,13.232 170.299,13.065 170.8,12.9 L181.4,44.7 C181,44.832 180.6,44.965 180.2,45.1 z" fill="#8D61B6" fill-opacity="0.2"/>
<path d="M169.3,13.4 C169.799,13.232 170.299,13.065 170.8,12.9 L181.4,44.7 C181,44.832 180.6,44.965 180.2,45.1 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M170.8,12.9 C171.266,12.732 171.733,12.565 172.2,12.4 L182.6,44.3 C182.2,44.432 181.8,44.565 181.4,44.7 z" fill="#9B6EC4" fill-opacity="0.2"/>
<path d="M170.8,12.9 C171.266,12.732 171.733,12.565 172.2,12.4 L182.6,44.3 C182.2,44.432 181.8,44.565 181.4,44.7 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M172.2,12.4 C172.666,12.265 173.133,12.132 173.6,12 L183.8,43.9 C183.4,44.032 183,44.165 182.6,44.3 z" fill="#A97BD3" fill-opacity="0.2"/>
<path d="M172.2,12.4 C172.666,12.265 173.133,12.132 173.6,12 L183.8,43.9 C183.4,44.032 183,44.165 182.6,44.3 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M183.8,43.9 C184.233,43.765 184.666,43.632 185.1,43.5 L197,81.4 C196.666,81.499 196.333,81.599 196,81.7 z" fill="#A476CE" fill-opacity="0.2"/>
<path d="M183.8,43.9 C184.233,43.765 184.666,43.632 185.1,43.5 L197,81.4 C196.666,81.499 196.333,81.599 196,81.7 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M173.6,12 C174.066,11.832 174.533,11.665 175,11.5 L185.1,43.5 C184.666,43.632 184.233,43.765 183.8,43.9 z" fill="#73499D" fill-opacity="0.2"/>
<path d="M173.6,12 C174.066,11.832 174.533,11.665 175,11.5 L185.1,43.5 C184.666,43.632 184.233,43.765 183.8,43.9 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M159.7,53.2 C162.834,51.758 166.001,50.391 169.2,49.1 L184.1,86 C181.474,87.038 178.873,88.138 176.3,89.3 z" fill="#74499C" fill-opacity="0.2"/>
<path d="M159.7,53.2 C162.834,51.758 166.001,50.391 169.2,49.1 L184.1,86 C181.474,87.038 178.873,88.138 176.3,89.3 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M151.2,20.3 C151.666,20.132 152.133,19.965 152.6,19.8 L165.7,50.6 C165.299,50.765 164.9,50.932 164.5,51.1 z" fill="#603787" fill-opacity="0.2"/>
<path d="M151.2,20.3 C151.666,20.132 152.133,19.965 152.6,19.8 L165.7,50.6 C165.299,50.765 164.9,50.932 164.5,51.1 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M152.6,19.8 C153.066,19.599 153.533,19.399 154,19.2 L166.8,50.1 C166.433,50.266 166.066,50.432 165.7,50.6 z" fill="#6D4395" fill-opacity="0.2"/>
<path d="M152.6,19.8 C153.066,19.599 153.533,19.399 154,19.2 L166.8,50.1 C166.433,50.266 166.066,50.432 165.7,50.6 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M145.8,22.8 C146.697,22.361 147.597,21.928 148.5,21.5 L162.1,52.1 C161.298,52.462 160.498,52.828 159.7,53.2 z" fill="#451F6D" fill-opacity="0.2"/>
<path d="M145.8,22.8 C146.697,22.361 147.597,21.928 148.5,21.5 L162.1,52.1 C161.298,52.462 160.498,52.828 159.7,53.2 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M148.5,21.5 C149.398,21.095 150.298,20.695 151.2,20.3 L164.5,51.1 C163.698,51.429 162.898,51.762 162.1,52.1 z" fill="#522B7A" fill-opacity="0.2"/>
<path d="M148.5,21.5 C149.398,21.095 150.298,20.695 151.2,20.3 L164.5,51.1 C163.698,51.429 162.898,51.762 162.1,52.1 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M154,19.2 C154.466,18.999 154.933,18.799 155.4,18.6 L168,49.6 C167.6,49.765 167.199,49.932 166.8,50.1 z" fill="#7B4FA3" fill-opacity="0.2"/>
<path d="M154,19.2 C154.466,18.999 154.933,18.799 155.4,18.6 L168,49.6 C167.6,49.765 167.199,49.932 166.8,50.1 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M155.4,18.6 C155.833,18.399 156.266,18.199 156.7,18 L169.2,49.1 C168.799,49.265 168.399,49.432 168,49.6 z" fill="#895CB1" fill-opacity="0.2"/>
<path d="M155.4,18.6 C155.833,18.399 156.266,18.199 156.7,18 L169.2,49.1 C168.799,49.265 168.399,49.432 168,49.6 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M239.4,73.5 C242.93,73.294 246.464,73.194 250,73.2 L250,125 C247.499,124.992 244.997,125.058 242.5,125.2 z" fill="#7F7F7F" fill-opacity="0.2"/>
<path d="M239.4,73.5 C242.93,73.294 246.464,73.194 250,73.2 L250,125 C247.499,124.992 244.997,125.058 242.5,125.2 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M237.1,33.9 C239.232,33.768 241.365,33.668 243.5,33.6 L244.7,73.3 C242.932,73.34 241.166,73.407 239.4,73.5 z" fill="#535353" fill-opacity="0.2"/>
<path d="M237.1,33.9 C239.232,33.768 241.365,33.668 243.5,33.6 L244.7,73.3 C242.932,73.34 241.166,73.407 239.4,73.5 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M235.1,0.4 C236.1,0.361 237.1,0.327 238.1,0.3 L239.7,33.7 C238.833,33.761 237.966,33.828 237.1,33.9 z" fill="#2B2B2B" fill-opacity="0.2"/>
<path d="M235.1,0.4 C236.1,0.361 237.1,0.327 238.1,0.3 L239.7,33.7 C238.833,33.761 237.966,33.828 237.1,33.9 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M238.1,0.3 C238.6,0.265 239.1,0.232 239.6,0.2 L241,33.7 C240.567,33.699 240.133,33.699 239.7,33.7 z" fill="#3B3B3B" fill-opacity="0.2"/>
<path d="M238.1,0.3 C238.6,0.265 239.1,0.232 239.6,0.2 L241,33.7 C240.567,33.699 240.133,33.699 239.7,33.7 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M239.6,0.2 C240.067,0.199 240.533,0.199 241,0.2 L242.2,33.6 C241.8,33.632 241.4,33.666 241,33.7 z" fill="#4B4B4B" fill-opacity="0.2"/>
<path d="M239.6,0.2 C240.067,0.199 240.533,0.199 241,0.2 L242.2,33.6 C241.8,33.632 241.4,33.666 241,33.7 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M241,0.2 C241.5,0.165 242,0.132 242.5,0.1 L243.5,33.6 C243.067,33.599 242.633,33.599 242.2,33.6 z" fill="#5C5C5C" fill-opacity="0.2"/>
<path d="M241,0.2 C241.5,0.165 242,0.132 242.5,0.1 L243.5,33.6 C243.067,33.599 242.633,33.599 242.2,33.6 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M243.5,33.6 C244.8,33.555 246.1,33.522 247.4,33.5 L247.9,73.2 C246.833,73.224 245.766,73.257 244.7,73.3 z" fill="#696969" fill-opacity="0.2"/>
<path d="M243.5,33.6 C244.8,33.555 246.1,33.522 247.4,33.5 L247.9,73.2 C246.833,73.224 245.766,73.257 244.7,73.3 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M242.5,0.1 C243,0.098 243.5,0.098 244,0.1 L244.8,33.6 C244.367,33.599 243.933,33.599 243.5,33.6 z" fill="#3E3E3E" fill-opacity="0.2"/>
<path d="M242.5,0.1 C243,0.098 243.5,0.098 244,0.1 L244.8,33.6 C244.367,33.599 243.933,33.599 243.5,33.6 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M244,0.1 C244.5,0.065 245,0.032 245.5,0 L246.1,33.5 C245.667,33.532 245.233,33.565 244.8,33.6 z" fill="#535353" fill-opacity="0.2"/>
<path d="M244,0.1 C244.5,0.065 245,0.032 245.5,0 L246.1,33.5 C245.667,33.532 245.233,33.565 244.8,33.6 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M245.5,-0 C246,-0.002 246.5,-0.002 247,-0 L247.4,33.5 C246.967,33.499 246.533,33.499 246.1,33.5 z" fill="#696969" fill-opacity="0.2"/>
<path d="M245.5,-0 C246,-0.002 246.5,-0.002 247,-0 L247.4,33.5 C246.967,33.499 246.533,33.499 246.1,33.5 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M247.4,33.5 C248.267,33.495 249.133,33.495 250,33.5 L250,73.2 C249.3,73.196 248.6,73.196 247.9,73.2 z" fill="#7F7F7F" fill-opacity="0.2"/>
<path d="M247.4,33.5 C248.267,33.495 249.133,33.495 250,33.5 L250,73.2 C249.3,73.196 248.6,73.196 247.9,73.2 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M247,-0 C247.5,-0.002 248,-0.002 248.5,-0 L248.7,33.5 C248.267,33.499 247.833,33.499 247.4,33.5 z" fill="#535353" fill-opacity="0.2"/>
<path d="M247,-0 C247.5,-0.002 248,-0.002 248.5,-0 L248.7,33.5 C248.267,33.499 247.833,33.499 247.4,33.5 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<g>
<path d="M248.5,-0 C249,-0.002 249.5,-0.002 250,-0 L250,33.5 C249.567,33.499 249.133,33.499 248.7,33.5 z" fill="#707070" fill-opacity="0.2"/>
<path d="M248.5,-0 C249,-0.002 249.5,-0.002 250,-0 L250,33.5 C249.567,33.499 249.133,33.499 248.7,33.5 z" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
</g>
<path d="M333.2,4" fill-opacity="0" stroke="#FFFFFF" stroke-width="1"/>
<path d="M250,248.7 L333.2,2" fill-opacity="0" stroke="#444444" stroke-width="1" stroke-dasharray="3,2"/>
<path d="M250,248.7 L394.3,32.3" fill-opacity="0" stroke="#444444" stroke-width="1" stroke-dasharray="3,2"/>
<path d="M391.8,32.3 C366.934,10.746 334.3,3 334.3,3" fill-opacity="0" stroke="#444444" stroke-width="1"/>
<g>
<path d="M385.7,27.2 L386.434,27.801" fill-opacity="0" stroke="#444444" stroke-width="1"/>
<path d="M384.535,30.123 L392.626,32.867 L388.334,25.479 z" fill="#444444" fill-opacity="1" stroke="#444444" stroke-width="1" stroke-opacity="1"/>
</g>
<g>
<path d="M351.263,105.661 L388.087,53.072" fill-opacity="0" stroke="#444444" stroke-width="1"/>
<path d="M390.544,54.792 L392.675,46.518 L385.629,51.351 z" fill="#444444" fill-opacity="1" stroke="#444444" stroke-width="1" stroke-opacity="1"/>
</g>
<path d="M391.242,44.294 L395.092,46.99" fill-opacity="0" stroke="#444444" stroke-width="1"/>
<path d="M349.428,104.01 L353.278,106.706" fill-opacity="0" stroke="#444444" stroke-width="1"/>
<text transform="matrix(1, 0, 0, 1, 408.524, 12.1)">
<tspan x="-34.776" y="3.5" font-size="12" fill="#000000">∆θ = 15.057°</tspan>
</text>
<text transform="matrix(1, 0, 0, 1, 401.724, 81)">
<tspan x="-26.16" y="3.5" font-size="12" fill="#000000">∆r = 73px</tspan>
</text>
</g>
</svg>
<figcaption>When the user clicks on Kentucky, we want to focus on a small area of the initial visualization.</figcaption>
</figure>

The concrete example helps explain the `arcTween()` implementation. The function first creates three `d3.interpolate` objects. These objects provide a convenient way to handle the mathematical calculations for interpolations. The first object interpolates from the starting theta domain (initially 0 to 1) to our desired subset (0.051 to 0.093 for Kentucky). The second object does the same for the radius, interpolating from the starting radius domain (initially 0 to 1) to our desired subset (0.5 to 1 for Kentucky and its counties). The final object provides a new, interpolated range for the radius. If the clicked element has a non-zero `y` value, the new range will start at 20 instead of 0. If the clicked element was the `<path>` representing the entire <span class="smcp">U.S.</span>, then the range reverts to the initial starting value of 0.

After creating the `d3.interpolate` objects, `arcTween()` returns the `calculateNewPath` function. <span class="lgcp">D3</span>.js calls this function once for each `<path>` element. When it executes, `calculateNewPath()` checks to see if the associated `<path>` element is the root (representing the entire <span class="smcp">U.S.</span>). If so, `calculateNewPath()` returns the `interpolatePathForRoot` function. For the root, no interpolation is necessary, so the desired path is just the regular path that our `arc()` function (from step 4) creates. For all other elements, however, we use the `d3.interpolate` objects to redefine the `theta` and `radius` scales. Instead of the full 0 to 2π and 0 to `maxRadius`, we set these scales to be the desired area of focus. Furthermore, we use the amount of progress in the transition from the parameter `t` to interpolate how close we are to those desired values. With the scales redefined, calling the `arc()` function returns a path appropriate for the new scales. As the transition progresses, the paths reshape themselves to fit the desired outcome. You can see the intermediate steps in figure NEXTFIGURENUMBER.

<figure>
<img src="img/arctween.png" height="431" width="640" />
<figcaption>The transition smoothly animates the visualization to zoom in on the area of focus.</figcaption>
</figure>

With this final bit of code, our visualization is complete. Figure NEXTFIGURENUMBER shows the results. It adds some additional hover effects in lieu of a true legend; you can find the complete implementation in the book’s [source code](http://jsDataV.is/source/).

<style>
#sunburst3 path { cursor: pointer; }
</style>

<figure>
<div id='sunburst3'></div>
<figcaption><span class="lgcp">D3</span>.js supports complex, custom animations.</figcaption>
</figure>

<script>
;(function(){

    draw = function() {

		var width = 640,
		    height = 500,
		    maxRadius = Math.min(width, height) / 2;

		var g1 = d3.select("#sunburst1").append("svg")
		    .attr("width", width)
		    .attr("height", height)
		    .append("g")
		        .attr("transform", "translate(250,250)");

		var g2 = d3.select("#sunburst2").append("svg")
			.attr("width", width)
			.attr("height", height)
			.append("g")
				.attr("transform", "translate(250,250)");

        var g3 = d3.select("#sunburst3").append("svg")
    		.attr("width", width)
    		.attr("height", height+50)
    		.append("g")
    		    .attr("transform", "translate(250,280)");

		var theta = d3.scale.linear()
		    .range([0, 2 * Math.PI]);
		var radius= d3.scale.sqrt()
		    .range([0, maxRadius]);

		var arc = d3.svg.arc()
		    .startAngle(function(d) { 
		        return Math.max(0, Math.min(2 * Math.PI, theta(d.x))); 
		    })
		    .endAngle(function(d) { 
		        return Math.max(0, Math.min(2 * Math.PI, theta(d.x + d.dx)));
		    })
		    .innerRadius(function(d) { 
		        return Math.max(0, radius(d.y));
		    })
		    .outerRadius(function(d) { 
		        return Math.max(0, radius(d.y + d.dy)); 
		    });

		var partition = d3.layout.partition()
	        .children(function(d) {
	        	return Array.isArray(d.values) ?
	        		d.values : null;
	        })
	        .value(function(d) {
	        	return d.values;
	        });

		var color = function(d) {

        	var colors;
        
        	if (!d.parent) {
        
        		colors = d3.scale.category10()
        			.domain(d3.range(0,10));
        
        		d.color = "#fff";
        
        	} else if (d.children) {
        
        		var startColor = d3.hcl(d.color)
        							.darker(),
        			endColor   = d3.hcl(d.color)
        							.brighter();
        
        		colors = d3.scale.linear()
        				.interpolate(d3.interpolateHcl)
        				.range([
        					startColor.toString(),
        					endColor.toString()
        				])
        				.domain([0,d.children.length+1]);
        	}
        
        	if (d.children) {
           		d.children.map(function(child, i) {
        			return {value: child.value, idx: i};
        		}).sort(function(a,b) {
        			return b.value - a.value
        		}).forEach(function(child, i) {
        			d.children[child.idx].color = colors(i);
        		});
        	}
        
        	return d.color;
        };

        d3.csv("data/tornadoes.csv", function(data) {

			var hierarchy = {
            	key: "United States",
            	values: d3.nest()
            		.key(function(d) { return d.region; })
            		.key(function(d) { return d.state; })
            		.key(function(d) { return d.county; })
            		.rollup(function(leaves) {
            			return leaves.length;
            		})
            		.entries(data)
            };
            
            var partitioned = partition.nodes(hierarchy);

			g1.selectAll("path")
              	.data(partitioned)
              .enter().append("path")
              	.attr("d", arc)
              	.attr("stroke", "#444444")
              	.attr("fill-rule", "evenodd")
              	.attr("fill", "white");

			g2.selectAll("path")
				.data(partitioned)
			  .enter().append("path")
				.attr("d", arc)
				.attr("stroke", "#fff")
				.attr("fill-rule", "evenodd")
				.attr("fill", color);

            var path = g3.selectAll("path")
			    .data(partitioned)
			  .enter().append("path")
			    .attr("d", arc)
			    .attr("stroke", "#fff")
			    .attr("fill-rule", "evenodd")
			    .attr("fill", color)
                .on("click", click)
                .on("mouseover", mouseover)
                .on("mouseout", mouseout);

            var tooltip = g3.append("text")
                .attr("font-size", 12)
                .attr("fill", "#000")
                .attr("fill-opacity", 0)
                .attr("text-anchor", "middle")
                .attr("transform", "translate(" + 0 + "," + (12 + height/2)  +")")
                .style("pointer-events", "none");

            g3.append("text")
                .attr("font-size", 16)
                .attr("fill", "#000")
                .attr("text-anchor", "middle")
                .attr("transform", "translate(" + 0 + "," + (-10 -height/2)  +")")
                .text("Tornado Sightings in 2013 (www.noaa.gov)");
            
            function click(d) {
                path.transition().duration(750)
                    .attrTween("d", arcTween(d));
                mouseout();
            };

            function mouseover(d) {
                tooltip.text(d.key + ": " +
                    d.value + " sighting" +
                    (d.value > 1 ? "s" : ""))
                    .transition()
                    .attr("fill-opacity", 1);
            };

            function mouseout() {
                tooltip.transition()
                    .attr("fill-opacity", 0);
            };

            function arcTween(d) {
                var thetaDomain  = d3.interpolate(theta.domain(),
                                      [d.x, d.x + d.dx]),
                    radiusDomain = d3.interpolate(radius.domain(),
                                      [d.y, 1]),
                    radiusRange  = d3.interpolate(radius.range(),
                                      [d.y ? 20 : 0, maxRadius]);

                return function(d, i) {
                    return i ?
                        function(t) {
                            return arc(d);
                        } :
                        function(t) {
                            theta.domain(thetaDomain(t));
                            radius.domain(radiusDomain(t)).range(radiusRange(t));
                            return arc(d);
                        };
                };
            };
        });
    };

    if (typeof contentLoaded != "undefined") {
        contentLoaded.done(draw);
    } else {
        window.addEventListener('load', draw);
    }

}());
</script>

