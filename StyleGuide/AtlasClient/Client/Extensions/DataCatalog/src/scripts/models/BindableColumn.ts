module Microsoft.DataStudio.DataCatalog.Models {
    export class BindableColumn implements Microsoft.DataStudio.DataCatalog.Interfaces.IBindableColumn {
        private dispose: () => void;
        experts: KnockoutComputed<string[]>;
        columnName: string;
        tags = ko.observableArray<string>([]);
        description = ko.observable<string>();
        plainDescription: KnockoutObservable<string>;
        descExpanded: KnockoutObservable<boolean>;

        otherInfo: Microsoft.DataStudio.DataCatalog.Interfaces.IBindableOtherColumnInfo[] = [];
        tagAttributes = ko.observableArray<Microsoft.DataStudio.DataCatalog.Interfaces.IAttributeInfo>([]);
    
        //#region indicator observables
        isSettingTags = ko.observable(false);
        successUpdatingTags = ko.observable(false);

        isChangingDesc = ko.observable(false);
        isSettingDesc = ko.observable(false);
        successUpdatingDesc = ko.observable(false);
        //#endregion
    
        public tagCreators: { [tag: string]: Microsoft.DataStudio.DataCatalog.Interfaces.ITooltipInfo[]; };

        constructor(experts: KnockoutComputed<string[]>, columnDesc: Microsoft.DataStudio.DataCatalog.Interfaces.IColumnDescription) {
            this.tagCreators = {};
            this.experts = experts;
            this.columnName = columnDesc.columnName;
            this.tags(columnDesc.tags || []);
            this.description(columnDesc.description);

            var safe = Core.Utilities.removeScriptTags(this.description());
            var stripped = Core.Utilities.removeHtmlTags(safe);
            this.plainDescription = ko.observable(stripped);

            this.otherInfo = [];
            this.descExpanded = ko.observable(false);

            this.setTagAttributes();
            var subscription = this.tags.subscribe(() => {
                this.setTagAttributes();
            });

            var descSubscription = this.description.subscribe(newDesc => {
                var safe = Core.Utilities.removeScriptTags(newDesc);
                var stripped = Core.Utilities.removeHtmlTags(safe);
                this.plainDescription(stripped);
            });

            var plainSubscription = this.plainDescription.subscribe(newDesc => {
                this.description(newDesc);
            });

            this.dispose = () => {
                subscription.dispose();
                descSubscription.dispose();
                plainSubscription.dispose();
            };
        }

        addOtherInfo(creatorId: string, modifiedTime: string, columnDescription: Microsoft.DataStudio.DataCatalog.Interfaces.IColumnDescription) {
            this.otherInfo.push({
                __creatorId: creatorId,
                modifiedTime: modifiedTime,
                tags: columnDescription.tags || [],
                description: columnDescription.description || ""
            });
            Core.Utilities.arrayDistinct((columnDescription.tags || []).map($.trim)).forEach((t: string) => {
                var identifier = t.toUpperCase();
                this.tagCreators[identifier] = this.tagCreators[identifier] || [];
                if (!this.tagCreators[identifier].some(tp => tp.email === creatorId)) {
                    this.tagCreators[identifier].push({ email: creatorId });
                }
            });
            this.setTagAttributes();
        }

        private setTagAttributes() {
            var sorter = (a: Microsoft.DataStudio.DataCatalog.Interfaces.IAttributeInfo, b: Microsoft.DataStudio.DataCatalog.Interfaces.IAttributeInfo): number => {
                var favorMine = (a: Microsoft.DataStudio.DataCatalog.Interfaces.IAttributeInfo, b: Microsoft.DataStudio.DataCatalog.Interfaces.IAttributeInfo) => {
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
            var myTagsLookup = {};
            this.tags().forEach(tag => {
                myTagsLookup[tag.toUpperCase()] = true;
                this.tagCreators[tag.toUpperCase()] = this.tagCreators[tag.toUpperCase()] || [];
                if (!this.tagCreators[tag.toUpperCase()].some(tp => tp.email === $tokyo.user.email)) {
                    this.tagCreators[tag.toUpperCase()].push({ email: $tokyo.user.email });
                }
            });

            var otherTags = this.otherInfo.map(o => <string[]>o.tags).reduce((a, b) => {
                return a.concat(b);
            }, []);

            this.tagAttributes(Core.Utilities.arrayDistinct(this.tags().concat(otherTags)).map(t => {
                return { name: t, readOnly: !myTagsLookup[t.toUpperCase()], tooltips: this.tagCreators[t.toUpperCase()] || [] };
            }).sort(sorter));
        }

        otherDescriptions = ko.pureComputed<Microsoft.DataStudio.DataCatalog.Interfaces.IBindableDescription[]>(() => {
            var others = this.getOtherDescriptions((desc) => { return !!$.trim(desc.description); });
            return others.slice(0, this.descExpanded()
                ? others.length
                : Math.min(1, others.length));
        });

        private getOtherDescriptions(predicate: (desc: Microsoft.DataStudio.DataCatalog.Interfaces.IBindableOtherColumnInfo) => boolean): Microsoft.DataStudio.DataCatalog.Interfaces.IBindableDescription[] {
            var others: Microsoft.DataStudio.DataCatalog.Interfaces.IBindableDescription[] = [];

            var translate = (otherInfo: Microsoft.DataStudio.DataCatalog.Interfaces.IBindableOtherColumnInfo) => {
                return new BindableDescription(this.experts, {
                    __id: "",
                    __creatorId: otherInfo.__creatorId,
                    friendlyName: "",
                    tags: otherInfo.tags,
                    description: otherInfo.description,
                    modifiedTime: otherInfo.modifiedTime
                });
            };
    
            // Find the experts if they exists
            $.each(this.otherInfo, (i, other: Microsoft.DataStudio.DataCatalog.Interfaces.IBindableOtherColumnInfo) => {
                if (this.experts().some(e => e === other.__creatorId) && other.description && predicate(other)) {
                    others.push(translate(other));
                }
            });
    
            // Add the rest
            $.each(this.otherInfo, (i, other: Microsoft.DataStudio.DataCatalog.Interfaces.IBindableOtherColumnInfo) => {
                if (this.experts().every(e => e !== other.__creatorId) && other.description && predicate(other)) {
                    others.push(translate(other));
                }
            });

            return others;
        }

        expandText = ko.pureComputed<string>(() => {
            var others = this.getOtherDescriptions((desc) => { return !!$.trim(desc.description); });
            return this.descExpanded() ? Core.Utilities.stringFormat("- {0}", Core.Resx.seeLess) : Core.Utilities.stringFormat("+ {0} ({1})", Core.Resx.seeMore, others.length - 1);
        });

        expandable = ko.pureComputed<boolean>(() => {
            return this.getOtherDescriptions((desc) => { return !!$.trim(desc.description); }).length > 1;
        });

        onSeeMore() {
            this.descExpanded(!this.descExpanded());
        }
    }
}
