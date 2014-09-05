# Chapter 1: Graphing Data

Many people think of data visualization as intricate interactive graphics of dazzling complexity. Creating effective visualizations, however, doesn't require Picasso's artistic skills nor Turing's programming expertise. In fact, when you consider the ultimate purpose of data visualization—helping users _understand_ data—simplicity is one of the most important features of an effective visualization. Simple, straightforward charts are often the easiest to understand. After all, users have seen hundreds or thousands of bar charts, line charts, <span class="smcp">X</span>/<span class="smcp">Y</span> plots, and the like. They know the conventions that underlie these charts, so they can interpret a well-designed example effortlessly. That makes them the first choice for planning any visualization. If a simple, static chart presents the data best, use it. You'll spend less effort creating your visualization, and your users will spend less effort trying to understand it.

There are many high quality tools and libraries to help you get started with simple visualizations. With these tools, you can avoid reinventing the wheel, plus you can be assured of a reasonably attractive presentation by sticking with the library defaults. We'll look at several of these tools throughout the book, but for this chapter the we'll use the [flotr2 library](http://www.humblesoftware.com/flotr2/). flotr2 makes it easy to add standard bar charts, line charts, and pie charts to any web page, and it also supports some less common chart types. We'll take a look at all of these techniques in the examples that follow. Here's what you'll learn:

* How to create a basic bar chart
* How to plot continuous data with a line chart
* How to emphasize fractions with a pie chart
* How to plot <span class="smcp">X</span>/<span class="smcp">Y</span> data with a scatter chart
* How to show magnitudes of <span class="smcp">X</span>/<span class="smcp">Y</span> data with a bubble chart
* How to display multidimensional data with a radar chart

