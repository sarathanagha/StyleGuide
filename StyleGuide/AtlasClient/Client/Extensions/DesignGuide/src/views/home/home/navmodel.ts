// <reference path="../../../References.d.ts" />
/// <reference path="../../../../bin/Module.d.ts" />


import ko = require("knockout");


export class DesignGuideModel {
   
    constructor() {
       // console.log("Called::");
        
    }
    views = ko.observableArray([
        { name: "About", component: 'designguide-home-about', children: [], visible: ko.observable(false) },
        {
            name: "Design", component: 'designguide-home-design', children: [
                { name: 'AnimationsandTransitions' },
                { name: 'Color' },
                { name: 'Grid' },
                { name: 'Icons' },
                { name: 'Typography' }
            ],
            visible: ko.observable(false)
        },
        {
            name: "Layout", component: 'designguide-home-layout', children: [
                { name: 'Structure' },
                { name: 'DefaultLayout' },
                { name: 'Drawyer' },
                { name: 'ImmersiveWorkspace' }
            ], visible: ko.observable(false)
        },
        {
            name: "Navigation", component: 'designguide-home-navigation', children: [
                { name: 'WorkspaceHeader' },
                { name: 'TopNavigation' },
                { name: 'Pagination' },
                { name: 'HorizantalTabs' },
                { name: 'Search' }
            ], visible: ko.observable(false)
        },
        {
            name: "Components", component: 'designguide-home-component', children: [
                { name: 'Buttons', description: "Buttons are used for final actions and their intent is to 'complete' a user flow. For example, at the end of a form to submit it, or shown at the end of a modal dialog to close it.",options: [{}]  },
                { name: 'Callout' },
                { name: 'DateTimePicker' },
                { name: 'Menus' },
                { name: 'HyperLink' },
                { name: 'Forms' },
                { name: 'Label' },
                { name: 'List' },
                { name: 'ModalDialog' },
                { name: 'Popover' } ,
                { name: 'ProgressiveDisclosure' },
                { name: 'ProgressIndicators' },
                { name: 'SelectButtons' },
                { name: 'SelectMenu' },
                { name: 'Tooltips' },
                { name: 'Triggers' },
                { name: 'Alerts/Errors' }
                
            ], visible: ko.observable(false)
        },
        {
            name: "Partners", component: 'designguide-home-patterns', children: [
                { name: 'CommandBar' },
                { name: 'BlankStates' },
                { name: 'Notifications' },
                { name: 'LoadingExperiences' },
                { name: 'Wizard' }, ], visible: ko.observable(false)
        },
        { name: "Resources", component: 'designguide-home-resource', children: [], visible: ko.observable(false) }
    ]);
    
   
    
}