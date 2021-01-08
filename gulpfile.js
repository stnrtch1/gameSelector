var gulp = require('gulp');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var sourcemaps = require('gulp-sourcemaps');

sass.compiler = require('node-sass');

function compSass() {
    return gulp.src([
        './scss/**/*.scss'
    ])
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(concat('styles.css'))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./css'));
}

exports.default = () => {
    gulp.watch('./scss/**/*.scss', gulp.series(compSass));
};