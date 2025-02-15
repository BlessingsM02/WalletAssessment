using Microsoft.AspNetCore.Identity;

namespace WalletAssessment.Server.Models
{
    public class ApplicationUser : IdentityUser
    {
        public string Name { get; set; }
        public string? RefreshToken { get; set; }
        public DateTime? RefreshTokenExpiryTime { get; set; }
        public DateTime CreateAt { get; set; } = DateTime.Now;
        public virtual Wallet wallet { get; set; }
    }
}
