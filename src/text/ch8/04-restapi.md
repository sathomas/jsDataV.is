## Connecting with the Nike+ Service

Although our example application relies on the Nike+ service for its data, we haven't looked at the details of that service's interface. We have seen hints Nike+ doesn't quite conform to common REST API conventions that application libraries such as Backbone.js expect. That's true, but it isn't all that unusual. There really isn't a true _standard_ for REST APIs, and many other services take approaches similar to Nike+. Fortunately Backbone.js anticipates this variation. As we'll see in the following steps, extending Backbone.js to support REST API variations isn't all that difficult.

### Step 1: User Authorization

As you might expect, Nike+ doesn't allow anyone on the internet to retrieve details for any user's runs. Users expect at least some level of privacy for that information. Before our app can retrieve any running information, therefore, it will need the user's permission. We won't go into the details of that process here, but it's result will be an `authorization_token`. This object is an arbitrary string that our app will have to include with every Nike+ request. If the token is missing or invalid, Nike+ will deny our app access to the data.

Up until now we've left all of the details of the REST API to Backbone.js, and you might think it would be tricky to modify how Backbone.js constructs its AJAX calls. In fact,though, it's not. All we need to do is add a `sync` method to our Runs collection. When a `sync` method is present in a collection, Backbone.js calls it whenever it makes an AJAX request. (If there is no such method for a collection, Backbone.js calls its primary `Backbone.sync` method.) We'll define the new method directly in the collection.

``` {.javascript .numberLines}
Running.Collections.Runs = Backbone.Collection.extend({

    sync: function(method, collection, options) {
        // Handle the AJAX request
    }
```

As you can see, `sync` is passed a `method` (`GET`, `POST`, etc.), the collection in questions, and an object containing options for the request. To send the authorization token to Nike+, we can add it as a parameter using this `options` object.

``` {.javascript .numberLines}
sync: function(method, collection, options) {
    options = options || {};
    _(options).extend({
        data: { authorization_token: this.settings.authorization_token }
    });

    // Code continues...
}
```

The first line in the method makes sure that the `options` parameter exists. If the caller doesn't provide a value, we set it to an empty object (`{}`). The rest of the code adds a `data` property to the `options` object by extending that object. We're taking advantage of one of the Underscore.js utilities that we saw in the previous chapter.

Before we see how to supply the `this.settings.authorization_token`, let's finish up the `sync` method by actually making the AJAX request. Now that we've added the token, our request is a standard AJAX request so we can let Backbone.js take it from here. Here's the resulting `sync` method in full.

``` {.javascript .numberLines}
sync: function(method, collection, options) {
    options = options || {};
    _(options).extend({
        data: { authorization_token: this.settings.authorization_token }
    });
    Backbone.sync(method, collection, options);
}
```

Now we can turn our attention to the `settings` object. We're using that object to hold properties related to the collection as a whole. It's the collection's equivalent of a model's attributes. Backbone.js doesn't create this object for us automatically, but it's easy enough to do it ourselves. We'll do it in the collection's `initialize` method. That method accepts two parameters, an array of models for the collection and any collection options.

``` {.javascript .numberLines}
Running.Collections.Runs = Backbone.Collection.extend({

    initialize: function(models, options) {
        this.settings = { authorization_token: "" };
        options = options || {};
        _(this.settings).extend(_(options)
            .pick(_(this.settings).keys()));
    },
```

The first statement in the `initialize` method defines a `settings` object for the collection, and it establishes default values for that object. Since there isn't an appropriate default value for the authorization token, we'll use an empty string.

The next statement makes sure that the `options` object exists. If none is passed as a parameter, we'll at least have an empty object.

The final statement uses a few Underscore.js utilities. It extracts all the keys in the settings, finds any values in the `options` object with the same keys, and updates the `settings` object by extending it with those new key values.

When we first create the Runs collection, we can pass the authorization token as a parameter. We supply an empty array as the first parameter because we don't have any models for the collection. Those will come from Nike+.

``` {.javascript .numberLines}
var runs = new Running.Collections.Runs([], {authorization_token: "authorize me"});
```

With just a small bit of extra code we've added the authorization token to our AJAX requests to Nike+.

### Step 2: Accepting the Nike+ Response

When our collection queries Nike+ for a list of user activities, Backbone.js is prepared for a response in a particular format. More specifically, Backbone.js expects the response to be a simple array of models.

``` {.javascript .numberLines}
[
  { "activityId": "2126456911", /* Data continues... */ },
  { "activityId": "2125290225", /* Data continues... */ },
  { "activityId": "2124784253", /* Data continues... */ },
  // Data set continues...
]
```

In fact, however, Nike+ returns its response as an object. The array of activities is one property of the object.

``` {.javascript .numberLines}
{
  "data": [
    { "activityId": "2126456911", /* Data continues... */ },
    { "activityId": "2125290225", /* Data continues... */ },
    { "activityId": "2124784253", /* Data continues... */ },
    // Data set continues...
  ],
  // Response continues...
}
```

To help Backbone.js cope with this response we add a `parse` method to our collection. The job of that function is to take the response that the server provides and return the response that Backbone.js expects. In our case that's very easy to do. We just return the `data` property of the response.

``` {.javascript .numberLines}
Running.Collections.Runs = Backbone.Collection.extend({

    parse: function(response) {
        return response.data;
    },
```



### Step 3: Paging the Collection

The next aspect of the Nike+ API we'll tackle is its paging. When we request the activities for a user, the service doesn't normally return _all_ of them. Users may have thousands of activities stored in Nike+, and returning all of them at once might overwhelm the app. It can certainly add a noticeable delay as the app would have to wait for the entire response before it could process it. To avoid this problem, Nike+ divides user activities into pages, and it responds with one page of activities at a time. We'll have to adjust our app for that behavior, but we'll gain the benefit of a more responsive user experience when we do.

The first adjustment we'll make is in our request. We can add parameters to that request to indicate how many activities we're prepared to accept in the response. The two parameters are `offset` and `count`. The `offset` tells Nike+ which activity we want to be first in the response, while `count` indicates how many activities Nike+ should return. If we wanted the first 20 activities, for example, we can set `offset` to `1` and `count` to `20`. Then, to get the next 20 activities, we'd set `offset` to `21` (and keep `count` at `20`).

We add these parameters to our request the same way we added the authorization token, in the `sync` method.

``` {.javascript .numberLines}
sync: function(method, collection, options) {
    options = options || {};
    _(options).extend({
        data: {
            authorization_token: this.settings.authorization_token,
            count: this.settings.count,
            offset: this.settings.offset
        }
    });
    Backbone.sync(method, collection, options);
}
```

We will also have to provide default values for those settings during initialization.

``` {.javascript .numberLines}
initialize: function(models, options) {
    this.settings = { 
        authorization_token: "",
        count: 25,
        offset: 1
    };
```

Those values will get the first 25 activities, but that's only a start. Our users will probably want to see all of their runs, not just the first 25. To get the additional activities we'll have to make more requests to the server. Once we get the first 25 activities we can request the next 25. And once those arrive we can ask for 25 more. We'll keep at this until we either reach some reasonable limit or the server runs out of activities.

First we define a reasonable limit as another settings value. In the code below we're using `10000` as that limit.

``` {.javascript .numberLines}
initialize: function(models, options) {
    this.settings = { 
        authorization_token: "",
        count: 25,
        offset: 1,
        max: 10000
    };
```

Next we need to modify the `fetch` method for our collection since the standard Backbone.js `fetch` can't handle paging. We're going to do three things in our implementation of the method.

1. Save a copy of whatever options Backbone.js is using for the request.
2. Extend those options by adding a callback function when the request succeeds.
3. Pass control to the normal Backbone.js `fetch` method for collections.

Each of those steps is a line in the implementation below. The last one might seem a little tricky, but it makes sense if you take it one step at a time. The expression `Backbone.Collection.prototype.fetch` refers to the normal `fetch` method of a Backbone.js collection. We execute this method using `.call()` so that we can set the context for the method to be our collection. That's the first `this` parameter of `call`. The second parameter holds the options for `fetch`, which are just the extended options we created in step 2.

``` {.javascript .numberLines}
Running.Collections.Runs = Backbone.Collection.extend({

    fetch: function(options) {
        this.fetchoptions = options = options || {};
        _(this.fetchoptions).extend({ success: this.fetchMore });
        return Backbone.Collection.prototype.fetch.call(this, this.fetchoptions);
    },
```

By adding a `success` callback to the AJAX request, we're asking to be notified when the request completes. In fact, we've said that we want the `this.fetchMore` function to be called. It's time to write that function; it too is a method of the Runs collection. This function checks to see if there are more activities left. If so, it executes another call to Backbone.js's regular collection `fetch` just as above.

``` {.javascript .numberLines}
fetchMore: function() {
    if (this.settings.offset < this.settings.max) {
        Backbone.Collection.prototype.fetch.call(this, this.fetchoptions);
    }
}
```

Since `fetchMore` is looking at the settings to decide when to stop, we'll need to update those values. Because we already have a `parse` method, and because Backbone calls this method with each response, that's a convenient place for the update. Let's add a bit of code before the return statement. If the number of activities that the server returns is less than the number we asked for, then we've exhausted the list of activities. We'll set the `offset` to the `max` so `fetchMore` knows to stop. Otherwise, we increment `offset` by the number of activities.

``` {.javascript .numberLines}
parse: function(response) {
    if (response.data.length < this.settings.count) {
        this.settings.offset = this.settings.max;
    } else {
        this.settings.offset += this.settings.count;
    }
    return response.data;
}
```

The code we've written so far is almost complete, but it has a problem. When Backbone.js fetches a collection, it assumes that it's fetching the whole collection. By default, therefore, each fetched response replaces the models already in the collection with those in the response. That behavior is fine the first time we call `fetch`, but it's definitely not okay once we're fetching more activities. Instead, we want Backbone.js to add to the collection instead of replacing it. Fortunately, there's a simple option that tells Backbone.js to do what we want. That's the `remove` option.

In our `fetch` method we set that option to `true` so Backbone.js will start a new collection.

``` {.javascript .numberLines}
fetch: function(options) {
    this.fetchoptions = options = options || {};
    _(this.fetchoptions).extend({ 
        success: this.fetchMore,
        remove: true
     });
    return Backbone.Collection.prototype.fetch.call(this, this.fetchoptions);
}
```

Now, in the `fetchMore` method we can reset this option to `false`, and Backbone.js will add to instead of replace models in the collection.

``` {.javascript .numberLines}
fetchMore: function() {
    this.fetchoptions.remove = false;
    if (this.settings.offset < this.settings.max) {
        Backbone.Collection.prototype.fetch.call(this, this.fetchoptions);
    }
}
```

There is still a small problem with the `fetchMore` method. That code references properties of the collection (`this.fetchoptions` and `this.settings`) but the method will be called asynchronously when the AJAX request completes. When that occurs, the collection won't be in context, so `this` won't be set to the collection. To fix that, we can bind `fetchMore` to the collection during initialization. Once again an Underscore.js utility function comes in handy.

``` {.javascript .numberLines}
initialize: function(models, options) {
    _.bindAll(this, "fetchMore");
```

For the final part of this step we can make our collection a little more friendly to code that uses it. In order to keep fetching additional pages, we've set the `success` callback for the `fetch` options. What happens if the code that uses our collection had its own callback? Unfortunately, we've erased that callback to substitute our own. It would be better to simply set aside an existing callback function and then restore it once we've finished fetching the entire collection. We'll do that first in our `fetch` method. Here's the full code for the method.

``` {.javascript .numberLines}
fetch: function(options) {
    this.fetchoptions = options = options || {};
    this.fetchsuccess = options.success;
    _(this.fetchoptions).extend({
        success: this.fetchMore,
        remove: true
        });
    return Backbone.Collection.prototype.fetch.call(this, this.fetchoptions);
}
```

Now we can execute that callback in `fetchMore` when we've exhausted the server's list.

``` {.javascript .numberLines}
fetchMore: function() {
    this.fetchoptions.remove = false;
    if (this.settings.offset < this.settings.max) {
        Backbone.Collection.prototype.fetch.call(this, this.fetchoptions);
    } else if (this.fetchsuccess) {
        this.fetchsuccess();
    }
}
```

### Step 4: Dynamically Updating the View

By fetching the collection of runs in pages we've made our application much more responsive. We can start displaying summary data for the first 25 runs even while we're waiting to retrieve the rest of the user's runs from the server. To do that effectively, though, we need to make a small change to our Summary view. As it stands now, our view is listening for any changes to the collection. When a change occurs, it renders the view from scratch.

``` {.javascript .numberLines}
initialize: function () {
    this.listenTo(this.collection, 'change', this.render);
    return this;
}
```

Every time we fetch a new page of runs, the collection will change and our code will re-render the entire view. That's almost certainly going to be annoying to our users, as each fetched page will cause the browser to temporarily blank the page and then refill it. What we would really like to do instead is only render views for the newly added models, leaving existing model views alone. To do that, we can listen for an `'add'` event instead of a `'change'` event. And when this event triggers, we can just render the view for that model. We've already implemented the code to create and render a view for a single Run model; it's the `renderRun` method.  Our Summary view, therefore, can be modified as below.

``` {.javascript .numberLines}
initialize: function () {
    this.listenTo(this.collection, 'add', this.renderRun);
    return this;
}
```

Now as our collection fetches new Run models from the server, they'll be added to the collection, triggering an `'add'` event, which our view captures. The view then renders each Run on the page.

### Step 5: Filtering the Collection

Although our app is only interested in running, the Nike+ service supports a variety of athletic activities. When our collection fetches from the service, the response will include those other activities as well. To avoid including them in our app, we can filter them from the response.

We could filter the response manually, checking every activity and removing those that weren't runs. That's a bit of work, however, and Backbone.js gives us an easier approach. To take advantage of Backbone.js, we'll first add a `validate` method to our Run model. This method takes as parameters the attributes of a potential model as well as any options used when creating or modifying it. In our case we only care about the attributes. We'll check to make sure the `activityType` equals `"RUN"`.

``` {.javascript .numberLines}
Running.Models.Run = Backbone.Model.extend({
    validate: function(attributes, options) {
        if (attributes.activityType.toUpperCase() !== "RUN") {
            return "Not a run";
        }
    },
```

You can see from the code above how `validate` functions should behave. If there is an error in the model, then `validate` returns a value. The specifics of the value don't matter as long as JavaScript considers it true. If there is no error, then `validate` doesn't need to return anything at all.

Now that our model has a `validate` method, we need to make sure Backbone.js calls it. Backbone.js automatically checks with `validate` whenever a model is created or modified by the code, but it doesn't normally validate responses from the server. In our case, however, we do want to validate the server responses. That requires that we set the `validate` property in the `fetch` options for our Runs collection. Here's the full `fetch` method with this change included.

``` {.javascript .numberLines}
Running.Collections.Runs = Backbone.Collection.extend({
    fetch: function(options) {
        this.fetchoptions = options = options || {};
        this.fetchsuccess = options.success;
        _(this.fetchoptions).extend({
            success: this.fetchMore,
            remove: true,
            validate: true
          });
        return Backbone.Collection.prototype.fetch.call(this, this.fetchoptions);
    },
```

Now when Backbone.js receives server responses, it passes all of the models in those responses through the model's `validate` method. Any model that fails validation is removed from the collection, and our app never has to bother with activities that aren't runs.

### Step 6: Parsing the Response

As long as we're adding code to the Run model, there's another change that will make Backbone.js happy. Backbone.js requires models to have an attribute that makes each object unique. It can use this attribute to distinguish one Run from any other. By default Backbone.js expects models to have an `id` attribute for this purpose, as that's a common convention. Nike+, however, doesn't have an `id` attribute for its runs. Instead, the service uses the `activityId` attribute. We can tell Backbone.js about this with an extra property in the model.

``` {.javascript .numberLines}
Running.Models.Run = Backbone.Model.extend({
    idAttribute: 'activityId',
```

This property lets Backbone.js know that for our Runs, the `activityId` property is the unique identifier.

### Step 7: Retrieving Details

The last change that Nike+ requires of our Backbone.js app lets us retrieve all the details for a run. So far we've been relying on the collection's fetch method to get running data. That method retrieves a list of runs from the server. When Nike+ returns a list of activities, however, it doesn't include the full details of each activity. It does return summary information, but it omits the detailed metrics arrays and any GPS data. Getting that information requires additional requests.

We'll first request the detailed metrics on which our Charts view bases its graphs. When the Runs collection fetches its list of runs from the server, each Run model will initially have an empty `metrics` array. To get the details for this array, we must make another request to the server. The request takes the same form as the request for the list, but it adds the activity identifier to the URL. More specifically, if the URL to get a list of runs is `https://api.nike.com/v1/me/sport/activities`, then the URL to get the details for a specific run, including its metrics, is `https://api.nike.com/v1/me/sport/activities/2126456911`. The number `2126456911` at the end of that URL is the run's `activityId`.

Because of the steps we've taken earlier in this section, Backbone.js makes it easy to get these details. All we have to do is `fetch` the model.

``` {.javascript .numberLines}
run.fetch();
```

Backbone.js knows the root of the URL because we set that in the Runs collection (and our model is a member of that collection). Backbone.js also knows that the unique identifier for each run is the `activityId` because we set that property in the previous step. And, fortunately for us, Backbone.js is smart enough to combine those bits of information and make the request.

We will have to help Backbone.js in one respect, though. The Nike+ requires an authorization token for all requests, and so far we've only added code for that token to the collection. We have to add the same code to the model. The code below is almost identical to the code from step 1 in this section. We first make sure that the `options` object exists, then we extend it by adding the authorization token. Finally, we defer to the regular Backbone.js `sync` method. As you can see, we're getting the value for the token directly from the collection. When a model is part of a collection, Backbone.js sets the `collection` property of the model to reference that collection. We use that property to get the collection's settings, specifically the authorization token.

``` {.javascript .numberLines}
Running.Models.Run = Backbone.Model.extend({
    sync: function(method, model, options) {
        options = options || {};
        _(options).extend({
            data: { authorization_token: this.collection.settings.authorization_token }
        });
        Backbone.sync(method, model, options);
    },
```

Now we have to decide when and where to call a model's `fetch` method. We don't actually need the metrics details for the summary view on the main page of our app; we only need the information if we're creating a Details view. That suggests, therefore, that we should only bother getting the data when we create a Details view. We can conveniently do that in the view's `initialize` method.

``` {.javascript .numberLines}
Running.Views.Details = Backbone.View.extend({
    initialize: function () {
        if (!this.model.get("metrics") || this.model.get("metrics").length === 0) {
            this.model.fetch();
        }            
    },
```

You might think that the asynchronous nature of the request could cause problems for our view. After all, aren't we trying to draw the charts when we render the newly created view? And might that happen before the server has responded, in which case there won't be any data for the charts? The answer to both questions is "Yes." In fact, it's almost guaranteed that our view will be trying to draw its charts before the data is available. Nonetheless, because of the way we've structured our views, there is no problem.

The magic is a single statement in the `initialize` method of our Charts view.

``` {.javascript .numberLines}
Running.Views.Charts = Backbone.View.extend({
    initialize: function () {
        this.listenTo(this.model, 'change:metrics change:gps', this.render);
        // Code continues...
```

That statement tells Backbone.js that our view wants to know whenever the `metrics` (or `gps`) property of the associated model changes. When such a change takes place, Backbone.js calls the view's `render` method and it will try (again) to draw the charts. Backbone.js can tell that the server's response to the model's `fetch` updates the `metrics` property, so it triggers the view's `render` method which successfully draw the charts.

There's quite a lot going on in this process, so it may help to look at it one step at a time.

1. The application calls the `fetch` method of a Runs collection.
2. Backbone.js sends a request to the server for a list of activities.
3. The server's response includes summary information for each activity, which Backbone.js uses to create the initial Run models.
4. The application creates a Details view for a specific Run model.
5. The `initialize` method of this view calls the `fetch` method of the particular model.
6. Backbone.js sends a request to the server for that activity's details.
7. Meanwhile, the application renders the Details view it just created.
8. The Details view creates a Charts view and renders that view.
9. Because there is no data for any charts, the Charts view doesn't actually add anything to the page, but it is waiting to hear of any relevant changes to the model.
10. Eventually the server responds to the request in step 6 with details for the activity.
11. Backbone.js updates the model with the new details and notices that, as a result, the `metrics` property has changed.
12. Backbone.js triggers the change event for which the Charts view has been listening.
13. The Charts view receives the event trigger and again renders itself.
14. Because chart data is now available, the `render` method is able to create the charts and add them to the page.

Whew! It's a good thing that Backbone.js takes care of all that complexity.

At this point we've managed to retrieve the detailed metrics for a run, but we haven't yet added any GPS data. Nike+ requires an additional request for that data, so we'll use a similar process. In this case, though, we can't rely on Backbone.js because the URL for the GPS request is unique to Nike+. That URL is formed by taking the individual activity's URL and appending `/gps`. A complete example would be `https://api.nike.com/v1/me/sport/activities/2126456911/gps`.

To make the additional request we can add some code to the regular `fetch` method. We'll request the GPS data at the same time Backbone.js asks for the metrics details. The basic approach, which the code fragment below illustrates, is simple. We'll first see if the activity even has any GPS data. We can do that by checking the `isGpsActivity` property which the server provides on activity summaries. If it does, then we can request it. In either case we also want to execute the normal `fetch` process for the model. We do that by getting a reference to the standard `fetch` method for the model (`Backbone.Model.prototype.fetch`) and then calling that method. We pass is the same `options` passed to us.

``` {.javascript .numberLines}
Running.Models.Run = Backbone.Model.extend({
    fetch: function(options) {
        if (this.get("isGpsActivity")) {
            // request GPS details from the server
        }
        return Backbone.Model.prototype.fetch.call(this, options);
    },
```

To make the request to Nike+ we can use jQuery's AJAX function. Since we're asking for Javascipt objects (JSON data), the `$.getJSON` function is the most appropriate. First we set aside a reference to the run by assigning `this` to the local variable `model`. We'll need that variable because `this` won't reference the model when jQuery executes our callback. Then we call `$.getJSON` with three parameters. First is the URL for the request. We get that from Backbone.js by calling the `url` method for the model and appending the trailing `/gps`. The second parameter are data values to be included with the request. As always we need to include an authorization token. Just as we did aboe, we can get that token's value from the collection. The final parameter is a callback function that JQuery executes when it receives the server's response. In our case the function simply sets the `gps` property of the model to the response data.


``` {.javascript .numberLines}
if (this.get("isGpsActivity")) {
    var model = this;
    $.getJSON(
        this.url() + "/gps",
        { authorization_token: this.collection.settings.authorization_token },
        function(data) { model.set("gps", data); }
    );
}
```

Not surprisingly, the process of retrieving GPS data works the same way as retrieving the detailed metrics. Initially our Map view won't have the data it needs to create a map for the run. Because it's listening to changes to the `gps` property of the model, however, it will be notified when that data is available. At that point it can complete the `render` function and the user will be able to view a nice map of the run.

