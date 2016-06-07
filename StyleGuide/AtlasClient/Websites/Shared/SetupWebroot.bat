@echo OFF

SETLOCAL EnableExtensions EnableDelayedExpansion

SET WebsiteConfig=%~1
SET ProjectOutputDir=%~2
SET ProjectDir=%~3

IF "%WebsiteConfig%"=="" GOTO PrintUsageAndExit
IF "%ProjectOutputDir%"=="" GOTO PrintUsageAndExit
IF "%ProjectDir%"=="" GOTO PrintUsageAndExit

ECHO Building for WebsiteConfig="%WebsiteConfig%", ProjectOutputDir="%ProjectOutputDir%", ProjectDir="%ProjectDir%"

SET DataStudioRootDir=%~dp0..\..\..
SET AtlasServerRoot=%DataStudioRootDir%\Server
SET AtlasClientRoot=%DataStudioRootDir%\AtlasClient
SET AtlasClientWebsitesRoot=%AtlasClientRoot%\Websites
SET AtlasClientWebsitesSharedRoot=%AtlasClientWebsitesRoot%\Shared
SET DataStudioDiagnosticsRoot=%AtlasClientRoot%\Client\Core\Diagnostics
SET DataStudioControlsRoot=%AtlasClientRoot%\Client\Core\DataStudioUX
SET DataStudioShellRoot=%AtlasClientRoot%\Client\Core\DataStudio
SET DataStudioExtensionsRoot=%AtlasClientRoot%\Client\Extensions

CALL ECHO F | XCOPY /F /Y /D "%AtlasClientWebsitesSharedRoot%\gulpfile-msbuild.js" "%ProjectDir%\gulpfile-msbuild.js" || EXIT /b

REM TFS# 7126942: We have three sets of images in webroot and we should merge them
CALL :EnsureSoftLinkExists "%ProjectDir%\content" "%AtlasClientWebsitesSharedRoot%\content" || EXIT /b
CALL :EnsureSoftLinkExists "%ProjectDir%\Images" "%AtlasClientWebsitesSharedRoot%\Images" || EXIT /b
CALL :EnsureSoftLinkExists "%ProjectDir%\Libraries" "%AtlasClientWebsitesSharedRoot%\Libraries" || EXIT /b
CALL :EnsureSoftLinkExists "%ProjectDir%\config" "%AtlasClientWebsitesSharedRoot%\config" || EXIT /b

CALL :EnsureDirectoryExists "%ProjectDir%\node_modules\@ms-atlas" || EXIT /b
CALL :EnsureDirectoryExists "%ProjectDir%\node_modules\@ms-atlas-module" || EXIT /b

CALL :EnsureSoftLinkExists "%ProjectDir%\node_modules\@ms-atlas\datastudio-diagnostics" "%DataStudioDiagnosticsRoot%" || EXIT /b
CALL :EnsureSoftLinkExists "%ProjectDir%\node_modules\@ms-atlas\datastudio-controls" "%DataStudioControlsRoot%\src\lib" || EXIT /b
CALL :EnsureSoftLinkExists "%ProjectDir%\node_modules\@ms-atlas\datastudio" "%DataStudioShellRoot%\src" || EXIT /b

IF /I "%WebsiteConfig%"=="adf" (
    CALL :EnsureSoftLinkExists "%ProjectDir%\node_modules\@ms-atlas-module\datastudio-datafactory" "%DataStudioExtensionsRoot%\DataFactory\bin" || EXIT /b
) ELSE IF /I "%WebsiteConfig%"=="cav2" (
    CALL :EnsureSoftLinkExists "%ProjectDir%\node_modules\@ms-atlas-module\datastudio-datacatalog" "%DataStudioExtensionsRoot%\DataCatalog\bin" || EXIT /b
    CALL :EnsureSoftLinkExists "%ProjectDir%\node_modules\@ms-atlas-module\datastudio-designguide" "%DataStudioExtensionsRoot%\DesignGuide\bin" || EXIT /b
) ELSE IF /I "%WebsiteConfig%"=="sa" (
    CALL :EnsureSoftLinkExists "%ProjectDir%\node_modules\@ms-atlas-module\datastudio-solutionaccelerator" "%DataStudioExtensionsRoot%\SolutionAccelerator\src" || EXIT /b
) ELSE (
    ECHO "Unsupported value for WebsiteConfig:%WebsiteConfig%, possible values are adf/cav2/sa"
    EXIT /b 1
)

CALL ECHO F | XCOPY /F /Y /D "%AtlasServerRoot%\UxService\Global.asax" "%ProjectDir%\Global.asax" || EXIT /b
CALL :EnsureDirectoryExists "%ProjectDir%\bin" || EXIT /b
CALL ECHO F | XCOPY /F /Y /D "%ProjectOutputDir%*.dll" "%ProjectDir%\bin\" || EXIT /b

ENDLOCAL & EXIT /b 0

:EnsureDirectoryExists
    IF NOT EXIST "%~1" (
        ECHO Creating directory "%~1"
        CALL MKDIR "%~1" || EXIT /b
    )
    EXIT /b 0

:EnsureSoftLinkExists
    IF EXIST "%~1" (
        ECHO Removing old link "%~1"
        CALL RMDIR "%~1" || EXIT /b
    )
    IF NOT EXIST "%~2" (
        ECHO Target directory "%~2" doesn't exist!
        EXIT /b 1
    )
    CALL MKLINK /J "%~1" "%~2" || EXIT /b
    EXIT /b 0

:PrintUsageAndExit
    ECHO Incorrect number of arguments
    ECHO Usage: %0 WebsiteConfig ProjectOutputDir ProjectDir
    EXIT /b 1

