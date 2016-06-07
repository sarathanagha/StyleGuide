/// <reference path="../References.d.ts" />

// $tokyo needs to be implemented to access server side variabels as in the Views\Shared\_TokyoUser.cshtml file
var $tokyo: Microsoft.DataStudio.DataCatalog.Interfaces.IGlobalContext = {
    user: {
        ipAddress: "@Model.ClientIpAddress",
        upn: "@Model.Upn",
        objectId: "@Model.ObjectId.ToString()",
        email: "@Model.Email", //Microsoft.DataStudio.Managers.AuthenticationManager._instance.currentUser.email,
        firstName: "@Model.FirstName",
        lastName: "@Model.LastName",
        tenantUuid: "@Model.TenantUuid",
        tenantDirectory: "@Model.TenantDirectory",
        locale: "@Model.CultureInfo.Name.ToLowerInvariant()",
        armToken: "@Model.ArmToken",
        tenantFacets: ["@Model.TenantFacets.EmptyIfNull().ToString()"]
    },
    app: {
        version: "@Model.Version",
        sessionUuid: "00000-00000-00000-00000",
        authenticationSessionUuid: "@Model.AuthenticationSessionId",
        catalogApiVersionString: "@Model.CatalogApiVersionString",
        searchApiVersionString: "@Model.SearchApiVersionString"
    },
    logging: {
        level: Number.MAX_VALUE, // Log everything
        enabled: true
    },
    // TODO (stpryor): Update the publishingLink to use stage based config
    //                 This value taken from F:\Enlistments\ADC\Portal.UI\Web.config
    //                 and is used in F:\Enlistments\ADC\Portal.UI\Services\ConfigurationSettings.cs
    publishingLink: "https://tokyoclickonce.blob.core.windows.net/clickonce-int/RegistrationTool.application", //"@Model.PublishingToolLink",
    isIntEnvironment: true,
    constants: {
        requestVerificationTokenHeaderName: "@HeaderNames.RequestVerificationToken",
        armTokenHeaderName: "@HeaderNames.ArmTokenHeaderName",
        tenantDirectoryHeaderName: "@HeaderNames.TenantDirectory",
        nextPortalActivityId: "@HeaderNames.NextPortalActivityId",
        catalogResponseStatusCodeHeaderName: "@HeaderNames.CatalogResponseStatusCode",
        searchResponseStatusCodeHeaderName: "@HeaderNames.SearchResponseStatusCode",
        catalogApiVersionStringHeaderName: "@HeaderNames.CatalogApiVersionString",
        searchApiVersionStringHeaderName: "@HeaderNames.SearchApiVersionString",
        latestPortalVersionHeaderName: "@HeaderNames.PortalVersion",
        azureStandardActivityIdHeader: "@LoggingHeaderConstants.AzureStandardActivityIdHeader",
        azureStandardResponseActivityIdHeader: "@LoggingHeaderConstants.AzureStandardResponseActivityIdHeader",
        additionalSearchParametersHeaderName: "@HeaderNames.AdditionalSearchParameters"
    },
    applications: [
        {
            applicationId: "cosmos",
            protocols: ["cosmos"]
        },
        {
            applicationId: "excel",
            limit: 1000,
            protocols: ["tds", "oracle","hive", "teradata", "mysql"]
        },
        {
            applicationId: "excel",
            protocols: ["tds", "analysis-services", "oracle", "hive", "teradata", "mysql"]
        },
        {
            applicationId: "reportingservices",
            protocols: ["reporting-services"]
        },
        {
            applicationId: "browser",
            protocols: ["http", "file"]
        },
        {
            applicationId: "powerbi",
            protocols: [
                "tds", 
                "analysis-services", 
                "webhdfs", 
                "azure-blobs", 
                "mysql", 
                "oracle", 
                "sap-hana-sql"
            ]
         }
    ]
};