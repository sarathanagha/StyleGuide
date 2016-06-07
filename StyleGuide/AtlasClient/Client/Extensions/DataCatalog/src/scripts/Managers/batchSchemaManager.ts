module Microsoft.DataStudio.DataCatalog.Managers {
    export class BatchSchemaManager {
        static snapshotData: Interfaces.ISchemaSnapshotData[] = [];
        static snapshot = ko.observableArray<Interfaces.IBindableSharedColumn>();
        static tagCreators: { [tag: string]: Interfaces.ITooltipInfo[]; };

        static hasChanges() {
            return BatchSchemaManager.getChanges().length > 0;
        }

        static init() {
            BatchSchemaManager.tagCreators = {};
            BatchSchemaManager.takeSnapshot();
        }

        static cancel() {
            BatchSchemaManager.init();
        }

        static getChanges(): Interfaces.IAssetSchemaChange[] {
            // Define observable dependency for tracking
            BatchSchemaManager.snapshot();
            var changes: Interfaces.IAssetSchemaChange[] = [];

            BatchSchemaManager.snapshotData.forEach(d => {
                var columnChanges: Interfaces.IAssetSchemaChange = { columnName: d.name };
                var bindableSharedColumn = Core.Utilities.arrayFirst(BatchSchemaManager.snapshot().filter(s => s.name === d.name));

                var desc = bindableSharedColumn.description();
                if (desc !== d.description) {
                    columnChanges.description = desc;
                }

                // Determine tag deltas
                var endingTagsOnAll = bindableSharedColumn.tagsOnAll().map(t => t.name);
                var endingTagsOnSome = bindableSharedColumn.tagsOnSome().map(t => t.name);

                var tagsToAdd = Core.Utilities.arrayExcept(endingTagsOnAll, d.tagsOnAll);
                var tagsToRemoveFromAll = Core.Utilities.arrayExcept(d.tagsOnAll, endingTagsOnAll);
                var tagsToRemoveFromSome = Core.Utilities.arrayExcept(d.tagsOnSome, endingTagsOnSome);
                    tagsToRemoveFromSome = Core.Utilities.arrayExcept(tagsToRemoveFromSome, tagsToAdd);
                var tagsToRemove = tagsToRemoveFromAll.concat(tagsToRemoveFromSome);

                if (tagsToAdd.length) {
                    columnChanges.tagsToAdd = tagsToAdd;
                }

                if (tagsToRemove.length) {
                    columnChanges.tagsToRemove = tagsToRemove;
                }

                if (Object.keys(columnChanges).length > 1) {
                    changes.push(columnChanges);
                }
            });

            return changes;
        }

        private static takeSnapshot() {
            BatchSchemaManager.snapshotData = this.getSnapshot();
            var bindableSharedColumns: Interfaces.IBindableSharedColumn[] = [];
            var copy = <Interfaces.ISchemaSnapshotData[]>$.extend(true, {}, { data: BatchSchemaManager.snapshotData }).data;
            copy.forEach(s => {
                var myTagsOnAllLookup = {};
                s.myTagsOnAll.forEach(t => {
                    myTagsOnAllLookup[t] = true;
                });

                var myTagsOnSomeLookup = {};
                s.myTagsOnSome.forEach(e => {
                    myTagsOnSomeLookup[e] = true;
                });

                var sorter = (a: Interfaces.IAttributeInfo, b: Interfaces.IAttributeInfo): number => {
                    var favorMine = (a: Interfaces.IAttributeInfo, b: Interfaces.IAttributeInfo) => {
                        if (a.readOnly === b.readOnly) { return 0; }
                        if (!a.readOnly) { return -1; }
                        if (!b.readOnly) { return 1; }
                        return 0;
                    };

                    var compareStrings = (a: string, b: string) => {
                        if (a > b) { return 1; }
                        if (a < b) { return -1; }
                        return 0;
                    }
                // Sort mine first and then alphabetically
                return favorMine(a, b) || compareStrings(a.name, b.name);
                };

                var tagsOnAll = s.tagsOnAll.map(t => { return { name: t, readOnly: !myTagsOnAllLookup[t], tooltips: BatchSchemaManager.tagCreators[t.toUpperCase()] || [] }; }).sort(sorter);
                var tagsOnSome = s.tagsOnSome.map((t) => { return { name: t, readOnly: !myTagsOnSomeLookup[t], tooltips: BatchSchemaManager.tagCreators[t.toUpperCase()] || [] }; }).sort(sorter);

                bindableSharedColumns.push({
                    name: s.name,
                    type: s.type,
                    description: ko.observable(s.description),
                    tagsOnAll: ko.observableArray(tagsOnAll),
                    tagsOnSome: ko.observableArray(tagsOnSome)
                });
            });
            BatchSchemaManager.snapshot(bindableSharedColumns);
        }

        private static getColumnIntersections(): Interfaces.IColumn[] {
            var columnIntersections: Interfaces.IColumn[];
            (BrowseManager.multiSelected() || []).map(a => a.schema.columns).forEach(c => {
                if (!columnIntersections) {
                    columnIntersections = c;
                } else {
                    columnIntersections = Core.Utilities.arrayIntersect(columnIntersections, c, (first, second) => first.name === second.name && first.type === second.type);
                }
            });
            return columnIntersections || [];
        }

        private static getSnapshot(): Interfaces.ISchemaSnapshotData[] {
            var snapshotData: Interfaces.ISchemaSnapshotData[] = [];
            var columns = this.getColumnIntersections();
            columns.forEach(c => {
                var descriptions: Interfaces.IBindableColumn[] = [];
                BrowseManager.multiSelected().forEach(a => {
                    var columnDescription = Core.Utilities.arrayFirst(a.schemaDescription.columnDescriptions.filter(cd => cd.columnName === c.name));
                    descriptions.push(columnDescription);
                });

                var descriptionHash = {};
                var myTagIntersections: string[];
                var myDistinctTags: string[];
                var tagIntersection: string[];
                var tagUnion: string[];

                descriptions.forEach(d => {
                    var trimmedDesc = $.trim(d.description());
                    descriptionHash[Core.Utilities.plainText(trimmedDesc)] = true;

                    d.tags().forEach((t: string) => {
                        var identifier: string = t.toUpperCase();
                        BatchSchemaManager.tagCreators[identifier] = BatchSchemaManager.tagCreators[identifier] || [];
                        (d.tagCreators[identifier] || []).forEach((tp: Interfaces.ITooltipInfo) => {
                            if (!BatchSchemaManager.tagCreators[identifier].some(a => a.email === tp.email)) {
                                BatchSchemaManager.tagCreators[identifier].push(tp);
                            }
                        });
                    });

                    // My tags
                    if (!myTagIntersections) {
                        myTagIntersections = d.tags();
                    } else {
                        myTagIntersections = Core.Utilities.arrayIntersect(myTagIntersections, d.tags());
                    }

                    if (!myDistinctTags) {
                        myDistinctTags = Core.Utilities.arrayDistinct(d.tags());
                    } else {
                        myDistinctTags = Core.Utilities.arrayDistinct(myDistinctTags.concat(d.tags()));
                    }

                    // All tags
                    var allTags = d.tags();
                    d.otherInfo.forEach(oi => {
                        allTags = allTags.concat(oi.tags);
                    });
                    if (!tagIntersection) {
                        tagIntersection = allTags;
                    } else {
                        tagIntersection = Core.Utilities.arrayIntersect(tagIntersection, allTags);
                    }

                    if (!tagUnion) {
                        tagUnion = Core.Utilities.arrayDistinct(allTags);
                    } else {
                        tagUnion = Core.Utilities.arrayDistinct(tagUnion.concat(allTags));
                    }
                });

                var commonDescription = Object.keys(descriptionHash).length === 1
                    ? Object.keys(descriptionHash)[0]
                    : "";

                var myTagsOnAll = Core.Utilities.arrayDistinct((myTagIntersections || []).map($.trim));
                var myTagsOnSome = Core.Utilities.arrayDistinct(Core.Utilities.arrayExcept((myDistinctTags || []).map($.trim), myTagsOnAll));

                var tagsOnAll = Core.Utilities.arrayDistinct((tagIntersection || []).map($.trim));
                var tagsOnSome = Core.Utilities.arrayDistinct(Core.Utilities.arrayExcept((tagUnion || []).map($.trim), tagsOnAll));

                var snapshotDatum: Interfaces.ISchemaSnapshotData = {
                    name: c.name,
                    type: c.type,
                    description: commonDescription,
                    myTagsOnAll: myTagsOnAll,
                    myTagsOnSome: myTagsOnSome,
                    tagsOnAll: tagsOnAll,
                    tagsOnSome: tagsOnSome
                };

                snapshotData.push(snapshotDatum);

            });
            return snapshotData;
        }
    }
}