module Microsoft.DataStudio.DataCatalog.Services {

    export class ConnectService extends BaseService {

        static getConnectionTypes(dataEntity: Interfaces.IBindableDataEntity): Interfaces.IConnectApplication[] {
            var entity = dataEntity || <Interfaces.IBindableDataEntity>{};
            var dsl = entity.dsl || <Interfaces.IDataSourceLocation>{};
            var protocol = Core.Utilities.plainText(dsl.protocol || "");

            if (entity.DataSourceType === Models.DataSourceType.Container && entity.dsl.protocol !== "analysis-services") {
                return [];
            }

            if (entity.dataSource && entity.dataSource.sourceType === "Azure Data Lake Store" && entity.dsl.protocol === "webhdfs") {
                return [];
            }

            return $tokyo.applications
                .filter(a => a.protocols.some(b => b === protocol))
                .map(c => {
                var text = Core.Resx[Core.Utilities.stringFormat("{0}_{1}_{2}", c.applicationId, c.limit, protocol)] ||
                    Core.Resx[Core.Utilities.stringFormat("{0}_{1}", c.applicationId, c.limit)] ||
                    Core.Resx[Core.Utilities.stringFormat("{0}_{2}", c.applicationId, protocol)] ||
                    Core.Resx[Core.Utilities.stringFormat("{0}_", c.applicationId)];

                if (!text) {
                    logger.logWarning("no text found for connect to option", c);
                    text = c.applicationId;
                }
                return $.extend({ text: text }, c);
            });
        }

        static connect(dataEntity: Interfaces.IBindableDataEntity, data: Interfaces.IConnectApplication) {
            var dataEntityString = JSON.stringify(dataEntity);
            dataEntity = JSON.parse(Core.Utilities.plainText(dataEntityString));

            logger.logInfo(Core.Utilities.stringFormat("connect to data source executed ({0})", data.applicationId), {
                id: dataEntity.__id,
                applicationId: data.applicationId,
                limit: data.limit,
                name: dataEntity.name,
                dsl: dataEntity.dsl
            });

            if (dataEntity.dsl.protocol === "reporting-services") {
                var reportingServicesUrl = Core.Utilities.stringFormat("{0}?{1}&rs:Command=Render", dataEntity.dsl.address.server, encodeURIComponent(dataEntity.dsl.address.path));
                window.open(reportingServicesUrl, "_blank");
            } else if (dataEntity.dsl.address.url) {
                window.open(dataEntity.dsl.address.url, "_blank");
            } else if (dataEntity.dsl.address.path) {
                window.open(dataEntity.dsl.address.path, "_blank");
            } else if (data.applicationId === "ssdt") {
                var vsWebUriTemplate = "vsweb://vs/?product=Visual_Studio&encformat=UTF8&sqldbaction={0}";
                var authentication = /sql/i.test(dataEntity.dsl.authentication || "sql") ? "sql" : "integrated";
                var queryString = Core.Utilities.stringFormat("action=connect&authentication={0}&server={1}&Database={2}", authentication, dataEntity.dsl.address.server, dataEntity.dsl.address.database);
                var base64EncodedString = btoa(queryString);
                window.open(Core.Utilities.stringFormat(vsWebUriTemplate, base64EncodedString), "_self");
            } else {
                var token = $("body > input[name='__RequestVerificationToken']").val();
                var connectFormId = "connect-form";
                $("#" + connectFormId).remove();

                var form = $("<form>")
                    .attr("id", connectFormId)
                    .attr("method", "POST")
                    .attr("action", "\connect")
                    .attr("target", "_self")
                    .append(
                    $("<input type='hidden'>").attr("name", "__RequestVerificationToken").attr("value", token),
                    $("<input type='hidden'>").attr("name", "applicationId").attr("value", data.applicationId),
                    $("<input type='hidden'>").attr("name", "limitRows").attr("value", data.limit),
                    $("<input type='hidden'>").attr("name", "id").attr("value", dataEntity.__id),
                    $("<input type='hidden'>").attr("name", "tenantDirectory").attr("value", $tokyo.user.tenantDirectory)
                    )
                    .appendTo("body");

                this.ensureAuth().done(() => {
                    form.submit();
                });
            }
        }
    }
}
