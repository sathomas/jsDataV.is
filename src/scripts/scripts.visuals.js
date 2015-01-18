/*
 * Scripts for the site landing page.
 */

// Third party libraries

//@codekit-prepend "../../bower_components/d3/d3.js"
//@codekit-prepend "../../bower_components/remarkable/dist/remarkable.js"

// Component scripts

//@codekit-prepend "analytics.js"

// Main script for page

;(function(){

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
        var h1 = d3.select("main")
            .append("h1")
                .text("Visualizations");

        // Create the list for gists
        var list = d3.select("main").append("ul");

        // Define a date formatter
        var toDate = d3.time.format("%B %e, %Y");

        gists.forEach(function(gist) {
            var item = list.append("li");

            item.append("h2")
                .text(gist.description);

            item.append("time")
                .text(toDate(new Date(gist.created_at)));

            item.append("img")
                .attr("src", gist.files["thumbnail.png"].raw_url)
                .attr("height", 120)
                .attr("width", 230);

            d3.text(gist.files["README.md"].raw_url, function(error, readme) {
                var md = new Remarkable({
                    typographer: true,
                    quotes: '“”‘’'
                });

                item.append("div")
                    .classed("summary", true)
                    .html(md.render(readme));

                item.append("p").append("a")
//                    .attr("href", window.location.protocol + "//" + window.location.host + window.location.pathname + gist.id)
                    .attr("href", "http://bl.ocks.org/sathomas/" + gist.id)
                    .text("View visualization");
            });

        });

    })

})();


