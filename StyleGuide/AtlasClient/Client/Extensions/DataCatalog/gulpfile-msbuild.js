/// <vs AfterBuild='build' />
/// <binding AfterBuild='build' />

var gulp = require("gulp"),
    sass = require("gulp-sass"),
    sourcemaps = require("gulp-sourcemaps"),
    autoprefixer = require("gulp-autoprefixer"),
    exec = require('child_process').exec;

function handleError(buildError) {
    console.log(buildError.toString());
    throw buildError;
}

gulp.task('remove-readonly-attributes', function (cb) {
    exec('attrib -r ./bin/views/*.css /s', function (err, stdout, stderr) {
        console.log(stdout);
        console.log(stderr);
        cb();
    });
});

gulp.task("build-sass", ["remove-readonly-attributes"], function () {
    return gulp.src("./src/views/**/*.scss")
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', handleError))
        .pipe(autoprefixer("last 1 version", "> 1%", "ie 8", "ie 7"))
        .pipe(sourcemaps.write("./"))
        .pipe(gulp.dest("./bin/views"));
});
