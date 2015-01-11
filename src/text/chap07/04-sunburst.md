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

``` {.javascript .numberLines}
var path = g.selectAll("path")
	.data(partition.nodes(hierarchy))
  .enter().append("path")
	.attr("d", arc)
	.attr("fill", color)
```

As figure NEXTFIGURENUMBER shows, our visualization now includes appropriate colors.

<figure>
<div id='sunburst2'></div>
<figcaption><span class="lgcp">D3</span>.js includes extensive utilities for working with colors.</figcaption>
</figure>

### Step 8: Make the Visualization Interactive

To conclude this example we can add some interactivity. When a user clicks on an area in the chart, we can zoom the chart to show more detail for that area. To emphasize the subject matter, we’ll create a custom, rotating animation effect for this zoom.



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
    		.attr("height", height)
    		.append("g")
    		    .attr("transform", "translate(250,250)");

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


        });
    };

    if (typeof contentLoaded != "undefined") {
        contentLoaded.done(draw);
    } else {
        window.addEventListener('load', draw);
    }

}());
</script>

