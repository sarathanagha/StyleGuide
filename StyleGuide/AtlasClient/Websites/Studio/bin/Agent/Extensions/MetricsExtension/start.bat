rem Stop the managed session in case this is a transition from managed to native ME
logman stop MetricsExtension-live-Collector -ets

rem Ensure that the scope is the directory of the MetricsExtension
pushd %~dp0
MetricsExtension.Native.exe %*
