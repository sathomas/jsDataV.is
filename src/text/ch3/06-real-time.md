## Updating Charts in Real Time

As we've seen in this chapter's other examples, sparklines are great for integrating visualizations in a complete web page. They can be embedded in text content or used as table elements. Another application that suits sparklines well is an information dashboard. Effective dashboards summarize the health of the underlying system _at a glance_. When users don't have the time to read through pages of texts or detailed graphics, the information density of sparklines makes them an ideal tool.

In addition to high information density, most dashboards have another requirement: they must be up-to-date. For web-based dashboards, that means the contents should be continuously updated, even while users are viewing the page. There is no excuse for requiring users to refresh their browsers. Fortunately, the sparklines library makes it easy to accommodate this requirement as well.

Just as in this chapter's first example, we need to include the sparklines and jQuery libraries in our web page. For this visualization we'll show both a chart and the most recent value of the data. We define `<div>` elements for each and place both in a containing `<div>`. The following code includes some styles inline, but you could place them in an external stylesheet. Here the styles are just meant to position the value immediately to the right of the chart rather than on a separate line.

``` {.html .numberLines}
<div id="dashboard">
    <div id="chart" style="float:left"></div>
    <div id="value" style="float:left"></div>
</div>
```

### Step 1: Retrieve the Data

In a real dashboard example, the server would provide the data to display and updates to that data. As long as the frequency of the updates was modest (not faster than once every five seconds or so), we could simply poll the server for updates on a regular interval. It's probably not a good idea, however, to use the JavaScript `setInterval()` function to control the polling interval. That may seem strange at first because `setInterval()` executes a function periodically, which would seem to meet the requirements exactly. The situation is not quite that simple, however. If the server or network encounters a problem, then requests triggered by `setInterval()`will continue unabated, stacking up in a queue. Then, when communication with the server is restored, all of the pending requests will immediately finish, and we'd have a flood of data to handle.

To avoid this problem, we can use the `setTimeout()` function instead. That function executes only once, so we'll have to keep calling it explicitly. By doing that, though, we can make sure that we send a request to the server only after the current one finishes. This approach avoids stacking up a queue of requests.

``` {.javascript .numberLines .line-9 .line-12}
(function getData(){
    setTimeout(function(){
        // request the data from the server
        $.ajax({ url: "/api/data", success: function(data) {

            // data has the response from the server

            // now prepare to ask for updated data
            getData();
        }, dataType: "json"});
    }, 30000);  // 30000: wait 30 seconds to make the request
})();
```

Notice that the structure of the code defines the `getData()` function and immediately executes it. The closing pair of parentheses at the end of line 12 triggers the immediate execution.

Within the `success` callback we set up a recursive call to `getData()` in line 9 so the function executes again whenever the server responds with data.

### Step 2: Update the Visualization

Whenever we receive updated information from the server, we can simply update the chart and value. The code needs only a straightforward call to the sparklines library and a jQuery function to update the value. We've added that to the code here in lines 6 and 7 below.

``` {.javascript .numberLines .line-6 .line-7}
(function getData(){
    setTimeout(function(){
        // request the data from the server
        $.ajax({ url: "/api/data", success: function(data) {

            $('#chart').sparkline(data);
            $('#value').text(data.slice(-1));

            getData();
        }, dataType: "json"});
    }, 30000);  // 30000: wait 30 seconds to make the request
})();
```

Figure NEXTFIGURENUMBER shows what a default chart looks like. Of course you can specify both the chart and text styles as appropriate for your own dashboard.

<figure>
<div id="dashboard1">
<div id="chart" style="float:left;height:40px;width:135px"></div>
<div id="value" style="float:left;height:40px;font-size:22px;padding-top:5px;"></div>
</div>
<figcaption>A live updating chart can show real time-data.</figcaption>
</figure>

<script>
;(function(){

    draw = function() {

        var mrefreshinterval = 500; // update display every 500ms
        var lastmousex=-1; 
        var lastmousey=-1;
        var lastmousetime;
        var mousetravel = 0;
        var mpoints = [0,0,0,0,0,0,0,0,0,0
                      ,0,0,0,0,0,0,0,0,0,0
                      ,0,0,0,0,0,0,0,0,0,0
                      ,0,0,0,0,0,0,0,0,0,0
                      ,0,0,0,0,0,0,0,0,0,0
                      ,0,0,0,0,0,0,0,0,0,0];
        var mpoints_max = 60;
        $('html').mousemove(function(e) {
            var mousex = e.pageX;
            var mousey = e.pageY;
            if (lastmousex > -1) {
                mousetravel += Math.max( Math.abs(mousex-lastmousex), Math.abs(mousey-lastmousey) );
            }
            lastmousex = mousex;
            lastmousey = mousey;
        });
        var mdraw = function() {
            var md = new Date();
            var timenow = md.getTime();
            if (lastmousetime && lastmousetime!=timenow) {
                var pps = Math.round(mousetravel / (timenow - lastmousetime) * 1000);
                mpoints.push(pps);
                if (mpoints.length > mpoints_max)
                    mpoints.splice(0,1);
                mousetravel = 0;
                $('#dashboard1 #chart')
                    .sparkline(mpoints, { 
                        width: mpoints.length*2, 
                        height: 30,
                        lineColor: chartStyles.color.secondaryDark,
                        fillColor: chartStyles.color.secondaryLightest,
                        spotColor: false,
                        minSpotColor: false,
                        maxSpotColor: false
                    });
                $('#dashboard1 #value').text(mpoints.slice(-1));
            }
            lastmousetime = timenow;
            setTimeout(mdraw, mrefreshinterval);
        }
        setTimeout(mdraw, mrefreshinterval); 

    };
    
    if (typeof contentLoaded != "undefined") {
        contentLoaded.done(draw);
    } else {
        window.addEventListener('load', draw);
    }

}());
</script>
