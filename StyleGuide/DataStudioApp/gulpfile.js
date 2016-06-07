var gulp = require('gulp');
var electron = require('gulp-electron');
var packageJson = require('../DataStudio.website/src/package.json');
var gulpAsar = require('gulp-asar');
var runSequence = require("run-sequence");
var exec = require('child_process').exec;
var atomShellInstaller = require('atom-shell-installer');

gulp.task('create-windows-installer', function (done) {
    atomShellInstaller({
        appDirectory: './Atlas-win32/',
        outputDirectory: 'installer',
        exe: 'Atlas.exe'
    }).then(function () {
        done();
    });
});

gulp.task('make-asar', function () {
    gulp.src('../DataStudio.website/src/', { base: '../DataStudio.website/src/' })
    .pipe(gulpAsar('archive.asar'))
    .pipe(gulp.dest('./src'));
});

gulp.task('electron', function (cb) {

    exec('electron-packager ../DataStudio.website/src/ Atlas --platform=win32 --arch=x64 --version=0.27.2', function (err, stdout, stderr) {
        console.log(stdout);
        console.log(stderr);
        cb();
    });    
});

// TODO chrisriz: add in usage of asar in package & xplat build w/ installers.
gulp.task('default', function () {
    runSequence('make-asar', 'electron');


});