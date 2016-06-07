export let devMode = false;
export let recordReplay = false;

export let defaultPipelineStart = new Date().toISOString();
export let defaultPipelineEnd = "2099-12-31T00:00:00Z";

if (devMode) {
    defaultPipelineStart = "2014-05-01T00:00:00Z";
    defaultPipelineEnd = "2014-05-05T00:00:00Z";
}
