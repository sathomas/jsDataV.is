## Creating a Basic Bar Chart

If you're ever in doubt about what type of chart best explains your data, your first consideration should probably be the basic bar chart. We see bar charts so often that it's easy to overlook how effective they can be. Bar charts can show the evolution of a value over time, or they can provide a straightforward comparison of multiple values. Let's walk through the steps to build one.

### Step 1: Include the Required JavaScript

Since we're using the flotr2 library to create the chart, we need to include that library in our web pages. The flotr2 package isn't currently popular enough for public content distribution networks, so you'll need to download a copy and host it on your own web server. We'll use the minimized version (`flotr2.min.js`) since it provides the best performance.

Flotr2 doesn't require any other JavaScript libraries (such as jQuery), but it does rely on the <span class="smcp">HTML</span> _canvas_ feature. Major modern browsers (Safari, Chrome, Firefox) support canvas, but until version 9, Internet Explorer (<span class="smcp">IE</span>) did not. Unfortunately, there are still millions of users with <span class="smcp">IE8</span> (or even earlier). To support those users, we can include an additional library (`excanvas.min.js`) in our pages. That library is available from [Google](https://code.google.com/p/explorercanvas/). Since other browsers don't need this library, we use some special markup to make sure that only <span class="smcp">IE8</span> and earlier will load it. (Line 9.) Start with the following skeleton for your <span class="smcp">HTML</span> document:

``` {.html .numberLines .line-9}
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title></title>
  </head>
  <body>
    <!-- Page Content Here -->
    <!--[if lt IE 9]><script src="js/excanvas.min.js"></script><![endif]-->
    <script src="js/flotr2.min.js"></script>
  </body>
</html>
```

As you can see, we're including the JavaScript libraries at the end of the document. This approach lets the browser load the document's entire <span class="smcp">HTML</span> markup and begin laying out the page while it waits for the server to provide the JavaScript libraries.

### Step 2: Set Aside a &lt;div&gt; Element to Hold the Chart

Within our document, we need to create a `<div>` element to contain the chart. This element must have an explicit height and width, or flotr2 won't be able to construct the chart. We can indicate the element's size in a <span class="smcp">CSS</span> stylesheet, or we can place it directly on the element itself. Here's how the document might look with the latter approach.

``` {.html .numberLines}
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title></title>
  </head>
  <body>
    <div id='chart' style="width:600px;height:300px;"></div>
    <!--[if lt IE 9]><script src="js/excanvas.min.js"></script><![endif]-->
    <script src="js/flotr2.min.js"></script>
  </body>
</html>
```

Note that we've given the `<div>` an explicit `id` ('chart') so we can reference it later. You'll need to use a basic template like this (importing the flotr2 library and setting up the `<div>`) for all the charts in this chapter.

### Step 3: Define the Data

Now we can tackle the data that we want to display. For this example, I'll use the number of Manchester City wins in the English Premier League for the past seven years. Of course you'll want to substitute your actual data values, either with inline JavaScript (like the following example) or by another means (such as an <span class="smcp">AJAX</span> call to the server).

``` {.html .numberLines}
<script>
var wins = [
    [ [2006,13],[2007,11],[2008,15],[2009,15],
      [2010,18],[2011,21],[2012,28]
    ]
];
</script>
```

As you can see, we have three layers of arrays. Let's start from the inside and work our way out. For flotr2 charts, each data point is entered in a two-item array with an x-value and y-value. In our case we're using the year as the x-value and the number of wins as the y-value. We collect all these values in another array called a _series_. We place this series inside one more outer array. We could enter multiple series into this outer array, but for now we're showing only one series. Here's a quick summary of each layer:

* Each data point consists of an x-value and a y-value packaged in an array
* Each series consists of a set of data points packaged in an array
* The data to chart consists of one or more series packaged in an array

### Step 4: Draw the Chart

That's all the setup we need. A simple call to the flotr2 library, as shown here, creates our first attempt at a chart. Here's the code to do that. We first have to make sure the browser has loaded our document; otherwise the `chart` `<div>` might not be present. That's the point of `window.onload`. Once that event occurs, we call `Flotr.draw` with three parameters: the <span class="smcp">HTML</span> element to contain the chart, the data for the chart, and any chart options (in this case, we specify options only to tell flotr2 to create a bar chart from the data.

``` {.javascript .numberLines}
window.onload = function () {
    Flotr.draw(
        document.getElementById("chart"),
        wins,
        {
            bars: {
                show: true
            }
        }
    );
};
```

Since flotr2 doesn't require jQuery, we haven't taken advantage of any of jQuery's shortcuts in this example. If your page already includes jQuery, you can use the standard jQuery conventions for the flotr2 charts in this chapter to execute the script after the window has loaded, and to find the `<div>` container for the chart.

Figure NEXTFIGURENUMBER shows what you'll see on the web page:

<figure>
<div id='bar-chart1' style="width:600px;height:400px;"></div>
<figcaption>The flotr2 library turns data into a basic (if unpolished) bar chart.</figcaption>
</figure>

Now you have a bar chart, but it's not showing the information very effectively. Let's add some options incrementally until we get what we want.

### Step 5: Fix the Vertical Axis

The most glaring problem with the vertical axis is its scale. By default, flotr2 automatically calculates the range of the axis from the minimum and maximum values in the data. In our case the minimum value is 11 wins (from 2007), so flotr2 dutifully uses that as its y-axis minimum. In bar charts, however, it's almost always best to make zero the y-axis minimum. If you don't use zero, you risk overemphasizing the differences between values and confusing your users. Anyone who glances at the chart above, for example, might think that Manchester City did not win any matches in 2007. That certainly wouldn't do the team any justice.

Another problem with the vertical axis is the formatting. Flotr2 defaults to a precision of one decimal place, so it adds the superfluous ".0" to all the labels. We can fix both of these problems by specifying some y-axis options. The `min` property sets the minimum value for the y-axis, and the `tickDecimals` property tells flotr2 how many decimal places to show for the labels. In our case we don't want any decimal places.

``` {.javascript .numberLines}
Flotr.draw(document.getElementById("chart"), [wins], {
    bars: {
        show: true
    },
    yaxis: {
        min: 0,
        tickDecimals: 0
    }
});
```

As you can see in figure NEXTFIGURENUMBER, adding these options definitely improves the vertical axis since the values now start at zero and are formatted appropriately for integers.

<figure>
<div id='bar-chart2' style="width:600px;height:400px;"></div>
<figcaption>Simple options help flotr2 construct a better vertical axis.</figcation>
</figure>

### Step 6: Fix the Horizontal Axis

The horizontal axis needs some work as well. Just as with the y-axis, flotr2 assumes that the x-axis values are real numbers and shows one decimal place in the labels. Since we're charting years, we could simply set the precision to zero, as we did for the y-axis. But that's not a very general solution, since it won't work when the x-values are non-numeric categories (like team names). For the more general case, let's first change our data to use simple numbers rather than years for the x-values. Then we'll create an array that maps those simple numbers to arbitrary strings, which we can use as labels.

As you can see, instead of using the actual years for the x-values, we're simply using 0, 1, 2, and so on. We then define a second array that maps those integer values into strings. Although our strings are years (and thus numbers) they could be anything.

``` {.javascript .numberLines}
var wins = [[[0,13],[1,11],[2,15],[3,15],[4,18],[5,21],[6,28]]];
var years = [
    [0, "2006"],
    [1, "2007"],
    [2, "2008"],
    [3, "2009"],
    [4, "2010"],
    [5, "2011"],
    [6, "2012"]
];
```

Another problem is a lack of spacing between the bars. By default, flotr2 has each bar take up its full horizontal space, but that makes the chart look very cramped. We can adjust that with the `barWidth` property. Let's set it to `0.5` so that each bar takes up only half the available space.

Here's how we pass those options to flotr2. Note in line 11 that we use the `ticks` property of the x-axis to tell flotr2 which labels match which x-values.

``` {.javascript .numberLines .line-11}
Flotr.draw(document.getElementById("chart"), wins, {
    bars: {
        show: true,
        barWidth: 0.5
    },
    yaxis: {
        min: 0,
        tickDecimals: 0
    },
    xaxis: {
        ticks: years
    }
});
```

Now we're starting to get somewhere with our chart, as shown in figure NEXTFIGURENUMBER. The x-axis labels are appropriate for years, and there is space between the bars to improve the chart's legibility.

<figure>
<div id='bar-chart3' style="width:600px;height:400px;"></div>
<figcaption>We can define our own labels for the horizontal axis.</figcaption>
</figure>

### Step 7: Adjust the Styling

Now that the chart is functional and readable, we can pay some attention to the aesthetics. Let's add a title, get rid of the unnecessary grid lines, and adjust the coloring of the bars.

``` {.javascript .numberLines}
Flotr.draw(document.getElementById("chart"), wins, {
    title: "Manchester City Wins",
    colors: ["#89AFD2"],
    bars: {
        show: true,
        barWidth: 0.5,
        shadowSize: 0,
        fillOpacity: 1,
        lineWidth: 0
    },
    yaxis: {
        min: 0,
        tickDecimals: 0
    },
    xaxis: {
        ticks: years
    },
    grid: {
        horizontalLines: false,
        verticalLines: false
    }
});
```

As you can see in figure NEXTFIGURENUMBER, we now have a bar chart that Manchester City fans can be proud of.

<figure>
<div id='bar-chart4' style="width:600px;height:400px;"></div>
<figcaption>Additional options let us adjust the visual styles of the chart.</figcaption>
</figure>

For any data set of moderate size, the standard bar chart is often the most effective visualization. Users are already familiar with its conventions, so they don't have to spend any extra effort to understand the format. The bars themselves offer a clear visual contrast with the background, and they use a single linear dimension (height) to show differences between values, so users easily grasp the salient data.

### Step 8: Vary the Bar Color

So far our chart has been fairly monochromatic. That actually makes sense because we're showing the same value (Manchester City wins) across time. But bar charts are also good for comparing different values. Suppose, for example, we wanted to show the total wins for multiple teams in one year. In that case, it makes sense to use a different color for the bar of each team's bar. Let's of over how we can do that.

First we need to restructure the data somewhat. Previously we've shown only a single series. Now we want a different series for each team. Creating multiple series lets flotr2 color each independently. The following example shows how the new data series compares with the old. We've left the `wins` array in the code for comparison, but it's the `wins2` array that we're going to show now. Notice how the nesting of the arrays changes. Also, we're going to label each bar with the team abbreviation instead of the year.

``` {.javascript .numberLines}
var wins = [[[0,13],[1,11],[2,15],[3,15],[4,18],[5,21],[6,28]]];
var wins2 = [[[0,28]],[[1,28]],[[2,21]],[[3,20]],[[4,19]]];
var teams = [
    [0, "MCI"],
    [1, "MUN"],
    [2, "ARS"],
    [3, "TOT"],
    [4, "NEW"]
];
```

With those changes, our data is structured appropriately, and we can ask flotr2 to draw the chart. When we do that, let's use different colors for each team. Everything else is the same as before.

``` {.javascript .numberLines}
Flotr.draw(document.getElementById("chart"), wins2, {
    title: "Premier League Wins (2011-2012)",
    colors: ["#89AFD2", "#1D1D1D", "#DF021D", "#0E204B", "#E67840"],
    bars: {
        show: true,
        barWidth: 0.5,
        shadowSize: 0,
        fillOpacity: 1,
        lineWidth: 0
    },
    yaxis: {
        min: 0,
        tickDecimals: 0
    },
    xaxis: {
        ticks: teams
    },
    grid: {
        horizontalLines: false,
        verticalLines: false
    }
});
```

As you can see in figure NEXTFIGURENUMBER, with a few minor adjustments we've completely changed the focus of our bar chart. Instead of showing a single team at different points in time, we're now comparing different teams at the same point in time. That's the versatility of a simple bar chart.

<figure>
<div id='bar-chart5' style="width:600px;height:400px;"></div>
<figcaption>Bar charts can compare different quantities at one point in time as well as the same quantity at different points in time.</figcaption>
</figure>

We've used a lot of different code fragments to put together these examples. If you want to see a complete example in a single file, check out this book's source code.

### Step 9: Work Around Flotr2 "Bugs"

If you're building large web pages with a lot of content, you may run into a flotr2 "bug" that can be quite annoying. I've put "bug" in quotation marks because the flotr2 behavior is deliberate, but I believe it's not correct. In the process of constructing its charts, flotr2 creates dummy <span class="smcp">HTML</span> elements so it can calculate their sizes. Flotr2 doesn't intend these dummy elements to be visible on the page, so it hides them by positioning them off the screen. Unfortunately, what flotr2 thinks is off the screen isn't always. Specifically, around line 2280 in `flotr2.js` you'll find the statement:

``` {.javascript}
D.setStyles(div, { 'position' : 'absolute', 'top' : '-10000px' });
```

Flotr2 intends to place these dummy elements 10,000 pixels above the top of the browser window. However, <span class="smcp">CSS</span> absolute positioning can be relative to the containing element, which is not always the browser window. So if your document is more than 10,000 pixels high, you may find flotr2 scattering text in random-looking locations throughout the page. There are a couple of ways to work around this bug, at least until the flotr2 code is revised.

One option is to modify the code yourself. Flotr2 is open source, so you can freely download the full source code and modify it appropriately. One simple modification would position the dummy elements far to the right or left rather than above. Instead of `'top'` you could change the code to `'right'`. If you're not comfortable making changes to the library's source code, another option is to find and hide those dummy elements yourself. You should do this _after_ you've called `Flotr.draw()` for the last time. The latest version of jQuery can banish these extraneous elements with the following statement:

``` {.javascript .numberLines}
$(".flotr-dummy-div").parent().hide();
```

<script>
;(function(){

    draw = function() {

        var wins = [[[2006,13],[2007,11],[2008,15],[2009,15],[2010,18],[2011,21],[2012,28]]];
        Flotr.draw(document.getElementById("bar-chart1"),wins, {
            fontColor: chartStyles.color.text,
            grid: { color: chartStyles.color.text },
            bars: {
                show: true,
            },
        });
        Flotr.draw(document.getElementById("bar-chart2"),wins, {
            fontColor: chartStyles.color.text,
            grid: { color: chartStyles.color.text },
            bars: {
                show: true,
            },
            yaxis: {
                min: 0,
                tickDecimals: 0,
            }
        });
        wins = [[[0,13],[1,11],[2,15],[3,15],[4,18],[5,21],[6,28]]];
        var years = [
            [0, "2006"],
            [1, "2007"],
            [2, "2008"],
            [3, "2009"],
            [4, "2010"],
            [5, "2011"],
            [6, "2012"],
        ];
        Flotr.draw(document.getElementById("bar-chart3"),wins, {
            fontColor: chartStyles.color.text,
            grid: { color: chartStyles.color.text },
            bars: {
                show: true,
                barWidth: 0.5,
            },
            yaxis: {
                min: 0,
                tickDecimals: 0,
            },
            xaxis: {
                ticks: years
            }
        });
        Flotr.draw(document.getElementById("bar-chart4"),wins, {
            fontColor: chartStyles.color.text,
            title: "Manchester City Wins",
            colors: ["#89AFD2"],
            bars: {
                show: true,
                barWidth: 0.5,
                shadowSize: 0,
                fillOpacity: 1,
                lineWidth: 0,
            },
            yaxis: {
                min: 0,
                tickDecimals: 0,
            },
            xaxis: {
                ticks: years,
            },
            grid: {
                color: chartStyles.color.text,
                horizontalLines: false,
                verticalLines: false,
            }
        });
        var wins2 = [[[0,28]],[[1,28]],[[2,21]],[[3,20]],[[4,19]]];
        var teams = [
            [0, "MCI"],
            [1, "MUN"],
            [2, "ARS"],
            [3, "TOT"],
            [4, "NEW"],
        ];
        Flotr.draw(document.getElementById("bar-chart5"),wins2, {
            fontColor: chartStyles.color.text,
            title: "Premier League Wins (2011-2012)",
            colors: ["#89AFD2", "#1D1D1D", "#DF021D", "#0E204B", "#E67840"],
            bars: {
                show: true,
                barWidth: 0.5,
                shadowSize: 0,
                fillOpacity: 1,
                lineWidth: 0,
            },
            yaxis: {
                min: 0,
                tickDecimals: 0,
            },
            xaxis: {
                ticks: teams,
            },
            grid: {
                color: chartStyles.color.text,
                horizontalLines: false,
                verticalLines: false,
            }
        });

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
