export function format(target: string, ...parameters: string[]): string {
        return target.replace(/\{[0-9]\}/g, (match: string) => {
            var matchIndex = parseInt(match.replace("{", "").replace("}",""));
            if (parameters.length <= matchIndex) {
                throw new Error("Parameter with index " + matchIndex + " not found");
            }
            return parameters[matchIndex];
        });
    }    

//interface String {
//    format(target: string, ...parameters: string[] ): string;
//}

//String.prototype.format = function (target: string, ...parameters: string[]): string
//{
//    return target.replace(/\{[0-9]\}/g, (match: string) => {
//        var matchIndex = parseInt(match.replace("{", "").replace("}", ""));
//        if (parameters.length <= matchIndex) {
//            throw new Error("Parameter with index " + matchIndex + " not found");
//        }
//        return parameters[matchIndex];
//    });
//}