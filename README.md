<p align="center">
  <img src="data/logo.png" alt="scramblejs">
</p>

> A funky text animation library. Unleash your inner nerd!

## Demo
<img height="80px" src="data/demo.gif">

## Usage

```js  
Scramble.select('h1')
.wait(1000)
.setText('this is scramble')
.descramble();
```

## Installation  
The simplest way to use scramblejs would be to install it from npm:
```bash
npm install scramblejs
```

Alternatively, you can download or clone this repo. However, if you manually obtain a copy
of scramblejs, be sure to build it by running
```bash
npm run build
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

The basic workflow in scramble revoles around selecting an element, and then sequencing a series of command that animate that element. 

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

------

* select  
* setConfigGlobal  
* align

Grinder
------

* enscramble  
* descramble  
* select 
* createEmpty
* setText
* setConfig
* wait
* then  
* catch  

Config
-----

Updates the animation parameters.
Config must be an object with the following properties:
    * delay - inital delay(in ms)
    * interval - time between character switches(in ms)
    * flip - the number of character switches
  
each field can either have a number as a value, or an object containing a `min` and `max` property.
for example:

```js
scramble.setConfig({delay: 20});
scramble.setConfig({flip: {min: 5, max: 10}});
scramble.setConfig({delay: 1, flip: 1, interval: 1});
```


## Todo

* polish the code
* improve scramble.createEmpty to consider any previous text. maybe add a scramble.replaceText that combines scramble.createEmtpy & scramble.setText ?  
* add more documentation

## Tip
use monospace fonts for the best effect

## License
MIT

## Credits
The entities.json was taken from whatwg's HTML specification. from [here](https://html.spec.whatwg.org/entities.json) to be exact.  
