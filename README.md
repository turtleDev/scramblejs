# scramblejs

> a simple text-garble animation library cum jQuery plugin. Inspired by [codedoodl.es](http://codedoodl.es)

## Demo
<img height="80px" src="data/demo.gif">

## Usage

```js
/* without jQuery */
scramble.enscramble(<DOMelement>);

/* with jQuery */
$('<selector>').scramble();
```

## Installation
* clone this repo
* run `npm install && npm run build`
* copy the dist/scramble.js to where ever you need it

## Manual

(insert quirky intro here)

The library will only export a global interface if jQuery is unavailable.
If jQuery is available, then it acts like a plugin and nothing is exported 
to the global namespace.

Almost all library functions take in a live DOMElement as the first argument which
must contain some text (paragraphs/spans/headings etc).
When a scramblejs function is called on a DOMElement for the first time, 
certain changes take place. First, the class 'js-scramble' is added to the element.
Also every single character inside the element is replaced with a span element.

The library's interface consists of 3 routines.   


* **scramble.enscramble(&lt;DOMElement&gt;)**  
Applies the scramble animation.  

* **scramble.descramble(&lt;DOMElement&gt;)**  
Removes the scramble by scrambling it back to original text. scramble-ception.

* **scramble.setText(&lt;DOMElement&gt;, text)**  
Sets the text inside the DOMElement. Note that the length of text cannot exceed
the length of the original text. If the `text` argument is longer than the original
text, then it will be truncated to the length of the original text. If the argument
is smaller than the original text, then it will be right padded with non-breaking space
(&amp;nbsp; or \u00A0 in unicode).  

The jQuery interface is a single method:  

**$('&lt;selector&gt;').scramble(action[, argument])**


action can be one of the following strings:  

* enscramble  
* descramble  
* setText  
* export  

These action represent the library functions described above, along with one more called export.
export returns the scramblejs's interface object ( which would have otherwise been attached to the
global namespace ). Have some example code:  

```js
/* without jQuery */

var p = document.querySelector('p');

scramble.enscramble(p);
scramble.setText("howdy");
scramble.descramble(p);

/* with jQuery */

$('p').scramble("enscramble"); // same as $('p').scramble()
$('p').scramble("setText", "howdy");
$('p').scramble("descramble");

var scramble = $('p').scramble("export");
scramble.enscramble // [Function enscramble]
```

## Todo

* polish the code
* write a complete build system ( with support for minification )

## Tip
use monospace fonts for the best effect

## License
MIT

## Credits
The entities.json was taken from whatwg's HTML specification. from [here](https://html.spec.whatwg.org/entities.json) to be exact.  

