/// <reference path="../References.d.ts" />

define(["views/editor/editor"], (editor) => {
    var viewModel = editor.viewModel;
    describe('Home page view model', () => {

        it('should supply a friendly message which changes when acted upon', () => {
            expect(viewModel).toBeDefined();
        })

    });
});