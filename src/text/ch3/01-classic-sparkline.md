## Creating a Classic Sparkline

As later examples will demonstrate, the sparklines library is both flexible and powerful, and we can use it in many different contexts. As a start, though, it seems appropriate to use the library to create a sparkline exactly as Edward Tufte first defined it. The process is quite straightforward and only takes four simple steps.

### Step 1: Include the Required JavaScript Libraries

Since we're using the jQuery sparklines library to create the chart, we need to include that library in our web pages, along with jQuery. Both jQuery and sparklines are available on public content distribution networks (<span class="smcp">CDN</span>s). For this example (and the others in this chapter), we'll use the CloudFlare <span class="smcp">CDN</span>, but for some notes on the advantages and disadvantages of using <span class="smcp">CDN</span>s, see Chapter 2.

In addition to the jQuery library, sparklines relies on the <span class="smcp">HTML</span> _canvas_ feature. Since Internet Explorer didn't support canvas until version 9, we'll use some special markup in line 9 to ensure that <span class="smcp">IE</span> 8 and earlier will load an additional library (`excanvas.min.js`), just like we did in Chapter 2. Here's the skeleton with which we start:

``` {.html .numberLines .line-9}
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title></title>
  </head>
  <body>
    <!-- Content goes here -->
    <!--[if lt IE 9]><script src="js/excanvas.min.js"></script><![endif]-->
    <script 
      src="//cdnjs.cloudflare.com/ajax/libs/jquery/1.8.3/jquery.min.js">
    </script>
    <script 
      src="//cdnjs.cloudflare.com/ajax/libs/jquery-sparklines/2.0.0/"+
          "jquery.sparkline.min.js">
    </script>
  </body>
</html>
```

As you can see, we're including the JavaScript libraries at the end of the document. This approach lets the browser load all of the document's <span class="smcp">HTML</span> markup and begin laying out the page while it waits for the server to provide the JavaScript libraries.

### Step 2: Create the HTML Markup for the Sparkline

Because we're closely integrating the sparkline chart with other elements, we simply use a `<span>` tag to hold the <span class="smcp">HTML</span> markup for our visualization, rather than using a `<div>`. In addition to the chart itself, we include the final value and a label as standard <span class="smcp">HTML</span>. Here is the <span class="smcp">HTML</span> for the glucose sparkline.

``` {.html .numberLines}
<p>
  <span class="sparkline">
    170,134,115,128,168,166,122,81,56,39,97,114,114,130,151,
    184,148,145,134,145,145,145,143,148,224,181,112,111,129,
    151,131,131,131,114,112,112,112,124,187,202,200,203,237,
    263,221,197,184,185,203,290,330,330,226,113,148,169,148,
    78,96,96,96,77,59,22,22,70,110,128
  </span>
  128 Glucose
</p>
```

Compared to other visualizations, two characteristics of our sparkline chart are unusual.

* We include the data right in the <span class="smcp">HTML</span> itself, not in the JavaScript that creates the chart.
* The `<span>` for the chart does not have a unique `id` attribute.

Both of these differences are optional; we could construct the chart as in other visualizations by passing data to a JavaScript function and identifying its container with a unique `id`. For sparklines, however, the approach we're using here often makes more sense. By including the chart data directly in the <span class="smcp">HTML</span>, we can easily see the data's relation to other content on the page. It's clear, for example, that the final value of our chart (128) is the same as the value we're using for the label. If we had made a mistake and used a different value for the label, the error would be much easier to spot and correct. Using a common `class` for all sparklines instead of unique `id`s simplifies how we might use the library to create multiple charts on one page. With unique `id`s we would have to call a library function for every chart. With a common `class`, on the other hand, we only need call a single library function to create multiple charts. That's especially helpful when a web page contains a lot of sparklines.

### Step 3: Draw the Sparkline

Now that we've included the necessary libraries and set up our <span class="smcp">HTML</span>, it's remarkably easy to draw the charts. In fact, a single line of JavaScript is sufficient. We simply select the containing element(s) using jQuery (`$('.sparkline')`) and call the sparklines plugin.

``` {.javascript .numberLines}
$(function() {
    $('.sparkline').sparkline();
}
```

As you can see in figure NEXTFIGURENUMBER, the sparklines library creates a standard sparkline from our data:

<figure>
  <span id="sparkline-chart1">
    170,134,115,128,168,166,122,81,56,39,97,114,114,130,151,
    184,148,145,134,145,145,145,143,148,224,181,112,111,129,
    151,131,131,131,114,112,112,112,124,187,202,200,203,237,
    263,221,197,184,185,203,290,330,330,226,113,148,169,148,
    78,96,96,96,77,59,22,22,70,110,128
  </span>
  128 Glucose
  <figcaption>The default sparkline options differ slightly from the classic example.</figcaption>
</figure>

The library's default options don't quite match Tufte's classic sparkline definition. The differences include colors, chart type, and density. We'll tweak those next.

### Step 4: Adjust the Chart Style

To make our sparkline exactly match Tufte's definition, we can specify new values for some of the default options. Let's collect the changes first, and then see how to pass them to the library.

* Tufte's classic sparklines are black and white except for key data points (minimum, maximum, and final values). His color scheme adds extra emphasis to those points. To change the library's default (blue), we can set a `lineColor`. For screen displays we might chose a dark gray rather than pure black. That's what we're using in line 2 below.
* Tufte doesn't fill the area below the line so he can use shading to indicate a normal range. To eliminate the library's light blue shading, we set `fillColor` to `false`. (Line 3.)
* Tufte uses red for key data points. To change the library's default (orange), we set `spotColor`, `minSpotColor`, and `maxSpotColor` in lines 5 through 7.
* By default, the library uses three pixels as the width for each data point. To maximize information density, Tufte would likely suggest using only a single pixel. Setting the `defaultPixelsPerValue` option in line 4 makes that change.
* Finally, Tufte's sparklines can include shading to mark the normal range for a value. To show, for example, a range of 82 to 180 mg/dL, we set the `normalRangeMin` and `normalRangeMax` options in lines 8 and 9.

To pass these options to sparklines, we construct a JavaScript object and include it as the second parameter in the `sparkline` function call. The function's first parameter is the data itself, which here we specify with `'html'` because our data is included in the <span class="smcp">HTML</span> markup.

``` {.javascript .numberLines}
$('.sparkline').sparkline('html',{
    lineColor: "dimgray",
    fillColor: false,
    defaultPixelsPerValue: 1,
    spotColor: "red",
    minSpotColor: "red",
    maxSpotColor: "red",
    normalRangeMin: 82,
    normalRangeMax: 180,
});
```

To complete our transformation to Tufte's original we can style the <span class="smcp">HTML</span> content as well. Making the final value the same color as the key data points clarifies that connection, and making the chart label bold emphasizes it as a title.

``` {.html .numberLines}
<p>
  <span class="sparkline">
    170,134,115,128,168,166,122,81,56,39,97,114,114,130,151,
    184,148,145,134,145,145,145,143,148,224,181,112,111,129,
    151,131,131,131,114,112,112,112,124,187,202,200,203,237,
    263,221,197,184,185,203,290,330,330,226,113,148,169,148,
    78,96,96,96,77,59,22,22,70,110,128
  </span>
  <span style="color:red"> 128 </span>
  <strong> Glucose </strong>
</p>
```

With these changes we have the classic Tufte sparkline on our web page. We can even include it within a text paragraph ( <span id="sparkline-chart2">
    170,134,115,128,168,166,122,81,56,39,97,114,114,130,151,
    184,148,145,134,145,145,145,143,148,224,181,112,111,129,
    151,131,131,131,114,112,112,112,124,187,202,200,203,237,
    263,221,197,184,185,203,290,330,330,226,113,148,169,148,
    78,96,96,96,77,59,22,22,70,110,128
  </span>
  <span style="color:#CA0000"> 128 </span>
**Glucose** ) so that the visualization enhances the content of the text.

<script>
;(function(){

    draw = function() {

        $('#sparkline-chart1').sparkline();
        $('#sparkline-chart2').sparkline('html',{
            lineColor: "dimgray",
            fillColor: false,
            defaultPixelsPerValue: 1,
            spotColor: chartStyles.color.primary,
            minSpotColor: chartStyles.color.primary,
            maxSpotColor: chartStyles.color.primary,
            normalRangeMin: 82,
            normalRangeMax: 180,
        });
    };
    
    if (typeof contentLoaded != "undefined") {
        contentLoaded.done(draw);
    } else {
        window.addEventListener('load', draw);
    }

}());
</script>
