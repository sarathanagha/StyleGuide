import Net = require("../Net");
import FormRender = require("../FormRender");
import Constants = require("../Constants");

let testDiv;

function writeResult(result: string) {
    if (!testDiv) {
        testDiv = document.createElement("div");
        testDiv.setAttribute("style", "z-index:30000;position:fixed;top:0;background-color:black;width:100%;height:50px;color:white");
        testDiv.setAttribute("class", "testReport");
        document.body.appendChild(testDiv);
    }
    testDiv.innerText = result;
}

export function runTest(testRunInfo: KnockoutObservable<string>) {
    testRunInfo.subscribe(info => {
        let requestPayload: string;
        try {
            requestPayload = JSON.parse(info);
        } catch (e) {
            writeResult("FAIL: Unable to parse payload");
            return null;
        }

        return Net.sendMessage(Constants.queryUrl + "/testconnection", "POST", null, requestPayload).then((testConnectionResult: FormRender.IConnectionTestResult) => {
            if (testConnectionResult.isValid) {
                writeResult("PASS");
            } else {
                writeResult("FAIL: Connection test failed, error message: " + testConnectionResult.errorMessage);
            }
        }).fail(reason => {
            writeResult("FAIL:" + JSON.stringify(reason));
        });
    });
}
