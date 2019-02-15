var gulp = require('gulp');
var del = require('del');
var image = require('gulp-image');
var sass = require('gulp-sass');
var pug = require('gulp-pug');
var babel = require('gulp-babel');
var browsersync = require('browser-sync').create();

var output = './dist';
var files = {
  pug: './app/index.pug',
  sass: './app/**/*.sass',
  es6: './app/**/*.js',
  img: './app/**/*.+(png|jpg)'
};


function browserSync () {
  browsersync.init({
    server: {
      baseDir: output
    }
  })
};

function browserSyncReload(done) {
  browsersync.reload;
  done();
};

function clean() {
  return del('dist/*', { force: true })
};

function images () {
  return gulp
    .src(files.img)
    .pipe(image())
    .pipe(gulp.dest(output))
};


function templates() {
  return gulp
    .src(files.pug)
    .pipe(pug())
    .pipe(gulp.dest(output))
    .pipe(browsersync.stream());
};

function styles() {
  return gulp
    .src(files.sass)
    .pipe(sass({ outputStyle: 'expanded' }))
    .pipe(gulp.dest(output))
    .pipe(browsersync.stream());
};


function scripts() {
  return gulp
    .src(files.es6)
    .pipe(babel({
      presets: ['@babel/env']
    }))
    .pipe(gulp.dest(output))
    .pipe(browsersync.stream());
};


function watchFiles() {
  gulp.watch(files.pug, gulp.series(templates, browserSyncReload))
  gulp.watch(files.sass, gulp.series(styles, browserSyncReload))
  gulp.watch(files.es6, gulp.series(scripts, browserSyncReload))
  gulp.watch(files.img, gulp.series(images, browserSyncReload))
};



gulp.task('clean', clean)
gulp.task('build', gulp.series(templates, styles, scripts, images));
gulp.task('watch', gulp.parallel(browserSync, watchFiles));
