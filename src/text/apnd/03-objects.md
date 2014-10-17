## Enhancing Objects

Although the previous section's examples show numeric arrays, often our visualization data consists of JavaScript objects instead of simple numbers. That's especially likely if we get the data via a <span class="smcp">REST</span> interface, as such interfaces almost always deliver data in JavaScript Object Notation (<span class="smcp">JSON</span>). If we need to enhance or transform objects, Underscore.js has another set of utilities that can help. For the following examples, we can use a simple `pizza` object.

``` {.javascript .numberLines}
var pizza = { 
    size: 10, 
    crust: "thin", 
    cheese: true, 
    toppings: ["pepperoni","sausage"]
};
```

<figure style="margin-left:0;margin-right:0;">
![](img/underscore.obj.svg)
<figcaption>Underscore has many utilities for working with arbitrary JavaScript objects.</figcaption>
</figure>

### Keys and Values

Underscore.js includes several methods to work with the keys and values that make up objects. For example, the `keys()` function creates an array consisting solely of an object's keys.

``` {.javascript .numberLines}
> _(pizza).keys()
  ["size", "crust", "cheese", "toppings"]
```

<figure style="margin-left:0;margin-right:0;">
![](img/underscore.obj.keys.svg)
<figcaption>The keys() function returns the keys of an object as an array.</figcaption>
</figure>

Similarly, the `values()` function creates an array consisting solely of an object's values.

``` {.javascript .numberLines}
> _(pizza).values()
  [10, "thin", true, ["pepperoni","sausage"]]
```

<figure style="margin-left:0;margin-right:0;">
![](img/underscore.obj.values.svg)
<figcaption>The values() function returns just the values of an object as an array.</figcaption>
</figure>

The `pairs()` function creates a two-dimensional array. Each element of the outer array is itself an array which contains an object's key and its corresponding value.

``` {.javascript .numberLines}
> _(pizza).pairs()
 [ ["size",10], ["crust","thin"], ["cheese",true], ["toppings",["pepperoni","sausage"]] ]
```

<figure style="margin-left:0;margin-right:0;">
![](img/underscore.obj.pairs.svg)
<figcaption>The pairs() function converts an object into an array of array pairs.</figcaption>
</figure>

To reverse this transformation and convert an array into an object, there is the `object()` method.

``` {.javascript .numberLines}
> var arr = [ ["size",10], ["crust","thin"], ["cheese",true], ["toppings",["pepperoni","sausage"]] ]
> _(arr).object()
  { size: 10, crust: "thin", cheese: true, toppings: ["pepperoni","sausage"]}
```

Finally, we can swap the roles of keys and values in an object with the `invert()` function.

``` {.javascript .numberLines}
> _(pizza).invert()
  {10: "size", thin: "crust", true: "cheese", "pepperoni,sausage": "toppings"}
```

<figure style="margin-left:0;margin-right:0;">
![](img/underscore.obj.invert.svg)
<figcaption>The invert() function swaps keys and values in an object.</figcaption>
</figure>

As the example shows, Underscore.js can even invert an object if the value isn't a simple type. In this case it takes an array, `["pepperoni","sausage"]` and converts it to a value by joining the individual array elements with commas, creating the key `"pepperoni,sausage"`.

Note also that JavaScript requires that all of an object's keys are unique. That's not necessarily the case for values. If you have an object in which multiple keys have the same value, then `invert()` only keeps the last of those keys in the inverted object. For example, `_({key1: value, key2: value}).invert()` returns `{value: key2}`.

### Object Subsets
When you want to clean up an object by eliminating unnecessary attributes, you can use Underscore.js's `pick()` function. Simply pass it a list of attributes that you want to retain.

``` {.javascript .numberLines}
> _(pizza).pick("size","crust")
  {size: 10, crust: "thin"}
```

<figure style="margin-left:0;margin-right:0;">
![](img/underscore.obj.pick.svg)
<figcaption>The pick() function selects specific properties from an object.</figcaption>
</figure>

We can also do the opposite of `pick()` by using `omit()` and listing the attributes that we want to delete. Underscore.js keeps all the other attributes in the object.

``` {.javascript .numberLines}
> _(pizza).omit("size","crust")
 {cheese: true, toppings: ["pepperoni","sausage"]}
```

<figure style="margin-left:0;margin-right:0;">
![](img/underscore.obj.omit.svg)
<figcaption>The omit() function removes properties from an object.</figcaption>
</figure>

### Updating Attributes

When updating objects, a common requirement is to make sure that an object includes certain attributes and that those attributes have appropriate default values. Underscore.js includes two utilities for this purpose.

The two utilities, `extend()` and `defaults()` both start with one object and adjust its properties based on those of other objects. If the secondary objects include attributes that the original object lacks, these utilities add those properties to the original. The utilities differ in how they handle properties that are already present in the original. The `extend()` function overrides the original properties with new values, as shown below:

``` {.javascript .numberLines}
> var standard = { size: 12, crust: "regular", cheese: true }
> var order = { size: 10, crust: "thin", 
  toppings: ["pepperoni","sausage"] };
> _.extend(standard, order)
  { size: 10, crust: "thin", cheese: true, 
  toppings: ["pepperoni","sausage"] };
```

<figure style="margin-left:0;margin-right:0;">
![](img/underscore.obj.extend.svg)
<figcaption>The extend() function updates and adds missing properties to an object.</figcaption>
</figure>

Meanwhile `defaults()` leaves the original properties unchanged:

``` {.javascript .numberLines}
> var order = { size: 10, crust: "thin", 
  toppings: ["pepperoni","sausage"] };
> var standard = { size: 12, crust: "regular", cheese: true }
> _.defaults(order, standard)
  { size: 10, crust: "thin", 
  toppings ["pepperoni","sausage"], cheese: true };
```

<figure style="margin-left:0;margin-right:0;">
![](img/underscore.obj.defaults.svg)
<figcaption>The defaults() function adds missing properties to an object.</figcaption>
</figure>

It's important to note that both `extend()` and `defaults()` modify the original object directly; they do not make a copy of that object and return the copy. Consider, for example, the following

``` {.javascript .numberLines}
> var order = { size: 10, crust: "thin", 
  toppings: ["pepperoni","sausage"] };
> var standard = { size: 12, crust: "regular", cheese: true }
> var pizza = _.extend(standard, order)
  { size: 10, crust: "thin", cheese: true, 
  toppings: ["pepperoni","sausage"] };
```

This code sets the `pizza` variable as you would expect, assigning it an object that, _but it also sets the `standard` variable to that same object_. More specifically, the code modifies `standard` with the properties from `order`, and then it sets a new variable `pizza` equal to `standard`. The modification of `standard` is probably not intended. If you need to use either `extend()` or `defaults()` in a way that does not modify input parameters, start with an empty object. We can rewrite the code above to avoid modifying `standard`.

``` {.javascript .numberLines}
> var order = { size: 10, crust: "thin", 
  toppings: ["pepperoni","sausage"] };
> var standard = { size: 12, crust: "regular", cheese: true }
> var pizza = _.extend({}, standard, order)
  { size: 10, crust: "thin", cheese: true, 
  toppings: ["pepperoni","sausage"] };
```
