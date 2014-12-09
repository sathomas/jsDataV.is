
## Working with Arrays

If your visualization relies on a significant amount of data, that data is most likely contained in arrays. Unfortunately, it's very tempting to resort to imperative programming when working with arrays. Arrays suggest the use of programming loops, and, as we saw above, programming loops are an imperative construct that often causes errors. If we can avoid loops and rely on functional programming instead, we can improve the quality of our JavaScript. The core JavaScript language includes a few utilities and methods to help applications cope with arrays in a functional style, but Underscore.js adds many others. This section describes many of Underscore's array utilities most helpful for data visualizations.

### Extracting Elements by Position

If you only need a subset of an array for your visualization, Underscore.js has many utilities that make it easy to extract the right subset. For the examples below, we'll consider a simple array.

``` {.javascript}
var arr = [1,2,3,4,5,6,7,8,9];
```

<figure>
<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="600" height="66"  xml:space="preserve">
<defs>
<filter id="shadow-outer" filterUnits="userSpaceOnUse">
<feGaussianBlur stdDeviation="2.5" />
<feOffset dx="0.1" dy="3.1" result="blur" />
<feFlood flood-color="rgb(0, 0, 0)" flood-opacity="0.5" />
<feComposite in2="blur" operator="in" result="colorShadow" />
<feComposite in="SourceGraphic" in2="colorShadow" operator="over" />
</filter>
</defs>
<path stroke="none" fill="rgb(255, 255, 255)" filter="url(#shadow-outer)" d="M 151,6.67 L 199,6.67 199,54.67 151,54.67 151,6.67 Z M 151,6.67" />
<path stroke="rgb(68, 68, 68)" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="4" fill="none" d="M 151,6.67 L 199,6.67 199,54.67 151,54.67 151,6.67 Z M 151,6.67" />
<rect stroke="none" fill="rgb(255, 255, 255)" filter="url(#shadow-outer)" x="199" y="6.67" width="48" height="48" />
<rect stroke="rgb(68, 68, 68)" stroke-width="1.33" fill="none" x="199" y="6.67" width="48" height="48" />
<path stroke="none" fill="rgb(255, 255, 255)" filter="url(#shadow-outer)" d="M 247,6.67 L 295,6.67 295,54.67 247,54.67 247,6.67 Z M 247,6.67" />
<path stroke="rgb(68, 68, 68)" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="4" fill="none" d="M 247,6.67 L 295,6.67 295,54.67 247,54.67 247,6.67 Z M 247,6.67" />
<rect stroke="none" fill="rgb(255, 255, 255)" filter="url(#shadow-outer)" x="295" y="6.67" width="48" height="48" />
<rect stroke="rgb(68, 68, 68)" stroke-width="1.33" fill="none" x="295" y="6.67" width="48" height="48" />
<path stroke="none" fill="rgb(255, 255, 255)" filter="url(#shadow-outer)" d="M 343,6.67 L 391,6.67 391,54.67 343,54.67 343,6.67 Z M 343,6.67" />
<path stroke="rgb(68, 68, 68)" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="4" fill="none" d="M 343,6.67 L 391,6.67 391,54.67 343,54.67 343,6.67 Z M 343,6.67" />
<rect stroke="none" fill="rgb(255, 255, 255)" filter="url(#shadow-outer)" x="391" y="6.67" width="48" height="48" />
<rect stroke="rgb(68, 68, 68)" stroke-width="1.33" fill="none" x="391" y="6.67" width="48" height="48" />
<path stroke="none" fill="rgb(255, 255, 255)" filter="url(#shadow-outer)" d="M 439,6.67 L 487,6.67 487,54.67 439,54.67 439,6.67 Z M 439,6.67" />
<path stroke="rgb(68, 68, 68)" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="4" fill="none" d="M 439,6.67 L 487,6.67 487,54.67 439,54.67 439,6.67 Z M 439,6.67" />
<rect stroke="none" fill="rgb(255, 255, 255)" filter="url(#shadow-outer)" x="487" y="6.67" width="48" height="48" />
<rect stroke="rgb(68, 68, 68)" stroke-width="1.33" fill="none" x="487" y="6.67" width="48" height="48" />
<path stroke="none" fill="rgb(255, 255, 255)" filter="url(#shadow-outer)" d="M 535,6.67 L 583,6.67 583,54.67 535,54.67 535,6.67 Z M 535,6.67" />
<path stroke="rgb(68, 68, 68)" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="4" fill="none" d="M 535,6.67 L 583,6.67 583,54.67 535,54.67 535,6.67 Z M 535,6.67" />
<text fill="rgb(68, 68, 68)" font-size="16" x="169.48" y="20">
<tspan x="169.48" y="36">1</tspan>
</text>
<text fill="rgb(68, 68, 68)" font-size="16" x="217.48" y="20">
<tspan x="217.48" y="36">2</tspan>
</text>
<text fill="rgb(68, 68, 68)" font-size="16" x="265.48" y="20">
<tspan x="265.48" y="36">3</tspan>
</text>
<text fill="rgb(68, 68, 68)" font-size="16" x="313.48" y="20">
<tspan x="313.48" y="36">4</tspan>
</text>
<text fill="rgb(68, 68, 68)" font-size="16" x="361.48" y="20">
<tspan x="361.48" y="36">5</tspan>
</text>
<text fill="rgb(68, 68, 68)" font-size="16" x="409.48" y="20">
<tspan x="409.48" y="36">6</tspan>
</text>
<text fill="rgb(68, 68, 68)" font-size="16" x="456.98" y="20">
<tspan x="456.98" y="36">7</tspan>
</text>
<text fill="rgb(68, 68, 68)" font-size="16" x="505.48" y="20">
<tspan x="505.48" y="36">8</tspan>
</text>
<text fill="rgb(68, 68, 68)" font-size="16" x="553.48" y="20">
<tspan x="553.48" y="36">9</tspan>
</text>
<text fill="rgb(68, 68, 68)" font-size="14.67" x="96.51" y="21">
<tspan x="96.51" y="36">arr</tspan>
</text>
</svg>
<figcaption>Underscore has many utilities to make it easy to work with arrays.</figcaption>
</figure>

Underscore's  `first()` method provides a simple way to extract the first element of an array, or the first _n_ elements.

``` {.javascript}
> _(arr).first()
  1
> _(arr).first(3)
  [1, 2, 3]
```

<figure style="margin-left:0;margin-right:0;">
<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="600" height="66"  xml:space="preserve">
<defs>
<filter id="shadow-outer" filterUnits="userSpaceOnUse">
<feGaussianBlur stdDeviation="2.5" />
<feOffset dx="0.1" dy="3.1" result="blur" />
<feFlood flood-color="rgb(0, 0, 0)" flood-opacity="0.5" />
<feComposite in2="blur" operator="in" result="colorShadow" />
<feComposite in="SourceGraphic" in2="colorShadow" operator="over" />
</filter>
</defs>
<rect stroke="none" fill="rgb(193, 193, 193)" filter="url(#shadow-outer)" x="150" y="6.67" width="48" height="48" />
<rect stroke="rgb(68, 68, 68)" stroke-width="1.33" fill="none" x="150" y="6.67" width="48" height="48" />
<rect stroke="none" fill="rgb(255, 255, 255)" filter="url(#shadow-outer)" x="198" y="6.67" width="48" height="48" />
<rect stroke="rgb(68, 68, 68)" stroke-width="1.33" fill="none" x="198" y="6.67" width="48" height="48" />
<rect stroke="none" fill="rgb(255, 255, 255)" filter="url(#shadow-outer)" x="246" y="6.67" width="48" height="48" />
<rect stroke="rgb(68, 68, 68)" stroke-width="1.33" fill="none" x="246" y="6.67" width="48" height="48" />
<rect stroke="none" fill="rgb(255, 255, 255)" filter="url(#shadow-outer)" x="294" y="6.67" width="48" height="48" />
<rect stroke="rgb(68, 68, 68)" stroke-width="1.33" fill="none" x="294" y="6.67" width="48" height="48" />
<rect stroke="none" fill="rgb(255, 255, 255)" filter="url(#shadow-outer)" x="342" y="6.67" width="48" height="48" />
<rect stroke="rgb(68, 68, 68)" stroke-width="1.33" fill="none" x="342" y="6.67" width="48" height="48" />
<rect stroke="none" fill="rgb(255, 255, 255)" filter="url(#shadow-outer)" x="390" y="6.67" width="48" height="48" />
<rect stroke="rgb(68, 68, 68)" stroke-width="1.33" fill="none" x="390" y="6.67" width="48" height="48" />
<rect stroke="none" fill="rgb(255, 255, 255)" filter="url(#shadow-outer)" x="438" y="6.67" width="48" height="48" />
<rect stroke="rgb(68, 68, 68)" stroke-width="1.33" fill="none" x="438" y="6.67" width="48" height="48" />
<rect stroke="none" fill="rgb(255, 255, 255)" filter="url(#shadow-outer)" x="486" y="6.67" width="48" height="48" />
<rect stroke="rgb(68, 68, 68)" stroke-width="1.33" fill="none" x="486" y="6.67" width="48" height="48" />
<rect stroke="none" fill="rgb(255, 255, 255)" filter="url(#shadow-outer)" x="534" y="6.67" width="48" height="48" />
<rect stroke="rgb(68, 68, 68)" stroke-width="1.33" fill="none" x="534" y="6.67" width="48" height="48" />
<text fill="rgb(68, 68, 68)" font-size="16" x="168.48" y="20">
<tspan x="168.48" y="36">1</tspan>
</text>
<text fill="rgb(68, 68, 68)" font-size="16" x="216.48" y="20">
<tspan x="216.48" y="36">2</tspan>
</text>
<text fill="rgb(68, 68, 68)" font-size="16" x="264.48" y="20">
<tspan x="264.48" y="36">3</tspan>
</text>
<text fill="rgb(68, 68, 68)" font-size="16" x="312.48" y="20">
<tspan x="312.48" y="36">4</tspan>
</text>
<text fill="rgb(68, 68, 68)" font-size="16" x="360.48" y="20">
<tspan x="360.48" y="36">5</tspan>
</text>
<text fill="rgb(68, 68, 68)" font-size="16" x="408.48" y="20">
<tspan x="408.48" y="36">6</tspan>
</text>
<text fill="rgb(68, 68, 68)" font-size="16" x="456.48" y="20">
<tspan x="456.48" y="36">7</tspan>
</text>
<text fill="rgb(68, 68, 68)" font-size="16" x="503.98" y="20">
<tspan x="503.98" y="36">8</tspan>
</text>
<text fill="rgb(68, 68, 68)" font-size="16" x="552.48" y="20">
<tspan x="552.48" y="36">9</tspan>
</text>
<text fill="rgb(68, 68, 68)" font-size="14.67" x="36.68" y="21">
<tspan x="36.68" y="36">_(arr).first()</tspan>
</text>
</svg>
<figcaption>The first() function returns the first element in an array.</figcaption>
</figure>

<figure style="margin-left:0;margin-right:0;">
<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="600" height="66"  xml:space="preserve">
<defs>
<filter id="shadow-outer" filterUnits="userSpaceOnUse">
<feGaussianBlur stdDeviation="2.5" />
<feOffset dx="0.1" dy="3.1" result="blur" />
<feFlood flood-color="rgb(0, 0, 0)" flood-opacity="0.5" />
<feComposite in2="blur" operator="in" result="colorShadow" />
<feComposite in="SourceGraphic" in2="colorShadow" operator="over" />
</filter>
</defs>
<rect stroke="none" fill="rgb(193, 193, 193)" filter="url(#shadow-outer)" x="151" y="6.67" width="48" height="48" />
<rect stroke="rgb(68, 68, 68)" stroke-width="1.33" fill="none" x="151" y="6.67" width="48" height="48" />
<rect stroke="none" fill="rgb(193, 193, 193)" filter="url(#shadow-outer)" x="199" y="6.67" width="48" height="48" />
<rect stroke="rgb(68, 68, 68)" stroke-width="1.33" fill="none" x="199" y="6.67" width="48" height="48" />
<rect stroke="none" fill="rgb(193, 193, 193)" filter="url(#shadow-outer)" x="247" y="6.67" width="48" height="48" />
<rect stroke="rgb(68, 68, 68)" stroke-width="1.33" fill="none" x="247" y="6.67" width="48" height="48" />
<rect stroke="none" fill="rgb(255, 255, 255)" filter="url(#shadow-outer)" x="295" y="6.67" width="48" height="48" />
<rect stroke="rgb(68, 68, 68)" stroke-width="1.33" fill="none" x="295" y="6.67" width="48" height="48" />
<rect stroke="none" fill="rgb(255, 255, 255)" filter="url(#shadow-outer)" x="343" y="6.67" width="48" height="48" />
<rect stroke="rgb(68, 68, 68)" stroke-width="1.33" fill="none" x="343" y="6.67" width="48" height="48" />
<rect stroke="none" fill="rgb(255, 255, 255)" filter="url(#shadow-outer)" x="391" y="6.67" width="48" height="48" />
<rect stroke="rgb(68, 68, 68)" stroke-width="1.33" fill="none" x="391" y="6.67" width="48" height="48" />
<rect stroke="none" fill="rgb(255, 255, 255)" filter="url(#shadow-outer)" x="439" y="6.67" width="48" height="48" />
<rect stroke="rgb(68, 68, 68)" stroke-width="1.33" fill="none" x="439" y="6.67" width="48" height="48" />
<rect stroke="none" fill="rgb(255, 255, 255)" filter="url(#shadow-outer)" x="487" y="6.67" width="48" height="48" />
<rect stroke="rgb(68, 68, 68)" stroke-width="1.33" fill="none" x="487" y="6.67" width="48" height="48" />
<rect stroke="none" fill="rgb(255, 255, 255)" filter="url(#shadow-outer)" x="535" y="6.67" width="48" height="48" />
<rect stroke="rgb(68, 68, 68)" stroke-width="1.33" fill="none" x="535" y="6.67" width="48" height="48" />
<text fill="rgb(68, 68, 68)" font-size="16" x="169.48" y="20">
<tspan x="169.48" y="36">1</tspan>
</text>
<text fill="rgb(68, 68, 68)" font-size="16" x="217.48" y="20">
<tspan x="217.48" y="36">2</tspan>
</text>
<text fill="rgb(68, 68, 68)" font-size="16" x="265.48" y="20">
<tspan x="265.48" y="36">3</tspan>
</text>
<text fill="rgb(68, 68, 68)" font-size="16" x="313.48" y="20">
<tspan x="313.48" y="36">4</tspan>
</text>
<text fill="rgb(68, 68, 68)" font-size="16" x="361.48" y="20">
<tspan x="361.48" y="36">5</tspan>
</text>
<text fill="rgb(68, 68, 68)" font-size="16" x="409.48" y="20">
<tspan x="409.48" y="36">6</tspan>
</text>
<text fill="rgb(68, 68, 68)" font-size="16" x="456.98" y="20">
<tspan x="456.98" y="36">7</tspan>
</text>
<text fill="rgb(68, 68, 68)" font-size="16" x="504.98" y="20">
<tspan x="504.98" y="36">8</tspan>
</text>
<text fill="rgb(68, 68, 68)" font-size="16" x="553.48" y="20">
<tspan x="553.48" y="36">9</tspan>
</text>
<text fill="rgb(68, 68, 68)" font-size="14.67" x="28.47" y="21">
<tspan x="28.47" y="36">_(arr).first(3)</tspan>
</text>
</svg>
<figcaption>The first() function can also return the first <b>n</b> elements in an array.</figcaption>
</figure>

Notice that `first()` (without any parameter) returns a simple element, while `first(n)` returns an array of elements. That means, for example, that `first()` and `first(1)` have different return values (`1` vs. `[1]` in the example).

As you might expect, Underscore.js also has a `last()` method to extract elements from the end of an array.

``` {.javascript}
> _(arr).last()
  9
> _(arr).last(3)
  [7, 8, 9]
```

<figure style="margin-left:0;margin-right:0;">
<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="600" height="66"  xml:space="preserve">
<defs>
<filter id="shadow-outer" filterUnits="userSpaceOnUse">
<feGaussianBlur stdDeviation="2.5" />
<feOffset dx="0.1" dy="3.1" result="blur" />
<feFlood flood-color="rgb(0, 0, 0)" flood-opacity="0.5" />
<feComposite in2="blur" operator="in" result="colorShadow" />
<feComposite in="SourceGraphic" in2="colorShadow" operator="over" />
</filter>
</defs>
<rect stroke="none" fill="rgb(255, 255, 255)" filter="url(#shadow-outer)" x="150" y="6.67" width="48" height="48" />
<rect stroke="rgb(68, 68, 68)" stroke-width="1.33" fill="none" x="150" y="6.67" width="48" height="48" />
<rect stroke="none" fill="rgb(255, 255, 255)" filter="url(#shadow-outer)" x="198" y="6.67" width="48" height="48" />
<rect stroke="rgb(68, 68, 68)" stroke-width="1.33" fill="none" x="198" y="6.67" width="48" height="48" />
<rect stroke="none" fill="rgb(255, 255, 255)" filter="url(#shadow-outer)" x="246" y="6.67" width="48" height="48" />
<rect stroke="rgb(68, 68, 68)" stroke-width="1.33" fill="none" x="246" y="6.67" width="48" height="48" />
<rect stroke="none" fill="rgb(255, 255, 255)" filter="url(#shadow-outer)" x="294" y="6.67" width="48" height="48" />
<rect stroke="rgb(68, 68, 68)" stroke-width="1.33" fill="none" x="294" y="6.67" width="48" height="48" />
<rect stroke="none" fill="rgb(255, 255, 255)" filter="url(#shadow-outer)" x="342" y="6.67" width="48" height="48" />
<rect stroke="rgb(68, 68, 68)" stroke-width="1.33" fill="none" x="342" y="6.67" width="48" height="48" />
<rect stroke="none" fill="rgb(255, 255, 255)" filter="url(#shadow-outer)" x="390" y="6.67" width="48" height="48" />
<rect stroke="rgb(68, 68, 68)" stroke-width="1.33" fill="none" x="390" y="6.67" width="48" height="48" />
<rect stroke="none" fill="rgb(255, 255, 255)" filter="url(#shadow-outer)" x="438" y="6.67" width="48" height="48" />
<rect stroke="rgb(68, 68, 68)" stroke-width="1.33" fill="none" x="438" y="6.67" width="48" height="48" />
<rect stroke="none" fill="rgb(255, 255, 255)" filter="url(#shadow-outer)" x="486" y="6.67" width="48" height="48" />
<rect stroke="rgb(68, 68, 68)" stroke-width="1.33" fill="none" x="486" y="6.67" width="48" height="48" />
<rect stroke="none" fill="rgb(193, 193, 193)" filter="url(#shadow-outer)" x="534" y="6.67" width="48" height="48" />
<rect stroke="rgb(68, 68, 68)" stroke-width="1.33" fill="none" x="534" y="6.67" width="48" height="48" />
<text fill="rgb(68, 68, 68)" font-size="16" x="168.48" y="20">
<tspan x="168.48" y="36">1</tspan>
</text>
<text fill="rgb(68, 68, 68)" font-size="16" x="215.98" y="20">
<tspan x="215.98" y="36">2</tspan>
</text>
<text fill="rgb(68, 68, 68)" font-size="16" x="263.98" y="20">
<tspan x="263.98" y="36">3</tspan>
</text>
<text fill="rgb(68, 68, 68)" font-size="16" x="312.48" y="20">
<tspan x="312.48" y="36">4</tspan>
</text>
<text fill="rgb(68, 68, 68)" font-size="16" x="360.48" y="20">
<tspan x="360.48" y="36">5</tspan>
</text>
<text fill="rgb(68, 68, 68)" font-size="16" x="408.48" y="20">
<tspan x="408.48" y="36">6</tspan>
</text>
<text fill="rgb(68, 68, 68)" font-size="16" x="456.48" y="20">
<tspan x="456.48" y="36">7</tspan>
</text>
<text fill="rgb(68, 68, 68)" font-size="16" x="503.98" y="20">
<tspan x="503.98" y="36">8</tspan>
</text>
<text fill="rgb(68, 68, 68)" font-size="16" x="552.48" y="20">
<tspan x="552.48" y="36">9</tspan>
</text>
<text fill="rgb(68, 68, 68)" font-size="14.67" x="39.58" y="21">
<tspan x="39.58" y="36">_(arr).last()</tspan>
</text>
</svg>
<figcaption>The last() function returns the last element in an array.</figcaption>
</figure>

<figure style="margin-left:0;margin-right:0;">
<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="600" height="66"  xml:space="preserve">
<defs>
<filter id="shadow-outer" filterUnits="userSpaceOnUse">
<feGaussianBlur stdDeviation="2.5" />
<feOffset dx="0.1" dy="3.1" result="blur" />
<feFlood flood-color="rgb(0, 0, 0)" flood-opacity="0.5" />
<feComposite in2="blur" operator="in" result="colorShadow" />
<feComposite in="SourceGraphic" in2="colorShadow" operator="over" />
</filter>
</defs>
<rect stroke="none" fill="rgb(255, 255, 255)" filter="url(#shadow-outer)" x="150" y="6.67" width="48" height="48" />
<rect stroke="rgb(68, 68, 68)" stroke-width="1.33" fill="none" x="150" y="6.67" width="48" height="48" />
<rect stroke="none" fill="rgb(255, 255, 255)" filter="url(#shadow-outer)" x="198" y="6.67" width="48" height="48" />
<rect stroke="rgb(68, 68, 68)" stroke-width="1.33" fill="none" x="198" y="6.67" width="48" height="48" />
<rect stroke="none" fill="rgb(255, 255, 255)" filter="url(#shadow-outer)" x="246" y="6.67" width="48" height="48" />
<rect stroke="rgb(68, 68, 68)" stroke-width="1.33" fill="none" x="246" y="6.67" width="48" height="48" />
<rect stroke="none" fill="rgb(255, 255, 255)" filter="url(#shadow-outer)" x="294" y="6.67" width="48" height="48" />
<rect stroke="rgb(68, 68, 68)" stroke-width="1.33" fill="none" x="294" y="6.67" width="48" height="48" />
<rect stroke="none" fill="rgb(255, 255, 255)" filter="url(#shadow-outer)" x="342" y="6.67" width="48" height="48" />
<rect stroke="rgb(68, 68, 68)" stroke-width="1.33" fill="none" x="342" y="6.67" width="48" height="48" />
<rect stroke="none" fill="rgb(255, 255, 255)" filter="url(#shadow-outer)" x="390" y="6.67" width="48" height="48" />
<rect stroke="rgb(68, 68, 68)" stroke-width="1.33" fill="none" x="390" y="6.67" width="48" height="48" />
<rect stroke="none" fill="rgb(193, 193, 193)" filter="url(#shadow-outer)" x="438" y="6.67" width="48" height="48" />
<rect stroke="rgb(68, 68, 68)" stroke-width="1.33" fill="none" x="438" y="6.67" width="48" height="48" />
<rect stroke="none" fill="rgb(193, 193, 193)" filter="url(#shadow-outer)" x="486" y="6.67" width="48" height="48" />
<rect stroke="rgb(68, 68, 68)" stroke-width="1.33" fill="none" x="486" y="6.67" width="48" height="48" />
<rect stroke="none" fill="rgb(193, 193, 193)" filter="url(#shadow-outer)" x="534" y="6.67" width="48" height="48" />
<rect stroke="rgb(68, 68, 68)" stroke-width="1.33" fill="none" x="534" y="6.67" width="48" height="48" />
<text fill="rgb(68, 68, 68)" font-size="16" x="168.48" y="20">
<tspan x="168.48" y="36">1</tspan>
</text>
<text fill="rgb(68, 68, 68)" font-size="16" x="216.48" y="20">
<tspan x="216.48" y="36">2</tspan>
</text>
<text fill="rgb(68, 68, 68)" font-size="16" x="264.48" y="20">
<tspan x="264.48" y="36">3</tspan>
</text>
<text fill="rgb(68, 68, 68)" font-size="16" x="312.48" y="20">
<tspan x="312.48" y="36">4</tspan>
</text>
<text fill="rgb(68, 68, 68)" font-size="16" x="360.48" y="20">
<tspan x="360.48" y="36">5</tspan>
</text>
<text fill="rgb(68, 68, 68)" font-size="16" x="408.48" y="20">
<tspan x="408.48" y="36">6</tspan>
</text>
<text fill="rgb(68, 68, 68)" font-size="16" x="456.48" y="20">
<tspan x="456.48" y="36">7</tspan>
</text>
<text fill="rgb(68, 68, 68)" font-size="16" x="504.48" y="20">
<tspan x="504.48" y="36">8</tspan>
</text>
<text fill="rgb(68, 68, 68)" font-size="16" x="552.48" y="20">
<tspan x="552.48" y="36">9</tspan>
</text>
<text fill="rgb(68, 68, 68)" font-size="14.67" x="30.37" y="21">
<tspan x="30.37" y="36">_(arr).last(3)</tspan>
</text>
</svg>
<figcaption>The last() function can also return the last <b>n</b> elements in an array.</figcaption>
</figure>

Without any parameters, `last()` returns the last element in the array. With a parameter `n` it returns a new array with the last _n_ elements from the original.

The more general versions of both of these functions (`.first(3)` and `.last(3)`) would require some potentially tricky (and error-prone) code to implement in an imperative style. In the functional style that Underscore supports, however, our code is clean and simple.

What if you want to extract from the beginning of the array, but instead of knowing how many elements you want in the result, you only know how many elements you want to omit? In other words, you need "all but the last _n_" elements.  The `initial()` method performs this extraction. As with all of these methods, if you omit the optional parameter, Underscore.js assumes a value of 1. 

``` {.javascript}
> _(arr).initial()
  [1, 2, 3, 4, 5, 6, 7, 8]
> _(arr).initial(3)
  [1, 2, 3, 4, 5, 6]
```

<figure style="margin-left:0;margin-right:0;">
<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="600" height="66"  xml:space="preserve">
<defs>
<filter id="shadow-outer" filterUnits="userSpaceOnUse">
<feGaussianBlur stdDeviation="2.5" />
<feOffset dx="0.1" dy="3.1" result="blur" />
<feFlood flood-color="rgb(0, 0, 0)" flood-opacity="0.5" />
<feComposite in2="blur" operator="in" result="colorShadow" />
<feComposite in="SourceGraphic" in2="colorShadow" operator="over" />
</filter>
</defs>
<rect stroke="none" fill="rgb(193, 193, 193)" filter="url(#shadow-outer)" x="150" y="6.67" width="48" height="48" />
<rect stroke="rgb(68, 68, 68)" stroke-width="1.33" fill="none" x="150" y="6.67" width="48" height="48" />
<rect stroke="none" fill="rgb(193, 193, 193)" filter="url(#shadow-outer)" x="198" y="6.67" width="48" height="48" />
<rect stroke="rgb(68, 68, 68)" stroke-width="1.33" fill="none" x="198" y="6.67" width="48" height="48" />
<rect stroke="none" fill="rgb(193, 193, 193)" filter="url(#shadow-outer)" x="246" y="6.67" width="48" height="48" />
<rect stroke="rgb(68, 68, 68)" stroke-width="1.33" fill="none" x="246" y="6.67" width="48" height="48" />
<rect stroke="none" fill="rgb(193, 193, 193)" filter="url(#shadow-outer)" x="294" y="6.67" width="48" height="48" />
<rect stroke="rgb(68, 68, 68)" stroke-width="1.33" fill="none" x="294" y="6.67" width="48" height="48" />
<rect stroke="none" fill="rgb(193, 193, 193)" filter="url(#shadow-outer)" x="342" y="6.67" width="48" height="48" />
<rect stroke="rgb(68, 68, 68)" stroke-width="1.33" fill="none" x="342" y="6.67" width="48" height="48" />
<rect stroke="none" fill="rgb(193, 193, 193)" filter="url(#shadow-outer)" x="390" y="6.67" width="48" height="48" />
<rect stroke="rgb(68, 68, 68)" stroke-width="1.33" fill="none" x="390" y="6.67" width="48" height="48" />
<rect stroke="none" fill="rgb(193, 193, 193)" filter="url(#shadow-outer)" x="438" y="6.67" width="48" height="48" />
<rect stroke="rgb(68, 68, 68)" stroke-width="1.33" fill="none" x="438" y="6.67" width="48" height="48" />
<rect stroke="none" fill="rgb(193, 193, 193)" filter="url(#shadow-outer)" x="486" y="6.67" width="48" height="48" />
<rect stroke="rgb(68, 68, 68)" stroke-width="1.33" fill="none" x="486" y="6.67" width="48" height="48" />
<rect stroke="none" fill="rgb(255, 255, 255)" filter="url(#shadow-outer)" x="534" y="6.67" width="48" height="48" />
<rect stroke="rgb(68, 68, 68)" stroke-width="1.33" fill="none" x="534" y="6.67" width="48" height="48" />
<text fill="rgb(68, 68, 68)" font-size="16" x="168.48" y="20">
<tspan x="168.48" y="36">1</tspan>
</text>
<text fill="rgb(68, 68, 68)" font-size="16" x="216.48" y="20">
<tspan x="216.48" y="36">2</tspan>
</text>
<text fill="rgb(68, 68, 68)" font-size="16" x="264.48" y="20">
<tspan x="264.48" y="36">3</tspan>
</text>
<text fill="rgb(68, 68, 68)" font-size="16" x="312.48" y="20">
<tspan x="312.48" y="36">4</tspan>
</text>
<text fill="rgb(68, 68, 68)" font-size="16" x="360.48" y="20">
<tspan x="360.48" y="36">5</tspan>
</text>
<text fill="rgb(68, 68, 68)" font-size="16" x="408.48" y="20">
<tspan x="408.48" y="36">6</tspan>
</text>
<text fill="rgb(68, 68, 68)" font-size="16" x="456.48" y="20">
<tspan x="456.48" y="36">7</tspan>
</text>
<text fill="rgb(68, 68, 68)" font-size="16" x="503.98" y="20">
<tspan x="503.98" y="36">8</tspan>
</text>
<text fill="rgb(68, 68, 68)" font-size="16" x="552.48" y="20">
<tspan x="552.48" y="36">9</tspan>
</text>
<text fill="rgb(68, 68, 68)" font-size="14.67" x="26.33" y="21">
<tspan x="26.33" y="36">_(arr).initial()</tspan>
</text>
</svg>
<figcaption>The initial() function returns all but the last element in an array.</figcaption>
</figure>

<figure style="margin-left:0;margin-right:0;">
<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="600" height="66"  xml:space="preserve">
<defs>
<filter id="shadow-outer" filterUnits="userSpaceOnUse">
<feGaussianBlur stdDeviation="2.5" />
<feOffset dx="0.1" dy="3.1" result="blur" />
<feFlood flood-color="rgb(0, 0, 0)" flood-opacity="0.5" />
<feComposite in2="blur" operator="in" result="colorShadow" />
<feComposite in="SourceGraphic" in2="colorShadow" operator="over" />
</filter>
</defs>
<rect stroke="none" fill="rgb(193, 193, 193)" filter="url(#shadow-outer)" x="150.33" y="6.67" width="48" height="48" />
<rect stroke="rgb(68, 68, 68)" stroke-width="1.33" fill="none" x="150.33" y="6.67" width="48" height="48" />
<path stroke="none" fill="rgb(193, 193, 193)" filter="url(#shadow-outer)" d="M 198.33,6.67 L 246.33,6.67 246.33,54.67 198.33,54.67 198.33,6.67 Z M 198.33,6.67" />
<path stroke="rgb(68, 68, 68)" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="4" fill="none" d="M 198.33,6.67 L 246.33,6.67 246.33,54.67 198.33,54.67 198.33,6.67 Z M 198.33,6.67" />
<rect stroke="none" fill="rgb(193, 193, 193)" filter="url(#shadow-outer)" x="246.33" y="6.67" width="48" height="48" />
<rect stroke="rgb(68, 68, 68)" stroke-width="1.33" fill="none" x="246.33" y="6.67" width="48" height="48" />
<rect stroke="none" fill="rgb(193, 193, 193)" filter="url(#shadow-outer)" x="294.33" y="6.67" width="48" height="48" />
<rect stroke="rgb(68, 68, 68)" stroke-width="1.33" fill="none" x="294.33" y="6.67" width="48" height="48" />
<rect stroke="none" fill="rgb(193, 193, 193)" filter="url(#shadow-outer)" x="342.33" y="6.67" width="48" height="48" />
<rect stroke="rgb(68, 68, 68)" stroke-width="1.33" fill="none" x="342.33" y="6.67" width="48" height="48" />
<rect stroke="none" fill="rgb(193, 193, 193)" filter="url(#shadow-outer)" x="390.33" y="6.67" width="48" height="48" />
<rect stroke="rgb(68, 68, 68)" stroke-width="1.33" fill="none" x="390.33" y="6.67" width="48" height="48" />
<path stroke="none" fill="rgb(255, 255, 255)" filter="url(#shadow-outer)" d="M 438.33,6.67 L 486.33,6.67 486.33,54.67 438.33,54.67 438.33,6.67 Z M 438.33,6.67" />
<path stroke="rgb(68, 68, 68)" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="4" fill="none" d="M 438.33,6.67 L 486.33,6.67 486.33,54.67 438.33,54.67 438.33,6.67 Z M 438.33,6.67" />
<rect stroke="none" fill="rgb(255, 255, 255)" filter="url(#shadow-outer)" x="486.33" y="6.67" width="48" height="48" />
<rect stroke="rgb(68, 68, 68)" stroke-width="1.33" fill="none" x="486.33" y="6.67" width="48" height="48" />
<rect stroke="none" fill="rgb(255, 255, 255)" filter="url(#shadow-outer)" x="534.33" y="6.67" width="48" height="48" />
<rect stroke="rgb(68, 68, 68)" stroke-width="1.33" fill="none" x="534.33" y="6.67" width="48" height="48" />
<text fill="rgb(68, 68, 68)" font-size="16" x="168.98" y="20">
<tspan x="168.98" y="36">1</tspan>
</text>
<text fill="rgb(68, 68, 68)" font-size="16" x="216.98" y="20">
<tspan x="216.98" y="36">2</tspan>
</text>
<text fill="rgb(68, 68, 68)" font-size="16" x="264.98" y="20">
<tspan x="264.98" y="36">3</tspan>
</text>
<text fill="rgb(68, 68, 68)" font-size="16" x="312.98" y="20">
<tspan x="312.98" y="36">4</tspan>
</text>
<text fill="rgb(68, 68, 68)" font-size="16" x="360.98" y="20">
<tspan x="360.98" y="36">5</tspan>
</text>
<text fill="rgb(68, 68, 68)" font-size="16" x="408.98" y="20">
<tspan x="408.98" y="36">6</tspan>
</text>
<text fill="rgb(68, 68, 68)" font-size="16" x="456.98" y="20">
<tspan x="456.98" y="36">7</tspan>
</text>
<text fill="rgb(68, 68, 68)" font-size="16" x="504.98" y="20">
<tspan x="504.98" y="36">8</tspan>
</text>
<text fill="rgb(68, 68, 68)" font-size="16" x="552.98" y="20">
<tspan x="552.98" y="36">9</tspan>
</text>
<text fill="rgb(68, 68, 68)" font-size="14.67" x="17.11" y="21">
<tspan x="17.11" y="36">_(arr).initial(3)</tspan>
</text>
</svg>
<figcaption>The initial() function can also return all but the last <b>n</b> elements in an array.</figcaption>
</figure>

Finally, you may need the opposite of `initial()`. The `rest()` method skips past a defined number of elements in the beginning of the array and returns whatever remains.

``` {.javascript}
> _(arr).rest()
  [2, 3, 4, 5, 6, 7, 8, 9]
> _(arr).rest(3)
  [4, 5, 6, 7, 8, 9]
```

<figure style="margin-left:0;margin-right:0;">
<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="600" height="66"  xml:space="preserve">
<defs>
<filter id="shadow-outer" filterUnits="userSpaceOnUse">
<feGaussianBlur stdDeviation="2.5" />
<feOffset dx="0.1" dy="3.1" result="blur" />
<feFlood flood-color="rgb(0, 0, 0)" flood-opacity="0.5" />
<feComposite in2="blur" operator="in" result="colorShadow" />
<feComposite in="SourceGraphic" in2="colorShadow" operator="over" />
</filter>
</defs>
<rect stroke="none" fill="rgb(255, 255, 255)" filter="url(#shadow-outer)" x="150" y="6.67" width="48" height="48" />
<rect stroke="rgb(68, 68, 68)" stroke-width="1.33" fill="none" x="150" y="6.67" width="48" height="48" />
<rect stroke="none" fill="rgb(193, 193, 193)" filter="url(#shadow-outer)" x="198" y="6.67" width="48" height="48" />
<rect stroke="rgb(68, 68, 68)" stroke-width="1.33" fill="none" x="198" y="6.67" width="48" height="48" />
<rect stroke="none" fill="rgb(193, 193, 193)" filter="url(#shadow-outer)" x="246" y="6.67" width="48" height="48" />
<rect stroke="rgb(68, 68, 68)" stroke-width="1.33" fill="none" x="246" y="6.67" width="48" height="48" />
<rect stroke="none" fill="rgb(193, 193, 193)" filter="url(#shadow-outer)" x="294" y="6.67" width="48" height="48" />
<rect stroke="rgb(68, 68, 68)" stroke-width="1.33" fill="none" x="294" y="6.67" width="48" height="48" />
<rect stroke="none" fill="rgb(193, 193, 193)" filter="url(#shadow-outer)" x="342" y="6.67" width="48" height="48" />
<rect stroke="rgb(68, 68, 68)" stroke-width="1.33" fill="none" x="342" y="6.67" width="48" height="48" />
<rect stroke="none" fill="rgb(193, 193, 193)" filter="url(#shadow-outer)" x="390" y="6.67" width="48" height="48" />
<rect stroke="rgb(68, 68, 68)" stroke-width="1.33" fill="none" x="390" y="6.67" width="48" height="48" />
<rect stroke="none" fill="rgb(193, 193, 193)" filter="url(#shadow-outer)" x="438" y="6.67" width="48" height="48" />
<rect stroke="rgb(68, 68, 68)" stroke-width="1.33" fill="none" x="438" y="6.67" width="48" height="48" />
<rect stroke="none" fill="rgb(193, 193, 193)" filter="url(#shadow-outer)" x="486" y="6.67" width="48" height="48" />
<rect stroke="rgb(68, 68, 68)" stroke-width="1.33" fill="none" x="486" y="6.67" width="48" height="48" />
<rect stroke="none" fill="rgb(193, 193, 193)" filter="url(#shadow-outer)" x="534" y="6.67" width="48" height="48" />
<rect stroke="rgb(68, 68, 68)" stroke-width="1.33" fill="none" x="534" y="6.67" width="48" height="48" />
<text fill="rgb(68, 68, 68)" font-size="16" x="168.48" y="20">
<tspan x="168.48" y="36">1</tspan>
</text>
<text fill="rgb(68, 68, 68)" font-size="16" x="215.98" y="20">
<tspan x="215.98" y="36">2</tspan>
</text>
<text fill="rgb(68, 68, 68)" font-size="16" x="263.98" y="20">
<tspan x="263.98" y="36">3</tspan>
</text>
<text fill="rgb(68, 68, 68)" font-size="16" x="312.48" y="20">
<tspan x="312.48" y="36">4</tspan>
</text>
<text fill="rgb(68, 68, 68)" font-size="16" x="360.48" y="20">
<tspan x="360.48" y="36">5</tspan>
</text>
<text fill="rgb(68, 68, 68)" font-size="16" x="408.48" y="20">
<tspan x="408.48" y="36">6</tspan>
</text>
<text fill="rgb(68, 68, 68)" font-size="16" x="456.48" y="20">
<tspan x="456.48" y="36">7</tspan>
</text>
<text fill="rgb(68, 68, 68)" font-size="16" x="504.48" y="20">
<tspan x="504.48" y="36">8</tspan>
</text>
<text fill="rgb(68, 68, 68)" font-size="16" x="552.48" y="20">
<tspan x="552.48" y="36">9</tspan>
</text>
<text fill="rgb(68, 68, 68)" font-size="14.67" x="37.81" y="21">
<tspan x="37.81" y="36">_(arr).rest()</tspan>
</text>
</svg>
<figcaption>The rest() function returns all but the first element in an array.</figcaption>
</figure>

<figure style="margin-left:0;margin-right:0;">
<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="600" height="66"  xml:space="preserve">
<defs>
<filter id="shadow-outer" filterUnits="userSpaceOnUse">
<feGaussianBlur stdDeviation="2.5" />
<feOffset dx="0.1" dy="3.1" result="blur" />
<feFlood flood-color="rgb(0, 0, 0)" flood-opacity="0.5" />
<feComposite in2="blur" operator="in" result="colorShadow" />
<feComposite in="SourceGraphic" in2="colorShadow" operator="over" />
</filter>
</defs>
<rect stroke="none" fill="rgb(255, 255, 255)" filter="url(#shadow-outer)" x="150" y="6.53" width="48" height="48" />
<rect stroke="rgb(68, 68, 68)" stroke-width="1.33" fill="none" x="150" y="6.53" width="48" height="48" />
<rect stroke="none" fill="rgb(255, 255, 255)" filter="url(#shadow-outer)" x="198" y="6.53" width="48" height="48" />
<rect stroke="rgb(68, 68, 68)" stroke-width="1.33" fill="none" x="198" y="6.53" width="48" height="48" />
<rect stroke="none" fill="rgb(255, 255, 255)" filter="url(#shadow-outer)" x="246" y="6.53" width="48" height="48" />
<rect stroke="rgb(68, 68, 68)" stroke-width="1.33" fill="none" x="246" y="6.53" width="48" height="48" />
<rect stroke="none" fill="rgb(193, 193, 193)" filter="url(#shadow-outer)" x="294" y="6.53" width="48" height="48" />
<rect stroke="rgb(68, 68, 68)" stroke-width="1.33" fill="none" x="294" y="6.53" width="48" height="48" />
<rect stroke="none" fill="rgb(193, 193, 193)" filter="url(#shadow-outer)" x="342" y="6.53" width="48" height="48" />
<rect stroke="rgb(68, 68, 68)" stroke-width="1.33" fill="none" x="342" y="6.53" width="48" height="48" />
<rect stroke="none" fill="rgb(193, 193, 193)" filter="url(#shadow-outer)" x="390" y="6.53" width="48" height="48" />
<rect stroke="rgb(68, 68, 68)" stroke-width="1.33" fill="none" x="390" y="6.53" width="48" height="48" />
<rect stroke="none" fill="rgb(193, 193, 193)" filter="url(#shadow-outer)" x="438" y="6.53" width="48" height="48" />
<rect stroke="rgb(68, 68, 68)" stroke-width="1.33" fill="none" x="438" y="6.53" width="48" height="48" />
<rect stroke="none" fill="rgb(193, 193, 193)" filter="url(#shadow-outer)" x="486" y="6.53" width="48" height="48" />
<rect stroke="rgb(68, 68, 68)" stroke-width="1.33" fill="none" x="486" y="6.53" width="48" height="48" />
<rect stroke="none" fill="rgb(193, 193, 193)" filter="url(#shadow-outer)" x="534" y="6.53" width="48" height="48" />
<rect stroke="rgb(68, 68, 68)" stroke-width="1.33" fill="none" x="534" y="6.53" width="48" height="48" />
<text fill="rgb(68, 68, 68)" font-size="16" x="168.48" y="20">
<tspan x="168.48" y="36">1</tspan>
</text>
<text fill="rgb(68, 68, 68)" font-size="16" x="216.48" y="20">
<tspan x="216.48" y="36">2</tspan>
</text>
<text fill="rgb(68, 68, 68)" font-size="16" x="264.48" y="20">
<tspan x="264.48" y="36">3</tspan>
</text>
<text fill="rgb(68, 68, 68)" font-size="16" x="312.48" y="20">
<tspan x="312.48" y="36">4</tspan>
</text>
<text fill="rgb(68, 68, 68)" font-size="16" x="360.48" y="20">
<tspan x="360.48" y="36">5</tspan>
</text>
<text fill="rgb(68, 68, 68)" font-size="16" x="408.48" y="20">
<tspan x="408.48" y="36">6</tspan>
</text>
<text fill="rgb(68, 68, 68)" font-size="16" x="456.48" y="20">
<tspan x="456.48" y="36">7</tspan>
</text>
<text fill="rgb(68, 68, 68)" font-size="16" x="504.48" y="20">
<tspan x="504.48" y="36">8</tspan>
</text>
<text fill="rgb(68, 68, 68)" font-size="16" x="552.48" y="20">
<tspan x="552.48" y="36">9</tspan>
</text>
<text fill="rgb(68, 68, 68)" font-size="14.67" x="28.6" y="21">
<tspan x="28.6" y="36">_(arr).rest(3)</tspan>
</text>
</svg>
<figcaption>The rest() function can also return all but the first <em>n</em> elements in an array.</figcaption>
</figure>

Again, these functions would be tricky to implement using traditional, imperative programming, but are a breeze with the help of Underscore.

### Combining Arrays

Underscore.js includes another set of utilities for combining two or more arrays. These include functions that mimic standard mathematical _set_ operations, as well as more sophisticated combinations. For the next few examples, we'll use two arrays, one containing the first few Fibonacci numbers and the other containing the first five even integers.

``` {.javascript}
var fibs = [0, 1, 1, 2, 3, 5, 8];
var even = [0, 2, 4, 6, 8];
```

<figure style="margin-left:0;margin-right:0;">
<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="600" height="124"  xml:space="preserve">
<defs>
<filter id="shadow-outer" filterUnits="userSpaceOnUse">
<feGaussianBlur stdDeviation="2.5" />
<feOffset dx="0.1" dy="3.1" result="blur" />
<feFlood flood-color="rgb(0, 0, 0)" flood-opacity="0.5" />
<feComposite in2="blur" operator="in" result="colorShadow" />
<feComposite in="SourceGraphic" in2="colorShadow" operator="over" />
</filter>
</defs>
<path stroke="none" fill="rgb(255, 255, 255)" filter="url(#shadow-outer)" d="M 150.33,6.67 L 198.33,6.67 198.33,54.67 150.33,54.67 150.33,6.67 Z M 150.33,6.67" />
<path stroke="rgb(68, 68, 68)" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="4" fill="none" d="M 150.33,6.67 L 198.33,6.67 198.33,54.67 150.33,54.67 150.33,6.67 Z M 150.33,6.67" />
<path stroke="none" fill="rgb(255, 255, 255)" filter="url(#shadow-outer)" d="M 198.33,6.67 L 246.33,6.67 246.33,54.67 198.33,54.67 198.33,6.67 Z M 198.33,6.67" />
<path stroke="rgb(68, 68, 68)" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="4" fill="none" d="M 198.33,6.67 L 246.33,6.67 246.33,54.67 198.33,54.67 198.33,6.67 Z M 198.33,6.67" />
<path stroke="none" fill="rgb(255, 255, 255)" filter="url(#shadow-outer)" d="M 246.33,6.67 L 294.33,6.67 294.33,54.67 246.33,54.67 246.33,6.67 Z M 246.33,6.67" />
<path stroke="rgb(68, 68, 68)" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="4" fill="none" d="M 246.33,6.67 L 294.33,6.67 294.33,54.67 246.33,54.67 246.33,6.67 Z M 246.33,6.67" />
<path stroke="none" fill="rgb(255, 255, 255)" filter="url(#shadow-outer)" d="M 294.33,6.67 L 342.33,6.67 342.33,54.67 294.33,54.67 294.33,6.67 Z M 294.33,6.67" />
<path stroke="rgb(68, 68, 68)" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="4" fill="none" d="M 294.33,6.67 L 342.33,6.67 342.33,54.67 294.33,54.67 294.33,6.67 Z M 294.33,6.67" />
<path stroke="none" fill="rgb(255, 255, 255)" filter="url(#shadow-outer)" d="M 342.33,6.67 L 390.33,6.67 390.33,54.67 342.33,54.67 342.33,6.67 Z M 342.33,6.67" />
<path stroke="rgb(68, 68, 68)" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="4" fill="none" d="M 342.33,6.67 L 390.33,6.67 390.33,54.67 342.33,54.67 342.33,6.67 Z M 342.33,6.67" />
<path stroke="none" fill="rgb(255, 255, 255)" filter="url(#shadow-outer)" d="M 390.33,6.67 L 438.33,6.67 438.33,54.67 390.33,54.67 390.33,6.67 Z M 390.33,6.67" />
<path stroke="rgb(68, 68, 68)" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="4" fill="none" d="M 390.33,6.67 L 438.33,6.67 438.33,54.67 390.33,54.67 390.33,6.67 Z M 390.33,6.67" />
<path stroke="none" fill="rgb(255, 255, 255)" filter="url(#shadow-outer)" d="M 438.33,6.67 L 486.33,6.67 486.33,54.67 438.33,54.67 438.33,6.67 Z M 438.33,6.67" />
<path stroke="rgb(68, 68, 68)" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="4" fill="none" d="M 438.33,6.67 L 486.33,6.67 486.33,54.67 438.33,54.67 438.33,6.67 Z M 438.33,6.67" />
<rect stroke="none" fill="rgb(255, 255, 255)" filter="url(#shadow-outer)" x="150.33" y="64.27" width="48" height="48" />
<rect stroke="rgb(68, 68, 68)" stroke-width="1.33" fill="none" x="150.33" y="64.27" width="48" height="48" />
<path stroke="none" fill="rgb(255, 255, 255)" filter="url(#shadow-outer)" d="M 198.33,64.27 L 246.33,64.27 246.33,112.27 198.33,112.27 198.33,64.27 Z M 198.33,64.27" />
<path stroke="rgb(68, 68, 68)" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="4" fill="none" d="M 198.33,64.27 L 246.33,64.27 246.33,112.27 198.33,112.27 198.33,64.27 Z M 198.33,64.27" />
<rect stroke="none" fill="rgb(255, 255, 255)" filter="url(#shadow-outer)" x="246.33" y="64.27" width="48" height="48" />
<rect stroke="rgb(68, 68, 68)" stroke-width="1.33" fill="none" x="246.33" y="64.27" width="48" height="48" />
<path stroke="none" fill="rgb(255, 255, 255)" filter="url(#shadow-outer)" d="M 294.33,64.27 L 342.33,64.27 342.33,112.27 294.33,112.27 294.33,64.27 Z M 294.33,64.27" />
<path stroke="rgb(68, 68, 68)" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="4" fill="none" d="M 294.33,64.27 L 342.33,64.27 342.33,112.27 294.33,112.27 294.33,64.27 Z M 294.33,64.27" />
<rect stroke="none" fill="rgb(255, 255, 255)" filter="url(#shadow-outer)" x="342.33" y="64.27" width="48" height="48" />
<rect stroke="rgb(68, 68, 68)" stroke-width="1.33" fill="none" x="342.33" y="64.27" width="48" height="48" />
<text fill="rgb(68, 68, 68)" font-size="16" x="168.98" y="20">
<tspan x="168.98" y="36">0</tspan>
</text>
<text fill="rgb(68, 68, 68)" font-size="16" x="216.98" y="20">
<tspan x="216.98" y="36">1</tspan>
</text>
<text fill="rgb(68, 68, 68)" font-size="16" x="264.98" y="20">
<tspan x="264.98" y="36">1</tspan>
</text>
<text fill="rgb(68, 68, 68)" font-size="16" x="312.98" y="20">
<tspan x="312.98" y="36">2</tspan>
</text>
<text fill="rgb(68, 68, 68)" font-size="16" x="360.98" y="20">
<tspan x="360.98" y="36">3</tspan>
</text>
<text fill="rgb(68, 68, 68)" font-size="16" x="408.98" y="20">
<tspan x="408.98" y="36">5</tspan>
</text>
<text fill="rgb(68, 68, 68)" font-size="16" x="456.98" y="20">
<tspan x="456.98" y="36">8</tspan>
</text>
<text fill="rgb(68, 68, 68)" font-size="14.67" x="89.3" y="21">
<tspan x="89.3" y="36">fibs</tspan>
</text>
<text fill="rgb(68, 68, 68)" font-size="16" x="168.98" y="78">
<tspan x="168.98" y="94">0</tspan>
</text>
<text fill="rgb(68, 68, 68)" font-size="16" x="216.98" y="78">
<tspan x="216.98" y="94">2</tspan>
</text>
<text fill="rgb(68, 68, 68)" font-size="16" x="264.98" y="78">
<tspan x="264.98" y="94">4</tspan>
</text>
<text fill="rgb(68, 68, 68)" font-size="16" x="312.98" y="78">
<tspan x="312.98" y="94">6</tspan>
</text>
<text fill="rgb(68, 68, 68)" font-size="16" x="360.98" y="78">
<tspan x="360.98" y="94">8</tspan>
</text>
<text fill="rgb(68, 68, 68)" font-size="14.67" x="81.75" y="78">
<tspan x="81.75" y="93">even</tspan>
</text>
</svg>
<figcaption>Underscore also has many utilities to work with multiple arrays.</figcaption>
</figure>

The `union()` method is a straightforward combination of multiple arrays. It returns an array containing all elements that are in any of the inputs, and it removes any duplicates.

``` {.javascript}
> _(fibs).union(even)
  [0, 1, 2, 3, 5, 8, 4, 6]
```

<figure style="margin-left:0;margin-right:0;">
<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="640" height="132"  xml:space="preserve">
<defs>
<filter id="shadow-outer" filterUnits="userSpaceOnUse">
<feGaussianBlur stdDeviation="2.5" />
<feOffset dx="0.1" dy="3.1" result="blur" />
<feFlood flood-color="rgb(0, 0, 0)" flood-opacity="0.5" />
<feComposite in2="blur" operator="in" result="colorShadow" />
<feComposite in="SourceGraphic" in2="colorShadow" operator="over" />
</filter>
</defs>
<rect stroke="none" fill="rgb(193, 193, 193)" filter="url(#shadow-outer)" x="24.8" y="6.13" width="48" height="48" />
<rect stroke="rgb(68, 68, 68)" stroke-width="1.33" fill="none" x="24.8" y="6.13" width="48" height="48" />
<rect stroke="none" fill="rgb(193, 193, 193)" filter="url(#shadow-outer)" x="72.8" y="6.13" width="48" height="48" />
<rect stroke="rgb(68, 68, 68)" stroke-width="1.33" fill="none" x="72.8" y="6.13" width="48" height="48" />
<rect stroke="none" fill="rgb(255, 255, 255)" filter="url(#shadow-outer)" x="120.8" y="6.13" width="48" height="48" />
<rect stroke="rgb(68, 68, 68)" stroke-width="1.33" fill="none" x="120.8" y="6.13" width="48" height="48" />
<rect stroke="none" fill="rgb(193, 193, 193)" filter="url(#shadow-outer)" x="168.8" y="6.13" width="48" height="48" />
<rect stroke="rgb(68, 68, 68)" stroke-width="1.33" fill="none" x="168.8" y="6.13" width="48" height="48" />
<rect stroke="none" fill="rgb(193, 193, 193)" filter="url(#shadow-outer)" x="216.8" y="6.13" width="48" height="48" />
<rect stroke="rgb(68, 68, 68)" stroke-width="1.33" fill="none" x="216.8" y="6.13" width="48" height="48" />
<rect stroke="none" fill="rgb(193, 193, 193)" filter="url(#shadow-outer)" x="264.8" y="6.13" width="48" height="48" />
<rect stroke="rgb(68, 68, 68)" stroke-width="1.33" fill="none" x="264.8" y="6.13" width="48" height="48" />
<rect stroke="none" fill="rgb(193, 193, 193)" filter="url(#shadow-outer)" x="312.8" y="6.13" width="48" height="48" />
<rect stroke="rgb(68, 68, 68)" stroke-width="1.33" fill="none" x="312.8" y="6.13" width="48" height="48" />
<rect stroke="none" fill="rgb(255, 255, 255)" filter="url(#shadow-outer)" x="380" y="6.13" width="48" height="48" />
<rect stroke="rgb(68, 68, 68)" stroke-width="1.33" fill="none" x="380" y="6.13" width="48" height="48" />
<rect stroke="none" fill="rgb(255, 255, 255)" filter="url(#shadow-outer)" x="428" y="6.13" width="48" height="48" />
<rect stroke="rgb(68, 68, 68)" stroke-width="1.33" fill="none" x="428" y="6.13" width="48" height="48" />
<rect stroke="none" fill="rgb(193, 193, 193)" filter="url(#shadow-outer)" x="476" y="6.13" width="48" height="48" />
<rect stroke="rgb(68, 68, 68)" stroke-width="1.33" fill="none" x="476" y="6.13" width="48" height="48" />
<rect stroke="none" fill="rgb(193, 193, 193)" filter="url(#shadow-outer)" x="524" y="6.13" width="48" height="48" />
<rect stroke="rgb(68, 68, 68)" stroke-width="1.33" fill="none" x="524" y="6.13" width="48" height="48" />
<rect stroke="none" fill="rgb(255, 255, 255)" filter="url(#shadow-outer)" x="572" y="6.13" width="48" height="48" />
<rect stroke="rgb(68, 68, 68)" stroke-width="1.33" fill="none" x="572" y="6.13" width="48" height="48" />
<rect stroke="none" fill="rgb(193, 193, 193)" filter="url(#shadow-outer)" x="476" y="73.33" width="48" height="48" />
<rect stroke="rgb(68, 68, 68)" stroke-width="1.33" fill="none" x="476" y="73.33" width="48" height="48" />
<rect stroke="none" fill="rgb(193, 193, 193)" filter="url(#shadow-outer)" x="524" y="73.33" width="48" height="48" />
<rect stroke="rgb(68, 68, 68)" stroke-width="1.33" fill="none" x="524" y="73.33" width="48" height="48" />
<rect stroke="none" fill="rgb(193, 193, 193)" filter="url(#shadow-outer)" x="188" y="73.33" width="48" height="48" />
<rect stroke="rgb(68, 68, 68)" stroke-width="1.33" fill="none" x="188" y="73.33" width="48" height="48" />
<path stroke="none" fill="rgb(193, 193, 193)" filter="url(#shadow-outer)" d="M 236,73.33 L 284,73.33 284,121.33 236,121.33 236,73.33 Z M 236,73.33" />
<path stroke="rgb(68, 68, 68)" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="4" fill="none" d="M 236,73.33 L 284,73.33 284,121.33 236,121.33 236,73.33 Z M 236,73.33" />
<rect stroke="none" fill="rgb(193, 193, 193)" filter="url(#shadow-outer)" x="284" y="73.33" width="48" height="48" />
<rect stroke="rgb(68, 68, 68)" stroke-width="1.33" fill="none" x="284" y="73.33" width="48" height="48" />
<rect stroke="none" fill="rgb(193, 193, 193)" filter="url(#shadow-outer)" x="332" y="73.33" width="48" height="48" />
<rect stroke="rgb(68, 68, 68)" stroke-width="1.33" fill="none" x="332" y="73.33" width="48" height="48" />
<rect stroke="none" fill="rgb(193, 193, 193)" filter="url(#shadow-outer)" x="380" y="73.33" width="48" height="48" />
<rect stroke="rgb(68, 68, 68)" stroke-width="1.33" fill="none" x="380" y="73.33" width="48" height="48" />
<rect stroke="none" fill="rgb(193, 193, 193)" filter="url(#shadow-outer)" x="428" y="73.33" width="48" height="48" />
<rect stroke="rgb(68, 68, 68)" stroke-width="1.33" fill="none" x="428" y="73.33" width="48" height="48" />
<text fill="rgb(68, 68, 68)" font-size="16" x="42.98" y="20">
<tspan x="42.98" y="36">0</tspan>
</text>
<text fill="rgb(68, 68, 68)" font-size="16" x="90.98" y="20">
<tspan x="90.98" y="36">1</tspan>
</text>
<text fill="rgb(68, 68, 68)" font-size="16" x="138.98" y="20">
<tspan x="138.98" y="36">1</tspan>
</text>
<text fill="rgb(68, 68, 68)" font-size="16" x="186.98" y="20">
<tspan x="186.98" y="36">2</tspan>
</text>
<text fill="rgb(68, 68, 68)" font-size="16" x="234.48" y="20">
<tspan x="234.48" y="36">3</tspan>
</text>
<text fill="rgb(68, 68, 68)" font-size="16" x="282.48" y="20">
<tspan x="282.48" y="36">5</tspan>
</text>
<text fill="rgb(68, 68, 68)" font-size="16" x="330.98" y="20">
<tspan x="330.98" y="36">8</tspan>
</text>
<text fill="rgb(68, 68, 68)" font-size="16" x="397.98" y="20">
<tspan x="397.98" y="36">0</tspan>
</text>
<text fill="rgb(68, 68, 68)" font-size="16" x="446.48" y="20">
<tspan x="446.48" y="36">2</tspan>
</text>
<text fill="rgb(68, 68, 68)" font-size="16" x="493.98" y="20">
<tspan x="493.98" y="36">4</tspan>
</text>
<text fill="rgb(68, 68, 68)" font-size="16" x="541.98" y="20">
<tspan x="541.98" y="36">6</tspan>
</text>
<text fill="rgb(68, 68, 68)" font-size="16" x="590.48" y="20">
<tspan x="590.48" y="36">8</tspan>
</text>
<text fill="rgb(68, 68, 68)" font-size="16" x="494.48" y="87">
<tspan x="494.48" y="103">4</tspan>
</text>
<text fill="rgb(68, 68, 68)" font-size="16" x="541.98" y="87">
<tspan x="541.98" y="103">6</tspan>
</text>
<text fill="rgb(68, 68, 68)" font-size="16" x="205.98" y="87">
<tspan x="205.98" y="103">0</tspan>
</text>
<text fill="rgb(68, 68, 68)" font-size="16" x="253.98" y="87">
<tspan x="253.98" y="103">1</tspan>
</text>
<text fill="rgb(68, 68, 68)" font-size="16" x="301.98" y="87">
<tspan x="301.98" y="103">2</tspan>
</text>
<text fill="rgb(68, 68, 68)" font-size="16" x="349.48" y="87">
<tspan x="349.48" y="103">3</tspan>
</text>
<text fill="rgb(68, 68, 68)" font-size="16" x="397.98" y="87">
<tspan x="397.98" y="103">5</tspan>
</text>
<text fill="rgb(68, 68, 68)" font-size="16" x="445.98" y="87">
<tspan x="445.98" y="103">8</tspan>
</text>
<text fill="rgb(68, 68, 68)" font-size="14.67" x="43.87" y="88">
<tspan x="43.87" y="103">_(fibs).union(even)</tspan>
</text>
</svg>
<figcaption>The union() function creates the union of multiple arrays, removing any duplicates.</figcaption>
</figure>

Notice that `union()` removes duplicates whether they appear in separate inputs (`0`, `2`, and `4`) or in the same array (`1`).

> Although this appendix considers combinations of just two arrays, most Underscore.js methods can accept an unlimited number of parameters. For example, `_.union(a,b,c,d,e)` returns the union of five different arrays. You can even find the union of an array of arrays with the JavaScript `apply` function with something like  `_.union.prototype.apply(this, arrOfArrs)`.

The `intersection()` method acts just as you would expect, returning only those elements that appear in all of the input arrays.

``` {.javascript}
> _(fibs).intersection(even)
  [0, 2, 8]
```

<figure style="margin-left:0;margin-right:0;">
<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="640" height="132"  xml:space="preserve">
<defs>
<filter id="shadow-outer" filterUnits="userSpaceOnUse">
<feGaussianBlur stdDeviation="2.5" />
<feOffset dx="0.1" dy="3.1" result="blur" />
<feFlood flood-color="rgb(0, 0, 0)" flood-opacity="0.5" />
<feComposite in2="blur" operator="in" result="colorShadow" />
<feComposite in="SourceGraphic" in2="colorShadow" operator="over" />
</filter>
</defs>
<path stroke="none" fill="rgb(193, 193, 193)" filter="url(#shadow-outer)" d="M 25.8,5.87 L 73.8,5.87 73.8,53.87 25.8,53.87 25.8,5.87 Z M 25.8,5.87" />
<path stroke="rgb(68, 68, 68)" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="4" fill="none" d="M 25.8,5.87 L 73.8,5.87 73.8,53.87 25.8,53.87 25.8,5.87 Z M 25.8,5.87" />
<path stroke="none" fill="rgb(255, 255, 255)" filter="url(#shadow-outer)" d="M 73.8,5.87 L 121.8,5.87 121.8,53.87 73.8,53.87 73.8,5.87 Z M 73.8,5.87" />
<path stroke="rgb(68, 68, 68)" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="4" fill="none" d="M 73.8,5.87 L 121.8,5.87 121.8,53.87 73.8,53.87 73.8,5.87 Z M 73.8,5.87" />
<path stroke="none" fill="rgb(255, 255, 255)" filter="url(#shadow-outer)" d="M 121.8,5.87 L 169.8,5.87 169.8,53.87 121.8,53.87 121.8,5.87 Z M 121.8,5.87" />
<path stroke="rgb(68, 68, 68)" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="4" fill="none" d="M 121.8,5.87 L 169.8,5.87 169.8,53.87 121.8,53.87 121.8,5.87 Z M 121.8,5.87" />
<path stroke="none" fill="rgb(193, 193, 193)" filter="url(#shadow-outer)" d="M 169.8,5.87 L 217.8,5.87 217.8,53.87 169.8,53.87 169.8,5.87 Z M 169.8,5.87" />
<path stroke="rgb(68, 68, 68)" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="4" fill="none" d="M 169.8,5.87 L 217.8,5.87 217.8,53.87 169.8,53.87 169.8,5.87 Z M 169.8,5.87" />
<path stroke="none" fill="rgb(255, 255, 255)" filter="url(#shadow-outer)" d="M 217.8,5.87 L 265.8,5.87 265.8,53.87 217.8,53.87 217.8,5.87 Z M 217.8,5.87" />
<path stroke="rgb(68, 68, 68)" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="4" fill="none" d="M 217.8,5.87 L 265.8,5.87 265.8,53.87 217.8,53.87 217.8,5.87 Z M 217.8,5.87" />
<path stroke="none" fill="rgb(255, 255, 255)" filter="url(#shadow-outer)" d="M 265.8,5.87 L 313.8,5.87 313.8,53.87 265.8,53.87 265.8,5.87 Z M 265.8,5.87" />
<path stroke="rgb(68, 68, 68)" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="4" fill="none" d="M 265.8,5.87 L 313.8,5.87 313.8,53.87 265.8,53.87 265.8,5.87 Z M 265.8,5.87" />
<path stroke="none" fill="rgb(193, 193, 193)" filter="url(#shadow-outer)" d="M 313.8,5.87 L 361.8,5.87 361.8,53.87 313.8,53.87 313.8,5.87 Z M 313.8,5.87" />
<path stroke="rgb(68, 68, 68)" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="4" fill="none" d="M 313.8,5.87 L 361.8,5.87 361.8,53.87 313.8,53.87 313.8,5.87 Z M 313.8,5.87" />
<path stroke="none" fill="rgb(193, 193, 193)" filter="url(#shadow-outer)" d="M 381,5.87 L 429,5.87 429,53.87 381,53.87 381,5.87 Z M 381,5.87" />
<path stroke="rgb(68, 68, 68)" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="4" fill="none" d="M 381,5.87 L 429,5.87 429,53.87 381,53.87 381,5.87 Z M 381,5.87" />
<path stroke="none" fill="rgb(193, 193, 193)" filter="url(#shadow-outer)" d="M 429,5.87 L 477,5.87 477,53.87 429,53.87 429,5.87 Z M 429,5.87" />
<path stroke="rgb(68, 68, 68)" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="4" fill="none" d="M 429,5.87 L 477,5.87 477,53.87 429,53.87 429,5.87 Z M 429,5.87" />
<path stroke="none" fill="rgb(255, 255, 255)" filter="url(#shadow-outer)" d="M 477,5.87 L 525,5.87 525,53.87 477,53.87 477,5.87 Z M 477,5.87" />
<path stroke="rgb(68, 68, 68)" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="4" fill="none" d="M 477,5.87 L 525,5.87 525,53.87 477,53.87 477,5.87 Z M 477,5.87" />
<path stroke="none" fill="rgb(255, 255, 255)" filter="url(#shadow-outer)" d="M 525,5.87 L 573,5.87 573,53.87 525,53.87 525,5.87 Z M 525,5.87" />
<path stroke="rgb(68, 68, 68)" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="4" fill="none" d="M 525,5.87 L 573,5.87 573,53.87 525,53.87 525,5.87 Z M 525,5.87" />
<path stroke="none" fill="rgb(193, 193, 193)" filter="url(#shadow-outer)" d="M 573,5.87 L 621,5.87 621,53.87 573,53.87 573,5.87 Z M 573,5.87" />
<path stroke="rgb(68, 68, 68)" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="4" fill="none" d="M 573,5.87 L 621,5.87 621,53.87 573,53.87 573,5.87 Z M 573,5.87" />
<rect stroke="none" fill="rgb(193, 193, 193)" filter="url(#shadow-outer)" x="245" y="73.07" width="48" height="48" />
<rect stroke="rgb(68, 68, 68)" stroke-width="1.33" fill="none" x="245" y="73.07" width="48" height="48" />
<rect stroke="none" fill="rgb(193, 193, 193)" filter="url(#shadow-outer)" x="293" y="73.07" width="48" height="48" />
<rect stroke="rgb(68, 68, 68)" stroke-width="1.33" fill="none" x="293" y="73.07" width="48" height="48" />
<rect stroke="none" fill="rgb(193, 193, 193)" filter="url(#shadow-outer)" x="341" y="73.07" width="48" height="48" />
<rect stroke="rgb(68, 68, 68)" stroke-width="1.33" fill="none" x="341" y="73.07" width="48" height="48" />
<text fill="rgb(68, 68, 68)" font-size="16" x="43.98" y="20">
<tspan x="43.98" y="36">0</tspan>
</text>
<text fill="rgb(68, 68, 68)" font-size="16" x="91.98" y="20">
<tspan x="91.98" y="36">1</tspan>
</text>
<text fill="rgb(68, 68, 68)" font-size="16" x="139.98" y="20">
<tspan x="139.98" y="36">1</tspan>
</text>
<text fill="rgb(68, 68, 68)" font-size="16" x="187.98" y="20">
<tspan x="187.98" y="36">2</tspan>
</text>
<text fill="rgb(68, 68, 68)" font-size="16" x="235.98" y="20">
<tspan x="235.98" y="36">3</tspan>
</text>
<text fill="rgb(68, 68, 68)" font-size="16" x="283.98" y="20">
<tspan x="283.98" y="36">5</tspan>
</text>
<text fill="rgb(68, 68, 68)" font-size="16" x="331.98" y="20">
<tspan x="331.98" y="36">8</tspan>
</text>
<text fill="rgb(68, 68, 68)" font-size="16" x="399.48" y="20">
<tspan x="399.48" y="36">0</tspan>
</text>
<text fill="rgb(68, 68, 68)" font-size="16" x="447.48" y="20">
<tspan x="447.48" y="36">2</tspan>
</text>
<text fill="rgb(68, 68, 68)" font-size="16" x="495.48" y="20">
<tspan x="495.48" y="36">4</tspan>
</text>
<text fill="rgb(68, 68, 68)" font-size="16" x="543.48" y="20">
<tspan x="543.48" y="36">6</tspan>
</text>
<text fill="rgb(68, 68, 68)" font-size="16" x="591.48" y="20">
<tspan x="591.48" y="36">8</tspan>
</text>
<text fill="rgb(68, 68, 68)" font-size="16" x="263.48" y="87">
<tspan x="263.48" y="103">0</tspan>
</text>
<text fill="rgb(68, 68, 68)" font-size="16" x="310.98" y="87">
<tspan x="310.98" y="103">2</tspan>
</text>
<text fill="rgb(68, 68, 68)" font-size="16" x="358.48" y="87">
<tspan x="358.48" y="103">8</tspan>
</text>
<text fill="rgb(68, 68, 68)" font-size="14.67" x="56.55" y="87">
<tspan x="56.55" y="102">_(fibs).intersection(even)</tspan>
</text>
</svg>
<figcaption>The intersection() function returns elements in common among multiple arrays.</figcaption>
</figure>

The `difference()` method is the opposite of `intersection()`. It returns those elements in the first input array that are **not** present in the other inputs.

``` {.javascript}
> _(fibs).difference(even)
  [1, 1, 3, 5]
```

<figure style="margin-left:0;margin-right:0;">
<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="640" height="132"  xml:space="preserve">
<defs>
<filter id="shadow-outer" filterUnits="userSpaceOnUse">
<feGaussianBlur stdDeviation="2.5" />
<feOffset dx="0.1" dy="3.1" result="blur" />
<feFlood flood-color="rgb(0, 0, 0)" flood-opacity="0.5" />
<feComposite in2="blur" operator="in" result="colorShadow" />
<feComposite in="SourceGraphic" in2="colorShadow" operator="over" />
</filter>
</defs>
<rect stroke="none" fill="rgb(255, 255, 255)" filter="url(#shadow-outer)" x="24.8" y="5.6" width="48" height="48" />
<rect stroke="rgb(68, 68, 68)" stroke-width="1.33" fill="none" x="24.8" y="5.6" width="48" height="48" />
<rect stroke="none" fill="rgb(193, 193, 193)" filter="url(#shadow-outer)" x="72.8" y="5.6" width="48" height="48" />
<rect stroke="rgb(68, 68, 68)" stroke-width="1.33" fill="none" x="72.8" y="5.6" width="48" height="48" />
<rect stroke="none" fill="rgb(193, 193, 193)" filter="url(#shadow-outer)" x="120.8" y="5.6" width="48" height="48" />
<rect stroke="rgb(68, 68, 68)" stroke-width="1.33" fill="none" x="120.8" y="5.6" width="48" height="48" />
<rect stroke="none" fill="rgb(255, 255, 255)" filter="url(#shadow-outer)" x="168.8" y="5.6" width="48" height="48" />
<rect stroke="rgb(68, 68, 68)" stroke-width="1.33" fill="none" x="168.8" y="5.6" width="48" height="48" />
<rect stroke="none" fill="rgb(193, 193, 193)" filter="url(#shadow-outer)" x="216.8" y="5.6" width="48" height="48" />
<rect stroke="rgb(68, 68, 68)" stroke-width="1.33" fill="none" x="216.8" y="5.6" width="48" height="48" />
<rect stroke="none" fill="rgb(193, 193, 193)" filter="url(#shadow-outer)" x="264.8" y="5.6" width="48" height="48" />
<rect stroke="rgb(68, 68, 68)" stroke-width="1.33" fill="none" x="264.8" y="5.6" width="48" height="48" />
<rect stroke="none" fill="rgb(255, 255, 255)" filter="url(#shadow-outer)" x="312.8" y="5.6" width="48" height="48" />
<rect stroke="rgb(68, 68, 68)" stroke-width="1.33" fill="none" x="312.8" y="5.6" width="48" height="48" />
<path stroke="none" fill="rgb(193, 193, 193)" filter="url(#shadow-outer)" d="M 218,72.8 L 266,72.8 266,120.8 218,120.8 218,72.8 Z M 218,72.8" />
<path stroke="rgb(68, 68, 68)" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="4" fill="none" d="M 218,72.8 L 266,72.8 266,120.8 218,120.8 218,72.8 Z M 218,72.8" />
<path stroke="none" fill="rgb(193, 193, 193)" filter="url(#shadow-outer)" d="M 266,72.8 L 314,72.8 314,120.8 266,120.8 266,72.8 Z M 266,72.8" />
<path stroke="rgb(68, 68, 68)" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="4" fill="none" d="M 266,72.8 L 314,72.8 314,120.8 266,120.8 266,72.8 Z M 266,72.8" />
<path stroke="none" fill="rgb(193, 193, 193)" filter="url(#shadow-outer)" d="M 314,72.8 L 362,72.8 362,120.8 314,120.8 314,72.8 Z M 314,72.8" />
<path stroke="rgb(68, 68, 68)" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="4" fill="none" d="M 314,72.8 L 362,72.8 362,120.8 314,120.8 314,72.8 Z M 314,72.8" />
<path stroke="none" fill="rgb(193, 193, 193)" filter="url(#shadow-outer)" d="M 362,72.8 L 410,72.8 410,120.8 362,120.8 362,72.8 Z M 362,72.8" />
<path stroke="rgb(68, 68, 68)" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="4" fill="none" d="M 362,72.8 L 410,72.8 410,120.8 362,120.8 362,72.8 Z M 362,72.8" />
<rect stroke="none" fill="rgb(255, 255, 255)" filter="url(#shadow-outer)" x="524" y="5.6" width="48" height="48" />
<rect stroke="none" fill="rgb(255, 255, 255)" filter="url(#shadow-outer)" x="380" y="5.6" width="48" height="48" />
<rect stroke="rgb(68, 68, 68)" stroke-width="1.33" fill="none" x="380" y="5.6" width="48" height="48" />
<rect stroke="none" fill="rgb(255, 255, 255)" filter="url(#shadow-outer)" x="428" y="5.6" width="48" height="48" />
<rect stroke="rgb(68, 68, 68)" stroke-width="1.33" fill="none" x="428" y="5.6" width="48" height="48" />
<rect stroke="none" fill="rgb(255, 255, 255)" filter="url(#shadow-outer)" x="572" y="5.6" width="48" height="48" />
<rect stroke="rgb(68, 68, 68)" stroke-width="1.33" fill="none" x="572" y="5.6" width="48" height="48" />
<g id="group3">
<path stroke="rgb(193, 193, 193)" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="4" fill="none" d="M 524,15.2 L 533.6,5.6" />
<path stroke="rgb(193, 193, 193)" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="4" fill="none" d="M 524,24.8 L 543.2,5.6" />
<path stroke="rgb(193, 193, 193)" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="4" fill="none" d="M 524,34.4 L 552.8,5.6" />
<path stroke="rgb(193, 193, 193)" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="4" fill="none" d="M 524,44 L 562.4,5.6" />
<path stroke="rgb(193, 193, 193)" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="4" fill="none" d="M 524,53.6 L 572,5.6" />
<path stroke="rgb(193, 193, 193)" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="4" fill="none" d="M 533.6,53.6 L 572,15.2" />
<path stroke="rgb(193, 193, 193)" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="4" fill="none" d="M 543.2,53.6 L 572,24.8" />
<path stroke="rgb(193, 193, 193)" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="4" fill="none" d="M 552.8,53.6 L 572,34.4" />
<path stroke="rgb(193, 193, 193)" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="4" fill="none" d="M 562.4,53.6 L 572,44" />
</g>
<rect stroke="rgb(68, 68, 68)" stroke-width="1.33" fill="none" x="524" y="5.6" width="48" height="48" />
<rect stroke="none" fill="rgb(255, 255, 255)" filter="url(#shadow-outer)" x="476" y="5.6" width="48" height="48" />
<g id="group">
<path stroke="rgb(193, 193, 193)" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="4" fill="none" d="M 476,15.2 L 485.6,5.6" />
<path stroke="rgb(193, 193, 193)" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="4" fill="none" d="M 476,24.8 L 495.2,5.6" />
<path stroke="rgb(193, 193, 193)" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="4" fill="none" d="M 476,34.4 L 504.8,5.6" />
<path stroke="rgb(193, 193, 193)" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="4" fill="none" d="M 476,44 L 514.4,5.6" />
<path stroke="rgb(193, 193, 193)" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="4" fill="none" d="M 476,53.6 L 524,5.6" />
<path stroke="rgb(193, 193, 193)" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="4" fill="none" d="M 485.6,53.6 L 524,15.2" />
<path stroke="rgb(193, 193, 193)" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="4" fill="none" d="M 495.2,53.6 L 524,24.8" />
<path stroke="rgb(193, 193, 193)" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="4" fill="none" d="M 504.8,53.6 L 524,34.4" />
<path stroke="rgb(193, 193, 193)" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="4" fill="none" d="M 514.4,53.6 L 524,44" />
</g>
<rect stroke="rgb(68, 68, 68)" stroke-width="1.33" fill="none" x="476" y="5.6" width="48" height="48" />
<text fill="rgb(68, 68, 68)" font-size="16" x="42.48" y="19">
<tspan x="42.48" y="35">0</tspan>
</text>
<text fill="rgb(68, 68, 68)" font-size="16" x="90.48" y="19">
<tspan x="90.48" y="35">1</tspan>
</text>
<text fill="rgb(68, 68, 68)" font-size="16" x="138.98" y="19">
<tspan x="138.98" y="35">1</tspan>
</text>
<text fill="rgb(68, 68, 68)" font-size="16" x="186.48" y="19">
<tspan x="186.48" y="35">2</tspan>
</text>
<text fill="rgb(68, 68, 68)" font-size="16" x="234.98" y="19">
<tspan x="234.98" y="35">3</tspan>
</text>
<text fill="rgb(68, 68, 68)" font-size="16" x="282.48" y="19">
<tspan x="282.48" y="35">5</tspan>
</text>
<text fill="rgb(68, 68, 68)" font-size="16" x="330.98" y="19">
<tspan x="330.98" y="35">8</tspan>
</text>
<text fill="rgb(68, 68, 68)" font-size="14.67" x="42.87" y="87">
<tspan x="42.87" y="102">_(fibs).difference(even)</tspan>
</text>
<text fill="rgb(68, 68, 68)" font-size="16" x="235.48" y="87">
<tspan x="235.48" y="103">1</tspan>
</text>
<text fill="rgb(68, 68, 68)" font-size="16" x="283.98" y="87">
<tspan x="283.98" y="103">1</tspan>
</text>
<text fill="rgb(68, 68, 68)" font-size="16" x="331.98" y="87">
<tspan x="331.98" y="103">3</tspan>
</text>
<text fill="rgb(68, 68, 68)" font-size="16" x="379.98" y="87">
<tspan x="379.98" y="103">5</tspan>
</text>
<text fill="rgb(68, 68, 68)" font-size="16" x="541.98" y="19">
<tspan x="541.98" y="35">6</tspan>
</text>
<text fill="rgb(68, 68, 68)" font-size="16" x="398.48" y="19">
<tspan x="398.48" y="35">0</tspan>
</text>
<text fill="rgb(68, 68, 68)" font-size="16" x="446.48" y="19">
<tspan x="446.48" y="35">2</tspan>
</text>
<text fill="rgb(68, 68, 68)" font-size="16" x="590.48" y="19">
<tspan x="590.48" y="35">8</tspan>
</text>
<text fill="rgb(68, 68, 68)" font-size="16" x="494.48" y="19">
<tspan x="494.48" y="35">4</tspan>
</text>
</svg>
<figcaption>The difference() function returns elements that are <b>only</b> present in the first of multiple arrays.</figcaption>
</figure>

If you need to eliminate duplicate elements but only have one array (making `union()` inappropriate), then you can use the `uniq()` method.

``` {.javascript}
> _(fibs).uniq()
  [0, 1, 2, 3, 5, 8]
```

<figure style="margin-left:0;margin-right:0;">
<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="600" height="132"  xml:space="preserve">
<defs>
<filter id="shadow-outer" filterUnits="userSpaceOnUse">
<feGaussianBlur stdDeviation="2.5" />
<feOffset dx="0.1" dy="3.1" result="blur" />
<feFlood flood-color="rgb(0, 0, 0)" flood-opacity="0.5" />
<feComposite in2="blur" operator="in" result="colorShadow" />
<feComposite in="SourceGraphic" in2="colorShadow" operator="over" />
</filter>
</defs>
<path stroke="none" fill="rgb(193, 193, 193)" filter="url(#shadow-outer)" d="M 150.33,6.67 L 198.33,6.67 198.33,54.67 150.33,54.67 150.33,6.67 Z M 150.33,6.67" />
<path stroke="rgb(68, 68, 68)" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="4" fill="none" d="M 150.33,6.67 L 198.33,6.67 198.33,54.67 150.33,54.67 150.33,6.67 Z M 150.33,6.67" />
<path stroke="none" fill="rgb(193, 193, 193)" filter="url(#shadow-outer)" d="M 198.33,6.67 L 246.33,6.67 246.33,54.67 198.33,54.67 198.33,6.67 Z M 198.33,6.67" />
<path stroke="rgb(68, 68, 68)" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="4" fill="none" d="M 198.33,6.67 L 246.33,6.67 246.33,54.67 198.33,54.67 198.33,6.67 Z M 198.33,6.67" />
<path stroke="none" fill="rgb(255, 255, 255)" filter="url(#shadow-outer)" d="M 246.33,6.67 L 294.33,6.67 294.33,54.67 246.33,54.67 246.33,6.67 Z M 246.33,6.67" />
<path stroke="rgb(68, 68, 68)" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="4" fill="none" d="M 246.33,6.67 L 294.33,6.67 294.33,54.67 246.33,54.67 246.33,6.67 Z M 246.33,6.67" />
<path stroke="none" fill="rgb(193, 193, 193)" filter="url(#shadow-outer)" d="M 294.33,6.67 L 342.33,6.67 342.33,54.67 294.33,54.67 294.33,6.67 Z M 294.33,6.67" />
<path stroke="rgb(68, 68, 68)" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="4" fill="none" d="M 294.33,6.67 L 342.33,6.67 342.33,54.67 294.33,54.67 294.33,6.67 Z M 294.33,6.67" />
<path stroke="none" fill="rgb(193, 193, 193)" filter="url(#shadow-outer)" d="M 342.33,6.67 L 390.33,6.67 390.33,54.67 342.33,54.67 342.33,6.67 Z M 342.33,6.67" />
<path stroke="rgb(68, 68, 68)" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="4" fill="none" d="M 342.33,6.67 L 390.33,6.67 390.33,54.67 342.33,54.67 342.33,6.67 Z M 342.33,6.67" />
<path stroke="none" fill="rgb(193, 193, 193)" filter="url(#shadow-outer)" d="M 390.33,6.67 L 438.33,6.67 438.33,54.67 390.33,54.67 390.33,6.67 Z M 390.33,6.67" />
<path stroke="rgb(68, 68, 68)" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="4" fill="none" d="M 390.33,6.67 L 438.33,6.67 438.33,54.67 390.33,54.67 390.33,6.67 Z M 390.33,6.67" />
<path stroke="none" fill="rgb(193, 193, 193)" filter="url(#shadow-outer)" d="M 438.33,6.67 L 486.33,6.67 486.33,54.67 438.33,54.67 438.33,6.67 Z M 438.33,6.67" />
<path stroke="rgb(68, 68, 68)" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="4" fill="none" d="M 438.33,6.67 L 486.33,6.67 486.33,54.67 438.33,54.67 438.33,6.67 Z M 438.33,6.67" />
<path stroke="none" fill="rgb(193, 193, 193)" filter="url(#shadow-outer)" d="M 150.33,73.87 L 198.33,73.87 198.33,121.87 150.33,121.87 150.33,73.87 Z M 150.33,73.87" />
<path stroke="rgb(68, 68, 68)" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="4" fill="none" d="M 150.33,73.87 L 198.33,73.87 198.33,121.87 150.33,121.87 150.33,73.87 Z M 150.33,73.87" />
<path stroke="none" fill="rgb(193, 193, 193)" filter="url(#shadow-outer)" d="M 198.33,73.87 L 246.33,73.87 246.33,121.87 198.33,121.87 198.33,73.87 Z M 198.33,73.87" />
<path stroke="rgb(68, 68, 68)" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="4" fill="none" d="M 198.33,73.87 L 246.33,73.87 246.33,121.87 198.33,121.87 198.33,73.87 Z M 198.33,73.87" />
<path stroke="none" fill="rgb(193, 193, 193)" filter="url(#shadow-outer)" d="M 246.33,73.87 L 294.33,73.87 294.33,121.87 246.33,121.87 246.33,73.87 Z M 246.33,73.87" />
<path stroke="rgb(68, 68, 68)" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="4" fill="none" d="M 246.33,73.87 L 294.33,73.87 294.33,121.87 246.33,121.87 246.33,73.87 Z M 246.33,73.87" />
<path stroke="none" fill="rgb(193, 193, 193)" filter="url(#shadow-outer)" d="M 294.33,73.87 L 342.33,73.87 342.33,121.87 294.33,121.87 294.33,73.87 Z M 294.33,73.87" />
<path stroke="rgb(68, 68, 68)" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="4" fill="none" d="M 294.33,73.87 L 342.33,73.87 342.33,121.87 294.33,121.87 294.33,73.87 Z M 294.33,73.87" />
<path stroke="none" fill="rgb(193, 193, 193)" filter="url(#shadow-outer)" d="M 342.33,73.87 L 390.33,73.87 390.33,121.87 342.33,121.87 342.33,73.87 Z M 342.33,73.87" />
<path stroke="rgb(68, 68, 68)" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="4" fill="none" d="M 342.33,73.87 L 390.33,73.87 390.33,121.87 342.33,121.87 342.33,73.87 Z M 342.33,73.87" />
<path stroke="none" fill="rgb(193, 193, 193)" filter="url(#shadow-outer)" d="M 390.33,73.87 L 438.33,73.87 438.33,121.87 390.33,121.87 390.33,73.87 Z M 390.33,73.87" />
<path stroke="rgb(68, 68, 68)" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="4" fill="none" d="M 390.33,73.87 L 438.33,73.87 438.33,121.87 390.33,121.87 390.33,73.87 Z M 390.33,73.87" />
<text fill="rgb(68, 68, 68)" font-size="16" x="168.98" y="20">
<tspan x="168.98" y="36">0</tspan>
</text>
<text fill="rgb(68, 68, 68)" font-size="16" x="216.98" y="20">
<tspan x="216.98" y="36">1</tspan>
</text>
<text fill="rgb(68, 68, 68)" font-size="16" x="264.98" y="20">
<tspan x="264.98" y="36">1</tspan>
</text>
<text fill="rgb(68, 68, 68)" font-size="16" x="312.98" y="20">
<tspan x="312.98" y="36">2</tspan>
</text>
<text fill="rgb(68, 68, 68)" font-size="16" x="360.98" y="20">
<tspan x="360.98" y="36">3</tspan>
</text>
<text fill="rgb(68, 68, 68)" font-size="16" x="408.98" y="20">
<tspan x="408.98" y="36">5</tspan>
</text>
<text fill="rgb(68, 68, 68)" font-size="16" x="456.98" y="20">
<tspan x="456.98" y="36">8</tspan>
</text>
<text fill="rgb(68, 68, 68)" font-size="16" x="168.98" y="88">
<tspan x="168.98" y="104">0</tspan>
</text>
<text fill="rgb(68, 68, 68)" font-size="16" x="216.98" y="88">
<tspan x="216.98" y="104">1</tspan>
</text>
<text fill="rgb(68, 68, 68)" font-size="16" x="264.98" y="88">
<tspan x="264.98" y="104">2</tspan>
</text>
<text fill="rgb(68, 68, 68)" font-size="16" x="312.98" y="88">
<tspan x="312.98" y="104">3</tspan>
</text>
<text fill="rgb(68, 68, 68)" font-size="16" x="360.98" y="88">
<tspan x="360.98" y="104">5</tspan>
</text>
<text fill="rgb(68, 68, 68)" font-size="16" x="408.98" y="88">
<tspan x="408.98" y="104">8</tspan>
</text>
<text fill="rgb(68, 68, 68)" font-size="14.67" x="99.3" y="21">
<tspan x="99.3" y="36">fibs</tspan>
</text>
<text fill="rgb(68, 68, 68)" font-size="14.67" x="37.03" y="88">
<tspan x="37.03" y="103">_(fibs).uniq()</tspan>
</text>
</svg>
<figcaption>The uniq() function removes duplicate elements from an array.</figcaption>
</figure>

Finally, Underscore.js has a `zip()` method. It's name doesn't come from the popular compression algorithm but, rather, because it acts a bit like a zipper. It takes multiple input arrays and combines them, element by element, into an output array. That output is an array of arrays, where the inner arrays are the combined elements.

The operation is perhaps most clearly understood through a picture.

<figure style="margin-left:0;margin-right:0;">
<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="600" height="190"  xml:space="preserve">
<defs>
<filter id="shadow-outer" filterUnits="userSpaceOnUse">
<feGaussianBlur stdDeviation="2.5" />
<feOffset dx="0.1" dy="3.1" result="blur" />
<feFlood flood-color="rgb(0, 0, 0)" flood-opacity="0.5" />
<feComposite in2="blur" operator="in" result="colorShadow" />
<feComposite in="SourceGraphic" in2="colorShadow" operator="over" />
</filter>
<filter id="smallShadow-outer" filterUnits="userSpaceOnUse">
<feGaussianBlur stdDeviation="2" />
<feOffset dx="0.1" dy="2.1" result="blur" />
<feFlood flood-color="rgb(0, 0, 0)" flood-opacity="0.5" />
<feComposite in2="blur" operator="in" result="colorShadow" />
<feComposite in="SourceGraphic" in2="colorShadow" operator="over" />
</filter>
</defs>
<rect stroke="none" fill="rgb(255, 255, 255)" filter="url(#shadow-outer)" x="50.65" y="29.87" width="48" height="48" />
<rect stroke="rgb(68, 68, 68)" stroke-width="1.33" fill="none" x="50.65" y="29.87" width="48" height="48" />
<path stroke="none" fill="rgb(255, 255, 255)" filter="url(#shadow-outer)" d="M 98.65,29.87 L 146.65,29.87 146.65,77.87 98.65,77.87 98.65,29.87 Z M 98.65,29.87" />
<path stroke="rgb(68, 68, 68)" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="4" fill="none" d="M 98.65,29.87 L 146.65,29.87 146.65,77.87 98.65,77.87 98.65,29.87 Z M 98.65,29.87" />
<rect stroke="none" fill="rgb(255, 255, 255)" filter="url(#shadow-outer)" x="146.65" y="29.87" width="48" height="48" />
<rect stroke="rgb(68, 68, 68)" stroke-width="1.33" fill="none" x="146.65" y="29.87" width="48" height="48" />
<path stroke="none" fill="rgb(255, 255, 255)" filter="url(#shadow-outer)" d="M 194.65,29.87 L 242.65,29.87 242.65,77.87 194.65,77.87 194.65,29.87 Z M 194.65,29.87" />
<path stroke="rgb(68, 68, 68)" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="4" fill="none" d="M 194.65,29.87 L 242.65,29.87 242.65,77.87 194.65,77.87 194.65,29.87 Z M 194.65,29.87" />
<path stroke="none" fill="rgb(255, 255, 255)" filter="url(#shadow-outer)" d="M 242.65,29.87 L 290.65,29.87 290.65,77.87 242.65,77.87 242.65,29.87 Z M 242.65,29.87" />
<path stroke="rgb(68, 68, 68)" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="4" fill="none" d="M 242.65,29.87 L 290.65,29.87 290.65,77.87 242.65,77.87 242.65,29.87 Z M 242.65,29.87" />
<rect stroke="none" fill="rgb(255, 255, 255)" filter="url(#shadow-outer)" x="319.45" y="29.87" width="48" height="48" />
<rect stroke="rgb(68, 68, 68)" stroke-width="1.33" fill="none" x="319.45" y="29.87" width="48" height="48" />
<rect stroke="none" fill="rgb(255, 255, 255)" filter="url(#shadow-outer)" x="367.45" y="29.87" width="48" height="48" />
<rect stroke="rgb(68, 68, 68)" stroke-width="1.33" fill="none" x="367.45" y="29.87" width="48" height="48" />
<rect stroke="none" fill="rgb(255, 255, 255)" filter="url(#shadow-outer)" x="415.45" y="29.87" width="48" height="48" />
<rect stroke="rgb(68, 68, 68)" stroke-width="1.33" fill="none" x="415.45" y="29.87" width="48" height="48" />
<rect stroke="none" fill="rgb(255, 255, 255)" filter="url(#shadow-outer)" x="463.45" y="29.87" width="48" height="48" />
<rect stroke="rgb(68, 68, 68)" stroke-width="1.33" fill="none" x="463.45" y="29.87" width="48" height="48" />
<rect stroke="none" fill="rgb(255, 255, 255)" filter="url(#shadow-outer)" x="511.45" y="29.87" width="48" height="48" />
<rect stroke="rgb(68, 68, 68)" stroke-width="1.33" fill="none" x="511.45" y="29.87" width="48" height="48" />
<path stroke="none" fill="rgb(255, 255, 255)" filter="url(#shadow-outer)" d="M 223.45,125.87 L 290.65,125.87 290.65,173.87 223.45,173.87 223.45,125.87 Z M 223.45,125.87" />
<path stroke="rgb(68, 68, 68)" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="4" fill="none" d="M 223.45,125.87 L 290.65,125.87 290.65,173.87 223.45,173.87 223.45,125.87 Z M 223.45,125.87" />
<g id="group3">
<path stroke="none" fill="rgb(255, 255, 255)" filter="url(#smallShadow-outer)" d="M 233.05,137.87 L 281.05,137.87 281.05,161.87 233.05,161.87 233.05,137.87 Z M 233.05,137.87" />
</g>
<path stroke="none" fill="rgb(255, 255, 255)" d="M 233.05,137.87 L 257.05,137.87 257.05,161.87 233.05,161.87 233.05,137.87 Z M 233.05,137.87" />
<path stroke="rgb(68, 68, 68)" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="4" fill="none" d="M 233.05,137.87 L 257.05,137.87 257.05,161.87 233.05,161.87 233.05,137.87 Z M 233.05,137.87" />
<rect stroke="none" fill="rgb(255, 255, 255)" x="257.05" y="137.87" width="24" height="24" />
<rect stroke="rgb(68, 68, 68)" stroke-width="1.33" fill="none" x="257.05" y="137.87" width="24" height="24" />
<path stroke="none" fill="rgb(255, 255, 255)" filter="url(#shadow-outer)" d="M 290.65,125.87 L 357.85,125.87 357.85,173.87 290.65,173.87 290.65,125.87 Z M 290.65,125.87" />
<path stroke="rgb(68, 68, 68)" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="4" fill="none" d="M 290.65,125.87 L 357.85,125.87 357.85,173.87 290.65,173.87 290.65,125.87 Z M 290.65,125.87" />
<g id="group4">
<rect stroke="none" fill="rgb(255, 255, 255)" filter="url(#smallShadow-outer)" x="300.25" y="137.87" width="48" height="24" />
</g>
<rect stroke="none" fill="rgb(255, 255, 255)" x="300.25" y="137.87" width="24" height="24" />
<rect stroke="rgb(68, 68, 68)" stroke-width="1.33" fill="none" x="300.25" y="137.87" width="24" height="24" />
<rect stroke="none" fill="rgb(255, 255, 255)" x="324.25" y="137.87" width="24" height="24" />
<rect stroke="rgb(68, 68, 68)" stroke-width="1.33" fill="none" x="324.25" y="137.87" width="24" height="24" />
<path stroke="none" fill="rgb(255, 255, 255)" filter="url(#shadow-outer)" d="M 357.85,125.87 L 425.05,125.87 425.05,173.87 357.85,173.87 357.85,125.87 Z M 357.85,125.87" />
<path stroke="rgb(68, 68, 68)" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="4" fill="none" d="M 357.85,125.87 L 425.05,125.87 425.05,173.87 357.85,173.87 357.85,125.87 Z M 357.85,125.87" />
<g id="group5">
<rect stroke="none" fill="rgb(255, 255, 255)" filter="url(#smallShadow-outer)" x="367.45" y="137.87" width="48" height="24" />
</g>
<rect stroke="none" fill="rgb(255, 255, 255)" x="367.45" y="137.87" width="24" height="24" />
<rect stroke="rgb(68, 68, 68)" stroke-width="1.33" fill="none" x="367.45" y="137.87" width="24" height="24" />
<rect stroke="none" fill="rgb(255, 255, 255)" x="391.45" y="137.87" width="24" height="24" />
<rect stroke="rgb(68, 68, 68)" stroke-width="1.33" fill="none" x="391.45" y="137.87" width="24" height="24" />
<path stroke="none" fill="rgb(255, 255, 255)" filter="url(#shadow-outer)" d="M 425.05,125.87 L 492.25,125.87 492.25,173.87 425.05,173.87 425.05,125.87 Z M 425.05,125.87" />
<path stroke="rgb(68, 68, 68)" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="4" fill="none" d="M 425.05,125.87 L 492.25,125.87 492.25,173.87 425.05,173.87 425.05,125.87 Z M 425.05,125.87" />
<g id="group6">
<rect stroke="none" fill="rgb(255, 255, 255)" filter="url(#smallShadow-outer)" x="434.65" y="137.87" width="48" height="24" />
</g>
<rect stroke="none" fill="rgb(255, 255, 255)" x="434.65" y="137.87" width="24" height="24" />
<rect stroke="rgb(68, 68, 68)" stroke-width="1.33" fill="none" x="434.65" y="137.87" width="24" height="24" />
<rect stroke="none" fill="rgb(255, 255, 255)" x="458.65" y="137.87" width="24" height="24" />
<rect stroke="rgb(68, 68, 68)" stroke-width="1.33" fill="none" x="458.65" y="137.87" width="24" height="24" />
<path stroke="none" fill="rgb(255, 255, 255)" filter="url(#shadow-outer)" d="M 492.25,125.87 L 559.45,125.87 559.45,173.87 492.25,173.87 492.25,125.87 Z M 492.25,125.87" />
<path stroke="rgb(68, 68, 68)" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="4" fill="none" d="M 492.25,125.87 L 559.45,125.87 559.45,173.87 492.25,173.87 492.25,125.87 Z M 492.25,125.87" />
<g id="group7">
<path stroke="none" fill="rgb(255, 255, 255)" filter="url(#smallShadow-outer)" d="M 501.85,137.87 L 549.85,137.87 549.85,161.87 501.85,161.87 501.85,137.87 Z M 501.85,137.87" />
</g>
<rect stroke="none" fill="rgb(255, 255, 255)" x="501.85" y="137.87" width="24" height="24" />
<rect stroke="rgb(68, 68, 68)" stroke-width="1.33" fill="none" x="501.85" y="137.87" width="24" height="24" />
<path stroke="none" fill="rgb(255, 255, 255)" d="M 525.85,137.87 L 549.85,137.87 549.85,161.87 525.85,161.87 525.85,137.87 Z M 525.85,137.87" />
<path stroke="rgb(68, 68, 68)" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="4" fill="none" d="M 525.85,137.87 L 549.85,137.87 549.85,161.87 525.85,161.87 525.85,137.87 Z M 525.85,137.87" />
<path stroke="rgb(193, 193, 193)" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="4" fill="none" d="M 98.65,67.39 L 221.55,136.63" />
<path stroke="rgb(193, 193, 193)" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="4" fill="none" d="M 324.85,77.87 L 286.44,127.43" />
<path stroke="rgb(193, 193, 193)" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="4" fill="none" d="M 146.65,66.02 L 288.48,137.83" />
<path stroke="rgb(193, 193, 193)" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="4" fill="none" d="M 377.65,77.87 L 349.73,126.42" />
<path stroke="rgb(193, 193, 193)" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="4" fill="none" d="M 194.65,64.9 L 355.46,138.84" />
<path stroke="rgb(193, 193, 193)" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="4" fill="none" d="M 430.45,77.87 L 412.59,125.51" />
<path stroke="rgb(193, 193, 193)" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="4" fill="none" d="M 242.65,63.97 L 422.49,139.69" />
<path stroke="rgb(193, 193, 193)" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="4" fill="none" d="M 483.25,77.87 L 475.03,124.86" />
<path stroke="rgb(193, 193, 193)" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="4" fill="none" d="M 290.65,63.19 L 489.55,140.43" />
<path stroke="rgb(193, 193, 193)" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="4" fill="none" d="M 536.05,77.87 L 537.22,124.67" />
<path stroke="none" fill="rgb(193, 193, 193)" d="M 218.33,140.75 L 223.13,132.13 231.77,142.67 218.33,140.75 Z M 218.33,140.75" />
<path stroke="none" fill="rgb(193, 193, 193)" d="M 282.58,124 L 290.34,130.09 278.58,136.97 282.58,124 Z M 282.58,124" />
<path stroke="none" fill="rgb(193, 193, 193)" d="M 285.41,142.05 L 289.75,133.19 298.93,143.26 285.41,142.05 Z M 285.41,142.05" />
<path stroke="none" fill="rgb(193, 193, 193)" d="M 352.91,142.97 L 356.94,133.97 366.46,143.71 352.91,142.97 Z M 352.91,142.97" />
<path stroke="none" fill="rgb(193, 193, 193)" d="M 345.66,123.36 L 354.28,128.16 343.74,136.8 345.66,123.36 Z M 345.66,123.36" />
<path stroke="none" fill="rgb(193, 193, 193)" d="M 408.14,123.29 L 417.41,126.68 408.35,136.87 408.14,123.29 Z M 408.14,123.29" />
<path stroke="none" fill="rgb(193, 193, 193)" d="M 420.07,143.92 L 423.95,134.84 433.64,144.42 420.07,143.92 Z M 420.07,143.92" />
<path stroke="none" fill="rgb(193, 193, 193)" d="M 470.27,123.44 L 479.99,125.17 472.84,136.77 470.27,123.44 Z M 470.27,123.44" />
<path stroke="none" fill="rgb(193, 193, 193)" d="M 487.19,144.92 L 490.75,135.71 500.77,144.94 487.19,144.92 Z M 487.19,144.92" />
<path stroke="none" fill="rgb(193, 193, 193)" d="M 532.4,124.2 L 542.26,123.88 537.68,136.71 532.4,124.2 Z M 532.4,124.2" />
<text fill="rgb(68, 68, 68)" font-size="14.67" x="143" y="6">
<tspan x="143" y="21">naturals</tspan>
</text>
<rect stroke="none" fill="none" x="415.66" y="5.64" width="88" height="29.33" />
<text fill="rgb(68, 68, 68)" font-size="14.67" x="415.66" y="5.64">
<tspan x="415.66" y="20.64">primes</tspan>
</text>
<text fill="rgb(68, 68, 68)" font-size="16" x="69.48" y="44">
<tspan x="69.48" y="60">1</tspan>
</text>
<text fill="rgb(68, 68, 68)" font-size="16" x="117.48" y="44">
<tspan x="117.48" y="60">2</tspan>
</text>
<text fill="rgb(68, 68, 68)" font-size="16" x="165.48" y="44">
<tspan x="165.48" y="60">3</tspan>
</text>
<text fill="rgb(68, 68, 68)" font-size="16" x="212.98" y="44">
<tspan x="212.98" y="60">4</tspan>
</text>
<text fill="rgb(68, 68, 68)" font-size="16" x="261.48" y="44">
<tspan x="261.48" y="60">5</tspan>
</text>
<text fill="rgb(68, 68, 68)" font-size="16" x="337.98" y="44">
<tspan x="337.98" y="60">2</tspan>
</text>
<text fill="rgb(68, 68, 68)" font-size="16" x="385.98" y="44">
<tspan x="385.98" y="60">3</tspan>
</text>
<text fill="rgb(68, 68, 68)" font-size="16" x="433.98" y="44">
<tspan x="433.98" y="60">5</tspan>
</text>
<text fill="rgb(68, 68, 68)" font-size="16" x="481.98" y="44">
<tspan x="481.98" y="60">7</tspan>
</text>
<text fill="rgb(68, 68, 68)" font-size="16" x="524.95" y="44">
<tspan x="524.95" y="60">11</tspan>
</text>
<text fill="rgb(68, 68, 68)" font-size="14.67" x="60.25" y="140">
<tspan x="60.25" y="155">_.zip(naturals,primes)</tspan>
</text>
<text fill="rgb(68, 68, 68)" font-size="12" x="241.23" y="142">
<tspan x="241.23" y="154">1</tspan>
</text>
<text fill="rgb(68, 68, 68)" font-size="12" x="265.23" y="142">
<tspan x="265.23" y="154">2</tspan>
</text>
<text fill="rgb(68, 68, 68)" font-size="12" x="308.23" y="142">
<tspan x="308.23" y="154">2</tspan>
</text>
<text fill="rgb(68, 68, 68)" font-size="12" x="332.23" y="142">
<tspan x="332.23" y="154">3</tspan>
</text>
<text fill="rgb(68, 68, 68)" font-size="12" x="375.23" y="142">
<tspan x="375.23" y="154">3</tspan>
</text>
<text fill="rgb(68, 68, 68)" font-size="12" x="399.23" y="142">
<tspan x="399.23" y="154">5</tspan>
</text>
<text fill="rgb(68, 68, 68)" font-size="12" x="442.23" y="142">
<tspan x="442.23" y="154">4</tspan>
</text>
<text fill="rgb(68, 68, 68)" font-size="12" x="466.73" y="142">
<tspan x="466.73" y="154">7</tspan>
</text>
<text fill="rgb(68, 68, 68)" font-size="12" x="509.73" y="142">
<tspan x="509.73" y="154">5</tspan>
</text>
<text fill="rgb(68, 68, 68)" font-size="12" x="529.96" y="142">
<tspan x="529.96" y="154">11</tspan>
</text>
</svg>
<figcaption>The zip() function pairs elements from multiple arrays together into a single array.</figcaption>
</figure>

``` {.javascript}
> var naturals = [1, 2, 3, 4, 5];
> var primes = [2, 3, 5, 7, 11];
> _.zip(naturals, primes)
  [ [1,2], [2,3], [3,5], [4,7], [5,11] ]
```

This example demonstrates an alternative style for Underscore.js. Instead of wrapping an array within the `_` object as we've done so far, we call the `zip()` method on the `_` object itself. The alternative style seems a better fit for the underlying functionality in this case, but if you prefer `_(naturals).zip(prime)`, you'll get the exact same result. 

### Removing Invalid Data Values

One of the banes of visualization applications is invalid data values. Although we'd like to think that our data sources meticulously ensure that all the data they provide is scrupulously correct, that is, unfortunately, rarely the case. More seriously, if JavaScript encounters an invalid value, the most common result is an _unhandled exception_, which halts all further JavaScript execution on the page.

To avoid such an unpleasant error, we should validate all data sets and remove invalid values before we pass the data to graphing or charting libraries. Underscore.js has several utilities to help.

The simplest of these Underscore.js methods is `compact()`. This function removes any data values that JavaScript treats as `false` from the input arrays. Eliminated values include the boolean value `false`, the numeric value `0`, an empty string, and the special values `NaN` (not a number, for example `1/0`), `undefined`, and `null`.

``` {.javascript}
> var raw = [0, 1, false, 2, "", 3, NaN, 4, , 5, null];
> _(raw).compact()
  [1, 2, 3, 4, 5]
```

It is worth emphasizing that `compact()` removes elements with a value of `0`. If you use `compact()` to clean a data array, be sure that `0` isn't a valid data value in your data set.

Another common problem with raw data is excessively nested arrays. If you want to eliminate extra nesting levels from a data set, the `flatten()` method is available to help.

``` {.javascript}
> var raw = [1, 2, 3, [[4]], 5];
> _(raw).flatten()
  [1, 2, 3, 4, 5]
```

By default, `flatten()` removes all nesting, even multiple levels of nesting, from arrays. If you set the `shallow` parameter to `true`, however, it only removes a single level of nesting.

``` {.javascript}
> var raw = [1, 2, 3, [[4]], 5];
> _(raw).flatten(true)
  [1, 2, 3, [4], 5]
```

Finally, if you have specific values that you want to eliminate from an array, you can use the `without()` method. It's parameters provide a list of values that the function should remove from the input array.

``` {.javascript}
> var raw = [1, 2, 3, 4];
> _(raw).without(2, 3)
  [1, 4]
```

### Finding Elements in an Array

JavaScript has always defined the `indexOf` method for strings. It returns the position of a given substring within a larger string. Recent versions of JavaScript have added this method to array objects, so you can easily find the first occurrence of a given value in an array. Unfortunately, older browsers (specifically Internet Explorer version 8 and earlier) don't support this method.

Underscore.js provides it'a own `indexOf()` method to fill the gap those older browsers create. If Underscore.js finds itself running in an environment with native support for array `indexOf`, then it defers to the native method to avoid any performance penalty.

``` {.javascript}
> var primes = [2, 3, 5, 7, 11];
> _(primes).indexOf(5)
  2
```

To begin your search somewhere in the middle of the array, you can specify that starting position as the second argument to `indexOf()`.

``` {.javascript}
> var arr = [2, 3, 5, 7, 11, 7, 5, 3, 2];
> _(arr).indexOf(5, 4)
  6
```

You can also search backwards from the end of an array using the `lastIndexOf()` method.

``` {.javascript}
> var arr = [2, 3, 5, 7, 11, 7, 5, 3, 2];
> _(arr).lastIndexOf(5)
  6
```

If you don't want to start at the very end of the array, you can pass in the starting index as an optional parameter.

Underscore.js provides a few helpful optimizations for sorted arrays. Both the `uniq()` and the `indexOf()` methods accept an optional boolean parameter. If that parameter is `true`, then the functions assume that the array is sorted. The performance improvements this assumption allows can be especially significant for large data sets.

The library also includes the special `sortedIndex()` function. This function also assumes that the input array is sorted. It finds the position at which a specific value _should_ be inserted to maintain the array's sort order.

``` {.javascript}
> var arr = [2, 3, 5, 7, 11];
> _(arr).sortedIndex(6)
  3
```

If you have a custom sorting function, you can pass that to `sortedIndex()` as well.

### Generating Arrays

The final array utility function I'll mention is a convenient method to generate arrays. The `range()` method tells Underscore to create an array with the specified number of elements. You may also specify a starting value (the default is `0`) and the increment between adjacent values (the default is `1`).

``` {.javascript}
> _.range(10)
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
> _.range(20,10)
  [20, 21, 22, 23, 24, 25, 26, 27, 28, 29]
> _.range(0, 10, 100)
  [0, 100, 200, 300, 400, 500, 600, 700, 800, 900]
```

The `range()` function can be quite useful if you need to generate x-axis values to match an array of y-axis values, The `zip()` method can then combine the two.

``` {.javascript}
> var yvalues = [0.1277, 1.2803, 1.7697, 3.1882]
> _.zip(_.range(yvalues.length),yvalues)
  [ [0, 0.1277], [1, 1.2803], [2, 1.7697], [3, 3.1882] ]
```

