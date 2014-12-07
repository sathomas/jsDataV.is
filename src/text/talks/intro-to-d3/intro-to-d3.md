# Introduction to D3.js

---

## Traditional Library

```javascript
$('#container').highcharts({
    title: {  text: 'Monthly Average Temperature', x: -20 },
    subtitle: { text: 'Source: WorldClimate.com', x: -20 },
    xAxis: { categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', //…
    yAxis: { title: { text: 'Temperature (°C)' },
             plotLines: [{value: 0, width: 1, color: '#808080'}] },
    legend: { layout: 'vertical', align: 'right', 
              verticalAlign: 'middle', borderWidth: 0 },
    series: [{ name: 'Tokyo',    data: [ 7.0, 6.9, 9.5, 14.5, //…
             { name: 'New York', data: [-0.2, 0.8, 5.7, 11.3, //…
             { name: 'Berlin',   data: [-0.9, 0.6, 3.5,  8.4, //…
             { name: 'London',   data: [ 3.9, 4.2, 5.7,  8.5, //…
});
```

---

## Basic Line Chart

<iframe height='500' scrolling='no' src='http://codepen.io/sathomas/embed/wBMeXe/' frameborder='no' allowtransparency='true' allowfullscreen='true' style='width: 100%;'>See the Pen <a href='http://codepen.io/sathomas/pen/wBMeXe/'>wBMeXe</a> by Stephen Thomas (<a href='http://codepen.io/sathomas'>@sathomas</a>) on <a href='http://codepen.io'>CodePen</a>.
</iframe>

---

![](../../img/ForSale.jpg)

---

![](../../img/HomeDepot.jpg)

---

## Example Code Block

```javascript
var func = function(param) {
    window.alert("Hello World!")
};
```

---

## Bullet List

* Item 1
* Second Item
* Last Item

---
