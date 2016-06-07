// <reference path="../../../References.d.ts" />
// <reference path="../scripts/knockout/BindingHandler.ts" />
/// <reference path="../../../../bin/Module.d.ts" />

/// <amd-dependency path="text!./navbar.html" />


import ko = require("knockout");
export var template: string = require("text!./navbar.html");

export class viewModel {
  
    public views: any;
    public currentTab = ko.observable<string>();
    public currentSubTab= ko.observable<string>();
    public heightnav = ko.observable<boolean>(false);
    public currentIndex = ko.observable<number>();
    constructor(parameters: any) {
        this.currentTab =parameters.currentTab;
        this.currentSubTab = parameters.currentSubTab;
        this.views = parameters.views;
        this.currentIndex = parameters.currentIndex;
        this.heightnav(false);
    }
    public enabledetails = (data,event) => { 
        this.views.forEach((view:any) => {
            if (data.name == view.name && this.currentTab() == data.name) {
                view.visible(!view.visible());
            }
        },this);
        this.currentTab(data.name);
        if (<any>($('#Sidemenu')).height() - <any>($('.waveBlueDark')).height() - 28 > <any>($('#nav')).height()) {
            this.heightnav(true);
        }
        else {
            this.heightnav(false);
        }
   
        
    }
    enableChildView = (data,index) => {
        console.log("Child:::", data, this, index());
        this.currentIndex(index());
    }

  

} 

ko.bindingHandlers['stopBubble'] = {
    init: function (element) {
        ko.utils.registerEventHandler(element, "click", function (event) {
            event.cancelBubble = true;
            if (event.stopPropagation) {
                event.stopPropagation();
            }
        });
    }
};


