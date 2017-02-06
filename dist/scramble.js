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

'use strict';

/* global Promise, define, module, exports, window */

// eslint-disable-next-line no-extra-semi
;(function(factory) {

    if ( typeof Promise === 'undefined' ) {
        throw new Error('scramblejs requires the Promise API');
    }

    if ( typeof module === 'object' &&
         typeof module.exports === 'object' ) {
        
        // this is a commonjs aware system
        // ... or someone has really gone and done it
        module.exports = factory();
    } else if ( typeof define === 'function' ) {

        // this is _probably_ an AMD system
        define([], factory);
    } else {

        // we are operating inside a browser environment
        // ... probably
        window.Scramble = factory();
    }
    
})(function() {

    var exports = Object.create(null);
    var module = { exports: exports };
    
    var globalConfig = {
        minFlip: 1,
        maxFlip: 7,
        minInterval: 150,
        maxInterval: 100,
        minDelay: 10,
        maxDelay: 50
    };

    /**
     * __build_*__ act as a macro for substitution by the build
     * system
     */

    // eslint-disable-next-line no-undef
    var chars = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z','0','1','2','3','4','5','6','7','8','9','0','&excl;','&quest;','&midast;','&lpar;','&rpar;','&commat;','&pound','&dollar;','&percnt;','&Hat;','&amp;','&UnderBar;','-','&plus;','&equals;','&lsqb;','&rbrack;','&lcub;','&rcub;','&colon;','&semi;','&bsol;','&apos;','&QUOT;','&VerticalLine;','&LT','&GT','&comma;','&period;','&sol;','~','&DiacriticalGrave;','&NewLine;'];

    var clone = function(obj) {
        return JSON.parse(JSON.stringify(obj));
    };

    var placeholder = function(ch) {
        return '<span data-ch="' + ch + '">' + ch + '</span>';
    };

    var scaffoldElement = function(el) {

        if ( !(el instanceof Element) ) {
            var message = 'scramble: not a DOM Element';
            console.warn(message);
            throw new Error(message);
        }

        if ( hasClass(el, 'js-scramble') ) {
            return;
        }

        var baseString = el.innerHTML.split('');
        var replacement = '';
        baseString.forEach(function(c) {
            replacement += placeholder(c);
        });

        el.innerHTML = replacement;

        var classes = el.className.split(' ');
        classes.push('js-scramble');
        el.className = classes.join(' ');
    };

    /**
     * randomChars(n)
     *
     * build a list of random characters
     */
    var randomChars = function(n) {
        var list = [];
        for ( var i = 0; i < n; ++i ) {
            var index = Math.floor(Math.random() * chars.length);
            list.push(chars[index]);
        }
        return list;
    };

    /**
     * randomValue(min, max)
     *
     * get a random value between min and mix
     */
    var randomValue = function(min, max) {
        return min + Math.floor(Math.random() * (max - min));
    };

    var hasClass = function(el, cls) {
        var re = new RegExp('\\b' + cls + '\\b');
        return re.test(el.className);
    };

    /**
     * domListToArray(domList)
     *
     * convert DOM list to an Array. Doesn't work for for IE8 or less
     */
    var domListToArray = function(dl) {
        return Array.prototype.slice.call(dl, 0);
    };

    /**
     * queueAnimation(el, cb, config)
     *
     * This function is used to schedule animation for every element.
     * 
     * cb is the function that is responsible for updating the
     * respective elements.  it takes the args (actor, ch, interval),
     * where actor is the dom element, ch is a list of characters, and
     * interval is the time between the character switches.
     */
    var queueAnimation = function(el, cb, config) {

        scaffoldElement(el);

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
    };

    var setConfig = function(config, newConfig) {

        config = clone(config);
        if ( typeof newConfig !== 'object' || newConfig.hasOwnProperty('length') ) {
            console.error('scramble: config: was expecting an object, got ' + newConfig);
            return;
        }

        var validProps = ['delay', 'flip', 'interval'];

        for ( var prop in newConfig ) {
            var p = prop[0].toUpperCase() + prop.slice(1);
            if ( validProps.indexOf(prop) === -1 ) {
                console.warn('scramble: config: unrecognized config parameter: ' + prop);
            } else if ( typeof newConfig[prop] === 'number' ) {
                config['min'+p] = newConfig[prop];
                config['max'+p] = newConfig[prop];
            } else if ( typeof newConfig[prop] === 'object' ) {
                config['min'+p] = newConfig[prop].min || config['min'+p];
                config['max'+p] = newConfig[prop].max || config['max'+p];
            } else {
                console.warn('scramble: config: config field values must be a number or an object');
            }
        }

        return config;
    };

    var Grinder = function(element, config) {

        if ( !(this instanceof Grinder) ) {
            throw Error('objects must be constructed using the new keyword');
        }

        config = config || globalConfig;
        this._origin = Promise.resolve(element);
        this._config = config;
    };
    
    Grinder.prototype.enscramble = function() {
        
        var self = this;
        var p = this._origin.then(function(el) {

            scaffoldElement(el);
            var count = el.children.length;
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

                queueAnimation(el, _enscramble, self._config);
            });
        });

        return new Grinder(p, this._config);
    };

    Grinder.prototype.descramble = function() {

        var self = this;
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
                queueAnimation(el, _descramble, self._config);
            });
        });

        return new Grinder(p, this._config);
    };
                

    Grinder.prototype.then = function(success, error) {

        return this._origin.then(success, error);
    };

    Grinder.prototype.catch = function(cb) {

        return this._origin.catch(cb);
    };

    Grinder.prototype.wait = function(duration) {

        var p = this._origin.then(function(el) {

            return new Promise(function(resolve, reject) {

                setTimeout(function() {
                    resolve(el);
                }, duration);
            });
        });

        return new Grinder(p, this._config);
    };

    Grinder.prototype.setConfig = function(newConfig) {

        this._config = setConfig(this._config, newConfig);
        return this;
    };

    var textAlignment = exports.align = {
        left: function(actors, text) {
            for ( var i = 0; i < actors.length; ++i ) {
                actors[i].dataset.ch = text[i] || '&nbsp';
            }
        },
        right: function(actors, text) {
            var start = actors.length - text.length;
            for ( var i = 0; i < actors.length; ++i ) {
                var ch;
                if ( i < start ) {
                    ch = '&nbsp';
                } else {
                    ch = text[i-start];
                }
                actors[i].dataset.ch = ch;
            }
        },
        center: function(actors, text) {
            var padding = actors.length - text.length;
            var start = padding / 2;
            var end = actors.length - padding + start;
            for ( var i = 0; i < actors.length; ++i ) {
                var ch;
                if ( i < start || i >= end ) {
                    ch = '&nbsp';
                } else {
                    ch = text[i-start];
                }
                actors[i].dataset.ch = ch;
            }
        }
    };

    Grinder.prototype.setText = function(text, align) {

        var p = this._origin.then(function(el) {
            
            return new Promise(function(resolve, reject) {

                if ( typeof text !== 'string' ) {
                    console.error('scramble: setText: text must be a string, got: ' + typeof text);
                    return reject('error');
                }


                var i;
                scaffoldElement(el);
                var actors = el.children;

                if ( text.length > actors.length ) {

                    var padding = text.length - actors.length;
                    for ( i = 0; i < padding; ++i ) {
                        el.appendChild(document.createElement('span'));
                    }
                }

                align = align || textAlignment.left;
                if ( typeof align !== 'function' ) {
                    console.warn('scramble: setText: \'align\' must be a function (fallback to left alignment)');
                    align = textAlignment.left;
                }
                align(actors, text);

                return resolve(el);
            });
        });

        return new Grinder(p, this._config);
    };

    Grinder.prototype.createEmpty = function(length, padding) {

        padding = padding || '&nbsp;';
        var p = this._origin.then(function(el) {

            return new Promise(function(resolve, reject) {

                if ( typeof length !== 'number' ) {
                    console.error('scramble: createEmpty: length must be a number, got: ' + typeof length);
                    return;
                }

                var components = '';
                for ( var i = 0; i < length; ++ i ) {
                    components += placeholder(padding);
                }

                el.innerHTML = components;

                if ( !hasClass(el, 'js-scramble') ){
                    var classes = el.className.split(' ');
                    classes.push('js-scramble');
                    el.className = classes.join(' ');
                }

                return resolve(el);
            });
        });

        return new Grinder(p, this._config);
    };


    var selectElement = function(sel) {

        var el;
        if ( sel instanceof Element ) {
            el = sel;
        } else {
            el = document.querySelector(sel);
        }
        return el;
    };

    Grinder.prototype.select = function(sel) {

        var p = this._origin.then(function(el) {

            return selectElement(sel);
        });

        return new Grinder(p, this._config);
    };

    exports.select = function(sel) {

        var el = selectElement(sel);
        return new Grinder(el);
    };

    exports.setConfigGlobal = function(newConfig) {

        globalConfig = setConfig(globalConfig, newConfig);
    };

    return module.exports;
});
