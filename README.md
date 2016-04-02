# scramblejs

> text animation library cum jQuery plugin. Inspired by [codedoodl.es](http://codedoodl.es)

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

The library's interface consists of the following routines.   


* **scramble.enscramble(el)**  
Applies the scramble animation.  

* **scramble.descramble(el)**  
Removes the scramble by scrambling it back to original text. scramble-ception.

* **scramble.setText(el, text)**  
Sets the text inside the DOMElement. Note that the length of text cannot exceed
the length of the original text. If the `text` argument is longer than the original
text, then it will be truncated to the length of the original text. If the argument
is smaller than the original text, then it will be right padded with non-breaking space
(&amp;nbsp; or \u00A0 in unicode).  

* **scramble.createEmpty(el, length)**  
Creates an empty sequence of chars that is `length` long. This lets you size a particular element for
a certain text, without having to manually edit the markup.  

The jQuery interface is a single method:  

**$('selector').scramble(action[, argument])**


action can be one of the following strings:  

* enscramble  
* descramble  
* setText  
* createEmpty 
* export  

These action represent the library functions described above, along with one more called export.
export returns the scramblejs's interface object ( which would have otherwise been attached to the
global namespace ). Have some example code:  

```js
/* without jQuery */

var p = document.querySelector('p');

scramble.enscramble(p);
scramble.setText(p, "howdy");
scramble.descramble(p);
scramble.createEmpty(p, "let me resize this".length)

/* with jQuery */

$('p').scramble("enscramble"); // same as $('p').scramble()
$('p').scramble("setText", "howdy");
$('p').scramble("descramble");
$('p').scramble("createEmpty", "resize this plz".length);

var scramble = $('p').scramble("export");
scramble.enscramble // [Function]
```

## Todo

* polish the code
* improve scramble.createEmpty to consider any previous text. maybe add a scramble.replaceText that combines scramble.createEmtpy & scramble.setText ?  
* write a complete build system ( with support for minification )

## Tip
use monospace fonts for the best effect

## License
MIT

## Credits
The entities.json was taken from whatwg's HTML specification. from [here](https://html.spec.whatwg.org/entities.json) to be exact.  

