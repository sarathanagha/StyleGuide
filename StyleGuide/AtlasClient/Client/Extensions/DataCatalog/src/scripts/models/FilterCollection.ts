module Microsoft.DataStudio.DataCatalog.Models {
    export class FilterCollection implements Interfaces.IFilterCollection {
        groups = <Interfaces.IFilterGroup[]>[];

        constructor(facetResponse?: Interfaces.IFacetResponseItem[]) {
            $.each(facetResponse || [], (i, group: Interfaces.IFacetResponseItem) => {
                var filterGroup = new FilterGroup(group);
                if (filterGroup.items.length) {
                    this.groups.push(filterGroup);
                }
            });
        }

        createItem(groupType: string, term: string, count = 0): Interfaces.IFilterItem {
            return new FilterItem({ term: term, count: count }, groupType);
        }

        findItem(groupType: string, term: string) {
            var item = null;
            var group = this.findGroup(groupType);
            if (group) {
                item = group.findItem(term);
            }
            return item;
        }

        findGroup(groupType: string): Interfaces.IFilterGroup {
            var match: Interfaces.IFilterGroup;
            if (groupType) {
                $.each(this.groups, (i, group: Interfaces.IFilterGroup) => {
                    if (group.groupType === groupType) {
                        match = group;
                        return false;
                    }
                });
            }
            return match;
        }

        replaceGroup(group: Interfaces.IFilterGroup) {
            if (group) {
                var groupType = group.groupType;
                var indexOfGroup = -1;
                for (var i = 0; i < this.groups.length; i++) {
                    if (this.groups[i].groupType === groupType) {
                        indexOfGroup = i;
                        break;
                    }
                }
                if (indexOfGroup >= 0) {
                    this.groups[indexOfGroup] = group;
                }
            }
        }

        totalItems() {
            var total = 0;

            $.each(this.groups, (i, group: Interfaces.IFilterGroup) => {
                total += (group.items || []).length;
            });

            return total;
        }
    }

    export class FilterGroup implements Interfaces.IFilterGroup {
        label: string;
        groupType: string;
        items = <Interfaces.IFilterItem[]>[];

        constructor(group: Interfaces.IFacetResponseItem) {
            this.groupType = group.displayLabel;
            this.label = Core.Resx[group.displayLabel];
            $.each(group.terms || [], (i, termObj: Interfaces.IFacetTerm) => {
                this.items.push(new FilterItem(termObj, group.displayLabel));
            });
        }

        findItem(term: string): Interfaces.IFilterItem {
            var match: Interfaces.IFilterItem;

            $.each(this.items, (i, item: Interfaces.IFilterItem) => {
                if (item.term === term) {
                    match = item;
                    return false;
                }
            });

            return match;
        }
    }

    export class FilterItem implements Interfaces.IFilterItem {
        groupType: string;
        term: string;
        count: number;

        constructor(termObj: Interfaces.IFacetTerm, groupType: string) {
            this.groupType = groupType;
            this.term = termObj.term;
            this.count = termObj.count;
        }
    }
}