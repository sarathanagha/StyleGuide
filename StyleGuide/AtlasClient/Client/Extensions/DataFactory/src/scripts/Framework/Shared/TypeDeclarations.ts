/// <reference path="../../../libs/VivaGraphControl/moduleDefinitions.d.ts" />
/// <reference path="../../../References.d.ts" />

import VivaGraphDisposable = require("Viva.Controls/Base/Base.Disposable");
import VivaGraphPromise = require("../../../libs/VivaGraphControl/Content/Scripts/Viva.Controls/Controls/Base/Promise");
import VivaGraphImage = require("../../../libs/VivaGraphControl/Content/Scripts/Viva.Controls/Controls/Base/Image");
import VivaGraphGeometry = require("../../../libs/VivaGraphControl/Content/Scripts/Viva.Controls/Controls/Visualization/Graph/Geometry");

/* tslint:disable:interface-name */
export interface Promise extends VivaGraphPromise.Promise { };
export interface PromiseV<T> extends VivaGraphPromise.PromiseV<T> { };
export interface PromiseN<T> extends VivaGraphPromise.PromiseN<T> { };
export interface PromiseVN<T, U> extends VivaGraphPromise.PromiseVN<T, U> { }

export type LifetimeManager = VivaGraphDisposable.LifetimeManager;
export type DisposableLifetimeManager = VivaGraphDisposable.DisposableLifetimeManager;
export type Image = VivaGraphImage.ImageContract;
export type Disposable = VivaGraphDisposable.Disposable;

export module Controls.Visualization.Graph {
    export type IRect = VivaGraphGeometry.IRect;
    export type IPoint = VivaGraphGeometry.IPoint;
}

export interface PartContainerContract extends LifetimeManager {
    fail: (msg) => void;
}

export type JQueryXHRString = XMLHttpRequest;
