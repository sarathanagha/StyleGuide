/* tslint:disable:no-unused-variable */
/* tslint:disable:no-any */
/* tslint:disable:no-var-keyword */
/* tslint:disable:align */
/* tslint:disable:no-console */
import AppContext = require("../../../scripts/AppContext");
import ActivityWindowModel = require("../../../scripts/Framework/Model/Contracts/ActivityWindow");
import DataNavModelModule = require("../DataNavModel");
import DataNavModel = DataNavModelModule.DataNavModel;
import CopyToolModule = require("../PowercopyTool");
import copyTool = CopyToolModule.copyTool;

export function wait(condition: () => boolean, timeout = 60000): Q.Promise<boolean> {
    var defer = Q.defer<boolean>();
    var testStart = new Date().getTime();
    var process = () => {
        let processResult;
        try {
            processResult = condition();
        } catch (e) {
            defer.reject(e.message);
            return;
        }
        let timeDiff = new Date().getTime() - testStart;
        if (timeDiff > timeout) {
            defer.reject("Timed out");
            return;
        }
        if (processResult) {
            defer.resolve(true);
        } else {
            setTimeout(process, 100);
        };
    };
    process();
    return defer.promise;
}

export function setFormFieldValue(dataNav: DataNavModel, fieldName: string, value: string) {
    dataNav.formFields().filter(ff => ff.name === fieldName)[0].box.value(value);
}

let testLog = "testLog_";
export function clearLog(testName: string) {
    localStorage[testLog + testName] = "";
}

export function log(testName: string, message: string) {
    console.log(message);
    localStorage[testLog + testName] += message + "\r\n";
}

export function completeTest(testName: string) {
    log(testName, "TEST COMPLETE");
}

export function failTest(testName: string, message) {
    log(testName, "FAIL: " + message);
}

export function assert(testName: string, condition: boolean, validationMessage: string) {
    if (!condition) {
        let message = "FAIL: Assertion failed, " + validationMessage;
        log(testName, message);
        throw message;
    } else {
        log(testName, validationMessage);
    }
}

export function fillSqlConnectionForm(vm: DataNavModel) {
    setFormFieldValue(vm, "selectionmethod", "manual");
    setFormFieldValue(vm, "servertextfield", "alsutestserver.database.windows.net");
    setFormFieldValue(vm, "databasetextfield", "acpytooltest");
    setFormFieldValue(vm, "username", "adminalsu");
    setFormFieldValue(vm, "password", localStorage["cpytooltestsdbpwd"]);
}

export function fillBlobConnectionForm(vm: DataNavModel) {
    setFormFieldValue(vm, "selectionmethod", "manual");
    setFormFieldValue(vm, "accounttextfield", "milans");
    setFormFieldValue(vm, "keytextfield", localStorage["milansaccountkey"]);
}

export function pollForActivityWindows() {
    let armService = AppContext.AppContext.getInstance().armService;
    let splitFactoryId = AppContext.AppContext.getInstance().splitFactoryId();
    let defered = Q.defer<ActivityWindowModel.IActivityWindow>();

    let makeRequest = () => {
        return armService.listActivityWindows({
            subscriptionId: splitFactoryId.subscriptionId,
            resourceGroupName: splitFactoryId.resourceGroupName,
            factoryName: splitFactoryId.dataFactoryName
        }, {
                filter: `${ActivityWindowModel.ServiceColumnNames.ExtendedProperties.PipelineName} eq '${copyTool.pipelineProperties.pipelineName.value()}'`,
                top: 1
            });
    };

    let loop = () => {
        makeRequest().then(result => {
            if (result.value.length === 0 || (result.value[0].windowState !== "Ready" && result.value[0].windowState !== "Failed")) {
                setTimeout(loop, 10000);
            } else {
                defered.resolve(result.value[0]);
            }
        }).fail(reason => {
            defered.reject(reason);
        });
    };
    loop();
    return defered.promise;
}
/* tslint:enable:no-unused-variable */
/* tslint:enable:no-any */
/* tslint:enable:no-var-keyword */
/* tslint:enable:align */
/* tslint:enable:no-console */
