/**
 *
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

'use strict';

(function() {

    var MIN_FLIP = 1;
    var MAX_FLIP = 7;

    var MIN_INTERVAL = 70;
    var MAX_INTERVAL = 90;

    var MIN_DELAY = 10;
    var MAX_DELAY = 50;

    var chars = ["a", "b", "c", "d", "e", "f",
                 "g", "h", "i", "j", "k", "l",
                 "m", "n", "o", "p", "q", "r", 
                 "s", "t", "u", "v", "w", "x",
                 "y", "z", "0", "1", "2", "3",
                 "4", "5", "6", "7", "8", "9",
                 "&excl;", "&quest;", "&midast;",
                 "&lpar;", "&rpar;", "&commat;", 
                 "&pound", "&dollar;", "&percnt;",
                 "&Hat;", "&amp;", "&UnderBar;", "-",
                 "&plus;", "&equals;", "&lsqb;", "&rbrack;",
                 "&lcub;", "&rcub;", "&colon;", "&semi;", 
                 "&apos;", "&QUOT;", "&bsol;", "&VerticalLine;",
                 "&LT", "&GT", "&comma;", "&period;", "&sol;",
                 "~", "&DiacriticalGrave;"]

    function scaffold(el) {

        if (el.children.length !== 0) {
            return;
        }

        var baseString = el.innerHTML.split('');
        var replacement = "";
        baseString.forEach(function(c) {
            replacement += "<span data-original='" + c + "'>" + c + "</span>"
        });
        
        el.innerHTML = replacement;
        el.className += "js-scramble";
    }

    function _getRandomChar() {
        var index = Math.floor(Math.random() * chars.length);
        return chars[index];
    }

    function getRandomChars(n) {
        /* get a list of n random chars */
        var list = [];
        for ( var i = 0; i < n; ++i ) {
            list.push(_getRandomChar());
        }
        return list;
    }

    function getRandomValue(min, max) {
        /* get a list of random values between min and max */
        return min + Math.floor(Math.random() * (max - min));
    }

    function hasClass(el, cls) {
        return el.className.indexOf(cls) != -1;
    }

    function domListToArray(dl) {
        /* convert DOM list to an Array. Doesn't for for IE8 or less */
        return [].slice.call(dl, 0);
    }
    function queueAnimation(el, cb) {
        /* cb takes the arguments (el, chars, id) */

        if ( !hasClass(el, "js-scramble") ) {
            scaffold(el);
        }

        var actors = domListToArray(el.children);
        actors.forEach(function(actor) {
            var delay = getRandomValue(MIN_DELAY, MAX_DELAY);
            setTimeout(function() {
                var n = getRandomValue(MIN_FLIP, MAX_FLIP);
                var ch = getRandomChars(n);
                var interval = getRandomValue(MIN_INTERVAL, MAX_INTERVAL);
                var id = setInterval(function() {
                    cb(actor, ch, id);
                }, interval);
            }, delay);
        });
    }

    function enscramble(el) {
        queueAnimation(el, function(actor, chars, id) {
            if ( chars.length == 0 ) {
                clearInterval(id);
                return;
            }
            actor.innerHTML = chars.pop();
        });
    }

    function descramble(el) {
        queueAnimation(el, function(actor, chars, id) {
            if ( chars.length == 0 ) {
                clearInterval(id);
                actor.innerHTML = actor.dataset.original;
                return;
            }
            actor.innerHTML = chars.pop();
        });
    }

    /* exports */
    window.scramble = {
        enscramble: enscramble,
        descramble: descramble
    };
})()
