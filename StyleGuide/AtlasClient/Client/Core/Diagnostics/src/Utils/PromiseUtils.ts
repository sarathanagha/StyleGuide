module Microsoft.DataStudio.Diagnostics.PromiseUtils {

    export function delay(timeout: number): Promise<void> {
        return new Promise<void>(resolve => {
            window.setTimeout(resolve, timeout);
        })
    }
}
