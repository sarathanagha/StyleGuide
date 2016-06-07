/// <vs AfterBuild='build' />
/// <binding AfterBuild='build' />

var gulp = require("gulp"),
    sass = require("gulp-sass"),
    sourcemaps = require("gulp-sourcemaps"),
    autoprefixer = require("gulp-autoprefixer"),
    exec = require('child_process').exec,
    path = require("path");

function handleError(buildError) {
    console.log(buildError.toString());
    throw buildError;
}

gulp.task('remove-readonly-attributes-stylesheets', function (cb)
{
    exec('attrib -r ./stylesheets/*.css /s', function (err, stdout, stderr)
    {
        console.log(stdout);
        console.log(stderr);
        cb(); // we should not fail this task, to support development scenarios on non-Windows OS.
    });
});

gulp.task("build-sass", function () {
    return gulp.src("./stylesheets/*.scss")
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', handleError))
        .pipe(autoprefixer("last 1 version", "> 1%", "ie 8", "ie 7"))
        .pipe(sourcemaps.write("./"))
        .pipe(gulp.dest("./stylesheets"));
});

gulp.task("build", ["remove-readonly-attributes-stylesheets", "build-sass"]);

gulp.task("default", ["build"]);

