using System.ComponentModel.DataAnnotations;

namespace WalletAssessment.Server.Data.Contracts
{
    public class TransactionRequest
    {
        [Range(0.01, double.MaxValue)]
        public double Amount { get; set; }
        public string Description { get; set; }
    }
}
