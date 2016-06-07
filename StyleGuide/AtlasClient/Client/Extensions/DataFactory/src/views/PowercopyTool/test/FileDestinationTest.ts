/* tslint:disable:no-unused-variable */
/* tslint:disable:no-any */
/* tslint:disable:align */
import CopyToolModule = require("../PowercopyTool");
import copyTool = CopyToolModule.copyTool;
import TestUtilModule = require("./TestUtil");
import Constants = require("../Constants");
import Common = require("../Common");
import DataTypeConstants = require("../DataTypeConstants");
import WizardBindingModule = require("../../../bootstrapper/WizardBinding");
import wizardBinding = WizardBindingModule.Wizard;
import wait = TestUtilModule.wait;
import logUtil = TestUtilModule.log;
import setFormFieldValue = TestUtilModule.setFormFieldValue;

let testName = "fileDestinationTest";

function log(message: string) {
    TestUtilModule.log(testName, message);
}

function assert(condition: boolean, validationMessage: string) {
    TestUtilModule.assert(testName, condition, validationMessage);
}

function navigateBackwards(wizard: WizardBindingModule.Wizard, targetStep: string, targetSubstep?: string) {
    do {
        wizard.previous();
    } while (wizard.currentStep() !== targetStep || (targetSubstep && wizard.currentSubstep() !== targetSubstep));
}

function navigateForward(wizard: WizardBindingModule.Wizard, targetStep?: string, targetSubstep?: string): Q.Promise<any> {
    let promise = Q({ step: wizard.currentStep(), substep: wizard.currentSubstep() });
    for (let i = 0; i < 10; i++) {
        promise = promise.then(stepSubstep => {
            if (!stepSubstep) {
                return null;
            }
            if (stepSubstep.step === targetStep && (!targetSubstep || stepSubstep.substep === targetSubstep)) {
                return null;
            }
            wizard.next();
            return wait(() => wizard.currentStep() !== stepSubstep.step || wizard.currentSubstep() !== stepSubstep.substep).then(() => {
                return {
                    step: wizard.currentStep(),
                    substep: wizard.currentSubstep()
                };
            });
        });
    }
    return promise;
}

export function runTest() {
    let blobBrowser = copyTool.sourceNavModel.blobBrowser;
    let wizard = copyTool.wizard;
    let source = copyTool.sourceNavModel;
    let destination = copyTool.destinationNavModel;
    let copyBehavior = destination.copyBehavior;
    TestUtilModule.clearLog(testName);
    log("Starting test");

    wizard.next();
    return wait(() => wizard.currentSubstep() === Constants.dataType).then(() => {
        log("Selecting blob source");
        copyTool.sourceNavModel.dataType(DataTypeConstants.blobStorage);
        wizard.next();
        return wait(() => wizard.currentSubstep() === Constants.connection);
    }).then(() => {
        log("Filling up storage connection form");
        TestUtilModule.fillBlobConnectionForm(source);
    }).then(() => {
        wizard.next();
        return wait(() => wizard.currentSubstep() === Constants.location && blobBrowser.listItems.items().length > 0);
    }).then(() => {
        log("Selecting blob folder");
        let folderToSelect = blobBrowser.listItems.items().filter(itm => itm.name === "rawgameevents")[0];
        blobBrowser.selectBlob(folderToSelect, false);
        blobBrowser.choose();
        wizard.next();
        return wait(() => wizard.currentSubstep() === Constants.fileFormat && source.schema && copyTool.sourceNavModel.schema() && source.schema().length > 0);
    }).then(() => {
        log("File format screen");
        wizard.next();
        return wait(() => wizard.currentStep() === Constants.destination);
    }).then(() => {
        log("Selecting blob source");
        copyTool.destinationNavModel.dataType(DataTypeConstants.blobStorage);
        wizard.next();
        return wait(() => wizard.currentSubstep() === Constants.connection);
    }).then(() => {
        log("Filling up storage connection form");
        TestUtilModule.fillBlobConnectionForm(destination);
    }).then(() => {
        wizard.next();
        return wait(() => wizard.currentSubstep() === Constants.hierarchicalLocation && blobBrowser.listItems.items().length > 0);
    }).then(() => {
        // verify destination in case source was a folder
        assert(copyBehavior.options.visible(), "Copy behavior setting is visible");
        assert(copyBehavior.value() === undefined, "Copy behavior is set to default (merge files)");
        assert(copyBehavior.options.enabled(), "Copy behaviour is enabled");
        copyBehavior.value(Constants.preserveHierarchy);
        (<any>destination).filename("myfile");
        assert(!copyBehavior.options.enabled(), "Copy behaviour is disabled");
        (<any>destination).filename("");
        assert(copyBehavior.value() === undefined, "Copy behavior is set to default (merge files)");
        assert(copyBehavior.options.enabled(), "Copy behaviour is enabled");
        copyBehavior.value(Constants.preserveHierarchy);
        wizard.next();
        return wait(() => wizard.currentSubstep() === Constants.fileFormat);
    }).then(() => {
        wizard.next();
        return wait(() => wizard.currentStep() === Constants.summary);
    }).then(() => {
        let deployment = copyTool.createDeployment();
        assert(deployment.deploymentString.indexOf("copyBehavior") !== -1, "Deployment string contains copyBehavior property");
        assert(deployment.deploymentString.indexOf(Constants.preserveHierarchy) !== -1, "Deployment string contains preserveHierarchy value");
        assert(deployment.deploymentString.indexOf("fileName") === -1, "Filename is not present in deployment string");
        assert(deployment.deploymentString.indexOf("structure") !== -1, "Structure property is present");
        navigateBackwards(wizard, Constants.destination, Constants.hierarchicalLocation);
        (<any>destination).filename("myfile");
        wizard.next();
        return wait(() => wizard.currentSubstep() === Constants.fileFormat);
    }).then(() => {
        wizard.next();
        return wait(() => wizard.currentStep() === Constants.summary);
    }).then(() => {
        let deployment = copyTool.createDeployment();
        assert(deployment.deploymentString.indexOf("copyBehavior") === -1, "Deployment string does not contains copyBehavior property");
        assert(deployment.deploymentString.indexOf(Constants.preserveHierarchy) === -1, "Deployment string doesn't contain preserveHierarchy value");
        assert(deployment.deploymentString.indexOf("fileName") !== -1, "Filename is present in deployment string");
        // by default we are not setting recursive copy
        assert(deployment.deploymentString.indexOf("\"recursive\": false") !== -1, "Recursive is set to false");

        // set recursive and binary copy
        navigateBackwards(wizard, Constants.source, Constants.location);
        (<any>source).binaryCopy(true);
        source.recursiveCopy(true);
        wizard.next();
        return wait(() => wizard.currentStep() === Constants.destination);
    }).then(() => {
        return navigateForward(wizard, Constants.destination, Constants.hierarchicalLocation);
    }).then(() => {

        assert(copyBehavior.value() === Constants.preserveHierarchy, "Preserve hierarchy has been set for binary copy");
        assert(copyBehavior.options.visible(), "Copy behavior field is visible");
        assert(!copyBehavior.options.enabled(), "Copy behavior field is disabled");
        assert((<any>destination).filenameEnabled() === false, "Filename field is disabled");
        assert((<any>destination).fileSuffixEnabled() === false, "File suffix is not enabled");
        wizard.next();
        return wait(() => wizard.currentStep() === Constants.summary);
    }).then(() => {
        let deployment = copyTool.createDeployment();
        assert(deployment.deploymentString.indexOf("copyBehavior") !== -1, "Deployment string contains copyBehavior property");
        assert(deployment.deploymentString.indexOf(Constants.preserveHierarchy) !== -1, "Deployment string contains preserveHierarchy value");
        assert(deployment.deploymentString.indexOf("fileName") === -1, "Filename is not present in deployment string");
        assert(deployment.deploymentString.indexOf("\"recursive\": true") !== -1, "Recursive is set to true");
        assert(deployment.deploymentString.indexOf("structure") === -1, "Structure property is not present");

        // Navigate backwards and select single file
        navigateBackwards(wizard, Constants.source, Constants.location);
        source.showBlobBrowser(true);
        let fileToSelect = blobBrowser.listItems.items().filter(itm => itm.name === "rawstats-20140501.csv")[0];
        blobBrowser.selectBlob(fileToSelect, false);
        blobBrowser.choose();
        assert(blobBrowser.directorySelected() === false, "File is selected - not directory");
        (<any>source).binaryCopy(false);
        return navigateForward(wizard, Constants.destination, Constants.hierarchicalLocation);
    }).then(() => {
        assert((<any>destination).filenameEnabled(), "Filename field is enabled");
        // Go back and test SQL -> Blob scenarios
        navigateBackwards(wizard, Constants.source, Constants.dataType);
        source.dataType(DataTypeConstants.sqlAzure);
        wizard.next();
        return wait(() => wizard.currentSubstep() === Constants.connection);
    }).then(() => {
        TestUtilModule.fillSqlConnectionForm(source);
        wizard.next();
        return wait(() => wizard.currentSubstep() === Constants.location && source.tableList().length > 0);
    }).then(() => {
        source.tableList()[0].selected(true);
        source.tableList()[1].selected(true);
        return navigateForward(wizard, Constants.destination, Constants.hierarchicalLocation);
    }).then(() => {

        assert(!copyBehavior.options.visible(), "Copy behavior field is not visible");
        assert((<any>destination).filenameEnabled() === false, "Filename field is disabled");
        assert((<any>destination).fileSuffixEnabled() === true, "File suffix is enabled");
        (<any>destination).folderPath("testfolderpath");
        (<any>destination).fileSuffix("{custom}.txt");
        assert(destination.partitions().length === 1, "Destination has 1 partition - from file suffix");
        return navigateForward(wizard, Constants.summary);
    }).then(() => {
        let deployment = copyTool.createDeployment();
        assert(deployment.deploymentString.indexOf("copyBehavior") === -1, "Copy behavior property is not present");
        assert(deployment.deploymentString.match(/\"filename\"[^{]+{custom}/gi).length === 2, "Deployment contains 2 instances of filename property with expected valud");
        navigateBackwards(wizard, Constants.source, Constants.location);

        //  unselect second table so there is only one table selected
        source.tableList()[1].selected(false);
        return navigateForward(wizard, Constants.destination, Constants.hierarchicalLocation);
    }).then(() => {

        assert(!copyBehavior.options.visible(), "Copy behavior field is not visible");
        assert((<any>destination).filenameEnabled() === true, "Filename field is enabled");
        assert((<any>destination).fileSuffixEnabled() === false, "File suffix is not enabled");
        (<any>destination).folderPath("testfolderpath");
        (<any>destination).filename("testfilename{custom}");
        assert(destination.partitions().length === 1, "Destination has 1 partition - from file name");
        return navigateForward(wizard, Constants.summary);
    }).then(() => {
        TestUtilModule.completeTest(testName);
    }).fail(reason => {
        TestUtilModule.failTest(testName, reason);
    });
}
/* tslint:enable:no-unused-variable */
/* tslint:enable:no-any */
/* tslint:enable:align */
