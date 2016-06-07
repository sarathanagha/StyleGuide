using System;

namespace Microsoft.DataStudio.Hub.Authorization.Helpers
{
    // https://azure.microsoft.com/en-us/documentation/articles/active-directory-token-and-claims/
    public static class ClaimsConstants
    {
        public const string UpnClaim = "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/upn";
        public const string NameClaim = "http://schemas.microsoft.com/identity/claims/Name";
        public const string UniqueNameClaim = "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name";
        public const string ObjectIdClaim = "http://schemas.microsoft.com/identity/claims/objectidentifier";
        public const string ObjectIdClaim2 = "http://schemas.microsoft.com/identity/claims/ObjectId";
        public const string TenantIdClaim = "http://schemas.microsoft.com/identity/claims/tenantid";
        public const string EmailClaim = "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress";
        public const string FirstNameClaim = "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname";
        public const string LastNameClaim = "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/surname";
        public const string AuthenticatedByClaim = "http://schemas.microsoft.com/identity/claims/AuthenticatedBy";

        public const string IssuerClaim = "iss";
        public const string ObjectIdTokenClaim = "oid";
        public const string EmailTokenClaim = "email";
        public const string FirstNameTokenClaim = "given_name";
        public const string LastNameTokenClaim = "family_name";
        public const string PuidTokenClaim = "puid";
        public const string AltsecIdTokenClaim = "altsecid";
        public const string GroupsClaim = "groups";
    }
}
