## Retrieving Data using AJAX

Most of the examples in this book emphasize the final product of data visualization: the graphs, charts, or images that our users see. But effective visualizations often require a lot of work behind the scenes. After all, effective data visualizations need _data_ just as much as they need the visualization. This example focuses on a common approach for accessing data—Asynchronous JavaScript and <span class="smcp">XML</span>, more commonly known simply as <span class="smcp">AJAX</span>. The example here details <span class="smcp">AJAX</span> interactions with the World Bank, but both the general approach and the specific techniques shown here apply equally well to many other data sources on the web.

### Step 1: Understand the Source Data

Often, the first challenge in working with remote data is to understand its format and structure. Fortunately our data comes from the World Bank, and their web site thoroughly documents their Application Programming Interface (<span class="smcp">API</span>). We won't spend too much time on the particulars in this example since you'll likely be using a different data source. But a quick overview is helpful.

The first item of note is that the World Bank divides the world into several regions. As with all good <span class="smcp">API</span>s, it's possible to query the World Bank and get a list of those regions.

``` {.bash}
http://api.worldbank.org/regions/?format=json
```

returns the full list as a <span class="smcp">JSON</span> array. Here's how it starts:

``` {.javascript .numberLines}
[ { "page": "1",
    "pages": "1",
    "per_page": "50",
    "total": "22"
  },
  [ { "id": "",
      "code": "ARB",
      "name": "Arab World"
    },
    { "id": "",
      "code": "CSS",
      "name": "Caribbean small states"
    },
    { "id": "",
      "code": "EAP",
      "name": "East Asia & Pacific (developing only)"
    },
    { "id": "1",
      "code": "EAS",
      "name": "East Asia & Pacific (all income levels)"
    },
    { "id": "",
      "code": "ECA",
      "name": "Europe & Central Asia (developing only)"
    },
    { "id": "2",
      "code": "ECS",
      "name": "Europe & Central Asia (all income levels)"
    },
```

The first object in the array supports paging through a large data set, which isn't important for us now. The second element is an array with the information we need: the list of regions. There are 22 regions in total, but many overlap with each other. We'll want to pick from the total number of regions so that we (a) include all the world's countries, and (b) don't have any country in multiple regions. The regions that meet this criteria are conveniently marked with an `id` property, so we'll select from the list only those regions whose `id` property is not null.

### Step 2: Get the First Level of Data via AJAX

With an understanding of the data format (so far), let's write some code to retrieve it. Since we have jQuery loaded, we'll take advantage of many of its utilities. Let's start at the simplest level and work up to a full implementation.

As you might expect, the `.getJSON()` function will do most of the work for us. The simplest way to use that function might be something like the following. Note that we're adding `format=json` to the query in line 3 to tell the World Bank what format we want. Without that parameter their server returns <span class="smcp">XML</span>, which isn't at all what `getJSON()` expects. 

``` {.javascript .numberLines .line-3}
$.getJSON(
    "http://api.worldbank.org/regions/",
    {format: "json"},
    function(response) {
        // do something with response
    }
);
```

Unfortunately, that code won't work with the current web servers supplying the World Bank data. In fact, the problem we would encounter with the World Bank servers is very common today. As is often the case with the web, security concerns are the source of the complication. Consider the information flow we're establishing, shown in figure NEXTFIGURENUMBER. Our server (`your.web.site.com`) sends a web page—including scripts—to the user, and those scripts, executing in the user's browser, query the World Bank site (`api.worldbank.com`).

<figure>
<img src="img/cors.png" width="599px" height="408px"></img>
<figcaption>Getting data using <span class="smcp">AJAX</span> often requires the cooperation of three different systems.</figcaption>
</figure>

The script's communication with the World Bank is invisible to users, so they have no chance to approve or refuse the exchange. In the case of the World Bank, it's hard to imagine any reason for users to reject the query, but what if our script was accessing users' social network profile or, more seriously, their online banking site? In such cases user concerns would be justified. Because the communication is invisible to the user, and because the web browser cannot guess which communications might be sensitive and which are not, the browser simply prohibits all such communications. The technical term for this is _same origin policy_. This policy means that web pages that our server provides cannot directly access the World Bank's <span class="smcp">JSON</span> interface.

Some websites address this problem by adding an <span class="smcp">HTTP</span> header in its responses. The header

``` {.bash}
Access-Control-Allow-Origin: *
```

would tell the browser that it's safe for any web page to access this data. Unfortunately, as of this writing, the World Bank has not implemented this header. The option is relatively new, so you'll find it missing from many web servers. To work within the constraints of the same origin policy, therefore, we rely on jQuery's help and a small bit of trickery. The trick relies on the one exception to the same origin policy that all browsers recognize: third party JavaScript files. Browsers do allow web pages to request JavaScript files from third party servers (that is, after all, how services such as Google Analytics can work). We just need to make the response data from the World Bank look like regular JavaScript instead of <span class="smcp">JSON</span>. Fortunately, the World Bank cooperates with us in this minor deception. To do that we add two query parameters to our request

``` {.bash}
?format=jsonP&prefix=Getdata
```

The `format` parameter with a value of `jsonP` tells the World Bank that we want the response formatted as _<span class="smcp">JSON</span> with Padding_, which is a variant of <span class="smcp">JSON</span> that is also regular JavaScript. The second parameter, `prefix`, tells the World Bank the name of our function that will accept the data. (Without that information, the JavaScript that the World Bank constructs wouldn't know how to communicate with our code.) It's a bit messy, but jQuery handles most of the details for us. The only trick is that we have to add `?something=?` to the <span class="smcp">URL</span> we pass to `.getJSON()`, where `something` is whatever the web service requires for its <span class="smcp">JSONP</span> response. The World Bank expects `prefix`, but a more common value is `callback`.

Now we can put together some code that will work with the World Bank and many other web servers, although the specific parameter (`prefix`) is peculiar to the World Bank. We've added the `prefix` directly in the <span class="smcp">URL</span> in line 2, and we've changed the format to `jsonp` in line 3.

``` {.javascript .numberLines}
$.getJSON(
    "http://api.worldbank.org/regions/?prefix=?",
    {format: "jsonp"},
    function(response) {
        // do something with response
    }
);
```

<span class="lgcp">JSONP</span> does suffer from one major shortcoming: there is no way for the server to indicate an error. That means we should spend extra time testing and debugging any <span class="smcp">JSONP</span> requests, and we should be vigilant about any changes in the server that might cause previously functioning code to fail. Eventually the World Bank will update the <span class="smcp">HTTP</span> headers in its responses (perhaps even by the time of this book's publication), and we can switch to the more robust <span class="smcp">JSON</span> format.

> Note: Although it will probably be fixed before this book is published, at the time of this writing the World Bank has a significant bug in their <span class="smcp">API</span>. The server doesn't preserve the case (uppercase vs. lowercase) of the callback function. The full source code for this example includes a workaround for the bug, but you're unlikely to need this workaround for other servers. Just in case, though, you can look at the comments in the source code for a complete documentation of the fix.

Now let's get back to the code itself. In the snippet above, we're defining a callback function directly in the call to `.getJSON()`. You'll see this code structure in many implementations. This certainly works, but if we continue along these lines, things are going to get real messy real soon. We've already added a couple of layers of indentation before we even start processing the response. As you can guess, once we get this initial response, we'll need to make several more requests for additional data. If we try to build our code in one monolithic block, we'll end up with so many levels of indentation that there won't be any room for actual code. More significantly, the result would be one massive interconnected block of code that would be challenging to even understand, much less debug or enhance.

Fortunately, jQuery gives us the tool for a much better approach; that tool is the `$.Deferred` object. A `Deferred` acts as a central dispatcher and scheduler for events. Once the `Deferred` object is created, different parts of our code indicate that they want to know when the event completes, while other parts of out code signal the event's status. The `Deferred` coordinates all those different activities, letting us separate how we trigger and manage events from dealing with their consequences.

Let's see how to improve our <span class="smcp">AJAX</span> request with `Deferred` objects. Our main goal is to separate the initiation of the event (the <span class="smcp">AJAX</span> request) from dealing with its consequences (processing the response). With that separation, we won't need a success function as a callback parameter to the request itself. Instead, we'll rely on the fact that the `.getJSON()` call returns a `Deferred` object. (Technically, the function returns a restricted form of the `Deferred` object known as a `promise`; the differences aren't important for us now, though.) We want to save that returned object in a variable.

``` {.javascript .numberLines}
// fire off the query and retain the deferred object tracking it
deferredRegionsRequest = $.getJSON(
    "http://api.worldbank.org/regions/?prefix=?", 
    {format: "jsonp"}
);
```

That's simple and straightforward. Now, in a different part of our code, we can register our interest in knowing when the <span class="smcp">AJAX</span> request is complete.

``` {.javascript .numberLines}
deferredRegionsRequest.done(function(response) {
    // do something with response
});
```

The `done()` method of the `Deferred` object is key. It specifies a new function that we want to execute whenever the event (in this case the <span class="smcp">AJAX</span> request) successfully completes. The `Deferred` object handles all the messy details. In particular, if the event is already complete by the time we get around to registering the callback via `done()`, the `Deferred` object executes that callback immediately. Otherwise it waits until the request is complete. We can also express an interest in knowing if the <span class="smcp">AJAX</span> request fails. Instead of `done()` we use the `fail()` method. (Even though <span class="smcp">JSONP</span> doesn't give the server a way to report errors, the request itself could still fail.)

``` {.javascript .numberLines}
deferredRegionsRequest.fail(function() {
    // oops, our request for region information failed
});
```

We've obviously reduced the indentation to a more manageable level, but we've also created a much better structure for our code. The function that makes the request is separate from the code that handles the response. That's much cleaner, and it's definitely easier to modify and debug.

### Step 3: Process the First Level of Data

Now let's tackle processing the response. The paging information isn't relevant, so we can skip right to the second element in the returned response. We want to process that array in two steps.

1. Filter out any elements in the array that aren't relevant to us. In this case we're only interested in regions that have an `id` property that isn't `null`.
2. Transform the elements in the array so that they only contain the properties we care about. For this example, we only need the `code` and `name` properties.

This probably sounds familiar. In fact, it's exactly the kind of thing we needed to do in this chapter's first example. As we saw there, jQuery's `$.map()` and `$.grep()` functions are a big help.

Taking these one at a time, here's how to filter out irrelevant data from the response.

``` {.javascript .numberLines}
filtered = $.grep(response[1], function(regionObj) {
    return (regionObj.id !== null);
});
```

And here's how to transform the elements to retain only relevant properties. And as long as we're doing that, let's get rid of the parenthetical "(all income levels)" that the World Bank appends to some region names. All of our regions (those with an `id`) include all income levels, so this information is superfluous. 

``` {.javascript .numberLines}
regions = $.map(filtered, function(regionObj) {
        return { 
            code: regionObj.code, 
            name: regionObj.name.replace(" (all income levels)","")
        };
    }
);
```

There's no need to make these separate steps. We can combine them in a nice, concise expression.

``` {.javascript .numberLines}
deferredRegionsRequest.done(function(response) {
    regions = $.map(
        $.grep(response[1], function(regionObj) {
            return (regionObj.id !== null);
        }),
        function(regionObj) {
            return { 
                code: regionObj.code, 
                name: regionObj.name.replace(" (all income levels)","")
            };
        }
    );
});
```

### Step 4: Get the Real Data

At this point, of course, all we've managed to retrieve are the list of regions. That's not the data we want to visualize. Usually, getting the real data through a web-based interface requires (at least) two request stages. The first request just gives you the essential information for subsequent requests. In this case, the real data we want is the <span class="smcp">GDP</span>, so we'll need to through our list of regions and retrieve that data for each one. 

Of course we can't just blindly fire off the second set of requests, in this case for the detailed region data. First we have to wait until we have the list of regions. In step 2 we dealt with a similar situation by using `.getJSON()` with a `Deferred` object to separate event management from processing. We can use the same technique here; the only difference is that we'll have to create our own `Deferred` object.

``` {.javascript .numberLines}
var deferredRegionsAvailable = $.Deferred();
```

Later, when the region list is available, we indicate that status by calling the object's `resolve()` method.

``` {.javascript .numberLines}
deferredRegionsAvailable.resolve();
```

The actual processing takes place via the `done()` method.

``` {.javascript .numberLines}
deferredRegionsAvailable.done(function() {
    // get the region data
});
```

The code that gets the actual region data needs the list of regions, of course. We could pass that list around as a global variable, but that would be polluting the global namespace. (And even if you've properly namespaced your application, why pollute your own namespace?) The problem is an easy one to solve. Any arguments we provide to the `resolve()` method are passed straight to the `done()` function.

Let's take a look at the big picture so we can see how all the pieces fit together. First, in lines 2-5, we request the list of regions. Then in line 8, we create a second deferred object to track our processing of the response. In the block of lines 11 through 26 we handle the response from our initial request. Most importantly, we resolve the second deferred object (line 13) to single that our processing is complete. Finally, starting with line 29, we can begin processing the response.

``` {.javascript .numberLines}
// request regions list and save status of request in Deferred object
var deferredRegionsRequest = $.getJSON(
    "http://api.worldbank.org/regions/?prefix=?",
    {format: "jsonp"}
);

// second Deferred object to track when list processing completes
var deferredRegionsAvailable = $.Deferred();

// when the request finishes, start processing
deferredRegionsRequest.done(function(response) {
    // when processing complete, resolve second Deferred with the results
    deferredRegionsAvailable.resolve(
        $.map(
            $.grep(response[1], function(regionObj) {
                return (regionObj.id != "");
            }),
            function(regionObj) {
                return { 
                    code: regionObj.code, 
                    name: regionObj.name.replace(" (all income levels)","")
                }; 
            }
        )
    );
});

deferredRegionsAvailable.done(function(regions) {
    // now we have the regions, go get the data    
});
```

Retrieving the actual <span class="smcp">GDP</span> data for each region requires a new <span class="smcp">AJAX</span> request. As you might expect, we'll save the `Deferred` objects for those requests so we can process the responses when they're available. The jQuery `.each()` function is a convenient way to iterate through the list of regions to initiate these requests. (The "<span class="smcp">NY</span>.<span class="smcp">GDP</span>.<span class="smcp">MKTP</span>.<span class="smcp">CD</span>" part of each request <span class="smcp">URL</span> in line 6 is the World Bank's code for <span class="smcp">GDP</span> data.)

``` {.javascript .numberLines .line-6}
deferredRegionsAvailable.done(function(regions) {
    $.each(regions, function(idx, regionObj) {
        regionObj.deferredDataRequest = $.getJSON(
            "http://api.worldbank.org/countries/"
               + regionObj.code
               + "/indicators/NY.GDP.MKTP.CD"
               + "?prefix=?",
            { format: "jsonp", per_page: 9999 }
        );
    });
});
```

As long as we're iterating through the regions, we can include the code to handle the processing of the <span class="smcp">GDP</span> data. By now it won't surprise you that we'll create a `Deferred` object to track when that processing is complete. The processing itself will simply store the returned response (after skipping past the paging information) in the region object.

``` {.javascript .numberLines .line-12}
deferredRegionsAvailable.done(function(regions) {
    $.each(regions, function(idx, regionObj) {
        regionObj.deferredDataRequest = $.getJSON(
            "http://api.worldbank.org/countries/"
               + regionObj.code
               + "/indicators/NY.GDP.MKTP.CD"
               + "?prefix=?",
            { format: "jsonp", per_page: 9999 }
        );
        regionObj.deferredDataAvailable = $.Deferred();
        regionObj.deferredDataRequest.done(function(response) {
            regionObj.rawData = response[1] || [];
            regionObj.deferredDataAvailable.resolve();
        });
    });
});
```
Note that we've also added a check at line 12 to make sure the World Bank actually returns data in its response. Possibly due to internal errors, it may return a `null` object instead of the array of data. When that happens, we'll set the `rawData` to an empty array instead of `null`.

### Step 5: Process the Data

Now that we've requested the real data, it's almost time to process it. There is a final hurdle to overcome, and it's a familiar one. We can't start processing the data until it's available, which calls for defining one more deferred object and resolving that object when the data is complete. (By now it's probably sinking in just how handy `Deferred` objects can be.)

There is one little twist, however. We've now got multiple requests in progress, one for each region. How can we tell when all of those requests are complete? Fortunately, jQuery provides a convenient solution with the `.when()` function. That function accepts a list of deferred objects and only indicates success when all of the objects have succeeded. We just need to pass that list of deferred objects to the `.when()` function.

We could assemble an array of deferred objects using the `.map()` function, but `.when()` expects a parameter list, not an array. Buried deep in the JavaScript standard is a technique for converting an array to a list of function parameters. Instead of calling the function directly, we execute the `.when()` function's `apply()` method. That method takes, as its parameters, the context (`this`) and an array.

Here's the `.map()` function that creates the array.

``` {.javascript .numberLines}
$.map(regions, function(regionObj) {
    return regionObj.deferredDataAvailable
})
```

And here's how we pass it to `when()` as a parameter list.

``` {.javascript .numberLines}
$.when.apply(this,$.map(regions, function(regionObj) {
    return regionObj.deferredDataAvailable
}));
```

The `when()` function returns its own `Deferred` object, so we can use the same methods we already know to process its completion. Now we finally have a complete solution to retrieving the World Bank data.

With our data safely in hand, we can now coerce it into a format that flot accepts. We extract the `date` and `value` properties from the raw data. We also have to account for gaps in the data. The World Bank doesn't have <span class="smcp">GDP</span> data for every region for every year. When it's missing data for a particular year, it returns a null value for `value`. The same combination of `.grep()` and `.map()` that we used before will serve us once again.

``` {.javascript .numberLines}
deferredAllDataAvailable.done(function(regions) {
    $.each(regions, function(idx, regionObj) {
        regionObj.flotData = $.map(
            $.grep(regionObj.rawData, function(dataObj) {
                return (dataObj.value !== null);
            }),
            function(dataObj) {
                return [[
                    parseInt(dataObj.date),
                    parseFloat(dataObj.value)/1e12
                ]];
            }
        )
    })
});
```

As you can see, we're iterating through the list of regions with the `.each()` function of line 2. For each region, we create an object of data for the flot library. (No points for originality in naming that object `flotData` in line 3.) Then we filter the data in lines 4-6 to eliminate any data points with `null` values. The function that creates our flot data array is in lines 7-12. It takes, as input, a single data object from the World Bank, and returns the data as a two-dimensional data point. The first value is the date, which we extract as an integer in line 9, and the second value is the <span class="smcp">GDP</span> data, which we extract as a floating point number in line 10. Dividing by `1e12` converts the <span class="smcp">GDP</span> data to trillions.

### Step 6: Create the Chart

Since we've made it this far with a clear separation between code that handles events and code that processes the results, there's no reason not to continue the approach when we actually create the chart. Yet another `Deferred` object creates that separation. We've taken the code fragments from above and wrapped them in deferred object handling. Once all the data has been processed, we resolve that deferred object (line 17).

``` {.javascript .numberLines .line-17}
var deferredChartDataReady = $.Deferred();

deferredAllDataAvailable.done(function(regions) {
    $.each(regions, function(idx, regionObj) {
        regionObj.flotData = $.map(
            $.grep(regionObj.rawData, function(dataObj) {
                return (dataObj.value !== null);
            }),
            function(dataObj) {
                return [[
                    parseInt(dataObj.date),
                    parseFloat(dataObj.value)/1e12
                ]];
            }
        )
    })
    deferredChartDataReady.resolve(regions);
});

deferredChartDataReady.done(function(regions) {
    // draw the chart
});
```

The entire process is reminiscent of a frog hopping between lily pads in a pond. The pads are the processing steps, and `Deferred` objects bridge between them. 

<figure>
![](img/deferred.svg)
<figcaption>Deferred objects help keep each bit of code isolated to its own pad.</figcation>
</figure>

The real benefit to this approach is its separation of concerns. Each processing step remains independent of the others. Should any require changes, there would be no need to look at the other steps in the process. Each lily pad, in effect, remains its own island without concern for the rest of the pond.

Once we're at the final step, we can use any or all of the techniques from this chapter's other examples to draw the chart. Once again, the `.map()` function can easily extract relevant information from the region data. Here is a basic example:

``` {.javascript .numberLines}
deferredChartDataReady.done(function(regions) {
    $.plot($("#chart"), 
        $.map(regions, function(regionObj) {
            return {
                label: regionObj.name, 
                data:  regionObj.flotData
            };
        })
        ,{ legend: { position: "nw"} }
    );
});
```

Our basic chart now gets its data directly from the World Bank. We no longer have to manually process their data, and our charts are updated automatically whenever the World Bank updates its data.

<figure>
<div style="padding-left:2em;">Gross Domestic Product (Current <span class="lgcp">US</span>$ in Trillions)</div>
<div id="ajax-chart1" style="width:600px;height:400px"></div>
<figcaption>With <span class="smcp">AJAX</span> we can graph live data from another site in the user's browser.</figcaption>
</figure>

In this example we've seen how to access the World Bank's application programming interface. The same approach works for many other organizations providing data on the Internet. In fact, there are so many data sources available today it can be difficult to keep track of them all. Here are two helpful websites, which each serve as a central repository for both public and private <span class="smcp">API</span>s accessible on the Internet.

* [APIhub](http://www.apihub.com)
* [ProgrammableWeb](http://www.programmableweb.com)

Many governments also provide a directory of available data and <span class="smcp">API</span>s. The United States, for example, centralizes its resources at the [Data.gov](http://www.data.gov) web site.

This example focuses on the <span class="smcp">AJAX</span> interaction, so the resulting chart is a simple, static, line chart. Any of the interactions described in the other examples from this chapter could be added to increase the interactivity of the visualization.

<script>
;(function(){

    draw = function() {

        $.ajaxSetup({
          beforeSend: function(xhr, settings) {
            var prefix = settings.url.match(/prefix=(.*?)&/);
            if (prefix.length > 1) {
              var callback = prefix[1];
              if (callback !== callback.toLowerCase()) {
                window[callback.toLowerCase()] = 
                  new Function("response", callback + "(response)")
              }
            }
        	}
        });
        
        regs = [];
        
        
        // request the regions list and save status of the request in a Deferred object
        var deferredRegionsRequest = $.getJSON(
            "http://api.worldbank.org/regions/?prefix=?",
            {format: "jsonp"}
        );
        
        // create a second Deferred object to track when list processing is complete
        var deferredRegionsAvailable = $.Deferred();
        
        // when the request finishes, start processing
        deferredRegionsRequest.done(function(response) {
            // when we finish processing, resolve the second Deferred with the results
            deferredRegionsAvailable.resolve(
                $.map(
                    $.grep(response[1], function(regionObj) {
                        return (regionObj.id != "");
                    }),
                    function(regionObj) {
                        return { 
                            code: regionObj.code, 
                            name: regionObj.name.replace(" (all income levels)","")
                        }; 
                    }
                )
            );
        });
        
        // create another Deferred object to track when all data is available
        var deferredAllDataAvailable = $.Deferred();
        
        deferredRegionsAvailable.done(function(regions) {
            $.each(regions, function(idx, regionObj) {
                regionObj.deferredDataRequest = $.getJSON(
                    "http://api.worldbank.org/countries/"
                       + regionObj.code
                       + "/indicators/NY.GDP.MKTP.CD"
                       + "?prefix=?"
                    ,{ format: "jsonp", per_page: 9999 }
                );
                regionObj.deferredDataAvailable = $.Deferred();
                regionObj.deferredDataRequest.done(function(response) {
                    regionObj.rawData = response[1] || [];
                    regionObj.deferredDataAvailable.resolve();
                });
            });
            $.when.apply(this,$.map(regions, function(regionObj) {
                return regionObj.deferredDataAvailable
            })).done(function() {
                deferredAllDataAvailable.resolve(regions);
            });
        });
        
        var deferredChartDataReady = $.Deferred();
        
        deferredAllDataAvailable.done(function(regions) {
            $.each(regions, function(idx, regionObj) {
                regionObj.flotData = $.map(
                    $.grep(regionObj.rawData, function(dataObj) {
                        return (dataObj.value !== null);
                    }),
                    function(dataObj) {
                        return [[
                            parseInt(dataObj.date),
                            parseFloat(dataObj.value)/1e12
                        ]];
                    }
                )
            })
            deferredChartDataReady.resolve(regions);
        });
        
        deferredChartDataReady.done(function(regions) {
        regs = regions;
            $.plot($("#ajax-chart1"), 
                $.map(regions, function(regionObj) {
                    return {
                        label: regionObj.name, 
                        data:  regionObj.flotData
                    };
                }),
                {
                    legend: { position: "nw", backgroundColor: "#F5F5F5", backgroundOpacity: 1},
                    colors: [chartStyles.color.primaryLightest,chartStyles.color.alternateLightest,chartStyles.color.secondaryLightest,chartStyles.color.primaryDark,chartStyles.color.alternateDark,chartStyles.color.secondaryDark,chartStyles.color.primary],
                    grid: { color: chartStyles.color.text },
                    xaxis: { tickLength: 10 },
                    yaxis: { tickLength: 10 }
                }
            );
        });
    };

    if (typeof contentLoaded != "undefined") {
        contentLoaded.done(draw);
    } else {
        window.addEventListener('load', draw);
    }

}());
</script>

