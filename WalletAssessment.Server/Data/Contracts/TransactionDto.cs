namespace WalletAssessment.Server.Data.Contracts
{
    public class TransactionDto
    {
        public double Amount { get; set; }
        public string TransactionType { get; set; }
        public DateTime Timestamp { get; set; }
        public string Description { get; set; }
    }
}
