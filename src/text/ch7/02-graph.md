## Creating a Force Directed Network Graph

Unlike the JavaScript plotting libraries we considered in the early chapters, <span class="smcp">D3</span>.js is not limited to standard charts. In fact, it excels at specialized and custom graph types. To see its power we'll create another version of the network graph from Chapter 4. In the earlier implementation we used the sigmajs library, and most of our work was structuring the data into the format that library requires. We didn't have to decide how to draw the nodes and edges, how to connect them, or, once we enabled layouts, how to position them on the page. As we'll see below, <span class="smcp">D3</span>.js doesn't make those decisions for us. For this example, we'll have to draw the nodes and edges, connect them to each other appropriately, and position them on the page. That may sound like a lot of work, but, as we'll also see, <span class="smcp">D3</span>.js gives us a lot of tools to help.

### Step 1: Prepare the Data

Since we're replicating the network graph from chapter 4, we start with the same data set.

``` {.javascript .numberLines}
var albums = [
  {
    album: "Miles Davis - Kind of Blue",
    musicians: [
      "Cannonball Adderley",
      "Paul Chambers",
      "Jimmy Cobb",
      "John Coltrane",
      "Miles Davis",
      "Bill Evans"
    ]
  },{
    album: "John Coltrane - A Love Supreme",
    musicians: [
      "John Coltrane",
      "Jimmy Garrison",
      "Elvin Jones",
      "McCoy Tyner"
    ]
  // Data set continues...
```

For the visualization it will be helpful to have two separate arrays, one for the graph's nodes and a second for the graph's edges. Extracting those arrays from the original data is straightforward, so we won't bother looking at it in this chapter. You can, however, see the full implementation in the book's source code. The result looks like the following.

``` {.javascript .numberLines}
var nodes = [
  {
    "name": "Miles Davis - Kind of Blue",
    "links": [
      "Cannonball Adderley",
      "Paul Chambers",
      "Jimmy Cobb",
      "John Coltrane",
      "Miles Davis",
      "Bill Evans"
    ],
    "x": 270,
    "y": 200
  },
  {
    "name": "John Coltrane - A Love Supreme",
    "links": [
      "John Coltrane",
      "Jimmy Garrison",
      "Elvin Jones",
      "McCoy Tyner"
    ],
    "x": 307.303483,
    "y": 195.287474
  },
  // Data set continues...
];
```

For the nodes, we've added `x` and `y` properties to define a position on the graph. Initially the code arbitrarily sets these values so that the nodes are positioned in a circle.

``` {.javascript .numberLines}
var edges = [
  {
    "source": 0,
    "target": 16,
    "links": [
      "Cannonball Adderley",
      "Miles Davis"
    ]
  },
  {
    "source": 0,
    "target": 6,
    "links": [
      "Paul Chambers",
      "John Coltrane"
    ]
  },
  // Data set continues...
];
```

The edges indicate the two nodes that they connect as indices in the `nodes` array and they include an array of the individual musicians that are common between the albums.


### Step 2: Set Up the Page

As we noted in the previous example, <span class="smcp">D3</span>.js doesn't depend on any other libraries, and it's available on most content distribution networks. All we need do is include it in the page (line 9). We'll also want to set up a container for the visualization, so our markup includes a `<div>` with the id `"container"` on line 8.

``` {.html .numberLines .line-8 .line-9}
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

This step is also the same as the previous example. We ask <span class="smcp">D3</span>.js to select the container element and then insert an `<svg>` element within it. In addition to appending the `<svg>` element, we can define its size by setting the `height` and `width` attributes.

``` {.javascript .numberLines}
var svg = d3.select("#container").append("svg")
    .attr("height", 500)
    .attr("width", 960);
```

### Step 4: Draw the Graph's Nodes

We're going to draw each node as a circle, and that's as simple as appending `<circle>` elements inside the `<svg>` stage. Based on the previous step, you might think that would be as simple as executing `svg.append("circle")` for each element in the `nodes` array.

``` {.javascript .numberLines}
nodes.forEach(function(node) {
    svg.append("circle");
});
```

That code will indeed add 25 circles to the visualization. What it won't do, though, is create any links between the data (nodes in the array) and the document (circle elements on the page). <span class="lgcp">D3</span>.js has another way to add the circles to the page that does create that linkage. In fact, not only will <span class="smcp">D3</span>.js create the links, it will even manage them for us. This support becomes especially valuable as visualizations grow more complex.

> This feature is really the _core_ of <span class="smcp">D3</span>.js, and it is, in fact, the source for the name "<span class="smcp">D3</span>" which is shorthand for "Data Driven Documents."

Here's how we can use <span class="smcp">D3</span>.js more effectively to add the `<circle>` elements to the graph.

``` {.javascript .numberLines}
var selection = svg.selectAll("circle")
    .data(nodes);
    
selection.enter().append("circle");
```

For those of you that haven't seen <span class="smcp">D3</span>.js code before, that fragment surely looks very strange. What are we trying to do by selecting `<circle>` elements before we've even created any? Won't the result just be empty? And if so, what's the point of the `data()` function that follows? To answer those questions, we have to understand how <span class="smcp">D3</span>.js differs from traditional JavaScript libraries like jQuery. In those libraries a selection represents elements of <span class="smcp">HTML</span> markup. With jQuery, `$("circle")` is nothing more than the `<circle>` elements in the page. With <span class="smcp">D3</span>.js, however, selections are more than just markup elements. <span class="lgcp">D3</span>.js selections can contain both markup _and_ data.

<span class="lgcp">D3</span>.js puts markup elements and data objects together with the `data()` function. The object on which it operates (`svg.selectAll("circle")` above) supplies the elements, and its parameter (`nodes` above) provides the data. The first statement in the fragment, therefore, tells <span class="smcp">D3</span>.js that we want to match `<circle>` elements with nodes in our graph. We are, in effect, saying that we want one `<circle>` to represent each value in the `nodes` array.

The result is easiest to understand when there are exactly as many elements as there are data values. Figure NEXTFIGURENUMBER shows four `<circle>` elements and four albums. <span class="lgcp">D3</span>.js dutifully combines the two sets, giving us a selection of four objects. Each object has both a `<circle>` and an album.

<figure>
<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="630" height="315"  xml:space="preserve">
<defs>
<linearGradient id="obj_Gradient-bezier11" x1="205.91" y1="131.64" x2="183.02" y2="171.29" gradientUnits="userSpaceOnUse" >
<stop offset="0" stop-color="rgb(0, 0, 0)" stop-opacity="0" />
<stop offset="0.39" stop-color="rgb(0, 0, 0)" stop-opacity="0" />
<stop offset="1" stop-color="rgb(0, 0, 0)" stop-opacity="0.5" />
</linearGradient>
<linearGradient id="obj_Gradient_2-bezier12" x1="169.93" y1="157.6" x2="194.47" y2="157.6" gradientUnits="userSpaceOnUse" >
<stop offset="0" stop-color="rgb(123, 0, 0)" stop-opacity="1" />
<stop offset="1" stop-color="rgb(165, 0, 0)" stop-opacity="1" />
</linearGradient>
<linearGradient id="obj_Gradient_3-bezier14" x1="158.49" y1="159.02" x2="181.38" y2="119.38" gradientUnits="userSpaceOnUse" >
<stop offset="0" stop-color="rgb(165, 0, 0)" stop-opacity="1" />
<stop offset="1" stop-color="rgb(247, 21, 21)" stop-opacity="1" />
</linearGradient>
<linearGradient id="obj_Gradient_4-bezier16" x1="168.7" y1="138.49" x2="146.63" y2="176.71" gradientUnits="userSpaceOnUse" >
<stop offset="0" stop-color="rgb(254, 76, 76)" stop-opacity="1" />
<stop offset="1" stop-color="rgb(254, 76, 76)" stop-opacity="1" />
</linearGradient>
<linearGradient id="obj_Gradient_5-bezier18" x1="324.91" y1="131.64" x2="302.02" y2="171.29" gradientUnits="userSpaceOnUse" >
<stop offset="0" stop-color="rgb(0, 0, 0)" stop-opacity="0" />
<stop offset="0.39" stop-color="rgb(0, 0, 0)" stop-opacity="0" />
<stop offset="1" stop-color="rgb(0, 0, 0)" stop-opacity="0.5" />
</linearGradient>
<linearGradient id="obj_Gradient_6-bezier19" x1="288.93" y1="157.6" x2="313.47" y2="157.6" gradientUnits="userSpaceOnUse" >
<stop offset="0" stop-color="rgb(123, 0, 0)" stop-opacity="1" />
<stop offset="1" stop-color="rgb(165, 0, 0)" stop-opacity="1" />
</linearGradient>
<linearGradient id="obj_Gradient_7-bezier21" x1="277.49" y1="159.02" x2="300.38" y2="119.38" gradientUnits="userSpaceOnUse" >
<stop offset="0" stop-color="rgb(165, 0, 0)" stop-opacity="1" />
<stop offset="1" stop-color="rgb(247, 21, 21)" stop-opacity="1" />
</linearGradient>
<linearGradient id="obj_Gradient_8-bezier23" x1="287.7" y1="138.49" x2="265.63" y2="176.71" gradientUnits="userSpaceOnUse" >
<stop offset="0" stop-color="rgb(254, 76, 76)" stop-opacity="1" />
<stop offset="1" stop-color="rgb(254, 76, 76)" stop-opacity="1" />
</linearGradient>
<linearGradient id="obj_Gradient_9-bezier25" x1="443.91" y1="131.64" x2="421.02" y2="171.29" gradientUnits="userSpaceOnUse" >
<stop offset="0" stop-color="rgb(0, 0, 0)" stop-opacity="0" />
<stop offset="0.39" stop-color="rgb(0, 0, 0)" stop-opacity="0" />
<stop offset="1" stop-color="rgb(0, 0, 0)" stop-opacity="0.5" />
</linearGradient>
<linearGradient id="obj_Gradient_a-bezier26" x1="407.93" y1="157.6" x2="432.47" y2="157.6" gradientUnits="userSpaceOnUse" >
<stop offset="0" stop-color="rgb(123, 0, 0)" stop-opacity="1" />
<stop offset="1" stop-color="rgb(165, 0, 0)" stop-opacity="1" />
</linearGradient>
<linearGradient id="obj_Gradient_b-bezier28" x1="396.49" y1="159.02" x2="419.38" y2="119.38" gradientUnits="userSpaceOnUse" >
<stop offset="0" stop-color="rgb(165, 0, 0)" stop-opacity="1" />
<stop offset="1" stop-color="rgb(247, 21, 21)" stop-opacity="1" />
</linearGradient>
<linearGradient id="obj_Gradient_c-bezier30" x1="406.7" y1="138.49" x2="384.63" y2="176.71" gradientUnits="userSpaceOnUse" >
<stop offset="0" stop-color="rgb(254, 76, 76)" stop-opacity="1" />
<stop offset="1" stop-color="rgb(254, 76, 76)" stop-opacity="1" />
</linearGradient>
<linearGradient id="obj_Gradient_d-bezier32" x1="86.91" y1="131.64" x2="64.02" y2="171.29" gradientUnits="userSpaceOnUse" >
<stop offset="0" stop-color="rgb(0, 0, 0)" stop-opacity="0" />
<stop offset="0.39" stop-color="rgb(0, 0, 0)" stop-opacity="0" />
<stop offset="1" stop-color="rgb(0, 0, 0)" stop-opacity="0.5" />
</linearGradient>
<linearGradient id="obj_Gradient_e-bezier33" x1="50.93" y1="157.6" x2="75.47" y2="157.6" gradientUnits="userSpaceOnUse" >
<stop offset="0" stop-color="rgb(123, 0, 0)" stop-opacity="1" />
<stop offset="1" stop-color="rgb(165, 0, 0)" stop-opacity="1" />
</linearGradient>
<linearGradient id="obj_Gradient_f-bezier35" x1="39.49" y1="159.02" x2="62.38" y2="119.38" gradientUnits="userSpaceOnUse" >
<stop offset="0" stop-color="rgb(165, 0, 0)" stop-opacity="1" />
<stop offset="1" stop-color="rgb(247, 21, 21)" stop-opacity="1" />
</linearGradient>
<linearGradient id="obj_Gradient_10-bezier37" x1="49.7" y1="138.49" x2="27.63" y2="176.71" gradientUnits="userSpaceOnUse" >
<stop offset="0" stop-color="rgb(254, 76, 76)" stop-opacity="1" />
<stop offset="1" stop-color="rgb(254, 76, 76)" stop-opacity="1" />
</linearGradient>
<filter id="shadow-outer" filterUnits="userSpaceOnUse">
<feGaussianBlur stdDeviation="2.5" />
<feOffset dx="3.1" dy="3.1" result="blur" />
<feFlood flood-color="rgb(0, 0, 0)" flood-opacity="1" />
<feComposite in2="blur" operator="in" result="colorShadow" />
<feComposite in="SourceGraphic" in2="colorShadow" operator="over" />
</filter>
<filter id="shadow-outer" filterUnits="userSpaceOnUse">
<feGaussianBlur stdDeviation="2.5" />
<feOffset dx="3.1" dy="3.1" result="blur" />
<feFlood flood-color="rgb(0, 0, 0)" flood-opacity="1" />
<feComposite in2="blur" operator="in" result="colorShadow" />
<feComposite in="SourceGraphic" in2="colorShadow" operator="over" />
</filter>
<filter id="shadow-outer" filterUnits="userSpaceOnUse">
<feGaussianBlur stdDeviation="2.5" />
<feOffset dx="3.1" dy="3.1" result="blur" />
<feFlood flood-color="rgb(0, 0, 0)" flood-opacity="1" />
<feComposite in2="blur" operator="in" result="colorShadow" />
<feComposite in="SourceGraphic" in2="colorShadow" operator="over" />
</filter>
<filter id="shadow-outer" filterUnits="userSpaceOnUse">
<feGaussianBlur stdDeviation="2.5" />
<feOffset dx="3.1" dy="3.1" result="blur" />
<feFlood flood-color="rgb(0, 0, 0)" flood-opacity="1" />
<feComposite in2="blur" operator="in" result="colorShadow" />
<feComposite in="SourceGraphic" in2="colorShadow" operator="over" />
</filter>
</defs>
<path id="bezier" stroke="none" fill="rgb(123, 0, 0)" d="M 412.22,209.6 L 405.78,209.6 405.78,191.17 399,191.17 409,171.2 419,191.17 412.22,191.17 412.22,209.6 Z M 412.22,209.6" />
<path id="bezier3" stroke="none" fill="rgb(123, 0, 0)" d="M 293.22,209.6 L 286.78,209.6 286.78,191.17 280,191.17 290,171.2 300,191.17 293.22,191.17 293.22,209.6 Z M 293.22,209.6" />
<path id="bezier5" stroke="none" fill="rgb(123, 0, 0)" d="M 174.22,209.6 L 167.78,209.6 167.78,191.17 161,191.17 171,171.2 181,191.17 174.22,191.17 174.22,209.6 Z M 174.22,209.6" />
<path id="bezier7" stroke="none" fill="rgb(123, 0, 0)" d="M 55.22,209.6 L 48.78,209.6 48.78,191.17 42,191.17 52,171.2 62,191.17 55.22,191.17 55.22,209.6 Z M 55.22,209.6" />
<path id="bezier9" stroke="none" fill="rgb(202, 0, 0)" d="M 52.4,161.6 L 52.4,142.4 504.56,142.4 504.56,123.2 529,152 504.56,180.8 504.56,161.6 52.4,161.6 Z M 52.4,161.6" />
<path id="bezier11" stroke="none" fill="url(#obj_Gradient-bezier11)" d="M 169.93,151.47 L 194.47,139.2 219,151.47 194.47,163.73 169.93,151.47 Z M 169.93,151.47" />
<path id="bezier12" stroke="rgb(46, 46, 46)" stroke-miterlimit="4" fill="url(#obj_Gradient_2-bezier12)" d="M 194.47,163.73 L 194.47,139.2 169.93,151.47 169.93,176 194.47,163.73 Z M 194.47,163.73" />
<path id="bezier14" stroke="rgb(46, 46, 46)" stroke-miterlimit="4" fill="url(#obj_Gradient_3-bezier14)" d="M 194.47,139.2 L 169.93,126.93 145.4,139.2 169.93,151.47 194.47,139.2 Z M 194.47,139.2" />
<path id="bezier16" stroke="rgb(46, 46, 46)" stroke-miterlimit="4" fill="url(#obj_Gradient_4-bezier16)" d="M 145.4,163.73 L 145.4,139.2 169.93,151.47 169.93,176 145.4,163.73 Z M 145.4,163.73" />
<path id="bezier18" stroke="none" fill="url(#obj_Gradient_5-bezier18)" d="M 288.93,151.47 L 313.47,139.2 338,151.47 313.47,163.73 288.93,151.47 Z M 288.93,151.47" />
<path id="bezier19" stroke="rgb(46, 46, 46)" stroke-miterlimit="4" fill="url(#obj_Gradient_6-bezier19)" d="M 313.47,163.73 L 313.47,139.2 288.93,151.47 288.93,176 313.47,163.73 Z M 313.47,163.73" />
<path id="bezier21" stroke="rgb(46, 46, 46)" stroke-miterlimit="4" fill="url(#obj_Gradient_7-bezier21)" d="M 313.47,139.2 L 288.93,126.93 264.4,139.2 288.93,151.47 313.47,139.2 Z M 313.47,139.2" />
<path id="bezier23" stroke="rgb(46, 46, 46)" stroke-miterlimit="4" fill="url(#obj_Gradient_8-bezier23)" d="M 264.4,163.73 L 264.4,139.2 288.93,151.47 288.93,176 264.4,163.73 Z M 264.4,163.73" />
<path id="bezier25" stroke="none" fill="url(#obj_Gradient_9-bezier25)" d="M 407.93,151.47 L 432.47,139.2 457,151.47 432.47,163.73 407.93,151.47 Z M 407.93,151.47" />
<path id="bezier26" stroke="rgb(46, 46, 46)" stroke-miterlimit="4" fill="url(#obj_Gradient_a-bezier26)" d="M 432.47,163.73 L 432.47,139.2 407.93,151.47 407.93,176 432.47,163.73 Z M 432.47,163.73" />
<path id="bezier28" stroke="rgb(46, 46, 46)" stroke-miterlimit="4" fill="url(#obj_Gradient_b-bezier28)" d="M 432.47,139.2 L 407.93,126.93 383.4,139.2 407.93,151.47 432.47,139.2 Z M 432.47,139.2" />
<path id="bezier30" stroke="rgb(46, 46, 46)" stroke-miterlimit="4" fill="url(#obj_Gradient_c-bezier30)" d="M 383.4,163.73 L 383.4,139.2 407.93,151.47 407.93,176 383.4,163.73 Z M 383.4,163.73" />
<path id="bezier32" stroke="none" fill="url(#obj_Gradient_d-bezier32)" d="M 50.93,151.47 L 75.47,139.2 100,151.47 75.47,163.73 50.93,151.47 Z M 50.93,151.47" />
<path id="bezier33" stroke="rgb(46, 46, 46)" stroke-miterlimit="4" fill="url(#obj_Gradient_e-bezier33)" d="M 75.47,163.73 L 75.47,139.2 50.93,151.47 50.93,176 75.47,163.73 Z M 75.47,163.73" />
<path id="bezier35" stroke="rgb(46, 46, 46)" stroke-miterlimit="4" fill="url(#obj_Gradient_f-bezier35)" d="M 75.47,139.2 L 50.93,126.93 26.4,139.2 50.93,151.47 75.47,139.2 Z M 75.47,139.2" />
<path id="bezier37" stroke="rgb(46, 46, 46)" stroke-miterlimit="4" fill="url(#obj_Gradient_10-bezier37)" d="M 26.4,163.73 L 26.4,139.2 50.93,151.47 50.93,176 26.4,163.73 Z M 26.4,163.73" />
<path id="bezier39" stroke="rgb(68, 68, 68)" stroke-miterlimit="4" fill="rgb(255, 255, 255)" d="M 85.94,15.26 C 104.69,34 104.69,64.4 85.94,83.14 67.2,101.89 36.8,101.89 18.06,83.14 -0.69,64.4 -0.69,34 18.06,15.26 36.8,-3.49 67.2,-3.49 85.94,15.26 Z M 85.94,15.26" />
<path id="bezier41" stroke="rgb(68, 68, 68)" stroke-miterlimit="4" fill="rgb(255, 255, 255)" d="M 442.94,15.26 C 461.69,34 461.69,64.4 442.94,83.14 424.2,101.89 393.8,101.89 375.06,83.14 356.31,64.4 356.31,34 375.06,15.26 393.8,-3.49 424.2,-3.49 442.94,15.26 Z M 442.94,15.26" />
<path id="bezier43" stroke="rgb(68, 68, 68)" stroke-miterlimit="4" fill="rgb(255, 255, 255)" d="M 323.94,15.26 C 342.69,34 342.69,64.4 323.94,83.14 305.2,101.89 274.8,101.89 256.06,83.14 237.31,64.4 237.31,34 256.06,15.26 274.8,-3.49 305.2,-3.49 323.94,15.26 Z M 323.94,15.26" />
<path id="bezier45" stroke="rgb(68, 68, 68)" stroke-miterlimit="4" fill="rgb(255, 255, 255)" d="M 204.94,15.26 C 223.69,34 223.69,64.4 204.94,83.14 186.2,101.89 155.8,101.89 137.06,83.14 118.31,64.4 118.31,34 137.06,15.26 155.8,-3.49 186.2,-3.49 204.94,15.26 Z M 204.94,15.26" />
<g id="group3" filter="url(#shadow-outer)">
<rect id="rectangle6" stroke="none" fill="rgb(45, 153, 153)" x="4" y="211.6" width="96" height="96" />
</g>
<g id="group4" filter="url(#shadow-outer)">
<rect id="rectangle8" stroke="none" fill="rgb(77, 115, 0)" x="123" y="211.6" width="96" height="96" />
</g>
<g id="group5" filter="url(#shadow-outer)">
<path id="bezier47" stroke="none" fill="rgb(21, 121, 120)" d="M 242,210.6 L 338,210.6 338,306.6 242,306.6 242,210.6 Z M 242,210.6" />
</g>
<g id="group6" filter="url(#shadow-outer)">
<rect id="rectangle11" stroke="none" fill="rgb(129, 188, 31)" x="361" y="211.6" width="96" height="96" />
</g>
<path id="bezier48" stroke="none" fill="rgb(123, 0, 0)" d="M 48.78,99.87 L 55.22,99.87 55.22,117.63 62,117.63 52,137.6 42,117.63 48.78,117.63 48.78,99.87 Z M 48.78,99.87" />
<path id="bezier50" stroke="none" fill="rgb(123, 0, 0)" d="M 167.78,99.87 L 174.22,99.87 174.22,117.63 181,117.63 171,137.6 161,117.63 167.78,117.63 167.78,99.87 Z M 167.78,99.87" />
<path id="bezier52" stroke="none" fill="rgb(123, 0, 0)" d="M 286.78,99.87 L 293.22,99.87 293.22,117.63 300,117.63 290,137.6 280,117.63 286.78,117.63 286.78,99.87 Z M 286.78,99.87" />
<path id="bezier54" stroke="none" fill="rgb(123, 0, 0)" d="M 405.78,99.87 L 412.22,99.87 412.22,117.63 419,117.63 409,137.6 399,117.63 405.78,117.63 405.78,99.87 Z M 405.78,99.87" />
<g id="group2">
<path id="bezier6" stroke="none" fill="rgb(184, 234, 82)" d="M 202,228.03 C 201.98,227.93 201.92,227.84 201.83,227.79 L 200.52,227.03 C 200.95,226.5 201.35,225.98 201.72,225.52 200.82,221.82 196.66,221.35 196.66,221.35 L 195.38,223.11 194.37,222.13 C 194.3,222.05 194.2,222.02 194.09,222.03 193.99,222.03 193.89,222.08 193.83,222.17 L 193.07,223.17 C 193.01,223.25 192.98,223.36 193.01,223.46 193.02,223.54 193.07,223.62 193.14,223.67 193.15,223.68 193.16,223.69 193.18,223.7 L 194.43,224.43 193.54,225.65 192.47,224.62 C 192.4,224.55 192.3,224.51 192.2,224.52 192.09,224.53 192,224.58 191.93,224.66 L 191.17,225.66 C 191.11,225.75 191.09,225.85 191.11,225.95 191.12,226.04 191.17,226.12 191.24,226.17 191.25,226.18 191.27,226.19 191.28,226.2 L 192.59,226.96 191.66,228.23 190.56,227.15 C 190.48,227.07 190.38,227.04 190.28,227.05 190.17,227.05 190.08,227.11 190.02,227.19 L 189.25,228.19 C 189.19,228.27 189.17,228.38 189.19,228.48 189.21,228.57 189.25,228.64 189.32,228.7 189.34,228.71 189.35,228.71 189.36,228.72 L 190.81,229.57 C 190.84,229.58 190.86,229.59 190.88,229.59 L 189.94,232.35 192.86,234.57 195.52,233.03 C 195.53,233.1 195.56,233.16 195.61,233.21 L 196.82,234.39 C 196.83,234.4 196.84,234.41 196.85,234.41 196.92,234.47 197.01,234.49 197.1,234.49 197.2,234.48 197.29,234.43 197.36,234.35 L 198.12,233.34 C 198.18,233.26 198.2,233.16 198.18,233.06 198.16,232.95 198.1,232.87 198.01,232.81 L 196.56,231.97 C 196.55,231.97 196.55,231.97 196.54,231.96 196.83,231.62 197.17,231.2 197.56,230.72 L 198.74,231.86 C 198.75,231.87 198.76,231.88 198.77,231.89 198.84,231.94 198.93,231.97 199.01,231.96 199.12,231.95 199.21,231.9 199.28,231.82 L 200.04,230.82 C 200.1,230.74 200.12,230.63 200.1,230.53 200.08,230.43 200.02,230.34 199.93,230.29 L 198.56,229.49 C 198.87,229.1 199.2,228.69 199.52,228.29 L 200.63,229.36 C 200.64,229.37 200.65,229.38 200.67,229.39 200.73,229.44 200.82,229.47 200.91,229.46 201.02,229.46 201.11,229.41 201.17,229.32 L 201.93,228.32 C 201.99,228.24 202.02,228.13 202,228.03 Z M 192.75,230.06 C 192.53,230.33 192.13,230.39 191.85,230.18 191.57,229.96 191.52,229.56 191.73,229.28 191.95,229 192.34,228.95 192.63,229.16 192.91,229.37 192.96,229.77 192.75,230.06 Z M 194.67,227.53 C 194.45,227.81 194.05,227.86 193.77,227.65 193.49,227.44 193.44,227.04 193.65,226.76 193.86,226.47 194.26,226.42 194.54,226.63 194.83,226.85 194.88,227.25 194.67,227.53 Z M 195.55,224.26 C 195.76,223.98 196.16,223.93 196.44,224.14 196.72,224.35 196.78,224.75 196.56,225.03 196.35,225.31 195.95,225.37 195.67,225.15 195.39,224.94 195.33,224.54 195.55,224.26 Z M 195.46,232.12 C 195.25,232.4 194.85,232.45 194.57,232.24 194.29,232.03 194.23,231.63 194.45,231.35 194.66,231.06 195.06,231.01 195.34,231.22 195.62,231.43 195.68,231.84 195.46,232.12 Z M 197.38,229.59 C 197.17,229.87 196.77,229.93 196.49,229.71 196.21,229.5 196.15,229.1 196.37,228.82 196.58,228.54 196.98,228.48 197.26,228.7 197.54,228.91 197.6,229.31 197.38,229.59 Z M 199.28,227.1 C 199.07,227.38 198.67,227.43 198.38,227.22 198.1,227 198.05,226.6 198.26,226.32 198.47,226.04 198.88,225.99 199.16,226.2 199.44,226.41 199.49,226.82 199.28,227.1 Z M 199.28,227.1" />
<path id="bezier8" stroke="none" fill="rgb(184, 234, 82)" d="M 172.53,262.11 L 192.26,235.21 189.47,233.1 171.4,256.05 C 171.24,255.91 171.08,255.77 170.93,255.64 166.35,251.92 162.57,251.23 159.59,254.27 157.66,256.24 157.72,258.02 156.87,259.45 152.26,267.15 145.88,265.62 140.92,270.9 137.21,274.84 137.49,280.41 139.2,283.49 143.7,291.58 158.04,301.68 165.5,293.8 170.41,288.62 169.75,283.63 171.18,278.78 171.65,277.19 172.96,274.76 174.39,273.37 175.22,272.56 177.48,272.3 178.25,270.26 179.44,267.14 171.77,265.48 172.53,262.11 Z M 159.96,266.37 C 161.39,264.5 164.06,264.14 165.93,265.56 167.8,266.98 168.17,269.65 166.74,271.53 165.32,273.4 162.65,273.77 160.78,272.34 158.9,270.92 158.54,268.25 159.96,266.37 Z M 160.54,284.69 L 150.3,276.91 151.57,275.25 161.81,283.03 160.54,284.69 Z M 165.56,282.39 C 164.44,282.75 163.89,282.87 161.94,281.43 160.45,280.14 159.77,279.04 161.31,276.59 162.4,275.17 163.38,274.58 164.61,274.72 165.86,274.73 169.26,273.3 169.58,269.09 169.53,268.05 170.39,267.94 170.85,270.52 170.85,270.52 171.97,278.7 165.56,282.39 Z M 165.56,282.39" />
</g>
<g id="group">
<path id="bezier2" stroke="none" fill="rgb(9, 74, 74)" d="M 44.5,225.68 C 41.85,225.64 38.96,227.26 38.03,230.21 37.99,230.34 37.31,232.34 37.27,232.49 L 31.69,232.49 C 33.93,233.97 34.67,234.36 36.91,234.36 37.28,234.36 38.79,234.35 39.16,233.24 39.27,232.91 40.04,230.7 40.19,230.4 40.85,229.07 41.87,228.09 43.13,228.09 44.68,228.09 44.75,229.56 44.63,231.06 L 40.53,280.68 C 39.97,287.48 45.38,294 53.96,294 58.84,294 61.95,292.44 63.52,287.78 65.09,283.11 62.71,274.46 68.52,272.53 L 56.19,260.3 C 51.82,264.46 52.35,273.32 53.2,278.83 53.37,279.93 53.22,283.26 51.73,283.26 50.24,283.26 49.63,280.55 49.62,279.29 L 49.48,231.06 C 49.56,227.42 47.15,225.73 44.5,225.68 Z M 46.27,252.35 C 47.19,252.35 47.96,253.09 47.96,254.01 47.96,254.93 47.19,255.68 46.27,255.68 45.34,255.68 44.6,254.93 44.6,254.01 44.6,253.09 45.34,252.35 46.27,252.35 Z M 46.02,258.82 C 46.95,258.82 47.69,259.58 47.69,260.5 47.69,261.42 46.95,262.15 46.02,262.15 45.09,262.15 44.33,261.42 44.33,260.5 44.33,259.58 45.1,258.82 46.02,258.82 Z M 45.75,265.31 C 46.68,265.31 47.42,266.05 47.42,266.97 47.42,267.89 46.68,268.64 45.75,268.64 44.83,268.64 44.06,267.89 44.06,266.97 44.06,266.05 44.83,265.31 45.75,265.31 Z M 45.75,265.31" />
<path id="bezier4" stroke="none" fill="rgb(9, 74, 74)" d="M 72.19,272.71 L 72.5,272.4 C 72.85,272.05 72.85,271.49 72.5,271.14 L 57.15,255.9 C 56.8,255.56 56.23,255.56 55.88,255.9 L 55.56,256.22 C 55.22,256.56 55.22,257.13 55.56,257.47 L 70.92,272.71 C 71.27,273.06 71.84,273.06 72.19,272.71 Z M 72.19,272.71" />
</g>
<g id="group13">
<path id="bezier62" stroke="none" fill="rgb(79, 114, 15)" d="M 410.38,275.55 C 410.34,275.6 410.38,275.64 410.38,275.69 L 410.26,275.71 410.26,277.9 411.13,278.61 413.79,278.12 413.79,275.93 413.6,275.56 C 413.6,275.55 413.64,275.55 413.64,275.55 413.41,274.76 414.12,262.98 414.37,258.78 412.7,259.05 411.11,259.3 409.74,259.52 410.08,263.74 410.93,275 410.38,275.55 Z M 410.38,275.55" />
<path id="bezier63" stroke="none" fill="rgb(79, 114, 15)" d="M 391.32,254.86 C 391.53,257.41 392.31,267.38 391.86,267.83 391.82,267.87 391.7,267.9 391.71,267.94 L 391.57,267.94 391.57,269.62 392.4,270.17 394.6,269.79 394.6,268.11 394.3,267.61 C 394.23,266.23 394.66,259.55 394.87,256.2 L 391.32,254.86 Z M 391.32,254.86" />
<path id="bezier64" stroke="none" fill="rgb(79, 114, 15)" d="M 429.96,266.96 C 429.91,267.01 429.93,267.04 429.93,267.08 L 429.95,267.07 429.95,268.92 430.72,269.52 432.98,269.1 432.98,267.26 432.64,266.71 C 432.57,265.34 432.93,259.32 433.17,255.46 432.19,255.64 430.91,255.89 429.62,256.13 429.93,260.39 430.33,266.59 429.96,266.96 Z M 429.96,266.96" />
<path id="bezier65" stroke="none" fill="rgb(79, 114, 15)" d="M 431.43,242.17 C 427.61,242.91 421.91,243.69 414.94,244.43 413.72,244.56 413.41,244.9 413.38,245.06 L 413.4,245.08 413.39,245.08 C 413.39,245.58 413.38,247.09 413.15,247.93 L 413.15,247.97 C 412.36,250.47 410.73,250.75 408.25,251.14 407.97,251.19 407.66,251.25 407.34,251.3 L 407.28,251.31 C 404.82,251.48 404.4,252.58 404.4,255.78 404.4,258.01 404.77,258.83 404.99,259.11 405.16,259.14 405.34,259.16 405.53,259.16 406.6,259.16 419.73,256.96 423.92,256.25 424.72,256.12 434.74,254.22 434.74,254.22 434.74,254.22 434.91,245.05 434.96,241.36 435.13,241.31 433.16,241.84 431.43,242.17 Z M 431.43,242.17" />
<path id="bezier66" stroke="none" fill="rgb(79, 114, 15)" d="M 433.54,239.63 C 431.56,239.48 413.36,239.19 407.98,239.07 407.6,239.07 407.21,239.06 406.82,239.06 401.05,239.06 393.15,239.87 392.46,239.92 391.73,239.98 392.03,241.69 391.89,243.13 391.75,244.56 389.99,244.98 389.99,244.98 389.99,244.98 387.69,245.49 386.06,245.8 384.43,246.11 384.5,246.84 384.5,246.84 L 384.5,248.75 384.5,248.86 384.5,251.31 C 384.5,251.31 403.14,258.3 403.48,258.44 403.45,258.24 403.23,257.25 403.23,255.78 403.23,254.62 403.28,253.54 403.56,252.63 L 388.04,247.85 388.04,247.41 391.95,246.4 C 391.95,246.4 401.41,249.13 405.92,250.14 L 405.92,250.14 C 408.07,250.14 407.78,249.93 408.07,249.89 409.59,249.64 410.52,249.54 411.14,249.04 L 394.62,244.95 C 394.07,244.81 393.64,244.27 393.64,243.71 L 393.64,241.94 C 393.64,241.68 393.73,241.45 393.89,241.28 394.1,241.08 394.4,240.99 394.71,241.05 L 412.3,244.52 C 412.31,244.52 412.33,244.52 412.35,244.53 412.39,244.44 412.45,244.34 412.53,244.24 412.94,243.71 413.71,243.37 414.82,243.25 421.4,242.55 426.67,241.85 430.48,241.15 432.8,240.73 433.99,240.38 435,240.12 435,240.09 435,240.07 435,240.05 435,240.06 434.99,239.89 434.45,239.76 434.27,239.72 433.7,239.64 433.54,239.63 Z M 433.54,239.63" />
</g>
<g id="g4977">
<path id="bezier10" stroke="none" fill="rgb(54, 153, 152)" d="M 252.65,248.11 L 252.71,255.03 C 254.32,255.02 255.65,253.95 256.06,252.49 L 267.5,252.42 C 266.7,253.49 266.23,254.79 266.24,256.22 266.27,259.74 269.23,262.61 272.82,262.58 L 294.94,262.42 302.32,262.36 308.79,262.3 C 312.38,262.28 315.28,259.38 315.25,255.85 315.24,254.44 314.75,253.13 313.94,252.07 L 318.47,252.03 C 322.56,253.96 324.6,262.38 324.6,262.38 324.78,263.04 325.28,263.02 325.27,262.37 L 325.17,250.7 325.09,239.67 C 325.08,239.02 324.59,239.02 324.43,239.66 324.43,239.66 322.52,247.47 318.32,249.54 L 309.83,249.59 272.05,249.79 255.74,249.87 C 255.13,248.81 253.97,248.09 252.65,248.1 L 252.65,248.11 Z M 271.58,252.54 C 271.88,252.45 272.18,252.4 272.5,252.38 L 295.95,252.2 C 295.95,252.2 299.49,252.26 301.14,252.25 303.31,252.23 305.03,253.89 305.05,256.03 305.06,257.87 303.8,259.39 302.05,259.77 L 301.99,259.79 272.78,259.98 C 270.61,260 268.91,258.33 268.89,256.2 268.88,254.46 270,253.03 271.58,252.54 Z M 306.3,252.13 L 309.13,252.12 C 311.1,252.3 312.59,253.89 312.6,255.88 312.62,258.02 310.93,259.71 308.76,259.73 L 306.48,259.74 C 307.25,258.68 307.71,257.39 307.7,256 307.69,254.54 307.16,253.2 306.3,252.13 L 306.3,252.13 Z M 306.3,252.13" />
<path id="bezier49" stroke="none" fill="rgb(54, 153, 152)" d="M 282.99,248.74 L 284.65,248.74 C 284.96,248.74 285.21,248.98 285.21,249.28 L 285.27,262.42 C 285.27,262.72 285.03,262.97 284.72,262.97 L 283.06,262.98 C 282.75,262.98 282.5,262.74 282.5,262.44 L 282.44,249.29 C 282.43,248.99 282.68,248.75 282.99,248.74 Z M 282.99,248.74" />
<path id="bezier51" stroke="none" fill="rgb(54, 153, 152)" d="M 287.86,248.72 L 289.52,248.71 C 289.83,248.71 290.07,248.95 290.08,249.26 L 290.14,262.4 C 290.14,262.7 289.89,262.95 289.59,262.95 L 287.92,262.96 C 287.62,262.96 287.37,262.71 287.37,262.41 L 287.3,249.27 C 287.3,248.97 287.55,248.72 287.86,248.72 Z M 287.86,248.72" />
<path id="bezier53" stroke="none" fill="rgb(54, 153, 152)" d="M 292.72,248.7 L 294.39,248.69 C 294.69,248.69 294.94,248.93 294.94,249.23 L 295.01,262.38 C 295.01,262.68 294.76,262.92 294.45,262.92 L 292.79,262.93 C 292.48,262.93 292.24,262.69 292.23,262.39 L 292.17,249.25 C 292.17,248.94 292.41,248.7 292.72,248.7 Z M 292.72,248.7" />
<path id="bezier55" stroke="none" fill="rgb(54, 153, 152)" d="M 283.81,247.61 C 283.98,247.61 284.12,247.75 284.12,247.91 L 284.13,249.15 C 284.13,249.32 283.99,249.45 283.82,249.45 283.65,249.46 283.52,249.32 283.52,249.16 L 283.51,247.91 C 283.51,247.75 283.65,247.61 283.81,247.61 Z M 283.81,247.61" />
<path id="bezier56" stroke="none" fill="rgb(54, 153, 152)" d="M 288.68,247.5 C 288.85,247.5 288.99,247.64 288.99,247.8 L 288.99,249.04 C 288.99,249.21 288.86,249.35 288.69,249.35 288.52,249.35 288.38,249.21 288.38,249.05 L 288.38,247.81 C 288.38,247.64 288.51,247.51 288.68,247.5 Z M 288.68,247.5" />
<path id="bezier57" stroke="none" fill="rgb(54, 153, 152)" d="M 293.55,247.48 C 293.72,247.48 293.85,247.61 293.85,247.78 L 293.86,249.02 C 293.86,249.19 293.73,249.32 293.56,249.32 293.39,249.32 293.25,249.19 293.25,249.02 L 293.24,247.78 C 293.24,247.62 293.38,247.48 293.55,247.48 Z M 293.55,247.48" />
<path id="bezier58" stroke="none" fill="rgb(54, 153, 152)" d="M 282.2,247.24 L 285.42,247.22 C 285.64,247.22 285.82,247.39 285.82,247.6 285.82,247.82 285.65,247.99 285.43,247.99 L 282.2,248.01 C 281.99,248.01 281.81,247.84 281.81,247.62 281.81,247.41 281.98,247.24 282.2,247.24 Z M 282.2,247.24" />
<path id="bezier59" stroke="none" fill="rgb(54, 153, 152)" d="M 287.07,247.21 L 290.29,247.2 C 290.51,247.2 290.68,247.37 290.69,247.58 290.69,247.79 290.51,247.97 290.29,247.97 L 287.07,247.98 C 286.85,247.98 286.68,247.81 286.68,247.6 286.68,247.39 286.85,247.21 287.07,247.21 Z M 287.07,247.21" />
<path id="bezier60" stroke="none" fill="rgb(54, 153, 152)" d="M 291.93,247.19 L 295.16,247.17 C 295.38,247.17 295.55,247.34 295.55,247.56 295.55,247.77 295.38,247.94 295.16,247.94 L 291.94,247.96 C 291.72,247.96 291.55,247.79 291.54,247.58 291.54,247.36 291.72,247.19 291.93,247.19 Z M 291.93,247.19" />
</g>
<text fill="rgb(68, 68, 68)" font-size="16" x="535.82" y="134">
<tspan x="535.82" y="150">selection of </tspan>
</text>
<text fill="rgb(68, 68, 68)" font-size="16" x="545.17" y="154">
<tspan x="545.17" y="170">4 objects</tspan>
</text>
<text fill="rgb(68, 68, 68)" font-size="16" x="140.94" y="39">
<tspan x="140.94" y="55">&lt;circle&gt;</tspan>
</text>
<text fill="rgb(68, 68, 68)" font-size="16" x="259.44" y="39">
<tspan x="259.44" y="55">&lt;circle&gt;</tspan>
</text>
<text fill="rgb(68, 68, 68)" font-size="16" x="378.44" y="39">
<tspan x="378.44" y="55">&lt;circle&gt;</tspan>
</text>
<text fill="rgb(68, 68, 68)" font-size="16" x="21.44" y="39">
<tspan x="21.44" y="55">&lt;circle&gt;</tspan>
</text>
</svg>
<figcaption><span class="lgcp">D3</span>.js selections can associate page content such as &lt;circle&gt; elements with data items such as albums.</figcaption>
</figure>

In general, though, we can't guarantee that there will be exactly as many elements as data values. Suppose, for example, only two `<circle>` elements existed for our four albums. As figure NEXTFIGURENUMBER shows, <span class="smcp">D3</span>.js still creates a selection of four objects, even though there aren't enough circles for all of them. Two of the objects will have a data value but no element.

<figure>
<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="630" height="315"  xml:space="preserve">
<defs>
<linearGradient id="obj_Gradient-bezier11" x1="205.91" y1="131.64" x2="183.02" y2="171.29" gradientUnits="userSpaceOnUse" >
<stop offset="0" stop-color="rgb(0, 0, 0)" stop-opacity="0" />
<stop offset="0.39" stop-color="rgb(0, 0, 0)" stop-opacity="0" />
<stop offset="1" stop-color="rgb(0, 0, 0)" stop-opacity="0.5" />
</linearGradient>
<linearGradient id="obj_Gradient_2-bezier12" x1="169.93" y1="157.6" x2="194.47" y2="157.6" gradientUnits="userSpaceOnUse" >
<stop offset="0" stop-color="rgb(123, 0, 0)" stop-opacity="1" />
<stop offset="1" stop-color="rgb(165, 0, 0)" stop-opacity="1" />
</linearGradient>
<linearGradient id="obj_Gradient_3-bezier14" x1="158.49" y1="159.02" x2="181.38" y2="119.38" gradientUnits="userSpaceOnUse" >
<stop offset="0" stop-color="rgb(165, 0, 0)" stop-opacity="1" />
<stop offset="1" stop-color="rgb(247, 21, 21)" stop-opacity="1" />
</linearGradient>
<linearGradient id="obj_Gradient_4-bezier16" x1="168.7" y1="138.49" x2="146.63" y2="176.71" gradientUnits="userSpaceOnUse" >
<stop offset="0" stop-color="rgb(254, 76, 76)" stop-opacity="1" />
<stop offset="1" stop-color="rgb(254, 76, 76)" stop-opacity="1" />
</linearGradient>
<linearGradient id="obj_Gradient_5-bezier18" x1="324.91" y1="131.64" x2="302.02" y2="171.29" gradientUnits="userSpaceOnUse" >
<stop offset="0" stop-color="rgb(0, 0, 0)" stop-opacity="0" />
<stop offset="0.39" stop-color="rgb(0, 0, 0)" stop-opacity="0" />
<stop offset="1" stop-color="rgb(0, 0, 0)" stop-opacity="0.5" />
</linearGradient>
<linearGradient id="obj_Gradient_6-bezier19" x1="288.93" y1="157.6" x2="313.47" y2="157.6" gradientUnits="userSpaceOnUse" >
<stop offset="0" stop-color="rgb(123, 0, 0)" stop-opacity="1" />
<stop offset="1" stop-color="rgb(165, 0, 0)" stop-opacity="1" />
</linearGradient>
<linearGradient id="obj_Gradient_7-bezier21" x1="277.49" y1="159.02" x2="300.38" y2="119.38" gradientUnits="userSpaceOnUse" >
<stop offset="0" stop-color="rgb(165, 0, 0)" stop-opacity="1" />
<stop offset="1" stop-color="rgb(247, 21, 21)" stop-opacity="1" />
</linearGradient>
<linearGradient id="obj_Gradient_8-bezier23" x1="287.7" y1="138.49" x2="265.63" y2="176.71" gradientUnits="userSpaceOnUse" >
<stop offset="0" stop-color="rgb(254, 76, 76)" stop-opacity="1" />
<stop offset="1" stop-color="rgb(254, 76, 76)" stop-opacity="1" />
</linearGradient>
<linearGradient id="obj_Gradient_9-bezier25" x1="443.91" y1="131.64" x2="421.02" y2="171.29" gradientUnits="userSpaceOnUse" >
<stop offset="0" stop-color="rgb(0, 0, 0)" stop-opacity="0" />
<stop offset="0.39" stop-color="rgb(0, 0, 0)" stop-opacity="0" />
<stop offset="1" stop-color="rgb(0, 0, 0)" stop-opacity="0.5" />
</linearGradient>
<linearGradient id="obj_Gradient_a-bezier26" x1="407.93" y1="157.6" x2="432.47" y2="157.6" gradientUnits="userSpaceOnUse" >
<stop offset="0" stop-color="rgb(123, 0, 0)" stop-opacity="1" />
<stop offset="1" stop-color="rgb(165, 0, 0)" stop-opacity="1" />
</linearGradient>
<linearGradient id="obj_Gradient_b-bezier28" x1="396.49" y1="159.02" x2="419.38" y2="119.38" gradientUnits="userSpaceOnUse" >
<stop offset="0" stop-color="rgb(165, 0, 0)" stop-opacity="1" />
<stop offset="1" stop-color="rgb(247, 21, 21)" stop-opacity="1" />
</linearGradient>
<linearGradient id="obj_Gradient_c-bezier30" x1="406.7" y1="138.49" x2="384.63" y2="176.71" gradientUnits="userSpaceOnUse" >
<stop offset="0" stop-color="rgb(254, 76, 76)" stop-opacity="1" />
<stop offset="1" stop-color="rgb(254, 76, 76)" stop-opacity="1" />
</linearGradient>
<linearGradient id="obj_Gradient_d-bezier32" x1="86.91" y1="131.64" x2="64.02" y2="171.29" gradientUnits="userSpaceOnUse" >
<stop offset="0" stop-color="rgb(0, 0, 0)" stop-opacity="0" />
<stop offset="0.39" stop-color="rgb(0, 0, 0)" stop-opacity="0" />
<stop offset="1" stop-color="rgb(0, 0, 0)" stop-opacity="0.5" />
</linearGradient>
<linearGradient id="obj_Gradient_e-bezier33" x1="50.93" y1="157.6" x2="75.47" y2="157.6" gradientUnits="userSpaceOnUse" >
<stop offset="0" stop-color="rgb(123, 0, 0)" stop-opacity="1" />
<stop offset="1" stop-color="rgb(165, 0, 0)" stop-opacity="1" />
</linearGradient>
<linearGradient id="obj_Gradient_f-bezier35" x1="39.49" y1="159.02" x2="62.38" y2="119.38" gradientUnits="userSpaceOnUse" >
<stop offset="0" stop-color="rgb(165, 0, 0)" stop-opacity="1" />
<stop offset="1" stop-color="rgb(247, 21, 21)" stop-opacity="1" />
</linearGradient>
<linearGradient id="obj_Gradient_10-bezier37" x1="49.7" y1="138.49" x2="27.63" y2="176.71" gradientUnits="userSpaceOnUse" >
<stop offset="0" stop-color="rgb(254, 76, 76)" stop-opacity="1" />
<stop offset="1" stop-color="rgb(254, 76, 76)" stop-opacity="1" />
</linearGradient>
<filter id="shadow-outer" filterUnits="userSpaceOnUse">
<feGaussianBlur stdDeviation="2.5" />
<feOffset dx="3.1" dy="3.1" result="blur" />
<feFlood flood-color="rgb(0, 0, 0)" flood-opacity="1" />
<feComposite in2="blur" operator="in" result="colorShadow" />
<feComposite in="SourceGraphic" in2="colorShadow" operator="over" />
</filter>
<filter id="shadow-outer" filterUnits="userSpaceOnUse">
<feGaussianBlur stdDeviation="2.5" />
<feOffset dx="3.1" dy="3.1" result="blur" />
<feFlood flood-color="rgb(0, 0, 0)" flood-opacity="1" />
<feComposite in2="blur" operator="in" result="colorShadow" />
<feComposite in="SourceGraphic" in2="colorShadow" operator="over" />
</filter>
<filter id="shadow-outer" filterUnits="userSpaceOnUse">
<feGaussianBlur stdDeviation="2.5" />
<feOffset dx="3.1" dy="3.1" result="blur" />
<feFlood flood-color="rgb(0, 0, 0)" flood-opacity="1" />
<feComposite in2="blur" operator="in" result="colorShadow" />
<feComposite in="SourceGraphic" in2="colorShadow" operator="over" />
</filter>
<filter id="shadow-outer" filterUnits="userSpaceOnUse">
<feGaussianBlur stdDeviation="2.5" />
<feOffset dx="3.1" dy="3.1" result="blur" />
<feFlood flood-color="rgb(0, 0, 0)" flood-opacity="1" />
<feComposite in2="blur" operator="in" result="colorShadow" />
<feComposite in="SourceGraphic" in2="colorShadow" operator="over" />
</filter>
</defs>
<path id="bezier" stroke="none" fill="rgb(123, 0, 0)" d="M 412.22,209.6 L 405.78,209.6 405.78,191.17 399,191.17 409,171.2 419,191.17 412.22,191.17 412.22,209.6 Z M 412.22,209.6" />
<path id="bezier3" stroke="none" fill="rgb(123, 0, 0)" d="M 293.22,209.6 L 286.78,209.6 286.78,191.17 280,191.17 290,171.2 300,191.17 293.22,191.17 293.22,209.6 Z M 293.22,209.6" />
<path id="bezier5" stroke="none" fill="rgb(123, 0, 0)" d="M 174.22,209.6 L 167.78,209.6 167.78,191.17 161,191.17 171,171.2 181,191.17 174.22,191.17 174.22,209.6 Z M 174.22,209.6" />
<path id="bezier7" stroke="none" fill="rgb(123, 0, 0)" d="M 55.22,209.6 L 48.78,209.6 48.78,191.17 42,191.17 52,171.2 62,191.17 55.22,191.17 55.22,209.6 Z M 55.22,209.6" />
<path id="bezier9" stroke="none" fill="rgb(202, 0, 0)" d="M 51.4,161.6 L 51.4,142.4 504.51,142.4 504.51,123.2 529,152 504.51,180.8 504.51,161.6 51.4,161.6 Z M 51.4,161.6" />
<path id="bezier11" stroke="none" fill="url(#obj_Gradient-bezier11)" d="M 169.93,151.47 L 194.47,139.2 219,151.47 194.47,163.73 169.93,151.47 Z M 169.93,151.47" />
<path id="bezier12" stroke="rgb(46, 46, 46)" stroke-miterlimit="4" fill="url(#obj_Gradient_2-bezier12)" d="M 194.47,163.73 L 194.47,139.2 169.93,151.47 169.93,176 194.47,163.73 Z M 194.47,163.73" />
<path id="bezier14" stroke="rgb(46, 46, 46)" stroke-miterlimit="4" fill="url(#obj_Gradient_3-bezier14)" d="M 194.47,139.2 L 169.93,126.93 145.4,139.2 169.93,151.47 194.47,139.2 Z M 194.47,139.2" />
<path id="bezier16" stroke="rgb(46, 46, 46)" stroke-miterlimit="4" fill="url(#obj_Gradient_4-bezier16)" d="M 145.4,163.73 L 145.4,139.2 169.93,151.47 169.93,176 145.4,163.73 Z M 145.4,163.73" />
<path id="bezier18" stroke="none" fill="url(#obj_Gradient_5-bezier18)" d="M 288.93,151.47 L 313.47,139.2 338,151.47 313.47,163.73 288.93,151.47 Z M 288.93,151.47" />
<path id="bezier19" stroke="rgb(46, 46, 46)" stroke-miterlimit="4" fill="url(#obj_Gradient_6-bezier19)" d="M 313.47,163.73 L 313.47,139.2 288.93,151.47 288.93,176 313.47,163.73 Z M 313.47,163.73" />
<path id="bezier21" stroke="rgb(46, 46, 46)" stroke-miterlimit="4" fill="url(#obj_Gradient_7-bezier21)" d="M 313.47,139.2 L 288.93,126.93 264.4,139.2 288.93,151.47 313.47,139.2 Z M 313.47,139.2" />
<path id="bezier23" stroke="rgb(46, 46, 46)" stroke-miterlimit="4" fill="url(#obj_Gradient_8-bezier23)" d="M 264.4,163.73 L 264.4,139.2 288.93,151.47 288.93,176 264.4,163.73 Z M 264.4,163.73" />
<path id="bezier25" stroke="none" fill="url(#obj_Gradient_9-bezier25)" d="M 407.93,151.47 L 432.47,139.2 457,151.47 432.47,163.73 407.93,151.47 Z M 407.93,151.47" />
<path id="bezier26" stroke="rgb(46, 46, 46)" stroke-miterlimit="4" fill="url(#obj_Gradient_a-bezier26)" d="M 432.47,163.73 L 432.47,139.2 407.93,151.47 407.93,176 432.47,163.73 Z M 432.47,163.73" />
<path id="bezier28" stroke="rgb(46, 46, 46)" stroke-miterlimit="4" fill="url(#obj_Gradient_b-bezier28)" d="M 432.47,139.2 L 407.93,126.93 383.4,139.2 407.93,151.47 432.47,139.2 Z M 432.47,139.2" />
<path id="bezier30" stroke="rgb(46, 46, 46)" stroke-miterlimit="4" fill="url(#obj_Gradient_c-bezier30)" d="M 383.4,163.73 L 383.4,139.2 407.93,151.47 407.93,176 383.4,163.73 Z M 383.4,163.73" />
<path id="bezier32" stroke="none" fill="url(#obj_Gradient_d-bezier32)" d="M 50.93,151.47 L 75.47,139.2 100,151.47 75.47,163.73 50.93,151.47 Z M 50.93,151.47" />
<path id="bezier33" stroke="rgb(46, 46, 46)" stroke-miterlimit="4" fill="url(#obj_Gradient_e-bezier33)" d="M 75.47,163.73 L 75.47,139.2 50.93,151.47 50.93,176 75.47,163.73 Z M 75.47,163.73" />
<path id="bezier35" stroke="rgb(46, 46, 46)" stroke-miterlimit="4" fill="url(#obj_Gradient_f-bezier35)" d="M 75.47,139.2 L 50.93,126.93 26.4,139.2 50.93,151.47 75.47,139.2 Z M 75.47,139.2" />
<path id="bezier37" stroke="rgb(46, 46, 46)" stroke-miterlimit="4" fill="url(#obj_Gradient_10-bezier37)" d="M 26.4,163.73 L 26.4,139.2 50.93,151.47 50.93,176 26.4,163.73 Z M 26.4,163.73" />
<path id="bezier39" stroke="rgb(68, 68, 68)" stroke-miterlimit="4" fill="rgb(255, 255, 255)" d="M 85.94,15.26 C 104.69,34 104.69,64.4 85.94,83.14 67.2,101.89 36.8,101.89 18.06,83.14 -0.69,64.4 -0.69,34 18.06,15.26 36.8,-3.49 67.2,-3.49 85.94,15.26 Z M 85.94,15.26" />
<path id="bezier45" stroke="rgb(68, 68, 68)" stroke-miterlimit="4" fill="rgb(255, 255, 255)" d="M 204.94,15.26 C 223.69,34 223.69,64.4 204.94,83.14 186.2,101.89 155.8,101.89 137.06,83.14 118.31,64.4 118.31,34 137.06,15.26 155.8,-3.49 186.2,-3.49 204.94,15.26 Z M 204.94,15.26" />
<g id="group3" filter="url(#shadow-outer)">
<rect id="rectangle6" stroke="none" fill="rgb(45, 153, 153)" x="4" y="211.6" width="96" height="96" />
</g>
<g id="group4" filter="url(#shadow-outer)">
<rect id="rectangle8" stroke="none" fill="rgb(77, 115, 0)" x="123" y="211.6" width="96" height="96" />
</g>
<g id="group5" filter="url(#shadow-outer)">
<path id="bezier47" stroke="none" fill="rgb(21, 121, 120)" d="M 242,210.6 L 338,210.6 338,306.6 242,306.6 242,210.6 Z M 242,210.6" />
</g>
<g id="group6" filter="url(#shadow-outer)">
<rect id="rectangle11" stroke="none" fill="rgb(129, 188, 31)" x="361" y="211.6" width="96" height="96" />
</g>
<path id="bezier48" stroke="none" fill="rgb(123, 0, 0)" d="M 48.78,99.87 L 55.22,99.87 55.22,117.63 62,117.63 52,137.6 42,117.63 48.78,117.63 48.78,99.87 Z M 48.78,99.87" />
<path id="bezier50" stroke="none" fill="rgb(123, 0, 0)" d="M 167.78,99.87 L 174.22,99.87 174.22,117.63 181,117.63 171,137.6 161,117.63 167.78,117.63 167.78,99.87 Z M 167.78,99.87" />
<g id="group2">
<path id="bezier6" stroke="none" fill="rgb(184, 234, 82)" d="M 202,228.03 C 201.98,227.93 201.92,227.84 201.83,227.79 L 200.52,227.03 C 200.95,226.5 201.35,225.98 201.72,225.52 200.82,221.82 196.66,221.35 196.66,221.35 L 195.38,223.11 194.37,222.13 C 194.3,222.05 194.2,222.02 194.09,222.03 193.99,222.03 193.89,222.08 193.83,222.17 L 193.07,223.17 C 193.01,223.25 192.98,223.36 193.01,223.46 193.02,223.54 193.07,223.62 193.14,223.67 193.15,223.68 193.16,223.69 193.18,223.7 L 194.43,224.43 193.54,225.65 192.47,224.62 C 192.4,224.55 192.3,224.51 192.2,224.52 192.09,224.53 192,224.58 191.93,224.66 L 191.17,225.66 C 191.11,225.75 191.09,225.85 191.11,225.95 191.12,226.04 191.17,226.12 191.24,226.17 191.25,226.18 191.27,226.19 191.28,226.2 L 192.59,226.96 191.66,228.23 190.56,227.15 C 190.48,227.07 190.38,227.04 190.28,227.05 190.17,227.05 190.08,227.11 190.02,227.19 L 189.25,228.19 C 189.19,228.27 189.17,228.38 189.19,228.48 189.21,228.57 189.25,228.64 189.32,228.7 189.34,228.71 189.35,228.71 189.36,228.72 L 190.81,229.57 C 190.84,229.58 190.86,229.59 190.88,229.59 L 189.94,232.35 192.86,234.57 195.52,233.03 C 195.53,233.1 195.56,233.16 195.61,233.21 L 196.82,234.39 C 196.83,234.4 196.84,234.41 196.85,234.41 196.92,234.47 197.01,234.49 197.1,234.49 197.2,234.48 197.29,234.43 197.36,234.35 L 198.12,233.34 C 198.18,233.26 198.2,233.16 198.18,233.06 198.16,232.95 198.1,232.87 198.01,232.81 L 196.56,231.97 C 196.55,231.97 196.55,231.97 196.54,231.96 196.83,231.62 197.17,231.2 197.56,230.72 L 198.74,231.86 C 198.75,231.87 198.76,231.88 198.77,231.89 198.84,231.94 198.93,231.97 199.01,231.96 199.12,231.95 199.21,231.9 199.28,231.82 L 200.04,230.82 C 200.1,230.74 200.12,230.63 200.1,230.53 200.08,230.43 200.02,230.34 199.93,230.29 L 198.56,229.49 C 198.87,229.1 199.2,228.69 199.52,228.29 L 200.63,229.36 C 200.64,229.37 200.65,229.38 200.67,229.39 200.73,229.44 200.82,229.47 200.91,229.46 201.02,229.46 201.11,229.41 201.17,229.32 L 201.93,228.32 C 201.99,228.24 202.02,228.13 202,228.03 Z M 192.75,230.06 C 192.53,230.33 192.13,230.39 191.85,230.18 191.57,229.96 191.52,229.56 191.73,229.28 191.95,229 192.34,228.95 192.63,229.16 192.91,229.37 192.96,229.77 192.75,230.06 Z M 194.67,227.53 C 194.45,227.81 194.05,227.86 193.77,227.65 193.49,227.44 193.44,227.04 193.65,226.76 193.86,226.47 194.26,226.42 194.54,226.63 194.83,226.85 194.88,227.25 194.67,227.53 Z M 195.55,224.26 C 195.76,223.98 196.16,223.93 196.44,224.14 196.72,224.35 196.78,224.75 196.56,225.03 196.35,225.31 195.95,225.37 195.67,225.15 195.39,224.94 195.33,224.54 195.55,224.26 Z M 195.46,232.12 C 195.25,232.4 194.85,232.45 194.57,232.24 194.29,232.03 194.23,231.63 194.45,231.35 194.66,231.06 195.06,231.01 195.34,231.22 195.62,231.43 195.68,231.84 195.46,232.12 Z M 197.38,229.59 C 197.17,229.87 196.77,229.93 196.49,229.71 196.21,229.5 196.15,229.1 196.37,228.82 196.58,228.54 196.98,228.48 197.26,228.7 197.54,228.91 197.6,229.31 197.38,229.59 Z M 199.28,227.1 C 199.07,227.38 198.67,227.43 198.38,227.22 198.1,227 198.05,226.6 198.26,226.32 198.47,226.04 198.88,225.99 199.16,226.2 199.44,226.41 199.49,226.82 199.28,227.1 Z M 199.28,227.1" />
<path id="bezier8" stroke="none" fill="rgb(184, 234, 82)" d="M 172.53,262.11 L 192.26,235.21 189.47,233.1 171.4,256.05 C 171.24,255.91 171.08,255.77 170.93,255.64 166.35,251.92 162.57,251.23 159.59,254.27 157.66,256.24 157.72,258.02 156.87,259.45 152.26,267.15 145.88,265.62 140.92,270.9 137.21,274.84 137.49,280.41 139.2,283.49 143.7,291.58 158.04,301.68 165.5,293.8 170.41,288.62 169.75,283.63 171.18,278.78 171.65,277.19 172.96,274.76 174.39,273.37 175.22,272.56 177.48,272.3 178.25,270.26 179.44,267.14 171.77,265.48 172.53,262.11 Z M 159.96,266.37 C 161.39,264.5 164.06,264.14 165.93,265.56 167.8,266.98 168.17,269.65 166.74,271.53 165.32,273.4 162.65,273.77 160.78,272.34 158.9,270.92 158.54,268.25 159.96,266.37 Z M 160.54,284.69 L 150.3,276.91 151.57,275.25 161.81,283.03 160.54,284.69 Z M 165.56,282.39 C 164.44,282.75 163.89,282.87 161.94,281.43 160.45,280.14 159.77,279.04 161.31,276.59 162.4,275.17 163.38,274.58 164.61,274.72 165.86,274.73 169.26,273.3 169.58,269.09 169.53,268.05 170.39,267.94 170.85,270.52 170.85,270.52 171.97,278.7 165.56,282.39 Z M 165.56,282.39" />
</g>
<g id="group">
<path id="bezier2" stroke="none" fill="rgb(9, 74, 74)" d="M 44.5,225.68 C 41.85,225.64 38.96,227.26 38.03,230.21 37.99,230.34 37.31,232.34 37.27,232.49 L 31.69,232.49 C 33.93,233.97 34.67,234.36 36.91,234.36 37.28,234.36 38.79,234.35 39.16,233.24 39.27,232.91 40.04,230.7 40.19,230.4 40.85,229.07 41.87,228.09 43.13,228.09 44.68,228.09 44.75,229.56 44.63,231.06 L 40.53,280.68 C 39.97,287.48 45.38,294 53.96,294 58.84,294 61.95,292.44 63.52,287.78 65.09,283.11 62.71,274.46 68.52,272.53 L 56.19,260.3 C 51.82,264.46 52.35,273.32 53.2,278.83 53.37,279.93 53.22,283.26 51.73,283.26 50.24,283.26 49.63,280.55 49.62,279.29 L 49.48,231.06 C 49.56,227.42 47.15,225.73 44.5,225.68 Z M 46.27,252.35 C 47.19,252.35 47.96,253.09 47.96,254.01 47.96,254.93 47.19,255.68 46.27,255.68 45.34,255.68 44.6,254.93 44.6,254.01 44.6,253.09 45.34,252.35 46.27,252.35 Z M 46.02,258.82 C 46.95,258.82 47.69,259.58 47.69,260.5 47.69,261.42 46.95,262.15 46.02,262.15 45.09,262.15 44.33,261.42 44.33,260.5 44.33,259.58 45.1,258.82 46.02,258.82 Z M 45.75,265.31 C 46.68,265.31 47.42,266.05 47.42,266.97 47.42,267.89 46.68,268.64 45.75,268.64 44.83,268.64 44.06,267.89 44.06,266.97 44.06,266.05 44.83,265.31 45.75,265.31 Z M 45.75,265.31" />
<path id="bezier4" stroke="none" fill="rgb(9, 74, 74)" d="M 72.19,272.71 L 72.5,272.4 C 72.85,272.05 72.85,271.49 72.5,271.14 L 57.15,255.9 C 56.8,255.56 56.23,255.56 55.88,255.9 L 55.56,256.22 C 55.22,256.56 55.22,257.13 55.56,257.47 L 70.92,272.71 C 71.27,273.06 71.84,273.06 72.19,272.71 Z M 72.19,272.71" />
</g>
<g id="group13">
<path id="bezier62" stroke="none" fill="rgb(79, 114, 15)" d="M 410.38,275.55 C 410.34,275.6 410.38,275.64 410.38,275.69 L 410.26,275.71 410.26,277.9 411.13,278.61 413.79,278.12 413.79,275.93 413.6,275.56 C 413.6,275.55 413.64,275.55 413.64,275.55 413.41,274.76 414.12,262.98 414.37,258.78 412.7,259.05 411.11,259.3 409.74,259.52 410.08,263.74 410.93,275 410.38,275.55 Z M 410.38,275.55" />
<path id="bezier63" stroke="none" fill="rgb(79, 114, 15)" d="M 391.32,254.86 C 391.53,257.41 392.31,267.38 391.86,267.83 391.82,267.87 391.7,267.9 391.71,267.94 L 391.57,267.94 391.57,269.62 392.4,270.17 394.6,269.79 394.6,268.11 394.3,267.61 C 394.23,266.23 394.66,259.55 394.87,256.2 L 391.32,254.86 Z M 391.32,254.86" />
<path id="bezier64" stroke="none" fill="rgb(79, 114, 15)" d="M 429.96,266.96 C 429.91,267.01 429.93,267.04 429.93,267.08 L 429.95,267.07 429.95,268.92 430.72,269.52 432.98,269.1 432.98,267.26 432.64,266.71 C 432.57,265.34 432.93,259.32 433.17,255.46 432.19,255.64 430.91,255.89 429.62,256.13 429.93,260.39 430.33,266.59 429.96,266.96 Z M 429.96,266.96" />
<path id="bezier65" stroke="none" fill="rgb(79, 114, 15)" d="M 431.43,242.17 C 427.61,242.91 421.91,243.69 414.94,244.43 413.72,244.56 413.41,244.9 413.38,245.06 L 413.4,245.08 413.39,245.08 C 413.39,245.58 413.38,247.09 413.15,247.93 L 413.15,247.97 C 412.36,250.47 410.73,250.75 408.25,251.14 407.97,251.19 407.66,251.25 407.34,251.3 L 407.28,251.31 C 404.82,251.48 404.4,252.58 404.4,255.78 404.4,258.01 404.77,258.83 404.99,259.11 405.16,259.14 405.34,259.16 405.53,259.16 406.6,259.16 419.73,256.96 423.92,256.25 424.72,256.12 434.74,254.22 434.74,254.22 434.74,254.22 434.91,245.05 434.96,241.36 435.13,241.31 433.16,241.84 431.43,242.17 Z M 431.43,242.17" />
<path id="bezier66" stroke="none" fill="rgb(79, 114, 15)" d="M 433.54,239.63 C 431.56,239.48 413.36,239.19 407.98,239.07 407.6,239.07 407.21,239.06 406.82,239.06 401.05,239.06 393.15,239.87 392.46,239.92 391.73,239.98 392.03,241.69 391.89,243.13 391.75,244.56 389.99,244.98 389.99,244.98 389.99,244.98 387.69,245.49 386.06,245.8 384.43,246.11 384.5,246.84 384.5,246.84 L 384.5,248.75 384.5,248.86 384.5,251.31 C 384.5,251.31 403.14,258.3 403.48,258.44 403.45,258.24 403.23,257.25 403.23,255.78 403.23,254.62 403.28,253.54 403.56,252.63 L 388.04,247.85 388.04,247.41 391.95,246.4 C 391.95,246.4 401.41,249.13 405.92,250.14 L 405.92,250.14 C 408.07,250.14 407.78,249.93 408.07,249.89 409.59,249.64 410.52,249.54 411.14,249.04 L 394.62,244.95 C 394.07,244.81 393.64,244.27 393.64,243.71 L 393.64,241.94 C 393.64,241.68 393.73,241.45 393.89,241.28 394.1,241.08 394.4,240.99 394.71,241.05 L 412.3,244.52 C 412.31,244.52 412.33,244.52 412.35,244.53 412.39,244.44 412.45,244.34 412.53,244.24 412.94,243.71 413.71,243.37 414.82,243.25 421.4,242.55 426.67,241.85 430.48,241.15 432.8,240.73 433.99,240.38 435,240.12 435,240.09 435,240.07 435,240.05 435,240.06 434.99,239.89 434.45,239.76 434.27,239.72 433.7,239.64 433.54,239.63 Z M 433.54,239.63" />
</g>
<g id="g4977">
<path id="bezier10" stroke="none" fill="rgb(54, 153, 152)" d="M 252.65,248.11 L 252.71,255.03 C 254.32,255.02 255.65,253.95 256.06,252.49 L 267.5,252.42 C 266.7,253.49 266.23,254.79 266.24,256.22 266.27,259.74 269.23,262.61 272.82,262.58 L 294.94,262.42 302.32,262.36 308.79,262.3 C 312.38,262.28 315.28,259.38 315.25,255.85 315.24,254.44 314.75,253.13 313.94,252.07 L 318.47,252.03 C 322.56,253.96 324.6,262.38 324.6,262.38 324.78,263.04 325.28,263.02 325.27,262.37 L 325.17,250.7 325.09,239.67 C 325.08,239.02 324.59,239.02 324.43,239.66 324.43,239.66 322.52,247.47 318.32,249.54 L 309.83,249.59 272.05,249.79 255.74,249.87 C 255.13,248.81 253.97,248.09 252.65,248.1 L 252.65,248.11 Z M 271.58,252.54 C 271.88,252.45 272.18,252.4 272.5,252.38 L 295.95,252.2 C 295.95,252.2 299.49,252.26 301.14,252.25 303.31,252.23 305.03,253.89 305.05,256.03 305.06,257.87 303.8,259.39 302.05,259.77 L 301.99,259.79 272.78,259.98 C 270.61,260 268.91,258.33 268.89,256.2 268.88,254.46 270,253.03 271.58,252.54 Z M 306.3,252.13 L 309.13,252.12 C 311.1,252.3 312.59,253.89 312.6,255.88 312.62,258.02 310.93,259.71 308.76,259.73 L 306.48,259.74 C 307.25,258.68 307.71,257.39 307.7,256 307.69,254.54 307.16,253.2 306.3,252.13 L 306.3,252.13 Z M 306.3,252.13" />
<path id="bezier49" stroke="none" fill="rgb(54, 153, 152)" d="M 282.99,248.74 L 284.65,248.74 C 284.96,248.74 285.21,248.98 285.21,249.28 L 285.27,262.42 C 285.27,262.72 285.03,262.97 284.72,262.97 L 283.06,262.98 C 282.75,262.98 282.5,262.74 282.5,262.44 L 282.44,249.29 C 282.43,248.99 282.68,248.75 282.99,248.74 Z M 282.99,248.74" />
<path id="bezier51" stroke="none" fill="rgb(54, 153, 152)" d="M 287.86,248.72 L 289.52,248.71 C 289.83,248.71 290.07,248.95 290.08,249.26 L 290.14,262.4 C 290.14,262.7 289.89,262.95 289.59,262.95 L 287.92,262.96 C 287.62,262.96 287.37,262.71 287.37,262.41 L 287.3,249.27 C 287.3,248.97 287.55,248.72 287.86,248.72 Z M 287.86,248.72" />
<path id="bezier53" stroke="none" fill="rgb(54, 153, 152)" d="M 292.72,248.7 L 294.39,248.69 C 294.69,248.69 294.94,248.93 294.94,249.23 L 295.01,262.38 C 295.01,262.68 294.76,262.92 294.45,262.92 L 292.79,262.93 C 292.48,262.93 292.24,262.69 292.23,262.39 L 292.17,249.25 C 292.17,248.94 292.41,248.7 292.72,248.7 Z M 292.72,248.7" />
<path id="bezier55" stroke="none" fill="rgb(54, 153, 152)" d="M 283.81,247.61 C 283.98,247.61 284.12,247.75 284.12,247.91 L 284.13,249.15 C 284.13,249.32 283.99,249.45 283.82,249.45 283.65,249.46 283.52,249.32 283.52,249.16 L 283.51,247.91 C 283.51,247.75 283.65,247.61 283.81,247.61 Z M 283.81,247.61" />
<path id="bezier56" stroke="none" fill="rgb(54, 153, 152)" d="M 288.68,247.5 C 288.85,247.5 288.99,247.64 288.99,247.8 L 288.99,249.04 C 288.99,249.21 288.86,249.35 288.69,249.35 288.52,249.35 288.38,249.21 288.38,249.05 L 288.38,247.81 C 288.38,247.64 288.51,247.51 288.68,247.5 Z M 288.68,247.5" />
<path id="bezier57" stroke="none" fill="rgb(54, 153, 152)" d="M 293.55,247.48 C 293.72,247.48 293.85,247.61 293.85,247.78 L 293.86,249.02 C 293.86,249.19 293.73,249.32 293.56,249.32 293.39,249.32 293.25,249.19 293.25,249.02 L 293.24,247.78 C 293.24,247.62 293.38,247.48 293.55,247.48 Z M 293.55,247.48" />
<path id="bezier58" stroke="none" fill="rgb(54, 153, 152)" d="M 282.2,247.24 L 285.42,247.22 C 285.64,247.22 285.82,247.39 285.82,247.6 285.82,247.82 285.65,247.99 285.43,247.99 L 282.2,248.01 C 281.99,248.01 281.81,247.84 281.81,247.62 281.81,247.41 281.98,247.24 282.2,247.24 Z M 282.2,247.24" />
<path id="bezier59" stroke="none" fill="rgb(54, 153, 152)" d="M 287.07,247.21 L 290.29,247.2 C 290.51,247.2 290.68,247.37 290.69,247.58 290.69,247.79 290.51,247.97 290.29,247.97 L 287.07,247.98 C 286.85,247.98 286.68,247.81 286.68,247.6 286.68,247.39 286.85,247.21 287.07,247.21 Z M 287.07,247.21" />
<path id="bezier60" stroke="none" fill="rgb(54, 153, 152)" d="M 291.93,247.19 L 295.16,247.17 C 295.38,247.17 295.55,247.34 295.55,247.56 295.55,247.77 295.38,247.94 295.16,247.94 L 291.94,247.96 C 291.72,247.96 291.55,247.79 291.54,247.58 291.54,247.36 291.72,247.19 291.93,247.19 Z M 291.93,247.19" />
</g>
<text fill="rgb(68, 68, 68)" font-size="16" x="535.82" y="134">
<tspan x="535.82" y="150">selection of </tspan>
</text>
<text fill="rgb(68, 68, 68)" font-size="16" x="545.17" y="154">
<tspan x="545.17" y="170">4 objects</tspan>
</text>
<text fill="rgb(68, 68, 68)" font-size="16" x="140.94" y="39">
<tspan x="140.94" y="55">&lt;circle&gt;</tspan>
</text>
<text fill="rgb(68, 68, 68)" font-size="16" x="21.44" y="39">
<tspan x="21.44" y="55">&lt;circle&gt;</tspan>
</text>
</svg>
<figcaption><span class="lgcp">D3</span>.js selections keep track of page content that doesn't exist (yet).</figcaption>
</figure>

Our code fragment is an even more extreme example. When it executes, there are absolutely no circles on the page. There are, however, values in the `nodes` array that we're telling <span class="smcp">D3</span>.js to use as data. <span class="lgcp">D3</span>.js, therefore, creates an object for each of those data values. It just won't have a `<circle>` element to go with them.

(Take a breath because magic is about to happen.)

Now we can look at the second statement in our code fragment. It starts out `selection.enter()`. The `enter()` function is a special <span class="smcp">D3</span>.js function. It tells <span class="smcp">D3</span>.js to search through the selection and find all of the objects that have a data value _but no markup element._ We then complete the statement by taking that subset of the selection and calling `append("circle")`. And with that function call <span class="smcp">D3</span>.js will take any object in the selection without a markup element and create a circle for it. That's how we add `<circle>` elements to the graph.

To be a little more concise, we can combine our two statements into a single one. The effect, for our visualization is to create a `<circle>` within the `<svg>` container for every node in the graph.

``` {.javascript .numberLines}
var nodeSelection = svg.selectAll("circle")
    .data(nodes)
    .enter().append("circle");
```

### Step 5: Draw the Graph's Edges

You won't be surprised to find that adding the edges to the graph works just like adding nodes. We simply append `<line>` elements instead of circles.

``` {.javascript .numberLines}
var edgeSelection = svg.selectAll("line")
    .data(edges)
    .enter().append("line");
```

> Even though we won't need to use them for this example, <span class="smcp">D3</span>.js has other functions that complement the `enter()` function. To find objects that have a markup element but no data value, you can use the function `exit()`. And to find objects that have a markup element with a data value that has changed, you can use the function `update()`. The names _enter_ and _exit_ derive from a theater metaphor that <span class="smcp">D3</span>.js associates with a visualization. The `enter()` subset represents those elements that are _entering_ the stage, while the `exit()` subset represents elements leaving, or _exiting,_ the stage.

Because we're using <span class="smcp">SVG</span> elements for both the nodes and the edges, we can use <span class="smcp">CSS</span> rules to style them. That's especially important for the edges because, by default, <span class="smcp">SVG</span> lines have a stroke width of 0.

``` {.css .numberLines}
circle {
    fill: #ccc;
    stroke: #fff;
    stroke-width: 1px;
}

line {
    stroke: #777;
    stroke-width: 1px;
}
```

### Step 6: Position the Elements

At this point we've added the necessary markup elements to our visualization, but we haven't given them any dimensions or positions. As we've noted before, <span class="smcp">D3</span>.js doesn't do any drawing, so we'll have to write the code to do it. As noted in step 2, we did assign somewhat arbitrary positions to the nodes by arranging them in a circle. For now, we can use that to position them.

To position an <span class="smcp">SVG</span> circle we set its `cx` and `cy` attributes to correspond to the circle's center. We also specify the circle's radius with the `r` attribute. Let's start with the radius; we'll set it to a fixed value for all nodes. We've already created a <span class="smcp">D3</span>.js selection for all of those nodes. Setting their `r` attributes is a simple statement.

``` {.javascript .numberLines}
nodeSelection.attr('r', 10);
```

The `cx` and `cy` values are a little trickier because they're not the same for all of the nodes. Those values depend on properties of the data associated with the nodes. More specifically, each element in the `nodes` array has `x` and `y` properties. <span class="lgcp">D3</span>.js, however, makes it very easy to access those properties. Instead of providing constant values for the attributes, we provide functions. <span class="lgcp">D3</span>.js will then call those functions and pass the data values as parameters. Our functions can return the appropriate value for the attribute.

``` {.javascript .numberLines}
nodeSelection
    .attr('r', 10)
    .attr('cx', function(dataValue) { return dataValue.x; })
    .attr('cy', function(dataValue) { return dataValue.y; });
```

Positioning the edges relies on a similar strategy. We want to set the endpoints of the lines to the centers of the corresponding nodes. Those endpoints are the `x1,y1` and `x2,y2` attributes of the `<line>` elements. Here's the code to set those attributes. As is conventional with <span class="smcp">D3</span>.js, the parameter `d` is the data value.

``` {.javascript .numberLines}
edgeSelection
    .attr('x1', function(d) { return nodes[d.source].x; })
    .attr('y1', function(d) { return nodes[d.source].y; })
    .attr('x2', function(d) { return nodes[d.target].x; })
    .attr('y2', function(d) { return nodes[d.target].y; });
```

With the elements finally drawn and positioned, we have the first version of our visualization with figure NEXTFIGURENUMBER.

<style>
circle {
    fill: #ccc;
    stroke: #fff;
    stroke-width: 1px;
}

line {
    stroke: #777;
    stroke-width: 1px;
}
</style>

<figure>
<div style="position:relative;left:-100px" id='figure1'></div>
<figcaption><span class="lgcp">D3</span>.js provides tools to help draw the circles and lines for a network graph.</figcaption>
</figure>

### Step 7: Add Force-Direction to the Graph

The graph has all the essential components, but its layout doesn't make identifying the connections as easy as we'd like. In chapter 4's example the sigmajs library could automate the layout with only took a couple of lines of JavaScript. To perform that automation, sigmajs uses a force-direction algorithm. Force-direction treats nodes as physical object and simulates the effect of forces such as gravity and electromagnetism.

With <span class="smcp">D3</span>.js we cannot rely on the library to fully automate the layout. As we've seen, <span class="smcp">D3</span>.js does not draw any of the graph elements, so it cannot, by itself, set positions and dimensions. <span class="lgcp">D3</span>.js does, however, provide a lot of tools to help us create our own graph layouts. One of those tools is the _force layout._ As you might expect, the force layout tool helps us draw our own force-directed graph. It handles all of the messy and complex calculations that underly force-direction and gives us results we can use directly in code that draws the graph.

To get started with the layout, we define a new `force` object. That object accepts many configuration parameters, but only five are essential for our visualization.

* the dimensions of the graph
* the nodes in the graph
* the edges in the graph
* the distance we'd like to see between connected nodes
* how strongly nodes repel each other, a parameter <span class="smcp">D3</span>.js calls _charge_

The last parameter can take a bit of trial-and-error to optimize for any particular visualization. In our case we'll want to increase it substantially above its default (-30) because we have a lot of nodes in a small space. (Negative charge values indicate repulsion.) Here's the code to set all of those values.

``` {.javascript .numberLines}
var force = d3.layout.force()
    .size([width, height])
    .nodes(nodes)
    .links(edges)
    .linkDistance(40)
    .force(-500);
```

When we tell <span class="smcp">D3</span>.js to start its force-direction calculations, it will generate events at intermediate steps and when the calculations complete. Force-direction often takes several seconds to execute fully, and if we wait until the calculations are complete before we draw the graph, our users may think the browser has frozen. It's usually better to update the graph at each iteration so users see some indication of progress. To do that, we can add a function to respond to the intermediate force layout calculations. That happens on a <span class="smcp">D3</span>.js `tick` event.

``` {.javascript .numberLines}
force.on('tick', function() {
    // Update graph with intermediate results
});
```

Each time <span class="smcp">D3</span>.js calls our event handler function, it will have updated the `x` and `y` properties of the `nodes` array. The new values will reflect how the force-direction has nudged the nodes on the graph's stage. We can update our graph accordingly by changing the <span class="smcp">SVG</span> attributes of the circles and lines. Before we do that, however, we can take advantage of the fact that <span class="smcp">D3</span>.js is giving us an opportunity to tweak the force-layout algorithm as it executes. One problem that we may encounter, especially with the large charge force we defined, is that nodes may repel each other so strongly that some tend to drift off the stage entirely. We can prevent that by ensuring that the node positions remain within the dimensions of the graph.

``` {.javascript .numberLines}
force.on('tick', function() {
	nodeSelection.each(function(node) {
	    node.x = Math.max(node.x, 5);
	    node.y = Math.max(node.y, 5);
	    node.x = Math.min(node.x, width-5);
	    node.y = Math.min(node.y, height-5);
	});
	// Update graph with intermediate results
});
```

We've added or subtracted `5` in the above fragment to account for the radius of the nodes' circles.

Once we've adjusted the nodes' properties to keep them on the stage, we can update their positions. The code is exactly the same as the code we used to position them initially.


``` {.javascript .numberLines}
nodeSelection
    .attr('cx', function(d) { return d.x; })
    .attr('cy', function(d) { return d.y; });
```

We'll also want to adjust the end points of our edge lines. For these objects, however, there's a small twist. When we initialized the `edges` array, we set the `source` and `target` properties to the indices of the respective nodes in the `nodes` array. When the <span class="smcp">D3</span>.js force layout begins execution, it replaces those indices with direct references to the nodes themselves. That makes it a little easier for us to find the appropriate coordinates for the lines.

``` {.javascript .numberLines}    
edgeSelection
    .attr('x1', function(d) { return d.source.x; })
    .attr('y1', function(d) { return d.source.y; })
    .attr('x2', function(d) { return d.target.x; })
    .attr('y2', function(d) { return d.target.y; });
```


With our function ready to handle updates from the force-direction calculations, we can tell <span class="smcp">D3</span>.js to start its work. That's a simple method of the `force` object.

``` {.javascript .numberLines}
force.start();
```

With that statement the graph begins an animated transition to its final, force-directed state as figure NEXTFIGURENUMBER shows.

<figure>
<div id='figure2'></div>
<figcaption>The <span class="smcp">D3</span>.js force layout provides the information to reposition network graph elements.</figcaption>
</figure>

### Step 8: Add Interactivity

Since <span class="smcp">D3</span>.js is a JavaScript library, you would expect it to support interactions with the user. It does, and to demonstrate we can add a simple interaction to the graph. When a user clicks on one of the nodes in the graph, we can emphasize that node and its neighbors.

Event handlers in <span class="smcp">D3</span>.js closely resemble those in other JavaScript libraries such as jQuery. We define an event handler using the `on()` method of a selection, as in the following code.

``` {.javascript .numberLines}
nodeSelection.on('click', function(d) {
    // Handle the click event
});
```

The first parameter to `on()` is the event type, and the second parameter is a function that <span class="smcp">D3</span>.js will call when the event occurs. The parameter to this function is the data object that corresponds to the selection element, and by convention it's named `d`. Because we're adding the event to the selection of nodes (`nodeSelection`), `d` will be one of the graph nodes.

For our visualization we'll emphasize the clicked node by added a <span class="smcp">CSS</span>-accessible class to the corresponding `<circle>` and by increasing the circle's size. The class makes it possible to style the circle uniquely, but a circle's size cannot be specified with <span class="smcp">CSS</span> rules. Ultimately, therefore, we have to do two things to the circle: add the `selected` class and increase the radius using the `r` attribute. Of course, in order to do either we have to select the `<circle>` element. When <span class="smcp">D3</span>.js calls an event handler, it sets `this` equal to the target of the event; we can turn that target into a selection with `d3.select(this)`. The following code, therefore, is all it takes to change the clicked node's circle.

``` {.javascript .numberLines}
 d3.select(this)
    .classed('selected', true)
    .attr('r', 1.5*nodeRadius);
```

We can do something similar by adding a `selected` class to all the edges that connect to the clicked node. To find those edges we can iterate through the full edge selection. <span class="lgcp">D3</span>.js has the `each()` function to do just that. As we look at each edge we check the `source` and `target` properties to see if either matches our clicked node. When we find a match, we add the `selected` class to the edge. Note that in line 3 we're once again using `d3.select(this)`. In this case the code is inside of the `each()` function, so `this` will equal the particular element of the current iteration. In our case that's the `<line>` for the edge.

``` {.javascript .numberLines .line-3}
edgeSelection.each(function(edge) {
    if ((edge.source === d) || (edge.target === d)) {
        d3.select(this).classed('selected',true);
    }
});
```

That code handles setting the `selected` class, but we still need to remove it when appropriate. We can remove it from all the other circles (and make sure their radius is restored to its default value) by operating on the node selection. Other than line 2 below, the code looks the same as we've seen before. In line 2 we use the <span class="smcp">D3</span>.js `filter()` function to limit the selection to the nodes other than the one that was clicked.

``` {.javascript .numberLines .line-2}
nodeSelection
    .filter(function(node) { return node !== d; })
    .classed('selected', false)
    .attr('r', nodeRadius);
```

A similar process resets the `selected` class on all the edges. We can remove the class from all edges first, before we add to the appropriate edges in the previous code fragment. Here's the code that removes it. With <span class="smcp">D3</span>.js it only takes a single line.

``` {.javascript .numberLines}
edgeSelection.classed('selected', false);
```

And finally, if the user clicks on a node that's already selected, we can restore it to it's default state.

``` {.javascript .numberLines}
    d3.select(this)
        .classed('selected', true)
        .attr('r', 1.5*nodeRadius);
```

When you put all of the above code fragments together, you have the complete event handler below.

``` {.javascript .numberLines}
nodeSelection.on('click', function(d) {

    nodeSelection
        .filter(function(node) { return node !== d; })
        .classed('selected', false)
        .attr('r', nodeRadius);

    edgeSelection.classed('selected', false);

    if (d3.select(this).classed('selected')) {
        d3.select(this)
            .classed('selected', false)
            .attr('r', nodeRadius)

    } else {
        d3.select(this)
            .classed('selected', true)
            .attr('r', 1.5*nodeRadius);
       
       edgeSelection.each(function(edge) {
            if ((edge.source === d) || (edge.target === d)) {
                d3.select(this).classed('selected',true);
            }
       });
    }
});
```

Along with a bit of <span class="smcp">CSS</span> styling to emphasize the selected circles and lines, this code results in the interactive visualization of NEXTFIGURENUMBER.

<style>
#figure3 circle, #figure3 line { cursor: pointer; }
#figure3 circle.selected { fill: #97aceb; }
#figure3 line { stroke: #aaa; stroke-width: 2px; }
#figure3 line.selected { stroke: #6B7DB8; }
</style>

<figure>
<div id='figure3'></div>
<figcaption><span class="lgcp">D3</span>.js includes functions to make visualizations interactive.</figcaption>
</figure>


### Step 9: The Sky's the Limit

So far our example has explored many of the features that <span class="smcp">D3</span>.js provides for custom visualizations. The code so far, however, has only scratched the surface of <span class="smcp">D3</span>'s capabilities. We haven't added labels to our graph, nor have we animated the transitions in the graph's state. In fact, it's a pretty safe bet that if there is anything we want to add to the visualization, <span class="smcp">D3</span>.js has tools to help. And although we don't have the time or space to consider other enhancements here, the source code for the book does include a more full-featured implementation that takes advantage of other <span class="smcp">D3</span>.js capabilities.


<script>
;(function(){

    draw = function() {

		var albums = [
		  {
		    album: "Miles Davis - Kind of Blue",
		    musicians: [
		      "Cannonball Adderley",
		      "Paul Chambers",
		      "Jimmy Cobb",
		      "John Coltrane",
		      "Miles Davis",
		      "Bill Evans"
		    ]
		  },{
		    album: "John Coltrane - A Love Supreme",
		    musicians: [
		      "John Coltrane",
		      "Jimmy Garrison",
		      "Elvin Jones",
		      "McCoy Tyner"
		    ]
		  },{
		    album: "The Dave Brubeck Quartet - Time Out",
		    musicians: [
		      "Dave Brubeck",
		      "Paul Desmond",
		      "Joe Morello",
		      "Eugene Write"
		    ]
		  },{
		    album: "Duke Ellington - Ellington at Newport",
		    musicians: [
		      "Harry Carney",
		      "John Willie Cook",
		      "Duke Ellington",
		      "Paul Gonsalves",
		      "Jimmy Grissom",
		      "Jimmy Hamilton",
		      "Johnny Hodges",
		      "Quentin Jackson",
		      "William Anderson",
		      "Ray Nance",
		      "Russell Procope",
		      "John Sanders",
		      "Clark Terry",
		      "James Woode",
		      "Britt Woodman",
		      "Sam Woodyar"
		    ]
		  },{
		    album: "The Quintet - Jazz at Massey Hall",
		    musicians: [
		      "Dizzy Gillespie",
		      "Charles Mingus",
		      "Charlie Parker",
		      "Bud Powell",
		      "Max Roach"
		    ]
		  },{
		    album: "Louis Armstrong - The Best of the Hot Five and Hot Seven Recordings",
		    musicians: [
		      "Lil Hardin Armstrong",
		      "Louis Armstrong",
		      "Clarence Babcock",
		      "Pete Briggs",
		      "Mancy Carr",
		      "Baby Dodds",
		      "Johnny Dodds",
		      "Earl Hines",
		      "Kid Ory",
		      "Don Redman",
		      "Fred Robinson",
		      "Zutty Singleton",
		      "Johnny St. Cyr",
		      "Jimmy Strong",
		      "John Thomas",
		      "Dave Wilborn"
		    ]
		  },{
		    album: "John Coltrane - Blue Trane",
		    musicians: [
		      "Paul Chambers",
		      "John Coltrane",
		      "Kenny Drew",
		      "Curtis Fuller",
		      "Philly Joe Jones",
		      "Lee Morgan"
		    ]
		  },{
		    album: "Stan Getz and João Gilberto - Getz/Gilberto",
		    musicians: [
		      "Milton Banana",
		      "Stan Getz",
		      "Astrud Gilberto",
		      "João Gilberto",
		      "Antonio Carlos Jobim",
		      "Sebastião Neto"
		    ]
		  },{
		    album: "Charles Mingus - Mingus Ah Um",
		    musicians: [
		      "Willie Dennis",
		      "Booker Ervin",
		      "Shafi Hadi",
		      "John Handy",
		      "Jimmy Knepper",
		      "Charles Mingus",
		      "Horace Parlan",
		      "Dannie Richmond"
		    ]
		  },{
		    album: "Erroll Garner - Concert by the Sea",
		    musicians: [
		     "Denzil Best",
		      "Eddie Calhoun",
		      "Erroll Garner"
		    ]
		  },{
		    album: "Miles Davis - Bitches Brew",
		    musicians: [
		      "Don Alias",
		      "Harvey Brooks",
		      "Billy Cobham",
		      "Chick Corea",
		      "Miles Davis",
		      "Jack DeJohnette",
		      "Dave Holland",
		      "Bennie Maupin",
		      "John McLaughlin",
		      "Airto Moreira",
		      "Juma Santos",
		      "Wayne Shorter",
		      "Lenny White",
		      "Larry Young",
		      "Joe Zawinul"
		    ]
		  },{
		    album: "Sonny Rollings - Saxophone Colossus",
		    musicians: [
		      "Tommy Flanagan",
		      "Sonny Rollins",
		      "Max Roach",
		      "Doug Watkins"
		    ]
		  },{
		    album: "Art Blakey and The Jazz Messengers - Moanin'",
		    musicians: [
		      "Art Blakey",
		      "Lee Morgan",
		      "Benny Golson",
		      "Bobby Timmons",
		      "Jymie Merritt"
		    ]
		  },{
		    album: "Clifford Brown and Max Roach",
		    musicians: [
		      "Clifford Brown",
		      "Harold Land",
		      "George Morrow",
		      "Richie Powell",
		      "Max Roach"
		    ]
		  },{
		    album: "Thelonious Monk with John Coltrane - At Carnegie Hall",
		    musicians: [
		      "Ahmed Abdul-Malik",
		      "John Coltrane",
		      "Thelonious Monk",
		      "Shadow Wilson"
		    ]
		  },{
		    album: "Hank Mobley - Soul Station",
		    musicians: [
		      "Art Blakey",
		      "Paul Chambers",
		      "Wynton Kelly",
		      "Hank Mobley"
		    ]
		  },{
		    album: "Cannonball Adderly - Somethin' Else",
		    musicians: [
		      "Cannonball Adderley",
		      "Art Blakey",
		      "Miles Davis",
		      "Hank Jones",
		      "Sam Jones"
		    ]
		  },{
		    album: "Wayne Shorter - Speak No Evil",
		    musicians: [
		      "Ron Carter",
		      "Herbie Hancock",
		      "Freddie Hubbard",
		      "Elvin Jones",
		      "Wayne Shorter"
		    ]
		  },{
		    album: "Miles Davis - Birth of the Cool",
		    musicians: [
		      "Bill Barber",
		      "Nelson Boyd",
		      "Kenny Clarke",
		      "Junior Collins",
		      "Miles Davis",
		      "Kenny Hagood",
		      "Al Haig",
		      "J. J. Johnson",
		      "Lee Konitz",
		      "John Lewis",
		      "Al McKibbon",
		      "Gerry Mulligan",
		      "Max Roach",
		      "Gunther Schuller",
		      "Joe Shulman",
		      "Sandy Siegelstein",
		      "Kai Winding"
		    ]
		  },{
		    album: "Herbie Hancock - Maiden Voyage",
		    musicians: [
		      "Ron Carter",
		      "George Coleman",
		      "Herbie Hancock",
		      "Freddie Hubbard",
		      "Tony Williams"
		    ]
		  },{
		    album: "Vince Guaraldi Trio- A Boy Named Charlie Brown",
		    musicians: [
		      "Colin Bailey",
		      "Monty Budwig",
		      "Vince Guaraldi"
		    ]
		  },{
		    album: "Eric Dolphy - Out to Lunch",
		    musicians: [
		      "Richard Davis",
		      "Eric Dolphy",
		      "Freddie Hubbard",
		      "Bobby Hutcherson",
		      "Tony Williams"
		    ]
		  },{
		    album: "Oliver Nelson - The Blues and the Abstract Truth",
		    musicians: [
		      "George Barrow",
		      "Paul Chambers",
		      "Eric Dolphy",
		      "Bill Evans",
		      "Roy Haynes",
		      "Freddie Hubbard",
		      "Oliver Nelson"
		    ]
		  },{
		    album: "Dexter Gordon - Go",
		    musicians: [
		      "Sonny Clark",
		      "Dexter Gordon",
		      "Billy Higgins",
		      "Butch Warren"
		    ]
		  },{
		    album: "Sarah Vaughan with Clifford Brown",
		    musicians: [
		      "Joe Benjamin",
		      "Clifford Brown",
		      "Roy Haynes",
		      "Jimmy Jones",
		      "John Malachi",
		      "Herbie Mann",
		      "Paul Quinichette",
		      "Sarah Vaughan",
		      "Ernie Wilkins"
		    ]
		  }
		];

		var width = 640;
		var height = 400;

		var nodes1 = albums.map(function(entry, idx, list) {
		    var radius = 180;
			var node = {};
		    var theta = idx*2*Math.PI / list.length;
			node.name = entry.album;
			node.links = entry.musicians.slice(0);
			node.x = (width/2) + radius*Math.sin(theta);
			node.y = (height/2) + radius*Math.cos(theta);
			return node;
		});

		var links = [];

		albums.forEach(function(srcNode, srcIdx, srcList) {
		    srcNode.musicians.forEach(function(srcLink) {
		        for (var tgtIdx = srcIdx + 1;
		                 tgtIdx < srcList.length;
		                 tgtIdx++) {

		            var tgtNode = srcList[tgtIdx];
		            if (tgtNode.musicians.some(function(tgtLink){
		                return tgtLink === srcLink;
		            })) {
		                links.push({
		                    source: srcIdx,
		                    target: tgtIdx,
		                    link: srcLink
		                });
		            }
		        }
		    });
		});

		var edges1 = [];

		links.forEach(function(link) {
		    var existingEdge = false;
		    for (var idx = 0; idx < edges1.length; idx++) {
		        if ((link.source === edges1[idx].source) &&
		            (link.target === edges1[idx].target)) {
		            existingEdge = edges1[idx];
		            break;
		        }
		    }
		    if (existingEdge) {
		        existingEdge.links.push(link.link);    
		    } else {
		        edges1.push({
		            source: link.source,
		            target: link.target,
		            links: [link.link]
		        })
		    }
		});

		var svg1 = d3.select('#figure1').append('svg')
		    .attr('width', width)
		    .attr('height', height);

		var edgeSelection1 = svg1.selectAll("line")
		    .data(edges1)
		    .enter().append("line");

		var nodeSelection1 = svg1.selectAll("circle")
		    .data(nodes1)
		    .enter().append("circle");

		nodeSelection1
		    .attr('r', width/75)
		    .attr('cx', function(d) { return d.x; })
		    .attr('cy', function(d) { return d.y; });
    
		edgeSelection1
		    .attr('x1', function(d) { return nodes1[d.source].x; })
		    .attr('y1', function(d) { return nodes1[d.source].y; })
		    .attr('x2', function(d) { return nodes1[d.target].x; })
		    .attr('y2', function(d) { return nodes1[d.target].y; });



		var nodes2 = albums.map(function(entry, idx, list) {
		    var radius = 180;
			var node = {};
		    var theta = idx*2*Math.PI / list.length;
			node.name = entry.album;
			node.links = entry.musicians.slice(0);
			node.x = (width/2) + radius*Math.sin(theta);
			node.y = (height/2) + radius*Math.cos(theta);
			return node;
		});

		var edges2 = [];

		links.forEach(function(link) {
		    var existingEdge = false;
		    for (var idx = 0; idx < edges2.length; idx++) {
		        if ((link.source === edges2[idx].source) &&
		            (link.target === edges2[idx].target)) {
		            existingEdge = edges2[idx];
		            break;
		        }
		    }
		    if (existingEdge) {
		        existingEdge.links.push(link.link);    
		    } else {
		        edges2.push({
		            source: link.source,
		            target: link.target,
		            links: [link.link]
		        })
		    }
		});

		var svg2 = d3.select('#figure2').append('svg')
		    .attr('width', width)
		    .attr('height', height);

		var edgeSelection2 = svg2.selectAll("line")
		    .data(edges2)
		    .enter().append("line");

		var nodeSelection2 = svg2.selectAll("circle")
		    .data(nodes2)
		    .enter().append("circle");

		nodeSelection2
		    .attr('r', width/75)
		    .attr('cx', function(d) { return d.x; })
		    .attr('cy', function(d) { return d.y; });
    
		edgeSelection2
		    .attr('x1', function(d) { return nodes2[d.source].x; })
		    .attr('y1', function(d) { return nodes2[d.source].y; })
		    .attr('x2', function(d) { return nodes2[d.target].x; })
		    .attr('y2', function(d) { return nodes2[d.target].y; });

		var force2 = d3.layout.force()
		    .size([width, height])
		    .nodes(nodes2)
		    .links(edges2)
		    .linkDistance(height/2)
		    .charge(-500);

		force2.on('tick', function() {
			nodeSelection2.each(function(node) {
			    node.x = Math.max(node.x, width/75);
			    node.y = Math.max(node.y, width/75);
			    node.x = Math.min(node.x, width-width/75);
			    node.y = Math.min(node.y, height-width/75);
			});

		    nodeSelection2
		        .attr('cx', function(d) { return d.x; })
		        .attr('cy', function(d) { return d.y; });
        
		    edgeSelection2
		        .attr('x1', function(d) { return d.source.x; })
		        .attr('y1', function(d) { return d.source.y; })
		        .attr('x2', function(d) { return d.target.x; })
		        .attr('y2', function(d) { return d.target.y; });
		});


		force2.start();


		var nodeRadius = width/50;

		var nodes3 = albums.map(function(entry, idx, list) {
		    var radius = 180;
			var node = {};
		    var theta = idx*2*Math.PI / list.length;
			node.name = entry.album;
			node.links = entry.musicians.slice(0);
			node.x = (width/2) + radius*Math.sin(theta);
			node.y = (height/2) + radius*Math.cos(theta);
			return node;
		});

		var edges3 = [];

		links.forEach(function(link) {
		    var existingEdge = false;
		    for (var idx = 0; idx < edges3.length; idx++) {
		        if ((link.source === edges3[idx].source) &&
		            (link.target === edges3[idx].target)) {
		            existingEdge = edges3[idx];
		            break;
		        }
		    }
		    if (existingEdge) {
		        existingEdge.links.push(link.link);    
		    } else {
		        edges3.push({
		            source: link.source,
		            target: link.target,
		            links: [link.link]
		        })
		    }
		});

		var svg3 = d3.select('#figure3').append('svg')
		    .attr('width', width)
		    .attr('height', height);

		var edgeSelection3 = svg3.selectAll("line")
		    .data(edges3)
		    .enter().append("line");

		var nodeSelection3 = svg3.selectAll("circle")
		    .data(nodes3)
		    .enter().append("circle");

		nodeSelection3
		    .attr('r', nodeRadius)
		    .attr('cx', function(d) { return d.x; })
		    .attr('cy', function(d) { return d.y; });
    
		edgeSelection3
		    .attr('x1', function(d) { return nodes3[d.source].x; })
		    .attr('y1', function(d) { return nodes3[d.source].y; })
		    .attr('x2', function(d) { return nodes3[d.target].x; })
		    .attr('y2', function(d) { return nodes3[d.target].y; });


		var force3 = d3.layout.force()
		    .size([width, height])
		    .nodes(nodes3)
		    .links(edges3)
		    .linkDistance(height/2)
		    .charge(-500);

		nodeSelection3.on('click', function(d) {
    
		    nodeSelection3
		        .classed('selected', false)
		        .filter(function(node) { return node !== d; })
		        .each(function(node) { node.selected = false;})
		        .attr('r', nodeRadius)
        
		    edgeSelection3.classed('selected', false);

		    if (!d.selected) {
		    	 d3.select(this).classed('selected', true);
		    	 d3.select(this).attr('r', 1.5*nodeRadius);

		  		  edgeSelection3.each(function(edge) {
		      	    if ((edge.source === d) || (edge.target === d)) {
		      	        d3.select(this).classed('selected',true);
		      	        nodeSelection3
		      	            .filter(function(node) {return node === edge.source || node === edge.target})
		      	            .classed('selected',true);
		      	    }
		  		  });
      
		    } else {
		        d3.select(this).attr('r', nodeRadius)
		    }
    
		    d.selected = !d.selected;
		});

		force3.on('tick', function() {
			nodeSelection3.each(function(node) {
			    node.x = Math.max(node.x, 1.5*nodeRadius);
			    node.y = Math.max(node.y, 1.5*nodeRadius);
			    node.x = Math.min(node.x, width-1.5*nodeRadius);
			    node.y = Math.min(node.y, height-1.5*nodeRadius);
			});

		    nodeSelection3
		        .attr('cx', function(d) { return d.x; })
		        .attr('cy', function(d) { return d.y; });
        
		    edgeSelection3
		        .attr('x1', function(d) { return d.source.x; })
		        .attr('y1', function(d) { return d.source.y; })
		        .attr('x2', function(d) { return d.target.x; })
		        .attr('y2', function(d) { return d.target.y; });
		});

		force3.start();

    };

    if (typeof contentLoaded != "undefined") {
        contentLoaded.done(draw);
    } else {
        window.addEventListener('load', draw);
    }

}());
</script>

