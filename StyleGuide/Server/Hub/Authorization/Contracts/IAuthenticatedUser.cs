using System;

namespace Microsoft.DataStudio.Hub.Authorization.Contracts
{
    public interface IAuthenticatedUser
    {
        string UserPrincipalName { get; }

        string UserName { get; }

        string Domain { get; }

        Guid ObjectId { get; }

        Guid TenantId { get; }

        string DisplayName { get; }

        string FirstName { get; }

        string LastName { get; }

        string AuthenticatedBy { get; }

        string Issuer { get; }

        string Email { get; }

        Guid[] SecurityGroups { get; }
    }
}
