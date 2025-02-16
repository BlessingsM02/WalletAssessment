using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System.ComponentModel.DataAnnotations;
using WalletAssessment.Server.Controllers;

namespace WalletAssessment.Server.Models
{
    public class Transaction
    {
        [Key]
        public int Id { get; set; }
        public double Amount { get; set; }
        public  string  TransactionType { get; set; }
        public DateTime Timestamp { get; set; }
        public string UserId { get; set; }
        public string Description { get; set; }

        //public virtual Wallet Wallet { get; set; }
    }
}
