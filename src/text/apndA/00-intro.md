# Appendix A: Managing Data in the Browser

So far in the book we've looked at a lot of visualization tools and techniques, but we haven't spent much time considering the _data_ part of data visualization. The emphasis on visualization is appropriate in many cases. Especially if the data is static, we can take all the time we need to clean and groom it before it's even represented in JavaScript. But what if the data is dynamic, and we have no choice but to retrieve the raw source directly into our JavaScript application? We have much less control over data from third party <span class="smcp">REST</span> <span class="smcp">API</span>s, Google Docs spreadsheets, or automatically generated <span class="smcp">CSV</span> files. With those types of data sources, we often need to validate, reformat, recalculate, or otherwise manipulate the data in the browser.

This appendix considers a JavaScript library that is particularly helpful for managing large data sets in the web browser—[Underscore.js](http://underscorejs.org). We'll cover several aspects of Underscore.js in the following sections:

* A programming style that Underscore.js encourages called "functional programming."
* Working with simple arrays using Underscore.js utilities.
* Enhancing JavaScript objects.
* Manipulating collections of objects.

The format of this appendix differs from the regular chapters in the book. Instead of covering a few examples of moderate complexity, we'll look a lot of simple, small examples. Each section collects several related examples together, but each of the small examples is independent. The first section differs even further. It's a brief introduction to functional programming cast as a step-by-step migration from the more common programming style. Understanding functional programming is very helpful, however, as its philosophy underlies almost all of the Underscore.js utilities. This appendix serves as a tour of the Underscore.js library with a special focus on managing data. (As a concession to the book's overall focus on data visualization, it also includes many illustrations.)

