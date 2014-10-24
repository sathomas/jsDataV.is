## Adding Magnitudes to X/Y Data with a Bubble Chart

Traditional scatter plots, like those described in the previous example, show the relationship between two values: the x-axis and the y-axis. Sometimes, however, two values are not adequate for the data we want to visualize. If we need to visualize three variables, we could use a scatter plot framework for two of the variables and then vary the size of the points according to the third variable. The resulting chart is a bubble chart.

Using bubble charts effectively requires some caution, though. As we saw earlier with pie charts, humans are not very good at accurately judging the relative areas of nonrectangular shapes, so bubble charts don’t lend themselves to precise comparisons of the bubble size. But if your third variable conveys only the general sense of a quantity rather than an accurate measurement, a bubble chart may be appropriate.

For this example we'll use a bubble chart to visualize the path of Hurricane Katrina in 2005. Our x- and y-values will represent position (latitude and longitude), and we'll ensure our users can interpret those values very accurately. For the third value—the bubble area—we'll use the storm's sustained wind speed. Since wind speed is only a general value anyway (as the wind gusts and subsides), a general impression is sufficient.

Just as in this chapter's first example, we need to include the flotr2 library in our web page and set aside a `<div>` element to contain the chart we'll construct. 

### Step 1: Define the Data

We'll start our example with data taken from Hurricane Katrina observations. The data includes the latitude and longitude of the observation and the sustained wind speed in miles/hour.

``` {.javascript .numberLines}
var katrina = [
    { north: 23.2, west: 75.5, wind:  35 },
    { north: 24.0, west: 76.4, wind:  35 },
    { north: 25.2, west: 77.0, wind:  45 },
    // Data set continues...
```

For the bubble chart, flotr2 needs each data point to be an array rather than an object, so lets build a simple function to convert the source data into that format. To make the function more general, we can use an optional parameter to specify a filter function. And while we're extracting data points, we can reverse the sign of the longitude so that west to east displays left to right.

The code for our function starts by setting the return value (`result`) to an empty array in line 2. Then it iterates through the input `source_array` one element at a time. If the `filter_function` parameter is available, and if it is a valid function, our code calls that function with the source array element as a parameter. If the function returns `true`, or if no function was passed in the parameter, then our code extracts the data point from the source element and pushes it onto the result array.

``` {.javascript .numberLines}
function get_points(source_array, filter_function) {
    var result = [];
    for (var i=0; i<source_array.length; i++) {
        if ( (typeof filter_function === "undefined")
          || (typeof filter_function !== "function")
          || filter_function(source_array[i]) ) {
            result.push([
                source_array[i].west * -1,
                source_array[i].north,
                source_array[i].wind
            ]);
        }
    }
    return result;
}
```

As you can see, the `filter_function` parameter is optional. If the caller omits it (or if it is not a valid function), then every point in the source ends up in the result. We won't use the filter function right away, but it will come in handy for the later steps in this example.

### Step 2: Create a Background for the Chart

Because the x- and y-values of our chart will represent position, a map makes the perfect chart background. To avoid any copyright concerns, we'll use map images from [Stamen Design](http://stamen.com/) that use data from [OpenStreetMap](http://openstreetmap.org/). Both are available under Creative Commons licenses, [<span class="smcp">CC</span> <span class="smcp">BY</span> 3.0](http://creativecommons.org/licenses/by/3.0) and [<span class="smcp">CC</span> <span class="smcp">BY</span> <span class="smcp">SA</span>](http://creativecommons.org/licenses/by-sa/3.0), respectively.

Figure NEXTFIGURENUMBER shows the map image on which we'll overlay the hurricane's path.

<figure>
<img src="img/gulf.png" height="400" width="600" />
<figcaption>A map image can be used as the background for a chart.</figcaption>
</figure>

Projections can be a tricky issue when you're working with maps, but for smaller mapped area they have less of an effect. Also, they're less critical in the center of the mapped region. For this example, with its relatively small area and action focused in the center, we'll assume the map image uses a Mercator projection. That assumption lets us avoid any advanced mathematical transformations when converting from latitude and longitude to x- and y-values.

### Step 3: Plot the Data

It will take us several iterations to get the plot looking the way we want, but let's start with the minimum number of options. One parameter we will need to specify is the bubble radius. For static charts such as this example, it's easiest to experiment with a few values to find the best size. A value of 0.3 seems effective for our chart. In addition to the options, the `draw()` method expects an <span class="smcp">HTML</span> element that will contain the chart, as well as the data itself. As you can see, we're using our transformation function to extract the data from our source. The return value from that function serves directly as the second parameter to `draw()`.

``` {.javascript .numberLines}
Flotr.draw(
    document.getElementById("chart"),
    [{ 
      data: get_points(katrina), 
      bubbles: {show:true, baseRadius: 0.3}
    }]
);
```

For now, we haven't bothered with the background image. We'll add that to the chart once we've adjusted the data a bit. The result in figure NEXTFIGURENUMBER still needs improvement, but it's a working start.

<figure>
<div id="bubble-chart1" style="width:600px;height:400px;"></div>
<figcaption>A basic bubble chart varies the size of the data points.</figcaption>
</figure>

### Step 4: Add the Background

Now that we've seen how flotr2 will plot our data, we can add in the background image. We'll want to make a few other additions at the same time. First, as long as we're adding the background, we can remove the grid lines. Second, let's disable the axis labels; latitude and longitude values don't have much meaning for the average user, and they're certainly not necessary with the map. Finally, and most importantly, we need to adjust the scale of the chart to match the map image.

Our image shows latitude values from 23.607°<span class='smcp'>N</span> to 33.657°<span class='smcp'>N</span> and longitude from 77.586°<span class='smcp'>W</span> to 94.298°<span class='smcp'>W</span>. We provide those values to flotr2 as the ranges for its axes in line 11. The `grid` options in lines 5 through 9 tell flotr2 to omit both horizontal and vertical grid lines, and they designate the background image. The `xaxis` and `yaxis` options in lines 10 and 11 disable labels for both axes and specify their minimum and maximum values. Note that because we're dealing with longitudes west of 0, we're using negative values.

``` {.javascript .numberLines}
Flotr.draw(
    document.getElementById("chart"),
    [{ 
      data: get_points(katrina), 
      bubbles: {show:true, baseRadius: 0.3} 
    }],
    { 
        grid: {
            backgroundImage: "img/gulf.png", 
            horizontalLines: false, 
            verticalLines: false
        },
        yaxis: {showLabels: false, min: 23.607, max: 33.657},
        xaxis: {showLabels: false, min: -94.298, max: -77.586}
    }
);
```

At this point the chart in figure NEXTFIGURENUMBER is looking pretty good. We can clearly see the path of the hurricane and get a sense of how the storm strengthened and weakened along that path.

<figure>
<div id="bubble-chart2" style="width:600px;height:400px;background-image:url(img/gulf.png);background-size:cover;"></div>
<figcaption>With a map as the background image, the chart has a meaningful context.</figcaption>
</figure>

### Step 5: Color the Bubbles

This example gives us a chance to provide even more information to our users without overly distracting them, we have the option to modify the bubble colors. Let's use that freedom to indicate the Saffir-Simpson classification for the storm at each measurement point.

Here's where we can take advantage of the filter option we included in the data formatting function. The Saffir-Simpson classification is based on wind speed, so we'll filter based on the `wind` property. For example, here's how to extract only those values that represent a Category 1 hurricane, with wind speeds from 74 to 95 miles per hour. The function we pass to `get_points` only returns `true` only for appropriate wind speeds.

``` {.javascript .numberLines}
cat1 = get_points(katrina, function(obs) {
    return (obs.wind >= 74) && (obs.wind < 95);
});
```

To have flotr2 assign different colors to different strengths, we divide the data into multiple series with the following code. Each series gets its own color. In addition to the five hurricane categories, we've also parsed out the points for tropical storm and tropical depression strength.

``` {.javascript .numberLines}
Flotr.draw(
    document.getElementById("chart"),
    [
      { 
          data: get_points(katrina, function(obs) {
                    return (obs.wind < 39);
                }), 
          color: "#74add1",
          bubbles: {show:true, baseRadius: 0.3, lineWidth: 1}
      },{ 
      // Options continue...
      },{ 
          data: get_points(katrina, function(obs) {
                    return (obs.wind >= 157);
                }), 
          color: "#d73027",
          label: "Category 5",
          bubbles: {show:true, baseRadius: 0.3, lineWidth: 1}
      }
    ],{ 
        grid: {
            backgroundImage: "img/gulf.png", 
            horizontalLines: false, 
            verticalLines: false
        },
        yaxis: {showLabels: false, min: 23.607, max: 33.657},
        xaxis: {showLabels: false, min: -94.298, max: -77.586},
        legend: {position: "sw"}
    }
);
```

We've also added labels for the hurricane categories and placed a legend in the lower left of the chart, as you can see in figure NEXTFIGURENUMBER.

<figure>
<div id="bubble-chart3" style="width:600px;height:400px;background-image:url(img/gulf.png);background-size:cover;"></div>
<figcaption>Different colors can indicate wind strength.</figcaption>
</figure>

### Step 6: Adjust the Legend Styles

By default, flotr2 seems to prefer all elements as large as possible. The legend in figure LASTFIGURENUMBER is a good example: it looks cramped and unattractive. Fortunately, the fix is rather simple: we simply add some <span class="smcp">CSS</span> styles which give the legend padding. We can also set the legend's background color explicitly rather than relying on flotr2's manipulation of opacity.

``` {.css .numberLines}
.flotr-legend {
    padding: 5px;
    background-color: #ececec;
}
```

To prevent flotr2 from creating its own background for the legend, set the opacity to zero.

``` {.javascript .numberLines}
Flotr.draw(
    document.getElementById("chart")
        // Additional options...
        legend: {position: "sw", backgroundOpacity: 0,},
        // Additional options...
```

With that final tweak, we have the finished product of figure NEXTFIGURENUMBER. We don't want to use the flotr2 options to specify a title because flotr2 will shrink the chart area by an unpredictable amount (since we cannot predict the font sizing in the users' browsers). That would distort our latitude transformation. Of course, it's easy enough to use <span class="smcp">HTML</span> to provide the title.

<style>
#bubble-chart4 .flotr-legend { background-color: #ececec; }
</style>
<figure>
<div style="width:600px;text-align:center;">Hurricane Katrina 2005: Course and Wind Strength</div>
<div id="bubble-chart4" style="width:600px;height:400px;background-image:url(img/gulf.png);background-size:cover;"></div>
<figcaption>A bubble chart shows a third dimension (wind speed) as well as position.</figcaption>
</figure>

The bubble chart adds another dimension to the two-dimensional scatter chart. In fact, as in our example, it can add two additional dimensions. The example uses bubble size to represent wind speed and color to indicate the hurricane's classification. Both of these additional values require care, however. Humans are not good at comparing two-dimensional areas, nor can they easily compare relative shades or colors. We should never use the extra bubble chart dimensions to convey critical data or precise quantities, therefore. Rather, they work best in examples such as this example—neither the exact wind speed nor the specific classification need be as precise as the location. Few people can tell the difference between 100 and 110 mile-per-hour winds, but they certainly know the difference between New Orleans and Dallas.

<script>
;(function(){

    draw = function() {

        var katrina = [
            { north: 23.2, west: 75.5, wind:  35 },
            { north: 24.0, west: 76.4, wind:  35 },
            { north: 25.2, west: 77.0, wind:  45 },
            { north: 26.0, west: 77.6, wind:  45 },
            { north: 26.2, west: 78.7, wind:  50 },
            { north: 26.1, west: 79.9, wind:  75 },
            { north: 25.5, west: 80.7, wind:  75 },
            { north: 25.1, west: 82.2, wind: 100 },
            { north: 24.8, west: 82.9, wind: 100 },
            { north: 24.4, west: 84.0, wind: 110 },
            { north: 24.4, west: 84.6, wind: 115 },
            { north: 25.1, west: 86.8, wind: 145 },
            { north: 25.7, west: 87.7, wind: 160 },
            { north: 26.5, west: 88.6, wind: 175 },
            { north: 27.9, west: 89.5, wind: 160 },
            { north: 29.7, west: 89.6, wind: 135 },
            { north: 30.8, west: 89.6, wind: 105 },
            { north: 31.9, west: 89.6, wind:  75 },
            { north: 32.9, west: 88.9, wind:  65 },
            { north: 34.7, west: 88.4, wind:  50 },
        ];
        var get_points = function(source_array, filter_function) {
            var result = [];
            for (var i=0; i<source_array.length; i++) {
                if ( (typeof filter_function === "undefined")
                  || (typeof filter_function !== "function")
                  || filter_function(source_array[i]) ) {
                    result.push([
                        source_array[i].west * -1,
                        source_array[i].north,
                        source_array[i].wind,
                    ]);
                }
            }
            return result;
        };
        Flotr.draw(
            document.getElementById("bubble-chart1")
            ,[{ data: get_points(katrina), bubbles: {show:true, baseRadius: 0.3} }]
            ,{fontColor: chartStyles.color.text, grid: { color: chartStyles.color.text }}
        );
        Flotr.draw(
            document.getElementById("bubble-chart2")
            ,[{ data: get_points(katrina), bubbles: {show:true, baseRadius: 0.3} }]
            ,{ 
                fontColor: chartStyles.color.text,      
                grid: {
                    color: chartStyles.color.text,
                    horizontalLines: false, 
                    verticalLines: false
                },
                yaxis: {showLabels: false, min: 23.607, max: 33.657},
                xaxis: {showLabels: false, min: -94.298, max: -77.586},
            }
        );
        Flotr.draw(
            document.getElementById("bubble-chart3")
            ,[
              { 
                  data: get_points(katrina, function(obs) {
                            return (obs.wind < 39);
                        }), 
                  color: "#74add1",
                  bubbles: {show:true, baseRadius: 0.3, lineWidth: 1}, 
              },
              { 
                  data: get_points(katrina, function(obs) {
                            return (obs.wind >= 39) && (obs.wind < 74);
                        }), 
                  color: "#abd9e9",
                  bubbles: {show:true, baseRadius: 0.3, lineWidth: 1}, 
              },
              { 
                  data: get_points(katrina, function(obs) {
                            return (obs.wind >= 74) && (obs.wind < 95);
                        }),
                  color: "#ffffbf",
                  label: "Category 1",
                  bubbles: {show:true, baseRadius: 0.3, lineWidth: 1}, 
              },
              { 
                  data: get_points(katrina, function(obs) {
                            return (obs.wind >= 95) && (obs.wind < 110);
                        }), 
                  color: "#fee090",
                  label: "Category 2",
                  bubbles: {show:true, baseRadius: 0.3, lineWidth: 1}, 
              },
              { 
                  data: get_points(katrina, function(obs) {
                            return (obs.wind >= 110) && (obs.wind < 130);
                        }), 
                  color: "#fdae61",
                  label: "Category 3",
                  bubbles: {show:true, baseRadius: 0.3, lineWidth: 1}, 
              },
              { 
                  data: get_points(katrina, function(obs) {
                            return (obs.wind >= 130) && (obs.wind < 157);
                        }), 
                  color: "#f46d43",
                  label: "Category 4",
                  bubbles: {show:true, baseRadius: 0.3, lineWidth: 1}, 
              },
              { 
                  data: get_points(katrina, function(obs) {
                            return (obs.wind >= 157);
                        }), 
                  color: "#d73027",
                  label: "Category 5",
                  bubbles: {show:true, baseRadius: 0.3, lineWidth: 1}, 
              },
             ]
            ,{ 
                fontColor: chartStyles.color.text,
                grid: {
                    color: chartStyles.color.text,
                    horizontalLines: false, 
                    verticalLines: false
                },
                yaxis: {showLabels: false, min: 23.607, max: 33.657},
                xaxis: {showLabels: false, min: -94.298, max: -77.586},
                legend: {position: "sw"},
            }
        );
        Flotr.draw(
            document.getElementById("bubble-chart4")
            ,[
              { 
                  data: get_points(katrina, function(obs) {
                            return (obs.wind < 39);
                        }), 
                  color: "#74add1",
                  bubbles: {show:true, baseRadius: 0.3, lineWidth: 1}, 
              },
              { 
                  data: get_points(katrina, function(obs) {
                            return (obs.wind >= 39) && (obs.wind < 74);
                        }), 
                  color: "#abd9e9",
                  bubbles: {show:true, baseRadius: 0.3, lineWidth: 1}, 
              },
              { 
                  data: get_points(katrina, function(obs) {
                            return (obs.wind >= 74) && (obs.wind < 95);
                        }),
                  color: "#ffffbf",
                  label: "Category 1",
                  bubbles: {show:true, baseRadius: 0.3, lineWidth: 1}, 
              },
              { 
                  data: get_points(katrina, function(obs) {
                            return (obs.wind >= 95) && (obs.wind < 110);
                        }), 
                  color: "#fee090",
                  label: "Category 2",
                  bubbles: {show:true, baseRadius: 0.3, lineWidth: 1}, 
              },
              { 
                  data: get_points(katrina, function(obs) {
                            return (obs.wind >= 110) && (obs.wind < 130);
                        }), 
                  color: "#fdae61",
                  label: "Category 3",
                  bubbles: {show:true, baseRadius: 0.3, lineWidth: 1}, 
              },
              { 
                  data: get_points(katrina, function(obs) {
                            return (obs.wind >= 130) && (obs.wind < 157);
                        }), 
                  color: "#f46d43",
                  label: "Category 4",
                  bubbles: {show:true, baseRadius: 0.3, lineWidth: 1}, 
              },
              { 
                  data: get_points(katrina, function(obs) {
                            return (obs.wind >= 157);
                        }), 
                  color: "#d73027",
                  label: "Category 5",
                  bubbles: {show:true, baseRadius: 0.3, lineWidth: 1}, 
              },
             ]
            ,{ 
                fontColor: chartStyles.color.text,
                grid: {
                    color: chartStyles.color.text,
                    horizontalLines: false, 
                    verticalLines: false
                },
                yaxis: {showLabels: false, min: 23.607, max: 33.657},
                xaxis: {showLabels: false, min: -94.298, max: -77.586},
                legend: {position: "sw", backgroundOpacity: 0, fontColor: chartStyles.color.text}
            }
        );
    
        var dummyElements = document.getElementsByClassName('flotr-dummy-div');
        Array.prototype.forEach.call(dummyElements, function(dummyElement){
            dummyElement.parentNode.style.display = 'none';
        });

    };
    
    if (typeof contentLoaded != "undefined") {
        contentLoaded.done(draw);
    } else {
        window.addEventListener('load', draw);
    }

}());
</script>