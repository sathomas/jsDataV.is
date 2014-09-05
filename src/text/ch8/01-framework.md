## Frameworks and Libraries

If we're using JavaScript to add data visualizations to traditional web pages, we don't have to worry too much about organizing and structuring our JavaScript. After all, it's often a relatively small amount of code, especially compared to the HTML markup and CSS styles that are also part of the page. With web applications, however, the code can grow to be more extensive and more complex. To help keep our code organized and manageable, we'll take advantage of a JavaScript application library, sometimes also known as a framework.

### Step 1: Select an Application Library

Deciding to use _an_ application library might be easier than deciding _which_ one to use. The number of these libraries has exploded in the past few years; there are now over 30 high quality libraries from which to choose. A good place to see all the alternatives is [TodoMVC](http://todomvc.com). That site serves as a showcase for application libraries; it shows how to implement a simple to-do application in each.

There is an important difference between these application libraries that can help narrow the choice: Is an application library a pure library or an application framework? Those terms are often used interchangeably, but there is an important distinction. A pure library functions like jQuery or other libraries we've used throughout this book. It provides a set of tools for our application, and we can use as many—or as little—of those tools as we like. An application framework, on the other hand, dictates exactly how the application should work. The code that we write must follow the strictures and conventions of the framework. Fundamentally the difference is about control. With a pure library our code is in control and the library is at our disposal. With a framework the framework code is in control, and we simply add the code that makes our application unique.

The main advantage of a pure library is flexibility. Our code is in control of the application, and we have full latitude to structure the application to our own requirements. That's not always a good thing, however. The constraints of a framework can protect us from making poor design decisions. Some of the world's best JavaScript developers are responsible for the popular frameworks, and they've put a lot of thought into what makes a good web application. There's another benefit to frameworks: Because the framework assumes more responsibility for the application, there's generally less code we're required to write.

Having made the distinction between frameworks and pure libraries, it's worth noting that almost any web application can be built effectively with either. Both approaches provide the organization and structure necessary for a high quality application. For our example we'll use the [Backbone.js](http://backbonejs.org) library. It is by far the most popular of the pure (i.e. non-framework) libraries, and it's used by dozens of the largest sites on the web. The general approach that we'll follow, however, (including tools such as Yeoman) work well with almost any popular application library.

### Step 2: Install Development Tools

When you start building your first real web application, deciding how to begin can be a bit intimidating. One tool that can be a big help at this stage is [Yeoman](http://yeoman.io), which describes itself as "The Web's Scaffolding Tool for Modern Webapps." That's a pretty accurate description. Yeoman can define and initialize a project structure for a large number of different web application frameworks, including Backbone.js. As we'll see, it also sets up and configures most of the other tools we'll need during the application's development.

Before we can use Yeoman we must first install [node.js](http://nodejs.org). Node.js is a powerful application development platform all by itself, but we won't need to worry about the details here. It is, however, the application platform required by many modern web development tools like Yeoman. To install node.js, follow the instructions on the [node.js web site](http://nodejs.org).

With node.js installed, we can install the main Yeoman application as well as everything necessary to create a [Backbone.js application](https://github.com/yeoman/generator-backbone) with one command. You can execute this command in the Terminal app (on Mac OS X) or from the Windows Command Prompt.

``` {.bash .numberLines}
$ npm install -g generator-backbone
```

### Step 3: Define a New Project

The development tools we just installed will make it easy to create a new web app project. We'll create a new folder (named `running`) for our application and then change directory into that folder.

``` {.bash .numberLines}
$ mkdir running
$ cd running
```

From within that new folder, executing the command `yo backbone` will initialize the project structure.

``` {.bash .numberLines}
$ yo backbone
```

As part of the initialization, Yeoman will ask for permission to send diagnostic information (mainly which frameworks and features our app uses) back to the Yeoman developers. It will then give us a choice to add a few additional tools to the app. For our example we'll skip any of the suggested options.

``` {.bash .numberLines}
Out of the box I include HTML5 Boilerplate, jQuery, Backbone.js and Modernizr.
[?] What more would you like? (Press <space> to select)
❯⬡ Bootstrap for Sass
 ⬡ Use CoffeeScript
 ⬡ Use RequireJs
```

Yeoman will then do it's magic, creating several sub-folders, installing extra tools and applications, and setting up reasonable defaults. As we watch all the pages and pages of installation information scroll by in our window, we can be glad that Yeoman is doing all this work for us. When Yeoman finishes, we'll have a project structure like the one in figure NEXTFIGURENUMBER's screenshot. It may not look exactly like the following since web applications may have changed since this text was written. Rest assured, though, that it will follow the best practices and conventions.

<figure>
![](img/yoproject.png)
<figcaption>Yeoman creates a default project structure for a web application.</figcaption>
</figure>
 
 We'll spend more time with most of these files and folders in the sections that follow, but here's a quick overview of the project that Yeoman has set up for us.
 
 * `app/`: The folder which will contain all the code for our app.
 * `bower.json`: A file that keeps track of all the third party libraries our app uses.
 * `Gruntfile.js`: A file that controls how to test and build our app.
 * `node_modules/`: A folder that contains the tools used to build and test our app.
 * `package.json`: A file that identifies the tools used to build and test our app.
 * `test/`: A folder that will contain the code we'll write to test our app.

At this point Yeoman has set up a complete web app (albeit one that doesn't do anything). You can execute the command `grunt serve` from the command prompt to see it in a browser.

``` {.bash .numberLines}
$ grunt serve
Running "serve" task

Running "clean:server" (clean) task

Running "createDefaultTemplate" task

Running "jst:compile" (jst) task
>> Destination not written because compiled files were empty.

Running "connect:livereload" (connect) task
Started connect web server on http://localhost:9000

Running "open:server" (open) task

Running "watch:livereload" (watch) task
Waiting...
```

The `grunt` command runs one of the tools that's part of the Yeoman package. When passed the `serve` option, it cleans up the application folder, starts a web server to host the application, launches a web browser, and navigates to the skeleton app. You'll see something like figure NEXTFIGURENUMBER in your browser.

<figure>
![](img/yoskeleton.png)
<figcaption>The default Yeoman web application runs in the browser.</figcaption>
</figure>

Congratulations! Our web app, as basic as it is, is now running.

### Step 4: Add our Unique Dependencies

Yeoman sets up sensible defaults and tools for a new app, but our app needs a few JavaScript libraries that aren't part of those defaults—Leaflet for maps and Flot for charts. The [Moment.js](http://momentjs.com) library for dealing with dates and times will also come in handy, as will the [Underscore.string](http://epeli.github.io/underscore.string/) library. We can add these libraries to our project with some simple commands. The `--save` option tells bower to remember that our project depends on these libraries.

``` {.bash .numberLines}
$ bower install leaflet --save
$ bower install flot --save
$ bower install momentjs --save
$ bower install underscore.string --save
```

Perhaps you've already begun to appreciate how tools like Yeoman make development easier. The simple commands above save us from having to find the libraries on the web, download the appropriate files, copy them to the right place in our project, and so on.

Even more importantly, Yeoman (technically, it's the _bower_ tool that's part of the Yeoman package) automatically takes care of any additional libraries on which these libraries depend. The Flot library, for example, requires jQuery. When Yeoman installs Flot it will also check and make sure that jQuery is installed in the project. In our case it is because Backbone.js depends on it, but if jQuery weren't already installed, Yeoman would automatically find it and install it as well.

For most libraries `bower` can completely install all the necessary components and files. In the case of Leaflet, however, we need to perform a few extra steps. Change directory to the `leaflet` folder within `app/bower_components`. From there, run two commands to install the unique tools that Leaflet requires.

``` {.bash .numberLines}
$ npm install
$ npm install jake -g
```

Executing the command `jake` will then run all of Leaflet's tests and, provided they pass, create a `leaflet.js` library for our app.

``` {.bash .numberLines}
$ jake
Checking for JS errors...
	Check passed.

Checking for specs JS errors...
	Check passed.

Running tests...

................................................................................
................................................................................
................................................................................
........................................
PhantomJS 1.9.7 (Mac OS X): Executed 280 of 280 SUCCESS (0.881 secs / 0.496 secs)
	Tests ran successfully.


Concatenating and compressing 75 files...
	Uncompressed: 217.22 KB (unchanged)
	Compressed: 122.27 KB (unchanged)
	Gzipped: 32.71 KB
```

All that's left to do is adding the additional libraries into our HTML files. That's easy enough. The main page for our app is `index.html` in the `app` folder. There's already a block of code that includes jQuery, Underscore.js, and Backbone.js:

``` {.html .numberLines}
<!-- build:js scripts/vendor.js -->
<script src="bower_components/jquery/dist/jquery.js"></script>
<script src="bower_components/underscore/underscore.js"></script>
<script src="bower_components/backbone/backbone.js"></script>
<!-- endbuild -->
```

We can add our new libraries after Backbone.js.

``` {.html .numberLines}
<!-- build:js scripts/vendor.js -->
<script src="bower_components/jquery/dist/jquery.js"></script>
<script src="bower_components/underscore/underscore.js"></script>
<script src="bower_components/backbone/backbone.js"></script>
<script src="bower_components/flot/jquery.flot.js"></script>
<script src="bower_components/leaflet/dist/leaflet-src.js"></script>
<script src="bower_components/momentjs/moment.js"></script>
<script src="bower_components/underscore.string/lib/underscore.string.js"></script>
<!-- endbuild -->
```

Leaflet, as we saw in chapter 6, also requires it's own style sheet. We add that to the top of `index.html` just before `main.css`.

``` {.html .numberLines}
<!-- build:css(.tmp) styles/main.css -->
<link rel="stylesheet" href="bower_components/leaflet/dist/leaflet.css">
<link rel="stylesheet" href="styles/main.css">
<!-- endbuild -->
```

Now that we've set up the structure of our app and installed the necessary libraries, it's time to start development.