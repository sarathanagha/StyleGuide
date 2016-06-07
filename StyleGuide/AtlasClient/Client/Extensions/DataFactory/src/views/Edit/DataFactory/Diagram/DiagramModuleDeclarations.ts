/// <reference path="../../../../libs/VivaGraphControl/moduleDefinitions.d.ts" />
import TypeDeclarations = require("../../../../scripts/Framework/Shared/TypeDeclarations");

import AppContext = require("../../../../scripts/AppContext");
 /* tslint:disable:no-unused-variable */
import VivaGraphEntityViewModel = require("Viva.Controls/Controls/Visualization/Graph/GraphEntityViewModel");
import VivaGraphWidget = require("Viva.Controls/Controls/Visualization/Graph/GraphWidget");
 /* tslint:enable:no-unused-variable */
import VivaGraphViewModel = require("Viva.Controls/Controls/Visualization/Graph/GraphViewModel");
import Framework = require("../../../../_generated/Framework");

let logger = Framework.Log.getLogger({
    loggerName: "DiagramModuleDeclarations"
});

export module Controls.Visualization.Graph {
    export import IRect = TypeDeclarations.Controls.Visualization.Graph.IRect;
    export import IPoint = TypeDeclarations.Controls.Visualization.Graph.IPoint;

    export class ViewModel extends VivaGraphViewModel.ViewModel {
        public widgetAttached: KnockoutObservable<boolean> = ko.observable(true);

        constructor(lifetimeManager: TypeDeclarations.DisposableLifetimeManager, graphEditorSkinStyle?: VivaGraphViewModel.GraphEditorSkinStyle) {
            super(graphEditorSkinStyle);
        }

        public getNodeRectsAccessor(): TypeDeclarations.PromiseV<StringMap<IRect>> {
            return Q(this.getNodeRects()());
        }
    }

    export import GraphNode = VivaGraphEntityViewModel.GraphNode;
    export import GraphWidget = VivaGraphWidget.Widget;
    export import GraphEditorCapabilities = VivaGraphViewModel.GraphEditorCapabilities;
    export import GraphEdge = VivaGraphEntityViewModel.GraphEdge;
    export import ISetNodeRectOptions = VivaGraphEntityViewModel.ISetNodeRectOptions;
    export import GraphEntity = VivaGraphEntityViewModel.GraphEntity;
    export import IUpdateRect = VivaGraphEntityViewModel.IUpdateRect;
    export import GraphEntityViewModel = VivaGraphWidget.GraphEntityViewModel;
}

export module Security {
    export function hasPermission(resourceId: string, permissions: string[]): TypeDeclarations.PromiseV<boolean> {
        let deferred = Q.defer<boolean>();
        AppContext.AppContext.getInstance().armService.getUserPermissions(resourceId).then((permissionRules) => {
            deferred.resolve(Framework.Security.checkIfPermissionsMatchesRules(permissions, permissionRules));
        }, (reason) => {
            // Something bad happened, so allow user to make edits and perhaps they will go through.
            logger.logError("Failed to retrieve user's permission on the datafactory: " + JSON.stringify(reason));
            deferred.resolve(true);
        });
        return deferred.promise;
    }
}

// TODO paverma MdpExtension's DateTime relies on Ibiza's api which follows the Intl.DateTime standard.
// Bring the standard's implementation itself.
export module DateTime {
    export function localDateToRelativeString(date: Date) {
        return moment(date).fromNow();
    }
}

export import TableModel = require("../../../../scripts/Framework/Model/Contracts/DataArtifact");

export import ActivityModel = require("../../../../scripts/Framework/Model/Contracts/Activity");

export import PipelineModel = require("../../../../scripts/Framework/Model/Contracts/Pipeline");

export import ResourceIdUtil = require("../../../../scripts/Framework/Util/ResourceIdUtil");

export import VivaUtil = require("Viva.Controls/Util/Util");

export import Util = require("../../../../scripts/Framework/Util/Util");

// TODO paverma Remove these entirely since we have taken the code drop and will no longer
// maintain sync.
export module ExtensionDefinition {
    export module ViewModels.Shared.DiagramViewModel {
        export interface InputsContract {
            factoryId: string;
        }
    }
}

export import DiagramContracts = require("../../../../scripts/Framework/Model/Contracts/Diagram");
