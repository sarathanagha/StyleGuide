import CanvasCopyActivity = require("./CopyActivity");
import Shared = require("../Shared");
import CommonWizardPage = require("../../../Shared/CommonWizardPage");
import PipelineModel = require("../../../../scripts/Framework/Model/Contracts/Pipeline");
import CopyActivityWizard = require("../../Wizards/CopyActivityWizard");
import CanvasDataset = require("../Tables");
import DatasetTool = require("../../Wizards/DatasetTool");

// Copy Activity canvas node should be able to instantiate CopyWizard, but CopyWizard can end up creating multiple nodes, hence
// it needs a reference to Copy Activity canvas node. Requirejs's circular dependency handling would have worked fine in this case, but we forbid
// circular dependencies becase we have no tooling to detect if they are causing any problem. Hence, we are going via this route of injection.
export function patchCopyActivityNode(): void {
    (<Shared.GraphContracts.IExtensionConfig>CanvasCopyActivity.CopyActivityNode.prototype).onEdit = function copyActivityOnEdit(): Q.Promise<Shared.GraphContracts.IExtensionPiece[]> {
        // TODO paverma Yet to consolidate the pipeline properties with the one on the AppContext.
        let deferred = Q.defer<Shared.GraphContracts.IExtensionPiece[]>();
        let pipelineProperties = new CommonWizardPage.PipelineProperties({
            startDate: new Date("2016-01-01"),
            endDate: new Date("2016-05-01")
        }, PipelineModel.PipelineMode.Scheduled);
        let wizard = new CopyActivityWizard.CopyWizard(pipelineProperties, deferred);
        wizard.showOverlay();
        return deferred.promise;
    };
}

export function patchDatasetNode(): void {
    (<Shared.GraphContracts.IExtensionConfig>CanvasDataset.TableNode.prototype).onEdit = function datasetOnEdit(): Q.Promise<Shared.GraphContracts.IExtensionPiece[]> {
        let deferred = Q.defer<Shared.GraphContracts.IExtensionPiece[]>();
        let datasetDialog = new DatasetTool.DatasetTool(this.entity, deferred);
        datasetDialog.showOverlay();
        return deferred.promise;
    };

}

export function patchNodes(): void {
    patchCopyActivityNode();
    patchDatasetNode();
}
