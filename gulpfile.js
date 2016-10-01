'use strict';

const fs = require('fs');

const gulp = require('gulp');
const handlebars = require('gulp-compile-handlebars');
const rename = require('gulp-rename');
const uglify = require('gulp-uglify');
const pump = require('pump');

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
            },
            helpers: {
                chars: function() {
                    const result = [];
                    for ( let i = 0; i < this.symbols.length; ++i ) {
                        result.push("\"" + this.symbols[i] + "\"");
                    }
                    return result;
                }
            }
        };

        return gulp.src('src/*.js')
            .pipe(handlebars(data, options))
            .pipe(gulp.dest('dist/'))
    }).catch((err) => {

        throw err;
    });
});

gulp.task('minify', ['build'], (cb) => {
    const uglifyOpts = {
        preserveComments: 'license'
    };

    /**
     * gulp-uglify recommends the use of the `pump` module
     * for better error reporting
     *
     * https://github.com/terinjokes/gulp-uglify/tree/master/docs/why-use-pump
     */
    pump([
        gulp.src('dist/*[!.min].js'),
        uglify(uglifyOpts),
        rename({suffix: '.min'}),
        gulp.dest('dist/')
    ], cb);
});

gulp.task('default', ['build', 'minify']);
