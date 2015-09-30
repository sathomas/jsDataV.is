document.getElementById("cb1").addEventListener("change",function(){document.getElementById("ex1").style.borderRadius = document.getElementById("cb1").checked ? "300px 300px 0 0" : "0";});
var prop,body = document.getElementsByTagName("body")[0];["webkitTransform", "mozTransform", "msTransform", "oTransform", "transform"].forEach(function(p) {if (typeof body.style[p] !== "undefined") {prop = p;}});
document.getElementById("in2").addEventListener("change",function(){document.getElementById("ex2").style[prop] = "rotate(" + document.getElementById("in2").value + "deg)";});
