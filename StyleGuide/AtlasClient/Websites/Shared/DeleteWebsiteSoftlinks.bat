@IF NOT DEFINED ECHO_ON ECHO OFF
SETLOCAL
CALL "%ENLISTMENT_ROOT%\CBT\NuGet\PullDevTool.cmd" Python.Corext
"%PATH_TO_TOOL%\python.exe" "%~dp0DeleteWebsiteSoftlinks.py" %*