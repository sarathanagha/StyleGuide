/// <vs AfterBuild='build' />
/// <binding AfterBuild='build' />

var gulp = require("gulp"),
    sass = require("gulp-sass"),
    sourcemaps = require("gulp-sourcemaps"),
    autoprefixer = require("gulp-autoprefixer"),
    exec = require('child_process').exec,
    path = require("path"),
    runSequence = require('run-sequence'),
    gutil = require('gulp-util'),
    svgSprite = require('gulp-svg-sprite'),
    svg2png = require('gulp-svg2png'),
    size = require('gulp-size'),
    basePaths = {
        src: './src/views/home/icons/',
        dest: './src/views/home/design/'
    },
    paths = {
    images: {
        src: basePaths.src + 'img/',
        dest: basePaths.dest + 'img/'
    },
    sprite: {
        src: basePaths.src + '*.svg',
        svg: 'img/sprite.svg',
        css: '../../' + basePaths.src + 'sass/src/_sprite.scss'
    }
    };

var changeEvent = function (evt) {
    gutil.log('File', gutil.colors.cyan(evt.path.replace(new RegExp('/.*(?=/' + basePaths.src + ')/'), '')), 'was', gutil.colors.magenta(evt.type));
};

function handleError(buildError) {
    console.log(buildError.toString());
    throw buildError;
}
var SRC_DIR = "./src/";

gulp.task('remove-readonly-attributes', function (cb) {
    exec('attrib -r ./bin/views/*.css /s', function (err, stdout, stderr) {
        console.log(stdout);
        console.log(stderr);
        cb();
    });
});

gulp.task("build-sass-core", function () {
    return gulp.src("./src/views/**/*.scss")
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', handleError))
        .pipe(autoprefixer("last 1 version", "> 1%", "ie 8", "ie 7"))
        .pipe(sourcemaps.write("./"))
        .pipe(gulp.dest("./bin/views"));
});

gulp.task("build-sass", function (cb) {
    runSequence("build-sass-core", "remove-readonly-attributes", cb);
});

gulp.task('svgSprite', function () {
    return gulp.src(paths.sprite.src)
        .pipe(svgSprite({
            shape: {
                dimension       : {         // Set maximum dimensions
                    maxWidth    : 32,
                    maxHeight   : 32,
                    float       : 'left'
                },
                spacing: {
                    padding: 5
                }
            },
            mode: {
                css: {
                    dest: "./",
                    layout: "diagonal",
                    sprite: paths.sprite.svg,
                    bust: false,
                    render: {
                        scss:{
                            dest: "css/_sprite.scss"//,
                           // template: "./src/views/home/templatesass.html"
                        }
                    }
                }
            },
            symbol          : true ,     // Activate the «symbol» mode
            variables: {
                mapname: "icons"
            }
        }))
        .pipe(gulp.dest(basePaths.dest));
});

gulp.task('build-sprite', ['svgSprite'], function () {
    return gulp.src(basePaths.dest + paths.sprite.svg)
        .pipe(svg2png())
        .pipe(size({
            showFiles: true
        }))
        .pipe(gulp.dest(paths.images.dest));
});

gulp.task('watch', function () {
    gulp.watch(paths.sprite.src, ['sprite']).on('change', function (evt) {
        changeEvent(evt);
    });
});