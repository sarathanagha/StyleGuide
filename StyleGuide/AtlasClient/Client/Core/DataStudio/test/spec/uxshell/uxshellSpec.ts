/// <reference path="../../references.d.ts" />

define(['uxshell/uxshell'], function(ux) {
    var UXShellViewModel = ux.viewModel;
    describe("uxshell", () => {
        it(" viewmodel's module config is defined", () => {
            var instance = new UXShellViewModel();
            expect(instance.moduleConfig().name()).toBeDefined();
        });

    });
});