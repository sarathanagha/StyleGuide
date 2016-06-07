@if "%_echo%"=="" echo off
setlocal
REM
REM script to FI relevant Monitoring deployment code to PlatformV2\DeploymentServices
REM

:FI_MonitoringDeployment
    echo ======= FI of deployment changes:
    set _wfXaml=MonitoringServiceDeploy.xaml
    for %%S in (%_wfXaml%) do (
        call :tfmerge "$/Data Pipeline/Main/Product/Source/PlatformV2/Deployment/Workflow/%%S" "$/Data Pipeline/Main/Product/Source/PlatformV2/DeploymentServices/Workflow.Services/%%S"
    )
    call :tfmerge "$/Data Pipeline/Main/Product/Source/PlatformV2/Deployment/Workflow/MonitoringConfig" "$/Data Pipeline/Main/Product/Source/PlatformV2/DeploymentServices/Workflow.Services/MonitoringConfig" /r
exit /b

:tfmerge
  echo ++ tf merge %1 %2 %3 %4 %5 %6 %7
  call tf merge %1 %2 %3 %4 %5 %6 %7
exit /b

