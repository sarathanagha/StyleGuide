/// <reference path="../../References.d.ts" />
/// <reference path="../../libs/mlstudio/typings/datalabclient.d.ts" />
/// <reference path="../../libs/mlstudio/typings/experimenteditor.d.ts" />

/// <amd-dependency path="../../libs/mlstudio/LocalizedResources" />
/// <amd-dependency path="../../libs/mlstudio/DataLabClient" />
/// <amd-dependency path="../../libs/mlstudio/MockShell" />
/// <amd-dependency path="../../libs/mlstudio/Shell" />
/// <amd-dependency path="../../libs/mlstudio/ExperimentEditor" />

/// <amd-dependency path="css!../../libs/mlstudio/CSS/experimenteditor-overrides.css"/>
/// <amd-dependency path="css!../../libs/mlstudio/CSS/DataLab.css" />
/// <amd-dependency path="css!../../libs/mlstudio/CSS/experimentEditor.css" />
/// <amd-dependency path="css!../../libs/mlstudio/CSS/common.css" />
/// <amd-dependency path="css!../../libs/mlstudio/CSS/xeScreenLayout.css" />
/// <amd-dependency path="css!../../libs/mlstudio/CSS/datalab.contextmenu.css" />
/// <amd-dependency path="css!../../libs/mlstudio/CSS/datalab.dialogs.css" />
/// <amd-dependency path="css!../../libs/mlstudio/CSS/datalab.validation.css" />
/// <amd-dependency path="css!../../libs/mlstudio/CSS/datalab.propertyeditor.css" />
/// <amd-dependency path="css!../../libs/mlstudio/CSS/ee-sprite.css" />

/// <amd-dependency path="text!./editor.html" />
/// <amd-dependency path="css!./editor.css" />

export var template: string = require("text!./editor.html");

export class viewModel {

    constructor(params: any) {
        viewModel.applyLocalizationToHTMLTemplates();
    }

    private static applyLocalizationToHTMLTemplates() {
        ExperimentEditor.typescriptResourceVariables.forEach(function (resource) {
            var replacement = viewModel.applyLocalizationToHTMLResource(eval(resource));
            eval(resource + " = " + JSON.stringify(replacement));
        });
    }

    private static applyLocalizationToHTMLResource(htmlResource: any): any {
        var replacement = htmlResource.replace(/%([a-zA-Z0-9_]+)%/g, function (match, variable) {
            var retValue = DataLab.LocalizedResources[variable];
            if (!retValue) {
                alert("Couldn't find localized resource: " + variable + ", perhaps there is syntax error in HTML template");
            }
            return retValue;
        });
        return replacement;
    }
}