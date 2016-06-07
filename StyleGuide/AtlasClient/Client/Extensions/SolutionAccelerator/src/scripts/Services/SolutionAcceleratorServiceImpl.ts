/// <reference path="SolutionAcceleratorService.ts" />

module Microsoft.DataStudio.SolutionAccelerator.Services.Impl {
    var logger = LoggerFactory.getLogger({ loggerName: "SolutionAcceleratorServiceImpl", category: "Impl" });
    var headerServerRequestId = "x-ms-request-id";
    var Managers = Microsoft.DataStudio.Managers;
    export class SolutionAcceleratorServiceImpl implements SolutionAcceleratorService {
 
        // Also local IIS test using preview2 is not working, so would need to use localhost from F5 IISExpress for now
        private _apiUrl: string;
        private authenticationManager: Microsoft.DataStudio.Managers.IAuthenticationManager;
        private configurationManager: Microsoft.DataStudio.Managers.IConfigurationManager;

        constructor() {
            this.authenticationManager = Managers.AuthenticationManager.instance;
            this._apiUrl = Managers.ConfigurationManager.instance.getApiEndpointUrl();
        }

        private static _instance: SolutionAcceleratorServiceImpl;
        public static getInstance(): SolutionAcceleratorServiceImpl {
            if (!SolutionAcceleratorServiceImpl._instance) {
                SolutionAcceleratorServiceImpl._instance = new SolutionAcceleratorServiceImpl();
            }

            return SolutionAcceleratorServiceImpl._instance;
        }


        /*
            Get the list of all solution templates for this subscription
        */
        getAllDeployedSolutions(): Promise<any[]> {
            logger.logDebug("Service API call", { methodName: "getAllDeployedSolutions" });

            return new Promise((resolve, reject) => {
                var subscriptions = (this.authenticationManager.getCurrentUser().subscriptions || []).map(value => value.subscriptionid);
                var subscriptionId: string = "";
                // We are getting the first subscription from the list of subscription to pass in as the parameter to get the access token
                // Any subscription that belongs to the same tenant has the same access token hence this works. When we have a user that belongs
                // to multiple tenant and hence will have different access token for his/her subscription that belongs to different tenant.
                // For now this should work. Let re-visit this once we have a better understanding of a multi-tenant user
                if (subscriptions.length > 0) {
                    subscriptionId = subscriptions[0];
				    this.authenticationManager.getAccessToken(subscriptionId).then((token) => {
					    var solutionsRequest: JQueryXHR = $.ajax({
						    url: this._apiUrl + 'solutions/all',
                            data: JSON.stringify(subscriptions),
						    crossDomain: true,
						    type: 'POST',
						    contentType: 'application/json',
						    headers: {
							    'Authorization': 'Bearer ' + token
						    }
					    });

					    solutionsRequest.done((data: any[]): void => {
						    resolve(data);
					    }).fail((response: XMLHttpRequest, errortype: string, error: any) => {
						    logger.logError("Error in retrieving solutions - getAllDeployedSolutions", { correlationId: response.getResponseHeader(headerServerRequestId), error: error });
                            reject(error || "Connection error");
					    });
                    });
                } else {
                    let errorMsg: string = "This user doesn't have any subscriptions";
                    logger.logWarning(errorMsg);
                    reject(errorMsg);
                }
			});
        }

        /*
            Get the provisioning status for a previously deployed solution
        */
        getDeployedSolutionStatus(solutionId: string, solutionSubscriptionId: string): Promise<any> {
            logger.logDebug("Service API call", { methodName: "getDeployedSolutionStatus" });
            return new Promise((resolve, reject) => {
                this.authenticationManager.getAccessToken(solutionSubscriptionId).then((token) => {
					var solutionsRequest: JQueryXHR = $.ajax({
						url: this._apiUrl + solutionSubscriptionId + '/solutions/' + solutionId,
						crossDomain: true,
						type: 'GET',
						contentType: 'application/json',
						headers: {
							'Authorization': 'Bearer ' + token
						}
					});

					solutionsRequest.done((data: any): void => {
						resolve(data);
					}).fail((response: XMLHttpRequest, errortype: string, error: any) => {
						logger.logError("Error in getDeployedSolutionStatus for solution: " + solutionId, { correlationId: response.getResponseHeader(headerServerRequestId), error: error });
						reject(error);
					});
				});
			});
        }

        /*
            Call to deploy a solution with given template ID
        */
        deploySolution(solutionId: string, templateId: string, subscriptionId: string, templateParams: string, resourceGroupName?: string): Promise<any[]> {
            logger.logDebug("Service API call", { methodName: "deploySolution" });
            return new Promise((resolve, reject) => {
                this.authenticationManager.getAccessToken(subscriptionId).then((token) => {
                    var groupName = (resourceGroupName) ? resourceGroupName : "";
                    var solutionRequest: JQueryXHR = $.ajax(
                        {
                            url: this._apiUrl + subscriptionId + '/solutions',
                            type: 'POST',
                            data:
                            {
                                SolutionId: solutionId,
                                TemplateId: templateId,
                                UserEmail: this.authenticationManager.getCurrentUser().email,
                                UserPuid: this.authenticationManager.getCurrentUser().puid,
                                TemplateParameters: templateParams,
                                ResourceGroupName: groupName
                            },
                            headers: {
                                'Authorization': 'Bearer ' + token
                            }
                        }
                        );

                    solutionRequest.done((data: any): void => {
                        resolve(data);
                    }).fail((response: XMLHttpRequest, errortype: string, error: any) => {
                        logger.logError("Error in deploySolution: " + solutionId, { correlationId: response.getResponseHeader(headerServerRequestId), error: error });
                        reject(JSON.parse(response.responseText).Message);
                    });
                });
            });
        }

        /*
            Call to delete a solution with given template ID
        */
        deleteSolution(solutionId: string, solutionSubscriptionId: string): Promise<any[]> {
            logger.logDebug("Service API call", { methodName: "deploySolution" });
            return new Promise((resolve, reject) => {
                this.authenticationManager.getAccessToken(solutionSubscriptionId).then((token) => {
                    var solutionRequest: JQueryXHR = $.ajax(
                        {
                            url: this._apiUrl + solutionSubscriptionId + '/solutions/' + solutionId,
                            type: 'DELETE',
                            headers: {
                                'Authorization': 'Bearer ' + token
                            }
                        }
                        );

                    solutionRequest.done((data: any): void => {
                        resolve(data);
                    }).fail((response: XMLHttpRequest, errortype: string, error: any) => {
                        logger.logError("Error in deleteSolution: " + solutionId, { correlationId: response.getResponseHeader(headerServerRequestId), error: error });
                        reject(error);
                    });
                });
            });
        }
    }
}
