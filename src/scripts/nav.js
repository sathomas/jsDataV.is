/*global Headroom*/

document.addEventListener("DOMContentLoaded", function(){

    // Activate automatic hiding of the navigation header
    var nav = document.querySelector("nav");
    var headroom  = new Headroom(nav);
    headroom.init();

    // Scroll animation parameters
    var DURATION = 1024;
    var STEP_TIME = 16;
    var TOP_MARGIN = 48;
    var easing = function(t) {  // t: fraction of time completed (0.0 to 1.0)
        return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
    };

    // function to scroll smoothly to an element
    var toElement = function (target, callback) {

        var startY = window.pageYOffset;
        var endY = function (target) {
            var distance = 0;
            if (target.offsetParent) {
                do {
                    distance += target.offsetTop;
                    target = target.offsetParent;
                } while (target);
            }
            return distance - TOP_MARGIN;
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
                if (callback) {
                    callback();
                }
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
    
    // reveal header if mouse enters top of screen
    var navTarget = document.getElementById("nav-target");
    navTarget.addEventListener('mouseenter', function(){
       headroom.pin(); 
    });
    
    // augment the hover behavior with click events for tablets, etc.
    // (for now, enable for all clients)
    var contents = document.querySelector('#contents');
    if (true || ('ontouchstart' in window) || 
        (navigator.MaxTouchPoints > 0) || 
        (navigator.msMaxTouchPoints > 0)) {
            contents.addEventListener('click', function(){
               if (contents.classList.toggle("visible")) {
                   nav.classList.add("menu-visible");
               } else {
                   nav.classList.remove("menu-visible");
               }
            });        
    }

    // replace nav link to current page with a smooth scroll to the top
    var a = document.querySelector('a[href="'+window.location.pathname.substr(1)+'"]');
    a.addEventListener('click', function(ev){
        var target = document.querySelector('main');
        if (target) {
            ev.preventDefault();
            toElement(target);
        }
    });
    
    // while we have the nav link for the page, create a child
    // list for the second level headings
    var li = a.parentNode;
    var ol = document.createElement('ol');
    li.appendChild(ol);

    // find the second level headings and add them to the list
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
                toElement(target, function(){
                    setTimeout(function(){
                        headroom.pin();
                    }, 60);
                });
            }
        });
    });

}, false);