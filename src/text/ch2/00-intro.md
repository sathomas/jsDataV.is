# Chapter 2: Making Charts Interactive

In chapter 1 we saw how to create a wide variety of simple, static charts. In many cases such charts are the ideal visualization, but they don't take advantage of an important characteristic of the web—interactivity. Sometimes you want to do more than just present data to your users; you want to give them a chance to explore the data, to focus on the elements they find particularly interesting, or to consider alternative scenarios. In those cases we can take advantage of the web as a medium by adding interactivity to our visualizations.
Because they're designed for the web, virtually all of the libraries and toolkits we examine in this book include support for interactivity. That's certainly true of the flotr2 library used in chapter 1. But let's take the opportunity to explore an alternative. In this chapter, we'll use the [Flot library](http://www.flotcharts.org/), which is based on jQuery, and features exceptionally strong support for interactive and real time charts.
For this chapter, we're also going to stick with a single data source: the Gross Domestic Product (<span class="smcp">GDP</span>) for countries worldwide. This data is publicly available from the [World Bank](http://data.worldbank.org). It may not seem like the most exciting data to work with, but effective visualizations can bring even the most mundane data alive.
Here's what you'll learn:

* How to let users select the content for a chart
* How to let users zoom into a chart to see more details
* How to make a chart respond to user mouse movements
* How to dynamically get data for a chart using an <span class="smcp">AJAX</span> service

