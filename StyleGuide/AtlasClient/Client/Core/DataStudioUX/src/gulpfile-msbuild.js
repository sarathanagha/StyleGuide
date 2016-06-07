var gulp = require("gulp"),
sass = require("gulp-sass"),
sourcemaps = require("gulp-sourcemaps"),
autoprefixer = require("gulp-autoprefixer"),
exec = require('child_process').exec,
stripLine = require("gulp-strip-line");

function handleError(buildError) {
    console.log(buildError.toString());
    throw buildError;
}

gulp.task('remove-readonly-attributes', function (cb) {
    exec('attrib -r ./lib/*.* /s', function (err, stdout, stderr) {
        console.log(stdout);
        console.log(stderr);
        cb();
    });
});

gulp.task("build-sass", ['remove-readonly-attributes'], function () {
return gulp.src("./**/*.scss")
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', handleError))
    .pipe(autoprefixer("last 1 version", "> 1%", "ie 8", "ie 7"))
    .pipe(sourcemaps.write("./"))
    .pipe(gulp.dest("./lib"));
});

gulp.task("build-fix-dts", function () {
    gulp.src(["./lib/**/*.ts", "./lib/**/*.js"])
        .pipe(stripLine(/references.d.ts/))
    .pipe(gulp.dest("./lib"));
});

// Build tasks
gulp.task("default", ["build-sass", "build-fix-dts"]);
