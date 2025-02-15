using WalletAssessment.Server.Models;

namespace WalletAssessment.Server.Services
{
    public interface ITokenService
    {
        Task<string> GenerateToken(ApplicationUser user);
        string GenerateRefreshToken();
    }
}
