
## Models and Views

There are many application libraries available for web apps, and they each have their quirks, but most of the libraries agree on the key principles that should guide an app's architecture. Perhaps the most fundamental of those principles is separating _models_ from _views._ The code that keeps track of the core data for the app—the models—should be separate from the code that presents that data to the user—the views. Enforcing this separation makes it easier to update and modify either. If you want to present your data in a table instead of a chart, you can do that without any changes to the models. And if you need to change your data source from a local file to a <span class="smcp">REST</span> <span class="smcp">API</span>, you can do that without any changes to the views. We've been employing this principle in an informal way throughout the book. In all of the examples we've isolated the steps required to obtain and format our data from the steps we used to visualize it. Using an application library like Backbone.js gives us the tools to manage models and views more explicitly.

### Step 1: Define the Application's Models

Our running app is designed to work with Nike+, which provides details about runs—training runs, interval workouts, trail runs, races, and so on. The data set we want consists of nothing but runs, so our app's core model is, naturally, a run.

The Yeoman tool makes it very easy to define a model for our app. A simple command defines a new model and creates the JavaScript files and scaffolding for that model.

``` {.bash}
$ yo backbone:model run
   create app/scripts/models/run.js
   invoke   backbone-mocha:model
   create     test/models/run.spec.js
```

That command creates two new files: `run.js` in the `app/scripts/models/` folder and `run.spec.js` in the `test/` folder. Let's take a look at the file Yeoman created for our model. It's quite short.

``` {.javascript .numberLines}
/*global Running, Backbone*/

Running.Models = Running.Models || {};

(function () {
    'use strict';
    Running.Models.Run = Backbone.Model.extend({
        url: '',
        initialize: function() {
        },
        defaults: {
        },
        validate: function(attrs, options) {
        },
        parse: function(response, options)  {
            return response;
        }
    });
})();
```

The first line is a comment that lists the global variables our model requires. In this case there are only two: `Running` (that's our app), and `Backbone`. Next, in line 3, this file creates a `.Models` property of the `Running` object unless that property already exists. 

When the browser encounters this line it will check to see if `Running.Models` exists. If it does, then `Running.Models` won't be `false`, and the browser never has to consider the second clause of the logical _or_ (`||`). The statement simply assigns `Running.Models` to itself, so it has no practical effect. If `Running.Models` does not exist, however, then `Running.Models` evaluates to `false`, and the browser will continue to the second clause, where it assigs an empty object (`{}`) to `Running.Models`. Ultimately, this statement makes sure that the object `Running.Models` exists.

The rest of the code in the file is enclosed within an _Immediately-Invoked Function Expression._ If you haven't seen this pattern before, it may look a little strange.

``` {.javascript .numberLines}
(function () {
    /* code goes here */
})();
```

If we re-write the block as a single line, though, it might be easier to understand.

``` {.javascript .numberLines}
( function () { /* code goes here */ } ) ();
```

The statement defines a JavaScript function with a function expression, `function () { /* ... */ }`, and then, with the concluding `()`, calls (technically _invokes_) that newly created function. All we're really doing, therefore, is putting our code inside of a function and calling that function. You'll see this pattern a lot in professional JavaScript because it protects a block of code from interfering with other code blocks in the application.

When you define a variable in JavaScript, that variable is a _global_ variable, available everywhere in the code. As a consequence, if two different sections of code try to define the same global variable, those definitions will clash. This interaction can cause bugs that are very hard to find, as code in once section inadvertently interferes with code in a completely different section. To prevent this problem we can avoid using global variables, and the easiest way to do that in JavaScript is to define our variables inside a function. That's the purpose of an immediately-invoked function expression. It makes sure that any variables our code defines are local to the function rather than global, and it prevents our code blocks from interfering with each other.

### Step 2: Implement the Model

Our application really only needs this one model, and it's already complete! That's right, the scaffolding that Yeoman has set up for us is a complete and functioning model for a Run. In fact, if it weren't for some quirks in Nike's <span class="smcp">REST</span> <span class="smcp">API</span>, we wouldn't have to touch the model code at all. We'll address those quirks in a later section.

Before we move on to the next step, though, let's spend a little time looking at what we can do with our newly created model. To do that we'll make a temporary addition to the model code. We won't use the following code in the final app; it's only meant to show off what our model can already do.

From the Nike+ documentation we find that the <span class="smcp">URL</span> to retrieve details about a run (Nike+ uses the more general term "activity") is `https://api.nike.com/v1/me/sport/activities/{activityId}`. The final part depends on the specific activity, so we'll add only the general part of the <span class="smcp">URL</span> to our model, in Line 2 below.

``` {.javascript .numberLines}
Running.Models.Run = Backbone.Model.extend({
    url: 'https://api.nike.com/v1/me/sport/activities/',
    initialize: function() {
    },
    defaults: {
    },
    validate: function(attrs, options) {
    },
    parse: function(response, options)  {
        return response;
    }
});
```

Now imagine that we want to get the details for a specific run from the Nike+ service. The run in question has a unique identifier of `2126456911`. If the Nike+ <span class="smcp">API</span> followed typical conventions, we could create a variable representing that run, _and get all its data,_ with the hypothetical two statements below. (We’ll consider the quirks of the actual Nike+ interface in a later section.)

``` {.javascript .numberLines}
var run = new Running.Models.Run({id: 2126456911});
run.fetch();
```

Since many APIs do follow typical conventions, it’s worth spending a little bit of time understanding how that code works. The first statement creates a new instance of the Run model and specifies its identifier. The second statement tells Backbone to retrieve the model's data from the server. Backbone would take care of all the communication with Nike+, including error handling, timeouts, parsing the response, and so on. Once the fetch completes, detailed information from that run will be available from the model. If we provide a callback function, we could output some of the details. For example:

``` {.javascript .numberLines}
var run = new Running.Models.Run({id: 2126456911});
run.fetch({success: function() {
    console.log("Run started at ", run.get('startTime'));
    console.log("    Duration: ",  run.get('metricSummary').duration);
    console.log("    Distance: ",  run.get('metricSummary').distance);
    console.log("    Calories: ",  run.get('metricSummary').calories);
}});
```

The output in the browser's console would be:

``` {.bash}
Run started at 2013-04-09T10:54:33Z
    Duration: 0:22:39.000
    Distance: 3.7524
    Calories: 240
```

Not bad for a few simple lines of code. The code in this step, though, is really just a detour. Our application won't use individual models in this way. Instead we'll use an even more powerful Backbone.js feature: collections.

### Step 3: Define the Application's Collections

The model we created is designed to capture the data for a single run. Our users, however, aren't interested in just a single run. They'd like to see all of their runs, dozens, hundreds, possibly thousands of them. We can handle all of these runs with a _collection,_ or group of models. The collection is one of the core concepts of Backbone.js, and it will be a big help for our app. Let's define a collection for all of the user's runs.

Yeoman makes it easy to define and set up scaffolding for our collection. We execute the single command `yo backbone:collection runs` from the command line. (Yes, we're being very original and calling our collection of runs, well, _runs._)

``` {.bash}
$ yo backbone:collection runs
   create app/scripts/collections/runs.js
   invoke   backbone-mocha:collection
   create     test/collections/runs.spec.js
```

Yeoman does the same thing for collections as it did for models. It creates an implementation file (`runs.js` in the `app/scripts/collections/` folder) and a test file. For now, let's take a look at `runs.js`.

``` {.javascript .numberLines}
/*global Running, Backbone*/

Running.Collections = Running.Collections || {};

(function () {
    'use strict';
    Running.Collections.Runs = Backbone.Collection.extend({
        model: Running.Models.Runs
    });
})();
```

This file is even simpler than our model; the default collection only has a single property to indicate what type of model the collection contains. Unfortunately, Yeoman isn't smart enough to handle plurals, so it assumes the name of the model is the same as the name of the collection. That's not true for our app, as our model is a _Run_ (singular) and the collection is _Runs_ (plural). While we're removing that `s`, we can also add a property to specify the <span class="smcp">REST</span> <span class="smcp">API</span> for the collection. That's a <span class="smcp">URL</span> from the Nike+ service.

``` {.javascript .numberLines}
Running.Collections.Runs = Backbone.Collection.extend({
    url: 'https://api.nike.com/v1/me/sport/activities/',
    model: Running.Models.Run
});
```

With those two small changes, we're ready to take advantage of our new collection. (Aside from handling a few quirks with the Nike+ <span class="smcp">API</span>; we'll ignore that complication for now and address it later.) All we need to do is create a new instance of the Runs collection and then fetch its data.

``` {.javascript .numberLines}
var runs = new Running.Collections.Runs();
runs.fetch();
```

That's all it takes to build a collection containing the user's runs. Backbone.js creates a model for each and retrieves the model's data from the server. Even better, those run models are stored in a true Underscore.js collection, which gives us access to many powerful methods to manipulate and search through the collection. Suppose, for example, we want to find the total distance for all of a user's runs. That's a tailor-made for the Underscore.js `reduce` function.

``` {.javascript .numberLines}
var totalDistance = runs.reduce( function(sum, run) {
    return sum + run.get('metricSummary').distance;
}, 0);
```

That code could tell us, for example, that the user has logged a total of 3358 km with Nike+.

> As you may have noticed, we’re taking advantage of many utilities from Underscore.js in our Backbone.js application. That is not a coincidence. Jeremy Ashkenas is the lead developer for both projects.

### Step 4: Define the Application's Main View

Now that we have all the running data for a user, it's time to present that data. We'll do that with Backbone.js _views._  To keep our example simple, we'll only consider two ways to show the running data. First we'll display a table listing summary information about each run. Then, if the user clicks on a table row, we'll show details about that specific run including any visualizations. The main view of our application will be the summary table, so let's focus on that first.

A Backbone.js view is responsible for the presenting data to the user, and that data may be maintained in a collection or a model. For the main page of our app, we want to show summary information for all of a user's runs. That view, therefore, is a view of the entire collection. We'll call the view _Summary._ 

The bulk of the table for this Summary view will be a series of table rows, where each row presents summary data about an individual run. That means we can simply create a view of a single Run model presented as a table row, and design our main Summary view to be made up (mostly) of many _SummaryRow_ views. We can once again rely on Yeoman to set up the scaffolding for both of those types of views.

``` {.bash}
$ yo backbone:view summary
   create app/scripts/templates/summary.ejs
   create app/scripts/views/summary.js
   invoke   backbone-mocha:view
   create     test/views/summary.spec.js
$ yo backbone:view summaryRow
   create app/scripts/templates/summaryRow.ejs
   create app/scripts/views/summaryRow.js
   invoke   backbone-mocha:view
   create     test/views/summaryRow.spec.js
```

The scaffolding that Yeoman sets up is pretty much the same for each view; only the name varies. Here's what a Summary view looks like.

``` {.javascript .numberLines}
/*global Running, Backbone, JST*/

Running.Views = Running.Views || {};

(function () {
    'use strict';
    Running.Views.Summary = Backbone.View.extend({
        template: JST['app/scripts/templates/summary.ejs'],
        tagName: 'div',
        id: '',
        className: '',
        events: {},
        initialize: function () {
            this.listenTo(this.model, 'change', this.render);
        },
        render: function () {
            this.$el.html(this.template(this.model.toJSON()));
        }
    });
})();
```

The overall structure of the file is the same as our model and our collection, but there's a bit more going on in the view itself. Let's step through view's properties one at a time. The first property is `template`. That's where we define the exact <span class="smcp">HTML</span> markup for the view, and we'll look at this in more detail in the next step.

The `tagName` property defines the <span class="smcp">HTML</span> tag that our view will use as its parent. Yeoman defaults it to a generic `<div>`, but we know that in our case it will be a `<table>`. We'll change that in a moment.

The `id` and `className` properties specify <span class="smcp">HTML</span> `id` attributes or `class` values to add to the main container (in our case the `<table>`). We could, for example, base some <span class="smcp">CSS</span> styles on these values. For our example we're not considering styles, so we can leave both properties blank or delete them entirely.

Next is the `events` property. This object identifies user events (such as mouse clicks) that are relevant for the view. In the case of the Summary view, there are no events, so we can leave the object empty or simply delete it.

The last two properties, `initialize` and `render`, are both methods. Before we consider those, let's see the Summary view after the tweaks mentioned above. Now that we've omitted the properties we won't be using, we're down to just the `template` and `tagName` properties, plus the `initialize` and `render` methods:

``` {.javascript .numberLines}
Running.Views.Summary = Backbone.View.extend({
    template: JST['app/scripts/templates/summary.ejs'],
    tagName: 'table',
    initialize: function () {
            this.listenTo(this.model, 'change', this.render);
    },
    render: function () {
            this.$el.html(this.template(this.model.toJSON()));
    }
});
```

Now let's look inside the last two methods, starting with `initialize`. That method has a single statement (other than the `return` statement that we just added). By calling `listenTo`, it tells Backbone.js that the view wants to listen for events. The first parameter, `this.collection`, specifies the event target, so the statement says that the view wants to listen to events affecting the collection. The second parameter specifies the type of events. In this case the view wants to know whenever the collection changes. The final parameter is the function Backbone.js should call when the event occurs. Every time the Runs collection changes, we want Backbone.js to call the view's `render` method. That makes sense. Whenever the Runs collection changes, whatever we were displaying on the page before is now out-of-date. To make it current, our view should refresh its contents.

Most of the real work of a view takes place in its `render` method. After all, this is the code that actually creates the <span class="smcp">HTML</span> markup for the web page. Yeoman has gotten us started with a template, but, in the case of a collection view, that's not enough. The template takes care of the <span class="smcp">HTML</span> for the collection as a whole, but it doesn't handle the models that are part of the collection. For the individual runs, we can use the `each` function from Underscore.js to iterate through the collection and render each run.

As you can see from the code below, we’ve also added a `return this;` statement to each method. In a bit we’ll take advantage of this addition to _chain_ together calls to multiple methods in a single, concise statement.

``` {.javascript .numberLines}
Running.Views.Summary = Backbone.View.extend({
    template: JST['app/scripts/templates/summary.ejs'],
    tagName: 'table',
    initialize: function () {
        this.listenTo(this.collection, 'change', this.render);
        return this;
    },
     render: function () {
        this.$el.html(this.template());
        this.collection.each(this.renderRun, this);
        return this;
    }
});
```

Now we have to write the `renderRun` method that handles each individual run. Here's what we want that function to do:

1. Create a new SummaryRow view for the run.
2. Render that SummaryRow view.
3. Append the resulting <span class="smcp">HTML</span> to the `<tbody>` in the Summary view.

The code to implement those steps is straightforward, but it's helpful to take each step one at a time.

1. Create a new SummaryRow view: `new SummaryRow({model: run})`
2. Render that Summary Row view: `.render()`
3. Append the result: `this.$('tbody').append();`

When we put the steps together we have the `renderRun` method.

``` {.javascript .numberLines}
    renderRun: function (run) {
        this.$('tbody').append(new Running.Views.SummaryRow({
            model: run
        }).render().el);
    }
```

Most of the changes we made to the Summary view are also appropriate for the SummaryRow view, although we don't need to add anything to the `render` method. Here's our first implementation of the SummaryRow. Note that we've set the `tagName` property to `'tr'` because we want each run model presented as a table row.

``` {.javascript .numberLines}
Running.Views.SummaryRow = Backbone.View.extend({
    template: JST['app/scripts/templates/summaryRow.ejs'],
    tagName: 'tr',
    events: {},
    initialize: function () {
        this.listenTo(this.model, 'change', this.render);
        return this;
    },
    render: function () {
        this.$el.html(this.template(this.model.toJSON()));
        return this;
    }
});
```

Now we have all the JavaScript code we need to show the main summary view for our app. 

### Step 5: Define the Main View Templates

So far we've developed the JavaScript code to manipulate our Summary and SummaryRow views. That code doesn't generate the actual <span class="smcp">HTML</span> markup, though. For that task we rely on templates. Templates are skeletal <span class="smcp">HTML</span> markup with placeholders for individual values. Confining <span class="smcp">HTML</span> markup to templates helps keep our JavaScript code clean, well-structured, and easy to maintain.

Just as there are many popular JavaScript application libraries, there are also many template languages. Our application doesn't require any fancy template functionality, however, so we'll stick with the default template process that Yeoman has set up for us. That process relies on a [<span class="smcp">JST</span> tool](https://github.com/gruntjs/grunt-contrib-jst) to process templates, and the tool uses the [Underscore.js template language](http://underscorejs.org/#template). It's easy to see how this works through an example, so let's dive in.

The first template we'll tackle is the template for a SummaryRow. In our view we've already established that the SummaryRow is a `<tr>` element, so the template only needs to supply the content that lives within that `<tr>`. We'll get that content from the associated Run model which, in turn, comes from the Nike+ service. Here's an example activity that Nike+ could return.

``` {.javascript .numberLines}
{
    "activityId": "2126456911",
    "activityType": "RUN",
    "startTime": "2013-04-09T10:54:33Z",
    "activityTimeZone": "GMT-04:00",
    "status": "COMPLETE",
    "deviceType": "IPOD",
    "metricSummary": {
        "calories": 240,
        "fuel": 790,
        "distance": 3.7524,
        "steps": 0,
        "duration": "0:22:39.000"
    },
    "tags": [/* Data continues... */],
    "metrics": [/* Data continues... */],
    "gps": {/* Data continues... */}
}
```

For a first implementation, let's show the time of the run, as well as it's duration, distance, and calories. Our table row, therefore, will have four cells with each cell holding one of these values. We can find the template in the `app/scripts/templates` folder. It's the `summaryRow.ejs` file. By default, Yeoman sets it to a simple paragraph.

``` {.html .numberLines}
<p>Your content here.</p>
```

Let's replace that with four table cells.

``` {.html .numberLines}
<td></td>
<td></td>
<td></td>
<td></td>
```

As placeholders for the cells' content, we can use model attributes enclosed in special `<%=` and ` %>` delimiters. The full SummaryRow template, therefore, is as follows.

``` {.html .numberLines}
<td><%= startTime %></td>
<td><%= metricSummary.duration %></td>
<td><%= metricSummary.distance %></td>
<td><%= metricSummary.calories %></td>
```

The other template we need to supply is the Summary template. Since we've already set the view's main tag to be a `<table>`, this template should specify the content within that `<table>`: a table header row plus an empty `<tbody>` element (whose individual rows will come from the Run models).

``` {.html .numberLines}
<thead>
	<tr>
        <th>Time</th>
        <th>Duration</th>
        <th>Distance</th>
        <th>Calories</th>
    </tr>
</thead>
<tbody></tbody>
```

Now we're finally ready to construct the main view for our runs. The steps are quite straightforward.

1. Create a new Runs collection.
2. Fetch the data for that collection from the server.
3. Create a new Summary view for the collection.
4. Render the view.

Here's the JavaScript code for those four steps.

``` {.javascript .numberLines}
var runs = new Running.Collection.Runs();
runs.fetch();
var summaryView = new Running.Views.Summary({collection: runs});
summaryView.render();
```

We can access the constructed `<table>` as the `el` (short for _element_) property of the view. It will look something like the following.

``` {.html .numberLines}
<table>
  <thead>
    <tr>
        <th>Time</th>
        <th>Duration</th>
        <th>Distance</th>
        <th>Calories</th>
    </tr>
  </thead>
  <tbody>
    <tr>
        <td>2013-04-09T10:54:33Z</td>
        <td>0:22:39.000</td>
        <td>3.7524</td>
        <td>240</td>
    </tr>
    <tr>
        <td>2013-04-07T12:34:40Z</td>
        <td>0:44:59.000</td>
        <td>8.1724</td>
        <td>569</td>
    </tr>
    <tr>
        <td>2013-04-06T13:28:36Z</td>
        <td>1:28:59.000</td>
        <td>16.068001</td>
        <td>1200</td>
    </tr>
  </tbody>
</table>
```

When we insert that markup in the page, our users can see a simple summary table listing their runs.

<table>
<thead>
<tr><th>Time</th><th>Duration</th><th>Distance</th><th>Calories</th></tr>
</thead>
<tbody>
<tr><td>2013-04-09T10:54:33Z</td><td>0:22:39.000</td><td>3.7524</td><td>240</td></tr>
<tr><td>2013-04-07T12:34:40Z</td><td>0:44:59.000</td><td>8.1724</td><td>569</td></tr>
<tr><td>2013-04-06T13:28:36Z</td><td>1:28:59.000</td><td>16.068001</td><td>1200</td></tr>
<tr><td>2013-04-04T11:57:16Z</td><td>0:58:44.000</td><td>9.623</td><td>736</td></tr>
<tr><td>2013-04-02T11:42:47Z</td><td>0:22:37.000</td><td>3.6368</td><td>293</td></tr>
<tr><td>2013-03-31T12:44:00Z</td><td>0:34:04.000</td><td>6.3987</td><td>445</td></tr>
<tr><td>2013-03-30T13:15:35Z</td><td>1:29:31.000</td><td>16.0548</td><td>1203</td></tr>
<tr><td>2013-03-28T11:42:17Z</td><td>1:04:09.000</td><td>11.1741</td><td>852</td></tr>
<tr><td>2013-03-26T12:21:52Z</td><td>0:39:33.000</td><td>7.3032</td><td>514</td></tr>
<tr><td>2013-03-24T20:15:31Z</td><td>0:33:49.000</td><td>6.2886</td><td>455</td></tr>
</tbody>
</table>

### Step 6: Refine the Main View

Now we're starting to get somewhere, though the table contents could use some tweaking. After all, does the last digit in a run of 16.068001 km really matter? Since Nike+ determines the attributes of our Run model, it might seem like we have no control over the values passed to our template. Fortunately, that's not the case. If we look at the SummaryView's `render` method, we can see how the template gets its values.

``` {.javascript .numberLines}
render: function () {
    this.$el.html(this.template(this.model.toJSON()));
    return this;
}
```

The template values come from a JavaScript object that we're creating directly from the model. Backbone.js provided the `toJSON` method that returns a JavaScript object corresponding to the model's attributes. We can actually pass any JavaScript object to the template, even one we create ourselves within the `render` method. Let's rewrite that method to provide a more user-friendly summary view. We'll take the model's attributes one at a time.

First up is the date of the run. A date of "2013-04-09T10:54:33Z" isn't very readable for average users, and it's probably not even in their time zone. Working with dates and times is actually quite tricky, but the excellent [Moment.js library](http://momentjs.com) can handle all of the complexity. Since we added that library to our app in an earlier section, we can take advantage of it now.

``` {.javascript .numberLines}
render: function () {
    var run = {};
    run.date = moment(this.model.get("startTime")).calendar();
```

> In the interest of brevity, we're cheating a little with the code above because it converts the <span class="smcp">UTC</span> timestamp to the local time zone of the browser. It would probably be more correct to convert it to the time zone for the run, which Nike+ provides in the data.

Next up is the run's duration. It's doubtful that we need to show the fractions of seconds that Nike+ includes, so let's simply drop them from the attribute. (It would be more precise to round up or down, but assuming our users are not Olympic athletes in training, a second here or there won't matter. Besides, Nike+ seems to always record these sub-second durations as ".000" anyway.)

``` {.javascript .numberLines}
run.duration = this.model.get("metricSummary").duration.split(".")[0];
```

The distance property can also use some adjustment. In addition to rounding it to a reasonable number of decimal places, we can convert from km to Miles for our <span class="smcp">US</span> users. A single statement takes care of both.

``` {.javascript .numberLines}
run.distance = Math.round(62. *
    this.model.get("metricSummary").distance)/100 +
    " Miles";
```

The calories property is one value that's fine as it is, so we'll just copy it into our temporary object.

``` {.javascript .numberLines}
run.calories = this.model.get("metricSummary").calories;
```

Finally, if you're an avid runner you might have noticed that there's an important value missing from the Nike+ attributes: the average pace for the run in minutes per mile. We have the data to calculate it, so let's go ahead and add that as well.

``` {.javascript .numberLines}
var secs = _(run.duration.split(":")).reduce(function(sum, num) {
    return sum*60+parseInt(num,10); }, 0);
var pace = moment.duration(1000*secs/parseFloat(run.distance));
run.pace = pace.minutes() + ":" + _(pace.seconds()).pad(2, "0");
```

Now we have a new object to pass to the template.

``` {.javascript .numberLines}
this.$el.html(this.template(run));
```

We'll also need to modify both templates to match the new markup. Here's the updated template for SummaryRows.

``` {.html .numberLines}
<td><%= date %></td>
<td><%= duration %></td>
<td><%= distance %></td>
<td><%= calories %></td>
<td><%= pace %></td>
```

And here's the Summary template with the additional column for pace.

``` {.html .numberLines}
<thead>
  <tr>
    <th>Date</th>
    <th>Duration</th>
    <th>Distance</th>
    <th>Calories</th>
    <th>Pace</th>
  </tr>
</thead>
<tbody></tbody>
```

Now we have a much improved summary view for our users.

| Date | Duration | Distance | Calories | Pace |
|-----|-----|-----|-----|-----|
| 04/09/2013 | 0:22:39 | 2.33 Miles |  240 | 9:43 |
| 04/07/2013 | 0:44:59 | 5.08 Miles |  569 | 8:51 |
| 04/06/2013 | 1:28:59 | 9.98 Miles | 1200 | 8:54 |
| 04/04/2013 | 0:58:44 | 5.98 Miles |  736 | 9:49 |
| 04/02/2013 | 0:22:37 | 2.26 Miles |  293 | 10:00 |
| 03/31/2013 | 0:34:04 | 3.98 Miles |  445 | 8:33 |
| 03/30/2013 | 1:29:31 | 9.98 Miles | 1203 | 8:58 |
| 03/28/2013 | 1:04:09 | 6.94 Miles |  852 | 9:14 |
| 03/26/2013 | 0:39:33 | 4.54 Miles |  514 | 8:42 |
| 03/24/2013 | 0:33:49 | 3.91 Miles |  455 | 8:38 |

