/*global Headroom*/

document.addEventListener("DOMContentLoaded", function(){

    // Scroll animation parameters
    var DURATION = 1024;
    var STEP_TIME = 16;
    var easing = function(t) {  // t: fraction of time completed (0.0 to 1.0)
        return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
    };

    var toElement = function (target) {

        var startY = window.pageYOffset;
        var endY = function (target) {
            var distance = 0;
            if (target.offsetParent) {
                do {
                    distance += target.offsetTop;
                    target = target.offsetParent;
                } while (target);
            }
            return distance - 44;
        };
        var deltaY = endY(target) - startY;
        var timeLapsed = 0;

        var animateStep = function () {
            timeLapsed += STEP_TIME;
            var fractionTime = Math.min(timeLapsed/DURATION, 1);
            var nextY = startY + ( deltaY * easing(fractionTime) );
            window.scrollTo(0, nextY);
            if (isAnimationDone()) {
                clearInterval(animationTimer);
            }
        };

        var isAnimationDone;
        if (deltaY >= 0) { // If scrolling down
            // Stop animation when you reach the anchor OR the bottom of the page
            isAnimationDone = function () {
                var currentY = window.pageYOffset;
                return currentY >= endY(target) || ((window.innerHeight + currentY) >= document.body.offsetHeight);
            };
        } else { // If scrolling up
            // Stop animation when you reach the anchor OR the top of the page
            isAnimationDone = function () {
                var currentY = window.pageYOffset;
                return currentY <= endY(target) || currentY <= 0;
            };
        }

        var animationTimer = setInterval(animateStep, STEP_TIME);

    };

    var a = document.querySelector('a[href="'+window.location.pathname.substr(1)+'"]');
    a.addEventListener('click', function(ev){
        var target = document.getElementsByTagName('main')[0];
        if (target) {
            ev.preventDefault();
            toElement(target);
        }
    });
    var li = a.parentNode;
    var ol = document.createElement('ol');
    li.appendChild(ol);

    Array.prototype.forEach.call(document.querySelectorAll('h2'), function(h2) {
        var li = document.createElement('li');
        var a = document.createElement('a');
        li.appendChild(a);
        a.href = '#' + h2.id;
        a.textContent = h2.textContent;
        ol.appendChild(li);
        
        a.addEventListener('click', function(ev){
            ev.preventDefault();
            var target = document.getElementById(h2.id);
            if (target) {
                toElement(target);
            }
        });
    });
    
    // Activate automatic hiding of the navigation header
    var nav = document.querySelector("nav");
    var headroom  = new Headroom(nav);
    headroom.init();

}, false);