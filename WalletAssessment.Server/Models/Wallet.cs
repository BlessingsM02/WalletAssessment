using System.ComponentModel.DataAnnotations;

namespace WalletAssessment.Server.Models
{
    public class Wallet
    {
        [Key]
        public int  Id { get; set; }

        public string UserId { get; set; }
        public double Balace { get; set; }
        public virtual ApplicationUser User { get; set; }
    }
}
