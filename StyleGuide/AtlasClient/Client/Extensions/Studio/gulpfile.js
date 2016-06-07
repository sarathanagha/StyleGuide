/// <vs AfterBuild='build' />
/// <binding AfterBuild='build' />

var gulp = require("gulp"),
    typescript = require("gulp-typescript"),
    tsc = require("gulp-tsc"),
    sass = require("gulp-sass"),
    sourcemaps = require("gulp-sourcemaps"),
    autoprefixer = require("gulp-autoprefixer"),
    exec = require('child_process').exec,
    path = require("path"),
    del = require("del"),
    es = require("event-stream"),
    runSequence = require('run-sequence');

var SRC_DIR = "./src/",
    OUTPUT_DIR = "./bin/";

function handleError(buildError) {
    console.log(buildError.toString());
    throw buildError;
}

var MODULES_DIR = SRC_DIR + "scripts/Module/*.ts"

gulp.task("build-ts-internal", function () {
    return gulp.src(MODULES_DIR)
        .pipe(tsc({
            target: "ES5",
            module: "amd",
            declaration: true,
            sourcemap: true,
            out: "Module.js",
            outDir: OUTPUT_DIR
        }))
        .pipe(gulp.dest(OUTPUT_DIR));
});

var tsProject = typescript.createProject({
    target: "ES5",
    module: "amd",
    outDir: "./",
    typescript: require("typescript")
});

var EXTENSION_NAME = "Studio";
var DATA_FACTORY_PATH = "datastudio-datafactory/";

// fixes bad paths and puts them in the right place
function fixSrcPath(fixRequire){
    return es.map(function(file, cb){
            file.path = file.path.replace(/^.*\\Studio\\/, file.cwd + "\\");
            file.base = file.cwd + "\\src\\";

            if(fixRequire){
                file.contents = new Buffer(file.contents.toString().replace(/\..\/..\/..\/..\/DataFactory\/src\//g, DATA_FACTORY_PATH));
            }

            cb(null, file);
    });
}

gulp.task("build-ts-external", function () {
    //TODO: Compile script files in isolation from each other.
    return gulp.src([
        SRC_DIR + "**/*.ts", "!" + MODULES_DIR, "!" + SRC_DIR + "**/*.d.ts"
    ])
    .pipe(typescript(tsProject))
    .pipe(fixSrcPath(true))
    .pipe(gulp.dest(OUTPUT_DIR ));
});

gulp.task("build-ts", function(cb){
    runSequence("build-ts-internal", "build-ts-external", cb);
});

gulp.task('remove-readonly-attributes', function (cb) {
  exec('attrib -r ' + OUTPUT_DIR + 'views/*.css /s', function (err, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
    cb();
  });
});

gulp.task("build-sass", ['remove-readonly-attributes'], function () {
    return gulp.src(SRC_DIR + "./views/**/*.scss")
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', handleError))
        .pipe(autoprefixer("last 1 version", "> 1%", "ie 8", "ie 7"))
        .pipe(sourcemaps.write("./"))
        .pipe(fixSrcPath())
        .pipe(gulp.dest(OUTPUT_DIR));
});

gulp.task('clean', function (cb) {
    del.sync(OUTPUT_DIR);
    cb();
});

gulp.task("copy-static", function(){
   return gulp.src([SRC_DIR + "**/*.html", SRC_DIR + "**/*.svg", SRC_DIR + "package.json"])
    .pipe(gulp.dest(OUTPUT_DIR));
});

gulp.task("build", ["build-ts", "build-sass", "copy-static"]);

gulp.task("default", function(cb){
    runSequence("clean", "build", cb);
});
