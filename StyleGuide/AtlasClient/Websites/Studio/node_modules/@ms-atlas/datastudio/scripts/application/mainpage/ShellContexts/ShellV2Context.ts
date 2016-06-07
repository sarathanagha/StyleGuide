/// <reference path="../references.ts" />
/// <reference path="ShellContext.ts" />

module Microsoft.DataStudio.Application {
    export class ShellV2ContextImpl extends ShellContextImpl {
        private static deployCallback: () => Q.Promise<any>;
        
		public static ShellName = "ShellV2"; 
		
		public static initialize(config: Microsoft.DataStudio.Model.Config.ShellConfig) {
			ShellContextImpl.initialize(config);
        }

        public static registerDeployCallback = (callback: () => Q.Promise<any>) => {
            ShellV2ContextImpl.deployCallback = callback;
        }

        public static deploy = () => {
            if (ShellV2ContextImpl.deployCallback) {
                return ShellV2ContextImpl.deployCallback();
            } else {
                let defer = Q.defer();
                defer.resolve("no callback registered");
                return defer.promise;
            }
        }
	}
}