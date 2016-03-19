'use strict';

(function() {

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
        console.log(replacement);
        
        el.innerHTML = replacement;
    }

    function getRandomChar() {
        var index = Math.floor(Math.random() * chars.length);
        var ch = chars[index];
    }


    // debug
    window.getRandomChar = getRandomChar;
})()
