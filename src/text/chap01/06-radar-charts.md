## Displaying Multidimensional Data with a Radar Chart

If you have data with many dimensions, a radar chart may be the most effective way to visualize it. Radar charts are not as common as other charts, though, and their unfamiliarity makes them a little harder for users to interpret. If you design a radar chart, be careful not to increase that burden.

Radar charts are most effective when your data has several characteristics

* You don't have too many data points to show. Half a dozen data points is about the maximum that a radar chart can accommodate.
* The data points have multiple dimensions. With two or even three dimensions to your data, you would probably be better off with a more traditional chart type. Radar charts come into play with data of four or more dimensions.
* Each data dimension is a scale that can at least be ranked (from good to bad, say), if not assigned a number outright. . Radar charts don't work well with data dimensions that are merely arbitrary categories (such as political party or nationality). They work best if all the dimensions can at least be ranked, if not assigned a number outright.

A classic use for radar charts is analyzing the performance of players on a sports team. Consider, for example, the starting lineup of the 2012 National Basketball Association's (<span class="smcp">NBA</span>) Miami Heat. There are only five data points (the five players). There are multiple dimensions—points, assists, rebounds, blocks, steals, and so on, and each of those dimensions has a natural numeric value.

Here are the players' 2011–2012 season averages per game, as well as the team totals (which include the contributions of nonstarters).

| Player         | Points | Rebounds | Assists | Steals | Blocks |
|:---------------|-------:|---------:|--------:|-------:|-------:|
| Chris Bosh     |  17.2  |   7.9    |   1.6   |   0.8  |   0.8  |
| Shane Battier  |   5.4  |   2.6    |   1.2   |   1.0  |   0.5  |
| LeBron James   |  28.0  |   8.4    |   6.1   |   1.9  |   0.8  |
| Dwayne Wade    |  22.3  |   5.0    |   4.5   |   1.7  |   1.3  |
| Mario Chalmers |  10.2  |   2.9    |   3.6   |   1.4  |   0.2  |
| **Team Total** |**98.2**|**41.3**  |**19.3** | **8.5**| **5.3**|

Just as in this chapter's first example, we need to include the flotr2 library in our web page and set aside a `<div>` element to contain the chart we'll construct.

### Step 1: Define the Data

We'll start with a typical JavaScript expression of the team's statistics. For our example we'll start with an array of objects corresponding to each starter, and a separate object for the entire team.

``` {.javascript .numberLines}
var players = [
    { player: "Chris Bosh",     points: 17.2, rebounds: 7.9, 
      assists: 1.6, steals: 0.8, blocks: 0.8 },
    { player: "Shane Battier",  points:  5.4, rebounds: 2.6, 
      assists: 1.2, steals: 1.0, blocks: 0.5 },
    { player: "LeBron James",   points: 28.0, rebounds: 8.4, 
      assists: 6.1, steals: 1.9, blocks: 0.8 },
    { player: "Dwayne Wade",    points: 22.3, rebounds: 5.0, 
      assists: 4.5, steals: 1.7, blocks: 1.3 },
    { player: "Mario Chalmers", points: 10.2, rebounds: 2.9, 
      assists: 3.6, steals: 1.4, blocks: 0.2 }
];
var team = {
    points:   98.2,
    rebounds: 41.3,
    assists:  19.3,
    steals:    8.5,
    blocks:    5.3
};
```

For an effective radar plot, we need to normalize all the values to a common scale. In this example, let's translate raw statistics into team percentage. For example, instead of visualizing LeBron's James' scoring as 28.0, we'll show it as 29 percent (28.0/98.2).

There are a couple of functions we can use to convert the raw statistics into an object to chart. The first function returns the `statistics` object for a single player. It simply searches through the `players` array looking for that player's name. The second function steps through each statistic in the `team` object, gets the corresponding statistic for the named player, and normalizes the value. The returned object will have a `label` property equal to the player's name, and an array of normalized statistics for that player.

``` {.javascript .numberLines}
var get_player = function(name) {
    for (var i=0; i<players.length; i++) {
        if (players[i].player === name) return players[i];
    }
}
var player_data = function(name) {
    var obj = {}, i = 0;
    obj.label = name;
    obj.data = [];
    for (var key in team) {
        obj.data.push([i, 100*get_player(name)[key]/team[key]]);
        i++;
    };
    return obj;
};
```

For example, the function call `player_data("LeBron James")` returns the following object:

``` {.javascript .numberLines}
{
    label: "LeBron James",
    data:  [
               [0,28.513238289205702],
               [1,20.33898305084746],
               [2,31.60621761658031],
               [3,22.352941176470587],
               [4,15.09433962264151]
           ]
}
```

For the specific statistics, we're using counter from 0 to 4. We'll see how to map those numbers into meaningful values shortly.

Since flotr2 doesn't require jQuery, we aren't taking advantage of any jQuery convenience function in the preceding code. We're also not taking full advantage of the JavaScript standard (including methods such as `.each()`) because Internet Explorer (<span class="smcp">IE</span>) releases prior to version 9 do not support those methods. If you have jQuery on your pages for other reasons, or if you don't need to support older <span class="smcp">IE</span> versions, you can simplify this code quite a bit.

The last bit of code we'll use is a simple array of labels for the statistics in our chart. The order must match the order returned in `player_data()`.

``` {.javascript .numberLines}
var labels = [
    [0, "Points"],
    [1, "Rebounds"],
    [2, "Assists"],
    [3, "Steals"],
    [4, "Blocks"]
];
```

### Step 2: Create the Chart

A single call to flotr2's `draw()` method is all it takes to create our chart. We need to specify the <span class="smcp">HTML</span> element in which to place the chart, as well as the chart data. For the data, we'll use the `get_player()` function previously. The following code also includes a few options. The `title` option in line 9 provides an overall title for the chart, and the `radar` option in line 10 tells flotr2 the type of chart we want. With a radar chart we also have to explicitly specify a circular (as opposed to rectangular) grid, so we do that with the `grid` option in line 11. The final two options detail the x- and y-axes. For the x-axis we'll use our `labels` array to give each statistic a name, and for the y-axis we'll forgo labels altogether and explicitly specify the minimum and maximum values.

``` {.javascript .numberLines}
Flotr.draw(document.getElementById("chart"),
    [
        player_data("Chris Bosh"),
        player_data("Shane Battier"),
        player_data("LeBron James"),
        player_data("Dwayne Wade"),
        player_data("Mario Chalmers")
    ],{
        title:  "2011/12 Miami Heat — Contribution to Team Total",
        radar:  { show: true },
        grid:   { circular: true },
        xaxis:  { ticks: labels },
        yaxis:  { showLabels: false, min:0, max: 33 }
    }
);
```

The only real trick is making the <span class="smcp">HTML</span> container wide enough to hold both the chart proper and the legend since flotr2 doesn't do a great job of calculating the size appropriately. For a static chart such as this one, trial and error is the simplest approach and gives us the chart shown in figure NEXTFIGURENUMBER.

<figure>
<div id='radar-chart1' style="width:600px;height:400px;"></div>
<figcaption>Radar charts let users compare multiple data variables at once.</figcaption>
</figure>

Although it's certainly not a surprise to <span class="smcp">NBA</span> fans, the chart clearly demonstrates the value of LeBron James to the team. He leads the team in four of the five major statistical categories.

The radar chart lends itself only to a few specialized applications, but it can be effective when there is only a modest number of variables, each of which is easily quantified, it can be effective. In figure LASTFIGURENUMBER, each player's area on the chart roughly corresponds to his total contribution across all of the variables. The relative size of the red area makes James's total contribution strikingly clear.

<script>
;(function(){

    draw = function() {
        
        var players = [
            { player: "Chris Bosh",     points: 17.2, rebounds: 7.9, assists: 1.6, steals: 0.8, blocks: 0.8 },
            { player: "Shane Battier",  points:  5.4, rebounds: 2.6, assists: 1.2, steals: 1.0, blocks: 0.5 },
            { player: "LeBron James",   points: 28.0, rebounds: 8.4, assists: 6.1, steals: 1.9, blocks: 0.8 },
            { player: "Dwayne Wade",    points: 22.3, rebounds: 5.0, assists: 4.5, steals: 1.7, blocks: 1.3 },
            { player: "Mario Chalmers", points: 10.2, rebounds: 2.9, assists: 3.6, steals: 1.4, blocks: 0.2 },
        ];
        var team = {
            points:   98.2,
            rebounds: 41.3,
            assists:  19.3,
            steals:    8.5,
            blocks:    5.3,
        };
        var get_player = function(name) {
            for (var i=0; i<players.length; i++) {
                if (players[i].player === name) return players[i];
            }
        }
        var player_data = function(name) {
            var obj = {}, i = 0;
            obj.label = name;
            obj.data = [];
            for (var key in team) {
                obj.data.push([i, 100*get_player(name)[key]/team[key]]);
                i++;
            };
            return obj;
        };
        var labels = [
            [0, "Points"],
            [1, "Rebounds"],
            [2, "Assists"],
            [3, "Steals"],
            [4, "Blocks"],
        ];
        
        Flotr.draw(document.getElementById("radar-chart1"),
            [
                player_data("LeBron James"),
                player_data("Dwayne Wade"),
                player_data("Chris Bosh"),
                player_data("Mario Chalmers"),
                player_data("Shane Battier")
            ],{
                colors: [chartStyles.color.primary,chartStyles.color.alternateLightest,chartStyles.color.secondaryLightest,chartStyles.color.alternateDarkest,chartStyles.color.secondaryDarkest],
                fontColor: chartStyles.color.text,
                title:  "2011/12 Miami Heat Starting Lineup — Contribution to Team Total",
                radar:  { show: true, radiusRatio: 0.9},
                grid:   { circular: true, color: chartStyles.color.text },
                xaxis:  { ticks: labels, },
                yaxis:  { showLabels: false, min:0, max: 33, },
                legend: {position: "nw", backgroundOpacity: 0, },
            }
        );
           
        var dummyElements = document.getElementsByClassName('flotr-dummy-div');
        Array.prototype.forEach.call(dummyElements, function(dummyElement){
            dummyElement.parentNode.style.display = 'none';
        });

    };
    
    if (typeof contentLoaded != "undefined") {
        contentLoaded.done(draw);
    } else {
        window.addEventListener('load', draw);
    }

}());
</script>
