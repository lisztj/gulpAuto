var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var ts = require("gulp-typescript");
var concat = require('gulp-concat');
var rimraf = require("rimraf");
var sample = require('./sample');
var runSequence = require('run-sequence');

var paths = {
    script: {
        allJS: 'dist/src/*.js'
    },
    typescript: {
        service: 'src/*.ts',
        allTs: ['src/*.ts'],

    },
    dirname: 'dist/src'
}

/**sample */
gulp.task('sample', function() {
    return gulp.src(paths.typescript.allTs, { buffer: true })
        .pipe(sample())
        .pipe(gulp.dest('dist'))
});

//清除dist/src下文件
gulp.task("clean", function(cb) {
    rimraf('dist/src', cb);
});
gulp.task("clean:dist", function(cb) {
    return gulp.src(['dist/*'], { read: false }) // much faster 
        .pipe($.clean());
})

//typescript
gulp.task("typescript", ['build:config'], function() {
    var tsResult = gulp.src(paths.typescript.allTs)
        .pipe($.changed('../src', { extension: '.ts' }))
        // .pipe($.typescript(tsProject))
        .pipe($.plumber())
        .pipe($.connect.reload());
    return tsResult.pipe(gulp.dest('dist/src'));
});

/**
 * 编译ts并压缩所有js
 */
gulp.task('build:config', function() {
    return gulp.src(paths.typescript.allTs)
        .pipe(ts({
            target: "es5",
            noImplicitAny: false,
            module: "none",
            removeComments: true,
            sourceMap: false
        }))
});

gulp.task('build:ts', ['build:config'], function() {
    var tsResult = gulp.src(paths.typescript.allTs)
        .pipe(ts({
            target: "es5",
            noImplicitAny: false,
            module: "none",
            removeComments: true,
            sourceMap: false
        }))
        .pipe($.uglify())
        .pipe($.plumber())
    return tsResult.pipe(gulp.dest('dist/src'));
});


gulp.task('build', function(callback) {
    runSequence(
        "clean:dist", ['sample'],
        callback)
});