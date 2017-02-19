[![npm](https://img.shields.io/npm/v/scramblejs.svg)](https://www.npmjs.com/package/scramblejs)
[![Code Climate](https://codeclimate.com/github/turtleDev/scramblejs/badges/gpa.svg)](https://codeclimate.com/github/turtleDev/scramblejs)
<p align="center">
  <img src="https://cdn.rawgit.com/turtleDev/scramblejs/e025c929/data/logo.png?raw=true" alt="scramblejs">
</p>

> A funky text animation library. Unleash your inner nerd!

## Demo
<img height="80px" src="https://cdn.rawgit.com/turtleDev/scramblejs/e025c929/data/demo.gif?raw=true">

## Usage

```js  
Scramble.select('h1')
.wait(1000)
.setText('this is scramble')
.descramble();
```

## Installation  
using npm
```bash
npm install scramblejs
```

manually
```bash
git clone https://github.com/turtleDev/scramblejs
cd scramblejs
npm install
npm run build
```
scramblejs can be used via `script` tags, CommonJS `require` or AMD `define`.

```js
/* browser */
<script src="/path/to/scramble.js"></script>
<script>
Scramble.select('h1');
</script>

/* CommonJS systems (webpack) */
var Scramble = require('scramblejs');

/* AMD */
define(['scramblejs'], function(scramble) {});
```

## Docs

Tutorial
-------
Ready to blow some brains? lets start off with a basic demo
```html
<!doctype html>
<head>
<script src="scramble.js"></script>
</head>
<body>
  <h1></h1>
</body>
<script>
Scramble.select('h1')
.setText('hello, world!')
.descramble();
</script>
```

So here's what happening:
* `Scramble.select` selects a dom element identified by the dom selector 'h1'
* `setText` updates the internal buffer to it's argument but doesn't actually apply any animation
* `descramble` is where the magic happens. To put it in simple (yet confusing) terms, it applies _and_ removes scramble animation. The resultant element contains the text that was perviously passed to `setText` 

The basic workflow in scramble revoles around selecting an element, and then sequencing a series of command that animate that element. Don't worry if you're not familar with [method-chaining][mc], you'll get used to it. 

It is also possible to sequence animation for multiple elements. behold:
```html
<!doctype html>
<head>
<script src="scramble.js"></script>
</head>
<body>
  <h1 class="first"></h1>
  <h1 class="second"></h1>
</body>
<script>
Scramble.select('h1.first')
.setText('I am the first!')
.descramble()
.select('h1.second')
.setText('and I am the second!')
.descramble();
</script>
```

That's pretty much (not) it! Take a look at the examples to get a feel of what else you can do with scramble.

API Docs
------

### `Scramble.select(el:string|object) -> Grinder`
self-explainatory. el must either be a string, in which case it should be a DOM Selector, or a native `Element` object.
returns an instance of `Grinder`

### `Scramble.setConfigGlobal(config:config)`
This is the module level animation parameters. see `Grinder#setConfig`.

### `Scramble.align.*`
Alignment utilites used by `Grinder#setText`


### `class Grinder()`
`Grinder` object encapsulates the selected DOM element, along with it's corresponding config. Every grinder method returns a new `Grinder` object (except `.then` and `.catch`). A `Grinder` object is returned by `Scramble.select`, and you will never directly instantiate this class.

### `Grinder#createEmpty(length:number, padding:string)`
Create a new empty buffer. Note that it clears out any previous content. The created buffer is filled with `padding` chars.
by default, by `&nbsp;`.

### `Grinder#setText(text:string, align:function)`
Set the internal buffer to `text`.&nbsp;`align` function is used to align the contents of the text within the buffer (in case the buffer is larger than the text). By default, the text is left aligned, but you can also have it right, or center aligned.


```js
Scramble.select('h1')
.setText('this will be left aligned', Scramble.align.left) // the second parameter can be omitted here
.setText('right-align', Scramble.align.right)
.setText('center', Scramble.align.center)
```
In case the buffer is too small, it is expanded in order to make space for the text. However, it will not be shrinked in case text-length is less than the
buffer length. To resize a buffer, use `Grinder#createEmpty`

### `Grinder#setConfig(config:object)`
This method lets you configure the animation parameters for the currently selected item.

config must be an object with the following properties:
* delay - inital delay(in ms)
* interval - time between character switches(in ms)
* flip - the number of character switches
  
each field can either have a number as a value, or an object containing a `min` and `max` property.
for example:

```js
/**
 * this is just for demonstration purposes
 * configurations are not `queued`.
 */
Scramble.select('h1')
.setConfig({delay: 20});
.setConfig({flip: {min: 5, max: 10}});
.setConfig({delay: 1, flip: 1, interval: 1});
```
### `Grinder#enscramble()`
applies the scramble animation. text is mangled with random characters and becomes un-legible. 

### `Grinder#descramble()`
applies the scramble animation, but the end text is the same as the internal buffer set by `setText`. 

### `Grinder#select(el:string|object)`
Analogous to `Scramble.select`, this method lets you select another element in a sequence chain.

### `Grinder#wait(delay:number)`
lets you delay the next action. `delay` is the wait period in ms.

### `Grinder#then(successHandler:function, errorHandler:function)`
This method behaves exactly like `Promise.prototype.then`. This method lets you schedule other tasks at the end of an animation sequence. The resolved value is the DOM element that was being animated.

### `Grinder#catch(errorHandler:function)`
equivalent to `Grinder#then(null, errorHandler)`

## Tip
use monospace fonts for the best effect

## License
MIT

## Dependencies

Scramblejs has no runtime dependencies, however, it does require the `Promise` API. If you're targetting browsers that don't support Promises, I recommed you use a polyfill like [bluebird][bb].

## Credits
The entities.json was taken from whatwg's HTML specification. from [here](https://html.spec.whatwg.org/entities.json) to be exact.  
[mc]: https://en.wikipedia.org/wiki/Method_chaining
[bb]: https://github.com/petkaantonov/bluebird
