module Microsoft.DataStudio.DataCatalog.Core {
    export class Constants {
        static KeyCodes = {
            BACKSPACE: 8,
            TAB: 9,
            ESCAPE: 27,
            DELETE: 46,
            ENTER: 13,
            SPACEBAR: 32,
            A: 65,
            END: 35,
            LEFT_ARROW: 37,
            UP_ARROW: 38,
            RIGHT_ARROW: 39,
            DOWN_ARROW: 40,
            ZER0: 48,
            NINE: 57,
            NUMPAD_0: 96,
            NUMPAD_9: 105
        };
        static HttpStatusCodes = {
            OK: 200,
            CREATED: 201,
            ACCEPTED: 202,
            NOCONTENT: 204,
            BADREQUEST: 400,
            UNAUTHORIZED: 401,
            FORBIDDEN: 403,
            NOTFOUND: 404,
            CONFLICT: 409,
            REQUESTENTITYTOOLARGE: 413,
            INTERNALSERVERERROR: 500,
            SERVICEUNAVAILABLE: 503
        };
        static Highlighting = {
            OPEN_TAG: "<span class='tokyo-highlight'>",
            CLOSE_TAG: "</span>"
        };
        static Users = {
            NOBODY: "00000000-0000-0000-0000-000000000403",
            EVERYONE: "00000000-0000-0000-0000-000000000201" 
        };
        static HttpRegex = /https?:\S*[a-z?&=#0-9/]/gi;
        static EmailRegex = /\b[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}\b/gi;    

        static ManualEntryID = "PortalUI.Manual.Entry";

        static svgPath = 'datastudio-datacatalog/images/';

        static svgPaths = {
            chevronDown: Constants.svgPath + 'chevron-down.svg'
        };
    }
}