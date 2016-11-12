<p align="center">
  <img src="data/logo.png" alt="scramblejs">
</p>

> A funky text animation library. Unleash your inner nerd!

## Demo
<img height="80px" src="data/demo.gif">

## Usage

```js  

/* browser */
<script src="scramble.js"></script>
Scramble.select('h1').enscramble();

/* commonjs */
var Scramble = require('./scramble');
Scramble.select('h1').enscramble()

/* amd */
define(['./scramble.js'], function(Scramble) {
    Scramble.select('h1').enscramble();
});
```

## Building  
before you can use scramble, you'll have to build it first. run:

```js
npm run build
```

to build scramble. The built files are kept in the `dist` folder.

## Manual

Module
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
