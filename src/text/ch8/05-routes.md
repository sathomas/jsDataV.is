## Putting it All Together

At this point in the chapter we have all the pieces for a simple data-driven web application. Now we'll take those pieces and assemble them into the app. At the end of this section we'll have a complete application. Users start the app by visiting a web page, and our JavaScript code takes it from there. The result is a _single page application,_ or <span class="smcp">SPA</span>. <span class="lgcp">SPA</span>s have become popular because JavaScript code can respond to user interaction immediately in the browser, which is much quicker than traditional web sites communicating with a server located halfway across the internet. Users are often pleased with the snappy and responsive result.

Even though our app is executing in a single web page, our users still expect certain behaviors from their web browsers. They expect to be able to bookmark a page, share it with friends, or navigate using the browser's forward and back buttons. Traditional web sites can rely on the browser to support all of those behaviors, but a single page application can't. As we'll see in the steps that follow, we have to write some additional code to give our users the behavior they expect.

### Step 1: Create a Backbone.js Router

So far we've looked at three Backbone.js components, Models, Collections, and Views, all of which may be helpful in any JavaScript application. The fourth component, the _Router,_ is especially helpful for single page applications. You won't be surprised to learn that we can use Yeoman to create the scaffolding for a Router.

``` {.bash .numberLines}
$ yo backbone:router app 
   create app/scripts/routes/app.js
   invoke   backbone-mocha:router
   create     test/routers/app.spec.js
```

Notice that we've named our router `app`. As you might expect from this name, we're using this router as the main controller for our application. That approach has pros and cons. Some developers feel that a router should be limited strictly to routing, while others view the router as the natural place to coordinate the overall application. For a simple example such as our's, there isn't really any harm in adding a bit of extra code to the router to control the app. In complex applications, however, it might be better to separate routing from application control. One of the nice things about Backbone.js is that it's happy to support either approach.

With the scaffolding in place, we can start adding our router code to the `app.js` file. The first property we'll define are the `routes`. This property is an object whose keys are <span class="smcp">URL</span> fragments and whose values are methods of the router. Here's our starting point.

``` {.javascript .numberLines}
Running.Routers.App = Backbone.Router.extend({
    routes: {
        '':         'summary',
        'runs/:id': 'details'
    },
});
```

The first route has an empty <span class="smcp">URL</span> fragment (`''`). When a user visits our page without specifying a path, the Router will call its `summary` method. If, for example, we were hosting our app using the `greatrunningapp.com` domain name, then users entering `http://greatrunningapp.com` in their browsers would trigger that route. Before we look at the second route, let's see what the `summary` method does.

The code is exactly what we've seen before. The `summary` method creates a new Runs Collection, fetches that collection, creates a Summary View of the collection, and renders that view onto the page. Users visiting the home page for our app will see a summary of their runs on the page.

``` {.javascript .numberLines}
summary: function() {
    this.runs = new Running.Collections.Runs([], {authorizationToken: 'authorize me'});
    this.runs.fetch();
    this.summaryView = new Running.Views.Summary({collection: this.runs});
    $('body').html(this.summaryView.render().el);
},
```

Now we can consider our second route. It has a <span class="smcp">URL</span> fragment of `runs/:id`. The `runs/` part is a standard <span class="smcp">URL</span> path while `:id` is how Backbone.js identifies an arbitrary variable. With this route we're telling Backbone.js to look for a <span class="smcp">URL</span> that starts out as `http://greatrunningapp.com/runs/` and to consider whatever follows as the value for the `id` parameter. We'll use that parameter in the router's `details` method. Here's how we'll start the development of that method.

``` {.javascript .numberLines}
details: function(id) {
    this.run = new Running.Models.Run();
    this.run.id = id;
    this.run.fetch();
    this.detailsView = new Running.Views.Details({model: this.run});
    $('body').html(this.detailsView.render().el);
    },
```

As you can see, the code is almost the same as the summary method, except we're only showing a single run instead of the whole collection. We create a new Run model, set its `id` to the value in the <span class="smcp">URL</span>, fetch the model from the server, create a Details view, and render that view on the page.

The router lets users go straight to an individual run by using the appropriate <span class="smcp">URL</span>. A <span class="smcp">URL</span> of `http://greatrunningapp.com/runs/2126456911`, for example, will fetch and display the details for the run that has an `activityId` equal `2126456911`. Notice that the router doesn't have to worry about what specific attribute defines the model's unique identifier. It uses the generic `id` property. Only the model itself needs to know the actual property name that the server uses.

With the router in place, our single page application can support multiple <span class="smcp">URL</span>s. One shows a summary of all runs while others show the details of a specific run. Because the <span class="smcp">URL</span>s are distinct, our users can treat them just like different web pages. They can bookmark them; they can email them, or they can share them on social networks. And whenever they or their friends return to a <span class="smcp">URL</span>, it will show the same contents as before. That's exactly how users expect the web to behave.

There is another behavior that users expect, though, that we haven't yet supported. Users expect to use their browser's back and forward buttons to navigate through their browsing histories. Fortunately, Backbone.js has a utility that takes care of that functionality. It's the _history_ feature, and we can enable it during the app Router's initialization.

``` {.javascript .numberLines}
Running.Routers.App = Backbone.Router.extend({
    initialize: function() {
        Backbone.history.start({pushState: true});
    },
```

For our simple app, that's all we have to do to handle browsing histories. Backbone.js takes care of everything else.

> Support for multiple <span class="smcp">URL</span>s will probably require some configuration of your web server. More specifically, you'll want the server to map all <span class="smcp">URL</span>s to the same `index.html` file. The details of this configuration depend on the web server technology. With open source apache servers, the `.htaccess` file can define the mapping.


### Step 2: Support Run Models Outside of Any Collection

Unfortunately, if we try to use the code above with our existing Run model, we'll run into some problems. First among them is the fact that our Run model relies on its parent collection. It finds the authorization token, for example, using `this.collection.settings.authorization_token`. When the browser goes directly to the <span class="smcp">URL</span> for a specific run, however, there won't be a collection. We can fix by providing the token to the Run model when we create it. We can also make its value an option passed to the router on creation. Here's the code that results.

``` {.javascript .numberLines}
Running.Routers.App = Backbone.Router.extend({
    routes: {
        '':         'summary',
        'runs/:id': 'details'
    },
    initialize: function(options) {
        this.options = options;
        Backbone.history.start({pushState: true});
    },
    summary: function() {
        this.runs = new Running.Collections.Runs([], {authorizationToken: this.options.token});
        this.runs.fetch();
        this.summaryView = new Running.Views.Summary({collection: this.runs});
        $('body').html(this.summaryView.render().el);
    },
    details: function(id) {
        this.run = new Running.Models.Run({}, {authorizationToken: this.options.token});
        this.run.id = id;
        this.run.fetch();
        this.detailsView = new Running.Views.Details({model: this.run});
        $('body').html(this.detailsView.render().el);
});
```

Now we need to modify the Run model to use this new parameter. We'll handle the token the same way we do in the Runs collection. We start by defining default values for all the settings. Unlike the collection, the only setting our model needs is the `authorization_token`. Next we make sure that we have an `options` object. If none was provided, we create an empty one. For the third step we check to see if the model is part of a collection. We can do that by looking at `this.collection`. If that property exists, then we grab any settings from the collection and override our defaults. The final step overrides the result with any settings passed to our constructor as options. When, as in the code above, our router provides an `authorization_token` value, that's the value our model will use. When the model is part of a collection, there is no specific token associated with the model. In that case we fall back to the collection's token.

``` {.javascript .numberLines}
Running.Models.Run = Backbone.Model.extend({
    initialize: function(attrs, options) {
        this.settings = {  authorization_token: '' };
        options = options || {};
        if (this.collection) {
            _(this.settings).extend(_(this.collection.settings)
                .pick(_(this.settings).keys()));
        }
        _(this.settings).extend(_(options)
            .pick(_(this.settings).keys()));
    },
```

Now that we have an authorization token, we can add it to the model's <span class="smcp">AJAX</span> requests. The code is again pretty much the same as our code in the Runs collection. We'll need a property that specifies the <span class="smcp">URL</span> for the <span class="smcp">REST</span> service, and we'll need to override the regular `sync` method to add the token to any requests.

``` {.javascript .numberLines}
urlRoot: 'https://api.nike.com/v1/me/sport/activities',

sync: function(method, model, options) {
    options = options || {};
    _(options).extend({
        data: { authorization_token: this.settings.authorization_token }
    });
    Backbone.sync(method, model, options);
},
```

This extra code takes care of the authorization, but there's still a problem with our model. In the previous section Run models only existed as part of a Runs collection, and the act of fetching that collection populated each of its models with summary attributes including, for example, `isGpsActivity`. The model could safely check that property whenever we tried to fetch the model details and, if appropriate, simultaneously initiate a request for the <span class="smcp">GPS</span> data. Now, however, we're creating a Run model on its own without the benefit of a collection. When we fetch the model, the only property we'll know is the unique identifier. We can't decide whether or not to request <span class="smcp">GPS</span> data, therefore until after the server responds to the fetch.

To separate the request for <span class="smcp">GPS</span> data from the general fetch we can move that request to its own method. The code is the same as before (except, of course, we get the authorization token from local settings).

``` {.javascript .numberLines}
fetchGps: function() {
    if (this.get('isGpsActivity') && !this.get('gps')) {
        var model = this;
        $.getJSON(
            this.url() + '/gps',
            { authorization_token: this.settings.authorization_token },
            function(data) { model.set('gps', data); }
        );
    }
}
```

To trigger this method, we can add one more statement to the model's initialization. We'll tell Backbone.js that whenever the model changes, call the `fetchGps` method. Backbone.js will detect just such a change when the `fetch` response arrives and populates the model, at which time our code can safely check `isGpsActivity` and make the additional request.

``` {.javascript .numberLines}
initialize: function(attrs, options) {
    this.on('change', this.fetchGps, this);
```

### Step 3: Let Users Change Views

Now that our app can correctly display two different views, it's time to let our users in on the fun. For this step, we'll give them an easy way to change back and forth between the views. Let's first consider the summary view. It would be nice if a user could click on any run that appears in the table and be instantly taken to the detailed view for that run.

Our first decision is where to put the code that listens for clicks. At first thought, it might seem like the SummaryRow view is a natural place for that code. That view is responsible for rendering the row, so it seems logical to let that view handle events related to the row. If we wanted to do that, Backbone.js makes it very simple. All we need is an extra property and an extra method in the view. They could look like the following.

``` {.javascript .numberLines}
Running.Views.SummaryRow = Backbone.View.extend({
    events: {
        'click': 'clicked'
    },
    clicked: function() {
        // Do something to show the Details view for this.model
    },
```

The `events` property is an object that lists the events of interest to our view. In this case there's only one, and it is the `click` event. The value, in this case `clicked` identifies the method that Backbone.js should call when the event occurs. We've skipped the details of that method for now.

There is nothing technically wrong with this approach, and if we were to continue the implementation it would probably work just fine. It is, however, very inefficient. Consider a user that has hundreds of runs stored on Nike+. Their summary table would have hundreds of rows, and each row would have its own function listening for `click` events. Those event handlers can use up a lot of memory and other resources in the browser and make our app sluggish. Fortunately there's a different approach that's far less stressful to the browser.

Instead of having potentially hundreds of event handlers each listening for clicks on a single row, we'd be better off with one event handler listening for clicks on all of the table rows. Since the Summary view is responsible for all of those rows, it's the natural place to add that handler. We can still take advantage of Backbone.js to make its implementation easy by adding an `events` object to our view. In this case we can do even better, though. We don't care about `click` events on the table header; only the rows in the table body matter. By adding a jQuery-style selector after the event name we can restrict our handler to elements that match that selector.

``` {.javascript .numberLines}
Running.Views.Summary = Backbone.View.extend({
    events: {
        'click tbody': 'clicked'
    },
````

The code above asks Backbone.js to watch for `click` events within the `<tbody>` element of our view. When an event occurs, Backbone.js will call the `clicked` method of our view.

Before we develop any code for that `clicked` method, we're going to need a way for it to figure out which specific run model the user has selected. The event handler will be able to tell which row the user clicked, but how will it know which model that row represents? To make the answer easy for the handler, we can embed the necessary information directly in the markup for the row. That requires a few small adjustments to the `renderRun` method we created earlier.

The revised method still creates a SummaryRow view for each model, renders that view, and appends the result to the table body. Now, though, we'll add one extra step just before the row is added to the page. We add a special attribute, `data-id`, to the row and set its value equal to the model's unique identifier. We use `data-id` because the <span class="smcp">HTML5</span> standard allows any attribute with a name that begins `data-`. Custom attributes in this form won't violate the standard and won't cause browser errors.

``` {.javascript .numberLines}
renderRun: function (run) {
    var row = new Running.Views.SummaryRow({ model: run });
    row.render();
    row.$el.attr('data-id', run.id);
    this.$('tbody').append(row.$el);
},
```

The resulting markup for a run with an identifier of `2126456911` would look like the following example.
 
``` {.html .numberLines}
<tr data-id="2126456911">
    <td>04/09/2013</td>
    <td>0:22:39</td>
    <td>2.33 Miles</td>
    <td>240</td>
    <td>9:43</td>
</tr>
```

Once we've made sure that the markup in the page has a reference back to the run models, we can take advantage of that markup in our `clicked` event handler. When Backbone.js calls the handler, it passes it an event object. From that object we can find the target of the event. In the case of a `click` event, the target is the <span class="smcp">HTML</span> element on which the user clicked.

``` {.javascript .numberLines}
clicked: function (ev) {
    var $target = $(ev.target)
```

From the markup shown above, it's clear that most of the table row is made up of table cells (`<td>` elements), and so a table cell will be the likely target of the click event. We can use the jQuery `parents` function to find the table row that is the parent of the click target. Once we've found that row, it's an easy matter to extract the `data-id` attribute value. To be on the safe side we'll also handle the case in which the user somehow manages to click on the table row itself rather than an individual table cell.

``` {.javascript .numberLines}
clicked: function (ev) {
    var $target = $(ev.target)
    var id = $target.attr('data-id') || $target.parents('[data-id]').attr('data-id');
```

After retrieving the attribute value our view knows which run the user selected; now it has to do something with the information. Though it might be tempting to have the Summary view directly render the Details view for the run, that action would not be appropriate. A Backbone.js view should only take responsibility for itself and any child views that it contains. That approach allows the view to be safely re-used in a variety of contexts. Our Summary view, for example, might well be used in a context in which the Details view wasn't even available. In that case trying to switch directly to the Details view would, at best, generate an error.

Because the Summary view cannot itself respond to the user clicking on a table row, it should instead follow the hierarchy of the application and, in effect, pass the information "up the chain of command." Backbone.js provides a convenient mechanism for this type of communication: custom events. Instead of responding directly to the user click, the Summary view triggers a custom event. Other parts can listen for this event and respond appropriately. If no other code is listening for the event, then nothing happens, but at least the Summary view can say that it's done its job.

Here's how we can generate a custom event in our view. We're calling the event `select` to indicate that the user has selected a specific run, and we're passing the identifier of that run as a parameter associated with the event. At this point the Summary view is complete.

``` {.javascript .numberLines}
clicked: function (ev) {
    var $target = $(ev.target)
    var id = $target.attr('data-id') || $target.parents('[data-id]').attr('data-id');
    this.trigger('select', id);
}
```

The component that should respond to this custom event is the same component that created the Summary view in the first place; that's our app router. We'll first need to listen for the event. We can do that right after we create it in the `summary` method.

``` {.javascript .numberLines}
Running.Routers.App = Backbone.Router.extend({
    summary: function() {
        this.runs = new Running.Collections.Runs([], {authorizationToken: this.options.token});
        this.runs.fetch();
        this.summaryView = new Running.Views.Summary({collection: this.runs});
        $('body').html(this.summaryView.render().el);
        this.summaryView.on('select', this.selected, this);
    },
```

When the user selects a specific run from the summary view, Backbone.js calls our router's `selected` method. That method will receive any event data as parameters. In our case the event data is the unique identifier, so that becomes the method's parameter.

``` {.javascript .numberLines}
Running.Routers.App = Backbone.Router.extend({
    selected: function(id) {
        this.navigate('runs/' + id, { trigger: true });
    }
```

As you can see, the event handler code is quite simple. It constructs a <span class="smcp">URL</span> that corresponds to the Details view (`'runs/' + id`) and passes that <span class="smcp">URL</span> to the router's own `navigate` method. That method updates the browser's navigation history. The second parameter (`{ trigger: true }`) tells Backbone.js to also act as if the user had actually navigated to the <span class="smcp">URL</span>. Because we've set up the `details` method to respond to <span class="smcp">URL</span>s of the form `runs/:id`, Backbone.js will call `details` and our router will show the details for the selected run.

When users are looking at a Detailed view, we'd also like to let them easily navigate to the Summary view. A button in details template will serve for this demonstration. As with the Summary view, we can add an event handler for the button and trigger a custom event when a user clicks it.

``` {.javascript .numberLines}
Running.Views.Details = Backbone.View.extend({
    events: {
        'click button': 'clicked'
    },
    clicked: function () {
        this.trigger('summarize');
    }
```

And, of course, we need to listen for that custom event in our router.

``` {.javascript .numberLines}
Running.Routers.App = Backbone.Router.extend({
    details: function(id) {
        // Set up the Details view
        // Code continues...
        this.detailsView.on('summarize', this.summarize, this);
    },
    summarize: function() {
        this.navigate('', { trigger: true });
    },
```

Once again we respond to the user by constructing an appropriate <span class="smcp">URL</span> and triggering a navigation to it.

You might be wondering why we have to explicitly trigger the navigation change. Shouldn't that be the default behavior? Although that may seem reasonable in most cases it wouldn't be appropriate. Our application is simple enough that triggering the route works fine. More complex applications, however, probably want to take different actions depending on whether the user performs an action within the app or navigates directly to a particular <span class="smcp">URL</span>. It's better to have different code handling each of those cases. In the first case the app would still want to update the browser's history, but it wouldn't want to trigger a full navigation action.

### Step 4: Fine-Tuning the Application

At this point our app is completely functional. Our users can view their summaries, bookmark and share details of specific runs, and navigate the app using the browser's back and forward buttons. Before we can call it complete, however, there's one last bit of housekeeping for us. The app's performance isn't optimal, and, even more critically, it _leaks_ memory, using small amounts of the browser's memory without ever releasing them.

The most obvious problem is in the router's `summary` method, reproduced below.

``` {.javascript .numberLines}
Running.Routers.App = Backbone.Router.extend({
    summary: function() {
        this.runs = new Running.Collections.Runs([], {authorizationToken: this.options.token});
        this.runs.fetch();
        this.summaryView = new Running.Views.Summary({collection: this.runs});
        $('body').html(this.summaryView.render().el);
        this.summaryView.on('select', this.selected, this);
    },
```

Every time this method executes it creates a new collection, fetches that collection, and renders a Summary view for the collection. Clearly we have to go through those steps the first time the method executes, but there is no need to repeat them later. Neither the collection nor its view will have changed if the user selects a specific run and then returns to the summary. Let's add a check to the method so that we only take those steps if the view doesn't already exist.

``` {.javascript .numberLines}
summary: function() {
    if (!this.summaryView) {
        this.runs = new Running.Collections.Runs([], {authorizationToken: this.options.token});
        this.runs.fetch();
        this.summaryView = new Running.Views.Summary({collection: this.runs});
        this.summaryView.render();
        this.summaryView.on('select', this.selected, this);
    }
    $('body').html(this.summaryView.el);
},
```

We can also add a check in the `details` method. When that method executes and a Summary view is present, we can "set aside" the summary view's markup using jQuery's `detach` function. That will keep the markup and its event handlers ready for a quick re-insertion onto the page should the user return to the summary.

``` {.javascript .numberLines}
details: function(id) {
    if (this.summaryView) {
        this.summaryView.$el.detach();
    }
    this.run = new Running.Models.Run({}, {authorizationToken: this.options.token});
    this.run.id = id;
    this.run.fetch();
    $('body').html(this.detailsView.render().el);
    this.detailsView.on('summarize', this.summarize, this);
},
```

Those changes make switching to and from the summary view more efficient. We can also make some similar changes for the details view. In the `details` method we don't have to fetch the run if it's already present in the collection. We can add a check and, if the data for the run is already available, we won't bother with the fetch.

``` {.javascript .numberLines}
details: function(id) {
    if (!this.runs || !(this.run = this.runs.get(id))) {
        this.run = new Running.Models.Run({}, {authorizationToken: this.options.token});
        this.run.id = id;
        this.run.fetch();
    }
    if (this.summaryView) {
        this.summaryView.$el.detach();
    }
    this.detailsView = new Running.Views.Details({model: this.run});
    $('body').html(this.detailsView.render().el);
    this.detailsView.on('summarize', this.summarize, this);
},
```

In the `summary` method we don't want to simply set aside the details view as we did for the summary view. That's because there may be hundreds of detail views hanging around if a user starts looking at all of runs available. Instead, we want to cleanly delete the details view. That lets the browser know that it can release any memory that the view is consuming. As you can see from the code below, we'll do that in three steps.

1. Remove the event handler we added to the details view to catch `summarize` events.
2. Call the view's `remove` method so it releases any memory it's holding internally.
3. Set `this.detailsView` to `null` to indicate that the view no longer exists.

``` {.javascript .numberLines}
summary: function() {
    if (this.detailsView) {
        this.detailsView.off('summarize');
        this.detailsView.remove();
        this.detailsView = null;
    }
    if (!this.summaryView) {
        this.runs = new Running.Collections.Runs([], {authorizationToken: this.options.token});
        this.runs.fetch();
        this.summaryView = new Running.Views.Summary({collection: this.runs});
        this.summaryView.render();
        this.summaryView.on('select', this.selected, this);
    }
    $('body').html(this.summaryView.el);
},
```

And with that change our application is complete. You can take a look at the complete result in the book's source code.