## Enhancing Objects

Although the previous section's examples show numeric arrays, often our visualization data consists of JavaScript objects instead of simple numbers. That's especially likely if we get the data via a <span class="smcp">REST</span> interface, as such interfaces almost always deliver data in JavaScript Object Notation (<span class="smcp">JSON</span>). If we need to enhance or transform objects without resorting to imperative constructs, Underscore.js has another set of utilities that can help. For the following examples, we can use a simple `pizza` object.

``` {.javascript}
var pizza = { 
    size: 10, 
    crust: "thin", 
    cheese: true, 
    toppings: ["pepperoni","sausage"]
};
```

<figure style="margin-left:0;margin-right:0;">
<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="600" height="210"  xml:space="preserve">
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
<path stroke="none" fill="rgb(255, 255, 255)" filter="url(#shadow-outer)" d="M 166.33,5.87 L 383.93,5.87 C 392.77,5.87 399.93,13.03 399.93,21.87 L 399.93,181.87 C 399.93,190.7 392.77,197.87 383.93,197.87 L 166.33,197.87 C 157.5,197.87 150.33,190.7 150.33,181.87 L 150.33,21.87 C 150.33,13.03 157.5,5.87 166.33,5.87 Z M 166.33,5.87" />
<path stroke="rgb(68, 68, 68)" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="4" fill="none" d="M 166.33,5.87 L 383.93,5.87 C 392.77,5.87 399.93,13.03 399.93,21.87 L 399.93,181.87 C 399.93,190.7 392.77,197.87 383.93,197.87 L 166.33,197.87 C 157.5,197.87 150.33,190.7 150.33,181.87 L 150.33,21.87 C 150.33,13.03 157.5,5.87 166.33,5.87 Z M 166.33,5.87" />
<path stroke="none" fill="rgb(255, 255, 255)" d="M 150.33,25.07 L 227.13,25.07 227.13,63.47 150.33,63.47 150.33,25.07 Z M 150.33,25.07" />
<path stroke="none" fill="rgb(255, 255, 255)" d="M 227.13,25.07 L 390.33,25.07 390.33,63.47 227.13,63.47 227.13,25.07 Z M 227.13,25.07" />
<path stroke="none" fill="rgb(255, 255, 255)" d="M 150.33,63.47 L 227.13,63.47 227.13,101.87 150.33,101.87 150.33,63.47 Z M 150.33,63.47" />
<path stroke="none" fill="rgb(255, 255, 255)" d="M 150.33,101.87 L 227.13,101.87 227.13,140.27 150.33,140.27 150.33,101.87 Z M 150.33,101.87" />
<path stroke="none" fill="rgb(255, 255, 255)" d="M 227.13,63.47 L 390.33,63.47 390.33,101.87 227.13,101.87 227.13,63.47 Z M 227.13,63.47" />
<path stroke="none" fill="rgb(255, 255, 255)" d="M 227.13,101.87 L 390.33,101.87 390.33,140.27 227.13,140.27 227.13,101.87 Z M 227.13,101.87" />
<path stroke="rgb(68, 68, 68)" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="4" fill="none" d="M 150.33,101.87 L 399.93,101.87 399.93,140.27 150.33,140.27 150.33,101.87 Z M 150.33,101.87" />
<path stroke="rgb(68, 68, 68)" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="4" fill="none" d="M 150.33,63.47 L 399.93,63.47 399.93,101.87 150.33,101.87 150.33,63.47 Z M 150.33,63.47" />
<path stroke="rgb(68, 68, 68)" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="4" fill="none" d="M 150.33,25.07 L 399.93,25.07 399.93,63.47 150.33,63.47 150.33,25.07 Z M 150.33,25.07" />
<path stroke="none" fill="rgb(255, 255, 255)" d="M 150.33,140.27 L 227.13,140.27 227.13,178.67 150.33,178.67 150.33,140.27 Z M 150.33,140.27" />
<path stroke="none" fill="rgb(255, 255, 255)" d="M 227.13,140.27 L 390.33,140.27 390.33,178.67 227.13,178.67 227.13,140.27 Z M 227.13,140.27" />
<rect stroke="none" fill="rgb(255, 255, 255)" filter="url(#smallShadow-outer)" x="236.73" y="147.47" width="144" height="24" />
<path stroke="none" fill="rgb(255, 255, 255)" d="M 236.73,147.47 L 313.53,147.47 313.53,171.47 236.73,171.47 236.73,147.47 Z M 236.73,147.47" />
<path stroke="rgb(68, 68, 68)" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="4" fill="none" d="M 236.73,147.47 L 313.53,147.47 313.53,171.47 236.73,171.47 236.73,147.47 Z M 236.73,147.47" />
<path stroke="none" fill="rgb(255, 255, 255)" d="M 313.53,147.47 L 380.73,147.47 380.73,171.47 313.53,171.47 313.53,147.47 Z M 313.53,147.47" />
<path stroke="rgb(68, 68, 68)" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="4" fill="none" d="M 313.53,147.47 L 380.73,147.47 380.73,171.47 313.53,171.47 313.53,147.47 Z M 313.53,147.47" />
<path stroke="rgb(68, 68, 68)" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="4" fill="none" d="M 150.33,140.27 L 399.93,140.27 399.93,178.67 150.33,178.67 150.33,140.27 Z M 150.33,140.27" />
<text fill="rgb(68, 68, 68)" font-size="12" x="102.59" y="94">
<tspan x="102.59" y="106">pizza:</tspan>
</text>
<text fill="rgb(68, 68, 68)" font-size="13.33" x="193.52" y="35">
<tspan x="193.52" y="49">size:</tspan>
</text>
<rect stroke="none" fill="none" x="233.8" y="34.79" width="26.67" height="26.67" />
<text fill="rgb(68, 68, 68)" font-size="13.33" x="233.8" y="34.79">
<tspan x="233.8" y="48.79">10</tspan>
</text>
<text fill="rgb(68, 68, 68)" font-size="13.33" x="185.63" y="73">
<tspan x="185.63" y="87">crust:</tspan>
</text>
<text fill="rgb(68, 68, 68)" font-size="13.33" x="173.07" y="112">
<tspan x="173.07" y="126">cheese:</tspan>
</text>
<text fill="rgb(68, 68, 68)" font-size="13.33" x="234" y="73">
<tspan x="234" y="87">“thin”</tspan>
</text>
<text fill="rgb(68, 68, 68)" font-size="13.33" x="234" y="112">
<tspan x="234" y="126">true</tspan>
</text>
<text fill="rgb(68, 68, 68)" font-size="13.33" x="161.12" y="150">
<tspan x="161.12" y="164">toppings:</tspan>
</text>
<text fill="rgb(68, 68, 68)" font-size="12" x="240.09" y="151">
<tspan x="240.09" y="163">“pepperoni”</tspan>
</text>
<text fill="rgb(68, 68, 68)" font-size="12" x="318.67" y="151">
<tspan x="318.67" y="163">“sausage”</tspan>
</text>
</svg>
<figcaption>Underscore has many utilities for working with arbitrary JavaScript objects.</figcaption>
</figure>

### Keys and Values

Underscore.js includes several methods to work with the keys and values that make up objects. For example, the `keys()` function creates an array consisting solely of an object's keys.

``` {.javascript}
> _(pizza).keys()
  ["size", "crust", "cheese", "toppings"]
```

<figure style="margin-left:0;margin-right:0;">
<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="600" height="54"  xml:space="preserve">
<defs>
<filter id="shadow-outer" filterUnits="userSpaceOnUse">
<feGaussianBlur stdDeviation="2.5" />
<feOffset dx="0.1" dy="3.1" result="blur" />
<feFlood flood-color="rgb(0, 0, 0)" flood-opacity="0.5" />
<feComposite in2="blur" operator="in" result="colorShadow" />
<feComposite in="SourceGraphic" in2="colorShadow" operator="over" />
</filter>
</defs>
<path stroke="none" fill="rgb(255, 255, 255)" filter="url(#shadow-outer)" d="M 150.33,6.67 L 198.33,6.67 198.33,45.07 150.33,45.07 150.33,6.67 Z M 150.33,6.67" />
<path stroke="rgb(68, 68, 68)" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="4" fill="none" d="M 150.33,6.67 L 198.33,6.67 198.33,45.07 150.33,45.07 150.33,6.67 Z M 150.33,6.67" />
<path stroke="none" fill="rgb(255, 255, 255)" filter="url(#shadow-outer)" d="M 198.33,6.67 L 255.93,6.67 255.93,45.07 198.33,45.07 198.33,6.67 Z M 198.33,6.67" />
<path stroke="rgb(68, 68, 68)" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="4" fill="none" d="M 198.33,6.67 L 255.93,6.67 255.93,45.07 198.33,45.07 198.33,6.67 Z M 198.33,6.67" />
<path stroke="none" fill="rgb(255, 255, 255)" filter="url(#shadow-outer)" d="M 255.93,6.67 L 323.13,6.67 323.13,45.07 255.93,45.07 255.93,6.67 Z M 255.93,6.67" />
<path stroke="rgb(68, 68, 68)" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="4" fill="none" d="M 255.93,6.67 L 323.13,6.67 323.13,45.07 255.93,45.07 255.93,6.67 Z M 255.93,6.67" />
<path stroke="none" fill="rgb(255, 255, 255)" filter="url(#shadow-outer)" d="M 323.13,6.67 L 399.93,6.67 399.93,45.07 323.13,45.07 323.13,6.67 Z M 323.13,6.67" />
<path stroke="rgb(68, 68, 68)" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="4" fill="none" d="M 323.13,6.67 L 399.93,6.67 399.93,45.07 323.13,45.07 323.13,6.67 Z M 323.13,6.67" />
<text fill="rgb(68, 68, 68)" font-size="13.33" x="156.36" y="16">
<tspan x="156.36" y="30">“size”</tspan>
</text>
<text fill="rgb(68, 68, 68)" font-size="13.33" x="205.43" y="16">
<tspan x="205.43" y="30">“crust”</tspan>
</text>
<text fill="rgb(68, 68, 68)" font-size="13.33" x="261.73" y="16">
<tspan x="261.73" y="30">“cheese”</tspan>
</text>
<text fill="rgb(68, 68, 68)" font-size="13.33" x="327.58" y="16">
<tspan x="327.58" y="30">“toppings”</tspan>
</text>
<text fill="rgb(68, 68, 68)" font-size="12" x="54.82" y="18">
<tspan x="54.82" y="30">_(pizza).keys()</tspan>
</text>
</svg>
<figcaption>The keys() function returns the keys of an object as an array.</figcaption>
</figure>

Similarly, the `values()` function creates an array consisting solely of an object's values.

``` {.javascript}
> _(pizza).values()
  [10, "thin", true, ["pepperoni","sausage"]]
```

<figure style="margin-left:0;margin-right:0;">
<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="600" height="54"  xml:space="preserve">
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
<path stroke="none" fill="rgb(255, 255, 255)" filter="url(#shadow-outer)" d="M 150.07,5.87 L 188.47,5.87 188.47,44.27 150.07,44.27 150.07,5.87 Z M 150.07,5.87" />
<path stroke="rgb(68, 68, 68)" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="4" fill="none" d="M 150.07,5.87 L 188.47,5.87 188.47,44.27 150.07,44.27 150.07,5.87 Z M 150.07,5.87" />
<path stroke="none" fill="rgb(255, 255, 255)" filter="url(#shadow-outer)" d="M 188.47,5.87 L 236.47,5.87 236.47,44.27 188.47,44.27 188.47,5.87 Z M 188.47,5.87" />
<path stroke="rgb(68, 68, 68)" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="4" fill="none" d="M 188.47,5.87 L 236.47,5.87 236.47,44.27 188.47,44.27 188.47,5.87 Z M 188.47,5.87" />
<path stroke="none" fill="rgb(255, 255, 255)" filter="url(#shadow-outer)" d="M 236.47,5.87 L 274.87,5.87 274.87,44.27 236.47,44.27 236.47,5.87 Z M 236.47,5.87" />
<path stroke="rgb(68, 68, 68)" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="4" fill="none" d="M 236.47,5.87 L 274.87,5.87 274.87,44.27 236.47,44.27 236.47,5.87 Z M 236.47,5.87" />
<path stroke="none" fill="rgb(255, 255, 255)" filter="url(#shadow-outer)" d="M 274.87,5.87 L 438.07,5.87 438.07,44.27 274.87,44.27 274.87,5.87 Z M 274.87,5.87" />
<path stroke="rgb(68, 68, 68)" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="4" fill="none" d="M 274.87,5.87 L 438.07,5.87 438.07,44.27 274.87,44.27 274.87,5.87 Z M 274.87,5.87" />
<path stroke="none" fill="rgb(255, 255, 255)" filter="url(#smallShadow-outer)" d="M 284.47,13.07 L 428.47,13.07 428.47,37.07 284.47,37.07 284.47,13.07 Z M 284.47,13.07" />
<path stroke="none" fill="rgb(255, 255, 255)" d="M 284.47,13.07 L 361.27,13.07 361.27,37.07 284.47,37.07 284.47,13.07 Z M 284.47,13.07" />
<path stroke="rgb(68, 68, 68)" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="4" fill="none" d="M 284.47,13.07 L 361.27,13.07 361.27,37.07 284.47,37.07 284.47,13.07 Z M 284.47,13.07" />
<path stroke="none" fill="rgb(255, 255, 255)" d="M 361.27,13.07 L 428.47,13.07 428.47,37.07 361.27,37.07 361.27,13.07 Z M 361.27,13.07" />
<path stroke="rgb(68, 68, 68)" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="4" fill="none" d="M 361.27,13.07 L 428.47,13.07 428.47,37.07 361.27,37.07 361.27,13.07 Z M 361.27,13.07" />
<text fill="rgb(68, 68, 68)" font-size="12" x="43.44" y="17">
<tspan x="43.44" y="29">_(pizza).values()</tspan>
</text>
<text fill="rgb(68, 68, 68)" font-size="13.33" x="160.63" y="16">
<tspan x="160.63" y="30">10</tspan>
</text>
<text fill="rgb(68, 68, 68)" font-size="13.33" x="193.99" y="16">
<tspan x="193.99" y="30">“thin”</tspan>
</text>
<text fill="rgb(68, 68, 68)" font-size="13.33" x="242.49" y="16">
<tspan x="242.49" y="30">true</tspan>
</text>
<text fill="rgb(68, 68, 68)" font-size="12" x="288.09" y="17">
<tspan x="288.09" y="29">“pepperoni”</tspan>
</text>
<text fill="rgb(68, 68, 68)" font-size="12" x="366.17" y="17">
<tspan x="366.17" y="29">“sausage”</tspan>
</text>
</svg>
<figcaption>The values() function returns just the values of an object as an array.</figcaption>
</figure>

The `pairs()` function creates a two-dimensional array. Each element of the outer array is itself an array which contains an object's key and its corresponding value.

``` {.javascript}
> _(pizza).pairs()
 [ 
   ["size",10], 
   ["crust","thin"], 
   ["cheese",true], 
   ["toppings",["pepperoni","sausage"]]
 ]
```

<figure style="margin-left:0;margin-right:0;">
<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="640" height="104"  xml:space="preserve">
<defs>
<filter id="largeShadow-outer" filterUnits="userSpaceOnUse">
<feGaussianBlur stdDeviation="3" />
<feOffset dx="0.1" dy="4.1" result="blur" />
<feFlood flood-color="rgb(0, 0, 0)" flood-opacity="0.5" />
<feComposite in2="blur" operator="in" result="colorShadow" />
<feComposite in="SourceGraphic" in2="colorShadow" operator="over" />
</filter>
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
<path stroke="none" fill="rgb(255, 255, 255)" filter="url(#largeShadow-outer)" d="M 8.53,31.47 L 114.13,31.47 114.13,89.07 8.53,89.07 8.53,31.47 Z M 8.53,31.47" />
<path stroke="rgb(68, 68, 68)" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="4" fill="none" d="M 8.53,31.47 L 114.13,31.47 114.13,89.07 8.53,89.07 8.53,31.47 Z M 8.53,31.47" />
<path stroke="none" fill="rgb(255, 255, 255)" filter="url(#shadow-outer)" d="M 18.13,41.07 L 104.53,41.07 104.53,79.47 18.13,79.47 18.13,41.07 Z M 18.13,41.07" />
<path stroke="none" fill="rgb(255, 255, 255)" d="M 18.13,41.07 L 66.13,41.07 66.13,79.47 18.13,79.47 18.13,41.07 Z M 18.13,41.07" />
<path stroke="rgb(68, 68, 68)" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="4" fill="none" d="M 18.13,41.07 L 66.13,41.07 66.13,79.47 18.13,79.47 18.13,41.07 Z M 18.13,41.07" />
<path stroke="none" fill="rgb(255, 255, 255)" d="M 66.13,41.07 L 104.53,41.07 104.53,79.47 66.13,79.47 66.13,41.07 Z M 66.13,41.07" />
<path stroke="rgb(68, 68, 68)" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="4" fill="none" d="M 66.13,41.07 L 104.53,41.07 104.53,79.47 66.13,79.47 66.13,41.07 Z M 66.13,41.07" />
<path stroke="none" fill="rgb(255, 255, 255)" filter="url(#largeShadow-outer)" d="M 114.13,31.47 L 238.93,31.47 238.93,89.07 114.13,89.07 114.13,31.47 Z M 114.13,31.47" />
<path stroke="rgb(68, 68, 68)" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="4" fill="none" d="M 114.13,31.47 L 238.93,31.47 238.93,89.07 114.13,89.07 114.13,31.47 Z M 114.13,31.47" />
<path stroke="none" fill="rgb(255, 255, 255)" filter="url(#shadow-outer)" d="M 123.73,41.07 L 229.33,41.07 229.33,79.47 123.73,79.47 123.73,41.07 Z M 123.73,41.07" />
<path stroke="none" fill="rgb(255, 255, 255)" d="M 123.73,41.07 L 181.33,41.07 181.33,79.47 123.73,79.47 123.73,41.07 Z M 123.73,41.07" />
<path stroke="rgb(68, 68, 68)" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="4" fill="none" d="M 123.73,41.07 L 181.33,41.07 181.33,79.47 123.73,79.47 123.73,41.07 Z M 123.73,41.07" />
<path stroke="none" fill="rgb(255, 255, 255)" d="M 181.33,41.07 L 229.33,41.07 229.33,79.47 181.33,79.47 181.33,41.07 Z M 181.33,41.07" />
<path stroke="rgb(68, 68, 68)" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="4" fill="none" d="M 181.33,41.07 L 229.33,41.07 229.33,79.47 181.33,79.47 181.33,41.07 Z M 181.33,41.07" />
<path stroke="none" fill="rgb(255, 255, 255)" filter="url(#largeShadow-outer)" d="M 238.93,31.47 L 363.73,31.47 363.73,89.07 238.93,89.07 238.93,31.47 Z M 238.93,31.47" />
<path stroke="rgb(68, 68, 68)" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="4" fill="none" d="M 238.93,31.47 L 363.73,31.47 363.73,89.07 238.93,89.07 238.93,31.47 Z M 238.93,31.47" />
<path stroke="none" fill="rgb(255, 255, 255)" filter="url(#shadow-outer)" d="M 248.53,41.07 L 354.13,41.07 354.13,79.47 248.53,79.47 248.53,41.07 Z M 248.53,41.07" />
<path stroke="none" fill="rgb(255, 255, 255)" d="M 248.53,41.07 L 315.73,41.07 315.73,79.47 248.53,79.47 248.53,41.07 Z M 248.53,41.07" />
<path stroke="rgb(68, 68, 68)" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="4" fill="none" d="M 248.53,41.07 L 315.73,41.07 315.73,79.47 248.53,79.47 248.53,41.07 Z M 248.53,41.07" />
<path stroke="none" fill="rgb(255, 255, 255)" d="M 315.73,41.07 L 354.13,41.07 354.13,79.47 315.73,79.47 315.73,41.07 Z M 315.73,41.07" />
<path stroke="rgb(68, 68, 68)" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="4" fill="none" d="M 315.73,41.07 L 354.13,41.07 354.13,79.47 315.73,79.47 315.73,41.07 Z M 315.73,41.07" />
<path stroke="none" fill="rgb(255, 255, 255)" filter="url(#largeShadow-outer)" d="M 363.73,31.47 L 622.93,31.47 622.93,89.07 363.73,89.07 363.73,31.47 Z M 363.73,31.47" />
<path stroke="rgb(68, 68, 68)" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="4" fill="none" d="M 363.73,31.47 L 622.93,31.47 622.93,89.07 363.73,89.07 363.73,31.47 Z M 363.73,31.47" />
<path stroke="none" fill="rgb(255, 255, 255)" filter="url(#shadow-outer)" d="M 373.33,41.07 L 613.33,41.07 613.33,79.47 373.33,79.47 373.33,41.07 Z M 373.33,41.07" />
<path stroke="none" fill="rgb(255, 255, 255)" d="M 373.33,41.07 L 450.13,41.07 450.13,79.47 373.33,79.47 373.33,41.07 Z M 373.33,41.07" />
<path stroke="rgb(68, 68, 68)" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="4" fill="none" d="M 373.33,41.07 L 450.13,41.07 450.13,79.47 373.33,79.47 373.33,41.07 Z M 373.33,41.07" />
<path stroke="none" fill="rgb(255, 255, 255)" d="M 450.13,41.07 L 613.33,41.07 613.33,79.47 450.13,79.47 450.13,41.07 Z M 450.13,41.07" />
<path stroke="rgb(68, 68, 68)" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="4" fill="none" d="M 450.13,41.07 L 613.33,41.07 613.33,79.47 450.13,79.47 450.13,41.07 Z M 450.13,41.07" />
<rect stroke="none" fill="rgb(255, 255, 255)" filter="url(#smallShadow-outer)" x="459.73" y="48.27" width="144" height="24" />
<path stroke="none" fill="rgb(255, 255, 255)" d="M 459.73,48.27 L 536.53,48.27 536.53,72.27 459.73,72.27 459.73,48.27 Z M 459.73,48.27" />
<path stroke="rgb(68, 68, 68)" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="4" fill="none" d="M 459.73,48.27 L 536.53,48.27 536.53,72.27 459.73,72.27 459.73,48.27 Z M 459.73,48.27" />
<path stroke="none" fill="rgb(255, 255, 255)" d="M 536.53,48.27 L 603.73,48.27 603.73,72.27 536.53,72.27 536.53,48.27 Z M 536.53,48.27" />
<path stroke="rgb(68, 68, 68)" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="4" fill="none" d="M 536.53,48.27 L 603.73,48.27 603.73,72.27 536.53,72.27 536.53,48.27 Z M 536.53,48.27" />
<text fill="rgb(68, 68, 68)" font-size="12" x="15" y="4">
<tspan x="15" y="16">_(pizza).pairs()</tspan>
</text>
<text fill="rgb(68, 68, 68)" font-size="13.33" x="24.36" y="51">
<tspan x="24.36" y="65">“size”</tspan>
</text>
<text fill="rgb(68, 68, 68)" font-size="13.33" x="76.63" y="51">
<tspan x="76.63" y="65">10</tspan>
</text>
<text fill="rgb(68, 68, 68)" font-size="13.33" x="130.43" y="51">
<tspan x="130.43" y="65">“crust”</tspan>
</text>
<text fill="rgb(68, 68, 68)" font-size="13.33" x="186.99" y="51">
<tspan x="186.99" y="65">“thin”</tspan>
</text>
<text fill="rgb(68, 68, 68)" font-size="13.33" x="254.23" y="51">
<tspan x="254.23" y="65">“cheese”</tspan>
</text>
<text fill="rgb(68, 68, 68)" font-size="13.33" x="321.99" y="51">
<tspan x="321.99" y="65">true</tspan>
</text>
<text fill="rgb(68, 68, 68)" font-size="13.33" x="377.58" y="51">
<tspan x="377.58" y="65">“toppings”</tspan>
</text>
<text fill="rgb(68, 68, 68)" font-size="12" x="463.09" y="52">
<tspan x="463.09" y="64">“pepperoni”</tspan>
</text>
<text fill="rgb(68, 68, 68)" font-size="12" x="541.67" y="52">
<tspan x="541.67" y="64">“sausage”</tspan>
</text>
</svg>
<figcaption>The pairs() function converts an object into an array of array pairs.</figcaption>
</figure>

To reverse this transformation and convert an array into an object, there is the `object()` method.

``` {.javascript}
> var arr = [ ["size",10], ["crust","thin"], ["cheese",true], 
            ["toppings",["pepperoni","sausage"]] ]
> _(arr).object()
  { size: 10, crust: "thin", cheese: true, toppings: ["pepperoni","sausage"]}
```

Finally, we can swap the roles of keys and values in an object with the `invert()` function.

``` {.javascript}
> _(pizza).invert()
  {10: "size", thin: "crust", true: "cheese", "pepperoni,sausage": "toppings"}
```

<figure style="margin-left:0;margin-right:0;">
<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="600" height="210"  xml:space="preserve">
<defs>
<filter id="shadow-outer" filterUnits="userSpaceOnUse">
<feGaussianBlur stdDeviation="2.5" />
<feOffset dx="0.1" dy="3.1" result="blur" />
<feFlood flood-color="rgb(0, 0, 0)" flood-opacity="0.5" />
<feComposite in2="blur" operator="in" result="colorShadow" />
<feComposite in="SourceGraphic" in2="colorShadow" operator="over" />
</filter>
</defs>
<path stroke="none" fill="rgb(255, 255, 255)" filter="url(#shadow-outer)" d="M 167.33,5.87 L 365.73,5.87 C 374.57,5.87 381.73,13.03 381.73,21.87 L 381.73,181.87 C 381.73,190.7 374.57,197.87 365.73,197.87 L 167.33,197.87 C 158.5,197.87 151.33,190.7 151.33,181.87 L 151.33,21.87 C 151.33,13.03 158.5,5.87 167.33,5.87 Z M 167.33,5.87" />
<path stroke="rgb(68, 68, 68)" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="4" fill="none" d="M 167.33,5.87 L 365.73,5.87 C 374.57,5.87 381.73,13.03 381.73,21.87 L 381.73,181.87 C 381.73,190.7 374.57,197.87 365.73,197.87 L 167.33,197.87 C 158.5,197.87 151.33,190.7 151.33,181.87 L 151.33,21.87 C 151.33,13.03 158.5,5.87 167.33,5.87 Z M 167.33,5.87" />
<path stroke="none" fill="rgb(255, 255, 255)" d="M 295.33,25.07 L 372.13,25.07 372.13,63.47 295.33,63.47 295.33,25.07 Z M 295.33,25.07" />
<path stroke="none" fill="rgb(255, 255, 255)" d="M 151.33,25.07 L 295.33,25.07 295.33,63.47 151.33,63.47 151.33,25.07 Z M 151.33,25.07" />
<path stroke="none" fill="rgb(255, 255, 255)" d="M 295.33,63.47 L 372.13,63.47 372.13,101.87 295.33,101.87 295.33,63.47 Z M 295.33,63.47" />
<path stroke="none" fill="rgb(255, 255, 255)" d="M 295.33,101.87 L 372.13,101.87 372.13,140.27 295.33,140.27 295.33,101.87 Z M 295.33,101.87" />
<path stroke="none" fill="rgb(255, 255, 255)" d="M 151.33,63.47 L 295.33,63.47 295.33,101.87 151.33,101.87 151.33,63.47 Z M 151.33,63.47" />
<path stroke="none" fill="rgb(255, 255, 255)" d="M 151.33,101.87 L 295.33,101.87 295.33,140.27 151.33,140.27 151.33,101.87 Z M 151.33,101.87" />
<path stroke="rgb(68, 68, 68)" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="4" fill="none" d="M 151.33,101.87 L 381.73,101.87 381.73,140.27 151.33,140.27 151.33,101.87 Z M 151.33,101.87" />
<path stroke="rgb(68, 68, 68)" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="4" fill="none" d="M 151.33,63.47 L 381.73,63.47 381.73,101.87 151.33,101.87 151.33,63.47 Z M 151.33,63.47" />
<path stroke="rgb(68, 68, 68)" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="4" fill="none" d="M 151.33,25.07 L 381.73,25.07 381.73,63.47 151.33,63.47 151.33,25.07 Z M 151.33,25.07" />
<path stroke="none" fill="rgb(255, 255, 255)" d="M 151.33,140.27 L 304.93,140.27 304.93,178.67 151.33,178.67 151.33,140.27 Z M 151.33,140.27" />
<path stroke="none" fill="rgb(255, 255, 255)" d="M 295.33,140.27 L 381.73,140.27 381.73,178.67 295.33,178.67 295.33,140.27 Z M 295.33,140.27" />
<path stroke="rgb(68, 68, 68)" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="4" fill="none" d="M 151.33,140.27 L 381.73,140.27 381.73,178.67 151.33,178.67 151.33,140.27 Z M 151.33,140.27" />
<text fill="rgb(68, 68, 68)" font-size="13.33" x="302" y="35">
<tspan x="302" y="49">“size”</tspan>
</text>
<text fill="rgb(68, 68, 68)" font-size="13.33" x="257.36" y="35">
<tspan x="257.36" y="49">“10”:</tspan>
</text>
<text fill="rgb(68, 68, 68)" font-size="13.33" x="302" y="73">
<tspan x="302" y="87">“crust”</tspan>
</text>
<text fill="rgb(68, 68, 68)" font-size="13.33" x="302" y="112">
<tspan x="302" y="126">“cheese”</tspan>
</text>
<text fill="rgb(68, 68, 68)" font-size="13.33" x="249.51" y="73">
<tspan x="249.51" y="87">“thin”:</tspan>
</text>
<text fill="rgb(68, 68, 68)" font-size="13.33" x="248.25" y="112">
<tspan x="248.25" y="126">“true”:</tspan>
</text>
<text fill="rgb(68, 68, 68)" font-size="12" x="48.29" y="94">
<tspan x="48.29" y="106">_(pizza).invert()</tspan>
</text>
<text fill="rgb(68, 68, 68)" font-size="13.33" x="154.07" y="150">
<tspan x="154.07" y="164">“pepperoni,sausage”:</tspan>
</text>
<text fill="rgb(68, 68, 68)" font-size="13.33" x="302" y="150">
<tspan x="302" y="164">“toppings”</tspan>
</text>
</svg>
<figcaption>The invert() function swaps keys and values in an object.</figcaption>
</figure>

As the example shows, Underscore.js can even invert an object if the value isn't a simple type. In this case it takes an array, `["pepperoni","sausage"]` and converts it to a value by joining the individual array elements with commas, creating the key `"pepperoni,sausage"`.

Note also that JavaScript requires that all of an object's keys are unique. That's not necessarily the case for values. If you have an object in which multiple keys have the same value, then `invert()` only keeps the last of those keys in the inverted object. For example, `_({key1: value, key2: value}).invert()` returns `{value: key2}`.

### Object Subsets

When you want to clean up an object by eliminating unnecessary attributes, you can use Underscore.js's `pick()` function. Simply pass it a list of attributes that you want to retain.

``` {.javascript}
> _(pizza).pick("size","crust")
  {size: 10, crust: "thin"}
```

<figure style="margin-left:0;margin-right:0;">
<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="600" height="133"  xml:space="preserve">
<defs>
<filter id="shadow-outer" filterUnits="userSpaceOnUse">
<feGaussianBlur stdDeviation="2.5" />
<feOffset dx="0.1" dy="3.1" result="blur" />
<feFlood flood-color="rgb(0, 0, 0)" flood-opacity="0.5" />
<feComposite in2="blur" operator="in" result="colorShadow" />
<feComposite in="SourceGraphic" in2="colorShadow" operator="over" />
</filter>
</defs>
<path stroke="none" fill="rgb(255, 255, 255)" filter="url(#shadow-outer)" d="M 192.33,5.6 L 409.93,5.6 C 418.77,5.6 425.93,12.76 425.93,21.6 L 425.93,104.8 C 425.93,113.64 418.77,120.8 409.93,120.8 L 192.33,120.8 C 183.5,120.8 176.33,113.64 176.33,104.8 L 176.33,21.6 C 176.33,12.76 183.5,5.6 192.33,5.6 Z M 192.33,5.6" />
<path stroke="rgb(68, 68, 68)" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="4" fill="none" d="M 192.33,5.6 L 409.93,5.6 C 418.77,5.6 425.93,12.76 425.93,21.6 L 425.93,104.8 C 425.93,113.64 418.77,120.8 409.93,120.8 L 192.33,120.8 C 183.5,120.8 176.33,113.64 176.33,104.8 L 176.33,21.6 C 176.33,12.76 183.5,5.6 192.33,5.6 Z M 192.33,5.6" />
<path stroke="none" fill="rgb(255, 255, 255)" d="M 176.33,24.8 L 253.13,24.8 253.13,63.2 176.33,63.2 176.33,24.8 Z M 176.33,24.8" />
<path stroke="none" fill="rgb(255, 255, 255)" d="M 253.13,24.8 L 416.33,24.8 416.33,63.2 253.13,63.2 253.13,24.8 Z M 253.13,24.8" />
<path stroke="none" fill="rgb(255, 255, 255)" d="M 176.33,63.2 L 253.13,63.2 253.13,101.6 176.33,101.6 176.33,63.2 Z M 176.33,63.2" />
<path stroke="none" fill="rgb(255, 255, 255)" d="M 253.13,63.2 L 416.33,63.2 416.33,101.6 253.13,101.6 253.13,63.2 Z M 253.13,63.2" />
<path stroke="rgb(68, 68, 68)" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="4" fill="none" d="M 176.33,63.2 L 425.93,63.2 425.93,101.6 176.33,101.6 176.33,63.2 Z M 176.33,63.2" />
<path stroke="rgb(68, 68, 68)" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="4" fill="none" d="M 176.33,24.8 L 425.93,24.8 425.93,63.2 176.33,63.2 176.33,24.8 Z M 176.33,24.8" />
<text fill="rgb(68, 68, 68)" font-size="13.33" x="219.52" y="35">
<tspan x="219.52" y="49">size:</tspan>
</text>
<rect stroke="none" fill="none" x="259.8" y="34.52" width="26.67" height="26.67" />
<text fill="rgb(68, 68, 68)" font-size="13.33" x="259.8" y="34.52">
<tspan x="259.8" y="48.52">10</tspan>
</text>
<text fill="rgb(68, 68, 68)" font-size="13.33" x="211.63" y="73">
<tspan x="211.63" y="87">crust:</tspan>
</text>
<rect stroke="none" fill="none" x="259.8" y="72.92" width="66.67" height="26.67" />
<text fill="rgb(68, 68, 68)" font-size="13.33" x="259.8" y="72.92">
<tspan x="259.8" y="86.92">“thin”</tspan>
</text>
<text fill="rgb(68, 68, 68)" font-size="12" x="12.83" y="55">
<tspan x="12.83" y="67">_(pizza).pick(“size”,“crust”)</tspan>
</text>
</svg>
<figcaption>The pick() function selects specific properties from an object.</figcaption>
</figure>

We can also do the opposite of `pick()` by using `omit()` and listing the attributes that we want to delete. Underscore.js keeps all the other attributes in the object.

``` {.javascript}
> _(pizza).omit("size","crust")
 {cheese: true, toppings: ["pepperoni","sausage"]}
```

<figure style="margin-left:0;margin-right:0;">
<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="600" height="134"  xml:space="preserve">
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
<path stroke="none" fill="rgb(255, 255, 255)" filter="url(#shadow-outer)" d="M 191.33,5.87 L 408.93,5.87 C 417.77,5.87 424.93,13.03 424.93,21.87 L 424.93,105.07 C 424.93,113.9 417.77,121.07 408.93,121.07 L 191.33,121.07 C 182.5,121.07 175.33,113.9 175.33,105.07 L 175.33,21.87 C 175.33,13.03 182.5,5.87 191.33,5.87 Z M 191.33,5.87" />
<path stroke="rgb(68, 68, 68)" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="4" fill="none" d="M 191.33,5.87 L 408.93,5.87 C 417.77,5.87 424.93,13.03 424.93,21.87 L 424.93,105.07 C 424.93,113.9 417.77,121.07 408.93,121.07 L 191.33,121.07 C 182.5,121.07 175.33,113.9 175.33,105.07 L 175.33,21.87 C 175.33,13.03 182.5,5.87 191.33,5.87 Z M 191.33,5.87" />
<path stroke="none" fill="rgb(255, 255, 255)" d="M 175.33,25.07 L 252.13,25.07 252.13,63.47 175.33,63.47 175.33,25.07 Z M 175.33,25.07" />
<path stroke="none" fill="rgb(255, 255, 255)" d="M 175.33,63.47 L 252.13,63.47 252.13,101.87 175.33,101.87 175.33,63.47 Z M 175.33,63.47" />
<path stroke="none" fill="rgb(255, 255, 255)" d="M 252.13,25.07 L 415.33,25.07 415.33,63.47 252.13,63.47 252.13,25.07 Z M 252.13,25.07" />
<path stroke="rgb(68, 68, 68)" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="4" fill="none" d="M 175.33,25.07 L 424.93,25.07 424.93,63.47 175.33,63.47 175.33,25.07 Z M 175.33,25.07" />
<path stroke="none" fill="rgb(255, 255, 255)" d="M 252.13,63.47 L 415.33,63.47 415.33,101.87 252.13,101.87 252.13,63.47 Z M 252.13,63.47" />
<g id="group3">
<rect stroke="none" fill="rgb(255, 255, 255)" filter="url(#smallShadow-outer)" x="261.73" y="70.67" width="144" height="24" />
</g>
<path stroke="none" fill="rgb(255, 255, 255)" d="M 261.73,70.67 L 338.53,70.67 338.53,94.67 261.73,94.67 261.73,70.67 Z M 261.73,70.67" />
<path stroke="rgb(68, 68, 68)" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="4" fill="none" d="M 261.73,70.67 L 338.53,70.67 338.53,94.67 261.73,94.67 261.73,70.67 Z M 261.73,70.67" />
<path stroke="none" fill="rgb(255, 255, 255)" d="M 338.53,70.67 L 405.73,70.67 405.73,94.67 338.53,94.67 338.53,70.67 Z M 338.53,70.67" />
<path stroke="rgb(68, 68, 68)" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="4" fill="none" d="M 338.53,70.67 L 405.73,70.67 405.73,94.67 338.53,94.67 338.53,70.67 Z M 338.53,70.67" />
<path stroke="rgb(68, 68, 68)" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="4" fill="none" d="M 175.33,63.47 L 424.93,63.47 424.93,101.87 175.33,101.87 175.33,63.47 Z M 175.33,63.47" />
<text fill="rgb(68, 68, 68)" font-size="12" x="15.45" y="58">
<tspan x="15.45" y="70">_(pizza).omit(“size”,“crust”)</tspan>
</text>
<text fill="rgb(68, 68, 68)" font-size="13.33" x="198.07" y="35">
<tspan x="198.07" y="49">cheese:</tspan>
</text>
<text fill="rgb(68, 68, 68)" font-size="13.33" x="186.12" y="73">
<tspan x="186.12" y="87">toppings:</tspan>
</text>
<text fill="rgb(68, 68, 68)" font-size="13.33" x="259" y="35">
<tspan x="259" y="49">true</tspan>
</text>
<text fill="rgb(68, 68, 68)" font-size="12" x="265.09" y="75">
<tspan x="265.09" y="87">“pepperoni”</tspan>
</text>
<text fill="rgb(68, 68, 68)" font-size="12" x="343.67" y="75">
<tspan x="343.67" y="87">“sausage”</tspan>
</text>
</svg>
<figcaption>The omit() function removes properties from an object.</figcaption>
</figure>

### Updating Attributes

When updating objects, a common requirement is to make sure that an object includes certain attributes and that those attributes have appropriate default values. Underscore.js includes two utilities for this purpose.

The two utilities, `extend()` and `defaults()` both start with one object and adjust its properties based on those of other objects. If the secondary objects include attributes that the original object lacks, these utilities add those properties to the original. The utilities differ in how they handle properties that are already present in the original. The `extend()` function overrides the original properties with new values, as shown below:

``` {.javascript}
> var standard = { size: 12, crust: "regular", cheese: true }
> var order = { size: 10, crust: "thin", 
  toppings: ["pepperoni","sausage"] };
> _.extend(standard, order)
  { size: 10, crust: "thin", cheese: true, 
  toppings: ["pepperoni","sausage"] };
```

<figure style="margin-left:0;margin-right:0;">
<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="600" height="426"  xml:space="preserve">
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
<path stroke="none" fill="rgb(255, 255, 255)" d="M 313.07,240.8 L 389.87,240.8 389.87,279.2 313.07,279.2 313.07,240.8 Z M 313.07,240.8" />
<path stroke="none" fill="rgb(255, 255, 255)" d="M 313.07,317.6 L 389.87,317.6 389.87,356 313.07,356 313.07,317.6 Z M 313.07,317.6" />
<path stroke="none" fill="rgb(255, 255, 255)" d="M 313.07,356 L 389.87,356 389.87,394.4 313.07,394.4 313.07,356 Z M 313.07,356" />
<path stroke="none" fill="rgb(255, 255, 255)" filter="url(#shadow-outer)" d="M 41.07,29.6 L 258.67,29.6 C 267.5,29.6 274.67,36.76 274.67,45.6 L 274.67,167.2 C 274.67,176.04 267.5,183.2 258.67,183.2 L 41.07,183.2 C 32.23,183.2 25.07,176.04 25.07,167.2 L 25.07,45.6 C 25.07,36.76 32.23,29.6 41.07,29.6 Z M 41.07,29.6" />
<path stroke="rgb(68, 68, 68)" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="4" fill="none" d="M 41.07,29.6 L 258.67,29.6 C 267.5,29.6 274.67,36.76 274.67,45.6 L 274.67,167.2 C 274.67,176.04 267.5,183.2 258.67,183.2 L 41.07,183.2 C 32.23,183.2 25.07,176.04 25.07,167.2 L 25.07,45.6 C 25.07,36.76 32.23,29.6 41.07,29.6 Z M 41.07,29.6" />
<path stroke="none" fill="rgb(255, 255, 255)" d="M 25.07,125.6 L 101.87,125.6 101.87,164 25.07,164 25.07,125.6 Z M 25.07,125.6" />
<path stroke="none" fill="rgb(255, 255, 255)" d="M 111.47,125.6 L 265.07,125.6 265.07,164 111.47,164 111.47,125.6 Z M 111.47,125.6" />
<g id="group5">
<path stroke="rgb(193, 193, 193)" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="4" fill="none" d="M 25.07,58.4 L 34.67,48.8" />
<path stroke="rgb(193, 193, 193)" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="4" fill="none" d="M 25.07,68 L 44.27,48.8" />
<path stroke="rgb(193, 193, 193)" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="4" fill="none" d="M 25.07,77.6 L 53.87,48.8" />
<path stroke="rgb(193, 193, 193)" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="4" fill="none" d="M 25.07,87.2 L 63.47,48.8" />
<path stroke="rgb(193, 193, 193)" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="4" fill="none" d="M 245.87,87.2 L 274.67,58.4" />
<path stroke="rgb(193, 193, 193)" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="4" fill="none" d="M 255.47,87.2 L 274.67,68" />
<path stroke="rgb(193, 193, 193)" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="4" fill="none" d="M 265.07,87.2 L 274.67,77.6" />
<path stroke="rgb(193, 193, 193)" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="4" fill="none" d="M 34.67,87.2 L 73.07,48.8" />
<path stroke="rgb(193, 193, 193)" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="4" fill="none" d="M 44.27,87.2 L 82.67,48.8" />
<path stroke="rgb(193, 193, 193)" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="4" fill="none" d="M 53.87,87.2 L 92.27,48.8" />
<path stroke="rgb(193, 193, 193)" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="4" fill="none" d="M 63.47,87.2 L 101.87,48.8" />
<path stroke="rgb(193, 193, 193)" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="4" fill="none" d="M 73.07,87.2 L 111.47,48.8" />
<path stroke="rgb(193, 193, 193)" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="4" fill="none" d="M 82.67,87.2 L 121.07,48.8" />
<path stroke="rgb(193, 193, 193)" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="4" fill="none" d="M 92.27,87.2 L 130.67,48.8" />
<path stroke="rgb(193, 193, 193)" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="4" fill="none" d="M 101.87,87.2 L 140.27,48.8" />
<path stroke="rgb(193, 193, 193)" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="4" fill="none" d="M 111.47,87.2 L 149.87,48.8" />
<path stroke="rgb(193, 193, 193)" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="4" fill="none" d="M 121.07,87.2 L 159.47,48.8" />
<path stroke="rgb(193, 193, 193)" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="4" fill="none" d="M 130.67,87.2 L 169.07,48.8" />
<path stroke="rgb(193, 193, 193)" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="4" fill="none" d="M 140.27,87.2 L 178.67,48.8" />
<path stroke="rgb(193, 193, 193)" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="4" fill="none" d="M 149.87,87.2 L 188.27,48.8" />
<path stroke="rgb(193, 193, 193)" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="4" fill="none" d="M 159.47,87.2 L 197.87,48.8" />
<path stroke="rgb(193, 193, 193)" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="4" fill="none" d="M 169.07,87.2 L 207.47,48.8" />
<path stroke="rgb(193, 193, 193)" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="4" fill="none" d="M 178.67,87.2 L 217.07,48.8" />
<path stroke="rgb(193, 193, 193)" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="4" fill="none" d="M 188.27,87.2 L 226.67,48.8" />
<path stroke="rgb(193, 193, 193)" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="4" fill="none" d="M 197.87,87.2 L 236.27,48.8" />
<path stroke="rgb(193, 193, 193)" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="4" fill="none" d="M 207.47,87.2 L 245.87,48.8" />
<path stroke="rgb(193, 193, 193)" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="4" fill="none" d="M 217.07,87.2 L 255.47,48.8" />
<path stroke="rgb(193, 193, 193)" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="4" fill="none" d="M 226.67,87.2 L 265.07,48.8" />
<path stroke="rgb(193, 193, 193)" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="4" fill="none" d="M 236.27,87.2 L 274.67,48.8" />
</g>
<path stroke="rgb(68, 68, 68)" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="4" fill="none" d="M 25.07,48.8 L 274.67,48.8 274.67,87.2 25.07,87.2 25.07,48.8 Z M 25.07,48.8" />
<g id="group">
<path stroke="rgb(193, 193, 193)" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="4" fill="none" d="M 25.07,96.8 L 34.67,87.2" />
<path stroke="rgb(193, 193, 193)" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="4" fill="none" d="M 25.07,106.4 L 44.27,87.2" />
<path stroke="rgb(193, 193, 193)" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="4" fill="none" d="M 25.07,116 L 53.87,87.2" />
<path stroke="rgb(193, 193, 193)" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="4" fill="none" d="M 25.07,125.6 L 63.47,87.2" />
<path stroke="rgb(193, 193, 193)" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="4" fill="none" d="M 245.87,125.6 L 274.67,96.8" />
<path stroke="rgb(193, 193, 193)" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="4" fill="none" d="M 255.47,125.6 L 274.67,106.4" />
<path stroke="rgb(193, 193, 193)" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="4" fill="none" d="M 265.07,125.6 L 274.67,116" />
<path stroke="rgb(193, 193, 193)" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="4" fill="none" d="M 34.67,125.6 L 73.07,87.2" />
<path stroke="rgb(193, 193, 193)" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="4" fill="none" d="M 44.27,125.6 L 82.67,87.2" />
<path stroke="rgb(193, 193, 193)" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="4" fill="none" d="M 53.87,125.6 L 92.27,87.2" />
<path stroke="rgb(193, 193, 193)" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="4" fill="none" d="M 63.47,125.6 L 101.87,87.2" />
<path stroke="rgb(193, 193, 193)" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="4" fill="none" d="M 73.07,125.6 L 111.47,87.2" />
<path stroke="rgb(193, 193, 193)" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="4" fill="none" d="M 82.67,125.6 L 121.07,87.2" />
<path stroke="rgb(193, 193, 193)" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="4" fill="none" d="M 92.27,125.6 L 130.67,87.2" />
<path stroke="rgb(193, 193, 193)" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="4" fill="none" d="M 101.87,125.6 L 140.27,87.2" />
<path stroke="rgb(193, 193, 193)" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="4" fill="none" d="M 111.47,125.6 L 149.87,87.2" />
<path stroke="rgb(193, 193, 193)" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="4" fill="none" d="M 121.07,125.6 L 159.47,87.2" />
<path stroke="rgb(193, 193, 193)" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="4" fill="none" d="M 130.67,125.6 L 169.07,87.2" />
<path stroke="rgb(193, 193, 193)" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="4" fill="none" d="M 140.27,125.6 L 178.67,87.2" />
<path stroke="rgb(193, 193, 193)" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="4" fill="none" d="M 149.87,125.6 L 188.27,87.2" />
<path stroke="rgb(193, 193, 193)" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="4" fill="none" d="M 159.47,125.6 L 197.87,87.2" />
<path stroke="rgb(193, 193, 193)" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="4" fill="none" d="M 169.07,125.6 L 207.47,87.2" />
<path stroke="rgb(193, 193, 193)" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="4" fill="none" d="M 178.67,125.6 L 217.07,87.2" />
<path stroke="rgb(193, 193, 193)" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="4" fill="none" d="M 188.27,125.6 L 226.67,87.2" />
<path stroke="rgb(193, 193, 193)" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="4" fill="none" d="M 197.87,125.6 L 236.27,87.2" />
<path stroke="rgb(193, 193, 193)" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="4" fill="none" d="M 207.47,125.6 L 245.87,87.2" />
<path stroke="rgb(193, 193, 193)" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="4" fill="none" d="M 217.07,125.6 L 255.47,87.2" />
<path stroke="rgb(193, 193, 193)" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="4" fill="none" d="M 226.67,125.6 L 265.07,87.2" />
<path stroke="rgb(193, 193, 193)" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="4" fill="none" d="M 236.27,125.6 L 274.67,87.2" />
</g>
<path stroke="rgb(68, 68, 68)" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="4" fill="none" d="M 25.07,87.2 L 274.67,87.2 274.67,125.6 25.07,125.6 25.07,87.2 Z M 25.07,87.2" />
<path stroke="rgb(68, 68, 68)" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="4" fill="none" d="M 25.07,125.6 L 274.67,125.6 274.67,164 25.07,164 25.07,125.6 Z M 25.07,125.6" />
<path stroke="none" fill="rgb(255, 255, 255)" d="M 313.07,48.8 L 389.87,48.8 389.87,87.2 313.07,87.2 313.07,48.8 Z M 313.07,48.8" />
<path stroke="none" fill="rgb(255, 255, 255)" d="M 313.07,87.2 L 389.87,87.2 389.87,125.6 313.07,125.6 313.07,87.2 Z M 313.07,87.2" />
<path stroke="none" fill="rgb(255, 255, 255)" d="M 313.07,125.6 L 389.87,125.6 389.87,164 313.07,164 313.07,125.6 Z M 313.07,125.6" />
<path stroke="none" fill="rgb(255, 255, 255)" filter="url(#shadow-outer)" d="M 329.07,29.6 L 546.67,29.6 C 555.5,29.6 562.67,36.76 562.67,45.6 L 562.67,167.2 C 562.67,176.04 555.5,183.2 546.67,183.2 L 329.07,183.2 C 320.23,183.2 313.07,176.04 313.07,167.2 L 313.07,45.6 C 313.07,36.76 320.23,29.6 329.07,29.6 Z M 329.07,29.6" />
<path stroke="rgb(68, 68, 68)" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="4" fill="none" d="M 329.07,29.6 L 546.67,29.6 C 555.5,29.6 562.67,36.76 562.67,45.6 L 562.67,167.2 C 562.67,176.04 555.5,183.2 546.67,183.2 L 329.07,183.2 C 320.23,183.2 313.07,176.04 313.07,167.2 L 313.07,45.6 C 313.07,36.76 320.23,29.6 329.07,29.6 Z M 329.07,29.6" />
<path stroke="none" fill="rgb(255, 255, 255)" d="M 389.87,48.8 L 553.07,48.8 553.07,87.2 389.87,87.2 389.87,48.8 Z M 389.87,48.8" />
<path stroke="none" fill="rgb(255, 255, 255)" d="M 389.87,87.2 L 553.07,87.2 553.07,125.6 389.87,125.6 389.87,87.2 Z M 389.87,87.2" />
<path stroke="rgb(68, 68, 68)" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="4" fill="none" d="M 313.07,87.2 L 562.67,87.2 562.67,125.6 313.07,125.6 313.07,87.2 Z M 313.07,87.2" />
<path stroke="rgb(68, 68, 68)" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="4" fill="none" d="M 313.07,48.8 L 562.67,48.8 562.67,87.2 313.07,87.2 313.07,48.8 Z M 313.07,48.8" />
<path stroke="none" fill="rgb(255, 255, 255)" d="M 389.87,125.6 L 553.07,125.6 553.07,164 389.87,164 389.87,125.6 Z M 389.87,125.6" />
<path stroke="none" fill="rgb(255, 255, 255)" filter="url(#smallShadow-outer)" d="M 399.47,132.8 L 543.47,132.8 543.47,156.8 399.47,156.8 399.47,132.8 Z M 399.47,132.8" />
<path stroke="none" fill="rgb(255, 255, 255)" d="M 399.47,132.8 L 476.27,132.8 476.27,156.8 399.47,156.8 399.47,132.8 Z M 399.47,132.8" />
<path stroke="rgb(68, 68, 68)" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="4" fill="none" d="M 399.47,132.8 L 476.27,132.8 476.27,156.8 399.47,156.8 399.47,132.8 Z M 399.47,132.8" />
<path stroke="none" fill="rgb(255, 255, 255)" d="M 476.27,132.8 L 543.47,132.8 543.47,156.8 476.27,156.8 476.27,132.8 Z M 476.27,132.8" />
<path stroke="rgb(68, 68, 68)" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="4" fill="none" d="M 476.27,132.8 L 543.47,132.8 543.47,156.8 476.27,156.8 476.27,132.8 Z M 476.27,132.8" />
<path stroke="rgb(68, 68, 68)" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="4" fill="none" d="M 313.07,125.6 L 562.67,125.6 562.67,164 313.07,164 313.07,125.6 Z M 313.07,125.6" />
<path stroke="none" fill="rgb(255, 255, 255)" d="M 313.07,279.2 L 389.87,279.2 389.87,317.6 313.07,317.6 313.07,279.2 Z M 313.07,279.2" />
<path stroke="none" fill="rgb(255, 255, 255)" filter="url(#shadow-outer)" d="M 329.07,221.6 L 546.67,221.6 C 555.5,221.6 562.67,228.76 562.67,237.6 L 562.67,397.6 C 562.67,406.44 555.5,413.6 546.67,413.6 L 329.07,413.6 C 320.23,413.6 313.07,406.44 313.07,397.6 L 313.07,237.6 C 313.07,228.76 320.23,221.6 329.07,221.6 Z M 329.07,221.6" />
<path stroke="rgb(68, 68, 68)" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="4" fill="none" d="M 329.07,221.6 L 546.67,221.6 C 555.5,221.6 562.67,228.76 562.67,237.6 L 562.67,397.6 C 562.67,406.44 555.5,413.6 546.67,413.6 L 329.07,413.6 C 320.23,413.6 313.07,406.44 313.07,397.6 L 313.07,237.6 C 313.07,228.76 320.23,221.6 329.07,221.6 Z M 329.07,221.6" />
<path stroke="none" fill="rgb(255, 255, 255)" d="M 389.87,240.8 L 553.07,240.8 553.07,279.2 389.87,279.2 389.87,240.8 Z M 389.87,240.8" />
<path stroke="none" fill="rgb(255, 255, 255)" d="M 389.87,279.2 L 553.07,279.2 553.07,317.6 389.87,317.6 389.87,279.2 Z M 389.87,279.2" />
<path stroke="none" fill="rgb(255, 255, 255)" d="M 389.87,317.6 L 553.07,317.6 553.07,356 389.87,356 389.87,317.6 Z M 389.87,317.6" />
<path stroke="rgb(68, 68, 68)" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="4" fill="none" d="M 313.07,317.6 L 562.67,317.6 562.67,356 313.07,356 313.07,317.6 Z M 313.07,317.6" />
<path stroke="rgb(68, 68, 68)" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="4" fill="none" d="M 313.07,279.2 L 562.67,279.2 562.67,317.6 313.07,317.6 313.07,279.2 Z M 313.07,279.2" />
<path stroke="rgb(68, 68, 68)" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="4" fill="none" d="M 313.07,240.8 L 562.67,240.8 562.67,279.2 313.07,279.2 313.07,240.8 Z M 313.07,240.8" />
<path stroke="none" fill="rgb(255, 255, 255)" d="M 389.87,356 L 553.07,356 553.07,394.4 389.87,394.4 389.87,356 Z M 389.87,356" />
<path stroke="none" fill="rgb(255, 255, 255)" filter="url(#smallShadow-outer)" d="M 399.47,363.2 L 543.47,363.2 543.47,387.2 399.47,387.2 399.47,363.2 Z M 399.47,363.2" />
<path stroke="none" fill="rgb(255, 255, 255)" d="M 399.47,363.2 L 476.27,363.2 476.27,387.2 399.47,387.2 399.47,363.2 Z M 399.47,363.2" />
<path stroke="rgb(68, 68, 68)" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="4" fill="none" d="M 399.47,363.2 L 476.27,363.2 476.27,387.2 399.47,387.2 399.47,363.2 Z M 399.47,363.2" />
<path stroke="none" fill="rgb(255, 255, 255)" d="M 476.27,363.2 L 543.47,363.2 543.47,387.2 476.27,387.2 476.27,363.2 Z M 476.27,363.2" />
<path stroke="rgb(68, 68, 68)" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="4" fill="none" d="M 476.27,363.2 L 543.47,363.2 543.47,387.2 476.27,387.2 476.27,363.2 Z M 476.27,363.2" />
<path stroke="rgb(68, 68, 68)" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="4" fill="none" d="M 313.07,356 L 562.67,356 562.67,394.4 313.07,394.4 313.07,356 Z M 313.07,356" />
<text fill="rgb(68, 68, 68)" font-size="12" x="32" y="7">
<tspan x="32" y="19">standard</tspan>
</text>
<text fill="rgb(68, 68, 68)" font-size="13.33" x="46.07" y="135">
<tspan x="46.07" y="149">cheese:</tspan>
</text>
<rect stroke="none" fill="none" x="118.13" y="135.32" width="53.33" height="26.67" />
<text fill="rgb(68, 68, 68)" font-size="13.33" x="118.13" y="135.32">
<tspan x="118.13" y="149.32">true</tspan>
</text>
<text fill="rgb(68, 68, 68)" font-size="13.33" x="66.52" y="59">
<tspan x="66.52" y="73">size:</tspan>
</text>
<rect stroke="none" fill="none" x="118.13" y="58.52" width="26.67" height="26.67" />
<text fill="rgb(68, 68, 68)" font-size="13.33" x="118.13" y="58.52">
<tspan x="118.13" y="72.52">12</tspan>
</text>
<text fill="rgb(68, 68, 68)" font-size="13.33" x="58.63" y="97">
<tspan x="58.63" y="111">crust:</tspan>
</text>
<text fill="rgb(68, 68, 68)" font-size="13.33" x="118" y="97">
<tspan x="118" y="111">“regular”</tspan>
</text>
<text fill="rgb(68, 68, 68)" font-size="12" x="320" y="7">
<tspan x="320" y="19">order</tspan>
</text>
<rect stroke="none" fill="none" x="396.53" y="58.52" width="26.67" height="26.67" />
<text fill="rgb(68, 68, 68)" font-size="13.33" x="396.53" y="58.52">
<tspan x="396.53" y="72.52">10</tspan>
</text>
<rect stroke="none" fill="none" x="396.53" y="96.92" width="66.67" height="26.67" />
<text fill="rgb(68, 68, 68)" font-size="13.33" x="396.53" y="96.92">
<tspan x="396.53" y="110.92">“thin”</tspan>
</text>
<text fill="rgb(68, 68, 68)" font-size="12" x="403.09" y="137">
<tspan x="403.09" y="149">“pepperoni”</tspan>
</text>
<text fill="rgb(68, 68, 68)" font-size="12" x="481.17" y="137">
<tspan x="481.17" y="149">“sausage”</tspan>
</text>
<text fill="rgb(68, 68, 68)" font-size="12" x="185" y="285">
<tspan x="185" y="297">_.extend(</tspan>
</text>
<text fill="rgb(68, 68, 68)" font-size="12" x="198" y="301">
<tspan x="198" y="313">standard,</tspan>
</text>
<rect stroke="none" fill="none" x="197.33" y="317.47" width="72" height="24" />
<text fill="rgb(68, 68, 68)" font-size="12" x="197.33" y="317.47">
<tspan x="197.33" y="329.47">order</tspan>
</text>
<rect stroke="none" fill="none" x="185.33" y="333.47" width="12" height="24" />
<text fill="rgb(68, 68, 68)" font-size="12" x="185.33" y="333.47">
<tspan x="185.33" y="345.47">)</tspan>
</text>
<rect stroke="none" fill="none" x="396.53" y="250.52" width="26.67" height="26.67" />
<text fill="rgb(68, 68, 68)" font-size="13.33" x="396.53" y="250.52">
<tspan x="396.53" y="264.52">10</tspan>
</text>
<rect stroke="none" fill="none" x="396.53" y="288.92" width="66.67" height="26.67" />
<text fill="rgb(68, 68, 68)" font-size="13.33" x="396.53" y="288.92">
<tspan x="396.53" y="302.92">“thin”</tspan>
</text>
<rect stroke="none" fill="none" x="396.53" y="327.32" width="53.33" height="26.67" />
<text fill="rgb(68, 68, 68)" font-size="13.33" x="396.53" y="327.32">
<tspan x="396.53" y="341.32">true</tspan>
</text>
<text fill="rgb(68, 68, 68)" font-size="12" x="403.09" y="367">
<tspan x="403.09" y="379">“pepperoni”</tspan>
</text>
<text fill="rgb(68, 68, 68)" font-size="12" x="481.17" y="367">
<tspan x="481.17" y="379">“sausage”</tspan>
</text>
<text fill="rgb(68, 68, 68)" font-size="13.33" x="347.63" y="289">
<tspan x="347.63" y="303">crust:</tspan>
</text>
<text fill="rgb(68, 68, 68)" font-size="13.33" x="323.12" y="135">
<tspan x="323.12" y="149">toppings:</tspan>
</text>
<text fill="rgb(68, 68, 68)" font-size="13.33" x="347.63" y="97">
<tspan x="347.63" y="111">crust:</tspan>
</text>
<text fill="rgb(68, 68, 68)" font-size="13.33" x="355.52" y="59">
<tspan x="355.52" y="73">size:</tspan>
</text>
<text fill="rgb(68, 68, 68)" font-size="13.33" x="323.12" y="366">
<tspan x="323.12" y="380">toppings:</tspan>
</text>
<text fill="rgb(68, 68, 68)" font-size="13.33" x="335.07" y="327">
<tspan x="335.07" y="341">cheese:</tspan>
</text>
<text fill="rgb(68, 68, 68)" font-size="13.33" x="355.52" y="251">
<tspan x="355.52" y="265">size:</tspan>
</text>
</svg>
<figcaption>The extend() function updates and adds missing properties to an object.</figcaption>
</figure>

Meanwhile `defaults()` leaves the original properties unchanged:

``` {.javascript}
> var order = { size: 10, crust: "thin", 
  toppings: ["pepperoni","sausage"] };
> var standard = { size: 12, crust: "regular", cheese: true }
> _.defaults(order, standard)
  { size: 10, crust: "thin", 
  toppings ["pepperoni","sausage"], cheese: true };
```

<figure style="margin-left:0;margin-right:0;">
<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="600" height="426"  xml:space="preserve">
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
<path stroke="none" fill="rgb(255, 255, 255)" filter="url(#shadow-outer)" d="M 41.07,29.6 L 258.67,29.6 C 267.5,29.6 274.67,36.76 274.67,45.6 L 274.67,167.2 C 274.67,176.04 267.5,183.2 258.67,183.2 L 41.07,183.2 C 32.23,183.2 25.07,176.04 25.07,167.2 L 25.07,45.6 C 25.07,36.76 32.23,29.6 41.07,29.6 Z M 41.07,29.6" />
<path stroke="rgb(68, 68, 68)" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="4" fill="none" d="M 41.07,29.6 L 258.67,29.6 C 267.5,29.6 274.67,36.76 274.67,45.6 L 274.67,167.2 C 274.67,176.04 267.5,183.2 258.67,183.2 L 41.07,183.2 C 32.23,183.2 25.07,176.04 25.07,167.2 L 25.07,45.6 C 25.07,36.76 32.23,29.6 41.07,29.6 Z M 41.07,29.6" />
<path stroke="none" fill="rgb(255, 255, 255)" d="M 25.07,48.8 L 101.87,48.8 101.87,87.2 25.07,87.2 25.07,48.8 Z M 25.07,48.8" />
<path stroke="none" fill="rgb(255, 255, 255)" d="M 101.87,48.8 L 265.07,48.8 265.07,87.2 101.87,87.2 101.87,48.8 Z M 101.87,48.8" />
<path stroke="none" fill="rgb(255, 255, 255)" d="M 25.07,87.2 L 101.87,87.2 101.87,125.6 25.07,125.6 25.07,87.2 Z M 25.07,87.2" />
<path stroke="none" fill="rgb(255, 255, 255)" d="M 101.87,87.2 L 265.07,87.2 265.07,125.6 101.87,125.6 101.87,87.2 Z M 101.87,87.2" />
<path stroke="rgb(68, 68, 68)" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="4" fill="none" d="M 25.07,87.2 L 274.67,87.2 274.67,125.6 25.07,125.6 25.07,87.2 Z M 25.07,87.2" />
<path stroke="rgb(68, 68, 68)" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="4" fill="none" d="M 25.07,48.8 L 274.67,48.8 274.67,87.2 25.07,87.2 25.07,48.8 Z M 25.07,48.8" />
<path stroke="none" fill="rgb(255, 255, 255)" d="M 25.07,125.6 L 101.87,125.6 101.87,164 25.07,164 25.07,125.6 Z M 25.07,125.6" />
<path stroke="none" fill="rgb(255, 255, 255)" d="M 101.87,125.6 L 265.07,125.6 265.07,164 101.87,164 101.87,125.6 Z M 101.87,125.6" />
<g id="group3">
<rect stroke="none" fill="rgb(255, 255, 255)" filter="url(#smallShadow-outer)" x="111.47" y="132.8" width="144" height="24" />
</g>
<path stroke="none" fill="rgb(255, 255, 255)" d="M 111.47,132.8 L 188.27,132.8 188.27,156.8 111.47,156.8 111.47,132.8 Z M 111.47,132.8" />
<path stroke="rgb(68, 68, 68)" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="4" fill="none" d="M 111.47,132.8 L 188.27,132.8 188.27,156.8 111.47,156.8 111.47,132.8 Z M 111.47,132.8" />
<rect stroke="none" fill="rgb(255, 255, 255)" x="188.27" y="132.8" width="67.2" height="24" />
<rect stroke="rgb(68, 68, 68)" stroke-width="1.33" fill="none" x="188.27" y="132.8" width="67.2" height="24" />
<path stroke="rgb(68, 68, 68)" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="4" fill="none" d="M 25.07,125.6 L 274.67,125.6 274.67,164 25.07,164 25.07,125.6 Z M 25.07,125.6" />
<path stroke="none" fill="rgb(255, 255, 255)" filter="url(#shadow-outer)" d="M 329.07,29.6 L 546.67,29.6 C 555.5,29.6 562.67,36.76 562.67,45.6 L 562.67,167.2 C 562.67,176.04 555.5,183.2 546.67,183.2 L 329.07,183.2 C 320.23,183.2 313.07,176.04 313.07,167.2 L 313.07,45.6 C 313.07,36.76 320.23,29.6 329.07,29.6 Z M 329.07,29.6" />
<path stroke="rgb(68, 68, 68)" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="4" fill="none" d="M 329.07,29.6 L 546.67,29.6 C 555.5,29.6 562.67,36.76 562.67,45.6 L 562.67,167.2 C 562.67,176.04 555.5,183.2 546.67,183.2 L 329.07,183.2 C 320.23,183.2 313.07,176.04 313.07,167.2 L 313.07,45.6 C 313.07,36.76 320.23,29.6 329.07,29.6 Z M 329.07,29.6" />
<g id="group5">
<path stroke="rgb(193, 193, 193)" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="4" fill="none" d="M 313.07,58.4 L 322.67,48.8" />
<path stroke="rgb(193, 193, 193)" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="4" fill="none" d="M 313.07,68 L 332.27,48.8" />
<path stroke="rgb(193, 193, 193)" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="4" fill="none" d="M 313.07,77.6 L 341.87,48.8" />
<path stroke="rgb(193, 193, 193)" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="4" fill="none" d="M 313.07,87.2 L 351.47,48.8" />
<path stroke="rgb(193, 193, 193)" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="4" fill="none" d="M 533.87,87.2 L 562.67,58.4" />
<path stroke="rgb(193, 193, 193)" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="4" fill="none" d="M 543.47,87.2 L 562.67,68" />
<path stroke="rgb(193, 193, 193)" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="4" fill="none" d="M 553.07,87.2 L 562.67,77.6" />
<path stroke="rgb(193, 193, 193)" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="4" fill="none" d="M 322.67,87.2 L 361.07,48.8" />
<path stroke="rgb(193, 193, 193)" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="4" fill="none" d="M 332.27,87.2 L 370.67,48.8" />
<path stroke="rgb(193, 193, 193)" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="4" fill="none" d="M 341.87,87.2 L 380.27,48.8" />
<path stroke="rgb(193, 193, 193)" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="4" fill="none" d="M 351.47,87.2 L 389.87,48.8" />
<path stroke="rgb(193, 193, 193)" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="4" fill="none" d="M 361.07,87.2 L 399.47,48.8" />
<path stroke="rgb(193, 193, 193)" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="4" fill="none" d="M 370.67,87.2 L 409.07,48.8" />
<path stroke="rgb(193, 193, 193)" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="4" fill="none" d="M 380.27,87.2 L 418.67,48.8" />
<path stroke="rgb(193, 193, 193)" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="4" fill="none" d="M 389.87,87.2 L 428.27,48.8" />
<path stroke="rgb(193, 193, 193)" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="4" fill="none" d="M 399.47,87.2 L 437.87,48.8" />
<path stroke="rgb(193, 193, 193)" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="4" fill="none" d="M 409.07,87.2 L 447.47,48.8" />
<path stroke="rgb(193, 193, 193)" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="4" fill="none" d="M 418.67,87.2 L 457.07,48.8" />
<path stroke="rgb(193, 193, 193)" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="4" fill="none" d="M 428.27,87.2 L 466.67,48.8" />
<path stroke="rgb(193, 193, 193)" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="4" fill="none" d="M 437.87,87.2 L 476.27,48.8" />
<path stroke="rgb(193, 193, 193)" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="4" fill="none" d="M 447.47,87.2 L 485.87,48.8" />
<path stroke="rgb(193, 193, 193)" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="4" fill="none" d="M 457.07,87.2 L 495.47,48.8" />
<path stroke="rgb(193, 193, 193)" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="4" fill="none" d="M 466.67,87.2 L 505.07,48.8" />
<path stroke="rgb(193, 193, 193)" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="4" fill="none" d="M 476.27,87.2 L 514.67,48.8" />
<path stroke="rgb(193, 193, 193)" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="4" fill="none" d="M 485.87,87.2 L 524.27,48.8" />
<path stroke="rgb(193, 193, 193)" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="4" fill="none" d="M 495.47,87.2 L 533.87,48.8" />
<path stroke="rgb(193, 193, 193)" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="4" fill="none" d="M 505.07,87.2 L 543.47,48.8" />
<path stroke="rgb(193, 193, 193)" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="4" fill="none" d="M 514.67,87.2 L 553.07,48.8" />
<path stroke="rgb(193, 193, 193)" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="4" fill="none" d="M 524.27,87.2 L 562.67,48.8" />
</g>
<path stroke="rgb(68, 68, 68)" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="4" fill="none" d="M 313.07,48.8 L 562.67,48.8 562.67,87.2 313.07,87.2 313.07,48.8 Z M 313.07,48.8" />
<g id="group">
<path stroke="rgb(193, 193, 193)" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="4" fill="none" d="M 313.07,96.8 L 322.67,87.2" />
<path stroke="rgb(193, 193, 193)" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="4" fill="none" d="M 313.07,106.4 L 332.27,87.2" />
<path stroke="rgb(193, 193, 193)" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="4" fill="none" d="M 313.07,116 L 341.87,87.2" />
<path stroke="rgb(193, 193, 193)" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="4" fill="none" d="M 313.07,125.6 L 351.47,87.2" />
<path stroke="rgb(193, 193, 193)" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="4" fill="none" d="M 533.87,125.6 L 562.67,96.8" />
<path stroke="rgb(193, 193, 193)" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="4" fill="none" d="M 543.47,125.6 L 562.67,106.4" />
<path stroke="rgb(193, 193, 193)" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="4" fill="none" d="M 553.07,125.6 L 562.67,116" />
<path stroke="rgb(193, 193, 193)" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="4" fill="none" d="M 322.67,125.6 L 361.07,87.2" />
<path stroke="rgb(193, 193, 193)" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="4" fill="none" d="M 332.27,125.6 L 370.67,87.2" />
<path stroke="rgb(193, 193, 193)" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="4" fill="none" d="M 341.87,125.6 L 380.27,87.2" />
<path stroke="rgb(193, 193, 193)" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="4" fill="none" d="M 351.47,125.6 L 389.87,87.2" />
<path stroke="rgb(193, 193, 193)" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="4" fill="none" d="M 361.07,125.6 L 399.47,87.2" />
<path stroke="rgb(193, 193, 193)" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="4" fill="none" d="M 370.67,125.6 L 409.07,87.2" />
<path stroke="rgb(193, 193, 193)" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="4" fill="none" d="M 380.27,125.6 L 418.67,87.2" />
<path stroke="rgb(193, 193, 193)" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="4" fill="none" d="M 389.87,125.6 L 428.27,87.2" />
<path stroke="rgb(193, 193, 193)" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="4" fill="none" d="M 399.47,125.6 L 437.87,87.2" />
<path stroke="rgb(193, 193, 193)" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="4" fill="none" d="M 409.07,125.6 L 447.47,87.2" />
<path stroke="rgb(193, 193, 193)" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="4" fill="none" d="M 418.67,125.6 L 457.07,87.2" />
<path stroke="rgb(193, 193, 193)" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="4" fill="none" d="M 428.27,125.6 L 466.67,87.2" />
<path stroke="rgb(193, 193, 193)" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="4" fill="none" d="M 437.87,125.6 L 476.27,87.2" />
<path stroke="rgb(193, 193, 193)" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="4" fill="none" d="M 447.47,125.6 L 485.87,87.2" />
<path stroke="rgb(193, 193, 193)" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="4" fill="none" d="M 457.07,125.6 L 495.47,87.2" />
<path stroke="rgb(193, 193, 193)" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="4" fill="none" d="M 466.67,125.6 L 505.07,87.2" />
<path stroke="rgb(193, 193, 193)" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="4" fill="none" d="M 476.27,125.6 L 514.67,87.2" />
<path stroke="rgb(193, 193, 193)" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="4" fill="none" d="M 485.87,125.6 L 524.27,87.2" />
<path stroke="rgb(193, 193, 193)" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="4" fill="none" d="M 495.47,125.6 L 533.87,87.2" />
<path stroke="rgb(193, 193, 193)" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="4" fill="none" d="M 505.07,125.6 L 543.47,87.2" />
<path stroke="rgb(193, 193, 193)" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="4" fill="none" d="M 514.67,125.6 L 553.07,87.2" />
<path stroke="rgb(193, 193, 193)" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="4" fill="none" d="M 524.27,125.6 L 562.67,87.2" />
</g>
<path stroke="rgb(68, 68, 68)" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="4" fill="none" d="M 313.07,87.2 L 562.67,87.2 562.67,125.6 313.07,125.6 313.07,87.2 Z M 313.07,87.2" />
<path stroke="none" fill="rgb(255, 255, 255)" d="M 399.47,125.6 L 553.07,125.6 553.07,164 399.47,164 399.47,125.6 Z M 399.47,125.6" />
<path stroke="rgb(68, 68, 68)" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="4" fill="none" d="M 313.07,125.6 L 562.67,125.6 562.67,164 313.07,164 313.07,125.6 Z M 313.07,125.6" />
<path stroke="none" fill="rgb(255, 255, 255)" filter="url(#shadow-outer)" d="M 329.07,221.6 L 546.67,221.6 C 555.5,221.6 562.67,228.76 562.67,237.6 L 562.67,397.6 C 562.67,406.44 555.5,413.6 546.67,413.6 L 329.07,413.6 C 320.23,413.6 313.07,406.44 313.07,397.6 L 313.07,237.6 C 313.07,228.76 320.23,221.6 329.07,221.6 Z M 329.07,221.6" />
<path stroke="rgb(68, 68, 68)" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="4" fill="none" d="M 329.07,221.6 L 546.67,221.6 C 555.5,221.6 562.67,228.76 562.67,237.6 L 562.67,397.6 C 562.67,406.44 555.5,413.6 546.67,413.6 L 329.07,413.6 C 320.23,413.6 313.07,406.44 313.07,397.6 L 313.07,237.6 C 313.07,228.76 320.23,221.6 329.07,221.6 Z M 329.07,221.6" />
<path stroke="none" fill="rgb(255, 255, 255)" d="M 389.87,240.8 L 553.07,240.8 553.07,279.2 389.87,279.2 389.87,240.8 Z M 389.87,240.8" />
<path stroke="none" fill="rgb(255, 255, 255)" d="M 389.87,279.2 L 553.07,279.2 553.07,317.6 389.87,317.6 389.87,279.2 Z M 389.87,279.2" />
<path stroke="none" fill="rgb(255, 255, 255)" d="M 389.87,356 L 553.07,356 553.07,394.4 389.87,394.4 389.87,356 Z M 389.87,356" />
<path stroke="none" fill="rgb(255, 255, 255)" d="M 389.87,356 L 553.07,356 553.07,394.4 389.87,394.4 389.87,356 Z M 389.87,356" />
<path stroke="rgb(68, 68, 68)" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="4" fill="none" d="M 313.07,279.2 L 562.67,279.2 562.67,317.6 313.07,317.6 313.07,279.2 Z M 313.07,279.2" />
<path stroke="rgb(68, 68, 68)" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="4" fill="none" d="M 313.07,356 L 562.67,356 562.67,394.4 313.07,394.4 313.07,356 Z M 313.07,356" />
<path stroke="rgb(68, 68, 68)" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="4" fill="none" d="M 313.07,240.8 L 562.67,240.8 562.67,279.2 313.07,279.2 313.07,240.8 Z M 313.07,240.8" />
<path stroke="none" fill="rgb(255, 255, 255)" d="M 313.07,317.6 L 389.87,317.6 389.87,356 313.07,356 313.07,317.6 Z M 313.07,317.6" />
<g id="group4">
<path stroke="none" fill="rgb(255, 255, 255)" filter="url(#smallShadow-outer)" d="M 399.47,324.8 L 543.47,324.8 543.47,348.8 399.47,348.8 399.47,324.8 Z M 399.47,324.8" />
</g>
<path stroke="none" fill="rgb(255, 255, 255)" d="M 399.47,324.8 L 476.27,324.8 476.27,348.8 399.47,348.8 399.47,324.8 Z M 399.47,324.8" />
<path stroke="rgb(68, 68, 68)" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="4" fill="none" d="M 399.47,324.8 L 476.27,324.8 476.27,348.8 399.47,348.8 399.47,324.8 Z M 399.47,324.8" />
<path stroke="none" fill="rgb(255, 255, 255)" d="M 476.27,324.8 L 543.47,324.8 543.47,348.8 476.27,348.8 476.27,324.8 Z M 476.27,324.8" />
<path stroke="rgb(68, 68, 68)" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="4" fill="none" d="M 476.27,324.8 L 543.47,324.8 543.47,348.8 476.27,348.8 476.27,324.8 Z M 476.27,324.8" />
<path stroke="rgb(68, 68, 68)" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="4" fill="none" d="M 313.07,317.6 L 562.67,317.6 562.67,356 313.07,356 313.07,317.6 Z M 313.07,317.6" />
<text fill="rgb(68, 68, 68)" font-size="12" x="32" y="7">
<tspan x="32" y="19">order</tspan>
</text>
<text fill="rgb(68, 68, 68)" font-size="13.33" x="67.52" y="59">
<tspan x="67.52" y="73">size:</tspan>
</text>
<rect stroke="none" fill="none" x="108.53" y="58.52" width="26.67" height="26.67" />
<text fill="rgb(68, 68, 68)" font-size="13.33" x="108.53" y="58.52">
<tspan x="108.53" y="72.52">10</tspan>
</text>
<text fill="rgb(68, 68, 68)" font-size="13.33" x="59.63" y="97">
<tspan x="59.63" y="111">crust:</tspan>
</text>
<rect stroke="none" fill="none" x="108.53" y="96.92" width="66.67" height="26.67" />
<text fill="rgb(68, 68, 68)" font-size="13.33" x="108.53" y="96.92">
<tspan x="108.53" y="110.92">“thin”</tspan>
</text>
<text fill="rgb(68, 68, 68)" font-size="13.33" x="35.12" y="135">
<tspan x="35.12" y="149">toppings:</tspan>
</text>
<text fill="rgb(68, 68, 68)" font-size="12" x="113.59" y="137">
<tspan x="113.59" y="149">“pepperoni”</tspan>
</text>
<text fill="rgb(68, 68, 68)" font-size="12" x="193.17" y="137">
<tspan x="193.17" y="149">“sausage”</tspan>
</text>
<text fill="rgb(68, 68, 68)" font-size="12" x="320" y="7">
<tspan x="320" y="19">standard</tspan>
</text>
<text fill="rgb(68, 68, 68)" font-size="13.33" x="355.52" y="59">
<tspan x="355.52" y="73">size:</tspan>
</text>
<rect stroke="none" fill="none" x="406.13" y="58.52" width="26.67" height="26.67" />
<text fill="rgb(68, 68, 68)" font-size="13.33" x="406.13" y="58.52">
<tspan x="406.13" y="72.52">12</tspan>
</text>
<text fill="rgb(68, 68, 68)" font-size="13.33" x="347.63" y="97">
<tspan x="347.63" y="111">crust:</tspan>
</text>
<text fill="rgb(68, 68, 68)" font-size="13.33" x="406" y="97">
<tspan x="406" y="111">“regular”</tspan>
</text>
<rect stroke="none" fill="none" x="406.13" y="135.32" width="53.33" height="26.67" />
<text fill="rgb(68, 68, 68)" font-size="13.33" x="406.13" y="135.32">
<tspan x="406.13" y="149.32">true</tspan>
</text>
<text fill="rgb(68, 68, 68)" font-size="12" x="185" y="285">
<tspan x="185" y="297">_.defaults(</tspan>
</text>
<rect stroke="none" fill="none" x="197.33" y="301.47" width="72" height="24" />
<text fill="rgb(68, 68, 68)" font-size="12" x="197.33" y="301.47">
<tspan x="197.33" y="313.47">order,</tspan>
</text>
<text fill="rgb(68, 68, 68)" font-size="12" x="197" y="317">
<tspan x="197" y="329">standard</tspan>
</text>
<rect stroke="none" fill="none" x="185.33" y="333.47" width="12" height="24" />
<text fill="rgb(68, 68, 68)" font-size="12" x="185.33" y="333.47">
<tspan x="185.33" y="345.47">)</tspan>
</text>
<rect stroke="none" fill="none" x="396.53" y="250.52" width="26.67" height="26.67" />
<text fill="rgb(68, 68, 68)" font-size="13.33" x="396.53" y="250.52">
<tspan x="396.53" y="264.52">10</tspan>
</text>
<rect stroke="none" fill="none" x="396.53" y="288.92" width="66.67" height="26.67" />
<text fill="rgb(68, 68, 68)" font-size="13.33" x="396.53" y="288.92">
<tspan x="396.53" y="302.92">“thin”</tspan>
</text>
<text fill="rgb(68, 68, 68)" font-size="13.33" x="323.12" y="327">
<tspan x="323.12" y="341">toppings:</tspan>
</text>
<text fill="rgb(68, 68, 68)" font-size="12" x="403.09" y="329">
<tspan x="403.09" y="341">“pepperoni”</tspan>
</text>
<text fill="rgb(68, 68, 68)" font-size="12" x="481.67" y="329">
<tspan x="481.67" y="341">“sausage”</tspan>
</text>
<rect stroke="none" fill="none" x="396.53" y="365.72" width="53.33" height="26.67" />
<text fill="rgb(68, 68, 68)" font-size="13.33" x="396.53" y="365.72">
<tspan x="396.53" y="379.72">true</tspan>
</text>
<text fill="rgb(68, 68, 68)" font-size="13.33" x="347.63" y="288">
<tspan x="347.63" y="302">crust:</tspan>
</text>
<text fill="rgb(68, 68, 68)" font-size="13.33" x="355.52" y="250">
<tspan x="355.52" y="264">size:</tspan>
</text>
<text fill="rgb(68, 68, 68)" font-size="13.33" x="335.07" y="366">
<tspan x="335.07" y="380">cheese:</tspan>
</text>
<text fill="rgb(68, 68, 68)" font-size="13.33" x="335.07" y="135">
<tspan x="335.07" y="149">cheese:</tspan>
</text>
</svg>
<figcaption>The defaults() function adds missing properties to an object.</figcaption>
</figure>

It's important to note that both `extend()` and `defaults()` modify the original object directly; they do not make a copy of that object and return the copy. Consider, for example, the following

``` {.javascript}
> var order = { size: 10, crust: "thin", 
  toppings: ["pepperoni","sausage"] };
> var standard = { size: 12, crust: "regular", cheese: true }
> var pizza = _.extend(standard, order)
  { size: 10, crust: "thin", cheese: true, 
  toppings: ["pepperoni","sausage"] };
```

This code sets the `pizza` variable as you would expect, _but it also sets the `standard` variable to that same object_. More specifically, the code modifies `standard` with the properties from `order`, and then it sets a new variable `pizza` equal to `standard`. The modification of `standard` is probably not intended. If you need to use either `extend()` or `defaults()` in a way that does not modify input parameters, start with an empty object. We can rewrite the code above to avoid modifying `standard`.

``` {.javascript}
> var order = { size: 10, crust: "thin", 
  toppings: ["pepperoni","sausage"] };
> var standard = { size: 12, crust: "regular", cheese: true }
> var pizza = _.extend({}, standard, order)
  { size: 10, crust: "thin", cheese: true, 
  toppings: ["pepperoni","sausage"] };
```
