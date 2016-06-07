import DiagramLayout = require("./DiagramLayout");
import TypeDeclarations = require("../../../../scripts/Framework/Shared/TypeDeclarations");

"use strict";

export function _updateBoundingBox(boundingBox: TypeDeclarations.Controls.Visualization.Graph.IRect, graphNode: DiagramLayout.IGraphNode) {
    let bbBottomRightX = boundingBox.x + boundingBox.width;
    let bbBottomRightY = boundingBox.y + boundingBox.height;

    boundingBox.x = Math.min(boundingBox.x, graphNode.X);
    boundingBox.y = Math.min(boundingBox.y, graphNode.Y);
    boundingBox.width = Math.max(bbBottomRightX, graphNode.X + graphNode.Width) - boundingBox.x;
    boundingBox.height = Math.max(bbBottomRightY, graphNode.Y + graphNode.Height) - boundingBox.y;
}
