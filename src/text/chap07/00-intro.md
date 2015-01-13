# Chapter 7: Custom Visualizations with D3.js

In this book we've looked at many different JavaScript libraries that were designed for specific types of visualizations. If you need a certain type visualization for your web page and there's a library that can create it, using that library is often the quickest and easiest way to create your visualization. There are drawbacks to such libraries, however. They all make assumptions about how the visualization should look and act, and despite the configuration options they provide, you don't have complete control over the results. Sometimes that's not an acceptable trade-off.

In this chapter we'll look at an entirely different approach to JavaScript visualizations, one that allows us to be creative and to retain complete control over the results. As you might expect, that approach isn't always as easy as, for example, adding a charting library and feeding it data. Fortunately, there is a very powerful JavaScript library that can help: [<span class="smcp">D3</span>.js](http://d3js.org). <span class="lgcp">D3</span>.js doesn't provide predefined visualizations such as charts, graphs, or maps. Instead, it's a toolbox for data visualization, and it gives you the tools to create _your own_ charts, graphs, maps, and more.

To see some of the powerful features of <span class="smcp">D3</span>.js, we'll take a whirlwind tour. This chapter’s examples include:

* Adapting a traditional chart type for particular data.
* Building a force-directed graph that responds to user interactions.
* Displaying map-based data using high-quality Scalable Vector Graphics.
* Creating a fully custom visualization.

