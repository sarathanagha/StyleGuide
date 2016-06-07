/// <reference path="../../references.d.ts" />
define(["require", "exports", "VivaGraphControl/Content/Scripts/Viva.Controls/Controls/Visualization/Graph/GraphWidget", "VivaGraphControl/Content/Scripts/Viva.Controls/Controls/Visualization/Graph/GraphViewModel", "VivaGraphControl/Content/Scripts/Viva.Controls/Controls/Visualization/Graph/GraphEntityViewModel", "css!./Content/CSS/LightTheme.css", "css!./Content/CSS/TempTheme.css", "css!./Content/CSS/DarkTheme.css", "css!./Content/CSS/Graph.css"], function (require, exports, VivaGraphWidget, VivaGraphViewModel, VivaGraphEntityViewModel) {
    Microsoft = Microsoft || {};
    Microsoft.DataStudioUX = Microsoft.DataStudioUX || {};
    var GraphControl;
    (function (GraphControl) {
        GraphControl.ViewModel = VivaGraphViewModel.ViewModel;
        GraphControl.GraphNode = VivaGraphEntityViewModel.GraphNode;
        GraphControl.GraphWidget = VivaGraphWidget.Widget;
        GraphControl.GraphEditorCapabilities = VivaGraphViewModel.GraphEditorCapabilities;
        GraphControl.GraphEdge = VivaGraphEntityViewModel.GraphEdge;
        GraphControl.GraphEntity = VivaGraphEntityViewModel.GraphEntity;
        GraphControl.GraphEntityViewModel = VivaGraphWidget.GraphEntityViewModel;
    })(GraphControl || (GraphControl = {}));
    Microsoft.DataStudioUX.GraphControl = GraphControl;
    /* BEGIN EXAMPLE */
    // Create the graph ViewModel
    var viewModel = new GraphControl.ViewModel();
    // Create two nodes, specifying their positioning
    var graphNode1 = new GraphControl.GraphNode({
        x: 100,
        y: 150,
        height: 100,
        width: 100
    });
    var graphNode2 = new GraphControl.GraphNode({
        x: 300,
        y: 150,
        height: 100,
        width: 100
    });
    // Create a template (using the graphNode binding)
    var template = "<div class='sampleNode' data-bind='graphNode:null, html: name'></div>";
    // Add the templates to the nodes
    graphNode1.extensionTemplate = template;
    graphNode2.extensionTemplate = template;
    // Give the nodes a ViewModel
    graphNode1.extensionViewModel = { name: "Node 1" };
    graphNode2.extensionViewModel = { name: "Node 2" };
    // Add the graph nodes to the view model
    viewModel.graphNodes.put("1", graphNode1);
    viewModel.graphNodes.put("2", graphNode2);
    // Add the edge between them
    viewModel.addEdge({ startNodeId: "1", endNodeId: "2" });
    // Allow movement
    viewModel.editorCapabilities(GraphControl.GraphEditorCapabilities.MoveEntities);
    /* END EXAMPLE */
    // Add this example to the object
    Microsoft.DataStudioUX.Examples = { GraphControlViewModel: viewModel };
});
//# sourceMappingURL=loader.js.map