module Microsoft.DataStudio.DataCatalog.Models {
    export class BindableRole implements Microsoft.DataStudio.DataCatalog.Interfaces.IBindableRole {
        role = "";
        members = ko.observableArray<Microsoft.DataStudio.DataCatalog.Interfaces.IPrincipal>([]);

        constructor(roleResult: Microsoft.DataStudio.DataCatalog.Interfaces.IRole) {
            if (roleResult) {
                this.role = roleResult.role || "";
                this.members(roleResult.members || []);
            }
        }
    }
}