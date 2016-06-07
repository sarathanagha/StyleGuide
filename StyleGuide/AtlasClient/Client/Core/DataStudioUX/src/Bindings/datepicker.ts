/// <reference path="../References.d.ts" />
/// <amd-dependency path="css!./datepicker.css" />

require(["css!datastudio.controls/Bindings/datepicker/datepicker.css"]);

module Microsoft.DataStudioUX.Knockout.Binding {

    export class BindingDatePicker {
        public init(element: HTMLElement, valueAccessor: () => any, allBindingsAccessor: () => any,
            viewModel: any, bindingContext: KnockoutBindingContext): void {
           
            <any>($(element)).datetimepicker({
                timeFormat: "hh:mm tt",
                dateFormat: 'mm-dd-yy',
                showButtonPanel: true,
                currentText: 'NOW',
                closeText: 'APPLY',
                showOtherMonths: true,
                beforeShow: <any>function () {

                }
            });

            <any>($('#ui-datepicker-div,.ui-datepicker-inline')).addClass('datepicker-wrapper');
            <any>($(element)).datepicker("setDate", new Date());

            ko.utils.registerEventHandler(element, "change", function (event) {
                (<any>valueAccessor()).myDate(<any>($(element)).datetimepicker("getDate"));
            });
            ko.utils.registerEventHandler(document.getElementsByClassName('editorArea'), "scroll", function (event) {
                <any>($(element)).datepicker("hide");
            });
            ko.utils.registerEventHandler(element, "click", function (event) {
                <any>($(element)).datepicker("show");
            });
        }


    }
    ko.bindingHandlers["datastudio-ux-BindingDatePicker"] = new BindingDatePicker();
}
