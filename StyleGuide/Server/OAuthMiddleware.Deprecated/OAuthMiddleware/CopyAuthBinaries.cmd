@echo ON

SETLOCAL EnableDelayedExpansion
    ECHO "%buildOutput%"
    CD "%buildOutput%"
    CALL robocopy . "%projectPath%\..\..\..\AtlasClient\Websites\DataStudio.Website\src\bin" *.dll >NUL
    CALL robocopy . "%buildOutput%\..\AtlasMain\src\default\bin" *.dll >NUL	  
    CALL robocopy . "%buildOutput%\..\AtlasMain\src\adf\bin" *.dll >NUL
    CALL robocopy . "%buildOutput%\..\AtlasMain\src\sa\bin" *.dll >NUL
    CALL robocopy . "%buildOutput%\..\AtlasMain\src\rdx\bin" *.dll >NUL
    CALL robocopy . "%buildOutput%\..\AtlasMain\src\cav2\bin" *.dll >NUL 
    CALL robocopy . "%buildOutput%\..\AtlasMain\bin\default\bin" *.dll >NUL
    CALL robocopy . "%buildOutput%\..\AtlasMain\bin\adf\bin" *.dll >NUL
    CALL robocopy . "%buildOutput%\..\AtlasMain\bin\sa\bin" *.dll >NUL
    CALL robocopy . "%buildOutput%\..\AtlasMain\bin\rdx\bin" *.dll >NUL
    CALL robocopy . "%buildOutput%\..\AtlasMain\bin\cav2\bin" *.dll >NUL
ENDLOCAL & EXIT /b 0

