using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Security.Claims;

namespace Microsoft.DataStudio.Hub.Authorization.Helpers
{
    public static class ClaimsHelper
    {
        public static Claim GetClaim(this ClaimsIdentity identity, string claimType)
        {
            return identity.Claims.FirstOrDefault((c) => c.Type.Equals(claimType, StringComparison.OrdinalIgnoreCase));
        }

        public static string GetClaimValue(this ClaimsIdentity identity, string claimType)
        {
            string value = null;
            Claim claim = identity.GetClaim(claimType);
            if (claim != null)
            {
                value = claim.Value;
            }
            return value;
        }

        public static Guid GetGuidClaimValue(this ClaimsIdentity identity, string claimType)
        {
            Guid guidValue = Guid.Empty;
            string claim = identity.GetClaimValue(claimType);
            Guid.TryParse(claim, out guidValue);
            return guidValue;
        }

        public static Guid GetSingleGuidClaimValueFromMultipleClaims(this ClaimsIdentity identity, params string[] claimTypes)
        {
            var guidClaims = new HashSet<Guid>();
            foreach (var claimType in claimTypes)
            {
                guidClaims.Add(identity.GetGuidClaimValue(claimType));
            }
            guidClaims.Remove(Guid.Empty);
            if (guidClaims.Count > 1)
            {
                throw new ArgumentException(string.Format(CultureInfo.InvariantCulture, "Conflicting claims for objectId: {0}", string.Join(",", guidClaims)));
            }

            return guidClaims.SingleOrDefault();
        }
    }
}
