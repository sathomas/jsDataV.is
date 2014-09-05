/*
 * As of 7.x (and pre-release 8.x) neither Safari nor mobile Safari
 * support OpenType font feature settings. As a work-around, we can
 * sniff the user agent string and, if appropriate, add a class to
 * the main `<html>` tag. CSS styles can take it from there.
 */

if (navigator.userAgent.indexOf("Safari") >= 0) {
    document.getElementsByTagName('html')[0].classList.add("no-font-feature-settings");
}