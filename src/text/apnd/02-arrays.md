## Working with Arrays

If your visualization relies on a significant amount of data, that data is most likely contained in arrays. The core JavaScript language includes a few utilities and methods to help applications cope with arrays, but Underscore.js adds many others. This sections describes many array utilities most helpful for data visualizations.

### Extracting Elements by Position

If you only need a subset of an array for your visualization, Underscore.js has many utilities that make it easy to extract the right subset. Those utilities include every imaginable way to extract elements from the beginning or end of the array. For the examples below, we'll consider a simple array.

``` {.javascript .numberLines}
var arr = [1,2,3,4,5,6,7,8,9];
```

<figure>
![](local/underscore.arr.svg)
<figcaption>Underscore has many utilities to make it easy to work with arrays.</figcaption>
</figure>

Underscore provides a simple way to extract the first element of an array, or the first _n_ elements of an array. Not surprisingly, it's the `first()` method.

``` {.javascript .numberLines}
> _(arr).first()
  1
> _(arr).first(3)
  [1, 2, 3]
```

<figure style="margin-left:0;margin-right:0;">
![](local/underscore.arr.first.svg)
<figcaption>The first() function returns the first element in an array.</figcaption>
</figure>

<figure style="margin-left:0;margin-right:0;">
![](local/underscore.arr.first.3.svg)
<figcaption>The first() function can also return the first <b>n</b> elements in an array.</figcaption>
</figure>

Notice that `first()` (without any parameter) returns a simple element, while `first(n)` returns an array of elements. That means, for example, that `first()` and `first(1)` have different return values (`1` vs. `[1]` in the example).

If Underscore.js has a `first()` method, you might expect it would also have a `last()` method to extract elements from the end of an array. Indeed, it does.

``` {.javascript .numberLines}
> _(arr).last()
  9
> _(arr).last(3)
  [7, 8, 9]
```

<figure style="margin-left:0;margin-right:0;">
![](local/underscore.arr.last.svg)
<figcaption>The last() function returns the last element in an array.</figcaption>
</figure>

<figure style="margin-left:0;margin-right:0;">
![](local/underscore.arr.last.3.svg)
<figcaption>The last() function can also return the last <b>n</b> elements in an array.</figcaption>
</figure>

Without any parameters, `last()` returns the last element in the array. With a parameter `n` it returns a new array with the last _n_ elements from the original.

What if you want to extract from the beginning of the array, but instead of knowing how many elements you want in the result, you only know how many elements you want to omit? In other words, you need "all but the last _n_" elements.  The `initial()` method performs this extraction. As with all of these methods, if you omit the optional parameter, Underscore.js assumes a value of 1. 

``` {.javascript .numberLines}
> _(arr).initial()
  [1, 2, 3, 4, 5, 6, 7, 8]
> _(arr).initial(3)
  [1, 2, 3, 4, 5, 6]
```

<figure style="margin-left:0;margin-right:0;">
![](local/underscore.arr.initial.svg)
<figcaption>The initial() function returns all but the last element in an array.</figcaption>
</figure>

<figure style="margin-left:0;margin-right:0;">
![](local/underscore.arr.initial.3.svg)
<figcaption>The initial() function can also return all but the last <b>n</b> elements in an array.</figcaption>
</figure>

Finally, you may need the opposite of `initial()`. The `rest()` method skips past a defined number of elements in the beginning of the array and returns whatever remains.

``` {.javascript .numberLines}
> _(arr).rest()
  [2, 3, 4, 5, 6, 7, 8, 9]
> _(arr).rest(3)
  [4, 5, 6, 7, 8, 9]
```

<figure style="margin-left:0;margin-right:0;">
![](local/underscore.arr.rest.svg)
<figcaption>The rest() function returns all but the first element in an array.</figcaption>
</figure>

<figure style="margin-left:0;margin-right:0;">
![](local/underscore.arr.rest.3.svg)
<figcaption>The rest() function can also return all but the first <em>n</em> elements in an array.</figcaption>
</figure>


### Combining Arrays

Underscore.js includes another set of utilities for combining two or more arrays. Those utilities include functions equivalent to standard mathematical _set_ operations, as well as more sophisticated combinations. We'll use two arrays, one containing the first few Fibonacci numbers and the other containing the five five even integers, for the next few examples.

``` {.javascript .numberLines}
var fibs = [0, 1, 1, 2, 3, 5, 8];
var even = [0, 2, 4, 6, 8];
```

<figure style="margin-left:0;margin-right:0;">
![](local/underscore.arrs.svg)
<figcaption>Underscore also has many utilities to work with multiple arrays.</figcaption>
</figure>

The `union()` method is a straightforward combination of multiple arrays. It returns an array containing all elements that are in any of the inputs, and it removes any duplicates.

``` {.javascript .numberLines}
> _(fibs).union(even)
  [0, 1, 2, 3, 5, 8, 4, 6]
```

<figure style="margin-left:0;margin-right:0;">
![](local/underscore.arrs.union.svg)
<figcaption>The union() function creates the union of multiple arrays, removing any duplicates.</figcaption>
</figure>

Notice that `union()` removes duplicates whether they appear in separate inputs (`0`, `2`, and `4`) or in the same array (`1`).

> Although this chapter considers combinations of just two arrays, most Underscore.js methods can accept an unlimited number of parameters. For example, `_.union(a,b,c,d,e)` returns the union of five different arrays. You can even find the union of an array of arrays with the JavaScript `apply` function, e.g. `_.union.prototype.apply(this, arrOfArrs)`,

The `intersection()` method acts just as you would expect, returning only those elements that appear in all of the input arrays.

``` {.javascript .numberLines}
> _(fibs).intersection(even)
  [0, 2, 8]
```

<figure style="margin-left:0;margin-right:0;">
![](local/underscore.arrs.intersection.svg)
<figcaption>The intersection() function returns elements in common among multiple arrays.</figcaption>
</figure>

The `difference()` method is the opposite of `intersection()`. It returns those elements in the first input array that are **not** present in the other inputs.

``` {.javascript .numberLines}
> _(fibs).difference(even)
  [1, 1, 3, 5]
```

<figure style="margin-left:0;margin-right:0;">
![](local/underscore.arrs.difference.svg)
<figcaption>The difference() function returns elements that are <b>only</b> present in the first of multiple arrays.</figcaption>
</figure>

If you need to eliminate duplicate elements but only have one array (making `union()` inappropriate), then the `uniq()` method meets your requirements.

``` {.javascript .numberLines}
> _(fibs).uniq()
  [0, 1, 2, 3, 5, 8]
```

<figure style="margin-left:0;margin-right:0;">
![](local/underscore.arrs.uniq.svg)
<figcaption>The uniq() function removes duplicate elements from an array.</figcaption>
</figure>

Finally, Underscore.js has a `zip()` method. It's name doesn't come from the popular compression function but, rather, because it acts a bit like a zipper. It takes multiple input arrays and combines them, element by element, into an output array. That output is an array of arrays, where the inner arrays are the combined elements.

The operations is perhaps most clearly understood through a picture.

<figure style="margin-left:0;margin-right:0;">
![](local/underscore.arrs.zip.svg)
<figcaption>The zip() function pairs elements from multiple arrays together into a single array.</figcaption>
</figure>

``` {.javascript .numberLines}
> var naturals = [1, 2, 3, 4, 5];
> var primes = [2, 3, 5, 7, 11];
> _.zip(naturals, primes)
  [ [1,2], [2,3], [3,5], [4,7], [5,11] ]
```

This example demonstrates an alternative style for Underscore.js. Instead of wrapping an array within the `_` object as we've done so far, we call the `zip()` method on the `_` object itself. The alternative style seems a better fit for the underlying functionality in this case, but if you prefer `_(naturals).zip(prime)`, you'll get the exact same result. 

### Removing Invalid Data Values

One of the banes of visualization applications is invalid data values. Although we'd like to think that our data sources meticulously ensure that all the data they provide is scrupulously correct, that is, unfortunately, rarely the case. More seriously, if JavaScript encounters an invalid value, the most common result is an _unhandled exception_, which halts all further JavaScript execution on the page.

To avoid such an unpleasant error, we should validate all data sets and remove invalid values before we pass the data to graphing or charting libraries. Underscore.js has several utilities to help.

The simplest of these Underscore.js methods is `compact()`. This function removes any data values that JavaScript treats as `false` from the input arrays. Eliminated values include the boolean value `false`, the numeric value `0`, an empty string, and the special values `NaN` (not a number, e.g. `1/0`) and `undefined`.

``` {.javascript .numberLines}
> var raw = [0, 1, false, 2, "", 3, NaN, 4, , 5];
> _(raw).compact()
  [1, 2, 3, 4, 5]
```

It is worth emphasizing that `compact()` removes elements with a value of `0`. If you use `compact()` to clean a data array, be sure that `0` isn't a valid data value in your data set.

Another common problem with raw data is excessively nested arrays. If you want to eliminate extra nesting levels from a data set, the `flatten()` method is available to help.

``` {.javascript .numberLines}
> var raw = [1, 2, 3, [[4]], 5];
> _(raw).flatten()
  [1, 2, 3, 4, 5]
```

By default, `flatten()` removes all nesting, even multiple levels of nesting, from arrays. If you set the `shallow` parameter to `true`, however, it only removes a single level of nesting.

``` {.javascript .numberLines}
> var raw = [1, 2, 3, [[4]], 5];
> _(raw).flatten(true)
  [1, 2, 3, [4], 5]
```

Finally, if you have specific values that you want to eliminate from an array, you can use the `without()` method. It's parameters provide a list of values that the function should remove from the input array.

``` {.javascript .numberLines}
> var raw = [1, 2, 3, 4];
> _(raw).without(2, 3)
  [1, 4]
```

### Finding Elements in an Array

JavaScript has always defined the `indexOf` method for strings. It returns the position of a given substring within a larger string. Recent versions of JavaScript have added this method to array objects, so you can easily find the first occurrence of a given value in an array. Unfortunately, older browsers (specifically Internet Explorer version 8 and earlier) don't support this method.

Underscore.js provides it'a own `indexOf()` method to fill the gap those older browsers create. If Underscore.js finds itself running in an environment with native support for array `indexOf`, then it defers to the native method to avoid any performance penalty.

``` {.javascript .numberLines}
> var primes = [2, 3, 5, 7, 11];
> _(primes).indexOf(5)
  2
```

If you need to begin your search somewhere in the middle of the array, `indexOf()` can accommodate that requirement.

``` {.javascript .numberLines}
> var arr = [2, 3, 5, 7, 11, 7, 5, 3, 2];
> _(arr).indexOf(5, 4)
  6
```

You can also search backwards from the end of an array using the `lastIndexOf()` method.

``` {.javascript .numberLines}
> var arr = [2, 3, 5, 7, 11, 7, 5, 3, 2];
> _(arr).lastIndexOf(5)
  6
```

If you don't want to start at the very end of the array, you can pass in the starting index as an optional parameter.

Underscore.js provides a few helpful optimizations for sorted arrays. Both the `uniq()` and the `indexOf()` methods accept an optional boolean parameter. If that parameter is `true`, then the functions assume that the array is sorted. The performance improvements this assumption allows can be especially significant for large data sets.

The library also includes the special `sortedIndex()` function. This function also assumes that the input array is sorted. It finds the position at which a specific value _should_ be inserted to maintain the array's sort order.

``` {.javascript .numberLines}
> var arr = [2, 3, 5, 7, 11];
> _(arr).sortedIndex(6)
  3
```

If you have a custom sorting function, you can pass that to `sortedIndex()` as well.

### Generating Arrays

The final array utility function is a convenient method to generate arrays. The `range()` method tells Underscore to create an array with the specified number of elements. You may also specify a starting value (the default is `0`) and the increment between adjacent values (the default is `1`).

``` {.javascript .numberLines}
> _.range(10)
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
> _.range(20,10)
  [20, 21, 22, 23, 24, 25, 26, 27, 28, 29]
> _.range(0, 10, 100)
  [0, 100, 200, 300, 400, 500, 600, 700, 800, 900]
```

The `range()` function can be quite useful if you need to generate x-axis values to match an array of y-axis values, The `zip()` method can then combine the two.

``` {.javascript .numberLines}
> var yvalues = [0.1277, 1.2803, 1.7697, 3.1882]
> _.zip(_.range(yvalues.length),yvalues)
  [ [0, 0.1277], [1, 1.2803], [2, 1.7697], [3, 3.1882] ]
```

