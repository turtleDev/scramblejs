'use strict';

const fs = require('fs');

const gulp = require('gulp');
const handlebars = require('gulp-compile-handlebars');
const rename = require('gulp-rename');
const uglify = require('gulp-uglify');

/**
 * load a bunch of files.
 *
 * @param {object} manifest An object specifying the files you want to load
 * @returns {object} An object containing the contents of the files
 */
function loadFiles(manifest) {

    let files = [];
    for ( let name in manifest ) {
        files.push({
            path: manifest[name],
            name: name
        });
    }

    const tasks = files.map((file) => {

        return new Promise((resolve, reject) => {

            fs.readFile(file.path, {encoding: 'utf-8'}, function(err, data) {
                if ( err ) {
                    reject(err);
                } else {
                    resolve(data);
                }
            });
        });
    });


    return Promise.all(tasks)
        .catch((err) => {

            throw err;
        })
        .then((results) => {

            let finalOut = {};
            for ( let i = 0; i < results.length; ++i ) {
                finalOut[files[i].name] = results[i];
            }
            return finalOut;
        });
}

gulp.task('build', function() {
    return loadFiles({
        ent: 'entities.json',
        chars: 'chars.txt'
    }).then((result) => {

        const ent = JSON.parse(result.ent);
        let chars = result.chars.split('');
        chars = chars.map(function(c) {
            return ent[c] || c;
        });

        const data = {
            symbols: chars
        };

        const options = {
            compile: {
                noEscape: true
            }
        };

        return new Promise((resolve, reject) => {
            gulp.src('src/*.js')
                .pipe(handlebars(data, options))
                .pipe(gulp.dest('dist/'))
                .on('end', resolve)
        }).then(() => {
            // find a way to run this in a seperate task
            return new Promise((resolve, reject) => {
                // if for some reason uglify() fucks up
                // you'll need to use pump() to determine what went wrong
                // look up docs for gulp-uglify
                const uglifyOpts = {
                    preserveComments: 'license'
                };
                gulp.src('dist/*[!.min].js')
                    .pipe(uglify(uglifyOpts))
                    .pipe(rename({suffix: '.min'}))
                    .pipe(gulp.dest('dist/'))
                    .on('end', resolve)
            });
        });
    }).catch((err) => {

        throw err;
    });
});

    

gulp.task('default', ['build']);
