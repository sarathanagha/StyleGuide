define(["require", "exports", "knockout", "text!./component.html"], function (require, exports, ko) {
    exports.template = require("text!./component.html");
    var viewModel = (function () {
        function viewModel(parameters) {
            this.simpleMenuParams = {
                scrollClass: 'editorArea',
                options: [
                    { label: 'Label 1', value: 1 },
                    { label: 'Label 2', value: 2 },
                    { label: 'Label 3', value: 3 }
                ]
            };
            this.complexMenuParams = {
                scrollClass: 'editorArea',
                options: [
                    { label: 'Label 1', value: 1, description: "description 1" },
                    { label: 'Label 2', value: 2, description: "description 2" },
                    { label: 'Label 3', value: 3, description: "description 3" }
                ]
            };
            this.dividerMenuParams = {
                scrollClass: 'editorArea',
                options: [
                    { label: 'Label 1', value: 1 },
                    "-",
                    { label: 'Label 3', value: 3 },
                    { label: 'Label 4', value: 4 }
                ]
            };
            this.headerMenuParams = {
                scrollClass: 'editorArea',
                options: [
                    { label: 'Label 1', value: 1 },
                    "Header",
                    { label: 'Label 3', value: 3 },
                    { label: 'Label 4', value: 4 }
                ]
            };
            this.disabledMenuParams = {
                scrollClass: 'editorArea',
                options: [
                    { label: 'Label 1', value: 1 },
                    { label: 'Label 2', value: 2, isDisabled: true },
                    { label: 'Label 3', value: 3, isDisabled: true },
                    { label: 'Label 4', value: 4 }
                ]
            };
            this.iconMenuParams = {
                scrollClass: 'editorArea',
                options: [
                    { label: 'Label 1', value: 1, iconPath: 'node_modules/@ms-atlas/datastudio-controls/Images/delete.svg' },
                    { label: 'Label 2', value: 2, iconPath: 'node_modules/@ms-atlas/datastudio-controls/Images/lock.svg' },
                    { label: 'Label 3', value: 3, iconPath: 'node_modules/@ms-atlas/datastudio-controls/Images/settings.svg' },
                    { label: 'Label 4', value: 4, iconPath: 'node_modules/@ms-atlas/datastudio-controls/Images/search.svg' }
                ]
            };
            this.cascadeMenuParams = {
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
            this.exampleOptions = [
                { label: 'Label 1', value: 1 },
                { label: 'Label 2', value: 2 },
                { label: 'Label 3', value: 3 }
            ];
            this.selctMenuParams = {
                scrollClass: 'editorArea',
                options: this.exampleOptions,
                selected: ko.observableArray([this.exampleOptions[0]])
            };
            this.multiSelctMenuParams = {
                scrollClass: 'editorArea',
                options: this.exampleOptions,
                isMultiselect: true,
                selected: ko.observableArray([this.exampleOptions[0], this.exampleOptions[1]])
            };
            // Datepicker Params
            this.myDate = ko.observable(new Date("12/01/2013"));
            this.myDate.subscribe(function (newDate) {
                console.log("Date Changed::", newDate);
            }.bind(this));
        }
        return viewModel;
    })();
    exports.viewModel = viewModel;
});
//# sourceMappingURL=component.js.map