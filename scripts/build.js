#!/usr/bin/env node
'use strict';

const Fs = require('fs');
const Path = require('path');
const Uglifyjs = require('uglify-js');

const config = {
    src: 'src/scramble.js',
    dest: 'dist/scramble.js',
    destMin: 'dist/scramble.min.js',
    entities: 'entities.json',
    chars: 'chars.txt'
};

/**
 * load a bunch of files.
 *
 * @param {object} manifest An object specifying the files you want to load
 * @returns {object} An object containing the contents of the files
 */
const loadFiles = function(manifest) {

    let files = [];
    Object.keys(manifest).forEach((key) => {
        files.push({
            path: manifest[key],
            name: key
        });
    });


    const tasks = files.map((file) => {

        return new Promise((resolve, reject) => {

            Fs.readFile(file.path, {encoding: 'utf-8'}, (err, data) => {

                err?reject(err):resolve(data);
            });
        });
    });


    return Promise.all(tasks)
        .catch((err) => {

            process.nextTick(() => {

                throw err;
            });
        })
        .then((results) => {

            let finalOut = {};
            for ( let i = 0; i < results.length; ++i ) {
                finalOut[files[i].name] = results[i];
            }
            return finalOut;
        })
}


/**
 * ensure that a directory tree exists
 *
 * @param path {string} path
 * @throws {Error} any error encountered during directory creation
 */
const ensureDirectory = function(path) {

    const exists = (path) => {
        try {
            return Fs.statSync(path).isDirectory();
        } catch(e) {
            return false;
        }
    };

    if ( !exists(path) ) {
        ensureDirectory(Path.dirname(path));
        Fs.mkdirSync(path);
    }
}

if ( require.main === module ) {

    const manifest = {
        ent: config.entities,
        chars: config.chars,
        src: config.src
    };

    loadFiles(manifest).then((files) => {

        const ent = JSON.parse(files.ent);
        let chars = files.chars.split('');
        chars = chars.map((c) => {
            return ent[c] || c;
        });

        const target = '__build_1__';
        const result = files.src.replace(target, "['" + chars.join("','") + "']");

        ensureDirectory(Path.dirname(config.dest));
        Fs.writeFileSync(config.dest, result, { encoding: 'utf-8' });

        // minify
        const minified = Uglifyjs.minify(result, { fromString: true }).code;
        Fs.writeFileSync(config.destMin, minified, { encoding: 'utf-8' });

    }).catch((err) => {
        
        process.nextTick(() => {

            throw err;
        });
    });
}

