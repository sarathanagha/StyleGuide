/// <reference path="../src/references.d.ts" />

declare var __karma__: any;
declare var requirejs: Require;
declare var define: RequireDefine;

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

requirejs.onResourceLoad = function (context, map, depArray) {
    console.log("RequireJS.onResourceLoad:", map.name);
};

requirejs([
    "es6-promise",
    "jquery",
    "knockout",
    "WinJS",
    "Q",
    "moment",
    "d3",
    "crossroads",
    "history",
    "jquery.mockjax",
    "jquery.jstree/jstree",
    "datastudio.diagnostics"
], function (promise, $) {
    // Applying polyfills for browser compatibility.
    promise.polyfill();

    (<any>window).Q = require("Q");
    (<any>window).moment = require("moment");
    ko = require("knockout");
    (<any>window).jQuery = $;
    (<any>window).$ = $;
    Historyjs = <any>History;
    crossroads = require("crossroads");
    jwt = { "decode": (<any>window).jwt_decode };

    require(["../test/mocks","Module"], function(temp) {
        require(tests, function(){
            __karma__.start();
        });
    });
});