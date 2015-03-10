/*
 * Scripts for the site landing page.
 */

// Third party libraries

//@codekit-prepend "../../bower_components/d3/d3.js"
//@codekit-prepend "../../bower_components/remarkable/dist/remarkable.js"
//@codekit-prepend "../../bower_components/prism/prism.js"

// Component scripts

//@codekit-prepend "analytics.js"

// Main script for page

;(function(){

    // Function to get and show a summary of available
    // visualizations.

    function getSummary() {

        // Retrieve the list of public gists
        d3.json("https://api.github.com/users/sathomas/gists", function(error, gists) {

            // Keep only the gists that have the required components
            // for a visualization.
            gists = gists.filter(function(gist) {
                return gist.files &&
                       gist.files["README.md"] &&
                       gist.files["index.html"] &&
                       gist.files["thumbnail.png"];
            });

            // Sort the gists from newest to oldest.
            gists.sort(function(a,b) {
                return a.created_at < b.created_at ? 1 : -1;
            });

            // Add a title to the page
            d3.select("main").append("h1")
                .text("Visualizations");

            // Create the list for gists
            var list = d3.select("main").append("ul");

            // Define a date formatter
            var toDate = d3.time.format("%B %e, %Y");

            gists.forEach(function(gist) {
                var item = list.append("li");

                item.append("h2")
                    .append("a")
                        .attr("href", window.location.pathname + "?id=" + gist.id)
                        .text(gist.description);

                item.append("time")
                    .text(toDate(new Date(gist.created_at)));

                item.append("img")
                    .attr("src", gist.files["thumbnail.png"].raw_url)
                    .attr("height", 120)
                    .attr("width", 230);

                d3.text(gist.files["README.md"].raw_url, function(error, readme) {
                    var md = new Remarkable({
                        html: true,
                        typographer: true,
                        quotes: '“”‘’'
                    });

                    item.append("div")
                        .classed("summary", true)
                        .html(md.render(readme));

                    item.append("p").append("a")
                        .attr("href", window.location.pathname + "?id=" + gist.id)
                        .text("View visualization");

                    MathJax.Hub.Typeset();
                });

            });

        });
    }

    // If there's a specific `id` set in the query string,
    // then that's the visualization desired. Otherwise
    // show a list of all available.

    var id = window.location.search.substring(1).split("=")[1];

    if (id) {

        // Retrieve the gist data
        d3.json("https://api.github.com/gists/" + id, function(error, gist) {

            if (error) {
                getSummary();
            } else {

                // Identify insertion point
                var main = d3.select("main");

                // Set the page title
                main.append("h1")
                    .text(gist.description);

                // Add an iframe to hold the visualization
                var iframe = main.append("iframe")
                    .attr("height", 480)
                    .attr("width", 640)
                    .attr("marginwidth", 0)
                    .attr("marginheight", 0)
                    .attr("scrolling", "no")
                    .attr("src", "about:blank")
                    .node();

                // Insert the index.html content in the iframe
                // https://sparecycles.wordpress.com/2012/03/08/inject-content-into-a-new-iframe/
                iframe.contentWindow.contents = gist.files["index.html"].content;
                iframe.src = 'javascript:window["contents"]';

                // Function to format time
                var toDate = d3.time.format("%A, %B %e, %Y");

                main.append("time")
                    .text(toDate(new Date(gist.created_at)));

                var md = new Remarkable({
                    html: true,
                    typographer: true,
                    quotes: '“”‘’'
                });

                var text = gist.files["README2.md"] || gist.files["README.md"];

                main.append("section")
                    .classed("summary", true)
                    .html(md.render(text.content));

                main.append("h2")
                    .text("Source Code")

                main.append("pre")
                    .classed("sourceCode", true)
                    .append("code")
                        .classed("language-markup", true)
                        .text(gist.files["index.html"].content);

                setTimeout(function() {
                    Prism.highlightAll();
                    MathJax.Hub.Typeset();
                }, 0);

            }

        });

    } else {

        getSummary();

    }


})();


