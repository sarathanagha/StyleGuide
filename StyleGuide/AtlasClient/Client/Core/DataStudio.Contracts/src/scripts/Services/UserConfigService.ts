module Microsoft.DataStudio.Services {

    export interface UserConfigService {
        getUserConfigAsync(userId: string): Promise<Microsoft.DataStudio.Model.Config.ShellConfig>;
    }
}
