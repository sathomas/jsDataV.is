## Working with Scalable Vector Graphics

Map fonts like those in the previous example are easy to use and visually effective, but only a few map fonts exist, and they definitely don't cover all the conceivable geographic regions. For visualizations of other regions, we'll have to find a different technique. Maps, of course, are ultimately images, and web browsers can display many different image formats. One format in particular, called _Scalable Vector Graphics,_ or <span class="smcp">SVG</span>, is especially well suited for interactive visualizations. That's because, as we'll see in this example, JavaScript code (as well as <span class="smcp">CSS</span> styles) can easily and naturally interact with <span class="smcp">SVG</span> images.

Although our example for this section deals with a map, the techniques here are by no means limited to maps. Whenever you have a diagram or illustration in <span class="smcp">SVG</span> format, you can manipulate it directly on a web page.

> There is one important consideration for using <span class="smcp">SVG</span>: only modern web browsers support it. More specifically, Internet Explorer version 8 (and earlier) cannot display <span class="smcp">SVG</span> images. If a significant number of your users are using older browsers, you might want to consider other alternatives.

For web developers <span class="smcp">SVG</span> is especially convenient because its syntax uses the same structure as <span class="smcp">HTML</span>. You can use many of the same tools and techniques for working with <span class="smcp">HTML</span> on <span class="smcp">SVG</span> as well. Consider, for example, a skeletal <span class="smcp">HTML</span> document.

``` {.html .numberLines}
<!DOCTYPE html>
<html lang="en">
  <head><!-- --></head>
  <body>
    <nav><!-- --></nav>
    <main>
      <section><!-- --></section>
    </main>
    <nav><!-- --></nav>
  </body>
</html>
```

Compare that to the next example, the universal symbol for first aid represented in an <span class="smcp">SVG</span> document.

> If you have worked with <span class="smcp">HTML</span> before <span class="smcp">HTML5</span>, the similarities might be especially striking, as the <span class="smcp">SVG</span> header text follows the same format as <span class="smcp">HTML4</span>.

``` {.html .numberLines}
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN"
    "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
<svg id="firstaid" version="1.1" xmlns="http://www.w3.org/2000/svg" 
     width="100" height="100">
    <rect id="background" x="0" y="0" width="100" height="100" rx="20" />
    <rect id="vertical"   x="39" y="19" width="22" height="62" />
    <rect id="horizontal" x="19" y="39" width="62" height="22" />
</svg>
```

You can even style the <span class="smcp">SVG</span> elements using <span class="smcp">CSS</span>. Here's how we could color the preceding image:

``` {.css .numberLines}
svg#firstaid {
    stroke: none;
}
svg#firstaid #background {
    fill: #000;
}
svg#firstaid #vertical,
svg#firstaid #horizontal {
    fill: #FFF;
}
```

<style>
svg#firstaid {
    stroke: none;
}
svg#firstaid #background {
    fill: rgb(68,68,68);
}
svg#firstaid #vertical,
svg#firstaid #horizontal {
    fill: #EFEFEF;
}
</style>

If you're curious, figure NEXTFIGURENUMBER shows how that <span class="smcp">SVG</span> renders.

<figure>
<svg id="firstaid" version="1.1" xmlns="http://www.w3.org/2000/svg" width="100" height="100">
<rect id="background" x="0" y="0" width="100" height="100" rx="20" />
<rect id="vertical" x="39" y="19" width="22" height="62" />
<rect id="horizontal" x="19" y="39" width="62" height="22" />
</svg>
<figcaption>SVG images may be embedded directly within web pages.</figcaption>
</figure>

The affinity between <span class="smcp">HTML</span> and <span class="smcp">SVG</span> is, in fact, far stronger than the similar syntax. With modern browsers you can mix <span class="smcp">SVG</span> and <span class="smcp">HTML</span> in the same web page. To see how that works, let's visualize health data for the 159 counties in the <span class="smcp">US</span> state of Georgia. The data comes from [County Health Rankings](http://www.countyhealthrankings.org).

### Step 1: Create the SVG Map

Our visualization starts with a map, so we'll need an illustration of Georgia's counties in <span class="smcp">SVG</span> format. Although that might seem like a challenge, there are actually many sources for <span class="smcp">SVG</span> maps that are free to use, as well as special-purpose applications that can generate <span class="smcp">SVG</span> maps for almost any region. The [Wikimedia Commons](http://commons.wikimedia.org/wiki/Main_Page), for example, contains a large number of open source maps, including many of Georgia. We'll use [one](http://commons.wikimedia.org/wiki/File:NRHP_Georgia_Map.svg#file) showing data from the National Register of Historic Places.

After downloading the map file, we can adjust it to better fit our needs, removing the legend, colors, and other elements that we don't need. Although you can do this in a text editor (just as you can edit <span class="smcp">HTML</span>), you may find it easier to use a graphics program such as Adobe Illustrator or a more web-focused app like [Sketch](http://www.bohemiancoding.com/sketch/). You might also want to take advantage of an <span class="smcp">SVG</span> optimization [web site](http://petercollingridge.appspot.com/svg-optimiser) or [application](https://github.com/svg), which can compress an <span class="smcp">SVG</span> by removing extraneous tags and reducing the sometimes-excessive precision of graphics programs.

Our result will be a series of `<path>` elements, one for each county. We'll also want to assign a `class` or `id` to each path to indicate the county. The resulting <span class="smcp">SVG</span> file might begin like the following.

``` {.html .numberLines}
<svg version="1.1" xmlns="http://www.w3.org/2000/svg" 
    width="497" height="558">
    <path id="ck" d="M 216.65,131.53 L 216.41,131.53 216.17,131.53..." />
    <path id="me" d="M 74.32,234.01 L 74.32,232.09 74.32,231.61..." />
    <path id="ms" d="M 64.96,319.22 L 64.72,319.22 64.48,318.98..." />
    <!-- Markup continues... -->
```

To summarize, here are the steps to create the <span class="smcp">SVG</span> map.

1. Locate a suitably licensed <span class="smcp">SVG</span>-format map file or create one using a special-purpose map application.
2. Edit the <span class="smcp">SVG</span> file in a graphics application to remove extraneous components and simplify the illustration.
3. Optimize the <span class="smcp">SVG</span> file using an optimization site or application.
4. Make final adjustments (such as adding `id` attributes) in your regular <span class="smcp">HTML</span> editor.

### Step 2: Embed the Map in the Page

The simplest way to include an <span class="smcp">SVG</span> map in a web page is to embed the <span class="smcp">SVG</span> markup directly within the <span class="smcp">HTML</span> markup. To include the first aid symbol, for example, just include the <span class="smcp">SVG</span> tags within the page itself, as in lines 9 through 18. As the example below shows, you don't have to include the header tags that are normally present in a standalone <span class="smcp">SVG</span> file.

``` {.html .numberLines}
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title></title>
  </head>
  <body>
    <div>
      <svg id="firstaid" version="1.1" 
           xmlns="http://www.w3.org/2000/svg" 
        width="100" height="100">
        <rect id="background" x="0" y="0" 
              width="100" height="100" rx="20" />
        <rect id="vertical" x="39" y="19" 
              width="22" height="62" />
        <rect id="horizontal" x="19" y="39" 
              width="62" height="22" />
      </svg>
   </div>
  </body>
</html>
```

If your map is relatively simple, direct embedding is the easiest way to include it in the page. Our map of Georgia, however, is about 1 <class="smcp">MB</span> in size even after optimization. That's not unusual for maps with reasonable resolution, as describing complex borders such as coastlines or rivers can make for large `<path>` elements. Especially if the map isn't the sole focus of the page, you can provide a better user experience by loading the rest of the page first. That will give your users something to read while the map loads in the background. You can even add a simple animated progress loader if that's appropriate for your site.

If you're using jQuery, loading the map is a single instruction. You do want to make sure, though, that your code doesn't start manipulating the map until the load is complete. Here's how that would look in the source code.

``` {.javascript .numberLines}
$("#map").load("img/ga.svg", function() {
    // Only manipulate the map inside this block
})
```

### Step 3: Collect the Data

The data for our visualization is available as an Excel spreadsheet directly from [County Health Rankings](http://www.countyhealthrankings.org). We'll convert that to a JavaScript object in advance, and we'll add a two-letter code corresponding to each county. Here's how that array might begin.

``` {.javascript .numberLines}
var counties = [
    {
      "name":"Appling",
      "code":"ap",
      "outcomes_z":0.93,
      "outcomes_rank":148,
      // Data continues...
    },
    {
      "name":"Atkinson",
      "code":"at",
      "outcomes_z":0.40,
      "outcomes_rank":118,
    // Data set continues...
];
```

For this visualization we'd like to show the variation in health outcomes among counties. The data set provides two variables for that value, a ranking and a z-score (a measure of how far a sample is from the mean in terms of standard deviations). The County Health Rankings provide z-scores slightly modified from the traditional statistical definition. Normal z-scores are always positive; in this data set, however, measurements that are subjectively better than average are multiplied by –1 so that they are negative. A county whose health outcome is two standard deviations "better" than the mean, for example, is given a z-score of –2 instead of 2. This adjustment makes it easier to use these z-scores in our visualization.

Our first step in working with these z scores is to find the maximum and minimum values. We can do that by extracting the outcomes as a separate array and then using the JavaScript built-in `Math.max` and `Math.min` functions. Note that the following code uses the `map()` method to extract the array, and that method is available only in modern browsers. Since we've chosen to use <span class="smcp">SVG</span> images, however, we've already restricted our users to modern browsers, so we might as well take advantage of that when we can.


``` {.javascript .numberLines}
var outcomes = counties.map(function(county) {return county.outcomes_z;});
var maxZ = Math.max.apply(null, outcomes);
var minZ = Math.min.apply(null, outcomes);
```

Notice how we've used the `.apply()` method here. Normally the `Math.max()` and `Math.min()` functions accept a comma-separated list of arguments. We, of course, have an array instead. The `apply()` method, which works with any JavaScript function, turns an array into a comma-separated list. The first parameter is the context to use, which in our case doesn't matter, so we set it to `null`.

To complete the data preparation, let's make sure the minimum and maximum ranges are symmetric about the mean. If, for example, the z-scores ranged from `-2` to `1.5`, we'll extend the range to `[-2, 2]`. This adjustment will make the color scales symmetric as well, thus making our visualization easier for users to interpret.

``` {.javascript .numberLines}
if (Math.abs(minZ) > Math.abs(maxZ)) {
    maxZ = -minZ;
} else {
    minZ = -maxZ;
}
```

### Step 4: Define the Color Scheme

Defining an effective color scheme for a map can be quite tricky, but fortunately there are some excellent resources available. For this visualization we'll rely on the [Chroma.js](http://driven-by-data.net/about/chromajs/) library. That library includes many tools for working with and manipulating colors and color scales, and it can satisfy the most advanced color theorist. For our example, however, we can take advantage of the predefined color scales, specifically those defined originally by [Cynthia Brewer](http://colorbrewer2.org/).

The Chroma.js library is available on popular content distribution networks, so we can rely on a network such as CloudFlare's [cdnjs](http://cdnjs.com) to host it.

``` {.html .numberLines}
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title></title>
  </head>
  <body>
    <div id="map"></div>
    <script 
     src="///cdnjs.cloudflare.com/ajax/libs/chroma-js/0.5.2/chroma.min.js">
    </script>
  </body>
</html>
```

To use a predefined scale we pass the scale's name (`"BrBG"` for the Brewer's brown to blue/green scale) to the `chroma.scale()` function. At the same time we indicate the domain for our scale (`minZ` to `maxZ`, although we're reversing the order because of the data set's z-score adjustment) and our desired output. The `"hex"` output is the common `"#012345"` format compatible with <span class="smcp">CSS</span> and <span class="smcp">HTML</span> markup.

``` {.javascript .numberLines}
var scale = chroma.scale("BrBG").domain([maxZ, minZ]).out("hex");
```

### Step 5: Color the Map

With our color scheme established, we can now apply the appropriate colors to each county on the map. That's probably the easiest step in the whole visualization. We iterate through all the counties, finding their `<path>` elements based on their `id` values, and applying the color by setting the `fill` attribute.

``` {.javascript .numberLines}
counties.forEach(function(county) {
    document.getElementById(county.code)
      .setAttribute("fill", scale(county.outcomes_z));
})
```

The resulting map, shown in figure NEXTFIGURENUMBER, illustrates which counties are above average and which are below average for health outcomes in 2014.

<figure>
<div id='map-svg-1'></div>
<figcaption><span class="lgcp">CSS</span> rules can set the styles for individual <span class="smcp">SVG</span> elements within an <span class="smcp">SVG</span> illustration.</figcaption>
</figure>

### Step 6: Add a Legend

To help users interpret the map we can add a legend to the visualization. We can take advantage of the Chroma.js scale to easily create a table that explains the variation. For the table we'll use four increments for the colors on each side of the mean value. That gives us a total of nine colors for the legend.

``` {.html .numberLines}
<table id="legend">
    <tr class="scale">
        <td></td><td></td><td></td><td></td><td></td>
        <td></td><td></td><td></td><td></td>
    </tr>
    <tr class="text">
        <td colspan="4">Worse than Average</td>
        <td>Average</td>
        <td colspan="4">Better than Average</td>
    </tr>
</table>
```

Some straightforward <span class="smcp">CSS</span> will style the table appropriately. Because we have nine colors, we set the width of each table cell to 11.1111% (1/9 is 0.111111).

``` {.css .numberLines}
table#legend tr.scale td {
    height: 1em;
    width: 11.1111%;
}
table#legend tr.text td:first-child {
    text-align: left;
}
table#legend tr.text td:nth-child(2) {
    text-align: center;
}
table#legend tr.text td:last-child {
    text-align: right;
}
```

Finally, we use the Chroma scale created earlier to set the background color for the legend's table cells. Because the legend is a `<table>` element, we can directly access the rows and the cells within the rows. Although these elements look like arrays in the following code, they're not true JavaScript arrays, so they don't support array methods such as `forEach()`. For now, we'll iterate through them with a `for` loop, but if you'd rather use the array methods stay tuned for a simple trick. Note that once again we're working backward because of the data set's z-score adjustments.

``` {.javascript .numberLines .line-5}
var legend = document.getElementById("legend");
var cells = legend.rows[0].cells;
for (var idx=0; idx<cells.length; idx++) {
    var td = cells[idx];
    td.style.backgroundColor = scale(maxZ - 
        ((idx + 0.5) / cells.length) * (maxZ - minZ));
};
```

In line 5 we calculate the fraction of the current index from the total number of legend colors `((idx + 0.5) / cells.length)`, multiply that by the total range of the scale `(maxZ - minZ)`, and subtract the result from the maximum value.

The result is the legend for the map in figure NEXTFIGURENUMBER.

<style>
table#legend-svg-1, table#legend-svg-2 {
    width: 497px;
    border: none;
}
table#legend-svg-1 td, table#legend-svg-2 td {
    border: none;
}
table#legend-svg-1 tbody:first-child tr:first-child>td:first-child,
table#legend-svg-2 tbody:first-child tr:first-child>td:first-child {
    -webkit-border-top-left-radius: 0;
        -moz-border-radius-topleft: 0;
            border-top-left-radius: 0;
}
table#legend-svg-1 tbody:first-child tr:first-child>td:last-child,
table#legend-svg-2 tbody:first-child tr:first-child>td:last-child {
    -webkit-border-top-right-radius: 0;
        -moz-border-radius-topright: 0;
            border-top-right-radius: 0;
}
table#legend-svg-1 tr.scale td, table#legend-svg-2 tr.scale td {
    height: 0.5em;
    width: 11.1111%;
}
table#legend-svg-1 tr.text td, table#legend-svg-2 tr.text td {
    padding-left: 0;
    padding-right: 0;
}
table#legend-svg-1 tr.text td:first-child, table#legend-svg-2 tr.text td:first-child {
    text-align: left;
}
table#legend-svg-1 tr.text td:nth-child(2), table#legend-svg-2 tr.text td:nth-child(2) {
    text-align: center;
}
table#legend-svg-1 tr.text td:last-child, table#legend-svg-2 tr.text td:last-child {
    text-align: right;
}
</style>

<figure>
<table id="legend-svg-1">
<tr class="scale"><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr class="text"><td colspan="4">Worse than Average</td><td>Average</td><td colspan="4">Better than Average</td></tr>
</table>
<figcaption>An <span class="smcp">HTML</span> &lt;table&gt; can serve as a legend.</figcaption>
</figure>


### Step 7: Add Interactions

To complete the visualization, let's enable users to hover their mouse over a county on the map to see more details. Of course, mouse interactions are not available for tablet or smartphone users. To support those users you could add a similar interaction for tap or click events. That code would be almost identical to the next example.

We'll start by defining a table to show county details.

``` {.html .numberLines}
<table id="details">
    <tr><td>County:</td><td></td></tr>
    <tr><td>Rank:</td><td></td></tr>
    <tr><td>Health Behaviors:</td><td></td></tr>
    <tr><td>Clinical Care:</td><td></td></tr>
    <tr><td>Social & Economic Factors:</td><td></td></tr>
    <tr><td>Physical Environment:</td><td></td></tr>
</table>
```

Initially, we don't want that table to be visible.

``` {.css .numberLines}
table#details {
    display: none;
}
```

To show the table we use event handler functions that track when the mouse enters or leaves an <span class="smcp">SVG</span> path for a county. To find these `<path>` elements, we can use the `querySelectorAll()` function that modern browsers support. Unfortunately, that function doesn't return a true array of elements, so we can't use array methods such as `forEach()` to iterate through those elements. There's a trick, however, that will let us convert the returned list into a true array. The following code shows this trick; it calls the `[].slice.call()` function with the "not quite array" object as its parameter. The result is a true array with all of its useful methods.

``` {.javascript .numberLines}
[].slice.call(document.querySelectorAll('#map path'))
    .forEach(function(path) {
        path.addEventListener('mouseenter', function(){
            document.getElementById("details").style.display = "table";
        });
        path.addEventListener('mouseleave', function(){
            document.getElementById("details").style.display = "none";
        });
    }
);
```

In addition to making the details table visible, we'll also want to update it with the appropriate information. To help with this display, we can write a function that converts a Z score into a more user-friendly explanation. The specific values in the following example are arbitrary since we're not trying for statistical precision in this visualization.

``` {.javascript .numberLines}
var zToText = function(z) {
    z = +z;
    if (z >  0.25) { return "Far below average"; }
    if (z >  0.1)  { return "Below average"; }
    if (z > -0.1)  { return "Average"; }
    if (z > -0.25) { return "Above average"; }
    return "Far above average";
}
```

There are a couple of noteworthy items in this function. First, the statement, `z = +z` converts the z-score from a string to a numeric value for the tests that follow. Second, remember that because of the z-score adjustments the negative z-scores are actually better than average, while the positive values are below average.

We can use this function to provide the data for our details table. The first step is finding the full data set for the associated `<path>` element. To do that we search through the `counties` array looking for a `code` property that matches the `id` attribute of the path. Because `indexOf()` doesn't allow us to find objects by key, we'll borrow the `some()` method instead. That method terminates as soon as it finds a match, so we avoid iterating through the entire array.

``` {.javascript .numberLines}
var county = null;
counties.some(function(c) {
    if (c.code === this.id) {
        county = c;
        return true;
    }
    return false;
});
```

Once we've found the county data, it's a straightforward process to update the table. The following code directly updates the relevant table cell's text content. For a more robust implementation, you could provide class names for the cells and update based on those class names.

``` {.javascript .numberLines}
var table = document.getElementById("details");
table.rows[0].cells[1].textContent = 
    county.name;
table.rows[1].cells[1].textContent = 
    county.outcomes_rank + " out of " + counties.length;
table.rows[2].cells[1].textContent = 
    zToText(county.health_behaviors_z);
table.rows[3].cells[1].textContent = 
    zToText(county.clinical_care_z);
table.rows[4].cells[1].textContent = 
    zToText(county.social_and_economic_factors_z);
table.rows[5].cells[1].textContent = 
    zToText(county.physical_environment_z);
```

For the last refinement, let's add a stroke color for counties that are highlighted (line 3). We remove the stroke (in line 7) when the mouse leaves the path.

``` {.javascript .numberLines .line-3 .line-7}
path.addEventListener('mouseleave', function(){
    // Previous code
    this.setAttribute("stroke", "#444444");
});
path.addEventListener('mouseleave', function(){
    // Previous code
    this.setAttribute("stroke", "none");
});
```

<style>
#svg-2 {
    position: relative;
}
table#details-svg-2 {
    font-size: 0.7em;
    display: none;
    position: absolute;
    left: 356px;
    width: auto;
}
table#details-svg-2 tr td:first-child {
    font-weight: bold;
}
</style>

At this point our visualization example is complete. Figure NEXTFIGURENUMBER shows the result.

### 2014 Health Outcomes in Georgia Counties
<figure id="svg-2">
<table id="details-svg-2">
<tr><td>County:</td><td>name</td></tr>
<tr><td>Rank:</td><td>outcomes_rank</td></tr>
<tr><td>Health Behaviors:</td><td></td></tr>
<tr><td>Clinical Care:</td><td></td></tr>
<tr><td>Social & Economic Factors:</td><td></td></tr>
<tr><td>Physical Environment:</td><td></td></tr>
</table>
<div id='map-svg-2'></div>
<table id="legend-svg-2">
<tr class="scale"><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr class="text"><td colspan="4">Worse than Average</td><td>Average</td><td colspan="4">Better than Average</td></tr>
</table>
<figcaption>Browsers (and a bit of code) can turn <span class="smcp">SVG</span> illustrations into interactive visualizations.</figcaption>
</figure>


<script>
;(function(){

    draw = function() {

        var counties = [
          {
            "name":"Appling",
            "code":"ap",
            "outcomes_z":0.93,
            "outcomes_rank":148,
            "factors_z":0.49,
            "factors_rank":144,
            "length_of_life_z":0.51,
            "length_of_life_rank":141,
            "quality_of_life_z":0.42,
            "quality_of_life_rank":145,
            "health_behaviors_z":0.25,
            "health_behaviors_rank":155,
            "clinical_care_z":0.14,
            "clinical_care_rank":143,
            "social_and_economic_factors_z":0.16,
            "social_and_economic_factors_rank":116,
            "physical_environment_z":-0.07,
            "physical_environment_rank":12
          },
          {
            "name":"Atkinson",
            "code":"at",
            "outcomes_z":0.40,
            "outcomes_rank":118,
            "factors_z":0.62,
            "factors_rank":154,
            "length_of_life_z":0.33,
            "length_of_life_rank":120,
            "quality_of_life_z":0.07,
            "quality_of_life_rank":94,
            "health_behaviors_z":0.06,
            "health_behaviors_rank":102,
            "clinical_care_z":0.37,
            "clinical_care_rank":159,
            "social_and_economic_factors_z":0.26,
            "social_and_economic_factors_rank":137,
            "physical_environment_z":-0.06,
            "physical_environment_rank":17
          },
          {
            "name":"Bacon",
            "code":"ba",
            "outcomes_z":0.35,
            "outcomes_rank":109,
            "factors_z":0.24,
            "factors_rank":110,
            "length_of_life_z":0.43,
            "length_of_life_rank":133,
            "quality_of_life_z":-0.08,
            "quality_of_life_rank":64,
            "health_behaviors_z":0.08,
            "health_behaviors_rank":109,
            "clinical_care_z":0.21,
            "clinical_care_rank":152,
            "social_and_economic_factors_z":0.03,
            "social_and_economic_factors_rank":77,
            "physical_environment_z":-0.07,
            "physical_environment_rank":14
          },
          {
            "name":"Baker",
            "code":"bk",
            "outcomes_z":0.02,
            "outcomes_rank":72,
            "factors_z":0.30,
            "factors_rank":119,
            "length_of_life_z":-0.02,
            "length_of_life_rank":80,
            "quality_of_life_z":0.04,
            "quality_of_life_rank":91,
            "health_behaviors_z":0.14,
            "health_behaviors_rank":131,
            "clinical_care_z":0.04,
            "clinical_care_rank":106,
            "social_and_economic_factors_z":0.11,
            "social_and_economic_factors_rank":99,
            "physical_environment_z":0.01,
            "physical_environment_rank":88
          },
          {
            "name":"Baldwin",
            "code":"bd",
            "outcomes_z":0.08,
            "outcomes_rank":76,
            "factors_z":0.10,
            "factors_rank":82,
            "length_of_life_z":-0.30,
            "length_of_life_rank":43,
            "quality_of_life_z":0.38,
            "quality_of_life_rank":140,
            "health_behaviors_z":0.07,
            "health_behaviors_rank":107,
            "clinical_care_z":-0.15,
            "clinical_care_rank":15,
            "social_and_economic_factors_z":0.18,
            "social_and_economic_factors_rank":121,
            "physical_environment_z":0.00,
            "physical_environment_rank":84
          },
          {
            "name":"Banks",
            "code":"bn",
            "outcomes_z":-0.37,
            "outcomes_rank":48,
            "factors_z":-0.11,
            "factors_rank":53,
            "length_of_life_z":-0.26,
            "length_of_life_rank":50,
            "quality_of_life_z":-0.11,
            "quality_of_life_rank":59,
            "health_behaviors_z":-0.02,
            "health_behaviors_rank":65,
            "clinical_care_z":0.10,
            "clinical_care_rank":132,
            "social_and_economic_factors_z":-0.24,
            "social_and_economic_factors_rank":30,
            "physical_environment_z":0.06,
            "physical_environment_rank":144
          },
          {
            "name":"Barrow",
            "code":"bw",
            "outcomes_z":-0.50,
            "outcomes_rank":38,
            "factors_z":-0.10,
            "factors_rank":57,
            "length_of_life_z":-0.28,
            "length_of_life_rank":46,
            "quality_of_life_z":-0.21,
            "quality_of_life_rank":37,
            "health_behaviors_z":0.05,
            "health_behaviors_rank":92,
            "clinical_care_z":0.01,
            "clinical_care_rank":91,
            "social_and_economic_factors_z":-0.20,
            "social_and_economic_factors_rank":36,
            "physical_environment_z":0.04,
            "physical_environment_rank":135
          },
          {
            "name":"Bartow",
            "code":"bt",
            "outcomes_z":-0.33,
            "outcomes_rank":54,
            "factors_z":-0.19,
            "factors_rank":44,
            "length_of_life_z":-0.22,
            "length_of_life_rank":56,
            "quality_of_life_z":-0.11,
            "quality_of_life_rank":58,
            "health_behaviors_z":-0.10,
            "health_behaviors_rank":37,
            "clinical_care_z":-0.01,
            "clinical_care_rank":76,
            "social_and_economic_factors_z":-0.14,
            "social_and_economic_factors_rank":43,
            "physical_environment_z":0.06,
            "physical_environment_rank":146
          },
          {
            "name":"Ben Hill",
            "code":"bh",
            "outcomes_z":0.85,
            "outcomes_rank":146,
            "factors_z":0.53,
            "factors_rank":149,
            "length_of_life_z":0.13,
            "length_of_life_rank":95,
            "quality_of_life_z":0.73,
            "quality_of_life_rank":158,
            "health_behaviors_z":0.17,
            "health_behaviors_rank":140,
            "clinical_care_z":0.07,
            "clinical_care_rank":122,
            "social_and_economic_factors_z":0.33,
            "social_and_economic_factors_rank":147,
            "physical_environment_z":-0.03,
            "physical_environment_rank":39
          },
          {
            "name":"Berrien",
            "code":"bi",
            "outcomes_z":0.15,
            "outcomes_rank":88,
            "factors_z":0.33,
            "factors_rank":124,
            "length_of_life_z":-0.15,
            "length_of_life_rank":65,
            "quality_of_life_z":0.30,
            "quality_of_life_rank":132,
            "health_behaviors_z":0.18,
            "health_behaviors_rank":145,
            "clinical_care_z":0.15,
            "clinical_care_rank":147,
            "social_and_economic_factors_z":0.04,
            "social_and_economic_factors_rank":82,
            "physical_environment_z":-0.04,
            "physical_environment_rank":32
          },
          {
            "name":"Bibb",
            "code":"bb",
            "outcomes_z":0.67,
            "outcomes_rank":139,
            "factors_z":0.01,
            "factors_rank":74,
            "length_of_life_z":0.53,
            "length_of_life_rank":144,
            "quality_of_life_z":0.14,
            "quality_of_life_rank":106,
            "health_behaviors_z":-0.07,
            "health_behaviors_rank":46,
            "clinical_care_z":-0.19,
            "clinical_care_rank":5,
            "social_and_economic_factors_z":0.24,
            "social_and_economic_factors_rank":132,
            "physical_environment_z":0.02,
            "physical_environment_rank":104
          },
          {
            "name":"Bleckley",
            "code":"bl",
            "outcomes_z":0.53,
            "outcomes_rank":131,
            "factors_z":-0.03,
            "factors_rank":68,
            "length_of_life_z":0.30,
            "length_of_life_rank":116,
            "quality_of_life_z":0.23,
            "quality_of_life_rank":119,
            "health_behaviors_z":-0.05,
            "health_behaviors_rank":53,
            "clinical_care_z":-0.09,
            "clinical_care_rank":35,
            "social_and_economic_factors_z":0.12,
            "social_and_economic_factors_rank":101,
            "physical_environment_z":-0.00,
            "physical_environment_rank":82
          },
          {
            "name":"Brantley",
            "code":"be",
            "outcomes_z":0.40,
            "outcomes_rank":119,
            "factors_z":0.40,
            "factors_rank":131,
            "length_of_life_z":0.49,
            "length_of_life_rank":140,
            "quality_of_life_z":-0.09,
            "quality_of_life_rank":62,
            "health_behaviors_z":0.00,
            "health_behaviors_rank":74,
            "clinical_care_z":0.24,
            "clinical_care_rank":155,
            "social_and_economic_factors_z":0.17,
            "social_and_economic_factors_rank":119,
            "physical_environment_z":-0.01,
            "physical_environment_rank":69
          },
          {
            "name":"Brooks",
            "code":"bo",
            "outcomes_z":0.02,
            "outcomes_rank":73,
            "factors_z":0.29,
            "factors_rank":116,
            "length_of_life_z":-0.29,
            "length_of_life_rank":44,
            "quality_of_life_z":0.32,
            "quality_of_life_rank":135,
            "health_behaviors_z":0.10,
            "health_behaviors_rank":119,
            "clinical_care_z":0.05,
            "clinical_care_rank":110,
            "social_and_economic_factors_z":0.22,
            "social_and_economic_factors_rank":126,
            "physical_environment_z":-0.08,
            "physical_environment_rank":7
          },
          {
            "name":"Bryan",
            "code":"br",
            "outcomes_z":-0.83,
            "outcomes_rank":19,
            "factors_z":-0.88,
            "factors_rank":8,
            "length_of_life_z":-0.37,
            "length_of_life_rank":33,
            "quality_of_life_z":-0.47,
            "quality_of_life_rank":12,
            "health_behaviors_z":-0.28,
            "health_behaviors_rank":10,
            "clinical_care_z":-0.17,
            "clinical_care_rank":9,
            "social_and_economic_factors_z":-0.49,
            "social_and_economic_factors_rank":7,
            "physical_environment_z":0.05,
            "physical_environment_rank":140
          },
          {
            "name":"Bulloch",
            "code":"bc",
            "outcomes_z":-0.37,
            "outcomes_rank":47,
            "factors_z":-0.08,
            "factors_rank":61,
            "length_of_life_z":-0.27,
            "length_of_life_rank":48,
            "quality_of_life_z":-0.11,
            "quality_of_life_rank":60,
            "health_behaviors_z":0.00,
            "health_behaviors_rank":76,
            "clinical_care_z":0.02,
            "clinical_care_rank":94,
            "social_and_economic_factors_z":-0.11,
            "social_and_economic_factors_rank":48,
            "physical_environment_z":0.00,
            "physical_environment_rank":85
          },
          {
            "name":"Burke",
            "code":"bu",
            "outcomes_z":0.84,
            "outcomes_rank":145,
            "factors_z":0.34,
            "factors_rank":125,
            "length_of_life_z":0.51,
            "length_of_life_rank":142,
            "quality_of_life_z":0.33,
            "quality_of_life_rank":138,
            "health_behaviors_z":-0.05,
            "health_behaviors_rank":56,
            "clinical_care_z":-0.02,
            "clinical_care_rank":66,
            "social_and_economic_factors_z":0.40,
            "social_and_economic_factors_rank":152,
            "physical_environment_z":0.01,
            "physical_environment_rank":90
          },
          {
            "name":"Butts",
            "code":"bs",
            "outcomes_z":0.64,
            "outcomes_rank":137,
            "factors_z":0.12,
            "factors_rank":87,
            "length_of_life_z":0.63,
            "length_of_life_rank":148,
            "quality_of_life_z":0.02,
            "quality_of_life_rank":84,
            "health_behaviors_z":-0.01,
            "health_behaviors_rank":69,
            "clinical_care_z":-0.05,
            "clinical_care_rank":49,
            "social_and_economic_factors_z":0.08,
            "social_and_economic_factors_rank":93,
            "physical_environment_z":0.11,
            "physical_environment_rank":156
          },
          {
            "name":"Calhoun",
            "code":"cl",
            "outcomes_z":-0.42,
            "outcomes_rank":41,
            "factors_z":0.26,
            "factors_rank":113,
            "length_of_life_z":-0.65,
            "length_of_life_rank":12,
            "quality_of_life_z":0.23,
            "quality_of_life_rank":121,
            "health_behaviors_z":0.03,
            "health_behaviors_rank":87,
            "clinical_care_z":0.17,
            "clinical_care_rank":148,
            "social_and_economic_factors_z":0.17,
            "social_and_economic_factors_rank":120,
            "physical_environment_z":-0.12,
            "physical_environment_rank":1
          },
          {
            "name":"Camden",
            "code":"cm",
            "outcomes_z":-1.00,
            "outcomes_rank":10,
            "factors_z":-0.51,
            "factors_rank":19,
            "length_of_life_z":-0.60,
            "length_of_life_rank":16,
            "quality_of_life_z":-0.39,
            "quality_of_life_rank":19,
            "health_behaviors_z":-0.05,
            "health_behaviors_rank":55,
            "clinical_care_z":-0.15,
            "clinical_care_rank":17,
            "social_and_economic_factors_z":-0.29,
            "social_and_economic_factors_rank":25,
            "physical_environment_z":-0.02,
            "physical_environment_rank":57
          },
          {
            "name":"Candler",
            "code":"cn",
            "outcomes_z":0.12,
            "outcomes_rank":82,
            "factors_z":0.45,
            "factors_rank":138,
            "length_of_life_z":0.45,
            "length_of_life_rank":136,
            "quality_of_life_z":-0.34,
            "quality_of_life_rank":27,
            "health_behaviors_z":0.19,
            "health_behaviors_rank":146,
            "clinical_care_z":0.23,
            "clinical_care_rank":154,
            "social_and_economic_factors_z":0.07,
            "social_and_economic_factors_rank":92,
            "physical_environment_z":-0.04,
            "physical_environment_rank":28
          },
          {
            "name":"Carroll",
            "code":"cr",
            "outcomes_z":-0.29,
            "outcomes_rank":58,
            "factors_z":-0.11,
            "factors_rank":54,
            "length_of_life_z":-0.11,
            "length_of_life_rank":70,
            "quality_of_life_z":-0.18,
            "quality_of_life_rank":46,
            "health_behaviors_z":-0.01,
            "health_behaviors_rank":70,
            "clinical_care_z":-0.08,
            "clinical_care_rank":39,
            "social_and_economic_factors_z":-0.09,
            "social_and_economic_factors_rank":55,
            "physical_environment_z":0.07,
            "physical_environment_rank":149
          },
          {
            "name":"Catoosa",
            "code":"cs",
            "outcomes_z":-0.46,
            "outcomes_rank":39,
            "factors_z":-0.50,
            "factors_rank":20,
            "length_of_life_z":-0.51,
            "length_of_life_rank":21,
            "quality_of_life_z":0.05,
            "quality_of_life_rank":92,
            "health_behaviors_z":0.01,
            "health_behaviors_rank":77,
            "clinical_care_z":-0.07,
            "clinical_care_rank":43,
            "social_and_economic_factors_z":-0.46,
            "social_and_economic_factors_rank":8,
            "physical_environment_z":0.03,
            "physical_environment_rank":111
          },
          {
            "name":"Charlton",
            "code":"ch",
            "outcomes_z":0.18,
            "outcomes_rank":93,
            "factors_z":0.43,
            "factors_rank":135,
            "length_of_life_z":0.04,
            "length_of_life_rank":85,
            "quality_of_life_z":0.14,
            "quality_of_life_rank":107,
            "health_behaviors_z":0.26,
            "health_behaviors_rank":156,
            "clinical_care_z":0.15,
            "clinical_care_rank":146,
            "social_and_economic_factors_z":0.07,
            "social_and_economic_factors_rank":90,
            "physical_environment_z":-0.04,
            "physical_environment_rank":27
          },
          {
            "name":"Chatham",
            "code":"ca",
            "outcomes_z":-0.34,
            "outcomes_rank":52,
            "factors_z":-0.32,
            "factors_rank":36,
            "length_of_life_z":-0.16,
            "length_of_life_rank":64,
            "quality_of_life_z":-0.18,
            "quality_of_life_rank":48,
            "health_behaviors_z":-0.11,
            "health_behaviors_rank":35,
            "clinical_care_z":-0.17,
            "clinical_care_rank":10,
            "social_and_economic_factors_z":-0.04,
            "social_and_economic_factors_rank":63,
            "physical_environment_z":-0.00,
            "physical_environment_rank":81
          },
          {
            "name":"Chattahoochee",
            "code":"cc",
            "outcomes_z":-0.22,
            "outcomes_rank":63,
            "factors_z":-0.29,
            "factors_rank":40,
            "length_of_life_z":-0.04,
            "length_of_life_rank":79,
            "quality_of_life_z":-0.19,
            "quality_of_life_rank":43,
            "health_behaviors_z":0.06,
            "health_behaviors_rank":101,
            "clinical_care_z":-0.14,
            "clinical_care_rank":21,
            "social_and_economic_factors_z":-0.10,
            "social_and_economic_factors_rank":51,
            "physical_environment_z":-0.11,
            "physical_environment_rank":2
          },
          {
            "name":"Chattooga",
            "code":"cg",
            "outcomes_z":0.51,
            "outcomes_rank":129,
            "factors_z":0.24,
            "factors_rank":109,
            "length_of_life_z":0.20,
            "length_of_life_rank":104,
            "quality_of_life_z":0.31,
            "quality_of_life_rank":133,
            "health_behaviors_z":0.11,
            "health_behaviors_rank":121,
            "clinical_care_z":0.02,
            "clinical_care_rank":96,
            "social_and_economic_factors_z":0.04,
            "social_and_economic_factors_rank":85,
            "physical_environment_z":0.06,
            "physical_environment_rank":147
          },
          {
            "name":"Cherokee",
            "code":"ce",
            "outcomes_z":-1.47,
            "outcomes_rank":5,
            "factors_z":-0.96,
            "factors_rank":6,
            "length_of_life_z":-0.88,
            "length_of_life_rank":7,
            "quality_of_life_z":-0.59,
            "quality_of_life_rank":4,
            "health_behaviors_z":-0.27,
            "health_behaviors_rank":11,
            "clinical_care_z":-0.12,
            "clinical_care_rank":28,
            "social_and_economic_factors_z":-0.61,
            "social_and_economic_factors_rank":5,
            "physical_environment_z":0.04,
            "physical_environment_rank":130
          },
          {
            "name":"Clarke",
            "code":"ck",
            "outcomes_z":-0.85,
            "outcomes_rank":16,
            "factors_z":-0.63,
            "factors_rank":12,
            "length_of_life_z":-0.63,
            "length_of_life_rank":14,
            "quality_of_life_z":-0.22,
            "quality_of_life_rank":35,
            "health_behaviors_z":-0.26,
            "health_behaviors_rank":13,
            "clinical_care_z":-0.15,
            "clinical_care_rank":18,
            "social_and_economic_factors_z":-0.25,
            "social_and_economic_factors_rank":28,
            "physical_environment_z":0.03,
            "physical_environment_rank":112
          },
          {
            "name":"Clay",
            "code":"cy",
            "outcomes_z":1.68,
            "outcomes_rank":159,
            "factors_z":0.28,
            "factors_rank":115,
            "length_of_life_z":1.50,
            "length_of_life_rank":159,
            "quality_of_life_z":0.18,
            "quality_of_life_rank":113,
            "health_behaviors_z":0.03,
            "health_behaviors_rank":83,
            "clinical_care_z":-0.03,
            "clinical_care_rank":60,
            "social_and_economic_factors_z":0.29,
            "social_and_economic_factors_rank":141,
            "physical_environment_z":-0.01,
            "physical_environment_rank":76
          },
          {
            "name":"Clayton",
            "code":"ct",
            "outcomes_z":-0.41,
            "outcomes_rank":44,
            "factors_z":0.37,
            "factors_rank":129,
            "length_of_life_z":-0.33,
            "length_of_life_rank":39,
            "quality_of_life_z":-0.07,
            "quality_of_life_rank":67,
            "health_behaviors_z":0.00,
            "health_behaviors_rank":75,
            "clinical_care_z":0.06,
            "clinical_care_rank":119,
            "social_and_economic_factors_z":0.25,
            "social_and_economic_factors_rank":136,
            "physical_environment_z":0.05,
            "physical_environment_rank":141
          },
          {
            "name":"Clinch",
            "code":"ci",
            "outcomes_z":1.07,
            "outcomes_rank":149,
            "factors_z":0.31,
            "factors_rank":121,
            "length_of_life_z":0.78,
            "length_of_life_rank":153,
            "quality_of_life_z":0.28,
            "quality_of_life_rank":131,
            "health_behaviors_z":0.10,
            "health_behaviors_rank":120,
            "clinical_care_z":0.21,
            "clinical_care_rank":153,
            "social_and_economic_factors_z":0.06,
            "social_and_economic_factors_rank":87,
            "physical_environment_z":-0.06,
            "physical_environment_rank":19
          },
          {
            "name":"Cobb",
            "code":"cb",
            "outcomes_z":-1.42,
            "outcomes_rank":6,
            "factors_z":-0.89,
            "factors_rank":7,
            "length_of_life_z":-0.88,
            "length_of_life_rank":6,
            "quality_of_life_z":-0.54,
            "quality_of_life_rank":8,
            "health_behaviors_z":-0.35,
            "health_behaviors_rank":4,
            "clinical_care_z":-0.14,
            "clinical_care_rank":24,
            "social_and_economic_factors_z":-0.43,
            "social_and_economic_factors_rank":10,
            "physical_environment_z":0.03,
            "physical_environment_rank":118
          },
          {
            "name":"Coffee",
            "code":"cf",
            "outcomes_z":0.12,
            "outcomes_rank":81,
            "factors_z":0.51,
            "factors_rank":148,
            "length_of_life_z":-0.08,
            "length_of_life_rank":75,
            "quality_of_life_z":0.19,
            "quality_of_life_rank":114,
            "health_behaviors_z":0.01,
            "health_behaviors_rank":78,
            "clinical_care_z":0.26,
            "clinical_care_rank":156,
            "social_and_economic_factors_z":0.30,
            "social_and_economic_factors_rank":144,
            "physical_environment_z":-0.06,
            "physical_environment_rank":21
          },
          {
            "name":"Colquitt",
            "code":"cq",
            "outcomes_z":-0.00,
            "outcomes_rank":69,
            "factors_z":0.11,
            "factors_rank":85,
            "length_of_life_z":-0.14,
            "length_of_life_rank":66,
            "quality_of_life_z":0.14,
            "quality_of_life_rank":105,
            "health_behaviors_z":0.11,
            "health_behaviors_rank":122,
            "clinical_care_z":0.05,
            "clinical_care_rank":111,
            "social_and_economic_factors_z":0.04,
            "social_and_economic_factors_rank":81,
            "physical_environment_z":-0.09,
            "physical_environment_rank":6
          },
          {
            "name":"Columbia",
            "code":"cu",
            "outcomes_z":-1.32,
            "outcomes_rank":7,
            "factors_z":-1.17,
            "factors_rank":4,
            "length_of_life_z":-0.77,
            "length_of_life_rank":9,
            "quality_of_life_z":-0.54,
            "quality_of_life_rank":7,
            "health_behaviors_z":-0.30,
            "health_behaviors_rank":9,
            "clinical_care_z":-0.24,
            "clinical_care_rank":3,
            "social_and_economic_factors_z":-0.61,
            "social_and_economic_factors_rank":4,
            "physical_environment_z":-0.02,
            "physical_environment_rank":52
          },
          {
            "name":"Cook",
            "code":"co",
            "outcomes_z":0.28,
            "outcomes_rank":105,
            "factors_z":0.24,
            "factors_rank":111,
            "length_of_life_z":0.29,
            "length_of_life_rank":112,
            "quality_of_life_z":-0.02,
            "quality_of_life_rank":77,
            "health_behaviors_z":0.09,
            "health_behaviors_rank":116,
            "clinical_care_z":0.12,
            "clinical_care_rank":139,
            "social_and_economic_factors_z":0.06,
            "social_and_economic_factors_rank":88,
            "physical_environment_z":-0.02,
            "physical_environment_rank":49
          },
          {
            "name":"Coweta",
            "code":"cw",
            "outcomes_z":-1.17,
            "outcomes_rank":8,
            "factors_z":-0.68,
            "factors_rank":11,
            "length_of_life_z":-0.78,
            "length_of_life_rank":8,
            "quality_of_life_z":-0.39,
            "quality_of_life_rank":20,
            "health_behaviors_z":-0.19,
            "health_behaviors_rank":17,
            "clinical_care_z":-0.12,
            "clinical_care_rank":26,
            "social_and_economic_factors_z":-0.39,
            "social_and_economic_factors_rank":12,
            "physical_environment_z":0.02,
            "physical_environment_rank":102
          },
          {
            "name":"Crawford",
            "code":"cd",
            "outcomes_z":-0.41,
            "outcomes_rank":43,
            "factors_z":0.22,
            "factors_rank":105,
            "length_of_life_z":-0.49,
            "length_of_life_rank":24,
            "quality_of_life_z":0.08,
            "quality_of_life_rank":96,
            "health_behaviors_z":0.03,
            "health_behaviors_rank":84,
            "clinical_care_z":0.05,
            "clinical_care_rank":109,
            "social_and_economic_factors_z":0.10,
            "social_and_economic_factors_rank":97,
            "physical_environment_z":0.04,
            "physical_environment_rank":136
          },
          {
            "name":"Crisp",
            "code":"cp",
            "outcomes_z":1.12,
            "outcomes_rank":151,
            "factors_z":0.51,
            "factors_rank":147,
            "length_of_life_z":0.44,
            "length_of_life_rank":135,
            "quality_of_life_z":0.67,
            "quality_of_life_rank":156,
            "health_behaviors_z":0.15,
            "health_behaviors_rank":134,
            "clinical_care_z":-0.03,
            "clinical_care_rank":63,
            "social_and_economic_factors_z":0.44,
            "social_and_economic_factors_rank":154,
            "physical_environment_z":-0.05,
            "physical_environment_rank":24
          },
          {
            "name":"Dade",
            "code":"da",
            "outcomes_z":0.44,
            "outcomes_rank":122,
            "factors_z":-0.46,
            "factors_rank":26,
            "length_of_life_z":0.42,
            "length_of_life_rank":132,
            "quality_of_life_z":0.02,
            "quality_of_life_rank":86,
            "health_behaviors_z":-0.16,
            "health_behaviors_rank":24,
            "clinical_care_z":-0.05,
            "clinical_care_rank":54,
            "social_and_economic_factors_z":-0.25,
            "social_and_economic_factors_rank":29,
            "physical_environment_z":-0.01,
            "physical_environment_rank":75
          },
          {
            "name":"Dawson",
            "code":"dw",
            "outcomes_z":-0.73,
            "outcomes_rank":23,
            "factors_z":-0.17,
            "factors_rank":45,
            "length_of_life_z":-0.37,
            "length_of_life_rank":32,
            "quality_of_life_z":-0.36,
            "quality_of_life_rank":24,
            "health_behaviors_z":0.08,
            "health_behaviors_rank":112,
            "clinical_care_z":-0.03,
            "clinical_care_rank":61,
            "social_and_economic_factors_z":-0.37,
            "social_and_economic_factors_rank":17,
            "physical_environment_z":0.14,
            "physical_environment_rank":159
          },
          {
            "name":"Decatur",
            "code":"de",
            "outcomes_z":0.53,
            "outcomes_rank":132,
            "factors_z":0.57,
            "factors_rank":151,
            "length_of_life_z":0.44,
            "length_of_life_rank":134,
            "quality_of_life_z":0.10,
            "quality_of_life_rank":101,
            "health_behaviors_z":0.18,
            "health_behaviors_rank":143,
            "clinical_care_z":0.07,
            "clinical_care_rank":124,
            "social_and_economic_factors_z":0.35,
            "social_and_economic_factors_rank":149,
            "physical_environment_z":-0.03,
            "physical_environment_rank":37
          },
          {
            "name":"DeKalb",
            "code":"dk",
            "outcomes_z":-0.85,
            "outcomes_rank":18,
            "factors_z":-0.47,
            "factors_rank":23,
            "length_of_life_z":-0.52,
            "length_of_life_rank":20,
            "quality_of_life_z":-0.33,
            "quality_of_life_rank":29,
            "health_behaviors_z":-0.32,
            "health_behaviors_rank":7,
            "clinical_care_z":-0.15,
            "clinical_care_rank":14,
            "social_and_economic_factors_z":-0.03,
            "social_and_economic_factors_rank":64,
            "physical_environment_z":0.03,
            "physical_environment_rank":124
          },
          {
            "name":"Dodge",
            "code":"do",
            "outcomes_z":0.46,
            "outcomes_rank":126,
            "factors_z":0.22,
            "factors_rank":104,
            "length_of_life_z":0.13,
            "length_of_life_rank":96,
            "quality_of_life_z":0.34,
            "quality_of_life_rank":139,
            "health_behaviors_z":0.05,
            "health_behaviors_rank":94,
            "clinical_care_z":0.05,
            "clinical_care_rank":107,
            "social_and_economic_factors_z":0.16,
            "social_and_economic_factors_rank":113,
            "physical_environment_z":-0.04,
            "physical_environment_rank":34
          },
          {
            "name":"Dooly",
            "code":"dl",
            "outcomes_z":-0.69,
            "outcomes_rank":27,
            "factors_z":0.47,
            "factors_rank":140,
            "length_of_life_z":-0.92,
            "length_of_life_rank":5,
            "quality_of_life_z":0.23,
            "quality_of_life_rank":120,
            "health_behaviors_z":0.08,
            "health_behaviors_rank":108,
            "clinical_care_z":0.06,
            "clinical_care_rank":117,
            "social_and_economic_factors_z":0.35,
            "social_and_economic_factors_rank":150,
            "physical_environment_z":-0.02,
            "physical_environment_rank":58
          },
          {
            "name":"Dougherty",
            "code":"du",
            "outcomes_z":0.34,
            "outcomes_rank":107,
            "factors_z":0.34,
            "factors_rank":126,
            "length_of_life_z":0.17,
            "length_of_life_rank":100,
            "quality_of_life_z":0.17,
            "quality_of_life_rank":110,
            "health_behaviors_z":0.15,
            "health_behaviors_rank":136,
            "clinical_care_z":-0.09,
            "clinical_care_rank":36,
            "social_and_economic_factors_z":0.33,
            "social_and_economic_factors_rank":148,
            "physical_environment_z":-0.05,
            "physical_environment_rank":22
          },
          {
            "name":"Douglas",
            "code":"dg",
            "outcomes_z":-0.70,
            "outcomes_rank":26,
            "factors_z":-0.39,
            "factors_rank":32,
            "length_of_life_z":-0.49,
            "length_of_life_rank":25,
            "quality_of_life_z":-0.21,
            "quality_of_life_rank":39,
            "health_behaviors_z":-0.12,
            "health_behaviors_rank":33,
            "clinical_care_z":-0.04,
            "clinical_care_rank":56,
            "social_and_economic_factors_z":-0.25,
            "social_and_economic_factors_rank":27,
            "physical_environment_z":0.03,
            "physical_environment_rank":116
          },
          {
            "name":"Early",
            "code":"ea",
            "outcomes_z":1.38,
            "outcomes_rank":154,
            "factors_z":0.41,
            "factors_rank":134,
            "length_of_life_z":0.83,
            "length_of_life_rank":154,
            "quality_of_life_z":0.54,
            "quality_of_life_rank":153,
            "health_behaviors_z":0.19,
            "health_behaviors_rank":147,
            "clinical_care_z":0.05,
            "clinical_care_rank":112,
            "social_and_economic_factors_z":0.20,
            "social_and_economic_factors_rank":124,
            "physical_environment_z":-0.04,
            "physical_environment_rank":35
          },
          {
            "name":"Echols",
            "code":"ec",
            "outcomes_z":-0.25,
            "outcomes_rank":62,
            "factors_z":-0.04,
            "factors_rank":67,
            "length_of_life_z":-0.25,
            "length_of_life_rank":52,
            "quality_of_life_z":0.00,
            "quality_of_life_rank":80,
            "health_behaviors_z":-0.03,
            "health_behaviors_rank":63,
            "clinical_care_z":0.10,
            "clinical_care_rank":133,
            "social_and_economic_factors_z":-0.03,
            "social_and_economic_factors_rank":67,
            "physical_environment_z":-0.08,
            "physical_environment_rank":8
          },
          {
            "name":"Effingham",
            "code":"ef",
            "outcomes_z":-0.60,
            "outcomes_rank":35,
            "factors_z":-0.70,
            "factors_rank":10,
            "length_of_life_z":-0.38,
            "length_of_life_rank":31,
            "quality_of_life_z":-0.22,
            "quality_of_life_rank":36,
            "health_behaviors_z":-0.15,
            "health_behaviors_rank":25,
            "clinical_care_z":-0.10,
            "clinical_care_rank":31,
            "social_and_economic_factors_z":-0.45,
            "social_and_economic_factors_rank":9,
            "physical_environment_z":0.00,
            "physical_environment_rank":83
          },
          {
            "name":"Elbert",
            "code":"el",
            "outcomes_z":0.36,
            "outcomes_rank":112,
            "factors_z":0.23,
            "factors_rank":107,
            "length_of_life_z":0.08,
            "length_of_life_rank":92,
            "quality_of_life_z":0.28,
            "quality_of_life_rank":129,
            "health_behaviors_z":0.07,
            "health_behaviors_rank":106,
            "clinical_care_z":0.01,
            "clinical_care_rank":88,
            "social_and_economic_factors_z":0.16,
            "social_and_economic_factors_rank":114,
            "physical_environment_z":-0.01,
            "physical_environment_rank":68
          },
          {
            "name":"Emanuel",
            "code":"em",
            "outcomes_z":0.37,
            "outcomes_rank":115,
            "factors_z":0.31,
            "factors_rank":120,
            "length_of_life_z":0.47,
            "length_of_life_rank":137,
            "quality_of_life_z":-0.09,
            "quality_of_life_rank":61,
            "health_behaviors_z":0.03,
            "health_behaviors_rank":86,
            "clinical_care_z":0.12,
            "clinical_care_rank":138,
            "social_and_economic_factors_z":0.20,
            "social_and_economic_factors_rank":123,
            "physical_environment_z":-0.04,
            "physical_environment_rank":33
          },
          {
            "name":"Evans",
            "code":"ev",
            "outcomes_z":0.20,
            "outcomes_rank":95,
            "factors_z":0.61,
            "factors_rank":153,
            "length_of_life_z":-0.08,
            "length_of_life_rank":72,
            "quality_of_life_z":0.28,
            "quality_of_life_rank":130,
            "health_behaviors_z":0.34,
            "health_behaviors_rank":158,
            "clinical_care_z":0.13,
            "clinical_care_rank":142,
            "social_and_economic_factors_z":0.15,
            "social_and_economic_factors_rank":106,
            "physical_environment_z":-0.00,
            "physical_environment_rank":80
          },
          {
            "name":"Fannin",
            "code":"fa",
            "outcomes_z":0.35,
            "outcomes_rank":110,
            "factors_z":0.10,
            "factors_rank":83,
            "length_of_life_z":0.17,
            "length_of_life_rank":101,
            "quality_of_life_z":0.18,
            "quality_of_life_rank":112,
            "health_behaviors_z":-0.03,
            "health_behaviors_rank":62,
            "clinical_care_z":0.09,
            "clinical_care_rank":128,
            "social_and_economic_factors_z":0.03,
            "social_and_economic_factors_rank":78,
            "physical_environment_z":0.02,
            "physical_environment_rank":100
          },
          {
            "name":"Fayette",
            "code":"fy",
            "outcomes_z":-1.68,
            "outcomes_rank":2,
            "factors_z":-1.33,
            "factors_rank":3,
            "length_of_life_z":-1.01,
            "length_of_life_rank":3,
            "quality_of_life_z":-0.67,
            "quality_of_life_rank":3,
            "health_behaviors_z":-0.42,
            "health_behaviors_rank":3,
            "clinical_care_z":-0.37,
            "clinical_care_rank":1,
            "social_and_economic_factors_z":-0.64,
            "social_and_economic_factors_rank":3,
            "physical_environment_z":0.10,
            "physical_environment_rank":154
          },
          {
            "name":"Floyd",
            "code":"fl",
            "outcomes_z":0.25,
            "outcomes_rank":100,
            "factors_z":-0.30,
            "factors_rank":39,
            "length_of_life_z":0.05,
            "length_of_life_rank":89,
            "quality_of_life_z":0.20,
            "quality_of_life_rank":115,
            "health_behaviors_z":-0.13,
            "health_behaviors_rank":30,
            "clinical_care_z":-0.15,
            "clinical_care_rank":16,
            "social_and_economic_factors_z":-0.02,
            "social_and_economic_factors_rank":69,
            "physical_environment_z":-0.00,
            "physical_environment_rank":79
          },
          {
            "name":"Forsyth",
            "code":"fo",
            "outcomes_z":-2.04,
            "outcomes_rank":1,
            "factors_z":-1.39,
            "factors_rank":2,
            "length_of_life_z":-1.27,
            "length_of_life_rank":1,
            "quality_of_life_z":-0.76,
            "quality_of_life_rank":1,
            "health_behaviors_z":-0.45,
            "health_behaviors_rank":1,
            "clinical_care_z":-0.16,
            "clinical_care_rank":12,
            "social_and_economic_factors_z":-0.79,
            "social_and_economic_factors_rank":2,
            "physical_environment_z":0.01,
            "physical_environment_rank":93
          },
          {
            "name":"Franklin",
            "code":"fr",
            "outcomes_z":0.26,
            "outcomes_rank":101,
            "factors_z":-0.08,
            "factors_rank":60,
            "length_of_life_z":0.38,
            "length_of_life_rank":127,
            "quality_of_life_z":-0.12,
            "quality_of_life_rank":54,
            "health_behaviors_z":-0.13,
            "health_behaviors_rank":28,
            "clinical_care_z":0.01,
            "clinical_care_rank":90,
            "social_and_economic_factors_z":0.03,
            "social_and_economic_factors_rank":79,
            "physical_environment_z":0.01,
            "physical_environment_rank":86
          },
          {
            "name":"Fulton",
            "code":"fu",
            "outcomes_z":-0.65,
            "outcomes_rank":29,
            "factors_z":-0.50,
            "factors_rank":21,
            "length_of_life_z":-0.31,
            "length_of_life_rank":42,
            "quality_of_life_z":-0.34,
            "quality_of_life_rank":26,
            "health_behaviors_z":-0.31,
            "health_behaviors_rank":8,
            "clinical_care_z":-0.16,
            "clinical_care_rank":11,
            "social_and_economic_factors_z":-0.12,
            "social_and_economic_factors_rank":44,
            "physical_environment_z":0.10,
            "physical_environment_rank":153
          },
          {
            "name":"Gilmer",
            "code":"gi",
            "outcomes_z":-0.66,
            "outcomes_rank":28,
            "factors_z":-0.02,
            "factors_rank":69,
            "length_of_life_z":-0.44,
            "length_of_life_rank":26,
            "quality_of_life_z":-0.21,
            "quality_of_life_rank":38,
            "health_behaviors_z":-0.06,
            "health_behaviors_rank":47,
            "clinical_care_z":0.07,
            "clinical_care_rank":123,
            "social_and_economic_factors_z":-0.05,
            "social_and_economic_factors_rank":60,
            "physical_environment_z":0.02,
            "physical_environment_rank":107
          },
          {
            "name":"Glascock",
            "code":"gl",
            "outcomes_z":0.46,
            "outcomes_rank":125,
            "factors_z":-0.06,
            "factors_rank":65,
            "length_of_life_z":0.38,
            "length_of_life_rank":128,
            "quality_of_life_z":0.08,
            "quality_of_life_rank":95,
            "health_behaviors_z":0.03,
            "health_behaviors_rank":88,
            "clinical_care_z":-0.01,
            "clinical_care_rank":78,
            "social_and_economic_factors_z":-0.11,
            "social_and_economic_factors_rank":47,
            "physical_environment_z":0.02,
            "physical_environment_rank":108
          },
          {
            "name":"Glynn",
            "code":"gy",
            "outcomes_z":-0.27,
            "outcomes_rank":59,
            "factors_z":-0.22,
            "factors_rank":41,
            "length_of_life_z":0.02,
            "length_of_life_rank":82,
            "quality_of_life_z":-0.29,
            "quality_of_life_rank":31,
            "health_behaviors_z":-0.06,
            "health_behaviors_rank":50,
            "clinical_care_z":-0.10,
            "clinical_care_rank":32,
            "social_and_economic_factors_z":-0.05,
            "social_and_economic_factors_rank":61,
            "physical_environment_z":-0.02,
            "physical_environment_rank":53
          },
          {
            "name":"Gordon",
            "code":"go",
            "outcomes_z":-0.30,
            "outcomes_rank":57,
            "factors_z":-0.08,
            "factors_rank":63,
            "length_of_life_z":-0.12,
            "length_of_life_rank":67,
            "quality_of_life_z":-0.18,
            "quality_of_life_rank":45,
            "health_behaviors_z":-0.02,
            "health_behaviors_rank":66,
            "clinical_care_z":0.07,
            "clinical_care_rank":121,
            "social_and_economic_factors_z":-0.14,
            "social_and_economic_factors_rank":42,
            "physical_environment_z":0.02,
            "physical_environment_rank":109
          },
          {
            "name":"Grady",
            "code":"gr",
            "outcomes_z":0.17,
            "outcomes_rank":89,
            "factors_z":0.15,
            "factors_rank":95,
            "length_of_life_z":0.05,
            "length_of_life_rank":88,
            "quality_of_life_z":0.12,
            "quality_of_life_rank":103,
            "health_behaviors_z":0.17,
            "health_behaviors_rank":141,
            "clinical_care_z":0.06,
            "clinical_care_rank":116,
            "social_and_economic_factors_z":-0.03,
            "social_and_economic_factors_rank":68,
            "physical_environment_z":-0.05,
            "physical_environment_rank":25
          },
          {
            "name":"Greene",
            "code":"ge",
            "outcomes_z":0.11,
            "outcomes_rank":79,
            "factors_z":0.02,
            "factors_rank":77,
            "length_of_life_z":-0.06,
            "length_of_life_rank":78,
            "quality_of_life_z":0.16,
            "quality_of_life_rank":108,
            "health_behaviors_z":-0.17,
            "health_behaviors_rank":19,
            "clinical_care_z":-0.08,
            "clinical_care_rank":37,
            "social_and_economic_factors_z":0.24,
            "social_and_economic_factors_rank":130,
            "physical_environment_z":0.03,
            "physical_environment_rank":119
          },
          {
            "name":"Gwinnett",
            "code":"gw",
            "outcomes_z":-1.56,
            "outcomes_rank":4,
            "factors_z":-0.74,
            "factors_rank":9,
            "length_of_life_z":-0.97,
            "length_of_life_rank":4,
            "quality_of_life_z":-0.58,
            "quality_of_life_rank":5,
            "health_behaviors_z":-0.33,
            "health_behaviors_rank":6,
            "clinical_care_z":-0.08,
            "clinical_care_rank":38,
            "social_and_economic_factors_z":-0.38,
            "social_and_economic_factors_rank":14,
            "physical_environment_z":0.05,
            "physical_environment_rank":142
          },
          {
            "name":"Habersham",
            "code":"ha",
            "outcomes_z":-0.86,
            "outcomes_rank":15,
            "factors_z":-0.30,
            "factors_rank":37,
            "length_of_life_z":-0.53,
            "length_of_life_rank":19,
            "quality_of_life_z":-0.33,
            "quality_of_life_rank":28,
            "health_behaviors_z":-0.06,
            "health_behaviors_rank":48,
            "clinical_care_z":-0.05,
            "clinical_care_rank":47,
            "social_and_economic_factors_z":-0.22,
            "social_and_economic_factors_rank":34,
            "physical_environment_z":0.03,
            "physical_environment_rank":120
          },
          {
            "name":"Hall",
            "code":"hl",
            "outcomes_z":-0.98,
            "outcomes_rank":12,
            "factors_z":-0.44,
            "factors_rank":27,
            "length_of_life_z":-0.60,
            "length_of_life_rank":17,
            "quality_of_life_z":-0.38,
            "quality_of_life_rank":22,
            "health_behaviors_z":-0.17,
            "health_behaviors_rank":21,
            "clinical_care_z":-0.06,
            "clinical_care_rank":45,
            "social_and_economic_factors_z":-0.24,
            "social_and_economic_factors_rank":31,
            "physical_environment_z":0.03,
            "physical_environment_rank":126
          },
          {
            "name":"Hancock",
            "code":"hn",
            "outcomes_z":0.21,
            "outcomes_rank":96,
            "factors_z":0.82,
            "factors_rank":157,
            "length_of_life_z":-0.23,
            "length_of_life_rank":54,
            "quality_of_life_z":0.44,
            "quality_of_life_rank":147,
            "health_behaviors_z":0.20,
            "health_behaviors_rank":150,
            "clinical_care_z":0.03,
            "clinical_care_rank":101,
            "social_and_economic_factors_z":0.47,
            "social_and_economic_factors_rank":157,
            "physical_environment_z":0.11,
            "physical_environment_rank":157
          },
          {
            "name":"Haralson",
            "code":"hr",
            "outcomes_z":0.44,
            "outcomes_rank":123,
            "factors_z":0.17,
            "factors_rank":97,
            "length_of_life_z":0.55,
            "length_of_life_rank":145,
            "quality_of_life_z":-0.11,
            "quality_of_life_rank":57,
            "health_behaviors_z":0.13,
            "health_behaviors_rank":127,
            "clinical_care_z":-0.08,
            "clinical_care_rank":41,
            "social_and_economic_factors_z":0.10,
            "social_and_economic_factors_rank":98,
            "physical_environment_z":0.01,
            "physical_environment_rank":89
          },
          {
            "name":"Harris",
            "code":"hi",
            "outcomes_z":-0.61,
            "outcomes_rank":33,
            "factors_z":-0.98,
            "factors_rank":5,
            "length_of_life_z":-0.17,
            "length_of_life_rank":63,
            "quality_of_life_z":-0.44,
            "quality_of_life_rank":14,
            "health_behaviors_z":-0.21,
            "health_behaviors_rank":16,
            "clinical_care_z":-0.18,
            "clinical_care_rank":7,
            "social_and_economic_factors_z":-0.58,
            "social_and_economic_factors_rank":6,
            "physical_environment_z":-0.00,
            "physical_environment_rank":77
          },
          {
            "name":"Hart",
            "code":"ht",
            "outcomes_z":-0.25,
            "outcomes_rank":61,
            "factors_z":-0.09,
            "factors_rank":59,
            "length_of_life_z":-0.20,
            "length_of_life_rank":57,
            "quality_of_life_z":-0.05,
            "quality_of_life_rank":72,
            "health_behaviors_z":-0.12,
            "health_behaviors_rank":32,
            "clinical_care_z":-0.01,
            "clinical_care_rank":77,
            "social_and_economic_factors_z":0.00,
            "social_and_economic_factors_rank":71,
            "physical_environment_z":0.04,
            "physical_environment_rank":129
          },
          {
            "name":"Heard",
            "code":"he",
            "outcomes_z":0.12,
            "outcomes_rank":84,
            "factors_z":0.13,
            "factors_rank":91,
            "length_of_life_z":0.29,
            "length_of_life_rank":113,
            "quality_of_life_z":-0.17,
            "quality_of_life_rank":50,
            "health_behaviors_z":-0.08,
            "health_behaviors_rank":43,
            "clinical_care_z":0.12,
            "clinical_care_rank":140,
            "social_and_economic_factors_z":-0.00,
            "social_and_economic_factors_rank":70,
            "physical_environment_z":0.10,
            "physical_environment_rank":152
          },
          {
            "name":"Henry",
            "code":"hy",
            "outcomes_z":-0.89,
            "outcomes_rank":13,
            "factors_z":-0.57,
            "factors_rank":17,
            "length_of_life_z":-0.50,
            "length_of_life_rank":22,
            "quality_of_life_z":-0.39,
            "quality_of_life_rank":21,
            "health_behaviors_z":-0.14,
            "health_behaviors_rank":27,
            "clinical_care_z":-0.14,
            "clinical_care_rank":23,
            "social_and_economic_factors_z":-0.33,
            "social_and_economic_factors_rank":20,
            "physical_environment_z":0.04,
            "physical_environment_rank":128
          },
          {
            "name":"Houston",
            "code":"ho",
            "outcomes_z":-0.77,
            "outcomes_rank":22,
            "factors_z":-0.46,
            "factors_rank":25,
            "length_of_life_z":-0.35,
            "length_of_life_rank":36,
            "quality_of_life_z":-0.42,
            "quality_of_life_rank":17,
            "health_behaviors_z":-0.09,
            "health_behaviors_rank":40,
            "clinical_care_z":-0.05,
            "clinical_care_rank":50,
            "social_and_economic_factors_z":-0.33,
            "social_and_economic_factors_rank":19,
            "physical_environment_z":0.01,
            "physical_environment_rank":92
          },
          {
            "name":"Irwin",
            "code":"ir",
            "outcomes_z":0.56,
            "outcomes_rank":134,
            "factors_z":0.12,
            "factors_rank":86,
            "length_of_life_z":0.30,
            "length_of_life_rank":114,
            "quality_of_life_z":0.26,
            "quality_of_life_rank":127,
            "health_behaviors_z":0.02,
            "health_behaviors_rank":82,
            "clinical_care_z":0.03,
            "clinical_care_rank":98,
            "social_and_economic_factors_z":0.15,
            "social_and_economic_factors_rank":109,
            "physical_environment_z":-0.09,
            "physical_environment_rank":4
          },
          {
            "name":"Jackson",
            "code":"ja",
            "outcomes_z":-0.42,
            "outcomes_rank":42,
            "factors_z":-0.49,
            "factors_rank":22,
            "length_of_life_z":-0.26,
            "length_of_life_rank":51,
            "quality_of_life_z":-0.16,
            "quality_of_life_rank":51,
            "health_behaviors_z":-0.12,
            "health_behaviors_rank":31,
            "clinical_care_z":-0.05,
            "clinical_care_rank":52,
            "social_and_economic_factors_z":-0.33,
            "social_and_economic_factors_rank":21,
            "physical_environment_z":0.02,
            "physical_environment_rank":95
          },
          {
            "name":"Jasper",
            "code":"js",
            "outcomes_z":-0.18,
            "outcomes_rank":64,
            "factors_z":-0.12,
            "factors_rank":50,
            "length_of_life_z":-0.10,
            "length_of_life_rank":71,
            "quality_of_life_z":-0.07,
            "quality_of_life_rank":68,
            "health_behaviors_z":-0.05,
            "health_behaviors_rank":54,
            "clinical_care_z":-0.01,
            "clinical_care_rank":72,
            "social_and_economic_factors_z":-0.09,
            "social_and_economic_factors_rank":56,
            "physical_environment_z":0.03,
            "physical_environment_rank":125
          },
          {
            "name":"Jeff Davis",
            "code":"jd",
            "outcomes_z":0.73,
            "outcomes_rank":143,
            "factors_z":0.48,
            "factors_rank":143,
            "length_of_life_z":0.52,
            "length_of_life_rank":143,
            "quality_of_life_z":0.21,
            "quality_of_life_rank":118,
            "health_behaviors_z":-0.02,
            "health_behaviors_rank":64,
            "clinical_care_z":0.32,
            "clinical_care_rank":157,
            "social_and_economic_factors_z":0.25,
            "social_and_economic_factors_rank":133,
            "physical_environment_z":-0.06,
            "physical_environment_rank":20
          },
          {
            "name":"Jefferson",
            "code":"je",
            "outcomes_z":0.49,
            "outcomes_rank":128,
            "factors_z":0.40,
            "factors_rank":133,
            "length_of_life_z":0.24,
            "length_of_life_rank":108,
            "quality_of_life_z":0.24,
            "quality_of_life_rank":123,
            "health_behaviors_z":0.10,
            "health_behaviors_rank":118,
            "clinical_care_z":-0.00,
            "clinical_care_rank":80,
            "social_and_economic_factors_z":0.32,
            "social_and_economic_factors_rank":146,
            "physical_environment_z":-0.01,
            "physical_environment_rank":63
          },
          {
            "name":"Jenkins",
            "code":"jk",
            "outcomes_z":0.73,
            "outcomes_rank":142,
            "factors_z":0.69,
            "factors_rank":155,
            "length_of_life_z":0.64,
            "length_of_life_rank":149,
            "quality_of_life_z":0.09,
            "quality_of_life_rank":100,
            "health_behaviors_z":0.05,
            "health_behaviors_rank":97,
            "clinical_care_z":0.10,
            "clinical_care_rank":134,
            "social_and_economic_factors_z":0.55,
            "social_and_economic_factors_rank":159,
            "physical_environment_z":-0.02,
            "physical_environment_rank":61
          },
          {
            "name":"Johnson",
            "code":"jo",
            "outcomes_z":0.39,
            "outcomes_rank":117,
            "factors_z":0.16,
            "factors_rank":96,
            "length_of_life_z":-0.01,
            "length_of_life_rank":81,
            "quality_of_life_z":0.41,
            "quality_of_life_rank":143,
            "health_behaviors_z":-0.04,
            "health_behaviors_rank":59,
            "clinical_care_z":-0.01,
            "clinical_care_rank":79,
            "social_and_economic_factors_z":0.18,
            "social_and_economic_factors_rank":122,
            "physical_environment_z":0.03,
            "physical_environment_rank":115
          },
          {
            "name":"Jones",
            "code":"jn",
            "outcomes_z":-0.37,
            "outcomes_rank":49,
            "factors_z":-0.39,
            "factors_rank":31,
            "length_of_life_z":-0.57,
            "length_of_life_rank":18,
            "quality_of_life_z":0.20,
            "quality_of_life_rank":116,
            "health_behaviors_z":-0.01,
            "health_behaviors_rank":71,
            "clinical_care_z":-0.10,
            "clinical_care_rank":30,
            "social_and_economic_factors_z":-0.31,
            "social_and_economic_factors_rank":22,
            "physical_environment_z":0.02,
            "physical_environment_rank":110
          },
          {
            "name":"Lamar",
            "code":"la",
            "outcomes_z":0.45,
            "outcomes_rank":124,
            "factors_z":0.01,
            "factors_rank":76,
            "length_of_life_z":0.35,
            "length_of_life_rank":125,
            "quality_of_life_z":0.10,
            "quality_of_life_rank":102,
            "health_behaviors_z":0.02,
            "health_behaviors_rank":80,
            "clinical_care_z":-0.03,
            "clinical_care_rank":62,
            "social_and_economic_factors_z":0.01,
            "social_and_economic_factors_rank":72,
            "physical_environment_z":0.02,
            "physical_environment_rank":96
          },
          {
            "name":"Lanier",
            "code":"ln",
            "outcomes_z":0.27,
            "outcomes_rank":102,
            "factors_z":0.15,
            "factors_rank":94,
            "length_of_life_z":0.19,
            "length_of_life_rank":103,
            "quality_of_life_z":0.09,
            "quality_of_life_rank":99,
            "health_behaviors_z":-0.04,
            "health_behaviors_rank":61,
            "clinical_care_z":0.35,
            "clinical_care_rank":158,
            "social_and_economic_factors_z":-0.10,
            "social_and_economic_factors_rank":50,
            "physical_environment_z":-0.05,
            "physical_environment_rank":23
          },
          {
            "name":"Laurens",
            "code":"lu",
            "outcomes_z":0.11,
            "outcomes_rank":80,
            "factors_z":0.11,
            "factors_rank":84,
            "length_of_life_z":0.08,
            "length_of_life_rank":91,
            "quality_of_life_z":0.04,
            "quality_of_life_rank":89,
            "health_behaviors_z":0.08,
            "health_behaviors_rank":110,
            "clinical_care_z":-0.20,
            "clinical_care_rank":4,
            "social_and_economic_factors_z":0.25,
            "social_and_economic_factors_rank":134,
            "physical_environment_z":-0.02,
            "physical_environment_rank":56
          },
          {
            "name":"Lee",
            "code":"le",
            "outcomes_z":-0.78,
            "outcomes_rank":21,
            "factors_z":-0.58,
            "factors_rank":16,
            "length_of_life_z":-0.43,
            "length_of_life_rank":29,
            "quality_of_life_z":-0.35,
            "quality_of_life_rank":25,
            "health_behaviors_z":-0.08,
            "health_behaviors_rank":44,
            "clinical_care_z":-0.05,
            "clinical_care_rank":53,
            "social_and_economic_factors_z":-0.38,
            "social_and_economic_factors_rank":15,
            "physical_environment_z":-0.07,
            "physical_environment_rank":11
          },
          {
            "name":"Liberty",
            "code":"li",
            "outcomes_z":-0.40,
            "outcomes_rank":45,
            "factors_z":0.01,
            "factors_rank":75,
            "length_of_life_z":-0.33,
            "length_of_life_rank":38,
            "quality_of_life_z":-0.07,
            "quality_of_life_rank":70,
            "health_behaviors_z":0.19,
            "health_behaviors_rank":148,
            "clinical_care_z":-0.06,
            "clinical_care_rank":44,
            "social_and_economic_factors_z":-0.10,
            "social_and_economic_factors_rank":49,
            "physical_environment_z":-0.02,
            "physical_environment_rank":54
          },
          {
            "name":"Lincoln",
            "code":"lc",
            "outcomes_z":-0.36,
            "outcomes_rank":50,
            "factors_z":0.55,
            "factors_rank":150,
            "length_of_life_z":0.11,
            "length_of_life_rank":93,
            "quality_of_life_z":-0.47,
            "quality_of_life_rank":11,
            "health_behaviors_z":0.37,
            "health_behaviors_rank":159,
            "clinical_care_z":0.11,
            "clinical_care_rank":137,
            "social_and_economic_factors_z":0.04,
            "social_and_economic_factors_rank":83,
            "physical_environment_z":0.03,
            "physical_environment_rank":121
          },
          {
            "name":"Long",
            "code":"lo",
            "outcomes_z":-0.61,
            "outcomes_rank":34,
            "factors_z":-0.00,
            "factors_rank":71,
            "length_of_life_z":-0.37,
            "length_of_life_rank":34,
            "quality_of_life_z":-0.24,
            "quality_of_life_rank":33,
            "health_behaviors_z":-0.00,
            "health_behaviors_rank":72,
            "clinical_care_z":0.17,
            "clinical_care_rank":149,
            "social_and_economic_factors_z":-0.17,
            "social_and_economic_factors_rank":39,
            "physical_environment_z":-0.01,
            "physical_environment_rank":70
          },
          {
            "name":"Lowndes",
            "code":"lw",
            "outcomes_z":0.08,
            "outcomes_rank":77,
            "factors_z":-0.00,
            "factors_rank":72,
            "length_of_life_z":0.04,
            "length_of_life_rank":86,
            "quality_of_life_z":0.04,
            "quality_of_life_rank":90,
            "health_behaviors_z":0.13,
            "health_behaviors_rank":128,
            "clinical_care_z":-0.04,
            "clinical_care_rank":57,
            "social_and_economic_factors_z":-0.12,
            "social_and_economic_factors_rank":46,
            "physical_environment_z":0.02,
            "physical_environment_rank":99
          },
          {
            "name":"Lumpkin",
            "code":"lp",
            "outcomes_z":-1.09,
            "outcomes_rank":9,
            "factors_z":-0.35,
            "factors_rank":34,
            "length_of_life_z":-0.34,
            "length_of_life_rank":37,
            "quality_of_life_z":-0.75,
            "quality_of_life_rank":2,
            "health_behaviors_z":-0.16,
            "health_behaviors_rank":23,
            "clinical_care_z":-0.00,
            "clinical_care_rank":83,
            "social_and_economic_factors_z":-0.24,
            "social_and_economic_factors_rank":32,
            "physical_environment_z":0.05,
            "physical_environment_rank":138
          },
          {
            "name":"McDuffie",
            "code":"mc",
            "outcomes_z":1.33,
            "outcomes_rank":152,
            "factors_z":0.15,
            "factors_rank":93,
            "length_of_life_z":1.01,
            "length_of_life_rank":155,
            "quality_of_life_z":0.33,
            "quality_of_life_rank":136,
            "health_behaviors_z":0.14,
            "health_behaviors_rank":129,
            "clinical_care_z":-0.06,
            "clinical_care_rank":46,
            "social_and_economic_factors_z":0.08,
            "social_and_economic_factors_rank":94,
            "physical_environment_z":-0.01,
            "physical_environment_rank":72
          },
          {
            "name":"McIntosh",
            "code":"mi",
            "outcomes_z":-0.32,
            "outcomes_rank":56,
            "factors_z":0.12,
            "factors_rank":89,
            "length_of_life_z":-0.31,
            "length_of_life_rank":41,
            "quality_of_life_z":-0.01,
            "quality_of_life_rank":78,
            "health_behaviors_z":0.11,
            "health_behaviors_rank":125,
            "clinical_care_z":-0.02,
            "clinical_care_rank":69,
            "social_and_economic_factors_z":0.04,
            "social_and_economic_factors_rank":84,
            "physical_environment_z":-0.01,
            "physical_environment_rank":64
          },
          {
            "name":"Macon",
            "code":"ma",
            "outcomes_z":0.40,
            "outcomes_rank":120,
            "factors_z":0.84,
            "factors_rank":158,
            "length_of_life_z":0.15,
            "length_of_life_rank":97,
            "quality_of_life_z":0.25,
            "quality_of_life_rank":125,
            "health_behaviors_z":0.31,
            "health_behaviors_rank":157,
            "clinical_care_z":0.09,
            "clinical_care_rank":131,
            "social_and_economic_factors_z":0.45,
            "social_and_economic_factors_rank":155,
            "physical_environment_z":-0.02,
            "physical_environment_rank":55
          },
          {
            "name":"Madison",
            "code":"md",
            "outcomes_z":0.36,
            "outcomes_rank":113,
            "factors_z":-0.12,
            "factors_rank":52,
            "length_of_life_z":0.28,
            "length_of_life_rank":109,
            "quality_of_life_z":0.08,
            "quality_of_life_rank":97,
            "health_behaviors_z":0.00,
            "health_behaviors_rank":73,
            "clinical_care_z":0.03,
            "clinical_care_rank":99,
            "social_and_economic_factors_z":-0.16,
            "social_and_economic_factors_rank":41,
            "physical_environment_z":0.01,
            "physical_environment_rank":87
          },
          {
            "name":"Marion",
            "code":"mr",
            "outcomes_z":0.35,
            "outcomes_rank":108,
            "factors_z":0.13,
            "factors_rank":90,
            "length_of_life_z":-0.08,
            "length_of_life_rank":73,
            "quality_of_life_z":0.42,
            "quality_of_life_rank":146,
            "health_behaviors_z":0.10,
            "health_behaviors_rank":117,
            "clinical_care_z":0.03,
            "clinical_care_rank":104,
            "social_and_economic_factors_z":0.01,
            "social_and_economic_factors_rank":74,
            "physical_environment_z":-0.02,
            "physical_environment_rank":60
          },
          {
            "name":"Meriwether",
            "code":"me",
            "outcomes_z":0.08,
            "outcomes_rank":78,
            "factors_z":0.21,
            "factors_rank":102,
            "length_of_life_z":0.16,
            "length_of_life_rank":99,
            "quality_of_life_z":-0.08,
            "quality_of_life_rank":65,
            "health_behaviors_z":-0.04,
            "health_behaviors_rank":58,
            "clinical_care_z":0.02,
            "clinical_care_rank":95,
            "social_and_economic_factors_z":0.15,
            "social_and_economic_factors_rank":107,
            "physical_environment_z":0.08,
            "physical_environment_rank":151
          },
          {
            "name":"Miller",
            "code":"ml",
            "outcomes_z":0.17,
            "outcomes_rank":91,
            "factors_z":-0.11,
            "factors_rank":55,
            "length_of_life_z":0.61,
            "length_of_life_rank":147,
            "quality_of_life_z":-0.44,
            "quality_of_life_rank":15,
            "health_behaviors_z":0.09,
            "health_behaviors_rank":115,
            "clinical_care_z":0.08,
            "clinical_care_rank":125,
            "social_and_economic_factors_z":-0.21,
            "social_and_economic_factors_rank":35,
            "physical_environment_z":-0.07,
            "physical_environment_rank":13
          },
          {
            "name":"Mitchell",
            "code":"mt",
            "outcomes_z":0.32,
            "outcomes_rank":106,
            "factors_z":0.07,
            "factors_rank":80,
            "length_of_life_z":0.32,
            "length_of_life_rank":118,
            "quality_of_life_z":0.01,
            "quality_of_life_rank":81,
            "health_behaviors_z":0.03,
            "health_behaviors_rank":85,
            "clinical_care_z":-0.04,
            "clinical_care_rank":59,
            "social_and_economic_factors_z":0.16,
            "social_and_economic_factors_rank":111,
            "physical_environment_z":-0.09,
            "physical_environment_rank":5
          },
          {
            "name":"Monroe",
            "code":"mo",
            "outcomes_z":-0.59,
            "outcomes_rank":36,
            "factors_z":-0.40,
            "factors_rank":30,
            "length_of_life_z":-0.44,
            "length_of_life_rank":27,
            "quality_of_life_z":-0.15,
            "quality_of_life_rank":52,
            "health_behaviors_z":0.06,
            "health_behaviors_rank":103,
            "clinical_care_z":-0.14,
            "clinical_care_rank":22,
            "social_and_economic_factors_z":-0.33,
            "social_and_economic_factors_rank":18,
            "physical_environment_z":0.02,
            "physical_environment_rank":97
          },
          {
            "name":"Montgomery",
            "code":"mg",
            "outcomes_z":-0.08,
            "outcomes_rank":65,
            "factors_z":0.19,
            "factors_rank":99,
            "length_of_life_z":-0.06,
            "length_of_life_rank":77,
            "quality_of_life_z":-0.02,
            "quality_of_life_rank":75,
            "health_behaviors_z":0.05,
            "health_behaviors_rank":93,
            "clinical_care_z":0.00,
            "clinical_care_rank":86,
            "social_and_economic_factors_z":0.17,
            "social_and_economic_factors_rank":117,
            "physical_environment_z":-0.03,
            "physical_environment_rank":44
          },
          {
            "name":"Morgan",
            "code":"mn",
            "outcomes_z":-0.70,
            "outcomes_rank":24,
            "factors_z":-0.63,
            "factors_rank":13,
            "length_of_life_z":-0.44,
            "length_of_life_rank":28,
            "quality_of_life_z":-0.26,
            "quality_of_life_rank":32,
            "health_behaviors_z":-0.17,
            "health_behaviors_rank":20,
            "clinical_care_z":-0.12,
            "clinical_care_rank":27,
            "social_and_economic_factors_z":-0.38,
            "social_and_economic_factors_rank":13,
            "physical_environment_z":0.04,
            "physical_environment_rank":132
          },
          {
            "name":"Murray",
            "code":"mu",
            "outcomes_z":0.14,
            "outcomes_rank":85,
            "factors_z":0.33,
            "factors_rank":122,
            "length_of_life_z":-0.06,
            "length_of_life_rank":76,
            "quality_of_life_z":0.20,
            "quality_of_life_rank":117,
            "health_behaviors_z":0.02,
            "health_behaviors_rank":79,
            "clinical_care_z":0.09,
            "clinical_care_rank":127,
            "social_and_economic_factors_z":0.16,
            "social_and_economic_factors_rank":115,
            "physical_environment_z":0.06,
            "physical_environment_rank":145
          },
          {
            "name":"Muscogee",
            "code":"ms",
            "outcomes_z":0.36,
            "outcomes_rank":114,
            "factors_z":-0.10,
            "factors_rank":58,
            "length_of_life_z":0.34,
            "length_of_life_rank":123,
            "quality_of_life_z":0.02,
            "quality_of_life_rank":85,
            "health_behaviors_z":0.20,
            "health_behaviors_rank":149,
            "clinical_care_z":-0.19,
            "clinical_care_rank":6,
            "social_and_economic_factors_z":-0.08,
            "social_and_economic_factors_rank":57,
            "physical_environment_z":-0.03,
            "physical_environment_rank":40
          },
          {
            "name":"Newton",
            "code":"ne",
            "outcomes_z":-0.62,
            "outcomes_rank":32,
            "factors_z":-0.13,
            "factors_rank":49,
            "length_of_life_z":-0.33,
            "length_of_life_rank":40,
            "quality_of_life_z":-0.29,
            "quality_of_life_rank":30,
            "health_behaviors_z":-0.02,
            "health_behaviors_rank":67,
            "clinical_care_z":-0.04,
            "clinical_care_rank":55,
            "social_and_economic_factors_z":-0.12,
            "social_and_economic_factors_rank":45,
            "physical_environment_z":0.05,
            "physical_environment_rank":139
          },
          {
            "name":"Oconee",
            "code":"oc",
            "outcomes_z":-1.63,
            "outcomes_rank":3,
            "factors_z":-1.54,
            "factors_rank":1,
            "length_of_life_z":-1.12,
            "length_of_life_rank":2,
            "quality_of_life_z":-0.51,
            "quality_of_life_rank":10,
            "health_behaviors_z":-0.42,
            "health_behaviors_rank":2,
            "clinical_care_z":-0.27,
            "clinical_care_rank":2,
            "social_and_economic_factors_z":-0.83,
            "social_and_economic_factors_rank":1,
            "physical_environment_z":-0.02,
            "physical_environment_rank":51
          },
          {
            "name":"Oglethorpe",
            "code":"og",
            "outcomes_z":-0.80,
            "outcomes_rank":20,
            "factors_z":-0.38,
            "factors_rank":33,
            "length_of_life_z":-0.61,
            "length_of_life_rank":15,
            "quality_of_life_z":-0.19,
            "quality_of_life_rank":41,
            "health_behaviors_z":-0.05,
            "health_behaviors_rank":57,
            "clinical_care_z":0.00,
            "clinical_care_rank":84,
            "social_and_economic_factors_z":-0.30,
            "social_and_economic_factors_rank":23,
            "physical_environment_z":-0.03,
            "physical_environment_rank":45
          },
          {
            "name":"Paulding",
            "code":"pd",
            "outcomes_z":-0.85,
            "outcomes_rank":17,
            "factors_z":-0.61,
            "factors_rank":14,
            "length_of_life_z":-0.67,
            "length_of_life_rank":10,
            "quality_of_life_z":-0.18,
            "quality_of_life_rank":49,
            "health_behaviors_z":-0.26,
            "health_behaviors_rank":12,
            "clinical_care_z":0.02,
            "clinical_care_rank":93,
            "social_and_economic_factors_z":-0.40,
            "social_and_economic_factors_rank":11,
            "physical_environment_z":0.04,
            "physical_environment_rank":131
          },
          {
            "name":"Peach",
            "code":"pa",
            "outcomes_z":0.23,
            "outcomes_rank":98,
            "factors_z":0.27,
            "factors_rank":114,
            "length_of_life_z":0.22,
            "length_of_life_rank":106,
            "quality_of_life_z":0.01,
            "quality_of_life_rank":83,
            "health_behaviors_z":0.07,
            "health_behaviors_rank":105,
            "clinical_care_z":0.05,
            "clinical_care_rank":114,
            "social_and_economic_factors_z":0.16,
            "social_and_economic_factors_rank":112,
            "physical_environment_z":-0.01,
            "physical_environment_rank":73
          },
          {
            "name":"Pickens",
            "code":"pc",
            "outcomes_z":-0.63,
            "outcomes_rank":31,
            "factors_z":-0.44,
            "factors_rank":28,
            "length_of_life_z":-0.20,
            "length_of_life_rank":58,
            "quality_of_life_z":-0.43,
            "quality_of_life_rank":16,
            "health_behaviors_z":-0.12,
            "health_behaviors_rank":34,
            "clinical_care_z":-0.08,
            "clinical_care_rank":40,
            "social_and_economic_factors_z":-0.27,
            "social_and_economic_factors_rank":26,
            "physical_environment_z":0.03,
            "physical_environment_rank":114
          },
          {
            "name":"Pierce",
            "code":"pe",
            "outcomes_z":0.36,
            "outcomes_rank":111,
            "factors_z":-0.15,
            "factors_rank":46,
            "length_of_life_z":0.47,
            "length_of_life_rank":139,
            "quality_of_life_z":-0.11,
            "quality_of_life_rank":56,
            "health_behaviors_z":-0.08,
            "health_behaviors_rank":45,
            "clinical_care_z":0.09,
            "clinical_care_rank":129,
            "social_and_economic_factors_z":-0.16,
            "social_and_economic_factors_rank":40,
            "physical_environment_z":-0.00,
            "physical_environment_rank":78
          },
          {
            "name":"Pike",
            "code":"pi",
            "outcomes_z":-0.38,
            "outcomes_rank":46,
            "factors_z":-0.34,
            "factors_rank":35,
            "length_of_life_z":-0.20,
            "length_of_life_rank":59,
            "quality_of_life_z":-0.18,
            "quality_of_life_rank":47,
            "health_behaviors_z":-0.06,
            "health_behaviors_rank":51,
            "clinical_care_z":0.06,
            "clinical_care_rank":118,
            "social_and_economic_factors_z":-0.38,
            "social_and_economic_factors_rank":16,
            "physical_environment_z":0.03,
            "physical_environment_rank":113
          },
          {
            "name":"Polk",
            "code":"po",
            "outcomes_z":0.64,
            "outcomes_rank":136,
            "factors_z":0.06,
            "factors_rank":78,
            "length_of_life_z":0.33,
            "length_of_life_rank":121,
            "quality_of_life_z":0.31,
            "quality_of_life_rank":134,
            "health_behaviors_z":-0.04,
            "health_behaviors_rank":60,
            "clinical_care_z":0.01,
            "clinical_care_rank":89,
            "social_and_economic_factors_z":0.01,
            "social_and_economic_factors_rank":75,
            "physical_environment_z":0.08,
            "physical_environment_rank":150
          },
          {
            "name":"Pulaski",
            "code":"pl",
            "outcomes_z":-0.46,
            "outcomes_rank":40,
            "factors_z":-0.14,
            "factors_rank":48,
            "length_of_life_z":-0.23,
            "length_of_life_rank":53,
            "quality_of_life_z":-0.23,
            "quality_of_life_rank":34,
            "health_behaviors_z":-0.08,
            "health_behaviors_rank":41,
            "clinical_care_z":-0.09,
            "clinical_care_rank":34,
            "social_and_economic_factors_z":0.06,
            "social_and_economic_factors_rank":89,
            "physical_environment_z":-0.03,
            "physical_environment_rank":48
          },
          {
            "name":"Putnam",
            "code":"pu",
            "outcomes_z":-0.34,
            "outcomes_rank":53,
            "factors_z":0.07,
            "factors_rank":81,
            "length_of_life_z":-0.27,
            "length_of_life_rank":49,
            "quality_of_life_z":-0.07,
            "quality_of_life_rank":69,
            "health_behaviors_z":-0.10,
            "health_behaviors_rank":38,
            "clinical_care_z":0.03,
            "clinical_care_rank":100,
            "social_and_economic_factors_z":0.14,
            "social_and_economic_factors_rank":105,
            "physical_environment_z":-0.01,
            "physical_environment_rank":62
          },
          {
            "name":"Quitman",
            "code":"qu",
            "outcomes_z":-0.03,
            "outcomes_rank":68,
            "factors_z":0.20,
            "factors_rank":101,
            "length_of_life_z":-0.50,
            "length_of_life_rank":23,
            "quality_of_life_z":0.47,
            "quality_of_life_rank":150,
            "health_behaviors_z":0.02,
            "health_behaviors_rank":81,
            "clinical_care_z":-0.02,
            "clinical_care_rank":68,
            "social_and_economic_factors_z":0.29,
            "social_and_economic_factors_rank":140,
            "physical_environment_z":-0.09,
            "physical_environment_rank":3
          },
          {
            "name":"Rabun",
            "code":"rb",
            "outcomes_z":0.06,
            "outcomes_rank":75,
            "factors_z":-0.05,
            "factors_rank":66,
            "length_of_life_z":0.47,
            "length_of_life_rank":138,
            "quality_of_life_z":-0.41,
            "quality_of_life_rank":18,
            "health_behaviors_z":-0.17,
            "health_behaviors_rank":22,
            "clinical_care_z":0.12,
            "clinical_care_rank":141,
            "social_and_economic_factors_z":-0.03,
            "social_and_economic_factors_rank":66,
            "physical_environment_z":0.02,
            "physical_environment_rank":106
          },
          {
            "name":"Randolph",
            "code":"ra",
            "outcomes_z":0.75,
            "outcomes_rank":144,
            "factors_z":0.40,
            "factors_rank":132,
            "length_of_life_z":0.30,
            "length_of_life_rank":115,
            "quality_of_life_z":0.45,
            "quality_of_life_rank":148,
            "health_behaviors_z":0.15,
            "health_behaviors_rank":135,
            "clinical_care_z":0.00,
            "clinical_care_rank":85,
            "social_and_economic_factors_z":0.32,
            "social_and_economic_factors_rank":145,
            "physical_environment_z":-0.07,
            "physical_environment_rank":9
          },
          {
            "name":"Richmond",
            "code":"ri",
            "outcomes_z":0.57,
            "outcomes_rank":135,
            "factors_z":0.29,
            "factors_rank":117,
            "length_of_life_z":0.57,
            "length_of_life_rank":146,
            "quality_of_life_z":-0.00,
            "quality_of_life_rank":79,
            "health_behaviors_z":0.16,
            "health_behaviors_rank":137,
            "clinical_care_z":-0.15,
            "clinical_care_rank":19,
            "social_and_economic_factors_z":0.29,
            "social_and_economic_factors_rank":139,
            "physical_environment_z":-0.01,
            "physical_environment_rank":65
          },
          {
            "name":"Rockdale",
            "code":"ro",
            "outcomes_z":-0.99,
            "outcomes_rank":11,
            "factors_z":-0.30,
            "factors_rank":38,
            "length_of_life_z":-0.64,
            "length_of_life_rank":13,
            "quality_of_life_z":-0.36,
            "quality_of_life_rank":23,
            "health_behaviors_z":-0.15,
            "health_behaviors_rank":26,
            "clinical_care_z":-0.10,
            "clinical_care_rank":33,
            "social_and_economic_factors_z":-0.09,
            "social_and_economic_factors_rank":53,
            "physical_environment_z":0.03,
            "physical_environment_rank":127
          },
          {
            "name":"Schley",
            "code":"sc",
            "outcomes_z":-0.26,
            "outcomes_rank":60,
            "factors_z":-0.07,
            "factors_rank":64,
            "length_of_life_z":-0.08,
            "length_of_life_rank":74,
            "quality_of_life_z":-0.19,
            "quality_of_life_rank":43,
            "health_behaviors_z":-0.06,
            "health_behaviors_rank":52,
            "clinical_care_z":0.07,
            "clinical_care_rank":120,
            "social_and_economic_factors_z":-0.05,
            "social_and_economic_factors_rank":59,
            "physical_environment_z":-0.03,
            "physical_environment_rank":42
          },
          {
            "name":"Screven",
            "code":"sr",
            "outcomes_z":0.20,
            "outcomes_rank":94,
            "factors_z":0.12,
            "factors_rank":88,
            "length_of_life_z":0.40,
            "length_of_life_rank":131,
            "quality_of_life_z":-0.20,
            "quality_of_life_rank":40,
            "health_behaviors_z":0.08,
            "health_behaviors_rank":113,
            "clinical_care_z":-0.00,
            "clinical_care_rank":81,
            "social_and_economic_factors_z":0.07,
            "social_and_economic_factors_rank":91,
            "physical_environment_z":-0.03,
            "physical_environment_rank":38
          },
          {
            "name":"Seminole",
            "code":"sm",
            "outcomes_z":0.27,
            "outcomes_rank":103,
            "factors_z":-0.01,
            "factors_rank":70,
            "length_of_life_z":0.39,
            "length_of_life_rank":130,
            "quality_of_life_z":-0.12,
            "quality_of_life_rank":55,
            "health_behaviors_z":-0.02,
            "health_behaviors_rank":68,
            "clinical_care_z":0.03,
            "clinical_care_rank":103,
            "social_and_economic_factors_z":0.01,
            "social_and_economic_factors_rank":73,
            "physical_environment_z":-0.03,
            "physical_environment_rank":36
          },
          {
            "name":"Spalding",
            "code":"sp",
            "outcomes_z":0.72,
            "outcomes_rank":141,
            "factors_z":0.21,
            "factors_rank":103,
            "length_of_life_z":0.33,
            "length_of_life_rank":122,
            "quality_of_life_z":0.38,
            "quality_of_life_rank":141,
            "health_behaviors_z":0.04,
            "health_behaviors_rank":90,
            "clinical_care_z":-0.02,
            "clinical_care_rank":64,
            "social_and_economic_factors_z":0.16,
            "social_and_economic_factors_rank":110,
            "physical_environment_z":0.04,
            "physical_environment_rank":133
          },
          {
            "name":"Stephens",
            "code":"se",
            "outcomes_z":0.12,
            "outcomes_rank":83,
            "factors_z":-0.19,
            "factors_rank":43,
            "length_of_life_z":0.06,
            "length_of_life_rank":90,
            "quality_of_life_z":0.06,
            "quality_of_life_rank":93,
            "health_behaviors_z":-0.10,
            "health_behaviors_rank":36,
            "clinical_care_z":-0.02,
            "clinical_care_rank":71,
            "social_and_economic_factors_z":-0.10,
            "social_and_economic_factors_rank":52,
            "physical_environment_z":0.03,
            "physical_environment_rank":117
          },
          {
            "name":"Stewart",
            "code":"st",
            "outcomes_z":1.39,
            "outcomes_rank":156,
            "factors_z":0.74,
            "factors_rank":156,
            "length_of_life_z":1.23,
            "length_of_life_rank":158,
            "quality_of_life_z":0.17,
            "quality_of_life_rank":109,
            "health_behaviors_z":0.15,
            "health_behaviors_rank":133,
            "clinical_care_z":0.20,
            "clinical_care_rank":151,
            "social_and_economic_factors_z":0.38,
            "social_and_economic_factors_rank":151,
            "physical_environment_z":0.01,
            "physical_environment_rank":91
          },
          {
            "name":"Sumter",
            "code":"su",
            "outcomes_z":-0.33,
            "outcomes_rank":55,
            "factors_z":0.48,
            "factors_rank":142,
            "length_of_life_z":-0.19,
            "length_of_life_rank":60,
            "quality_of_life_z":-0.13,
            "quality_of_life_rank":53,
            "health_behaviors_z":0.17,
            "health_behaviors_rank":142,
            "clinical_care_z":-0.07,
            "clinical_care_rank":42,
            "social_and_economic_factors_z":0.40,
            "social_and_economic_factors_rank":153,
            "physical_environment_z":-0.02,
            "physical_environment_rank":50
          },
          {
            "name":"Talbot",
            "code":"tb",
            "outcomes_z":0.90,
            "outcomes_rank":147,
            "factors_z":0.48,
            "factors_rank":141,
            "length_of_life_z":0.39,
            "length_of_life_rank":129,
            "quality_of_life_z":0.51,
            "quality_of_life_rank":151,
            "health_behaviors_z":0.14,
            "health_behaviors_rank":130,
            "clinical_care_z":0.09,
            "clinical_care_rank":130,
            "social_and_economic_factors_z":0.23,
            "social_and_economic_factors_rank":128,
            "physical_environment_z":0.02,
            "physical_environment_rank":101
          },
          {
            "name":"Taliaferro",
            "code":"ta",
            "outcomes_z":1.46,
            "outcomes_rank":158,
            "factors_z":0.59,
            "factors_rank":152,
            "length_of_life_z":1.06,
            "length_of_life_rank":156,
            "quality_of_life_z":0.40,
            "quality_of_life_rank":142,
            "health_behaviors_z":0.11,
            "health_behaviors_rank":123,
            "clinical_care_z":0.14,
            "clinical_care_rank":145,
            "social_and_economic_factors_z":0.30,
            "social_and_economic_factors_rank":142,
            "physical_environment_z":0.04,
            "physical_environment_rank":137
          },
          {
            "name":"Tattnall",
            "code":"tt",
            "outcomes_z":0.53,
            "outcomes_rank":130,
            "factors_z":0.51,
            "factors_rank":145,
            "length_of_life_z":0.28,
            "length_of_life_rank":110,
            "quality_of_life_z":0.24,
            "quality_of_life_rank":124,
            "health_behaviors_z":0.24,
            "health_behaviors_rank":154,
            "clinical_care_z":0.14,
            "clinical_care_rank":144,
            "social_and_economic_factors_z":0.15,
            "social_and_economic_factors_rank":108,
            "physical_environment_z":-0.03,
            "physical_environment_rank":46
          },
          {
            "name":"Taylor",
            "code":"ty",
            "outcomes_z":0.15,
            "outcomes_rank":86,
            "factors_z":0.37,
            "factors_rank":128,
            "length_of_life_z":-0.11,
            "length_of_life_rank":69,
            "quality_of_life_z":0.26,
            "quality_of_life_rank":126,
            "health_behaviors_z":0.06,
            "health_behaviors_rank":99,
            "clinical_care_z":0.04,
            "clinical_care_rank":105,
            "social_and_economic_factors_z":0.29,
            "social_and_economic_factors_rank":138,
            "physical_environment_z":-0.01,
            "physical_environment_rank":66
          },
          {
            "name":"Telfair",
            "code":"tf",
            "outcomes_z":0.01,
            "outcomes_rank":71,
            "factors_z":0.88,
            "factors_rank":159,
            "length_of_life_z":-0.23,
            "length_of_life_rank":55,
            "quality_of_life_z":0.23,
            "quality_of_life_rank":122,
            "health_behaviors_z":0.23,
            "health_behaviors_rank":153,
            "clinical_care_z":0.18,
            "clinical_care_rank":150,
            "social_and_economic_factors_z":0.49,
            "social_and_economic_factors_rank":158,
            "physical_environment_z":-0.03,
            "physical_environment_rank":47
          },
          {
            "name":"Terrell",
            "code":"tl",
            "outcomes_z":1.34,
            "outcomes_rank":153,
            "factors_z":0.34,
            "factors_rank":127,
            "length_of_life_z":0.74,
            "length_of_life_rank":152,
            "quality_of_life_z":0.60,
            "quality_of_life_rank":154,
            "health_behaviors_z":0.22,
            "health_behaviors_rank":152,
            "clinical_care_z":0.01,
            "clinical_care_rank":87,
            "social_and_economic_factors_z":0.13,
            "social_and_economic_factors_rank":102,
            "physical_environment_z":-0.02,
            "physical_environment_rank":59
          },
          {
            "name":"Thomas",
            "code":"th",
            "outcomes_z":0.18,
            "outcomes_rank":92,
            "factors_z":-0.21,
            "factors_rank":42,
            "length_of_life_z":0.15,
            "length_of_life_rank":98,
            "quality_of_life_z":0.02,
            "quality_of_life_rank":87,
            "health_behaviors_z":0.08,
            "health_behaviors_rank":111,
            "clinical_care_z":-0.18,
            "clinical_care_rank":8,
            "social_and_economic_factors_z":-0.05,
            "social_and_economic_factors_rank":62,
            "physical_environment_z":-0.06,
            "physical_environment_rank":15
          },
          {
            "name":"Tift",
            "code":"ti",
            "outcomes_z":0.00,
            "outcomes_rank":70,
            "factors_z":-0.08,
            "factors_rank":62,
            "length_of_life_z":0.02,
            "length_of_life_rank":84,
            "quality_of_life_z":-0.02,
            "quality_of_life_rank":74,
            "health_behaviors_z":-0.09,
            "health_behaviors_rank":39,
            "clinical_care_z":-0.02,
            "clinical_care_rank":70,
            "social_and_economic_factors_z":0.09,
            "social_and_economic_factors_rank":96,
            "physical_environment_z":-0.06,
            "physical_environment_rank":18
          },
          {
            "name":"Toombs",
            "code":"tm",
            "outcomes_z":0.03,
            "outcomes_rank":74,
            "factors_z":0.19,
            "factors_rank":98,
            "length_of_life_z":0.04,
            "length_of_life_rank":87,
            "quality_of_life_z":-0.02,
            "quality_of_life_rank":76,
            "health_behaviors_z":0.04,
            "health_behaviors_rank":89,
            "clinical_care_z":0.01,
            "clinical_care_rank":92,
            "social_and_economic_factors_z":0.17,
            "social_and_economic_factors_rank":118,
            "physical_environment_z":-0.03,
            "physical_environment_rank":43
          },
          {
            "name":"Towns",
            "code":"to",
            "outcomes_z":-0.70,
            "outcomes_rank":25,
            "factors_z":-0.60,
            "factors_rank":15,
            "length_of_life_z":-0.12,
            "length_of_life_rank":68,
            "quality_of_life_z":-0.58,
            "quality_of_life_rank":6,
            "health_behaviors_z":-0.24,
            "health_behaviors_rank":14,
            "clinical_care_z":-0.14,
            "clinical_care_rank":20,
            "social_and_economic_factors_z":-0.17,
            "social_and_economic_factors_rank":38,
            "physical_environment_z":-0.04,
            "physical_environment_rank":30
          },
          {
            "name":"Treutlen",
            "code":"te",
            "outcomes_z":0.27,
            "outcomes_rank":104,
            "factors_z":0.46,
            "factors_rank":139,
            "length_of_life_z":0.36,
            "length_of_life_rank":126,
            "quality_of_life_z":-0.08,
            "quality_of_life_rank":63,
            "health_behaviors_z":0.13,
            "health_behaviors_rank":126,
            "clinical_care_z":-0.04,
            "clinical_care_rank":58,
            "social_and_economic_factors_z":0.30,
            "social_and_economic_factors_rank":143,
            "physical_environment_z":0.06,
            "physical_environment_rank":148
          },
          {
            "name":"Troup",
            "code":"tr",
            "outcomes_z":0.15,
            "outcomes_rank":87,
            "factors_z":-0.11,
            "factors_rank":56,
            "length_of_life_z":0.18,
            "length_of_life_rank":102,
            "quality_of_life_z":-0.03,
            "quality_of_life_rank":73,
            "health_behaviors_z":-0.13,
            "health_behaviors_rank":29,
            "clinical_care_z":-0.02,
            "clinical_care_rank":65,
            "social_and_economic_factors_z":0.02,
            "social_and_economic_factors_rank":76,
            "physical_environment_z":0.02,
            "physical_environment_rank":105
          },
          {
            "name":"Turner",
            "code":"tu",
            "outcomes_z":1.38,
            "outcomes_rank":155,
            "factors_z":0.14,
            "factors_rank":92,
            "length_of_life_z":0.68,
            "length_of_life_rank":151,
            "quality_of_life_z":0.71,
            "quality_of_life_rank":157,
            "health_behaviors_z":0.06,
            "health_behaviors_rank":100,
            "clinical_care_z":-0.02,
            "clinical_care_rank":67,
            "social_and_economic_factors_z":0.14,
            "social_and_economic_factors_rank":103,
            "physical_environment_z":-0.03,
            "physical_environment_rank":41
          },
          {
            "name":"Twiggs",
            "code":"tw",
            "outcomes_z":0.54,
            "outcomes_rank":133,
            "factors_z":0.30,
            "factors_rank":118,
            "length_of_life_z":0.02,
            "length_of_life_rank":83,
            "quality_of_life_z":0.52,
            "quality_of_life_rank":152,
            "health_behaviors_z":0.04,
            "health_behaviors_rank":91,
            "clinical_care_z":-0.01,
            "clinical_care_rank":73,
            "social_and_economic_factors_z":0.25,
            "social_and_economic_factors_rank":135,
            "physical_environment_z":0.01,
            "physical_environment_rank":94
          },
          {
            "name":"Union",
            "code":"un",
            "outcomes_z":-0.88,
            "outcomes_rank":14,
            "factors_z":-0.54,
            "factors_rank":18,
            "length_of_life_z":-0.35,
            "length_of_life_rank":35,
            "quality_of_life_z":-0.53,
            "quality_of_life_rank":9,
            "health_behaviors_z":-0.33,
            "health_behaviors_rank":5,
            "clinical_care_z":-0.16,
            "clinical_care_rank":13,
            "social_and_economic_factors_z":-0.08,
            "social_and_economic_factors_rank":58,
            "physical_environment_z":0.03,
            "physical_environment_rank":123
          },
          {
            "name":"Upson",
            "code":"up",
            "outcomes_z":0.43,
            "outcomes_rank":121,
            "factors_z":0.25,
            "factors_rank":112,
            "length_of_life_z":0.34,
            "length_of_life_rank":124,
            "quality_of_life_z":0.08,
            "quality_of_life_rank":98,
            "health_behaviors_z":0.14,
            "health_behaviors_rank":132,
            "clinical_care_z":0.03,
            "clinical_care_rank":102,
            "social_and_economic_factors_z":0.09,
            "social_and_economic_factors_rank":95,
            "physical_environment_z":-0.01,
            "physical_environment_rank":67
          },
          {
            "name":"Walker",
            "code":"wk",
            "outcomes_z":0.39,
            "outcomes_rank":116,
            "factors_z":-0.14,
            "factors_rank":47,
            "length_of_life_z":0.12,
            "length_of_life_rank":94,
            "quality_of_life_z":0.27,
            "quality_of_life_rank":128,
            "health_behaviors_z":0.05,
            "health_behaviors_rank":95,
            "clinical_care_z":-0.01,
            "clinical_care_rank":74,
            "social_and_economic_factors_z":-0.20,
            "social_and_economic_factors_rank":37,
            "physical_environment_z":0.02,
            "physical_environment_rank":98
          },
          {
            "name":"Walton",
            "code":"wn",
            "outcomes_z":-0.63,
            "outcomes_rank":30,
            "factors_z":-0.42,
            "factors_rank":29,
            "length_of_life_z":-0.18,
            "length_of_life_rank":62,
            "quality_of_life_z":-0.45,
            "quality_of_life_rank":13,
            "health_behaviors_z":-0.18,
            "health_behaviors_rank":18,
            "clinical_care_z":-0.05,
            "clinical_care_rank":51,
            "social_and_economic_factors_z":-0.29,
            "social_and_economic_factors_rank":24,
            "physical_environment_z":0.10,
            "physical_environment_rank":155
          },
          {
            "name":"Ware",
            "code":"wa",
            "outcomes_z":0.25,
            "outcomes_rank":99,
            "factors_z":0.23,
            "factors_rank":108,
            "length_of_life_z":0.23,
            "length_of_life_rank":107,
            "quality_of_life_z":0.02,
            "quality_of_life_rank":88,
            "health_behaviors_z":0.17,
            "health_behaviors_rank":139,
            "clinical_care_z":-0.01,
            "clinical_care_rank":75,
            "social_and_economic_factors_z":0.14,
            "social_and_economic_factors_rank":104,
            "physical_environment_z":-0.06,
            "physical_environment_rank":16
          },
          {
            "name":"Warren",
            "code":"wr",
            "outcomes_z":1.41,
            "outcomes_rank":157,
            "factors_z":0.51,
            "factors_rank":146,
            "length_of_life_z":0.66,
            "length_of_life_rank":150,
            "quality_of_life_z":0.75,
            "quality_of_life_rank":159,
            "health_behaviors_z":0.18,
            "health_behaviors_rank":144,
            "clinical_care_z":-0.13,
            "clinical_care_rank":25,
            "social_and_economic_factors_z":0.47,
            "social_and_economic_factors_rank":156,
            "physical_environment_z":-0.01,
            "physical_environment_rank":71
          },
          {
            "name":"Washington",
            "code":"wg",
            "outcomes_z":0.65,
            "outcomes_rank":138,
            "factors_z":0.22,
            "factors_rank":106,
            "length_of_life_z":0.32,
            "length_of_life_rank":119,
            "quality_of_life_z":0.33,
            "quality_of_life_rank":137,
            "health_behaviors_z":0.22,
            "health_behaviors_rank":151,
            "clinical_care_z":-0.10,
            "clinical_care_rank":29,
            "social_and_economic_factors_z":0.12,
            "social_and_economic_factors_rank":100,
            "physical_environment_z":-0.01,
            "physical_environment_rank":74
          },
          {
            "name":"Wayne",
            "code":"wy",
            "outcomes_z":0.49,
            "outcomes_rank":127,
            "factors_z":0.45,
            "factors_rank":137,
            "length_of_life_z":0.31,
            "length_of_life_rank":117,
            "quality_of_life_z":0.17,
            "quality_of_life_rank":111,
            "health_behaviors_z":0.16,
            "health_behaviors_rank":138,
            "clinical_care_z":0.11,
            "clinical_care_rank":136,
            "social_and_economic_factors_z":0.22,
            "social_and_economic_factors_rank":127,
            "physical_environment_z":-0.04,
            "physical_environment_rank":31
          },
          {
            "name":"Webster",
            "code":"ws",
            "outcomes_z":-0.07,
            "outcomes_rank":66,
            "factors_z":-0.12,
            "factors_rank":51,
            "length_of_life_z":-0.67,
            "length_of_life_rank":11,
            "quality_of_life_z":0.60,
            "quality_of_life_rank":155,
            "health_behaviors_z":-0.08,
            "health_behaviors_rank":42,
            "clinical_care_z":0.11,
            "clinical_care_rank":135,
            "social_and_economic_factors_z":-0.09,
            "social_and_economic_factors_rank":54,
            "physical_environment_z":-0.04,
            "physical_environment_rank":29
          },
          {
            "name":"Wheeler",
            "code":"we",
            "outcomes_z":-0.06,
            "outcomes_rank":67,
            "factors_z":0.33,
            "factors_rank":123,
            "length_of_life_z":-0.19,
            "length_of_life_rank":61,
            "quality_of_life_z":0.13,
            "quality_of_life_rank":104,
            "health_behaviors_z":0.11,
            "health_behaviors_rank":124,
            "clinical_care_z":0.05,
            "clinical_care_rank":113,
            "social_and_economic_factors_z":0.23,
            "social_and_economic_factors_rank":129,
            "physical_environment_z":-0.07,
            "physical_environment_rank":10
          },
          {
            "name":"White",
            "code":"wt",
            "outcomes_z":-0.34,
            "outcomes_rank":51,
            "factors_z":-0.47,
            "factors_rank":24,
            "length_of_life_z":-0.27,
            "length_of_life_rank":47,
            "quality_of_life_z":-0.08,
            "quality_of_life_rank":66,
            "health_behaviors_z":-0.23,
            "health_behaviors_rank":15,
            "clinical_care_z":-0.05,
            "clinical_care_rank":48,
            "social_and_economic_factors_z":-0.22,
            "social_and_economic_factors_rank":33,
            "physical_environment_z":0.04,
            "physical_environment_rank":134
          },
          {
            "name":"Whitfield",
            "code":"wh",
            "outcomes_z":-0.59,
            "outcomes_rank":37,
            "factors_z":0.06,
            "factors_rank":79,
            "length_of_life_z":-0.40,
            "length_of_life_rank":30,
            "quality_of_life_z":-0.19,
            "quality_of_life_rank":42,
            "health_behaviors_z":-0.06,
            "health_behaviors_rank":49,
            "clinical_care_z":0.05,
            "clinical_care_rank":108,
            "social_and_economic_factors_z":0.04,
            "social_and_economic_factors_rank":86,
            "physical_environment_z":0.03,
            "physical_environment_rank":122
          },
          {
            "name":"Wilcox",
            "code":"wc",
            "outcomes_z":1.07,
            "outcomes_rank":150,
            "factors_z":0.43,
            "factors_rank":136,
            "length_of_life_z":1.14,
            "length_of_life_rank":157,
            "quality_of_life_z":-0.06,
            "quality_of_life_rank":71,
            "health_behaviors_z":0.06,
            "health_behaviors_rank":104,
            "clinical_care_z":0.08,
            "clinical_care_rank":126,
            "social_and_economic_factors_z":0.24,
            "social_and_economic_factors_rank":131,
            "physical_environment_z":0.05,
            "physical_environment_rank":143
          },
          {
            "name":"Wilkes",
            "code":"wl",
            "outcomes_z":0.22,
            "outcomes_rank":97,
            "factors_z":0.39,
            "factors_rank":130,
            "length_of_life_z":0.21,
            "length_of_life_rank":105,
            "quality_of_life_z":0.01,
            "quality_of_life_rank":82,
            "health_behaviors_z":0.05,
            "health_behaviors_rank":98,
            "clinical_care_z":-0.00,
            "clinical_care_rank":82,
            "social_and_economic_factors_z":0.22,
            "social_and_economic_factors_rank":125,
            "physical_environment_z":0.12,
            "physical_environment_rank":158
          },
          {
            "name":"Wilkinson",
            "code":"wi",
            "outcomes_z":0.71,
            "outcomes_rank":140,
            "factors_z":0.19,
            "factors_rank":100,
            "length_of_life_z":0.29,
            "length_of_life_rank":111,
            "quality_of_life_z":0.42,
            "quality_of_life_rank":144,
            "health_behaviors_z":0.09,
            "health_behaviors_rank":114,
            "clinical_care_z":0.06,
            "clinical_care_rank":115,
            "social_and_economic_factors_z":0.03,
            "social_and_economic_factors_rank":80,
            "physical_environment_z":0.02,
            "physical_environment_rank":103
          },
          {
            "name":"Worth",
            "code":"wo",
            "outcomes_z":0.17,
            "outcomes_rank":90,
            "factors_z":-0.00,
            "factors_rank":73,
            "length_of_life_z":-0.29,
            "length_of_life_rank":45,
            "quality_of_life_z":0.46,
            "quality_of_life_rank":149,
            "health_behaviors_z":0.05,
            "health_behaviors_rank":96,
            "clinical_care_z":0.03,
            "clinical_care_rank":97,
            "social_and_economic_factors_z":-0.03,
            "social_and_economic_factors_rank":65,
            "physical_environment_z":-0.05,
            "physical_environment_rank":26
          }
        ];
        
        var outcomes = counties.map(function(county) {return county.outcomes_z;});
        var maxZ = Math.max.apply(null, outcomes);
        var minZ = Math.min.apply(null, outcomes);
        
        if (Math.abs(minZ) > Math.abs(maxZ)) {
            maxZ = -minZ;
        } else {
            minZ = -maxZ;
        }
        
//        var scale = chroma.scale("BrBG").domain([maxZ, minZ]).out("hex");
        var scale = chroma.scale([
                chartStyles.color.tertiaryLight, 'white', chartStyles.color.secondaryLight
            ]).domain([maxZ, minZ]).out("hex");
        
        var legend = document.getElementById("legend-svg-1");
        var cells = legend.rows[0].cells;
        for (var idx=0; idx<cells.length; idx++) {
            var td = cells[idx];
            td.style.backgroundColor = scale(maxZ - ((idx + 0.5) / cells.length) * (maxZ - minZ));
        };
        
        legend = document.getElementById("legend-svg-2");
        cells = legend.rows[0].cells;
        for (var idx=0; idx<cells.length; idx++) {
            var td = cells[idx];
            td.style.backgroundColor = scale(maxZ - ((idx + 0.5) / cells.length) * (maxZ - minZ));
        };
        
        $("#map-svg-1").load("img/ga.svg", function() {
            counties.forEach(function(county) {
                document.getElementById(county.code).setAttribute("fill", scale(county.outcomes_z));
            })
        })
        
        var zToText = function(z) {
            z = +z;
            if (z > 0.25) return "Far below average";
            if (z > 0.1) return "Below average";
            if (z > -0.1)  return "Average";
            if (z > -0.5)  return "Above average";
            return "Far above average";
        }
        
        $("#map-svg-2").load("img/ga2.svg", function() {
            counties.forEach(function(county) {
                document.getElementById(county.code+"-2").setAttribute("fill", scale(county.outcomes_z));
            });
            
            [].slice.call(document.querySelectorAll('#map-svg-2 path')).forEach(function(path){
                path.addEventListener('mouseenter', function(){
                    var table = document.getElementById("details-svg-2");
                    var id = this.id.substr(0,2);
                    var county = null;
                    counties.some(function(c) {
                        if (c.code === id) {
                            county = c;
                            return true;
                        }
                        return false;
                    });
                    if (county) {
                        table.rows[0].cells[1].textContent = county.name;
                        table.rows[1].cells[1].textContent = county.outcomes_rank + " out of " + counties.length;
                        table.rows[2].cells[1].textContent = zToText(county.health_behaviors_z);
                        table.rows[3].cells[1].textContent = zToText(county.clinical_care_z);
                        table.rows[4].cells[1].textContent = zToText(county.social_and_economic_factors_z);
                        table.rows[5].cells[1].textContent = zToText(county.physical_environment_z);
                        table.style.display = "table";
                    }
                    this.setAttribute("stroke", "#444444");
                });
                path.addEventListener('mouseleave', function(){
                    document.getElementById("details-svg-2").style.display = "none";
                    this.setAttribute("stroke", "none");
                });
            })
        })
    };
    
    if (typeof contentLoaded != "undefined") {
        contentLoaded.done(draw);
    } else {
        window.addEventListener('load', draw);
    }

}());
</script>
