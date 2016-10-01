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
        global.scramble = module.exports;
        factory(module, module.exports);
        if ( module.jQuery ) {
            delete global.scramble;
        }
    }
    
})(function(module, exports) {
    
    "use strict";

    var config = {
        minFlip: 1,
        maxFlip: 7,
        minInterval: 70,
        maxInterval: 140,
        minDelay: 10,
        maxDelay: 50
    };

    var chars = {{{chars}}};

    function placeholder(ch) {
        return "<span data-ch='" + ch + "'>" + ch + "</span>";
    }

    function scaffoldElement(el) {

        if (el.children.length !== 0) {
            return;
        }

        var baseString = el.innerHTML.split("");
        var replacement = "";
        baseString.forEach(function(c) {
            replacement += placeholder(c);
        });

        el.innerHTML = replacement;
        el.className += " js-scramble";
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
     * cb is the function that is responsible for update the element,
     * it takes the args (actor, ch, interval), where actor is the
     * dom element, ch is a list of characters, and interval is the
     * time between the character switches.
     */
    function queueAnimation(el, cb) {

        if ( !hasClass(el, "js-scramble") ) {
            scaffoldElement(el);
        }

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

        if ( !hasClass(el, "js-scramble") ) {
            scaffoldElement(el);
        }

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

    if ( module.jQuery ) {
        module.jQuery.fn.scramble = function(action, arg) {

            action = action || "enscramble";

            /* get list of selected DOM elements */
            var els = this.get();

            /**
             * methods that are not exposed from the jQuery interface
             */
            var blacklist = ["setConfig"];

            if ( exports[action] && blacklist.indexOf(action) == -1) {
                els.forEach(function(el) {
                    exports[action](el, arg);
                });
            } else if ( action == "export" ) {
                return exports;
            } else {
                console.error("scramble: unrecognized operation: " + action);
            }
            return this;
        };
    }
}, typeof window !== "undefined"?window:this);
