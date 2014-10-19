
## Views for Visualizations

Now that we've seen how to use Backbone.js views to separate data from its presentation, we can consider how to use the same approach for data visualizations. When the presentation is simple <span class="smcp">HTML</span> markup—as in the previous section's table—it's easy to use templates to view a model. Templates, however, aren't sophisticated enough to handle data visualizations. For those we'll need to modify our approach.

The data from the Nike+ service offers lots of opportunity for visualizations. Each run, for example, may include a record of the user's heart rate, instantaneous pace, and cumulative distance, recorded every 10 seconds. Runs may also include the user's <span class="smcp">GPS</span> coordinates captured every second. That type of data suggests both charts and maps, and in this section we'll add both to our application.

### Step 1: Define the Additional Views

As we did in the previous section, we'll rely on Yeoman to create the scaffolding for our additional views. One view, we'll call it _Details,_ will act as the overall view for the details of an individual run. Within that view we'll create three additional views each showing a different aspect of the run. We can think of these views in a hierarchy.

* Details: a detailed view of a single run
 * Properties: the full set of properties associated with the run
 * Chart: charts showing performance during the run
 * Map: a map of the run's route
 
To start the development of these views, we return to the command line and execute four Yeoman commands.

``` {.bash}
$ yo backbone:view details
$ yo backbone:view properties
$ yo backbone:view charts
$ yo backbone:view map
```

### Step 2: Implement the Details View

The Details view is really nothing more than a container for its three children, so its implementation is about as easy as it gets. We create a new view for each of the children, render the view, and add the resulting markup to the Details. Here is the complete code for this view.

``` {.javascript .numberLines}
Running.Views.Details = Backbone.View.extend({
    render: function () {
        this.$el.html("");
        this.$el.append(
            new Running.Views.Properties({model: this.model}).render().el
        );
        this.$el.append(
            new Running.Views.Charts({model: this.model}).render().el
        );
        this.$el.append(
            new Running.Views.Map({model: this.model}).render().el
        );
        return this;
    }
});
```

The structure looks a little different from the previous views we've created because the Details view itself doesn't actually depend on any of the properties of the Run model. (The child views, of course, depend greatly on those properties.) The Details view, therefore, doesn't have to listen for changes to the model, so there's nothing to do during initialization.

The `render` method itself first clears out any existing content from its element. This line makes it safe to call the `render` method multiple times. The next three statements create each of the child views. Notice that all of the child views have the same model, which is the model for the Details view as well. This capability is the power of the Model/View architecture; one data object—in our case a run—can be presented in many different ways. While the `render` method creates each of these child views, it also calls their `render` methods, and it appends the resulting content (their `el` properties) into its own `el`.

### Step 3: Implement the Properties View

For the Properties view, we want to show all of the properties that Nike+ has associated with the run. Those properties are determined by the data returned by the Nike+ service; here's an example.

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
    "tags": [
        { "tagType": "WEATHER", "tagValue": "SUNNY"     },
        { "tagType": "NOTE"                             },
        { "tagType": "TERRAIN", "tagValue": "TRAIL"     },
        { "tagType": "SHOES",   "tagValue": "Neo Trail" },
        { "tagType": "EMOTION", "tagValue": "GREAT"     }
    ],
    "metrics": [
        { "intervalMetric": 10, "intervalUnit": "SEC", 
          "metricType": "SPEED", "values": [/* Data continues... */] },
        { "intervalMetric": 10, "intervalUnit": "SEC",
          "metricType": "HEARTRATE", "values": [/* Data continues... */] },
        { "intervalMetric": 10, "intervalUnit": "SEC",
          "metricType": "DISTANCE", "values": [/* Data continues... */] },
    ],
    "gps": {
        "elevationLoss": 114.400024,
        "elevationGain": 109.00003,
        "elevationMax": 296.2,
        "elevationMin": 257,
        "intervalMetric": 10,
        "intervalUnit": "SEC",
        "waypoints": [/* Data continues... */]
    }
}
```

That data can certainly benefit from a bit of cleanup to make it more user friendly. To do that we'll take advantage of the Underscore.string library we added to the project before. We can make sure that library is available by "mixing it into" the main Underscore.js library. We'll do that right at the start of the JavaScript file for the Properties view.

``` {.javascript .numberLines}
/*global Running, Backbone, JST, _*/

_.mixin(_.str.exports());

Running.Views = Running.Views || {};

// Code continues...
```

Notice that we've also added the global variable for Underscore.js (`_`) to the initial comment in the file.

The most straightforward way to present this information in <span class="smcp">HTML</span> is with a description list (`<dl>`). Each property can be an individual item in the list, with a description term (`<dt>`) holding the property name and the description data (`<dd>`) its value. To implement this, we set the `tagName` property of the view to be `'dl'`, and we create a generic list item template. Here's the start of our Properties view code.

``` {.javascript .numberLines}
Running.Views.Properties = Backbone.View.extend({
    template: JST['app/scripts/templates/properties.ejs'],
    tagName: 'dl',
    initialize: function () {
        this.listenTo(this.model, 'change', this.render);
        return this;
    },
    render: function () {
        // more code goes here
        return this;
    }
});
```

And here's the simple template that the view will use.

``` {.html .numberLines}
<dt><%= key %></dt>
<dd><%= value %></dd>
```

A quick glance at the Nike+ data shows that it contains nested objects. The `metricSummary` property of the main object is itself an object. That suggests that recursion might be a good strategy for processing the model. To implement recursion we'll need a function (so it can call itself), so let's add an `obj2Html` method to our view. That function should iterate through all the properties in the input object building the <span class="smcp">HTML</span> markup as it does. The Underscore.js `reduce` function supports exactly that operation, so we'll use that as the core of our method.

``` {.javascript .numberLines}
obj2Html: function(obj) {
    return (
        _(obj).reduce(function(html, value, key) {

            // create the markup for the current 
            // key/value pair and add it to the html variable

            return html;

        }, "", this)
    );
}
```

As we process each property, the first thing we can do is improve the key name. For example, we'd like to replace "startTime" with "Start Time". That's where Underscore.string comes in. Its `humanize` function turns camelCase into separate words, and its `titleize` function ensures each word begins with an uppercase letter. We'll use chaining to perform both operations in one statement.

``` {.javascript .numberLines}
key = _.chain(key).humanize().titleize().value();
```

Now we can consider the value. If it is an array, we'll replace it with a string that shows the array length.

``` {.javascript .numberLines}
if (_(value).isArray()) {
    value = "[" + value.length + " items]";
}
```

Next we check to see if the value is an object. If it is, then we'll call the `obj2Html` method recursively.

``` {.javascript .numberLines}
if (_(value).isObject()) {
    html += this.obj2Html(value);
```

For other types, we convert the value to a string, format it a bit with Underscore.string, and make use of our template.

``` {.javascript .numberLines}
} else {
    value = _(value.toString().toLowerCase()).titleize();
    html += this.template({ key: key, value: value });
}
```

There are a few other minor improvements we can make to the presentation which you can find in the book's source code. The last piece of the View is implementing the `render` method. In that method, we use `toJSON` to get an object corresponding the Run model, and then we start the `obj2Html` recursion with that object.

``` {.javascript .numberLines}
render: function () {
    this.$el.html(this.obj2Html(this.model.toJSON()));
    return this;
}
```

The result is a complete picture of the properties of the run.

<dl class="dl-horizontal"><dt>Activity</dt>
<dd>2126456911</dd>
<dt>Activity Type</dt>
<dd>Run</dd>
<dt>Start Time</dt>
<dd>2013-04-09t10:54:33z</dd>
<dt>Activity Time Zone</dt>
<dd>GMT-04:00</dd>
<dt>Status</dt>
<dd>Complete</dd>
<dt>Device Type</dt>
<dd>iPod</dd>
<dt>Calories</dt>
<dd>240</dd>
<dt>Fuel</dt>
<dd>790</dd>
<dt>Distance</dt>
<dd>3.7524</dd>
<dt>Steps</dt>
<dd>0</dd>
<dt>Duration</dt>
<dd>0:22:39.000</dd>
<dt>Weather</dt>
<dd>Sunny</dd>
<dt>Terrain</dt>
<dd>Trail</dd>
<dt>Shoes</dt>
<dd>Neo Trail</dd>
<dt>Emotion</dt>
<dd>Great</dd>
<dt>Speed Data</dt>
<dd>[136 Items]</dd>
<dt>Heartrate Data</dt>
<dd>[136 Items]</dd>
<dt>Distance Data</dt>
<dd>[136 Items]</dd>
<dt>Elevation Loss</dt>
<dd>114.400024</dd>
<dt>Elevation Gain</dt>
<dd>109.00003</dd>
<dt>Elevation Max</dt>
<dd>296.2</dd>
<dt>Elevation Min</dt>
<dd>257</dd>
<dt>Waypoints</dt>
<dd>[266 Items]</dd>
</dl>

### Step 4: Implement the Map View

To show users maps of their runs we rely on the Leaflet library from chapter 6. Using the library will require some small modifications to the normal Backbone.js view implementation, but, as we'll see, those same modifications will come in handy for other views as well. Leaflet builds its maps in a containing element in the page (typically a `<div>`), and that containing element must have an `id` attribute so that Leaflet can find it. Backbone.js will take care of adding that `id` if we include an `id` property in the view. That's easy enough.

``` {.javascript .numberLines}
    Running.Views.Map = Backbone.View.extend({
        id: 'map',
```

With `<div id='map'></div>` available in the page's markup, we can create a Leaflet map with the statement

``` {.javascript .numberLines}
var map = L.map(this.id);
```

We might be tempted to do that directly in the view's `render` method, but there's a problem with that approach. Adding (and removing) elements in a web page requires a lot of computation by the browser. When JavaScript code does that frequently, the performance of the page can suffer significantly. To reduce this problem, Backbone.js tries to minimize the number of times it adds (or removes) elements, and one way to do that is to add many elements at once, rather than adding each element independently. It employs that approach when it implements a view's `render` method. Before adding any elements to the page, it lets the view finish constructing its entire markup. Only then does it add that markup to the page.

Perhaps you've detected the problem. When `render` is called the first time, there won't (yet) be a `<div id='map'></div>` anywhere in the page. If we call Leaflet, it won't be able to find the container for its map, and it will generate an error. What we need to do is defer the part of `render` that draws the map until after Backbone.js has added the map container to the page.

Fortunately, Underscore.js has a utility function to do just that. It even has the name `defer`. Instead of drawing the map directly in the `render` method, we'll create a separate method. Then, in the `render` method, we'll defer execution of that new method. Here's what the code to do that looks like.

``` {.javascript .numberLines}
render: function () {
    _.defer(_(function(){ this.drawMap(); }).bind(this));
},
drawMap: function () {
    var map = L.map(this.id);
    // Code continues...
}
```

As you can see, we're actually using a couple of Underscore.js function in our `render` method. In addition to `defer`, we also take advantage of `bind`. That latter function ensures that the `this` value when `drawMap` is eventually called is the same as the `this` value within the view.

There's one change we can make to further improve this implementation. Although there won't be a `<div id='map'></div>` in the page when `render` is first called, that element will exist in subsequent calls to `render`. In those cases we don't need to defer the execution of `drawMap`. That leads to the following code for our `render` method.

``` {.javascript .numberLines}
render: function () {
    if (document.getElementById(this.id)) {
        this.drawMap();
    } else {
        _.defer(_(function(){ this.drawMap(); }).bind(this));
    }
    return this;
},
```

As long as we're making optimizations, let's also change the `initialize` method slightly. The default method that Yeoman creates is

``` {.javascript .numberLines}
initialize: function () {
    this.listenTo(this.model, 'change', this.render);
},
```

For the Map view, however, we don't really care if any property of the Run model changes. The only property the view needs is the `gps` property. We can, therefore, tell Backbone.js to only bother us if that specific property changes.

``` {.javascript .numberLines}
initialize: function () {
    this.listenTo(this.model, 'change:gps', this.render);
    return this;
},
```

> If you're wondering "Why would the `gps` property of the Run model ever change?" be patient. We'll get to that when we cover the quirks of the Nike+ <span class="smcp">REST</span> <span class="smcp">API</span>.

With the preliminaries out of the way, we can implement the `drawMap` function. It turns out to be a very easy implementation. The steps are

1. Make sure the model has a `gps` property and there are waypoints associated with it.
2. If an old map exists, remove it.
3. Extract the <span class="smcp">GPS</span> coordinates from the waypoints array.
4. Create a path using those coordinates.
5. Create a map that contains that path and draw the path on the map.
6. Add the map tiles.

The resulting code is a straightforward implementation of those steps.

``` {.javascript .numberLines}
drawMap: function () {
    if (this.model.get("gps") && this.model.get("gps").waypoints) {
        if (this.map) {
            this.map.remove();
        }
        var points = _(this.model.get("gps").waypoints).map(function(pt) {
            return [pt.latitude, pt.longitude];
        });
        var path = new L.Polyline(points, {color: '#1788cc'});
        this.map = L.map(this.id).fitBounds(path.getBounds())
            .addLayer(path);
        var tiles = L.tileLayer(
            'http://server.arcgisonline.com/ArcGIS/rest/services/Canvas/'+
            'World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}',
            {
                attribution: 'Tiles &copy; Esri &mdash; '+
                             'Esri, DeLorme, NAVTEQ',
                maxZoom: 16
            }
        );
        this.map.addLayer(tiles);
    }
}
```

As you can see from the code, we're storing a reference to the Leaflet map object as a property of the view. From within the view, we can access that object using `this.map`.

The result is a nice map of the run's route in figure NEXTFIGURENUMBER.

<style>
.leaflet-container a {
    text-shadow: none;
    background-image: none;
    color: rgb(51, 51, 51);
}
</style>
<figure style="margin-left:0;margin-right:0"><div id="map" style="width:640px;height:450px;"></div><figcaption>A map view shows the route of a run.</figcaption></figure>

### Step 5: Implement the Charts View

The last remaining view that we need to implement is the Charts view. This view is the most complex of any, but nearly all of the code identical to the _Tracking Values_ example in chapter 2. There's no need to repeat that material here, but the source code for the book includes the complete implementation. If you're looking in detail at that implementation, here a few points to note.

* Just as Leaflet and the map container, Flot expects a container for its chart to be present in the web page. We can use the same `defer` trick to prevent Flot errors.
* Nike+ returns at least four types of charts as metrics: distance, heart rate, speed, and <span class="smcp">GPS</span> signal strength. We really only care about the first two. Speed isn't present in all activities, but distance is. Because we want to graph pace, we can only count on distance to derive it. And as long as we're getting pace from the distance graph, the speed metrics are redundant. <span class="lgcp">GPS</span> signal strength doesn't seem useful enough to bother.
* If <span class="smcp">GPS</span> waypoint data is available, we can also graph elevation, but that data is in a separate attribute of the model (not the metrics attribute).
* At least as of this writing, there's a bit of a bug in Nike's response for <span class="smcp">GPS</span> data. It claims that the measurements are on the same time scale as the other metrics (every 10 seconds), but, in fact, the <span class="smcp">GPS</span> measurements are reported on different intervals. To work around this bug, we ignore the reported interval, and calculate one ourselves. Also, we want to normalize the elevation graph to the same time scale as all the others. Doing that will give us the additional benefit of averaging the <span class="smcp">GPS</span> elevation data; averaging is useful here because <span class="smcp">GPS</span> elevation measurements aren't generally very accurate.

You can see the interactive result in figure NEXTFIGURENUMBER.

<style>
.charts-wrapper {
    position: relative;
}
.charts-marker {
    position: absolute;
    z-index: 1;
    display: none;
    width: 1px;
    border-left: 1px #000 solid;
}
.charts-graphs {
    float: left;
}
.charts-graphs .figure {
    padding: 0;
    margin: 0;
    width: 420px;
    height: 100px;
}
.charts-graphs .flot-tick-label {
    display:none;
}
.charts-graphs .x-axis {
    width: 420px;
    height: 15px;
}
.charts-graphs .x-axis .flot-tick-label {
    display: block;
}
.charts-legend {
    float: left;
	padding-bottom: 16px;
}
.charts-legend p {
    margin: 0 0 0 15px;
    padding: 2px 0 2px 0;
    font-size: 13px;
    line-height: 13px;
}
.charts-legend p:first-child {
    padding-top: 6px;
}
.charts-legend p:last-child {
    padding-bottom: 14px;
}        
</style>

<figure style="margin-left:0;margin-right:0">
<div class="charts-wrapper">
<div class="charts-marker"></div>
<div class="charts-graphs"></div>
<div class="charts-legend"></div>
<div class="clearfix"></div>
</div>
<figcaption>An alternative view shows charts of the run.</figcaption>
</figure>

<script>
;(function(){

    draw = function() {

		var run = {
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
		  "tags": [
		    {
		      "tagType": "WEATHER",
		      "tagValue": "SUNNY"
		    },
		    {
		      "tagType": "NOTE"
		    },
		    {
		      "tagType": "TERRAIN",
		      "tagValue": "TRAIL"
		    },
		    {
		      "tagType": "SHOES",
		      "tagValue": "Neo Trail"
		    },
		    {
		      "tagType": "EMOTION",
		      "tagValue": "GREAT"
		    }
		  ],
		  "metrics": [
		    {
		      "intervalMetric": 10,
		      "intervalUnit": "SEC",
		      "metricType": "SPEED",
		      "values": [
		        "0.0", "4.9135", "3.2307", "5.0095", "6.0155", "6.5154", "6.7831", "7.1405", "7.5132", "7.8049",
		        "7.7402", "7.9067", "8.0318", "8.2706", "8.3555", "8.386", "8.4463", "8.4236", "8.4649", "8.4926",
		        "8.6085", "8.6471", "9.0973", "9.2853", "9.2844", "9.3911", "9.3469", "9.3066", "9.304", "9.2558",
		        "9.3002", "9.5552", "9.478", "9.3987", "9.2454", "9.216", "9.1343", "9.1113", "9.1629", "9.2077",
		        "9.1606", "9.0644", "9.1917", "9.0194", "9.1034", "8.947", "9.0625", "9.0759", "8.9977", "8.9849",
		        "9.0857", "8.9276", "8.8995", "8.9162", "9.0587", "9.0453", "9.0598", "9.0965", "9.1834", "9.1012",
		        "8.9835", "9.0078", "9.0594", "9.2988", "9.3044", "9.5607", "9.6065", "9.6938", "9.8038", "9.8606",
		        "9.7489", "9.8001", "9.8019", "9.8791", "9.8576", "9.9681", "10.1237", "10.0901", "9.9859", "9.9119",
		        "9.9398", "10.013", "10.0642", "9.9803", "9.9153", "9.9509", "9.9189", "9.8162", "9.7896", "9.779",
		        "9.9002", "9.8719", "9.8701", "9.9112", "10.0053", "10.0311", "10.0641", "10.024", "10.0852",
		        "10.0374", "10.0784", "10.1319", "10.0765", "10.015", "9.9827", "9.7291", "9.5821", "9.7238",
		        "9.6546", "9.495", "9.3582", "9.3695", "9.4641", "9.4965", "9.4442", "9.3592", "9.4442", "9.6883",
		        "9.8628", "9.8331", "13.1376", "10.123", "9.9875", "10.0217", "10.0433", "10.1553", "10.2953",
		        "10.1597", "10.3634", "10.7035", "10.8371", "11.0624", "11.044", "11.2021", "11.1301", "11.2593"
		      ]
		    },
		    {
		      "intervalMetric": 10,
		      "intervalUnit": "SEC",
		      "metricType": "HEARTRATE",
		      "values": [
		        "0", "45", "51", "57", "77", "90", "105", "108", "110", "111", "113", "116", "118", "118", "116",
		        "117", "113", "112", "111", "112", "110", "109", "110", "113", "117", "116", "114", "117", "117",
		        "114", "111", "109", "116", "112", "113", "118", "122", "127", "132", "131", "130", "129", "127",
		        "125", "122", "123", "124", "125", "128", "131", "131", "127", "124", "121", "120", "125", "128",
		        "129", "129", "128", "125", "121", "122", "124", "125", "124", "121", "120", "120", "124", "129",
		        "130", "129", "129", "131", "131", "132", "133", "131", "132", "134", "134", "132", "132", "129",
		        "128", "126", "129", "131", "134", "134", "132", "131", "129", "127", "128", "128", "129", "133",
		        "136", "138", "140", "141", "140", "138", "137", "137", "138", "138", "137", "138", "140", "139",
		        "138", "136", "137", "136", "135", "134", "135", "137", "141", "144", "144", "144", "143", "140",
		        "137", "138", "138", "136", "137", "135", "132", "133", "136"
		      ]
		    },
		    {
		      "intervalMetric": 10,
		      "intervalUnit": "SEC",
		      "metricType": "DISTANCE",
		      "values": [
		        "0.0", "0.0124", "0.0178", "0.0412", "0.0667", "0.0906", "0.1131", "0.1389", "0.1671", "0.1951",
		        "0.215", "0.2416", "0.2677", "0.2986", "0.3249", "0.3494", "0.3754", "0.3978", "0.4232", "0.4482",
		        "0.4782", "0.5061", "0.5287", "0.5567", "0.5829", "0.612", "0.6332", "0.6558", "0.6817", "0.7093",
		        "0.7358", "0.769", "0.7952", "0.8194", "0.8389", "0.8615", "0.8834", "0.9051", "0.9323", "0.9594",
		        "0.9859", "1.0097", "1.0376", "1.059", "1.0877", "1.1076", "1.1373", "1.1615", "1.1816", "1.2072",
		        "1.239", "1.2642", "1.2904", "1.3147", "1.3427", "1.3636", "1.3896", "1.4117", "1.4419", "1.4647",
		        "1.4868", "1.5093", "1.5405", "1.5747", "1.6049", "1.6408", "1.6702", "1.7003", "1.727", "1.7555",
		        "1.7782", "1.809", "1.8367", "1.8647", "1.8916", "1.9217", "1.9486", "1.9722", "1.996", "2.0165",
		        "2.0423", "2.0666", "2.0972", "2.127", "2.1538", "2.1899", "2.2217", "2.2457", "2.2705", "2.2992",
		        "2.3293", "2.3568", "2.3854", "2.4149", "2.4477", "2.48", "2.506", "2.5292", "2.5563", "2.5815",
		        "2.603", "2.6304", "2.6559", "2.6828", "2.709", "2.7297", "2.7537", "2.7859", "2.8057", "2.8264",
		        "2.8489", "2.8764", "2.9104", "2.9426", "2.9719", "2.9994", "3.0302", "3.0689", "3.1037", "3.1301",
		        "3.2963", "3.2963", "3.2963", "3.2963", "3.2963", "3.2963", "3.3249", "3.3533", "3.3861", "3.421",
		        "3.4559", "3.4888", "3.5238", "3.5626", "3.5933", "3.6246"
		      ]
		    }
		  ],
		  "gps": {
		    "elevationLoss": 114.400024,
		    "elevationGain": 109.00003,
		    "elevationMax": 296.2,
		    "elevationMin": 257,
		    "intervalMetric": 10,
		    "intervalUnit": "SEC",
		    "waypoints": [
		      { "latitude": 34.063286, "longitude": -84.407074, "elevation": 291 },
		      { "latitude": 34.063293, "longitude": -84.407074, "elevation": 291 },
		      { "latitude": 34.063175, "longitude": -84.40712, "elevation": 290.6 },
		      { "latitude": 34.06317, "longitude": -84.40713, "elevation": 290.6 },
		      { "latitude": 34.063168, "longitude": -84.407135, "elevation": 290.6 },
		      { "latitude": 34.063164, "longitude": -84.407135, "elevation": 290.6 },
		      { "latitude": 34.06315, "longitude": -84.40715, "elevation": 290.6 },
		      { "latitude": 34.06307, "longitude": -84.4073, "elevation": 290.2 },
		      { "latitude": 34.063023, "longitude": -84.40747, "elevation": 289.6 },
		      { "latitude": 34.063023, "longitude": -84.407555, "elevation": 289.6 },
		      { "latitude": 34.063034, "longitude": -84.40772, "elevation": 290.6 },
		      { "latitude": 34.063026, "longitude": -84.40777, "elevation": 291.2 },
		      { "latitude": 34.0629, "longitude": -84.407906, "elevation": 292.6 },
		      { "latitude": 34.062885, "longitude": -84.40799, "elevation": 293.6 },
		      { "latitude": 34.06279, "longitude": -84.40813, "elevation": 295 },
		      { "latitude": 34.062653, "longitude": -84.40824, "elevation": 295 },
		      { "latitude": 34.062572, "longitude": -84.40838, "elevation": 294.6 },
		      { "latitude": 34.06245, "longitude": -84.40853, "elevation": 293.6 },
		      { "latitude": 34.062374, "longitude": -84.408646, "elevation": 293 },
		      { "latitude": 34.062366, "longitude": -84.40867, "elevation": 293.2 },
		      { "latitude": 34.062424, "longitude": -84.40882, "elevation": 293.6 },
		      { "latitude": 34.06254, "longitude": -84.40887, "elevation": 295.2 },
		      { "latitude": 34.06261, "longitude": -84.40895, "elevation": 296.2 },
		      { "latitude": 34.06272, "longitude": -84.40913, "elevation": 296.2 },
		      { "latitude": 34.062706, "longitude": -84.40932, "elevation": 295.2 },
		      { "latitude": 34.062622, "longitude": -84.40942, "elevation": 293.2 },
		      { "latitude": 34.062485, "longitude": -84.409515, "elevation": 292.6 },
		      { "latitude": 34.06234, "longitude": -84.40957, "elevation": 292.6 },
		      { "latitude": 34.06222, "longitude": -84.4096, "elevation": 293.2 },
		      { "latitude": 34.06213, "longitude": -84.4096, "elevation": 293.2 },
		      { "latitude": 34.062096, "longitude": -84.4097, "elevation": 292.2 },
		      { "latitude": 34.06214, "longitude": -84.40987, "elevation": 290.2 },
		      { "latitude": 34.062244, "longitude": -84.40987, "elevation": 289.2 },
		      { "latitude": 34.062393, "longitude": -84.4098, "elevation": 288.6 },
		      { "latitude": 34.062523, "longitude": -84.40973, "elevation": 288.6 },
		      { "latitude": 34.06267, "longitude": -84.40968, "elevation": 288 },
		      { "latitude": 34.06271, "longitude": -84.409676, "elevation": 287.6 },
		      { "latitude": 34.062885, "longitude": -84.409615, "elevation": 287.6 },
		      { "latitude": 34.063004, "longitude": -84.40946, "elevation": 287 },
		      { "latitude": 34.06301, "longitude": -84.40945, "elevation": 287 },
		      { "latitude": 34.06316, "longitude": -84.40958, "elevation": 286.6 },
		      { "latitude": 34.06327, "longitude": -84.40965, "elevation": 285.6 },
		      { "latitude": 34.06341, "longitude": -84.409645, "elevation": 286.2 },
		      { "latitude": 34.063606, "longitude": -84.40965, "elevation": 285.6 },
		      { "latitude": 34.06372, "longitude": -84.4096, "elevation": 286.2 },
		      { "latitude": 34.06389, "longitude": -84.40956, "elevation": 284 },
		      { "latitude": 34.063988, "longitude": -84.40947, "elevation": 283.6 },
		      { "latitude": 34.064148, "longitude": -84.40945, "elevation": 283.2 },
		      { "latitude": 34.064224, "longitude": -84.409424, "elevation": 283.2 },
		      { "latitude": 34.064262, "longitude": -84.40932, "elevation": 284 },
		      { "latitude": 34.06428, "longitude": -84.40917, "elevation": 284.2 },
		      { "latitude": 34.0644, "longitude": -84.40919, "elevation": 282.6 },
		      { "latitude": 34.06444, "longitude": -84.409225, "elevation": 282 },
		      { "latitude": 34.064552, "longitude": -84.409355, "elevation": 280.6 },
		      { "latitude": 34.06458, "longitude": -84.40936, "elevation": 280 },
		      { "latitude": 34.064762, "longitude": -84.40937, "elevation": 276.6 },
		      { "latitude": 34.0648, "longitude": -84.40937, "elevation": 276.2 },
		      { "latitude": 34.06494, "longitude": -84.40933, "elevation": 275 },
		      { "latitude": 34.0651, "longitude": -84.40931, "elevation": 272.6 },
		      { "latitude": 34.065216, "longitude": -84.409325, "elevation": 271 },
		      { "latitude": 34.065407, "longitude": -84.40941, "elevation": 268.6 },
		      { "latitude": 34.06547, "longitude": -84.409454, "elevation": 268.2 },
		      { "latitude": 34.06553, "longitude": -84.40939, "elevation": 265.6 },
		      { "latitude": 34.065502, "longitude": -84.40928, "elevation": 265 },
		      { "latitude": 34.065475, "longitude": -84.40925, "elevation": 264.6 },
		      { "latitude": 34.065437, "longitude": -84.409195, "elevation": 265 },
		      { "latitude": 34.06536, "longitude": -84.40914, "elevation": 266.6 },
		      { "latitude": 34.065334, "longitude": -84.409065, "elevation": 266.6 },
		      { "latitude": 34.065346, "longitude": -84.40895, "elevation": 266.2 },
		      { "latitude": 34.065422, "longitude": -84.40893, "elevation": 266.2 },
		      { "latitude": 34.06557, "longitude": -84.409004, "elevation": 267 },
		      { "latitude": 34.06567, "longitude": -84.40905, "elevation": 269 },
		      { "latitude": 34.065807, "longitude": -84.409065, "elevation": 271.6 },
		      { "latitude": 34.06593, "longitude": -84.40897, "elevation": 273.6 },
		      { "latitude": 34.066074, "longitude": -84.40889, "elevation": 274.2 },
		      { "latitude": 34.066113, "longitude": -84.408844, "elevation": 274 },
		      { "latitude": 34.06611, "longitude": -84.408646, "elevation": 274.6 },
		      { "latitude": 34.066082, "longitude": -84.408485, "elevation": 275.2 },
		      { "latitude": 34.066097, "longitude": -84.408424, "elevation": 274.6 },
		      { "latitude": 34.066162, "longitude": -84.408325, "elevation": 274 },
		      { "latitude": 34.066246, "longitude": -84.40832, "elevation": 274.2 },
		      { "latitude": 34.066372, "longitude": -84.40831, "elevation": 274.2 },
		      { "latitude": 34.06654, "longitude": -84.40824, "elevation": 273.2 },
		      { "latitude": 34.066563, "longitude": -84.40824, "elevation": 273.2 },
		      { "latitude": 34.066696, "longitude": -84.4082, "elevation": 273.2 },
		      { "latitude": 34.066727, "longitude": -84.40809, "elevation": 272.2 },
		      { "latitude": 34.0667, "longitude": -84.40791, "elevation": 270.6 },
		      { "latitude": 34.06669, "longitude": -84.40786, "elevation": 270.6 },
		      { "latitude": 34.06668, "longitude": -84.40767, "elevation": 271.2 },
		      { "latitude": 34.066708, "longitude": -84.407684, "elevation": 272 },
		      { "latitude": 34.066765, "longitude": -84.40776, "elevation": 271 },
		      { "latitude": 34.066925, "longitude": -84.40789, "elevation": 271.2 },
		      { "latitude": 34.067043, "longitude": -84.40797, "elevation": 272.6 },
		      { "latitude": 34.06721, "longitude": -84.40798, "elevation": 274.2 },
		      { "latitude": 34.06723, "longitude": -84.40798, "elevation": 274.6 },
		      { "latitude": 34.06733, "longitude": -84.40796, "elevation": 276.6 },
		      { "latitude": 34.0674, "longitude": -84.40794, "elevation": 277.2 },
		      { "latitude": 34.06748, "longitude": -84.40786, "elevation": 277.2 },
		      { "latitude": 34.067574, "longitude": -84.40772, "elevation": 275.2 },
		      { "latitude": 34.06758, "longitude": -84.407455, "elevation": 274.2 },
		      { "latitude": 34.067623, "longitude": -84.407326, "elevation": 273.2 },
		      { "latitude": 34.06767, "longitude": -84.40721, "elevation": 272.2 },
		      { "latitude": 34.067745, "longitude": -84.407265, "elevation": 271.2 },
		      { "latitude": 34.0678, "longitude": -84.407326, "elevation": 270.2 },
		      { "latitude": 34.067814, "longitude": -84.40725, "elevation": 268.2 },
		      { "latitude": 34.06781, "longitude": -84.40722, "elevation": 267.6 },
		      { "latitude": 34.067734, "longitude": -84.40705, "elevation": 266.2 },
		      { "latitude": 34.067715, "longitude": -84.40702, "elevation": 266.2 },
		      { "latitude": 34.06771, "longitude": -84.40686, "elevation": 265 },
		      { "latitude": 34.06773, "longitude": -84.406784, "elevation": 265.6 },
		      { "latitude": 34.067814, "longitude": -84.40677, "elevation": 267.6 },
		      { "latitude": 34.067944, "longitude": -84.406815, "elevation": 269.2 },
		      { "latitude": 34.067963, "longitude": -84.40684, "elevation": 269.6 },
		      { "latitude": 34.068142, "longitude": -84.40682, "elevation": 269.2 },
		      { "latitude": 34.068264, "longitude": -84.406784, "elevation": 268.2 },
		      { "latitude": 34.068367, "longitude": -84.40677, "elevation": 268.2 },
		      { "latitude": 34.068485, "longitude": -84.406654, "elevation": 269 },
		      { "latitude": 34.068584, "longitude": -84.40652, "elevation": 268 },
		      { "latitude": 34.068573, "longitude": -84.406334, "elevation": 268.6 },
		      { "latitude": 34.068577, "longitude": -84.4063, "elevation": 268.2 },
		      { "latitude": 34.06852, "longitude": -84.40625, "elevation": 267.6 },
		      { "latitude": 34.06859, "longitude": -84.406204, "elevation": 265.6 },
		      { "latitude": 34.068615, "longitude": -84.40621, "elevation": 265.6 },
		      { "latitude": 34.068752, "longitude": -84.40619, "elevation": 264.2 },
		      { "latitude": 34.068844, "longitude": -84.40602, "elevation": 264.2 },
		      { "latitude": 34.06884, "longitude": -84.405754, "elevation": 264.2 },
		      { "latitude": 34.06882, "longitude": -84.405624, "elevation": 265.2 },
		      { "latitude": 34.068825, "longitude": -84.40553, "elevation": 266 },
		      { "latitude": 34.068893, "longitude": -84.40535, "elevation": 266.6 },
		      { "latitude": 34.068928, "longitude": -84.405266, "elevation": 265 },
		      { "latitude": 34.068947, "longitude": -84.40511, "elevation": 263 },
		      { "latitude": 34.068947, "longitude": -84.404915, "elevation": 260.6 },
		      { "latitude": 34.06895, "longitude": -84.40469, "elevation": 259.6 },
		      { "latitude": 34.06887, "longitude": -84.40456, "elevation": 257.2 },
		      { "latitude": 34.068737, "longitude": -84.40447, "elevation": 257.2 },
		      { "latitude": 34.068577, "longitude": -84.4044, "elevation": 257.6 },
		      { "latitude": 34.068417, "longitude": -84.4044, "elevation": 257 },
		      { "latitude": 34.06826, "longitude": -84.40444, "elevation": 257.6 },
		      { "latitude": 34.06808, "longitude": -84.404465, "elevation": 258.6 },
		      { "latitude": 34.067986, "longitude": -84.40453, "elevation": 260.2 },
		      { "latitude": 34.067886, "longitude": -84.404655, "elevation": 261.6 },
		      { "latitude": 34.067753, "longitude": -84.40475, "elevation": 262 },
		      { "latitude": 34.067608, "longitude": -84.4048, "elevation": 261.2 },
		      { "latitude": 34.067516, "longitude": -84.40487, "elevation": 261.6 },
		      { "latitude": 34.067482, "longitude": -84.4049, "elevation": 262 },
		      { "latitude": 34.067352, "longitude": -84.40503, "elevation": 263 },
		      { "latitude": 34.06724, "longitude": -84.40516, "elevation": 263.6 },
		      { "latitude": 34.06712, "longitude": -84.40526, "elevation": 264.6 },
		      { "latitude": 34.067028, "longitude": -84.40536, "elevation": 265.6 },
		      { "latitude": 34.06687, "longitude": -84.40546, "elevation": 265.2 },
		      { "latitude": 34.066772, "longitude": -84.40552, "elevation": 265.6 },
		      { "latitude": 34.066616, "longitude": -84.40555, "elevation": 267 },
		      { "latitude": 34.06651, "longitude": -84.40559, "elevation": 268.2 },
		      { "latitude": 34.06637, "longitude": -84.40558, "elevation": 266.2 },
		      { "latitude": 34.066257, "longitude": -84.405495, "elevation": 263 },
		      { "latitude": 34.06617, "longitude": -84.40539, "elevation": 263.2 },
		      { "latitude": 34.066135, "longitude": -84.40533, "elevation": 264.2 },
		      { "latitude": 34.066143, "longitude": -84.40519, "elevation": 267 },
		      { "latitude": 34.066257, "longitude": -84.40513, "elevation": 267.2 },
		      { "latitude": 34.06637, "longitude": -84.40503, "elevation": 268.2 },
		      { "latitude": 34.066475, "longitude": -84.40493, "elevation": 268.6 },
		      { "latitude": 34.06661, "longitude": -84.40487, "elevation": 267.6 },
		      { "latitude": 34.06672, "longitude": -84.40483, "elevation": 267 },
		      { "latitude": 34.06692, "longitude": -84.40466, "elevation": 265.2 },
		      { "latitude": 34.067013, "longitude": -84.40457, "elevation": 264.2 },
		      { "latitude": 34.067135, "longitude": -84.40445, "elevation": 264.2 },
		      { "latitude": 34.06725, "longitude": -84.40431, "elevation": 263.6 },
		      { "latitude": 34.06734, "longitude": -84.40411, "elevation": 263.2 },
		      { "latitude": 34.067417, "longitude": -84.40393, "elevation": 262 },
		      { "latitude": 34.067368, "longitude": -84.40378, "elevation": 262.6 },
		      { "latitude": 34.06729, "longitude": -84.40368, "elevation": 264 },
		      { "latitude": 34.06723, "longitude": -84.40361, "elevation": 264.6 },
		      { "latitude": 34.06715, "longitude": -84.403534, "elevation": 266 },
		      { "latitude": 34.067116, "longitude": -84.4035, "elevation": 266.6 },
		      { "latitude": 34.066998, "longitude": -84.40337, "elevation": 266.6 },
		      { "latitude": 34.06688, "longitude": -84.40326, "elevation": 267.6 },
		      { "latitude": 34.06671, "longitude": -84.403175, "elevation": 268.2 },
		      { "latitude": 34.06653, "longitude": -84.40312, "elevation": 267.6 },
		      { "latitude": 34.066452, "longitude": -84.40306, "elevation": 267.6 },
		      { "latitude": 34.06637, "longitude": -84.40293, "elevation": 267.2 },
		      { "latitude": 34.066265, "longitude": -84.4028, "elevation": 266.6 },
		      { "latitude": 34.066086, "longitude": -84.4027, "elevation": 267 },
		      { "latitude": 34.066044, "longitude": -84.402626, "elevation": 266.6 },
		      { "latitude": 34.065956, "longitude": -84.40245, "elevation": 266 },
		      { "latitude": 34.065933, "longitude": -84.402374, "elevation": 265.2 },
		      { "latitude": 34.065823, "longitude": -84.402214, "elevation": 263 },
		      { "latitude": 34.065647, "longitude": -84.40205, "elevation": 262.6 },
		      { "latitude": 34.065533, "longitude": -84.40196, "elevation": 263 },
		      { "latitude": 34.065403, "longitude": -84.401794, "elevation": 264.2 },
		      { "latitude": 34.06527, "longitude": -84.401764, "elevation": 266.6 },
		      { "latitude": 34.06514, "longitude": -84.40169, "elevation": 268.2 },
		      { "latitude": 34.065018, "longitude": -84.40153, "elevation": 270.6 },
		      { "latitude": 34.064896, "longitude": -84.401436, "elevation": 272.2 },
		      { "latitude": 34.06486, "longitude": -84.40141, "elevation": 273 },
		      { "latitude": 34.064804, "longitude": -84.40137, "elevation": 274.2 },
		      { "latitude": 34.0647, "longitude": -84.40125, "elevation": 276.2 },
		      { "latitude": 34.064564, "longitude": -84.40118, "elevation": 277.6 },
		      { "latitude": 34.064484, "longitude": -84.40119, "elevation": 278.6 },
		      { "latitude": 34.06429, "longitude": -84.40119, "elevation": 278.6 },
		      { "latitude": 34.064243, "longitude": -84.40119, "elevation": 279 },
		      { "latitude": 34.064102, "longitude": -84.40116, "elevation": 277.6 },
		      { "latitude": 34.06389, "longitude": -84.40117, "elevation": 277.2 },
		      { "latitude": 34.063778, "longitude": -84.40116, "elevation": 278.2 },
		      { "latitude": 34.063633, "longitude": -84.40111, "elevation": 279.2 },
		      { "latitude": 34.06357, "longitude": -84.40111, "elevation": 279 },
		      { "latitude": 34.06347, "longitude": -84.4011, "elevation": 281 },
		      { "latitude": 34.063232, "longitude": -84.4011, "elevation": 281.6 },
		      { "latitude": 34.06321, "longitude": -84.40112, "elevation": 281.6 },
		      { "latitude": 34.063168, "longitude": -84.40116, "elevation": 281.6 },
		      { "latitude": 34.063248, "longitude": -84.40121, "elevation": 282.6 },
		      { "latitude": 34.063347, "longitude": -84.40126, "elevation": 281.2 },
		      { "latitude": 34.06337, "longitude": -84.40124, "elevation": 281.2 },
		      { "latitude": 34.063534, "longitude": -84.40126, "elevation": 281.6 },
		      { "latitude": 34.06366, "longitude": -84.401306, "elevation": 284 },
		      { "latitude": 34.063744, "longitude": -84.40133, "elevation": 284 },
		      { "latitude": 34.06391, "longitude": -84.40136, "elevation": 283.6 },
		      { "latitude": 34.06409, "longitude": -84.40141, "elevation": 284.6 },
		      { "latitude": 34.064243, "longitude": -84.401436, "elevation": 285 },
		      { "latitude": 34.064396, "longitude": -84.40148, "elevation": 285 },
		      { "latitude": 34.064514, "longitude": -84.40156, "elevation": 283 },
		      { "latitude": 34.064644, "longitude": -84.40174, "elevation": 283.2 },
		      { "latitude": 34.064697, "longitude": -84.40192, "elevation": 283.6 },
		      { "latitude": 34.064705, "longitude": -84.40195, "elevation": 283.2 },
		      { "latitude": 34.06479, "longitude": -84.4021, "elevation": 284.6 },
		      { "latitude": 34.064842, "longitude": -84.40217, "elevation": 284.2 },
		      { "latitude": 34.064957, "longitude": -84.40238, "elevation": 284 },
		      { "latitude": 34.064953, "longitude": -84.40265, "elevation": 284.2 },
		      { "latitude": 34.064915, "longitude": -84.402855, "elevation": 284 },
		      { "latitude": 34.064945, "longitude": -84.4031, "elevation": 282.6 },
		      { "latitude": 34.064957, "longitude": -84.40326, "elevation": 282.2 },
		      { "latitude": 34.064896, "longitude": -84.40339, "elevation": 284.6 },
		      { "latitude": 34.064884, "longitude": -84.403435, "elevation": 285.6 },
		      { "latitude": 34.06481, "longitude": -84.40353, "elevation": 287 },
		      { "latitude": 34.06477, "longitude": -84.40355, "elevation": 287.6 },
		      { "latitude": 34.064606, "longitude": -84.4036, "elevation": 289 },
		      { "latitude": 34.06446, "longitude": -84.40368, "elevation": 289.6 },
		      { "latitude": 34.06432, "longitude": -84.40376, "elevation": 291.2 },
		      { "latitude": 34.06423, "longitude": -84.40381, "elevation": 292.2 },
		      { "latitude": 34.06405, "longitude": -84.40379, "elevation": 292.2 },
		      { "latitude": 34.063885, "longitude": -84.40383, "elevation": 293.2 },
		      { "latitude": 34.06372, "longitude": -84.403854, "elevation": 293 },
		      { "latitude": 34.063667, "longitude": -84.40396, "elevation": 294 },
		      { "latitude": 34.063793, "longitude": -84.40403, "elevation": 292.6 },
		      { "latitude": 34.063873, "longitude": -84.404045, "elevation": 292.2 },
		      { "latitude": 34.06409, "longitude": -84.404144, "elevation": 291 },
		      { "latitude": 34.06417, "longitude": -84.40425, "elevation": 290.2 },
		      { "latitude": 34.064198, "longitude": -84.40441, "elevation": 290.6 },
		      { "latitude": 34.06411, "longitude": -84.40461, "elevation": 292.2 },
		      { "latitude": 34.064102, "longitude": -84.40463, "elevation": 292.6 },
		      { "latitude": 34.064075, "longitude": -84.40487, "elevation": 292 },
		      { "latitude": 34.06397, "longitude": -84.40499, "elevation": 291.2 },
		      { "latitude": 34.063942, "longitude": -84.405014, "elevation": 291.2 },
		      { "latitude": 34.063736, "longitude": -84.40513, "elevation": 290.6 },
		      { "latitude": 34.063683, "longitude": -84.40514, "elevation": 291 },
		      { "latitude": 34.063583, "longitude": -84.4052, "elevation": 291 },
		      { "latitude": 34.063385, "longitude": -84.40534, "elevation": 288.2 },
		      { "latitude": 34.063374, "longitude": -84.405464, "elevation": 287 },
		      { "latitude": 34.06337, "longitude": -84.40568, "elevation": 285.6 },
		      { "latitude": 34.06331, "longitude": -84.40574, "elevation": 285.6 },
		      { "latitude": 34.063213, "longitude": -84.40595, "elevation": 284.6 },
		      { "latitude": 34.06321, "longitude": -84.406204, "elevation": 284.6 },
		      { "latitude": 34.063183, "longitude": -84.40638, "elevation": 286.2 },
		      { "latitude": 34.06324, "longitude": -84.40648, "elevation": 286.6 },
		      { "latitude": 34.063183, "longitude": -84.40676, "elevation": 286.2 },
		      { "latitude": 34.063156, "longitude": -84.40697, "elevation": 285.6 },
		      { "latitude": 34.063152, "longitude": -84.40699, "elevation": 285.6 }
		    ]
		  }
		};


		var points = _(run.gps.waypoints).map(function(pt) {
		    return [pt.latitude, pt.longitude];
		});
		var path = new L.Polyline(points, {color: '#1788cc'});
		var map = L.map('map').fitBounds(path.getBounds()).addLayer(path);
		var tiles = L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
		    attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ',
		    maxZoom: 16
		});
		map.addLayer(tiles);

		// Smooth an array of data using an arbitrarily-weighted moving average
		//   sum of weights should equal 1.0 (unless scaling is desired)
		var smooth = function(data, weights) {
		    // Preload the weighted values using the first value in the data set
		    var weighted = Array.apply(null, new Array(weights.length-1)).map(Number.prototype.valueOf,data[0]);

		    // Re-map the data to it's smoothed values
		    return _(data).map(function(d) {
    
		        // Calculate a smoothed value from the weighted values
		        var smoothed = _(weighted).reduce(function(s, w, i) {
		            // s : intermediate calculation of smoothed value
		            // w : current weighted value
		            // i : current index into weighted values array
		            return s + weights[i+1] * w;
		        }, weights[0] * d);
        
		        // Add the newly calculated value to the weighted values
		        weighted.unshift(smoothed);
        
		        // Remove the oldest weighted value
		        weighted = weighted.slice(0, -1);
        
		        // Return the new smoothed value for the map result
		        return smoothed;
		    });
		};

		// Gradually ramp up a data set to eliminate noise in initial values
		//   cnt: how many data points to smooth
		//   rate: how fast to ramp
		var ramp = function(data, cnt, rate) {
		    var finalValue = data[cnt];
		    for (var idx=0; idx<cnt; idx++) {
		        // We're using a scaled/shifted Logistic function to ramp
		        data[idx] = ((2/(1+Math.exp(-rate*idx/cnt)))-1) * finalValue;
		    }
		    return data;
		};

		// Clean noisy GPS-derived data based observed problems
		//    z: maximum z-value to permit
		var clean = function(data, z) {
		    var deltas = _(data).map(function(d, idx, arr) {
		        if (idx < arr.length-1) {
		            return arr[idx+1] - d;
		        } else {
		            return 0;
		        }
		    });
		    deltas.pop();
		    var sum = _(deltas).reduce(function(s, d) { return s+d; }, 0);
		    var mean = sum / deltas.length;
		    var variance = _(deltas).reduce(function(s,d) { return s+Math.pow(d - mean, 2) }, 0) / deltas.length;
		    var stdev = Math.sqrt(variance);

		    for (idx=1; idx<data.length; idx++) {
		        if ((data[idx] - data[idx-1]) > (z * stdev)) {
		            data[idx] = data[idx-1] + z * stdev;
		        }
		    }
    
		    return data;
		}

		var dist = _(run.metrics).find(function(metric) {
		    return metric.metricType.toUpperCase() === "DISTANCE";
		});
		dist = dist && _(dist.values).map(function(value) {
		    return parseFloat(value) * 0.621371;
		});
		dist = smooth(dist, [ 0.40, 0.30, 0.15, 0.05, 0.05, 0.05 ]);
		dist = clean(dist, 5);

		var interval = parseInt(run.metrics[0].intervalMetric, 10);
		var time = _.range(0, interval*run.metrics[0].values.length, interval);
		var maxTime = Math.max.apply(null, time);
		var tickCount = Math.floor(maxTime/300);
		var tickScale = Math.ceil(tickCount/8)*5;
		var timeTicks = _.range(tickScale*60, Math.floor(maxTime/tickScale)*tickScale, tickScale*60);
		timeTicks = _(timeTicks).map(function(t) {
		    if (t < 3600) { return [t, t/60 + ":00"];}
		    return [t, Math.floor(t/3600) + ":" + _((t%3600)/60).pad(2, "0") + ":00"];
		});
		var pace = dist && _(dist).map(function(pt, idx) {
		    if (idx === 0) {
		        return interval / (60* (dist[1] - dist[0]));
		    } else if (idx === dist.length-1) {
		        return interval / (60* (dist[idx] - dist[idx-1]));
		    } else {
		        return interval / (30* (dist[idx+1] - dist[idx-1]));
		    }
		});

		pace = ramp(pace, 12, 20);

		var heartrate = _(run.metrics).find(function(metric) {
		    return metric.metricType.toUpperCase() === "HEARTRATE";
		});
		heartrate = heartrate && _(heartrate.values).map(function(value, idx) {
		    return parseInt(value,10) || null;
		});
		var elevation = run.gps && run.gps.waypoints &&
		  _(run.gps.waypoints)
		      .chain()
		      .pluck("elevation")
		      .map(function(pt) {
		          return 3.28084*parseFloat(pt);
		      })
		      .value();
		var gps_ratio = elevation && (elevation.length / time.length);
		elevation = elevation && _(time).map(function(pt, idx){
		    var range = _.range(
		        Math.round(Math.max(gps_ratio*idx-gps_ratio/2, 0)),
		        Math.round(Math.min(gps_ratio*idx+gps_ratio/2, elevation.length))
		    );
		    return _(range).reduce(function(avg,idx,cnt){
		        return ((avg*cnt + elevation[idx]) / (cnt+1));
		    }, 0);
		});
		var plots = [];
		var plot;
		var options = {
		    legend: {show: false},
		    series: {lines: {fill: false, lineWidth: 2}, shadowSize: 1},
		    xaxis:  {show: true, min: 0, max: Math.max.apply(null, time), ticks: timeTicks, labelHeight: 0, autoscaleMargin: 0, tickFormatter: function() {return "";}},
		    yaxis:  {show: false},
		    grid:   {show: true, margin: 0, borderWidth: 0, borderColor: null, margin: 0, labelMargin: 0, axisMargin: 0, minBorderMargin: 0, hoverable: true, autoHighlight: false},
		};
		var clean, min, max, mean, div;
		if (pace) {
		    plot = {};
		    plot.placeholder = $("<div>").addClass("figure");
		    $(".charts-graphs").append(plot.placeholder);
		    plot.data = _.zip(time, pace);
		    plot.options = _({}).extend(options,{
		        yaxis:  {show: false, min: 0, max: 1.2*Math.max.apply(null, pace)},
		        series: {lines: {fill: true, fillColor: "#9fceea", lineWidth: 1}, shadowSize: 0},
		        colors: ["#1788cc"],
		    });
		    plot.format = function(val) {
		        if (!_(val).isFinite()) { return ""; }
		        return Math.floor(val)  + ":" + _(Math.round((val  % Math.floor(val))*60)).pad(2, "0");
		    };
		    plots.push(plot);
		    clean = _(pace).chain()
		        .filter(function(pt) {return _(pt).isFinite();})
		        .reject(function(pt) {return pt === 0;})
		        .value();
		    min = Math.min.apply(null, clean);
		    max = Math.max.apply(null, clean);
		    mean = _(clean).reduce(function(sum, pt) {return sum+pt;}, 0)/clean.length;
		    div = $("<div>")
		        .append($("<p>").html("<strong>Pace</strong>"))
		        .append($("<p>").text("Slowest: " + plot.format(max)  + " per Mile"))
		        .append($("<p>").text("Average: " + plot.format(mean) + " per Mile"))
		        .append($("<p>").text("Fastest: " + plot.format(min)  + " per Mile"));
		    $(".charts-legend").append(div);
		}
		if (heartrate) {
		    plot = {};
		    plot.placeholder = $("<div>").addClass("figure");
		    $(".charts-graphs").append(plot.placeholder);
		    plot.data = _.zip(time, heartrate);
		    plot.options = _({}).extend(options,{
		        yaxis:  {show: false, min: 0, max: 1.2*Math.max.apply(null, heartrate)},
		        series: {lines: {fill: true, fillColor: "#eaaa9f", lineWidth: 1}, shadowSize: 0},
		        colors: ["#cc3217"],
		    });
		    plot.format = function(val) {
		        if (!_(val).isFinite() || (val === 0)) { return ""; }
		        return Math.round(val);
		    };
		    plots.push(plot);
		    clean = _(heartrate).chain()
		        .filter(function(pt) {return _(pt).isFinite();})
		        .reject(function(pt) {return pt === 0;})
		        .value();
		    min = Math.min.apply(null, clean);
		    max = Math.max.apply(null, clean);
		    mean = _(clean).reduce(function(sum, pt) {return sum+pt;}, 0)/clean.length;
		    div = $("<div>")
		        .append($("<p>").html("<strong>Heart Rate</strong>"))
		        .append($("<p>").text("Minimum: " + plot.format(min)  + " bpm"))
		        .append($("<p>").text("Average: " + plot.format(mean) + " bpm"))
		        .append($("<p>").text("Maximum: " + plot.format(max)  + " bpm"));
		    $(".charts-legend").append(div);
		}
		if (elevation) {
		    plot = {};
		    plot.placeholder = $("<div>").addClass("figure");
		    $(".charts-graphs").append(plot.placeholder);
		    plot.data = _.zip(time, elevation);
		    var min = Math.min.apply(null,elevation);
		    var max = Math.max.apply(null,elevation);
		    var range = max - min;
		    min -= 0.2*range;
		    max += 0.2*range;
		    plot.options = _({}).extend(options,{
		        yaxis:  {show: false, min: min, max: max},
		        series: {lines: {fill: true, fillColor: "#ead19f", lineWidth: 1}, shadowSize: 0},
		        colors: ["#cc9117"],
		    });
		    plot.format = function(val) {
		        if (!_(val).isFinite()) { return ""; }
		        return Math.round(val);
		    };
		    plots.push(plot);
		    min = Math.min.apply(null, elevation);
		    max = Math.max.apply(null, elevation);
		    mean = _(elevation).reduce(function(sum, pt) {return sum+pt;}, 0)/elevation.length;
		    div = $("<div>")
		        .append($("<p>").html("<strong>Elevation</strong>"))
		        .append($("<p>").text("Minimum: " + plot.format(min)  + " ft"))
		        .append($("<p>").text("Average: " + plot.format(mean) + " ft"))
		        .append($("<p>").text("Maximum: " + plot.format(max)  + " ft"));
		    $(".charts-legend").append(div);
		}
		plot = {};
		plot.placeholder = $("<div>").addClass("x-axis");
		$(".charts-graphs").append(plot.placeholder);
		plot.data = _(time).map(function(t) { return [t, null];});
		plot.options = _({}).extend(options,{
		    xaxis:  {
		        show: true,
		        min: 0,
		        max: Math.max.apply(null, time),
		        ticks: timeTicks,
		        labelHeight: 12,
		        autoscaleMargin: 0,
		    },
		    yaxis:  {show: false, min: 100, max: 200},
		    grid:   {show: true, margin: 0, borderWidth: 0, margin: 0, labelMargin: 0, axisMargin: 0, minBorderMargin: 0},
		});
		plot.format = function(val) {return ""; };
		plots.push(plot);

		_(plots).each(function(plot) {
		    plot.plot = $.plot(plot.placeholder, [plot.data], plot.options);
		    plot.value = $("<div>").css({
		        'position':  "absolute",
		        'top':       plot.placeholder.position().top + "px",
		        'display':   "none",
		        'z-index':   1,
		        'font-size': "11px",
		        'color':     "black"
		    });
		    $(".charts-wrapper").append(plot.value);
		}, this);

		$(".charts-graphs .figure").css("height", "80px");

		$(".charts-graphs").on("plothover", function(ev, pos) {
		    var xvalue = Math.round(pos.x/10);
		    var left = _(plots).last().plot.pointOffset(pos).left;
		    var height = $(".charts-graphs").height() - 15;
		    $(".charts-marker").css({
		        'top':    0,
		        'left':   left,
		        'width':  "1px",
		        'height': height
		    }).show();
		    _(plots).each(function(plot){
		        if ((xvalue >= 0) && (xvalue < plot.data.length)) {
		            $(plot.value).text(plot.format(plot.data[xvalue][1])).css("left", (left+4)+"px").show();
		        }
		    });
		}).on("mouseout", function(ev) {
		    if (ev.relatedTarget.className !== "charts-marker") {
		        $(".charts-marker").hide();
		        _(plots).each(function(plot) { plot.value.hide(); });
		    }
		});
		$(".charts-marker").on("mouseout", function(ev) {
		    $(".charts-marker").hide();
		    _(plots).each(function(plot) { plot.value.hide(); });
		});

    };

    if (typeof contentLoaded != "undefined") {
        contentLoaded.done(draw);
    } else {
        window.addEventListener('load', draw);
    }

}());
</script>

