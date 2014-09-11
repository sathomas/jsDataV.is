## Map Fonts

One technique for adding maps to web pages is surprisingly simple but often overlooked—map fonts. Two examples of these fonts are [Stately](http://intridea.github.io/stately/) and [Continental](http://contfont.net). Map fonts are special purpose web fonts whose character sets aren't the common letters and numbers. Their character sets are, instead, map symbols. If that doesn't make sense to you right away, follow along with this example. In just a few easy steps we'll create a visualization of Europe using Continental.

### Step 1: Include the Fonts in the Page

The main web sites for both Stately and Continental include more detailed instructions for installing the fonts, but all that's really necessary is including a single Cascading Style Sheet. In the case of Continental, that style sheet is called, naturally, `continental.css`. No JavaScript libraries are required.

``` {.html .numberLines}
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title></title>
    <link rel="stylesheet" type="text/css" href="css/continental.css">
  </head>
  <body>
    <div id="map"></div>
  </body>
</html>
```

> For a production web site, you might want to combine `continental.css` with your site's other style sheets to minimize the number of network requests the browser has to make.

### Step 2: Display One Country

To show a single country, all we have to do is include an HTML `<span>` element with the appropriate attributes. We could do this right in the markup. ( "fr" is the international two-letter abbreviation for France.)

``` {.html .numberLines}
<div id="map">
    <span class="map-fr"></span>
</div>
```

For our example, we'll do use JavaScript instead. Here we're creating a new `<span>` element, giving it a class name of `"map-fr"`, and appending it to the map `<div>`.

``` {.javascript .numberLines}
var fr = document.createElement("span");
fr.className = "map-fr";
document.getElementById("map").appendChild(fr);
```

One last bit of housekeeping is setting the size of the font. By default, any map font character will be the same size as a regular text character. For maps we want something much larger, so we can use standard CSS rules to increase the size.

``` {.css .numberLines}
#map {
    font-size: 200px;
}
```

That's all it takes to add France to a web page, as we can see from figure NEXTFIGURENUMBER.

<figure>
<div id="map-font-1" style="font-size:500px; width: 100%; position:relative; left: -50px; top: -250px; margin-bottom: -330px;"></div>
<figcaption>Map fonts make it very easy to add a map to a web page.</figcaption>
</figure>

### Step 3: Combine Multiple Countries into a Single Map

For this example we want to show more than a single country. We'd like to visualize the median age for all of Europe's countries, based on [United Nations population data](http://www.un.org/en/development/desa/population/) for 2010. To do that, we'll create a map that includes all European countries, and we'll style each country according to the data.

The first step in this visualization is putting all of the countries into a single map. Since each country is a separate character in the Continental font, we want to overlay those characters on top of one another rather than spread them across the page. That requires a couple of CSS rules. First we set the position of the outer container to `relative`. This rule doesn't change the styling of the outer container at all, but it does establish a _positioning context_ for anything within the container. Those elements will be our individual country symbols, and we'll set their position to be `absolute`. We'll then place each one at the top and left of the map so they'll overlay each other.  Because we've positioned the container `relative`, the country symbols will be positioned relative to that container rather than relative to the page as a whole.

``` {.css .numberLines}
#map {
    position: relative;
}
#map > [class*="map-"] {
    position: absolute;
    top: 0;
    left: 0;
}
```

The selectors that we use to target individual country symbols are a little bit trickier than simple CSS. We start by selecting the element with an `id` of `map`. Nothing fancy there. The direct descendent selector (`>`), however, says that what follows should only match elements that are immediate children of that element, not arbitrary descendants. Finally the attribute selector `[class*="map-"]`specifies only children that have a class that contains the characters `map-`. Since all the county symbols will be `<span>` elements with a class of `map-XX` (where `XX` is the two-letter country abbreviation), this will match all of our countries.

In our JavaScript we can start with an array listing all of the countries and iterate through it. For each country we create a `<span>` element with the appropriate class and insert it in the map `<div>`.

``` {.javascript .numberLines}
var countries = [
  "ad", "al", "at", "ba", "be", "bg", "by", "ch", "cy", "cz",
  "de", "dk", "ee", "es", "fi", "fo", "fr", "ge", "gg", "gr",
  "hr", "hu", "ie", "im", "is", "it", "je", "li", "lt", "lu",
  "lv", "mc", "md", "me", "mk", "mt", "nl", "no", "pl", "pt",
  "ro", "rs", "ru", "se", "si", "sk", "sm", "tr", "ua", "uk",
  "va"
];

var map = document.getElementById("map");
countries.forEach(function(cc) {
    var span = document.createElement("span");
    span.className = "map-" + cc;
    map.appendChild(span);
});
```

With the defined style rules, inserting multiple `<span>` elements within our map `<div>` creates the complete, if somewhat uninteresting, map of Europe in figure NEXTFIGURENUMBER.

<style>
#map-font-2 {
    position: relative;
    margin-bottom: -40px;
    font-size: 300px;
    height: 300px;
    padding: 20px 0;
}
#map-font-2 > [class*="map-"] {
    position: absolute;
    top: 0;
    left: 0;
}
</style>

<figure>
<div id="map-font-2"></div>
<figcaption>Overlaying map characters on top of each other creates a complete map.</figcaption>
</figure>

### Step 4: Vary the Countries Based on the Data

Now we're ready to create the actual data visualization. Naturally, we'll start with actual data, in this case from the United Nations. Here's how we could format that data in a JavaScript array. (The full data set can be found with the book's [source code](https://github.com/sathomas/jsDataV.is-source).)

``` {.javascript .numberLines}
var ages = [
    { "country": "al", "age": 29.968 },
    { "country": "at", "age": 41.768 },
    { "country": "ba", "age": 39.291 },
    { "country": "be", "age": 41.301 },
    { "country": "bg", "age": 41.731 },
    // Data set continues...
```

There are several ways we could use this data to modify the map. One approach would have JavaScript code set the visualization properties directly by, for example, changing the `color` style for each country symbol. That would work, but it forgoes one of the big advantages of map fonts. With map fonts our visualization is standard HTML, so we can use standard CSS to style it. If, in the future, we want to change the styles on the page, they'll all be contained within the style sheets, and we won't have to hunt through our JavaScript code just to adjust colors.

To indicate which styles are appropriate for an individual country symbol, we can attach a `data-` attribute to each. The most straightforward approach is often the best, so that's what we'll do here. We set the `data-age` attribute to the mean age, rounded to the nearest whole number. To find the age for a given country, we need that country's index in the `ages` array. The `findCountryIndex()` function does that in a straightforward way.

``` {.javascript .numberLines}
var findCountryIndex = function(cc) {
    for (var idx=0; idx<ages.length; idx++) {
        if (ages[idx].country === cc) {
            return idx;
        }
    }
    return -1;
}
var map = document.getElementById("map");
countries.forEach(function(cc) {
    var idx = findCountryIndex(cc);
    if (idx !== -1) {
        var span = document.createElement("span");
        span.className = "map-" + cc;
        span.setAttribute("data-age", Math.round(ages[idx].age));
        map.appendChild(span);
    }
});
```

Now we can assign CSS style rules based on that `data-age` attribute. Here's the start of a simple blue gradient for the different ages.

``` {.css .numberLines}
#map > [data-age="44"] { color: #07306B; }
#map > [data-age="42"] { color: #0D3A75; }
#map > [data-age="43"] { color: #13457F; }
/* CSS rules continue... */
```

> Note: Although they're beyond the scope of this book, CSS preprocessors such as [LESS](http://lesscss.org) and [SASS](http://sass-lang.com) make it easy to create these kinds of rules.

Now we have the nice visualization of the age trends in figure NEXTFIGURENUMBER.

<style>
#map-font-3 {
    display: inline-block;
    width: 310px;
    position: relative;
    font-size: 300px;
    height: 310px;
    color: lightgray;
    background-color: #F5F2F0;
    border: 1px solid rgba(0, 0, 0, 0.15);
    border-radius: 4px;
}
#map-font-3 > [class*="map-"] {
    position: absolute;
    top: 0px;
    left: 10px;
}
#map-font-3 > [data-age="28"] { color: #9ECAE1; }
#map-font-3 > [data-age="29"] { color: #91C1DC; }
#map-font-3 > [data-age="30"] { color: #84B8D8; }
#map-font-3 > [data-age="31"] { color: #77AFD3; }
#map-font-3 > [data-age="32"] { color: #6BA7CF; }
#map-font-3 > [data-age="33"] { color: #5E9ECA; }
#map-font-3 > [data-age="34"] { color: #5195C5; }
#map-font-3 > [data-age="35"] { color: #448CC1; }
#map-font-3 > [data-age="36"] { color: #3783BC; }
#map-font-3 > [data-age="37"] { color: #3179B2; }
#map-font-3 > [data-age="38"] { color: #2B6EA8; }
#map-font-3 > [data-age="39"] { color: #25649E; }
#map-font-3 > [data-age="40"] { color: #1F5A94; }
#map-font-3 > [data-age="41"] { color: #194F89; }
#map-font-3 > [data-age="42"] { color: #13457F; }
#map-font-3 > [data-age="43"] { color: #0D3A75; }
#map-font-3 > [data-age="44"] { color: #07306B; }
</style>

<figure>
<div id="map-font-3"></div>
<figcaption>With CSS rules we can change the styles of individual map symbols.</figcation>
</figure>

### Step 5: Add a Legend

To finish off the visualization, we can add a legend to the map. Because the map itself is nothing more than standard HTML elements with CSS styling, it's easy to create a matching legend. This example covers a fairly broad range (28 to 44), a linear gradient works well as a key. Your own implementation will depend on the specific browser versions that you wish to support, but a generic style rule would be:

``` {.css .numberLines}
#map-legend .key {
	background: linear-gradient(to bottom, #07306b 0%,#9ecae1 100%);
}
```

The resulting visualization in figure NEXTFIGURENUMBER summarizes the median age for European countries in a clear and concise format.

<style>
#map-font-4 {
    display: inline-block;
    float: left;
    width: 310px;
    position: relative;
    font-size: 300px;
    height: 310px;
    color: lightgray;
    background-color: #F5F2F0;
    border: 1px solid rgba(0, 0, 0, 0.15);
    border-radius: 4px;
}
#map-font-4 > [class*="map-"] {
    position: absolute;
    top: 0px;
    left: 10px;
}
#map-font-4 > [data-age="28"] { color: #9ECAE1; }
#map-font-4 > [data-age="29"] { color: #91C1DC; }
#map-font-4 > [data-age="30"] { color: #84B8D8; }
#map-font-4 > [data-age="31"] { color: #77AFD3; }
#map-font-4 > [data-age="32"] { color: #6BA7CF; }
#map-font-4 > [data-age="33"] { color: #5E9ECA; }
#map-font-4 > [data-age="34"] { color: #5195C5; }
#map-font-4 > [data-age="35"] { color: #448CC1; }
#map-font-4 > [data-age="36"] { color: #3783BC; }
#map-font-4 > [data-age="37"] { color: #3179B2; }
#map-font-4 > [data-age="38"] { color: #2B6EA8; }
#map-font-4 > [data-age="39"] { color: #25649E; }
#map-font-4 > [data-age="40"] { color: #1F5A94; }
#map-font-4 > [data-age="41"] { color: #194F89; }
#map-font-4 > [data-age="42"] { color: #13457F; }
#map-font-4 > [data-age="43"] { color: #0D3A75; }
#map-font-4 > [data-age="44"] { color: #07306B; }
#map-font-4-legend {
    float: left;
    padding-left: 20px;
    position: relative;
}
#map-font-4-legend h4 {
    margin-top: 0;
}
#map-font-4-legend .key {
    margin-left: 18px;
    display: inline-block;
    height: 250px;
    width: 20px;
	background: -moz-linear-gradient(top, #07306b 0%, #9ecae1 100%);
	background: -webkit-gradient(linear, left top, left bottom, color-stop(0%,#07306b), color-stop(100%,#9ecae1));
	background: -webkit-linear-gradient(top, #07306b 0%,#9ecae1 100%);
	background: -o-linear-gradient(top, #07306b 0%,#9ecae1 100%);
	background: -ms-linear-gradient(top, #07306b 0%,#9ecae1 100%);
	background: linear-gradient(to bottom, #07306b 0%,#9ecae1 100%);
	filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#07306b', endColorstr='#9ecae1',GradientType=0 );
}
#map-font-4-legend .top {
    position: absolute;
    top: 28px;
    left: 66px;
}
#map-font-4-legend .middle {
    position: absolute;
    top: 145px;
    left: 66px;
}
#map-font-4-legend .bottom {
    position: absolute;
    top: 264px;
    left: 66px;
}
</style>

<figure>
<div id="map-font-4"></div>
<div id="map-font-4-legend"><h4>Median Age</h4><span class="key"></span><span class="top">44</span><span class="middle">35</span><span class="bottom">28</span></div>
<figcaption>Standard HTML can also provide a legend for the visualization.</figcaption>
</figure>


<script>
contentLoaded.done(function() {

var fr = document.createElement("span");
fr.className = "map-fr";
var map1 = document.getElementById("map-font-1");
map1.appendChild(fr);

var countries = [
  "ad", "al", "at", "ba", "be", "bg", "by", "ch", "cy", "cz",
  "de", "dk", "ee", "es", "fi", "fo", "fr", "ge", "gg", "gr",
  "hr", "hu", "ie", "im", "is", "it", "je", "li", "lt", "lu",
  "lv", "mc", "md", "me", "mk", "mt", "nl", "no", "pl", "pt",
  "ro", "rs", "ru", "se", "si", "sk", "sm", "tr", "ua", "uk",
  "va"
];

var map2 = document.getElementById("map-font-2");
countries.forEach(function(cc) {
    var sp = document.createElement("span");
    sp.className = "map-" + cc;
    map2.appendChild(sp);
});

var ages = [
    { "country": "al", "age": 29.968 },
    { "country": "at", "age": 41.768 },
    { "country": "ba", "age": 39.291 },
    { "country": "be", "age": 41.301 },
    { "country": "bg", "age": 41.731 },
    { "country": "by", "age": 38.223 },
    { "country": "ch", "age": 41.915 },
    { "country": "cy", "age": 36.491 },
    { "country": "cz", "age": 39.59  },
    { "country": "de", "age": 44.328 },
    { "country": "dk", "age": 40.802 },
    { "country": "ee", "age": 39.581 },
    { "country": "es", "age": 40.174 },
    { "country": "fi", "age": 41.984 },
    { "country": "fr", "age": 40.112 },
    { "country": "ge", "age": 37.582 },
    { "country": "gg", "age": 42.152 },
    { "country": "gr", "age": 41.638 },
    { "country": "hr", "age": 41.555 },
    { "country": "hu", "age": 39.807 },
    { "country": "ie", "age": 34.582 },
    { "country": "is", "age": 35.098 },
    { "country": "it", "age": 43.316 },
    { "country": "je", "age": 42.152 },
    { "country": "lt", "age": 39.846 },
    { "country": "lu", "age": 39.299 },
    { "country": "lv", "age": 40.04  },
    { "country": "md", "age": 35.219 },
    { "country": "me", "age": 35.856 },
    { "country": "mk", "age": 36.011 },
    { "country": "mt", "age": 39.021 },
    { "country": "nl", "age": 40.839 },
    { "country": "no", "age": 38.901 },
    { "country": "pl", "age": 38.208 },
    { "country": "pt", "age": 40.958 },
    { "country": "ro", "age": 38.499 },
    { "country": "rs", "age": 37.574 },
    { "country": "ru", "age": 38.054 },
    { "country": "se", "age": 40.887 },
    { "country": "si", "age": 41.689 },
    { "country": "sk", "age": 37.199 },
    { "country": "tr", "age": 28.344 },
    { "country": "ua", "age": 39.521 },
    { "country": "uk", "age": 39.858 }
];


var findCountryIndex = function(cc) {
    for (var idx=0; idx<ages.length; idx++) {
        if (ages[idx].country === cc) {
            return idx;
        }
    }
    return -1;
}
var map3 = document.getElementById("map-font-3");
countries.forEach(function(cc) {
    var idx = findCountryIndex(cc);
    if (idx !== -1) {
        var span = document.createElement("span");
        span.className = "map-" + cc;
        span.setAttribute("data-age", Math.round(ages[idx].age));
        map3.appendChild(span);
    }
});

var map4 = document.getElementById("map-font-4");
countries.forEach(function(cc) {
    var idx = findCountryIndex(cc);
    if (idx !== -1) {
        var span = document.createElement("span");
        span.className = "map-" + cc;
        span.setAttribute("data-age", Math.round(ages[idx].age));
        map4.appendChild(span);
    }
});


});
</script>
