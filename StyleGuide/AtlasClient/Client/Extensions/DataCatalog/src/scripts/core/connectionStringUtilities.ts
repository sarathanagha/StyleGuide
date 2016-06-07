module Microsoft.DataStudio.DataCatalog.Core {
    export class ConnectionStringUtilities {

        private static keyWords: { [key: string]: string; } = {
            "currentUser": $tokyo.user.email,
            "userName": Resx.userNameHere,
            "passwordHintText": Resx.yourPasswordHere
        }

        private static getProperty(key: string, entity: any): string {
            var keys: string[] = key.split(".");
            var value;
            var entityObject: {} = entity;
            keys.forEach(k => {
                if (entityObject[k]) {
                    entityObject = entityObject[k];
                }
                if (typeof entityObject === "string") {
                    value = entityObject;
                }
            });
            var plainText = Utilities.extractHighlightedWords([value]);
            value = plainText[0] || value;
            return value;
        }

        private static getKeyWordValue(key: string): string {
            return ConnectionStringUtilities.keyWords[key] || null;
        }

        static parse(base: string, entity: any): string {
            if (!base) { return ""; }
            var openBraces: string = null;
            var closeBraces: string = null;
            // Find two characters not in the string to use as place holders for double curly braces.
            // Doulbe curly braces are tempararily removed while single curly braces are processed.
            for (var i = 0; i < 123; i++) {
                var emptyCharacter = String.fromCharCode(i);
                var index;
                if (!openBraces) {
                    index = base.indexOf(emptyCharacter);
                    if (index === -1) {
                        openBraces = emptyCharacter;
                        base = base.replace(/{{/g, emptyCharacter);
                    }
                }
                else if (!closeBraces) {
                    index = base.indexOf(emptyCharacter);
                    if (index === -1) {
                        closeBraces = emptyCharacter;
                        base = base.replace(/}}/g, emptyCharacter);
                    }
                }
            }
            if (!openBraces || !closeBraces) {
                throw new Error("Unable to parse connection string. Connection string contains invalid characters.");
            }
            base = base.replace(/{.+?}/g, (match, num) => {
                match = match.substr(1, match.length - 2);
                var value = match;
                var keyword = ConnectionStringUtilities.getKeyWordValue(match);
                if (keyword) {
                    value = keyword;
                    // Escape any braces in the replaced value. These will be added back in after the check for stray braces.
                    value = value.replace(/{/g, openBraces);
                    value = value.replace(/}/g, closeBraces);
                }
                else {
                    var property = ConnectionStringUtilities.getProperty(match, entity);
                    if (property) {
                        value = property;
                    }
                }
                return value;
            });
            var singleOpenBraceIndex = base.indexOf("{");
            var singleCloseBraceIndex = base.indexOf("}");
            if (singleOpenBraceIndex > -1) {
                throw new Error(Core.Utilities.stringFormat("Unexpected open brace found at position {0}", singleOpenBraceIndex));
            }
            if (singleCloseBraceIndex > -1) {
                throw new Error(Core.Utilities.stringFormat("Unexpected close brace found at position {0}", singleCloseBraceIndex));
            }
            // Add escaped braces back into the connection string.
            var openRegex = new RegExp(openBraces, "g");
            var closeRegex = new RegExp(closeBraces, "g");
            base = base.replace(openRegex, "{");
            base = base.replace(closeRegex, "}");
            return base;
        }
    }
}

 