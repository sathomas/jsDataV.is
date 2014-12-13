# Data Visualization with JavaScript

It's getting hard to ignore the importance of _data_ in our lives. Data is critical to the largest [social organizations](https://www.facebook.com/data) in human history. It can affect even the least consequential of our [everyday decisions](http://www.nytimes.com/2010/05/02/magazine/02self-measurement-t.html?pagewanted=all&_r=0). And its collection has widespread [geopolitical implications](http://www.theguardian.com/world/the-nsa-files). Yet it also seems to be getting easier to ignore the data itself. [One estimate](http://www.theregister.co.uk/2012/06/04/big_data_too_big/) suggests that 99.5% of the data our systems collect goes to waste. No one ever analyzes it effectively.

_Data visualization_ is a tool that addresses this gap.

Effective visualizations clarify; they transform collections of abstract artifacts (otherwise known as numbers) into shapes and forms that viewers quickly grasp and understand. The best visualizations, in fact, impart this understanding subconsciously. Viewers comprehend the data immediately—without thinking. Such presentations free the viewer to more fully consider the implications of the data: the stories it tells, the insights it reveals, or even the warnings it offers. That, of course, defines the best kind of communication.

If you're developing web sites or web applications today, there's a good chance you have data to communicate, and that data may be begging for a good visualization. But how do you know what kind of visualization is appropriate? And, even more importantly, how do you actually create one? Answers to those very questions are the core of this book. In the chapters that follow, we explore dozens of different visualizations, techniques, and tool kits. Each example discusses the appropriateness of the visualization (and suggests possible alternatives) and provides step-by-step instructions for including the visualization in your own web pages.

## The Book's Philosophy

If you're considering whether to invest your time and/or money in this book, it's only fair that you should have some understanding of the philosophy guiding it. In creating the book, I've tried to follow four main principles to make sure the book provides meaningful and practical guidance.

### Implementation vs. Design

This book won't teach you how to design data visualizations. Quite honestly, there are other authors far better qualified than me for that. (You could do a lot worse than [Edward Tufte](http://www.edwardtufte.com/tufte/books_vdqi) for example.) Instead, we'll focus on implementing visualizations. When appropriate, we'll take a slightly bigger picture view to discuss the appropriateness of particular visualization strategies, but I recognize that sometimes the boss absolutely insists on a pie chart.

### Code vs. Styling

As you might guess from the title, this book focuses on the JavaScript code for creating visualizations. We won't spend much time discussing styles for those visualizations. Fortunately, styling visualizations is pretty much the same as styling other web content. Basic experience with <span class="smcp">HTML</span> and <span class="smcp">CSS</span> will serve you well when you add visualizations to your pages. The examples don't assume you're a JavaScript expert, and we'll be sure to carefully explain any code more complicated than a basic jQuery selector.

### Simple vs. Complex

Most of the book's examples are simple, straightforward visualizations. Complex visualizations can be engaging and compelling, but studying a lot of advanced code is usually not the best way to learn the craft. In our examples, we'll try to stay as simple as possible so you can clearly see how to use the various tools and techniques. Simple doesn't mean "boring," however, and even the simplest visualizations can be enlightening and inspiring.

### Reality vs. an Ideal World

When you begin building your own visualizations, you'll discover that the real world is rarely as kind as we'd wish. Open source libraries have bugs; third party servers have security issues, and not every user has updated to the latest and greatest web browser. We won't ignore reality in these examples. Instead, we'll see how to accommodate older browsers when it's practical, how to comply with security constraints such as <span class="smcp">CORS</span>, and how to work around bugs in other folks' code.

## The Book's Contents

The chapters and appendices that follow cover a variety of visualization techniques and many of the JavaScript libraries that we can use to implement them.

* The [first chapter](chap01.html) begins with the most basic of visualizations—static charts and plots. Its examples rely on the [flotr2 library](http://www.humblesoftware.com/flotr2/) library.
* [Chapter two](chap02.html) adds interactivity to the visualizations, giving users the chance to select content, zoom in, and track values. The chapter also covers retrieving data for visualizations directly from the web. For variety, and to give you a better sense of the options available, its examples are based on the [Flot library](http://www.flotcharts.org/), which is based on jQuery.
* The [third chapter](chap03.html) looks at integrating multiple visualizations together and with other content on a web page; it uses the [jQuery sparklines](http://omnipotent.net/jquery.sparkline/) library.
* With [chapter four](chap04.html) we consider visualizations other than standard charts and plots, including tree maps, heat maps, network graphs, and word clouds. Each example focuses on a particular JavaScript library designed specifically for one of those visualization types.
* [Chapter five](chap05.html) covers time series data. It looks at several ways to visualize timelines, including traditional libraries; pure <span class="smcp">HTML</span>, <span class="smcp">CSS</span>, and JavaScript; and full-features web components.
* In [chapter six](chap06.html) we consider geographic data, and we see many ways of incorporating maps in our visualizations.
* [Chapter seven](chap07.html) introduces the powerful [<span class="smcp">D3</span>.js](http://d3js.org) library, a flexible and full-featured toolkit for building custom visualizations of almost any type.
* Beginning with [first appendix](apndA.html) we consider other aspects of web-based visualizations. In particular, we can see how the [Underscore.js](http://underscorejs.org) library makes it easy to prepare the data that drives our visualizations.
* The book [concludes](apndB.html) with the development of a complete single page web application that relies on data visualization. Here we'll see how to use modern development tools such as [Yeoman](http://yeoman.io) and the [Backbone.js](http://backbonejs.org) library.

## Source Code for Examples

To make the text as clear and readable as possible, these examples generally contain isolated snippets of JavaScript, plus occasional fragments of <span class="smcp">HTML</span> or <span class="smcp">CSS</span>. Complete source code for all examples is available on [GitHub](https://github.com/sathomas/jsDataV.is-source).

## Acknowledgements

Even though it's been said many times, there's no getting around the fact that a book such as this one is the work of many people other than the author. It certainly wouldn't be possible without the patience of Seph and the other fine folks at No Starch Press. There simply is no better publisher for technical books. Kudos also to Chris for the technical review, though, of course, the remaining mistakes are mine alone. I owe a special thanks to NickC for his generosity; it's such a pleasure to meet folks that appreciate the true community spirit of the Web and web development. Finally, a shout out to the team developing the [Open Academic Environment](http://www.oaeproject.org) and my colleagues at the Georgia Institute of Technology; working with them is a true pleasure.

## Other Versions

If you prefer a printed book or a proper ebook, you can purchase copies from [No Starch Press](http://www.nostarch.com/datavisualization). You can also find the book at [Amazon](http://www.amazon.com/gp/product/1593276052/ref=as_li_qf_sp_asin_il_tl?ie=UTF8&camp=1789&creative=9325&creativeASIN=1593276052&linkCode=as2&tag=jsdatis-20&linkId=EPVO4G5OWW6LZML7).