'use strict';

var gulp = require('gulp');
var watchify = require('watchify');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var gutil = require('gulp-util');
var buffer = require('vinyl-buffer');
var rename = require('gulp-rename');
var reactify = require('reactify');
var sourcemaps = require("gulp-sourcemaps");
var sass = require('gulp-sass');

gulp.task('js',bundle);
var bundler = watchify(browserify("./index.js", watchify.args));
bundler.transform(reactify);
bundler.on('update',bundle); // that's why we need bundle func instead write it inside
bundler.on('log',gutil.log);
function bundle(){
  return  bundler.bundle()
            .on('error', gutil.log.bind(gutil,'Browserify error'))
            .pipe(source('bundle.js'))
            .pipe(buffer())
            .pipe(sourcemaps.init({loadMaps:true}))
            .pipe(sourcemaps.write('./'))
            .pipe(gulp.dest('./'))
}

gulp.task('sass', function () {
  gulp.src(['./index.scss','../style.scss'])
    .pipe(sourcemaps.init())
    .pipe(sass({
      errLogToConsole:true
    }))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./'));
});

gulp.task('watch', function () {
  gulp.watch(['./*.scss'], ['sass']);
  gulp.watch(['../style.scss'], ['sass']);
});

gulp.task("default",["sass","watch",'js']);
