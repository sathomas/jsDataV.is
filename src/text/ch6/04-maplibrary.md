## Integrating a Full-Featured Mapping Library

The Modest Maps library of the previous example is a fine library for simple map visualizations, but it doesn't have all of the features and support of a full-featured service such as Google Maps. There is, however, an open source library that does provide those features, [Leaflet](http://leafletjs.com). In this example we'll build a more complex visualization that features a Leaflet-based map.

In the 1940s, two private railroads were in competition for passenger traffic in the southeastern United States. Two routes that competed most directly with each other were the _Silver Comet_ run by Seaboard Air Lines, and the _Southerner_ operated by Southern Railways. Both served passengers traveling between New York and Birmingham, Alabama. One factor cited in the Southerner's ultimate success was the shorter distance of its route. Trips on the Southerner were quicker, giving Southern Railways a competitive advantage. Let's create a visualization to demonstrate that advantage.

### Step 1: Prepare the Data

The data for our visualization is readily available as timetables for the two routes. A more precise comparison might consider timetables from the same year, but for this example we'll use the [Southerner's timetable from 1941](http://www.streamlinerschedules.com/concourse/track1/southerner194112.html) and the [Silver Comet's timetable from 1947](http://www.streamlinerschedules.com/concourse/track1/silvercomet194706.html). Those timetables only include station names, so we will have to look up latitude and longitude values for all of the stations in order to place them on a map. We can also calculate the time difference between stops, in minutes. Those calculations result in two arrays, one for each train.

``` {.javascript .numberLines}
var seaboard = [
    { "stop": "Washington", "latitude": 38.895111, "longitude": -77.036667, "duration": 77 },
    { "stop": "Fredericksburg", "latitude": 38.301806, "longitude": -77.470833, "duration": 89 },
    { "stop": "Richmond", "latitude": 37.533333, "longitude": -77.466667, "duration": 29 },
    // Data set continues...
];
var southern = [
    { "stop": "Washington", "latitude": 38.895111, "longitude": -77.036667, "duration": 14 },
    { "stop": "Alexandria", "latitude": 38.804722, "longitude": -77.047222, "duration": 116 },
    { "stop": "Charlottesville", "latitude": 38.0299, "longitude": -78.479, "duration": 77 },
    // Data set continues...
];
```

### Step 2: Set up the Web Page and Libraries

To add Leaflet maps to our web page we'll need to include the library and its companion style sheet. Both are available from a content distribution network, so there's no need to host them on our own servers. When we create our page we also define a `<div>` container for the map in line 9.

``` {.html .numberLines}
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title></title>
    <link rel="stylesheet" href="http://cdn.leafletjs.com/leaflet-0.7.2/leaflet.css" />
  </head>
  <body>
    <div id="map"></div>
    <script src="http://cdn.leafletjs.com/leaflet-0.7.2/leaflet.js"></script>
  </body>
</html>
```

### Step 3: Draw the Base Map

Although the _Silver Comet_ and _The Southerner_ traveled between New York and Birmingham (and, in the case of The Southerner, all the way to New Orleans), the region that's relevant for our visualization lies between Washington, DC and Atlanta, GA. For the rest of their journeys the routes were essentially the same. Our map, therefore, will extend from Atlanta in the south west to Washington in the north east. Using a bit of trial and error we can determine the best center point and zoom level for the map. The center point defines the latitude and longitude for the map's center, and the zoom level determines the area covered by the map on its initial i display. When we create the map object, we give it the `id` of the containing element as well as those parameters.

``` {.javascript .numberLines}```
var map = L.map('map',{
    center: [36.3, -80.2],
    zoom: 7
});
```

For this particular visualization, there is little point in zooming or panning the map. When we create the map object, we can include additional options to disable those interactions. Setting both the minimum zoom level (line 5) and the maximum zoom level (line 6) to be equal to the initial zoom level disables zooming. We'll also disable the on-screen map controls for zooming in line 8. The other zoom controls are likewise disabled (lines 9 through 12). For panning, we disable dragging the map (line 7) and keyboard arrow keys (line 13). We also specify the latitude/longitude bounds for the map (line 3).

``` {.javascript .numberLines}```
var map = L.map('map',{
    center: [36.3, -80.2],
    maxBounds: [ [33.32134852669881, -85.20996093749999], [39.16414104768742, -75.9814453125] ],
    zoom: 7,
    minZoom: 7,
    maxZoom: 7,
    dragging: false,
    zoomControl: false,
    touchZoom: false,
    scrollWheelZoom: false,
    doubleClickZoom: false,
    boxZoom: false,
    keyboard: false
});
```

Because we've disabled the ability of the user to pan or zoom the map, we should also make sure the mouse cursor doesn't mislead the user when hovering over the map. The `leaflet.css` style sheet expects zooming and panning to be enabled, so it sets the cursor to a "grabbing" hand icon. We can override that value with a style rule of our own. We have to define this rule **after** the `leaflet.css` file is included.

``` {.css .numberLines}
.leaflet-container {
    cursor: default;
}
```

As with the Modest Maps example, we base our map on a set of tiles. There are many tile providers that support Leaflet; some are open source while others are commercial. Leaflet has a [demo page](http://leaflet-extras.github.io/leaflet-providers/preview/) you can use to compare some of the open source tile providers. For our example we want to avoid tiles with roads, as the highway network looked very different in the 1940s. Esri has a neutral _WorldGrayCanvas_ set that works well for our visualization. It does include current county boundaries, and some counties may have changed their borders since the 1940s. For our example we won't worry about that detail, though you might consider it in any production visualization. Leaflet's API let's us create the tile layer and add it to the map in a single statement. Note that Leaflet includes a built-in option to handle attribution so we can be sure to credit the tile source appropriately.

``` {.javascript .numberLines}
L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
     attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ',
     maxZoom: 16
}).addTo(map);
```

The `maxZoom` option for the tile layer in line 3 indicates the maximum zoom layer available for tile set. That value is independent of the zoom level we're permitting for our map, so we leave it the value appropriate for these tiles.

With a map and a base tile layer, we have a good starting point for our visualization in figure NEXTFIGURENUMBER.

<style>
.leaflet-container { cursor: default; }
</style>
<figure style="margin-left:0;margin-right:0;">
<div id="map-library-1" style="width:840px;height:660px"></div>
<figcaption>A base layer map provides the canvas for a visualization.</figcaption>
</figure>

### Step 4: Add the Routes to the Map

For the next step in our visualization, we want to show the two routes on our map. Initially the effect will be subtle, just enough to give users some context for the visualization. In later steps we'll add more dramatic effects. The Leaflet library includes a function that does exactly what we want: `polyline()` connects a series of lines defined by the latitude and longitude of their endpoints and prepares them for a map. Our data set includes the geographic coordinates of each route's stops, so we can use the JavaScript `map()` method to format those values for Leaflet. For the Silver Comet example, the following statement extracts its stops.

``` {.javascript .numberLines}
seaboard.map(function(stop) {
    return [stop.latitude, stop.longitude]
})
```

This statement returns an array of latitude/longitude pairs:

``` {.javascript .numberLines}
[ [38.895111,-77.036667], [38.301806,-77.470833], [37.533333,-77.466667], [37.21295,-77.400417], /* Data set continues... */ ]
```

That result is the perfect input to the `polyline` function. We'll use it for each of the routes. The options let us specify a color for the lines which we'll match with the associated railroad's official color from the era. We also indicate that the lines have no function when clicked by setting the `clickable` option to `false`.

``` {.javascript .numberLines}
L.polyline(
    seaboard.map(function(stop) {return [stop.latitude, stop.longitude]}),
    {color: "#88020B", weight: 1, clickable: false}
).addTo(map);

L.polyline(
    southern.map(function(stop) {return [stop.latitude, stop.longitude]}),
    {color: "#106634", weight: 1, clickable: false}
).addTo(map);
```

With this addition the visualization of figure NEXTFIGURENUMBER is starting to clarify the relative distances of the two routes.

<figure style="margin-left:0;margin-right:0;">
<div id="map-library-2" style="width:840px;height:660px"></div>
<figcaption>Additional map layers add data to the canvas.</figcaption>
</figure>

### Step 5: Add an Animation Control

To emphasize the competitive advantage the shorter route offers, we can animate the two routes. This effect can also make the visualization more interesting and engaging. We'll definitely want to let our users start and stop the animation, so our map will need a control button. The Leaflet library doesn't have its own animation control, but the library does have a lot of support for customizations. Part of that support is a generic `Control` object. We can create an animation control by starting with that object and extending it.

``` {.javascript .numberLines}
L.Control.Animate = L.Control.extend({
    // custom code goes here
});
```

Next we define the options our custom control supports. Those options include its position on the map, the text and tooltip (title) for its states, and functions to call when the animation starts or stops. By defining those within an `options` object we let Leaflet integrate it within the normal Leaflet functionality.

``` {.javascript .numberLines}
L.Control.Animate = L.Control.extend({
    options: {
        position: 'topleft',
        animateStartText: '▶︎',
        animateStartTitle: 'Start animation',
        animatePauseText: '◼︎',
        animatePauseTitle: 'Pause animation',
        animateResumeText: '▶︎',
        animateResumeTitle: 'Resume animation',
        animateStartFn: null,
        animateStopFn: null
    },
```

For our example we're using UTF-8 characters for the play and pause control. In a production visualization you might consider using icon fonts or images to have maximum control over the appearance.

Our animation control also needs an `onAdd()` method for Leaflet to call when it adds a control to a map. That method constructs the HTML markup for the control and returns that to the caller. Our implementation does this in two stages. First it creates a `<div>` element and gives that element two classes: `leaflet-control-animate` and `leaflet-bar`. The first class is unique to our animation control, and we can use it to apply CSS rules uniquely to our control. The second class is a general Leaflet class for all toolbars. By adding it to the animation control we're making that control consistent with other Leaflet controls. Note that Leaflet includes the `L.DomUtil.create()` method to handle the details of creating the element.

The second part of `onAdd()` creates a button element within this `<div>` container. Most of the work takes place in the `_createButton()` function which we'll examine shortly. The parameters to the function include:

* the text for the button,
* the tooltip (title) to display when the mouse hovers over the button,
* the CSS class to apply to the button,
* the container in which to insert the button, and
* a function to call when the button is clicked.

``` {.javascript .numberLines}
    onAdd: function () {
        var animateName = 'leaflet-control-animate',
            container = L.DomUtil.create('div', animateName + ' leaflet-bar'),
            options = this.options;

        this._button  = this._createButton(this.options.animateStartText, 
            this.options.animateStartTitle, animateName,  container, this._clicked);

        return container;
    },
```

If you're wondering why the name of this function begins with an underscore (_), that's the convention that Leaflet uses for private methods (and attributes). It's only a convention so there's no requirement to follow it, but doing so will make it easier for someone familiar with Leaflet to understand our code.

The `_createButton()` method itself relies on Leaflet utility functions. It creates the button as an `<a>` element with the specified text, title, and class, and it creates that element within the appropriate container (lines 2-5). It then binds several events to this `<a>` element. First it ignores initial `mousedown` and double-click events (line 8). It also prevents standard `click` events from propagating up the document tree and from implementing their default behavior (line 9). Finally, it executes the callback function on `click` events (line 10).

``` {.javascript .numberLines}
    _createButton: function (html, title, className, container, callback) {
        var link = L.DomUtil.create('a', className, container);
        link.innerHTML = html;
        link.href = '#';
        link.title = title;

        L.DomEvent
            .on(link, 'mousedown dblclick', L.DomEvent.stopPropagation)
            .on(link, 'click', L.DomEvent.stop)
            .on(link, 'click', callback, this);

        return link;
    },
```

The callback function itself is our next task. We'll add a single state variable to keep track of whether or not the animation is currently running. It starts out stopped (line 1). The callback function checks this variable. If the animation is running it changes the control to indicate that clicking will now resume it (since clicking on a running animation pauses it). If the animation isn't running, the callback function does the opposite. It changes the control to indicate that a subsequent click will pause it. In both cases the callback function executes the appropriate control function if one exists. Finally, it sets the state of the `_running` state variable to its complement.

``` {.javascript .numberLines}
    _running: false,
    
    _clicked: function() {
        if (this._running) {
            if (this.options.animateStopFn) {
                this.options.animateStopFn();
            }
            this._button.innerHTML = this.options.animateResumeText;
            this._button.title = this.options.animateResumeTitle;
        } else {
            if (this.options.animateStartFn) {
                this.options.animateStartFn();
            }
            this._button.innerHTML = this.options.animatePauseText;
            this._button.title = this.options.animatePauseTitle;
        }
        this._running = !this._running;
    },
```

The last part of our custom control adds a `reset()` method to clear the animation. This function sets the control back to its initial state.

``` {.javascript .numberLines}
    reset: function() {
        this._running = false;
        this._button.innerHTML = this.options.animateStartText;
        this._button.title = this.options.animateStartTitle;
    }
});
```

To completely integrate our custom control into the Leaflet architecture, we add a function to the `L.control` object. Following the Leaflet convention, this function's name begins with a lowercase letter but is otherwise identical to the name of our control.

``` {.javascript .numberLines}
L.control.animate = function (options) {
    return new L.Control.Animate(options);
};
```

Defining this last function let's us create the control using a common Leaflet syntax, in particular:

``` {.javascript .numberLines}
L.control.animate().addTo(map);
```

That's the same syntax we've seen before with layers and polylines.

### Step 6: Prepare the Animation

With a convenient user control in place we can now begin work on the animation itself. Although this particular animation isn't especially taxing, we can still follow best practices and compute as much as possible in advance. Since we're animating two routes, we'll define a function to build the animation for any input route. A second parameter will specify polyline options. This function will return an array of polyline paths, indexed by minutes. The first element in the array will be the polyline for the first minute of the route. We'll build the entire array in the `animation` variable.

``` {.javascript .numberLines}
var buildAnimation = function(route, options) {
    var animation = [];
    
    // Code to build the polylines

    return animation;
}
```

To build the paths we iterate through the stops on the route. We want to keep track of all the stops we've already passed, so we define the `prevStops` array and initialize it as empty. Each iteration calculates the animation steps for the current stop up to the next stop. There's no need to go beyond the final stop on the route, so we terminate the loop at the next-to-last stop (`stopIdx < route.length-1;`).


``` {.javascript .numberLines}
    for (var stopIdx=0, prevStops=[]; stopIdx < route.length-1; stopIdx++) {
        // Code to calculate steps between current stop and next stop
    }
```

As we start to calculate the paths beginning at the current stop, we'll store that stop and the next stop in local variables, and we add the current stop to the array that's keeping track of previous stops.

``` {.javascript .numberLines}
        var stop = route[stopIdx];
        var nextStop = route[stopIdx+1]
        prevStops.push([stop.latitude, stop.longitude]);
```

For each stop in our data sets, the `duration` property stores the number of minutes until the next stop. We'll use an inner loop to count from `1` up to that value. Within the loop we use a simple linear interpolation to calculate position at the corresponding time. That position, when appended to the previous stops array, is the polyline path for that time. We create a polyline based on the path and add it to the animation array.

``` {.javascript .numberLines}
        for (var minutes = 1; minutes <= stop.duration; minutes++) {
            var position = [
                stop.latitude +  (nextStop.latitude  - stop.latitude)  * (minutes/stop.duration),
                stop.longitude + (nextStop.longitude - stop.longitude) * (minutes/stop.duration)
            ];
            animation.push(L.polyline(prevStops.concat([position]), options));
        }
```

When we use the array `concat()` method we embed the position array within another array object. That keeps `concat()` from flattening the position array before appending it. You can see the difference in the following examples. It's the latter outcome that we want.

``` {.javascript .numberLines}
[[1,2], [3,4]].concat([5,6]);   // => [[1,2], [3,4], 5, 6]
[[1,2], [3,4]].concat([[5,6]]); // => [[1,2], [3,4], [5,6]]
```

### Step 7: Animate the Routes

Now it's finally time to execute the animation. To initialize it we create an array to hold the two routes.

``` {.javascript .numberLines}
var routeAnimations = [
    buildAnimation(seaboard, {clickable: false, color: "#88020B", weight: 8, opacity: 1.0}),
    buildAnimation(southern, {clickable: false, color: "#106634", weight: 8, opacity: 1.0})
];
```

Next we calculate the maximum number of animation steps. That's the minimum of the length of the two animation arrays.

``` {.javascript .numberLines}
var maxSteps = Math.min.apply(null, routeAnimations.map(function(animation) {return animation.length}));
```

That statement might seem overly complex for finding the minimum length, but it works with an arbitrary number of routes. If, in the future, we decided to animate a third route on our map, we wouldn't have to change the code. The best way to understand the statement is to start in the middle and work out. The fragment

``` {.javascript .numberLines}
routeAnimations.map(function(animation) {return animation.length})
```

converts the array of route animations into an array of lengths, specifically `[870,775]`.

To find the minimum value in an array we can use the `Math.min` function, except that function expects its parameters as a comma-separated list of arguments rather than an array. The `apply()` method (which is available for any JavaScript function) converts an array into a comma-separated list. Its first parameter is a context for the function which, in our case is irrelevant. We pass `null` for that parameter.

The animation keeps track of its current state with the `step` variable, which we initialize to `0`.

``` {.javascript .numberLines}
var step = 0;
```

The `animateStep()` function processes each step in the animation. There are four parts to this function.

``` {.javascript .numberLines}
var animateStep = function() {
    // Draw the next step in the animation
}
```

First we check to see whether or not this is the very first step in the animation. If it isn't, then we remove the previous step's polylines from the map.

``` {.javascript .numberLines}
    if (step > 0) {
        routeAnimations.forEach(function(animation) {
            map.removeLayer(animation[step-1]);
        });
    }
```

Next we check to see if we're already at the end of the animation. If so, then we restart the animation back at step 0.

``` {.javascript .numberLines}
    if (step === maxSteps) {
        step = 0;
    }
```

For the third part we add the current step's polylines to the map.

``` {.javascript .numberLines}
    routeAnimations.forEach(function(animation) {
        map.addLayer(animation[step]);
    });
```

Finally, we return `true` if we've reached the end of the animation.

``` {.javascript .numberLines}
    return ++step === maxSteps;
```

We'll execute this step function repeatedly in a JavaScript interval. We use a variable to keep a reference to that interval and add functions to start and stop it. In the `animate()` function we check the return value from `animateStep()`. When it returns `true` the animation is complete so we clear the interval and reset our control. (We'll see where that control is defined shortly.) The `pause()` function stops the interval.

``` {.javascript .numberLines}
var interval = null;
var animate = function() {
    interval = window.setInterval(function() {
        if (animateStep()) {
            window.clearInterval(interval);
            control.reset();
        }
    }, 30);
}
var pause = function() {
    window.clearInterval(interval);
}
```

Now all we need to do is define the animation control using the object we created in step 5. Once we add it to the map, the user will be able to activate the animation.

``` {.javascript .numberLines}
var control = L.control.animate({
    animateStartFn: animate,
    animateStopFn:  pause
});
control.addTo(map);
```

### Step 8: Create Labels for the Stops

Before we wrap up the animation we'll add some excitement to the visualization with labels for the trains' stops. To emphasize the passage of time, we'll reveal each label as the animation reaches the corresponding stop. Since Leaflet doesn't have a predefined object for labels, we can once again create our own custom object. We start with the basic Leaflet `Class`.

``` {.javascript .numberLines}
L.Label = L.Class.extend({
    // Implement the Label object
});
```

Our `Label` object accepts parameters for its position on the map, its label text, and any options. We extend the `initialize()` method of the Leaflet `Class` to handle those parameters. For position and text we simply save their values for later use. For the options we can use a Leaflet utility to easily support default values. The object includes one variable to keep track of its status. Initially all labels are hidden, so `this._status` is initialized appropriately.

``` {.javascript .numberLines}
    initialize: function(latLng, label, options) {
        this._latlng = latLng;
        this._label = label;
        L.Util.setOptions(this, options);
        this._status = "hidden";
    },
```

We define the default option values with the `options` attribute. The only option we need for our label is an offset for the standard position. By default, that offset will be 0 in both the x- and y-coordinates.

``` {.javascript .numberLines}
    options: {
        offset: new L.Point(0, 0)
    },
});
```

This `options` attribute, combined with the call to `L.Util.setOptions` in the `initialize` method, establishes a default value (`0,0`) for the offset that can be easily overridden when a `Label` object is created.

Next we write the method that adds a label to a map. This method

1. creates a new `<div>` element with the CSS class `leaflet-label` (line 2),
2. sets the `line-height` of that element to `0` to work around a quirk in the way Leaflet calculates position (line 3),
3. sets the `opacity` of the element to `0` to match its initial `hidden` status (line 4),
4. adds the new element to the `markerPane` layer in the map (line 5),
5. sets the contents of the element to the label text (line 6),
6. calculates a position for the label using its defined latitude/longitude (line 7) and then adjusting for any offset (line 8), and
7. positions the element on the map (line 9).

``` {.javascript .numberLines}
    onAdd: function(map) {
        this._container = L.DomUtil.create("div", "leaflet-label");
        this._container.style.lineHeight = "0";
        this._container.style.opacity = "0";
        map.getPanes().markerPane.appendChild(this._container);
        this._container.innerHTML = this._label;
        var position = map.latLngToLayerPoint(this._latlng);
        position = new L.Point(position.x + this.options.offset.x, position.y + this.options.offset.y);
        L.DomUtil.setPosition(this._container, position);
    },
```

> Step 2 above, setting the `line-height` to `0`, addresses a problem in the method Leaflet uses to position elements on the map. In particular, Leaflet does not account for other elements in the same parent container. By setting all elements to have no line height, we nullify their effect so that the calculated position is correct.

Finally we add methods to get and set the label's status. As the code below indicates, our labels can have three different status values, and those values determine the opacity of the label.

``` {.javascript .numberLines}
    getStatus: function() {
        return this._status;
    },
    setStatus: function(status) {
        switch (status) {
            case "hidden":
                this._status = "hidden";
                this._container.style.opacity = "0";
                break;
            case "shown":
                this._status = "shown";
                this._container.style.opacity = "1";
                break;
            case "dimmed":
                this._status = "dimmed";
                this._container.style.opacity = "0.5";
                break;
        }
    }
```

We included the option to adjust the label's position because not all labels will look good positioned exactly on the latitude and longitude of the station. Most will benefit from slight shifts to avoid interference with the route polylines, text on the base map tiles, or other labels. For a custom visualization such as this example, there's no substitute for trial and error adjustments. We'll capture those adjustments by adding an additional field to our data set. The augmented data set might begin as in the following.

``` {.javascript .numberLines}
var seaboard = [
{ "stop": "Washington",     "offset": [-30,-10], /* Data continues... */ },
{ "stop": "Fredericksburg", "offset": [  6,  4], /* Data continues... */ },
{ "stop": "Richmond",       "offset": [  6,  4], /* Data continues... */ },
// Data set continues...
```

### Step 9: Build the Label Animation

To create the label animation we can once again iterate through the trains' routes. Because we have more than one route, a general purpose function will let us avoid duplicating code. As you can see from the code below we're not using a fixed number of arguments to our function. Instead we let the caller pass in as many individual routes as desired. All of those input parameters will be stored in the `arguments` object.

The `arguments` object looks a lot like a JavaScript array. It has a `length` property, and individual elements are accessible using, for example, `arguments[0]`. Unfortunately, the object isn't a true array, so we can't use the convenient array methods (such as `forEach`) on it. The very first statement in our function, however, relies on a simple trick to convert the `arguments` object into the true `args` array.  It's a bit long-winded, but the statement effectively executes the `slice` method on `arguments`. That operation clones `arguments` into a true array.

> This same trick works for nearly all of JavaScript's "array-like" objects. You can often use it to convert them into true arrays.

``` {.javascript .numberLines}
var buildLabelAnimation = function() {
    var args = Array.prototype.slice.call(arguments),
        labels = [];

    // Calculate label animation values

    return labels;
}
```

With the routes converted into an array, we can use `forEach` to iterate through all of them, regardless of their number. As we begin processing each route we set the `minutes` value to zero. We can then iterate through all the stops on the route.

``` {.javascript .numberLines}
    args.forEach(function(route) {
        var minutes = 0;
        route.forEach(function(stop,idx) {
            // process each stop on the route
        });
    });
```

For each stop in the route we first check to see whether that stop is the first or last one. If so, we don't want to animate a label for that stop. Otherwise we create a new `Label` object and add it to the map. Then we append that Label object to the `labels` array that's accumulating the label animation data. Notice that we add each label to this array twice. The first time we add it at the time the animation reaches the stop; in this case we add it with an indicated status of `shown`. We also add the label to the array 50 minutes later, this time with a status of `dimmed`. When we execute the animation that will show the label when the route first reaches the station and then dim it a bit later.

``` {.javascript .numberLines}
        route.forEach(function(stop,idx) {
            if (idx !== 0 && idx < route.length-1) {
                var label = new L.Label(
                    [stop.latitude, stop.longitude], 
                    stop.stop, 
                    {offset: new L.Point(stop.offset[0], stop.offset[1])}
                );
                map.addLayer(label);
                labels.push({minutes: minutes, label: label, status: "shown"});
                labels.push({minutes: minutes+50, label: label, status: "dimmed"});
            }
            minutes += stop.duration;
        });
```

Once we've iterated through all the routes, our `labels` array will indicate when each label should change status. At this point, though, the labels aren't listed in the order of their animation state changes. To fix that, we sort the array in order of increasing time.

``` {.javascript .numberLines}
    labels.sort(function(a,b) {return a.minutes - b.minutes;})
```

To use our new function, we call and pass in all the routes to animate.

``` {.javascript .numberLines}
var labels = buildLabelAnimation(seaboard, southern);
```

Because we're not animating the start (Washington, DC) or end (Atlanta, GA) of any routes, we can go ahead and display those on the map from the start. We can get the coordinates from any route; the example below uses the `seaboard` data set.

``` {.javascript .numberLines}
var start = seaboard[0];
var label = new L.Label(
    [start.latitude, start.longitude], 
    start.stop, 
    {offset: new L.Point(start.offset[0], start.offset[1])}
);
map.addLayer(label);
label.setStatus("shown");

var finish = seaboard[seaboard.length-1];
label = new L.Label(
    [finish.latitude, finish.longitude], 
    finish.stop, 
    {offset: new L.Point(finish.offset[0], finish.offset[1])}
);
map.addLayer(label);
label.setStatus("shown");
```

### Step 10: Incorporate Label Animation in the Animation Step

Now that the label animation data is available, we can make some adjustments to our animation function to incorporate the labels as well as the polyline paths. The first change is deciding when to conclude the animation. Because we're dimming the labels some time after the route passes their stops, we can't simply stop when all the paths are drawn. That might leave some labels undimmed. We'll need separate variables for both animations, and the total number of animation steps will be whichever is greater.

``` {.javascript .numberLines}
var maxPathSteps = Math.min.apply(null,routeAnimations.map(function(animation) {return animation.length}));
var maxLabelSteps = labels[labels.length-1].minutes;
var maxSteps = Math.max(maxPathSteps, maxLabelSteps);
```

We also need a copy of the label animation data that we can destroy during the animation. We don't want to destroy the original so that users can replay the animation if they wish. The easiest way to copy a JavaScript array is by calling its `slice(0)` method.

> We can't simply copy the array using an assignment statement (`var labelAnimation = labels`). In JavaScript this statement would simply set `labelAnimation` to reference the same actual array as `labels`. Any changes made to the first would also affect the latter.

``` {.javascript .numberLines}
var labelAnimation = labels.slice(0);
```

The animation step function itself needs some additional code to handle labels. It will now have five major parts; we'll walk through each of them in the code that follows. Our first adjustment is in the code that removes previous polyline paths. We only want to do that if we're still adding paths to the map. That's only true when `step` is less than `maxPathSteps`.

``` {.javascript .numberLines}
    if (step > 0 && step < maxPathSteps) {
        routeAnimations.forEach(function(animation) {
            map.removeLayer(animation[step-1]);
        });
    }
```

The next block handles the case in which the user replays the animation. When that happens, the `step` value will still be set to `maxSteps` from the prior animation. To reset the animation we remove the last polyline paths for each route (lines 2-4), make a new copy of the label animation data (line 5), and hide all the labels (lines 6-8). We also reset the `step` variable to `0` (line 9).

``` {.javascript .numberLines}
    if (step === maxSteps) {
        routeAnimations.forEach(function(animation) {
            map.removeLayer(animation[maxPathSteps-1]);
        });
        labelAnimation = labels.slice(0);
        labelAnimation.forEach(function(label) {
            label.label.setStatus("hidden");
        });
        step = 0;
    }
```

The third block is a completely new block that animates the labels. It looks at the first element in the `labelAnimation` array, if one exists. If the time value for that element (its `minutes` property) is the same as the animation step, then we check to see if we need to process it. We always process label animations when we're still adding the paths. If the paths are complete, though, we only process animations for labels that are already shown. Once we're finished with the first element in `labelAnimation` we remove it from the array (using the `shift()` method) and check again. We must keep checking in case multiple label animation actions are scheduled at the same time.

``` {.javascript .numberLines}
    while (labelAnimation.length && step === labelAnimation[0].minutes) {
        var label = labelAnimation[0].label;
        if (step < maxPathSteps || label.getStatus() === "shown") {
            label.setStatus(labelAnimation[0].status);
        }
        labelAnimation.shift();       
    }
```

The code above explains a couple of things about our label animation preparation. First, because we sorted the label animation we only need to look at the first element in that array. That's much more efficient than searching through the entire array. Secondly, because we're working with a copy of the label animation array instead of the original, it's safe to remove elements once we finish processing them.

Now that we've handled all the label animations we can return to the polyline paths. As long as there are still paths to animate, we add them to the map as before.

``` {.javascript .numberLines}
    if (step < maxPathSteps) {
        routeAnimations.forEach(function(animation) {
            map.addLayer(animation[step]);
        });
    }
```

The final code block in our animation step function is the same as before. We return an indication of whether or not the animation is complete.

``` {.javascript .numberLines}
    return ++step === maxSteps;
```

There's one more improvement we can make the animation, in this case with a judicious bit of CSS. Because we use the `opacity` property to change the status of the labels, we can define a CSS transition for that property that will make any changes less abrupt. To accommodate all popular browsers we use appropriate vendor prefixes, but the effect of the rule is consistent. Whenever the browser changes the opacity of elements within a `leaflet-label` class, it will ease the transition in and out over a 500 millisecond period. This transition prevents the label animations from distracting users too much from the path animation that is the visualization's main effect.

``` {.css .numberLines}
.leaflet-label {
   -webkit-transition: opacity .5s ease-in-out;
      -moz-transition: opacity .5s ease-in-out;
       -ms-transition: opacity .5s ease-in-out;
        -o-transition: opacity .5s ease-in-out;
           transition: opacity .5s ease-in-out;
}
```

### Step 11: Add a Title

To complete the visualization all we need is a title and a bit of explanation. We can build the title as a Leaflet Control, much as we did for the animation control. The code to do this is quite straightforward. We provide a default position in the top left of the map and accept a title string as an initialization parameter. That title string becomes the `innerHTML` of the control when we add it to the map.

``` {.javascript .numberLines}
L.Control.Title = L.Control.extend({
    options: {
        position: "topleft"
    },

    initialize: function (title, options) {
        L.setOptions(this, options);
        this._title = title;
    },

    onAdd: function (map) {
        var container = L.DomUtil.create('div', 'leaflet-control-title');
        container.innerHTML = this._title;
        return container;
    }
});

L.control.title = function(title, options) {
    return new L.Control.Title(title, options);
};
```

The code to add the title creates a Title object with our desired content and immediately adds it to the map.

``` {.javascript .numberLines}
L.control.title("Geography as a Competitive Advantage").addTo(map);
```

To set the title's appearance, we can define CSS rules for children of the `leaflet-control-title` class.

At this point we have the interactive visualization of the two train routes in figure NEXTFIGURENUMBER. Our users can clearly see that the Southerner has a quicker route from Washington to Atlanta.

<style>
.leaflet-label {
   -webkit-transition: opacity .5s ease-in-out;
      -moz-transition: opacity .5s ease-in-out;
       -ms-transition: opacity .5s ease-in-out;
        -o-transition: opacity .5s ease-in-out;
           transition: opacity .5s ease-in-out;
}
.leaflet-top .leaflet-control-title,
.leaflet-left .leaflet-control-title {
    margin: 0;
    padding-left: 10px;
    padding-top: 0;
    width: 450px;
    background-color: white;
    background-color: rgba(255,255,255,0.8);
    border: 1px solid #CECDD2;
}
.leaflet-control-title h1 {
    font-family: 'Helvetica Neue', Arial, Helvetica, sans-serif;
    font-size: 22px;
    margin: 0;
}
.leaflet-control-title p {
    padding-right: 15px;
    -webkit-hyphens: auto;
    hyphens: auto;
}
.seaboard {color: #88020B;}
.southern {color: #106634;}
.seaboard, .southern {
    position: relative;
    top: 1px;
}
</style>

<figure style="margin-left:0;margin-right:0;">
<div id="map-library-3" style="width:840px;height:660px"></div>
<figcaption>Maps built in the browser with a map library can use interactivity to build interest.</figcaption>
</figure>



<script>
contentLoaded.done(function() {


var seaboard = [
    { "stop": "Washington",     "latitude": 38.895111, "longitude": -77.036667, "duration":  77, "offset": [-30,-10] },
    { "stop": "Fredericksburg", "latitude": 38.301806, "longitude": -77.470833, "duration":  89, "offset": [  6,  4] },
    { "stop": "Richmond",       "latitude": 37.533333, "longitude": -77.466667, "duration":  29, "offset": [  6,  4] },
    { "stop": "Petersburg",     "latitude": 37.21295,  "longitude": -77.400417, "duration":  93, "offset": [  6,  4] },
    { "stop": "Henderson",      "latitude": 36.324722, "longitude": -78.408611, "duration":  44, "offset": [  6,  4] },
    { "stop": "Raleigh",        "latitude": 35.818889, "longitude": -78.644722, "duration": 116, "offset": [  6,  4] },
    { "stop": "Hamlet",         "latitude": 34.888056, "longitude": -79.706111, "duration":  74, "offset": [  6,  6] },
    { "stop": "Monroe",         "latitude": 34.988889, "longitude": -80.549722, "duration":  58, "offset": [  6, -8] },
    { "stop": "Chester",        "latitude": 34.705556, "longitude": -81.211667, "duration":  54, "offset": [  6,  6] },
    { "stop": "Clinton",        "latitude": 34.471389, "longitude": -81.875,    "duration":  34, "offset": [  6,  6] },
    { "stop": "Greenwood",      "latitude": 34.189722, "longitude": -82.154722, "duration":  22, "offset": [ 10, -2] },
    { "stop": "Abbeville",      "latitude": 34.178611, "longitude": -82.379167, "duration":  39, "offset": [  4, 10] },
    { "stop": "Elberton",       "latitude": 34.109722, "longitude": -82.865556, "duration":  41, "offset": [  6, 10] },
    { "stop": "Athens",         "latitude": 33.95,     "longitude": -83.383333, "duration":  75, "offset": [  6,  6] },
    { "stop": "Emory",          "latitude": 33.791111, "longitude": -84.323333, "duration":  25, "offset": [ 10,  4] },
    { "stop": "Atlanta",        "latitude": 33.755,    "longitude": -84.39,     "duration":   0, "offset": [-21, 10] }
];

var southern = [
    { "stop": "Washington",      "latitude": 38.895111, "longitude": -77.036667, "duration":  14, "offset": [-30,-10] },
    { "stop": "Alexandria",      "latitude": 38.804722, "longitude": -77.047222, "duration": 116, "offset": [  4,  4] },
    { "stop": "Charlottesville", "latitude": 38.0299,   "longitude": -78.479,    "duration":  77, "offset": [-85,  0] },
    { "stop": "Lynchburg",       "latitude": 37.403672, "longitude": -79.170205, "duration":  71, "offset": [-62,  0] },
    { "stop": "Danville",        "latitude": 36.587238, "longitude": -79.404404, "duration":  64, "offset": [-48, -1] },
    { "stop": "Greensboro",      "latitude": 36.08,     "longitude": -79.819444, "duration":  18, "offset": [-69, -4] },
    { "stop": "High Point",      "latitude": 35.970556, "longitude": -79.9975,   "duration":  47, "offset": [  5,  7] },
    { "stop": "Salisbury",       "latitude": 35.668333, "longitude": -80.478611, "duration":  50, "offset": [-57,  0] },
    { "stop": "Charlotte",       "latitude": 35.226944, "longitude": -80.843333, "duration":  25, "offset": [  8,  0] },
    { "stop": "Gastonia",        "latitude": 35.255278, "longitude": -81.180278, "duration":  63, "offset": [-26,-10] },
    { "stop": "Spartanburg",     "latitude": 34.946667, "longitude": -81.9275,   "duration":  43, "offset": [-80, -7] },
    { "stop": "Greenville",      "latitude": 34.844444, "longitude": -82.385556, "duration": 187, "offset": [-70,  2] },
    { "stop": "Atlanta",         "latitude": 33.755,    "longitude": -84.39,     "duration":   0, "offset": [-21, 10] }
];

var map1 = L.map('map-library-1',{
    center: [36.3, -80.6],
    maxBounds: [ [33.32134852669881, -85.20996093749999], [39.16414104768742, -75.9814453125] ],
    zoom: 7,
    minZoom: 7,
    maxZoom: 7,
    dragging: false,
    zoomControl: false,
    touchZoom: false,
    scrollWheelZoom: false,
    doubleClickZoom: false,
    boxZoom: false,
    keyboard: false
});

L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
     attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ',
     maxZoom: 16
}).addTo(map1);

var map2 = L.map('map-library-2',{
    center: [36.3, -80.6],
    maxBounds: [ [33.32134852669881, -85.20996093749999], [39.16414104768742, -75.9814453125] ],
    zoom: 7,
    minZoom: 7,
    maxZoom: 7,
    dragging: false,
    zoomControl: false,
    touchZoom: false,
    scrollWheelZoom: false,
    doubleClickZoom: false,
    boxZoom: false,
    keyboard: false
});

L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
     attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ',
     maxZoom: 16
}).addTo(map2);
 
L.polyline(
    seaboard.map(function(stop) {return [stop.latitude, stop.longitude]}),
    {clickable: false, color: "#88020B", weight: 1}
).addTo(map2);

L.polyline(
    southern.map(function(stop) {return [stop.latitude, stop.longitude]}),
    {clickable: false, color: "#106634", weight: 1}
).addTo(map2);



var map3 = L.map('map-library-3',{
    center: [36.3, -80.6],
    maxBounds: [ [33.32134852669881, -85.20996093749999], [39.16414104768742, -75.9814453125] ],
    zoom: 7,
    minZoom: 7,
    maxZoom: 7,
    dragging: false,
    zoomControl: false,
    touchZoom: false,
    scrollWheelZoom: false,
    doubleClickZoom: false,
    boxZoom: false,
    keyboard: false
});

L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
     attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ',
     maxZoom: 16
}).addTo(map3);

L.polyline(
    seaboard.map(function(stop) {return [stop.latitude, stop.longitude]}),
    {clickable: false, color: "#88020B", weight: 1}
).addTo(map3);

L.polyline(
    southern.map(function(stop) {return [stop.latitude, stop.longitude]}),
    {clickable: false, color: "#106634", weight: 1}
).addTo(map3);


L.Control.Animate = L.Control.extend({
    options: {
        position: 'bottomleft',
        animateStartText: '▶︎',
        animateStartTitle: 'Start animation',
        animatePauseText: '◼︎',
        animatePauseTitle: 'Pause animation',
        animateResumeText: '▶︎',
        animateResumeTitle: 'Resume animation',
        animateStartFn: null,
        animateStopFn: null
    },
    
    onAdd: function () {
        var animateName = 'leaflet-control-animate',
            container = L.DomUtil.create('div', animateName + ' leaflet-bar'),
            options = this.options;

        this._button  = this._createButton(options.animateStartText, options.animateStartTitle,
                animateName,  container, this._clicked);

        return container;
    },

    _createButton: function (html, title, className, container, fn) {
        var link = L.DomUtil.create('a', className, container);
        link.innerHTML = html;
        link.href = '#';
        link.title = title;

        L.DomEvent
            .on(link, 'mousedown dblclick', L.DomEvent.stopPropagation)
            .on(link, 'click', L.DomEvent.stop)
            .on(link, 'click', fn, this);

        return link;
    },
    
    _running: false,
    
    _clicked: function() {
        if (this._running) {
            this._button.innerHTML = this.options.animateResumeText;
            this._button.title = this.options.animateResumeTitle;
            if (this.options.animateStopFn) {
                this.options.animateStopFn();
            }
        } else {
            this._button.innerHTML = this.options.animatePauseText;
            this._button.title = this.options.animatePauseTitle;
            if (this.options.animateStartFn) {
                this.options.animateStartFn();
            }
        }
        this._running = !this._running;
    },
    
    reset: function() {
        this._running = false;
        this._button.innerHTML = this.options.animateStartText;
        this._button.title = this.options.animateStartTitle;
    }
});

L.control.animate = function(options) {
    return new L.Control.Animate(options);
};

var buildAnimation = function(route, options) {
    var animation = [];

    for (var stopIdx=0, prevStops=[]; stopIdx < route.length-1; stopIdx++) {
	    var stop = route[stopIdx];
	    var nextStop = route[stopIdx+1]
	    prevStops.push([stop.latitude, stop.longitude]);
	    for (var minutes = 1; minutes <= stop.duration; minutes++) {
	        var position = [
	            stop.latitude +  (nextStop.latitude  - stop.latitude)  * (minutes/stop.duration),
	            stop.longitude + (nextStop.longitude - stop.longitude) * (minutes/stop.duration)
	        ];
	        animation.push(L.polyline(prevStops.concat([position]),options));
	    }
	}
	return animation;
}


L.Label = L.Class.extend({
    initialize: function(latLng, label, options) {
        this._latlng = latLng;
        this._label = label;
        L.Util.setOptions(this, options);
        this._status = "hidden";
    },
    options: {
        offset: new L.Point(0, 0)
    },
    onAdd: function(map) {
        this._container = L.DomUtil.create('div', 'leaflet-label');
        this._container.style.lineHeight = "0";
        this._container.style.opacity = "0";
        map.getPanes().markerPane.appendChild(this._container);
        this._container.innerHTML = this._label;
        var pos = map.latLngToLayerPoint(this._latlng);
        var op = new L.Point(pos.x + this.options.offset.x, pos.y + this.options.offset.y);
        L.DomUtil.setPosition(this._container, op);
    },
    getStatus: function() {
        return this._status;
    },
    setStatus: function(status) {
        switch (status) {
            case "hidden":
                this._status = "hidden";
                this._container.style.opacity = "0";
                break;
            case "shown":
                this._status = "shown";
                this._container.style.opacity = "1";
                break;
            case "dimmed":
                this._status = "dimmed";
                this._container.style.opacity = "0.5";
                break;
        }
    }
});

var start = seaboard[0];
var label = new L.Label([start.latitude,start.longitude], start.stop, {offset: new L.Point(start.offset[0], start.offset[1])});
map3.addLayer(label);
label.setStatus("shown");
var finish = seaboard[seaboard.length-1];
label = new L.Label([finish.latitude,finish.longitude], finish.stop, {offset: new L.Point(finish.offset[0], finish.offset[1])});
map3.addLayer(label);
label.setStatus("shown");


var buildLabelAnimation = function() {
    var args = Array.prototype.slice.call(arguments),
        labels = [];
    
    args.forEach(function(route) {
        var minutes = 0;
        route.forEach(function(stop,idx) {
            if (idx !== 0 && idx < route.length-1) {
                var label = new L.Label([stop.latitude,stop.longitude], stop.stop, {offset: new L.Point(stop.offset[0], stop.offset[1])});
                map3.addLayer(label);
                labels.push({minutes: minutes, label: label, status: "shown"});
                labels.push({minutes: minutes+50, label: label, status: "dimmed"});
            }
            minutes += stop.duration;
        });
    });

    labels.sort(function(a,b) {return a.minutes - b.minutes;})
    
    return labels;
}

var labels = buildLabelAnimation(seaboard, southern);
var labelAnimation = labels.slice(0);

var routeAnimations = [
    buildAnimation(seaboard, {clickable: false, color: "#88020B", weight: 8, opacity: 1.0}),
    buildAnimation(southern, {clickable: false, color: "#106634", weight: 8, opacity: 1.0})
];
var maxPathSteps = Math.min.apply(null,routeAnimations.map(function(animation) {return animation.length}));
var maxLabelSteps = labels[labels.length-1].minutes;
var maxSteps = Math.max(maxPathSteps, maxLabelSteps);
var step = 0;
var animateStep = function() {
    if (step > 0 && step < maxPathSteps) {
        routeAnimations.forEach(function(animation) {
            map3.removeLayer(animation[step-1]);
        });
    }
    if (step === maxSteps) {
        routeAnimations.forEach(function(animation) {
            map3.removeLayer(animation[maxPathSteps-1]);
        });
        step = 0;
        labelAnimation = labels.slice(0);
        labelAnimation.forEach(function(label) {
            label.label.setStatus("hidden");
        });
    }
    while (labelAnimation.length && step === labelAnimation[0].minutes) {
        var label = labelAnimation[0].label;
        if (label.getStatus() === "shown" || step < maxPathSteps) {
            label.setStatus(labelAnimation[0].status);
        }
        labelAnimation.shift();       
    }
    if (step < maxPathSteps) {
        routeAnimations.forEach(function(animation) {
            map3.addLayer(animation[step]);
        });
    }
    return ++step === maxSteps;
}

var interval = null;
var animate = function() {
    interval = window.setInterval(function() {
        if (animateStep()) {
            window.clearInterval(interval);
            control.reset();
        }
    }, 30);
}
var pause = function() {
    window.clearInterval(interval);
}

var control = L.control.animate({
    animateStartFn: animate,
    animateStopFn:  pause
});

L.Control.Title = L.Control.extend({
    options: {
        position: "topleft"
    },

    initialize: function (title, options) {
        L.setOptions(this, options);
        this._title = title;
    },

    onAdd: function (map) {
        var container = L.DomUtil.create('div', 'leaflet-control-title');
        container.innerHTML = this._title;
        return container;
    }
});

L.control.title = function(title, options) {
    return new L.Control.Title(title, options);
};

L.control.title(
    "<h1>Geography as a Competitive Advantage</h1>" +
    "<p>In the 1940s, the route of Southern Railways' <i>Southerner</i> " +
    "(<span class='southern'>━━━</span>) " +
    "was shorter than the rival " +
    "<i>Silver Comet</i> of the Seaboard Air Line " +
    "(<span class='seaboard'>━━━</span>)." +
    "Passengers traveling on the <i>Southerner</i> " +
    "could expect to arrive more than 90 minutes sooner " +
    "than those on the <i>Silver Comet</i>.</p>" +
    "<p>Click the play button below to trace the journeys " +
    "of both trains between Washington, DC and Atlanta, GA.</p>"
).addTo(map3);

control.addTo(map3);

});
</script>
