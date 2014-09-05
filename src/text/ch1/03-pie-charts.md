## Emphasizing Fractions Using a Pie Chart

Pie charts don't get a lot of love in the visualization community, and there's a pretty good reason for that: they're rarely the most effective way to communicate data. We will walk through the steps to create pie charts in this section, but it's worth spending a little bit of time understanding the problems they introduce. Here, for example, is a simple pie chart. Can you tell from the chart in figure NEXTFIGURENUMBER which color is the largest? Or the smallest?

<figure>
<div id="pie-chart1" style="width:300px;height:300px"></div>
<figcaption>Pies charts can make it hard to compare values.</figcaption>
</figure>

It's very hard to tell. That's because humans are not particularly good at judging the relative size of areas, especially if those areas aren't rectangles. If we really wanted to compare these five values, a bar chart works much better. Figure NEXTFIGURENUMBER shows the same values in a bar chart:

<figure>
<div id="pie-chart2" style="width:400px;height:300px"></div>
<figcaption>Bar charts usually make comparisons easier.</figcaption>
</figure>

Now, of course, it's easy to rank each color. With a bar chart we only have to compare one dimension—height. This yields a simple rule of thumb: if you're comparing different values against each other, consider a bar chart first. It will almost always provide the best visualization.

One case, however, where pie charts can be quite effective is when we want to compare a single partial value against a whole. Say, for example, we want to visualize the percentage of the world's population that lives in poverty. In such a case a pie chart may work quite well. Here's how we can construct such a chart using the flotr2 JavaScript library.

Just as in this chapter's first example, we need to include the flotr2 library in our web page and set aside a `<div>` element to contain the chart we'll construct. The unique aspects of this example begin below.

### Step 1: Define the Data

The data in this case is quite straightforward. According to the [World Bank](http://www.newgeography.com/content/003325-alleviating-world-poverty-a-progress-report), at the end of 2008, 22.4% of the world's people lived on less than $1.25/day. That's the fraction that we want to emphasize with our chart.

``` {.javascript .numberLines}
var data = [[[0,22.4]],[[1,77.6]]];
```

Here we have an array with two data series: one for the percentage of the population in poverty (22.4%) and a second series for the rest (77.6%). Each series itself consists of an array of points. In this example, and for pie charts in general, there is only one point in each series, with an x-value and a y-value (which are each stored together in yet another, inner array). For pie charts the x-values are irrelevant, so we simply include placeholder values 0 and 1.

### Step 2: Draw the Chart

To draw the chart, we call the `draw` method of the `Flotr` object. That method takes three parameters: the element in our <span class="smcp">HTML</span> document in which to place the chart, the data for our chart, and any options. We'll start with the minimum set of options required for a pie chart. As you can see, flotr2 requires a bit more options for a minimum pie chart than it does for other common chart types. For both the x- and y-axes we need to disable labels, which we do by setting the `showLabels` property `false` in lines 7 and 10. We also have to turn off the grid, as a grid doesn't make a lot of sense for a pie chart. Setting the `verticalLines` and `horizontalLines` properties of the `grid` option to `false` in lines 13 and 14 accomplishes that.

``` {.javascript .numberLines}
window.onload = function () {
    Flotr.draw(document.getElementById("chart"), data, {
        pie: {
            show: true
        },
        yaxis: {
            showLabels: false
        },
        xaxis: {
            showLabels: false
        },
        grid: {
            horizontalLines: false,
            verticalLines: false
        }
    });
}
```

Since flotr2 doesn't require jQuery, we're not using any of the jQuery convenience functions in this example. If you do have jQuery for your pages, you can simplify the code above a little bit. Figure NEXTFIGURENUMBER is a start, but it's hard to tell exactly what the graph intends to show.

<figure>
<div id='pie-chart3' style="width:400px;height:400px;"></div>
<figcaption>Without effective labeling, pie charts can be difficult to interpret.</figcaption>
</figure>

### Step 3: Label the Values

The next step is to add some text labels and a legend to say what the chart is displaying. To label each quantity separately, we have to change the structure of our data. Instead of using an array of series, we'll create an object to store each series. Each object's `data` property will contain the corresponding series, and we'll add a `label` property for the text labels.


``` {.javascript .numberLines}
var data = [
    {data: [[0,22.4]], label: "Extreme Poverty"},
    {data: [[1,77.6]]}
];
```
By structuring our data this way, flotr2 will automatically identify labels associated with each series. Now when we call the `draw()` method, we just need to add a title option. Flotr2 will add the title above the graph, and create a simple legend identifying the pie portions with our labels. To make the chart a little more engaging, we'll pose a question in our title. That's why we're only labeling one of the areas in the chart: the labelled area answers the question in the title.

``` {.javascript .numberLines}
Flotr.draw(document.getElementById("chart"),data, {
    title: "How Much of the World Lives on $1.25/day?",
    pie: {
        show: true
    },
    yaxis: {
        showLabels: false
    },
    xaxis: {
        showLabels: false
    },
    grid: {
        horizontalLines: false,
        verticalLines: false
    }
});
```

The chart in figure NEXTFIGURENUMBER reveals the data quite clearly.

<figure style="margin-top:20px;">
<div id='pie-chart4' style="width:400px;height:400px;"></div>
<figcaption>Labels and titles can help make a chart engaging.</figcaption>
</figure>

Although pie charts have a bad reputation in the data visualization community, there are occasional applications for which they are quite effective. They're not very good at letting users compare multiple values, but as in this example, they do provide a nice and easily understandable picture showing the proportion of a single value within a whole.

<script>
;(function(){

    draw = function() {

        var data = [[[0,23]],[[1,22]],[[2,20]],[[3,18]],[[4,17]]];
        Flotr.draw(document.getElementById("pie-chart1"),data, {
            fontColor: chartStyles.color.text,
            colors: [chartStyles.color.primary,chartStyles.color.alternateLightest,chartStyles.color.secondaryDarkest,chartStyles.color.alternateDarkest,chartStyles.color.secondaryLightest],
            pie: {
                show: true,
                shadowSize: 0,
                fillOpacity: 1,
                lineWidth: 0,
                sizeRatio: 0.75,
                labelFormatter: function() { return false;},
            },
            yaxis: {
                showLabels: false,
            },
            xaxis: {
                showLabels: false,
            },
            grid: {
                color: chartStyles.color.text,
                horizontalLines: false,
                verticalLines: false,
                outlineWidth: 0,
                outline: ""
            }
        });
        Flotr.draw(document.getElementById("pie-chart2"),data, {
            fontColor: chartStyles.color.text,
            colors: [chartStyles.color.primary,chartStyles.color.alternateLightest,chartStyles.color.secondaryDarkest,chartStyles.color.alternateDarkest,chartStyles.color.secondaryLightest],
            bars: {
                show: true,
                barWidth: 0.75,
                shadowSize: 0,
                fillOpacity: 1,
                lineWidth: 0,
            },
            yaxis: {
                min: 0,
                tickDecimals: 0,
                showLabels: false,
            },
            xaxis: {
                showLabels: false,
            },
            grid: {
                color: chartStyles.color.text,
                horizontalLines: false,
                verticalLines: false,
                outlineWidth: 0,
                outline: ""
            }
        });
        data = [[[0,22.4]],[[1,77.6]]];
        Flotr.draw(document.getElementById("pie-chart3"),data, {
            fontColor: chartStyles.color.text,
            colors: [chartStyles.color.primary,chartStyles.color.secondary],
            pie: {
                show: true,
                shadowSize: 0,
                fillOpacity: 1,
                lineWidth: 0,
            },
            yaxis: {
                showLabels: false,
            },
            xaxis: {
                showLabels: false,
            },
            grid: {
                color: chartStyles.color.text,
                horizontalLines: false,
                verticalLines: false,
                outlineWidth: 0,
                outline: ""
            }
        });
        data = [
            {data: [[0,22.4]], label: "Extreme Poverty"},
            {data: [[1,77.6]], }
        ];
        Flotr.draw(document.getElementById("pie-chart4"),data, {
            fontColor: chartStyles.color.text,
            colors: [chartStyles.color.primary,chartStyles.color.secondary],
            title: "How Much of the World Lives on $1.25/day?",
            pie: {
                show: true,
                sizeRatio: 0.7,
                shadowSize: 0,
                fillOpacity: 1,
                lineWidth: 0,
            },
            yaxis: {
                showLabels: false,
            },
            xaxis: {
                showLabels: false,
            },
            grid: {
                color: chartStyles.color.text,
                horizontalLines: false,
                verticalLines: false,
                outlineWidth: 0,
                outline: ""
            },
            legend: {backgroundOpacity: 0,},
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
