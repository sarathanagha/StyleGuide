using System;
using System.Globalization;
using System.Linq;
using System.Text.RegularExpressions;
using System.Net.Mail;
using System.Security.Claims;
using System.Security.Principal;
using Microsoft.DataStudio.Hub.Authorization.Helpers;
using Microsoft.DataStudio.Solutions.Helpers;
using Microsoft.DataStudio.Solutions.Validators;

namespace Microsoft.DataStudio.Hub.Authorization.Runtime
{
    public class AuthenticatedUser : Contracts.IAuthenticatedUser
    {
        private readonly ClaimsIdentity mClaimsIdentity;

        public string UserPrincipalName { get; private set; }

        public string UserName { get; private set; }

        public string Domain { get; private set; }

        public Guid ObjectId { get; private set; }

        public Guid TenantId { get; private set; }

        public string DisplayName { get; private set; }

        public string FirstName { get; private set; }

        public string LastName { get; private set; }

        public string AuthenticatedBy { get; private set; }

        public string Issuer { get; private set; }

        public string Email { get; private set; }

        public Guid[] SecurityGroups { get; private set; }

        public AuthenticatedUser(IPrincipal principal)
            : this(principal.Identity)
        {
        }

        public AuthenticatedUser(IIdentity identity)
        {
            if (!identity.IsAuthenticated)
            {
                throw new ArgumentException(string.Format(CultureInfo.InvariantCulture, "User doesn't seem to be authenticated, name:{0}, authenticationType:{1}",
                    identity.Name, identity.AuthenticationType));
            }

            ClaimsIdentity claimsIdentity = identity as ClaimsIdentity;
            ThrowIf.Null(identity, "identity");

            mClaimsIdentity = claimsIdentity;

            UserPrincipalName = mClaimsIdentity.GetClaimValue(ClaimsConstants.UpnClaim) ??
                                mClaimsIdentity.GetClaimValue(ClaimsConstants.NameClaim) ?? mClaimsIdentity.GetClaimValue(ClaimsConstants.UniqueNameClaim);

            string userName = string.Empty;
            string domain = string.Empty;
            if (!IsValidUpn(UserPrincipalName, out userName, out domain))
            {
                throw new ArgumentException(string.Format(CultureInfo.InvariantCulture, "UPN {0} is not valid", UserPrincipalName));
            }
            Domain = domain;
            UserName = userName;

            Issuer = mClaimsIdentity.GetClaimValue(ClaimsConstants.IssuerClaim);

            SetObjectIdFromClaim();

            TenantId = mClaimsIdentity.GetGuidClaimValue(ClaimsConstants.TenantIdClaim);

            Email = mClaimsIdentity.GetClaimValue(ClaimsConstants.EmailClaim)
                ?? mClaimsIdentity.GetClaimValue(ClaimsConstants.EmailTokenClaim)
                ?? mClaimsIdentity.GetClaimValue(ClaimsConstants.UpnClaim);

            FirstName = mClaimsIdentity.GetClaimValue(ClaimsConstants.FirstNameClaim)
                ?? mClaimsIdentity.GetClaimValue(ClaimsConstants.FirstNameTokenClaim);

            LastName = mClaimsIdentity.GetClaimValue(ClaimsConstants.LastNameClaim)
                ?? mClaimsIdentity.GetClaimValue(ClaimsConstants.LastNameTokenClaim);

            AuthenticatedBy = mClaimsIdentity.GetClaimValue(ClaimsConstants.AuthenticatedByClaim);

            DisplayName = string.Format(CultureInfo.CurrentUICulture, "{0} {1}", FirstName ?? string.Empty,
                LastName ?? string.Empty);

            SecurityGroups = mClaimsIdentity.FindAll(ClaimsConstants.GroupsClaim).EmptyIfNull().Select(c => new Guid(c.Value)).ToArray();
        }

        private static bool IsValidUpn(string upn, out string userName, out string domain)
        {
            ThrowIf.NullOrEmpty(upn, "upn");

            userName = string.Empty;
            domain = string.Empty;

            string[] parts = upn.Split(new[] { '@' }, 3, StringSplitOptions.RemoveEmptyEntries);

            // There must be exactly one @ with non-empty strings on either side
            if (parts.Length == 2)
            {
                userName = parts[0];
                domain = parts[1];
            }
            return (parts.Length == 2);
        }

        private void SetObjectIdFromClaim()
        {
            // Note: authenticatedUser.ObjectId could be null when:
            //      authenticated with certificate and OnBehalfOf header/parameter does not contain objectId
            ObjectId = mClaimsIdentity.GetSingleGuidClaimValueFromMultipleClaims(
                ClaimsConstants.ObjectIdClaim,
                ClaimsConstants.ObjectIdClaim2,
                ClaimsConstants.ObjectIdTokenClaim);

            if (ObjectId == null || ObjectId == Guid.Empty)
            {
                throw new Exception(string.Format(CultureInfo.InvariantCulture, "Unable to determine ObjectId for user:{0}", mClaimsIdentity.Name));
            }
        }
    }
}
