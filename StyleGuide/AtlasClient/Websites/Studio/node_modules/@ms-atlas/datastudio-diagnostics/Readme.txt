<html>

<head>
    <title>Diagnostics Testing</title>
    <script src="node_modules/@ms-atlas/datastudio-diagnostics/lib/datastudio.diagnostics.js"></script>
</head>

<body>
    <p id="hello1">Hello</p>

    <script>

    function bar() {
      throw new Error("No worries, bar always throws errors.")
    }

    function test() {
      bar();
    }

    var Logging = Microsoft.DataStudio.Diagnostics.Logging;

    var loggerFactory = new Logging.LoggerFactory({ moduleName: "TestModule1" });
    var loggerFactory2 = new Logging.LoggerFactory({ });

    var logger1 = loggerFactory.getLogger({ loggerName: "Logger1", category: "Networking" });
    var logger2 = loggerFactory.getLogger({ loggerName: "Logger2" });
    var logger3 = loggerFactory2.getLogger({ });

    logger1.logInfo("Hello, World!");

    logger1.logDebug("Hello, World!", { abc: "Hello", def: 14.57, efg: false, obj1: { moo: null } });

    logger1.logInfo("Hello, World!", { test: { bar: 2, bob: true }, p1: document.getElementById("hello1"), fuka: null } );

    logger2.logWarning("Something bad going on.", { serverUrl: "http://localhost:8080/", cause: "it happens" });

    logger2.log({ level: 17, serverUrl: "http://localhost:8080/", cause: "it happens" });

    logger1.logDebug("Hello again in debug message");

    logger2.logError("This is a serious error.")

    logger1.logInfo("Hello again!");

    logger3.logInfo("One more log message.");

    try {

      test();

    } catch (e) {
      logger2.logError("This is a serious error from test.", {
        cause: " test cause",
        error: e,
        correlationId: "13219032183091238120938213",
        what: "so wat?"
      })
    }

    logger1.logInfo("Hello again!");


  </script>

</body>

</html>
