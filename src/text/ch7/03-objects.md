## Enhancing Objects

Although the previous section's examples show numeric arrays, often our visualization data consists of JavaScript objects instead of simple numbers. That's especially likely if we get the data via a REST interface, as such interfaces almost always deliver data in JavaScript Object Notation (JSON). If we need to enhance or transform objects, Underscore.js has another set of utilities that can help. For the following examples, we can use a simple `pizza` object.

``` {.javascript .numberLines}
var pizza = { size: 10, crust: "thin", cheese: true, toppings: ["pepperoni","sausage"]}
```

<figure style="margin-left:0;margin-right:0;">
![](img/obj.png)
<figcaption>Underscore has many utilities for working with arbitrary JavaScript objects.</figcaption>
</figure>

### Keys and Values

Underscore.js includes several methods to work with the keys and values that make up objects. For example, the `keys()` function creates an array consisting solely of an object's keys.

``` {.javascript .numberLines}
> _(pizza).keys()
  ["size", "crust", "cheese", "toppings"]
```

<figure style="margin-left:0;margin-right:0;">
![](img/obj.keys.png)
<figcaption>The keys() function returns the keys of an object as an array.</figcaption>
</figure>

Similarly, the `values()` function creates an array consisting solely of an object's values.

``` {.javascript .numberLines}
> _(pizza).values()
  [10, "thin", true, ["pepperoni","sausage"]]
```

<figure style="margin-left:0;margin-right:0;">
![](img/obj.values.png)
<figcaption>The values() function returns just the values of an object as an array.</figcaption>
</figure>

The `pairs()` function creates a two-dimensional array. Each element of the outer array is itself an array which contains an object's key and its corresponding value.

``` {.javascript .numberLines}
> _(pizza).pairs()
 [ ["size",10], ["crust","thin"], ["cheese",true], ["toppings",["pepperoni","sausage"]] ]
```

<figure style="margin-left:0;margin-right:0;">
![](img/obj.pairs.png)
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
![](img/obj.invert.png)
<figcaption>The invert() function swaps keys and values in an object.</figcaption>
</figure>

As the example shows, Underscore.js can even invert an object if the value isn't a simple type. In this case it takes an array, `["pepperoni","sausage"]` and converts it to a value by joining the individual array elements with commas, creating the key `"pepperoni,sausage"`.

Note also that JavaScript requires that all of an object's keys are unique. That's not necessarily the case for values. If you have an object in which multiple keys have the same value, then `invert()` only keeps the last of those keys in the inverted object. For example, `_({key1: value, key2: value}).invert()` returns `{value: key2}`.

### Object Subsets

If the objects that contain our data include attributes that we don't need, it may be helpful to transform the objects by eliminating the unnecessary attributes. The `pick()` function is Underscore.js's most straightforward tools for that transformation. We simply pass it a list of attributes that we want to retain.

``` {.javascript .numberLines}
> _(pizza).pick("size","crust")
  {size: 10, crust: "thin"}
```

<figure style="margin-left:0;margin-right:0;">
![](img/obj.pick.png)
<figcaption>The pick() function selects specific properties from an object.</figcaption>
</figure>

We can also do the opposite of `pick()` by listing the attributes that we want to delete. Underscore.js keeps all the other attributes in the object.

``` {.javascript .numberLines}
> _(pizza).omit("size","crust")
 {cheese: true, toppings: ["pepperoni","sausage"]}
```

<figure style="margin-left:0;margin-right:0;">
![](img/obj.omit.png)
<figcaption>The omit() function removes properties from an object.</figcaption>
</figure>

### Updating Attributes

In addition to extracting parts of an object, we often also need to intelligently update an object's attributes. An especially common requirement is ensuring that an object includes certain attributes and those attributes have appropriate default values. Underscore.js includes two utilities for this function.

The two utilities, `extend()` and `defaults()` both start with one object it and adjust its properties based on those of other objects. In both cases, if the secondary objects include attributes that the original object lacks, the utility adds those properties to the original. The utilities differ in how they handle properties that are already present in the original. The `extend()` function overrides the original properties with new values, while `defaults()` leaves the original properties unchanged.

``` {.javascript .numberLines}
> var standard = { size: 12, crust: "regular", cheese: true }
> var order = { size: 10, crust: "thin", toppings: ["pepperoni","sausage"] };
> _.extend(standard, order)
  { size: 10, crust: "thin", cheese: true, toppings: ["pepperoni","sausage"] };
```

<figure style="margin-left:0;margin-right:0;">
![](img/obj.extend.png)
<figcaption>The extend() function updates and adds missing properties to an object.</figcaption>
</figure>

``` {.javascript .numberLines}
> var order = { size: 10, crust: "thin", toppings: ["pepperoni","sausage"] };
> var standard = { size: 12, crust: "regular", cheese: true }
> _.defaults(order, standard)
  { size: 10, crust: "thin", toppings ["pepperoni","sausage"], cheese: true };
```

<figure style="margin-left:0;margin-right:0;">
![](img/obj.defaults.png)
<figcaption>The defaults() function adds missing properties to an object.</figcaption>
</figure>

It's important to note that both `extend()` and `defaults()` modify the original object directly; they do not make a copy of that object and return the copy. Consider, for example, the following

``` {.javascript .numberLines}
> var order = { size: 10, crust: "thin", toppings: ["pepperoni","sausage"] };
> var standard = { size: 12, crust: "regular", cheese: true }
> var pizza = _.extend(standard, order)
  { size: 10, crust: "thin", cheese: true, toppings: ["pepperoni","sausage"] };
```

That code sets the `pizza` variable as you would expect, _but it also sets the `standard` variable to that same object_. More specifically, the code modifies `standard` with the properties from `order`, and then it sets a new variable `pizza` equal to `standard`. The modification of `standard` is probably not intended. If you need to use either `extend()` or `defaults()` in a way that does not modify input parameters, start with an empty object. We can rewrite the code above to avoid modifying `standard`.

``` {.javascript .numberLines}
> var order = { size: 10, crust: "thin", toppings: ["pepperoni","sausage"] };
> var standard = { size: 12, crust: "regular", cheese: true }
> var pizza = _.extend({}, standard, order)
  { size: 10, crust: "thin", cheese: true, toppings: ["pepperoni","sausage"] };
```
