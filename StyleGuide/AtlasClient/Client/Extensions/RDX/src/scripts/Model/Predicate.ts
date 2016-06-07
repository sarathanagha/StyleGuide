/// <reference path="../../References.d.ts" />

module Microsoft.DataStudio.Crystal.Models {
    export class Predicate {
        public predicateText: KnockoutObservable<string> = ko.observable('');

        constructor() {
        }

        // constructs an andNotExpression js object from the model
        public toJS(): Object {
            var predicateText = this.predicateText();
            if (predicateText.trim() == '') {
                predicateText = '*.*';
                this.predicateText('*.*');
            }
            var searchTerms = predicateText.split(" AND ");
            var jsObject = { and: [] };
            for (var idx in searchTerms) {
                if (searchTerms[idx].indexOf("NOT") === 0) {
                    if (!jsObject.hasOwnProperty('not'))
                        jsObject['not'] = [];
                    var notObject = this.getSearchTermObjectFromText(searchTerms[idx].substring(3));
                    jsObject['not'].push(notObject);
                } else if (searchTerms[idx].indexOf("!=") != -1) {  // not equals hack
                    if (!jsObject.hasOwnProperty('not'))
                        jsObject['not'] = [];
                    var notObject = this.getSearchTermObjectFromText(searchTerms[idx]);
                    jsObject['not'].push(notObject);
                }
                else {
                    var andObject = this.getSearchTermObjectFromText(searchTerms[idx]);
                    jsObject.and.push(andObject);
                }
            }
            if (!jsObject.and.length) {
                jsObject.and.push({ text: null, textOp: 'star' });
            }

            return jsObject;
        }

        private getSearchTermObjectFromText(searchTerm: string): Object {
            var returnObject = {};
            searchTerm = searchTerm.trim();
            var splitSearchTerm = searchTerm.split(' ');
            var indexOfMdfDot = splitSearchTerm[0].indexOf('.');
            var hasMetadataFilter = indexOfMdfDot != -1;
            if (hasMetadataFilter) {
                var splitMetadataFilter = splitSearchTerm[0].split('.');
                returnObject['metadataFilter'] = { body: [{ eventSourceName: splitMetadataFilter[0], propertyName: splitMetadataFilter[1] }] };
            }
            var textOp = 'Star';
            var searchText = '';

            // e.g. *.pointvalue > 200
            if (hasMetadataFilter && splitSearchTerm.length > 1) {
                textOp = this.getTextOp(splitSearchTerm[1]);
                if (textOp == 'any') {
                    for (var i = 2; i < splitSearchTerm.length; i++)
                        searchText += splitSearchTerm[i] + ' ';
                }
                else {
                    splitSearchTerm.shift(); splitSearchTerm.shift();
                    searchText = splitSearchTerm.join(' ');
                }
            }

            if (!hasMetadataFilter) {
                textOp = this.getTextOp(splitSearchTerm[0]);
                // e.g. not found in model store
                if (textOp == 'Star') {
                    textOp = 'phrase';
                    searchText = splitSearchTerm.join(' ');
                }
                // e.g. > 200
                else {
                    searchText = splitSearchTerm[1];
                }
            }

            returnObject['text'] = searchText ? searchText.trim() : null;
            returnObject['textOp'] = textOp;
            return returnObject;
        }

        private getTextOp(text: string): string {
            text = text.trim();
            if (text == 'LIKE') {
                return 'phrase';
            }
            if (text == 'LIKE_ANY') {
                return 'any';
            }
            switch (text[0]) {
                case '<':
                    if (text[1] == '=') {
                        return 'LessThanOrEqual';
                    } else {
                        return 'LessThan';
                    }
                case '>':
                    if (text[1] == '=') {
                        return 'GreaterThanOrEqual';
                    } else {
                        return 'GreaterThan';
                    }
                case '=':
                        return 'phrase';
                case '!':
                    if (text[1] == '=')
                        return 'phrase';
            }
            return 'Star';
        }
    }
}