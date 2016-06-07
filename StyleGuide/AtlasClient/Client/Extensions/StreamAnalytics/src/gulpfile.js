/// <vs AfterBuild='build' />
/// <binding AfterBuild='build' />

var gulp = require("gulp"),
    typescript = require("gulp-tsc"),
    sass = require("gulp-sass"),
    sourcemaps = require("gulp-sourcemaps"),
    autoprefixer = require("gulp-autoprefixer"),
    exec = require('child_process').exec,
    path = require("path");

function handleError(buildError) {
    console.log(buildError.toString());
    throw buildError;
}

gulp.task("build-ts-app", function () {
    return gulp.src(["./scripts/**/*.ts", "!./scripts/Startup.ts"])
        .pipe(typescript({
            target: "ES5",
            module: "amd",
            declaration: true,
            sourcemap: true,
            out: "Module.js",
            outDir: "./"
        }))
        .pipe(gulp.dest("./"));
});

gulp.task("build-ts-startup", ["build-ts-app"], function () {
    return gulp.src(["./scripts/Startup.ts"])
        .pipe(typescript({
            target: "ES5",
            module: "amd",
            sourcemap: true,
            outDir: "./"
        }))
        .pipe(gulp.dest("./"));
});

gulp.task("build-ts-views", ["build-ts-app"], function () {
    //TODO: Compile script files in isolation from each other.
    return gulp.src([
        "./views/**/*.ts"
    ])
        .pipe(typescript({
            target: "ES5",
            module: "amd",
            sourcemap: true,
            outDir: "./views"
        }))
        .pipe(gulp.dest("./views"));
});

gulp.task("build-ts", ["build-ts-app", "build-ts-startup", "build-ts-views"]);


gulp.task('remove-readonly-attributes', function (cb) {
  exec('attrib -r ./views/*.css /s', function (err, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
    cb();
  });});

gulp.task("build-sass", ["remove-readonly-attributes"], function () {
    return gulp.src("./views/**/*.scss")
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', handleError))
        .pipe(autoprefixer("last 1 version", "> 1%", "ie 8", "ie 7"))
        .pipe(sourcemaps.write("./"))
        .pipe(gulp.dest("./views"));
});

gulp.task("build", ["build-ts", "build-sass"]);

gulp.task("default", ["build"]);
