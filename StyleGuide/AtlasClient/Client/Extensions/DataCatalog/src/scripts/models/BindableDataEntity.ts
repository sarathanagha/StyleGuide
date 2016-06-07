// [TODO] raghum uncomment and fix the issue
//import SourceTypes = require("core/SourceTypes");

module Microsoft.DataStudio.DataCatalog.Models {

    export var logger = Microsoft.DataStudio.DataCatalog.LoggerFactory.getLogger({ loggerName: "ADC", category: "ADC Models" });

    export class BindableDataEntity implements Microsoft.DataStudio.DataCatalog.Interfaces.IBindableDataEntity {
        private dispose: () => void;

        public static DISPLAY_LENGTH: number = 25;

        updated: string;
        __id: string;
        __type: string;
        __creatorId: string;

        __effectiveRights = ko.observableArray<string>([]);
        __effectiveRightsLookup: { [right: string]: boolean } = {};
        __permissions = ko.observableArray<Microsoft.DataStudio.DataCatalog.Interfaces.IBindablePermission>([]);
        __roles = ko.observableArray<Microsoft.DataStudio.DataCatalog.Interfaces.IBindableRole>([]);

        DataSourceType: Microsoft.DataStudio.DataCatalog.Models.DataSourceType;

        modifiedTime: string;
        name: string;
        containerId: string;
        lastRegisteredTime: string;
        lastRegisteredBy: Microsoft.DataStudio.DataCatalog.Interfaces.IUserPrincipal;
        dataSource: Microsoft.DataStudio.DataCatalog.Interfaces.IDataSource;
        dsl: Microsoft.DataStudio.DataCatalog.Interfaces.IDataSourceLocation;
        accessInstructions: Microsoft.DataStudio.DataCatalog.Interfaces.IAccessInstruction[];
        descriptions = ko.observableArray<Microsoft.DataStudio.DataCatalog.Interfaces.IBindableDescription>([]);
        experts = ko.observableArray<Microsoft.DataStudio.DataCatalog.Interfaces.IBindableExpert>([]);
        documentation = ko.observable<Microsoft.DataStudio.DataCatalog.Interfaces.IBindableDocumentation>();
        schema: Microsoft.DataStudio.DataCatalog.Interfaces.IBindableSchema;
        schemaDescription: Microsoft.DataStudio.DataCatalog.Interfaces.IBindableSchemaDescription;
        measure: Microsoft.DataStudio.DataCatalog.Interfaces.IColumn;
        dataProfile: Microsoft.DataStudio.DataCatalog.Interfaces.IBindableDataProfile;
        columnProfileId: string;
        officeTelemetry: Microsoft.DataStudio.DataCatalog.Interfaces.IBindableOfficeTelemetry = null;
        officeTelemetryRule: Microsoft.DataStudio.DataCatalog.Interfaces.IBindableOfficeTelemetryRule = null;

        previewId: string;
        preview = ko.observable<Microsoft.DataStudio.DataCatalog.Interfaces.IPreview>();

        metadataLastUpdated = ko.observable<Date>();
        metadataLastUpdatedBy = ko.observable<string>();

        searchRelevanceInfo: Microsoft.DataStudio.DataCatalog.Interfaces.ISearchRelevanceInfo;

        pinned = ko.observable<boolean>(false);

        constructor(searchEntity: Microsoft.DataStudio.DataCatalog.Interfaces.ISearchEntity) {
            this.updated = searchEntity.updated;

            var content = searchEntity.content;
            this.__id = content.__id;
            this.__type = content.__type;
            this.__creatorId = content.__creatorId;

            this.DataSourceType = Core.Utilities.getTypeFromString(content.__type);

            // Authorization
            this.__effectiveRights(content.__effectiveRights || []);

            if (content.__permissions) {
                var bindablePermissions = content.__permissions.map(p => new BindablePermission(p));
                this.__permissions(bindablePermissions);
            }
            if (content.__roles && content.__roles.length) {
                var bindableRoles = content.__roles.map(r => new BindableRole(r));
                this.__roles(bindableRoles);
            }
            var onRightsChanged = (newValue: string[]) => {
                this.__effectiveRightsLookup = {};
                (newValue || []).forEach(r => {
                    this.__effectiveRightsLookup[r] = true;
                });
            };

            onRightsChanged(this.__effectiveRights());
            var subscription = this.__effectiveRights.subscribe(onRightsChanged);

            this.dispose = () => {
                subscription.dispose();
            };

            this.modifiedTime = Core.Utilities.convertDateTimeStringToISOString(content.modifiedTime);
            this.name = content.name || (content.measure || <any>{}).name || "";
            this.containerId = content.containerId;
            this.dataSource = content.dataSource;
            this.dsl = content.dsl;
            this.measure = content.measure;
            this.lastRegisteredTime = content.lastRegisteredTime;
            this.lastRegisteredBy = content.lastRegisteredBy;
            this.previewId = this.getPreviewId(content);

            $.each(content.experts || [], (i, expert: Microsoft.DataStudio.DataCatalog.Interfaces.IExpert) => {
                this.experts.push(new BindableExpert(expert));
            });
            this.ensureMyExpert();

            $.each(content.descriptions || [], (i, desc: Microsoft.DataStudio.DataCatalog.Interfaces.IDescription) => {
                this.descriptions.push(new BindableDescription(this.allExperts, desc));
            });
            this.ensureMyDescription(content.descriptions);

            this.accessInstructions = content.accessInstructions || [];
            this.ensureMyAccessInstruction();

            var documentation = content.documentation;
            if ($.isArray(content.documentation)) {
                // Backwards compatible for documentation as array
                documentation = Core.Utilities.arrayFirst((<Microsoft.DataStudio.DataCatalog.Interfaces.IDocumentation[]><any>content.documentation) || []);
            }
            this.documentation(new BindableDocumentation(documentation));

            var schema = BindableSchema.getSchemaForDisplay(content.schemas);
            this.schema = new BindableSchema(schema);

            // Merge schemaDescription from the location under schemas and root
            var allSchemaDescriptions = (schema.schemaDescriptions || []).concat(content.schemaDescriptions || []);
            var mergedSchemaDescriptions = BindableSchemaDescription.mergeSchemaDescriptions(allSchemaDescriptions);
            var myBindableSchemaDescription = BindableSchemaDescription.getMyBindableSchemaDescription(mergedSchemaDescriptions, schema.columns, this.allExperts);
            this.schemaDescription = myBindableSchemaDescription;

            var minDate = new Date(0);
            var maxDateInfo = BindableDataEntity.findMaxDate(searchEntity, { date: minDate, by: "" });
            if (maxDateInfo.date > minDate) {
                this.metadataLastUpdated(maxDateInfo.date);
                this.metadataLastUpdatedBy(maxDateInfo.by);
            }

            this.searchRelevanceInfo = searchEntity.searchRelevanceInfo;

            // Data Profile
            if (searchEntity.content.tableDataProfiles && searchEntity.content.tableDataProfiles.length) {
                var tableProfiles = searchEntity.content.tableDataProfiles;
                var tableProfile: Microsoft.DataStudio.DataCatalog.Interfaces.IDataProfile = Core.Utilities.getLatestModifiedAsset(tableProfiles);
                this.dataProfile = {
                    tableName: this.name,
                    schema: "",
                    numberOfRows: tableProfile.numberOfRows,
                    size: tableProfile.size,
                    rowDataLastUpdated: tableProfile.dataModifiedTime || "",
                    schemaLastModified: tableProfile.schemaModifiedTime || "",
                    columns: []
                }
            }
            this.columnProfileId = this.getColumnProfileId(searchEntity.content);

            Services.UserProfileService.getPins().done(pins => {
                var self = pins.pins.filter(p => { return p.assetId === this.__id });
                this.pinned(self.length > 0);
            });

            if (searchEntity.content.officeTelemetrys && searchEntity.content.officeTelemetrys.length) {
                this.officeTelemetry = new BindableOfficeTelemetry(<Microsoft.DataStudio.DataCatalog.Interfaces.IOfficeTelemetry>Core.Utilities.getLatestModifiedAsset(searchEntity.content.officeTelemetrys));
            }

            if (searchEntity.content.officeTelemetryRules && searchEntity.content.officeTelemetryRules.length) {
                this.officeTelemetryRule = new BindableOfficeTelemetryRule(<Microsoft.DataStudio.DataCatalog.Interfaces.IOfficeTelemetryRule>Core.Utilities.getLatestModifiedAsset(searchEntity.content.officeTelemetryRules));
            }
        }

        setColumnProfiles(columnProfile: Microsoft.DataStudio.DataCatalog.Interfaces.IColumnProfileArray) {
            var columnDataArray: Microsoft.DataStudio.DataCatalog.Interfaces.IBindableColumnProfile[] = [];
            (columnProfile.columns || []).forEach((columnData: Microsoft.DataStudio.DataCatalog.Interfaces.IColumnProfile) => {
                var stdev: string = "";
                if ((<Object>columnData).hasOwnProperty("stdev")) {
                    stdev = columnData.stdev.toString(10);
                }
                var avg: string = "";
                if ((<Object>columnData).hasOwnProperty("avg")) {
                    avg = columnData.avg;
                }
                var bindableColumnProfile: Microsoft.DataStudio.DataCatalog.Interfaces.IBindableColumnProfile = {
                    name: columnData.columnName,
                    type: columnData.type,
                    distinct: columnData.distinctCount || 0,
                    nullcount: columnData.nullCount || 0,
                    min: columnData.min || "",
                    max: columnData.max || "",
                    avg: avg,
                    stdev: stdev
                };
                columnDataArray.push(bindableColumnProfile);
            });
            if (this.dataProfile) {
                this.dataProfile.columns = columnDataArray;
            }
        }

        private ensureMyAccessInstruction() {
            var hasMyAccessInstruction = this.accessInstructions.some(ai => ai.__creatorId === $tokyo.user.email);
            if (!hasMyAccessInstruction) {
                this.accessInstructions.push({
                    __id: null,
                    __creatorId: $tokyo.user.email,
                    content: "",
                    modifiedTime: new Date().toISOString(),
                    mimeType: "text/html"
                });
            }
        }

        private ensureMyExpert() {
            var hasMyExpert = this.experts().some(e => e.__creatorId === $tokyo.user.email);
            if (!hasMyExpert) {
                var myExpert = new BindableExpert();
                this.experts.push(myExpert);
            }
        }

        private ensureMyDescription(allDescriptions: Microsoft.DataStudio.DataCatalog.Interfaces.IDescription[]) {
            // Find the most recent friendlyName (last one wins)
            var mostRecentFriendlyName = "";
            var mostRecentDate = new Date(0);

            $.each(allDescriptions || [], (i, desc: Microsoft.DataStudio.DataCatalog.Interfaces.IDescription) => {
                var modifiedTime = new Date(desc.modifiedTime);
                if (modifiedTime > mostRecentDate) {
                    mostRecentDate = modifiedTime;
                    mostRecentFriendlyName = desc.friendlyName;
                }
            });

            var myDesc = Core.Utilities.arrayFirst(this.getDescriptionsByEmails([$tokyo.user.email]));
            if (!myDesc) {
                myDesc = new BindableDescription(this.allExperts);
                this.descriptions.push(myDesc);
            }
            myDesc.friendlyName(mostRecentFriendlyName);
        }

        private static findMaxDate(object, maxSoFar: { date: Date; by: string }): { date: Date; by: string } {
            if ($.isPlainObject(object)) {
                if (object && /@/.test(object.__creatorId) && object.modifiedTime) {
                    var isoUtcDate = Core.Utilities.convertDateTimeStringToISOString(object.modifiedTime);
                    var currentModifiedTime = new Date(isoUtcDate);
                    if (currentModifiedTime > maxSoFar.date) {
                        maxSoFar.date = currentModifiedTime;
                        maxSoFar.by = object.__creatorId;
                    }
                }

                $.each(object, (key, value) => {
                    if ($.isPlainObject(value)) {
                        maxSoFar = BindableDataEntity.findMaxDate(value, maxSoFar);
                    }
                    if ($.isArray(value)) {
                        $.each(value, (i, j) => {
                            maxSoFar = BindableDataEntity.findMaxDate(j, maxSoFar);
                        });
                    }
                });
            }
            return maxSoFar;
        }

        private getDescriptionsByEmails(emails: string[], predicate?: (desc: Microsoft.DataStudio.DataCatalog.Interfaces.IBindableDescription) => boolean): Microsoft.DataStudio.DataCatalog.Interfaces.IBindableDescription[] {
            predicate = predicate || (() => { return true; });
            var matches: Microsoft.DataStudio.DataCatalog.Interfaces.IBindableDescription[] = [];

            $.each(emails, (i, email) => {
                $.each(this.descriptions(), (j, desc) => {
                    if (email && desc.__creatorId === email && predicate(desc)) {
                        matches.push(desc);
                        return false;
                    }
                });
            });

            return matches;
        }

        private getColumnProfileId(content: Microsoft.DataStudio.DataCatalog.Interfaces.IDataEntity): string {
            var profileAsset = Core.Utilities.getLatestModifiedAsset(content.columnsDataProfileLinks) || Core.Utilities.getLatestModifiedAsset(content.columnsDataProfiles);
            var profileId = profileAsset ? profileAsset.__id : null;
            return profileId;
        }

        private getPreviewId(content: Microsoft.DataStudio.DataCatalog.Interfaces.IDataEntity): string {
            var previewAsset = Core.Utilities.getLatestModifiedAsset(content.previewLinks) || Core.Utilities.getLatestModifiedAsset(content.previews);
            var previewId = previewAsset ? previewAsset.__id : null;
            return previewId;
        }

        allExperts = ko.pureComputed<string[]>((): string[]=> {
            var allExperts: string[] = [];
            var sorter = (a: Microsoft.DataStudio.DataCatalog.Interfaces.IBindableExpert, b: Microsoft.DataStudio.DataCatalog.Interfaces.IBindableExpert): number => {
                var favorMe = (a: string, b: string) => {
                    if (a === b) { return 0; }
                    if (a === $tokyo.user.email) { return -1; }
                    if (b === $tokyo.user.email) { return 1; }
                    return 0;
                };

                var compareStrings = (a: string, b: string) => {
                    if (a > b) { return 1; }
                    if (a < b) { return -1; }
                    return 0;
                }
                // Sort mine first and then alphabetically
                return favorMe(a.__creatorId, b.__creatorId) || compareStrings(a.__creatorId, b.__creatorId);
            };

            this.experts().sort(sorter).forEach(e => {
                allExperts = allExperts.concat(e.experts());
            });
            return Core.Utilities.arrayDistinct(allExperts);

        }, this);

        firstExpertDisplay = ko.pureComputed<string>((): string => {
            var email: string = Core.Utilities.arrayFirst(this.allExperts()) || "";
            var searchWords: string[] = Core.Utilities.extractHighlightedWords(email);
            var baseEmail: string = Core.Utilities.plainText(email);
            var maxLength: number;
            var ending: string;
            var baseLength: number = BindableDataEntity.DISPLAY_LENGTH;
            if (this.allExperts().length === 1) {
                maxLength = baseLength - 3;
                ending = "...";
            }
            else {
                maxLength = baseLength;
                ending = "";
            }
            if (baseEmail.length > maxLength) {
                baseEmail = baseEmail.substring(0, maxLength);
                baseEmail += ending;
            }
            email = Core.Utilities.applyHighlighting(searchWords, baseEmail);
            return email;
        }, this);

        hasDocumentation(): boolean {
            return true;
        }

        hasPreviewLink(): boolean {
            return this.hasSchema();
        }

        hasPreviewData(): boolean {
            return !!$.trim(this.previewId);
        }

        hasSchema(): boolean {
            return true;
            // [TODO] raghum uncomment and fix the issue
            // return (this.schema && (this.schema.columns || []).length > 0) || (this.dataSource &&
            //     SourceTypes.supportsSchema(this.dataSource.sourceType, this.dataSource.objectType));
        }

        hasDataProfile() {
            var hasProfile: boolean = false;
            if (this.dataProfile) {
                hasProfile = true;
            }
            return hasProfile;
        }

        hasTelemetry() {
            return (this.officeTelemetry !== null || this.officeTelemetryRule !== null);
        }

        hasUpdateRight = ko.pureComputed(() => {
            return !!this.__effectiveRights().filter(r => r === "Update").length;
        });

        hasDeleteRight = ko.pureComputed(() => {
            return !!this.__effectiveRights().filter(r => r === "Delete").length;
        });

        hasTakeOwnershipRight = ko.pureComputed(() => {
            return !!this.__effectiveRights().filter(r => r === "TakeOwnership").length;
        });

        hasChangeOwnershipRight = ko.pureComputed(() => {
            return !!this.__effectiveRights().filter(r => r === "ChangeOwnership").length;
        });

        hasChangeVisibilityRight = ko.pureComputed(() => {
            return !!this.__effectiveRights().filter(r => r === "ChangeVisibility").length;
        });

        hasAuthorizationManagement = ko.pureComputed(() => {
            return !!this.__effectiveRights().filter(r => r === "TakeOwnership" || r === "ChangeOwnership" || r === "ChangeVisibility").length;
        });

        displayDescription = ko.pureComputed((): string => {
            if (this.descriptions().length > 0) {
                var ensureDesc = (desc) => { return desc && desc.description && !!$.trim(desc.description()); };
                // Use experts, or mine, or first
                var descObject = Core.Utilities.arrayFirst(this.getDescriptionsByEmails(this.allExperts(), ensureDesc)) ||
                    Core.Utilities.arrayFirst(this.getDescriptionsByEmails([$tokyo.user.email], ensureDesc)) ||
                    this.descriptions()[0];

                var description = descObject.description() || "";

                if (!description) {
                    // Ugh, we still haven't found a viable description,
                    // so let's get the first one defined.
                    $.each(this.descriptions(), (i, desc) => {
                        if (ensureDesc(desc)) {
                            description = desc.description();
                            return false;
                        }
                    });
                }

                return description;
            }
            return "";
        });

        displayName = ko.pureComputed((): string => {
            // var myDescription = Core.Utilities.arrayFirst(this.getDescriptionsByEmails([$tokyo.user.email]));
            // var name = myDescription.friendlyName() || this.name;
            // return name;
            return this.name;
        });

        displayTags = ko.pureComputed(() => {
            var tagSummary = [];
            var tagHash = {};
            // Use mine, experts, others
            var myDescription = Core.Utilities.arrayFirst(this.getDescriptionsByEmails([$tokyo.user.email]));
            $.each(myDescription.tags(), (i, tag) => {
                tag = $.trim(tag);
                if (tag && !tagHash[tag.toUpperCase()]) {
                    tagHash[tag.toUpperCase()] = true;
                    tagSummary.push(tag);
                }
            });

            // Experts
            var expertDescriptions = this.getDescriptionsByEmails(this.allExperts());
            if (expertDescriptions && expertDescriptions.length) {
                $.each(expertDescriptions, (i, expertDescription) => {
                    $.each(expertDescription.tags(), (j, tag) => {
                        tag = $.trim(tag);
                        if (tag && !tagHash[tag.toUpperCase()]) {
                            tagHash[tag.toUpperCase()] = true;
                            tagSummary.push(tag);
                        }
                    });
                });
            }

            // Others
            $.each(this.descriptions() || [], (i, other: Microsoft.DataStudio.DataCatalog.Interfaces.IBindableDescription) => {
                $.each(other.tags() || [], (j, tag: string) => {
                    tag = $.trim(tag);
                    if (tag && !tagHash[tag.toUpperCase()]) {
                        tagHash[tag.toUpperCase()] = true;
                        tagSummary.push(tag);
                    }
                });
            });
            return tagSummary.slice(0, 8);
        });

        getMostRecentAccessInstruction(): Microsoft.DataStudio.DataCatalog.Interfaces.IAccessInstruction {
            var currDate = new Date(0);
            var accessInstruction: Microsoft.DataStudio.DataCatalog.Interfaces.IAccessInstruction;

            // Find most recent description object
            (this.accessInstructions || []).forEach((ai: Microsoft.DataStudio.DataCatalog.Interfaces.IAccessInstruction) => {
                var isoUtcDate = Core.Utilities.convertDateTimeStringToISOString(ai.modifiedTime);
                var currentModifiedTime = new Date(isoUtcDate);
                if (currentModifiedTime > currDate && $.trim(ai.content)) {
                    currDate = currentModifiedTime;
                    accessInstruction = ai;
                }
            });

            return {
                __id: accessInstruction ? accessInstruction.__id : "",
                __creatorId: accessInstruction ? accessInstruction.__creatorId : $tokyo.user.email,
                content: accessInstruction ? accessInstruction.content : "",
                modifiedTime: accessInstruction ? accessInstruction.modifiedTime : new Date().toISOString(),
                mimeType: accessInstruction ? accessInstruction.mimeType : ""
            };
        }

        getContainerName(): string {
            var containerTypeName = "";
            switch (Core.Utilities.plainText(this.dataSource.sourceType).toLowerCase()) {
                case "sql server":
                case "sql data warehouse":
                case "oracle database":
                case "hive":
                case "teradata":
                case "mysql":
                case "db2":
                case "postgresql":
                    containerTypeName = Core.Resx.database;
                    break;
                case "sql server analysis services":
                case "sql server analysis services multidimensional":
                case "sql server analysis services tabular":
                    containerTypeName = Core.Resx.model; break;
                case "azure storage":
                    containerTypeName = Core.Resx.container; break;
                case "sql server reporting services":
                    containerTypeName = Core.Resx.folder; break;
                case "cosmos":
                    containerTypeName = Core.Resx.virtualCluster; break;
                case "azure data lake store":
                    containerTypeName = Core.Resx.datalake; break;
                case "hadoop distributed file system":
                    containerTypeName = Core.Resx.cluster; break;
                case "sap hana":
                    containerTypeName = Core.Resx.package; break;
                case "odata":
                    containerTypeName = Core.Resx.objecttype_entitycontainer; break;
                case "http":
                    containerTypeName = Core.Resx.objecttype_site; break;
            }
            return containerTypeName;
        }

        pinEntity = () => {
            this.pinned(true);

            logger.logInfo("Pin Asset", { assetId: this.__id });
            Services.UserProfileService.getPins().done(pins => {
                // Make sure this item isn't already in the array before adding it to the front.
                var pinItems = pins.pins.filter(p => { return p.assetId !== this.__id });
                var created = new Date().toISOString();
                var entityPin: Microsoft.DataStudio.DataCatalog.Interfaces.IPin = {
                    id: Core.Utilities.createID(),
                    name: Core.Utilities.plainText(this.name),
                    assetId: this.__id,
                    createdDate: created,
                    lastUsedDate: created
                }
                pinItems.unshift(entityPin);
                pins.pins = pinItems;
                Services.UserProfileService.setPins(pins);
            });
        }

        unpinEntity = () => {
            this.pinned(false);

            logger.logInfo("Unpin Asset", { assetId: this.__id });
            Services.UserProfileService.getPins().done(pins => {
                var pinItems = pins.pins.filter(p => { return p.assetId !== this.__id });
                pins.pins = pinItems;
                Services.UserProfileService.setPins(pins);
            });
        }
    }
}
