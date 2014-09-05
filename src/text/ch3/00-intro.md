# Chapter 3: Integrating Charts in a Page

You might expect a data visualization for the web to be featured very prominently on the page, or even make up the entire web page. That's not always the right approach, though. The best visualizations are effective because they help the user understand the data, not because they "look pretty" on the page. Some data may be straightforward enough to present without context, but meaningful data probably isn't. And if our presentation requires context, its visualizations are likely sharing the page with other content. When we design web pages, we should take care to balance any individual component with the page as a whole. If a single visualization is not the entire story, it shouldn't take up all (or even most) of the space on the page. It can be challenging, however, to minimize the space a traditional chart requires. There are, after all, axes and labels and titles and legends and such to place.
Edward Tufte considered this problem in his groundbreaking work _The Visual Display of Quantitative Information,_ and he proposed a novel solution he called _sparklines._ Sparklines are charts stripped to their bare essentials, presented without labels, axes, titles or other elements we often see in a chart. Sparklines can present a lot of information in very little space, even to the point where it is possible to include a chart right in the middle of a sentence. There is no need for "See figure below" or "Click for larger view." One of Tufte's earliest examples presents the glucose level of a medical patient; figure NEXTFIGURENUMBER shows a reproduction. 
 <figure style="text-align: center">    
<p style="display: inline-block;">
<span id="sparkline-intro">170,134,115,128,168,166,122,81,56,39,97,114,114,130,151,184,148,145,134,145,145,145,143,148,224,181,112,111,129,151,131,131,131,114,112,112,112,124,187,202,200,203,237,263,221,197,184,185,203,290,330,330,226,113,148,169,148,78,96,96,96,77,59,22,22,70,110,128</span>
<span style="color:#CA0000">&nbsp;128&nbsp;</span>
<strong>Glucose</strong>
</p>
<figcaption>Tufte's classic sparkline example shows a lot of information in a small space.</figcaption>
</figure>
In a mere 154×20 pixels we've shown the patient's current glucose level, its trend for more than two months, high and low values, and the range of normal values. This high information density makes sparklines effective any time space is a premium—inline in textual paragraphs, as cells in tables, or as part of information dashboards.
Sparklines do have disadvantages of course. They cannot provide as much fine-grained detail as a full size chart with axes and labels. They also cannot support significant interactivity, so we can't give users a lot of flexibility in selecting data or zooming in for detail. But for many visualizations, these aren't major concerns. Plus, as we'll see in this chapter's examples, the web gives us the chance to augment sparklines in ways not possible in print.
There are a few JavaScript libraries and toolkits for creating sparklines, but we'll focus on the most popular of them: [jQuery sparklines](http://omnipotent.net/jquery.sparkline/). As the name implies, this open source library is an extension to jQuery. The examples that follow look closely at how to use these tools to incorporate information dense visualizations into your web page. Here's what we'll learn:

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
