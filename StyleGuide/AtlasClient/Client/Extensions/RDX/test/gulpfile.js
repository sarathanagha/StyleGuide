var es = require("event-stream"),
    gulp = require("gulp"),
    typescript = require("gulp-tsc");
    
// Compile all .ts files, producing .js and source map files alongside them
gulp.task('tests', ['specrunner'], function() {
    return gulp.src(['./spec/**/*.ts', '!./mocks/**/*.ts'])
        .pipe(typescript({
            target: "ES5",
            module: 'amd',
            sourcemap: true,
            outDir: './spec'
        }))
        .pipe(gulp.dest('./spec'));
});


gulp.task('specrunner', ['mocks'], function() {
    return gulp.src(['./SpecRunner.karma.ts'])
        .pipe(typescript({
            target: "ES5",
            module: 'amd',
            sourcemap: true,
            outDir: './',
        }))
        .pipe(gulp.dest('./'));
});

gulp.task('mocks', function() {
    return gulp.src(['./mocks/**/*.ts'])
        .pipe(typescript({
            target: "ES5",
            module: "amd",
            declaration: true,
            sourcemap: true,
            outDir: './',
            out: "mocks.js"
        }))
        .pipe(gulp.dest('./'));
});

gulp.task("default", ['tests']);