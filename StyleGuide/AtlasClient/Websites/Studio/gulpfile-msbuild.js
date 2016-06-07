/// <vs AfterBuild='build' />
/// <binding AfterBuild='build' />

var SRC_DIR = "./";

var BOOTSTRAPPER_FILE = "datastudio.root.bootstrapper.js";
var INDEX_FILE = "index.html";
var ACCESS_TOKEN_FILE = "accessToken.html";

var BOOTSTRAPPER_INPUT_PATH = "../Shared/" + BOOTSTRAPPER_FILE;
var INDEX_INPUT_PATH = "../Shared/" + INDEX_FILE;
var ACCESS_TOKEN_INPUT_PATH = "../Shared/" + ACCESS_TOKEN_FILE;

var gulp = require('gulp'),
    fs = require("fs"),
    runSequence = require('run-sequence'),
	argv = require("yargs").argv,
    extend = require("extend"),
    es = require("event-stream"),
    uglify = require('gulp-uglify'),
    gutil = require('gulp-util'),
    cssmin = require('gulp-cssmin'),
    env = require("process").env;

function configBootstrapper(config, configName, outputDir) {
    var taskName = "config-bootstrapper-" + configName;

    gulp.task(taskName, function () {
        var nodeModulesFolderPath = "node_modules/@ms-atlas-module/datastudio-",
            nodeModulesRuntimeLocaiton = "node_modules/@ms-atlas-module/",
            npmConfigFileName = "package.json",
            defaultModuleEntryPoint = "module.js",
            atlasModulePrefix = "@ms-atlas-module",
            modulesConfig = [];

        // if we have a wildcard, that should be the only item in here
        if (config.modules.indexOf("*") !== -1) {
            config.modules = ["*"];
        }
        // we need to add the default module to the modules if they didn't already
        else if (config.modules.indexOf(config.defaultModule) === -1) {
            config.modules.push(config.defaultModule);
        }

        var moduleConfigFiles = config.modules.map(function (moduleName) {
            return SRC_DIR + nodeModulesFolderPath + moduleName + "/" + npmConfigFileName
        });

        return gulp.src(moduleConfigFiles)
            .pipe(es.map(function (file, cb) {
                // parse the JSON from the vinyl
                var moduleData = JSON.parse(file.contents.toString());

                var main = moduleData.main;

                if (!main) {
                    main = defaultModuleEntryPoint;
                }

                var moduleName = moduleData.name.substr((atlasModulePrefix + "/").length);

                var config = {
                    name: moduleName,
                    location: nodeModulesRuntimeLocaiton + moduleName,
                    main: main
                };

                if (moduleData.resxPath) {
                    config.resxPath = 'i18n!' + config.location + '/' + moduleData.resxPath;
                }

                modulesConfig.push(config);

                // don't need anything else from the file
                cb();
            }))
            .pipe(es.wait(function (err, body) {
                if (config.modules[0] !== "*" && config.modules.length !== modulesConfig.length) {
                    throw new Error("Incorrect amount of modules loaded! Expected: "
                        + config.modules.length + ", Actual: " + modulesConfig.length + "\n\nModulesConfig: "
                        + JSON.stringify(modulesConfig, null, '\t') + "\n\nConfig: " + JSON.stringify(config.modules, null, '\t'));
                }

                var bootstrapper = fs.readFileSync(BOOTSTRAPPER_INPUT_PATH, "utf8");
                bootstrapper = bootstrapper.replace("[/* MODULES_CONFIG */]", JSON.stringify(modulesConfig));
                bootstrapper = bootstrapper.replace("DEFAULT_MODULE_NAME", config.defaultModule);
                bootstrapper = bootstrapper.replace("Shell_Version", config.shellVersion);
                bootstrapper = bootstrapper.replace("USE_EXTERNAL_API", config.useExternalAPI);
                fs.writeFileSync(outputDir + BOOTSTRAPPER_FILE, bootstrapper);

                var index = fs.readFileSync(INDEX_INPUT_PATH, "utf8");
                index = index.replace(/APPLICATION_NAME/g, config.applicationName);
                index = index.replace(/VERSION_INFO/g, argv.versionFull || "local")
                fs.writeFileSync(outputDir + INDEX_FILE, index);

                var accessTokenFile = fs.readFileSync(ACCESS_TOKEN_INPUT_PATH, "utf8");
                accessTokenFile = accessTokenFile.replace(/VERSION_INFO/g, argv.versionFull || "local")
                fs.writeFileSync(outputDir + ACCESS_TOKEN_FILE, accessTokenFile);

                //gulp.src(outputDir + BOOTSTRAPPER_FILE)
                //    .pipe(uglify())
                //    .on('error', gutil.log)
                //    .pipe(gulp.dest('dist/' + configFile));
            }));
    });

    return taskName;
}

gulp.task('buildConfig', function (cb) {
    var configName = argv.config;
    if (!configName) {
        throw new Error("Please specify a config, e.g. gulp --config=SA");
    }

    var moduleConfig = require("./config/" + configName + ".json");
    var defaultConfig = require("./config/default.json").default;
    var mergedConfig = extend(true, {}, defaultConfig, moduleConfig[configName]);

    var copyBootstrapperTask = configBootstrapper(mergedConfig, configName, "./");
    runSequence(copyBootstrapperTask, cb);
});

gulp.task("minify-js", function () {
    var configName = argv.config;
    var output = argv.output;
    return gulp.src([
        output + "../AtlasMain/src/" + configName + "/node_modules/@ms-atlas*/**/*.js",

        // Excluding

        '!' + output + "../AtlasMain/src/" + configName + "/**/ExternalLibraries/**/*.js",
        '!' + output + "../AtlasMain/src/" + configName + "/**/gulp*/**/*.js"

    ])
        .pipe(uglify()).on('error', gutil.log)
        .pipe(gulp.dest(output + '../AtlasMain/bin/'+ configName + '/node_modules'));
});

gulp.task('minify-css', function () {
    var configName = argv.config;
    var output = argv.output;
    gulp.src( output + "../AtlasMain/src/"+ configName + "/**/*.css")
        .pipe(cssmin())
        .pipe(gulp.dest(output + '../AtlasMain/bin/' + configName));
});

gulp.task("minify", ["minify-js", "minify-css"]);
