/*
 * Constants
 */

// Sets the threshold for tslint rules (which are defined by tslint.json).
// If the rule is not present, the threshold is 0.
var ERROR_THRESHOLDS = {
    "variable-name": 146,
    "no-internal-module": 26
};

var errorSum = 0;
for (var key in ERROR_THRESHOLDS) {
    errorSum += ERROR_THRESHOLDS[key];
}

global.OUTPUT_DIR = "./bin/";
global.SRC_DIR = "./src/";
global.GENERATED_DIR = "./src/_generated/";
global.TEST_DIR = "./test/";
global.TEST_OUTPUT_DIR = "./test/bin/";
global.FRAMEWORK_DIR = SRC_DIR + "scripts/Framework/";
global.RESOURCES_DIR = FRAMEWORK_DIR + "Shared/Resources/";
global.SVG_DIR = RESOURCES_DIR + "Svg/";

// Files that are needed to compile typescript
global.SRC_TYPESCRIPT = [SRC_DIR + "**/*.ts", "!" + SRC_DIR + "libs/**/*", "!" + SRC_DIR + "node_modules/**/*"];
global.TEST_TYPESCRIPT = [TEST_DIR + "**/*.ts", "!" + TEST_OUTPUT_DIR + "**/*"];
global.FRAMEWORK_MODULES = FRAMEWORK_DIR + "*/*.ts";
global.CLIENT_RESOURCES = RESOURCES_DIR + "ClientResources.resx";
global.CLIENT_RESOURCES_COMPILED = GENERATED_DIR + "ClientResources.txt";
// All the svgs that will be loaded into the svg framework
global.RESOURCE_SVGS = SVG_DIR + "*.svg";
global.SCSS_FILES = [SRC_DIR + "/**/*.scss", "!" + SRC_DIR + "/node_modules/**/*.scss"];

global.gulp = require("gulp"),
    sass = require("gulp-sass"),
    sourcemaps = require("gulp-sourcemaps"),
    autoprefixer = require("gulp-autoprefixer"),
    exec = require('child_process').exec,
    fs = require("fs"),
    runSequence = require('run-sequence'),
    path = require("path"),
    upath = require("upath"),
    es = require("event-stream"),
    rename = require("gulp-rename"),
    wrap = require("gulp-wrap"),
    shell = require("gulp-shell"),
    gutil = require("gulp-util"),
    plumber = require("gulp-plumber"),
    argv = require("yargs").argv,
    gulpif = require("gulp-if"),
    madge = require("madge");

// This should always be enabled by default to avoid bad checkins
global.EXIT_ON_ERROR = true;

/*
 * Util
 */

// Ibiza/C# like string.format implementation.
if (!String.prototype.format) {
    String.prototype.format = function () {
        var args = arguments;
        return this.replace(/{(\d+)}/g, function (match, number) {
            return typeof args[number] != 'undefined'
                ? args[number]
                : match
            ;
        });
    };
}

// returns whether or not the production flag was specified
global.isProd = function () {
    if (argv.production) {
        return true;
    }

    return false;
}

// exits after any downstream errors
global.exitOnError = function () {
    return plumber({ errorHandler: handleError });
}

function handleError(buildError) {
    console.log(buildError.toString());
    console.log(buildError.stack);
    if (EXIT_ON_ERROR) {
        gutil.log(gutil.colors.red("Build error: exiting Gulp with error code 1"));
        process.exit(1);
    }
    else {
        gutil.log(gutil.colors.red("Build error: continuing with stream (exit on error disabled)"));
    }
}

// returns either a specific input file when specified by the --inputFile flag, or the unmodified src
global.inputFile = function (src) {
    return argv.inputFile ? argv.inputFile : src;
}

/*
 * Build
 */

// Either we use the uncompiled CLIENT_RESOURCES resx and compile it ourselves, or we just use the compiled CLIENT_RESOURCES_COMPILED
global.buildResources = function(useResx) {
    return function () {
        return gulp.src(useResx ? CLIENT_RESOURCES : CLIENT_RESOURCES_COMPILED)
            .pipe(exitOnError())
            // We only require gulp-resx2 when using resx
            .pipe(gulpif(useResx, useResx ? require('gulp-resx2')() : true, es.map(function (data, callback) {
                var regex = /^(.*?)=(.*?)$/igm

                var ClientResources = {};
                var str = data.contents.toString();

                while (result = regex.exec(str)) {
                    ClientResources[result[1]] = result[2];
                }

                data.contents = new Buffer(JSON.stringify(ClientResources, null, 2), 'utf8');
                callback(null, data);
            })))
            .pipe(wrap('var ClientResources = <%= contents %>;'))
            .pipe(rename(function (path) {
                path.extname = ".ts";
            }))
            .pipe(gulp.dest(GENERATED_DIR));
    }
}

gulp.task("build-resources-msbuild", buildResources(false)); // useResx = false

gulp.task("build-svgs", function () {
    var dependencies = "", exports = "";

    function addSvg(svg) {
        dependencies += '/// <amd-dependency path="text!../scripts/Framework/Shared/Resources/Svg/{0}.svg"/>\n'.replace(/\{0\}/g, svg);
        exports += 'export const {0} = require("text!../scripts/Framework/Shared/Resources/Svg/{0}.svg");\n'.replace(/\{0\}/g, svg);
    }

    return gulp.src(RESOURCE_SVGS)
        .pipe(exitOnError())
        .pipe(es.map(function (data, callback) {
            addSvg(path.basename(data.path, ".svg"));
            callback();
        }))
        .pipe(es.wait(function (err, body) {
            fs.writeFileSync(GENERATED_DIR + "Svg.ts", dependencies + exports);
        }));
});

gulp.task("build-framework", function () {
    return gulp.src(FRAMEWORK_MODULES)
        .pipe(exitOnError())
        .pipe(es.map(function (data, callback) {
            var moduleName = path.basename(data.path, ".ts");
            // update the path to not have the .ts either
            data.path = path.dirname(data.path) + "/" + moduleName;
            var modulePath = upath.toUnix(path.relative(GENERATED_DIR, data.path));
            var importLine = "export import " + moduleName + " = require(\"" + modulePath + "\");\n";
            callback(null, importLine);
        }))
        .pipe(es.wait(function (err, body) {
            // manually add the Svg module (which is also in the generated folder
            body += "export import Svg = require(\"./Svg\");\n";

            fs.writeFileSync(GENERATED_DIR + "Framework.ts", body);
        }));
});

gulp.task("build-sass", function () {
    return gulp.src(SCSS_FILES)
        .pipe(exitOnError())
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', handleError))
        .pipe(autoprefixer("last 1 version", "> 1%", "ie 8", "ie 7"))
        .pipe(sourcemaps.write("./"))
        .pipe(gulp.dest(OUTPUT_DIR));
});

gulp.task("build-sass-msbuild", function (cb) {
    runSequence("fix-permissions", "build-sass", "fix-permissions", cb);
});

/*
 * Fixing permissions
 */

// Removes the read-only attribute from generated files
gulp.task("fix-permissions", function () {
    // We never change the permissions on individual files because applying the changes recursively is faster
    return gulp.src([OUTPUT_DIR, GENERATED_DIR])
        .pipe(exitOnError())
        .pipe(shell(['attrib -R "<%= file.path %>\\*" /S /D']));
});

/*
 * Tests
 */

// Check for circular dependencies in the source code.
gulp.task("checkDeps", function (cb) {
    var tree = madge(OUTPUT_DIR, {
        format: "amd",
        findNestedDependencies: true,
    });

    var filenames = Object.create(null);
    var lowerCasedMap = Object.create(null);
    for (var key in tree.tree) {
        var lowerCasedFilename = key.toLowerCase();
        var values = tree.tree[key];
        filenames[lowerCasedFilename] = filenames[lowerCasedFilename] || Object.create(null);
        filenames[lowerCasedFilename][key] = "ModuleId: " + key;

        // Creating new map for checking circular deps.
        lowerCasedMap[lowerCasedFilename] = values.map(function (value) {
            var lowerCaseDep = value.toLowerCase();
            filenames[lowerCaseDep] = filenames[lowerCaseDep] || Object.create(null);
            filenames[lowerCaseDep][value] = "Dependency in: " + key;
            return lowerCaseDep;
        });

        // Check for dependency casing issues.
    }
    tree.tree = lowerCasedMap;

    var hasError = false;
    var circularDeps = tree.circular();
    if (circularDeps.getArray() && circularDeps.getArray().length > 0) {
        gutil.log(gutil.colors.red("Found the following circular dependencies:"));
        circularDeps.getArray().forEach(function (cycle) {
            gutil.log(gutil.colors.red(cycle.join(" -> ")));
        });
        hasError = true;
    }

    // Each value map should have exactly one member.
    for (var key in filenames) {
        var value = filenames[key];
        if (Object.keys(value).length > 1) {
            hasError = true;
            gutil.log(gutil.colors.red("File has been included with different casing:", JSON.stringify(value)));
        }
    }
    if (hasError) {
        throw new gutil.PluginError("checkDeps", "build failed.", { showStack: false });
    }

    cb();
});

/*
 * Fixing paths
 */

// Generates a task for fixing paths
// @param src The glob to use to create the map
// @param buildMap The function to use to build the map
// @param regex The regex to use to find paths
function fixPathsTask(taskName, src, buildMap, regex) {
    function replacePaths(modules, done) {
        gulp.src(SRC_TYPESCRIPT, { base: "./" })
            .pipe(exitOnError())
            .pipe(es.map(function (data, callback) {
                var fileAbsolutePath = path.dirname(data.path);

                var result;
                var str = data.contents.toString();

                var changed = false;

                // Iterate over all of the paths
                while ((result = regex.exec(str)) !== null) {
                    var originalRequirePath = result[3];

                    var moduleName = path.basename(originalRequirePath).toLowerCase();

                    var moduleAbsolutePath = modules[moduleName];

                    // If the module doesn't exist (undefined) or it's not unique (false), continue
                    if (moduleAbsolutePath === false) {
                        gutil.log(gutil.colors.yellow("Ambiguous module:", gutil.colors.cyan(moduleName), "in", gutil.colors.magenta(fileAbsolutePath)));
                        continue;
                    }

                    if (!moduleAbsolutePath) {
                        gutil.log(gutil.colors.yellow("Missing module:", gutil.colors.cyan(moduleName), "in", gutil.colors.magenta(fileAbsolutePath)));
                        continue;
                    }

                    var moduleRelativePath = upath.toUnix(path.relative(fileAbsolutePath, moduleAbsolutePath));

                    // fix leading ./ for paths in the same folder
                    if (!/^\./.test(moduleRelativePath)) {
                        moduleRelativePath = "./" + moduleRelativePath;
                    }

                    // if we got a different answer
                    if (originalRequirePath !== moduleRelativePath) {
                        // if this is prod, we throw an error instead of making the actual change
                        if (isProd()) {
                            throw new gutil.PluginError(taskName, "build failed. Run " + gutil.colors.cyan("gulp " + taskName) + " to fix it, then shelve the resulting edits.", { showStack: false });
                        }

                        changed = true;

                        gutil.log("Relative path changed: " + data.path)
                        gutil.log(originalRequirePath);
                        gutil.log(moduleRelativePath);

                        str = str.replace(originalRequirePath, moduleRelativePath);
                    }
                }

                // if we've changed something in this file, pass it downstream
                if (changed) {
                    data.contents = new Buffer(str, 'utf8');
                    callback(null, data);
                }
                // stop processing (effectively filtering when nothing has changed);
                else {
                    callback();
                }
            }))
            // check out the files for edit
            .pipe(shell(['tf edit "<%= file.path %>"']))
            // actually change the files
            .pipe(gulp.dest("./"))
            .pipe(es.wait(function (err, body) {
                // finally all done
                done();
            }));
    };

    gulp.task(taskName, function (done) {
        var modules = {};

        gulp.src(src)
            .pipe(exitOnError())
            .pipe(es.map(buildMap(modules)))
            .pipe(es.wait(function (err, body) {
                replacePaths(modules, done);
            }));
    });
}

// module requirements with relative paths
var require_regex = /require\((\"|\')(css!|text!)(\..*?)(\"|\')\);/g;

// reference/dependency requirements with regular paths
var reference_regex = /<reference path=(\"|\')(css!|text!)(\..*?)(\"|\')/g;

// dependency requirements with regular paths
var dependency_regex = /<amd-dependency path=(\"|\')(css!|text!)(\..*?)(\"|\')/g;

function travelUpDir(absolutePath) {
    var prevDir = path.join(path.dirname(absolutePath), "..");
    return path.relative(prevDir, absolutePath);
}

// Given an empty map, creates a map of module names to their paths
function createModules(modules) {
    return function (data, cb) {
        // change scss to compiled css
        data.path = data.path.replace(/\.scss$/, ".css");

        var fileName = path.basename(data.path, ".ts");
        var fileNameLower = fileName.toLowerCase();

        var absolutePath = path.dirname(data.path) + "/" + fileName;

        if (fileNameLower in modules) {
            gutil.log(gutil.colors.yellow("Duplicate filename:"), gutil.colors.cyan(fileNameLower), gutil.colors.magenta("\n" + absolutePath),
                gutil.colors.magenta(modules[fileNameLower] ? "\n" + modules[fileNameLower] : ""));

            modules[fileNameLower] = false;
        }
        else {
            modules[fileNameLower] = absolutePath;
        }

        cb();
    };
}

// Given an empty map, creates a map of module names to their paths
function createReferences(modules) {
    return function (data, cb) {
        var fileName = path.basename(data.path);
        if (fileName in modules) {
            console.log("Duplicate filename: " + fileName);
            modules[fileName] = false;
        }
        else {
            modules[fileName] = data.path
        }
        cb();
    };
}

fixPathsTask("fix-requires", SRC_DIR + "**/*.*", createModules, require_regex);
fixPathsTask("fix-dependencies", SRC_DIR + "**/*.*", createModules, dependency_regex);
fixPathsTask("fix-references", SRC_DIR + "**/*.d.ts", createReferences, reference_regex);

gulp.task("fix-filenames", ["fix-requires", "fix-dependencies", "fix-references"]);

/****** TODO: Port all of the following to msbuild *****/

var FILES_TO_LINT = SRC_TYPESCRIPT.concat(TEST_TYPESCRIPT).concat(["!**/*.d.ts", "!**/_generated/*", "!**/ClientResources.ts", "!**/node_modules/**", "!node_modules/**"]);

global.tslint = require("gulp-tslint"),
    cache = require("gulp-cache");

gulp.task("production", function (cb) {
    runSequence(["checkDeps", "lint", "fix-filenames"], cb);
});

/*
 * Linting
 */

// dictionary mapping rule names to an array of error messages
var tslintFailures = {};

var countFailures = function (output, file, options) {
    output.forEach(function (error) {
        if (!(error.ruleName in tslintFailures)) {
            tslintFailures[error.ruleName] = [error];
            return;
        }

        tslintFailures[error.ruleName].push(error);
    });
};

var COUNTFAILURES_DETAIL_THRESHOLD = 155;

function logGulpError(task, message) {
    gutil.log(gutil.colors.red("[" + task + "] ERROR: ") + gutil.colors.white(message));
}

// This needs to be the actually installed version!
var TSLINT_VERSION = "3.3.0";
var tslintOptions = fs.readFileSync("tslint.json");

var objectCache = {};
function removeCircularReferences(obj) {
    objectCache = {};

    function traverseChildren(parentObject) {
        if (parentObject instanceof Array) {
            for (var i = 0; i < parentObject.length; i++) {
                parentObject[i] = traverseChildren(parentObject[i]);
            }
        }
        if (typeof parentObject === "object") {
            if (objectCache[parentObject.id]) {
                return "[Circular reference]";
            } else {
                objectCache[parentObject.id] = 1;       // A positive if() value
                for (var i in parentObject) {
                    parentObject[i] = traverseChildren(parentObject[i]);
                }
                return parentObject;
            }
        } else {
            return parentObject;
        }
    }

    return traverseChildren(obj);
}

function makeTslintKey(file) {
    // Key using the file contents, tslint version and options
    return [file.contents.toString('utf8'), TSLINT_VERSION, tslintOptions].join('');
}

function getTslintValue(file) {
    var sanitizedTslint = removeCircularReferences(file.tslint);
    return {
        tslint: sanitizedTslint
    };
}

gulp.task("test-tslint", function () {
    gutil.log(gutil.colors.yellow("Total amount of linting errors in app: >=" + errorSum));
    gutil.log(gutil.colors.yellow("Number of rules with error thresholds in app: " + Object.keys(ERROR_THRESHOLDS).length));

    return gulp.src(FILES_TO_LINT)
        .pipe(exitOnError())
        .pipe(cache(tslint(), { key: makeTslintKey, value: getTslintValue }))
        .pipe(tslint.report(countFailures, {
            emitError: false
        }))
        .pipe(es.wait(function (err, body) {
            var messages = Object.keys(tslintFailures);
            messages.sort(function (a, b) {
                return tslintFailures[b].length - tslintFailures[a].length;
            });

            var failedCount = 0;
            var adjustCount = 0;

            messages.forEach(function (message) {
                // console.log("Current tslint error counts", tslintFailures[message].length, message);
                if (message in ERROR_THRESHOLDS && tslintFailures[message].length <= ERROR_THRESHOLDS[message]) {
                    // We should be getting better over time, not staying in the same place when we fix things
                    if (tslintFailures[message].length < ERROR_THRESHOLDS[message]) {
                        adjustCount++;
                        logGulpError("test-tslint", gutil.colors.yellow("Error threshold should be decreased to {0} for the following rule: {1}".format(
                            gutil.colors.magenta(tslintFailures[message].length), message)));
                    }

                    return;
                }

                // Throw an error after we're done printing
                failedCount++;

                var failureThreshold = 0;

                if (message in ERROR_THRESHOLDS) {
                    failureThreshold = ERROR_THRESHOLDS[message];
                }

                console.log("");
                logGulpError("test-tslint", "Failed tslint rule " + gutil.colors.white("'" + message + "'") + " " +
                    gutil.colors.magenta(tslintFailures[message].length) + " time(s) (Allowance for rule is "
                    + gutil.colors.magenta(failureThreshold) + " failure(s))");

                // we don't want to learn any more detail
                var tooManyErrors = tslintFailures[message].length > COUNTFAILURES_DETAIL_THRESHOLD;
                if (tooManyErrors) {
                    tslintFailures[message] = tslintFailures[message].slice(0, COUNTFAILURES_DETAIL_THRESHOLD);
                }

                tslintFailures[message].forEach(function (failure) {
                    // most text editors start with 1..
                    var line = ++failure.startPosition.line;
                    var character = failure.startPosition.character;

                    logGulpError("test-tslint", gutil.colors.magenta(failure.name + " line " + line + ", character " +
                        character + ": ") + failure.failure);
                });

                if (tooManyErrors) {
                    logGulpError("test-tslint", "Too many errors to show more. Run " + gutil.colors.cyan("gulp tslint") + " for more info.");
                }

            });

            if (adjustCount > 0) {
                console.log("");
                logGulpError("test-tslint", gutil.colors.yellow("You need to update the count for " + gutil.colors.magenta(adjustCount) + " tslint rule(s) inside " + gutil.colors.magenta("DataFactory\\gulpfile.js") + "."));

                // of we're not also going to throw in the next condition
                if (failedCount === 0) {
                    throw new gutil.PluginError("test-tslint", "build failed.", { showStack: false });
                }
            }

            if (failedCount > 0) {
                console.log("");
                logGulpError("test-tslint", "You've exceeded the threshold for " + gutil.colors.magenta(failedCount) + " tslint rule(s).");
                logGulpError("test-tslint", "Check the console or run "
                    + "{0}, {1}, or {2}".format(
                        gutil.colors.cyan("gulp tslint"), gutil.colors.cyan("gulp tslint-read-only"), gutil.colors.cyan("gulp tslint --inputFile=PATH/TO/FILE"))
                    + " for more detailed info.");
                logGulpError("test-tslint", "To learn more about tslint error messages, visit " + gutil.colors.magenta("https://github.com/palantir/tslint") + ".");
                throw new gutil.PluginError("test-tslint", "build failed.", { showStack: false });
            }
        }))
});

gulp.task("tslint", function () {
    return gulp.src(inputFile(FILES_TO_LINT))
        .pipe(exitOnError())
        .pipe(tslint())
        .pipe(tslint.report("full", {
            emitError: false,
        }))
});

gulp.task("tslint-read-only", function () {
    return gulp.src(FILES_TO_LINT)
        // Only test the read only (in theory we haven't touched any other file)
        .pipe(es.map(function (data, callback) {
            fs.access(data.path, fs.W_OK, function (err) {
                if (err) {
                    callback();
                }
                else {
                    callback(null, data);
                }
            });
        }))
        .pipe(exitOnError())
        .pipe(tslint())
        .pipe(tslint.report(stylish, {
            emitError: false,
            sort: true,
            bell: false
        }))
});

gulp.task("lint", ["test-tslint"]);
