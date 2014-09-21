## Including Maps for Context

So far in this chapter we've looked at map visualizations where the main subjects are geographic regions—countries in Europe or counties in Georgia. In those cases choropleth maps were effective in showing the differences between regions. Not all map visualizations have the same focus, however. In some cases we want to include a map more as context or background for the visualization data.

When we want to include a map as a visualization background, we're likely to find that traditional mapping libraries will serve us better than custom choropleth maps. The most well known mapping library is probably [Google Maps](http://maps.google.com), and you've almost certainly seen many examples of embedded Google maps on web pages. There are, however, several free and open source alternatives to Google Maps. For this example we'll use the [Modest Maps](https://github.com/modestmaps/modestmaps-js) library from Stamen Design. To show off this library, we'll visualize the major [UFO sightings in the United States](http://en.wikipedia.org/wiki/UFO_sightings_in_the_United_States), or at least those important enough to merit a Wikipedia entry.

### Step 1: Set Up the Web Page

For our visualization we'll rely on a couple of components from the Modest Maps library: the core library itself and the spotlight extension that can be found in the library's examples folder. In production you would likely combine these and minify the result to optimize performance, but for our example we'll include them separately.

``` {.html .numberLines}
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title></title>
  </head>
  <body>
    <div id="map"></div>
    <script src="js/modestmaps.js"></script>
    <script src="js/spotlight.js"></script>
  </body>
</html>
```

We've also set aside a `<div>` in line 8 to hold the map. Not surprisingly, it has the `id` of `"map"`.

### Step 2: Prepare the Data

The Wikipedia data can be formatted as an array of JavaScript objects. We can include whatever information we wish in the objects, but we'll definitely need the latitude and longitude of the sighting in order to place it on the map. Here's how you might structure the data.

``` {.javascript .numberLines}
var ufos = [
{
    "date": "April, 1941",
    "city": "Cape Girardeau",
    "state": "Missouri",
    "location": [37.309167, -89.546389],
    "url": "http://en.wikipedia.org/wiki/Cape_Girardeau_UFO_crash"
},{
    "date": "February 24, 1942",
    "city": "Los Angeles",
    "state": "California",
    "location": [34.05, -118.25],
    "url": "http://en.wikipedia.org/wiki/Battle_of_Los_Angeles"
},{
// Data set continues...
```

The `location` property holds the latitude and longitude (where negative values indicate west) as a two-element array.

### Step 3: Choose a Map Style

As with most mapping libraries, Modest Maps builds its maps using layers. The layering process works much like it does in a graphics application such as Photoshop or Sketch. Subsequent layers add additional visual information to the map. In most cases the base layer for a map consists of image tiles. Additional layers such as markers or routes can be added on top of the image tiles.

When we tell Modest Maps to create a map, it calculates which tiles (both size and location) are needed and then it requests those tiles asynchronously over the internet. The tiles define the visual style of the map. Stamen Design has published several tile sets itself; you can see them on the [maps.stamen.com](http://maps.stamen.com) web site.

To use the Stamen tiles we'll add an additional, small JavaScript library to our page. That library is available at directly from Stamen Design at `http://maps.stamen.com/js/tile.stamen.js`. It should be included _after_ the Modest Maps library.

``` {.html .numberLines}
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title></title>
  </head>
  <body>
    <div id="map"></div>
    <script src="js/modestmaps.js"></script>
    <script src="js/spotlight.js"></script>
    <script src="http://maps.stamen.com/js/tile.stamen.js"></script>
  </body>
</html>
```

For our example the "toner" style is a good match, so we'll use those tiles. To use those tiles we create a _tile layer_ for the map.

``` {.javascript .numberLines}
var tiles = new MM.StamenTileLayer("toner");
```

> When you consider a source for image tiles, be aware of any copyright restrictions. Some image tiles must be licensed, and even those that are freely available often require that any use identify the provider as the source.

### Step 4: Draw the Map

Now we're ready to draw the map itself. That takes two JavaScript statements. First we create a new `MM.Map` object, giving it the `id` of the element containing the map and the tiles we initialized above. Then we provide the latitude and longitude for the map's center as well an initial zoom level. For your own maps you may need to experiment a bit to get the right values, but for this example we'll center and zoom the map so that it comfortably shows the continental United States.

``` {.javascript .numberLines}
var map = new MM.Map("map", tiles);
map.setCenterZoom(new MM.Location(38.840278, -96.611389), 4.3);
```

The resulting map in figure NEXTFIGURENUMBER forms a base for showing the sightings.

<figure>
<div id="map-context-1" style="width:760px;height:440px"></div>
Map tiles by [Stamen Design](http://stamen.com)</a>, under [CC BY 3.0](http://creativecommons.org/licenses/by/3.0). Data by [OpenStreetMap](http://openstreetmap.org), under [CC BY SA](http://creativecommons.org/licenses/by-sa/3.0).
<figcaption>Map libraries can show maps based on geographic coordinates.</figcaption>
</figure>

Notice that we've credited both Stamen Design and OpenStreetMap. That attribution is required by the terms of the Stamen Design license.

### Step 5: Add the Sightings

With our map in place it's time to add the individual UFO sightings. We're using the spotlight extension to highlight these locations, so we first create a spotlight layer for the map. We'll also want to set the radius of the spotlight effect. As with the center and zoom parameters, a bit of trial and error helps here.

``` {.javascript .numberLines}
var layer = new SpotlightLayer();
layer.spotlight.radius = 20;
map.addLayer(layer);
```

Now we can iterate through the array of sightings that make up our data. For each sighting, we extract the latitude and longitude of the location and add that location to the spotlight layer.

``` {.javascript .numberLines}
ufos.forEach(function(ufo) {
    layer.addLocation(new MM.Location(ufo.location[0], ufo.location[1]));
});
```

At this point our visualization is complete. Figure NEXTFIGURENUMBER see where UFOs have allegedly appeared over the United States in a suitably mysterious context.

<figure>
### Major UFO Sightings in the Continental United States
<div id="map-context-2" style="width:840px;height:440px"></div>
Map tiles by [Stamen Design](http://stamen.com)</a>, under [CC BY 3.0](http://creativecommons.org/licenses/by/3.0). Data by [OpenStreetMap](http://openstreetmap.org), under [CC BY SA](http://creativecommons.org/licenses/by-sa/3.0).
<figcaption>Adding layers in a map library can add emphasis to regions of a map.</figcaption>
</figure>

<script>
contentLoaded.done(function() {

var ufos = [
{
    "date": "April, 1941",
    "city": "Cape Girardeau",
    "state": "Missouri",
    "location": [37.309167, -89.546389],
    "url": "http://en.wikipedia.org/wiki/Cape_Girardeau_UFO_crash"
},{
    "date": "February 24, 1942",
    "city": "Los Angeles",
    "state": "California",
    "location": [34.05, -118.25],
    "url": "http://en.wikipedia.org/wiki/Battle_of_Los_Angeles"
},{
    "date": "June 21, 1947",
    "city": "Maury Island",
    "state": "Washington",
    "location": [47.376944, -122.429722],
    "url": "http://en.wikipedia.org/wiki/Maury_Island_incident"
},{
    "date": "June 24, 1947",
    "city": "Maury Island",
    "state": "Washington",
    "location": [47.376944, -122.429722],
    "url": "http://en.wikipedia.org/wiki/Kenneth_Arnold_UFO_sighting"
},{
    "date": "July 7, 1947",
    "city": "Helena",
    "state": "Montana",
    "location": [46.595806, -112.027031],
    "url": ""
},{
    "date": "July 7, 1947",
    "city": "Roswell",
    "state": "New Mexico",
    "location": [33.387222, -104.528056],
    "url": "http://en.wikipedia.org/wiki/Roswell_UFO_incident"
},{
    "date": "January 7, 1948",
    "city": "Maysville",
    "state": "Kentucky",
    "location": [38.643889, -83.775833],
    "url": "http://en.wikipedia.org/wiki/Mantell_UFO_Incident"
},{
    "date": "July 24, 1948",
    "city": "Montgomery",
    "state": "Alabama",
    "location": [32.361667, -86.279167],
    "url": "http://en.wikipedia.org/wiki/Chiles-Whitted_UFO_Encounter"
},{
    "date": "October 1, 1948",
    "city": "Fargo",
    "state": "North Dakota",
    "location": [46.877222, -96.789444],
    "url": "http://en.wikipedia.org/wiki/Gorman_Dogfight"
},{
    "date": "May 11, 1950",
    "city": "McMinnville",
    "state": "Oregon",
    "location": [45.211667, -123.197222],
    "url": "http://en.wikipedia.org/wiki/McMinnville_UFO_photographs"
},{
    "date": "August 15, 1950",
    "city": "Great Falls",
    "state": "Montana",
    "location": [47.503611, -111.286389],
    "url": "http://en.wikipedia.org/wiki/Mariana_UFO_incident"
},{
    "date": "August 25, 1951",
    "city": "Lubbock",
    "state": "Texas",
    "location": [33.566667, -101.883333],
    "url": "http://en.wikipedia.org/wiki/Lubbock_Lights"
},{
    "date": "July 24, 1952",
    "city": "Carson Sink",
    "state": "Nevada",
    "location": [39.877778, -118.347222],
    "url": "http://en.wikipedia.org/wiki/Carson_Sink_UFO_incident"
},{
    "date": "May 24, 1952",
    "city": "Burbank",
    "state": "California",
    "location": [34.180278, -118.328333],
    "url": "http://en.wikipedia.org/wiki/Orfeo_Angelucci"
},{
    "date": "July 13, 1952",
    "city": "Washington",
    "state": "District of Columbia",
    "location": [38.895111, -77.036667],
    "url": "http://en.wikipedia.org/wiki/1952_Washington_D.C._UFO_incident"
},{
    "date": "September 12, 1952",
    "city": "Flatwoods",
    "state": "West Virginia",
    "location": [38.721389, -80.653056],
    "url": "http://en.wikipedia.org/wiki/Flatwoods_monster"
},{
    "date": "August 5, 1953",
    "city": "Bismarck",
    "state": "North Dakota",
    "location": [46.813333, -100.778889],
    "url": "http://en.wikipedia.org/wiki/Ellsworth_UFO_sighting"
},{
    "date": "November 23, 1953",
    "city": "Sault Ste. Marie",
    "state": "Michigan",
    "location": [46.496944, -84.345556],
    "url": "http://en.wikipedia.org/wiki/Felix_Moncla"
},{
    "date": "November 2, 1957",
    "city": "Levelland",
    "state": "Texas",
    "location": [33.587222, -102.378056],
    "url": "http://en.wikipedia.org/wiki/Levelland_UFO_Case"
},{
    "date": "September 19, 1961",
    "city": "Lancaster",
    "state": "New Hampshire",
    "location": [44.488889, -71.569167],
    "url": "http://en.wikipedia.org/wiki/Betty_and_Barney_Hill_abduction"
},{
    "date": "April 24, 1964",
    "city": "Socorro",
    "state": "New Mexico",
    "location": [34.061667, -106.899444],
    "url": "http://en.wikipedia.org/wiki/Lonnie_Zamora_incident"
},{
    "date": "September 3, 1965",
    "city": "Exeter",
    "state": "New Hampshire",
    "location": [42.981389, -70.947778],
    "url": "http://en.wikipedia.org/wiki/Exeter_incident"
},{
    "date": "December 9, 1965",
    "city": "Kecksburg",
    "state": "Pennsylvania",
    "location": [40.184722, -79.461389],
    "url": "http://en.wikipedia.org/wiki/Kecksburg_UFO_incident"
},{
    "date": "April 17, 1966",
    "city": "Akron",
    "state": "Ohio",
    "location": [41.073056, -81.517778],
    "url": "http://en.wikipedia.org/wiki/Portage_County_UFO_chase"
},{
    "date": "December 3, 1967",
    "city": "Ashland",
    "state": "Nebraska",
    "location": [41.040556, -96.3725],
    "url": "http://en.wikipedia.org/wiki/Schirmer_Abduction"
},{
    "date": "1969",
    "city": "Leary",
    "state": "Georgia",
    "location": [31.485556, -84.513333],
    "url": "http://en.wikipedia.org/wiki/Jimmy_Carter_UFO_incident"
},{
    "date": "October 11, 1973",
    "city": "Pascagoula",
    "state": "Mississippi",
    "location": [30.363611, -88.541944],
    "url": "http://en.wikipedia.org/wiki/Pascagoula_Abduction"
},{
    "date": "November 5, 1975",
    "city": "Snowflake",
    "state": "Arizona",
    "location": [34.511111, -110.083056],
    "url": "http://en.wikipedia.org/wiki/Travis_Walton"
},{
    "date": "August 20, 1976",
    "city": "Allagash",
    "state": "Maine",
    "location": [47.093056, -69.058333],
    "url": "http://en.wikipedia.org/wiki/Allagash_Abductions"
},{
    "date": "August 27, 1979",
    "city": "Stephen",
    "state": "Minnesota",
    "location": [48.450556, -96.875278],
    "url": "http://en.wikipedia.org/wiki/Val_Johnson_Incident"
},{
    "date": "December 29, 1980",
    "city": "Dayton",
    "state": "Texas",
    "location": [30.056389, -94.895556],
    "url": "http://en.wikipedia.org/wiki/Cash-Landrum_incident"
},{
    "date": "November 11, 1987",
    "city": "Gulf Breeze",
    "state": "Florida",
    "location": [30.443333, -87.211389],
    "url": "http://en.wikipedia.org/wiki/Gulf_Breeze_UFO_incident"
},{
    "date": "March 13, 1997",
    "city": "Phoenix",
    "state": "Arizona",
    "location": [33.45, -112.066667],
    "url": "http://en.wikipedia.org/wiki/Phoenix_Lights"
},{
    "date": "January 5, 2000",
    "city": "Highland",
    "state": "Illinois",
    "location": [38.743889, -89.677222],
    "url": "http://en.wikipedia.org/wiki/Black_Triangle_(UFO)"
},{
    "date": "August 21, 2004",
    "city": "Chicago",
    "state": "Illinois",
    "location": [41.881944, -87.627778],
    "url": "http://en.wikipedia.org/wiki/Tinley_Park_Lights"
},{
    "date": "November 7, 2006",
    "city": "Chicago",
    "state": "Illinois",
    "location": [41.881944, -87.627778],
    "url": "http://en.wikipedia.org/wiki/Chicago_O%27Hare_UFO_sighting_2006"
},{
    "date": "January 19, 2007",
    "city": "Van Buren",
    "state": "Arkansas",
    "location": [35.444444, -94.346667],
    "url": "http://en.wikinews.org/wiki/US_air_force_colonel_claims_he_spotted_UFOs_over_Arkansas"
},{
    "date": "January 26, 2007",
    "city": "Charlotte",
    "state": "North Carolina",
    "location": [35.226944, -80.843333],
    "url": "http://en.wikinews.org/wiki/Locals_and_officer_claim_to_have_seen_a_UFO_in_Charlotte,_North_Carolina"
},{
    "date": "January 8, 2008",
    "city": "Stephenville",
    "state": "Texas",
    "location": [32.220278, -98.213611],
    "url": "http://en.wikinews.org/wiki/UFO_sightings_reported_in_Texas_town"
},{
    "date": "January 5, 2009",
    "city": "Morristown",
    "state": "New Jersey",
    "location": [40.796562, -74.477318],
    "url": "http://en.wikipedia.org/wiki/Morristown_UFO"
}
];


var tiles1 = new MM.StamenTileLayer("toner");
var map1 = new MM.Map("map-context-1", tiles1);
map1.setCenterZoom(new MM.Location(37.840278, -96.611389), 4.3);

var tiles2 = new MM.StamenTileLayer("toner");
var map2 = new MM.Map("map-context-2", tiles2);
map2.setCenterZoom(new MM.Location(37.840278, -96.611389), 4.3);
 
var layer = new SpotlightLayer();
layer.spotlight.radius = 20;
map2.addLayer(layer);

ufos.forEach(function(ufo) {
    layer.addLocation(new MM.Location(ufo.location[0], ufo.location[1]));
});


});
</script>
