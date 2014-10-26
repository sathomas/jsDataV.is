## Building Time Lines with JavaScript

If you followed the example in the previous section, you might not be completely satisfied with the results. We did end up with an accurate timeline of Shakespeare's plays, but the resulting visualization may not be communicating what you want. For example, the timeline doesn't show the names of the plays unless the user hovers a mouse over that section of the graph. Perhaps we'd rather have the plays' titles always visible. That kind of problem is a limitation of third-party libraries. The author of Chronoline.js didn't see the need for displaying titles, so he didn't offer the option. And unless we're willing to take on the potentially daunting task of modifying the library's source code, we can't make the library do exactly what we want.

Fortunately, particularly in the case of timelines, we can take a completely different approach. We can create visualizations without using any third-party library at all, which will give us total control over the result. Timelines are especially amenable to this technique because they can be created with nothing more than text and styling. All it takes is a basic understanding of <span class="smcp">HTML</span> and <span class="smcp">CSS</span>, plus enough JavaScript to set things up and perhaps provide simple interactions.

That's exactly what we'll do in this example. We'll start with the same data set as before. Instead of feeding that data into a third-party library, however, we'll use plain old JavaScript (with an optional dose of jQuery) to construct a pure <span class="smcp">HTML</span> representation of the data. Then we'll use <span class="smcp">CSS</span> to set the appearance of the timeline.

### Step 1: Prepare the HTML Skeleton

Without any required libraries, the <span class="smcp">HTML</span> page for our timeline is pretty simple. All we need is a containing `<div>` with a unique `id` attribute in line 8.

``` {.html .numberLines .line-8}
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title></title>
  </head>
  <body>
    <div id="timeline"></div>
  </body>
</html>
```

### Step 2: Start JavaScript Execution

As soon as the browser has finished loading our page, we can start processing the data. As before, we'll start with our data formatted as a JavaScript array. You can see the complete data set in the book's [source code](https://github.com/sathomas/jsDataV.is-source).

``` {.javascript .numberLines}
window.onload = function () {
  var plays = [
    {
      "play": "The Two Gentlemen of Verona", 
      "date": "1589-1591",
      "record": "Francis Meres'...",
      "published": "First Folio (1623)",   
      "performance": "adaptation by Benjamin Victor...",
      "evidence": "The play contains..." 
    }, { 
      "play": "The Taming of the Shrew",     
      "date": "1590-1594", 
      "record": "possible version...", 
      "published": "possible version...", 
      "performance": "According to Philip Henslowe...",  
      "evidence": "Kier Elam posits..."
    }, { 
      "play": "Henry VI, Part 2",
      "date": "1590-1591", 
      "record": "version of the...",   
      "published": "version of the...",   
      "performance": "although it is known...",         
      "evidence": "It is known..." 
    },
    // Data set continues...
}
```

### Step 3: Create the Timeline in Semantic HTML

To create the timeline in <span class="smcp">HTML</span>, we first need to decide how to represent it. If you're used to working with arbitrary `<div>` and `<span>` elements, you might think that's the best approach here as well. Instead of jumping right to these generic elements, however, we should consider other <span class="smcp">HTML</span> structures that more accurately convey the content. <span class="lgcp">HTML</span> that more closely reflects the meaning of the underlying content is known as _semantic markup_, and it's usually preferred over generic `<div>` and `<span>` tags. Semantic markup exposes the meaning of your content to computers such as search engines and screen readers for users with visual impairments, and it can improve your site's search rank and its accessibility. If we think about a timeline in the context of semantic markup, it's easy to see that the timeline is really just a list. In fact, it's a list with a specific order. We should build our <span class="smcp">HTML</span> timeline, therefore, as an ordered list (`<ol>`) element. While we're creating the `<ol>` we can also give it a class name for <span class="smcp">CSS</span> style rules we'll be adding later.

``` {.javascript .numberLines}
var container = document.getElementById("timeline");
var list = document.createElement("ol");
list.className="timeline";
container.appendChild(list);
```

Next we can iterate through the plays, creating an individual list item `<li>` for each one. For now, we'll just insert the date and title as text.

``` {.javascript .numberLines}
plays.forEach(function(play) {
    var listItem = document.createElement("li");
    listItem.textContent = play.date + ": " + play.play;
    list.appendChild(listItem);
})
```

Here's a truncated version of the resulting list. It may not look like much (yet), but it has the essential data and structure.

<figure>
<div id="javascript-1" style="font-size:0.8em"></div>
<figcaption>A pure <span class="smcp">HTML</span> timeline can start out as a simple ordered list.</figcaption>
</figure>

If you look at the resulting <span class="smcp">HTML</span> that underlies that list, it's pretty simple:

``` {.html .numberLines}
<ol class="timeline">
    <li>1589-1591: The Two Gentlemen of Verona</li>
    <li>1590-1594: The Taming of the Shrew</li>
    <li>1590-1591: Henry VI, Part 2</li>
    <li>1591: Henry VI, Part 3</li>
    <li>1591: Henry VI, Part 1</li>
</ol>
```

In the spirit of semantic <span class="smcp">HTML</span>, we should stop and consider whether that markup can be improved. Since it appears first in our list items, let's consider the date or date range for a play. Although there has been some controversy around the decision, <span class="smcp">HTML5</span> has defined support for a `<time>` element to contain dates and times. Using that element as a wrapper will make our dates more semantic. The second part of each list item is the title of the play. As it happens, <span class="smcp">HTML5</span>'s `<cite>` element is perfect for that content. To quote the [current standard](http://www.whatwg.org/specs/web-apps/current-work/multipage/text-level-semantics.html#the-cite-element):

> The cite element represents the title of a work (e.g. a book, [...] **a play,** [...] etc). This can be a work that is being quoted or referenced in detail (i.e. a citation), or it can just be a work that is mentioned in passing. [Emphasis added.]

To add those elements to our code, we'll have to distinguish between dates that are single years and those that are ranges. Looking for a dash `-` in the data will tell us which we have. Notice how we handle date ranges in lines 4 through 10. Since a range has a start and end time, we create two distinct `<time>` elements. We don't need to add any punctuation between the dates at this point.

``` {.javascript .numberLines}
plays.forEach(function(play) {
    var listItem = document.createElement("li");
    if (play.date.indexOf("-") !== -1) {
        var dates = play.date.split("-");
        var time = document.createElement("time");
        time.textContent = dates[0];
        listItem.appendChild(time);
        time = document.createElement("time");
        time.textContent = dates[1];
        listItem.appendChild(time);
    } else {
        var time = document.createElement("time");
        time.textContent = play.date;
        listItem.appendChild(time);
    }
    var cite = document.createElement("cite");
    cite.textContent = play.play;
    listItem.appendChild(cite);
    list.appendChild(listItem);
})
```

Because we're no longer including the punctuation, the resulting output might look a little worse than before. Don't worry, though, we'll fix it soon.

<figure>
<div id="javascript-2" style="font-size:0.8em"></div>
<figcaption>Semantic markup simplifies the required <span class="smcp">HTML</span>, but it may require special styling.</figcaption>
</figure>

What _is_ much improved is the underlying <span class="smcp">HTML</span>. The markup clearly identifies the type of content it contains: an ordered list of dates and citations.

``` {.html .numberLines}
<ol class="timeline">
    <li><time>1589</time><time>1591</time><cite>The Two Gentlemen of Verona</cite></li>
    <li><time>1590</time><time>1594</time><cite>The Taming of the Shrew</cite></li>
    <li><time>1590</time><time>1591</time><cite>Henry VI, Part 2</cite></li>
    <li><time>1591</time><cite>Henry VI, Part 3</cite></li>
    <li><time>1591</time><cite>Henry VI, Part 1</cite></li>
</ol>
```

### Step 4: Include the Supporting Content

When we created a timeline using the Chronoline.js library, we weren't able to include the supporting content from Wikipedia because the library did not offer that option. In this example, though, we have complete control over the content, so let's include that information in our timeline. For most plays our data includes its first official record, its first publication, its first performance, and a discussion of the evidence. This type of content is perfectly matched to the <span class="smcp">HTML</span> _description list_ `<dl>` so that's how we'll add it to our page. It can follow the `<cite>` of the play's title.

``` {.javascript .numberLines}
plays.forEach(function(play) {
    // Additional code...
    listItem.appendChild(cite);
    var descList = document.createElement("dl");
    // Add terms to the list here
    listItem.appendChild(descList);
    list.appendChild(listItem);
})
```

We can define a mapping array to help add the individual terms to each play. That array maps the property name in our data set to the label we want to use in the content.

``` {.javascript .numberLines}
var descTerms = [
    { key: "record",      label: "First official record"},
    { key: "published",   label: "First published"},
    { key: "performance", label: "First recorded performance"},
    { key: "evidence",    label: "Evidence"},
];
```

With that array we can quickly add the descriptions to our content. We iterate over the array using `.forEach()`. At each iteration we make sure that the data has content (line 6) before creating the description item. A description item contains the term(s) being described in one `<dt>` tag and the description itself in a `<dd>` tag.

``` {.javascript .numberLines .line-6}
plays.forEach(function(play) {
    // Additional code...
    listItem.appendChild(cite);
    var descList = document.createElement("dl");
    descTerms.forEach(function(term) {
        if (play[term.key]) {
            var descTerm = document.createElement("dt");
            descTerm.textContent = term.label;
            descList.appendChild(descTerm);
            var descElem = document.createElement("dd");
            descElem.textContent = play[term.key];
            descList.appendChild(descElem);
        }
    });
    listItem.appendChild(descList);
    list.appendChild(listItem);
})
```

Our timeline is still lacking a bit of visual appeal, but it has a much richer set of content. In fact, even without any styling at all, it still communicates the essential data quite well.

<style>
#javascript-3 { font-size: 0.8em; }
#javascript-3 dt { width: 14em; }
#javascript-3 dd { margin-left: 16em; }
</style>

<figure>
<div id="javascript-3"></div>
<figcaption><span class="lgcp">HTML</span> makes it easy to add extra content to the list.</figcaption>
</figure>

Here's the resulting markup (truncated for brevity):

``` {.html .numberLines}
<ol class="timeline">
    <li>
        <time>1589</time><time>1591</time>
        <cite>The Two Gentlemen of Verona</cite>
        <dl>
            <dt>First official record</dt><dd>Francis Meres'...</dd>
            <dt>First published</dt><dd>First Folio (1623)</dd>
            <dt>First recorded performance</dt><dd>adaptation by...</dd>
            <dt>Evidence</dt><dd>The play contains...</dd>
        </dl>
    </li>
    <li>
        <time>1590</time><time>1594</time>
        <cite>The Taming of the Shrew</cite>
        <dl>
            <dt>First official record</dt><dd>possible version...</dd>
            <dt>First published</dt><dd>possible version...</dd>
            <dt>First recorded performance</dt><dd>According to...</dd>
            <dt>Evidence</dt><dd>Kier Elam posits...</dd>
        </dl>
    </li>
</ol>
```

### Step 5: Optionally Take Advantage of jQuery

Our code so far has used nothing but plain JavaScript. If you're using jQuery on your web pages, you can shorten the code a bit by taking advantage of some jQuery features. If your web pages aren't using jQuery already, the minor enhancements in this step don't justify adding it, but if you’d like to see a more concise version, check out the book’s source code for an alternative.

### Step 6: Fix Timeline Problems with CSS

Now that we've built our timeline's content in <span class="smcp">HTML</span>, it's time to define the styles that determine its appearance. Throughout this example we'll focus on the functional aspects of styling rather than pure visual elements such as fonts and colors, since you'll probably want those visual styles to be specific to your own web site.

The first step is a simple one. We want to get rid of the numbering (1, 2, 3, …) that browsers normally add to ordered list items. A single rule banishes them from our timeline: by setting the `list-style-type` to `none` we tell the browser not to add any special characters to our list items.

``` {.css .numberLines}
.timeline li {
    list-style-type: none;
}
```

We can also use CSS rules to add some punctuation to our semantic HTML. First we look for places where two `<time>` elements appear right after each other, while skipping isolated `<time>` tags. The trick to finding `<time>` pairs is the CSS adjacent selector `+`. A rule with `time + time` specifies a `<time>` element that immediately follows a `<time>` element. To add the punctuation, we use the `:before` pseudo-selector to specify what we want to happen _before_ this second `<time>` tag, and we set the `content` property to indicate the content we want inserted.

``` {.css .numberLines}
.timeline li > time + time:before {
    content: "-";
}
```

If you haven't seen the `>` before in a CSS rule, it's the direct descendant selector. In this example, it means that the `<time>` element must be an immediate child of the `<li>` element. We're using this selector so our rules won't inadvertently apply to other `<time>` elements that may be nested deeper within the list item's content.

To finish up the punctuation, let's add a colon and space after the last of the `<time>` elements in each list item. We have to use two pseudo-selectors for this rule. The `:last-of-type` selector will target the last `<time>` element in the list item. That's the first `<time>` if there's only one and the second `<time>` if both are present. Then we add the `:after` pseudo-selector to insert content after that `<time>` element.

``` {.css .numberLines}
.timeline li > time:last-of-type:after {
    content: ": ";
}
```

With these changes we've cleaned up all of the obvious problems with our timeline.

<style>
.timeline1 {
    padding-top: 1em;
    font-size: 0.8em;
}
.timeline1 li {
    list-style-type: none;
}
.timeline1 li > time + time:before {
    content: "-";
}
.timeline1 li > time:last-of-type:after {
    content: ": ";
}
.timeline1 dt { width: 14em; }
.timeline1 dd { margin-left: 16em; }
</style>

<figure>
<ol class="timeline1">
<li>
<time>1589</time><time>1591</time><cite>The Two Gentlemen of Verona</cite>
<dl>
<dt>First official record</dt><dd>Francis Meres'...</dd>
<dt>First published</dt><dd>First Folio (1623)</dd>
<dt>First recorded performance</dt><dd>adaptation by...</dd>
<dt>Evidence</dt><dd>The play contains...</dd>
</dl>
</li>
<li>
<time>1590</time><time>1594</time><cite>The Taming of the Shrew</cite>
<dl>
<dt>First official record</dt><dd>possible version...</dd>
<dt>First published</dt><dd>possible version...</dd>
<dt>First recorded performance</dt><dd>According to Philip...</dd>
<dt>Evidence</dt><dd>Kier Elam posits...</dd>
</dl>
</li>
</ol>
<figcaption><span class="lgcp">CSS</span> styles make the timeline easier to read without changing the markup.</figcaption>
</figure>

Now we can add a little flair to the visualization.

### Step 7: Add Styles to Visually Structure the Timeline

The next set of CSS styles will improve the visual structure of the timeline. First among those improvements will be making the timeline look more like, well, a _line._ To do that, we can add a border to the left side of the `<li>` elements. At the same time, we'll also want to make sure that those `<li>` elements don't have any margins, as margins would introduce gaps in the border and break the continuity of the line.

``` {.css .numberLines}
.timeline li {
    border-left: 2px solid black;
}
.timeline dl,
.timeline li {
    margin: 0;
}
```

These styles add a nice vertical line on the left side of our entire timeline. Now that we have that line, we can shift the dates over to the left side of it. The shift requires rules for the parent `<li>` as well as the `<time>` elements. For the parent `<li>` elements, we want their `position` specified as `relative`.

``` {.css .numberLines}
.timeline li {
    position: relative;
}
```

By itself, this rule doesn't actually change our timeline. It does, however, establish a _positioning context_ for any elements that are children of the `<li>`. Those children include the `<time>` elements that we want to move. With the `<li>` set to `position: relative`, we can now set the `<time>` children to `position: absolute`. This rule lets us specify exactly where the browser should place the time elements, _relative_ to the parent `<li>`. We want to move all `<time>` elements to the left, and we want to move the second `<time>` element down. In the following code the first selector targets both of our `<time>` tags while the second selector, using the same `time + time` trick described earlier, targets only the second of two `<time>` tags.

``` {.css .numberLines}
.timeline li > time {
    position: absolute;
    left: -3.5em;
}
.timeline li > time + time {
    top: 1em;
    left: -3.85em;
}
```

By using `em` units rather than pixel `px` units for this shift, we define our shift to be relative to the current font size, regardless of what it is. That gives us the freedom to change the font size without having to go back and tweak any pixel positioning.

The specific values for the position shift may need adjustment depending on the specific font face, but, in general, we use a negative `left` position to shift content farther to the left than it would normally appear, and a positive `top` position to move the content down the page.

After moving the dates to the left of the vertical line, we'll also want to shift the main content a bit to the right so it doesn't crowd up against the line. The `padding-left` property takes care of that. And while we're adjusting the left padding we can also add a bit of padding on the bottom to separate each play from the other.

``` {.css .numberLines}
.timeline li {
    padding-left: 1em;
    padding-bottom: 1em;
}
```

With the dates and the main content on opposite sides of our vertical line, we no longer need any punctuation after the date, so we'll remove the style that adds a colon after the last `<time>` element.

<style>
.strikeThrough td.sourceCode { text-decoration: line-through; }
</style>

``` {.css .numberLines .strikeThrough}
.timeline li > time:last-of-type:after {
    content: ": ";
}
```

The fact that we're able to make this change highlights one of the reasons for using CSS to add the colon in the first place. If we had included the punctuation explicitly in the markup (by, for example, generating it in the JavaScript code), then our markup would be more tightly coupled to our styles. If a style modification changed whether the colon was appropriate, we would have to go back and change the JavaScript as well. With the approach that we're using here, however, styles and markup are much more independent. Any style changes are isolated to our CSS rules; no modifications to the JavaScript are required.

To further improve its visual styling, we can make a few other changes to our timeline. We can increase the font size for each play's title to make that information more prominent. At the same time, we can add some extra spacing below the title and indent the description list a bit.

``` {.css .numberLines}
.timeline li > cite {
    font-size: 1.5em;
    line-height: 1em;
    padding-bottom: 0.5em;
}
.timeline dl {
    padding-left: 1.5em;
}
```

For a last bit of polish, let's add a bullet right on the vertical line to mark each play and tie the title more closely to the dates. We use a large bullet (several times the normal size) and position it right over the line. As you can see from the following rules, the Unicode character for a bullet can be represented as `"\2022"`. The exact position values will depend on the specific font, but a bit of trial and error can perfect the adjustments.

``` {.css .numberLines}
.timeline li > time:first-of-type:after {
	content: "\2022";
	font-size: 3em;
	line-height: 0.4em;
	position: absolute;
	right: -0.65em;
	top: 0.1em;
}
```

Now our timeline is starting to look like an actual time _line._ In your own pages you could include additional styles to define fonts, colors, and so on, but even without those decorations the visualization is effective.

<style>
.timeline2 { font-size: 0.8em; }
.timeline2 li { list-style-type: none; }
.timeline2 li > time + time:before { content: "-"; }
.timeline2 li { border-left: 2px solid #444444; }
.timeline2 dl, .timeline2 li { margin: 0; }
.timeline2 li { position: relative; padding-left: 1em; padding-bottom: 1em; }
.timeline2 li > time { position: absolute; left: -3.5em; }
.timeline2 li > time + time { top: 1em; left: -3.85em; }
.timeline2 { padding-left: 5em; padding-top: 1.5em; }
.timeline2 li > cite { display: block; font-size: 1.5em; line-height: 1em; padding-bottom: 0.5em; }
.timeline2 li > time:first-of-type:after { content: "\2022"; font-size: 3em; line-height: 0.4em; position: absolute; right: -0.47em; top: 0.1em; }
.localfile .timeline2 li > time:first-of-type:after { right: -0.65em; }
.timeline2 dl { padding-left: 1.5em; }
.timeline2 dt { width: 14em; }
.timeline2 dd { margin-left: 16em; }
</style>

<figure>
<ol class="timeline2">
<li>
<time>1589</time><time>1591</time><cite>The Two Gentlemen of Verona</cite>
<dl>
<dt>First official record</dt><dd>Francis Meres'...</dd>
<dt>First published</dt><dd>First Folio (1623)</dd>
<dt>First recorded performance</dt><dd>adaptation by...</dd>
<dt>Evidence</dt><dd>The play contains...</dd>
</dl>
</li>
<li>
<time>1590</time><time>1594</time><cite>The Taming of the Shrew</cite>
<dl>
<dt>First official record</dt><dd>possible version...</dd>
<dt>First published</dt><dd>possible version...</dd>
<dt>First recorded performance</dt><dd>According to Philip...</dd>
<dt>Evidence</dt><dd>Kier Elam posits...</dd>
</dl>
</li>
</ol>
<figcaption>Additional styles clarify the structure of the timeline elements.</figcaption>
</figure>

### Step 8: Add Interactivity

The full details on all 40 of Shakespeare's plays might be a little overwhelming for a first view of our timeline. The visualization would be more effective if it showed only the play titles at first, but let users reveal more details through interactions. Because we're building this visualization ourselves, we have all the control necessary to make that happen.

First we'll set up a few additional styles. There are several ways to hide the play details with CSS, the most obvious being the `display:none` property. As we'll see a little later though, a better choice for our timeline is setting the `max-height` to 0. If the maximum height of an element is 0, then, in theory, it should be invisible. In practice, we also have to set the `overflow` property to `hidden`. Otherwise, even though the `<dl>` element itself has no height, the browser will display the content that overflows from it. Since we want our description lists to start out hidden, we can set that property as the default. 

``` {.css .numberLines}
.timeline li dl {
    max-height: 0;
    overflow: hidden;
}
```

To reveal a play's details, users click on the play's title in the `<cite>` element. To indicate to users that they can click on the title, we'll change the mouse cursor from the normal arrow to the "clickable" hand. We can also change the `display` property from the default `inline` to `block`. That change gives users a larger and more consistent area to click.

``` {.css .numberLines}
.timeline li > cite {
    cursor: pointer;
    display: block;
}
```

Finally, we need a way to reveal a play's details. We'll do that by adding a class of `"expanded"` to the `<li>` for the play. When that class is present, our styles should override the `max-height` of `0`.

``` {.css .numberLines}
.timeline li.expanded dl {
    max-height: 40em;
}
```

The exact value for the expanded `max-height` will depend on the content. In general, though, it should be large enough to reveal the full details for the item. It's okay to make it a little larger than necessary "just in case." Don't go overboard, however, and make it unreasonably large. (We'll see why at the end of this step.)

With these styles in place, we can add a bit of JavaScript to control them. It won't take much. The first step is writing an event handler that will be called when users click. That function will take a single parameter, specifically an `Event` object, with details about the click. One of those details is the `.target` property, which will contain a reference to the specific element of the page on which the user clicked. We care only about clicks on the `<cite>` elements.

``` {.javascript .numberLines}
var clicked = function(ev) {
    if (ev.target.nodeName === "CITE") {
        // Code continues...
    }
};
```

Once we know that a `<cite>` was clicked, we find its parent `<li>` element. We can then check to see if the `<li>` has the `"expanded"` class. If it doesn't, we add it. If the class is already present, we remove it. Our approach is a bit primitive because it allows only one class to be defined for the `<li>`. That's all we need for this example, though, so we'll stick with it.

``` {.javascript .numberLines}
var clicked = function(ev) {
    if (ev.target.nodeName === "CITE") {
        var li = ev.target.parentNode;
        if (li.className === "expanded") {
            li.className = "";
        } else {
            li.className = "expanded";
        }
    }
};
```


> Note: Modern browsers have a more sophisticated interface for controlling the class attributes of elements. That interface is the `classList`, and it easily supports multiple classes per element, as well as toggling the class on and off with a single function. Older browsers (namely Internet Explorer version 9 and earlier) don't support that interface, however. Since we don't need the extra functionality, the older `className` is sufficient for this example.

With our event handling function defined, we can associate it with clicks anywhere on the timeline. The standard `addEventListener` method creates the association for any element.

``` {.javascript .numberLines}
document.getElementById("timeline").addEventListener("click", clicked);
```

> Note: You might be curious as to why we're associating an event listener with the entire timeline visualization instead of, for example, adding individual event listeners to each `<cite>`. That alternative would eliminate the need to check the event target in the handler; however, it turns out that it's much less efficient than the approach we're taking. Event listeners can consume a fair bit of JavaScript resources, and our page will perform better if we keep them to a minimum.

If you're using jQuery, the required code is even simpler:

``` {.javascript .numberLines}
$("#timeline").on("click", "cite", function() {
    $(this).parent("li").toggleClass("expanded");
})
```

We're almost ready to show our new and improved timeline to the world, but there's one final refinement we can make. Our current version shows or hides a play's details all at once. This transition can be abrupt to users, as content appears or disappears instantly. We can provide a better experience by gracefully transitioning between the two states, and a natural transition for this timeline is animating the height of the content. When the details are hidden, they have a height of 0. And when we want to show them, we will gradually animate the height to its natural value.

It's possible to add these animations using JavaScript. The jQuery library, in fact, has a fairly extensive set of animation functions. In modern browsers, however, it is much better to animate content using CSS transitions. Web browsers are optimized for CSS, often offloading the computations to special high-performance graphics co-processors. In those cases CSS-based animations can perform several orders of magnitude better than JavaScript. The only disadvantage to using CSS for animations is a lack of support in older browsers. But animation isn't usually _critical_ to most web pages. Sure, it's nice, but if a user with an older browser misses out on the graceful transitions, it isn't the end of the world. The web page will still _function_ just fine.

The CSS `transition` property is the simplest way to define a CSS animation. It specifies the actual property to animate, the duration of the animation, and the _easing function_ to follow. Here's a rule we could use in our example:

``` {.css .numberLines}
.timeline li dl {
    transition: max-height 500ms ease-in-out;
}
```

This rule defines a transition for the timeline's `<dl>` elements. It specifies that the property to animate is `max-height`, so the transition will take effect whenever an element's `max-height` property changes (and that's precisely the property we modify when the `"expanded"` class is added or removed). The transition rule also specifies that the animation should take 500 milliseconds, and that it should "ease in" and "ease out." This last property indicates that the animation should start slowly; speed up, and then slow down again before finishing. That behavior usually looks more natural than animating at a constant speed.

CSS transitions can animate many CSS properties, but there is one important constraint. Both the starting and ending values must be explicit. That constraint explains why we're animating `max-height` instead of `height`, even though it's really just `height` that we want to change. Unfortunately, we can't animate `height` because it has no explicit value when the description list is expanded. Every `<dl>` will have its own height based on its content, and there's no way we can predict those values in our CSS. The `max-height` property, on the other hand, gives us explicit values for both states—`0` and `40em` in this example—so CSS can animate its transitions. We just have to be sure that no `<dl>` has content more than `40em` high. Otherwise, the extra content will be cut off. This doesn't mean, however, that we should set the `max-height` for expanded `<dl>` elements to an astronomical value. To see why, consider what would happen if we transitioned `max-height` to `1000em` for a `<dl>` that needed only `10em` of height. Ignoring (for simplicity) the complications of easing, it would only take 1/100<sup>th</sup> of the full transition time before the full content of the element was visible. The animation that we had planned to take 500 milliseconds is over in 5 milliseconds instead.

There is one final complication with CSS transitions. Most browsers implemented the functionality before the official standard was finalized. To make sure their implementations wouldn't conflict with potential changes in the official standards, browser vendors initially implemented transitions using a proprietary syntax. That syntax adds a prefix (`-webkit-` for Safari and Chrome, `-moz-` for Firefox, and `-o-` for Opera) to the property name. To cover all the major browsers, we must include a rule with each prefix.

``` {.css .numberLines}
.timeline li dl {
    -webkit-transition: max-height 500ms ease-in-out;
       -moz-transition: max-height 500ms ease-in-out;
         -o-transition: max-height 500ms ease-in-out;
            transition: max-height 500ms ease-in-out;
}
```

> Note: Internet Explorer doesn't need a prefix because Microsoft didn't implement transitions until the standard was stable. Also, there's no harm in specifying multiple prefixes since browsers simply ignore properties they don't understand.

Now our hand-crafted timeline responds perfectly to user interactions. Here's the complete visualization.

<style>
.timeline3 { font-size: 0.8em; }
.timeline3 li { list-style-type: none; }
.timeline3 li > time + time:before { content: "-"; }
.timeline3 li { border-left: 2px solid #444444; }
.timeline3 dl, .timeline3 li { margin: 0; }
.timeline3 li { position: relative; padding-left: 1em; padding-bottom: 1em; }
.timeline3 li > time { position: absolute; left: -3.5em; }
.timeline3 li > time + time { top: 1em; left: -3.85em; }
.timeline3 { padding-left: 5em; padding-top: 1.5em; }
.timeline3 li > cite { display: block; font-size: 1.5em; line-height: 1em; padding-bottom: 0.5em; }
.timeline3 li > time:first-of-type:after { content: "\2022"; font-size: 3em; line-height: 0.4em; position: absolute; right: -0.47em; top: 0.1em; }
.localfile .timeline3 li > time:first-of-type:after { right: -0.65em; }
.timeline3 dl { padding-left: 1.5em; }
.timeline3 li > cite { display: block; cursor: pointer; }
.timeline3 li dl { max-height: 0; overflow: hidden; }
.timeline3 li.expanded dl { max-height: 60em; }
.timeline3 li dl { -webkit-transition: max-height 500ms ease-in-out; -moz-transition: max-height 500ms ease-in-out; -o-transition: max-height 500ms ease-in-out; transition: max-height 500ms ease-in-out; }
.timeline3 dt { width: 14em; }
.timeline3 dd { margin-left: 16em; }
</style>

<figure>
<div class="timeline3" id="javascript-4"></div>
<figcaption>A fully interactive timeline requires only <span class="smcp">HTML</span>, <span class="smcp">CSS</span>, and a little JavaScript.</figcaption>
</figure>

<script>
;(function(){

    draw = function() {

        allplays = [
  { "play": "The Two Gentlemen of Verona",     "date": "1589-1591", "record": "Francis Meres' Palladis Tamia (1598); referred to as \"Gentlemen of Verona\"", "published": "First Folio (1623)", "performance": "adaptation by Benjamin Victor performed at David Garrick's Theatre Royal, Drury Lane in 1762. Earliest known performance of straight Shakespearean text at Royal Opera House in 1784, although because of the reference to the play in Palladis Tamia, we know it was definitely performed in Shakespeare's day.", "evidence": "The play contains passages which seem to borrow from John Lyly's Midas (1589), meaning it could not have been written prior to 1589. Additionally, Stanley Wells argues that the scenes involving more than four characters, \"betray an uncertainty of technique suggestive of inexperience.\" As such, the play is considered to be one of the first Shakespeare composed upon arriving in London (Roger Warren, following E.A.J. Honigmann, suggests he may have written it prior to his arrival) and, as such, he lacked theatrical experience. This places the date of composition as most likely somewhere between 1589 and 1591, by which time it is known he was working on the Henry VI plays" },
  { "play": "The Taming of the Shrew",         "date": "1590-1594", "record": "possible version of play entered into Stationers' Register on 2 May 1594 as \"a booke intituled A plesant Conceyted historie called the Tayminge of a Shrowe'. First record of play as it exists today found in the First Folio (1623)", "published": "possible version of play published in quarto in 1594 as A Pleasant Conceited Historie, called The taming of a Shrew (republished in 1596 and 1607). Play as it exists today first published in the First Folio (1623) as The Taming of the Shrew.", "performance": "According to Philip Henslowe's diary, a play called The Tamynge of A Shrowe was performed at Newington Butts Theatre on 13 June 1594. This could have been either the 1594 A Shrew or the Shakespearean The Shrew, but as the Admiral's Men and the Lord Chamberlain's Men were sharing the theatre at the time, and as such Shakespeare himself would have been there, scholars tend to assume that it was The Shrew. The Shakespearean version was definitely performed at court before King Charles I and Queen Henrietta Maria on 26 November 1633, where it was described as being \"liked'.", "evidence": "Kier Elam posits a date of 1591 as a terminus post quem for the composition of The Shrew, based on Shakespeare's probable use of two sources published that year; Abraham Ortelius's map of Italy in the Theatrum Orbis Terrarum (4th ed.) and John Florio's Second Fruits. However, scholars continue to debate the relationship between the 1594 A Shrew and the 1623 The Shrew. Some theorise that A Shrew is a reported text, meaning The Shrew must have been written prior to 2 May 1594; others, that A Shrew is an early draft, meaning The Shrew must have been completed sometime after 2 May 1594. There are also arguments that A Shrew may have been a source for The Shrew, that they could be two completely unrelated plays based on the same (now lost) source (the \"Ur-Shrew\" theory), or A Shrew could be an adaptation of The Shrew. Critics remain divided on this issue, and as such, dating the play is extremely difficult." },
  { "play": "Henry VI, Part 2",                "date": "1590-1591", "record": "version of the play entered into the Stationers' Register on 12 March 1594 as \"a booke intituled, the firste parte of the Contention of the twoo famous houses of york and Lancaster'.", "published": "version of the play published in quarto in 1594 as The First part of the Contention betwixt the two famous Houses of Yorke and Lancaster, with the death of the good Duke Humphrey: And the banishment and death of the Duke of Suffolke, and the Tragicall end of the proud Cardinal of Winchester, with the notable Rebellion of Jack Cade: and the Duke of Yorke's first claim unto the Crowne (republished in 1600 and 1619). The Folio text appears under the title The second Part of Henry the Sixt, with the death of the Good Duke Humfrey.", "performance": "although it is known that the play was definitely performed in Shakespeare's day, the first recorded performance was not until 23 April 1864 at the Surrey Theatre, directed by James Anderson.", "evidence": "It is known that 3 Henry VI was on stage by June 1592, and it is also known that 3 Henry VI was definitely a sequel to 2 Henry VI, meaning 2 Henry VI must also have been on stage by early 1592. This places the likely date of composition as 1590-1591." },
  { "play": "Henry VI, Part 3",                "date": "1591",      "record": "version of the play published in octavo in 1595. 3 Henry VI was never entered into the Stationers' Register.", "published": "version of the play published in octavo in 1595 as The True Tragedie of Richard Duke of Yorke, and the death of good King Henrie the Sixt, with the Whole Contention betweene the two Houses Lancaster and Yorke (republished in quarto in 1600 and 1619). The Folio text appears under the title The third Part of Henry the Sixt, with the death of the Duke of Yorke.", "performance": "although it is known that the play was definitely performed in Shakespeare's day, the first recorded performance was not until 1906, when F.R. Benson directed a production at the Shakespeare Memorial Theatre.", "evidence": "It is known that the play was definitely on stage by early 1592 as in A Groatsworth of Wit, Bought with a Million of Repentance, Robert Greene mocked Shakespeare by parodying a line from 3 Henry VI. Groatsworth was registered in the Stationers' Register in September 1592, meaning True Tragedy/3 Henry VI must have been on stage prior to 23 June 1592 as that was when the government shut the London theatres due to an outbreak of plague. To have been on stage by June 1592, the play was most likely written some time in 1591." },
  { "play": "Henry VI, Part 1",                "date": "1591",      "record": "possibly in Philip Henslowe's diary. On 3 March 1592, Henslowe reports seeing a new play entitled Harey Vj (i.e. Henry VI) which could be a reference to 1 Henry VI. An entry is found in the Stationers' Register in September 1598 which refers to \"The first and Second parte of Henry VJ'. Most critics, however, feel this probably refers to what we today call 2 Henry VI and 3 Henry VI, not 1 Henry VI. The first definite record of the play was not until the First Folio in 1623.", "published": "First Folio (1623), as The first Part of Henry the Sixt", "performance": "possibly on 3 March 1592 at The Rose in Southwark, as seen by Philip Henslowe; earliest definite performance was on 13 March 1738 at Covent Garden in what seems to have been a stand-alone performance.", "evidence": "On 3 March 1592, Philip Henslowe saw a new play entitled Harey Vj, but gives no further information. In August, Thomas Nashe published Piers Penniless his Supplication to the Devil, in which he refers to a play he had recently seen featuring a rousing depiction of Lord Talbot, a major character in 1 Henry VI. Most critics take Nashe's reference to Talbot as proof that the play Henslowe saw was 1 Henry VI. As such, to have been a new play in March 1592, it was most likely written some time in 1591. Furthermore, many critics consider 1 Henry VI to have been written as a prequel to the successful two-part play, The Contention and True Tragedy. Possibly co-written with Thomas Nashe and/or other unidentified dramatists." },
  { "play": "Titus Andronicus",                "date": "1591-1592", "record": "Philip Henslowe's diary, 24 January 1594. On 6 February 1594, the play was entered into the Stationers' Register as \"a booke intitled a Noble Roman Historye of Tytus Andronicus'.", "published": "version of the play published in quarto in February 1594 as The Most Lamentable Romaine Tragedy of Titus Andronicus (first known printing of a Shakespeare play). The play was republished in quarto in 1600 and 1611. There are only minor differences between the 1594 quarto text and the later 1623 First Folio text (i.e. the 1594 text is not considered a bad quarto or a reported text). The Folio text appears under the title The Lamentable Tragedy of Titus Andronicus.", "performance": "on 24 January 1594 at the Rose Theatre in Southwark, as recorded in Henslowe's diary.", "evidence": "According to the title page of the 1594 quarto, the play had been performed by Pembroke's Men, a company which ceased performing in September 1593. As such, the play must have been composed some time prior to September. Additionally, it is unlikely to have been written later than June 1592, as that was when the London theatres were closed due to an outbreak of plague. The theatres would remain shut for the better part of two years, not fully reopening until March 1594 and Shakespeare concentrated most of his energies during this period on poetry. As such, the play was most likely composed sometime between late-1591 and early 1592. Possibly co-written with George Peele" },
  { "play": "Richard III",                     "date": "1592",      "record": "version of the play entered into the Stationers' Register on 20 October 1597 as \"a booke intituled, The tragedie of kinge Richard the Third wth the death of the duke of Clarence'.", "published": "version of the play published in quarto in December 1597 as The tragedy of King Richard the third. Containing, his treacherous plots against his brother Clarence: the pittiefull murther of his innocent nephewes: his tyrannicall usurpation: with the whole course of his detested life, and most deserved death. The Folio text appears under the title The Tragedy of Richard the Third, with the Landing of Earle Richmond, and the Battell at Bosworth Field.", "performance": "The play was performed extensively in Shakespeare's lifetime; it is mentioned in Palladis Tamia in 1598 (as \"Richard the 3.'), and by the time of the First Folio in 1623, had been published in quarto six times (1597, 1598, 1603, 1605, 1612 and 1622), and referenced by multiple writers of the day. Regarding specific performances however, there is little solid evidence. In 1602, John Manningham mentions seeing Richard Burbage playing the role of Richard III, but he offers no further information. The earliest definite performance was at St James's Palace on 16 or 17 November 1633 by the King's Men.", "evidence": "It is known that Richard III was definitely a sequel to 3 Henry VI, which was on-stage by 23 June 1592, hence Richard III must have been written later than early 1592. Additionally, it has been argued that the play contains evidence suggesting it was originally written for Strange's Men, but then rewritten for Pembroke's Men, a company which formed in mid-1592. Also, with the closure of the theatres due to an outbreak of plague in June 1592, the play was unlikely to have been written any later than that, all of which suggests a date of composition as sometime in early-1592." },
  { "play": "Edward III",                      "date": "1592-1593", "record": "entered into the Stationers' Register on 1 December 1595 as \"a booke intituled Edward the Third and the blacke prince their warres wth kinge Iohn of Fraunce'.", "published": "published in quarto in 1596 as The Raigne Of King Edvvard the third (republished in 1599)", "performance": "although it is known from the 1596 quarto title page that the play was performed in the 1590s, the earliest recorded performance was not until 6 March 1911 at the Little Theatre in London, directed by Gertrude Kingston and William Poel. However, this production presented only the first half of the play (dealing with the King's infatuation with the Countess of Salisbury). Performed under the title, The King and the Countess, it was presented in a single matinée performance with the anonymous sixteenth century liturgical drama, Jacob and Esau. The first known performance of the complete text took place in June 1987, at the Theatr Clwyd, directed by Toby Robertson.", "evidence": "Obviously, the play was written by December 1595. According to the title page of the quarto, it had been performed recently in London, but no company information is provided. This could mean that the company that performed the play had disbanded during the closure of the theatres from June 1592 to March 1594. Furthermore, internal evidence suggests that the play may have been specifically written for Pembroke's Men, who ceased performing in September 1593. This places the date of composition as most likely somewhere between early 1592 and September 1593." },
  { "play": "The Comedy of Errors",            "date": "1594",      "record": "Francis Meres' Palladis Tamia (1598); referred to as \"Errors\"", "published": "First Folio (1623)", "performance": "probably on Innocents Day, 28 December 1594 at Gray's Inn (one of the four London Inns of Court). The only known evidence for this performance is the Gesta Grayorum, a 1688 text printed for William Canning based on a manuscript apparently handed down from the 1590s, detailing the \"Prince of Purpoole\" festival from December 1594 to February 1595.[c] According to the text, after a disastrous attempt to stage \"some notable performance [...] it was thought good not to offer any thing of Account, saving Dancing and Revelling with Gentlewomen; and after such Sports, a Comedy of Errors (like to Plautus his Menaechmus) was played by the Players. So that Night was begun, and continued to the end, in nothing but Confusion and Errors; whereupon, it was ever afterwards called, The Night of Errors.\" As Comedy of Errors is indeed based on Menaechmus, this is almost universally accepted as a reference to an otherwise unrecorded performance of the play, probably by Shakespeare's own company, the newly formed Lord Chamberlain's Men.", "evidence": "traditionally, the play has been dated quite early (Ros King, for example, dates it 1586-1589), and has often been seen as Shakespeare's first comedy, perhaps his first play. However, stylistic and linguistic analysis (proportion of verse to prose, amount of rhyme, use of colloquialism in verse, and a rare word test) has placed it closer to the composition of Richard II and Romeo and Juliet, both of which were written in 1594 or 1595. More specifically, the limited setting (it is one of only two Shakespeare plays to observe the Classical unities) and the brevity of the play (Shakespeare's shortest at 1777 lines), along with the great abundance of legal terminology, suggests to some critics the probability of it being written especially for the Gray's Inn performance, which would place its composition in the latter half of 1594. If it was written for Gray's Inn, it most likely represents the first play by Shakespeare which was specifically commissioned. In this case, that commission could have come from Henry Wriothesley, Earl of Southampton, a member of the Inns of Court, and Shakespeare's patron." },
  { "play": "Love's Labour's Lost",            "date": "1594-1595", "record": "a version of the play was published in quarto in 1598, although the exact date is unknown as it was never entered into the Stationers' Register. Also in 1598, Robert Tofte mentioned the play in his sonnet sequence Alba. The months minde of a melancholy lover; \"Love's Labour Lost, I once did see, a play/Y'cleped so, so called to my pain.\" The date of publication of Alba is unknown as it also was not entered into the Register. Additionally, the play is mentioned in Meres' Palladis Tamia (registered on 7 September, with a dedication dated 10 October). It is unknown exactly which one of these three constitutes the first official record of the play.", "published": "version of the play published in quarto in 1598 as A Pleasant Conceited Comedie called Loves labors lost (the first known printing of a Shakespearean play to include his name on the title page). The Folio text appears under the title Love's Labour's lost.", "performance": "according to the quarto title page, the play was performed at court for Queen Elizabeth sometime over Christmas 1597, however, no further information is provided. The earliest definite performance took place some time between 8 and 15 January 1605, for Anne of Denmark, at either Henry Wriothesley or Robert Cecil's house.", "evidence": "Obviously, the play was written by Christmas 1597, but narrowing the date further has proved difficult, with most efforts focusing upon stylistic evidence. Traditionally, it was seen as one of Shakespeare's earliest plays (Charles Gildon wrote in 1710; \"since it is one of the worst of Shakespeare's Plays, nay I think I may say the very worst, I cannot but think it is his first.') For much of the eighteenth century, it tended to be dated 1590, until Malone's newly constructed chronology in 1778, which dated it 1594. In his 1930 chronology, E.K. Chambers found the play to be more sophisticated than Malone had allowed for, and dated it 1595. Today most scholars tend to concur with a date of 1594-1595, and the play is often grouped with the \"lyrical plays'; Richard II, Romeo and Juliet and A Midsummer Night's Dream, because of its prolific use of rhyming. These four plays are argued to represent a phase of Shakespeare's career where he was experimenting with rhyming iambic pentameter as an alternative form to standard blank verse; Richard II has more rhymed verse than any other history play (19.1%), Romeo and Juliet more than any other tragedy (16.6%) and Love's Labour's and Midsummer Night more than any other comedy (43.1% and 45.5% respectively). All four tend to be dated to 1594/1595. In support of this, Ants Oras' pause test places the play after Richard III, which is usually dated 1592. Furthermore, Taylor finds possible allusions to the Gray's Inn revels of December 1594 (specifically the Muscovite masque in Act 5, Scene 2), and also finds plausible Geoffrey Bullough's argument that the satire of the King of Navarre (loosely based on Henry of Navarre, who was associated with oath breaking after abjuring Protestantism in 1593) favours a date after December 1594, when Henry survived an assassination attempt." },
  { "play": "Love's Labour's Won",             "date": "1595-1596", "record": "Francis Meres' Palladis Tamia (1598); referred to as \"Love labours wonne\"", "published": "published in quarto some time prior to 1603", "performance": "there are no recorded performances of the play", "evidence": "There are only two known references to this play. One is in Meres' Palladis Tamia, the other is on a list by Christopher Hunt, dated August 1603, which gives a list of published plays sold by an Exeter bookseller. Up until 1953, only Meres' reference was known, until Hunt's two pages of handwriting were discovered in the backing of a copy of Thomas Gataker's Certaine Sermones. The discovery was handed over to T.W. Baldwin, who published his findings in 1957 as Shakespeare's Love's Labour's Won. The title suggests the play was written as a sequel to Love's Labour's Lost, which is partially supported by the unusually open-ended nature of that play, hence Love's Labour's Won's position in the Oxford chronology. However, whether the play ever existed has been debated, with some critics speculating that it is simply another name for one of Shakespeare's known plays, a situation similar to Henry VIII, which was originally performed with the title All is True. As Meres refers to The Two Gentlemen of Verona, The Comedy of Errors and The Merchant of Venice, prior to the discovery of the Hunt reference, a common suggestion was The Taming of the Shrew, but as Hunt mentions this play, it could not be Love's Labour's Won. Although Much Ado About Nothing, All's Well That Ends Well and Troilus and Cressida have also been cited as possibilities, these plays tend to be dated later than 1598 (much later in the case of Troilus, although the argument is that Love's Labour's Won is an early draft), and as there are no other pre-1598 Shakespearean comedies with which to equate it, it seems certain that the play did exist, that it was performed and published, but that it has since been lost." },
  { "play": "Richard II",                      "date": "1595",      "record": "entered into the Stationers' Register on 29 August 1597 as \"the Tragedye of Richard the Second'.", "published": "version of the play published in quarto in 1597 as The Tragedie of King Richard the second (republished in 1598 (twice), 1608 and 1615). The Folio text appears under the title The life and death of King Richard the Second", "performance": "possible performance on 9 December 1595 at Sir Edward Hoby's house. Hoby's wife, the daughter of Baron Hunsdon (chief patron of the Lord Chamberlain's Men), wrote a letter to Sir Robert Cecil inviting him to supper and to see \"K. Richard present him self to your vewe.\" Many scholars see this as a reference to Richard II, especially because of the Hunsdon connection with Shakespeare's company. However, some scholars argue that the reference could be to a painting, not a play, whilst others argue there is no evidence that \"K. Richard\" necessarily refers to Richard II, suggesting it could refer to Richard III or to another play entirely. There is no complete consensus on this issue, although most scholars do tend to favour the Richard II theory. The earliest definite performance was at the Globe Theatre on 7 February 1601, organised by the Earl of Essex in a performance probably intended to inspire his supporters on the eve of his armed rebellion against Queen Elizabeth. According to testimony given by actor Augustine Phillips at Essex' trial for treason, he paid the Lord Chamberlain's Men forty shillings more than the standard rate to stage the play.", "evidence": "Richard II is usually seen as one of the \"lyrical plays', along with Love's Labour's Lost, Romeo and Juliet and A Midsummer Night's Dream; four plays in which Shakespeare used rhymed iambic pentameter more than anywhere else in his career. The four plays also include elaborate punning, rhetorical patterning, a general avoidance of colloquialisms and a high volume of metrical regularity. All four of these plays tend to be dated to 1594-1595. Also important in dating the play is Samuel Daniel's The First Four Books of the Civil Wars, which was entered into the Stationers' Register on 11 October 1594, and published in early 1595. Although some scholars have suggested that Daniel used Shakespeare as a source, which would mean the play was written somewhat earlier than 1594, most agree that Shakespeare used Daniel, especially in some of the later scenes, meaning the play could not have been written earlier than 1595." },
  { "play": "Romeo and Juliet",                "date": "1595",      "record": "version of the play published in 1597 (this play was never entered into the Stationers' Register)", "published": "version of the play published in quarto in 1597 as An excellent conceited tragedie of Romeo and Juliet", "performance": "1 March 1662 at Lincoln's Inn Fields, directed by William Davenant.", "evidence": "" },
  { "play": "A Midsummer Night's Dream",       "date": "1595",      "record": "Francis Meres' Palladis Tamia (1598); referred to as \"Midsummers night dreame\"", "published": "in quarto in November or December 1600", "performance": "", "evidence": "" },
  { "play": "The Life and Death of King John", "date": "1596",      "record": "Francis Meres' Palladis Tamia (1598); referred to as \"King Iohn\"", "published": "First Folio (1623)", "performance": "although there are several references to the play having been performed during the seventeenth century, none of them offer any specific details, and the first documented performance was on 26 February 1737 at Covent Garden.", "evidence": "" },
  { "play": "The Merchant of Venice",          "date": "1596",      "record": "version of the play entered into the Stationers' Register on 22 July 1598", "published": "version of the play published in quarto in 1600 as The most excellent historie of the merchant of Venice. With the extreame crueltie of Shylocke the Jewe towards the sayd merchant, in cutting a just pound of his flesh: and the obtayning of Portia by the choyse of three chests", "performance": "the play was performed at court for King James on 10 February 1605.", "evidence": "The play was obviously in existence by 1598, however, other evidence places its date of composition as earlier, probably 1596. Shakespeare's source for the casket subplot is believed to have been Richard Robinson's translation of the Gesta romanorum, which wasn't published until late 1595. In addition, Salarino's reference to \"my wealthy Andrew docked in sand\" is thought to refer to the San Andréas, a Spanish merchant vessel that ran aground in Essex in June 1596. It is also thought by scholars that the play was written to capitalise on the enormous success of Christopher Marlowe's The Jew of Malta." },
  { "play": "Henry IV, Part 1",                "date": "1596-1597", "record": "version of the play entered into the Stationers' Register on 25 February 1598", "published": "version of the play published in quarto in 1598 as The History of Henrie the Fourth, with the battell at Shrewsburie between the King and Lord Henry Percy, surnamed Hotspur of the North, with the humorous conceits of Sir John Falstaffe 1623 Folio text appeared under the title The First Part of Henry the Fourth, with the Life and Death of Henry Sirnamed Hot-spurre", "performance": "the play was probably performed at court for an Ambassador from Burgundy on 6 March 1600.", "evidence": "" },
  { "play": "The Merry Wives of Windsor",      "date": "1597-1598", "record": "version of the play entered into the Stationers' Register on 18 January 1602", "published": "version of the play published in quarto in 1602 as A most pleasaunt and excellent conceited comedie, of Sir John Falstaffe, and the merrie wives of Windsor. Entermixed with sundrie variable and pleasing humours, of Sir Hugh the Welch knight, Justice Shallow, and his wise cousin M. Slender. With the swaggering vaine of Auncient Pistoll, and Corporall Nym", "performance": "4 November 1604 at Whitehall Palace.", "evidence": "Textual evidence and certain topical allusions suggest the play was composed as a specially commissioned piece for a Garter Feast (an annual meeting of the Order of the Garter), possibly the Feast on 23 April 1597. It is theorised that Shakespeare interrupted his composition of 2 Henry IV somewhere around Act 3-Act 4, so as to concentrate on writing Merry Wives." },
  { "play": "Henry IV, Part 2",                "date": "1596-1597", "record": "version of the play entered into the Stationers' Register on 23 August 1600", "published": "version of the play published in quarto in 1600 as The second part of Henrie the fourth, continuing to his death, and coronation of Henrie the fift. With the humours of Sir John Falstaffe, and swaggering Pistoll 1623 Folio text appeared under the title The Second Part of Henry the Fourth, Containing his Death and the Coronation of King Henry the Fift", "performance": "a play entitled Sir John Falstaffe was performed at Whitehall over the Christmas period of 1612 which is believed to be 2 Henry IV.", "evidence": "The play could not have been written any earlier than January 1596, as it contains an allusion to the Sultanate of Mehmed III, who didn't become sultan until that date." },
  { "play": "Much Ado About Nothing",          "date": "1598-1599", "record": "version of the play published in 1600 (this play was never entered into the Stationers' Register)", "published": "Much adoe about Nothing was published in quarto in 1600", "performance": "14 February 1613, performed at court as part of the festivities to celebrate the marriage of Princess Elizabeth of Bohemia and Frederick V, Elector Palatine", "evidence": "The play was not included in Francis Meres' Palladis Tamia, which was registered on 7 September 1598, suggesting it hadn't been performed prior to that date. Furthermore, evidence in the quarto text suggests that Shakespeare originally wrote the role of Dogberry for William Kempe, however, records indicate that Kempe left the Lord Chamberlain's Men sometime in late 1598, so the play must have been written before then. As such, it was most likely composed sometime in the latter half of 1598 and was certainly completed before the new year." },
  { "play": "Henry V",                         "date": "1599",      "record": "version of the play entered into the Stationers' Register on 14 August 1600", "published": "version of the play published in quarto in 1600 as The cronicle history of Henry the fift, with his battell fought at Agin Court in France. Togither with Auntient Pistoll. 1623 Folio text appeared under the title The Life of Henry the Fift", "performance": "7 January 1605 at the Globe Theatre, performed by the Lord Chamberlain's Men.", "evidence": "Of all Shakespeare's plays, Henry V is one of the easiest to date. A reference by the Chorus to the Earl of Essex's Irish expedition of 1599 means the play was most likely written sometime between March 1599 (when Essex left for Ireland) and September 1599 (when he returned)." },
  { "play": "Julius Caesar",                   "date": "1599",      "record": "Thomas Platter the Younger's Diary, 21 September 1599", "published": "First Folio (1623) as The Tragedie of Julius Caesar", "performance": "21 September 1599 at the newly opened Globe Theatre", "evidence": "Obviously, the play was completed by September 1599, and may have been composed specifically as the opening play for the new theatre. In addition, because the play is not mentioned in Meres' Palladis Tamia, registered in September 1598, it was unlikely to have been performed prior to then. This places the date of composition as somewhere between September 1598 and September 1599. Additionally, textual analysis has connected the play to Henry V, which was almost certainly written in 1599, suggesting so too was Julius Caesar." },
  { "play": "As You Like It",                  "date": "1599-1600", "record": "on 4 August 1600 a staying order was entered in the Stationers' Register for As yo like yt", "published": "First Folio (1623)", "performance": "possibly on 2 December 1603 at Wilton House in Wiltshire, where a play was performed for James I; earliest definite performance on 20 December 1740, at Drury Lane.", "evidence": "" },
  { "play": "Hamlet",                          "date": "1599-1601", "record": "version of the play entered into the Stationers' Register on 26 July 1602. Folio text appeared under the title The Tragedie of Hamlet, Prince of Denmarke", "published": "version of the play published in quarto in 1603 as The tragicall historie of Hamlet Prince of Denmarke", "performance": "the entry in the Stationers' Register in July 1602 states that the play was \"latelie Acted by the Lo: Chamberleyne his servantes'. The title page of the first quarto states that it had been performed in London, at the two universities of Cambridge and Oxford, \"and else-where', presumably on tour in the provinces. The first definite dated performance took place on a ship anchored off the coast of Africa in September 1607, the Red Dragon. The play was performed by the crew.", "evidence": "Because the versions of Hamlet which appeared in 1603, in 1604 (again in quarto) and in the First Folio of 1623 differ so much from one another, dating the play is exceptionally difficult. There is also the problem of the Ur-Hamlet, a possible source used by Shakespeare, now lost. Others however, feel that Ur-Hamlet (if it ever existed) was most likely an early draft. Hamlet was written sometime between September 1598 (as it was not included in Meres' Palladis Tamia) and July 1602 (when it was registered in the Stationers Register). Furthermore, internal references to Julius Caesar would indicate the play could not have been written any earlier than September 1599. Additionally, in his 1598 copy of an edition of Geoffrey Chaucer's works, Gabriel Harvey has written that Shakespeare's \"Lucrece & his tragedie of Hamlet, prince of Denmarke, have it in them, to please the wiser sort'. Harvey also mentions the Earl of Essex as still alive, which would suggest he wrote the note prior to 25 February 1601, when Essex was executed. This would seem to narrow the date of composition to between September 1599 and February 1601; however, not all scholars accept the veracity of Harvey's note. Internal evidence in the play has also been cited, usually as illustrative of a date of composition of 1600 or 1601. As such, many scholars interpret the available evidence as suggestive of a date of initial composition sometime in 1600, with subsequent revisions. This dating, however, is far from universally accepted." },
  { "play": "Twelfth Night",                   "date": "1601",      "record": "John Manningham mentions in his Diary having seen the play performed in February 1602", "published": "First Folio (1623) as Twelfe Night, Or what you will", "performance": "John Manningham saw the play performed at the Middle Temple on Candlemas 1602, which fell on 2 February.", "evidence": "" },
  { "play": "Troilus and Cressida",            "date": "1602",      "record": "version of the play entered into the Stationers' Register on 7 February 1603", "published": "version of the play published in quarto in 1609 as The historie of Troylus and Cresseida. 1623 Folio text appeared under the title The Tragedie of Troilus and Cressida", "performance": "an adaptation of the play by John Dryden was staged in 1679.", "evidence": "" },
  { "play": "Measure for Measure",             "date": "1603-1604", "record": "revels accounts for Christmas 1604-1605 state the play was performed over the holidays", "published": "First Folio (1623)", "performance": "Revels accounts for Christmas 1604-1605 indicate the play was performed at Whitehall on St. Stephen's Day 1604.", "evidence": "This play is notoriously difficult to date specifically partly due to a lack of solid evidence and partly due to the theory that the text which appeared in the First Folio was not Shakespeare's original text. Obviously the play was written (in some form) prior to December 1604. The only other evidence are possible topical references within the play itself which would seem to indicate a date most likely in 1602, but this is not universally accepted by all scholars. Furthermore, there is a theory that Thomas Middleton rewrote the play after Shakespeare's death, possibly in 1621, which throws further doubt on the exact date of initial composition." },
  { "play": "Othello",                         "date": "1603-1604", "record": "revels accounts refer to the play having been performed in November 1604", "published": "version of the play published in quarto in 1622 as The Tragedy of Othello, the Moore of Venice", "performance": "revels accounts indicate the play was performed at Whitehall on 1 November 1604.", "evidence": "" },
  { "play": "King Lear",                       "date": "1605-1606", "record": "version of the play entered into the Stationers' Register on 26 November 1607 as A booke called. Mr William Shakespeare his historye of Kinge Lear", "published": "version of the play published in quarto in 1608 as The true chronicle historie of the life and death of King Lear and his three daughters. With the unfortunate life of Edgar, sonne and heire to the Earle of Gloster, and his sullen and assumed humor of Tom of Bedlam", "performance": "according to the Stationers' Register, the play was performed at Whitehall on 26 December 1606", "evidence": "the play must have been written by late 1606. Additionally, scholars generally agree that the play is indebted to Samuel Harsnett's Declaration of Egregious Popish Impostures (entered into the Stationers' Register on 16 March 1603) and John Florio's 1603 translation of Montaigne's Essays., placing the date of composition as somewhere between March 1603 and December 1606. A further possible source for the play has evoked some disagreement however. Whilst many scholars feel that Shakespeare used the anonymous play The True Chronicle History of King Leir (entered into the Stationers' Register on 8 May 1605), and hence must have been written between May 1605 and December 1606, others argue that the relationship between the two plays has been inverted, and The True Chronicle History of King Leir was actually written to capitalise on the success of Shakespeare's play, which was probably written in 1603 or 1604. No real critical consensus has been reached regarding this disagreement." },
  { "play": "Timon of Athens",                 "date": "1605-1606", "record": "entered into the Stationers' Register on 8 May 1623", "published": "First Folio (1623) as The Life of Timon of Athens", "performance": "in 1674, Thomas Shadwell wrote an adaptation of the play under the title Timon of Athens: Or, The Man-hater", "evidence": "This play is another which is extremely difficult to date precisely, not the least cause of which is the claim that Shakespeare may only have written part of it, with the play being subsequently revised by Thomas Middleton. There is no reference to the play whatsoever prior to 1623, and as such, evidence for its date of composition must come from within the play itself. Taylor concludes that Middleton and Shakespeare were jointly responsible for the play and assigns the composition date to 1605 on the basis of previous analyses of colloquialism-in-verse and rare vocabulary." },
  { "play": "Macbeth",                         "date": "1606",      "record": "possibly by Simon Forman, who records seeing the play in April 1611. However, there is considerable debate amongst scholars as to whether Forman's account is genuine", "published": "First Folio (1623) as The Tragedie of Macbeth", "performance": "possibly in April 1611, recorded by Simon Forman", "evidence": "Scholars place the date of composition as somewhere between 1603 and 1607, but efforts to narrow that date have proved inconclusive. Several possible topical references to the Gunpowder Plot of 1605 have been proposed and debated among scholars, but these references have not been universally accepted. In 1790, Edward Malone dated the play to 1606, and the vast majority of critics agree with this date even while acknowledging that little conclusive evidence exists, though the date seems correct in the context of Shakespeare's other work of the period. One suggested allusion supporting a date in late 1606 is the first witch's dialogue about a sailor's wife: \"'Aroint thee, witch!\" the rump-fed ronyon cries./Her husband's to Aleppo gone, master o' the Tiger\" (1.6-7). This has been thought to allude to the Tiger, a ship that returned to England 27 June 1606 after a disastrous voyage in which many of the crew were killed by pirates. A few lines later the witch speaks of the sailor, \"He shall live a man forbid:/Weary se'nnights nine times nine\" (1.21-2). The real ship was at sea 567 days, the product of 7x9x9, which has been taken as a confirmation of the allusion, which if correct, confirms that the play could not have been written any earlier than July 1606. A. R. Braunmuller, however, in the New Cambridge edition, finds the 1605-6 arguments inconclusive, and argues only for an earliest date of 1603. Further complicating the dating of Macbeth is the fact that the play shows evidence of later revisions by Middleton, particularly in the witch scenes." },
  { "play": "Antony and Cleopatra",            "date": "1606",      "record": "entered into the Stationers' Register on 20 May 1608", "published": "First Folio (1623) as The Tragedie of Antony and Cleopatra", "performance": "according to the 1669 records for the Lord Chamberlain's Men, the play had recently been performed at Blackfriars, but no further information is given; earliest definite performance in 1759 when it was staged by David Garrick.", "evidence": "" },
  { "play": "All's Well That Ends Well",       "date": "1606-1607", "record": "First Folio (1623)", "published": "First Folio (1623)", "performance": "1741 at Goodman's Fields Theatre, directed by Henry Giffard.", "evidence": "" },
  { "play": "Pericles, Prince of Tyre",        "date": "1607",      "record": "version of the play entered into the Stationers' Register on 20 May 1608", "published": "version of the play published in quarto in 1609 as The Late and much admired Play Called Pericles, Prince of Tyre, with the true Relation of the whole History, adventures, and fortunes of the sayd Prince: As also, the no lesse strange, and worthy accidents, in the Birth and Life, of his Daughter Mariana", "performance": "April 1607, seen by the Venetian ambassador to England, Zorzi Giustinian.", "evidence": "Because the play was not included in the First Folio, there has always been doubt as to whether or not Shakespeare actually wrote it at all. It first appears together with Shakespeare's other plays in the second issue of the Third Folio of 1664. In a contested field, the most widely accepted theory today is that Shakespeare collaborated on the play with another playwright, probably his younger colleague, George Wilkins. There is no complete agreement what the motives or mechanism of this collaboration were. In 1608, Wilkins published a prose narrative of Pericles purporting to be a narrative version of the play and which contains numerous phrases that seem to recall specific lines in the play, suggesting that work on the play preceded his composition of the prose version. Textual analysis of the play has suggested it be placed as in some close relation with All's Well That Ends Well and Coriolanus, which would confirm a date of 1607-1608." },
  { "play": "Coriolanus",                      "date": "1608",      "record": "entered into the Stationers' Register on 8 November 1623", "published": "First Folio (1623) as The Tragedy of Coriolanus", "performance": "an adaptation of the play by Nahum Tate was performed at Drury Lane in 1681, under the title The Ingratitude of a Common-Wealth", "evidence": "Stylistic tests place the composition of the play after Lear, Macbeth, and Antony and Cleopatra, and the form of the verse and imagery fit well with Timon, Antony, and Pericles. Shakespeare's treatment of the grain riots is strikingly reminiscent of the Midlands corn riots of 1607. Though Menenius' fable of the belly was used in other contemporary works, the wording of Menenius's speech about the body politic is derived from William Camden's Remaines (1605). Two possible echoes of George Chapman's Iliad (registered 14 November 1608) support a date of 1608-9. A reference to \"the coal of fire upon ice\" (1.1.170) is a possible allusion to the winter of 1607-08, when the frost was so severe that vendors set up booths on the frozen Thames river and pans of coals were placed on the ice so that pedestrians could warm themselves. An allusion to the complaints about Hugh Myddelton's project to bring water to London has also been detected in Martius' warning to the patricians (3.1.98-9). Taylor says that the cumulative internal evidence all points to a composition date of no earlier than spring of 1608, while others favour late 1608 to early 1609. Several allusions in other works establish a terminal date of composition: Ben Jonson's Epicœne, or The silent woman, composed in late 1609, mocks a peculiar phrase in the play, and Phantasma (registered 6 February 1609), written by Robert Armin, a member of the King's Men from 1599 to 1610, contains a close literary parallel. Critics also suggest that the regular act intervals indicate that it could have been written for the indoor Blackfriars Theatre, which Shakespeare's company acquired in 1608." },
  { "play": "The Winter's Tale",               "date": "1609-1610", "record": "Simon Forman saw the play at the Globe on 15 May 1611; it was performed at Court 11 November 1611", "published": "First Folio (1623)", "performance": "", "evidence": "The dance of twelve satyrs is similar to the dance of satyrs in Ben Jonson's masque Oberon performed at Court on 1 January 1611, but Taylor believes it is a later interpolation. It shares some of the same source material as Cymbeline, and stylistically it is in Shakespeare's late period. Most critics agree that it should be paired with Cymbeline." },
  { "play": "Cymbeline",                       "date": "1610-1611", "record": "Simon Forman saw it performed at the Globe in 1611", "published": "First Folio (1623) as The Tragedie of Cymbeline", "performance": "In an undated entry, Simon Forman saw the play performed at the Globe in 1611", "evidence": "" },
  { "play": "The Tempest",                     "date": "1610-1611", "record": "revels accounts refer to the play having been performed in November 1611", "published": "First Folio (1623)", "performance": "1 November 1611, at Whitehall for James I, performed by the King's Men.", "evidence": "" },
  { "play": "Cardenio",                        "date": "1612-1613", "record": "entered into the Stationers' Register in 1653, attributed to William Shakespeare and John Fletcher", "published": "an adaptation was published in 1727 by Lewis Theobald entitled Double Falshood; or, the Distrest Lovers", "performance": "1613, performed at the Globe by the King's Company", "evidence": "A lost play, published only in an adaptation by Lewis Theobald entitled Double Falshood (1728)." },
  { "play": "Henry VIII, or All is True",      "date": "1613",      "record": "", "published": "First Folio (1623) as The Famous History of the Life of King Henry the Eight", "performance": "29 June 1613, the night the Globe burnt down.", "evidence": "Probably written in collaboration with John Fletcher" },
  { "play": "The Two Noble Kinsmen",           "date": "1613",      "record": "entered into the Stationer' Register on 8 April 1634", "published": "published in quarto in 1634", "performance": "", "evidence": "Not included in the First Folio; written in collaboration with John Fletcher." }
        ];

        plays = allplays.slice(0,5);
        var container = document.getElementById("javascript-1");
        var list = document.createElement("ol");
        container.appendChild(list);
        plays.forEach(function(play) {
            var listItem = document.createElement("li");
            listItem.textContent = play.date + ": " + play.play;
            list.appendChild(listItem);
        });
        
        container = document.getElementById("javascript-2");
        list = document.createElement("ol");
        container.appendChild(list);
        plays.forEach(function(play) {
            var listItem = document.createElement("li");
            if (play.date.indexOf("-") !== -1) {
                var dates = play.date.split("-");
                var time = document.createElement("time");
                time.textContent = dates[0];
                listItem.appendChild(time);
                time = document.createElement("time");
                time.textContent = dates[1];
                listItem.appendChild(time);
            } else {
                var time = document.createElement("time");
                time.textContent = play.date;
                listItem.appendChild(time);
            }
            var cite = document.createElement("cite");
            cite.textContent = play.play;
            listItem.appendChild(cite);
            list.appendChild(listItem);
        })
        
        var descTerms = [
            { key: "record",      label: "First official record"},
            { key: "published",   label: "First published"},
            { key: "performance", label: "First recorded performance"},
            { key: "evidence",    label: "Evidence"},
        ];
        plays = allplays.slice(0,2);
        container = document.getElementById("javascript-3");
        list = document.createElement("ol");
        container.appendChild(list);
        plays.forEach(function(play) {
            var listItem = document.createElement("li");
            if (play.date.indexOf("-") !== -1) {
                var dates = play.date.split("-");
                var time = document.createElement("time");
                time.textContent = dates[0];
                listItem.appendChild(time);
                time = document.createElement("time");
                time.textContent = dates[1];
                listItem.appendChild(time);
            } else {
                var time = document.createElement("time");
                time.textContent = play.date;
                listItem.appendChild(time);
            }
            var cite = document.createElement("cite");
            cite.textContent = play.play;
            listItem.appendChild(cite);
            var descList = document.createElement("dl");
            descTerms.forEach(function(term)  {
                if (play[term.key]) {
                    var descTerm = document.createElement("dt");
                    descTerm.textContent = term.label;
                    descList.appendChild(descTerm);
                    var descElem = document.createElement("dd");
                    descElem.textContent = play[term.key];
                    descList.appendChild(descElem);
                }
            });
            listItem.appendChild(descList);
            list.appendChild(listItem);
        })
        
        plays = allplays;
        container = document.getElementById("javascript-4");
        list = document.createElement("ol");
        container.appendChild(list);
        plays.forEach(function(play) {
            var listItem = document.createElement("li");
            if (play.date.indexOf("-") !== -1) {
                var dates = play.date.split("-");
                var time = document.createElement("time");
                time.textContent = dates[0];
                listItem.appendChild(time);
                time = document.createElement("time");
                time.textContent = dates[1];
                listItem.appendChild(time);
            } else {
                var time = document.createElement("time");
                time.textContent = play.date;
                listItem.appendChild(time);
            }
            var cite = document.createElement("cite");
            cite.textContent = play.play;
            listItem.appendChild(cite);
            var descList = document.createElement("dl");
            descTerms.forEach(function(term)  {
                if (play[term.key]) {
                    var descTerm = document.createElement("dt");
                    descTerm.textContent = term.label;
                    descList.appendChild(descTerm);
                    var descElem = document.createElement("dd");
                    descElem.textContent = play[term.key];
                    descList.appendChild(descElem);
                }
            });
            listItem.appendChild(descList);
            list.appendChild(listItem);
        })
        var clicked = function(ev) {
            if (ev.target.nodeName === "CITE") {
                var li = ev.target.parentNode;
                if (li.className === "expanded") {
                    li.className = "";
                } else {
                    li.className = "expanded";
                }
            }
        };
        document.getElementById("javascript-4").addEventListener("click", clicked);

    };
    
    if (typeof contentLoaded != "undefined") {
        contentLoaded.done(draw);
    } else {
        window.addEventListener('load', draw);
    }

}());
</script>
