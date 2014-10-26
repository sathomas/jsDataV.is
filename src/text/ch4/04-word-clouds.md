## Revealing Language Patterns with Word Clouds

Data visualizations don't always focus on numbers. Sometimes the data for a visualization centers on words instead, and a _word cloud_ is often an effective way to present this kind of data. Word clouds can associate any quantity with a list of words; most often that quantity is a relative frequency. This type of word cloud, which we'll create for our next example, reveals which words are common and which words are rare.

To create this visualization we'll rely on the [wordcloud2](http://timdream.org/wordcloud2.js) library, a spin-off from author Tim Dream's [<span class="smcp">HTML5</span> Word Cloud](http://timc.idv.tw/wordcloud/) project.

> Note: As is the case with a few of the more advanced libraries we've examined, wordcloud2 doesn't function very well in older web browsers such as Internet Explorer version 8 and earlier. Since wordcloud2 itself requires a modern browser, for this example we won't worry about compatibility with older browsers. This will free us to use some other modern JavaScript features, too.


### Step 1: Include the Required Libraries

The wordcloud2 library does not depend on any other JavaScript libraries, so we don't need any other included scripts. It is not, however, available on common content distribution networks, so we'll have to serve it from our own web host.

``` {.html .numberLines}
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title></title>
  </head>
  <body>
    <script src="js/wordcloud2.js"></script>
  </body>
</html>
```

> Note: To keep our example focused on the visualization, we'll use a word list that doesn't need any special preparation. If you're working with natural language as spoken or written, however, you might wish to process the text to identify alternate forms of the same word. For example, you might want to count "hold," "holds," and "held" as three instances of "hold" rather than three separate words. This type of processing obviously depends greatly on the particular language. If you're working in English and Chinese, though, the same developer that created wordcloud2 has also released the [WordFreq](http://timdream.org/wordfreq/) JavaScript library that performs exactly this type of analysis.

### Step 2: Prepare the Data

For this example we'll look at the different tags users associate with their questions on the popular [Stack Overflow](http://stackoverflow.com). That site lets users pose programming questions that the community tries to answer. Tags provide a convenient way to categorize the questions so that users can browse other posts related to the same topic. By constructing a word cloud (perhaps better named a _tag cloud_) we can quickly show the relative popularity of different programming topics.

If you wanted to develop this example into a real application, you could access the Stack Overflow data in real time using the site's <span class="smcp">API</span>. For our example, though, we'll use a static snapshot. Here's how it starts:

``` {.javascript .numberLines}
var tags = [
    ["c#", 601251],
    ["java", 585413],
    ["javascript", 557407],
    ["php", 534590],
    ["android", 466436],
    ["jquery", 438303],
    ["python", 274216],
    ["c++", 269570],
    ["html", 259946],
    // Data set continues...
```

In this data set, the list of tags is an array, and each tag within the list is also an array. These inner arrays have the word itself as the first item and a count for that word as the second item. You can see the complete list in the book's [source code](https://github.com/sathomas/jsDataV.is-source).

The format that wordcloud2 expects is quite similar to how our data is already laid out, except that in each word array, the second value needs to specify the drawing size for that word. For example, the array element `["javascript", 56]` would tell wordcloud2 to draw “javascript” with a height of 56 pixels. Our data, of course, isn't set up with pixel sizes. The data value for "javascript" is 557407, and a word 557407 pixels high wouldn't even fit on a billboard. As a result, we must convert counts to drawing sizes. The specific algorithm for this conversion will depend both on the size of the visualization and the raw values. A simple approach that works in this case is to divide the count values by 10000 and round to the nearest integer. In chapter 2, we saw how jQuery's `.map()` function makes it easy to process all the elements in an array. It turns out that modern browsers have the same functionality built in, so we can use the native version of `.map()` even without jQuery. (This native version won't work on older browsers like jQuery will, but we're not worrying about that for this example.)

``` {.javascript .numberLines}
var list = tags.map(function(word) { 
    return [word[0], Math.round(word[1]/10000)]; 
});
```

After this code executes, our `list` variable will contain the following:

``` {.javascript .numberLines}
[
    ["c#", 60],
    ["java", 59],
    ["javascript", 56],
    ["php", 53],
    ["android", 47],
    ["jquery", 44],
    ["python", 27],
    ["c++", 27],
    ["html", 26],
    // Data set continues...
```

### Step 3: Add the Required Markup

The wordcloud2 library can build its graphics either using the <span class="smcp">HTML</span> `<canvas>` interface or in pure <span class="smcp">HTML</span>. As we've seen with many graphing libraries, `<canvas>` is a convenient interface for creating graphic elements. For word clouds, however, there aren't many benefits to using `<canvas>`. Native <span class="smcp">HTML</span>, on the other hand, lets us use all the standard <span class="smcp">HTML</span> tools (such as <span class="smcp">CSS</span> stylesheets or JavaScript event handling). That's the approach we'll take in this example. When using native <span class="smcp">HTML</span>, we do have to make sure that the containing element has a `position: relative` style, because wordcloud2 relies on that when placing the words in their proper location in the cloud. You can see in line 8 below that we've set that style inline.

``` {.html .numberLines .line-8}
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title></title>
  </head>
  <body>
    <div id="cloud" style="position:relative;"></div>
    <script src="js/wordcloud2.js"></script>
  </body>
</html>
```

### Step 4: Create a Simple Cloud

With these preparations in place, creating a simple word cloud is about as easy as it can get. We call the wordcloud2 library and tell it the <span class="smcp">HTML</span> element in which to draw the cloud, and the list of words for the cloud's data.

``` {.javascript .numberLines}
WordCloud(document.getElementById("cloud"), {list: list});
```

Even with nothing other than default values, wordcloud2 creates the attractive visualization shown in figure NEXTFIGURENUMBER.

<style>
#cloud-1, #cloud-2 { border-radius:3px;border:1px solid #d0d0d0;}
.localfile #cloud-1, .localfile #cloud-2 { border-radius:none;border:none;}
</style>

<figure>
<div id="cloud-1" style="width:640px;height:450px;position:relative;"></div>
<figcaption>A word cloud can show a list of words with their relative frequency.</figcaption>
</figure>

The wordcloud2 interface also provides many options for customizing the visualization. As expected, you can set colors and fonts, but you can also change the shape of the cloud (even providing a custom polar equation), rotation limits, internal grid sizing, and many other features.

### Step 5: Add Interactivity

If you ask wordcloud2 to use the `<canvas>` interface, it gives you a couple of callback hooks that your code can use to respond to user interactions. With  native <span class="smcp">HTML</span>, however, we aren't limited to just the callbacks that wordcloud2 provides. To demonstrate, we can add a simple interaction to respond to mouse clicks on words in the cloud.

First we'll let users know that interactions are supported by changing the cursor to a pointer when they hover the mouse over a cloud word.

``` {.css .numberLines}
#cloud span {
    cursor: pointer;
}
```

Next let's add an extra element to the markup where we can display information about any clicked word. That element is the `<div>` with the id `details` in line 9.

``` {.html .numberLines .line-9}
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title></title>
  </head>
  <body>
    <div id="cloud" style="position:relative;"></div>
    <div id="details"><div>
    <script src="js/wordcloud2.js"></script>
  </body>
</html>
```

Then we define a function that can be called when the user clicks within the cloud. Because our function will be called for any clicks on the cloud (including clicks on empty space), it will first check to see if the target of the click was really a word. Words are contained in `<span>` elements, so we can verify that by looking that the `nodeName` property of the click target. As you can see from line 2, JavaScript node names are always in uppercase.

``` {.javascript .numberLines .line-2}
var clicked = function(ev) {
    if (ev.target.nodeName === "SPAN") {
        // A <span> element was the target of the click
    }
}
```

If the user did click on a word, we can find out which word by looking at the `textContent` property of the event target. After line 3 below, the variable `tag` will hold the word on which the user clicked. So, for example, if a user clicks on the word "javascript," then the tag variable will have the value `"javascript"`.

``` {.javascript .numberLines}
var clicked = function(ev) {
    if (ev.target.nodeName === "SPAN") {
        var tag = ev.target.textContent;
    }
}
```

Since we'd like to show users the total count when they click on a word, we're going to need to find the word in our original data set. We have the word's value, so that's simply a matter of searching through the data set to find a match. If we were using jQuery, the `.grep()` function would do just that. In this example we're sticking with native JavaScript, so we can look for an equivalent method in pure JavaScript. Unfortunately, although there is such a native method defined (`.find()`) very few browsers (even modern browsers) currently support it. We could resort to a standard `for` or `forEach` loop, but there is an alternative that many consider an improvement over that approach. It relies on the `.some()` method, an array method that modern browsers do support. The `.some()` method passes every element of an array to an arbitrary function and stops when that function returns true. Here's how we can use it to find the clicked tag in our `tags` array.

The function that's the argument to `.some()` is defined in lines 5 through 11. It is called with the parameter `el`, short for an _element_ in the `tags` array. The conditional statement in line 6 checks to see if that element's word matches the clicked node's text content. If so, the function sets the `clickedTag` variable and returns `true` to terminate the `.some()` loop.

If the clicked word doesn't match the element we're checking in the `tags` array, then the function supplied to `some()` returns `false` (line 10). When `some()` sees a `false` return value, it continues iterating through the array.

``` {.javascript .numberLines}
var clicked = function(ev) {
    if (ev.target.nodeName === "SPAN") {
        var tag = ev.target.textContent;
        var clickedTag;
        tags.some(function(el) { 
            if (el[0] === tag) {
                clickedTag = el; 
                return true;  // This ends the .some() loop
            }
            return false;
        });
    }
}
```

We can use the return value of the `.some()` method to make sure the clicked element was found in the array. When that's the case, `.some()` itself returns `true`. In lines 13 and 14 below we update the `details` variable with extra information. In line 17 we update the web page with those details.

``` {.javascript .numberLines .line-13 .line-14 .line-17}
var clicked = function(ev) {
  var details = "";
  if (ev.target.nodeName === "SPAN") {
      var tag = ev.target.textContent,
          clickedTag;
      if (tags.some(function(el) { 
          if (el[0] === tag) {
                clickedTag = el; 
                return true;
          }
          return false; 
      })) {
          details = "There were " + clickedTag[1] + 
                    " Stack Overflow questions tagged '" + tag + "'";
      }
  }
  document.getElementById("details").innerText = details;
}
```

And finally we tell the browser to call our handler when a user clicks on anything in the cloud container.

``` {.javascript .numberLines}
document.getElementById("cloud").addEventListener("click", clicked)
```

With these few lines of code, our word cloud is now interactive.

<style>
#cloud-2 span {
    cursor: pointer;
}
</style>

<figure>
<div id="cloud-2" style="width:640px;height:450px;position:relative;"></div>
<div id="details-2" style="text-align:center;line-height:2em;margin-top:0.5em"></div>
<figcaption>Because our word cloud consists of standard <span class="smcp">HTML</span> elements, we can make it interactive with simple JavaScript event handlers.</figcaption>
</figure>

<script>
;(function(){

    draw = function() {

        var tags = [
         ["c#", 601251],
         ["java", 585413],
         ["javascript", 557407],
         ["php", 534590],
         ["android", 466436],
         ["jquery", 438303],
         ["python", 274216],
         ["c++", 269570],
         ["html", 259946],
         ["mysql", 226906],
         ["ios", 216765],
         ["asp.net", 209653],
         ["css", 199932],
         ["sql", 192739],
         ["iphone", 190382],
         [".net", 179522],
         ["objective-c", 172609],
         ["ruby-on-rails", 152860],
         ["c", 129998],
         ["ruby", 97414],
         ["sql-server", 91050],
         ["ajax", 85036],
         ["xml", 84295],
         ["regex", 81991],
         ["arrays", 80728],
         ["wpf", 80062],
         ["asp.net-mvc", 79697],
         ["database", 70777],
         ["linux", 70772],
         ["json", 70396],
         ["django", 68893],
         ["vb.net", 63061],
         ["windows", 62042],
         ["xcode", 60950],
         ["eclipse", 60512],
         ["string", 54249],
         ["facebook", 53745],
         ["html5", 51015],
         ["ruby-on-rails-3", 50109],
         ["r", 49842],
         ["multithreading", 49806],
         ["winforms", 46643],
         ["wordpress", 46632],
         ["image", 45910],
         ["forms", 41984],
         ["performance", 40607],
         ["osx", 40401],
         ["visual-studio-2010", 40228],
         ["spring", 40207],
         ["node.js", 40041],
         ["excel", 39973],
         ["algorithm", 38661],
         ["oracle", 38565],
         ["swing", 38255],
         ["git", 37842],
         ["linq", 37489],
         ["asp.net-mvc-3", 36902],
         ["apache", 35533],
         ["web-services", 35385],
         ["wcf", 35242],
         ["perl", 35138],
         ["entity-framework", 34139],
         ["sql-server-2008", 33827],
         ["visual-studio", 33664],
         ["bash", 33139],
         ["hibernate", 32263],
         ["actionscript-3", 31760],
         ["ipad", 29476],
         ["matlab", 29210],
         ["qt", 28918],
         ["cocoa-touch", 28753],
         ["list", 28556],
         ["cocoa", 28385],
         ["file", 28200],
         ["sqlite", 28114],
         [".htaccess", 28006],
         ["flash", 27908],
         ["api", 27480],
         ["angularjs", 27042],
         ["jquery-ui", 26906],
         ["function", 26485],
         ["codeigniter", 26426],
         ["mongodb", 26223],
         ["class", 25925],
         ["silverlight", 25878],
         ["tsql", 25706],
         ["css3", 25535],
         ["delphi", 25421],
         ["security", 25325],
         ["google-maps", 24919],
         ["vba", 24301],
         ["internet-explorer", 24270],
         ["postgresql", 24236],
         ["jsp", 24224],
         ["shell", 24184],
         ["google-app-engine", 23892],
         ["oop", 23634],
         ["sockets", 23464],
         ["validation", 23429],
         ["unit-testing", 23249]
        ];
        
        var colors = [
            chartStyles.color.primary,
            chartStyles.color.primaryLightest,
            chartStyles.color.primaryLight,
            chartStyles.color.primaryDark,
            chartStyles.color.primaryDarkest,
            chartStyles.color.secondary,
            chartStyles.color.secondaryLightest,
            chartStyles.color.secondaryLight,
            chartStyles.color.secondaryDark,
            chartStyles.color.secondaryDarkest,
            chartStyles.color.alternate,
            chartStyles.color.alternateLightest,
            chartStyles.color.alternateLight,
            chartStyles.color.alternateDark,
            chartStyles.color.alternateDarkest,
            chartStyles.color.tertiary,
            chartStyles.color.tertiaryLightest,
            chartStyles.color.tertiaryLight,
            chartStyles.color.tertiaryDark,
            chartStyles.color.tertiaryDarkest,
            chartStyles.color.quaternary,
            chartStyles.color.quaternaryLightest,
            chartStyles.color.quaternaryLight,
            chartStyles.color.quaternaryDark,
            chartStyles.color.quaternaryDarkest
        ];
        
        WordCloud(document.getElementById('cloud-1'), {
          backgroundColor: (window.location.protocol === "file:") ? "white" : chartStyles.color.blockBackground,
          fontFamily: chartStyles.font.family,
          list : tags.map(function(word) { return [word[0], Math.round(word[1]/5500)]; }),
          color: function() {return colors[Math.floor(Math.random()*colors.length)];}
        });
        
        WordCloud(document.getElementById('cloud-2'), {
          backgroundColor: (window.location.protocol === "file:") ? "white" : chartStyles.color.blockBackground,
          fontFamily: chartStyles.font.family,
          list : tags.map(function(word) { return [word[0], Math.round(word[1]/5500)]; }),
          color: function() {return colors[Math.floor(Math.random()*colors.length)];}
        });
        
        var clicked = function(ev) {
          if (ev.target.nodeName === "SPAN") {
            var tag = ev.target.textContent;
            var tagElem;
            if (tags.some(function(el) { if (el[0] === tag) {tagElem = el; return true;} return false; })) {
            document.getElementById("details-2").innerText = "There were " + tagElem[1] + 
                " Stack Overflow questions tagged '" + tag + "'";
            }
          } else {
            document.getElementById("details-2").innerText = "";
          }
        }
        document.getElementById("cloud-2").addEventListener("click", clicked)

    };
    
    if (typeof contentLoaded != "undefined") {
        contentLoaded.done(draw);
    } else {
        window.addEventListener('load', draw);
    }

}());
</script>
