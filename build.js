'use strict';

var hbs = require("handlebars");
var fs = require("fs");
var async = require("async");
var path = require("path");

var inFile = "./src/scramble.js.hbs";
var outFile = "./dist/scramble.js";

var ent = "./entities.json";
var chars = "./chars.txt";

async.map([inFile, ent, chars], fs.readFile, function(err, data) {
    if ( err ) {
        console.error(err);
        process.exit(0);
    }

    var raw = data[0].toString();
    var ent = data[1].toString();
    var chars = data[2].toString().split('');

    ent = JSON.parse(ent);

    chars = chars.map(function(char) {
        return ent[char] || char;
    });
    debugger;
    
    var template = hbs.compile(raw, {noEscape: true});
    var output = template({symbols:chars});

    try {
        fs.mkdirSync(path.dirname(outFile))
    } catch(e) {
        if ( e.code != 'EEXIST' )
            throw(e);
    }

    fs.writeFile(outFile, output, function(err) {
        if ( err ) {
            console.error(err);
        }
        console.log("build success!");
        console.log(outFile);
    });
});

