// <reference path="../../../References.d.ts" />
/// <reference path="../../../../bin/Module.d.ts" />
/// <amd-dependency path="text!./component.html" />
import ko = require("knockout");
export var template: string = require("text!./component.html");
import UXInterfaces = Microsoft.DataStudioUX.Interfaces;

export class viewModel {
    myDate: any;
    
    public simpleMenuParams : UXInterfaces.IMenuBindingParams = {
        scrollClass: 'editorArea',
        options: [
            { label: 'Label 1', value: 1},
            { label: 'Label 2', value: 2 },
            { label: 'Label 3', value: 3 }
        ]
    };
    public complexMenuParams : UXInterfaces.IMenuBindingParams = {
        scrollClass: 'editorArea',
        options: [
            {label: 'Label 1', value: 1, description: "description 1" },
            { label: 'Label 2', value: 2, description: "description 2" },
            { label: 'Label 3', value: 3, description: "description 3" }
        ]
    };

    public dividerMenuParams: UXInterfaces.IMenuBindingParams = {
        scrollClass: 'editorArea',
        options: [
            { label: 'Label 1', value: 1 },
            "-",
            { label: 'Label 3', value: 3 },
            { label: 'Label 4', value: 4 }
        ]
    };
    public headerMenuParams: UXInterfaces.IMenuBindingParams = {
        scrollClass: 'editorArea',
        options: [
            { label: 'Label 1', value: 1 },
            "Header",
            { label: 'Label 3', value: 3 },
            { label: 'Label 4', value: 4 }
        ]
    };

    public disabledMenuParams: UXInterfaces.IMenuBindingParams = {
        scrollClass: 'editorArea',
        options: [
            { label: 'Label 1', value: 1 },
            { label: 'Label 2', value: 2, isDisabled: true },
            { label: 'Label 3', value: 3, isDisabled:true },
            { label: 'Label 4', value: 4 }
        ]
    };

    public iconMenuParams: UXInterfaces.IMenuBindingParams = {
        scrollClass: 'editorArea',
        options: [
            { label: 'Label 1', value: 1, iconPath: 'node_modules/@ms-atlas/datastudio-controls/Images/delete.svg' },
            { label: 'Label 2', value: 2, iconPath: 'node_modules/@ms-atlas/datastudio-controls/Images/lock.svg' },
            { label: 'Label 3', value: 3, iconPath: 'node_modules/@ms-atlas/datastudio-controls/Images/settings.svg' },
            { label: 'Label 4', value: 4, iconPath: 'node_modules/@ms-atlas/datastudio-controls/Images/search.svg'}
        ]
    };

    public cascadeMenuParams : UXInterfaces.IMenuBindingParams = {
        scrollClass: 'editorArea',
        options: [
            {
                label: 'Label 1', value: 1,
                options: [
                    {
                        label: 'a', value: 1,
                        options: [
                            {
                                label: 'b', value: 1
                            },
                            {
                                label: 'c', value: 2,
                                options: [
                                    {
                                        label: 'd', value: 1
                                    }, {
                                        label: 'e', value: 2
                                    }]
                            }]
                    },
                    { label: 'f', value: 2 }
                ]
            },
            {
                label: 'Label 2', value: 2,
                options: [
                    {
                        label: 'Sub Label 21', value: 1
                    },
                    {
                        label: 'Sub Label 2', value: 2
                    }
                ]
            },
            {
                label: 'Label 3', value: 3,
                options: [
                    {
                        label: 'Sub Label 31', value: 1
                    },
                    {
                        label: 'Sub Label 2', value: 2
                    }
                ]
            },
            {
                label: 'Label 4', value: 4,
                options: [
                    {
                        label: 'Sub Label 41', value: 1
                    },
                    {
                        label: 'Sub Label 2', value: 2
                    }
                ]
            }
        ]
    };
    

    public exampleOptions: UXInterfaces.IMenuBindingOption[] = [
        { label: 'Label 1', value: 1},
        { label: 'Label 2', value: 2},
        { label: 'Label 3', value: 3}
    ];
    public selctMenuParams: UXInterfaces.IMenuBindingParams = {
        scrollClass: 'editorArea',
        options: this.exampleOptions,
        selected: ko.observableArray([this.exampleOptions[0]])
    };

    public multiSelctMenuParams: UXInterfaces.IMenuBindingParams = {
        scrollClass: 'editorArea',
        options: this.exampleOptions,
        isMultiselect: true,
        selected: ko.observableArray([this.exampleOptions[0], this.exampleOptions[1]])
    };

    constructor(parameters:any) {
     
        // Datepicker Params
        this.myDate = ko.observable(new Date("12/01/2013"));
        this.myDate.subscribe(function (newDate) {
            console.log("Date Changed::", newDate);
        }.bind(this));

    }
   

} 

