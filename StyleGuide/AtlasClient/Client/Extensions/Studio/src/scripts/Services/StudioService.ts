/// <reference path="../../References.d.ts" />

import AppContext = require("../AppContext");
import BaseService = require("./BaseService");
let logger = Microsoft.DataStudio.Studio.LoggerFactory.getLogger({ loggerName: "DataStudioService", category: "Service" });
var Managers = Microsoft.DataStudio.Managers;

export class StudioService extends BaseService.BaseService
{
    private _apiUrl: string;
    private authenticationManager: Microsoft.DataStudio.Managers.IAuthenticationManager;
    private configurationManager: Microsoft.DataStudio.Managers.IConfigurationManager;

    constructor(appContext: AppContext.AppContext)
    {
        super(appContext);
        this.authenticationManager = Managers.AuthenticationManager.instance;
        this._apiUrl = Managers.ConfigurationManager.instance.getApiEndpointUrl();
    }

    /**
     * Returns a promise which will be resolved to be true if the CSM resource identified by the resourceId
     * is accessible to the user with the mentioned permissions.
     */
    public hasPermission(resourceId: string, permissions: string[]): Q.Promise<any>
    {
        // TODO paverma Replace with actual ajax call to the server. This would hit the CSM to find if the
        // user has access to the resource or not.
        // On email thread with people on AD team to find the best way.
        return Q(true);
    }

    /**
     * Gets the path to the application relative uri.
     *
     * @param uri The application relative uri.
     * @return The uri.
     */
    
    //TODO pacodel We should read this url from config. We should figure out what needs to be done for this 
    public getAppRelativeUri(location: string): string
    {
        return this._apiUrl + location;
    }

    // Use the ajaxQ method if the access to headers is not required.
    public ajax<T>(request: JQueryAjaxSettingsExtended): JQueryXHRPromise<T>
    {
        let spinner = this.spinner().on();

        let deferred = jQuery.Deferred<T>();

        var subscriptions = (this.authenticationManager.getCurrentUser().subscriptions || []).map(value => value.subscriptionid);
        var subscriptionId: string = "";
        // We are getting the first subscription from the list of subscription to pass in as the parameter to get the access token
        // Any subscription that belongs to the same tenant has the same access token hence this works. When we have a user that belongs
        // to multiple tenant and hence will have different access token for his/her subscription that belongs to different tenant.
        // For now this should work. Let re-visit this once we have a better understanding of a multi-tenant user
        if (subscriptions.length > 0)
        {
            subscriptionId = subscriptions[0];
            this.authenticationManager.getAccessToken(subscriptionId).then((token) =>
            {
                request.url = this.getAppRelativeUri(request.url);
                if (!request.data)
                {
                    request.data = {};
                }
                request.crossDomain = true;
                if (!request.headers)
                {
                    request.headers = {};
                }
                jQuery.extend(request.headers, {
                    "Authorization": "Bearer " + token
                });

                let requestId = this.addRequestId(request);

                jQuery.ajax(request).then((...args: Object[]) =>
                {
                    spinner.off();
                    deferred.resolve.apply(deferred, args);
                }, (...args: Object[]) =>
                    {
                        spinner.off();
                        let reason = <JQueryXHR>args[0];

                        let errorMessage = "Api call failed: {0}, Reason: {1}, CorrelationId: {2}".format(
                            request.url, this.getResponseInfo(reason), requestId);

                        logger.logError(errorMessage);
                        deferred.reject.apply(deferred, args);
                    });
            },
                (reason: JQueryXHR) =>
                {
                    spinner.off();
                    logger.logError("ajax request failed: {0}".format(reason.responseText));
                    deferred.reject(reason);
                });
        }
        else
        {
            let errorMsg: string = "This user doesn't have any subscriptions";
            logger.logWarning(errorMsg);
            deferred.reject(errorMsg);
        }

        return deferred.promise();
    }

    public ajaxQ<T>(request: JQueryAjaxSettings): Q.Promise<T>
    {
        let deferred = Q.defer<T>();
        this.ajax(request).then((data: T) =>
        {
            deferred.resolve(data);
        }, (jqXHR: JQueryXHR) =>
            {
                deferred.reject(jqXHR);
            });

        return deferred.promise;
    }
}
