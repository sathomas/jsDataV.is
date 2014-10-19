## Creating a Choropleth Map

The first two examples touched on some of the capabilities of <span class="smcp">D3</span>.js, but the library includes many others. From the examples of chapter 6, we know some of the best visualizations rely on maps, and <span class="smcp">D3</span>.js—as a general purpose visualization library—has extensive support for mapping. We'll look at a brief example in this section: a choropleth map of the <span class="smcp">US</span> presidential nominating events. More specifically, we'll show the Democratic Party's 2012 nominating events (either primary elections or a caucuses) in each state, and we'll color the state based on the date of that event.

### Step 1: Prepare the Data

We can get the data for our visualization from the [National Conference of State Legislatures](http://www.ncsl.org/research/elections-and-campaigns/2012-presidential-primary-calendar.aspx). Collecting the data into a JavaScript array gives us the raw data below.

``` {.javascript .numberLines}
var nominatingEvents = [
    {date: "2012-01-03", state: "IA"},
    {date: "2012-01-10", state: "NH"},
    {date: "2012-01-21", state: "NV"},
    // Data set continues...
];
```

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

### Step 3: Create a Color Scale

In the first example in this appendix we saw how <span class="smcp">D3</span>.js provides scales to map between data values and (in the case of that example) pixel positions. For this example we can use a scale to map from a data value to a color. The data value will be the date of the nominating event, and the color will range from light to dark blue.

Since all the nominiating events took place in the first six months of the year, we can set input for our scale (its _domain_) to be from January 1 to June 30. As you can see from line 2, we're converting calendar dates to integers. We use `new Date()` to construct a JavaScript `Date` object and then convert it to an integer with the plus sign (`+`). The resulting value is the number of milliseconds since January 1, 1970 <span class="smcp">UTC</span>, although the details aren't really important in this case.

For the scale's range in line 3 we're giving <span class="smcp">D3</span>.js two colors in <span class="smcp">CSS</span> hexidecimal format. <span class="lgcp">D3</span>.js is smart enough to recognize those as a colors and construct the scale accordingly.

``` {.javascript .numberLines}
var color = d3.scale.linear()
    .domain([+new Date("2012-01-01"), +new Date("2012-06-30")])
    .range(["#deebf7","#08306b"]);
```

### Step 4: Create a Map Projection

If you can't quite recall your geography lessons about map projections, don't worry. <span class="lgcp">D3</span>.js can handle all of the heavy lifting. Not only does it have extensive support for common projections, but it supports extensions for custom projections as well. For our map, we'll use a modified Albers projection that's optimized for the United States. It repositions (and resizes) Alaska and Hawaii to give us a convenient map of all 50 states. <span class="lgcp">D3</span>.js has support for this projection built in.

We set up the projection in the code below. First, in lines 1 and 2, we define the size our map in pixels. Then, in line 4, we create the modified Albers projection. Line 5 defines the scale of the map, and line 6 centers it.

To draw the map on the page we're going to use <span class="smcp">SVG</span> `<path>` elements, but our map data takes the form of latitude and longitude values. <span class="lgcp">D3</span>.js has a `path` object to translate to <span class="smcp">SVG</span> paths based on a particular map project. In lines 8 and 9 we create our path object.


``` {.javascript .numberLines}
var width = 640,
    height = 400;

var projection = d3.geo.albersUsa()
    .scale(1000)
    .translate([width / 2, height / 2]);

var path = d3.geo.path()
    .projection(projection);
```

### Step 5: Initialize the SVG container

Just as we've done in the previous <span class="smcp">D3</span>.js example, we can create an <span class="smcp">SVG</span> container to hold the map.

``` {.javascript .numberLines}
var svg = d3.select("#map").append("svg")
    .attr("width", width)
    .attr("height", height);
```

### Step 6: Retrieve the Map Data

For our visualization, the map data is nothing but a map of the <span class="smcp">US</span> with individual states. <span class="lgcp">D3</span>.js uses [<span class="smcp">G</span>eo<span class="smcp">JSON</span>](http://geojson.org) for its map data. Unlike most image tiles that we used in chapter 6, <span class="smcp">G</span>eo<span class="smcp">JSON</span> data is vector-based, so it can be used at any scale. <span class="lgcp">G</span>eo<span class="smcp">JSON</span> data is also in <span class="smcp">JSON</span> format, which makes it especially compatible with JavaScript.

The data file for our map, which you can find with the book's source code, has the boundaries of all 50 states (plus the District of Columbia) as separate `feature`s, and each feature includes an `abbreviation` property of the state's official two-letter abbreviation.

Since our data is in a <span class="smcp">JSON</span> format, we can use the `d3.json()` function to retrieve it. If you're more familiar with jQuery, that function is almost identical to the jQuery `$.getJSON()` function.


``` {.javascript .numberLines}
d3.json("data/us-states.json", function(data) {
    // Process the JSON data
});
```

### Step 7: Draw the Map

Once we have our data we can draw the map on the page. The code in this step is very similar to that in the previous example. Each state will be a `<path>` element within the <span class="smcp">SVG</span> container. Using the conventions of <span class="smcp">D3</span>.js, we create a selection of `<path>` elements (line 1) and bind those elements to our data (line 2). When there is no element we create one (line 3), and we set its `d` attribute to be the path associated with the data given our projection. Note that `path` in line 4 is the object we created in step 4.

``` {.javascript .numberLines}
svg.selectAll("path")
    .data(data.features)
  .enter().append("path")
    .attr("d", path);
```

### Step 8: Style the Map

For our final step we'll set the color of each state according to the date of its nominating event. The style property we use is `fill`. For its value we search through the array of events to find the matching state (line 8). We then use our `color` scale to calculate an appropriate color for that date (line 14).

``` {.javascript .numberLines}
svg.selectAll("path")
    .data(data.features)
  .enter().append("path")
    .attr("d", path)
    .style("fill", function(d) {
        var date = "2012-01-01";
        nominatingEvents.some(function(event) {
            if (event.state === d.properties.abbreviation) {
                date = event.date;
                return true;
            }
            return false;
        });
        return color(+new Date(date));
    });
```

The result of our efforts is figure NEXTFIGURENUMBER. The map shows all the states and colors each according to its primary or caucus date.

<figure>
<div id='map1'></div>
<figcaption><span class="lgcp">D3</span>.js includes many features to help in the creation of map-based visualizations.</figcaption>
</figure>


<script>
;(function(){

    draw = function() {

		var nominatingEvents = [
		    {date: "2012-01-03", state: "IA"},
		    {date: "2012-01-10", state: "NH"},
		    {date: "2012-01-21", state: "NV"},
		    {date: "2012-01-28", state: "SC"},
		    {date: "2012-02-07", state: "MO"},
		    {date: "2012-02-26", state: "ME"},
		    {date: "2012-03-06", state: "CO"},
		    {date: "2012-03-06", state: "GA"},
		    {date: "2012-03-06", state: "MA"},
		    {date: "2012-03-06", state: "MN"},
		    {date: "2012-03-06", state: "OH"},
		    {date: "2012-03-06", state: "OK"},
		    {date: "2012-03-06", state: "TN"},
		    {date: "2012-03-06", state: "VT"},
		    {date: "2012-03-06", state: "VA"},
		    {date: "2012-03-07", state: "HI"},
		    {date: "2012-03-13", state: "AL"},
		    {date: "2012-03-13", state: "MS"},
		    {date: "2012-03-13", state: "UT"},
		    {date: "2012-03-20", state: "IL"},
		    {date: "2012-03-24", state: "LA"},
		    {date: "2012-03-31", state: "AZ"},
		    {date: "2012-04-03", state: "DC"},
		    {date: "2012-04-03", state: "MD"},
		    {date: "2012-04-03", state: "TX"},
		    {date: "2012-04-03", state: "WI"},
		    {date: "2012-04-09", state: "AK"},
		    {date: "2012-04-14", state: "ID"},
		    {date: "2012-04-14", state: "KS"},
		    {date: "2012-04-14", state: "NE"},
		    {date: "2012-04-14", state: "WY"},
		    {date: "2012-04-15", state: "WA"},
		    {date: "2012-04-24", state: "CT"},
		    {date: "2012-04-24", state: "DE"},
		    {date: "2012-04-24", state: "NY"},
		    {date: "2012-04-24", state: "PA"},
		    {date: "2012-04-24", state: "RI"},
		    {date: "2012-05-05", state: "FL"},
		    {date: "2012-05-05", state: "MI"},
		    {date: "2012-05-08", state: "IN"},
		    {date: "2012-05-08", state: "NC"},
		    {date: "2012-05-08", state: "WV"},
		    {date: "2012-05-15", state: "OR"},
		    {date: "2012-05-22", state: "AR"},
		    {date: "2012-05-22", state: "KY"},
		    {date: "2012-06-05", state: "CA"},
		    {date: "2012-06-05", state: "MO"},
		    {date: "2012-06-05", state: "NJ"},
		    {date: "2012-06-05", state: "NM"},
		    {date: "2012-06-05", state: "ND"},
		    {date: "2012-06-05", state: "SD"}
		];

		var width = 630,
		    height = 394;

		var color = d3.scale.linear()
		    .domain([+new Date("2012-01-01"), +new Date("2012-06-30")])
		    .range(["#deebf7","#08306b"]);

		var projection = d3.geo.albersUsa()
		    .scale(829)
		    .translate([width / 2, height / 2]);

		var path = d3.geo.path()
		    .projection(projection);

		var svg = d3.select("#map1").append("svg")
		    .attr("width", width)
		    .attr("height", height);

		d3.json("data/us-states.json", function(us) {
		    svg.selectAll("path")
		        .data(us.features)
		      .enter().append("path")
		        .attr("d", path)
		        .style("fill", function(d) {
		            var date = "2012-01-03";
		            nominatingEvents.some(function(event) {
		                if (event.state === d.properties.abbreviation) {
		                    date = event.date;
		                    return true;
		                }
		                return false;
		            });
		            return color(+new Date(date));
		        });
		});
    };

    if (typeof contentLoaded != "undefined") {
        contentLoaded.done(draw);
    } else {
        window.addEventListener('load', draw);
    }

}());
</script>

