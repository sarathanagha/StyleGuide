// <reference path="../../../References.d.ts" />
/// <reference path="../../../../bin/Module.d.ts" />
/// <amd-dependency path="text!./home.html" />
/// <amd-dependency path="css!./home.css" />


import ko = require("knockout");
export var template: string = require("text!./home.html");
import view = require('./navmodel');
import shouter = require("./scrollSpy");

export class viewModel {
    public static messageToPublish: string = 'messageToPublish';
    public static message: string = 'message';
    public static Reset: string = 'Reset';
    shouter:any = new ko.subscribable();
    views: any;
    imagepath: any;
    public currentView = ko.observable<string>('designguide-home-about');
    public currentTab = ko.observable<string>('About');
    public previousLabel = ko.observable<string>('');
    public nextLabel = ko.observable<string>('Design');
    public currentSubTab = ko.observable<string>('');
    public currentIndex = ko.observable<number>(0);

    constructor() {
        console.log(shouter);
        this.views = new view.DesignGuideModel().views();
        this.shouter.subscribe( (newValue: number) => {
            this.views.forEach((view:any) => {
                if (this.currentTab() === view.name) {
                    (view.children[newValue] != undefined) ? this.currentSubTab(view.children[newValue].name) : this.currentSubTab('');
                }
            }, this);

        }, this, viewModel.messageToPublish);

        this.currentIndex.subscribe((index:number) => {
            this.shouter.notifySubscribers(index, viewModel.message);
        },this);

        this.currentTab.subscribe((newText:string) => {
            var index = 0;
            this.views.forEach((view:any) => {
                if (newText === view.name) {
                    this.shouter.notifySubscribers(newText, viewModel.Reset);
                    //lastScrollTop = undefined;
                    <any>($('.editorArea')).scrollTop(0);
                    this.views[index + 1] ? this.nextLabel(this.views[index + 1].name) : this.nextLabel('');
                    this.views[index - 1] ? this.previousLabel(this.views[index - 1].name) : this.previousLabel('');
                    this.currentView(view.component);
                    this.views[index].visible(true);
                    if (view.children.length > 0) {
                        this.currentSubTab(view.children[0].name);
                    }
                    else {
                        this.currentSubTab('');
                    }
                }
                else {
                    this.views[index].visible(false);
                }

                index++;
            }, this);
        },this);

    }

    public navigate(data,event) {
        
        var index = 0;
        this.views.forEach((view:any)=> {
            if (this.currentTab() == view.name) {
                (event.currentTarget.className == 'prev') ? this.currentTab(this.views[index - 1].name) : this.currentTab(this.views[index + 1].name);
                //lastScrollTop = undefined;
                this.shouter.notifySubscribers({}, viewModel.Reset);
                <any>($('.editorArea')).scrollTop(0);
                return;
            }
            index++;
        }, this);
    }
}