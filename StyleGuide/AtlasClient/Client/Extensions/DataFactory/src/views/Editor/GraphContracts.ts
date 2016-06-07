/// <reference path="../../references.d.ts" />

export interface IPoint {
    x: number;
    y: number;
}

export interface IRect {
    x: number;
    y: number;
    width: number;
    height: number;
}

export interface IDisposable {
    dispose: () => void;
}

export interface IExtensionConfig {
    template: string;
    viewModel: Object;
    initialRect?: IRect;
    onEdit?: () => Q.Promise<IExtensionPiece[]>;
}

export interface ISummaryViewModel {
    updateSummary: (viewModels: Object[]) => void;
}

export interface ISummaryExtensionConfig extends IExtensionConfig {
    viewModel: ISummaryViewModel;
}

// Types for representing graph as JSON
export type INode = {
    rect: IRect;
}

export type IEdge = {
    startId: string;
    endId: string;
}

export type IGraph = {
    nodes: StringMap<INode>;
    edges: IEdge[];
}

export type IExtensionPiece = {
    inputConfigs: IExtensionConfig[];
    outputConfigs: IExtensionConfig[];

    mainConfig: IExtensionConfig;
}

export type IPuzzle = {
    pieces: IExtensionPiece[];
}
