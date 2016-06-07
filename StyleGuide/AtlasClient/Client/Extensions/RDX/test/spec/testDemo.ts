/// <reference path="../References.d.ts" />

define(["views/home/home"], (homePage) => {
    var viewModel = homePage.viewModel;
    describe('Home page view model', () => {

        it('should supply a friendly message which changes when acted upon', () => {
            expect(viewModel.numberOfPipelines).toBeDefined();
        })

    });
});