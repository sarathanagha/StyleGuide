/// <vs AfterBuild='build' />
/// <binding AfterBuild='build' />

var gulp = require("gulp"),
    typescript = require("gulp-tsc"),
    jade = require('gulp-jade'),
    sass = require("gulp-sass"),
    sourcemaps = require("gulp-sourcemaps"),
    autoprefixer = require("gulp-autoprefixer"),
    exec = require('child_process').exec,
    fs = require("fs"),
    runSequence = require('run-sequence'),
    path = require("path");

function handleError(buildError) {
    console.log(buildError.toString());
    throw buildError;
}

gulp.task("build-ts-core", function () {
    return gulp.src(["./service/**/*.ts", "!./service/**/*.d.ts"])
        .pipe(typescript({
            target: "ES5",
            module: "amd",
            declaration: true,
            sourcemap: true,
            outDir: "./service/"
        }))
        .pipe(gulp.dest("./service/"));
});


gulp.task("build-ts-views", ["build-jade", "build-ts-core"], function () {
    //TODO: Compile script files in isolation from each other.
    return gulp.src(["./views/**/*.ts"])
        .pipe(typescript({
            target: "ES5",
            module: "amd",
            declaration: true,
            sourcemap: true,
            outDir: "views"
        }))
        .pipe(gulp.dest("views"));
});

gulp.task("build-ts", ["build-ts-core", "build-ts-views"]);

gulp.task('remove-readonly-attributes', function (cb) {
  exec('attrib -r ./views/*.css /s', function (err, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
  });
  
  exec('attrib -r ./views/*.html /s', function (err, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
    cb();
  });
});

gulp.task("build-sass", ['remove-readonly-attributes'], function () {
    return gulp.src("./views/**/*.scss")
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', handleError))
        .pipe(autoprefixer("last 1 version", "> 1%", "ie 8", "ie 7"))
        .pipe(sourcemaps.write("./"))
        .pipe(gulp.dest("./views"));
});

gulp.task("build-jade", ["remove-readonly-attributes"], function () {
   return gulp.src("./views/**/*.jade")
        .pipe(jade({
            locals: {}
        }))
        .pipe(gulp.dest("./views"));
});

gulp.task('clean', function () {
    var excludes = ['VivaGraphControl', 'ClientResources.js'];
    var deleteJSFilesRecursive = function (path) {
        if (fs.existsSync(path)) {
            fs.readdirSync(path).forEach(function (file, index) {
                if (excludes && excludes.indexOf(file) !== -1) {
                    return;
                }
                var curPath = path + "/" + file;

                if (fs.lstatSync(curPath).isDirectory()) { // recurse
                    deleteJSFilesRecursive(curPath);
                } else if (file.substring(file.length - 2) === "js") { // delete file

                    // TODO we should delete *js.map files as well
                    fs.unlinkSync(curPath);
                }
            });
        }
    };
});


gulp.task("build", ["build-ts", "build-sass", "build-jade"]);

gulp.task("default", function () {
    runSequence('clean', 'build');
});
