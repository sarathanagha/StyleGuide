/// <reference path="../References.ts" />

module Microsoft.DataStudio.Services {

    export class ShellConfigServiceImpl {

        private shellConfigMock: Microsoft.DataStudio.Model.Config.ShellConfig  = {
            defaultModuleName: "blueprint",
            modules: [
                {
                    name: 'datastudio-blueprint',
                    location: 'node_modules/@ms-atlas-module/datastudio-blueprint',
                    main: 'module'
                },
                {
                    name: 'datastudio-machinelearning',
                    location: 'node_modules/@ms-atlas-module/datastudio-machinelearning',
                    main: 'startup'
                },
                {
                    name: 'datastudio-datafactory',
                    location: 'node_modules/@ms-atlas-module/datastudio-datafactory',
                    main: 'bootstrapper/startup'
                },
                {
                    name: 'datastudio-dataconnect',
                    location: 'node_modules/@ms-atlas-module/datastudio-dataconnect',
                    main: 'service/main'
                },
                {
                    name: 'datastudio-streamanalytics',
                    location: 'node_modules/@ms-atlas-module/datastudio-streamanalytics',
                    main: 'startup'
                },
                {
                    name: 'datastudio-crystal',
                    location: 'node_modules/@ms-atlas-module/datastudio-crystal',
                    main: 'startup'
                },
                {
                    name: 'datastudio-solutionaccelerator',
                    location: 'node_modules/@ms-atlas-module/datastudio-solutionaccelerator',
                    main: 'startup'
                }                
            ]
        };

        getUserConfigAsync(userId: string): Promise<Microsoft.DataStudio.Model.Config.ShellConfig> {

            return Promise.resolve(this.shellConfigMock);
        }
    }
}
