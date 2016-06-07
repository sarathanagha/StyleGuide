module Microsoft.DataStudio.DataCatalog.Models {
    export class BindablePermission implements Microsoft.DataStudio.DataCatalog.Interfaces.IBindablePermission {
        principal: Microsoft.DataStudio.DataCatalog.Interfaces.IPrincipal;
        rights = ko.observableArray<Microsoft.DataStudio.DataCatalog.Interfaces.IRight>([]);

        constructor(permission: Microsoft.DataStudio.DataCatalog.Interfaces.IPermission) {
            if (permission) {
                this.principal = permission.principal;
                this.rights(permission.rights || []);
            }
        }
    }
}