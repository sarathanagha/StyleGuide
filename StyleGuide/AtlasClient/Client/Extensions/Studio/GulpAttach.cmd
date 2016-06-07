ECHO OFF
REM *******************************************************************************************
REM Please do not make any changes to this file, if you want to please mail atlaseng
REM *******************************************************************************************

SETLOCAL EnableDelayedExpansion
SET ModulePath=..\..\..\Websites\DataStudio.Website\src\node_modules\@ms-atlas-module\datastudio-studio

if "%1"=="official" (
    CALL :AttachModule || EXIT /b
) ELSE (
	SET BuildDependenciesPath="%ENLISTMENT_ROOT%_node_modules\node_modules"
    SET PATH=!PATH!;!BuildDependenciesPath!\.bin
    CALL %cd:~0,2%\NuGetPackages\Node.JS.DPG.0.12.2\tools\nodevars.bat || EXIT /b
    CALL :GulpAttachModule "%1" || EXIT /b        
)
ENDLOCAL & EXIT /b 0

:GulpAttachModule
    CALL :InstallBuildDependencies || EXIT /b
    CALL :RunGulp "%~dp0\src" || EXIT /b
	if NOT "%~1"=="debug" (
        CALL rmdir node_modules || EXIT /b
	)
	CALL :AttachModule || EXIT /b
    EXIT /b 0

:AttachModule
    IF EXIST %ModulePath% (
        CALL rmdir /s /q %ModulePath%|| EXIT /b    
    )
    CALL mklink /J %ModulePath%  "%~dp0\bin" || EXIT /b
    EXIT /b 0

:RunGulp
    ECHO Running gulp in "%~1" folder
    CALL PUSHD "%~1" || EXIT /b
    CALL gulp 
    CALL POPD || EXIT /b
    EXIT /b 0

:InstallBuildDependencies
    ECHO Linking build dependencies in "%CD%" directory
        IF EXIST node_modules (
            ECHO removing node_modules link in %CD%
            CALL rmdir node_modules|| EXIT /b
        )
    CALL mklink /J node_modules %BuildDependenciesPath% || EXIT /b
    IF EXIST prereq.cmd (
        ECHO Running prereq.cmd in "%CD%" directory
        CALL prereq || EXIT /b
    )
    EXIT /b 0