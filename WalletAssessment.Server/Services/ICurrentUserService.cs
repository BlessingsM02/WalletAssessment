using System.Security.Claims;

namespace WalletAssessment.Server.Services
{
    public interface ICurrentUserService
    {
        public string? GetUserId();

    }
}
