import ArmContracts = require("../Model/Contracts/AzureResourceManager");

// TODO paverma Confirm if permissionsToCheck is strictly string or can have a *. For now assuming it to string.
export function checkIfPermissionsMatchesRules(actionsToCheck: string[], permissionRules: ArmContracts.IPermissionRule[]): boolean {
    let parsedActionsToCheck = actionsToCheck.map((actionToCheck) => {
        return parseAction(actionToCheck);
    });
    let parsedPermissionRules = permissionRules.map((permissionRule) => {
        return {
            parsedActions: permissionRule.actions ? permissionRule.actions.map((action) => {
                return parseAction(action);
            }) : null,
            parsedNotActions: permissionRule.notActions ? permissionRule.notActions.map((notAction) => {
                return parseAction(notAction);
            }) : null
        };
    });

    let matchesAnyNotAction = parsedPermissionRules.some((parsedPermissionRule) => {
        if (parsedPermissionRule.parsedNotActions) {
            return parsedPermissionRule.parsedNotActions.some((parsedNotAction) => {
                return parsedActionsToCheck.some((parsedActionToCheck) => {
                    return checkIfActionMatchesRule(parsedActionToCheck, parsedNotAction);
                });
            });
        }
        return false;
    });
    if (matchesAnyNotAction) {
        return false;
    }

    return parsedPermissionRules.some((parsedPermissionRule) => {
        if (parsedPermissionRule.parsedActions) {
            return parsedPermissionRule.parsedActions.some((parsedAction) => {
                return parsedActionsToCheck.some((parsedActionToCheck) => {
                    return checkIfActionMatchesRule(parsedActionToCheck, parsedAction);
                });
            });
        }
        return false;
    });
}

interface IParsedPermission {
    resourceType: string;
    resourceTypeRegex: RegExp;
    verb: string;
    verbRegex: RegExp;
}

function parseAction(actionRule: string): IParsedPermission {
    actionRule = actionRule.replace("*", ".*");
    let lastOccurenceOfSlash = actionRule.lastIndexOf("/");
    let resourceType = actionRule.substring(0, lastOccurenceOfSlash) || ".*";
    resourceType = resourceType.replace(/\/\.\*$/, ".*");   // so that resourceType a/.* matches a
    let verb = actionRule.substring(lastOccurenceOfSlash + 1) || ".*";

    return {
        resourceType: resourceType,
        resourceTypeRegex: new RegExp(resourceType),
        verb: verb,
        verbRegex: new RegExp(verb)
    };
}

function checkIfActionMatchesRule(permission: IParsedPermission, actionRule: IParsedPermission): boolean {
    return actionRule.resourceTypeRegex.test(permission.resourceType) && actionRule.verbRegex.test(permission.verb);
}
