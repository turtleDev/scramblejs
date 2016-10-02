/**
 * The MIT License
 *
 * Copyright (c) 2016 Saravjeet 'Aman' Singh
 * <saravjeetamansingh@gmail.com>
 *
 * Permission is hereby granted, free of charge, to any person obtaining a
 * copy of this software and associated documentation files (the "Software"),
 * to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense,
 * and/or sell copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
 * THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE.
 *
 */



(function(factory, global) {

    "use strict";

    if ( global.Promise === undefined ) {
        throw new Error("scramblejs requires the Promise API");
    }

    // I like my namespace, like I like my friends. TIGHT!
    if ( typeof global.module === "object" &&
         typeof global.module.exports === "object" ) {
        
        // this is a commonjs aware system
        // ... or someone has really gone and done it
        factory(module, module.exports);
    } else {

        // we are operating inside a browser environment
        // ... probably
        var module = {
            exports: Object.create(null),
            jQuery: global.jQuery
        };
        factory(module, module.exports);
        global.scramble = module.exports;
    }
    
})(function(module, exports) {
    
    "use strict";

    var config = {
        minFlip: 1,
        maxFlip: 7,
        minInterval: 150,
        maxInterval: 100,
        minDelay: 10,
        maxDelay: 50
    };

    var chars = {{{chars}}};

    function placeholder(ch) {
        return "<span data-ch='" + ch + "'>" + ch + "</span>";
    }

    function scaffoldElement(el) {

        if ( hasClass(el, "js-scramble") ) {
            return;
        }

        var baseString = el.innerHTML.split("");
        var replacement = "";
        baseString.forEach(function(c) {
            replacement += placeholder(c);
        });

        el.innerHTML = replacement;

        var classes = el.className.split(" ");
        classes.push("js-scramble");
        el.className = classes.join(" ");
    }

    /**
     * randomChars(n)
     *
     * build a list of random characters
     */
    function randomChars(n) {
        var list = [];
        for ( var i = 0; i < n; ++i ) {
            var index = Math.floor(Math.random() * chars.length);
            list.push(chars[index]);
        }
        return list;
    }

    /**
     * randomValue(min, max)
     *
     * get a random value between min and mix
     */
    function randomValue(min, max) {
        return min + Math.floor(Math.random() * (max - min));
    }

    function hasClass(el, cls) {
        return el.className.indexOf(cls) != -1;
    }

    /**
     * domListToArray(domList)
     *
     * convert DOM list to an Array. Doesn't work for for IE8 or less
     */
    function domListToArray(dl) {
        return Array.prototype.slice.call(dl, 0);
    }

    /**
     * queueAnimation(el, cb)
     *
     * This function is used to schedule animation for every element.
     * 
     * cb is the function that is responsible for updating the
     * respective elements.  it takes the args (actor, ch, interval),
     * where actor is the dom element, ch is a list of characters, and
     * interval is the time between the character switches.
     */
    function queueAnimation(el, cb) {

        scaffoldElement(el)

        var actors = domListToArray(el.children);
        actors.forEach(function(actor) {
            var delay = randomValue(config.minDelay, config.maxDelay);
            setTimeout(function() {
                var n = randomValue(config.minFlip, config.maxFlip);
                var ch = randomChars(n);
                var interval = randomValue(config.minInterval, config.maxInterval);
                setTimeout(function() {
                    cb(actor, ch, interval);
                }, interval);
            }, delay);
        });
    }

    exports.enscramble = function(el) {
        function _enscramble(actor, chars, interval) {
            if ( chars.length == 0 ) return;
            actor.innerHTML = chars.pop();
            setTimeout(function() {
                _enscramble(actor, chars, interval);
            }, interval);
        }
        queueAnimation(el, _enscramble);
    };

    exports.descramble = function(el) {
        function _descramble(actor, chars, interval) {
            if ( chars.length == 0 ) {
                actor.innerHTML = actor.dataset.ch;
                return;
            }
            actor.innerHTML = chars.pop();
            setTimeout(function() {
                _descramble(actor, chars, interval);
            }, interval);
        }
        queueAnimation(el, _descramble);
    };

    exports.setText = function(el, text) {

        if ( typeof text != "string" ) {
            console.error("scramble.setText: text must be a string, got: " + typeof text);
            return;
        }

        scaffoldElement(el);
        var actors = el.children;
        for ( var i = 0; i < actors.length; ++i ) {
            actors[i].dataset.ch = text[i] || "&nbsp;";
        }
    };

    exports.createEmpty = function(el, length) {

        if ( typeof length != "number" ) {
            console.error("scramble.createEmpty: length must be a number, got: " + typeof length);
            return;
        }

        var components = "";
        for ( var i = 0; i < length; ++ i ) {
            components += placeholder("&nbsp;");
        }

        el.innerHTML = components;

        if ( !hasClass(el, "js-scramble") ) {
            el.className += " js-scramble";
        }
    };

    exports.setConfig = function(newConfig) {
        if ( typeof newConfig !== "object" || newConfig.hasOwnProperty("length") ) {
            console.error("scramble: config: was expecting an object, got " + newConfig);
            return;
        }
        var validProps = ["delay", "flip", "interval"];
        for ( var prop in newConfig ) {
            var p = prop[0].toUpperCase() + prop.slice(1);
            if ( validProps.indexOf(prop) == -1 ) {
                console.warn("scramble: config: unrecognized config parameter: " + prop);
            } else if ( typeof newConfig[prop] === "number" ) {
                config["min"+p] = newConfig[prop];
                config["max"+p] = newConfig[prop];
            } else if ( typeof newConfig[prop] === "object" ) {
                config["min"+p] = newConfig[prop].min || config["min"+p];
                config["max"+p] = newConfig[prop].max || config["max"+p];
            } else {
                console.warn("scramble: config: config field values must be a number or an object");
            }
        }
    };



    var ScrambleBox = function(element) {
        if ( !(this instanceof ScrambleBox) ) {
            throw Error('objects must be constructed using the new keyword');
        }

        this._origin = Promise.resolve(element);
        this._config = config;
    };
    
    exports.select = function(sel) {
        var el = document.querySelector(sel);
        return new ScrambleBox(el);
    };
    
    ScrambleBox.prototype.enscramble = function() {
        
        var p = this._origin.then(function(el) {
            
            scaffoldElement(el);
            var count = el.children.length;
            console.log(count);
            return new Promise(function(resolve, reject) {
                
                function _enscramble(actor, chars, interval) {
                    if ( chars.length === 0 ) {
                        --count;
                        if ( count === 0 ) {
                            resolve(el);
                        }
                        return;
                    }
                    actor.innerHTML = chars.pop();
                    setTimeout(function() {
                        _enscramble(actor, chars, interval);
                    }, interval);
                }
                queueAnimation(el, _enscramble);
            });
        });

        return new ScrambleBox(p);
    };

    ScrambleBox.prototype.descramble = function() {

        var p = this._origin.then(function(el) {

            scaffoldElement(el);
            var count = el.children.length;
            return new Promise(function(resolve, reject) {

                function _descramble(actor, chars, interval) {
                    if ( chars.length === 0 ) {
                        actor.innerHTML = actor.dataset.ch;
                        --count;
                        if ( count === 0 ) {
                            resolve(el);
                        }
                        return;
                    }
                    actor.innerHTML = chars.pop();
                    setTimeout(function() {
                        _descramble(actor, chars, interval);
                    }, interval);
                }
                queueAnimation(el, _descramble);
            });
        });

        return new ScrambleBox(p);
    };
                

    ScrambleBox.prototype.then = function(cb) {

        var p = this._origin.then(cb);
        return new ScrambleBox(p);
    };

    ScrambleBox.prototype.wait = function(duration) {
        var p = this._origin.then(function(el) {
            return new Promise(function(resolve, reject) {
                setTimeout(function() {
                    resolve(el);
                }, duration);
            });
        });
        return new ScrambleBox(p);
    };

    exports.s = ScrambleBox;

}, (typeof window !== "undefined")?window:this);
