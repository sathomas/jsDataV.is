## Charting Many Variables

By design, sparklines take up very little space on a page, and that makes them ideal for another visualization challenge: showing many variables at once. Of course regular line charts and bar charts can plot multiple data sets simultaneously; however, these multiple series charts rapidly grow unwieldy if the number of data sets exceeds four or five. Some visualization projects show dozens of different variables, far beyond what a multiple series chart can accommodate. A _small multiples_ approach turns the standard chart approach completely around. Instead of showing one chart with multiple data sets, show multiple charts each with a single data set. Placing lots of charts on a page means that each individual chart cannot take up much space. That is the exactly the problem that sparklines solve.

We won't go too crazy with this example to keep the code examples manageable, but it's easy to extend this approach to many more variables. In our case we'll construct a visualization for analyzing stock market performance. The companies in our analysis will include the [10 largest American companies in 2012](http://money.cnn.com/magazines/fortune/fortune500/2012/full_list/), (the "Fortune 10"), Barclay's [best technology stocks for 2012](http://www.marketwatch.com/story/barclays-best-tech-stocks-for-2012-2011-12-20) (as identified in December 2011), and Bristol-Myers Squibb, which <span class="smcp">CR</span> Magazine named the [top company in America for corporate responsibility](http://www.thecro.com/files/100Best2012_List_3.8.pdf). Those selections are completely arbitrary, but the example is designed to include three different cases which we will style differently in our visualization. We'll treat one as a general case (The Fortune 10 list), one as a special class (the Barclay's list), and one as a unique variable (Bristol-Myers Squibb).

Just as in this chapter's first example, we need to include the sparklines and jQuery libraries in our web page.

### Step 1: Prepare the HTML Markup

The sparklines library makes is easy to embed the data directly inside the <span class="smcp">HTML</span> markup. For this example, an <span class="smcp">HTML</span> table is the most appropriate structure for the data. Here's how such a table could begin. (For brevity the excerpt below doesn't include the full <span class="smcp">HTML</span>, but the complete example is available in the book's source code.)

``` {.html .numberLines}
<table>
    <thead>
        <tr>
            <th>Symbol</th>
            <th>Company</th>
            <th>2012 Performance</th>
            <th>Gain</th>
        </tr>
    </thead>
    <tbody>
        <tr class='barclays'>
            <td>AAPL</td>
            <td>Apple Inc.</td>
            <td class='sparkline'>418.68,416.11,416.6,443.34,455.63,489.08,497.7,517.81,...</td>
            <td>27%</td>
        </tr>
        <tr class='barclays'>
            <td>ALTR</td>
            <td>Altera Corporation</td>
            <td class='sparkline'>37.1,36.92,39.93,39.81,40.43,39.76,39.73,38.55,36.89,...</td>
            <td>-7%</td>
        </tr>
        // Markup continues... 
    </tbody>
</table>
```

The table has three important characteristics relevant to our visualization.

* Each stock is a single table row (`<tr>`).
* Stocks from Barclay's Technology list have the class attribute `'barclays'` added to that `<tr>` element.
* The top Corporate Responsibility stock has no special attributes or characteristics (yet).

### Step 2: Draw the Charts

Just as in this chapter's first example, creating the sparklines using default options is amazingly simple. It only takes a single line of JavaScript. We use jQuery to select all the elements which contain sparkline data, and we call the `sparkline()` function to generate the charts. Notice that we only have to make one call to `sparkline()`, even though each chart has unique data. That's a major benefit of placing the data within the <span class="smcp">HTML</span> itself.

``` {.javascript .numberLines}
$(function() {
    $('.sparkline').sparkline();
}
```

The resulting charts in figure NEXTFIGURENUMBER all have identical styles, but we'll fix that in the next few steps.

<figure>
<table class="table table-bordered table-condensed" id="multiples-chart1" class="figure">
<thead>
<tr>
<th>Symbol</th>
<th>Company</th>
<th>2012 Performance</th>
<th>Gain</th>
</tr>
</thead>
<tbody>
<tr class='barclays'>
<td>AAPL</td>
<td>Apple Inc.</td>
<td class='sparkline'>418.68,416.11,416.6,443.34,455.63,489.08,497.7,517.81,540.38,540.37,580.42,590.8,594.27,628.1,599.9,567.94,597.69,560.27,561.72,525.71,557.34,556.05,575.21,569.08,576.98,578.86,600.55,599.64,598.98,580.01,610.28,618.87,645.16,660.2,662.22,677.35,688.14,696.91,664.07,649.62,626.85,607.07,601.25,574.18,547.06,527.68,571.5,585.28,533.25,509.79,519.33,509.59,532.17</td>
<td>27%</td>
</tr>
<tr class='barclays'>
<td>ALTR</td>
<td>Altera Corporation</td>
<td class='sparkline'>37.1,36.92,39.93,39.81,40.43,39.76,39.73,38.55,36.89,37.68,39.18,38.47,39.49,37.85,37.17,34.95,35.26,33.4,33.53,33.03,34.21,32.09,33.29,32.86,33.24,33.64,32.54,31.16,31.04,35.82,35.58,37,36.23,36.23,37.21,37.85,38.03,36.62,33.89,33.32,32.22,32.4,30.3,30.41,30.64,30.45,31.86,32.39,31.58,32.86,34.5,34.01,34.39</td>
<td>(7%)</td>
</tr>
<tr class='crmagazine'>
<td>BMY</td>
<td>Bristol Meyers Squibb Co.</td>
<td class='sparkline'>32.86,32.46,31.36,31.01,30.98,30.64,31.81,31.31,31.3,31.61,31.87,31.65,32.41,32.67,31.57,33.21,32.32,32.37,32.12,31.74,32.1,32.33,33.34,33.21,34.3,34.88,33.9,34.64,34.69,35.31,31.97,31.07,30.92,31.9,32.33,32.61,32.55,32.92,33.05,33.28,32.73,33.45,33.26,32.82,31.88,31.37,32.27,32.28,32.21,32.38,32.21,31.56,32.24</td>
<td>(2%)</td>
</tr>
<tr class='fortune'>
<td>BRKA</td>
<td>Berkshire Hathaway Inc.</td>
<td class='sparkline'>114500,116520,119775,119211,119800,117980,119190,120000,117434,119065,122190,122170,121900,121295,118385,118580,120925,121950,122795,119850,119500,119845,122000,123375,122670,124945,123898,126625,125730,127735,128479,127175,128880,128225,126560,129942,133000,134584,132700,135555,132502,133841,129725,130550,127585,129345,132606,131916,131090,133795,134800,133000,134060</td>
<td>17%</td>
</tr>
<tr class='fortune'>
<td>COP</td>
<td>ConocoPhillips</td>
<td class='sparkline'>52.95,51.26,51.89,50.58,51.35,52.65,53.95,55.85,57.1,56.74,56.76,56.26,55.9,55.42,54.15,53.59,52.93,51.29,51.61,49.65,50.91,50.01,52.73,54.18,52.18,54.59,53.49,53.71,55.34,54.34,55.07,56.62,56.73,55.71,56.14,55.99,57.54,56.7,56.52,56.92,56.17,57.45,57.31,57.65,55.67,55.03,56.67,56.94,57.94,57.69,58.61,57.07,57.99</td>
<td>10%</td>
</tr>
<tr class='barclays'>
<td>CTXS</td>
<td>Citrix Systems, Inc.</td>
<td class='sparkline'>62.02,64.85,68.12,65.14,68.78,71.46,74.77,75.16,75.43,76.27,78.2,77.68,78.91,78.28,75.12,77.78,85.78,82.85,79.46,74.82,75.43,70.79,77.12,80.12,80.14,83.94,77.45,76.63,80.75,77.81,72.44,76.26,78.08,77,77.69,80.59,81.74,81.19,76.53,71.57,67.7,64.16,62.82,62.77,60.17,59.21,61.77,61.16,62.03,65.02,66.15,64.3,65.62</td>
<td>6%</td>
</tr>
<tr class='fortune'>
<td>CVX</td>
<td>Chevron Corporation</td>
<td class='sparkline'>104.78,102.63,103.4,100.57,102.06,101.85,103.97,106.33,106.85,106.81,107.5,103.68,104.51,102.11,98.24,99.94,103.52,101.11,100.1,96.84,97.24,94.83,99.18,102.62,98.79,103.77,103.34,104.27,107.4,107.47,109.3,111.69,111.7,111.05,111.2,113.03,116.25,116.79,115.56,116.5,111.11,112.41,110.23,107.44,104.94,102.4,105.47,105.69,106.99,107.82,109.71,106.45,108.14</td>
<td>3%</td>
</tr>
<tr class='fortune'>
<td>F</td>
<td>Ford Motor Company</td>
<td class='sparkline'>11.5,11.82,12.36,12.03,12.6,12.26,12.57,12.05,12.54,12.4,12.33,12.14,12.3,12.29,11.75,11.24,11.43,10.56,10.47,9.91,10.49,10.02,10.55,10.24,10.09,9.49,9.4,9.18,9.12,8.91,9.05,9.3,9.58,9.44,9.29,10.09,10.48,10.35,9.81,10.11,10.07,10.13,10.31,11.17,10.93,10.5,11.1,11.45,11.48,11.1,11.86,12.87,12.95</td>
<td>13%</td>
</tr>
<tr class='fortune'>
<td>FNMA</td>
<td>Federal National Mortgage Association</td>
<td class='sparkline'>0.2,0.23,0.24,0.23,0.24,0.3,0.38,0.32,0.32,0.32,0.31,0.31,0.29,0.28,0.27,0.29,0.28,0.27,0.3,0.27,0.27,0.26,0.26,0.26,0.26,0.26,0.25,0.24,0.24,0.24,0.24,0.28,0.24,0.25,0.25,0.24,0.28,0.28,0.28,0.28,0.27,0.27,0.27,0.27,0.28,0.27,0.28,0.27,0.27,0.27,0.26,0.26,0.26</td>
<td>30%</td>
</tr>
<tr class='fortune'>
<td>GE</td>
<td>General Electric Company</td>
<td class='sparkline'>18.03,18.21,18.51,18.39,18.38,18.25,18.64,18.76,18.5,18.57,19.7,19.29,19.57,19.01,18.41,18.88,19.29,18.86,18.54,18.48,18.72,18.08,18.72,19.5,19.48,20.5,19.67,19.44,19.54,20.57,20.61,20.75,20.65,20.46,20.37,21.23,21.74,22.33,22.5,22.91,22.28,21.83,20.92,21.12,20.81,19.97,20.85,20.94,21.27,21.42,20.88,20.44,20.99</td>
<td>16%</td>
</tr>
<tr class='barclays'>
<td>GLW</td>
<td>Corning Incorporated</td>
<td class='sparkline'>13.18,13.64,14.05,12.3,13.23,13.25,13.49,13.4,12.73,13.02,14.04,13.74,13.8,13.27,13.31,12.91,14.16,13.39,13.04,12.49,12.65,12.43,12.94,12.82,12.67,12.74,12.61,12.14,12.09,11.36,11.18,11.4,11.82,11.35,11.89,12.45,13.01,13.11,13.04,13.19,12.88,13.41,11.72,11.61,11.25,10.9,11.29,12.23,12.54,12.62,12.6,12.47,12.62</td>
<td>(4%)</td>
</tr>
<tr class='fortune'>
<td>GM</td>
<td>General Motors Company</td>
<td class='sparkline'>22.92,24.29,25,24.37,26.18,25.5,27.34,26.07,26.45,25.62,25.57,25.17,25.65,24.81,23.8,23.6,23.53,22.36,22,21.18,22.44,22.01,22.05,21.74,20.6,19.72,20.31,19.62,19.36,19.67,20.04,20.54,22.01,21.18,21.35,23.37,24.14,24.8,22.75,24.8,24.44,24.59,23.28,25.79,25.04,23.85,25.21,25.88,25.19,24.61,27.32,27.85,28.83</td>
<td>26%</td>
</tr>
<tr class='fortune'>
<td>HPQ</td>
<td>Hewlett-Packard Company</td>
<td class='sparkline'>25.67,25.76,27.35,27.11,28.27,27.91,28.77,25.9,24.62,23.51,23.93,23.09,23.29,22.58,24.01,23.95,24.19,23.72,22.62,20.97,21.82,20.77,21.8,21.27,20.02,19.77,19.24,18.66,18.29,18.25,17.95,19.37,19.19,17.28,16.59,17.12,18,17.42,16.9,14.59,14.27,14.34,13.96,13.63,13.48,12.73,12.32,12.87,13.81,14.75,14.34,13.68,14.25</td>
<td>(44%)</td>
</tr>
<tr class='barclays'>
<td>QCOM</td>
<td>QUALCOMM, Inc.</td>
<td class='sparkline'>55.28,55.65,56.83,56.88,60.1,60.76,61.54,62.45,61.66,63.14,64.61,65.86,67.22,66.36,65.85,61.49,63.39,61.15,61.1,55.29,56.62,54.68,58.29,56.05,55.19,55.23,54.87,54.54,57.22,58.86,59.76,61.48,62.78,61.93,60.97,61.69,64.62,64.02,62.22,62.39,58.66,58.52,58.81,59.07,61.38,61.69,62.88,63.37,63.86,59.83,61.61,60.64,61.86</td>
<td>12%</td>
</tr>
<tr class='barclays'>
<td>TER</td>
<td>Teradyne, Inc.</td>
<td class='sparkline'>14.63,14.84,16.14,16.95,17.03,16.5,17.01,16.38,16.11,16.21,17.05,16.82,16.89,16.42,16.29,16.3,17.39,16.13,15.71,14.32,14.79,13.61,14.38,14.46,14.31,14.06,13.67,13.21,13.64,14.97,14.8,15.59,15.94,15.74,15.62,16.28,16.43,14.6,14.22,14.07,13.62,14.12,14.5,15.31,15.51,15.03,15.93,15.64,15.84,16.49,16.75,16.42,16.89</td>
<td>15%</td>
</tr>
<tr class='barclays'>
<td>TSLA</td>
<td>Tesla Motors Inc</td>
<td class='sparkline'>26.91,22.79,26.6,29.33,31.15,31.1,34.97,33.75,34.04,34.74,35.32,34.08,37.24,34.48,33.59,33.16,33.34,31.83,32.25,27.56,29.81,28.15,30.08,29.91,33.79,31.29,30.99,34.25,31.79,29.51,27.27,29.94,30.01,29.5,28.52,29.35,30.39,30.02,29.28,28.89,27.64,27.74,27.38,28.92,30.32,31.84,32.13,33.82,34.17,33.81,34,33.22,33.87</td>
<td>26%</td>
</tr>
<tr class='fortune'>
<td>WMT</td>
<td>Wal-Mart Stores, Inc.</td>
<td class='sparkline'>57.58,58.11,59.54,59.25,60.54,60.41,60.98,57.38,57.59,59.03,59.77,59.68,60.13,59.61,58.72,61.35,57.99,57.67,58.77,61.75,64.6,64.84,67.48,67.01,66.57,68.96,70.58,72.38,71.46,73.71,73.74,73.27,71.59,71.71,72.2,73.41,74.09,74.04,73.39,74.72,75.39,75.2,74.7,72.37,71.91,67.65,69.81,71.62,72.29,68.75,68.65,67.61,68.23</td>
<td>18%</td>
</tr>
<tr class='fortune'>
<td>XOM</td>
<td>Exxon Mobil Corporation</td>
<td class='sparkline'>83.01,82.78,85.33,83.71,82.82,82.17,83.96,85.65,84.66,82.67,84.76,83.89,85.05,83.17,81.34,83.65,84.41,82.93,82.05,80.44,81.04,76.94,79.82,82.17,81.07,84.49,83.73,84.39,84.86,86.34,86.44,87.89,87.85,87.5,86.76,89.36,91.73,91.35,90.88,91.97,90.46,91.58,90.06,89.71,87.21,86.45,89.09,88.14,88.6,88.08,87.23,85.1,86.55</td>
<td>4%</td>
</tr>
</tbody>
</table>
<figcaption>Sparklines can be a good visualization to include within page elements such as tables.</figcaption>
</figure>

### Step 4: Establish a Default Style for the Charts

If we don't like the sparklines library's default style, it's easy to change it using an options object like below. The object is the second parameter to the `sparkline()` function, and here it changes the color for the charts and disables the highlights on the minimum, maximum, and final values. The first parameter, the string `'html'`, indicates to the library that the data is already present in our <span class="smcp">HTML</span>. 

``` {.javascript .numberLines}
$('.sparkline').sparkline('html',{
    lineColor: "#006363",
    fillColor: "#2D9999",
    spotColor: false,
    minSpotColor: false,
    maxSpotColor: false
});
```

Figure NEXTFIGURENUMBER shows the result for one row. We'll use this style as the default for all our charts.

<figure>
<table class="table table-bordered table-condensed" id="multiples-chart2" class="figure">
<thead>
<tr>
<th>Symbol</th>
<th>Company</th>
<th>2012 Performance</th>
<th>Gain</th>
</tr>
</thead>
<tbody>
<tr class='barclays'>
<td>AAPL</td>
<td>Apple Inc.</td>
<td class='sparkline'>418.68,416.11,416.6,443.34,455.63,489.08,497.7,517.81,540.38,540.37,580.42,590.8,594.27,628.1,599.9,567.94,597.69,560.27,561.72,525.71,557.34,556.05,575.21,569.08,576.98,578.86,600.55,599.64,598.98,580.01,610.28,618.87,645.16,660.2,662.22,677.35,688.14,696.91,664.07,649.62,626.85,607.07,601.25,574.18,547.06,527.68,571.5,585.28,533.25,509.79,519.33,509.59,532.17</td>
<td>27%</td>
</tr>
</tbody>
</table>
<figcaption>The sparkline options let us adjust the chart styles.</figcaption>
</figure>

### Step 5: Modify the Default Style for Special Classes

With a default style in place, we can turn our attention to the special class of charts for stocks in Barclay's technology list. For our example, let's change the color of the chart _without any other changes to our default style._ That final clause is important. We could just copy-and-paste the options, but that would be setting ourselves up for problems in the future. You can see why in the example code such an approach would produce.

``` {.javascript .numberLines}
$('tr:not(.barclays) .sparkline').sparkline('html',{
    lineColor: "#006363",
    fillColor: "#2D9999",
    spotColor: false,
    minSpotColor: false,
    maxSpotColor: false
});
$('tr.barclays .sparkline').sparkline('html',{
    lineColor: "#A50000",
    fillColor: "#FE4C4C",
    spotColor: false,
    minSpotColor: false,
    maxSpotColor: false
});
```

Notice that the second call to `sparklines()` duplicates options from the first call that haven't changed, specifically for the spot colors. This makes the code harder to maintain if, in the future, we decide to turn spot colors back on for all our charts, since we would have to make changes to our code in two places. There is a better way.

To avoid duplication we first define a variable that holds our default options.

``` {.javascript .numberLines}
var sparkline_default = {
    lineColor: "#006363",
    fillColor: "#2D9999",
    spotColor: false,
    minSpotColor: false,
    maxSpotColor: false
};
```

Next we create a new variable for the Barclay's styles. To create this new variable, we can use the jQuery `.extend()` function to avoid duplication. In the code below, we pass three parameters to `.extend()`. The first parameter is the target. It's an object that the function will modify, and we start with an empty object (`{}`). The next parameters are objects that `.extend()` will merge into the target. The merge process adds new properties to the target and updates any properties in the target object with new values. Since we're passing two additional parameters, we're asking for two merges.

``` {.javascript .numberLines}
var sparkline_barclays = $.extend( {}, sparkline_default, {
    lineColor: "#A50000",
    fillColor: "#FE4C4C"
}); 
```

You can think of the call to `.extend()` as a two-stage process.

1. Since our target is initially empty, the first merge will add all of the properties from `sparkline_default` to the target.
2. Our target now has the same properties as `sparkline_default`, and the second merge will modify it by updating the two properties in the last parameter, `lineColor` and `fillColor`.

The resulting object will hold the options we want for charts of Barclay's technology stocks. Here's a complete code listing, using these objects to create the charts.

``` {.javascript .numberLines}
var sparkline_default = {
    lineColor: "#006363",
    fillColor: "#2D9999",
    spotColor: false,
    minSpotColor: false,
    maxSpotColor: false
};
var sparkline_barclays = $.extend( {}, sparkline_default, {
    lineColor: "#A50000",
    fillColor: "#FE4C4C"
}); 
$('tr:not(.barclays) .sparkline').sparkline('html',sparkline_default);
$('tr.barclays .sparkline').sparkline('html',sparkline_barclays);
```

Notice in line 12 that we create the non-technology sparklines by selecting table rows (`<tr>`) that don't have the `"barclays"` class. In line 13 we create the technology sparklines. Because we've defined the technology options based on the default, we have an easy way to maintain both default styles and styles for special classes. The chart colors in figure <class="nextfigure"/> clearly distinguish the stock types in our table.

<figure>
<table class="table table-bordered table-condensed" id="multiples-chart3" class="figure">
<thead>
<tr>
<th>Symbol</th>
<th>Company</th>
<th>2012 Performance</th>
<th>Gain</th>
</tr>
</thead>
<tbody>
</tr>
<tr class='barclays'>
<td>TSLA</td>
<td>Tesla Motors Inc</td>
<td class='sparkline'>26.91,22.79,26.6,29.33,31.15,31.1,34.97,33.75,34.04,34.74,35.32,34.08,37.24,34.48,33.59,33.16,33.34,31.83,32.25,27.56,29.81,28.15,30.08,29.91,33.79,31.29,30.99,34.25,31.79,29.51,27.27,29.94,30.01,29.5,28.52,29.35,30.39,30.02,29.28,28.89,27.64,27.74,27.38,28.92,30.32,31.84,32.13,33.82,34.17,33.81,34,33.22,33.87</td>
<td>26%</td>
</tr>
<tr>
<td>WMT</td>
<td>Wal-Mart Stores, Inc.</td>
<td class='sparkline'>57.58,58.11,59.54,59.25,60.54,60.41,60.98,57.38,57.59,59.03,59.77,59.68,60.13,59.61,58.72,61.35,57.99,57.67,58.77,61.75,64.6,64.84,67.48,67.01,66.57,68.96,70.58,72.38,71.46,73.71,73.74,73.27,71.59,71.71,72.2,73.41,74.09,74.04,73.39,74.72,75.39,75.2,74.7,72.37,71.91,67.65,69.81,71.62,72.29,68.75,68.65,67.61,68.23</td>
<td>18%</td>
</tr>
</tbody>
</table>
<figcaption>Different visual styles distinguish different types of data.</figcaption>
</figure>


### Step 6: Create a Unique Style for a Specific Chart

For the final step in this example, let's consider the single stock at the top of <span class="smcp">CR</span> Magazine's list. Suppose we want to add distinct styles to its chart, and we only know those styles when we're generating the <span class="smcp">HTML</span>, not when we're writing the JavaScript. How can we adjust the chart style if we can't modify any JavaScript?

Sparklines lets you add special attributes directly to the <span class="smcp">HTML</span> element containing a chart. To set the line color, for example, you need to specify the attribute `sparkLineColor`. The problem is, if we were to enter this attribute directly in the <span class="smcp">HTML</span>, the result would't be valid <span class="smcp">HTML</span>, because the <span class="smcp">HTML</span> specification doesn't recognize the `sparkLineColor` attribute. To conform to the <span class="smcp">HTML</span> standard, custom attributes need to have names that begin with the prefix `data-`.

In order to use <span class="smcp">HTML</span>-compliant attribute names to refer to sparklines' custom attributes, we just need to tell the sparklines library how to find those attribute names. For our <span class="smcp">HTML</span>, we use the standard `data-` prefix instead of `spark` in line 4.


``` {.html .numberLines data-line='4'}
<tr>
    <td>BMY</td>
    <td>Bristol Meyers Squibb Co.</td>
    <td class='sparkline' data-LineColor='#679A00' data-FillColor='#B6ED47'>32.86,32.46,31.36,...</td>
    <td>(2%)</td>
</tr>
```

Now we have to add a couple of additional options in our call to `sparkline()`. First we set `enableTagOptions` to true to tell the library that we're including options directly in the <span class="smcp">HTML</span>. Then we set `tagOptionsPrefix` to `"data-"` to specify the specific prefix we're using for those attributes.

> Note: As of this writing, the jQuery sparklines documentation for `tagOptionsPrefix` is _not_ correct. The documentation lists the option as `tagOptionPrefix`, where "option" is singular instead of plural. The library's code, however, expects the plural form.

If we use these options correctly, one of our charts will have the distinct color in figure NEXTFIGURENUMBER.

<figure>
<table class="table table-bordered table-condensed" id="multiples-chart4" class="figure">
<tbody>
<tr>
<td>BMY</td>
<td>Bristol Meyers Squibb Co.</td>
<td class='sparkline' data-LineColor='#679A00' data-FillColor='#B6ED47'>32.86,32.46,31.36,31.01,30.98,30.64,31.81,31.31,31.3,31.61,31.87,31.65,32.41,32.67,31.57,33.21,32.32,32.37,32.12,31.74,32.1,32.33,33.34,33.21,34.3,34.88,33.9,34.64,34.69,35.31,31.97,31.07,30.92,31.9,32.33,32.61,32.55,32.92,33.05,33.28,32.73,33.45,33.26,32.82,31.88,31.37,32.27,32.28,32.21,32.38,32.21,31.56,32.24</td>
<td>(2%)</td>
</tr>
</tbody>
</table>
<figcaption>The sparklines library supports unique styling options for individual charts.</figcaption>
</figure>

To pass the appropriate options to `sparkline()` we can take advantage of the work we did in step five. Since we created a special object for default options, that's the only object we have to change.

``` {.javascript .numberLines}
var sparkline_default = {
    lineColor: "#006363",
    fillColor: "#2D9999",
    spotColor: false,
    minSpotColor: false,
    maxSpotColor: false,
    enableTagOptions: true,
    tagOptionsPrefix: "data-"
};
```

We only need to make the change in one place, and all of our calls to `sparkline()`use the new options. Here is the final, complete JavaScript code for this example.

``` {.javascript .numberLines}
$(function() {
    var sparkline_default = {
        lineColor: "#006363",
        fillColor: "#2D9999",
        spotColor: false,
        minSpotColor: false,
        maxSpotColor: false,
        enableTagOptions: true,
        tagOptionsPrefix: "data-"
    };
    var sparkline_barclays = $.extend( {}, sparkline_default, {
        lineColor: "#A50000",
        fillColor: "#FE4C4C"
    }); 
    $('tr:not(.barclays) .sparkline').sparkline('html',sparkline_default);
    $('tr.barclays .sparkline').sparkline('html',sparkline_barclays);
}
```

And figure NEXTFIGURENUMBER shows the final result. We have a table that integrates text and charts, and we can style those charts appropriately and efficiently for the default case, for a special class, and for a unique value.

<figure>
<table class="table table-bordered table-condensed" id="multiples-chart5" class="figure">
<thead>
<tr>
<th>Symbol</th>
<th>Company</th>
<th>2012 Performance</th>
<th>Gain</th>
</tr>
</thead>
<tbody>
<tr class='barclays'>
<td>AAPL</td>
<td>Apple Inc.</td>
<td class='sparkline'>418.68,416.11,416.6,443.34,455.63,489.08,497.7,517.81,540.38,540.37,580.42,590.8,594.27,628.1,599.9,567.94,597.69,560.27,561.72,525.71,557.34,556.05,575.21,569.08,576.98,578.86,600.55,599.64,598.98,580.01,610.28,618.87,645.16,660.2,662.22,677.35,688.14,696.91,664.07,649.62,626.85,607.07,601.25,574.18,547.06,527.68,571.5,585.28,533.25,509.79,519.33,509.59,532.17</td>
<td>27%</td>
</tr>
<tr class='barclays'>
<td>ALTR</td>
<td>Altera Corporation</td>
<td class='sparkline'>37.1,36.92,39.93,39.81,40.43,39.76,39.73,38.55,36.89,37.68,39.18,38.47,39.49,37.85,37.17,34.95,35.26,33.4,33.53,33.03,34.21,32.09,33.29,32.86,33.24,33.64,32.54,31.16,31.04,35.82,35.58,37,36.23,36.23,37.21,37.85,38.03,36.62,33.89,33.32,32.22,32.4,30.3,30.41,30.64,30.45,31.86,32.39,31.58,32.86,34.5,34.01,34.39</td>
<td>(7%)</td>
</tr>
<tr>
<td>BMY</td>
<td>Bristol Meyers Squibb Co.</td>
<td class='sparkline' data-LineColor='#679A00' data-FillColor='#B6ED47'>32.86,32.46,31.36,31.01,30.98,30.64,31.81,31.31,31.3,31.61,31.87,31.65,32.41,32.67,31.57,33.21,32.32,32.37,32.12,31.74,32.1,32.33,33.34,33.21,34.3,34.88,33.9,34.64,34.69,35.31,31.97,31.07,30.92,31.9,32.33,32.61,32.55,32.92,33.05,33.28,32.73,33.45,33.26,32.82,31.88,31.37,32.27,32.28,32.21,32.38,32.21,31.56,32.24</td>
<td>(2%)</td>
</tr>
<tr class='fortune'>
<td>BRKA</td>
<td>Berkshire Hathaway Inc.</td>
<td class='sparkline'>114500,116520,119775,119211,119800,117980,119190,120000,117434,119065,122190,122170,121900,121295,118385,118580,120925,121950,122795,119850,119500,119845,122000,123375,122670,124945,123898,126625,125730,127735,128479,127175,128880,128225,126560,129942,133000,134584,132700,135555,132502,133841,129725,130550,127585,129345,132606,131916,131090,133795,134800,133000,134060</td>
<td>17%</td>
</tr>
<tr class='fortune'>
<td>COP</td>
<td>ConocoPhillips</td>
<td class='sparkline'>52.95,51.26,51.89,50.58,51.35,52.65,53.95,55.85,57.1,56.74,56.76,56.26,55.9,55.42,54.15,53.59,52.93,51.29,51.61,49.65,50.91,50.01,52.73,54.18,52.18,54.59,53.49,53.71,55.34,54.34,55.07,56.62,56.73,55.71,56.14,55.99,57.54,56.7,56.52,56.92,56.17,57.45,57.31,57.65,55.67,55.03,56.67,56.94,57.94,57.69,58.61,57.07,57.99</td>
<td>10%</td>
</tr>
<tr class='barclays'>
<td>CTXS</td>
<td>Citrix Systems, Inc.</td>
<td class='sparkline'>62.02,64.85,68.12,65.14,68.78,71.46,74.77,75.16,75.43,76.27,78.2,77.68,78.91,78.28,75.12,77.78,85.78,82.85,79.46,74.82,75.43,70.79,77.12,80.12,80.14,83.94,77.45,76.63,80.75,77.81,72.44,76.26,78.08,77,77.69,80.59,81.74,81.19,76.53,71.57,67.7,64.16,62.82,62.77,60.17,59.21,61.77,61.16,62.03,65.02,66.15,64.3,65.62</td>
<td>6%</td>
</tr>
<tr class='fortune'>
<td>CVX</td>
<td>Chevron Corporation</td>
<td class='sparkline'>104.78,102.63,103.4,100.57,102.06,101.85,103.97,106.33,106.85,106.81,107.5,103.68,104.51,102.11,98.24,99.94,103.52,101.11,100.1,96.84,97.24,94.83,99.18,102.62,98.79,103.77,103.34,104.27,107.4,107.47,109.3,111.69,111.7,111.05,111.2,113.03,116.25,116.79,115.56,116.5,111.11,112.41,110.23,107.44,104.94,102.4,105.47,105.69,106.99,107.82,109.71,106.45,108.14</td>
<td>3%</td>
</tr>
<tr class='fortune'>
<td>F</td>
<td>Ford Motor Company</td>
<td class='sparkline'>11.5,11.82,12.36,12.03,12.6,12.26,12.57,12.05,12.54,12.4,12.33,12.14,12.3,12.29,11.75,11.24,11.43,10.56,10.47,9.91,10.49,10.02,10.55,10.24,10.09,9.49,9.4,9.18,9.12,8.91,9.05,9.3,9.58,9.44,9.29,10.09,10.48,10.35,9.81,10.11,10.07,10.13,10.31,11.17,10.93,10.5,11.1,11.45,11.48,11.1,11.86,12.87,12.95</td>
<td>13%</td>
</tr>
<tr class='fortune'>
<td>FNMA</td>
<td>Federal National Mortgage Association</td>
<td class='sparkline'>0.2,0.23,0.24,0.23,0.24,0.3,0.38,0.32,0.32,0.32,0.31,0.31,0.29,0.28,0.27,0.29,0.28,0.27,0.3,0.27,0.27,0.26,0.26,0.26,0.26,0.26,0.25,0.24,0.24,0.24,0.24,0.28,0.24,0.25,0.25,0.24,0.28,0.28,0.28,0.28,0.27,0.27,0.27,0.27,0.28,0.27,0.28,0.27,0.27,0.27,0.26,0.26,0.26</td>
<td>30%</td>
</tr>
<tr class='fortune'>
<td>GE</td>
<td>General Electric Company</td>
<td class='sparkline'>18.03,18.21,18.51,18.39,18.38,18.25,18.64,18.76,18.5,18.57,19.7,19.29,19.57,19.01,18.41,18.88,19.29,18.86,18.54,18.48,18.72,18.08,18.72,19.5,19.48,20.5,19.67,19.44,19.54,20.57,20.61,20.75,20.65,20.46,20.37,21.23,21.74,22.33,22.5,22.91,22.28,21.83,20.92,21.12,20.81,19.97,20.85,20.94,21.27,21.42,20.88,20.44,20.99</td>
<td>16%</td>
</tr>
<tr class='barclays'>
<td>GLW</td>
<td>Corning Incorporated</td>
<td class='sparkline'>13.18,13.64,14.05,12.3,13.23,13.25,13.49,13.4,12.73,13.02,14.04,13.74,13.8,13.27,13.31,12.91,14.16,13.39,13.04,12.49,12.65,12.43,12.94,12.82,12.67,12.74,12.61,12.14,12.09,11.36,11.18,11.4,11.82,11.35,11.89,12.45,13.01,13.11,13.04,13.19,12.88,13.41,11.72,11.61,11.25,10.9,11.29,12.23,12.54,12.62,12.6,12.47,12.62</td>
<td>(4%)</td>
</tr>
<tr class='fortune'>
<td>GM</td>
<td>General Motors Company</td>
<td class='sparkline'>22.92,24.29,25,24.37,26.18,25.5,27.34,26.07,26.45,25.62,25.57,25.17,25.65,24.81,23.8,23.6,23.53,22.36,22,21.18,22.44,22.01,22.05,21.74,20.6,19.72,20.31,19.62,19.36,19.67,20.04,20.54,22.01,21.18,21.35,23.37,24.14,24.8,22.75,24.8,24.44,24.59,23.28,25.79,25.04,23.85,25.21,25.88,25.19,24.61,27.32,27.85,28.83</td>
<td>26%</td>
</tr>
<tr class='fortune'>
<td>HPQ</td>
<td>Hewlett-Packard Company</td>
<td class='sparkline'>25.67,25.76,27.35,27.11,28.27,27.91,28.77,25.9,24.62,23.51,23.93,23.09,23.29,22.58,24.01,23.95,24.19,23.72,22.62,20.97,21.82,20.77,21.8,21.27,20.02,19.77,19.24,18.66,18.29,18.25,17.95,19.37,19.19,17.28,16.59,17.12,18,17.42,16.9,14.59,14.27,14.34,13.96,13.63,13.48,12.73,12.32,12.87,13.81,14.75,14.34,13.68,14.25</td>
<td>(44%)</td>
</tr>
<tr class='barclays'>
<td>QCOM</td>
<td>QUALCOMM, Inc.</td>
<td class='sparkline'>55.28,55.65,56.83,56.88,60.1,60.76,61.54,62.45,61.66,63.14,64.61,65.86,67.22,66.36,65.85,61.49,63.39,61.15,61.1,55.29,56.62,54.68,58.29,56.05,55.19,55.23,54.87,54.54,57.22,58.86,59.76,61.48,62.78,61.93,60.97,61.69,64.62,64.02,62.22,62.39,58.66,58.52,58.81,59.07,61.38,61.69,62.88,63.37,63.86,59.83,61.61,60.64,61.86</td>
<td>12%</td>
</tr>
<tr class='barclays'>
<td>TER</td>
<td>Teradyne, Inc.</td>
<td class='sparkline'>14.63,14.84,16.14,16.95,17.03,16.5,17.01,16.38,16.11,16.21,17.05,16.82,16.89,16.42,16.29,16.3,17.39,16.13,15.71,14.32,14.79,13.61,14.38,14.46,14.31,14.06,13.67,13.21,13.64,14.97,14.8,15.59,15.94,15.74,15.62,16.28,16.43,14.6,14.22,14.07,13.62,14.12,14.5,15.31,15.51,15.03,15.93,15.64,15.84,16.49,16.75,16.42,16.89</td>
<td>15%</td>
</tr>
<tr class='barclays'>
<td>TSLA</td>
<td>Tesla Motors Inc</td>
<td class='sparkline'>26.91,22.79,26.6,29.33,31.15,31.1,34.97,33.75,34.04,34.74,35.32,34.08,37.24,34.48,33.59,33.16,33.34,31.83,32.25,27.56,29.81,28.15,30.08,29.91,33.79,31.29,30.99,34.25,31.79,29.51,27.27,29.94,30.01,29.5,28.52,29.35,30.39,30.02,29.28,28.89,27.64,27.74,27.38,28.92,30.32,31.84,32.13,33.82,34.17,33.81,34,33.22,33.87</td>
<td>26%</td>
</tr>
<tr class='fortune'>
<td>WMT</td>
<td>Wal-Mart Stores, Inc.</td>
<td class='sparkline'>57.58,58.11,59.54,59.25,60.54,60.41,60.98,57.38,57.59,59.03,59.77,59.68,60.13,59.61,58.72,61.35,57.99,57.67,58.77,61.75,64.6,64.84,67.48,67.01,66.57,68.96,70.58,72.38,71.46,73.71,73.74,73.27,71.59,71.71,72.2,73.41,74.09,74.04,73.39,74.72,75.39,75.2,74.7,72.37,71.91,67.65,69.81,71.62,72.29,68.75,68.65,67.61,68.23</td>
<td>18%</td>
</tr>
<tr class='fortune'>
<td>XOM</td>
<td>Exxon Mobil Corporation</td>
<td class='sparkline'>83.01,82.78,85.33,83.71,82.82,82.17,83.96,85.65,84.66,82.67,84.76,83.89,85.05,83.17,81.34,83.65,84.41,82.93,82.05,80.44,81.04,76.94,79.82,82.17,81.07,84.49,83.73,84.39,84.86,86.34,86.44,87.89,87.85,87.5,86.76,89.36,91.73,91.35,90.88,91.97,90.46,91.58,90.06,89.71,87.21,86.45,89.09,88.14,88.6,88.08,87.23,85.1,86.55</td>
<td>4%</td>
</tr>
</tbody>
</table>
<figcaption>A complete example distinguishes different individual data sets in a larger collection.</figcaption>
</figure>

The third example in chapter 2 uses a full-featured charting package for a similar result. If you don't need the space efficiency of sparklines, consider that approach as an alternative.

<script>
;(function(){

    draw = function() {

        $("#multiples-chart1 .sparkline").sparkline();
        $('#multiples-chart2 .sparkline').sparkline('html',{
            lineColor: chartStyles.color.secondaryDark,
            fillColor: chartStyles.color.secondaryLightest,
            spotColor: false,
            minSpotColor: false,
            maxSpotColor: false,
        });
        var sparkline_default = {
            lineColor: chartStyles.color.secondaryDark,
            fillColor: chartStyles.color.secondaryLightest,
            spotColor: false,
            minSpotColor: false,
            maxSpotColor: false,
        };
        var sparkline_barclays = $.extend( {}, sparkline_default, {
            lineColor: chartStyles.color.primaryDark,
            fillColor: chartStyles.color.primaryLightest
        }); 
        $('#multiples-chart3 tr:not(.barclays) .sparkline').sparkline('html',sparkline_default);
        $('#multiples-chart3 tr.barclays .sparkline').sparkline('html',sparkline_barclays);
        var sparkline_default = {
            lineColor: chartStyles.color.secondaryDark,
            fillColor: chartStyles.color.secondaryLightest,
            spotColor: false,
            minSpotColor: false,
            maxSpotColor: false,
            enableTagOptions: true,
            tagOptionsPrefix: "data-"
        };
        $('#multiples-chart4 .sparkline').sparkline('html',sparkline_default);
        var sparkline_barclays = $.extend( {}, sparkline_default, {
            lineColor: chartStyles.color.primaryDark,
            fillColor: chartStyles.color.primaryLightest
        }); 
        $('#multiples-chart5 tr:not(.barclays) .sparkline').sparkline('html',sparkline_default);
        $('#multiples-chart5 tr.barclays .sparkline').sparkline('html',sparkline_barclays);
    };
    
    if (typeof contentLoaded != "undefined") {
        contentLoaded.done(draw);
    } else {
        window.addEventListener('load', draw);
    }

}());
</script>