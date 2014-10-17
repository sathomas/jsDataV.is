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

For the visualization it will be helpful to have two separate arrays, one for the graph's nodes and a second for the graph's edges. Extracting those arrays from the original data is straightforward, so we won't bother looking at it in this appendix. You can, however, see the full implementation in the book's source code. The result looks like the following.

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
    <script src="//cdnjs.cloudflare.com/ajax/libs/d3/3.4.6/d3.min.js"></script>
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
![](img/selection.svg)
<figcaption><span class="smcp">D3</span>.js selections can associate page content such as &lt;circle&gt; elements with data items such as albums.</figcaption>
</figure>

In general, though, we can't guarantee that there will be exactly as many elements as data values. Suppose, for example, only two `<circle>` elements existed for our four albums. As figure NEXTFIGURENUMBER shows, <span class="smcp">D3</span>.js still creates a selection of four objects, even though there aren't enough circles for all of them. Two of the objects will have a data value but no element.

<figure>
![](img/selection2.svg)
<figcaption><span class="smcp">D3</span>.js selections keep track of page content that doesn't exist (yet).</figcaption>
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
<figcaption><span class="smcp">D3</span>.js provides tools to help draw the circles and lines for a network graph.</figcaption>
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
<figcaption><span class="smcp">D3</span>.js includes functions to make visualizations interactive.</figcaption>
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

