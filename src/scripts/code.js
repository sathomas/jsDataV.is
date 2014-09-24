/*
 * Add CSS class for highlighted line numbers in code.
 */

document.addEventListener("DOMContentLoaded", function(){

    for (var num=1; num<100; num++) {
        var tables = document.querySelectorAll("table.sourceCode.line-" + num);
        for (var t=0; t<tables.length; t++) {

            var nums = tables[t].rows[0].cells[0].querySelector("pre");
            var code = tables[t].rows[0].cells[1].querySelector("code.sourceCode");

            var numLines = nums.innerHTML.split("\n");
            numLines[num-1] = "<span class='emphasized'>" + numLines[num-1] + "</span>";
            nums.innerHTML = numLines.join("\n");

            var codeLines = code.innerHTML.split("\n");
            codeLines[num-1] = "<span class='emphasized'>" + codeLines[num-1] + "</span>";
            code.innerHTML = codeLines.join("\n");
        }
    }

}, false);