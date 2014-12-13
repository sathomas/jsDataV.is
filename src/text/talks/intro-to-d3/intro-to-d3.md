# Introducing D3.js

---

## D3 is Not a Charting Library

```javascript
$('#container').highcharts({
  title: {  text: 'Monthly Average Temperature', x: -20 },
  subtitle: { text: 'Source: WorldClimate.com', x: -20 },
  xAxis: { categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', //…
  yAxis: { title: { text: 'Temperature (°C)' },
       plotLines: [{value: 0, width: 1, color: '#808080'}] },
  legend: { layout: 'vertical', align: 'right', 
        verticalAlign: 'middle', borderWidth: 0 },
  series: [{ name: 'Tokyo',  data: [ 7.0, 6.9, 9.5, 14.5, //…
       { name: 'New York', data: [-0.2, 0.8, 5.7, 11.3, //…
       { name: 'Berlin',   data: [-0.9, 0.6, 3.5,  8.4, //…
       { name: 'London',   data: [ 3.9, 4.2, 5.7,  8.5, //…
});
```

---

## Where One Statement = A Chart

<svg width="592px" height="418px" viewBox="0 0 592 418" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="position:relative;left:124px;">
<g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
<g transform="translate(22.000000, 28.000000)">
<path d="M42,53.5 L460,53.5 M42,97.5 L460,97.5 M42,141.5 L460,141.5 M42,184.5 L460,184.5 M42,227.5 L460,227.5 M42,270.5 L460,270.5 M42,314.5 L460,314.5 M42,357.5 L460,357.5" stroke="#B3B3B3"></path>
<path d="M111.5,357 L111.5,367 M146.5,357 L146.5,367 M180.5,357 L180.5,367 M215.5,357 L215.5,367 M250.5,357 L250.5,367 M285.5,357 L285.5,367 M320.5,357 L320.5,367 M355.5,357 L355.5,367 M389.5,357 L389.5,367 M424.5,357 L424.5,367 M459.5,357 L459.5,367 M76.5,357 L76.5,367 M41.5,357 L41.5,367 M42,357.5 L460,357.5" stroke="#B3C5D9"></path>
<g transform="translate(55.000000, 80.000000)">
<path d="M4.4,173.1 L39.3,174 L74.1,151.5 L108.9,108.2 L143.8,76.2 L178.6,47.6 L213.4,15.6 L248.3,4.3 L283.1,32 L317.9,75.3 L352.8,113.4 L387.6,150.6" stroke="#CA0000" stroke-width="2"></path>
<path d="M387,146.6 C392.3,146.6 392.3,154.6 387,154.6 C381.7,154.6 381.7,146.6 387,146.6 L387,146.6 Z M352,109.4 C357.3,109.4 357.3,117.4 352,117.4 C346.7,117.4 346.7,109.4 352,109.4 L352,109.4 Z M317,71.3 C322.3,71.3 322.3,79.3 317,79.3 C311.7,79.3 311.7,71.3 317,71.3 L317,71.3 Z M283,28 C288.3,28 288.3,36 283,36 C277.7,36 277.7,28 283,28 L283,28 Z M248,0.3 C253.3,0.3 253.3,8.3 248,8.3 C242.7,8.3 242.7,0.3 248,0.3 L248,0.3 Z M213,11.6 C218.3,11.6 218.3,19.6 213,19.6 C207.7,19.6 207.7,11.6 213,11.6 L213,11.6 Z M178,43.6 C183.3,43.6 183.3,51.6 178,51.6 C172.7,51.6 172.7,43.6 178,43.6 L178,43.6 Z M143,72.2 C148.3,72.2 148.3,80.2 143,80.2 C137.7,80.2 137.7,72.2 143,72.2 L143,72.2 Z M108,104.2 C113.3,104.2 113.3,112.2 108,112.2 C102.7,112.2 102.7,104.2 108,104.2 L108,104.2 Z M74,147.5 C79.3,147.5 79.3,155.5 74,155.5 C68.7,155.5 68.7,147.5 74,147.5 L74,147.5 Z M39,170 C44.3,170 44.3,178 39,178 C33.7,178 33.7,170 39,170 L39,170 Z M4,169.1 C9.3,169.1 9.3,177.1 4,177.1 C-1.3,177.1 -1.3,169.1 4,169.1 L4,169.1 Z" fill="#CA0000"></path>
<path d="M4.4,235.4 L39.3,226.8 L74.1,184.4 L108.9,135.9 L143.8,86.5 L178.6,43.3 L213.4,19 L248.3,25.1 L283.1,59.7 L317.9,111.6 L352.8,159.3 L387.6,212.1" stroke="#A2005C" stroke-width="2"></path>
<path d="M387,208.1 L391,212.1 L387,216.1 L383,212.1 L387,208.1 L387,208.1 Z M352,155.3 L356,159.3 L352,163.3 L348,159.3 L352,155.3 L352,155.3 Z M317,107.6 L321,111.6 L317,115.6 L313,111.6 L317,107.6 L317,107.6 Z M283,55.7 L287,59.7 L283,63.7 L279,59.7 L283,55.7 L283,55.7 Z M248,21.1 L252,25.1 L248,29.1 L244,25.1 L248,21.1 L248,21.1 Z M213,15 L217,19 L213,23 L209,19 L213,15 L213,15 Z M178,39.3 L182,43.3 L178,47.3 L174,43.3 L178,39.3 L178,39.3 Z M143,82.5 L147,86.5 L143,90.5 L139,86.5 L143,82.5 L143,82.5 Z M108,131.9 L112,135.9 L108,139.9 L104,135.9 L108,131.9 L108,131.9 Z M74,180.4 L78,184.4 L74,188.4 L70,184.4 L74,180.4 L74,180.4 Z M39,222.8 L43,226.8 L39,230.8 L35,226.8 L39,222.8 L39,222.8 Z M4,231.4 L8,235.4 L4,239.4 L0,235.4 L4,231.4 L4,231.4 Z" fill="#A2005C"></path>
<path d="M4.4,241.5 L39.3,228.5 L74.1,203.4 L108.9,161 L143.8,116.8 L178.6,86.5 L213.4,72.7 L248.3,78.8 L283.1,109.9 L317.9,155.8 L352.8,200 L387.6,225.1" stroke="#7EBD00" stroke-width="2"></path>
<path d="M383,221.1 L391,221.1 L391,229.1 L383,229.1 L383,221.1 L383,221.1 Z M348,196 L356,196 L356,204 L348,204 L348,196 L348,196 Z M313,151.8 L321,151.8 L321,159.8 L313,159.8 L313,151.8 L313,151.8 Z M279,105.9 L287,105.9 L287,113.9 L279,113.9 L279,105.9 L279,105.9 Z M244,74.8 L252,74.8 L252,82.8 L244,82.8 L244,74.8 L244,74.8 Z M209,68.7 L217,68.7 L217,76.7 L209,76.7 L209,68.7 L209,68.7 Z M174,82.5 L182,82.5 L182,90.5 L174,90.5 L174,82.5 L174,82.5 Z M139,112.8 L147,112.8 L147,120.8 L139,120.8 L139,112.8 L139,112.8 Z M104,157 L112,157 L112,165 L104,165 L104,157 L104,157 Z M70,199.4 L78,199.4 L78,207.4 L70,207.4 L70,199.4 L70,199.4 Z M35,224.5 L43,224.5 L43,232.5 L35,232.5 L35,224.5 L35,224.5 Z M0,237.5 L8,237.5 L8,245.5 L0,245.5 L0,237.5 L0,237.5 Z" fill="#7EBD00"></path>
<path d="M4.4,200 L39.3,197.4 L74.1,184.4 L108.9,160.1 L143.8,130.7 L178.6,102.1 L213.4,86.5 L248.3,90 L283.1,110.8 L317.9,144.5 L352.8,176.6 L387.6,192.2" stroke="#007979" stroke-width="2"></path>
<path d="M387,188.2 L391,196.2 L383,196.2 L387,188.2 L387,188.2 Z M352,172.6 L356,180.6 L348,180.6 L352,172.6 L352,172.6 Z M317,140.5 L321,148.5 L313,148.5 L317,140.5 L317,140.5 Z M283,106.8 L287,114.8 L279,114.8 L283,106.8 L283,106.8 Z M248,86 L252,94 L244,94 L248,86 L248,86 Z M213,82.5 L217,90.5 L209,90.5 L213,82.5 L213,82.5 Z M178,98.1 L182,106.1 L174,106.1 L178,98.1 L178,98.1 Z M143,126.7 L147,134.7 L139,134.7 L143,126.7 L143,126.7 Z M108,156.1 L112,164.1 L104,164.1 L108,156.1 L108,156.1 Z M74,180.4 L78,188.4 L70,188.4 L74,180.4 L74,180.4 Z M39,193.4 L43,201.4 L35,201.4 L39,193.4 L39,193.4 Z M4,196 L8,204 L0,204 L4,196 L4,196 Z" fill="#007979"></path>
</g>
<g transform="translate(488.000000, 167.000000)">
<g>
<path d="M0,8 L16,8 L0,8 Z M8,4 C13.3,4 13.3,12 8,12 C2.7,12 2.7,4 8,4 L8,4 Z" stroke="#CA0000" stroke-width="2"></path>
<text fill="#000000" font-size="12"><tspan x="21" y="11.99">Tokyo</tspan></text>
</g>
<g transform="translate(0.000000, 15.000000)">
<path d="M0,7 L16,7 L0,7 Z M8,3 L12,7 L8,11 L4,7 L8,3 L8,3 Z" stroke="#A2005C" stroke-width="2"></path>
<text fill="#262626" font-size="12"><tspan x="21" y="11" fill="#000000">New York</tspan></text>
</g>
<g transform="translate(0.000000, 29.000000)">
<path d="M0,7 L16,7 L0,7 Z M4,3 L12,3 L12,11 L4,11 L4,3 L4,3 Z" stroke="#7EBD00" stroke-width="2"></path>
<text fill="#262626" font-size="12"><tspan x="21" y="11" fill="#000000">Berlin</tspan></text>
</g>
<g transform="translate(0.000000, 43.000000)">
<path d="M0,7 L16,7 L0,7 Z M8,3 L12,11 L4,11 L8,3 L8,3 Z" stroke="#007979" stroke-width="2"></path>
<text fill="#262626" font-size="12" ><tspan x="21" y="11" fill="#000000">London</tspan></text>
</g>
</g>
<g transform="translate(51.000000, 367.000000)" font-size="11">
<text><tspan x="0.03" y="10" fill="#000000">Jan</tspan></text>
<text><tspan x="34.32" y="10" fill="#000000">Feb</tspan></text>
<text><tspan x="69.13" y="10" fill="#000000">Mar</tspan></text>
<text><tspan x="104.84" y="10" fill="#000000">Apr</tspan></text>
<text><tspan x="137.91" y="10" fill="#000000">May</tspan></text>
<text><tspan x="174.23" y="10" fill="#000000">Jun</tspan></text>
<text><tspan x="210.87" y="10" fill="#000000">Jul</tspan></text>
<text><tspan x="243.01" y="10" fill="#000000">Aug</tspan></text>
<text><tspan x="277.81" y="10" fill="#000000">Sep</tspan></text>
<text><tspan x="313.84" y="10" fill="#000000">Oct</tspan></text>
<text><tspan x="347.52" y="10" fill="#000000">Nov</tspan></text>
<text><tspan x="382.32" y="10" fill="#000000">Dec</tspan></text>
</g>
<g transform="translate(23.000000, 47.000000)" font-size="11">
<text><tspan x="3.22" y="313.5" fill="#000000">-5</tspan></text>
<text><tspan x="6.88" y="270" fill="#000000">0</tspan></text>
<text><tspan x="6.88" y="227" fill="#000000">5</tspan></text>
<text><tspan x="0.76" y="183.7" fill="#000000">10</tspan></text>
<text><tspan x="0.76" y="140.4" fill="#000000">15</tspan></text>
<text><tspan x="0.76" y="97.1" fill="#000000">20</tspan></text>
<text><tspan x="0.76" y="53.8" fill="#000000">25</tspan></text>
<text><tspan x="0.76" y="10.5" fill="#000000">30</tspan></text>
</g>
<g>
<text transform="translate(7.500000, 201.480000) rotate(-90.000000) translate(-7.500000, -201.480000)" font-size="12"><tspan x="-39" y="205.48" fill="#000000">Temperature (°C)</tspan></text>
<text font-size="18"><tspan x="130.75" y="18" fill="#000000">Monthly Average Temperature</tspan></text>
<text font-size="12"><tspan x="179.75" y="40" fill="#000000">Source: WorldClimate.com</tspan></text>
</g>
</g>
</g>
</svg>

---

## Charting Library - Buying a Home {.photoslide}

![](../../img/ForSale.jpg)

---

## D3 - Buying a Home at Home Depot {.photoslide}

![](../../img/HomeDepot.jpg)

---

## D3 Philosophy

* D3 is not really a "visualization library"; it does not draw visualizations
* D3 = "Data Driven Documents"; it primarily associates data with DOM elements and manages the results
* D3 also provides tools that you can use to draw visualizations

---

## D3 Components

> * Core: selections, transitions, data, localization, colors,
> * Scales: convert between data and visual encodings
> * <span class="lgcp">SVG</span>: utilities for creating Scalable Vector Graphics
> * Time: parse/format times, compute calendar intervals,
> * Layouts: derive data for positioning elements
> * Geography: project spherical coord., lat/long math
> * Geometry: utilities for 2<span class="smcp">D</span> geometry, e.g. Voronoi,
> * Behaviors: reusable interaction behaviors

---

## Let's Build a Chart

1. Start with basic <span class="smcp">HTML</span> scaffolding
2. Collect the data in <span class="smcp">JSON</span> format
3. Retrieve the data via <span class="smcp">AJAX</span>
4. Create a stage for the graph in the <span class="smcp">DOM</span>
5. Define scales and axes
6. Draw the data using <span class="smcp">SVG</span>


---

## Step 1: HTML Scaffolding

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset='utf-8'>
  <title>Basic line demo</title>
</head>
<body>
  <script src='http://d3js.org/d3.v3.min.js'></script>
</body>
</html>
```

---

## The D3 Version

<svg width="600" height="380" style="top: 16px; position: relative; left: 124px;"><g transform="translate(50,60)"><g class="x axis" transform="translate(0,290)"><g class="tick" transform="translate(17.972602739726028,0)" style="opacity: 1;"><line y2="0" x2="0" fill="none" stroke="#d0d0d0" stroke-width="1" shape-rendering="crispEdges"></line><text dy=".71em" y="10" x="0" font-size="14" style="text-anchor: middle;">Jan</text></g><g class="tick" transform="translate(52.794520547945204,0)" style="opacity: 1;"><line y2="0" x2="0" fill="none" stroke="#d0d0d0" stroke-width="1" shape-rendering="crispEdges"></line><text dy=".71em" y="10" x="0" font-size="14" style="text-anchor: middle;">Feb</text></g><g class="tick" transform="translate(84.24657534246575,0)" style="opacity: 1;"><line y2="0" x2="0" fill="none" stroke="#d0d0d0" stroke-width="1" shape-rendering="crispEdges"></line><text dy=".71em" y="10" x="0" font-size="14" style="text-anchor: middle;">Mar</text></g><g class="tick" transform="translate(119.0216894977169,0)" style="opacity: 1;"><line y2="0" x2="0" fill="none" stroke="#d0d0d0" stroke-width="1" shape-rendering="crispEdges"></line><text dy=".71em" y="10" x="0" font-size="14" style="text-anchor: middle;">Apr</text></g><g class="tick" transform="translate(152.7203196347032,0)" style="opacity: 1;"><line y2="0" x2="0" fill="none" stroke="#d0d0d0" stroke-width="1" shape-rendering="crispEdges"></line><text dy=".71em" y="10" x="0" font-size="14" style="text-anchor: middle;">May</text></g><g class="tick" transform="translate(187.54223744292239,0)" style="opacity: 1;"><line y2="0" x2="0" fill="none" stroke="#d0d0d0" stroke-width="1" shape-rendering="crispEdges"></line><text dy=".71em" y="10" x="0" font-size="14" style="text-anchor: middle;">Jun</text></g><g class="tick" transform="translate(221.24086757990867,0)" style="opacity: 1;"><line y2="0" x2="0" fill="none" stroke="#d0d0d0" stroke-width="1" shape-rendering="crispEdges"></line><text dy=".71em" y="10" x="0" font-size="14" style="text-anchor: middle;">Jul</text></g><g class="tick" transform="translate(256.06278538812785,0)" style="opacity: 1;"><line y2="0" x2="0" fill="none" stroke="#d0d0d0" stroke-width="1" shape-rendering="crispEdges"></line><text dy=".71em" y="10" x="0" font-size="14" style="text-anchor: middle;">Aug</text></g><g class="tick" transform="translate(290.884703196347,0)" style="opacity: 1;"><line y2="0" x2="0" fill="none" stroke="#d0d0d0" stroke-width="1" shape-rendering="crispEdges"></line><text dy=".71em" y="10" x="0" font-size="14" style="text-anchor: middle;">Sep</text></g><g class="tick" transform="translate(324.5833333333333,0)" style="opacity: 1;"><line y2="0" x2="0" fill="none" stroke="#d0d0d0" stroke-width="1" shape-rendering="crispEdges"></line><text dy=".71em" y="10" x="0" font-size="14" style="text-anchor: middle;">Oct</text></g><g class="tick" transform="translate(359.40525114155247,0)" style="opacity: 1;"><line y2="0" x2="0" fill="none" stroke="#d0d0d0" stroke-width="1" shape-rendering="crispEdges"></line><text dy=".71em" y="10" x="0" font-size="14" style="text-anchor: middle;">Nov</text></g><g class="tick" transform="translate(393.1506849315068,0)" style="opacity: 1;"><line y2="0" x2="0" fill="none" stroke="#d0d0d0" stroke-width="1" shape-rendering="crispEdges"></line><text dy=".71em" y="10" x="0" font-size="14" style="text-anchor: middle;">Dec</text></g><path class="domain" d="M0,0V0H410V0" fill="none" stroke="#bbbbbb" stroke-width="2px" shape-rendering="crispEdges"></path></g><g class="y axis"><g class="tick" transform="translate(0,270.6666666666667)" style="opacity: 1;"><line x2="410" y2="0" fill="none" stroke="#d0d0d0" stroke-width="1" shape-rendering="crispEdges"></line><text dy=".32em" x="-10" y="0" font-size="14" style="text-anchor: end;">0</text></g><g class="tick" transform="translate(0,222.33333333333331)" style="opacity: 1;"><line x2="410" y2="0" fill="none" stroke="#d0d0d0" stroke-width="1" shape-rendering="crispEdges"></line><text dy=".32em" x="-10" y="0" font-size="14" style="text-anchor: end;">5</text></g><g class="tick" transform="translate(0,174)" style="opacity: 1;"><line x2="410" y2="0" fill="none" stroke="#d0d0d0" stroke-width="1" shape-rendering="crispEdges"></line><text dy=".32em" x="-10" y="0" font-size="14" style="text-anchor: end;">10</text></g><g class="tick" transform="translate(0,125.66666666666667)" style="opacity: 1;"><line x2="410" y2="0" fill="none" stroke="#d0d0d0" stroke-width="1" shape-rendering="crispEdges"></line><text dy=".32em" x="-10" y="0" font-size="14" style="text-anchor: end;">15</text></g><g class="tick" transform="translate(0,77.33333333333334)" style="opacity: 1;"><line x2="410" y2="0" fill="none" stroke="#d0d0d0" stroke-width="1" shape-rendering="crispEdges"></line><text dy=".32em" x="-10" y="0" font-size="14" style="text-anchor: end;">20</text></g><g class="tick" transform="translate(0,28.999999999999993)" style="opacity: 1;"><line x2="410" y2="0" fill="none" stroke="#d0d0d0" stroke-width="1" shape-rendering="crispEdges"></line><text dy=".32em" x="-10" y="0" font-size="14" style="text-anchor: end;">25</text></g><path class="domain" d="M0,0H0V290H0" fill="none" stroke="#bbbbbb" stroke-width="2px" shape-rendering="crispEdges"></path><text transform="rotate(-90)" y="9" dy=".71em" text-anchor="end" font-size="14">Temperature (°C)</text></g><path class="point dataset-0" fill="#CA0000" stroke="#CA0000" d="M0,5.077706251929807A5.077706251929807,5.077706251929807 0 1,1 0,-5.077706251929807A5.077706251929807,5.077706251929807 0 1,1 0,5.077706251929807Z" transform="translate(17.972602739726028,203)"></path><path class="point dataset-0" fill="#CA0000" stroke="#CA0000" d="M0,5.077706251929807A5.077706251929807,5.077706251929807 0 1,1 0,-5.077706251929807A5.077706251929807,5.077706251929807 0 1,1 0,5.077706251929807Z" transform="translate(52.794520547945204,203.96666666666667)"></path><path class="point dataset-0" fill="#CA0000" stroke="#CA0000" d="M0,5.077706251929807A5.077706251929807,5.077706251929807 0 1,1 0,-5.077706251929807A5.077706251929807,5.077706251929807 0 1,1 0,5.077706251929807Z" transform="translate(84.24657534246575,178.83333333333334)"></path><path class="point dataset-0" fill="#CA0000" stroke="#CA0000" d="M0,5.077706251929807A5.077706251929807,5.077706251929807 0 1,1 0,-5.077706251929807A5.077706251929807,5.077706251929807 0 1,1 0,5.077706251929807Z" transform="translate(119.0216894977169,130.5)"></path><path class="point dataset-0" fill="#CA0000" stroke="#CA0000" d="M0,5.077706251929807A5.077706251929807,5.077706251929807 0 1,1 0,-5.077706251929807A5.077706251929807,5.077706251929807 0 1,1 0,5.077706251929807Z" transform="translate(152.7203196347032,94.73333333333333)"></path><path class="point dataset-0" fill="#CA0000" stroke="#CA0000" d="M0,5.077706251929807A5.077706251929807,5.077706251929807 0 1,1 0,-5.077706251929807A5.077706251929807,5.077706251929807 0 1,1 0,5.077706251929807Z" transform="translate(187.54223744292239,62.833333333333336)"></path><path class="point dataset-0" fill="#CA0000" stroke="#CA0000" d="M0,5.077706251929807A5.077706251929807,5.077706251929807 0 1,1 0,-5.077706251929807A5.077706251929807,5.077706251929807 0 1,1 0,5.077706251929807Z" transform="translate(221.24086757990867,27.06666666666668)"></path><path class="point dataset-0" fill="#CA0000" stroke="#CA0000" d="M0,5.077706251929807A5.077706251929807,5.077706251929807 0 1,1 0,-5.077706251929807A5.077706251929807,5.077706251929807 0 1,1 0,5.077706251929807Z" transform="translate(256.06278538812785,14.500000000000012)"></path><path class="point dataset-0" fill="#CA0000" stroke="#CA0000" d="M0,5.077706251929807A5.077706251929807,5.077706251929807 0 1,1 0,-5.077706251929807A5.077706251929807,5.077706251929807 0 1,1 0,5.077706251929807Z" transform="translate(290.884703196347,45.43333333333332)"></path><path class="point dataset-0" fill="#CA0000" stroke="#CA0000" d="M0,5.077706251929807A5.077706251929807,5.077706251929807 0 1,1 0,-5.077706251929807A5.077706251929807,5.077706251929807 0 1,1 0,5.077706251929807Z" transform="translate(324.5833333333333,93.76666666666668)"></path><path class="point dataset-0" fill="#CA0000" stroke="#CA0000" d="M0,5.077706251929807A5.077706251929807,5.077706251929807 0 1,1 0,-5.077706251929807A5.077706251929807,5.077706251929807 0 1,1 0,5.077706251929807Z" transform="translate(359.40525114155247,136.29999999999998)"></path><path class="point dataset-0" fill="#CA0000" stroke="#CA0000" d="M0,5.077706251929807A5.077706251929807,5.077706251929807 0 1,1 0,-5.077706251929807A5.077706251929807,5.077706251929807 0 1,1 0,5.077706251929807Z" transform="translate(393.1506849315068,177.86666666666665)"></path><path class="line dataset-0" fill="none" stroke="#CA0000" stroke-width="2" d="M17.972602739726028,203L52.794520547945204,203.96666666666667L84.24657534246575,178.83333333333334L119.0216894977169,130.5L152.7203196347032,94.73333333333333L187.54223744292239,62.833333333333336L221.24086757990867,27.06666666666668L256.06278538812785,14.500000000000012L290.884703196347,45.43333333333332L324.5833333333333,93.76666666666668L359.40525114155247,136.29999999999998L393.1506849315068,177.86666666666665"></path><path class="point dataset-1" fill="#A2005C" stroke="#A2005C" d="M0,-8.375443731918898L4.835564693205938,0 0,8.375443731918898 -4.835564693205938,0Z" transform="translate(17.972602739726028,272.59999999999997)"></path><path class="point dataset-1" fill="#A2005C" stroke="#A2005C" d="M0,-8.375443731918898L4.835564693205938,0 0,8.375443731918898 -4.835564693205938,0Z" transform="translate(52.794520547945204,262.93333333333334)"></path><path class="point dataset-1" fill="#A2005C" stroke="#A2005C" d="M0,-8.375443731918898L4.835564693205938,0 0,8.375443731918898 -4.835564693205938,0Z" transform="translate(84.24657534246575,215.5666666666667)"></path><path class="point dataset-1" fill="#A2005C" stroke="#A2005C" d="M0,-8.375443731918898L4.835564693205938,0 0,8.375443731918898 -4.835564693205938,0Z" transform="translate(119.0216894977169,161.43333333333334)"></path><path class="point dataset-1" fill="#A2005C" stroke="#A2005C" d="M0,-8.375443731918898L4.835564693205938,0 0,8.375443731918898 -4.835564693205938,0Z" transform="translate(152.7203196347032,106.33333333333334)"></path><path class="point dataset-1" fill="#A2005C" stroke="#A2005C" d="M0,-8.375443731918898L4.835564693205938,0 0,8.375443731918898 -4.835564693205938,0Z" transform="translate(187.54223744292239,57.999999999999986)"></path><path class="point dataset-1" fill="#A2005C" stroke="#A2005C" d="M0,-8.375443731918898L4.835564693205938,0 0,8.375443731918898 -4.835564693205938,0Z" transform="translate(221.24086757990867,30.93333333333334)"></path><path class="point dataset-1" fill="#A2005C" stroke="#A2005C" d="M0,-8.375443731918898L4.835564693205938,0 0,8.375443731918898 -4.835564693205938,0Z" transform="translate(256.06278538812785,37.7)"></path><path class="point dataset-1" fill="#A2005C" stroke="#A2005C" d="M0,-8.375443731918898L4.835564693205938,0 0,8.375443731918898 -4.835564693205938,0Z" transform="translate(290.884703196347,76.36666666666666)"></path><path class="point dataset-1" fill="#A2005C" stroke="#A2005C" d="M0,-8.375443731918898L4.835564693205938,0 0,8.375443731918898 -4.835564693205938,0Z" transform="translate(324.5833333333333,134.36666666666665)"></path><path class="point dataset-1" fill="#A2005C" stroke="#A2005C" d="M0,-8.375443731918898L4.835564693205938,0 0,8.375443731918898 -4.835564693205938,0Z" transform="translate(359.40525114155247,187.53333333333336)"></path><path class="point dataset-1" fill="#A2005C" stroke="#A2005C" d="M0,-8.375443731918898L4.835564693205938,0 0,8.375443731918898 -4.835564693205938,0Z" transform="translate(393.1506849315068,246.5)"></path><path class="line dataset-1" fill="none" stroke="#A2005C" stroke-width="2" d="M17.972602739726028,272.59999999999997L52.794520547945204,262.93333333333334L84.24657534246575,215.5666666666667L119.0216894977169,161.43333333333334L152.7203196347032,106.33333333333334L187.54223744292239,57.999999999999986L221.24086757990867,30.93333333333334L256.06278538812785,37.7L290.884703196347,76.36666666666666L324.5833333333333,134.36666666666665L359.40525114155247,187.53333333333336L393.1506849315068,246.5"></path><path class="point dataset-2" fill="#7EBD00" stroke="#7EBD00" d="M-4.5,-4.5L4.5,-4.5 4.5,4.5 -4.5,4.5Z" transform="translate(17.972602739726028,279.3666666666667)"></path><path class="point dataset-2" fill="#7EBD00" stroke="#7EBD00" d="M-4.5,-4.5L4.5,-4.5 4.5,4.5 -4.5,4.5Z" transform="translate(52.794520547945204,264.8666666666667)"></path><path class="point dataset-2" fill="#7EBD00" stroke="#7EBD00" d="M-4.5,-4.5L4.5,-4.5 4.5,4.5 -4.5,4.5Z" transform="translate(84.24657534246575,236.83333333333334)"></path><path class="point dataset-2" fill="#7EBD00" stroke="#7EBD00" d="M-4.5,-4.5L4.5,-4.5 4.5,4.5 -4.5,4.5Z" transform="translate(119.0216894977169,189.46666666666667)"></path><path class="point dataset-2" fill="#7EBD00" stroke="#7EBD00" d="M-4.5,-4.5L4.5,-4.5 4.5,4.5 -4.5,4.5Z" transform="translate(152.7203196347032,140.16666666666666)"></path><path class="point dataset-2" fill="#7EBD00" stroke="#7EBD00" d="M-4.5,-4.5L4.5,-4.5 4.5,4.5 -4.5,4.5Z" transform="translate(187.54223744292239,106.33333333333334)"></path><path class="point dataset-2" fill="#7EBD00" stroke="#7EBD00" d="M-4.5,-4.5L4.5,-4.5 4.5,4.5 -4.5,4.5Z" transform="translate(221.24086757990867,90.86666666666665)"></path><path class="point dataset-2" fill="#7EBD00" stroke="#7EBD00" d="M-4.5,-4.5L4.5,-4.5 4.5,4.5 -4.5,4.5Z" transform="translate(256.06278538812785,97.63333333333334)"></path><path class="point dataset-2" fill="#7EBD00" stroke="#7EBD00" d="M-4.5,-4.5L4.5,-4.5 4.5,4.5 -4.5,4.5Z" transform="translate(290.884703196347,132.43333333333334)"></path><path class="point dataset-2" fill="#7EBD00" stroke="#7EBD00" d="M-4.5,-4.5L4.5,-4.5 4.5,4.5 -4.5,4.5Z" transform="translate(324.5833333333333,183.66666666666666)"></path><path class="point dataset-2" fill="#7EBD00" stroke="#7EBD00" d="M-4.5,-4.5L4.5,-4.5 4.5,4.5 -4.5,4.5Z" transform="translate(359.40525114155247,232.96666666666667)"></path><path class="point dataset-2" fill="#7EBD00" stroke="#7EBD00" d="M-4.5,-4.5L4.5,-4.5 4.5,4.5 -4.5,4.5Z" transform="translate(393.1506849315068,261)"></path><path class="line dataset-2" fill="none" stroke="#7EBD00" stroke-width="2" d="M17.972602739726028,279.3666666666667L52.794520547945204,264.8666666666667L84.24657534246575,236.83333333333334L119.0216894977169,189.46666666666667L152.7203196347032,140.16666666666666L187.54223744292239,106.33333333333334L221.24086757990867,90.86666666666665L256.06278538812785,97.63333333333334L290.884703196347,132.43333333333334L324.5833333333333,183.66666666666666L359.40525114155247,232.96666666666667L393.1506849315068,261"></path><path class="point dataset-3" fill="#007979" stroke="#007979" d="M0,-5.922333058286216L6.838521170864333,5.922333058286216 -6.838521170864333,5.922333058286216Z" transform="translate(17.972602739726028,232.96666666666667)"></path><path class="point dataset-3" fill="#007979" stroke="#007979" d="M0,-5.922333058286216L6.838521170864333,5.922333058286216 -6.838521170864333,5.922333058286216Z" transform="translate(52.794520547945204,230.06666666666666)"></path><path class="point dataset-3" fill="#007979" stroke="#007979" d="M0,-5.922333058286216L6.838521170864333,5.922333058286216 -6.838521170864333,5.922333058286216Z" transform="translate(84.24657534246575,215.5666666666667)"></path><path class="point dataset-3" fill="#007979" stroke="#007979" d="M0,-5.922333058286216L6.838521170864333,5.922333058286216 -6.838521170864333,5.922333058286216Z" transform="translate(119.0216894977169,188.5)"></path><path class="point dataset-3" fill="#007979" stroke="#007979" d="M0,-5.922333058286216L6.838521170864333,5.922333058286216 -6.838521170864333,5.922333058286216Z" transform="translate(152.7203196347032,155.63333333333333)"></path><path class="point dataset-3" fill="#007979" stroke="#007979" d="M0,-5.922333058286216L6.838521170864333,5.922333058286216 -6.838521170864333,5.922333058286216Z" transform="translate(187.54223744292239,123.73333333333332)"></path><path class="point dataset-3" fill="#007979" stroke="#007979" d="M0,-5.922333058286216L6.838521170864333,5.922333058286216 -6.838521170864333,5.922333058286216Z" transform="translate(221.24086757990867,106.33333333333334)"></path><path class="point dataset-3" fill="#007979" stroke="#007979" d="M0,-5.922333058286216L6.838521170864333,5.922333058286216 -6.838521170864333,5.922333058286216Z" transform="translate(256.06278538812785,110.2)"></path><path class="point dataset-3" fill="#007979" stroke="#007979" d="M0,-5.922333058286216L6.838521170864333,5.922333058286216 -6.838521170864333,5.922333058286216Z" transform="translate(290.884703196347,133.40000000000003)"></path><path class="point dataset-3" fill="#007979" stroke="#007979" d="M0,-5.922333058286216L6.838521170864333,5.922333058286216 -6.838521170864333,5.922333058286216Z" transform="translate(324.5833333333333,171.1)"></path><path class="point dataset-3" fill="#007979" stroke="#007979" d="M0,-5.922333058286216L6.838521170864333,5.922333058286216 -6.838521170864333,5.922333058286216Z" transform="translate(359.40525114155247,206.86666666666667)"></path><path class="point dataset-3" fill="#007979" stroke="#007979" d="M0,-5.922333058286216L6.838521170864333,5.922333058286216 -6.838521170864333,5.922333058286216Z" transform="translate(393.1506849315068,224.26666666666665)"></path><path class="line dataset-3" fill="none" stroke="#007979" stroke-width="2" d="M17.972602739726028,232.96666666666667L52.794520547945204,230.06666666666666L84.24657534246575,215.5666666666667L119.0216894977169,188.5L152.7203196347032,155.63333333333333L187.54223744292239,123.73333333333332L221.24086757990867,106.33333333333334L256.06278538812785,110.2L290.884703196347,133.40000000000003L324.5833333333333,171.1L359.40525114155247,206.86666666666667L393.1506849315068,224.26666666666665"></path></g><path class="point dataset-0" fill="#CA0000" stroke="#CA0000" d="M0,5.077706251929807A5.077706251929807,5.077706251929807 0 1,1 0,-5.077706251929807A5.077706251929807,5.077706251929807 0 1,1 0,5.077706251929807Z" transform="translate(500,159)"></path><line class="line dataset-0" stroke="#CA0000" stroke-width="2" x1="490" x2="510" y1="159" y2="159"></line><text transform="translate(520,165)" class="legend" font-size="15" text-anchor="left">Tokyo</text><path class="point dataset-1" fill="#A2005C" stroke="#A2005C" d="M0,-8.375443731918898L4.835564693205938,0 0,8.375443731918898 -4.835564693205938,0Z" transform="translate(500,179)"></path><line class="line dataset-1" stroke="#A2005C" stroke-width="2" x1="490" x2="510" y1="179" y2="179"></line><text transform="translate(520,185)" class="legend" font-size="15" text-anchor="left">New York</text><path class="point dataset-2" fill="#7EBD00" stroke="#7EBD00" d="M-4.5,-4.5L4.5,-4.5 4.5,4.5 -4.5,4.5Z" transform="translate(500,199)"></path><line class="line dataset-2" stroke="#7EBD00" stroke-width="2" x1="490" x2="510" y1="199" y2="199"></line><text transform="translate(520,205)" class="legend" font-size="15" text-anchor="left">Berlin</text><path class="point dataset-3" fill="#007979" stroke="#007979" d="M0,-5.922333058286216L6.838521170864333,5.922333058286216 -6.838521170864333,5.922333058286216Z" transform="translate(500,219)"></path><line class="line dataset-3" stroke="#007979" stroke-width="2" x1="490" x2="510" y1="219" y2="219"></line><text transform="translate(520,225)" class="legend" font-size="15" text-anchor="left">London</text><text transform="translate(275,20)" class="title" font-size="20" text-anchor="middle">Monthly Average Temperature</text><text transform="translate(275,48)" class="subtitle" font-size="15" text-anchor="middle">Source: WorldClimate.com</text></svg>

---

## D3 Requires Much More Code

<div class="codewrapper">
``` {.javascript .numberLines}
// Convenience functions that provide parameters for
// the chart. In most cases these could be defined as
// CSS rules, but for this particular implementation
// we're avoiding CSS so that we can easily extract
// the SVG into a presentation.

// What colors are we going to use for the different
// datasets.
var color = function(i) {
  var colors = ["#CA0000", "#A2005C",
                "#7EBD00", "#007979"];
  return colors[i % colors.length]
};

// What symbols are we going to use for the different
// datasets.
var symbol = function(i) {
  var symbols = ["circle", "diamond", 
                 "square", "triangle-up",
                 "triangle-down", "cross"];
  return d3.svg.symbol()
           .size(100)
           .type(symbols[i % symbols.length]);
};

// Define the dimensions of the visualization.
var margin = {top: 60, right: 160, bottom: 30, left: 50},
    width = 840 - margin.left - margin.right,
    height = 520 - margin.top - margin.bottom;

// Since this is a line chart, it graphs x- and y-values.
// Define scales for each. Both scales span the size of
// the chart. The x-scale is time-based (assuming months)
// and the y-scale is linear. Note that the y-scale
// ranges from `height` to 0 (opposite of what might be
// expected) because the SVG coordinate system places a
// y-value of `0` at the _top_ of the container.

// At this point we don't know the domain for either of
// the x- or y-values since that depends on the data
// itself (which we'll retrieve in a moment) so we only
// define the type of each scale and its range. We'll
// add a definition of the domain after we retrieve the
// actual data.
var x = d3.time.scale()
          .range([0, width]),
    y = d3.scale.linear()
          .range([height, 0]);

// Define the axes for both x- and y-values. For the
// x-axis, we specify a format for the tick labels
// (just the month abbreviation) since we only have
// the month value for the data. (The year is unknown.)
// Without the override, D3 will try to display an
// actual date (e.g. with a year).
var xAxis = d3.svg.axis()
  .scale(x)
  .tickSize(0, 0, 0)
  .tickPadding(10)
  .tickFormat(d3.time.format("%b"))
  .orient("bottom");

// For the y-axis we add grid lines by specifying a
// negative value for the major tick mark size. We
// set the size of the grid lines to be the entire
// width of the graph.
var yAxis = d3.svg.axis()
  .scale(y)
  .tickSize(-width, 0, 0)
  .tickPadding(10)
  .orient("left");

// Define a convenience function to create a line on
// the chart. The line's x-values are dates and the
// y-values are the temperature values. The result
// of this statement is that `line` will be a
// function that, when passed an array of data
// points, returns an SVG path whose coordinates
// match the x- and y-scales of the chart.
var line = d3.svg.line()
  .x(function(d) { return x(d.date); })
  .y(function(d) { return y(d.temp); });

// Create the SVG container for the visualization and
// define its dimensions. Within that container, add a
// group element (`<g>`) that can be transformed via
// a translation to account for the margins.
var svg = d3.select("body").append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left +
    "," + margin.top + ")");

// Retrieve the data. Even though this particular
// data file is small enough to embed directly, it's
// generally a good idea to keep the data separate.
d3.json('data.json', function(error, datasets) {

  // We're not bothering to check for error returns
  // for this simple demonstration.

  // Convert the data into a more "understandable"
  // JavaScript object. Instead of just an array
  // of numbers, make it an array of objects with
  // appropriate properties.
  datasets.forEach(function(dataset) {
    dataset.data = dataset.data.map(function(d,i) {

      // Although no year is given for the data
      // (so we won't display one), we can simply
      // pick an abitrary year (2013, in this case)
      // to use for our dates. We'll start in January
      // and increment by the index of the data value.
      // The data value itself is the temperature.
      return {
        "date": d3.time.month.offset(
          new Date(2013,0,1), i),
        "temp": d
      };
    });
  })

  // Now that we have the data, we can calculate
  // the domains for our x- and y-values. The x-values
  // are a little tricky because we want to add additional
  // space before and after the data. We start by getting
  // the extent of the data, and then extending that range
  // 16 days before the first date and 15 days after the
  // last date. To account for datasets of differing
  // lengths, we get the maximum length from among all
  // datasets.
  var xMin = new Date(2013,0,1),
      xMax = d3.time.month.offset(xMin,
               d3.max(datasets, function(dataset) {
                 return dataset.data.length-1;
               }));
  x.domain([d3.time.day.offset(xMin,-16),
            d3.time.day.offset(xMax,15)]);

  // For the y-values, we want the chart to show the
  // minimum and maximum values from all the datasets.
  var yMin = d3.min(datasets, function(dataset) {
               return d3.min(dataset.data, function(d) {
                 return d.temp;
               });
             });
  var yMax = d3.max(datasets, function(dataset) {
               return d3.max(dataset.data, function(d) {
                 return d.temp;
               });
             });

  // The `.nice()` function gives the domain nice
  // rounded limits.
  y.domain([yMin, yMax]).nice();

  // With the domains defined, we now have enough
  // information to complete the axes. We position
  // the x-axis by translating it below the chart.
  svg.append("g")
       .attr("class", "x axis")
       .attr("transform", "translate(0," + height + ")")
       .call(xAxis);

  // For the y-axis, we add a label.
  svg.append("g")
       .attr("class", "y axis")
       .call(yAxis)
     .append("text")
       .attr("font-size", "18")
       .attr("transform", "rotate(-90)")
       .attr("y", 9)
       .attr("dy", ".71em")
       .attr("text-anchor", "end")
       .text("Temperature (°C)");
  
  // Style the axes. As with other styles, these
  // could be more easily defined in CSS. For this
  // particular code, though, we're avoiding CSS
  // to make it easy to extract the resulting SVG
  // and paste it into a presentation.
  svg.selectAll(".axis line, .axis path")
       .attr("fill", "none")
       .attr("stroke", "#bbbbbb")
       .attr("stroke-width", "2px")
       .attr("shape-rendering", "crispEdges");

  svg.selectAll(".axis text")
       .attr("font-size", "18");

  svg.selectAll(".axis .tick line")
       .attr("stroke", "#d0d0d0")
       .attr("stroke-width", "1");

  // Plot the data and the legend
  datasets.forEach(function(dataset, i) {

      // Individual points
      svg.selectAll(".point.dataset-" + i)
           .data(dataset.data)
         .enter().append("path")
           .attr("class", "point dataset-" + i)
           .attr("fill", color(i))
           .attr("stroke", color(i))
           .attr("d", symbol(i))
           .attr("transform", function(d) { 
             return "translate(" + x(d.date) +
                         "," + y(d.temp) + ")";
           });

      // Connect the points with lines
      svg.append("path")
         .datum(dataset.data)
         .attr("class", "line dataset-" + i)
         .attr("fill", "none")
         .attr("stroke", color(i))
         .attr("stroke-width", "3")
         .attr("d", line);

      // Legend. In general, it would be cleaner
      // to create an SVG group for the legend,
      // position that group, and then position
      // the individual elements of the legend
      // relative to the group. We're not doing
      // it in this case because we want to do
      // some fancy animation tricks with the
      // resulting SVG within the presentation.
      d3.select("svg").append("path")
         .attr("class", "point dataset-" + i)
         .attr("fill", color(i))
         .attr("stroke", color(i))
         .attr("d", symbol(i))
         .attr("transform", "translate(" +
           (margin.left + width + 40) + "," +
           (24*i + margin.top + height/2 -
            24*datasets.length/2 - 6) + ")")

      d3.select("svg").append("line")
         .attr("class", "line dataset-" + i)
         .attr("stroke", color(i))
         .attr("stroke-width", "3")
         .attr("x1", margin.left + width + 30)
         .attr("x2", margin.left + width + 50)
         .attr("y1", 24*i + margin.top + height/2 -
                     24*datasets.length/2 - 6)
         .attr("y2", 24*i + margin.top + height/2 -
                     24*datasets.length/2 - 6);

      d3.select("svg").append("text")
         .attr("transform", "translate(" +
           (margin.left + width + 60) + "," +
           (24*i + margin.top + height/2 -
            24*datasets.length/2) + ")")
         .attr("class", "legend")
         .attr("font-size", "18")
         .attr("text-anchor", "left")
         .text(dataset.name);

  });

  // Chart decoration. Once more we're avoiding
  // CSS for styling, but usually that would be
  // a better approach.
  d3.select("svg").append("text")
       .attr("transform", "translate(" +
         (margin.left + width/2 + 20) + ",20)")
       .attr("class", "title")
       .attr("font-size", "24")
       .attr("text-anchor", "middle")
       .text("Monthly Average Temperature");

  d3.select("svg").append("text")
       .attr("transform", "translate(" +
         (margin.left + width/2 + 20) + ",48)")
       .attr("class", "subtitle")
       .attr("font-size", "18")
       .attr("text-anchor", "middle")
       .text("Source: WorldClimate.com");
});
```
</div>

---

## But with D3 We Can Do More {data-custom-next="dropPoints"}

<svg id="svgDropPoints" width="600" height="380" style="top: 16px; position: relative; left: 124px;"><g transform="translate(50,60)"><g class="x axis" transform="translate(0,290)"><g class="tick" transform="translate(17.972602739726028,0)" style="opacity: 1;"><line y2="0" x2="0" fill="none" stroke="#d0d0d0" stroke-width="1" shape-rendering="crispEdges"></line><text dy=".71em" y="10" x="0" font-size="14" style="text-anchor: middle;">Jan</text></g><g class="tick" transform="translate(52.794520547945204,0)" style="opacity: 1;"><line y2="0" x2="0" fill="none" stroke="#d0d0d0" stroke-width="1" shape-rendering="crispEdges"></line><text dy=".71em" y="10" x="0" font-size="14" style="text-anchor: middle;">Feb</text></g><g class="tick" transform="translate(84.24657534246575,0)" style="opacity: 1;"><line y2="0" x2="0" fill="none" stroke="#d0d0d0" stroke-width="1" shape-rendering="crispEdges"></line><text dy=".71em" y="10" x="0" font-size="14" style="text-anchor: middle;">Mar</text></g><g class="tick" transform="translate(119.0216894977169,0)" style="opacity: 1;"><line y2="0" x2="0" fill="none" stroke="#d0d0d0" stroke-width="1" shape-rendering="crispEdges"></line><text dy=".71em" y="10" x="0" font-size="14" style="text-anchor: middle;">Apr</text></g><g class="tick" transform="translate(152.7203196347032,0)" style="opacity: 1;"><line y2="0" x2="0" fill="none" stroke="#d0d0d0" stroke-width="1" shape-rendering="crispEdges"></line><text dy=".71em" y="10" x="0" font-size="14" style="text-anchor: middle;">May</text></g><g class="tick" transform="translate(187.54223744292239,0)" style="opacity: 1;"><line y2="0" x2="0" fill="none" stroke="#d0d0d0" stroke-width="1" shape-rendering="crispEdges"></line><text dy=".71em" y="10" x="0" font-size="14" style="text-anchor: middle;">Jun</text></g><g class="tick" transform="translate(221.24086757990867,0)" style="opacity: 1;"><line y2="0" x2="0" fill="none" stroke="#d0d0d0" stroke-width="1" shape-rendering="crispEdges"></line><text dy=".71em" y="10" x="0" font-size="14" style="text-anchor: middle;">Jul</text></g><g class="tick" transform="translate(256.06278538812785,0)" style="opacity: 1;"><line y2="0" x2="0" fill="none" stroke="#d0d0d0" stroke-width="1" shape-rendering="crispEdges"></line><text dy=".71em" y="10" x="0" font-size="14" style="text-anchor: middle;">Aug</text></g><g class="tick" transform="translate(290.884703196347,0)" style="opacity: 1;"><line y2="0" x2="0" fill="none" stroke="#d0d0d0" stroke-width="1" shape-rendering="crispEdges"></line><text dy=".71em" y="10" x="0" font-size="14" style="text-anchor: middle;">Sep</text></g><g class="tick" transform="translate(324.5833333333333,0)" style="opacity: 1;"><line y2="0" x2="0" fill="none" stroke="#d0d0d0" stroke-width="1" shape-rendering="crispEdges"></line><text dy=".71em" y="10" x="0" font-size="14" style="text-anchor: middle;">Oct</text></g><g class="tick" transform="translate(359.40525114155247,0)" style="opacity: 1;"><line y2="0" x2="0" fill="none" stroke="#d0d0d0" stroke-width="1" shape-rendering="crispEdges"></line><text dy=".71em" y="10" x="0" font-size="14" style="text-anchor: middle;">Nov</text></g><g class="tick" transform="translate(393.1506849315068,0)" style="opacity: 1;"><line y2="0" x2="0" fill="none" stroke="#d0d0d0" stroke-width="1" shape-rendering="crispEdges"></line><text dy=".71em" y="10" x="0" font-size="14" style="text-anchor: middle;">Dec</text></g><path class="domain" d="M0,0V0H410V0" fill="none" stroke="#bbbbbb" stroke-width="2px" shape-rendering="crispEdges"></path></g><g class="y axis"><g class="tick" transform="translate(0,270.6666666666667)" style="opacity: 1;"><line x2="410" y2="0" fill="none" stroke="#d0d0d0" stroke-width="1" shape-rendering="crispEdges"></line><text dy=".32em" x="-10" y="0" font-size="14" style="text-anchor: end;">0</text></g><g class="tick" transform="translate(0,222.33333333333331)" style="opacity: 1;"><line x2="410" y2="0" fill="none" stroke="#d0d0d0" stroke-width="1" shape-rendering="crispEdges"></line><text dy=".32em" x="-10" y="0" font-size="14" style="text-anchor: end;">5</text></g><g class="tick" transform="translate(0,174)" style="opacity: 1;"><line x2="410" y2="0" fill="none" stroke="#d0d0d0" stroke-width="1" shape-rendering="crispEdges"></line><text dy=".32em" x="-10" y="0" font-size="14" style="text-anchor: end;">10</text></g><g class="tick" transform="translate(0,125.66666666666667)" style="opacity: 1;"><line x2="410" y2="0" fill="none" stroke="#d0d0d0" stroke-width="1" shape-rendering="crispEdges"></line><text dy=".32em" x="-10" y="0" font-size="14" style="text-anchor: end;">15</text></g><g class="tick" transform="translate(0,77.33333333333334)" style="opacity: 1;"><line x2="410" y2="0" fill="none" stroke="#d0d0d0" stroke-width="1" shape-rendering="crispEdges"></line><text dy=".32em" x="-10" y="0" font-size="14" style="text-anchor: end;">20</text></g><g class="tick" transform="translate(0,28.999999999999993)" style="opacity: 1;"><line x2="410" y2="0" fill="none" stroke="#d0d0d0" stroke-width="1" shape-rendering="crispEdges"></line><text dy=".32em" x="-10" y="0" font-size="14" style="text-anchor: end;">25</text></g><path class="domain" d="M0,0H0V290H0" fill="none" stroke="#bbbbbb" stroke-width="2px" shape-rendering="crispEdges"></path><text transform="rotate(-90)" y="9" dy=".71em" text-anchor="end" font-size="14">Temperature (°C)</text></g><path class="point dataset-0" fill="#CA0000" stroke="#CA0000" d="M0,5.077706251929807A5.077706251929807,5.077706251929807 0 1,1 0,-5.077706251929807A5.077706251929807,5.077706251929807 0 1,1 0,5.077706251929807Z" transform="translate(17.972602739726028,203)"></path><path class="point dataset-0" fill="#CA0000" stroke="#CA0000" d="M0,5.077706251929807A5.077706251929807,5.077706251929807 0 1,1 0,-5.077706251929807A5.077706251929807,5.077706251929807 0 1,1 0,5.077706251929807Z" transform="translate(52.794520547945204,203.96666666666667)"></path><path class="point dataset-0" fill="#CA0000" stroke="#CA0000" d="M0,5.077706251929807A5.077706251929807,5.077706251929807 0 1,1 0,-5.077706251929807A5.077706251929807,5.077706251929807 0 1,1 0,5.077706251929807Z" transform="translate(84.24657534246575,178.83333333333334)"></path><path class="point dataset-0" fill="#CA0000" stroke="#CA0000" d="M0,5.077706251929807A5.077706251929807,5.077706251929807 0 1,1 0,-5.077706251929807A5.077706251929807,5.077706251929807 0 1,1 0,5.077706251929807Z" transform="translate(119.0216894977169,130.5)"></path><path class="point dataset-0" fill="#CA0000" stroke="#CA0000" d="M0,5.077706251929807A5.077706251929807,5.077706251929807 0 1,1 0,-5.077706251929807A5.077706251929807,5.077706251929807 0 1,1 0,5.077706251929807Z" transform="translate(152.7203196347032,94.73333333333333)"></path><path class="point dataset-0" fill="#CA0000" stroke="#CA0000" d="M0,5.077706251929807A5.077706251929807,5.077706251929807 0 1,1 0,-5.077706251929807A5.077706251929807,5.077706251929807 0 1,1 0,5.077706251929807Z" transform="translate(187.54223744292239,62.833333333333336)"></path><path class="point dataset-0" fill="#CA0000" stroke="#CA0000" d="M0,5.077706251929807A5.077706251929807,5.077706251929807 0 1,1 0,-5.077706251929807A5.077706251929807,5.077706251929807 0 1,1 0,5.077706251929807Z" transform="translate(221.24086757990867,27.06666666666668)"></path><path class="point dataset-0" fill="#CA0000" stroke="#CA0000" d="M0,5.077706251929807A5.077706251929807,5.077706251929807 0 1,1 0,-5.077706251929807A5.077706251929807,5.077706251929807 0 1,1 0,5.077706251929807Z" transform="translate(256.06278538812785,14.500000000000012)"></path><path class="point dataset-0" fill="#CA0000" stroke="#CA0000" d="M0,5.077706251929807A5.077706251929807,5.077706251929807 0 1,1 0,-5.077706251929807A5.077706251929807,5.077706251929807 0 1,1 0,5.077706251929807Z" transform="translate(290.884703196347,45.43333333333332)"></path><path class="point dataset-0" fill="#CA0000" stroke="#CA0000" d="M0,5.077706251929807A5.077706251929807,5.077706251929807 0 1,1 0,-5.077706251929807A5.077706251929807,5.077706251929807 0 1,1 0,5.077706251929807Z" transform="translate(324.5833333333333,93.76666666666668)"></path><path class="point dataset-0" fill="#CA0000" stroke="#CA0000" d="M0,5.077706251929807A5.077706251929807,5.077706251929807 0 1,1 0,-5.077706251929807A5.077706251929807,5.077706251929807 0 1,1 0,5.077706251929807Z" transform="translate(359.40525114155247,136.29999999999998)"></path><path class="point dataset-0" fill="#CA0000" stroke="#CA0000" d="M0,5.077706251929807A5.077706251929807,5.077706251929807 0 1,1 0,-5.077706251929807A5.077706251929807,5.077706251929807 0 1,1 0,5.077706251929807Z" transform="translate(393.1506849315068,177.86666666666665)"></path><path class="line dataset-0" fill="none" stroke="#CA0000" stroke-width="2" d="M17.972602739726028,203L52.794520547945204,203.96666666666667L84.24657534246575,178.83333333333334L119.0216894977169,130.5L152.7203196347032,94.73333333333333L187.54223744292239,62.833333333333336L221.24086757990867,27.06666666666668L256.06278538812785,14.500000000000012L290.884703196347,45.43333333333332L324.5833333333333,93.76666666666668L359.40525114155247,136.29999999999998L393.1506849315068,177.86666666666665"></path><path class="point dataset-1" fill="#A2005C" stroke="#A2005C" d="M0,-8.375443731918898L4.835564693205938,0 0,8.375443731918898 -4.835564693205938,0Z" transform="translate(17.972602739726028,272.59999999999997)"></path><path class="point dataset-1" fill="#A2005C" stroke="#A2005C" d="M0,-8.375443731918898L4.835564693205938,0 0,8.375443731918898 -4.835564693205938,0Z" transform="translate(52.794520547945204,262.93333333333334)"></path><path class="point dataset-1" fill="#A2005C" stroke="#A2005C" d="M0,-8.375443731918898L4.835564693205938,0 0,8.375443731918898 -4.835564693205938,0Z" transform="translate(84.24657534246575,215.5666666666667)"></path><path class="point dataset-1" fill="#A2005C" stroke="#A2005C" d="M0,-8.375443731918898L4.835564693205938,0 0,8.375443731918898 -4.835564693205938,0Z" transform="translate(119.0216894977169,161.43333333333334)"></path><path class="point dataset-1" fill="#A2005C" stroke="#A2005C" d="M0,-8.375443731918898L4.835564693205938,0 0,8.375443731918898 -4.835564693205938,0Z" transform="translate(152.7203196347032,106.33333333333334)"></path><path class="point dataset-1" fill="#A2005C" stroke="#A2005C" d="M0,-8.375443731918898L4.835564693205938,0 0,8.375443731918898 -4.835564693205938,0Z" transform="translate(187.54223744292239,57.999999999999986)"></path><path class="point dataset-1" fill="#A2005C" stroke="#A2005C" d="M0,-8.375443731918898L4.835564693205938,0 0,8.375443731918898 -4.835564693205938,0Z" transform="translate(221.24086757990867,30.93333333333334)"></path><path class="point dataset-1" fill="#A2005C" stroke="#A2005C" d="M0,-8.375443731918898L4.835564693205938,0 0,8.375443731918898 -4.835564693205938,0Z" transform="translate(256.06278538812785,37.7)"></path><path class="point dataset-1" fill="#A2005C" stroke="#A2005C" d="M0,-8.375443731918898L4.835564693205938,0 0,8.375443731918898 -4.835564693205938,0Z" transform="translate(290.884703196347,76.36666666666666)"></path><path class="point dataset-1" fill="#A2005C" stroke="#A2005C" d="M0,-8.375443731918898L4.835564693205938,0 0,8.375443731918898 -4.835564693205938,0Z" transform="translate(324.5833333333333,134.36666666666665)"></path><path class="point dataset-1" fill="#A2005C" stroke="#A2005C" d="M0,-8.375443731918898L4.835564693205938,0 0,8.375443731918898 -4.835564693205938,0Z" transform="translate(359.40525114155247,187.53333333333336)"></path><path class="point dataset-1" fill="#A2005C" stroke="#A2005C" d="M0,-8.375443731918898L4.835564693205938,0 0,8.375443731918898 -4.835564693205938,0Z" transform="translate(393.1506849315068,246.5)"></path><path class="line dataset-1" fill="none" stroke="#A2005C" stroke-width="2" d="M17.972602739726028,272.59999999999997L52.794520547945204,262.93333333333334L84.24657534246575,215.5666666666667L119.0216894977169,161.43333333333334L152.7203196347032,106.33333333333334L187.54223744292239,57.999999999999986L221.24086757990867,30.93333333333334L256.06278538812785,37.7L290.884703196347,76.36666666666666L324.5833333333333,134.36666666666665L359.40525114155247,187.53333333333336L393.1506849315068,246.5"></path><path class="point dataset-2" fill="#7EBD00" stroke="#7EBD00" d="M-4.5,-4.5L4.5,-4.5 4.5,4.5 -4.5,4.5Z" transform="translate(17.972602739726028,279.3666666666667)"></path><path class="point dataset-2" fill="#7EBD00" stroke="#7EBD00" d="M-4.5,-4.5L4.5,-4.5 4.5,4.5 -4.5,4.5Z" transform="translate(52.794520547945204,264.8666666666667)"></path><path class="point dataset-2" fill="#7EBD00" stroke="#7EBD00" d="M-4.5,-4.5L4.5,-4.5 4.5,4.5 -4.5,4.5Z" transform="translate(84.24657534246575,236.83333333333334)"></path><path class="point dataset-2" fill="#7EBD00" stroke="#7EBD00" d="M-4.5,-4.5L4.5,-4.5 4.5,4.5 -4.5,4.5Z" transform="translate(119.0216894977169,189.46666666666667)"></path><path class="point dataset-2" fill="#7EBD00" stroke="#7EBD00" d="M-4.5,-4.5L4.5,-4.5 4.5,4.5 -4.5,4.5Z" transform="translate(152.7203196347032,140.16666666666666)"></path><path class="point dataset-2" fill="#7EBD00" stroke="#7EBD00" d="M-4.5,-4.5L4.5,-4.5 4.5,4.5 -4.5,4.5Z" transform="translate(187.54223744292239,106.33333333333334)"></path><path class="point dataset-2" fill="#7EBD00" stroke="#7EBD00" d="M-4.5,-4.5L4.5,-4.5 4.5,4.5 -4.5,4.5Z" transform="translate(221.24086757990867,90.86666666666665)"></path><path class="point dataset-2" fill="#7EBD00" stroke="#7EBD00" d="M-4.5,-4.5L4.5,-4.5 4.5,4.5 -4.5,4.5Z" transform="translate(256.06278538812785,97.63333333333334)"></path><path class="point dataset-2" fill="#7EBD00" stroke="#7EBD00" d="M-4.5,-4.5L4.5,-4.5 4.5,4.5 -4.5,4.5Z" transform="translate(290.884703196347,132.43333333333334)"></path><path class="point dataset-2" fill="#7EBD00" stroke="#7EBD00" d="M-4.5,-4.5L4.5,-4.5 4.5,4.5 -4.5,4.5Z" transform="translate(324.5833333333333,183.66666666666666)"></path><path class="point dataset-2" fill="#7EBD00" stroke="#7EBD00" d="M-4.5,-4.5L4.5,-4.5 4.5,4.5 -4.5,4.5Z" transform="translate(359.40525114155247,232.96666666666667)"></path><path class="point dataset-2" fill="#7EBD00" stroke="#7EBD00" d="M-4.5,-4.5L4.5,-4.5 4.5,4.5 -4.5,4.5Z" transform="translate(393.1506849315068,261)"></path><path class="line dataset-2" fill="none" stroke="#7EBD00" stroke-width="2" d="M17.972602739726028,279.3666666666667L52.794520547945204,264.8666666666667L84.24657534246575,236.83333333333334L119.0216894977169,189.46666666666667L152.7203196347032,140.16666666666666L187.54223744292239,106.33333333333334L221.24086757990867,90.86666666666665L256.06278538812785,97.63333333333334L290.884703196347,132.43333333333334L324.5833333333333,183.66666666666666L359.40525114155247,232.96666666666667L393.1506849315068,261"></path><path class="point dataset-3" fill="#007979" stroke="#007979" d="M0,-5.922333058286216L6.838521170864333,5.922333058286216 -6.838521170864333,5.922333058286216Z" transform="translate(17.972602739726028,232.96666666666667)"></path><path class="point dataset-3" fill="#007979" stroke="#007979" d="M0,-5.922333058286216L6.838521170864333,5.922333058286216 -6.838521170864333,5.922333058286216Z" transform="translate(52.794520547945204,230.06666666666666)"></path><path class="point dataset-3" fill="#007979" stroke="#007979" d="M0,-5.922333058286216L6.838521170864333,5.922333058286216 -6.838521170864333,5.922333058286216Z" transform="translate(84.24657534246575,215.5666666666667)"></path><path class="point dataset-3" fill="#007979" stroke="#007979" d="M0,-5.922333058286216L6.838521170864333,5.922333058286216 -6.838521170864333,5.922333058286216Z" transform="translate(119.0216894977169,188.5)"></path><path class="point dataset-3" fill="#007979" stroke="#007979" d="M0,-5.922333058286216L6.838521170864333,5.922333058286216 -6.838521170864333,5.922333058286216Z" transform="translate(152.7203196347032,155.63333333333333)"></path><path class="point dataset-3" fill="#007979" stroke="#007979" d="M0,-5.922333058286216L6.838521170864333,5.922333058286216 -6.838521170864333,5.922333058286216Z" transform="translate(187.54223744292239,123.73333333333332)"></path><path class="point dataset-3" fill="#007979" stroke="#007979" d="M0,-5.922333058286216L6.838521170864333,5.922333058286216 -6.838521170864333,5.922333058286216Z" transform="translate(221.24086757990867,106.33333333333334)"></path><path class="point dataset-3" fill="#007979" stroke="#007979" d="M0,-5.922333058286216L6.838521170864333,5.922333058286216 -6.838521170864333,5.922333058286216Z" transform="translate(256.06278538812785,110.2)"></path><path class="point dataset-3" fill="#007979" stroke="#007979" d="M0,-5.922333058286216L6.838521170864333,5.922333058286216 -6.838521170864333,5.922333058286216Z" transform="translate(290.884703196347,133.40000000000003)"></path><path class="point dataset-3" fill="#007979" stroke="#007979" d="M0,-5.922333058286216L6.838521170864333,5.922333058286216 -6.838521170864333,5.922333058286216Z" transform="translate(324.5833333333333,171.1)"></path><path class="point dataset-3" fill="#007979" stroke="#007979" d="M0,-5.922333058286216L6.838521170864333,5.922333058286216 -6.838521170864333,5.922333058286216Z" transform="translate(359.40525114155247,206.86666666666667)"></path><path class="point dataset-3" fill="#007979" stroke="#007979" d="M0,-5.922333058286216L6.838521170864333,5.922333058286216 -6.838521170864333,5.922333058286216Z" transform="translate(393.1506849315068,224.26666666666665)"></path><path class="line dataset-3" fill="none" stroke="#007979" stroke-width="2" d="M17.972602739726028,232.96666666666667L52.794520547945204,230.06666666666666L84.24657534246575,215.5666666666667L119.0216894977169,188.5L152.7203196347032,155.63333333333333L187.54223744292239,123.73333333333332L221.24086757990867,106.33333333333334L256.06278538812785,110.2L290.884703196347,133.40000000000003L324.5833333333333,171.1L359.40525114155247,206.86666666666667L393.1506849315068,224.26666666666665"></path></g><path class="point dataset-0" fill="#CA0000" stroke="#CA0000" d="M0,5.077706251929807A5.077706251929807,5.077706251929807 0 1,1 0,-5.077706251929807A5.077706251929807,5.077706251929807 0 1,1 0,5.077706251929807Z" transform="translate(500,159)"></path><line class="line dataset-0" stroke="#CA0000" stroke-width="2" x1="490" x2="510" y1="159" y2="159"></line><text transform="translate(520,165)" class="legend" font-size="15" text-anchor="left">Tokyo</text><path class="point dataset-1" fill="#A2005C" stroke="#A2005C" d="M0,-8.375443731918898L4.835564693205938,0 0,8.375443731918898 -4.835564693205938,0Z" transform="translate(500,179)"></path><line class="line dataset-1" stroke="#A2005C" stroke-width="2" x1="490" x2="510" y1="179" y2="179"></line><text transform="translate(520,185)" class="legend" font-size="15" text-anchor="left">New York</text><path class="point dataset-2" fill="#7EBD00" stroke="#7EBD00" d="M-4.5,-4.5L4.5,-4.5 4.5,4.5 -4.5,4.5Z" transform="translate(500,199)"></path><line class="line dataset-2" stroke="#7EBD00" stroke-width="2" x1="490" x2="510" y1="199" y2="199"></line><text transform="translate(520,205)" class="legend" font-size="15" text-anchor="left">Berlin</text><path class="point dataset-3" fill="#007979" stroke="#007979" d="M0,-5.922333058286216L6.838521170864333,5.922333058286216 -6.838521170864333,5.922333058286216Z" transform="translate(500,219)"></path><line class="line dataset-3" stroke="#007979" stroke-width="2" x1="490" x2="510" y1="219" y2="219"></line><text transform="translate(520,225)" class="legend" font-size="15" text-anchor="left">London</text><text transform="translate(275,20)" class="title" font-size="20" text-anchor="middle">Monthly Average Temperature</text><text transform="translate(275,48)" class="subtitle" font-size="15" text-anchor="middle">Source: WorldClimate.com</text></svg>

---

## (That Animation was D3)

```javascript
d3.selectAll(".point")
  .transition()
  .duration(2000)
  .ease("bounce")
  .attr("transform", function(d) {
    return "translate(" + x(d.date) + "," + 
      (height - margin.top - margin.bottom - 10) + ")";
  })
  .remove();
```

---

## But with D3 We Can Do More {data-custom-next="smoothLines"}

<svg id="svgSmoothLines" width="600" height="380" style="top: 16px; position: relative; left: 124px;"><g transform="translate(50,60)"><g class="x axis" transform="translate(0,290)"><g class="tick" transform="translate(17.972602739726028,0)" style="opacity: 1;"><line y2="0" x2="0" fill="none" stroke="#d0d0d0" stroke-width="1" shape-rendering="crispEdges"/><text dy=".71em" y="10" x="0" font-size="14" style="text-anchor: middle;">Jan</text></g><g class="tick" transform="translate(52.794520547945204,0)" style="opacity: 1;"><line y2="0" x2="0" fill="none" stroke="#d0d0d0" stroke-width="1" shape-rendering="crispEdges"/><text dy=".71em" y="10" x="0" font-size="14" style="text-anchor: middle;">Feb</text></g><g class="tick" transform="translate(84.24657534246575,0)" style="opacity: 1;"><line y2="0" x2="0" fill="none" stroke="#d0d0d0" stroke-width="1" shape-rendering="crispEdges"/><text dy=".71em" y="10" x="0" font-size="14" style="text-anchor: middle;">Mar</text></g><g class="tick" transform="translate(119.0216894977169,0)" style="opacity: 1;"><line y2="0" x2="0" fill="none" stroke="#d0d0d0" stroke-width="1" shape-rendering="crispEdges"/><text dy=".71em" y="10" x="0" font-size="14" style="text-anchor: middle;">Apr</text></g><g class="tick" transform="translate(152.7203196347032,0)" style="opacity: 1;"><line y2="0" x2="0" fill="none" stroke="#d0d0d0" stroke-width="1" shape-rendering="crispEdges"/><text dy=".71em" y="10" x="0" font-size="14" style="text-anchor: middle;">May</text></g><g class="tick" transform="translate(187.54223744292239,0)" style="opacity: 1;"><line y2="0" x2="0" fill="none" stroke="#d0d0d0" stroke-width="1" shape-rendering="crispEdges"/><text dy=".71em" y="10" x="0" font-size="14" style="text-anchor: middle;">Jun</text></g><g class="tick" transform="translate(221.24086757990867,0)" style="opacity: 1;"><line y2="0" x2="0" fill="none" stroke="#d0d0d0" stroke-width="1" shape-rendering="crispEdges"/><text dy=".71em" y="10" x="0" font-size="14" style="text-anchor: middle;">Jul</text></g><g class="tick" transform="translate(256.06278538812785,0)" style="opacity: 1;"><line y2="0" x2="0" fill="none" stroke="#d0d0d0" stroke-width="1" shape-rendering="crispEdges"/><text dy=".71em" y="10" x="0" font-size="14" style="text-anchor: middle;">Aug</text></g><g class="tick" transform="translate(290.884703196347,0)" style="opacity: 1;"><line y2="0" x2="0" fill="none" stroke="#d0d0d0" stroke-width="1" shape-rendering="crispEdges"/><text dy=".71em" y="10" x="0" font-size="14" style="text-anchor: middle;">Sep</text></g><g class="tick" transform="translate(324.5833333333333,0)" style="opacity: 1;"><line y2="0" x2="0" fill="none" stroke="#d0d0d0" stroke-width="1" shape-rendering="crispEdges"/><text dy=".71em" y="10" x="0" font-size="14" style="text-anchor: middle;">Oct</text></g><g class="tick" transform="translate(359.40525114155247,0)" style="opacity: 1;"><line y2="0" x2="0" fill="none" stroke="#d0d0d0" stroke-width="1" shape-rendering="crispEdges"/><text dy=".71em" y="10" x="0" font-size="14" style="text-anchor: middle;">Nov</text></g><g class="tick" transform="translate(393.1506849315068,0)" style="opacity: 1;"><line y2="0" x2="0" fill="none" stroke="#d0d0d0" stroke-width="1" shape-rendering="crispEdges"/><text dy=".71em" y="10" x="0" font-size="14" style="text-anchor: middle;">Dec</text></g><path class="domain" d="M0,0V0H410V0" fill="none" stroke="#bbbbbb" stroke-width="2px" shape-rendering="crispEdges"/></g><g class="y axis"><g class="tick" transform="translate(0,270.6666666666667)" style="opacity: 1;"><line x2="410" y2="0" fill="none" stroke="#d0d0d0" stroke-width="1" shape-rendering="crispEdges"/><text dy=".32em" x="-10" y="0" font-size="14" style="text-anchor: end;">0</text></g><g class="tick" transform="translate(0,222.33333333333331)" style="opacity: 1;"><line x2="410" y2="0" fill="none" stroke="#d0d0d0" stroke-width="1" shape-rendering="crispEdges"/><text dy=".32em" x="-10" y="0" font-size="14" style="text-anchor: end;">5</text></g><g class="tick" transform="translate(0,174)" style="opacity: 1;"><line x2="410" y2="0" fill="none" stroke="#d0d0d0" stroke-width="1" shape-rendering="crispEdges"/><text dy=".32em" x="-10" y="0" font-size="14" style="text-anchor: end;">10</text></g><g class="tick" transform="translate(0,125.66666666666667)" style="opacity: 1;"><line x2="410" y2="0" fill="none" stroke="#d0d0d0" stroke-width="1" shape-rendering="crispEdges"/><text dy=".32em" x="-10" y="0" font-size="14" style="text-anchor: end;">15</text></g><g class="tick" transform="translate(0,77.33333333333334)" style="opacity: 1;"><line x2="410" y2="0" fill="none" stroke="#d0d0d0" stroke-width="1" shape-rendering="crispEdges"/><text dy=".32em" x="-10" y="0" font-size="14" style="text-anchor: end;">20</text></g><g class="tick" transform="translate(0,28.999999999999993)" style="opacity: 1;"><line x2="410" y2="0" fill="none" stroke="#d0d0d0" stroke-width="1" shape-rendering="crispEdges"/><text dy=".32em" x="-10" y="0" font-size="14" style="text-anchor: end;">25</text></g><path class="domain" d="M0,0H0V290H0" fill="none" stroke="#bbbbbb" stroke-width="2px" shape-rendering="crispEdges"/><text transform="rotate(-90)" y="9" dy=".71em" text-anchor="end" font-size="14">Temperature (&#xB0;C)</text></g><path class="line dataset-0" fill="none" stroke="#CA0000" stroke-width="2" d="M17.972602739726028,203L52.794520547945204,203.96666666666667L84.24657534246575,178.83333333333334L119.0216894977169,130.5L152.7203196347032,94.73333333333333L187.54223744292239,62.833333333333336L221.24086757990867,27.06666666666668L256.06278538812785,14.500000000000012L290.884703196347,45.43333333333332L324.5833333333333,93.76666666666668L359.40525114155247,136.29999999999998L393.1506849315068,177.86666666666665"/><path class="line dataset-1" fill="none" stroke="#A2005C" stroke-width="2" d="M17.972602739726028,272.59999999999997L52.794520547945204,262.93333333333334L84.24657534246575,215.5666666666667L119.0216894977169,161.43333333333334L152.7203196347032,106.33333333333334L187.54223744292239,57.999999999999986L221.24086757990867,30.93333333333334L256.06278538812785,37.7L290.884703196347,76.36666666666666L324.5833333333333,134.36666666666665L359.40525114155247,187.53333333333336L393.1506849315068,246.5"/><path class="line dataset-2" fill="none" stroke="#7EBD00" stroke-width="2" d="M17.972602739726028,279.3666666666667L52.794520547945204,264.8666666666667L84.24657534246575,236.83333333333334L119.0216894977169,189.46666666666667L152.7203196347032,140.16666666666666L187.54223744292239,106.33333333333334L221.24086757990867,90.86666666666665L256.06278538812785,97.63333333333334L290.884703196347,132.43333333333334L324.5833333333333,183.66666666666666L359.40525114155247,232.96666666666667L393.1506849315068,261"/><path class="line dataset-3" fill="none" stroke="#007979" stroke-width="2" d="M17.972602739726028,232.96666666666667L52.794520547945204,230.06666666666666L84.24657534246575,215.5666666666667L119.0216894977169,188.5L152.7203196347032,155.63333333333333L187.54223744292239,123.73333333333332L221.24086757990867,106.33333333333334L256.06278538812785,110.2L290.884703196347,133.40000000000003L324.5833333333333,171.1L359.40525114155247,206.86666666666667L393.1506849315068,224.26666666666665"/></g><line class="line dataset-0" stroke="#CA0000" stroke-width="2" x1="490" x2="510" y1="159" y2="159"/><text transform="translate(520,165)" class="legend" font-size="15" text-anchor="left">Tokyo</text><line class="line dataset-1" stroke="#A2005C" stroke-width="2" x1="490" x2="510" y1="179" y2="179"/><text transform="translate(520,185)" class="legend" font-size="15" text-anchor="left">New York</text><line class="line dataset-2" stroke="#7EBD00" stroke-width="2" x1="490" x2="510" y1="199" y2="199"/><text transform="translate(520,205)" class="legend" font-size="15" text-anchor="left">Berlin</text><line class="line dataset-3" stroke="#007979" stroke-width="2" x1="490" x2="510" y1="219" y2="219"/><text transform="translate(520,225)" class="legend" font-size="15" text-anchor="left">London</text><text transform="translate(275,20)" class="title" font-size="20" text-anchor="middle">Monthly Average Temperature</text><text transform="translate(275,48)" class="subtitle" font-size="15" text-anchor="middle">Source: WorldClimate.com</text></svg>


---

## Small Addition to the Line Function

<div class="codewrapper">
``` {.javascript .numberLines .line-2}
var line = d3.svg.line()
             .interpolate("basis")
             .x(function(d) { return x(d.date); })
             .y(function(d) { return y(d.temp); });
```
</div>

* D3 has many interpolations: linear, step, b-spline, Cardinal spline, cubic, ...
* Interpolation also useful for data (numbers, strings, colors) and scales

---

## D3 can Handle Large Datasets

* Better weather data available directly from [National Oceanic and Atmospheric Administration](http://www.ncdc.noaa.gov/)
* Raw CSV data, e.g., for Atlanta:

| STATION           | STATION_NAME |   DATE   | DLY-TAVG-NORMAL | DLY-TAVG-STDDEV |
|:------------------|--------------|----------|----------------:|--------=-------:|
| GHCND:USW00053863 |   ATLANTA    | 20100101 |             418 |              90 |
| GHCND:USW00053863 |   ATLANTA    | 20100102 |             418 |              90 |
| GHCND:USW00053863 |   ATLANTA    | 20100103 |             417 |              90 |
| GHCND:USW00053863 |   ATLANTA    | 20100104 |             417 |              90 |
| GHCND:USW00053863 |   ATLANTA    | 20100105 |             417 |              91 |








<script>


var dropPoints = function() {
    d3.selectAll("#svgDropPoints g .point")
        .transition()
        .duration(2000)
        .ease("bounce")
        .attr("transform", function() {
            var x = d3.select(this).attr("transform").replace(/translate\((.*),.*/, "$1");
            return "translate(" + x + "," + 281 + ")";
        })
        .remove();

    d3.selectAll("#svgDropPoints > path.point")
        .transition()
        .duration(2000)
        .ease("bounce")
        .attr("transform", function() {
            var x = d3.select(this).attr("transform").replace(/translate\((.*),.*/, "$1");
            return "translate(" + x + "," + 340 + ")";
        })
        .remove();

    d3.select("section[aria-selected][data-custom-next]").attr("data-custom-next",null);
}


var smoothLines = function() {
    Snap("#svgSmoothLines path.line.dataset-0").animate({d: "M17.972602739726028,203L23.776255707762555,203.16111111111107C29.579908675799086,203.3222222222222,41.18721461187214,203.64444444444442,52.23287671232877,199.61666666666662C63.278538812785385,195.58888888888887,73.76255707762556,187.2111111111111,84.80041856925418,174.96666666666667C95.8382800608828,162.72222222222223,107.42998477929984,146.61111111111111,118.84227549467275,132.59444444444443C130.25456621004565,118.57777777777778,141.48744292237444,106.65555555555555,152.90753424657535,95.37777777777777C164.32762557077626,84.1,175.93493150684932,73.46666666666667,187.35502283105023,62.18888888888889C198.77511415525112,50.91111111111111,210.00799086757988,38.988888888888894,221.4280821917808,30.93333333333334C232.8481735159817,22.877777777777787,244.45547945205476,18.6888888888889,256.06278538812785,21.750000000000007C267.6700913242009,24.811111111111117,279.2773972602739,35.12222222222222,290.69748858447485,48.33333333333333C302.1175799086758,61.54444444444444,313.3504566210045,77.65555555555557,324.7705479452054,92.80000000000001C336.19063926940635,107.94444444444444,347.79794520547944,122.1222222222222,359.2258371385083,136.13888888888886C370.6537290715372,150.1555555555555,381.902207001522,164.01111111111106,387.5264459665144,170.93888888888887L393.1506849315068,177.86666666666665"},600);
    Snap("#svgSmoothLines path.line.dataset-1").animate({d: "M17.972602739726028,272.59999999999997L23.776255707762555,270.9888888888888C29.579908675799086,269.37777777777774,41.18721461187214,266.15555555555557,52.23287671232877,256.65C63.278538812785385,247.14444444444445,73.76255707762556,231.35555555555555,84.80041856925418,214.4388888888889C95.8382800608828,197.5222222222222,107.42998477929984,179.47777777777776,118.84227549467275,161.27222222222224C130.25456621004565,143.06666666666666,141.48744292237444,124.69999999999999,152.90753424657535,107.46111111111111C164.32762557077626,90.22222222222221,175.93493150684932,74.1111111111111,187.35502283105023,61.54444444444444C198.77511415525112,48.977777777777774,210.00799086757988,39.955555555555556,221.4280821917808,36.57222222222222C232.8481735159817,33.1888888888889,244.45547945205476,35.44444444444444,256.06278538812785,43.016666666666666C267.6700913242009,50.58888888888889,279.2773972602739,63.477777777777774,290.69748858447485,79.58888888888887C302.1175799086758,95.69999999999999,313.3504566210045,115.0333333333333,324.7705479452054,133.56111111111107C336.19063926940635,152.08888888888887,347.79794520547944,169.81111111111113,359.2258371385083,188.5C370.6537290715372,207.1888888888889,381.902207001522,226.84444444444443,387.5264459665144,236.67222222222222L393.1506849315068,246.5"},600);
    Snap("#svgSmoothLines path.line.dataset-2").animate({d: "M17.972602739726028,279.3666666666667L23.776255707762555,276.95C29.579908675799086,274.5333333333333,41.18721461187214,269.7,52.23287671232877,262.6111111111111C63.278538812785385,255.52222222222224,73.76255707762556,246.17777777777778,84.80041856925418,233.61111111111111C95.8382800608828,221.04444444444442,107.42998477929984,205.25555555555553,118.84227549467275,189.14444444444445C130.25456621004565,173.0333333333333,141.48744292237444,156.59999999999997,152.90753424657535,142.74444444444444C164.32762557077626,128.88888888888886,175.93493150684932,117.6111111111111,187.35502283105023,109.39444444444445C198.77511415525112,101.17777777777776,210.00799086757988,96.02222222222221,221.4280821917808,94.57222222222221C232.8481735159817,93.1222222222222,244.45547945205476,95.37777777777777,256.06278538812785,102.30555555555556C267.6700913242009,109.23333333333333,279.2773972602739,120.83333333333334,290.69748858447485,135.17222222222222C302.1175799086758,149.51111111111112,313.3504566210045,166.58888888888887,324.7705479452054,183.34444444444443C336.19063926940635,200.09999999999997,347.79794520547944,216.5333333333333,359.2258371385083,229.42222222222222C370.6537290715372,242.3111111111111,381.902207001522,251.65555555555557,387.5264459665144,256.3277777777778L393.1506849315068,261"},600);
    Snap("#svgSmoothLines path.line.dataset-3").animate({d: "M17.972602739726028,232.96666666666667L23.776255707762555,232.48333333333332C29.579908675799086,232,41.18721461187214,231.0333333333333,52.23287671232877,228.13333333333333C63.278538812785385,225.23333333333332,73.76255707762556,220.39999999999998,84.80041856925418,213.4722222222222C95.8382800608828,206.54444444444442,107.42998477929984,197.5222222222222,118.84227549467275,187.53333333333333C130.25456621004565,177.54444444444442,141.48744292237444,166.58888888888887,152.90753424657535,155.79444444444442C164.32762557077626,145,175.93493150684932,134.36666666666665,187.35502283105023,126.14999999999998C198.77511415525112,117.93333333333332,210.00799086757988,112.13333333333333,221.4280821917808,109.87777777777777C232.8481735159817,107.62222222222222,244.45547945205476,108.91111111111111,256.06278538812785,113.42222222222223C267.6700913242009,117.93333333333334,279.2773972602739,125.66666666666669,290.69748858447485,135.81666666666666C302.1175799086758,145.9666666666667,313.3504566210045,158.53333333333333,324.7705479452054,170.77777777777777C336.19063926940635,183.0222222222222,347.79794520547944,194.94444444444443,359.2258371385083,203.80555555555551C370.6537290715372,212.66666666666663,381.902207001522,218.46666666666664,387.5264459665144,221.36666666666665L393.1506849315068,224.26666666666665"},600);
    d3.select("section[aria-selected][data-custom-next]").attr("data-custom-next",null);
}


</script>

