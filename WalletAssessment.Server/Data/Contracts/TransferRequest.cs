using System.ComponentModel.DataAnnotations;

namespace WalletAssessment.Server.Data.Contracts
{
    public class TransferRequest : TransactionRequest
    {
        [Required]
        [EmailAddress]
        public string RecipientEmail { get; set; }
    }
}
