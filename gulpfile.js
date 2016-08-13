var gulp         = require('gulp'),
    browserSync  = require('browser-sync').create(),
    sass         = require('gulp-sass'),
    sourcemaps   = require('gulp-sourcemaps'),
    autoprefixer = require('gulp-autoprefixer'),
    cssnano      = require('gulp-cssnano'),
    concat       = require('gulp-concat'),
    uncss        = require('gulp-uncss'),
    uglify       = require('gulp-uglify'),
    rename       = require('gulp-rename'),
    include      = require('gulp-include'),
    del          = require('del'),
    gutil        = require('gulp-util'),
    imagemin     = require('gulp-imagemin'),
    htmlmin      = require('gulp-htmlmin'),
    newer        = require('gulp-newer');

// Asset p
var src  = {
    sass  : ['src/sass/**/*.sass'],
    bulma : ['src/bulma.sass'],
    js    : ['src/js/**/*.js'],
    assets: ['src/assets/**/*'],
    html  : ['*.html']
};
var dist = 'dist/';


// Task: Static server with Browser Sync
gulp.task('browser-sync', ['sass'], function(gulpCallback) {
    browserSync.init({
        server: {
            baseDir: dist
        }
    }, function callback() {
        gulp.watch(src.html).on('change', browserSync.reload);
        gulp.watch(src.js).on('change', browserSync.reload);
        gulp.watch(src.assets).on('change', browserSync.reload);
        gulp.watch(src.sass, ['sass']);
        gulpCallback();
    });
});

// TASK: Html loading
gulp.task('html', function() {
    return gulp.src(src.html)
        .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(gulp.dest(dist));
});


// TASK: Compile Sass
gulp.task('sass', function() {
    return gulp.src(src.bulma)
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest(dist + 'css/'));
});


// TASK: Concatenate & Minify JS Files
gulp.task('scripts', function() {
    return gulp.src(src.js)
        .pipe(include())
        .on('error', console.log)
        //        .pipe(gulp.dest(dist + 'js/'))
        //        .pipe(uglify().on('error', gutil.log))
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest(dist));
});

// TASK: Image Optimization
gulp.task('images', function() {
    return gulp.src(src.assets)
        .pipe(newer(dist + 'img/'))
        .pipe(imagemin({
            optimizationLevel: 3,
            progressive      : true,
            interlaced       : true
        }))
        .pipe(gulp.dest(dist + 'img/'));
});

// TASK: Watch for changes
gulp.task('watch', function() {
    gulp.watch(src.html, ['html']);
    gulp.watch(src.bulma, ['sass']);
    gulp.watch(src.js, ['scripts']);
    gulp.watch('src/assets', ['images']);
});

gulp.task('clean', function(cb) {
    del([dist + '*'], cb);
});

gulp.task('build', ['clean'], function() {
    return gulp.src(dist + 'css/*.css')
        .pipe(uncss({
            html: [src.html]
        }))
        .pipe(cssnano())
        .pipe(gulp.dest(dist + 'css/'));
});

gulp.task('default', ['browser-sync', 'html', 'sass', 'scripts', 'images', 'watch']);