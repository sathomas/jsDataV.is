## Highlighting Regions with a Heat Map

If you work in the web industry, heat maps may already be a part of your job. Usability researchers often use heat maps to evaluate site designs, especially when they want to analyze which parts of a web page get the most attention from users. Heat maps work by overlaying values, represented as semi-transparent colors, over a two-dimensional area. As the example in figure NEXTFIGURENUMBER shows, different colors represent different levels of attention. Users focus most on areas colored red, and less on yellow, green, and blue areas.

<figure>
<img src="img/heatmap.png" width="640">
<figcaption>Heat maps traditionally show where web users focus their attention on a page.</figcaption>
</figure>

For this example we'll use a heat map to visualize an important aspect of a basketball game: where on the court the teams are scoring most of their points. The software we'll use is the [heatmap.js](http://www.patrick-wied.at/static/heatmapjs/) library from Patrick Wied. If you need to create traditional web site heat maps, that library includes built-in support for capturing mouse movements and mouse clicks on a web page. Although we won't use those features for our example, the general approach is much the same.

### Step 1: Include the Required JavaScript

For modern browsers, the heatmap.js library has no additional requirements. The library includes optional additions for real-time heat maps and for geographic integration, but we won't need these in our example. Older browsers (principally Internet Explorer version 8 and older) can use heatmap.js with the _explorer canvas_ library. Since we don't need to burden all users with this library, we'll use conditional comments to include it only when it's needed. Following current best practices, we include all script files at the end of our `<body>`.

``` {.html .numberLines}
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title></title>
  </head>
  <body>
    <!--[if lt IE 9]><script src="js/excanvas.min.js"></script><![endif]-->
    <script src="js/heatmap.js"></script>
  </body>
</html>
```

### Step 2: Define the Visualization Data

For our example, we'll visualize the <span class="smcp">NCAA</span> Mens' Basketball game on 13 February 2013 between Duke University and the University of North Carolina. Our [dataset](http://www.cbssports.com/collegebasketball/gametracker/live/NCAAB_20130213_UNC@DUKE) contains details about every point scored in the game. To clean the data, we convert the time of each score to minutes from the game start, and we define the position of the scorer in x- and y-coordinates. We've defined these coordinates using several important conventions:

* We'll show North Carolina's points on the left side of the court and Duke's points on the right side.
* The bottom-left corner of the court corresponds to position (0,0), and the top-right corner corresponds to (10,10).
* To avoid confusing free throws with field goals, we've given all free throws a position of (–1,–1).

Here's the beginning of the data; the full data is available with the book's [source code](https://github.com/sathomas/jsDataV.is-source).

``` {.javascript .numberLines}
var game = [
    { team: "UNC",  points: 2, time: 0.85, 
      unc: 2, duke: 0, x: 0.506, y: 5.039 },
    { team: "UNC",  points: 3, time: 1.22, 
      unc: 5, duke: 0, x: 1.377, y: 1.184 },
    { team: "DUKE", points: 2, time: 1.65  
      unc: 5, duke: 2, x: 8.804, y: 7.231 },
    // Data set continues...
```

### Step 3: Create the Background Image

A simple diagram of a basketball court, like that in figure NEXTFIGURENUMBER, works fine for our visualization. The dimensions of our background image are 600 by 360 pixels.

<figure>
![](img/basketball.svg)
<figcaption>A background image sets the context for the visualization.</figcaption>
</figure>


### Step 4: Set Aside an HTML Element to Contain the Visualization

In our web page, we need to define the element (generally a `<div>`) that will hold the heat map. When we create the element, we specify its dimensions, and we define the background. The following fragment does both of those using inline styles to keep the example concise. You might want to use a <span class="smcp">CSS</span> stylesheet in an actual implementation

``` {.html .numberLines}
<div id='heatmap' 
    style="position:relative;width:600px;height:360px;"+
          "background-image:url('img/basketball.png');">
</div>
```

Notice that we've given the element a unique `id`. The heatmap.js library needs that `id` to place the map on the page. Most importantly, we also set the `position` property to `relative`. The heatmap.js library positions its graphics using absolute positioning, and we want to contain those graphics within the parent element.

### Step 5: Format the Data

For our next step, we must convert the game data into the proper format for the library. The heatmap.js library expects individual data points to contain three properties:

1. the `x` coordinate, measured in pixels from the left of the containing element
2. the `y` coordinate, measured in pixels from the top of the containing element
3. the magnitude of the data point (specified by the `count` property)

The library also requires the maximum magnitude for the entire map, and here things get a little tricky. With standard heat maps, the magnitudes of all the data points for any particular position sum together. In our case that means that all the baskets scored from layups and slam dunks—which are effectively from the same position on the court—are added together by the heat map algorithm. That one position, right underneath the basket, dominates the rest of the court. To counteract that effect, we specify a maximum value far less than what the heat map would expect. In our case, we'll set the maximum value to `3`, which means that any location where at least three points were scored will be colored red, and we'll easily be able to see all the baskets.

We can use JavaScript to transform the `game` array into the appropriate format. We start by fetching the height and width of the containing element in lines 1-3. If those dimensions change, our code will still work fine. Then we initialize the `dataset` object with a `max` property and an empty `data` array in lines 4-6. Finally, we iterate through the game data and add relevant data points to this array. Notice that we're filtering out free throws in line 9.

``` {.javascript .numberLines}
var docNode = document.getElementById("heatmap");
var height = docNode.clientHeight;
var width  = docNode.clientWidth;
var dataset = {};
dataset.max = 3;
dataset.data = [];
for (var i=0; i<game.length; i++) {
    var currentShot = game[1];
    if ((currentShot.x !== -1) && (currentShot.y !== -1)) {
        var x = Math.round(width  * currentShot.x/10);
        var y = height - Math.round(height * currentShot.y/10);
        dataset.data.push({"x": x, "y": y, "count": currentShot.points});
    }
}
```

### Step 6: Draw the Map

With a containing element and a formatted data set, it's a simple matter to draw the heat map. We create the heat map object (the library uses the name `h337` in an attempt to be clever) by specifying the containing element, a radius for each point, and an opacity. Then we add the data set to this object.

``` {.javascript .numberLines}
var heatmap = h337.create({
    element: "heatmap",
    radius: 30,
    opacity: 50
});
heatmap.store.setDataSet(dataset);
```

The resulting visualization in figure NEXTFIGURENUMBER shows where each team scored its points.

<figure>
<div id='heatmap1' style="position:relative;width:600px;height:360px;background-image: url('img/basketball.svg');"></div>
<figcaption>The heat map shows successful shots in the game.</figcaption>
</figure>

### Step 7: Adjust the Heat Map z-index

The heatmap.js library is especially aggressive in its manipulation of the `z-index` property. To ensure that the heat map appears above all other elements on the page, the library explicitly sets this property to a value of `10000000000`. If your web page has elements that you don't want the heat map to obscure (such as fixed-position navigation menus), that value is probably too aggressive. You can fix it by modifying the source code directly. Or, as an alternative, you can simply reset the value after the library finishes drawing the map.

If you're using jQuery, the following code will reduce the z-index to a more reasonable value.

``` {.javascript .numberLines}
$("#heatmap canvas").css("z-index", "1");
```

<script>
;(function(){

    draw = function() {

        var game = [
            { team: "UNC",  points: 2, time: 0.85,  unc:  2, duke: 0,  x: 0.506, y: 5.039, note: "Dexter Strickland made Layup" },
            { team: "UNC",  points: 3, time: 1.22,  unc:  5, duke: 0,  x: 1.377, y: 1.184, note: "Reggie Bullock made 3-pt. Jump Shot" },
            { team: "DUKE", points: 2, time: 1.65,  unc:  5, duke: 2,  x: 8.804, y: 7.231, note: "Rasheed Sulaimon made Jump Shot" },
            { team: "UNC",  points: 2, time: 2.32,  unc:  7, duke: 2,  x: 0.506, y: 5.039, note: "James Michael McAdoo made Slam Dunk" },
            { team: "DUKE", points: 2, time: 2.90,  unc:  7, duke: 4,  x: 9.45,  y: 5.011, note: "Amile Jefferson made Layup" },
            { team: "UNC",  points: 2, time: 3.18,  unc:  9, duke: 4,  x: 0.506, y: 5.039, note: "Dexter Strickland made Layup" },
            { team: "DUKE", points: 2, time: 4.43,  unc:  9, duke: 6,  x: 8.690, y: 4.602, note: "Quinn Cook made Floating Jump Shot" },
            { team: "UNC",  points: 2, time: 5.18,  unc: 11, duke: 6,  x: 0.506, y: 5.039, note: "Dexter Strickland made Tip-in" },
            { team: "DUKE", points: 2, time: 5.45,  unc: 11, duke: 8,  x: 0.45,  y: 5.011, note: "Mason Plumlee made Layup" },
            { team: "UNC",  points: 2, time: 5.83,  unc: 13, duke: 8,  x: 0.506, y: 5.039, note: "James Michael McAdoo made Slam Dunk" },
            { team: "UNC",  points: 1, time: 6.73,  unc: 14, duke: 8,  x: -1,    y: -1,    note: "P.J. Hairston made 2nd of 2 Free Throws" },
            { team: "DUKE", points: 2, time: 7.07,  unc: 14, duke: 10, x: 8.579, y: 6.861, note: "Rasheed Sulaimon made Jump Shot" },
            { team: "UNC",  points: 3, time: 7.35,  unc: 17, duke: 10, x: 2.415, y: 8.318, note: "Reggie Bullock made 3-pt. Jump Shot" },
            { team: "DUKE", points: 1, time: 7.93,  unc: 17, duke: 11, x: -1,    y: -1,    note: "Mason Plumlee made 1st of 2 Free Throws" },
            { team: "DUKE", points: 1, time: 7.93,  unc: 17, duke: 12, x: -1,    y: -1,    note: "Mason Plumlee made 2nd of 2 Free Throws" },
            { team: "DUKE", points: 2, time: 8.35,  unc: 17, duke: 14, x: 9.132, y: 4.417, note: "Quinn Cook made Fadeaway Jump Shot" },
            { team: "UNC",  points: 1, time: 10.12, unc: 18, duke: 14, x: -1,    y: -1,    note: "Dexter Strickland made 1st of 2 Free Throws" },
            { team: "UNC",  points: 1, time: 10.12, unc: 19, duke: 14, x: -1,    y: -1,    note: "Dexter Strickland made 2nd of 2 Free Throws" },
            { team: "UNC",  points: 2, time: 11.45, unc: 21, duke: 14, x: 0.506, y: 5.039, note: "James Michael McAdoo made Layup" },
            { team: "DUKE", points: 2, time: 11.52, unc: 21, duke: 16, x: 0.45,  y: 5.011, note: "Mason Plumlee made Slam Dunk" },
            { team: "DUKE", points: 2, time: 12.05, unc: 21, duke: 18, x: 0.45,  y: 5.011, note: "Quinn Cook made Slam Dunk" },
            { team: "UNC",  points: 2, time: 12.22, unc: 23, duke: 18, x: 1.142, y: 6.476, note: "P.J. Hairston made Jump Shot" },
            { team: "UNC",  points: 2, time: 12.78, unc: 25, duke: 18, x: 0.506, y: 5.039, note: "Marcus Paige made Layup" },
            { team: "UNC",  points: 3, time: 13.30, unc: 28, duke: 18, x: 2.188, y: 8.077, note: "Reggie Bullock made 3-pt. Jump Shot" },
            { team: "DUKE", points: 2, time: 14.90, unc: 28, duke: 20, x: 8.911, y: 7.457, note: "Seth Curry made Jump Shot" },
            { team: "DUKE", points: 1, time: 15.18, unc: 28, duke: 21, x: -1,    y: -1,    note: "Quinn Cook made 1st of 2 Free Throws" },
            { team: "DUKE", points: 1, time: 15.18, unc: 28, duke: 22, x: -1,    y: -1,    note: "Quinn Cook made 2nd of 2 Free Throws" },
            { team: "UNC",  points: 2, time: 15.50, unc: 30, duke: 22, x: 1.15,  y: 7.279, note: "Leslie McDonald made Jump Shot" },
            { team: "DUKE", points: 2, time: 15.77, unc: 30, duke: 24, x: 9.665, y: 9.054, note: "Tyler Thornton made Jump Shot" },
            { team: "UNC",  points: 1, time: 16.17, unc: 31, duke: 25, x: -1,    y: -1,    note: "J.P. Tokoto made 1st of 2 Free Throws" },
            { team: "DUKE", points: 2, time: 17.32, unc: 31, duke: 27, x: 0.45,  y: 5.011, note: "Quinn Cook made Reverse Layup" },
            { team: "DUKE", points: 2, time: 18.97, unc: 33, duke: 29, x: 0.45,  y: 5.011, note: "Mason Plumlee made Slam Dunk" },
            { team: "UNC",  points: 1, time: 20.55, unc: 34, duke: 29, x: -1,    y: -1,    note: "James Michael McAdoo made 1st of 2 Free Throws" },
            { team: "DUKE", points: 2, time: 20.63, unc: 34, duke: 31, x: 9.455, y: 5.015, note: "Quinn Cook made Layup" },
            { team: "UNC",  points: 2, time: 21.40, unc: 36, duke: 31, x: 0.518, y: 5.012, note: "Reggie Bullock made Tip-in" },
            { team: "UNC",  points: 2, time: 22.00, unc: 38, duke: 31, x: 0.518, y: 5.012, note: "James Michael McAdoo made Slam Dunk" },
            { team: "DUKE", points: 1, time: 22.97, unc: 38, duke: 32, x: -1,    y: -1,    note: "Seth Curry made 2nd of 2 Free Throws" },
            { team: "DUKE", points: 3, time: 23.63, unc: 38, duke: 35, x: 9.255, y: 0.540, note: "Tyler Thornton made 3-pt. Jump Shot" },
            { team: "DUKE", points: 2, time: 23.42, unc: 38, duke: 37, x: 9.455, y: 5.015, note: "Rasheed Sulaimon made Layup" },
            { team: "UNC",  points: 3, time: 24.82, unc: 41, duke: 37, x: 1.892, y: 1.384, note: "P.J. Hairston made 3-pt. Jump Shot" },
            { team: "DUKE", points: 2, time: 25.30, unc: 41, duke: 39, x: 9.455, y: 5.015, note: "Josh Hairston made Slam Dunk" },
            { team: "DUKE", points: 3, time: 25.70, unc: 41, duke: 42, x: 7.771, y: 2.166, note: "Seth Curry made 3-pt. Jump Shot" },
            { team: "UNC",  points: 1, time: 26.07, unc: 43, duke: 42, x: -1,    y: -1,    note: "P.J. Hairston made 2nd of 2 Free Throws" },
            { team: "DUKE", points: 2, time: 26.50, unc: 43, duke: 44, x: 9.455, y: 5.015, note: "Quinn Cook made Layup" },
            { team: "DUKE", points: 3, time: 26.87, unc: 43, duke: 47, x: 7.327, y: 7.447, note: "Rasheed Sulaimon made 3-pt. Jump Shot" },
            { team: "UNC",  points: 2, time: 27.32, unc: 45, duke: 47, x: 1.575, y: 4.225, note: "Dexter Strickland made Jump Shot" },
            { team: "DUKE", points: 3, time: 27.55, unc: 45, duke: 50, x: 9.139, y: 0.355, note: "Tyler Thornton made 3-pt. Jump Shot" },
            { team: "DUKE", points: 2, time: 28.35, unc: 47, duke: 52, x: 9.455, y: 5.015, note: "Mason Plumlee made Layup" },
            { team: "DUKE", points: 2, time: 32.35, unc: 47, duke: 54, x: 9.037, y: 5.229, note: "Mason Plumlee made Hook Shot" },
            { team: "UNC",  points: 3, time: 32.70, unc: 50, duke: 54, x: 3.042, y: 5.005, note: "Reggie Bullock made 3-pt. Jump Shot" },
            { team: "UNC",  points: 1, time: 33.33, unc: 51, duke: 54, x: -1,    y: -1,    note: "Reggie Bullock made 1st of 2 Free Throws" },
            { team: "DUKE", points: 2, time: 33.50, unc: 51, duke: 56, x: 9.455, y: 5.015, note: "Rasheed Sulaimon made Layup" },
            { team: "DUKE", points: 3, time: 34.92, unc: 51, duke: 59, x: 8.175, y: 0.929, note: "Seth Curry made 3-pt. Jump Shot" },
            { team: "UNC",  points: 2, time: 35.17, unc: 53, duke: 59, x: 0.518, y: 5.012, note: "RP.J. Hairston made Tip-in" },
            { team: "DUKE", points: 2, time: 36.12, unc: 53, duke: 61, x: 8.916, y: 5.016, note: "Mason Plumlee made Hook Shot" },
            { team: "UNC",  points: 2, time: 36.37, unc: 55, duke: 61, x: 0.518, y: 5.012, note: "RMarcus Paige made Layup" },
            { team: "DUKE", points: 1, time: 36.73, unc: 55, duke: 62, x: -1,    y: -1,    note: "Seth Curry made 1st of 2 Free Throws" },
            { team: "DUKE", points: 1, time: 36.73, unc: 55, duke: 63, x: -1,    y: -1,    note: "Seth Curry made 2nd of 2 Free Throws" },
            { team: "UNC",  points: 2, time: 37.18, unc: 57, duke: 63, x: 0.518, y: 5.012, note: "RP.J. Hairston made Layup" },
            { team: "DUKE", points: 1, time: 37.67, unc: 57, duke: 64, x: -1,    y: -1,    note: "Mason Plumlee made 1st of 2 Free Throws" },
            { team: "DUKE", points: 1, time: 37.67, unc: 57, duke: 65, x: -1,    y: -1,    note: "Mason Plumlee made 2nd of 2 Free Throws" },
            { team: "UNC",  points: 2, time: 38.15, unc: 59, duke: 65, x: 0.518, y: 5.012, note: "RMarcus Paige made Layup" },
            { team: "UNC",  points: 1, time: 38.77, unc: 60, duke: 65, x: -1,    y: -1,    note: "Dexter Strickland made 1st of 2 Free Throws" },
            { team: "UNC",  points: 1, time: 38.77, unc: 61, duke: 65, x: -1,    y: -1,    note: "Dexter Strickland made 2nd of 2 Free Throws" },
            { team: "DUKE", points: 1, time: 39.38, unc: 61, duke: 66, x: -1,    y: -1,    note: "Rasheed Sulaimon made 1st of 2 Free Throws" },
            { team: "DUKE", points: 1, time: 39.38, unc: 61, duke: 67, x: -1,    y: -1,    note: "Rasheed Sulaimon made 2nd of 2 Free Throws" },
            { team: "UNC",  points: 1, time: 39.45, unc: 62, duke: 67, x: -1,    y: -1,    note: "P.J. Hairston made 1st of 2 Free Throws" },
            { team: "DUKE", points: 1, time: 39.50, unc: 62, duke: 68, x: -1,    y: -1,    note: "Mason Plumlee made 1st of 2 Free Throws" },
            { team: "DUKE", points: 1, time: 39.50, unc: 62, duke: 69, x: -1,    y: -1,    note: "Mason Plumlee made 2nd of 2 Free Throws" },
            { team: "UNC",  points: 2, time: 39.70, unc: 64, duke: 69, x: 0.518, y: 5.012, note: "P.J. Hairston made Layup" },
            { team: "DUKE", points: 1, time: 39.72, unc: 64, duke: 70, x: -1,    y: -1,    note: "Quinn Cook made 1st of 2 Free Throws" },
            { team: "DUKE", points: 1, time: 39.72, unc: 64, duke: 71, x: -1,    y: -1,    note: "Quinn Cook made 2nd of 2 Free Throws" },
            { team: "UNC",  points: 1, time: 39.87, unc: 65, duke: 71, x: -1,    y: -1,    note: "P.J. Hairston made 1st of 2 Free Throws" },
            { team: "UNC",  points: 1, time: 39.87, unc: 66, duke: 71, x: -1,    y: -1,    note: "P.J. Hairston made 2nd of 2 Free Throws" },
            { team: "DUKE", points: 1, time: 39.92, unc: 66, duke: 72, x: -1,    y: -1,    note: "Quinn Cook made 1st of 2 Free Throws" },
            { team: "DUKE", points: 1, time: 39.92, unc: 66, duke: 73, x: -1,    y: -1,    note: "Quinn Cook made 2nd of 2 Free Throws" },
            { team: "UNC",  points: 2, time: 39.98, unc: 68, duke: 73, x: 0.518, y: 5.012, note: "RP.J. Hairston made Slam Dunk" }
        ];
        
        var height = $("#heatmap1").height();
        var width  = $("#heatmap1").width();
        var dataset = {};
        dataset.max = 3;
        dataset.data = [];
        for (var i=0; i<game.length; i++) {
            if ((game[i].x !== -1) && (game[i].y !== -1)) {
                var x = Math.round(width  * game[i].x/10);
                var y = height - Math.round(height * game[i].y/10);
                dataset.data.push({"x": x, "y": y, "count": game[i].points});
            }
        }
        var heatmap1 = h337.create({
            element: "heatmap1",
            radius: 30,
            opacity: 50
        });
        heatmap1.store.setDataSet(dataset);
        $("#heatmap1 canvas").css("z-index", "1");

    };
    
    if (typeof contentLoaded != "undefined") {
        contentLoaded.done(draw);
    } else {
        window.addEventListener('load', draw);
    }

}());
</script>
