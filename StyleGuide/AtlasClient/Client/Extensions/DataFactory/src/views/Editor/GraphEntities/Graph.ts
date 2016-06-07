/// <reference path="../../../references.d.ts" />

import Includes = require("./Includes");
import Node = require("./Node");
import Edge = require("./Edge");
import KnockoutExtensions = require("Viva.Controls/Controls/Base/KnockoutExtensions");
import GraphContracts = Includes.GraphContracts;

export class Graph {
    public selectedEntities: StringMap<Includes.IGraphEntity> = {};
    public multiSelect: KnockoutObservable<boolean> = ko.observable(false);
    public scale: KnockoutObservable<number> = ko.observable(1);
    public center: KnockoutComputed<GraphContracts.IPoint>;

    public nodes: KnockoutExtensions.IMutableObservableMap<Node.Node> = new KnockoutExtensions.ObservableMap<Node.Node>();
    public edges: KnockoutExtensions.IMutableObservableMap<Edge.Edge> = new KnockoutExtensions.ObservableMap<Edge.Edge>();

       // graph JSON representation
    public savedGraph: KnockoutObservable<GraphContracts.IGraph> = ko.observable(null);

    /* Addition */

    public addEdge = (startNode: Node.Node, endNode: Node.Node) => {
        let newEdge = new Edge.Edge(startNode, endNode);

        let siblingEdge = this.edges.lookup(newEdge.siblingId());

        if (siblingEdge) {
            siblingEdge.addSibling(newEdge);
            return;
        }

        this.edges.put(newEdge.id(), newEdge);
    };

    public addNode = (node: Node.Node) => {
        this.nodes.put(node.id(), node);
        this.clearSelection();
        this.selectEntity(node);
    };

    /* Removal */

    public deleteSelected = () => {
        if (this.selectedEntities) {
            $.each(this.selectedEntities, (index, entity) => {
                this.deleteEntity(entity);
            });
        }
    };

    public deleteEntity = (entity: Includes.IGraphEntity) => {
        this.deselectEntity(entity);

        if (entity instanceof Node.Node) {
            this.nodes.remove(entity.id());
            // remove corresponding edges
            entity.edges.forEach((edge) => {
                this.edges.remove(edge.id());
            });
        } else if (entity instanceof Edge.Edge) {
            if (entity.isCycle()) {
                entity.removeSibling();
                return;
            } else {
                this.edges.remove(entity.id());
            }
        }

        entity.dispose();
    };

    /* Selection */

    public clearSelection = () => {
        $.each(this.selectedEntities, (index, entity) => {
            this.deselectEntity(entity);
        });
    };

    public deselectEntity = (entity: Includes.IGraphEntity) => {
        entity.selected(false);
        delete this.selectedEntities[entity.id()];
    };

    public selectEntity = (entity: Includes.IGraphEntity, singleSelection = false) => {
        this.selectEntities([entity], singleSelection);
    };

    public selectEntities = (entities: Includes.IGraphEntity[], singleSelection = false) => {
        if (!this.multiSelect() || singleSelection) {
            this.clearSelection();
        }

        entities.forEach((entity) => {
            this.selectedEntities[entity.id()] = entity;
            entity.selected(true);
        });
    };

    public saveGraph = () => {
        let nodes: StringMap<GraphContracts.INode> = {}, edges: GraphContracts.IEdge[] = [];

        this.nodes.forEach((node, id) => {
            let x = node.location().x - this.center().x;
            let y = node.location().y - this.center().y;
            let width = node.width();
            let height = node.height();

            nodes[id] = {
                rect: {
                    x: x, y: y, width: width, height: height
                }
            };
        });

        this.edges.forEach((edge) => {
            edges.push({startId: edge.startNode().id(),
                endId: edge.endNode().id()
            });
        });

        this.savedGraph({nodes: nodes, edges: edges});

    };

    public restoreGraph = () => {
        if(!this.savedGraph()) {
            return;
        }

        $.each(this.savedGraph().nodes, (id: string, graphNode: GraphContracts.INode) => {
            // TODO iannight: currently we are only restoring existing nodes. We'll have to have a more robust model eventually so we can create identical new nodes
            let nodes = this.nodes.toArray().filter((node) => { return node.id() === id; });

            if (nodes.length !== 1) {
                return;
            }

            let node = nodes[0];

            node.height(graphNode.rect.height);
            node.width(graphNode.rect.width);

            let x = (graphNode.rect.x + this.center().x);
            let y = (graphNode.rect.y + this.center().y);

            node.location({ x: x, y: y });
        });

        // TODO iannight: Restore edges as well once we have an observable map
    };
}
