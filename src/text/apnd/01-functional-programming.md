## Using Functional Programming

When we're working with data that's part of a visualization, we often have to iterate through the data one item at a time to transform, extract, or otherwise manipulate it to fit our application. Using only the core JavaScript language, our code may rely on a `for` loop like the following:

``` {.javascript .numberLines}
for (var i=0, len=data.length; i<len; i++) {
    // Code continues...
}
```

Although this style, known as _imperative programming_, is a common JavaScript idiom, it can have a few problems in large, complex applications. In particular, it might result in code that's harder than necessary to debug, test, and maintain. This section introduces a different programming style--_functional programming_--that eliminates many of those problems. As we'll see, functional programming can result in code that's much more concise and readable, and often as a result, much less error-prone.

To compare these two programming styles, let's consider a simple programming problem: writing a function to calculate the Fibonacci numbers. The first two Fibonacci numbers are 0 and 1, and subsequent numbers are the sum of the two preceding values. The sequence starts like this:

> 0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, ...

### Step 1: Start with an Imperative Version

To start, let's consider a traditional, imperative approach to the problem. We want a JavaScript function, call it `fib()` that takes as its input a parameter _n_ and returns as its output the _n^th_ Fibonacci number. (By convention, the 0^th and 1^st Fibonacci numbers are 0 and 1.) Here's a first attempt:

``` {.javascript .numberLines}
var fib = function(n) {
    // if 0th or 1st, just return n itself
    if (n < 2) return n;
    
    // otherwise, initialize variable to compute result
    var f0=0, f1=1, f=1;
    
    // iterate until we reach n
    for (i=2; i<=n; i++) {

        // at each iteration, slide the intermediate
        // values down a step
        f0 = f1 = f;
        
        // and calculate sum for the next pass
        f = f0 + f1;
    }
    
    // after all the iterations, return the result
    return f;
}
```

### Step 2: Debug the Imperative Code

If you aren't checking closely, you might be surprised to find that the trivial example above contains three bugs. Of course, it's a contrived example and the bugs are deliberate, but can you find all of them without reading any further? More to the point, if even a trivial example can hide so many bugs, can you imagine what might be lurking in a complex web application?

To understand why imperative programming can introduce these bugs, let's fix them one at a time.

One bug is in the `for` loop on line 9:

``` {.javascript .numberLines startFrom="9"}
    for (i=2; i<=n; i++) {
```

The conditional that determines the loop termination checks for a less-than-or-equal (`<=`) value; it should, instead check for less-than (`<`).

A second bug occurs on line 13:

``` {.javascript .numberLines startFrom="13"}
        f0 = f1 = f;
```

Although we think and read left to right (at least in English), JavaScript executes multiple assignments from right to left. Instead of shifting the values in our variables, this statement simply assigns the value of `f` to all three. We need to break the single statement into two:

``` {.javascript .numberLines}
        f0 = f1;
        f1 = f;
```

The final bug is the most subtle, and it's back on line 9 in the `for` statement. We're using the local variable `i`, but we haven't declared it. As a result, JavaScript will treat it as a global variable. That won't cause our function to return incorrect results, but it could well introduce a conflict--and a hard-to-find bug--elsewhere in our application. The correct code declares the variable as local:

``` {.javascript .numberLines startFrom="9"}
    for (var i=2; i<n; i++) {
```

### Step 3: Understand the Problems Imperative Programming May Introduce

The bugs in this small and straightforward piece of code are meant to demonstrate some problematic features of imperative programming in general. In particular, conditional logic and state variables, by their very nature, tend to invite certain errors.

Consider the first bug. Its error was using an incorrect test (`<=` instead of `<`) for the conditional that terminates the loop. Precise conditional logic is critical for computer programs, but such precision doesn't always come naturally to most people, including programmers. Conditional logic has to be perfect, and sometimes making it perfect is tricky.

The other two errors both relate to state variables, `f0` and `f1` in the first case, and `i` in the second. Here again we find a difference between how programmers think and programs operate. When programmers write the code to iterate through the numbers, they're probably concentrating on the specific problem at hand. It may be too easy to neglect the potential effect on other areas of the application. More technically, state variables can introduce _side effects_ into a program, and side effects may result in bugs.

### Step 4: Rewrite using Functional Programming Style

Proponents of functional programming claim that by ditching conditionals and state variables, a functional programming style can produce code that's more concise, maintainable and less prone to errors than imperative programming.

The "functional" in "functional programming" does not refer to functions in programming languages. Rather, it's a reference to mathematical functions such as y=f(x). Functional programming attempts to emulate mathematical functions in the context of computer programming. Instead of iterating over values by using a for loop, functional programming often uses recursion, where a function calls itself multiple times to make a calculation or manipulate values.

Here's how we can implement the Fibonacci algorithm with functional programming:

```langugage-javascript
var fib = function(n) { return n < 2 ? n : fib(n-1) + fib(n-2); }
```

Notice that this version has no state variables and, except for the edge case to handle 0 or 1, no conditional statements. It's much more concise, and notice how the code mirrors almost word-for-word the statement of the original problem: "The first two Fibonacci numbers are 0 and 1, and subsequent numbers are the sum of the two preceding values". See, for example, how "The first two Fibonacci numbers" corresponds to `n < 2 ?`, then "are 0 and 1" corresponds to `n`, and, finally, "subsequent numbers are the sum of the two preceding values" corresponds to `fib(n-1) + fib(n-2)`.

Functional programming implementations often express the desired outcome directly. They can therefore minimize the chance of misinterpretations or errors in an intermediate algorithm.

### Step 5: Evaluate Performance

From what we've seen so far it may seem that we should always adopt a functional programming style. Certainly functional programming has its advantages, but it can have some significant disadvantages as well. The Fibonacci code provides a perfect example. Since functional programming eschews the notion of loops, our example relies instead on recursion.

In our specific case the `fib()` function calls itself twice at every level until the recursion reaches 0 or 1. Since each intermediate call itself results in more intermediate calls, the number of calls to `fib()` add up exponentially. Finding the 28<sup>th</sup> Fibonacci by executing `fib(28)` results in over one million calls to the `fib()` function.

As you might imagine, the resulting performance is simply unacceptable. Here are the execution times for both the functional and the imperative versions of `fib()`:

<table>
<thead>
<tr>
<th id="version" style="text-align:left;"> Version </th>
<th id="parameter" style="text-align:left;"> Parameter </th>
<th id="execution_time" style="text-align:left;"> Execution Time </th>
</tr>
</thead>

<tbody>
<tr>
<td style="text-align:left;"><p>Imperative <code>fib()</code> </p></td>
<td style="text-align:left;"><p><code>28</code> </p></td>
<td style="text-align:left;"><p>0.231 ms </p></td>
</tr>

<tr>
<td style="text-align:left;"><p>Functional <code>fib()</code> </p></td>
<td style="text-align:left;"><p><code>28</code> </p></td>
<td style="text-align:left;"><p>296.9 ms </p></td>
</tr>

</tbody>
</table>

As you can see, the functional programming version is over a thousand times slower. In the real world, such performance is rarely acceptable.

### Step 6: Fix the Performance Problem

Fortunately, we can have the benefits of functional programming without suffering the performance penalty. We simply turn to the tiny but powerful Underscore.js library. As the library's web page explains

> Underscore is a utility-belt library for JavaScript that provides... functional programming support

Of course we need to include that library in our web pages. If you're including libraries individually, Underscore.js is available on many content distribution networks such as CloudFlare.

``` {.html .numberLines}
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title></title>
  </head>
  <body>
    <!-- Content goes here -->
    <script src="//cdnjs.cloudflare.com/ajax/libs/underscore.js/1.4.4/underscore-min.js"></script>
  </body>
</html>
```

With Underscore in place, we can now optimize the performance of our Fibonacci implementation.

The problem with the recursive implementation is that it results in many unnecessary calls to `fib()`. For example, executing `fib(28)` requires more than 100,000 calls to `fib(3)`. And each time `fib(3)` is called, the return value is recalculated from scratch. It would be better if the implementation only called `fib(3)` once, and every subsequent time it needed to know the value of `fib(3)` it re-used the previous result instead of recalculating it from scratch. In effect, we'd like to implement a cache in front of the `fib()` function. The cache could eliminate the repetitive calculations.

This approach is known as _memoizing_, and the Underscore library has a simple method to automatically and transparently memoize JavaScript functions. Not surprisingly, that method is called `memoize()`. To use it, we first wrap the function we want to memoize within the Underscore object. Just as jQuery uses the bling character ($) for wrapping, Underscore uses the underscore character. After wrapping our function, we simply call the `memoize()` method. Here's the complete code:

``` {.javascript .numberLines}
var fib = _( function(n) { 
        return n < 2 ? n : fib(n-1) + fib(n-2); 
    } ).memoize()
```
As you can see, we haven't really lost any of the readability or conciseness of functional programming. And it would still be a challenge to introduce a bug in this implementation. The only real change is performance, and it's substantially better.

| Version | Parameter | Execution Time |
|---------|-----------|----------------|
| Imperative `fib()` | `28` | 0.231 ms |
| Functional `fib()` | `28` | 296.9 ms |
| Memoized `fib()`   | `28` | 0.352 ms |

Just by including the Underscore library and using one of its methods, our functional implementation has nearly the same performance as the imperative version.

For the rest of this chapter, we'll look at many of the other improvements and utilities that Underscore provides. With its support for functional programming, Underscore makes it significantly easier to work with data in the browser.
