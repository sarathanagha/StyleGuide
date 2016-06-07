/// <reference path="../../../references.d.ts" />
module Microsoft.DataStudio.AuthHelpers {

    import TypeInfo = Microsoft.DataStudio.Diagnostics.TypeInfo;

    export function extractPuid(token: any): string {
        var parsedToken = jwt.decode(token);

        if (TypeInfo.isDefined(parsedToken.puid)) { // AAD user
            if (!TypeInfo.isString(parsedToken.puid)) {
                console.warn("Invalid PUID format: puid is present in the idToken, but it doesn't seem to be a string:", parsedToken.puid);
                return "";
            }

            var puid: string = parsedToken.puid;
            var puidRegex = /^[0-9A-Z]{16}$/;
            if (!puidRegex.test(puid)) {
                console.warn("Invalid PUID format: puid as a string is present in the idToken, but it doesn't match our regex/understanding:", puid);
            }
            return puid;
        }

        if (TypeInfo.isDefined(parsedToken.altsecid)) { // Live user
            if (!TypeInfo.isString(parsedToken.altsecid)) {
                console.warn("Invalid PUID format: altsecid is present in the idToken, but it doesn't seem to be a string:", parsedToken.altsecid);
                return "";
            }

            var altsecid: string = parsedToken.altsecid;
            var altsecidRegex = /^1:live\.com:[0-9A-Z]{16}$/;
            if (!altsecidRegex.test(altsecid)) {
                console.warn("Invalid PUID format: altsecid as a string is present in the idToken, but it doesn't match our regex/understanding:", altsecid);
                return altsecid; // let's return whatever we got..
            }

            var fields: string[] = altsecid.split(':');

            // For live.com users, the PUID seems to be conventionally represented as puid@Live.com, so let's follow the same thing
            return fields[2] + "@Live.com";
        }

        console.warn("Invalid PUID format: Neither 'puid' nor 'altsecid' seems to be present in the idToken for this user, understand better?:", parsedToken);
        return "";
    }

}