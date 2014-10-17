# Chapter 8: Building Data-Driven Web Applications

So far we've had a chance to see many of the tools and libraries for creating individual JavaScript visualizations, but we've only considered them in the context of a traditional web page. Today, of course, the web is much more than traditional web pages. Especially on desktop computers, web sites are effectively full featured software applications. (Even on mobile devices many "apps" are really just web sites enclosed in a thin wrapper.) When a web application is structured around data, there's a good chance it can benefit from data visualizations. That's exactly what we'll consider in this chapter: how to integrate data visualization into a true web application.

The sections that follow will walk through the development of an example application driven by data. The source of the data will be Nike's [Nike+](http://nikeplus.com) service for runners. Nike sells many products and applications that let runners track their activities and save the results for analysis and review. In this chapter we'll build a web application to retrieve that data from Nike and present it to a user. Nike, of course, has its own web app for viewing Nike+ data, and that app is far superior to the simple example of this chapter. We're certainly not trying to compete with Nike; rather, we're just using the Nike+ service to structure our example.

> Note 1: The examples in this chapter are based on the version of the interface at the time of this writing. There have very likely been changes to the interface since then.

Unlike most other chapters, we won't be considering multiple independent examples in the following sections. Instead we'll walkthrough the main stages in the development and testing of a data-driven application.

* How to structure a web application using a framework or library.
* How to organize an application into models and views.
* How to incorporate visualizations in views.
* How to connect application models with an external <span class="smcp">REST</span> <span class="smcp">API</span>.
* How to support web browser conventions in a single page application. 

> Note 2: To use the Nike+ data in an actual product, you must register your application with Nike and get the necessary credentials and security keys. That process also grants access to the full documentation for the service, which is not publicly available. Since we're not building a real application in this example, we won't cover that step. We will, however, base the application on the Nike+ <span class="smcp">API</span>, which is documented publicly on [Nike's developer web site](https://developer.nike.com/index.html). Because the example doesn't include the credentials and security keys, it won't be able to access the real Nike+ service. The book's source code, however, does include actual Nike+ data that can be used to emulate the Nike+ service for testing and development.

