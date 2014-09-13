# Chapter 3: Integrating Charts in a Page

You might expect a data visualization for the web to be featured very prominently on the page, or even make up the entire web page. That's not always the right approach, though. The best visualizations are effective because they help the user understand the data, not because they "look pretty" on the page. Some data may be straightforward enough to present without context, but meaningful data probably isn't. And if our presentation requires context, its visualizations are likely sharing the page with other content. When we design web pages, we should take care to balance any individual component with the page as a whole. If a single visualization is not the entire story, it shouldn't take up all (or even most) of the space on the page. It can be challenging, however, to minimize the space a traditional chart requires. There are, after all, axes and labels and titles and legends and such to place.

 
<p style="display: inline-block;">
<span id="sparkline-intro">170,134,115,128,168,166,122,81,56,39,97,114,114,130,151,184,148,145,134,145,145,145,143,148,224,181,112,111,129,151,131,131,131,114,112,112,112,124,187,202,200,203,237,263,221,197,184,185,203,290,330,330,226,113,148,169,148,78,96,96,96,77,59,22,22,70,110,128</span>
<span style="color:#CA0000">&nbsp;128&nbsp;</span>
Glucose
</p>
<figcaption>Tufte's classic sparkline example shows a lot of information in a small space.</figcaption>
</figure>




* How to create a classic sparkline for integration directly in test
* How to combine multiple sparklines to show comparisons
* How to annotate sparklines with additional details
* How to create composite charts
* How to respond to click events on the page
* How to update our charts in real time

<script>
;(function(){

    draw = function() {

        $('#sparkline-intro').sparkline('html',{
          lineColor: "rgb(68, 68, 68)",
          fillColor: false,
          disableHiddenCheck: true,
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