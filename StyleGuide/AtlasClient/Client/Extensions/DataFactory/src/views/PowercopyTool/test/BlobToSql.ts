/* tslint:disable:no-unused-variable */
/* tslint:disable:no-any */
/* tslint:disable:align */
import AppContext = require("../../../scripts/AppContext");
import ActivityWindowModel = require("../../../scripts/Framework/Model/Contracts/ActivityWindow");
import CopyToolModule = require("../PowercopyTool");
import copyTool = CopyToolModule.copyTool;
import DataNavModelModule = require("../DataNavModel");
import DataNavModel = DataNavModelModule.DataNavModel;
import Constants = require("../Constants");
import FormFields = require("../../../bootstrapper/FormFields");
import DataTypeConstants = require("../DataTypeConstants");
import TestUtilModule = require("./TestUtil");
import wait = TestUtilModule.wait;
import logUtil = TestUtilModule.log;
import setFormFieldValue = TestUtilModule.setFormFieldValue;
import pollForActivityWindows = TestUtilModule.pollForActivityWindows;

let testName = "blobToSql";
function log(message: string) {
    logUtil(testName, message);
}

export function runTest() {
    TestUtilModule.clearLog(testName);
    let blobBrowser = copyTool.sourceNavModel.blobBrowser;
    let wizard = copyTool.wizard;
    log("Starting test");

    wizard.next();
    return wait(() => wizard.currentSubstep() === Constants.dataType).then(() => {
        log("Selecting blob source");
        copyTool.sourceNavModel.dataType(DataTypeConstants.blobStorage);
        wizard.next();
        return wait(() => wizard.currentSubstep() === Constants.connection);
    }).then(() => {
        log("Filling up storage connection form");
        let vm = copyTool.sourceNavModel;
        TestUtilModule.fillBlobConnectionForm(vm);
    }).then(() => {
        wizard.next();
        return wait(() => wizard.currentSubstep() === Constants.location && blobBrowser.listItems.items().length > 0);
    }).then(() => {
        log("Selecting blob");
        let folderToSelect = blobBrowser.listItems.items().filter(itm => itm.name === "rawgameevents")[0];
        blobBrowser.selectBlob(folderToSelect, false);
        blobBrowser.choose();
        wizard.next();
        return wait(() => wizard.currentSubstep() === Constants.fileFormat && copyTool.sourceNavModel.schema && copyTool.sourceNavModel.schema() && copyTool.sourceNavModel.schema().length > 0);
    }).then(() => {
        log("File format screen");
        wizard.next();
        return wait(() => wizard.currentStep() === Constants.destination);
    }).then(() => {
        log("Destination screen, selecting sql azure source");
        copyTool.destinationNavModel.dataType(DataTypeConstants.sqlAzure);
        wizard.next();
        return wait(() => wizard.currentSubstep() === Constants.connection);
    }).then(() => {
        log("Filling up sql connection form");
        let vm = copyTool.destinationNavModel;
        TestUtilModule.fillSqlConnectionForm(vm);
        wizard.next();
        return wait(() => wizard.currentSubstep() === Constants.tableLocation && vm.tableList().length > 0);
    }).then(() => {
        log("Selecting destination table");
        let destinationTableViewModel = <any>copyTool.destinationTableViewModels()[0];
        destinationTableViewModel.existingTable.value("tableFromBlob");
        wizard.next();
        return wait(() => wizard.currentSubstep() === Constants.columnMapping && destinationTableViewModel.columnMappings().length > 0);
    }).then(() => {
        log("Waiting for column mappings to load");
        wizard.next();
        return wait(() => wizard.currentStep() === Constants.summary);
    }).then(() => {
        log("Summary screen");
        wizard.next();
        log("Waiting for deployment to finish");
        return wait(() => (<any>copyTool.deployer).deploymentDone(), 180000);
    }).then(() => {
        log("Deployment complete, waiting for activity run");
        return pollForActivityWindows();
    }).then(activityWindow => {
        if (activityWindow.windowState !== "Ready") {
            throw "Unexected activity window state: " + activityWindow.windowState;
        } else {
            log("Activity run was successful");
            TestUtilModule.completeTest(testName);
        }
    })
        .fail(reason => {
            TestUtilModule.failTest(testName, reason);
        });
}
/* tslint:enable:no-unused-variable */
/* tslint:enable:no-any */
/* tslint:enable:align */
