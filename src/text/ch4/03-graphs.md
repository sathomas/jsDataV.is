## Showing Relationships with Network Graphs

Visualizations don't always focus on the actual data values; sometimes the most interesting aspects of a data set are the relationships among its members. The relationships between members of a social network, for example, might be the most important feature of that network. To visualize these types of relationships, we can use a _network graph._ Network graphs represent objects, generally known as _nodes,_ as points or circles. Lines or arcs (technically called _edges_) connect these nodes to indicate relationships.

Constructing network graphs can be a bit tricky, as the underlying mathematics are not always trivial. Fortunately the [sigmajs](http://sigmajs.org) library takes care of most of the complicated calculations. By using that library, we can create full-featured network graphs with just a little bit of JavaScript. For our example, we'll consider one critic's list of the [Top 25 Jazz Albums of All Time](http://www.thejazzresource.com/top_25_jazz_albums.html). Several musicians performed on more than one of these albums, and a network graph let's us explore those connections.

### Step 1: Include the Required Libraries

The sigmajs library does not depend on any other JavaScript libraries, so we don't need any other included scripts. It is not, however, available on common Content Distribution Networks. Consequently, we'll have to serve it from our own web host.

``` {.html .numberLines .line-8}
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title></title>
  </head>
  <body>
    <div id="graph"></div>
    <script src="js/sigma.min.js"></script>
  </body>
</html>
```

As you can see, we've set aside a `<div>` in line 8 to hold our graph. We've also included the JavaScript library as the last part of the `<body>` element, as that provides the best browser performance.

> Note: In most of the examples in this book, we included steps you can take to make your visualizations compatible with older web browsers such as Internet Explorer 8. In this case, however, those approaches degrade performance so severely that they are rarely workable. To view the network graph visualization, your users will need a modern browser.

### Step 2: Prepare the Data

Our data on the top 25 jazz albums looks like the following snippet. We're only showing the first couple of albums below, but you can see the full list in the book's [source code](https://github.com/sathomas/jsDataV.is-source). For clarity, we'll only use the top 15 albums in this example.

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

That's not exactly the structure that sigmajs requires. We could convert it to a sigmajs <span class="smcp">JSON</span> data structure in bulk, but there's really no need. Instead, as we'll see in the next step, we can simply pass data to the library one element at a time.

### Step 3: Define the Graph's Nodes

Now we're ready to use the library to construct our graph. We start by initializing the library and indicating where it should construct the graph. That parameter is the `id` of the `<div>` element set aside to hold the visualization.

``` {.javascript .numberLines}
var s = new sigma("graph");
```

Now we can continue by adding the nodes to the graph. In our case each album is a node. As we add a node to the graph, we give it a unique identifier (which must be a string), a label, and a position. Figuring out an initial position can be a bit tricky for arbitrary data. In a few steps we'll look at an approach that makes the initial position less critical. For now, though, we'll simply spread our albums in a circle using basic trigonometry. The `radius` value is roughly half of the width of the container. We can also give each node a different size, but for our purposes it's fine to set every album's size to `1`.

``` {.javascript .numberLines}
for (var idx=0; idx<albums.length; idx++) {
    var theta = idx*2*Math.PI / albums.length;
    s.graph.addNode({
        id: ""+idx,   // Note: 'id' must be a string
        label: albums[idx].album,
        x: radius*Math.sin(theta),
        y: radius*Math.cos(theta),
        size: 1
    });
}
```

Finally, after defining the graph, we tell the library to draw it.

``` {.javascript .numberLines}
s.refresh();
```

With figure NEXTFIGURENUMBER now have a nicely drawn circle of the top 15 jazz albums of all time. In our initial attempt some of the labels may get in each other's way, but we'll address that shortly.

<figure>
<div id="graph-1" style="width:1000px;height:450px;position:relative;left:-300px;"></div>
<figcaption>Sigmajs draws graph nodes as small circles.</figcaption>
</figure>

If you try out this visualization in the browser, you'll notice that the sigmajs library automatically supports panning the graph, and users can mover their mouse pointer over individual nodes to highlight the node labels.

### Step 4: Connect the Nodes with Edges

Now that we have the nodes drawn in a circle, it's time to connect them with edges. In our case an edge, or connection between two albums, represents a musician that performed on both of the albums. To find those edges, we iterate through the albums in four stages.

1. Loop through each album as a potential source of a connection (line 1).
2. For the source album, loop through all musicians (line 3).
3. For each musician, loop through all of the remaining albums as potential targets for a connection (line 5).
4. For each target album, loop through all the musicians looking for a match (line 7).

For the last step we're using the `some()` method of JavaScript arrays. That method takes a function as a parameter, and it returns `true` if that function itself returns `true` for any element in the array.

``` {.javascript .numberLines}
for (var srcIdx=0; srcIdx<albums.length; srcIdx++) {
    var src = albums[srcIdx];
    for (var mscIdx=0; mscIdx<src.musicians.length; mscIdx++) {
        var msc = src.musicians[mscIdx];
        for (var tgtIdx=srcIdx+1; tgtIdx<albums.length; tgtIdx++) {
            var tgt = albums[tgtIdx];
            if (tgt.musicians.some(function(tgtMsc) {
                return tgtMsc === msc;
            })) {
                s.graph.addEdge({
                    id: srcIdx + "." + mscIdx + "-" + tgtIdx,
                    source: ""+srcIdx,
                    target: ""+tgtIdx
                })
            }
        }
    }
}
```

We'll want to insert this code before we `refresh` the graph. When we've done that, we'll have a connected circle of albums as in figure NEXTFIGURENUMBER.

<figure>
<div id="graph-2" style="width:1000px;height:450px;position:relative;left:-300px;"></div>
<figcaption>Sigmajs can then connect graph nodes using lines to represent edges.</figcaption>
</figure>

Again, you can pan the graph to focus on different parts.

### Step 5: Automating the Layout

So far we've manually placed the nodes in our graph in a circle. That's not a terrible approach, but it can make it hard to discern some of the connections. It would be better if we could let the library calculate a more optimal layout than the simple circle. That's exactly what we'll do now.

The mathematics behind this approach go by the name of "force directed graphing." In a nutshell, the algorithm proceeds by treating the graph's nodes and edges as physical objects subject to real forces such as gravity and electromagnetism. It simulates the effect of those forces, pushing and prodding the nodes into new positions on the graph.

The underlying algorithm may be complicated, but sigmajs makes it easy to employ. First we have to add an optional plugin to the sigmajs library. That's the `forceAtlas2` plugin in line 10 below.

``` {.html .numberLines .line-10}
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="utf-8">
        <title></title>
    </head>
    <body>
        <div id="graph"></div>
        <script src="js/sigma.min.js"></script>
        <script src="js/sigma.layout.forceAtlas2.min.js"></script>
    </body>
</html>
```

Mathieu Jacomy and Tommaso Venturini developed the specific force direction algorithm employed by this plugin; they document the algorithm, known as _Force Atlas 2_, in the 2011 paper [_ForceAtlas2, A Graph Layout Algorithm for Handy Network Visualization_](http://webatlas.fr/tempshare/ForceAtlas2_Paper.pdf)_._ Although we don't have to understand the mathematical details of the algorithm, knowing how to use it's parameters does come in handy. There are three parameters that are important for most visualizations using the plugin:

* **gravity.** This parameter determines how strongly the algorithm tries to keep isolated nodes from drifting off the edges of the screen. Without any gravity, then the only force acting on isolated nodes will one that repels them from other nodes; undeterred, that force will push the nodes off the screen entirely. Since our data includes several isolated nodes, we'll want to set this value relatively high to keep those nodes on the screen
* **scalingRatio.** This parameter determines how strongly nodes repel each other. A small value draws connected nodes closer together while a large value forces all nodes further apart.
* **slowDown.** This parameter decreases the sensitivity of the nodes to the repulsive forces from their neighbors. Reducing the sensitivity (by increasing this value) can help reduce the instability that may result when nodes face competing forces from multiple neighbors. In our data there are many connections that will tend to draw the nodes together and that will compete with the force repelling them apart. To dampen the wild oscillations that might otherwise ensue, we'll set this value relatively high as well.

The best way to settle on values for these parameters is to experiment with the actual data. For this data set, we've settled on the values in line 1 below.

Now, instead of simply refreshing the graph when we're ready to display it, we start the force directed algorithm, which periodically refreshes the display while it performs its simulation. We also need to stop the algorithm after it's had a chance to run for awhile. In our case 10 seconds (`10000 ms`) is plenty of time.

``` {.javascript .numberLines}
s.startForceAtlas2({gravity:100,scalingRatio:70,slowDown:100});
setTimeout(function() { s.stopForceAtlas2(); }, 10000);
```

As a result, our albums start out in their original circle, but quickly migrate to a position that makes it much easier to identify the connections. Some of the top albums are tightly connected, indicating that have many musicians in common. A few, however, remain isolated. Their musicians only make the list once.

<figure>
<div id="graph-3" style="width:650px;height:600px;position:relative;left:-50px"></div>
<figcaption>Force direction positions the graph nodes automatically.</figcaption>
</figure>

As you can see, the labels for the nodes still get in the way of each other; we'll fix that in the next step. What's important here, however, is that it's much easier to identify the albums with lots of connections. The nodes representing those albums have migrated to the center of the graph, and they have many links to other nodes.

### Step 6: Adding Interactivity

To keep the labels from interfering with each other, we can add some interactivity to the graph. By default, we'll hide the labels entirely giving users the chance to appreciate the structure of the graph without distractions. We'll then allow them to click on individual nodes to reveal the album title and it's connections. To suppress the initial label display, we can modify the initialization code so that nodes have blank labels (line 5). We'll save a reference to the album title though in line 6.

``` {.javascript .numberLines .line-5}
for (var idx=0; idx<albums.length; idx++) {
    var theta = idx*2*Math.PI / albums.length;
    s.graph.addNode({
        id: ""+idx,   // Note: 'id' must be a string
        label: "",
        album: albums[idx].album,
        x: radius*Math.sin(theta),
        y: radius*Math.cos(theta),
        size: 1
    });
}
```

Now we need a function that responds to clicks on the node elements. The sigmajs library supports exactly this sort of function with its interface. We simply bind to the `clickNode` event.

``` {.javascript .numberLines}
s.bind('clickNode', function(ev) {
    var nodeIdx = ev.data.node.id;
    // Code continues...
});
```

Within that function, the `ev.data.node.id` property gives us the index of the node that the user clicked. The complete set of nodes is available from the array returned by `s.graph.nodes()`. Since we want to display the label for the clicked node (but not for any other), we can iterate through the entire array. At each iteration, we either set the label property to an empty string (to hide it) or to the `album` property (to show it).

``` {.javascript .numberLines}
s.bind('clickNode', function(ev) {
    var nodeIdx = ev.data.node.id;
    var nodes = s.graph.nodes();
    nodes.forEach(function(node) {
        if (nodes[nodeIdx] === node) {
            node.label = node.album;
        } else {
            node.label = "";
        }
    });
});
```

Now that users have a way to show the title of an album, they'll probably also want a way to hide it. We can support that interaction by toggling the album display with subsequent clicks on the same node. A small addition to line 5 in the above code is all it takes to enable that behavior.

``` {.javascript .numberLines}
        if (nodes[nodeIdx] === node && node.label !== node.album) {
```

As long as we're making the graph respond to clicks, we can also take the opportunity to highlight the clicked node's connections. We do that by changing their color. Just as `s.graph.nodes()` returns an array of the graph nodes, `s.graph.edges()` returns an array of edges. Each edge object includes `target` and `source` properties that hold the index of the relevant node.

We can then scan through all the graph's edges to see if they connect to the clicked node. If the edge does connect to the node, we can change it's color to something other than the default (line 4). Otherwise, we change the color back to the default (line 6). You can see in line 3 that we're using the same approach as we did with the nodes to toggle the edge colors on successive clicks.

``` {.javascript .numberLines}
s.graph.edges().forEach(function(edge) {
    if ((nodes[nodeIdx].label === nodes[nodeIdx].album) && 
        ((edge.target === nodeIdx) || (edge.source === nodeIdx))) {
        edge.color = 'blue';
    } else {
        edge.color = 'black';
    }
});
```

Now that we've changed the graph properties, we have to tell sigmajs to redraw it. That's a simple matter of calling `s.refresh()`.

``` {.javascript .numberLines}
s.refresh();
```

Now we have a fully interactive network graph in figure NEXTFIGURENUMBER. Our users can get a quick sense of the connections between albums, and a simple click provides additional details.

<figure>
<div id="graph-4" style="width:650px;height:600px;position:relative;left:-50px"></div>
<figcaption>An interactive graph gives users the chance to highlight specific nodes.</figcaption>
</figure>

<script>
;(function(){

  draw = function() {

        var albums = [
          {
            album: "Kind of Blue",
            musicians: [
              "Cannonball Adderley",
              "Paul Chambers",
              "Jimmy Cobb",
              "John Coltrane",
              "Miles Davis",
              "Bill Evans"
            ]
          },{
            album: "A Love Supreme",
            musicians: [
              "John Coltrane",
              "Jimmy Garrison",
              "Elvin Jones",
              "McCoy Tyner"
            ]
          },{
            album: "Time Out",
            musicians: [
              "Dave Brubeck",
              "Paul Desmond",
              "Joe Morello",
              "Eugene Write"
            ]
          },{
            album: "Ellington at Newport",
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
            album: "Jazz at Massey Hall",
            musicians: [
              "Dizzy Gillespie",
              "Charles Mingus",
              "Charlie Parker",
              "Bud Powell",
              "Max Roach"
            ]
          },{
            album: "The Best of the Hot Five...",
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
            album: "Blue Trane",
            musicians: [
              "Paul Chambers",
              "John Coltrane",
              "Kenny Drew",
              "Curtis Fuller",
              "Philly Joe Jones",
              "Lee Morgan"
            ]
          },{
            album: "Getz/Gilberto",
            musicians: [
              "Milton Banana",
              "Stan Getz",
              "Astrud Gilberto",
              "João Gilberto",
              "Antonio Carlos Jobim",
              "Sebastião Neto"
            ]
          },{
            album: "Mingus Ah Um",
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
            album: "Concert by the Sea",
            musicians: [
             "Denzil Best",
              "Eddie Calhoun",
              "Erroll Garner"
            ]
          },{
            album: "Bitches Brew",
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
            album: "Saxophone Colossus",
            musicians: [
              "Tommy Flanagan",
              "Sonny Rollins",
              "Max Roach",
              "Doug Watkins"
            ]
          },{
            album: "Moanin'",
            musicians: [
              "Art Blakey",
              "Lee Morgan",
              "Benny Golson",
              "Bobby Timmons",
              "Jymie Merritt"
            ]
          },{
            album: "Clifford Brown & Max Roach",
            musicians: [
              "Clifford Brown",
              "Harold Land",
              "George Morrow",
              "Richie Powell",
              "Max Roach"
            ]
          },{
            album: "At Carnegie Hall",
            musicians: [
              "Ahmed Abdul-Malik",
              "John Coltrane",
              "Thelonious Monk",
              "Shadow Wilson"
            ]
          },{
            album: "Soul Station",
            musicians: [
              "Art Blakey",
              "Paul Chambers",
              "Wynton Kelly",
              "Hank Mobley"
            ]
          },{
            album: "Somethin' Else",
            musicians: [
              "Cannonball Adderley",
              "Art Blakey",
              "Miles Davis",
              "Hank Jones",
              "Sam Jones"
            ]
          },{
            album: "Speak No Evil",
            musicians: [
              "Ron Carter",
              "Herbie Hancock",
              "Freddie Hubbard",
              "Elvin Jones",
              "Wayne Shorter"
            ]
          },{
            album: "Birth of the Cool",
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
            album: "Maiden Voyage",
            musicians: [
              "Ron Carter",
              "George Coleman",
              "Herbie Hancock",
              "Freddie Hubbard",
              "Tony Williams"
            ]
          },{
            album: "A Boy Named Charlie Brown",
            musicians: [
              "Colin Bailey",
              "Monty Budwig",
              "Vince Guaraldi"
            ]
          },{
            album: "Out to Lunch",
            musicians: [
              "Richard Davis",
              "Eric Dolphy",
              "Freddie Hubbard",
              "Bobby Hutcherson",
              "Tony Williams"
            ]
          },{
            album: "The Blues and the Abstract Truth",
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
            album: "Go",
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
        
        var s1 = new sigma("graph-1");
        s1.settings({
        	  defaultLabelColor: chartStyles.color.text,
          defaultNodeColor: chartStyles.color.primary,
        	  font: chartStyles.font.family,
          sideMargin: 25,
          zoomMin: 1.0,
          zoomMax: 1.0
        });
        for (var idx=0; idx<albums.length; idx++) {
            var theta = idx*2*Math.PI / albums.length;
            s1.graph.addNode({
                id: ""+idx,   // Note: 'id' must be a string
                label: albums[idx].album,
                x: 200*Math.sin(theta),
                y: 200*Math.cos(theta),
                size: 1
            });
        }
        s1.refresh();
        
        var s2 = new sigma("graph-2");
        s2.settings({
          defaultEdgeColor: chartStyles.color.text,
          defaultLabelColor: chartStyles.color.text,
        	  defaultNodeColor: chartStyles.color.primary,
        	  font: chartStyles.font.family,
          sideMargin: 25,
          zoomMin: 1.0,
          zoomMax: 1.0
        });
        for (var idx=0; idx<albums.length; idx++) {
            var theta = idx*2*Math.PI / albums.length;
            s2.graph.addNode({
                id: ""+idx,   // Note: 'id' must be a string
                label: albums[idx].album,
                x: 200*Math.sin(theta),
                y: 200*Math.cos(theta),
                size: 1
            });
        }
        for (var srcIdx=0; srcIdx<albums.length; srcIdx++) {
          var src = albums[srcIdx];
          for (var mscIdx=0; mscIdx<src.musicians.length; mscIdx++) {
            var msc = src.musicians[mscIdx];
            for (var tgtIdx=srcIdx+1; tgtIdx<albums.length; tgtIdx++) {
              var tgt = albums[tgtIdx];
              if (tgt.musicians.some(function(tgtMsc) {return tgtMsc === msc;})) {
                s2.graph.addEdge({
                  id: srcIdx + "." + mscIdx + "-" + tgtIdx,
                  source: ""+srcIdx,
                  target: ""+tgtIdx,
                  color: chartStyles.color.text
                })
              }
            }
          }
        }
        s2.refresh();
        
        s3 = new sigma("graph-3");
        s3.settings({
          defaultEdgeColor: chartStyles.color.text,
          defaultLabelColor: chartStyles.color.text,
          defaultNodeColor: chartStyles.color.primary,
          font: chartStyles.font.family,
          sideMargin: 25,
          zoomMin: 1.0,
          zoomMax: 1.0
        });
        for (var idx=0; idx<albums.length; idx++) {
            var theta = idx*2*Math.PI / albums.length;
            s3.graph.addNode({
                id: ""+idx,   // Note: 'id' must be a string
                label: albums[idx].album,
                x: 200*Math.sin(theta),
                y: 200*Math.cos(theta),
                size: 1
            });
        }
        for (var srcIdx=0; srcIdx<albums.length; srcIdx++) {
          var src = albums[srcIdx];
          for (var mscIdx=0; mscIdx<src.musicians.length; mscIdx++) {
            var msc = src.musicians[mscIdx];
            for (var tgtIdx=srcIdx+1; tgtIdx<albums.length; tgtIdx++) {
              var tgt = albums[tgtIdx];
              if (tgt.musicians.some(function(tgtMsc) {return tgtMsc === msc;})) {
                s3.graph.addEdge({
                  id: srcIdx + "." + mscIdx + "-" + tgtIdx,
                  source: ""+srcIdx,
                  target: ""+tgtIdx,
                  color: chartStyles.color.text
                })
              }
            }
          }
        }
        setTimeout(function() {s3.startForceAtlas2({gravity:100,scalingRatio:70,slowDown:100});},0000);
        setTimeout(function() {s3.stopForceAtlas2();},10000);
        
        var s4 = new sigma("graph-4");
        s4.settings({
          defaultEdgeColor: chartStyles.color.text,
          defaultLabelColor: chartStyles.color.text,
          defaultNodeColor: chartStyles.color.primary,
          font: chartStyles.font.family,
          enableHovering: false,
          labelThreshold: 2,
          sideMargin: 25,
          zoomMin: 1.0,
          zoomMax: 1.0
        });
        for (var idx=0; idx<albums.length; idx++) {
            var theta = idx*2*Math.PI / albums.length;
            s4.graph.addNode({
                id: ""+idx,   // Note: 'id' must be a string
                album: albums[idx].album,
                label: "",
                x: Math.sin(theta),
                y: Math.cos(theta),
                size: 1
            });
        }
        for (var srcIdx=0; srcIdx<albums.length; srcIdx++) {
          var src = albums[srcIdx];
          for (var mscIdx=0; mscIdx<src.musicians.length; mscIdx++) {
            var msc = src.musicians[mscIdx];
            for (var tgtIdx=srcIdx+1; tgtIdx<albums.length; tgtIdx++) {
              var tgt = albums[tgtIdx];
              if (tgt.musicians.some(function(tgtMsc) {return tgtMsc === msc;})) {
                s4.graph.addEdge({
                  id: srcIdx + "." + mscIdx + "-" + tgtIdx,
                  source: ""+srcIdx,
                  target: ""+tgtIdx,
                  color: chartStyles.color.text
                })
              }
            }
          }
        }
        setTimeout(function() {s4.startForceAtlas2({gravity:100,scalingRatio:70,slowDown:100});},11000);
        setTimeout(function() {s4.stopForceAtlas2();},21000);
        s4.bind('clickNode', function(ev) {
          var nodeIdx = ev.data.node.id;
          var nodes = s4.graph.nodes();
          nodes.forEach(function(node) {
            if (nodes[nodeIdx] === node && node.label !== node.album) {
              node.label = node.album;
            } else {
              node.label = "";
            }
          });
          s4.graph.edges().forEach(function(edge) {
            if ((nodes[nodeIdx].label === nodes[nodeIdx].album) && ((edge.target === nodeIdx) || (edge.source === nodeIdx))) {
                edge.color = chartStyles.color.secondaryLightest;
            } else {
                edge.color = chartStyles.color.text;
            }
          });
          s4.refresh();
        });

    };
    
    if (typeof contentLoaded != "undefined") {
        contentLoaded.done(draw);
    } else {
        window.addEventListener('load', draw);
    }

}());
</script>
