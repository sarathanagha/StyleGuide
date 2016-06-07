var es = require("event-stream"),
    gulp = require("gulp"),
    typescript = require("gulp-tsc"),
    fs = require("fs"),
    path = require("path"),
    chalk = require('chalk');
    
// Compile all .ts files, producing .js and source map files alongside them
gulp.task('ts', function() {
    return gulp.src(['**/*.ts'])
        .pipe(typescript({
            module: 'amd',
            sourcemap: true,
            outDir: './'
        }))
        .pipe(gulp.dest('./'));
});

gulp.task("default", ['ts']);