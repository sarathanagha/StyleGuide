/// <reference path="../src/datastudio.application.mainpage.d.ts" />

declare var __karma__: any;
declare var requirejs: Require;

var tests = [];
for (var file in __karma__.files) {
  if (__karma__.files.hasOwnProperty(file)) {
    if (/test\/spec\/.*\.js$/.test(file)) {
      tests.push(file);
    }
  }
}

requirejs.config({
    baseUrl: '/base/src'
});

// Always wait for datastudio.application to load and bootstrapper to finish initialzation before loading and running any tests
// This makes sure that all the modules are loaded and each tests have their dependencies resolved.
requirejs(['datastudio.application'], function() {
    // TODO pass modulesConfig instead of null here!!!
    Microsoft.DataStudio.Application.Bootstrapper.initializeAsync({modules:[], defaultModuleName:""}).then(function () {
        require(tests, function(){
            __karma__.start();
        });
    });
});