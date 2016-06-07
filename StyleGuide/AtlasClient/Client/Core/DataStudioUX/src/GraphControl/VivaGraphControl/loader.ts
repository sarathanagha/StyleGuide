/// <reference path="../../references.d.ts" />

/// <amd-dependency path="css!./Content/CSS/LightTheme.css" />
/// <amd-dependency path="css!./Content/CSS/TempTheme.css" />
/// <amd-dependency path="css!./Content/CSS/DarkTheme.css" />
/// <amd-dependency path="css!./Content/CSS/Graph.css" />

import VivaGraphWidget = require("VivaGraphControl/Content/Scripts/Viva.Controls/Controls/Visualization/Graph/GraphWidget");
import VivaUtil = require("VivaGraphControl/Content/Scripts/Viva.Controls/Util/Util");
import VivaResize = require("VivaGraphControl/Content/Scripts/Viva.Controls/Util/Resize");
import VivaGraphSvgUtils = require("VivaGraphControl/Content/Scripts/Viva.Controls/Controls/Visualization/Graph/SvgUtils");
import VivaGraphDisposable = require("VivaGraphControl/Content/Scripts/Viva.Controls/Base/Base.Disposable");
import VivaGraphPromise = require("VivaGraphControl/Content/Scripts/Viva.Controls/Controls/Base/Promise");
import VivaGraphImage = require("VivaGraphControl/Content/Scripts/Viva.Controls/Controls/Base/Image");
import VivaGraphGeometry = require("VivaGraphControl/Content/Scripts/Viva.Controls/Controls/Visualization/Graph/Geometry");
import VivaGraphLifetimeManager = require("VivaGraphControl/Content/Scripts/Viva.Controls/Base/Base.TriggerableLifetimeManager");
import VivaGraphViewModel = require("VivaGraphControl/Content/Scripts/Viva.Controls/Controls/Visualization/Graph/GraphViewModel");
import VivaGraphEntityViewModel = require("VivaGraphControl/Content/Scripts/Viva.Controls/Controls/Visualization/Graph/GraphEntityViewModel");

declare var Microsoft;

Microsoft = Microsoft || {};
Microsoft.DataStudioUX = Microsoft.DataStudioUX || {};

module GraphControl {
	export import ViewModel = VivaGraphViewModel.ViewModel;
	export import GraphNode = VivaGraphEntityViewModel.GraphNode;
	export import GraphWidget = VivaGraphWidget.Widget;
	export import GraphEditorCapabilities = VivaGraphViewModel.GraphEditorCapabilities;
	export import GraphEdge = VivaGraphEntityViewModel.GraphEdge;
	export import GraphEntity = VivaGraphEntityViewModel.GraphEntity;
	export import GraphEntityViewModel = VivaGraphWidget.GraphEntityViewModel;
}

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
graphNode1.extensionViewModel = {name: "Node 1"};
graphNode2.extensionViewModel = {name: "Node 2"};

// Add the graph nodes to the view model
viewModel.graphNodes.put("1", graphNode1);
viewModel.graphNodes.put("2", graphNode2);

// Add the edge between them
viewModel.addEdge({startNodeId: "1", endNodeId: "2"});

// Allow movement
viewModel.editorCapabilities(GraphControl.GraphEditorCapabilities.MoveEntities);

/* END EXAMPLE */

// Add this example to the object
Microsoft.DataStudioUX.Examples = {GraphControlViewModel: viewModel};